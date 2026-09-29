import { createClient } from "@supabase/supabase-js";

// Values come from .env (see .env.example). Only the PUBLIC anon key belongs
// in the browser. Security is enforced by Row Level Security in the database.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

// If the env vars are missing we still create a client (with placeholders) so
// the app renders and can show a helpful notice instead of a blank screen.
export const supabase = createClient(
  url || "http://localhost:54321",
  anonKey || "supabase-anon-key-not-set"
);

// Columns needed to draw event cards (skips long fields like rules).
export const EVENT_CARD_COLUMNS =
  "id, title, description, category, date, start_time, end_time, venue, image_url, registration_deadline, featured, created_at, updated_at";
