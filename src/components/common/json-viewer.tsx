import { Check, Copy, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

function tokenize(json: string) {
  return json.split(/(\"(?:\\.|[^\"])*\"\s*:|\"(?:\\.|[^\"])*\"|\b-?\d+\.?\d*\b|\btrue\b|\bfalse\b|\bnull\b)/g);
}

function tone(token: string) {
  if (/^\s*$/.test(token)) return "";
  if (/:$/.test(token.trim())) return "text-chart-3";
  if (token.startsWith('"')) return "text-success";
  if (/^(true|false|null)$/.test(token)) return "text-warning";
  if (/^-?\d/.test(token)) return "text-chart-1";
  return "text-muted-foreground";
}

export function JsonViewer({ data, filename = "response.json" }: { data: unknown; filename?: string }) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(data, null, 2);

  const copy = async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    toast.success("JSON copied to clipboard");
    setTimeout(() => setCopied(false), 1600);
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([json], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("JSON downloaded");
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-terminal">
      <div className="flex items-center justify-between gap-2 border-b border-border/60 px-3 py-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{filename}</span>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs" onClick={copy} aria-label="Copy JSON">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} Copy
          </Button>
          <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs" onClick={download} aria-label="Download JSON">
            <Download className="h-3.5 w-3.5" /> Download
          </Button>
        </div>
      </div>
      <pre className="scrollbar-thin max-h-[340px] overflow-auto p-4 font-mono text-xs leading-relaxed text-terminal-foreground">
        <code>
          {tokenize(json).map((t, i) => (
            <span key={i} className={tone(t)}>
              {t}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}