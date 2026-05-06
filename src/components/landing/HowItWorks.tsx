"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link2, Bot, LineChart, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import TextReveal from "@/components/ui/TextReveal";

const miniChart = [
  { v: 35 }, { v: 42 }, { v: 38 }, { v: 55 }, { v: 48 },
  { v: 62 }, { v: 58 }, { v: 72 }, { v: 68 }, { v: 85 }, { v: 92 },
];

const steps = [
  {
    num: "01",
    icon: Link2,
    title: "Connect your brokers",
    desc: "Link Zerodha, Groww, Angel One or any supported Indian broker in seconds. Read-only OAuth — we never place trades on your behalf.",
    points: ["Read-only access", "Instant sync", "Revoke anytime"],
    visual: "brokers",
  },
  {
    num: "02",
    icon: Bot,
    title: "Ask StockSage AI",
    desc: "Chat with our AI about your holdings, market trends, or strategies. Personalized insights backed by your real portfolio data.",
    points: ["Powered by Gemini", "Real-time data", "Portfolio-aware"],
    visual: "chat",
  },
  {
    num: "03",
    icon: LineChart,
    title: "Practice & grow",
    desc: "Paper-trade with live market data. Track performance, learn from AI analysis, and build confidence before going live.",
    points: ["Zero risk", "Live prices", "AI analysis"],
    visual: "chart",
  },
];

const brokers = ["Zerodha", "Groww", "Angel One", "ICICI Direct", "Upstox"];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" style={{ paddingTop: 100, paddingBottom: 100, background: "#0c1120" }}>
      <div className="container" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <div className="section-label" style={{ justifyContent: "center" }}>
            <ArrowRight size={14} />
            How It Works
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>
            <TextReveal text="Get started in three steps" highlight="three" />
          </h2>
          <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 450, margin: "0 auto" }}>
            No complex setup. Start making smarter decisions in minutes.
          </p>
        </motion.div>

        {/* Interactive Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card"
          style={{ overflow: "hidden" }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr" }}>
            {/* Step Selector */}
            <div style={{ borderRight: "1px solid #1f2937", padding: "8px" }}>
              {steps.map((step, i) => (
                <button
                  key={step.num}
                  onClick={() => setActiveStep(i)}
                  style={{
                    width: "100%",
                    padding: "20px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: activeStep === i ? "#1e2939" : "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    transition: "all 0.2s",
                    position: "relative",
                    fontFamily: "inherit",
                  }}
                >
                  {/* Active indicator */}
                  {activeStep === i && (
                    <motion.div
                      layoutId="step-indicator"
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 16,
                        bottom: 16,
                        width: 3,
                        borderRadius: 2,
                        background: "#10b981",
                      }}
                    />
                  )}

                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: activeStep === i ? "#10b98115" : "#111827",
                      border: `1px solid ${activeStep === i ? "#10b98130" : "#1f2937"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 0.2s",
                    }}
                  >
                    <step.icon size={16} style={{ color: activeStep === i ? "#10b981" : "#475569" }} />
                  </div>
                  <div>
                    <div className="mono" style={{ fontSize: 10, color: "#475569", marginBottom: 2 }}>{step.num}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: activeStep === i ? "#f1f5f9" : "#94a3b8", transition: "color 0.2s" }}>
                      {step.title}
                    </div>
                  </div>
                </button>
              ))}

              {/* Progress dots */}
              <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "16px 0 8px" }}>
                {steps.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: activeStep === i ? 24 : 6,
                      height: 6,
                      borderRadius: 3,
                      background: activeStep === i ? "#10b981" : "#1f2937",
                      transition: "all 0.3s",
                      cursor: "pointer",
                    }}
                    onClick={() => setActiveStep(i)}
                  />
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div style={{ padding: 32, minHeight: 360 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, height: "100%" }}
                >
                  {/* Description */}
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <h3 style={{ fontSize: 24, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>
                      {steps[activeStep].title}
                    </h3>
                    <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7, marginBottom: 24 }}>
                      {steps[activeStep].desc}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {steps[activeStep].points.map((p, j) => (
                        <motion.div
                          key={p}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: j * 0.1 }}
                          style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#94a3b8" }}
                        >
                          <Check size={14} style={{ color: "#10b981" }} />
                          {p}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Visual */}
                  <div style={{ background: "#111827", borderRadius: 12, border: "1px solid #1f2937", padding: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {steps[activeStep].visual === "brokers" && (
                      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
                        {brokers.map((b, j) => (
                          <motion.div
                            key={b}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: j * 0.08 }}
                            style={{
                              padding: "10px 14px",
                              background: "#151d2b",
                              border: "1px solid #1f2937",
                              borderRadius: 8,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ width: 24, height: 24, borderRadius: 4, background: "#10b98112", border: "1px solid #10b98125", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Link2 size={11} style={{ color: "#10b981" }} />
                              </div>
                              <span style={{ fontSize: 13, fontWeight: 500, color: "#f1f5f9" }}>{b}</span>
                            </div>
                            <span className="badge badge-brand" style={{ fontSize: 10 }}>Connected</span>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {steps[activeStep].visual === "chat" && (
                      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
                        {[
                          { user: true, text: "Should I hold INFY at current levels?" },
                          { user: false, text: "INFY trades at 18.2x PE, below 5Y avg of 24x. RSI at 42 suggests upside. Hold recommended ✓" },
                          { user: true, text: "What's my portfolio's sector concentration?" },
                        ].map((msg, j) => (
                          <motion.div
                            key={j}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: j * 0.2 }}
                            style={{
                              alignSelf: msg.user ? "flex-end" : "flex-start",
                              maxWidth: "85%",
                              padding: "10px 14px",
                              borderRadius: msg.user ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                              background: msg.user ? "#1e2939" : "#151d2b",
                              border: `1px solid ${msg.user ? "#2a3544" : "#10b98125"}`,
                              fontSize: 13,
                              color: msg.user ? "#f1f5f9" : "#94a3b8",
                              lineHeight: 1.5,
                            }}
                          >
                            {!msg.user && <div style={{ fontSize: 10, color: "#10b981", fontWeight: 600, marginBottom: 4 }}>✦ StockSage AI</div>}
                            {msg.text}
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {steps[activeStep].visual === "chart" && (
                      <div style={{ width: "100%" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                          <div>
                            <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>Paper Trading P&L</div>
                            <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: "#22c55e", marginTop: 4 }}>+₹24,530</div>
                          </div>
                          <span className="badge badge-profit" style={{ fontSize: 10 }}>
                            <ArrowUpRight size={10} /> +12.4%
                          </span>
                        </div>
                        <div style={{ height: 100 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={miniChart}>
                              <defs>
                                <linearGradient id="stepGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.15} />
                                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <Area type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={2} fill="url(#stepGrad)" dot={false} animationDuration={1200} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 10 }}>
                          {[
                            { label: "Win Rate", val: "68%", col: "#22c55e" },
                            { label: "Trades", val: "47", col: "#f1f5f9" },
                            { label: "Avg Hold", val: "4.2d", col: "#f1f5f9" },
                          ].map((m) => (
                            <div key={m.label} style={{ padding: "6px 8px", background: "#151d2b", borderRadius: 6, border: "1px solid #1f2937", textAlign: "center" }}>
                              <div style={{ fontSize: 9, color: "#64748b" }}>{m.label}</div>
                              <div className="mono" style={{ fontSize: 13, fontWeight: 600, color: m.col }}>{m.val}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
