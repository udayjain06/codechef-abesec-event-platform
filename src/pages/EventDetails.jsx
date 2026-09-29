import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, CalendarPlus, Clock, Hourglass, MapPin, SearchX, User } from "lucide-react";
import EventImage from "../components/EventImage";
import { CategoryBadge, StatusBadge } from "../components/Badges";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import { LoadingState } from "../components/Loading";
import useFetch from "../hooks/useFetch";
import usePageMeta from "../hooks/usePageMeta";
import { loadPublicEvent } from "../lib/publicEvents";
import { getEventStatus } from "../utils/eventStatus";
import { formatDate, formatDateTime, formatTimeRange } from "../utils/format";
import { googleCalendarUrl } from "../utils/calendar";
import { isUuid } from "../utils/uuid";

function MetaItem({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ember-500/10 text-ember-400">
        <Icon className="h-4.5 w-4.5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs text-ink-300">{label}</dt>
        <dd className="text-sm font-semibold text-ink-100">{children}</dd>
      </div>
    </div>
  );
}

export default function EventDetails() {
  const { id } = useParams();

  const { data: event, loading, error, reload } = useFetch(
    () =>
      isUuid(id)
        ? loadPublicEvent(id)
        : Promise.resolve({ data: null, error: null }), // not a valid id -> "not found"
    [id]
  );

  usePageMeta(
    event ? `${event.title} | CodeChef ABESEC` : "Event | CodeChef ABESEC",
    event ? (event.description || "").slice(0, 155) : undefined
  );

  if (loading) return <LoadingState label="Loading event..." />;

  if (error)
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <ErrorState title="Unable to load this event." message="Please try again." onRetry={reload} />
      </div>
    );

  if (!event)
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          icon={SearchX}
          title="Event not found."
          message="This event may have been removed or the link is incorrect."
          action={<Button to="/events">Browse events</Button>}
        />
      </div>
    );

  const status = getEventStatus(event);
  const rules = (event.rules || "").split("\n").map((line) => line.trim()).filter(Boolean);

  return (
    <article className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Link to="/events" className="mb-6 inline-flex items-center gap-2 rounded text-sm font-medium text-ink-300 hover:text-ember-300">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All events
      </Link>

      <div className="aspect-[16/8] overflow-hidden rounded-3xl border border-ink-700">
        <EventImage event={event} priority />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={event.category} />
            <StatusBadge status={status} />
          </div>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-ink-100 sm:text-5xl">{event.title}</h1>

          <dl className="mt-8 grid gap-5 rounded-2xl border border-ink-700 bg-ink-900 p-5 sm:grid-cols-2">
            <MetaItem icon={Calendar} label="Date">{formatDate(event.date)}</MetaItem>
            <MetaItem icon={Clock} label="Time">{formatTimeRange(event.start_time, event.end_time)}</MetaItem>
            <MetaItem icon={MapPin} label="Venue">{event.venue || "To be announced"}</MetaItem>
            <MetaItem icon={Hourglass} label="Registration deadline">
              {event.registration_deadline ? formatDateTime(event.registration_deadline) : "Until the event starts"}
            </MetaItem>
            <MetaItem icon={User} label="Organizer">CodeChef ABESEC Chapter</MetaItem>
          </dl>

          <section className="mt-10" aria-labelledby="about-event">
            <h2 id="about-event" className="text-2xl font-bold text-ink-100">About this event</h2>
            <p className="mt-3 whitespace-pre-line text-ink-300">{event.description}</p>
          </section>

          {event.eligibility && (
            <section className="mt-10" aria-labelledby="eligibility">
              <h2 id="eligibility" className="text-2xl font-bold text-ink-100">Who can join</h2>
              <p className="mt-3 whitespace-pre-line text-ink-300">{event.eligibility}</p>
            </section>
          )}

          {rules.length > 0 && (
            <section className="mt-10" aria-labelledby="rules">
              <h2 id="rules" className="text-2xl font-bold text-ink-100">Rules</h2>
              <ul className="mt-3 space-y-2 text-ink-300">
                {rules.map((rule, index) => (
                  <li key={index} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ember-500" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Registration box stays visible while scrolling on desktop */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-ink-600 bg-ink-900 p-5">
            <h2 className="text-lg font-bold text-ink-100">Registration</h2>
            <div className="mt-2"><StatusBadge status={status} /></div>

            <div className="mt-5">
              {status === "open" && (
                <Button to={`/register/${event.id}`} size="lg" className="w-full">
                  Register Now
                </Button>
              )}
              {status === "closed" && (
                <Button size="lg" className="w-full" variant="secondary" disabled>
                  Registration Closed
                </Button>
              )}
              {status === "completed" && (
                <Button size="lg" className="w-full" variant="secondary" disabled>
                  Event Completed
                </Button>
              )}
            </div>

            {status !== "completed" && (
              <Button
                href={googleCalendarUrl(event)}
                target="_blank"
                rel="noopener noreferrer"
                variant="ghost"
                className="mt-3 w-full"
              >
                <CalendarPlus className="h-4 w-4" aria-hidden="true" />
                Add to Google Calendar
                <span className="sr-only"> (opens in a new tab)</span>
              </Button>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}
