# AgentOps

> Real-time AI ops console. Live status for agents, MCPs, telemetry, scheduled jobs, and AI suggestions. Open-source, MIT, recruiter-ready.

**Live demo:** https://therayally.github.io/agentops/
**Source:** https://github.com/therayally/agentops

![AgentOps — Live MCP + Agent Console](docs/thumbnail.png)

## What this is

A single-page Vite + React + TypeScript dashboard that demonstrates what a real-time AI operations console can feel like in production. It is built to be readable on first glance, sharp under inspection, and free of any private product or vault names from my real infrastructure.

The whole site is a static build. No backend, no telemetry, no third-party scripts. Open the repo, run `npm install && npm run dev`, and the live demo is on your machine in under a minute.

## What it shows

The page is built as a six-tab operations surface:

- **Live** — Ops Control hero with a clean, mostly open editorial layout, four KPI metrics, a 7-day MCP call chart, an area chart for token throughput, token budget, the MCP server grid, live agent feed, activity timeline, crons, vaults, skills library, and the AI suggestion queue
- **Agents** — All running jobs with parent/child worker trees, token spend, and wall-clock time
- **MCPs** — Full server grid with status, latency, calls per hour, uptime, and last check
- **Vaults** — Namespace index with freshness, rule guards, and alias routing
- **Crons** — Scheduled jobs with their last run and invocation count
- **Logs** — Activity timeline with type filters

The same data model drives all tabs. Switching tabs feels like moving between rooms in the same building rather than between apps.

## Design intent

I rebuilt this several times during the session. The version that ships today follows a few rules:

- **Open composition, not boxed chrome.** The page is mostly type, rules, and whitespace. Smaller widget cards get a thin dark gray border so the eye can find them. Larger sections breathe.
- **Four colors do the work.** Blue, cyan, green, red. Black and gray carry the chrome. No rainbow, no gradient text, no decorative glow.
- **Graphics are SVG, status is color.** Every chart is inline SVG. There are no chart libraries and no fades inside the charts. The chart draws a line. That is the whole point of the chart.
- **No emoji anywhere.** Icons come from the Lucide set. The dashboard reads as a tool, not a feed.
- **Type is deliberate.** Body is DM Sans, numerics and metadata are IBM Plex Mono. Numbers align because the font is tabular.

The overall feel is closer to a tool you would use at work than a marketing page. That is the point.

## Stack

- **Vite 5** + **React 18** + **TypeScript 5**
- **Tailwind CSS 3** for layout primitives
- **Lucide React** for icons
- Hand-rolled inline SVG for every chart
- No backend, no API calls, no third-party scripts

## Run it locally

```bash
npm install
npm run dev      # dev server on :5173
npm run build    # production bundle to docs/
npm run preview  # preview production build
```

## Deploy

The repo is configured for GitHub Pages. `npm run build` outputs to `docs/`, and Pages is set to serve from the `main` branch at the `/docs` path. Push to `main` and the live URL updates within a minute.

## Notes on the demo data

Every name in the dashboard is generic infrastructure vocabulary. The MCP servers are things like `vector-search`, `sql-pool`, `object-store`, `cache`, `queue`. The skills library is a list of public data and AI primitives. There is nothing here that refers to a private product, vault, or real internal job. If a recruiter wants to know what the real infrastructure looks like, that conversation happens in person. The portfolio piece stands on the design and the engineering.

## Repo hygiene

- `node_modules/` is gitignored
- `*.tsbuildinfo` is gitignored
- Production bundle lives in `docs/` and is committed so GitHub Pages can serve it directly
- Vite `base: "./"` so the bundle works under any path

## License

MIT
