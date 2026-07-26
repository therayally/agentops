// Static demo data — generic, public-facing snapshot of an AI ops console.
// No real product names, vault names, agent names, or internal infrastructure.

export type McpStatus = "healthy" | "degraded" | "down";

export interface Mcp {
  name: string;
  description: string;
  status: McpStatus;
  latency: number; // ms
  calls1h: number;
  uptime: string;
  lastCheck: string;
}

export const mcps: Mcp[] = [
  { name: "vector-search",  description: "Embedding similarity",  status: "healthy",  latency: 4,   calls1h: 1842, uptime: "99.99%", lastCheck: "2s ago" },
  { name: "rate-limiter",   description: "Token bucket throttler", status: "healthy",  latency: 1,   calls1h: 4128, uptime: "99.99%", lastCheck: "1s ago" },
  { name: "sql-pool",       description: "Postgres connection pool", status: "healthy",  latency: 12,  calls1h: 921,  uptime: "99.97%", lastCheck: "4s ago" },
  { name: "object-store",   description: "S3-compatible blob",     status: "healthy",  latency: 28,  calls1h: 412,  uptime: "99.96%", lastCheck: "3s ago" },
  { name: "search-api",     description: "Hybrid search",          status: "degraded", latency: 247, calls1h: 67,   uptime: "98.42%", lastCheck: "12s ago" },
  { name: "cache",          description: "TTL+LRU layers",          status: "healthy",  latency: 2,   calls1h: 8912, uptime: "99.99%", lastCheck: "1s ago" },
  { name: "queue",          description: "Background jobs",         status: "healthy",  latency: 16,  calls1h: 284,  uptime: "99.95%", lastCheck: "5s ago" },
  { name: "metrics",        description: "Time-series telemetry",   status: "down",     latency: 0,   calls1h: 0,    uptime: "94.12%", lastCheck: "1m ago" },
];

export interface Process {
  pid: string;
  task: string;
  started: string;
  duration: number; // seconds
  tokens: number;
  state: "running" | "queued" | "awaiting" | "completed";
  category: "search" | "summary" | "classify" | "embed" | "extract" | "index";
  parent?: string;
}

export const processes: Process[] = [
  { pid: "j-7721", task: "Reprocess 412 pending extracts",     started: "2m ago",  duration: 124,  tokens: 8421,  state: "running",  category: "extract" },
  { pid: "j-7718", task: "Rebuild vector index from scratch",  started: "11m ago", duration: 671,  tokens: 24098, state: "running",  category: "index",   parent: "j-7700" },
  { pid: "j-7700", task: "Backfill 4 domain embeddings",        started: "23m ago", duration: 1402, tokens: 18432, state: "running",  category: "embed" },
  { pid: "j-7695", task: "Audit sitemap health across shards",  started: "34m ago", duration: 2041, tokens: 12883, state: "running",  category: "search" },
  { pid: "j-7689", task: "Generate 20 product card summaries",  started: "1h ago",  duration: 3602, tokens: 41204, state: "completed", category: "summary" },
  { pid: "j-7681", task: "Pipeline: nightly snapshot",          started: "8h ago",  duration: 47,   tokens: 0,     state: "completed", category: "index" },
  { pid: "j-7690", task: "Bulk-classify 1,284 docs",            started: "10m ago", duration: 600,  tokens: 7402,  state: "awaiting",  category: "classify" },
  { pid: "j-7693", task: "Re-rank search results shard 7",      started: "15m ago", duration: 0,    tokens: 0,     state: "queued",    category: "search" },
];

export interface Suggestion {
  rank: number;
  priority: "p0" | "p1" | "p2" | "p3";
  source: "anomaly" | "pattern" | "schedule" | "cost";
  title: string;
  detail: string;
  action: string;
  estTokens: number;
}

export const suggestions: Suggestion[] = [
  { rank: 1, priority: "p0", source: "anomaly",   title: "Metrics endpoint returning 504s",       detail: "9 of last 11 calls failed. Likely network or rate limit. Affected: j-7681, j-7689.",         action: "Restart",         estTokens: 0 },
  { rank: 2, priority: "p0", source: "schedule",  title: "Snapshot job overdue by 2h",            detail: "nightly-snapshot last ran 8h ago. Window: 02:00–02:30 UTC.",                            action: "Run now",         estTokens: 0 },
  { rank: 3, priority: "p1", source: "cost",      title: "Token spend up 38% WoW",               detail: "Mostly from long-running jobs. Consider compressing context before next batch.",         action: "View breakdown",  estTokens: 0 },
  { rank: 4, priority: "p1", source: "pattern",   title: "Cache hit rate declining on shard 3",  detail: "Hit rate dropped from 94% to 78% over 24h. Check TTL config.",                          action: "Inspect",         estTokens: 1200 },
  { rank: 5, priority: "p2", source: "schedule",  title: "Sitemap refresh due",                  detail: "Last refreshed 6d ago. New content not yet indexed.",                                   action: "Trigger crawl",   estTokens: 800 },
  { rank: 6, priority: "p2", source: "pattern",   title: "3 empty cache writes this week",       detail: "Writes returning 0 bytes — probably a malformed payload from upstream.",                action: "Inspect",         estTokens: 400 },
  { rank: 7, priority: "p3", source: "pattern",   title: "Index drift in domain E",              detail: "DB shows 6 features but index only enumerates 4. Sync.",                                 action: "Open diff",       estTokens: 600 },
];

export interface TimelineEvent {
  id: string;
  ts: string;
  type: "job" | "mcp" | "cron" | "vault" | "skill" | "alert";
  title: string;
  detail?: string;
  color: "cyan" | "amber" | "rose" | "emerald" | "violet" | "zinc";
}

export const timeline: TimelineEvent[] = [
  { id: "tl-1", ts: "12s ago",  type: "job",    title: "j-7721 started: reprocess 412 pending extracts",     color: "cyan" },
  { id: "tl-2", ts: "1m ago",   type: "mcp",    title: "metrics endpoint errored on call 9841",              color: "rose" },
  { id: "tl-3", ts: "2m ago",   type: "skill",  title: "Loaded module: vector-rerank-v2",                     color: "violet" },
  { id: "tl-4", ts: "4m ago",   type: "cron",   title: "nightly-snapshot scheduled (last run 8h ago)",        color: "amber" },
  { id: "tl-5", ts: "7m ago",   type: "vault",  title: "Patched config namespace /api/v2",                    color: "emerald" },
  { id: "tl-6", ts: "9m ago",   type: "job",    title: "j-7689 completed: 20 product card summaries",         color: "cyan" },
  { id: "tl-7", ts: "12m ago",  type: "alert",  title: "Cron health: nightly-snapshot missed 02:00 window",   color: "rose" },
  { id: "tl-8", ts: "14m ago",  type: "skill",  title: "Loaded module: cron-diagnostics",                     color: "violet" },
  { id: "tl-9", ts: "18m ago",  type: "vault",  title: "Initialised namespace /api/v3",                       color: "emerald" },
  { id: "tl-10",ts: "23m ago",  type: "job",    title: "j-7700 started: backfill 4 domain embeddings",        color: "cyan" },
  { id: "tl-11",ts: "31m ago",  type: "mcp",    title: "cache compacted: 1,247 → 412 entries",                color: "zinc" },
  { id: "tl-12",ts: "42m ago",  type: "job",    title: "j-7681 completed: nightly snapshot",                  color: "cyan" },
];

export interface VaultMeta {
  name: string;
  type: "INDEX" | "AGENT" | "JOB" | "INCIDENT" | "SKILL";
  size: string;
  lastTouched: string;
  status: "fresh" | "stale" | "missing";
  hasRule: boolean;
  aliases: string[];
}

export const vaults: VaultMeta[] = [
  { name: "core-api",          type: "INDEX", size: "8.2 KB",  lastTouched: "13m ago", status: "fresh",   hasRule: true,  aliases: ["api", "v2"] },
  { name: "billing",           type: "INDEX", size: "12.4 KB", lastTouched: "2h ago",  status: "fresh",   hasRule: true,  aliases: ["billing-v2"] },
  { name: "marketing",         type: "INDEX", size: "9.1 KB",  lastTouched: "1d ago",  status: "stale",   hasRule: true,  aliases: ["mkt"] },
  { name: "support",           type: "INDEX", size: "5.6 KB",  lastTouched: "23m ago", status: "fresh",   hasRule: true,  aliases: ["helpdesk"] },
  { name: "infra",             type: "INDEX", size: "14.8 KB", lastTouched: "6h ago",  status: "fresh",   hasRule: true,  aliases: ["ops-platform"] },
  { name: "internal-tools",    type: "INDEX", size: "7.3 KB",  lastTouched: "1h ago",  status: "fresh",   hasRule: true,  aliases: ["tools"] },
  { name: "experimental",      type: "INDEX", size: "missing", lastTouched: "just now", status: "missing", hasRule: false, aliases: ["sandbox"] },
  { name: "analytics",         type: "INDEX", size: "3.1 KB",  lastTouched: "3d ago",  status: "stale",   hasRule: true,  aliases: ["metrics-v1"] },
];

export interface Metric {
  label: string;
  value: string;
  delta: number; // percent
  trend: number[]; // sparkline values
  inverse?: boolean;
  unit?: string;
}

export const metrics: Metric[] = [
  { label: "Token spend (24h)", value: "1.42M",  delta: 12.4,  trend: [30, 35, 32, 40, 44, 48, 52, 60, 58, 64, 70, 72], unit: "tok" },
  { label: "Active jobs",       value: "4",      delta: -8.3,  trend: [2, 3, 4, 3, 5, 4, 6, 5, 4, 4, 4, 4] },
  { label: "MCP calls (1h)",    value: "16.6k",  delta: 23.7,  trend: [200, 280, 350, 420, 510, 480, 560, 620, 740, 880, 1010, 1140] },
  { label: "Success rate",      value: "98.4%",  delta: 0.2,   trend: [97, 97, 98, 98, 98, 99, 98, 98, 99, 98, 99, 98] },
];

export interface CronHealth {
  name: string;
  schedule: string;
  lastRun: string;
  expectedCost: string;
  status: "ok" | "missed" | "paused" | "error";
  invocations: number;
}

export const crons: CronHealth[] = [
  { name: "nightly-snapshot",     schedule: "0 2 * * *",   lastRun: "8h ago",   expectedCost: "~0.0 tok",  status: "missed", invocations: 27 },
  { name: "session-cleanup",      schedule: "every 6h",    lastRun: "2h ago",   expectedCost: "~0.0 tok",  status: "ok",     invocations: 187 },
  { name: "archivist",            schedule: "manual",      lastRun: "—",        expectedCost: "—",          status: "paused", invocations: 0 },
  { name: "indexer",              schedule: "manual",      lastRun: "—",        expectedCost: "—",          status: "paused", invocations: 0 },
  { name: "search-recrawl",       schedule: "0 9 * * *",   lastRun: "3h ago",   expectedCost: "~12k tok",  status: "ok",     invocations: 12 },
  { name: "token-rotation",       schedule: "30 9 * * *",  lastRun: "3h ago",   expectedCost: "~8k tok",   status: "ok",     invocations: 11 },
];

export const heroStats = {
  jobsOnline: 4,
  jobsTotal: 12,
  mcpHealth: 75,
  tokenBudget: "2.5M",
  tokensToday: "1.42M",
  uptime: "99.94%",
  lastIncident: "2h ago",
};

// Generic skill library — all names are public-safe
export interface Skill {
  name: string;
  active: boolean;
  category: "data" | "infra" | "ops" | "frontend" | "ai" | "core";
}

export const skills: Skill[] = [
  // Active (4)
  { name: "vector-search",       active: true,  category: "data" },
  { name: "sql-pool",            active: true,  category: "data" },
  { name: "object-store",        active: true,  category: "data" },
  { name: "rate-limiter",        active: true,  category: "infra" },
  // Cached (43)
  { name: "json-formatter", active: false, category: "data" },
  { name: "yaml-loader", active: false, category: "data" },
  { name: "csv-parser", active: false, category: "data" },
  { name: "token-counter", active: false, category: "ai" },
  { name: "text-splitter", active: false, category: "ai" },
  { name: "embed-v2", active: false, category: "ai" },
  { name: "classify-fast", active: false, category: "ai" },
  { name: "summarize-md", active: false, category: "ai" },
  { name: "extract-entities", active: false, category: "ai" },
  { name: "rerank-crossencoder", active: false, category: "ai" },
  { name: "log-tailer", active: false, category: "ops" },
  { name: "metrics-collector", active: false, category: "ops" },
  { name: "alert-router", active: false, category: "ops" },
  { name: "healthcheck", active: false, category: "ops" },
  { name: "schema-migrator", active: false, category: "ops" },
  { name: "backup-creator", active: false, category: "ops" },
  { name: "secret-rotator", active: false, category: "infra" },
  { name: "queue-worker", active: false, category: "infra" },
  { name: "load-balancer", active: false, category: "infra" },
  { name: "rate-stat", active: false, category: "infra" },
  { name: "session-store", active: false, category: "core" },
  { name: "feature-flags", active: false, category: "core" },
  { name: "config-watcher", active: false, category: "core" },
  { name: "events-bus", active: false, category: "core" },
  { name: "request-tracer", active: false, category: "core" },
  { name: "validator", active: false, category: "core" },
  { name: "auth-guard", active: false, category: "core" },
  { name: "cors-middleware", active: false, category: "frontend" },
  { name: "compress-response", active: false, category: "frontend" },
  { name: "etag-cache", active: false, category: "frontend" },
  { name: "static-serve", active: false, category: "frontend" },
  { name: "redirect-helper", active: false, category: "frontend" },
  { name: "header-normalizer", active: false, category: "frontend" },
  { name: "pagination", active: false, category: "data" },
  { name: "filter-builder", active: false, category: "data" },
  { name: "sort-applier", active: false, category: "data" },
  { name: "deduplicator", active: false, category: "data" },
  { name: "id-generator", active: false, category: "core" },
  { name: "hash-compare", active: false, category: "core" },
  { name: "diff-engine", active: false, category: "core" },
];


// ─────────────────────────────────────────────────────────────────────────────
// CHART DATA — for the new charts (bars, area, donuts) added in v3 redesign
// ─────────────────────────────────────────────────────────────────────────────

export const chartData = {
  // 7-day MCP calls (matches "last 7 days" bar chart in reference)
  mcpCalls7d: [
    { d: "Mon", v: 4200 },
    { d: "Tue", v: 5100 },
    { d: "Wed", v: 3800 },
    { d: "Thu", v: 6200 },
    { d: "Fri", v: 7100 },
    { d: "Sat", v: 5400 },
    { d: "Sun", v: 4900 },
  ],
  // Token burn 24h (area chart)
  tokens24h: [
    120, 145, 132, 168, 195, 178, 210, 245, 232, 268, 295, 280,
    310, 345, 332, 368, 395, 412, 388, 425, 458, 432, 478, 510,
  ],
  // Throughput (cyan line chart)
  throughput: [
    62, 58, 65, 71, 68, 74, 82, 78, 85, 88, 92, 95,
  ],
  // 4 tool usage progressions
  tools: [
    { name: "vector-search",     now: 2840, week: 18900 },
    { name: "sql-pool",          now: 1520, week: 11200 },
    { name: "object-store",      now:  890, week:  6700 },
    { name: "metrics-pipeline",  now:  640, week:  4900 },
  ],
};

// donut ring snapshots
export const donutData = {
  modelMix: [
    { label: "fast",       value: 62, gradient: "cyan-blue" as const },
    { label: "balanced",   value: 84, gradient: "purple-pink" as const },
    { label: "deep",       value: 41, gradient: "pink-orange" as const },
    { label: "embedding",  value: 77, gradient: "emerald-cyan" as const },
  ],
  capacity: [
    { label: "GPU",        value: 73, gradient: "purple-pink" as const },
    { label: "storage",    value: 52, gradient: "cyan-blue" as const },
    { label: "queue",      value: 18, gradient: "emerald-cyan" as const },
    { label: "tokens",     value: 61, gradient: "pink-orange" as const },
  ],
};
