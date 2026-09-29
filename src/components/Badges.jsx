import { CheckCircle2, CircleDot, Lock } from "lucide-react";
import { STATUS_LABEL } from "../utils/eventStatus";

// Same look everywhere: pill with a border. Status also has an icon,
// so meaning never depends on colour alone.
const statusStyles = {
  open: { icon: CircleDot, classes: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" },
  closed: { icon: Lock, classes: "border-amber-400/30 bg-amber-400/10 text-amber-300" },
  completed: { icon: CheckCircle2, classes: "border-ink-600 bg-ink-800 text-ink-300" },
};

export function StatusBadge({ status }) {
  const { icon: Icon, classes } = statusStyles[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${classes}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function CategoryBadge({ category }) {
  return (
    <span className="inline-flex items-center rounded-full border border-ember-500/30 bg-ember-500/10 px-2.5 py-1 text-xs font-semibold text-ember-300">
      {category}
    </span>
  );
}
