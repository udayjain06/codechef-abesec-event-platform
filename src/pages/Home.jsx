import { useMemo } from "react";
import { ArrowRight, CalendarX } from "lucide-react";
import Hero from "../components/home/Hero";
import AboutIntro from "../components/home/AboutIntro";
import WhyJoin from "../components/home/WhyJoin";
import FeaturedEvent from "../components/home/FeaturedEvent";
import CategoryExplorer from "../components/home/CategoryExplorer";
import JoinCta from "../components/home/JoinCta";
import EventCard from "../components/EventCard";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import Button from "../components/Button";
import { EventGridSkeleton } from "../components/Loading";
import useFetch from "../hooks/useFetch";
import usePageMeta from "../hooks/usePageMeta";
import { loadPublicEvents } from "../lib/publicEvents";
import { isUpcoming } from "../utils/eventStatus";
import { dateStringFromToday } from "../utils/format";

export default function Home() {
  usePageMeta(
    "CodeChef ABESEC | Code. Compete. Create.",
    "CodeChef ABESEC is a student-driven coding community at ABES Engineering College. Explore competitions, workshops, hackathons and technical events."
  );

  // One query: events from yesterday onwards (we filter finished ones below)
  const { data, loading, error, reload } = useFetch(
    async () => {
      const result = await loadPublicEvents();
      if (result.error) return result;
      return { data: result.data.filter((event) => event.date >= dateStringFromToday(-1)), error: null };
    },
    []
  );

  const { featured, upcoming } = useMemo(() => {
    const active = (data || []).filter((event) => isUpcoming(event));

    // If several events are marked featured, use the most recently updated one
    const featuredEvent =
      active
        .filter((event) => event.featured)
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0] || null;

    const others = active.filter((event) => !featuredEvent || event.id !== featuredEvent.id);
    return { featured: featuredEvent, upcoming: others.slice(0, 3) };
  }, [data]);

  return (
    <>
      <Hero />
      <AboutIntro />
      <WhyJoin />

      {/* Featured event: hidden when there is none, so the page never breaks */}
      {!loading && !error && featured && <FeaturedEvent event={featured} />}

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20" aria-labelledby="upcoming-heading">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 id="upcoming-heading" className="text-3xl font-bold text-ink-100 sm:text-4xl">
            {featured ? "More upcoming events" : "Upcoming events"}
          </h2>
          <Button to="/events" variant="ghost">
            View all events
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        {loading && <EventGridSkeleton count={3} />}
        {error && <ErrorState title="Unable to load events." message="Please try again." onRetry={reload} />}
        {!loading && !error && upcoming.length === 0 && (
          <EmptyState
            icon={CalendarX}
            title="No upcoming events"
            message="New events will appear here soon."
            action={
              <Button to="/events" variant="secondary">
                Browse all events
              </Button>
            }
          />
        )}
        {!loading && !error && upcoming.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      <CategoryExplorer />
      <JoinCta />
    </>
  );
}
