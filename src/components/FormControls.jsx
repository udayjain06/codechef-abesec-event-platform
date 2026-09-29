import { AlertCircle } from "lucide-react";

// Shared label + error + hint wrapper for every form field in the app.
function FieldShell({ id, label, error, hint, required, hideLabel, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className={hideLabel ? "sr-only" : "mb-1.5 block text-sm font-medium text-ink-100"}
      >
        {label}
        {required && (
          <span aria-hidden="true" className="text-ember-400">
            {" "}*
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-300">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-start gap-1.5 text-sm text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

export function controlClasses(error) {
  return `w-full rounded-lg border bg-ink-900 px-3.5 py-2.5 text-base text-ink-100 transition-colors placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-ember-500/60 sm:text-sm ${
    error ? "border-red-400/70" : "border-ink-600 hover:border-ink-500 focus:border-ember-500"
  }`;
}

function describedBy(id, error, hint) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

export function TextInput({ id, label, error, hint, required, hideLabel, ...props }) {
  return (
    <FieldShell {...{ id, label, error, hint, required, hideLabel }}>
      <input
        id={id}
        className={controlClasses(error)}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy(id, error, hint)}
        required={required}
        {...props}
      />
    </FieldShell>
  );
}

export function TextArea({ id, label, error, hint, required, rows = 4, ...props }) {
  return (
    <FieldShell {...{ id, label, error, hint, required }}>
      <textarea
        id={id}
        rows={rows}
        className={`${controlClasses(error)} resize-y`}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy(id, error, hint)}
        required={required}
        {...props}
      />
    </FieldShell>
  );
}

// options: [{ value, label }]
export function SelectInput({ id, label, error, hint, required, hideLabel, options, ...props }) {
  return (
    <FieldShell {...{ id, label, error, hint, required, hideLabel }}>
      <select
        id={id}
        className={controlClasses(error)}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy(id, error, hint)}
        required={required}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
