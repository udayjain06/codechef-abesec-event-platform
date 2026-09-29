// Event status is calculated from dates, so admins never maintain it by hand.
//   completed -> the event has ended
//   closed    -> the registration deadline (or the event start) has passed
//   open      -> otherwise

function toTime(value) {
  return value ? value.slice(0, 5) : null; // "16:00:00" -> "16:00"
}

export function getEventStart(event) {
  return new Date(`${event.date}T${toTime(event.start_time) || "00:00"}`);
}

export function getEventEnd(event) {
  const time = toTime(event.end_time) || toTime(event.start_time);
  return time ? new Date(`${event.date}T${time}`) : new Date(`${event.date}T23:59:59`);
}

export function getEventStatus(event, now = new Date()) {
  if (now > getEventEnd(event)) return "completed";
  const deadline = event.registration_deadline
    ? new Date(event.registration_deadline)
    : getEventStart(event);
  return now > deadline ? "closed" : "open";
}

export const STATUS_LABEL = {
  open: "Registration Open",
  closed: "Registration Closed",
  completed: "Completed",
};

export function isUpcoming(event, now = new Date()) {
  return getEventStatus(event, now) !== "completed";
}
