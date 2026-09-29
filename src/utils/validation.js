import { CATEGORIES } from "../data/categories";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Accepts "9876543210", "+91 98765 43210", "098765-43210" and returns 10 digits
export function normalizePhone(value) {
  let digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

// Returns an object of errors, e.g. { email: "Please enter a valid email address." }
// An empty object means the form is valid.
export function validateRegistration(form) {
  const errors = {};
  const name = form.name.trim();
  const email = form.email.trim();
  const collegeYear = form.collegeYear.trim();

  if (!name) errors.name = "Please enter your full name.";
  else if (name.length < 2) errors.name = "Your name must be at least 2 characters.";

  if (!email) errors.email = "Please enter your email address.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Please enter a valid email address.";

  if (!collegeYear) errors.collegeYear = "Please enter your college and year, for example: ABESEC, 2nd year.";
  else if (collegeYear.length < 2) errors.collegeYear = "Please enter your college and year.";

  if (!form.phone.trim()) errors.phone = "Please enter your phone number.";
  else if (!/^[6-9]\d{9}$/.test(normalizePhone(form.phone)))
    errors.phone = "Please enter a valid 10-digit Indian mobile number.";

  return errors;
}

// Validation for the admin "create / edit event" form
export function validateEvent(form) {
  const errors = {};

  if (!form.title.trim()) errors.title = "Please enter an event name.";
  else if (form.title.trim().length < 3) errors.title = "The event name must be at least 3 characters.";
  else if (form.title.trim().length > 120) errors.title = "The event name must be 120 characters or fewer.";

  if (!CATEGORIES.includes(form.category)) errors.category = "Please choose a category.";
  if (!form.description.trim()) errors.description = "Please add a short description.";
  if (!form.date) errors.date = "Please choose the event date.";
  if (!form.venue.trim()) errors.venue = "Please enter the venue.";

  if (form.start_time && form.end_time && form.end_time <= form.start_time)
    errors.end_time = "The end time must be after the start time.";

  if (form.registration_deadline && form.date) {
    const start = new Date(`${form.date}T${form.start_time || "00:00"}`);
    if (new Date(form.registration_deadline) > start)
      errors.registration_deadline = "The registration deadline must be before the event starts.";
  }

  if (form.image_url.trim() && !/^https?:\/\//i.test(form.image_url.trim()))
    errors.image_url = "The image link must start with http:// or https://";

  return errors;
}
