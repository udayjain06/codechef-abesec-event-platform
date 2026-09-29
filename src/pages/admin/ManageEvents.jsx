import { useMemo, useState } from "react";
import { CalendarX, Eye, Pencil, Plus, SearchX, Trash2 } from "lucide-react";
import PageHeader from "../../components/admin/PageHeader";
import Button from "../../components/Button";
import ConfirmModal from "../../components/ConfirmModal";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import SearchBar from "../../components/SearchBar";
import { TableSkeleton } from "../../components/Loading";
import { CategoryBadge, StatusBadge } from "../../components/Badges";
import useFetch from "../../hooks/useFetch";
import usePageMeta from "../../hooks/usePageMeta";
import { useToast } from "../../context/ToastContext";
import { supabase } from "../../lib/supabase";
import { getEventStatus } from "../../utils/eventStatus";
import { formatDate } from "../../utils/format";

export default function ManageEvents() {
  usePageMeta("Manage events | CodeChef ABESEC");
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [toDelete, setToDelete] = useState(null); // the event awaiting confirmation
  const [deleting, setDeleting] = useState(false);

  // registrations(count) returns how many registrations each event has
  const { data, loading, error, reload } = useFetch(
    () =>
      supabase
        .from("events")
        .select("id, title, category, date, start_time, end_time, venue, registration_deadline, registrations(count)")
        .order("date", { ascending: false }),
    []
  );

  const events = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (data || []).filter((e) => !term || e.title.toLowerCase().includes(term));
  }, [data, search]);

  async function confirmDelete() {
    setDeleting(true);
    // .select("id") tells us whether a row was really deleted (RLS blocks silently)
    const { data: removed, error: deleteError } = await supabase.from("events").delete().eq("id", toDelete.id).select("id");
    setDeleting(false);

    if (deleteError || !removed || removed.length === 0) {
      console.error("Delete failed:", deleteError);
      toast.error("Something went wrong. Please try again.");
      return;
    }
    toast.success("Event deleted successfully");
    setToDelete(null);
    reload();
  }

  const countOf = (event) => event.registrations?.[0]?.count ?? 0;

  return (
    <>
      <PageHeader
        title="Events"
        description="Create, edit and remove events."
        actions={
          <Button to="/admin/events/new">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create Event
          </Button>
        }
      />

      <div className="mb-5 max-w-md">
        <SearchBar id="admin-event-search" label="Search events by name" value={search} onChange={setSearch} placeholder="Search events by name" />
      </div>

      {loading && !data && <TableSkeleton />}
      {error && <ErrorState title="Unable to load events." message="Please try again." onRetry={reload} />}

      {!loading && !error && (data || []).length === 0 && (
        <EmptyState icon={CalendarX} title="No events yet" message="Create your first event to get started." action={<Button to="/admin/events/new">Create Event</Button>} />
      )}
      {!error && data && data.length > 0 && events.length === 0 && (
        <EmptyState icon={SearchX} title="No events match your search." message="Try a different name." />
      )}

      {!error && events.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-2xl border border-ink-700 bg-ink-900 md:block">
            <table className="w-full min-w-[46rem] text-left text-sm">
              <thead className="border-b border-ink-700 text-ink-300">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Event</th>
                  <th scope="col" className="px-4 py-3 font-medium">Category</th>
                  <th scope="col" className="px-4 py-3 font-medium">Date</th>
                  <th scope="col" className="px-4 py-3 font-medium">Venue</th>
                  <th scope="col" className="px-4 py-3 font-medium">Registered</th>
                  <th scope="col" className="px-4 py-3 font-medium">Status</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-700">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-ink-800/50">
                    <td className="max-w-[16rem] px-4 py-3 font-semibold text-ink-100"><span className="line-clamp-2">{event.title}</span></td>
                    <td className="px-4 py-3"><CategoryBadge category={event.category} /></td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-300">{formatDate(event.date)}</td>
                    <td className="max-w-[10rem] truncate px-4 py-3 text-ink-300">{event.venue || "-"}</td>
                    <td className="px-4 py-3 text-ink-100">{countOf(event)}</td>
                    <td className="px-4 py-3"><StatusBadge status={getEventStatus(event)} /></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button to={`/events/${event.id}`} variant="ghost" size="sm" aria-label={`View ${event.title}`}><Eye className="h-4 w-4" aria-hidden="true" /></Button>
                        <Button to={`/admin/events/${event.id}/edit`} variant="ghost" size="sm" aria-label={`Edit ${event.title}`}><Pencil className="h-4 w-4" aria-hidden="true" /></Button>
                        <Button variant="ghost" size="sm" className="hover:text-red-300" onClick={() => setToDelete(event)} aria-label={`Delete ${event.title}`}><Trash2 className="h-4 w-4" aria-hidden="true" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="space-y-3 md:hidden">
            {events.map((event) => (
              <li key={event.id} className="rounded-2xl border border-ink-700 bg-ink-900 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <CategoryBadge category={event.category} />
                  <StatusBadge status={getEventStatus(event)} />
                </div>
                <h2 className="mt-2 text-base font-bold text-ink-100">{event.title}</h2>
                <p className="mt-1 text-sm text-ink-300">{formatDate(event.date)} &middot; {event.venue || "No venue"}</p>
                <p className="text-sm text-ink-300">{countOf(event)} registered</p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Button to={`/events/${event.id}`} variant="secondary" size="sm">View</Button>
                  <Button to={`/admin/events/${event.id}/edit`} variant="secondary" size="sm">Edit</Button>
                  <Button variant="secondary" size="sm" className="text-red-300" onClick={() => setToDelete(event)}>Delete</Button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <ConfirmModal open={Boolean(toDelete)} title="Delete event?" confirmLabel="Delete" loading={deleting} onConfirm={confirmDelete} onCancel={() => setToDelete(null)}>
        <p>Are you sure you want to delete:</p>
        <p className="mt-2 font-bold text-ink-100">{toDelete?.title}</p>
        <p className="mt-3">
          This also deletes {toDelete ? countOf(toDelete) : 0} registration(s) for this event. This action cannot be undone.
        </p>
      </ConfirmModal>
    </>
  );
}
