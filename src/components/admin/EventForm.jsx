import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ImageUp, X } from "lucide-react";
import { TextArea, TextInput, SelectInput } from "../FormControls";
import Button from "../Button";
import { Spinner } from "../Loading";
import { useToast } from "../../context/ToastContext";
import { supabase } from "../../lib/supabase";
import { CATEGORIES } from "../../data/categories";
import { toDateTimeLocal } from "../../utils/format";
import { validateEvent } from "../../utils/validation";

const EMPTY_FORM = {
  title: "",
  category: "",
  description: "",
  date: "",
  start_time: "",
  end_time: "",
  registration_deadline: "",
  venue: "",
  eligibility: "",
  rules: "",
  image_url: "",
  featured: false,
};

// Database row -> form values (edit mode)
function fromEvent(event) {
  return {
    title: event.title || "",
    category: event.category || "",
    description: event.description || "",
    date: event.date || "",
    start_time: event.start_time ? event.start_time.slice(0, 5) : "",
    end_time: event.end_time ? event.end_time.slice(0, 5) : "",
    registration_deadline: toDateTimeLocal(event.registration_deadline),
    venue: event.venue || "",
    eligibility: event.eligibility || "",
    rules: event.rules || "",
    image_url: event.image_url || "",
    featured: Boolean(event.featured),
  };
}

// Form values -> database row (empty optional fields become null)
function toPayload(form) {
  const orNull = (value) => (value.trim() ? value.trim() : null);
  return {
    title: form.title.trim(),
    category: form.category,
    description: form.description.trim(),
    date: form.date,
    start_time: form.start_time || null,
    end_time: form.end_time || null,
    registration_deadline: form.registration_deadline ? new Date(form.registration_deadline).toISOString() : null,
    venue: form.venue.trim(),
    eligibility: orNull(form.eligibility),
    rules: orNull(form.rules),
    image_url: orNull(form.image_url),
    featured: form.featured,
  };
}

const CATEGORY_OPTIONS = [{ value: "", label: "Choose a category" }, ...CATEGORIES.map((c) => ({ value: c, label: c }))];
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

function Section({ title, children }) {
  return (
    <section className="rounded-2xl border border-ink-700 bg-ink-900 p-5 sm:p-6">
      <h2 className="mb-5 text-lg font-bold text-ink-100">{title}</h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

// One form for both "Create event" and "Edit event".
// Pass `event` to edit an existing one; leave it out to create a new one.
export default function EventForm({ event }) {
  const isEdit = Boolean(event);
  const navigate = useNavigate();
  const toast = useToast();
  const fileInput = useRef(null);

  const [form, setForm] = useState(event ? fromEvent(event) : EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState("");

  function setField(name, value) {
    setForm((previous) => ({ ...previous, [name]: value }));
    if (errors[name]) setErrors((previous) => ({ ...previous, [name]: undefined }));
    setFormError("");
  }

  const onChange = (e) => setField(e.target.name, e.target.value);

  // Upload a banner to the Supabase Storage bucket "event-images"
  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow choosing the same file again
    if (!file) return;

    if (!IMAGE_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, image_url: "Please choose a JPG, PNG or WebP image." }));
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setErrors((prev) => ({ ...prev, image_url: "The image must be smaller than 2 MB." }));
      return;
    }

    setUploading(true);
    const extension = file.type.split("/")[1];
    const path = `${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from("event-images").upload(path, file, { contentType: file.type });
    setUploading(false);

    if (error) {
      console.error("Image upload failed:", error);
      setErrors((prev) => ({ ...prev, image_url: "Image upload failed. Please try again or paste an image link." }));
      return;
    }
    const { data } = supabase.storage.from("event-images").getPublicUrl(path);
    setField("image_url", data.publicUrl);
  }

  async function handleSubmit(submitEvent) {
    submitEvent.preventDefault();
    if (saving || uploading) return;

    const foundErrors = validateEvent(form);
    setErrors(foundErrors);
    const firstInvalid = Object.keys(foundErrors)[0];
    if (firstInvalid) {
      setFormError("Please fix the highlighted fields.");
      document.getElementById(`event-${firstInvalid}`)?.focus();
      return;
    }

    setSaving(true);
    setFormError("");
    const payload = toPayload(form);

    // .select("id").single() makes Supabase return the saved row, so we can
    // tell when RLS silently blocked the change (no row comes back).
    const query = isEdit
      ? supabase.from("events").update(payload).eq("id", event.id)
      : supabase.from("events").insert(payload);
    const { data: saved, error } = await query.select("id").single();

    if (error || !saved) {
      console.error("Saving event failed:", error);
      setSaving(false);
      setFormError("Could not save the event. Please try again.");
      toast.error("Something went wrong. Please try again.");
      return;
    }

    // Only one event should be featured: un-feature all the others
    if (payload.featured) {
      const { error: featuredError } = await supabase
        .from("events")
        .update({ featured: false })
        .eq("featured", true)
        .neq("id", saved.id);
      if (featuredError) console.error("Could not clear other featured events:", featuredError);
    }

    toast.success(isEdit ? "Event updated successfully" : "Event created successfully");
    navigate("/admin/events");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {formError && (
        <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-red-400/40 bg-red-400/10 p-3.5 text-sm text-red-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {formError}
        </div>
      )}

      <Section title="Basic information">
        <TextInput id="event-title" name="title" label="Event name" required placeholder="Code Clash 2026" value={form.title} onChange={onChange} error={errors.title} maxLength={120} />
        <SelectInput id="event-category" name="category" label="Category" required value={form.category} onChange={onChange} error={errors.category} options={CATEGORY_OPTIONS} />
        <TextArea id="event-description" name="description" label="Description" required rows={5} placeholder="What is this event about?" value={form.description} onChange={onChange} error={errors.description} />
      </Section>

      <Section title="Schedule">
        <div className="grid gap-5 sm:grid-cols-3">
          <TextInput id="event-date" name="date" type="date" label="Date" required value={form.date} onChange={onChange} error={errors.date} />
          <TextInput id="event-start_time" name="start_time" type="time" label="Start time" value={form.start_time} onChange={onChange} error={errors.start_time} />
          <TextInput id="event-end_time" name="end_time" type="time" label="End time" value={form.end_time} onChange={onChange} error={errors.end_time} />
        </div>
        <TextInput id="event-registration_deadline" name="registration_deadline" type="datetime-local" label="Registration deadline" hint="Optional. If empty, registration stays open until the event starts." value={form.registration_deadline} onChange={onChange} error={errors.registration_deadline} />
      </Section>

      <Section title="Location">
        <TextInput id="event-venue" name="venue" label="Venue" required placeholder="ABES Engineering College, Seminar Hall" value={form.venue} onChange={onChange} error={errors.venue} />
      </Section>

      <Section title="Additional information">
        <TextArea id="event-eligibility" name="eligibility" label="Eligibility" rows={2} placeholder="Who can join?" value={form.eligibility} onChange={onChange} />
        <TextArea id="event-rules" name="rules" label="Rules" rows={4} hint="Write one rule per line." placeholder={"Solo participation only.\nNo plagiarism."} value={form.rules} onChange={onChange} />
      </Section>

      <Section title="Display">
        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink-100">Banner image</span>
          {form.image_url && (
            <div className="relative mb-3 aspect-[16/8] max-w-md overflow-hidden rounded-xl border border-ink-700 bg-ink-800">
              <img src={form.image_url} alt="Banner preview" className="h-full w-full object-cover" onError={() => setErrors((p) => ({ ...p, image_url: "This image could not be loaded. Check the link." }))} />
              <button type="button" onClick={() => setField("image_url", "")} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink-950/80 text-ink-100 hover:bg-ink-950" aria-label="Remove image">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
          <input ref={fileInput} type="file" accept={IMAGE_TYPES.join(",")} onChange={handleFile} className="sr-only" id="event-image-file" tabIndex={-1} />
          <Button variant="secondary" onClick={() => fileInput.current?.click()} disabled={uploading}>
            {uploading ? <Spinner className="h-4 w-4" /> : <ImageUp className="h-4 w-4" aria-hidden="true" />}
            {uploading ? "Uploading..." : "Upload image"}
          </Button>
          <p className="mt-1.5 text-xs text-ink-300">JPG, PNG or WebP, up to 2 MB.</p>
        </div>

        <TextInput id="event-image_url" name="image_url" label="Or paste an image link" placeholder="https://..." value={form.image_url} onChange={onChange} error={errors.image_url} />

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setField("featured", e.target.checked)}
            className="mt-0.5 h-5 w-5 rounded border-ink-600 bg-ink-900 accent-[#ff6b1f]"
          />
          <span>
            <span className="block text-sm font-medium text-ink-100">Feature this event on the home page</span>
            <span className="block text-xs text-ink-300">Only one event is featured at a time. This replaces the current one.</span>
          </span>
        </label>
      </Section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" size="lg" to="/admin/events">Cancel</Button>
        <Button type="submit" size="lg" loading={saving} disabled={uploading}>
          {saving ? "Saving..." : isEdit ? "Save changes" : "Create event"}
        </Button>
      </div>
    </form>
  );
}
