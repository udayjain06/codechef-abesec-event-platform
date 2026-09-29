import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin } from "lucide-react";
import EventImage from "./EventImage";
import { CategoryBadge, StatusBadge } from "./Badges";
import Button from "./Button";
import { getEventStatus } from "../utils/eventStatus";
import { formatDate, formatTimeRange } from "../utils/format";

export default function EventCard({ event }) {
  const status = getEventStatus(event);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-ink-700 bg-ink-900 transition duration-200 hover:-translate-y-1 hover:border-ember-500/50 motion-reduce:transform-none">
      <div className="aspect-[16/9] overflow-hidden">
        <EventImage event={event} className="transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={event.category} />
          <StatusBadge status={status} />
        </div>

        <h3 className="mt-3 text-xl font-bold leading-snug text-ink-100">
          <Link to={`/events/${event.id}`} className="rounded hover:text-ember-300">
            {event.title}
          </Link>
        </h3>

        <ul className="mt-3 space-y-1.5 text-sm text-ink-300">
          <li className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0 text-ember-400" aria-hidden="true" />
            <span>{formatDate(event.date)}</span>
          </li>
          <li className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-ember-400" aria-hidden="true" />
            <span>{formatTimeRange(event.start_time, event.end_time)}</span>
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-ember-400" aria-hidden="true" />
            <span className="min-w-0 truncate">{event.venue || "Venue to be announced"}</span>
          </li>
        </ul>

        <p className="mt-3 line-clamp-2 text-sm text-ink-300">{event.description}</p>

        <div className="mt-auto pt-5">
          <Button to={`/events/${event.id}`} variant="secondary" className="w-full">
            View Event
          </Button>
        </div>
      </div>
    </article>
  );
}
