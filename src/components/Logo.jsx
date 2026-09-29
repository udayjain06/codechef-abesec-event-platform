import { Link } from "react-router-dom";

// Original mark: a terminal prompt (>_) on an ember tile.
export function LogoMark({ className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#ff6b1f" />
      <path d="M9 10l7 6-7 6" fill="none" stroke="#0d0a08" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 23h6" stroke="#0d0a08" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function Logo({ to = "/" }) {
  return (
    <Link to={to} className="flex items-center gap-2.5 rounded-md" aria-label="CodeChef ABESEC home">
      <LogoMark />
      <span className="font-display text-lg font-bold tracking-tight text-ink-100">
        CodeChef <span className="text-ember-400">ABESEC</span>
      </span>
    </Link>
  );
}
