import { getEventStart, getEventEnd } from "./eventStatus";

// Builds an "Add to Google Calendar" link. Times are treated as India time.
function toCalendarStamp(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
}

export function googleCalendarUrl(event) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toCalendarStamp(getEventStart(event))}/${toCalendarStamp(getEventEnd(event))}`,
    details: (event.description || "").slice(0, 500),
    location: event.venue || "",
    ctz: "Asia/Kolkata",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
