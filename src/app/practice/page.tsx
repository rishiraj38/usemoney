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
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(52,211,153,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.2,
        }}
      />

      <div className="section-container" style={{ position: "relative", zIndex: 10, paddingTop: 32, paddingBottom: 48 }}>
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 32,
            gap: 16,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #34d399, #059669)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LineChart size={20} style={{ color: "#fff" }} />
              </div>
              <h1
                style={{
                  fontSize: "clamp(22px, 3vw, 30px)",
                  fontWeight: 700,
                  color: "#fff",
                  fontFamily: "var(--font-display)",
                }}
              >
                Practice Trading
              </h1>
            </div>
            <p style={{ fontSize: 14, color: "#64748b", marginLeft: 52 }}>
              Paper-trade with live market data · Zero risk · AI-powered insights
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              className="glass"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: 14,
                fontSize: 14,
              }}
            >
              <Wallet size={16} style={{ color: "#34d399" }} />
              <span style={{ color: "#94a3b8" }}>Balance:</span>
              <span style={{ color: "#fff", fontWeight: 600, fontFamily: "var(--font-mono)" }}>₹10,87,430</span>
            </div>
            <TradeForm />
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div style={{ marginBottom: 32 }}>
          <StatsGrid stats={mockPortfolioStats} />
        </div>

        {/* Chart + Notifications */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 24,
            marginBottom: 32,
          }}
        >
          <PerformanceChart data={mockPerformanceData} />
          <NotificationPanel notifications={mockNotifications} />
        </div>

        {/* Trades Table */}
        <div style={{ marginBottom: 32 }}>
          <TradesTable trades={mockTrades} />
        </div>

        {/* AI Insight Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-brand"
          style={{ borderRadius: 20, padding: 24 }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "rgba(16,185,129,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Sparkles size={20} style={{ color: "#34d399" }} />
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "#34d399", marginBottom: 6 }}>
                ✨ StockSage AI Analysis
              </h3>
              <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.7 }}>
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
