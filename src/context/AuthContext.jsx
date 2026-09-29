import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const AuthContext = createContext(null);

// Keeps track of the Supabase session and whether that user is in the admins table.
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  // Remembers which user we already checked, so we never flash "not an admin"
  const [adminCheck, setAdminCheck] = useState({ userId: null, isAdmin: false });

  // 1. Restore the session on page load and listen for login / logout / expiry
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setSessionLoading(false);
      return undefined;
    }
    supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session))
      .catch((error) => console.error("Could not restore session:", error))
      .finally(() => setSessionLoading(false));

    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession); // logged out or expired sessions arrive here as null
    });
    return () => data.subscription.unsubscribe();
  }, []);

  // 2. Once we know the user, check whether they are listed in public.admins.
  //    (RLS only lets a user read their OWN row, so this cannot leak other admins.)
  const userId = session?.user?.id ?? null;
  useEffect(() => {
    if (!isSupabaseConfigured || !userId) return;
    let ignore = false;
    supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (ignore) return;
        if (error) console.error("Admin check failed:", error);
        setAdminCheck({ userId, isAdmin: !error && Boolean(data) });
      });
    return () => {
      ignore = true;
    };
  }, [userId]);

  const signIn = useCallback(
    (email, password) => isSupabaseConfigured
      ? supabase.auth.signInWithPassword({ email, password })
      : Promise.resolve({ error: new Error("Supabase configuration is required.") }),
    []
  );
  const signOut = useCallback(() => isSupabaseConfigured ? supabase.auth.signOut() : Promise.resolve({ error: null }), []);

  const value = useMemo(() => {
    const checking = Boolean(userId) && adminCheck.userId !== userId;
    return {
      session,
      user: session?.user ?? null,
      isAdmin: Boolean(userId) && adminCheck.userId === userId && adminCheck.isAdmin,
      loading: sessionLoading || checking,
      signIn,
      signOut,
    };
  }, [session, userId, adminCheck, sessionLoading, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
