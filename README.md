# PAINTER-OS

> Free business tools for Australian tradies — pricing, quoting, and dashboards in one place.

---

## Features

| Tool | Description |
|------|-------------|
| **Pricing Tool** | Calculates true cost per billable hour, minimum rate to hit your target margin, and AI-powered business coaching |
| **Quote Builder** | Line-item quotes with GST (10%), profit margin control, and print-to-PDF export |
| **Dashboard** | Aggregates all saved quotes — totals, GST liability, monthly volume |

---

## Quick Start

### One-command install & launch

```bash
curl -fsSL https://raw.githubusercontent.com/itayz22/PAINTER-OS/master/install.sh | bash
```

> Requires **Node.js ≥ 18** and **git**.

### Manual setup

```bash
git clone https://github.com/itayz22/PAINTER-OS.git
cd PAINTER-OS
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Docker

### Production (nginx, port 8080)

```bash
docker compose up --build
```

### Development (hot-reload, port 5173)

```bash
docker compose --profile dev up dev
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier format |
| `npm run format:check` | Prettier check (CI) |

---

## Tech Stack

- **React 18** — UI
- **React Router v7** — client-side routing
- **Vite 5** — build tool
- **Tailwind CSS v4** — utility styles (new components)
- **ESLint 9 + Prettier** — code quality
- **Docker / nginx** — production deployment
- **GitHub Actions** — CI (lint + build on every push/PR)

---

## Project Structure

```
src/
  App.jsx                  # Router root
  main.jsx                 # Entry point
  index.css                # Global styles + Tailwind
  TradiePricingTool.jsx    # Core pricing calculator
  components/
    Nav.jsx                # Sticky navigation bar
    Footer.jsx             # Site footer
  context/
    AppContext.jsx          # Global state (trade, saved quotes)
  pages/
    LandingPage.jsx        # Home / marketing page
    PricingToolPage.jsx    # Wraps TradiePricingTool
    QuoteBuilderPage.jsx   # GST-inclusive quote builder
    DashboardPage.jsx      # Saved quotes dashboard
.github/workflows/
  ci.yml                   # Lint + build CI
Dockerfile                 # Multi-stage build (node → nginx)
docker-compose.yml         # Production + dev profiles
install.sh                 # One-command installer
```

---

## CI / CD

GitHub Actions runs on every push to `master` and all `claude/**` branches, and on pull requests to `master`:

1. Install dependencies (`npm ci`)
2. Lint (`eslint src`)
3. Format check (`prettier --check src`)
4. Build (`vite build`)
5. Upload `dist/` as an artifact (7-day retention)

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit with a clear message
4. Open a pull request against `master`

---

## License

MIT
