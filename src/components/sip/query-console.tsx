import { useEffect, useRef } from "react";
import { CornerDownLeft, Loader2, Radio, Terminal, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownAnswer } from "./markdown-answer";
import { SourcesPanel } from "./sources-panel";
import type { RagSource } from "@/lib/sip-api";

export type ChatTurn = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: RagSource[];
  latencyMs?: number;
  error?: boolean;
};

const QUICK_PROMPTS = [
  "Via header parameters",
  "UAC State Machine",
  "401 Unauthorized requirements",
  "Forking proxies (§16.7)",
  "Record-Route vs Route",
  "SDP offer/answer rules",
];

type Props = {
  turns: ChatTurn[];
  input: string;
  loading: boolean;
  onInput: (v: string) => void;
  onSubmit: () => void;
};

export function QueryConsole({ turns, input, loading, onInput, onSubmit }: Props) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, loading]);

  return (
    <section className="flex h-full min-h-0 flex-col">
      <div className="scrollbar-thin flex-1 overflow-y-auto px-4 py-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          {turns.length === 0 && (
            <div className="rounded-lg border border-border bg-card/60 p-6">
              <div className="mb-2 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary" />
                <h2 className="font-mono text-sm font-semibold tracking-tight">RAG query console</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Ask anything about SIP protocol behaviour, header rules, transaction state machines or SDP
                negotiation. Answers are grounded in the RFCs loaded in your knowledge base.
              </p>
            </div>
          )}

          {turns.map((turn) =>
            turn.role === "user" ? (
              <div key={turn.id} className="flex justify-end gap-3">
                <div className="max-w-[85%] rounded-lg rounded-br-sm bg-primary px-3.5 py-2.5 text-sm text-primary-foreground">
                  {turn.content}
                </div>
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-card">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>
            ) : (
              <div key={turn.id} className="flex gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-primary/40 bg-primary/10">
                  <Radio className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  {turn.error ? (
                    <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 font-mono text-xs text-destructive">
                      {turn.content}
                    </p>
                  ) : (
                    <>
                      <MarkdownAnswer>{turn.content}</MarkdownAnswer>
                      <SourcesPanel sources={turn.sources ?? []} />
                      {turn.latencyMs != null && (
                        <p className="mt-1.5 font-mono text-[10px] text-muted-foreground">{turn.latencyMs} ms</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            ),
          )}

          {loading && (
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-primary/40 bg-primary/10">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              </div>
              <div className="flex-1 space-y-2 pt-1">
                <p className="font-mono text-[11px] text-muted-foreground">retrieving RFC context…</p>
                <div className="h-3 w-11/12 animate-pulse rounded bg-secondary" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-secondary" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-secondary" />
                <div className="h-20 w-full animate-pulse rounded bg-secondary/70" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      <div className="border-t border-border bg-card/50 px-4 py-3 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onInput(p)}
                className="rounded-full border border-border bg-card px-2.5 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
              >
                {p}
              </button>
            ))}
          </div>
          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => onInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit();
                }
              }}
              rows={2}
              placeholder="What are the rules for forking proxies under RFC 3261 Section 16.7?"
              className="min-h-[72px] resize-none bg-background pb-11 font-mono text-[13px]"
            />
            <Button
              onClick={onSubmit}
              disabled={loading || !input.trim()}
              className="absolute bottom-2.5 right-2.5 h-8 gap-1.5 font-mono text-xs"
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CornerDownLeft className="h-3.5 w-3.5" />
              )}
              Query
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}