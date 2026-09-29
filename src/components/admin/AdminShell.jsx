import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { LogoMark } from "../Logo";

// Layout for every admin page: fixed sidebar on desktop, drawer on mobile.
export default function AdminShell() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e) => e.key === "Escape" && setDrawerOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  useEffect(() => {
    document.title = "Admin | CodeChef ABESEC";
  }, []);

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-ink-700 bg-ink-900 lg:block">
        <AdminSidebar />
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-ink-700 bg-ink-950/90 px-4 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2.5">
          <LogoMark className="h-7 w-7" />
          <span className="font-display font-bold text-ink-100">Admin</span>
        </div>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-100 hover:bg-ink-800"
          aria-label="Open admin menu"
          aria-expanded={drawerOpen}
          aria-controls="admin-drawer"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden ${drawerOpen ? "" : "pointer-events-none"}`} aria-hidden={!drawerOpen}>
        <div
          className={`absolute inset-0 bg-black/70 transition-opacity duration-200 ${drawerOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setDrawerOpen(false)}
        />
        <div
          id="admin-drawer"
          className={`absolute inset-y-0 left-0 w-72 max-w-[85%] border-r border-ink-700 bg-ink-900 transition-transform duration-200 ${drawerOpen ? "translate-x-0" : "-translate-x-full"} ${drawerOpen ? "visible" : "invisible"}`}
        >
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-lg text-ink-300 hover:bg-ink-800"
            aria-label="Close admin menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          <AdminSidebar />
        </div>
      </div>

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
