import { useMemo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// BAR CHART — vertical bars with ghosted "previous" bar behind each current bar
// Each bar shows two states: the prior value (ghosted, behind) and the current
// value (vibrant gradient, in front). Same width, overlaid, like a slider.
// ─────────────────────────────────────────────────────────────────────────────
export function BarChart({
  values,
  prior,
  width = 280,
  height = 120,
  accent = "cyan",
}: {
  values: number[];
  prior?: number[];
  width?: number;
  height?: number;
  accent?: "cyan" | "red" | "blue" | "green";
}) {
  const gradients = {
    cyan:   { start: "#22d3ee", mid: "#06b6d4", end: "#0891b2" },
    red:    { start: "#ef4444", mid: "#dc2626", end: "#b91c1c" },
    blue:   { start: "#60a5fa", mid: "#3b82f6", end: "#1d4ed8" },
    green:  { start: "#10b981", mid: "#059669", end: "#047857" },
  }[accent];
  const gradId = `bar-grad-${accent}`;

  const max = Math.max(...values, ...(prior || []));
  const n = values.length;
  const padding = 16;
  const gap = 6;
  const barW = (width - padding * 2 - (n - 1) * gap) / n;
  const gradFrom = "url(#" + gradId + ")";

  return (
    <svg width={width} height={height} className="block">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={gradients.start} />
          <stop offset="100%" stopColor={gradients.end} />
        </linearGradient>
      </defs>
      {values.map((v, i) => {
        const prev = prior ? prior[i] : v;
        const x = padding + i * (barW + gap);
        const yBaseline = height - 12;

        // Ghost bar (the prior value) — taller, behind, faded
        const prevH = (prev / max) * (height - 32);
        const prevY = yBaseline - prevH;

        // Current bar — in front, vivid gradient
        const currH = (v / max) * (height - 32);
        const currY = yBaseline - currH;

        // Direction: if current > prior, grew upward; if lower, ghost shows above
        const grew = v >= prev;

        return (
          <g key={i}>
            {/* Ghost bar — desaturated, low opacity, full outline */}
            <rect
              x={x}
              y={prevY}
              width={barW}
              height={prevH}
              rx={3}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth={1.25}
              strokeDasharray="3 3"
              opacity={0.55}
            />
            {/* Faded wash inside the ghost */}
            <rect
              x={x}
              y={prevY}
              width={barW}
              height={prevH}
              rx={3}
              fill="#e2e8f0"
              opacity={0.35}
            />

            {/* Current bar — gradient fill, sits in front */}
            <rect
              x={x}
              y={currY}
              width={barW}
              height={currH}
              rx={3}
              fill={gradFrom}
            />

            {/* Small "head" indicator showing delta direction */}
            <line
              x1={x + barW / 2}
              y1={prevY}
              x2={x + barW / 2}
              y2={currY - 2}
              stroke={grew ? gradients.start : "#f43f5e"}
              strokeWidth={1.5}
              strokeDasharray="2 2"
              opacity={0.5}
            />
          </g>
        );
      })}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AREA CHART — smooth line with gradient fill (pink/cyan)
// ─────────────────────────────────────────────────────────────────────────────
export function AreaChart({
  values,
  width = 280,
  height = 100,
  color = "cyan",
}: {
  values: number[];
  width?: number;
  height?: number;
  color?: "red" | "cyan" | "blue" | "green";
}) {
  const stops = {
    red:    { start: "#dc2626", end: "#ef4444" },
    cyan:   { start: "#06b6d4", end: "#67e8f9" },
    blue:   { start: "#3b82f6", end: "#60a5fa" },
    green:  { start: "#059669", end: "#10b981" },
  }[color];
  const gradId = `area-grad-${color}`;

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = (width - 8) / (values.length - 1);

  const points = values.map((v, i) => {
    const x = 4 + i * step;
    const y = height - 12 - ((v - min) / range) * (height - 24);
    return [x, y] as const;
  });

  // smooth path
  const path = points.reduce((acc, [x, y], i) => {
    if (i === 0) return `M ${x} ${y}`;
    const [px, py] = points[i - 1];
    const cx = (px + x) / 2;
    return `${acc} C ${cx} ${py}, ${cx} ${y}, ${x} ${y}`;
  }, "");

  const areaPath = `${path} L ${points[points.length - 1][0]} ${height - 4} L ${points[0][0]} ${height - 4} Z`;

  return (
    <svg width={width} height={height} className="block">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stops.start} stopOpacity={0.4} />
          <stop offset="100%" stopColor={stops.start} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path
        d={path}
        fill="none"
        stroke={stops.start}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* endpoint dots */}
      {points.filter((_, i) => i % 3 === 0 || i === points.length - 1).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.5} fill="#ffffff" stroke={stops.start} strokeWidth={1.5} />
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DONUT RING — gradient stroke with percentage in center
// ─────────────────────────────────────────────────────────────────────────────
export function DonutRing({
  percent,
  size = 90,
  strokeWidth = 8,
  gradient = "cyan-blue",
  label,
  value,
}: {
  percent: number;
  size?: number;
  strokeWidth?: number;
  gradient?: "cyan-blue" | "blue-cyan" | "red-blue" | "green-cyan";
  label?: string;
  value?: string;
}) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;

  const gradients = {
    "cyan-blue":  ["#0891b2", "#2563eb"],
    "blue-cyan":  ["#2563eb", "#0891b2"],
    "red-blue":   ["#dc2626", "#2563eb"],
    "green-cyan": ["#059669", "#0891b2"],
  }[gradient];
  const gradId = `donut-${gradient}-${size}`;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="block -rotate-90">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={gradients[0]} />
              <stop offset="100%" stopColor={gradients[1]} />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="rgba(0,0,0,0.05)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={`url(#${gradId})`}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-slate-900 tabular-nums">{percent}%</span>
        </div>
      </div>
      {label && <div className="mt-2 text-[10px] font-mono text-slate-500 uppercase tracking-wider">{label}</div>}
      {value && <div className="text-xs font-semibold text-slate-900 tabular-nums">{value}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MINI SPARKLINE — gradient stroke line, no fill
// ─────────────────────────────────────────────────────────────────────────────
export function MiniLine({
  values,
  width = 60,
  height = 24,
  color = "blue",
  fill = true,
}: {
  values: number[];
  width?: number;
  height?: number;
  color?: "blue" | "red" | "green" | "cyan";
  fill?: boolean;
}) {
  const stops = {
    blue:   "#3b82f6",
    red:    "#dc2626",
    green:  "#059669",
    cyan:   "#0891b2",
  }[color];

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = (width - 4) / (values.length - 1);

  const points = values.map((v, i) => {
    const x = 2 + i * step;
    const y = height - 2 - ((v - min) / range) * (height - 4);
    return [x, y] as const;
  });

  const path = points.reduce((acc, [x, y], i) => {
    if (i === 0) return `M ${x} ${y}`;
    const [px, py] = points[i - 1];
    const cx = (px + x) / 2;
    return `${acc} C ${cx} ${py}, ${cx} ${y}, ${x} ${y}`;
  }, "");

  const areaPath = `${path} L ${points[points.length - 1][0]} ${height} L ${points[0][0]} ${height} Z`;
  const gradId = `miniline-${color}`;

  return (
    <svg width={width} height={height} className="block">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stops} stopOpacity={0.3} />
          <stop offset="100%" stopColor={stops} stopOpacity={0} />
        </linearGradient>
      </defs>
      {fill && <path d={areaPath} fill={`url(#${gradId})`} />}
      <path d={path} fill="none" stroke={stops} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
