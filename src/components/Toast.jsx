import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

const styles = {
  success: { icon: CheckCircle2, classes: "border-emerald-400/40 text-emerald-300" },
  error: { icon: AlertCircle, classes: "border-red-400/40 text-red-300" },
  info: { icon: Info, classes: "border-ink-500 text-ink-100" },
};

// Renders all active toasts in the corner. aria-live announces them to screen readers.
export function ToastViewport({ toasts, onDismiss }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-end gap-2 p-4 sm:inset-x-auto sm:right-0"
    >
      {toasts.map((toast) => {
        const { icon: Icon, classes } = styles[toast.type];
        return (
          <div
            key={toast.id}
            role={toast.type === "error" ? "alert" : "status"}
            className={`animate-toast pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border bg-ink-800 p-3.5 shadow-xl shadow-black/40 ${classes}`}
          >
            <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <p className="flex-1 text-sm text-ink-100">{toast.message}</p>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="rounded p-0.5 text-ink-300 hover:text-ink-100"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
