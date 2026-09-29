import { useEffect, useMemo, useState } from "react";
import { ClipboardList, Download, RotateCcw, SearchX, Trash2 } from "lucide-react";
import PageHeader from "../../components/admin/PageHeader";
import Button from "../../components/Button";
import ConfirmModal from "../../components/ConfirmModal";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import { SelectInput, TextInput } from "../../components/FormControls";
import { TableSkeleton } from "../../components/Loading";
import useFetch from "../../hooks/useFetch";
import usePageMeta from "../../hooks/usePageMeta";
import { useToast } from "../../context/ToastContext";
import { supabase } from "../../lib/supabase";
import { downloadCsv, toCsv } from "../../utils/csv";
import { formatDateTime, toLocalDateKey } from "../../utils/format";

const PAGE_SIZE = 15;

// Supabase returns at most 1000 rows per request, so we read in pages of 1000.
async function fetchAllRegistrations() {
  const pageSize = 1000;
  let from = 0;
  let all = [];
  for (;;) {
    const { data, error } = await supabase
      .from("registrations")
      .select("id, event_id, name, email, college_year, phone, created_at, events(title)")
      .order("created_at", { ascending: false })
      .order("id")
      .range(from, from + pageSize - 1);
    if (error) return { data: null, error };
    all = all.concat(data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return { data: all, error: null };
}

async function loadPage() {
  const [registrations, events] = await Promise.all([
    fetchAllRegistrations(),
    supabase.from("events").select("id, title").order("date", { ascending: false }),
  ]);
  const error = registrations.error || events.error;
  if (error) return { data: null, error };
  return { data: { registrations: registrations.data, events: events.data }, error: null };
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name", label: "Name (A to Z)" },
];

const CSV_COLUMNS = [
  { header: "Name", value: (r) => r.name },
  { header: "Email", value: (r) => r.email },
  { header: "College/Year", value: (r) => r.college_year },
  { header: "Phone", value: (r) => r.phone },
  { header: "Event", value: (r) => r.events?.title || "" },
  { header: "Registration Date", value: (r) => formatDateTime(r.created_at) },
];

const NO_FILTERS = { search: "", eventId: "", college: "", from: "", to: "", sort: "newest" };

export default function Registrations() {
  usePageMeta("Registrations | CodeChef ABESEC");
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(loadPage, []);

  const [filters, setFilters] = useState(NO_FILTERS);
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const setFilter = (name, value) => setFilters((previous) => ({ ...previous, [name]: value }));

  const registrations = data?.registrations;

  // Unique "College / Year" values for the filter dropdown
  const collegeOptions = useMemo(() => {
    const values = new Set((registrations || []).map((r) => r.college_year.trim()));
    return [{ value: "", label: "All colleges / years" }, ...[...values].sort().map((v) => ({ value: v, label: v }))];
  }, [registrations]);

  const eventOptions = useMemo(
    () => [{ value: "", label: "All events" }, ...(data?.events || []).map((e) => ({ value: e.id, label: e.title }))],
    [data]
  );

  const filtered = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    const phoneTerm = filters.search.replace(/[\s+-]/g, "");

    const matches = (registrations || []).filter((r) => {
      if (term && !(r.name.toLowerCase().includes(term) || r.email.toLowerCase().includes(term) || r.phone.includes(phoneTerm)))
        return false;
      if (filters.eventId && r.event_id !== filters.eventId) return false;
      if (filters.college && r.college_year.trim() !== filters.college) return false;
      const day = toLocalDateKey(r.created_at);
      if (filters.from && day < filters.from) return false;
      if (filters.to && day > filters.to) return false;
      return true;
    });

    if (filters.sort === "oldest") matches.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    else if (filters.sort === "name") matches.sort((a, b) => a.name.localeCompare(b.name));
    else matches.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return matches;
  }, [registrations, filters]);

  // Back to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const hasFilters = JSON.stringify(filters) !== JSON.stringify(NO_FILTERS);

  function handleExport() {
    // Exports everything that matches the current filters (not just this page)
    downloadCsv("codechef-abesec-registrations.csv", toCsv(filtered, CSV_COLUMNS));
    toast.success(`Exported ${filtered.length} registration${filtered.length === 1 ? "" : "s"}`);
  }

  async function confirmDelete() {
    setDeleting(true);
    const { data: removed, error: deleteError } = await supabase.from("registrations").delete().eq("id", toDelete.id).select("id");
    setDeleting(false);
    if (deleteError || !removed || removed.length === 0) {
      console.error("Delete failed:", deleteError);
      toast.error("Something went wrong. Please try again.");
      return;
    }
    toast.success("Registration deleted");
    setToDelete(null);
    reload();
  }

  return (
    <>
      <PageHeader
        title="Registrations"
        description="Everyone who has registered for your events."
        actions={
          <Button variant="secondary" onClick={handleExport} disabled={loading || filtered.length === 0}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Export CSV
          </Button>
        }
      />

      {/* Filters */}
      <div className="mb-6 space-y-3 rounded-2xl border border-ink-700 bg-ink-900 p-4">
        <SearchBar id="reg-search" label="Search registrations" value={filters.search} onChange={(v) => setFilter("search", v)} placeholder="Search by name, email or phone" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <SelectInput id="reg-event" label="Event" value={filters.eventId} onChange={(e) => setFilter("eventId", e.target.value)} options={eventOptions} />
          <SelectInput id="reg-college" label="College / Year" value={filters.college} onChange={(e) => setFilter("college", e.target.value)} options={collegeOptions} />
          <SelectInput id="reg-sort" label="Sort by" value={filters.sort} onChange={(e) => setFilter("sort", e.target.value)} options={SORT_OPTIONS} />
          <TextInput id="reg-from" type="date" label="Registered from" value={filters.from} max={filters.to || undefined} onChange={(e) => setFilter("from", e.target.value)} />
          <TextInput id="reg-to" type="date" label="Registered until" value={filters.to} min={filters.from || undefined} onChange={(e) => setFilter("to", e.target.value)} />
          <div className="flex items-end">
            <Button variant="ghost" onClick={() => setFilters(NO_FILTERS)} disabled={!hasFilters}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Clear filters
            </Button>
          </div>
        </div>
      </div>

      {loading && !data && <TableSkeleton rows={8} />}
      {error && <ErrorState title="Unable to load registrations." message="Please try again." onRetry={reload} />}

      {!loading && !error && registrations.length === 0 && (
        <EmptyState icon={ClipboardList} title="No registrations yet." message="Registrations will appear here once students sign up." />
      )}
      {!error && registrations && registrations.length > 0 && filtered.length === 0 && (
        <EmptyState icon={SearchX} title="No registrations match your filters." message="Try changing your search or filters." action={<Button variant="secondary" onClick={() => setFilters(NO_FILTERS)}>Clear filters</Button>} />
      )}

      {!error && filtered.length > 0 && (
        <>
          <p className="mb-3 text-sm text-ink-300" aria-live="polite">
            {filtered.length} registration{filtered.length === 1 ? "" : "s"}
          </p>

          {/* Desktop table: scrolls inside its own box, header stays visible */}
          <div className="hidden max-h-[36rem] overflow-auto rounded-2xl border border-ink-700 bg-ink-900 md:block">
            <table className="w-full min-w-[52rem] text-left text-sm">
              <thead className="sticky top-0 z-10 bg-ink-800 text-ink-300">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Name</th>
                  <th scope="col" className="px-4 py-3 font-medium">Email</th>
                  <th scope="col" className="px-4 py-3 font-medium">College / Year</th>
                  <th scope="col" className="px-4 py-3 font-medium">Phone</th>
                  <th scope="col" className="px-4 py-3 font-medium">Event</th>
                  <th scope="col" className="px-4 py-3 font-medium">Registered</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-700">
                {pageRows.map((r) => (
                  <tr key={r.id} className="hover:bg-ink-800/50">
                    <td className="px-4 py-3 font-semibold text-ink-100">{r.name}</td>
                    <td className="max-w-[14rem] truncate px-4 py-3 text-ink-300">{r.email}</td>
                    <td className="px-4 py-3 text-ink-300">{r.college_year}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-300">{r.phone}</td>
                    <td className="max-w-[12rem] truncate px-4 py-3 text-ink-300">{r.events?.title || "Deleted event"}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-300">{formatDateTime(r.created_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" className="hover:text-red-300" onClick={() => setToDelete(r)} aria-label={`Delete registration for ${r.name}`}>
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="space-y-3 md:hidden">
            {pageRows.map((r) => (
              <li key={r.id} className="rounded-2xl border border-ink-700 bg-ink-900 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-ink-100">{r.name}</p>
                    <p className="break-all text-sm text-ink-300">{r.email}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="shrink-0 hover:text-red-300" onClick={() => setToDelete(r)} aria-label={`Delete registration for ${r.name}`}>
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
                <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                  <dt className="text-ink-500">Phone</dt><dd className="text-ink-100">{r.phone}</dd>
                  <dt className="text-ink-500">College</dt><dd className="text-ink-100">{r.college_year}</dd>
                  <dt className="text-ink-500">Event</dt><dd className="text-ink-100">{r.events?.title || "Deleted event"}</dd>
                  <dt className="text-ink-500">Date</dt><dd className="text-ink-100">{formatDateTime(r.created_at)}</dd>
                </dl>
              </li>
            ))}
          </ul>

          <Pagination page={currentPage} pageCount={pageCount} onChange={setPage} />
        </>
      )}

      <ConfirmModal open={Boolean(toDelete)} title="Delete registration?" loading={deleting} onConfirm={confirmDelete} onCancel={() => setToDelete(null)}>
        <p>Remove the registration for:</p>
        <p className="mt-2 font-bold text-ink-100">{toDelete?.name}</p>
        <p className="mt-1 break-all">{toDelete?.email}</p>
        <p className="mt-3">This action cannot be undone.</p>
      </ConfirmModal>
    </>
  );
}
