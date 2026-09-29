import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 select-none whitespace-nowrap";

const variants = {
  primary: "bg-ember-500 text-ink-950 hover:bg-ember-400 active:bg-ember-600",
  secondary: "border border-ink-600 bg-ink-800 text-ink-100 hover:border-ink-500 hover:bg-ink-700",
  ghost: "text-ink-300 hover:bg-ink-800 hover:text-ink-100",
  danger: "bg-red-500 text-white hover:bg-red-400 active:bg-red-600",
};

const sizes = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-6 text-base",
};

// One button for the whole app.
//   <Button to="/events">Explore Events</Button>          -> internal link
//   <Button href="https://...">Instagram</Button>          -> external link
//   <Button loading onClick={...}>Save</Button>            -> real <button>
export default function Button({
  variant = "primary",
  size = "md",
  to,
  href,
  loading = false,
  className = "",
  children,
  ...rest
}) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...rest} disabled={loading || rest.disabled}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
