import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { TopBar, type Health } from "@/components/sip/top-bar";
import { DocumentSidebar } from "@/components/sip/document-sidebar";
import { QueryConsole, type ChatTurn } from "@/components/sip/query-console";
import { useTheme } from "@/hooks/use-theme";
import {
  addBuiltinRfc,
  checkHealth,
  deleteDocument,
  getStoredBaseUrl,
  listDocuments,
  queryRag,
  storeBaseUrl,
  type IndexedDoc,
} from "@/lib/sip-api";
import { cn } from "@/lib/utils";

const TITLE = "SIP RFC Explorer — RAG console for SIP specifications";
const DESCRIPTION =
  "Upload RFC documents and query a RAG engine about SIP headers, transaction state machines, and protocol rules.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const uid = () => Math.random().toString(36).slice(2);

function Index() {
  const { theme, toggle } = useTheme();
  const [baseUrl, setBaseUrl] = useState(getStoredBaseUrl());
  const [health, setHealth] = useState<Health>("checking");
  const [documents, setDocuments] = useState<IndexedDoc[]>([]);
  const [docsLoading, setDocsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [querying, setQuerying] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => setBaseUrl(getStoredBaseUrl()), []);

  const refreshDocuments = useCallback(async () => {
    setDocsLoading(true);
    try {
      setDocuments(await listDocuments(baseUrl));
    } catch {
      setDocuments([]);
    } finally {
      setDocsLoading(false);
    }
  }, [baseUrl]);

  const ping = useCallback(async () => {
    setHealth("checking");
    try {
      await checkHealth(baseUrl);
      setHealth("connected");
    } catch {
      setHealth("disconnected");
    }
  }, [baseUrl]);

  useEffect(() => {
    void ping();
    void refreshDocuments();
    const t = setInterval(() => void ping(), 20000);
    return () => clearInterval(t);
  }, [ping, refreshDocuments]);

  const handleUpload = async (files: File[]) => {
    if (!files.length) return;
    setUploading(true);
    for (const file of files) {
      try {
        const doc = await uploadOne(file);
        setDocuments((d) => [...d.filter((x) => x.id !== doc.id), doc]);
        toast.success(`Indexed ${file.name}`);
      } catch (e) {
        toast.error(`Upload failed: ${file.name}`, { description: String(e) });
      }
    }
    setUploading(false);
    void refreshDocuments();
  };

  async function uploadOne(file: File) {
    const { uploadDocument } = await import("@/lib/sip-api");
    return uploadDocument(baseUrl, file);
  }

  const handleBuiltin = async (rfc: string) => {
    try {
      const doc = await addBuiltinRfc(baseUrl, rfc);
      setDocuments((d) => [...d, doc]);
      toast.success(`${rfc} added to the knowledge base`);
    } catch (e) {
      toast.error(`Could not load ${rfc}`, { description: String(e) });
    }
  };

  const handleDelete = async (id: string) => {
    const prev = documents;
    setDocuments((d) => d.filter((x) => x.id !== id));
    try {
      await deleteDocument(baseUrl, id);
    } catch (e) {
      setDocuments(prev);
      toast.error("Delete failed", { description: String(e) });
    }
  };

  const handleSubmit = async () => {
    const question = input.trim();
    if (!question || querying) return;
    setInput("");
    setTurns((t) => [...t, { id: uid(), role: "user", content: question }]);
    setQuerying(true);
    const started = performance.now();
    try {
      const res = await queryRag(baseUrl, question);
      setTurns((t) => [
        ...t,
        {
          id: uid(),
          role: "assistant",
          content: res.answer,
          sources: res.sources ?? [],
          latencyMs: res.latencyMs ?? Math.round(performance.now() - started),
        },
      ]);
    } catch (e) {
      setTurns((t) => [
        ...t,
        {
          id: uid(),
          role: "assistant",
          error: true,
          content: `Query failed — ${String(e)}. Check that the backend at ${baseUrl} is running.`,
        },
      ]);
    } finally {
      setQuerying(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <TopBar
        health={health}
        baseUrl={baseUrl}
        theme={theme}
        onToggleTheme={toggle}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
        onSaveBaseUrl={(url) => {
          storeBaseUrl(url);
          setBaseUrl(url);
          toast.success("Backend URL updated");
        }}
      />

      <div className="grid min-h-0 flex-1 lg:grid-cols-[320px_1fr]">
        <div
          className={cn(
            "min-h-0 lg:block",
            sidebarOpen ? "block border-b border-border max-h-[60vh]" : "hidden",
          )}
        >
          <DocumentSidebar
            documents={documents}
            loading={docsLoading}
            uploading={uploading}
            onUpload={handleUpload}
            onAddBuiltin={handleBuiltin}
            onDelete={handleDelete}
            onRefresh={refreshDocuments}
          />
        </div>

        <QueryConsole
          turns={turns}
          input={input}
          loading={querying}
          onInput={setInput}
          onSubmit={handleSubmit}
        />
      </div>
      <Toaster />
    </div>
  );
}
