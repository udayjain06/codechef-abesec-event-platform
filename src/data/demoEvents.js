// Development fallback only. These records are deliberately labelled so they
// cannot be mistaken for historical or scheduled CodeChef ABESEC events.
const localDate = (offset) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
};

const deadline = (offset) => `${localDate(offset)}T18:00:00+05:30`;

export const DEMO_EVENTS = [
  {
    id: "10000000-0000-4000-8000-000000000001", title: "[DEMO] Code Clash", category: "Competitive Programming",
    date: localDate(14), start_time: "16:00", end_time: "19:00", venue: "Campus venue (demo)",
    description: "Sample timed programming contest content used to preview this platform during local development.",
    eligibility: "Sample eligibility: open to students.", rules: "Solo participation only.\nUse any supported language.\nDo not share solutions.",
    registration_deadline: deadline(13), featured: true, created_at: `${localDate(-2)}T10:00:00Z`, updated_at: `${localDate(-1)}T10:00:00Z`, image_url: null,
  },
  {
    id: "10000000-0000-4000-8000-000000000002", title: "[DEMO] Git & GitHub Workshop", category: "Workshop",
    date: localDate(7), start_time: "15:00", end_time: "17:00", venue: "Campus venue (demo)",
    description: "Sample beginner version-control workshop content for local development previews.",
    eligibility: "Sample eligibility: beginners welcome.", rules: "Bring a laptop.\nInstall Git before the session.\nCreate a GitHub account beforehand.",
    registration_deadline: deadline(6), featured: false, created_at: `${localDate(-3)}T10:00:00Z`, updated_at: `${localDate(-3)}T10:00:00Z`, image_url: null,
  },
  {
    id: "10000000-0000-4000-8000-000000000003", title: "[DEMO] Web Warriors", category: "Development",
    date: localDate(21), start_time: "14:00", end_time: "18:00", venue: "Campus venue (demo)",
    description: "Sample web development challenge content used only to demonstrate event discovery.",
    eligibility: "Sample eligibility: teams of up to two students.", rules: "Use HTML, CSS and JavaScript.\nBuild during the event.\nSubmit a working link.",
    registration_deadline: deadline(20), featured: false, created_at: `${localDate(-4)}T10:00:00Z`, updated_at: `${localDate(-4)}T10:00:00Z`, image_url: null,
  },
  {
    id: "10000000-0000-4000-8000-000000000004", title: "[DEMO] DSA Bootcamp", category: "Workshop",
    date: localDate(28), start_time: "10:00", end_time: "15:00", venue: "Campus venue (demo)",
    description: "Sample data structures and algorithms session content for local development previews.",
    eligibility: "Sample eligibility: students with basic programming knowledge.", rules: "Bring a laptop.\nBe ready to practise.\nDemo content only.",
    registration_deadline: deadline(27), featured: false, created_at: `${localDate(-5)}T10:00:00Z`, updated_at: `${localDate(-5)}T10:00:00Z`, image_url: null,
  },
  {
    id: "10000000-0000-4000-8000-000000000005", title: "[DEMO] Hackathon Night", category: "Hackathon",
    date: localDate(35), start_time: "18:00", end_time: "23:00", venue: "Campus venue (demo)",
    description: "Sample build event content for testing categories and filters locally.",
    eligibility: "Sample eligibility: teams of two to four students.", rules: "Projects start at the event.\nDemo your build at the end.",
    registration_deadline: deadline(33), featured: false, created_at: `${localDate(-6)}T10:00:00Z`, updated_at: `${localDate(-6)}T10:00:00Z`, image_url: null,
  },
];
