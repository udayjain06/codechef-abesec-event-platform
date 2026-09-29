import { Link } from "react-router-dom";

const focusAreas = [
  "Competitive Programming",
  "Development",
  "Problem Solving",
  "Hackathons",
  "Workshops",
  "Peer Learning",
];

export default function AboutIntro() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20" aria-labelledby="about-heading">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <h2 id="about-heading" className="text-3xl font-bold leading-tight text-ink-100 sm:text-4xl">
          About CodeChef ABESEC
        </h2>
        <div>
          <p className="text-base text-ink-300 sm:text-lg">
            CodeChef ABESEC is a student community at ABES Engineering College built around writing code, solving hard
            problems and learning from each other. We run events where students can practise, build and meet people who
            enjoy the same things.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {focusAreas.map((area) => (
              <li key={area} className="rounded-full border border-ink-600 bg-ink-900 px-3.5 py-1.5 text-sm text-ink-100">
                {area}
              </li>
            ))}
          </ul>
          <Link to="/about" className="mt-6 inline-block rounded text-sm font-semibold text-ember-400 hover:text-ember-300">
            More about the chapter
          </Link>
        </div>
      </div>
    </section>
  );
}
