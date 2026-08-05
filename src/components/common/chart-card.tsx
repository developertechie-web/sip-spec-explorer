import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export function ChartCard({
  title,
  description,
  children,
  loading,
  index = 0,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  loading?: boolean;
  index?: number;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.06, ease: "easeOut" }}
      className={`glass-panel p-5 ${className ?? ""}`}
    >
      <div className="mb-4 min-w-0">
        <h2 className="truncate text-sm font-semibold tracking-tight">{title}</h2>
        {description ? <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> : null}
      </div>
      {loading ? <Skeleton className="h-[240px] w-full rounded-xl" /> : children}
    </motion.section>
  );
}