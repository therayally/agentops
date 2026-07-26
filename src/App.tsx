import { useState, useMemo } from "react";
import {
  Activity, Cpu, Database, Zap, AlertTriangle, CheckCircle2, Clock, Search,
  Bot, Server, BookOpen, Hash, Filter, ChevronRight, ExternalLink, Settings2,
  Sparkles, TrendingUp, TrendingDown, GitBranch, Terminal, Layers, Radio,
  ArrowUpRight, Shield, Workflow, Network, Brain, Cog, Command, FileText,
  History, Boxes, BarChart3, Circle, Loader2, Pause, Play,
} from "lucide-react";
import { mcps, processes, suggestions, timeline, vaults, metrics, crons, heroStats } from "./data";
import { Sparkline } from "./Sparkline";

const statusColor = (s: string) => {
  switch (s) {
    case "healthy":  return "bg-emerald-400";
    case "degraded": return "bg-amber-400";
    case "down":     return "bg-rose-500";
    case "completed":return "bg-emerald-400/60";
    case "running":  return "bg-cyan-400";
    case "queued":   return "bg-zinc-500";
    case "awaiting": return "bg-amber-400";
    case "ok":       return "bg-emerald-400";
    case "missed":   return "bg-rose-500";
    case "paused":   return "bg-zinc-600";
    case "error":    return "bg-rose-500";
    case "fresh":    return "bg-emerald-400";
    case "stale":    return "bg-amber-400";
    case "missing":  return "bg-rose-500";
    default:         return "bg-zinc-500";
  }
};

const statusDot = (s: string) => (
  <span className="relative inline-block w-2 h-2">
    <span className={`absolute inset-0 rounded-full ${statusColor(s)}`} />
    {(s === "healthy" || s === "running" || s === "fresh") && (
      <span className={`absolute inset-0 rounded-full ${statusColor(s)} animate-ping opacity-75`} />
    )}
  </span>
);

function PriorityBadge({ p }: { p: "p0" | "p1" | "p2" | "p3" }) {
  const colors = {
    p0: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    p1: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    p2: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    p3: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider border ${colors[p]}`}>
      {p.toUpperCase()}
    </span>
  );
}

export default function App() {
  const [filter, setFilter] = useState<"all" | "agent" | "mcp" | "cron" | "vault" | "skill" | "alert">("all");
  const [search, setSearch] = useState("");
  const [hoveredMcp, setHoveredMcp] = useState<string | null>(null);

  const filteredTimeline = useMemo(() => {
    return timeline.filter(e => {
      const matchFilter = filter === "all" || e.type === filter;
      const matchSearch = search === "" || e.title.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [filter, search]);

  const mcpHealth = Math.round((mcps.filter(m => m.status === "healthy").length / mcps.length) * 100);
  const processesRunning = processes.filter(p => p.state === "running").length;
  const tokensPct = (parseFloat("1.42") / 2.5) * 100;

  return (
    <div className="min-h-screen grid-bg">
      {/* Top bar */}
      <header className="sticky top-0 z-30 glass-strong border-b border-white/5">
        <div className="flex items-center px-6 h-14 gap-6">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Network className="w-4 h-4 text-zinc-950" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">AgentOps</h1>
              <p className="text-[10px] text-zinc-500 -mt-0.5 font-mono">v0.1.0 · main</p>
            </div>
          </div>

          <nav className="flex items-center gap-1 text-xs">
            <NavTab label="Live" icon={<Radio className="w-3 h-3" />} active />
            <NavTab label="Agents" icon={<Bot className="w-3 h-3" />} />
            <NavTab label="MCPs" icon={<Server className="w-3 h-3" />} />
            <NavTab label="Vaults" icon={<BookOpen className="w-3 h-3" />} />
            <NavTab label="Crons" icon={<Clock className="w-3 h-3" />} />
            <NavTab label="Logs" icon={<Terminal className="w-3 h-3" />} />
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 bg-zinc-900/50 px-2 py-1 rounded">
              <Search className="w-3 h-3" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="⌘K · search..."
                className="bg-transparent outline-none text-zinc-300 placeholder:text-zinc-600 w-32"
              />
            </div>
            <button className="p-1.5 rounded hover:bg-white/5 transition">
              <Command className="w-3.5 h-3.5 text-zinc-500" />
            </button>
            <button className="p-1.5 rounded hover:bg-white/5 transition">
              <Settings2 className="w-3.5 h-3.5 text-zinc-500" />
            </button>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-[10px] font-bold text-zinc-950">
              RA
            </div>
          </div>
        </div>
      </header>

      {/* Hero strip */}
      <section className="px-6 pt-6">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-4 glass rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-cyan-400 font-mono mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse-dot" />
                System · live
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-glow">
                <span className="bg-gradient-to-r from-zinc-100 to-cyan-200 bg-clip-text text-transparent">
                  Ops Control
                </span>
              </h2>
              <p className="text-sm text-zinc-500 mt-1">All systems nominal · 1 watchpoint</p>
              <div className="flex items-baseline gap-2 mt-5">
                <span className="text-4xl font-bold text-zinc-100 tabular-nums">{heroStats.uptime}</span>
                <span className="text-xs text-zinc-500 font-mono">uptime 30d</span>
              </div>
              <div className="mt-4 flex items-center gap-3 text-[10px] font-mono text-zinc-500">
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  {processesRunning} active
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Server className="w-3 h-3" />
                  {mcpHealth}% healthy
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  1 incident
                </span>
              </div>
            </div>
          </div>

          {/* 4 KPI cards */}
          {metrics.map((m, i) => (
            <div key={i} className="col-span-6 lg:col-span-2 glass rounded-2xl p-5">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">{m.label}</div>
              <div className="flex items-baseline justify-between mt-3">
                <span className="text-2xl font-bold text-zinc-100 tabular-nums">{m.value}</span>
                <span className={`flex items-center gap-0.5 text-[10px] font-mono ${m.delta > 0 ? (m.inverse ? "text-rose-400" : "text-emerald-400") : "text-zinc-500"}`}>
                  {m.delta > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(m.delta).toFixed(1)}%
                </span>
              </div>
              <div className="mt-4 -mb-1">
                <Sparkline values={m.trend} width={160} height={32} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main grid */}
      <section className="px-6 pt-4 pb-6">
        <div className="grid grid-cols-12 gap-4">

          {/* MCP Status Grid */}
          <div className="col-span-12 lg:col-span-7 glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <h3 className="font-semibold text-sm">MCP Servers</h3>
                <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800/50 px-1.5 py-0.5 rounded">
                  {mcps.filter(m => m.status === "healthy").length}/{mcps.length} healthy
                </span>
              </div>
              <button className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition">
                View all <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {mcps.map(m => (
                <button
                  key={m.name}
                  onMouseEnter={() => setHoveredMcp(m.name)}
                  onMouseLeave={() => setHoveredMcp(null)}
                  className={`group flex items-center gap-3 p-3 rounded-xl border transition ${
                    hoveredMcp === m.name
                      ? "bg-zinc-800/60 border-cyan-500/30"
                      : "bg-zinc-900/40 border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="flex-shrink-0">{statusDot(m.status)}</div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-zinc-200">{m.name}</span>
                      {m.status === "degraded" && (
                        <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-1 rounded">5xx</span>
                      )}
                      {m.status === "down" && (
                        <span className="text-[9px] font-mono text-rose-400 bg-rose-500/10 px-1 rounded">DOWN</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 mt-0.5">
                      <span>{m.calls1h.toLocaleString()} calls/h</span>
                      <span className="text-zinc-700">·</span>
                      <span>{m.uptime}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs text-zinc-300 tabular-nums">{m.latency}ms</div>
                    <div className="text-[9px] font-mono text-zinc-600">{m.lastCheck}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Suggestions Queue */}
          <div className="col-span-12 lg:col-span-5 glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-semibold text-sm">AI Suggestions</h3>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                  {suggestions.length} queued
                </span>
              </div>
              <button className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition">
                <Filter className="w-3 h-3" /> filter
              </button>
            </div>
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {suggestions.slice(0, 5).map(s => (
                <div
                  key={s.rank}
                  className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/40 border border-white/5 hover:border-white/10 transition group cursor-pointer"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-zinc-800/80 flex items-center justify-center text-[10px] font-bold font-mono text-zinc-500">
                    {s.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <PriorityBadge p={s.priority} />
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">{s.source}</span>
                    </div>
                    <div className="text-sm font-medium text-zinc-100 group-hover:text-cyan-300 transition truncate">
                      {s.title}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{s.detail}</div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition flex-shrink-0 text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                    {s.action}
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Process Feed */}
          <div className="col-span-12 lg:col-span-7 glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <h3 className="font-semibold text-sm">Live Agents</h3>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                  {processesRunning} running
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                  streaming
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              {processes.map(p => (
                <div
                  key={p.pid}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-zinc-800/40 transition group"
                >
                  <div className="flex-shrink-0 text-zinc-600">
                    {p.state === "running" ? (
                      <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                    ) : p.state === "completed" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : p.state === "awaiting" ? (
                      <Pause className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-zinc-600" />
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <span className="font-mono text-[10px] text-zinc-500 bg-zinc-800/50 px-1.5 py-0.5 rounded">
                      {p.pid}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-cyan-300/80">{p.agent}</span>
                      {p.parent && (
                        <>
                          <span className="text-zinc-700">→</span>
                          <span className="font-mono text-[10px] text-zinc-600">{p.parent}</span>
                        </>
                      )}
                    </div>
                    <div className="text-sm text-zinc-200 truncate mt-0.5">{p.task}</div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="font-mono text-xs text-zinc-300 tabular-nums">
                      {p.duration > 0 ? `${Math.floor(p.duration / 60)}m ${p.duration % 60}s` : "—"}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500">
                      {p.tokens > 0 ? `${(p.tokens / 1000).toFixed(1)}k tok` : "—"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vault Index */}
          <div className="col-span-12 lg:col-span-5 glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <h3 className="font-semibold text-sm">Vaults</h3>
                <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800/50 px-1.5 py-0.5 rounded">
                  {vaults.length} indexed
                </span>
              </div>
              <button className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition">
                <ExternalLink className="w-3 h-3" /> vault router
              </button>
            </div>
            <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
              {vaults.map(v => (
                <div
                  key={v.name}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-zinc-800/40 transition group"
                >
                  <div className="flex-shrink-0">{statusDot(v.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-zinc-100 group-hover:text-cyan-300 transition truncate">
                        {v.name}
                      </span>
                      {v.hasRule && (
                        <Shield className="w-3 h-3 text-cyan-400/50 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-zinc-500">{v.type}</span>
                      <span className="text-zinc-700">·</span>
                      <span className="text-[10px] font-mono text-zinc-500">{v.size}</span>
                      <span className="text-zinc-700">·</span>
                      <span className="text-[10px] font-mono text-zinc-500">{v.lastTouched}</span>
                    </div>
                    {v.aliases.length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        {v.aliases.map(a => (
                          <span key={a} className="text-[9px] font-mono text-zinc-400 bg-zinc-800/60 px-1 py-0.5 rounded">
                            {a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="col-span-12 lg:col-span-8 glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" />
                <h3 className="font-semibold text-sm">Activity Timeline</h3>
                <span className="text-[10px] font-mono text-zinc-500">last 42 min</span>
              </div>
              <div className="flex items-center gap-1">
                {(["all", "agent", "mcp", "cron", "vault", "skill", "alert"] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`text-[10px] font-mono uppercase px-2 py-1 rounded transition ${
                      filter === f
                        ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                        : "text-zinc-500 hover:text-zinc-300 border border-transparent"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative space-y-1 max-h-[360px] overflow-y-auto pr-2">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-zinc-800" />
              {filteredTimeline.map(e => (
                <div key={e.id} className="flex items-start gap-3 relative">
                  <div className={`flex-shrink-0 mt-1.5 w-3.5 h-3.5 rounded-full ${statusColor(e.color)} ring-4 ring-zinc-950 z-10`} />
                  <div className="flex-1 min-w-0 pb-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-zinc-200">{e.title}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{e.type}</span>
                      <span className="text-zinc-700">·</span>
                      <span className="text-[10px] font-mono text-zinc-600">{e.ts}</span>
                    </div>
                  </div>
                </div>
              ))}
              {filteredTimeline.length === 0 && (
                <div className="text-center py-8 text-xs text-zinc-500 font-mono">
                  no events match filter
                </div>
              )}
            </div>
          </div>

          {/* Cron Health */}
          <div className="col-span-12 lg:col-span-4 glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h3 className="font-semibold text-sm">Crons</h3>
                <span className="text-[10px] font-mono text-zinc-500">{crons.length} total</span>
              </div>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {crons.filter(c => c.status === "missed" || c.status === "error").length} watch
              </span>
            </div>
            <div className="space-y-1.5">
              {crons.map(c => (
                <div key={c.name} className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800/40 transition">
                  {statusDot(c.status)}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono text-zinc-200 truncate">{c.name}</div>
                    <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-1.5">
                      <span>{c.schedule}</span>
                      <span className="text-zinc-700">·</span>
                      <span>{c.lastRun}</span>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500 flex-shrink-0">{c.invocations}×</div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily budget / Spotlight */}
          <div className="col-span-12 lg:col-span-5 glass rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-amber-400 font-mono mb-3">
                <Zap className="w-3 h-3" />
                Token budget
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tabular-nums">{heroStats.tokensToday}</span>
                <span className="text-sm text-zinc-500 font-mono">/ {heroStats.tokensBudget}</span>
              </div>
              <div className="mt-4 h-2 bg-zinc-800/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 rounded-full transition-all"
                  style={{ width: `${tokensPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-zinc-500">
                <span>{tokensPct.toFixed(0)}% used</span>
                <span className="text-amber-400">on track for 1.78M</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-white/5">
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">Today</div>
                  <div className="text-lg font-bold text-zinc-100 tabular-nums">142k</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">This week</div>
                  <div className="text-lg font-bold text-zinc-100 tabular-nums">847k</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">Avg/day</div>
                  <div className="text-lg font-bold text-zinc-100 tabular-nums">121k</div>
                </div>
              </div>
            </div>
          </div>

          {/* Skill library */}
          <div className="col-span-12 lg:col-span-7 glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-cyan-400" />
                <h3 className="font-semibold text-sm">Skills Library</h3>
                <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800/50 px-1.5 py-0.5 rounded">
                  47 indexed
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  4 active
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                  43 cached
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { n: "bzbot-docker-launcher", active: true, isPip: true },
                { n: "hermes-cron-diagnostics", active: true },
                { n: "vault-backup", active: true },
                { n: "skill_indexer", active: true },
                { n: "subagent-driven-development" },
                { n: "test-driven-development" },
                { n: "loop-engineering-fix-it" },
                { n: "memory-archivist" },
                { n: "systematic-debugging" },
                { n: "writing-plans" },
                { n: "requesting-code-review" },
                { n: "simplify-code" },
                { n: "brand-guard" },
                { n: "persona-lock-pippy" },
                { n: "sprint-sdlc-gate" },
                { n: "product-owner-reviewer" },
                { n: "ux-reviewer" },
                { n: "security-engineer-reviewer" },
                { n: "multi-surface-rebuild-audit" },
                { n: "screenshot-electron-app" },
                { n: "plan", spans: 2 },
                { n: "spike" },
                { n: "dogfood" },
                { n: "verify-before-claim-done" },
                { n: "ray-operations" },
                { n: "no-time-estimates" },
                { n: "no-dashes-in-prose" },
                { n: "verified-loop-engineering" },
                { n: "pitfall-guard" },
                { n: "kanban-orchestrator" },
                { n: "kanban-worker" },
                { n: "subagent-driven-development" },
                { n: "memory-archivist" },
                { n: "skill-indexer" },
                { n: "telegram-question-format" },
                { n: "claude-code" },
                { n: "codex" },
                { n: "computer-use" },
                { n: "opencode" },
                { n: "delegate_task" },
                { n: "session_search" },
                { n: "memory" },
                { n: "cronjob" },
                { n: "read_file" },
                { n: "search_files" },
                { n: "patch" },
                { n: "write_file" },
              ].map((s, i) => (
                <span
                  key={`${s.n}-${i}`}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono border transition ${
                    s.active
                      ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
                      : "bg-zinc-900/50 text-zinc-500 border-white/5 hover:border-white/10 hover:text-zinc-300"
                  }`}
                >
                  {s.active && <span className="w-1 h-1 rounded-full bg-cyan-400" />}
                  {s.n}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pb-6">
        <div className="glass rounded-2xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              snapshot · captured 0:42 ago
            </span>
            <span>·</span>
            <span>therayally/agentops</span>
            <span>·</span>
            <span>MIT</span>
          </div>
          <a
            href="https://github.com/therayally/agentops"
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
          >
            view source <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
}

function NavTab({ label, icon, active = false }: { label: string; icon: React.ReactNode; active?: boolean }) {
  return (
    <button
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
        active
          ? "bg-zinc-800/60 text-zinc-100"
          : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
