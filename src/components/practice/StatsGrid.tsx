"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  BarChart2,
  Trophy,
  Clock,
  PieChart,
} from "lucide-react";
import type { PortfolioStats } from "@/types/practice";

function formatCurrency(val: number): string {
  const abs = Math.abs(val);
  if (abs >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
  if (abs >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
  return `₹${val.toLocaleString("en-IN")}`;
}

interface StatsGridProps {
  stats: PortfolioStats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const cards = [
    {
      label: "Portfolio Value",
      value: formatCurrency(stats.totalValue),
      subValue: `Invested: ${formatCurrency(stats.investedValue)}`,
      icon: Wallet,
      color: "#34d399",
      bgColor: "rgba(16,185,129,0.1)",
      borderColor: "rgba(16,185,129,0.2)",
    },
    {
      label: "Total P&L",
      value: formatCurrency(stats.totalPnl),
      subValue: `${stats.totalPnlPercent > 0 ? "+" : ""}${stats.totalPnlPercent.toFixed(2)}%`,
      icon: stats.totalPnl >= 0 ? TrendingUp : TrendingDown,
      color: stats.totalPnl >= 0 ? "#22c55e" : "#ef4444",
      bgColor: stats.totalPnl >= 0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
      borderColor: stats.totalPnl >= 0 ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)",
    },
    {
      label: "Today's P&L",
      value: formatCurrency(stats.dayPnl),
      subValue: `${stats.dayPnlPercent > 0 ? "+" : ""}${stats.dayPnlPercent.toFixed(2)}%`,
      icon: stats.dayPnl >= 0 ? TrendingUp : TrendingDown,
      color: stats.dayPnl >= 0 ? "#22c55e" : "#ef4444",
      bgColor: stats.dayPnl >= 0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
      borderColor: stats.dayPnl >= 0 ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)",
    },
    {
      label: "Win Rate",
      value: `${stats.winRate}%`,
      subValue: `${stats.totalTrades} total trades`,
      icon: Target,
      color: stats.winRate >= 50 ? "#22c55e" : "#ef4444",
      bgColor: stats.winRate >= 50 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
      borderColor: stats.winRate >= 50 ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)",
    },
    {
      label: "Open Positions",
      value: stats.openPositions.toString(),
      subValue: `of ${stats.totalTrades} trades`,
      icon: PieChart,
      color: "#60a5fa",
      bgColor: "rgba(59,130,246,0.1)",
      borderColor: "rgba(59,130,246,0.2)",
    },
    {
      label: "Best Trade",
      value: formatCurrency(stats.bestTrade),
      subValue: `Worst: ${formatCurrency(stats.worstTrade)}`,
      icon: Trophy,
      color: "#22c55e",
      bgColor: "rgba(34,197,94,0.1)",
      borderColor: "rgba(34,197,94,0.2)",
    },
    {
      label: "Avg Holding",
      value: stats.avgHoldingPeriod,
      subValue: "per position",
      icon: Clock,
      color: "#60a5fa",
      bgColor: "rgba(59,130,246,0.1)",
      borderColor: "rgba(59,130,246,0.2)",
    },
    {
      label: "Risk Score",
      value: "Medium",
      subValue: "45% concentration",
      icon: BarChart2,
      color: "#fbbf24",
      bgColor: "rgba(251,191,36,0.1)",
      borderColor: "rgba(251,191,36,0.2)",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 18,
      }}
      className="max-sm:!grid-cols-2 max-lg:!grid-cols-3"
    >
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          style={{
            borderRadius: 18,
            padding: 22,
            background: "rgba(15,23,42,0.6)",
            border: "1px solid #1f2937",
            backdropFilter: "blur(12px)",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          className="hover:!border-[#2a3544] hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
              {card.label}
            </span>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                background: card.bgColor,
                border: `1px solid ${card.borderColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <card.icon size={18} style={{ color: card.color }} />
            </div>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: card.color, marginBottom: 4, letterSpacing: "-0.02em" }}>
            {card.value}
          </div>
          <div style={{ fontSize: 13, color: "#64748b" }}>{card.subValue}</div>
        </motion.div>
      ))}
    </div>
  );
}
