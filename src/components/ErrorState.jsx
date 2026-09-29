import { AlertTriangle, RefreshCw } from "lucide-react";
import Button from "./Button";

// Friendly message only. Raw database errors are logged to the console instead.
export default function ErrorState({
  title = "Something went wrong",
  message = "Please check your connection and try again.",
  onRetry,
}) {
  return (
    <div role="alert" className="flex flex-col items-center rounded-2xl border border-red-400/30 bg-red-400/5 px-6 py-14 text-center">
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-400/10 text-red-300">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="text-lg font-bold text-ink-100">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink-300">{message}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-5" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Try again
        </Button>
      )}
    </div>
  );
}
