import { useState } from "react";
import { ChevronDown, Quote } from "lucide-react";
import type { RagSource } from "@/lib/sip-api";
import { cn } from "@/lib/utils";

export function SourcesPanel({ sources }: { sources: RagSource[] }) {
  const [open, setOpen] = useState(false);
  if (!sources.length) return null;

  return (
    <div className="mt-3 overflow-hidden rounded-md border border-border bg-card/60">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-secondary/60"
      >
        <Quote className="h-3.5 w-3.5 text-primary" />
        <span className="flex-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Retrieved RFC context &amp; sources ({sources.length})
        </span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <ul className="space-y-2 border-t border-border p-3">
          {sources.map((s, i) => (
            <li key={s.id ?? i} className="rounded-md border border-border bg-terminal p-3">
              <div className="mb-1.5 flex flex-wrap items-center gap-2 font-mono text-[10px]">
                <span className="rounded bg-primary/15 px-1.5 py-0.5 font-semibold text-primary">
                  {s.document ?? "document"}
                </span>
                {s.section && <span className="text-muted-foreground">§ {s.section}</span>}
                {s.page != null && <span className="text-muted-foreground">p.{s.page}</span>}
                {s.score != null && (
                  <span className="ml-auto text-muted-foreground">score {s.score.toFixed(3)}</span>
                )}
              </div>
              <p className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-terminal-foreground">
                {s.snippet}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}