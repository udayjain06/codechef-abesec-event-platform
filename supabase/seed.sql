-- =====================================================================
-- DEMO DATA ONLY. These are sample events for testing the platform.
-- They are NOT real CodeChef ABESEC events. Titles start with [DEMO].
-- Dates are relative to today, so the demo always has upcoming events.
-- Run in the SQL Editor AFTER schema.sql. Re-running replaces the demos.
-- =====================================================================

delete from public.events where title like '[DEMO]%';

insert into public.events
  (title, description, category, date, start_time, end_time, venue,
   registration_deadline, eligibility, rules, featured)
values
('[DEMO] Code Clash',
 'A sample timed programming contest with problems ranging from easy to hard. Demo content for testing the platform.',
 'Competitive Programming', current_date + 14, '16:00', '19:00', 'ABES Engineering College',
 ((current_date + 13) + time '18:00') at time zone 'Asia/Kolkata',
 'Open to all students.',
 E'Solo participation only.\nUse any language available on the contest platform.\nNo plagiarism or sharing of solutions.\nThe organizers'' decision is final.',
 true),

('[DEMO] Web Warriors',
 'A sample web development challenge where teams build a small project within a fixed time. Demo content.',
 'Development', current_date + 21, '14:00', '18:00', 'ABES Engineering College',
 ((current_date + 20) + time '18:00') at time zone 'Asia/Kolkata',
 'Teams of up to 2 students.',
 E'Use HTML, CSS and JavaScript (frameworks allowed).\nProjects must be built during the event.\nSubmit a working link before the deadline.',
 false),

('[DEMO] Git & GitHub Workshop',
 'A sample beginner workshop on version control: commits, branches and pull requests. Demo content.',
 'Workshop', current_date + 7, '15:00', '17:00', 'ABES Engineering College',
 ((current_date + 6) + time '18:00') at time zone 'Asia/Kolkata',
 'Beginners welcome. No prior experience needed.',
 E'Bring a laptop.\nInstall Git before the session.\nCreate a free GitHub account beforehand.',
 false),

('[DEMO] DSA Bootcamp',
 'A sample multi-topic session on data structures and algorithms with guided practice. Demo content.',
 'Workshop', current_date + 28, '10:00', '15:00', 'ABES Engineering College',
 ((current_date + 27) + time '18:00') at time zone 'Asia/Kolkata',
 'Students with basic programming knowledge.',
 E'Bring a laptop.\nBe ready to solve problems in a language you know.',
 false),

('[DEMO] Hackathon Night',
 'A sample overnight build event for teams. Demo content for testing categories and filters.',
 'Hackathon', current_date + 35, '18:00', '23:00', 'ABES Engineering College',
 ((current_date + 33) + time '18:00') at time zone 'Asia/Kolkata',
 'Teams of 2 to 4 students.',
 E'Teams must be registered before the deadline.\nProjects must be started at the event.\nDemo your build to the judges at the end.',
 false),

('[DEMO] Past Session: Intro to Competitive Programming',
 'A sample completed event, used to test the Completed status. Demo content.',
 'Seminar', current_date - 20, '15:00', '17:00', 'ABES Engineering College',
 ((current_date - 21) + time '18:00') at time zone 'Asia/Kolkata',
 'Open to all students.',
 'Demo event.',
 false);
