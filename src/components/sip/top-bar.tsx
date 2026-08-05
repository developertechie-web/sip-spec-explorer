import { useState } from "react";
import { Loader2, Moon, PanelLeft, Settings, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DEFAULT_BASE_URL } from "@/lib/sip-api";

export type Health = "checking" | "connected" | "disconnected";

type Props = {
  health: Health;
  baseUrl: string;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onSaveBaseUrl: (url: string) => void;
  onToggleSidebar: () => void;
};

export function TopBar({ health, baseUrl, theme, onToggleTheme, onSaveBaseUrl, onToggleSidebar }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(baseUrl);

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card/70 px-3 backdrop-blur lg:px-5">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onToggleSidebar} aria-label="Toggle sidebar">
        <PanelLeft className="h-4 w-4" />
      </Button>

      <h1 className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight">
        <span aria-hidden>📞</span> SIP RFC Explorer
      </h1>

      <span
        className={cn(
          "flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider",
          health === "connected" && "border-success/40 bg-success/10 text-success",
          health === "disconnected" && "border-destructive/40 bg-destructive/10 text-destructive",
          health === "checking" && "border-border bg-secondary text-muted-foreground",
        )}
      >
        {health === "checking" ? (
          <Loader2 className="h-2.5 w-2.5 animate-spin" />
        ) : (
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              health === "connected" ? "bg-success animate-pulse" : "bg-destructive",
            )}
          />
        )}
        {health === "checking" ? "Checking" : health === "connected" ? "Connected" : "Disconnected"}
      </span>

      <span className="ml-auto hidden max-w-[280px] truncate font-mono text-[11px] text-muted-foreground md:inline">
        {baseUrl}
      </span>

      <Button variant="ghost" size="icon" onClick={onToggleTheme} aria-label="Toggle theme">
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>

      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (o) setDraft(baseUrl);
        }}
      >
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Settings">
            <Settings className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-mono text-sm">Backend settings</DialogTitle>
            <DialogDescription>
              Point the explorer at your RAG engine. The URL is stored locally in this browser.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="base-url" className="font-mono text-xs">
              Backend API Base URL
            </Label>
            <Input
              id="base-url"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={DEFAULT_BASE_URL}
              className="font-mono text-xs"
            />
            <p className="font-mono text-[10px] text-muted-foreground">
              Expects /health, /documents and /query endpoints.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDraft(DEFAULT_BASE_URL)}>
              Reset
            </Button>
            <Button
              onClick={() => {
                onSaveBaseUrl(draft.trim() || DEFAULT_BASE_URL);
                setOpen(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}