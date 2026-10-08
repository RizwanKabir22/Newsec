# Newsec Project Hub · Dashboard Overview

Interactive design concept of the Project Hub overview dashboard for Newsec: light and dark themes, English and Danish, full motion, and an AI daily time breakdown. All data is sample data.

**Live:** https://rizwankabir22.github.io/Newsec/

## What's in it

- Hero with greeting, animated CTAs and a frosted-glass Portfolio card
- **Needs your attention**: filterable queue; clear items, approve hours in the review drawer
- **Gate reviews**: next gate, two-week calendar, upcoming gates
- **This week's time** → opens the **Daily AI breakdown**: the AI drafts one day at a time (calendar, email, documents), with editable hours, project, chargeable toggle, write-off, Confirm day and Submit week
- Cost overview, correspondence, and an interactive **Projects by phase** board (phase tiles, customer menu, segment filter, keyboard arrows)
- Collapsible sidebar, light/dark toggle, DA/EN switch (remembered per browser)

## Run locally

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # type-check + production build in dist/
npm run build:single # also writes dist/project-hub.html, one self-contained file
```

## Deploy

Every push to `main` builds the site and publishes it to GitHub Pages (`.github/workflows/deploy.yml`).
In the repository settings, **Pages → Source** must be set to **GitHub Actions** (one-time).

## Structure

| Path | What it is |
| --- | --- |
| `src/App.tsx` | Page layout, state wiring, theme + language persistence |
| `src/state.ts`, `src/week.ts` | Typed reducers: dashboard state; the PM's own week of time entries |
| `src/data.ts` | Sample content (projects, queue, gates, cost, mail) and the theme palette |
| `src/i18n.tsx` | English → Danish dictionary and number formatting |
| `src/components/` | One memoised component per area (Sidebar, Header, Hero, Attention, Gates, TimeCard, TimeDrawer, CostCard, Mail, PhaseBoard, CustomerMenu, HoursDrawer) |
| `src/motion.ts` | Entrance reveals and micro-interactions (Web Animations API, off under `prefers-reduced-motion`) |
| `src/styles.css` | Styles; light is the default, dark mode sets tokens on `<html data-dash-theme="dark">` |

Built with React 19, TypeScript and Vite.
