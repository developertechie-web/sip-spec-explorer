import { useState } from "react";
import { Check, Copy } from "lucide-react";

const SIP_METHODS =
  /^(INVITE|ACK|BYE|CANCEL|REGISTER|OPTIONS|PRACK|SUBSCRIBE|NOTIFY|PUBLISH|INFO|REFER|MESSAGE|UPDATE)\b/;

function renderLine(line: string, i: number) {
  // SIP/SDP-aware colouring
  if (SIP_METHODS.test(line) || /^SIP\/2\.0\s+\d{3}/.test(line)) {
    return (
      <div key={i} className="text-primary font-semibold">
        {line}
      </div>
    );
  }
  const header = line.match(/^([A-Za-z-]+):\s?(.*)$/);
  if (header) {
    return (
      <div key={i}>
        <span className="text-chart-3">{header[1]}</span>
        <span className="text-muted-foreground">: </span>
        <span className="text-terminal-foreground">{header[2]}</span>
      </div>
    );
  }
  const sdp = line.match(/^([a-z])=(.*)$/);
  if (sdp) {
    return (
      <div key={i}>
        <span className="text-warning">{sdp[1]}=</span>
        <span className="text-terminal-foreground">{sdp[2]}</span>
      </div>
    );
  }
  if (line.trim().startsWith("//") || line.trim().startsWith("#")) {
    return (
      <div key={i} className="text-muted-foreground italic">
        {line}
      </div>
    );
  }
  return (
    <div key={i} className="text-terminal-foreground">
      {line || "\u00a0"}
    </div>
  );
}

export function CodeBlock({ code, lang }: { code: string; lang?: string | undefined }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="group relative my-3 overflow-hidden rounded-md border border-border bg-terminal">
      <div className="flex items-center justify-between border-b border-border/70 px-3 py-1.5">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {lang || "message"}
        </span>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
          }}
          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <pre className="scrollbar-thin overflow-x-auto px-3 py-2.5 font-mono text-[12.5px] leading-relaxed">
        <code>{code.replace(/\n$/, "").split("\n").map(renderLine)}</code>
      </pre>
    </div>
  );
}