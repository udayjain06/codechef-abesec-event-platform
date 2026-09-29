# CodeChef ABESEC Event Management Platform

A dark, developer-styled event platform for the **CodeChef ABESEC Chapter** at ABES Engineering College. Students discover and register for events; admins manage events and registrations. Built for the Code Kitchen: Development recruitment task.

Official Instagram: <https://www.instagram.com/abesec.codechef/>

## Features

**Students**
- Home page: hero, club intro, why join, featured event, upcoming events, category explorer
- Events page with search by name, category filter, sorting (upcoming first / newest / oldest) and one-click reset. Filters live in the URL, so `/events?category=Workshop` works
- Event details page with banner, schedule, venue, eligibility, rules, deadline and a live registration status
- Registration form with inline validation, loading, success and error states. Duplicate registrations (same email, same event) are blocked by the database
- Add to Google Calendar link

**Admins**
- Supabase Auth login, protected routes
- Dashboard with live stats (total / upcoming events, total registrations, categories in use), upcoming events and recent registrations
- Create, edit and delete events (custom confirmation modal), image upload to Supabase Storage or paste a link, one featured event at a time
- Registrations table with search (name, email, phone), filters (event, college/year, date range), sorting, pagination, delete, and **CSV export** (built in the browser)

Event status (Registration Open / Registration Closed / Completed) is calculated from dates, never set by hand.

## Tech stack

React, JavaScript, Vite, Tailwind CSS v4, React Router, Supabase (PostgreSQL, Auth, Row Level Security, Storage), Vercel, Lucide icons.

```
React (UI)  ->  Supabase JS client  ->  Supabase (PostgreSQL + Auth + RLS)
```
React draws the UI, React Router handles pages, Tailwind handles styling, Supabase is the whole backend, Vercel hosts the frontend. There is no custom server.

## Project structure

```
src/
  components/        Button, Navbar, Footer, EventCard, Badges, FormControls, Modal, Toast, ...
    home/            Hero, AboutIntro, WhyJoin, FeaturedEvent, CategoryExplorer, JoinCta
    admin/           AdminShell, AdminSidebar, ProtectedRoute, EventForm, PageHeader
  pages/             Home, Events, EventDetails, Register, About, Contact, NotFound
    admin/           AdminLogin, Dashboard, ManageEvents, CreateEvent, EditEvent, Registrations
  context/           ToastContext, AuthContext
  hooks/             useFetch (loading / error / data), usePageMeta (title + description)
  lib/supabase.js    the single Supabase client
  utils/             eventStatus, validation, csv, format, calendar
  data/              categories, site links
supabase/
  schema.sql         tables, unique index, RLS policies, storage bucket
  seed.sql           [DEMO] events for testing
```

## Setup

### 1. Install and run
```bash
npm install
cp .env.example .env      # then fill in the two values (step 2)
npm run dev
```

### 2. Create the Supabase project
1. Create a project at <https://supabase.com>.
2. **Project Settings -> API**: copy the *Project URL* and the *anon / publishable* key into `.env`:
   ```env
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
   Never put the `service_role` key in the frontend or commit `.env`.

### 3. Create the database and security rules
Open **SQL Editor**, paste all of `supabase/schema.sql` and run it. It creates:

| Table | Purpose |
|---|---|
| `events` | Event details (`featured`, deadline, etc.) |
| `registrations` | `event_id -> events.id` (cascade delete). Unique index on `(event_id, lower(email))` |
| `admins` | `user_id -> auth.users.id`. Only listed users are admins |

RLS policies:

| Who | Events | Registrations | Admins table |
|---|---|---|---|
| Public | read | insert only, and only while registration is open | none |
| Admin | create, update, delete | read, delete | own row |

Nobody can update a registration or list other people's registrations without being an admin. Storage bucket `event-images` is publicly readable; only admins can upload or delete.

### 4. Demo data (optional)
Run `supabase/seed.sql`. It adds events titled `[DEMO] ...` with dates relative to today. They are sample content, not real chapter events. Delete them with `delete from events where title like '[DEMO]%';`.

### 5. Create the first admin
1. **Authentication -> Users -> Add user**: enter an email and password (choose your own; do not reuse a weak one).
2. Recommended: **Authentication -> Sign In / Providers**: turn off public sign-ups.
3. In the SQL Editor run:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'YOUR_ADMIN_EMAIL';
   ```
4. Log in at `/admin/login`.

## Deploy to Vercel
1. Push the repo to GitHub and import it in Vercel (framework: Vite).
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under **Settings -> Environment Variables**.
3. Deploy. `vercel.json` rewrites every route to `index.html`, so refreshing `/events/123` does not 404.
4. In Supabase **Authentication -> URL Configuration**, add your Vercel URL as the Site URL.

## Manual test checklist
- **Student:** home loads, featured + upcoming show, category tile opens filtered events, search, filter, sort, clear, event details, register with bad data (see errors), register with good data (success), register again with the same email (blocked), closed/completed events show no form
- **Admin:** wrong password fails, login works, dashboard numbers match, create event (validation + success), edit, delete (cancel first, then confirm), registrations search/filter/sort/pagination, CSV export opens in Excel, logout, `/admin` redirects to login afterwards
- **Security:** in a private window, try reading `registrations` or inserting into `events` with the anon key. Both must fail
- **Responsive:** 320, 375, 425, 768, 1024, 1440 px

## Notes and limitations
- Registration capacity, waitlist and QR codes are not implemented.
- Times are treated as India Standard Time for the database-side "registration open" rule.
- The registrations page loads all rows into the browser (in chunks of 1000) and filters client-side. This is fine for a college club; very large events would need server-side pagination.

## Future improvements
Event countdown, capacity / waitlist, confirmation emails (Supabase Edge Function), registration analytics, light theme.
