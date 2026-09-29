import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, Calendar, CalendarPlus, CheckCircle2, Clock, MapPin, SearchX } from "lucide-react";
import { TextInput } from "../components/FormControls";
import { StatusBadge } from "../components/Badges";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import { LoadingState } from "../components/Loading";
import useFetch from "../hooks/useFetch";
import usePageMeta from "../hooks/usePageMeta";
import { useToast } from "../context/ToastContext";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { loadPublicEvent } from "../lib/publicEvents";
import { getEventStatus } from "../utils/eventStatus";
import { formatDate, formatTimeRange } from "../utils/format";
import { normalizePhone, validateRegistration } from "../utils/validation";
import { googleCalendarUrl } from "../utils/calendar";
import { isUuid } from "../utils/uuid";

const EMPTY_FORM = { name: "", email: "", collegeYear: "", phone: "" };

export default function Register() {
  const { eventId } = useParams();
  const toast = useToast();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [registeredName, setRegisteredName] = useState(null); // set after success

  const { data: event, loading, error, reload } = useFetch(
    () =>
      isUuid(eventId)
        ? loadPublicEvent(eventId)
        : Promise.resolve({ data: null, error: null }),
    [eventId]
  );

  usePageMeta(event ? `Register for ${event.title} | CodeChef ABESEC` : "Register | CodeChef ABESEC");

  function handleChange(changeEvent) {
    const { name, value } = changeEvent.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    if (errors[name]) setErrors((previous) => ({ ...previous, [name]: undefined })); // clear as they fix it
    setFormError("");
  }

  async function handleSubmit(submitEvent) {
    submitEvent.preventDefault();
    if (submitting) return;

    // 1. Validate in JavaScript (we do not rely on browser validation)
    const foundErrors = validateRegistration(form);
    setErrors(foundErrors);
    setFormError("");
    const firstInvalid = Object.keys(foundErrors)[0];
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    // 2. Save to Supabase
    setSubmitting(true);
    const { error: insertError } = await supabase.from("registrations").insert({
      event_id: event.id,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      college_year: form.collegeYear.trim(),
      phone: normalizePhone(form.phone),
    });
    setSubmitting(false);

    // 3. Show a friendly message for each kind of failure
    if (insertError) {
      console.error("Registration failed:", insertError);
      if (insertError.code === "23505") {
        // Unique index on (event_id, lower(email))
        setErrors({ email: "You are already registered for this event." });
        setFormError("You are already registered for this event.");
      } else if (insertError.code === "42501") {
        // The database refuses registrations after the deadline
        setFormError("Registration is closed for this event.");
      } else {
        setFormError("Registration failed. Please try again.");
      }
      toast.error("Registration failed.");
      return;
    }

    setRegisteredName(form.name.trim());
    toast.success("Registration successful");
  }

  if (loading) return <LoadingState label="Loading event..." />;

  if (error)
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <ErrorState title="Unable to load this event." message="Please try again." onRetry={reload} />
      </div>
    );

  if (!event)
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          icon={SearchX}
          title="Event not found."
          message="This event may have been removed or the link is incorrect."
          action={<Button to="/events">Browse events</Button>}
        />
      </div>
    );

  const status = getEventStatus(event);

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10 sm:py-14">
        <Link to={`/events/${event.id}`} className="mb-6 inline-flex items-center gap-2 rounded text-sm font-medium text-ink-300 hover:text-ember-300"><ArrowLeft className="h-4 w-4" />Event details</Link>
        <div className="rounded-2xl border border-amber-400/30 bg-ink-900 p-6 text-center">
          <AlertCircle className="mx-auto h-9 w-9 text-amber-300" aria-hidden="true" />
          <h1 className="mt-4 text-2xl font-extrabold text-ink-100">Registration requires Supabase</h1>
          <p className="mt-2 text-ink-300">You are viewing the local demo for <span className="font-semibold text-ink-100">{event.title}</span>. Real registrations become available when Supabase is configured.</p>
          <Button to="/events" className="mt-6">Browse demo events</Button>
        </div>
      </div>
    );
  }

  // ---------- Success screen ----------
  if (registeredName) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 sm:py-16">
        <div className="rounded-3xl border border-emerald-400/30 bg-ink-900 p-6 text-center sm:p-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-3xl font-extrabold text-ink-100">Registration successful</h1>
          <p className="mt-2 text-ink-300">You are registered for</p>
          <p className="mt-1 text-xl font-bold text-ember-300">{event.title}</p>

          <dl className="mt-7 divide-y divide-ink-700 rounded-xl border border-ink-700 bg-ink-950/50 text-left text-sm">
            {[
              ["Name", registeredName],
              ["Event", event.title],
              ["Date", formatDate(event.date)],
              ["Time", formatTimeRange(event.start_time, event.end_time)],
              ["Venue", event.venue || "To be announced"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 px-4 py-3">
                <dt className="text-ink-300">{label}</dt>
                <dd className="text-right font-semibold text-ink-100">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button to="/events" size="lg">Back to Events</Button>
            <Button href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer" variant="secondary" size="lg">
              <CalendarPlus className="h-5 w-5" aria-hidden="true" />
              Add to Calendar
              <span className="sr-only"> (opens in a new tab)</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Registration form ----------
  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:py-14">
      <Link to={`/events/${event.id}`} className="mb-6 inline-flex items-center gap-2 rounded text-sm font-medium text-ink-300 hover:text-ember-300">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Event details
      </Link>

      {/* Event summary */}
      <div className="rounded-2xl border border-ink-700 bg-ink-900 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-ink-300">You are registering for</p>
          <StatusBadge status={status} />
        </div>
        <h1 className="mt-2 text-2xl font-extrabold text-ink-100 sm:text-3xl">{event.title}</h1>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-300">
          <li className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-ember-400" aria-hidden="true" />{formatDate(event.date)}</li>
          <li className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-ember-400" aria-hidden="true" />{formatTimeRange(event.start_time, event.end_time)}</li>
          <li className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-ember-400" aria-hidden="true" />{event.venue || "To be announced"}</li>
        </ul>
      </div>

      {status !== "open" ? (
        <div className="mt-6">
          <EmptyState
            icon={AlertCircle}
            title={status === "completed" ? "This event has ended" : "Registration is closed"}
            message={status === "completed" ? "You can no longer register for this event." : "The registration deadline for this event has passed."}
            action={<Button to="/events">Browse other events</Button>}
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5 rounded-2xl border border-ink-700 bg-ink-900 p-5 sm:p-6">
          {formError && (
            <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-red-400/40 bg-red-400/10 p-3.5 text-sm text-red-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {formError}
            </div>
          )}

          <TextInput id="name" name="name" label="Full name" required placeholder="Asha Verma" autoComplete="name" value={form.name} onChange={handleChange} error={errors.name} />
          <TextInput id="email" name="email" type="email" label="Email" required placeholder="you@example.com" autoComplete="email" value={form.email} onChange={handleChange} error={errors.email} />
          <TextInput id="collegeYear" name="collegeYear" label="College / Year" required placeholder="ABESEC, 2nd year" autoComplete="organization" value={form.collegeYear} onChange={handleChange} error={errors.collegeYear} />
          <TextInput id="phone" name="phone" type="tel" inputMode="tel" label="Phone number" required placeholder="98765 43210" autoComplete="tel" hint="10-digit Indian mobile number." value={form.phone} onChange={handleChange} error={errors.phone} />

          <Button type="submit" size="lg" className="w-full" loading={submitting}>
            {submitting ? "Registering..." : "Register"}
          </Button>
        </form>
      )}
    </div>
  );
}
