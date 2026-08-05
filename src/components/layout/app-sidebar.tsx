import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, BarChart3, History, LayoutDashboard, Settings, Webhook, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "API Monitoring", url: "/monitoring", icon: Activity },
  { title: "Webhook Runner", url: "/webhooks", icon: Webhook },
  { title: "Execution History", url: "/history", icon: History },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
] as const;

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav aria-label="Main navigation" className="flex h-full w-full flex-col gap-1 p-3">
      <Link
        to="/"
        onClick={onNavigate}
        className="mb-4 flex items-center gap-2.5 rounded-xl px-2 py-2"
        aria-label="API Pulse AI home"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-brand shadow-glow">
          <Zap className="h-4.5 w-4.5 text-primary-foreground" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold tracking-tight">API Pulse AI</span>
          <span className="block truncate text-[11px] text-muted-foreground">Enterprise monitoring</span>
        </span>
      </Link>

      {items.map((item) => {
        const active = pathname === item.url;
        return (
          <Link
            key={item.url}
            to={item.url}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-soft"
                : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
            )}
          >
            <item.icon className={cn("h-4 w-4 shrink-0 transition-transform group-hover:scale-110", active && "text-primary")} />
            <span className="truncate">{item.title}</span>
          </Link>
        );
      })}

      <div className="mt-auto rounded-2xl border border-border/60 bg-gradient-subtle p-4">
        <p className="text-xs font-medium">Pro workspace</p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
          18 monitors · 5s polling · n8n bridge connected
        </p>
      </div>
    </nav>
  );
}