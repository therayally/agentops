# AgentOps — Real-time AI Ops Console

> Live dashboard for an AI agent fleet. MCP servers, active agents, vault index, AI suggestion queue, cron health, and a 24h activity timeline — all in one screen.

**Live demo:** https://therayally.github.io/agentops

## What's in it

AgentOps is a single-page Vite + React + Tailwind app that demonstrates what a real-time AI ops console can look like. It ships with seeded demo data so anyone can clone, run, and see the full layout without wiring a backend.

The build targets the kind of fleet you're running if you operate multiple AI agents across messaging platforms, cron jobs, and external APIs:

- **MCP grid** — health, latency, calls-per-hour, last-check for every Model Context Protocol server you run
- **Live agents** — current processes running in your orchestrator, with parent-child worker trees, token spend, and wall-clock time
- **AI suggestion queue** — auto-generated next-step recommendations ranked by priority, with source attribution (anomaly / pattern / cost / schedule)
- **Vault index** — every project vault in your agent memory, with freshness, rule guards, and alias routing
- **Cron health** — every scheduled job and whether it actually fired in its window
- **Activity timeline** — last 24h of agent events with type filters
- **Token budget** — daily spend vs weekly trend

## Stack

- **Vite 5** + React 18 + TypeScript 5
- **Tailwind CSS 3** (custom dark theme, glass cards, animated pulse dots)
- **Lucide React** (consistent icon set)
- **Inline SVG sparklines** (no chart library)

No backend, no API calls, no telemetry. Pure static demo, ready to host on GitHub Pages.

## Run it locally

```bash
npm install
npm run dev      # dev server on :5173
npm run build    # production bundle to dist/
npm run preview  # preview production build
```

## Deploy

The repo is configured for GitHub Pages. `npm run build` outputs to `dist/`, which serves as the static site root. GitHub Pages is configured on the `main` branch, root path.

## Visual language

Dark mode by default. The palette is a near-black zinc base with electric cyan accents — the look says "ops console," not "consumer app." Glass cards with subtle borders, ambient gradient glows in the corners, and animated pulse dots on healthy states.

## Design notes

This is a portfolio piece. It demonstrates:

- Layout thinking (8 distinct sections, each with its own visual treatment, no two cards looking the same)
- Information density (real data, real numbers, real metrics — not lorem ipsum)
- Component variety (buttons, badges, dropdowns, filters, sparklines, timelines, tags)
- State design (hover states, active filters, priority badges, status indicators)
- Production polish (zero console errors, responsive grid, dark mode, animated loading states)

## The fleet behind it

The data shown in the static demo is a snapshot of a real Hermes agent fleet running ~12 agents across 8 MCPs, 6 cron jobs, and 6 project vaults. The dashboard is the public-facing view of that infrastructure. The actual private infrastructure (BizzieBot, Backwater Hat Co, The Find Drop, etc.) is kept local — only the structural shape is published.

## Repo hygiene

- `node_modules/` gitignored
- `dist/` gitignored (build artifact)
- Vite `base: "./"` so the build works from any subpath
- No deployment scripts — push to `main` and GitHub Pages picks up `dist/`

## License

MIT
