"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ArrowDownRight, Activity, TrendingUp } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer } from "recharts";
import AuroraBackground from "@/components/ui/AuroraBackground";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import TextReveal from "@/components/ui/TextReveal";
import Typewriter from "@/components/ui/Typewriter";

const chartData = [
  { v: 820 }, { v: 845 }, { v: 810 }, { v: 870 }, { v: 920 },
  { v: 895 }, { v: 950 }, { v: 980 }, { v: 1020 }, { v: 1060 },
  { v: 1100 }, { v: 1180 },
];

const volumeData = [
  { v: 420 }, { v: 580 }, { v: 340 }, { v: 720 }, { v: 510 },
  { v: 380 }, { v: 640 }, { v: 490 },
];

const watchlist = [
  { sym: "RELIANCE", price: 2845.30, chg: 1.24, up: true },
  { sym: "TCS", price: 3560.15, chg: -0.45, up: false },
  { sym: "HDFCBANK", price: 1678.90, chg: 0.68, up: true },
  { sym: "INFY", price: 1432.55, chg: 1.12, up: true },
  { sym: "ITC", price: 428.75, chg: -0.32, up: false },
];

export default function Hero() {
  const [prices, setPrices] = useState(watchlist);

  // Simulated live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) =>
        prev.map((s) => ({
          ...s,
          price: s.price + (Math.random() - 0.48) * s.price * 0.001,
          chg: s.chg + (Math.random() - 0.5) * 0.02,
        }))
      );
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        paddingTop: 64,
        overflow: "hidden",
      }}
    >
      {/* Aurora Background — CSS only, no lag */}
      <AuroraBackground />

      <div
        className="container"
        style={{ position: "relative", zIndex: 10, width: "100%", paddingTop: 48, paddingBottom: 48 }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          {/* ─── LEFT: Copy ─── */}
          <div>
            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                borderRadius: 6,
                background: "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.15)",
                marginBottom: 28,
              }}
            >
              <div style={{ position: "relative", width: 8, height: 8 }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#10b981" }} />
                <div style={{ position: "absolute", inset: -3, borderRadius: "50%", border: "1px solid rgba(16,185,129,0.4)", animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite" }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color: "#34d399", letterSpacing: "0.02em" }}>
                Live Market Intelligence
              </span>
            </motion.div>

            {/* Heading with text reveal */}
            <h1 style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.035em", color: "#f1f5f9", marginBottom: 24 }}>
              <TextReveal text="The trading copilot" delay={0.1} />
              <br />
              <TextReveal text="for Indian markets" highlight="Indian" highlightColor="#10b981" delay={0.35} />
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              style={{ fontSize: 16, color: "#94a3b8", lineHeight: 1.75, maxWidth: 440, marginBottom: 36 }}
            >
              Unify every broker. Get AI insights from{" "}
              <span style={{ color: "#f1f5f9", fontWeight: 500 }}>StockSage</span>.
              Paper-trade risk-free. Plan your FIRE journey — all in one dashboard.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48 }}
            >
              <a href="https://qa.usemoney.ai" className="btn btn-primary btn-lg" id="hero-cta" style={{ position: "relative", overflow: "hidden" }}>
                {/* Shine sweep */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                  animation: "btn-shine 3s ease-in-out infinite",
                }} />
                <span style={{ position: "relative" }}>Start Trading Free</span>
                <ArrowRight size={16} style={{ position: "relative" }} />
              </a>
              <a href="#how-it-works" className="btn btn-secondary btn-lg">
                How It Works
              </a>
            </motion.div>

            {/* Stats with animated counters */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              style={{ display: "flex", gap: 40 }}
            >
              {[
                { label: "Active Traders", val: 10000, suffix: "+" },
                { label: "Trades Tracked", val: 250, suffix: "K+" },
                { label: "Uptime", val: 99.9, suffix: "%", dec: 1 },
              ].map((s) => (
                <div key={s.label}>
                  <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: "#f1f5f9", marginBottom: 2 }}>
                    <AnimatedCounter target={s.val} suffix={s.suffix} decimals={s.dec || 0} duration={2} />
                  </div>
                  <div style={{ fontSize: 12, color: "#475569" }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ─── RIGHT: Dashboard Preview ─── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Animated border glow */}
            <div style={{ position: "relative", borderRadius: 16 }}>
              <div style={{
                position: "absolute",
                inset: -1,
                borderRadius: 16,
                background: "conic-gradient(from var(--border-angle, 0deg), transparent 30%, #10b981 50%, transparent 70%)",
                animation: "border-spin 6s linear infinite",
                opacity: 0.5,
              }} />
              <style>{`
                @property --border-angle {
                  syntax: '<angle>';
                  initial-value: 0deg;
                  inherits: false;
                }
                @keyframes border-spin {
                  to { --border-angle: 360deg; }
                }
                @keyframes ping {
                  75%, 100% { transform: scale(2); opacity: 0; }
                }
                @keyframes btn-shine {
                  0% { left: -100%; }
                  50%, 100% { left: 200%; }
                }
              `}</style>

              <div
                className="card"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 60px rgba(16,185,129,0.05)",
                }}
              >
                {/* Dashboard header */}
                <div style={{
                  padding: "14px 20px",
                  borderBottom: "1px solid #1f2937",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                  <div>
                    <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>
                      Portfolio Value
                    </div>
                    <div className="mono" style={{ fontSize: 28, fontWeight: 700, color: "#f1f5f9" }}>
                      ₹<AnimatedCounter target={1180000} duration={2.5} />
                    </div>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.5, type: "spring", stiffness: 300 }}
                    className="badge badge-profit"
                  >
                    <ArrowUpRight size={12} />
                    +43.9%
                  </motion.div>
                </div>

                {/* Portfolio chart */}
                <div style={{ padding: "4px 8px 0", height: 140 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke="#10b981"
                        strokeWidth={2}
                        fill="url(#heroGrad)"
                        dot={false}
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Bottom panels */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid #1f2937" }}>
                  {/* Watchlist with live prices */}
                  <div style={{ borderRight: "1px solid #1f2937", padding: "10px 16px" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                      Watchlist
                    </div>
                    {prices.map((s) => (
                      <div
                        key={s.sym}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "4px 0",
                        }}
                      >
                        <span className="mono" style={{ fontSize: 11, color: "#f1f5f9", fontWeight: 500 }}>
                          {s.sym}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span className="mono" style={{ fontSize: 11, color: "#94a3b8" }}>
                            ₹{s.price.toFixed(0)}
                          </span>
                          <span
                            className="mono"
                            style={{
                              fontSize: 10,
                              color: s.chg >= 0 ? "#22c55e" : "#ef4444",
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {s.chg >= 0 ? <ArrowUpRight size={9} /> : <ArrowDownRight size={9} />}
                            {Math.abs(s.chg).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Volume + AI Insight */}
                  <div style={{ padding: "10px 16px" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                      Volume
                    </div>
                    <div style={{ height: 56 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={volumeData}>
                          <Bar
                            dataKey="v"
                            fill="#10b981"
                            radius={[2, 2, 0, 0]}
                            opacity={0.4}
                            animationDuration={1500}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* AI Insight with typewriter */}
                    <div style={{
                      marginTop: 8,
                      padding: "8px 10px",
                      background: "#111827",
                      borderRadius: 6,
                      border: "1px solid rgba(16,185,129,0.15)",
                    }}>
                      <div style={{ fontSize: 9, color: "#10b981", fontWeight: 600, letterSpacing: "0.05em", marginBottom: 3, display: "flex", alignItems: "center", gap: 4 }}>
                        <TrendingUp size={9} />
                        STOCKSAGE AI
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.4 }}>
                        <Typewriter
                          text="HDFC Bank nearing ₹1,720 resistance. Consider partial profit booking."
                          speed={25}
                          delay={2000}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
