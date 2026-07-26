import { useMemo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// BAR CHART — vertical bars with gradient fills (cyan→blue→purple→pink)
// ─────────────────────────────────────────────────────────────────────────────
export function BarChart({
  values,
  labels,
  width = 280,
  height = 120,
}: {
  values: number[];
  labels?: string[];
  width?: number;
  height?: number;
}) {
  const max = Math.max(...values);
  const barW = (width - 20) / values.length - 4;
  const gradient = "url(#bar-gradient-cyan-purple-pink)";

  return (
    <svg width={width} height={height} className="block">
      <defs>
        <linearGradient id="bar-gradient-cyan-purple-pink" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="33%" stopColor="#3b82f6" />
          <stop offset="66%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      {values.map((v, i) => {
        const h = (v / max) * (height - 18);
        const x = 10 + i * (barW + 4);
        const y = height - h - 12;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barW}
            height={h}
            rx={2}
            fill={gradient}
            opacity={0.85}
          />
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
  color = "pink",
}: {
  values: number[];
  width?: number;
  height?: number;
  color?: "pink" | "cyan" | "blue" | "purple";
}) {
  const stops = {
    pink:   { start: "#ec4899", end: "#f472b6" },
    cyan:   { start: "#06b6d4", end: "#67e8f9" },
    blue:   { start: "#3b82f6", end: "#60a5fa" },
    purple: { start: "#8b5cf6", end: "#a78bfa" },
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
  gradient?: "cyan-blue" | "purple-pink" | "pink-orange" | "emerald-cyan";
  label?: string;
  value?: string;
}) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;

  const gradients = {
    "cyan-blue":      ["#22d3ee", "#3b82f6"],
    "purple-pink":    ["#8b5cf6", "#ec4899"],
    "pink-orange":    ["#ec4899", "#f97316"],
    "emerald-cyan":   ["#10b981", "#22d3ee"],
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
  color?: "blue" | "pink" | "green" | "purple" | "cyan";
  fill?: boolean;
}) {
  const stops = {
    blue:   "#3b82f6",
    pink:   "#ec4899",
    green:  "#10b981",
    purple: "#8b5cf6",
    cyan:   "#06b6d4",
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
