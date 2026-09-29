import { Link } from "react-router-dom";
import { CalendarCheck, CalendarDays, ClipboardList, Plus } from "lucide-react";
import PageHeader from "../../components/admin/PageHeader";
import Button from "../../components/Button";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import { StatusBadge } from "../../components/Badges";
import { Spinner } from "../../components/Loading";
import useFetch from "../../hooks/useFetch";
import { supabase } from "../../lib/supabase";
import { getEventStatus } from "../../utils/eventStatus";
import { formatDate, formatDateTime } from "../../utils/format";

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-ink-700 bg-ink-900 p-5">
      <div className="flex items-center gap-3 text-ink-300">
        <Icon className="h-5 w-5 text-ember-400" aria-hidden="true" />
        <span className="text-sm">{label}</span>
      </div>
      <p className="mt-3 font-display text-4xl font-extrabold text-ink-100">{value}</p>
    </div>
  );
}

// Fetch everything the dashboard needs in parallel
async function loadDashboard() {
  const [events, recent, total] = await Promise.all([
    supabase
      .from("events")
      .select("id, title, category, date, start_time, end_time, venue, registration_deadline, registrations(count)")
      .order("date", { ascending: true }),
    supabase
      .from("registrations")
      .select("id, name, email, college_year, created_at, events(title)")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase.from("registrations").select("id", { count: "exact", head: true }),
  ]);
  const error = events.error || recent.error || total.error;
  if (error) return { data: null, error };
  return { data: { events: events.data, recent: recent.data, totalRegistrations: total.count ?? 0 }, error: null };
}

export default function Dashboard() {
  const { data, loading, error, reload } = useFetch(loadDashboard, []);

  const header = (
    <PageHeader
      title="Dashboard"
      description="A quick look at your events and registrations."
      actions={
        <Button to="/admin/events/new">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Create event
        </Button>
      }
    />
  );

  if (loading && !data)
    return (
      <>
        {header}
        <div role="status" className="flex items-center gap-3 py-16 text-ink-300">
          <Spinner className="h-6 w-6 text-ember-400" /> Loading dashboard...
        </div>
      </>
    );

  if (error)
    return (
      <>
        {header}
        <ErrorState title="Unable to load the dashboard." message="Please try again." onRetry={reload} />
      </>
    );

  const upcoming = data.events.filter((e) => getEventStatus(e) !== "completed");
  const openRegistrations = data.events.filter((e) => getEventStatus(e) === "open").length;

  return (
    <>
      {header}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={CalendarDays} label="Total events" value={data.events.length} />
        <StatCard icon={CalendarCheck} label="Upcoming events" value={upcoming.length} />
        <StatCard icon={ClipboardList} label="Total registrations" value={data.totalRegistrations} />
        <StatCard icon={CalendarCheck} label="Open registrations" value={openRegistrations} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="upcoming-heading" className="rounded-2xl border border-ink-700 bg-ink-900 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="upcoming-heading" className="text-lg font-bold text-ink-100">Upcoming events</h2>
            <Link to="/admin/events" className="rounded text-sm font-semibold text-ember-400 hover:text-ember-300">View all</Link>
          </div>
          {upcoming.length === 0 ? (
            <EmptyState title="No upcoming events" message="Create an event to see it here." action={<Button to="/admin/events/new" variant="secondary">Create event</Button>} />
          ) : (
            <ul className="divide-y divide-ink-700">
              {upcoming.slice(0, 5).map((event) => (
                <li key={event.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <Link to={`/admin/events/${event.id}/edit`} className="block truncate rounded font-semibold text-ink-100 hover:text-ember-300">{event.title}</Link>
                    <p className="text-sm text-ink-300">
                      {formatDate(event.date)} &middot; {event.registrations?.[0]?.count ?? 0} registered
                    </p>
                  </div>
                  <StatusBadge status={getEventStatus(event)} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="recent-heading" className="rounded-2xl border border-ink-700 bg-ink-900 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="recent-heading" className="text-lg font-bold text-ink-100">Recent registrations</h2>
            <Link to="/admin/registrations" className="rounded text-sm font-semibold text-ember-400 hover:text-ember-300">View all</Link>
          </div>
          {data.recent.length === 0 ? (
            <EmptyState icon={ClipboardList} title="No registrations yet." message="Registrations will show up here." />
          ) : (
            <ul className="divide-y divide-ink-700">
              {data.recent.map((r) => (
                <li key={r.id} className="py-3">
                  <p className="truncate font-semibold text-ink-100">{r.name}</p>
                  <p className="truncate text-sm text-ink-300">{r.events?.title || "Deleted event"}</p>
                  <p className="text-xs text-ink-500">{formatDateTime(r.created_at)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
