import { NavLink, useNavigate } from "react-router-dom";
import { CalendarDays, ClipboardList, ExternalLink, LayoutDashboard, LogOut, Plus } from "lucide-react";
import Logo from "../Logo";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/events", label: "Events", icon: CalendarDays },
  { to: "/admin/events/new", label: "Create Event", icon: Plus },
  { to: "/admin/registrations", label: "Registrations", icon: ClipboardList },
];

const linkClasses = ({ isActive }) =>
  `flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
    isActive ? "bg-ember-500/10 text-ember-300" : "text-ink-300 hover:bg-ink-800 hover:text-ink-100"
  }`;

// Used in the fixed desktop sidebar AND inside the mobile drawer.
export default function AdminSidebar() {
  const { user, signOut } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  async function handleLogout() {
    const { error } = await signOut();
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    toast.success("Logged out successfully");
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="flex h-full flex-col p-4">
      <div className="px-1 py-2">
        <Logo to="/admin" />
        <p className="mt-2 px-0.5 text-xs font-semibold uppercase tracking-wider text-ink-500">Admin Console</p>
      </div>

      <nav aria-label="Admin" className="mt-6 space-y-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={linkClasses}>
            <Icon className="h-5 w-5" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-1 border-t border-ink-700 pt-4">
        <NavLink to="/" className={linkClasses}>
          <ExternalLink className="h-5 w-5" aria-hidden="true" />
          View site
        </NavLink>
        <button type="button" onClick={handleLogout} className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-ink-300 transition-colors hover:bg-red-400/10 hover:text-red-300">
          <LogOut className="h-5 w-5" aria-hidden="true" />
          Logout
        </button>
        {user?.email && <p className="truncate px-3 pt-2 text-xs text-ink-500" title={user.email}>{user.email}</p>}
      </div>
    </div>
  );
}
