import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import Button from "./Button";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/events", label: "Events" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const desktopLink = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? "text-ember-400" : "text-ink-300 hover:text-ink-100"
  }`;

const mobileLink = ({ isActive }) =>
  `flex min-h-12 items-center rounded-lg px-4 text-base font-medium ${
    isActive ? "bg-ink-800 text-ember-400" : "text-ink-100 hover:bg-ink-800"
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu after navigating to another page
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-700/60 bg-ink-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={desktopLink}>
              {link.label}
            </NavLink>
          ))}
          <Button to="/events" size="sm" className="ml-3">
            Explore Events
          </Button>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-100 hover:bg-ink-800 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </button>
      </div>

      {/* Animated by transitioning the grid row from 0fr to 1fr */}
      <div
        id="mobile-menu"
        className={`grid transition-[grid-template-rows] duration-300 ease-out md:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className={`overflow-hidden ${open ? "visible" : "invisible"}`}>
          <nav aria-label="Mobile" className="space-y-1 border-t border-ink-700/60 px-4 pb-5 pt-3">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={mobileLink}>
                {link.label}
              </NavLink>
            ))}
            <Button to="/events" size="lg" className="mt-3 w-full">
              Explore Events
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
