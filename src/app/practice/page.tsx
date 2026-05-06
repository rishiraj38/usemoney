"use client";

import { motion } from "framer-motion";
import { LineChart, Sparkles, Wallet } from "lucide-react";
import StatsGrid from "@/components/practice/StatsGrid";
import TradesTable from "@/components/practice/TradesTable";
import PerformanceChart from "@/components/practice/PerformanceChart";
import NotificationPanel from "@/components/practice/NotificationPanel";
import TradeForm from "@/components/practice/TradeForm";
import {
  mockPortfolioStats,
  mockTrades,
  mockNotifications,
  mockPerformanceData,
} from "@/data/mockPractice";

export default function PracticePage() {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div style={{ position: "relative", zIndex: 10, maxWidth: 1440, margin: "0 auto", padding: "40px 32px 64px" }}>
        
        {/* ─── Page Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 48,
            gap: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "linear-gradient(135deg, #34d399, #059669)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 20px rgba(16,185,129,0.3)",
              }}
            >
              <LineChart size={24} style={{ color: "#fff" }} />
            </div>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                Practice Trading
              </h1>
              <p style={{ fontSize: 14, color: "#64748b", marginTop: 2 }}>
                Paper-trade with live market data · Zero risk · AI-powered insights
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 20px",
                borderRadius: 16,
                fontSize: 14,
                background: "rgba(15,23,42,0.8)",
                border: "1px solid #1f2937",
                backdropFilter: "blur(12px)",
              }}
            >
              <Wallet size={18} style={{ color: "#34d399" }} />
              <span style={{ color: "#94a3b8" }}>Balance:</span>
              <span style={{ color: "#fff", fontWeight: 700, fontFamily: "var(--font-mono)", fontSize: 16 }}>₹10,87,430</span>
            </div>
            <TradeForm />
          </div>
        </motion.div>

        {/* ─── Stats Grid ─── */}
        <div style={{ marginBottom: 48 }}>
          <StatsGrid stats={mockPortfolioStats} />
        </div>

        {/* ─── Performance Chart (full width) ─── */}
        <div style={{ marginBottom: 32 }}>
          <PerformanceChart data={mockPerformanceData} />
        </div>

        {/* ─── Notifications (full width) ─── */}
        <div style={{ marginBottom: 48 }}>
          <NotificationPanel notifications={mockNotifications} />
        </div>

        {/* ─── Trades Table ─── */}
        <div style={{ marginBottom: 48 }}>
          <TradesTable trades={mockTrades} />
        </div>

        {/* ─── AI Insight Card ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            borderRadius: 20,
            padding: 28,
            background: "rgba(16,185,129,0.06)",
            border: "1px solid rgba(16,185,129,0.15)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 18 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: "rgba(16,185,129,0.2)",
                border: "1px solid rgba(16,185,129,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Sparkles size={22} style={{ color: "#34d399" }} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#34d399", marginBottom: 8 }}>
                ✨ StockSage AI Analysis
              </h3>
              <p style={{ fontSize: 15, color: "#cbd5e1", lineHeight: 1.8 }}>
                Your practice portfolio shows strong momentum with a 68% win rate.
                Your best performing sector is Banking (+4.8%), while IT positions
                need attention. Consider adding a stop loss to your ITC position
                which is currently down 2.56%. Your average holding period of 4.2
                days suggests a swing trading style — the AI recommends focusing on
                stocks with 3-5 day momentum patterns for optimal results.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
