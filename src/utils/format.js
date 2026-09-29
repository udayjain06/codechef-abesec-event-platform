// Small helpers to display dates and times the same way everywhere.

export function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const d = new Date();
  d.setHours(Number(h), Number(m), 0, 0);
  return d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
}

export function formatTimeRange(start, end) {
  if (start && end) return `${formatTime(start)} - ${formatTime(end)}`;
  if (start) return formatTime(start);
  return "Time to be announced";
}

export function formatDateTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// ISO timestamp -> value for <input type="datetime-local"> (browser local time)
export function toDateTimeLocal(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ISO timestamp -> "YYYY-MM-DD" in local time (used for date filters)
export function toLocalDateKey(iso) {
  return toDateTimeLocal(iso).slice(0, 10);
}

// "YYYY-MM-DD" for today +/- some days (local time)
export function dateStringFromToday(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return toDateTimeLocal(d.toISOString()).slice(0, 10);
}
