import { RotateCcw } from "lucide-react";
import SearchBar from "./SearchBar";
import { SelectInput } from "./FormControls";
import Button from "./Button";
import { CATEGORIES } from "../data/categories";

const categoryOptions = [
  { value: "", label: "All categories" },
  ...CATEGORIES.map((c) => ({ value: c, label: c })),
];

const sortOptions = [
  { value: "upcoming", label: "Upcoming first" },
  { value: "newest", label: "Newest events" },
  { value: "oldest", label: "Oldest events" },
];

// Search + category + sort + reset for the public events page.
export default function FilterBar({ search, category, sort, onSearch, onCategory, onSort, onClear, hasFilters }) {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_15rem_13rem_auto] md:items-center">
      <SearchBar id="event-search" label="Search events by name" value={search} onChange={onSearch} placeholder="Search events by name" />
      <SelectInput id="event-category" label="Category" hideLabel value={category} onChange={(e) => onCategory(e.target.value)} options={categoryOptions} />
      <SelectInput id="event-sort" label="Sort events" hideLabel value={sort} onChange={(e) => onSort(e.target.value)} options={sortOptions} />
      <Button variant="ghost" onClick={onClear} disabled={!hasFilters} className="md:justify-self-start">
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Clear filters
      </Button>
    </div>
  );
}
