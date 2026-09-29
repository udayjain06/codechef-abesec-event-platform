import { isSupabaseConfigured } from "../lib/supabase";

// Shown only when .env is missing, so the developer knows what to do.
export default function ConfigNotice() {
  if (isSupabaseConfigured || !import.meta.env.DEV) return null;
  return (
    <div className="border-b border-amber-400/20 bg-amber-400/5 px-4 py-1 text-center text-xs font-medium text-amber-200">
      <span aria-hidden="true">● </span>Demo mode
    </div>
  );
}
