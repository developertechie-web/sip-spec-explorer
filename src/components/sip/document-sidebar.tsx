import { useRef, useState } from "react";
import {
  BookMarked,
  FileText,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  TriangleAlert,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BUILTIN_RFCS, type IndexedDoc } from "@/lib/sip-api";
import { cn } from "@/lib/utils";

type Props = {
  documents: IndexedDoc[];
  loading: boolean;
  uploading: boolean;
  onUpload: (files: File[]) => void;
  onAddBuiltin: (rfc: string) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
};

function statusDot(status: IndexedDoc["status"]) {
  if (status === "ready") return <span className="h-1.5 w-1.5 rounded-full bg-success" />;
  if (status === "error") return <TriangleAlert className="h-3 w-3 text-destructive" />;
  return <Loader2 className="h-3 w-3 animate-spin text-warning" />;
}

export function DocumentSidebar({
  documents,
  loading,
  uploading,
  onUpload,
  onAddBuiltin,
  onDelete,
  onRefresh,
}: Props) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const loadedRfcs = new Set(documents.map((d) => d.name));

  return (
    <aside className="flex h-full min-h-0 flex-col gap-5 overflow-y-auto scrollbar-thin border-border bg-sidebar p-4 lg:border-r">
      <section>
        <h2 className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Upload documents
        </h2>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            onUpload(Array.from(e.dataTransfer.files));
          }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-7 text-center transition-colors",
            dragging
              ? "border-primary bg-primary/10"
              : "border-border bg-card/40 hover:border-primary/60 hover:bg-card",
          )}
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : (
            <UploadCloud className="h-6 w-6 text-primary" />
          )}
          <p className="text-xs font-medium">Drop RFC files here</p>
          <p className="font-mono text-[10px] text-muted-foreground">.txt .md .pdf — or click to browse</p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".txt,.md,.pdf,text/plain,application/pdf"
            className="hidden"
            onChange={(e) => {
              onUpload(Array.from(e.target.files ?? []));
              e.target.value = "";
            }}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-2 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          <BookMarked className="h-3.5 w-3.5" /> Standard RFCs
        </h2>
        <ul className="space-y-1">
          {BUILTIN_RFCS.map((r) => {
            const added = loadedRfcs.has(r.rfc);
            return (
              <li key={r.rfc}>
                <button
                  type="button"
                  disabled={added}
                  onClick={() => onAddBuiltin(r.rfc)}
                  className="group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-secondary disabled:opacity-50"
                >
                  <span className="font-mono text-[11px] font-semibold text-primary">{r.rfc}</span>
                  <span className="flex-1 truncate text-[11px] text-muted-foreground">{r.title}</span>
                  {!added && <Plus className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="min-h-0 flex-1">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Knowledge base ({documents.length})
          </h2>
          <button
            type="button"
            onClick={onRefresh}
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Refresh document list"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          </button>
        </div>

        {loading && documents.length === 0 ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-11 animate-pulse rounded-md bg-secondary/70" />
            ))}
          </div>
        ) : documents.length === 0 ? (
          <p className="rounded-md border border-dashed border-border px-3 py-6 text-center text-[11px] text-muted-foreground">
            No documents indexed yet.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="group flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-2"
              >
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{doc.name}</p>
                  <p className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                    {statusDot(doc.status)}
                    {doc.status}
                    {doc.chunks != null && ` · ${doc.chunks} chunks`}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                  onClick={() => onDelete(doc.id)}
                  aria-label={`Delete ${doc.name}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
}