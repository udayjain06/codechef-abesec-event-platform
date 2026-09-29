import { ArrowRight } from "lucide-react";
import Button from "../Button";
import Terminal from "../Terminal";
import { INSTAGRAM_URL } from "../../data/site";

export default function Hero() {
  return (
    <section className="bg-grid hero-glow relative border-b border-ink-700/60">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <p className="text-sm font-medium text-ink-300">CodeChef ABESEC Chapter &middot; ABES Engineering College</p>

          <h1 className="mt-5 text-5xl font-extrabold leading-[0.98] text-ink-100 sm:text-6xl lg:text-7xl">
            <span className="block">Code.</span>
            <span className="block">Compete.</span>
            <span className="block">
              Create.
              <span aria-hidden="true" className="cursor-blink ml-2 inline-block h-[0.7em] w-[0.36em] translate-y-[0.02em] bg-ember-500 align-baseline" />
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base text-ink-300 sm:text-lg">
            A student-driven coding community at ABES Engineering College bringing together problem solvers, developers,
            and builders through competitions, workshops, hackathons, and technical events.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button to="/events" size="lg">
              Explore Events
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" variant="secondary" size="lg">
              Join the Community
              <span className="sr-only"> (opens Instagram in a new tab)</span>
            </Button>
          </div>
        </div>

        <Terminal />
      </div>
    </section>
  );
}
