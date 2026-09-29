import { Loader2 } from "lucide-react";

export function Spinner({ className = "h-5 w-5" }) {
  return <Loader2 className={`animate-spin ${className}`} aria-hidden="true" />;
}

export function LoadingState({ label = "Loading..." }) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-3 py-20 text-ink-300">
      <Spinner className="h-7 w-7 text-ember-400" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-ink-700 bg-ink-900" aria-hidden="true">
      <div className="aspect-[16/9] bg-ink-800" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-24 rounded-full bg-ink-800" />
        <div className="h-6 w-3/4 rounded bg-ink-800" />
        <div className="h-4 w-1/2 rounded bg-ink-800" />
        <div className="h-4 w-2/3 rounded bg-ink-800" />
        <div className="h-11 rounded-lg bg-ink-800" />
      </div>
    </div>
  );
}

export function EventGridSkeleton({ count = 3 }) {
  return (
    <div role="status" aria-label="Loading events" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6 }) {
  return (
    <div role="status" aria-label="Loading" className="animate-pulse space-y-2 rounded-xl border border-ink-700 bg-ink-900 p-4">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="h-10 rounded bg-ink-800" />
      ))}
    </div>
  );
}
