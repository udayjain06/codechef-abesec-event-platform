import { Link } from "react-router-dom";
import Logo from "./Logo";
import InstagramIcon from "./InstagramIcon";
import { INSTAGRAM_URL } from "../data/site";

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/events", label: "Events" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink-700 bg-ink-900/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-ink-300">Building a stronger student developer community.</p>
        </div>

        <nav aria-label="Footer quick links">
          <h2 className="text-sm font-bold text-ink-100">Quick links</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="rounded text-ink-300 hover:text-ember-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-bold text-ink-100">Follow us</h2>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded text-sm text-ink-300 hover:text-ember-300"
          >
            <InstagramIcon className="h-4 w-4" />
            Instagram
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>

      <div className="border-t border-ink-700">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-ink-300 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>&copy; 2026 CodeChef ABESEC Chapter</p>
          <Link to="/admin/login" className="rounded text-ink-500 hover:text-ink-300">
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
