// Static demo data — represents a real Hermes MCP/agent dashboard captured at a snapshot

export type McpStatus = "healthy" | "degraded" | "down";

export interface Mcp {
  name: string;
  status: McpStatus;
  latency: number; // ms
  calls1h: number;
  uptime: string; // e.g. "99.97%"
  lastCheck: string;
}

export const mcps: Mcp[] = [
  { name: "memory",      status: "healthy",  latency: 4,   calls1h: 1247, uptime: "99.99%", lastCheck: "2s ago" },
  { name: "vault",       status: "healthy",  latency: 12,  calls1h: 412,  uptime: "99.97%", lastCheck: "4s ago" },
  { name: "session",     status: "healthy",  latency: 8,   calls1h: 89,   uptime: "99.95%", lastCheck: "1s ago" },
  { name: "cron",        status: "degraded", latency: 247, calls1h: 23,   uptime: "98.42%", lastCheck: "12s ago" },
  { name: "skills",      status: "healthy",  latency: 6,   calls1h: 156,  uptime: "99.99%", lastCheck: "3s ago" },
  { name: "web",         status: "healthy",  latency: 412, calls1h: 67,   uptime: "99.81%", lastCheck: "8s ago" },
  { name: "filesystem",  status: "healthy",  latency: 18,  calls1h: 284,  uptime: "99.96%", lastCheck: "5s ago" },
  { name: "delegate",    status: "down",     latency: 0,   calls1h: 0,    uptime: "94.12%", lastCheck: "1m ago" },
];

export interface Process {
  pid: string;
  agent: string;
  task: string;
  started: string;
  duration: number; // seconds
  tokens: number;
  state: "running" | "queued" | "awaiting" | "completed";
  parent?: string;
}

export const processes: Process[] = [
  { pid: "ag-7721",   agent: "delegate_task", task: "Refactor BrandTome README section",  started: "2m ago",  duration: 124, tokens: 8421, state: "running" },
  { pid: "ag-7718",   agent: "delegate_task", task: "Build AgentOps dashboard scaffold", started: "11m ago", duration: 671, tokens: 24098, state: "running", parent: "ag-7700" },
  { pid: "ag-7700",   agent: "computer_use",  task: "Draft 4 brand-vault entries",       started: "23m ago", duration: 1402, tokens: 18432, state: "running" },
  { pid: "ag-7695",   agent: "delegate_task", task: "Run sitemap audit on hiremekit",   started: "34m ago", duration: 2041, tokens: 12883, state: "running" },
  { pid: "ag-7689",   agent: "delegate_task", task: "Build 20 showcase screenshots",    started: "1h ago",  duration: 3602, tokens: 41204, state: "completed" },
  { pid: "cron-vb",   agent: "vault-backup",  task: "Nightly vault backup",              started: "8h ago",  duration: 47,   tokens: 0, state: "completed" },
  { pid: "ag-7690",   agent: "delegate_task", task: "Generate BizzieBot pier desc",     started: "10m ago", duration: 600,  tokens: 7402, state: "awaiting" },
  { pid: "ag-7693",   agent: "delegate_task", task: "Patch Backwater product mapping",  started: "15m ago", duration: 0,    tokens: 0,     state: "queued" },
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
  { rank: 1, priority: "p0", source: "anomaly",   title: "delegate MCP returning 504s",        detail: "9 of last 11 calls failed. Likely network or rate limit. Affected: ag-7681, ag-7689.",        action: "Restart delegate",        estTokens: 0 },
  { rank: 2, priority: "p0", source: "schedule",  title: "Vault backup overdue by 2h",        detail: "vault-backup-nightly cron last ran 8h ago. Window: 02:00–02:30 ET.",                              action: "Run now",                  estTokens: 0 },
  { rank: 3, priority: "p1", source: "cost",      title: "Token spend up 38% WoW",            detail: "Mostly from long-running agents. Compress memory before delegating.",                          action: "View breakdown",           estTokens: 0 },
  { rank: 4, priority: "p1", source: "pattern",   title: "Skills not auto-attached",          detail: "12 sessions could have used skills library but didn't. Add skill loader to gateway.",         action: "Patch gateway",            estTokens: 1200 },
  { rank: 5, priority: "p2", source: "schedule",  title: "Hiremekit sitemap refresh",         detail: "Last refreshed 6d ago. New blog posts not indexed.",                                            action: "Trigger crawl",             estTokens: 800 },
  { rank: 6, priority: "p2", source: "pattern",   title: "3 empty memory writes this week",   detail: "write_approval=manual working but occuring more than expected. Check gateway prompt.",         action: "Inspect",                   estTokens: 400 },
  { rank: 7, priority: "p3", source: "pattern",   title: "BrandTome description drift",       detail: "Mentioned 6 features in DB but docs only enumerate 4. Sync.",                                  action: "Open diff",                 estTokens: 600 },
];

export interface TimelineEvent {
  id: string;
  ts: string;
  type: "agent" | "mcp" | "cron" | "vault" | "skill" | "alert";
  icon: string;
  title: string;
  detail?: string;
  color: "cyan" | "amber" | "rose" | "emerald" | "violet" | "zinc";
}

export const timeline: TimelineEvent[] = [
  { id: "tl-1", ts: "12s ago",  type: "agent",  icon: "▶", title: "ag-7721 started: Refactor BrandTome README section",                color: "cyan" },
  { id: "tl-2", ts: "1m ago",   type: "mcp",    icon: "✕", title: "delegate MCP errored on call 9841",                                color: "rose" },
  { id: "tl-3", ts: "2m ago",   type: "skill",  icon: "↗", title: "Loaded skill: bzbot-docker-launcher",                              color: "violet" },
  { id: "tl-4", ts: "4m ago",   type: "cron",   icon: "◎", title: "vault-backup-nightly scheduled (last run 8h ago)",                color: "amber" },
  { id: "tl-5", ts: "7m ago",   type: "vault",  icon: "◆", title: "Patched ~/Documents/HQ/BizzieBot/brand/vault.md",                 color: "emerald" },
  { id: "tl-6", ts: "9m ago",   type: "agent",  icon: "✓", title: "ag-7689 completed: 20 screenshots shipped",                       color: "cyan" },
  { id: "tl-7", ts: "12m ago",  type: "alert",  icon: "!", title: "Cron health: vault-backup-nightly missed 02:00 window",           color: "rose" },
  { id: "tl-8", ts: "14m ago",  type: "skill",  icon: "↗", title: "Loaded skill: hermes-cron-diagnostics",                            color: "violet" },
  { id: "tl-9", ts: "18m ago",  type: "vault",  icon: "◆", title: "Initialised vault ~/Documents/HQ/Pixel-AI",                       color: "emerald" },
  { id: "tl-10",ts: "23m ago",  type: "agent",  icon: "▶", title: "ag-7700 started: Draft 4 brand-vault entries",                    color: "cyan" },
  { id: "tl-11",ts: "31m ago",  type: "mcp",    icon: "↻", title: "memory MCP compacted: 1,247 → 412 contexts",                      color: "zinc" },
  { id: "tl-12",ts: "42m ago",  type: "agent",  icon: "✓", title: "ag-7681 completed: Pixel-AI brand voice draft",                   color: "cyan" },
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
  { name: "BizzieBot",         type: "INDEX", size: "8.2 KB",  lastTouched: "13m ago", status: "fresh",   hasRule: true,  aliases: ["bzbot", "pippy"] },
  { name: "Backwater Hat Co",  type: "INDEX", size: "12.4 KB", lastTouched: "2h ago",  status: "fresh",   hasRule: true,  aliases: ["backwater"] },
  { name: "The Find Drop",     type: "INDEX", size: "9.1 KB",  lastTouched: "1d ago",  status: "stale",   hasRule: true,  aliases: ["finddrop", "tfd"] },
  { name: "Pixel-AI",          type: "INDEX", size: "5.6 KB",  lastTouched: "23m ago", status: "fresh",   hasRule: true,  aliases: ["pixel"] },
  { name: "ClippingPage",      type: "INDEX", size: "14.8 KB", lastTouched: "6h ago",  status: "fresh",   hasRule: true,  aliases: ["clip", "clipping"] },
  { name: "Hermes",            type: "INDEX", size: "7.3 KB",  lastTouched: "1h ago",  status: "fresh",   hasRule: true,  aliases: ["hermes", "ops"] },
  { name: "showcase",          type: "INDEX", size: "missing", lastTouched: "just now", status: "missing", hasRule: false, aliases: ["portfolio"] },
  { name: "Etsy-Store",        type: "INDEX", size: "3.1 KB",  lastTouched: "3d ago",  status: "stale",   hasRule: true,  aliases: ["etsy"] },
];

export interface Metric {
  label: string;
  value: string;
  delta: number; // percent
  trend: number[]; // sparkline values
  inverse?: boolean; // if down is good
  unit?: string;
}

export const metrics: Metric[] = [
  { label: "Token spend (24h)", value: "1.42M",  delta: 12.4,  trend: [30, 35, 32, 40, 44, 48, 52, 60, 58, 64, 70, 72], unit: "tok" },
  { label: "Active agents",     value: "4",      delta: -8.3,  trend: [2, 3, 4, 3, 5, 4, 6, 5, 4, 4, 4, 4] },
  { label: "MCP calls (1h)",    value: "2,278",  delta: 23.7,  trend: [200, 280, 350, 420, 510, 480, 560, 620, 740, 880, 1010, 1140] },
  { label: "Success rate",      value: "98.4%",  delta: 0.2,   trend: [97, 97, 98, 98, 98, 99, 98, 98, 99, 98, 99, 98], inverse: false },
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
  { name: "vault-backup-nightly", schedule: "0 2 * * *",   lastRun: "8h ago",   expectedCost: "~0.0 tok",  status: "missed", invocations: 27 },
  { name: "session-cleanup",      schedule: "every 6h",    lastRun: "2h ago",   expectedCost: "~0.0 tok",  status: "ok",     invocations: 187 },
  { name: "memory-archivist",     schedule: "manual",      lastRun: "—",        expectedCost: "—",          status: "paused", invocations: 0 },
  { name: "skill-indexer",        schedule: "manual",      lastRun: "—",        expectedCost: "—",          status: "paused", invocations: 0 },
  { name: "tiktok-shop-search",   schedule: "0 9 * * *",   lastRun: "3h ago",   expectedCost: "~12k tok",  status: "ok",     invocations: 12 },
  { name: "amazon-affiliate",     schedule: "30 9 * * *",  lastRun: "3h ago",   expectedCost: "~8k tok",   status: "ok",     invocations: 11 },
];

export const heroStats = {
  agentsOnline: 4,
  agentsTotal: 12,
  mcpHealth: 87,
  vaultHealth: 75,
  tokensToday: "1.42M",
  tokensBudget: "2.5M",
  uptime: "99.94%",
  lastIncident: "2h ago",
};
