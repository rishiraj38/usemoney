# UseMoney AI — SDE Intern Assignment

> AI-powered trading platform for Indian markets. Paper-trade with live data, get StockSage AI insights, and unify all your brokers in one dashboard.

**Live Product**: [qa.usemoney.ai](https://qa.usemoney.ai)

---

## Live Demo

| Assignment | URL |
|------------|-----|
| **Assignment 1** — Practice Tracking & Notifications | [usemoney-five.vercel.app/practice](https://usemoney-five.vercel.app/practice) |
| **Assignment 2** — Landing Page Redesign | [usemoney-five.vercel.app](https://usemoney-five.vercel.app) |
| **System Design Document** | [`docs/SYSTEM_DESIGN.md`](docs/SYSTEM_DESIGN.md) |

---

## Assignments Completed

### Assignment 1: Practice Tracking & User Notification System

**Objective**: Design the system for practice (paper) trading and user notifications, and build the UI.

**What was built:**

| Deliverable | Description |
|-------------|-------------|
| **System Design** | Full architecture doc covering data models, API design, notification engine, real-time WebSocket flow, and database schema → [`docs/SYSTEM_DESIGN.md`](docs/SYSTEM_DESIGN.md) |
| **Type Definitions** | TypeScript interfaces for `PaperTrade`, `Notification`, `PortfolioStats`, `PracticeSession`, `NotificationPreferences` → [`src/types/practice.ts`](src/types/practice.ts) |
| **StatsGrid** | 8-card responsive grid displaying portfolio value, P&L, win rate, risk score, open positions, best/worst trade, and avg holding period |
| **TradesTable** | Filterable (All/Open/Closed) trades table with live P&L calculation, detail modal with position info and trade notes |
| **TradeForm** | Paper trade placement modal with stock search/autocomplete, BUY/SELL toggle, quantity input, stop loss/target, and trade notes |
| **PerformanceChart** | Recharts area chart showing portfolio equity curve with 1W/1M/3M/ALL time period filters |
| **NotificationPanel** | Real-time notification feed with 7 alert types, severity-based styling, mark-read/dismiss actions, and preference settings |
| **Mock Data** | Realistic sample data with 8 trades, 7 notifications, and 22-day performance history → [`src/data/mockPractice.ts`](src/data/mockPractice.ts) |

**Key system design highlights:**
- **7 notification types**: Price Alert, Target Hit, Stop Loss, Trade Executed, AI Insight, Portfolio Update, Achievement
- **3 delivery channels**: In-App (WebSocket), Push (FCM), Email (SES)
- **Auto-close engine**: Background price monitor auto-closes trades when SL/Target is hit
- **Smart preferences**: Per-type toggles, quiet hours, channel selection
- **P&L calculation**: Real-time unrealized P&L for open positions + realized P&L for closed trades

### Assignment 2: Landing Page Redesign

**Objective**: Review the current landing page and redesign/rebuild it.

**What was built:**

| Component | Description |
|-----------|-------------|
| **Hero Section** | 3D trading terminal mockup with live order book, area chart, StockSage AI badge, and tilt interaction |
| **LiveTickerTape** | Infinite scrolling stock ticker with simulated real-time price updates |
| **TradingTerminalMockup** | Authentic dark-mode terminal with chart, order book (asks/bids), timeframe selectors |
| **TiltCard** | 3D hover effect using Framer Motion springs (4° max tilt) |
| **MagneticButton** | Cursor-attracted CTA buttons with spring physics |
| **AuroraBackground** | CSS-only animated gradient orbs (replaces canvas particles for 60fps) |
| **AnimatedGridFloor** | Perspective CSS grid for depth effect |
| **AnimatedCounter** | Number counting animation for stats |
| **Features Section** | 4-feature grid with icons and descriptions |
| **How It Works** | Step-by-step interactive guide with animated illustrations |
| **Pricing** | Three-tier pricing cards with feature comparison |
| **Trust / Security** | Security badges and compliance information |
| **Testimonials** | User review cards |
| **CTA** | Final call-to-action with animated border gradient |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) + TypeScript |
| **Styling** | Tailwind CSS v4 + Custom CSS design tokens |
| **Animations** | Framer Motion (springs, layout animations) |
| **Charts** | Recharts (area charts, bar charts) |
| **Icons** | Lucide React |
| **Fonts** | Inter (UI) + JetBrains Mono (data/numbers) |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout (global backgrounds)
│   ├── globals.css                 # Design system tokens & utilities
│   └── practice/
│       ├── page.tsx                # Practice trading dashboard
│       └── layout.tsx              # Practice layout (navbar + footer)
├── components/
│   ├── landing/                    # Landing page sections
│   │   ├── Hero.tsx                # Hero with trading terminal
│   │   ├── Navbar.tsx              # Navigation bar
│   │   ├── Features.tsx            # Feature cards grid
│   │   ├── HowItWorks.tsx          # Step-by-step guide
│   │   ├── Pricing.tsx             # Pricing tiers
│   │   ├── Trust.tsx               # Security & trust badges
│   │   ├── Testimonials.tsx        # User reviews
│   │   ├── CTA.tsx                 # Call to action
│   │   └── Footer.tsx              # Footer
│   ├── practice/                   # Practice trading components
│   │   ├── StatsGrid.tsx           # 8-card portfolio metrics
│   │   ├── TradesTable.tsx         # Trades table with filters
│   │   ├── TradeForm.tsx           # New trade modal
│   │   ├── PerformanceChart.tsx    # Portfolio equity curve
│   │   └── NotificationPanel.tsx   # Notification feed + settings
│   └── ui/                         # Reusable UI components
│       ├── TradingTerminalMockup.tsx
│       ├── LiveTickerTape.tsx
│       ├── TiltCard.tsx
│       ├── MagneticButton.tsx
│       ├── AuroraBackground.tsx
│       ├── AnimatedGridFloor.tsx
│       ├── AnimatedCounter.tsx
│       └── Typewriter.tsx
├── types/
│   └── practice.ts                 # TypeScript interfaces
└── data/
    └── mockPractice.ts             # Mock data for practice dashboard

docs/
└── SYSTEM_DESIGN.md                # Full system design document
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — Landing page  
Open [http://localhost:3000/practice](http://localhost:3000/practice) — Practice trading dashboard

---

## Design Decisions

1. **CSS over Canvas for backgrounds** — Canvas particles caused jitter on mobile. CSS `@keyframes` + `filter: blur()` achieves the same effect at 60fps with zero main-thread overhead.

2. **Inline styles for critical layout** — Tailwind v4 occasionally has specificity issues with dynamic values. Layout-critical properties use inline styles to guarantee correct rendering.

3. **Emerald/charcoal color scheme** — Green = profit in trader psychology. Dark backgrounds reduce eye strain during long sessions. Follows Bloomberg Terminal and TradingView design conventions.

4. **Full-width notification cards** — Instead of cramming notifications into a narrow sidebar, they render as a responsive card grid that adapts from 1 to 3 columns based on viewport width.

5. **Monospace for financial data** — All prices, P&L values, and quantities use JetBrains Mono with `tabular-nums` for perfect digit alignment in tables.

---

## Author

**Rishi Raj** — SDE Intern Assignment for UseMoney AI
