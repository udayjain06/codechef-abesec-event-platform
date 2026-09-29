// CSV export runs entirely in the browser. No backend endpoint is needed.

function escapeCell(value) {
  let text = value === null || value === undefined ? "" : String(value);
  // Stop spreadsheet apps from running text like "=SUM(...)" as a formula
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  // Wrap in quotes when the value contains a comma, quote or line break
  if (/[",\r\n]/.test(text)) text = `"${text.replace(/"/g, '""')}"`;
  return text;
}

// columns: [{ header: "Name", value: (row) => row.name }, ...]
export function toCsv(rows, columns) {
  const header = columns.map((c) => escapeCell(c.header)).join(",");
  const lines = rows.map((row) => columns.map((c) => escapeCell(c.value(row))).join(","));
  return [header, ...lines].join("\r\n");
}

export function downloadCsv(filename, csvText) {
  // The BOM (\uFEFF) makes Excel read the file as UTF-8
  const blob = new Blob(["\uFEFF", csvText], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
