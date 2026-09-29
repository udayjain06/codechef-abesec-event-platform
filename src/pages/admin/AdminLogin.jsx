import { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Logo from "../../components/Logo";
import Button from "../../components/Button";
import { TextInput } from "../../components/FormControls";
import { LoadingState } from "../../components/Loading";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import usePageMeta from "../../hooks/usePageMeta";
import { isSupabaseConfigured } from "../../lib/supabase";

export default function AdminLogin() {
  usePageMeta("Admin login | CodeChef ABESEC");
  const { session, isAdmin, loading, signIn, signOut } = useAuth();
  const toast = useToast();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [justSignedIn, setJustSignedIn] = useState(false);

  // Only celebrate once we know the account really is an admin
  useEffect(() => {
    if (justSignedIn && session && isAdmin) {
      toast.success("Login successful");
      setJustSignedIn(false);
    }
  }, [justSignedIn, session, isAdmin, toast]);

  if (loading) return <LoadingState label="Checking your session..." />;

  // Already signed in as an admin -> straight to the dashboard
  if (session && isAdmin) {
    return <Navigate to={location.state?.from || "/admin"} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    const found = {};
    if (!email.trim()) found.email = "Please enter your email address.";
    if (!password) found.password = "Please enter your password.";
    setErrors(found);
    setFormError("");
    if (Object.keys(found).length) return;

    setSubmitting(true);
    const { error } = await signIn(email.trim(), password);
    setSubmitting(false);

    if (error) {
      console.error("Login failed:", error);
      // Same message for wrong email or wrong password (do not reveal which)
      setFormError(
        error.status === 400 ? "Incorrect email or password." : "Could not log in. Please try again."
      );
      return;
    }
    // The auth listener updates the session; once admin status is confirmed
    // the effect above shows the toast and this component redirects.
    setJustSignedIn(true);
  }

  return (
    <div className="bg-grid hero-glow flex min-h-screen flex-col">
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 rounded text-sm text-ink-300 hover:text-ember-300">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to site
          </Link>

          <div className="rounded-2xl border border-ink-600 bg-ink-900 p-6 shadow-2xl shadow-black/40 sm:p-8">
            <Logo />
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-ember-300">Organizer Portal</p>
            <h1 className="mt-2 text-2xl font-extrabold text-ink-100">Admin Console</h1>
            <p className="mt-1 text-sm text-ink-300">Sign in to manage events and registrations.</p>

            {!isSupabaseConfigured && (
              <div role="status" className="mt-5 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3.5 text-sm text-amber-100">
                Supabase configuration is required for organizer access. Add the public URL and anon key to enable real authentication and management.
              </div>
            )}

            {session && !isAdmin && (
              <div role="alert" className="mt-5 rounded-lg border border-amber-400/40 bg-amber-400/10 p-3.5 text-sm text-amber-200">
                <p>You are signed in, but this account does not have admin access.</p>
                <button type="button" onClick={() => signOut()} className="mt-2 font-semibold underline">
                  Log out
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
              {formError && (
                <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-red-400/40 bg-red-400/10 p-3.5 text-sm text-red-200">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  {formError}
                </div>
              )}
              <TextInput id="email" type="email" label="Email" autoComplete="email" required disabled={!isSupabaseConfigured} value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
              <TextInput id="password" type="password" label="Password" autoComplete="current-password" required disabled={!isSupabaseConfigured} value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
              <Button type="submit" size="lg" className="w-full" loading={submitting} disabled={!isSupabaseConfigured}>
                {submitting ? "Logging in..." : "Login"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
