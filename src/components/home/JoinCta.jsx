import Button from "../Button";
import { INSTAGRAM_URL } from "../../data/site";

export default function JoinCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20" aria-labelledby="cta-heading">
      <div className="bg-grid relative overflow-hidden rounded-3xl border border-ink-600 bg-gradient-to-br from-ink-800 to-ink-900 p-8 sm:p-12">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-ember-500/15 blur-3xl" />
        <div className="relative max-w-2xl">
          <h2 id="cta-heading" className="text-3xl font-extrabold leading-tight text-ink-100 sm:text-4xl">
            Ready to write your first line with us?
          </h2>
          <p className="mt-4 text-ink-300">
            Pick an event, register in under a minute, and follow the chapter on Instagram for updates.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button to="/events" size="lg">
              Explore Events
            </Button>
            <Button href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" variant="secondary" size="lg">
              Follow on Instagram
              <span className="sr-only"> (opens in a new tab)</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
