// Practice Tracking - Type Definitions
// This file defines the complete data model for the practice trading system.

/** Represents a single paper trade executed by the user */
export interface PaperTrade {
  id: string;
  symbol: string;
  companyName: string;
  type: "BUY" | "SELL";
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  executedAt: string; // ISO timestamp
  status: "OPEN" | "CLOSED";
  exitPrice?: number;
  exitedAt?: string;
  pnl?: number;
  pnlPercent?: number;
  notes?: string;
  stopLoss?: number;
  target?: number;
}

/** Portfolio summary stats */
export interface PortfolioStats {
  totalValue: number;
  investedValue: number;
  totalPnl: number;
  totalPnlPercent: number;
  dayPnl: number;
  dayPnlPercent: number;
  winRate: number;
  totalTrades: number;
  openPositions: number;
  bestTrade: number;
  worstTrade: number;
  avgHoldingPeriod: string;
}

/** A notification triggered by the system */
export interface Notification {
  id: string;
  type: "PRICE_ALERT" | "TARGET_HIT" | "STOP_LOSS" | "TRADE_EXECUTED" | "AI_INSIGHT" | "PORTFOLIO_UPDATE" | "ACHIEVEMENT";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity: "info" | "success" | "warning" | "error";
  actionUrl?: string;
  metadata?: Record<string, string | number>;
}

/** User notification preferences */
export interface NotificationPreferences {
  priceAlerts: boolean;
  targetHit: boolean;
  stopLoss: boolean;
  tradeExecuted: boolean;
  aiInsights: boolean;
  portfolioUpdates: boolean;
  achievements: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  quietHoursStart?: string; // HH:mm
  quietHoursEnd?: string;
}

/** Chart data point */
export interface ChartDataPoint {
  date: string;
  value: number;
  pnl: number;
}

/** Practice session */
export interface PracticeSession {
  id: string;
  startedAt: string;
  endedAt?: string;
  initialCapital: number;
  currentCapital: number;
  trades: PaperTrade[];
  performance: ChartDataPoint[];
}
