import { BookOpen, Hammer, Trophy, Users } from "lucide-react";

const reasons = [
  { icon: Trophy, title: "Compete", text: "Improve problem-solving through coding competitions." },
  { icon: Hammer, title: "Build", text: "Turn ideas into working projects." },
  { icon: BookOpen, title: "Learn", text: "Participate in workshops and technical sessions." },
  { icon: Users, title: "Connect", text: "Meet students interested in technology and development." },
];

// Rows with dividers instead of four identical cards.
export default function WhyJoin() {
  return (
    <section className="border-y border-ink-700/60 bg-ink-900/50" aria-labelledby="why-heading">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <div>
          <h2 id="why-heading" className="text-3xl font-bold leading-tight text-ink-100 sm:text-4xl">
            Why join CodeChef?
          </h2>
          <p className="mt-4 max-w-sm text-ink-300">Four things you can do here, whatever your level.</p>
        </div>

        <ul className="divide-y divide-ink-700">
          {reasons.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-4 py-5 first:pt-0 last:pb-0">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ember-500/10 text-ember-400">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-ink-100">{title}</h3>
                <p className="mt-1 text-ink-300">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
