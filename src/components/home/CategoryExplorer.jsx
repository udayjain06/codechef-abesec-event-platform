import { Link } from "react-router-dom";
import { EXPLORE_CATEGORIES, CATEGORY_META } from "../../data/categories";

export default function CategoryExplorer() {
  return (
    <section className="border-t border-ink-700/60 bg-ink-900/50" aria-labelledby="category-heading">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 id="category-heading" className="text-3xl font-bold text-ink-100 sm:text-4xl">
          Explore by category
        </h2>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {EXPLORE_CATEGORIES.map((category) => {
            const { icon: Icon, blurb } = CATEGORY_META[category];
            return (
              <li key={category}>
                <Link
                  to={`/events?category=${encodeURIComponent(category)}`}
                  className="group flex h-full flex-col rounded-2xl border border-ink-700 bg-ink-900 p-5 transition duration-200 hover:-translate-y-1 hover:border-ember-500/50 motion-reduce:transform-none"
                >
                  <Icon className="h-7 w-7 text-ember-400 transition-transform group-hover:scale-110 motion-reduce:transform-none" aria-hidden="true" />
                  <span className="mt-4 text-base font-bold text-ink-100">{category}</span>
                  <span className="mt-1 text-sm text-ink-300">{blurb}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
