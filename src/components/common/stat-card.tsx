import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  loading,
  index = 0,
  tone = "default",
}: {
  label: string;
  value: string;
  delta?: string;
  icon: LucideIcon;
  loading?: boolean;
  index?: number;
  tone?: "default" | "success" | "danger";
}) {
  if (loading) {
    return (
      <div className="glass-panel p-5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-4 h-8 w-28" />
        <Skeleton className="mt-3 h-3 w-20" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="glass-panel group relative overflow-hidden p-5"
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-brand opacity-10 blur-2xl transition-opacity group-hover:opacity-25" />
      <div className="flex items-center justify-between gap-3">
        <span className="truncate text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary/70">
          <Icon className="h-4 w-4 text-primary" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
      {delta ? (
        <p
          className={cn(
            "mt-2 text-xs",
            tone === "success" && "text-success",
            tone === "danger" && "text-destructive",
            tone === "default" && "text-muted-foreground",
          )}
        >
          {delta}
        </p>
      ) : null}
    </motion.div>
  );
}