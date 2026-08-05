import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/70 px-6 py-14 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary/70">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </span>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="max-w-sm text-xs text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}