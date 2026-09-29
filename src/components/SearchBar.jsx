import { Search, X } from "lucide-react";

export default function SearchBar({ id, value, onChange, placeholder = "Search...", label = "Search" }) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" aria-hidden="true" />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-lg border border-ink-600 bg-ink-900 py-2.5 pl-10 pr-10 text-base text-ink-100 placeholder:text-ink-500 hover:border-ink-500 focus:border-ember-500 focus:outline-none focus:ring-2 focus:ring-ember-500/60 sm:text-sm [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-ink-300 hover:text-ink-100"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
