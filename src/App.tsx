import { useState, useMemo } from "react";
import {
  Activity, Cpu, Database, Zap, AlertTriangle, CheckCircle2, Clock, Search,
  Bot, Server, BookOpen, Filter, ChevronRight, ExternalLink, Settings2,
  Sparkles, TrendingUp, TrendingDown, GitBranch, Terminal, Layers, Radio,
  ArrowUpRight, Shield, Workflow, Network, Brain, Circle, Loader2, Pause,
  Hexagon, ListFilter, LayoutGrid, Calendar, Hash, Gauge, Tag, Star,
  MemoryStick, HardDrive, Cloud, Lock, Cpu as Chip, ServerCog,
} from "lucide-react";
import { mcps, processes, suggestions, timeline, vaults, metrics, crons, heroStats, skills } from "./data";
import { Sparkline } from "./Sparkline";
import { BarChart, AreaChart, DonutRing, MiniLine } from "./charts";
import { chartData, donutData } from "./data";

type Tab = "live" | "agents" | "mcps" | "vaults" | "crons" | "logs";

const statusStyles = {
  healthy:  { dot: "bg-emerald-500", text: "text-emerald-700", chip: "status-healthy",  pill: "tag-green" },
  degraded: { dot: "bg-red-500",   text: "text-red-700",   chip: "status-degraded", pill: "tag-red" },
  down:     { dot: "bg-red-500",    text: "text-red-700",    chip: "status-down",     pill: "tag-red" },
  running:  { dot: "bg-blue-500",    text: "text-blue-700",    chip: "status-running",  pill: "tag-blue" },
  completed:{ dot: "bg-emerald-500", text: "text-emerald-700", chip: "status-completed",pill: "tag-green" },
  queued:   { dot: "bg-zinc-400",    text: "text-zinc-600",    chip: "status-queued",   pill: "tag-gray" },
  awaiting: { dot: "bg-red-500",   text: "text-red-700",   chip: "status-awaiting", pill: "tag-red" },
  ok:       { dot: "bg-emerald-500", text: "text-emerald-700", chip: "status-ok",       pill: "tag-green" },
  missed:   { dot: "bg-red-500",    text: "text-red-700",    chip: "status-missed",   pill: "tag-red" },
  paused:   { dot: "bg-zinc-400",    text: "text-zinc-600",    chip: "status-paused",   pill: "tag-gray" },
  error:    { dot: "bg-red-500",    text: "text-red-700",    chip: "status-error",    pill: "tag-red" },
  fresh:    { dot: "bg-emerald-500", text: "text-emerald-700", chip: "status-fresh",    pill: "tag-green" },
  stale:    { dot: "bg-red-500",   text: "text-red-700",   chip: "status-stale",    pill: "tag-red" },
  missing:  { dot: "bg-red-500",    text: "text-red-700",    chip: "status-missing",  pill: "tag-red" },
  cyan:     { dot: "bg-cyan-500",    text: "text-cyan-700",    chip: "status-cyan",     pill: "tag-cyan" },
  violet:   { dot: "bg-blue-500",  text: "text-blue-700",  chip: "status-violet",   pill: "tag-blue" },
  zinc:     { dot: "bg-zinc-400",    text: "text-zinc-700",    chip: "status-zinc",     pill: "tag-gray" },
  amber:    { dot: "bg-red-500",   text: "text-red-700",   chip: "status-amber",    pill: "tag-red" },
  rose:     { dot: "bg-red-500",    text: "text-red-700",    chip: "status-rose",     pill: "tag-red" },
  emerald:  { dot: "bg-emerald-500", text: "text-emerald-700", chip: "status-emerald",  pill: "tag-green" },
} as const;

const StatusDot = ({ s }: { s: keyof typeof statusStyles }) => (
  <span className="relative inline-block w-2 h-2">
    <span className={`absolute inset-0 rounded-full ${statusStyles[s].dot}`} />
    {(s === "healthy" || s === "running" || s === "fresh" || s === "ok") && (
      <span className={`absolute inset-0 rounded-full ${statusStyles[s].dot} animate-ping opacity-75`} />
    )}
  </span>
);

const CategoryIcon = ({ c }: { c: string }) => {
  const map: Record<string, JSX.Element> = {
    search:   <Search className="w-3.5 h-3.5" />,
    summary:  <Server className="w-3.5 h-3.5" />,
    classify: <Tag className="w-3.5 h-3.5" />,
    embed:    <Brain className="w-3.5 h-3.5" />,
    extract:  <Layers className="w-3.5 h-3.5" />,
    index:    <Hexagon className="w-3.5 h-3.5" />,
    data:     <Database className="w-3.5 h-3.5" />,
    infra:    <Server className="w-3.5 h-3.5" />,
    ops:      <Activity className="w-3.5 h-3.5" />,
    frontend: <LayoutGrid className="w-3.5 h-3.5" />,
    ai:       <Brain className="w-3.5 h-3.5" />,
    core:     <Cpu className="w-3.5 h-3.5" />,
  };
  return map[c] || <Circle className="w-3.5 h-3.5" />;
};

const CategoryTag = ({ c }: { c: string }) => {
  const map: Record<string, string> = {
    search:   "tag-blue",
    summary:  "tag-blue",
    classify: "tag-blue",
    embed:    "tag-cyan",
    extract:  "tag-red",
    index:    "tag-green",
    data:     "tag-blue",
    infra:    "tag-gray",
    ops:      "tag-green",
    frontend: "tag-green",
    ai:       "tag-cyan",
    core:     "tag-blue",
  };
  return (
    <span className={`tag ${map[c] || "tag-gray"} inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold`}>
      <CategoryIcon c={c} />
      {c}
    </span>
  );
};

const PriorityBadge = ({ p }: { p: "p0" | "p1" | "p2" | "p3" }) => {
  const map = {
    p0: "bg-red-100 text-red-700",
    p1: "bg-red-100 text-red-700",
    p2: "bg-blue-100 text-blue-700",
    p3: "bg-zinc-100 text-zinc-600",
  };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold tracking-wider ${map[p]}`}>
      {p.toUpperCase()}
    </span>
  );
};

export default function App() {
  const [tab, setTab] = useState<Tab>("live");
  const [timelineFilter, setTimelineFilter] = useState<"all" | "job" | "mcp" | "cron" | "vault" | "skill" | "alert">("all");
  const [search, setSearch] = useState("");
  const [hoveredMcp, setHoveredMcp] = useState<string | null>(null);

  const filteredTimeline = useMemo(() => {
    return timeline.filter(e => {
      const matchFilter = timelineFilter === "all" || e.type === timelineFilter;
      const matchSearch = search === "" || e.title.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [timelineFilter, search]);

  const mcpHealth = Math.round((mcps.filter(m => m.status === "healthy").length / mcps.length) * 100);
  const processesRunning = processes.filter(p => p.state === "running").length;
  const tokensPct = (parseFloat("1.42") / 2.5) * 100;

  return (
    <div className="min-h-screen">
      {/* TOP NAV — white frosted card */}
      <header className="sticky top-3 z-30 px-4">
        <div className="surface-strong px-5 h-16 flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="icon-tile w-10 h-10 rounded-2xl icon-blue">
              <Network className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-zinc-900">AgentOps</h1>
              <p className="text-[10px] text-zinc-500 -mt-0.5 font-mono">v0.1.0 · live</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1 ml-2">
            <NavTab label="Live" icon={<Radio className="w-3.5 h-3.5" />} active={tab === "live"} onClick={() => setTab("live")} />
            <NavTab label="Agents" icon={<Bot className="w-3.5 h-3.5" />} active={tab === "agents"} onClick={() => setTab("agents")} count={processesRunning} />
            <NavTab label="MCPs" icon={<Server className="w-3.5 h-3.5" />} active={tab === "mcps"} onClick={() => setTab("mcps")} count={mcps.length} />
            <NavTab label="Vaults" icon={<BookOpen className="w-3.5 h-3.5" />} active={tab === "vaults"} onClick={() => setTab("vaults")} count={vaults.length} />
            <NavTab label="Crons" icon={<Clock className="w-3.5 h-3.5" />} active={tab === "crons"} onClick={() => setTab("crons")} count={crons.length} />
            <NavTab label="Logs" icon={<Terminal className="w-3.5 h-3.5" />} active={tab === "logs"} onClick={() => setTab("logs")} />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1.5 pill-input">
              <Search className="w-3 h-3 text-zinc-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search…"
                className="bg-transparent outline-none text-zinc-700 placeholder:text-zinc-400 w-28 text-xs"
              />
            </div>
            <button className="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 transition">
              <Settings2 className="w-3.5 h-3.5 text-zinc-600" />
            </button>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white icon-cyan">
              RA
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 pt-6 pb-12 max-w-[1600px] mx-auto space-y-4">

        {/* LOGS TAB */}
        {tab === "logs" && (
          <div className="surface p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="icon-tile icon-blue"><Terminal className="w-4 h-4 text-white" /></div>
                <div>
                  <h2 className="text-lg font-bold text-zinc-900">Activity Timeline</h2>
                  <p className="text-xs text-zinc-500">last 42 min · {timeline.length} events</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {(["all", "job", "mcp", "cron", "vault", "skill", "alert"] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setTimelineFilter(f)}
                    className={`pill ${timelineFilter === f ? "pill-active" : ""}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative space-y-1 max-h-[700px] overflow-y-auto pr-2">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-zinc-200" />
              {filteredTimeline.map(e => (
                <div key={e.id} className="flex items-start gap-3 relative">
                  <div className={`flex-shrink-0 mt-1.5 w-3.5 h-3.5 rounded-full ${statusStyles[e.color].dot} ring-4 ring-white z-10`} />
                  <div className="flex-1 min-w-0 pb-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-zinc-900">{e.title}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{e.type}</span>
                      <span className="text-zinc-300">·</span>
                      <span className="text-[10px] font-mono text-zinc-400">{e.ts}</span>
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
        )}

        {/* AGENTS TAB */}
        {tab === "agents" && (
          <div className="surface p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="icon-tile icon-blue"><Bot className="w-4 h-4 text-white" /></div>
                <div>
                  <h2 className="text-lg font-bold text-zinc-900">Live Agents</h2>
                  <p className="text-xs text-zinc-500">{processesRunning} running · {processes.length} total</p>
                </div>
              </div>
              <span className="chip">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                streaming
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {processes.map(p => <ProcessCard key={p.pid} p={p} />)}
            </div>
          </div>
        )}

        {/* MCPS TAB */}
        {tab === "mcps" && (
          <div className="surface p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="icon-tile icon-blue"><Server className="w-4 h-4 text-white" /></div>
                <div>
                  <h2 className="text-lg font-bold text-zinc-900">MCP Servers</h2>
                  <p className="text-xs text-zinc-500">{mcps.filter(m => m.status === "healthy").length}/{mcps.length} healthy · {mcpHealth}%</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {mcps.map(m => <McpCard key={m.name} m={m} hovered={hoveredMcp === m.name} onEnter={() => setHoveredMcp(m.name)} onLeave={() => setHoveredMcp(null)} />)}
            </div>
          </div>
        )}

        {/* VAULTS TAB */}
        {tab === "vaults" && (
          <div className="surface p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="icon-tile icon-red"><BookOpen className="w-4 h-4 text-white" /></div>
                <div>
                  <h2 className="text-lg font-bold text-zinc-900">Vault Index</h2>
                  <p className="text-xs text-zinc-500">{vaults.length} namespaces · {vaults.filter(v => v.status === "fresh").length} fresh</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {vaults.map(v => <VaultCard key={v.name} v={v} />)}
            </div>
          </div>
        )}

        {/* CRONS TAB */}
        {tab === "crons" && (
          <div className="surface p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="icon-tile icon-green"><Clock className="w-4 h-4 text-white" /></div>
                <div>
                  <h2 className="text-lg font-bold text-zinc-900">Scheduled Jobs</h2>
                  <p className="text-xs text-zinc-500">{crons.length} total · {crons.filter(c => c.status === "missed" || c.status === "error").length} watch</p>
                </div>
              </div>
              <span className="chip bg-red-100 text-red-700">
                <AlertTriangle className="w-3 h-3" />
                {crons.filter(c => c.status === "missed" || c.status === "error").length} watch
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {crons.map(c => <CronCard key={c.name} c={c} />)}
            </div>
          </div>
        )}

        {/* LIVE TAB */}
        {tab === "live" && (
        <>
        {/* ROW 1: professional dark control header */}
        <section
          className="rounded-[14px] p-8 relative overflow-hidden text-white border border-slate-700"
          style={{
            background: "#111827",
            boxShadow: "0 18px 50px -28px rgba(15, 23, 42, 0.85)",
          }}
        >
          <div className="absolute inset-y-0 left-0 w-1.5 bg-blue-500" />
          <div className="absolute right-0 top-0 h-full w-1/3 bg-slate-800/45" />
          <div className="absolute right-12 top-10 w-20 h-20 rounded-full border border-cyan-400/20" />
          <div className="absolute right-20 top-18 w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />

          <div className="relative grid grid-cols-12 gap-6 items-center">
            <div className="col-span-12 lg:col-span-7">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-white/80 font-bold mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                System · live
              </div>
              <h1 className="text-5xl font-black tracking-tight leading-none">
                Ops Control
              </h1>
              <p className="text-white/90 text-sm mt-3 max-w-md">
                {processesRunning} agents running across {mcps.length} MCP servers · all metrics healthy
              </p>
            </div>
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                  <div className="text-[9px] uppercase tracking-wider text-white/70 font-bold">Uptime</div>
                  <div className="text-2xl font-black tabular-nums">{heroStats.uptime}</div>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                  <div className="text-[9px] uppercase tracking-wider text-white/70 font-bold">MCP healthy</div>
                  <div className="text-2xl font-black tabular-nums">{mcpHealth}%</div>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                  <div className="text-[9px] uppercase tracking-wider text-white/70 font-bold">Incidents</div>
                  <div className="text-2xl font-black tabular-nums">1</div>
                </div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-[9px] uppercase tracking-wider text-white/70 font-bold">Token burn 24h</div>
                  <div className="text-sm font-bold tabular-nums">510k / 2.5M</div>
                </div>
                <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                  <div className="h-full rounded-full bg-cyan-400" style={{width: "20.4%"}} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ROW 2 — 4 KPI tiles, varied */}
        <section className="grid grid-cols-12 gap-4">
          {metrics.map((m, i) => (
            <div key={i} className={`col-span-6 lg:col-span-3 tile relative overflow-hidden`}
              style={{ minHeight: i === 1 ? "148px" : i === 2 ? "118px" : "133px" }}>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{m.label}</div>
                  <div className={`icon-tile w-8 h-8 rounded-lg ${["icon-blue", "icon-cyan", "icon-green", "icon-gray"][i]}`}>
                    {i === 0 && <Zap className="w-3.5 h-3.5 text-white" />}
                    {i === 1 && <Activity className="w-3.5 h-3.5 text-white" />}
                    {i === 2 && <Network className="w-3.5 h-3.5 text-white" />}
                    {i === 3 && <Gauge className="w-3.5 h-3.5 text-white" />}
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-slate-900 tabular-nums">{m.value}</span>
                  <span className={`flex items-center gap-0.5 text-[10px] font-bold font-mono ${m.delta > 0 ? (m.inverse ? "text-red-600" : "text-emerald-600") : "text-slate-500"}`}>
                    {m.delta > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(m.delta).toFixed(1)}%
                  </span>
                </div>
                <div className="mt-3 -mb-1">
                  <MiniLine values={m.trend} width={240} height={32} color={(["blue","cyan","green","blue"] as const)[i]} />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* ROW 3 — Big chart + 2 donut side column */}
        <section className="grid grid-cols-12 gap-4">
          {/* Big bar chart — tall */}
          <div className="col-span-12 lg:col-span-8 tile relative overflow-hidden" style={{minHeight: "280px"}}>
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">MCP calls · 7 days</div>
                  <div className="text-3xl font-black text-slate-900 mt-1 tabular-nums">31,420</div>
                  <div className="text-xs text-emerald-600 font-bold mt-0.5">+18.2% vs prior week</div>
                </div>
                <div className="flex items-center gap-1.5 pill">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  calls
                </div>
              </div>
              <BarChart values={chartData.mcpCalls7d.map(d => d.v)} width={620} height={160} />
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-2 px-2">
                {chartData.mcpCalls7d.map(d => <span key={d.d}>{d.d}</span>)}
              </div>
            </div>
          </div>

          {/* 2 donut rings stacked */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
            <div className="tile relative overflow-hidden flex-1 border-l-4 border-blue-500">
              <div className="relative">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">Model mix</div>
                <div className="grid grid-cols-2 gap-1">
                  {donutData.modelMix.slice(0, 2).map(d => (
                    <DonutRing key={d.label} percent={d.value} size={48} strokeWidth={5} gradient={d.gradient} label={d.label} />
                  ))}
                </div>
              </div>
            </div>
            <div className="tile relative overflow-hidden flex-1 border-l-4 border-emerald-600">
              <div className="relative">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">Capacity</div>
                <div className="grid grid-cols-2 gap-1">
                  {donutData.capacity.slice(0, 2).map(d => (
                    <DonutRing key={d.label} percent={d.value} size={48} strokeWidth={5} gradient={d.gradient} label={d.label} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ROW 4 — Area chart wide + token budget gradient */}
        <section className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8 tile relative overflow-hidden" style={{minHeight: "260px"}}>
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Token throughput · 24h</div>
                  <div className="text-3xl font-black text-slate-900 mt-1 tabular-nums">510k</div>
                  <div className="text-xs text-cyan-700 font-bold mt-0.5">peak 3:42 PM · 28k/hr</div>
                </div>
                <div className="flex items-center gap-1.5 pill">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
                  tokens/hr
                </div>
              </div>
              <AreaChart values={chartData.tokens24h} width={620} height={140} color="cyan" />
              <div className="grid grid-cols-4 gap-3 mt-4">
                <div>
                  <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Total</div>
                  <div className="text-base font-bold text-slate-900 tabular-nums">510k</div>
                </div>
                <div>
                  <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Avg/hr</div>
                  <div className="text-base font-bold text-slate-900 tabular-nums">21.2k</div>
                </div>
                <div>
                  <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Peak</div>
                  <div className="text-base font-bold text-cyan-700 tabular-nums">28k</div>
                </div>
                <div>
                  <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Cost</div>
                  <div className="text-base font-bold text-slate-900 tabular-nums">$12.40</div>
                </div>
              </div>
            </div>
          </div>

          {/* Token budget: black operations card */}
          <div
            className="col-span-12 lg:col-span-4 rounded-2xl p-5 relative overflow-hidden text-white border border-zinc-700"
            style={{ background: "#09090b" }}
          >
            <div className="absolute inset-y-0 right-0 w-1 bg-emerald-500" />
            <div className="relative">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-white/80 font-bold mb-3">
                <Zap className="w-3 h-3" />
                Token budget
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black tabular-nums">{heroStats.tokensToday}</span>
                <span className="text-sm text-white/70 font-mono">/ {heroStats.tokenBudget}</span>
              </div>
              <div className="mt-4 h-3 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${tokensPct}%` }} />
              </div>
              <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-white/80">
                <span>{tokensPct.toFixed(0)}% used</span>
                <span>on track for 1.78M</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-white/20">
                <div>
                  <div className="text-[10px] font-mono text-white/70 uppercase tracking-wider">Today</div>
                  <div className="text-lg font-bold tabular-nums">142k</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-white/70 uppercase tracking-wider">Week</div>
                  <div className="text-lg font-bold tabular-nums">847k</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-white/70 uppercase tracking-wider">Avg/day</div>
                  <div className="text-lg font-bold tabular-nums">121k</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ROW 5 — Varied bottom row */}
        <section className="grid grid-cols-12 gap-4">
          {/* MCP servers - medium */}
          <div className="col-span-12 lg:col-span-5 surface p-5">
            <SectionHeader
              icon="blue"
              iconComp={<Server className="w-4 h-4 text-white" />}
              title="MCP Servers"
              badge={`${mcps.filter(m => m.status === "healthy").length}/${mcps.length} healthy`}
              action="View all"
              onAction={() => setTab("mcps")}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {mcps.slice(0, 4).map(m => <McpCard key={m.name} m={m} hovered={hoveredMcp === m.name} onEnter={() => setHoveredMcp(m.name)} onLeave={() => setHoveredMcp(null)} compact />)}
            </div>
          </div>

          {/* Live Agents - tall */}
          <div className="col-span-12 lg:col-span-7 surface p-5">
            <SectionHeader
              icon="blue"
              iconComp={<Bot className="w-4 h-4 text-white" />}
              title="Live Agents"
              badge={`${processesRunning} running`}
              action="View all"
              onAction={() => setTab("agents")}
              trailing={<span className="chip"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />streaming</span>}
            />
            <div className="space-y-1.5">
              {processes.slice(0, 6).map(p => <ProcessRow key={p.pid} p={p} />)}
            </div>
          </div>
        </section>

        {/* ROW 6 — Timeline + Crons + Vaults + Skills - varied sizes */}
        <section className="grid grid-cols-12 gap-4">
          {/* Activity Timeline - wide */}
          <div className="col-span-12 lg:col-span-7 surface p-5">
            <SectionHeader
              icon="blue"
              iconComp={<Terminal className="w-4 h-4 text-white" />}
              title="Activity Timeline"
              badge="last 42 min"
              trailing={
                <div className="flex items-center gap-1">
                  {(["all", "job", "mcp", "cron", "vault", "skill", "alert"] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setTimelineFilter(f)}
                      className={`pill ${timelineFilter === f ? "pill-active" : ""}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              }
              action="View all"
              onAction={() => setTab("logs")}
            />
            <div className="relative space-y-1 max-h-[320px] overflow-y-auto pr-2">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-200" />
              {filteredTimeline.map(e => (
                <div key={e.id} className="flex items-start gap-3 relative">
                  <div className={`flex-shrink-0 mt-1.5 w-3.5 h-3.5 rounded-full ${statusStyles[e.color].dot} ring-4 ring-white z-10`} />
                  <div className="flex-1 min-w-0 pb-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-slate-900">{e.title}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{e.type}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[10px] font-mono text-slate-400">{e.ts}</span>
                    </div>
                  </div>
                </div>
              ))}
              {filteredTimeline.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-500 font-mono">
                  no events match filter
                </div>
              )}
            </div>
          </div>

          {/* Crons - small */}
          <div className="col-span-12 lg:col-span-2 surface p-5">
            <SectionHeader
              icon="teal"
              iconComp={<Clock className="w-4 h-4 text-white" />}
              title="Crons"
              badge={`${crons.length}`}
              action="View"
              onAction={() => setTab("crons")}
            />
            <div className="space-y-1.5">
              {crons.slice(0, 4).map(c => <CronRow key={c.name} c={c} />)}
            </div>
          </div>

          {/* Vaults - small */}
          <div className="col-span-12 lg:col-span-3 surface p-5">
            <SectionHeader
              icon="rose"
              iconComp={<BookOpen className="w-4 h-4 text-white" />}
              title="Vaults"
              badge={`${vaults.length}`}
              action="View"
              onAction={() => setTab("vaults")}
            />
            <div className="space-y-1.5">
              {vaults.slice(0, 4).map(v => <VaultRow key={v.name} v={v} />)}
            </div>
          </div>
        </section>

        {/* ROW 7 — Skills library + AI Suggestions - varied */}
        <section className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-7 surface p-5">
            <SectionHeader
              icon="mint"
              iconComp={<Brain className="w-4 h-4 text-white" />}
              title="Skills Library"
              badge={`${skills.length} indexed`}
              trailing={
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                    {skills.filter(s => s.active).length} active
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    {skills.filter(s => !s.active).length} cached
                  </span>
                </div>
              }
            />
            <div className="flex flex-wrap gap-1.5">
              {skills.map(s => (
                <span
                  key={s.name}
                  className={`tag ${s.active ? "tag-cyan" : CategoryTagColor(s.category)} inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono transition`}
                >
                  <CategoryIcon c={s.category} />
                  {s.name}
                </span>
              ))}
            </div>
          </div>

          {/* AI Suggestions - 5 wide */}
          <div className="col-span-12 lg:col-span-5 surface p-5">
            <SectionHeader
              icon="cyan"
              iconComp={<Sparkles className="w-4 h-4 text-white" />}
              title="AI Suggestions"
              badge={`${suggestions.length} queued`}
              badgeColor="rose"
              action="View all"
              onAction={() => {}}
            />
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {suggestions.slice(0, 5).map(s => (
                <div key={s.rank} className="surface-soft p-3 hover:bg-slate-50 transition group cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600 bg-white border border-slate-200">
                      {s.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <PriorityBadge p={s.priority} />
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{s.source}</span>
                      </div>
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition truncate">
                        {s.title}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">{s.detail}</div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition flex-shrink-0 text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold">
                      {s.action}
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <div className="surface px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                snapshot · captured 0:42 ago
              </span>
              <span className="text-slate-300">·</span>
              <span>therayally/agentops</span>
              <span className="text-slate-300">·</span>
              <span>MIT</span>
            </div>
            <a
              href="https://github.com/therayally/agentops"
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 transition font-semibold"
            >
              view source <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </footer>
        </>
        )}
      </main>
    </div>
  );
}

function CategoryTagColor(c: string): string {
  const map: Record<string, string> = {
    search:   "tag-blue",
    summary:  "tag-blue",
    classify: "tag-blue",
    embed:    "tag-cyan",
    extract:  "tag-red",
    index:    "tag-green",
    data:     "tag-blue",
    infra:    "tag-gray",
    ops:      "tag-green",
    frontend: "tag-green",
    ai:       "tag-cyan",
    core:     "tag-blue",
  };
  return map[c] || "tag-gray";
}

function NavTab({ label, icon, active = false, onClick, count }: { label: string; icon: React.ReactNode; active?: boolean; onClick: () => void; count?: number }) {
  return (
    <button
      onClick={onClick}
      className={`nav-tab ${active ? "nav-tab-active" : ""}`}
    >
      {icon}
      {label}
      {count !== undefined && (
        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${active ? "bg-blue-100 text-blue-700" : "bg-zinc-100 text-zinc-500"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function SectionHeader({ icon, iconComp, title, badge, badgeColor, action, onAction, trailing }: {
  icon: string;
  iconComp: React.ReactNode;
  title: string;
  badge?: string;
  badgeColor?: "emerald" | "amber" | "rose" | "indigo";
  action?: string;
  onAction?: () => void;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        <div className={`icon-tile icon-${icon}`}>{iconComp}</div>
        <h3 className="font-bold text-sm text-zinc-900">{title}</h3>
        {badge && <span className="chip">{badge}</span>}
      </div>
      <div className="flex items-center gap-2">
        {trailing}
        {action && onAction && (
          <button onClick={onAction} className="pill">
            {action}
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

function McpCard({ m, hovered, onEnter, onLeave, compact = false }: { m: any; hovered: boolean; onEnter: () => void; onLeave: () => void; compact?: boolean }) {
  return (
    <button
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`w-full text-left flex items-center gap-3 rounded-xl border transition ${
        compact ? "p-3" : "p-4"
      } ${
        hovered
          ? "bg-zinc-50 border-blue-200"
          : "bg-white border-zinc-200 hover:bg-zinc-50"
      }`}
    >
      <div className="flex-shrink-0"><StatusDot s={m.status} /></div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-zinc-900">{m.name}</span>
          {m.status === "degraded" && <span className="text-[9px] font-mono text-red-700 bg-red-100 px-1.5 rounded">5xx</span>}
          {m.status === "down" && <span className="text-[9px] font-mono text-red-700 bg-red-100 px-1.5 rounded">DOWN</span>}
        </div>
        {!compact && <div className="text-[11px] text-zinc-500 mt-0.5">{m.description}</div>}
        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 mt-0.5">
          <span>{m.calls1h.toLocaleString()} calls/h</span>
          <span className="text-zinc-300">·</span>
          <span>{m.uptime}</span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="font-mono text-xs text-zinc-900 tabular-nums font-semibold">{m.latency}ms</div>
        <div className="text-[9px] font-mono text-zinc-500">{m.lastCheck}</div>
      </div>
    </button>
  );
}

function ProcessRow({ p }: { p: any }) {
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-50 transition group">
      <div className="flex-shrink-0 text-zinc-500">
        {p.state === "running" ? <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" /> :
         p.state === "completed" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> :
         p.state === "awaiting" ? <Pause className="w-3.5 h-3.5 text-red-500" /> :
         <Circle className="w-3.5 h-3.5 text-zinc-400" />}
      </div>
      <div className="flex-shrink-0">
        <span className="font-mono text-[10px] text-zinc-600 px-1.5 py-0.5 rounded-md bg-zinc-100">
          {p.pid}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <CategoryTag c={p.category} />
          {p.parent && (
            <>
              <span className="text-zinc-300 text-xs">→</span>
              <span className="font-mono text-[10px] text-zinc-500">{p.parent}</span>
            </>
          )}
        </div>
        <div className="text-sm text-zinc-900 truncate mt-0.5">{p.task}</div>
      </div>
      <div className="flex-shrink-0 text-right">
        <div className="font-mono text-xs text-zinc-700 tabular-nums font-semibold">
          {p.duration > 0 ? `${Math.floor(p.duration / 60)}m ${p.duration % 60}s` : "—"}
        </div>
        <div className="text-[10px] font-mono text-zinc-500">
          {p.tokens > 0 ? `${(p.tokens / 1000).toFixed(1)}k tok` : "—"}
        </div>
      </div>
    </div>
  );
}

function ProcessCard({ p }: { p: any }) {
  const iconColor = p.state === "running" ? "icon-blue" :
                    p.state === "completed" ? "icon-green" :
                    p.state === "awaiting" ? "icon-red" :
                    "icon-gray";
  return (
    <div className="surface-soft p-4 hover:bg-zinc-50 transition">
      <div className="flex items-start gap-3">
        <div className={`icon-tile w-10 h-10 rounded-xl ${iconColor}`}>
          <CategoryIcon c={p.category} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] font-bold text-zinc-700 bg-zinc-100 px-1.5 py-0.5 rounded">{p.pid}</span>
            <span className={`chip ${statusStyles[p.state as keyof typeof statusStyles].chip}`}>
              <StatusDot s={p.state} />
              {p.state}
            </span>
            {p.parent && <span className="font-mono text-[10px] text-zinc-500">→ {p.parent}</span>}
          </div>
          <div className="text-sm font-semibold text-zinc-900 leading-snug">{p.task}</div>
          <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-zinc-500">
            <span>{p.started}</span>
            <span className="text-zinc-300">·</span>
            <span>{p.duration > 0 ? `${Math.floor(p.duration / 60)}m ${p.duration % 60}s` : "—"}</span>
            <span className="text-zinc-300">·</span>
            <span>{p.tokens > 0 ? `${(p.tokens / 1000).toFixed(1)}k tok` : "— tok"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function VaultRow({ v }: { v: any }) {
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-50 transition group">
      <div className="flex-shrink-0"><StatusDot s={v.status} /></div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-zinc-900 group-hover:text-blue-700 transition truncate">
            {v.name}
          </span>
          {v.hasRule && <Shield className="w-3 h-3 text-blue-500 flex-shrink-0" />}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] font-mono text-zinc-500">{v.type}</span>
          <span className="text-zinc-300">·</span>
          <span className="text-[10px] font-mono text-zinc-500">{v.size}</span>
          <span className="text-zinc-300">·</span>
          <span className="text-[10px] font-mono text-zinc-500">{v.lastTouched}</span>
        </div>
        {v.aliases.length > 0 && (
          <div className="flex items-center gap-1 mt-1">
            {v.aliases.map((a: string) => (
              <span key={a} className="text-[9px] font-mono text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded-md">
                {a}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function VaultCard({ v }: { v: any }) {
  const iconColor = v.status === "fresh" ? "icon-green" :
                    v.status === "stale" ? "icon-red" :
                    "icon-red";
  return (
    <div className="surface-soft p-4 hover:bg-zinc-50 transition">
      <div className="flex items-start gap-3">
        <div className={`icon-tile w-10 h-10 rounded-xl ${iconColor}`}>
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-zinc-900">{v.name}</span>
            {v.hasRule && <Shield className="w-3 h-3 text-blue-500" />}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`chip ${statusStyles[v.status as keyof typeof statusStyles].chip}`}>
              <StatusDot s={v.status} />
              {v.status}
            </span>
            <span className="font-mono text-[10px] text-zinc-500">{v.type}</span>
            <span className="text-zinc-300">·</span>
            <span className="font-mono text-[10px] text-zinc-500">{v.size}</span>
          </div>
          {v.aliases.length > 0 && (
            <div className="flex items-center gap-1">
              {v.aliases.map((a: string) => (
                <span key={a} className="text-[9px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-md">
                  {a}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="text-[10px] font-mono text-zinc-500">{v.lastTouched}</div>
      </div>
    </div>
  );
}

function CronRow({ c }: { c: any }) {
  return (
    <div className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-zinc-50 transition">
      <StatusDot s={c.status} />
      <div className="flex-1 min-w-0">
        <div className="text-xs font-mono font-semibold text-zinc-900 truncate">{c.name}</div>
        <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-1.5">
          <Calendar className="w-3 h-3" />
          <span>{c.schedule}</span>
          <span className="text-zinc-300">·</span>
          <span>{c.lastRun}</span>
        </div>
      </div>
      <div className="text-[10px] font-mono text-zinc-500 flex-shrink-0">{c.invocations}×</div>
    </div>
  );
}

function CronCard({ c }: { c: any }) {
  const iconColor = c.status === "ok" ? "icon-green" :
                    c.status === "missed" ? "icon-red" :
                    c.status === "paused" ? "icon-gray" :
                    "icon-red";
  return (
    <div className="surface-soft p-4 hover:bg-zinc-50 transition">
      <div className="flex items-start gap-3 mb-3">
        <div className={`icon-tile w-10 h-10 rounded-xl ${iconColor}`}>
          <Clock className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-zinc-900 mb-1">{c.name}</div>
          <span className={`chip ${statusStyles[c.status as keyof typeof statusStyles].chip}`}>
            <StatusDot s={c.status} />
            {c.status}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        <div className="bg-white rounded-lg p-2 border border-zinc-100">
          <div className="font-mono text-zinc-500 uppercase tracking-wider">Schedule</div>
          <div className="font-mono text-zinc-900 font-semibold mt-0.5">{c.schedule}</div>
        </div>
        <div className="bg-white rounded-lg p-2 border border-zinc-100">
          <div className="font-mono text-zinc-500 uppercase tracking-wider">Last run</div>
          <div className="font-mono text-zinc-900 font-semibold mt-0.5">{c.lastRun}</div>
        </div>
        <div className="bg-white rounded-lg p-2 border border-zinc-100">
          <div className="font-mono text-zinc-500 uppercase tracking-wider">Cost</div>
          <div className="font-mono text-zinc-900 font-semibold mt-0.5">{c.expectedCost}</div>
        </div>
        <div className="bg-white rounded-lg p-2 border border-zinc-100">
          <div className="font-mono text-zinc-500 uppercase tracking-wider">Invocations</div>
          <div className="font-mono text-zinc-900 font-semibold mt-0.5">{c.invocations}</div>
        </div>
      </div>
    </div>
  );
}
