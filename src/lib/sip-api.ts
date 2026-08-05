export const DEFAULT_BASE_URL = "http://localhost:8080/api/sip";
const STORAGE_KEY = "sip-rfc-explorer:baseUrl";

export function getStoredBaseUrl() {
  if (typeof window === "undefined") return DEFAULT_BASE_URL;
  return window.localStorage.getItem(STORAGE_KEY) ?? DEFAULT_BASE_URL;
}

export function storeBaseUrl(url: string) {
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, url);
}

export type IndexedDoc = {
  id: string;
  name: string;
  status: "indexing" | "ready" | "error";
  chunks?: number;
  sizeBytes?: number;
  builtin?: boolean;
};

export type RagSource = {
  id?: string;
  document?: string;
  section?: string;
  page?: number;
  score?: number;
  snippet: string;
};

export type RagAnswer = {
  answer: string;
  sources: RagSource[];
  latencyMs?: number;
  model?: string;
};

const trim = (base: string) => base.replace(/\/+$/, "");

async function request<T>(base: string, path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (!(init?.body instanceof FormData)) headers.set("Content-Type", "application/json");
  const res = await fetch(`${trim(base)}${path}`, { ...init, headers });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

export async function checkHealth(base: string) {
  const res = await fetch(`${trim(base)}/health`, { method: "GET" });
  if (!res.ok) throw new Error(`${res.status}`);
  return true;
}

export function listDocuments(base: string) {
  return request<{ documents: IndexedDoc[] } | IndexedDoc[]>(base, "/documents").then((d) =>
    Array.isArray(d) ? d : (d.documents ?? []),
  );
}

export function uploadDocument(base: string, file: File) {
  const form = new FormData();
  form.append("file", file);
  return request<IndexedDoc>(base, "/documents", { method: "POST", body: form });
}

export function addBuiltinRfc(base: string, rfc: string) {
  return request<IndexedDoc>(base, "/documents/builtin", {
    method: "POST",
    body: JSON.stringify({ rfc }),
  });
}

export function deleteDocument(base: string, id: string) {
  return request<{ ok: boolean }>(base, `/documents/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export function queryRag(base: string, question: string, documentIds?: string[]) {
  return request<RagAnswer>(base, "/query", {
    method: "POST",
    body: JSON.stringify({ question, documentIds }),
  });
}

export const BUILTIN_RFCS = [
  { rfc: "RFC 3261", title: "SIP: Session Initiation Protocol" },
  { rfc: "RFC 3262", title: "Reliability of Provisional Responses (PRACK)" },
  { rfc: "RFC 3264", title: "An Offer/Answer Model with SDP" },
  { rfc: "RFC 3311", title: "SIP UPDATE Method" },
  { rfc: "RFC 3515", title: "SIP REFER Method" },
  { rfc: "RFC 4566", title: "SDP: Session Description Protocol" },
];