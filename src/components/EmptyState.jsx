import { Inbox } from "lucide-react";

export default function EmptyState({ icon: Icon = Inbox, title, message, action }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-ink-600 px-6 py-14 text-center">
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ink-800 text-ember-400">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="text-lg font-bold text-ink-100">{title}</h3>
      {message && <p className="mt-1.5 max-w-sm text-sm text-ink-300">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
