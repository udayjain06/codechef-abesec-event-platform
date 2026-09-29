import { Code2, Handshake, Rocket, Target, Trophy, Wrench } from "lucide-react";
import Button from "../components/Button";
import usePageMeta from "../hooks/usePageMeta";
import { INSTAGRAM_URL } from "../data/site";

const activities = [
  { icon: Trophy, title: "Competitions", text: "Timed contests that push you to solve problems faster and think more clearly." },
  { icon: Code2, title: "Development", text: "Project-based events for building real applications and learning modern tools." },
  { icon: Wrench, title: "Workshops", text: "Hands-on sessions where you learn a skill by using it." },
  { icon: Rocket, title: "Hackathons", text: "Team events where an idea becomes a working prototype in a short time." },
  { icon: Handshake, title: "Collaboration", text: "A place to find teammates, share what you know and learn from peers." },
];

export default function About() {
  usePageMeta("About | CodeChef ABESEC", "Learn about the CodeChef ABESEC chapter at ABES Engineering College: our mission and what the community does.");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-extrabold text-ink-100 sm:text-5xl">About the chapter</h1>
        <p className="mt-5 text-lg text-ink-300">
          CodeChef ABESEC is a student-driven coding community at ABES Engineering College. It brings together problem
          solvers, developers and builders through competitions, workshops, hackathons and technical events.
        </p>
      </header>

      <section className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16" aria-labelledby="mission">
        <h2 id="mission" className="flex items-center gap-3 text-3xl font-bold text-ink-100">
          <Target className="h-7 w-7 text-ember-400" aria-hidden="true" />
          Our mission
        </h2>
        <p className="text-lg text-ink-300">
          To build a stronger student developer community: a place where students practise problem solving, build
          projects together and learn from each other, whatever their current level.
        </p>
      </section>

      <section className="mt-14" aria-labelledby="activities">
        <h2 id="activities" className="text-3xl font-bold text-ink-100">What the community does</h2>
        <ul className="mt-6 divide-y divide-ink-700 border-y border-ink-700">
          {activities.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-4 py-5">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ember-500/10 text-ember-400">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-ink-100">{title}</h3>
                <p className="mt-1 max-w-2xl text-ink-300">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 rounded-3xl border border-ink-600 bg-ink-900 p-8 sm:p-10" aria-labelledby="community">
        <h2 id="community" className="text-2xl font-bold text-ink-100 sm:text-3xl">Be part of it</h2>
        <p className="mt-3 max-w-xl text-ink-300">See what is coming up, register for an event, and follow the chapter for updates.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button to="/events" size="lg">Explore Events</Button>
          <Button href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" variant="secondary" size="lg">
            Follow on Instagram
            <span className="sr-only"> (opens in a new tab)</span>
          </Button>
        </div>
      </section>
    </div>
  );
}
