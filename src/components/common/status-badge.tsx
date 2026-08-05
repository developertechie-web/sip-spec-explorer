import { cn } from "@/lib/utils";
import type { ApiStatus, HttpMethod } from "@/lib/mock-data";

export function StatusBadge({ status }: { status: ApiStatus | "success" | "failed" }) {
  const map = {
    healthy: ["Healthy", "border-success/40 bg-success/10 text-success"],
    success: ["Success", "border-success/40 bg-success/10 text-success"],
    warning: ["Warning", "border-warning/40 bg-warning/10 text-warning"],
    failed: ["Failed", "border-destructive/40 bg-destructive/10 text-destructive"],
  } as const;
  const [label, classes] = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", classes)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export function MethodBadge({ method }: { method: HttpMethod }) {
  const tone: Record<HttpMethod, string> = {
    GET: "text-chart-1 border-chart-1/40 bg-chart-1/10",
    POST: "text-success border-success/40 bg-success/10",
    PUT: "text-warning border-warning/40 bg-warning/10",
    PATCH: "text-chart-3 border-chart-3/40 bg-chart-3/10",
    DELETE: "text-destructive border-destructive/40 bg-destructive/10",
  };
  return (
    <span className={cn("inline-flex rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold", tone[method])}>
      {method}
    </span>
  );
}