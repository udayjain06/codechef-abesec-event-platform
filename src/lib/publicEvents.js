import { DEMO_EVENTS } from "../data/demoEvents";
import { EVENT_CARD_COLUMNS, isSupabaseConfigured, supabase } from "./supabase";

// Public pages use real rows whenever configured, otherwise an explicit local
// preview dataset. Admin pages intentionally never use this fallback.
export const isDemoMode = !isSupabaseConfigured;

export async function loadPublicEvents({ cardsOnly = true } = {}) {
  if (!isSupabaseConfigured) return { data: DEMO_EVENTS, error: null };
  return supabase.from("events").select(cardsOnly ? EVENT_CARD_COLUMNS : "*").order("date", { ascending: true });
}

export async function loadPublicEvent(id) {
  if (!isSupabaseConfigured) {
    return { data: DEMO_EVENTS.find((event) => event.id === id) ?? null, error: null };
  }
  return supabase.from("events").select("*").eq("id", id).maybeSingle();
}
