export type ApiStatus = "healthy" | "warning" | "failed";
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiEndpoint = {
  id: string;
  name: string;
  method: HttpMethod;
  environment: "production" | "staging" | "development";
  latency: number;
  status: ApiStatus;
  code: number;
  lastExecuted: string;
};

const names = [
  "Auth / Token Exchange",
  "Billing / Invoices",
  "Users / Profile Sync",
  "Search / Autocomplete",
  "Payments / Charge Intent",
  "Notifications / Dispatch",
  "Inventory / Stock Levels",
  "Analytics / Event Ingest",
  "Media / Upload Signer",
  "Orders / Fulfilment",
  "Webhooks / n8n Bridge",
  "Reports / Export Queue",
  "Geo / Address Lookup",
  "Feature Flags / Resolve",
  "Support / Ticket Create",
  "Partners / Sync Ledger",
  "Email / Template Render",
  "Sessions / Revoke",
];

const methods: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const envs = ["production", "staging", "development"] as const;

// deterministic pseudo-random so SSR and client agree
function seeded(i: number, salt = 1) {
  const x = Math.sin((i + 1) * 12.9898 * salt) * 43758.5453;
  return x - Math.floor(x);
}

export const apiEndpoints: ApiEndpoint[] = names.map((name, i) => {
  const r = seeded(i);
  const status: ApiStatus = r > 0.86 ? "failed" : r > 0.68 ? "warning" : "healthy";
  const latency = Math.round(40 + seeded(i, 3) * (status === "healthy" ? 260 : 1400));
  return {
    id: `api_${(i + 1).toString().padStart(3, "0")}`,
    name,
    method: methods[Math.floor(seeded(i, 7) * methods.length)] as HttpMethod,
    environment: envs[Math.floor(seeded(i, 11) * envs.length)] as ApiEndpoint["environment"],
    latency,
    status,
    code: status === "failed" ? (r > 0.94 ? 503 : 500) : status === "warning" ? 429 : 200,
    lastExecuted: new Date(Date.UTC(2026, 7, 5, 11, 0) - i * 7 * 60 * 1000).toISOString(),
  };
});

export const kpis = {
  totalApis: apiEndpoints.length,
  healthy: apiEndpoints.filter((a) => a.status === "healthy").length,
  failed: apiEndpoints.filter((a) => a.status === "failed").length,
  avgResponse: Math.round(apiEndpoints.reduce((s, a) => s + a.latency, 0) / apiEndpoints.length),
  executions: 148_392,
  successRate: 98.4,
};

export const responseTrend = Array.from({ length: 24 }, (_, i) => ({
  time: `${i.toString().padStart(2, "0")}:00`,
  p50: Math.round(90 + seeded(i, 2) * 70),
  p95: Math.round(220 + seeded(i, 5) * 320),
}));

export const successRateTrend = Array.from({ length: 14 }, (_, i) => ({
  day: `D-${14 - i}`,
  success: +(95 + seeded(i, 9) * 4.8).toFixed(2),
}));

export const statusDistribution = [
  { name: "2xx", value: 8420 },
  { name: "3xx", value: 610 },
  { name: "4xx", value: 940 },
  { name: "5xx", value: 180 },
];

export const trafficAnalytics = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  requests: Math.round(20000 + seeded(i, 13) * 42000),
  errors: Math.round(300 + seeded(i, 17) * 1800),
}));

export const executionTrend = Array.from({ length: 14 }, (_, i) => ({
  day: `D-${14 - i}`,
  runs: Math.round(400 + seeded(i, 19) * 900),
  failures: Math.round(5 + seeded(i, 23) * 60),
}));

export type Execution = {
  id: string;
  api: string;
  method: HttpMethod;
  environment: string;
  status: "success" | "failed";
  duration: number;
  timestamp: string;
  response: Record<string, unknown>;
};

export const executions: Execution[] = Array.from({ length: 26 }, (_, i) => {
  const ok = seeded(i, 29) > 0.18;
  const api = apiEndpoints[i % apiEndpoints.length] as ApiEndpoint;
  return {
    id: `exec_${(9000 + i).toString(36)}${i}`,
    api: api.name,
    method: api.method,
    environment: api.environment,
    status: ok ? "success" : "failed",
    duration: Math.round(60 + seeded(i, 31) * 2200),
    timestamp: new Date(Date.UTC(2026, 7, 5, 12, 0) - i * 23 * 60 * 1000).toISOString(),
    response: ok
      ? { ok: true, executionId: `n8n_${i}`, workflow: "api-pulse-monitor", items: 3 }
      : { ok: false, error: "UpstreamTimeout", message: "Workflow node timed out after 30000ms" },
  };
});

export const heatmap = Array.from({ length: 7 }, (_, d) =>
  Array.from({ length: 24 }, (_, h) => Math.round(seeded(d * 24 + h, 37) * 100)),
);

export const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function formatTime(iso: string) {
  return new Date(iso).toISOString().replace("T", " ").slice(0, 16) + " UTC";
}