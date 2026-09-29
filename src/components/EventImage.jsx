import { useEffect, useState } from "react";
import { CATEGORY_META } from "../data/categories";

// Shows the event banner. If there is no image (or it fails to load) we draw a
// designed placeholder instead of a broken-image icon.
export default function EventImage({ event, priority = false, className = "" }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [event.image_url]);

  if (!event.image_url || failed) {
    const Icon = (CATEGORY_META[event.category] || CATEGORY_META.Other).icon;
    return (
      <div
        role="img"
        aria-label={`${event.category} event`}
        className={`bg-grid relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-ink-800 to-ink-900 ${className}`}
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-ember-500/10 blur-3xl" />
        <div className="relative flex flex-col items-center gap-2 text-ink-300">
          <Icon className="h-9 w-9 text-ember-400" aria-hidden="true" />
          <span className="font-mono text-xs">{`// ${event.category.toLowerCase()}`}</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={event.image_url}
      alt={`Banner for ${event.title}`}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
