import { Code2, Trophy, Rocket, Wrench, Users, Presentation, Layers } from "lucide-react";

// Must match the CHECK constraint on events.category in supabase/schema.sql
export const CATEGORIES = [
  "Competitive Programming",
  "Development",
  "Hackathon",
  "Workshop",
  "Seminar",
  "Community",
  "Other",
];

export const CATEGORY_META = {
  "Competitive Programming": { icon: Trophy, blurb: "Contests and problem-solving battles." },
  Development: { icon: Code2, blurb: "Build real projects and ship them." },
  Hackathon: { icon: Rocket, blurb: "Team up and build against the clock." },
  Workshop: { icon: Wrench, blurb: "Hands-on sessions to learn a new skill." },
  Seminar: { icon: Presentation, blurb: "Talks and technical sessions." },
  Community: { icon: Users, blurb: "Meetups and peer learning." },
  Other: { icon: Layers, blurb: "Everything else." },
};

// Shown on the home page "Explore by category" section
export const EXPLORE_CATEGORIES = [
  "Competitive Programming",
  "Development",
  "Hackathon",
  "Workshop",
  "Community",
];
