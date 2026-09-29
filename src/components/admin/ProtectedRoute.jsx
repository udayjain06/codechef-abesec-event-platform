import { Navigate, useLocation } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { LoadingState } from "../Loading";
import Button from "../Button";
import { isSupabaseConfigured } from "../../lib/supabase";

// Frontend guard for admin pages.
// NOTE: this only controls what the UI shows. The real protection is
// Row Level Security in Supabase, which blocks non-admins at the database.
export default function ProtectedRoute({ children }) {
  const { session, isAdmin, loading, signOut } = useAuth();
  const location = useLocation();
  const toast = useToast();

  if (!isSupabaseConfigured) return <Navigate to="/admin/login" replace />;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingState label="Checking your session..." />
      </div>
    );
  }

  // Not logged in (or the session expired) -> go to the login page
  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  // Logged in, but not listed in the admins table
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border border-ink-700 bg-ink-900 p-8 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-amber-300" aria-hidden="true" />
          <h1 className="mt-4 text-2xl font-bold text-ink-100">No admin access</h1>
          <p className="mt-2 text-sm text-ink-300">This account is not an admin. Sign in with an admin account to continue.</p>
          <Button
            className="mt-6"
            variant="secondary"
            onClick={async () => {
              await signOut();
              toast.info("Logged out.");
            }}
          >
            Log out
          </Button>
        </div>
      </div>
    );
  }

  return children;
}
