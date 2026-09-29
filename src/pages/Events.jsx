import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchX, CalendarX } from "lucide-react";
import EventCard from "../components/EventCard";
import FilterBar from "../components/FilterBar";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import Button from "../components/Button";
import { EventGridSkeleton } from "../components/Loading";
import useFetch from "../hooks/useFetch";
import usePageMeta from "../hooks/usePageMeta";
import { loadPublicEvents } from "../lib/publicEvents";
import { CATEGORIES } from "../data/categories";
import { isUpcoming } from "../utils/eventStatus";

const PAGE_SIZE = 9;
const SORTS = ["upcoming", "newest", "oldest"];

function sortEvents(events, sort) {
  const byDate = (a, b) => new Date(a.date) - new Date(b.date);
  const list = [...events];
  if (sort === "newest") return list.sort((a, b) => byDate(b, a));
  if (sort === "oldest") return list.sort(byDate);
  // "upcoming first": upcoming events by soonest date, then finished ones (latest first)
  const upcoming = list.filter((e) => isUpcoming(e)).sort(byDate);
  const past = list.filter((e) => !isUpcoming(e)).sort((a, b) => byDate(b, a));
  return [...upcoming, ...past];
}

export default function Events() {
  usePageMeta("Events | CodeChef ABESEC", "Browse and search CodeChef ABESEC competitions, workshops, hackathons and technical events.");

  // Filters live in the URL, so /events?category=Workshop works and can be shared
  const [params, setParams] = useSearchParams();
  const search = params.get("q") || "";
  const category = CATEGORIES.includes(params.get("category")) ? params.get("category") : "";
  const sort = SORTS.includes(params.get("sort")) ? params.get("sort") : "upcoming";
  const [visible, setVisible] = useState(PAGE_SIZE);

  function updateParam(key, value, defaultValue = "") {
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value && value !== defaultValue) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true }
    );
  }

  const { data, loading, error, reload } = useFetch(
    () => loadPublicEvents(),
    []
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const matches = (data || []).filter(
      (event) =>
        (!category || event.category === category) && (!term || event.title.toLowerCase().includes(term))
    );
    return sortEvents(matches, sort);
  }, [data, search, category, sort]);

  // Go back to the first page of results whenever the filters change
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [search, category, sort]);

  const hasFilters = Boolean(search || category || sort !== "upcoming");
  const hasAnyEvents = (data || []).length > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-4xl font-extrabold text-ink-100 sm:text-5xl">Events</h1>
        <p className="mt-3 text-ink-300">Competitions, workshops, hackathons and more from the CodeChef ABESEC chapter.</p>
      </header>

      <FilterBar
        search={search}
        category={category}
        sort={sort}
        onSearch={(value) => updateParam("q", value)}
        onCategory={(value) => updateParam("category", value)}
        onSort={(value) => updateParam("sort", value, "upcoming")}
        onClear={() => setParams({}, { replace: true })}
        hasFilters={hasFilters}
      />

      <div className="mt-8">
        {loading && <EventGridSkeleton count={6} />}

        {error && <ErrorState title="Unable to load events." message="Please try again." onRetry={reload} />}

        {!loading && !error && !hasAnyEvents && (
          <EmptyState icon={CalendarX} title="No events yet" message="Check back soon for new coding competitions and workshops." />
        )}

        {!loading && !error && hasAnyEvents && filtered.length === 0 && (
          <EmptyState
            icon={SearchX}
            title="No events found."
            message="Try changing your search or filters."
            action={
              <Button variant="secondary" onClick={() => setParams({}, { replace: true })}>
                Clear filters
              </Button>
            }
          />
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <p className="mb-4 text-sm text-ink-300" aria-live="polite">
              Showing {Math.min(visible, filtered.length)} of {filtered.length} {filtered.length === 1 ? "event" : "events"}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.slice(0, visible).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            {visible < filtered.length && (
              <div className="mt-10 flex justify-center">
                <Button variant="secondary" size="lg" onClick={() => setVisible((n) => n + PAGE_SIZE)}>
                  Load more events
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
