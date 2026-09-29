import { Calendar, Clock, MapPin } from "lucide-react";
import EventImage from "../EventImage";
import { CategoryBadge, StatusBadge } from "../Badges";
import Button from "../Button";
import { getEventStatus } from "../../utils/eventStatus";
import { formatDate, formatTimeRange } from "../../utils/format";

export default function FeaturedEvent({ event }) {
  const status = getEventStatus(event);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20" aria-labelledby="featured-heading">
      <h2 id="featured-heading" className="mb-8 text-3xl font-bold text-ink-100 sm:text-4xl">
        Featured event
      </h2>

      <article className="grid overflow-hidden rounded-3xl border border-ember-500/30 bg-ink-900 lg:grid-cols-2">
        <div className="aspect-[16/10] lg:aspect-auto lg:min-h-[22rem]">
          <EventImage event={event} priority />
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={event.category} />
            <StatusBadge status={status} />
          </div>

          <h3 className="mt-4 text-3xl font-extrabold leading-tight text-ink-100 sm:text-4xl">{event.title}</h3>

          <ul className="mt-5 space-y-2 text-ink-300">
            <li className="flex items-center gap-2.5">
              <Calendar className="h-5 w-5 shrink-0 text-ember-400" aria-hidden="true" />
              {formatDate(event.date)}
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="h-5 w-5 shrink-0 text-ember-400" aria-hidden="true" />
              {formatTimeRange(event.start_time, event.end_time)}
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="h-5 w-5 shrink-0 text-ember-400" aria-hidden="true" />
              {event.venue || "Venue to be announced"}
            </li>
          </ul>

          <p className="mt-5 line-clamp-3 text-ink-300">{event.description}</p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {status === "open" ? (
              <Button to={`/register/${event.id}`} size="lg">
                Register Now
              </Button>
            ) : (
              <Button to={`/events/${event.id}`} size="lg">
                View Details
              </Button>
            )}
            {status === "open" && (
              <Button to={`/events/${event.id}`} variant="secondary" size="lg">
                View Details
              </Button>
            )}
          </div>
        </div>
      </article>
    </section>
  );
}
