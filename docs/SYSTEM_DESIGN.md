# System Design: Practice Tracking & User Notifications

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Data Models](#data-models)
4. [API Design](#api-design)
5. [Practice Tracking System](#practice-tracking-system)
6. [Notification System](#notification-system)
7. [Real-Time Updates](#real-time-updates)
8. [Security & Edge Cases](#security--edge-cases)
9. [Tech Stack](#tech-stack)

---

## Overview

The Practice Tracking system allows users to **paper-trade with live market data** without risking real money. It simulates a complete trading lifecycle — from order placement to P&L tracking — while providing AI-powered insights and a robust notification system to keep traders informed.

### Key Goals
- **Zero-risk learning**: Users trade with virtual capital (₹10,00,000 default).
- **Live market parity**: Paper trades use real-time NSE/BSE prices so the experience mirrors actual trading.
- **AI-driven coaching**: StockSage AI analyzes the practice portfolio and generates actionable insights.
- **Multi-channel notifications**: Price alerts, target/stop-loss triggers, and AI insights delivered via in-app, push, and email.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Next.js)                        │
│  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌───────────────────┐  │
│  │TradeForm │ │TradesTable│ │StatsGrid │ │NotificationPanel │  │
│  └────┬─────┘ └─────┬─────┘ └────┬─────┘ └────────┬──────────┘  │
│       │             │            │                 │             │
│  ┌────▼─────────────▼────────────▼─────────────────▼──────────┐  │
│  │              React Context / Zustand Store                 │  │
│  │   (portfolioStore, notificationStore, tradeStore)          │  │
│  └────────────────────────┬───────────────────────────────────┘  │
└───────────────────────────┼─────────────────────────────────────┘
                            │ REST + WebSocket
┌───────────────────────────▼─────────────────────────────────────┐
│                      API GATEWAY (Next.js API Routes)           │
│  /api/practice/trades    POST, GET, PATCH, DELETE               │
│  /api/practice/portfolio GET                                    │
│  /api/practice/performance GET                                  │
│  /api/notifications      GET, PATCH                             │
│  /api/notifications/preferences GET, PUT                        │
│  /api/ws                 WebSocket upgrade                      │
└───────────┬──────────────┬──────────────────┬───────────────────┘
            │              │                  │
   ┌────────▼───┐  ┌───────▼──────┐  ┌───────▼──────────┐
   │ PostgreSQL │  │ Redis        │  │ Market Data Feed │
   │ (Neon/     │  │ (Pub/Sub +   │  │ (NSE via         │
   │  Supabase) │  │  Price Cache)│  │  Broker APIs)    │
   └────────────┘  └──────────────┘  └──────────────────┘
            │              │
   ┌────────▼──────────────▼──────────────────┐
   │         Notification Engine              │
   │  ┌──────────┐ ┌─────────┐ ┌───────────┐ │
   │  │Price     │ │Target/  │ │AI Insight │ │
   │  │Monitor   │ │SL Check │ │Generator  │ │
   │  └──────────┘ └─────────┘ └───────────┘ │
   │          │          │           │        │
   │  ┌───────▼──────────▼───────────▼──────┐ │
   │  │       Notification Dispatcher       │ │
   │  │  In-App │ Push (FCM) │ Email (SES)  │ │
   │  └────────────────────────────────────┘  │
   └──────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| **TradeForm** | Stock search, BUY/SELL order placement with SL/Target |
| **TradesTable** | View open/closed positions, P&L calculation, trade detail modal |
| **StatsGrid** | Portfolio summary — total value, P&L, win rate, risk metrics |
| **PerformanceChart** | Historical equity curve with time-period filtering |
| **NotificationPanel** | Real-time alerts feed with mark-read, dismiss, and preferences |

---

## Data Models

### Core Entities

```typescript
// ─── User Session ───
interface PracticeSession {
  id: string;               // UUID
  userId: string;           // FK → User
  startedAt: string;        // ISO 8601
  endedAt?: string;
  initialCapital: number;   // Default: 10,00,000
  currentCapital: number;   // Cash balance (not invested)
  status: "ACTIVE" | "COMPLETED";
}

// ─── Paper Trade ───
interface PaperTrade {
  id: string;
  sessionId: string;        // FK → PracticeSession
  userId: string;
  symbol: string;           // e.g. "RELIANCE"
  companyName: string;
  type: "BUY" | "SELL";
  quantity: number;
  entryPrice: number;       // Price at execution
  currentPrice: number;     // Live market price (computed)
  executedAt: string;
  status: "OPEN" | "CLOSED";
  exitPrice?: number;
  exitedAt?: string;
  pnl?: number;             // Realized P&L (computed on close)
  pnlPercent?: number;
  stopLoss?: number;        // Optional risk management
  target?: number;
  notes?: string;           // User's trade thesis
  createdAt: string;
  updatedAt: string;
}

// ─── Notification ───
interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity: "info" | "success" | "warning" | "error";
  actionUrl?: string;       // Deep link to relevant page
  metadata?: Record<string, string | number>;
  expiresAt?: string;       // Auto-cleanup after expiry
}

type NotificationType =
  | "PRICE_ALERT"       // Stock hits user-defined price
  | "TARGET_HIT"        // Position reaches target
  | "STOP_LOSS"         // Position hits stop loss
  | "TRADE_EXECUTED"    // Confirmation of trade placement/closure
  | "AI_INSIGHT"        // StockSage AI recommendation
  | "PORTFOLIO_UPDATE"  // Daily/weekly performance summary
  | "ACHIEVEMENT";      // Gamification milestones

// ─── User Preferences ───
interface NotificationPreferences {
  userId: string;
  priceAlerts: boolean;
  targetHit: boolean;
  stopLoss: boolean;
  tradeExecuted: boolean;
  aiInsights: boolean;
  portfolioUpdates: boolean;
  achievements: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  quietHoursStart?: string; // "22:00"
  quietHoursEnd?: string;   // "08:00"
}
```

### Database Schema (PostgreSQL)

```sql
CREATE TABLE practice_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id),
  started_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at      TIMESTAMPTZ,
  initial_capital NUMERIC(14,2) NOT NULL DEFAULT 1000000,
  current_capital NUMERIC(14,2) NOT NULL DEFAULT 1000000,
  status        VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE paper_trades (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    UUID NOT NULL REFERENCES practice_sessions(id),
  user_id       UUID NOT NULL REFERENCES users(id),
  symbol        VARCHAR(20) NOT NULL,
  company_name  VARCHAR(100) NOT NULL,
  type          VARCHAR(4) NOT NULL CHECK (type IN ('BUY', 'SELL')),
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  entry_price   NUMERIC(12,2) NOT NULL,
  exit_price    NUMERIC(12,2),
  executed_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  exited_at     TIMESTAMPTZ,
  status        VARCHAR(10) NOT NULL DEFAULT 'OPEN',
  stop_loss     NUMERIC(12,2),
  target        NUMERIC(12,2),
  pnl           NUMERIC(14,2),
  pnl_percent   NUMERIC(8,4),
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_trades_user ON paper_trades(user_id, status);
CREATE INDEX idx_trades_symbol ON paper_trades(symbol);

CREATE TABLE notifications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id),
  type          VARCHAR(30) NOT NULL,
  title         VARCHAR(200) NOT NULL,
  message       TEXT NOT NULL,
  severity      VARCHAR(10) NOT NULL DEFAULT 'info',
  read          BOOLEAN NOT NULL DEFAULT FALSE,
  action_url    TEXT,
  metadata      JSONB,
  expires_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, read, created_at DESC);

CREATE TABLE notification_preferences (
  user_id               UUID PRIMARY KEY REFERENCES users(id),
  price_alerts          BOOLEAN DEFAULT TRUE,
  target_hit            BOOLEAN DEFAULT TRUE,
  stop_loss             BOOLEAN DEFAULT TRUE,
  trade_executed        BOOLEAN DEFAULT TRUE,
  ai_insights           BOOLEAN DEFAULT TRUE,
  portfolio_updates     BOOLEAN DEFAULT TRUE,
  achievements          BOOLEAN DEFAULT TRUE,
  email_notifications   BOOLEAN DEFAULT FALSE,
  push_notifications    BOOLEAN DEFAULT TRUE,
  quiet_hours_start     TIME,
  quiet_hours_end       TIME,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## API Design

### Practice Trading Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/practice/trades` | Place a new paper trade |
| `GET` | `/api/practice/trades` | List trades (filter: status, symbol) |
| `GET` | `/api/practice/trades/:id` | Get trade details |
| `PATCH` | `/api/practice/trades/:id` | Update SL/Target or close position |
| `DELETE` | `/api/practice/trades/:id` | Cancel an open trade |
| `GET` | `/api/practice/portfolio` | Get portfolio summary stats |
| `GET` | `/api/practice/performance` | Get equity curve data |
| `POST` | `/api/practice/sessions` | Start a new practice session |

### Notification Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notifications` | List notifications (filter: read, type) |
| `PATCH` | `/api/notifications/:id` | Mark as read / dismiss |
| `PATCH` | `/api/notifications/read-all` | Mark all as read |
| `GET` | `/api/notifications/preferences` | Get notification preferences |
| `PUT` | `/api/notifications/preferences` | Update notification preferences |

### Example: Place Paper Trade

```
POST /api/practice/trades
Content-Type: application/json

{
  "symbol": "RELIANCE",
  "type": "BUY",
  "quantity": 50,
  "stopLoss": 2700,
  "target": 2950,
  "notes": "Strong support at 2750, buying on dip"
}
```

**Response (201 Created):**
```json
{
  "id": "t1",
  "symbol": "RELIANCE",
  "companyName": "Reliance Industries Ltd",
  "type": "BUY",
  "quantity": 50,
  "entryPrice": 2845.30,
  "currentPrice": 2845.30,
  "executedAt": "2025-05-06T09:30:00Z",
  "status": "OPEN",
  "stopLoss": 2700,
  "target": 2950,
  "notes": "Strong support at 2750, buying on dip"
}
```

**Validation Rules:**
- Quantity must be ≥ 1
- Symbol must be valid NSE/BSE listed stock
- Stop loss must be below entry price for BUY, above for SELL
- Target must be above entry price for BUY, below for SELL
- User must have sufficient virtual cash balance

---

## Practice Tracking System

### Trade Lifecycle

```
┌─────────┐    Place Order     ┌─────────┐
│  IDLE   │ ─────────────────▶ │  OPEN   │
└─────────┘                    └────┬────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
              Manual Close    Target Hit      Stop Loss Hit
                    │               │               │
                    ▼               ▼               ▼
              ┌─────────┐    ┌─────────┐    ┌─────────┐
              │ CLOSED  │    │ CLOSED  │    │ CLOSED  │
              │ (User)  │    │ (Auto)  │    │ (Auto)  │
              └─────────┘    └─────────┘    └─────────┘
                    │               │               │
                    └───────────────┼───────────────┘
                                    │
                              P&L Calculated
                              Notification Sent
                              Stats Updated
```

### P&L Calculation

```typescript
function calculatePnL(trade: PaperTrade, currentPrice: number) {
  const { type, entryPrice, quantity } = trade;

  // For BUY trades: profit when price goes UP
  // For SELL trades: profit when price goes DOWN
  const pnl = type === "BUY"
    ? (currentPrice - entryPrice) * quantity
    : (entryPrice - currentPrice) * quantity;

  const pnlPercent = (pnl / (entryPrice * quantity)) * 100;

  return { pnl, pnlPercent };
}
```

### Portfolio Stats Aggregation

Stats are computed server-side on every request to `/api/practice/portfolio`:

```typescript
function computePortfolioStats(trades: PaperTrade[], session: PracticeSession): PortfolioStats {
  const openTrades = trades.filter(t => t.status === "OPEN");
  const closedTrades = trades.filter(t => t.status === "CLOSED");

  // Invested value = sum of (entryPrice × quantity) for open trades
  const investedValue = openTrades.reduce(
    (sum, t) => sum + t.entryPrice * t.quantity, 0
  );

  // Current market value of open positions
  const currentValue = openTrades.reduce(
    (sum, t) => sum + t.currentPrice * t.quantity, 0
  );

  // Unrealized P&L from open positions
  const unrealizedPnl = currentValue - investedValue;

  // Realized P&L from closed trades
  const realizedPnl = closedTrades.reduce(
    (sum, t) => sum + (t.pnl ?? 0), 0
  );

  const totalPnl = unrealizedPnl + realizedPnl;
  const totalValue = session.currentCapital + currentValue;

  // Win rate = trades closed in profit / total closed trades
  const wins = closedTrades.filter(t => (t.pnl ?? 0) > 0).length;
  const winRate = closedTrades.length > 0
    ? Math.round((wins / closedTrades.length) * 100)
    : 0;

  return {
    totalValue,
    investedValue,
    totalPnl,
    totalPnlPercent: (totalPnl / session.initialCapital) * 100,
    dayPnl: computeDayPnl(trades),
    dayPnlPercent: computeDayPnlPercent(trades, totalValue),
    winRate,
    totalTrades: trades.length,
    openPositions: openTrades.length,
    bestTrade: Math.max(...closedTrades.map(t => t.pnl ?? 0), 0),
    worstTrade: Math.min(...closedTrades.map(t => t.pnl ?? 0), 0),
    avgHoldingPeriod: computeAvgHolding(closedTrades),
  };
}
```

### Auto-Close on Target/Stop Loss

A background **Price Monitor** job runs every 5 seconds during market hours:

```typescript
// Runs as a cron job or long-polling worker
async function priceMonitorTick() {
  const openTrades = await db.paper_trades.findMany({
    where: { status: "OPEN" }
  });

  for (const trade of openTrades) {
    const livePrice = await redis.get(`price:${trade.symbol}`);
    if (!livePrice) continue;

    const price = parseFloat(livePrice);

    // Check TARGET HIT
    if (trade.target) {
      const targetHit = trade.type === "BUY"
        ? price >= trade.target
        : price <= trade.target;

      if (targetHit) {
        await closeTrade(trade, price, "TARGET_HIT");
        continue;
      }
    }

    // Check STOP LOSS HIT
    if (trade.stopLoss) {
      const slHit = trade.type === "BUY"
        ? price <= trade.stopLoss
        : price >= trade.stopLoss;

      if (slHit) {
        await closeTrade(trade, price, "STOP_LOSS");
        continue;
      }
    }
  }
}
```

---

## Notification System

### Notification Triggers

| Trigger | When | Severity | Channel |
|---------|------|----------|---------|
| **Trade Executed** | User places/closes a trade | `success` | In-app |
| **Target Hit** | Market price reaches user's target | `success` | In-app, Push, Email |
| **Stop Loss Hit** | Market price reaches user's stop loss | `error` | In-app, Push, Email |
| **Stop Loss Warning** | Price within 2% of stop loss | `warning` | In-app, Push |
| **Price Alert** | User-defined price threshold crossed | `info` | In-app, Push |
| **AI Insight** | StockSage generates recommendation | `warning` | In-app |
| **Portfolio Update** | Daily/weekly summary report | `info` | In-app, Email |
| **Achievement** | User unlocks a trading milestone | `info` | In-app, Push |

### Notification Flow

```
Market Price Update
        │
        ▼
┌──────────────────┐
│  Price Monitor   │ ◀── Runs every 5s during market hours (9:15AM - 3:30PM IST)
│  (Background)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐     ┌──────────────────┐
│ Trigger Engine   │────▶│ Check User Prefs │ ── Is this notification type enabled?
│ (SL/Target/AI)   │     │ + Quiet Hours    │ ── Is it within quiet hours?
└──────────────────┘     └────────┬─────────┘
                                  │ Yes, deliver
                                  ▼
                    ┌─────────────────────────┐
                    │  Notification Dispatcher │
                    ├─────────┬───────┬───────┤
                    │ In-App  │ Push  │ Email │
                    │ (WS)    │ (FCM) │ (SES) │
                    └─────────┴───────┴───────┘
                         │
                         ▼
                    ┌──────────┐
                    │  Client  │ ◀── WebSocket receives real-time notification
                    │  Store   │     → Toast popup + badge counter update
                    └──────────┘
```

### Notification Dispatcher Logic

```typescript
async function dispatchNotification(
  userId: string,
  payload: Omit<Notification, "id" | "read" | "timestamp">
) {
  // 1. Check user preferences
  const prefs = await db.notification_preferences.findUnique({
    where: { userId }
  });

  const typeToPreference: Record<NotificationType, keyof NotificationPreferences> = {
    PRICE_ALERT: "priceAlerts",
    TARGET_HIT: "targetHit",
    STOP_LOSS: "stopLoss",
    TRADE_EXECUTED: "tradeExecuted",
    AI_INSIGHT: "aiInsights",
    PORTFOLIO_UPDATE: "portfolioUpdates",
    ACHIEVEMENT: "achievements",
  };

  const prefKey = typeToPreference[payload.type];
  if (prefs && !prefs[prefKey]) return; // User disabled this type

  // 2. Check quiet hours
  if (isQuietHours(prefs)) return;

  // 3. Persist to database
  const notification = await db.notifications.create({
    data: {
      userId,
      ...payload,
      read: false,
      timestamp: new Date().toISOString(),
    },
  });

  // 4. In-App delivery (always, via WebSocket)
  websocketServer.sendToUser(userId, {
    event: "notification",
    data: notification,
  });

  // 5. Push notification (if enabled)
  if (prefs?.pushNotifications && ["TARGET_HIT", "STOP_LOSS", "ACHIEVEMENT"].includes(payload.type)) {
    await sendPushNotification(userId, {
      title: payload.title,
      body: payload.message,
    });
  }

  // 6. Email (if enabled, for critical alerts only)
  if (prefs?.emailNotifications && ["TARGET_HIT", "STOP_LOSS", "PORTFOLIO_UPDATE"].includes(payload.type)) {
    await emailQueue.add({
      to: userId,
      subject: payload.title,
      body: payload.message,
    });
  }
}
```

### Achievement System (Gamification)

| Achievement | Trigger | Badge |
|-------------|---------|-------|
| First Trade | Complete 1st paper trade | 🎯 |
| Streak Trader | 5 consecutive profitable trades | 🔥 |
| Seasoned Trader | Complete 40+ trades | 🏆 |
| Risk Manager | Set SL/Target on 10 trades | 🛡️ |
| Portfolio Pro | Reach +10% total returns | 📈 |
| Diversifier | Hold 5+ different stocks | 🌐 |

---

## Real-Time Updates

### WebSocket Architecture

The system uses WebSocket connections to push live data to the client:

```typescript
// Server: WebSocket handler
const wsClients = new Map<string, WebSocket>(); // userId → ws

wss.on("connection", (ws, req) => {
  const userId = authenticateWs(req);
  wsClients.set(userId, ws);

  // Send initial state
  ws.send(JSON.stringify({
    event: "connected",
    data: { unreadCount: await getUnreadCount(userId) }
  }));

  ws.on("close", () => wsClients.delete(userId));
});

// Broadcast to specific user
function sendToUser(userId: string, payload: any) {
  const ws = wsClients.get(userId);
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}
```

### Client-Side Store

```typescript
// Zustand store for real-time state management
const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: state.unreadCount + 1,
  })),

  markRead: (id) => set((state) => ({
    notifications: state.notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ),
    unreadCount: Math.max(0, state.unreadCount - 1),
  })),

  markAllRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true })),
    unreadCount: 0,
  })),
}));
```

### Live Price Updates

```
┌──────────────┐     ┌───────────┐     ┌────────────┐
│ Broker API   │────▶│  Redis    │────▶│  Client WS │
│ (Zerodha/    │     │  Pub/Sub  │     │  (per user)│
│  Angel One)  │     │  Channel  │     └────────────┘
└──────────────┘     └───────────┘
  Every 1s            "price:RELIANCE" → 2845.30
                      "price:TCS"      → 3560.15
```

---

## Security & Edge Cases

### Validation
- **Insufficient balance**: Reject trade if `entryPrice × quantity > currentCapital`
- **Market hours only**: Paper trades can only be placed during NSE hours (9:15 AM - 3:30 PM IST, Mon-Fri)
- **Duplicate prevention**: Idempotency key on trade placement to prevent double-submission
- **Rate limiting**: Max 50 trades per session, max 10 notifications per minute

### Edge Cases
| Scenario | Handling |
|----------|----------|
| Price gaps past SL/Target | Close at the first available price (gap fill) |
| Market closed | Show "Market Closed" badge, disable trade form |
| WebSocket disconnection | Client reconnects with exponential backoff, fetches missed notifications via REST |
| Concurrent trade closure | Use database-level optimistic locking (`updated_at` check) |
| Session expiry | Auto-close all open positions, generate final report |

---

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | Next.js 15 + TypeScript | SSR for SEO, API routes for backend |
| **UI** | Tailwind CSS + Framer Motion | Fast iteration, premium animations |
| **Charts** | Recharts | Lightweight, React-native charting |
| **State** | Zustand | Minimal boilerplate, WebSocket-friendly |
| **Database** | PostgreSQL (Neon/Supabase) | ACID transactions for trade integrity |
| **Cache** | Redis (Upstash) | Price caching, pub/sub for real-time |
| **Auth** | NextAuth.js | Session management, OAuth support |
| **Push** | Firebase Cloud Messaging | Cross-platform push notifications |
| **Email** | AWS SES / Resend | Transactional emails for critical alerts |
| **Hosting** | Vercel | Zero-config Next.js deployment |

---

## UI Component Map

```
/practice (page)
├── Header (title + balance + New Trade button)
├── StatsGrid (8 metric cards)
│   ├── Portfolio Value
│   ├── Total P&L
│   ├── Today's P&L
│   ├── Win Rate
│   ├── Open Positions
│   ├── Best Trade
│   ├── Avg Holding Period
│   └── Risk Score
├── Performance Chart + Notification Panel (2:1 grid)
│   ├── PerformanceChart (area chart with time filters)
│   └── NotificationPanel (real-time alerts feed)
│       ├── Filter tabs (All / Unread)
│       ├── Notification cards (icon, severity, actions)
│       └── Settings panel (toggle preferences)
├── TradesTable (full-width)
│   ├── Filter tabs (All / Open / Closed)
│   ├── Table rows (symbol, type, qty, entry, current, P&L, SL/Target)
│   └── Detail modal (on row click)
├── AI Insight Card (StockSage analysis)
└── TradeForm (modal)
    ├── Stock search with autocomplete
    ├── BUY/SELL toggle
    ├── Quantity input + estimated value
    ├── Stop Loss / Target inputs
    └── Notes textarea
```

---

*This document serves as the complete system design for the Practice Tracking & User Notification feature of UseMoney AI.*
