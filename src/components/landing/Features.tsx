"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Bot, LineChart, Link2, Flame, BarChart2, Bell, Wallet, TrendingUp,
} from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";
import TextReveal from "@/components/ui/TextReveal";

const features = [
  { icon: Bot, title: "StockSage AI Chat", desc: "Ask anything about your portfolio, market trends, or stocks. Real-time Gemini-powered intelligence.", color: "#10b981" },
  { icon: LineChart, title: "Paper Trading", desc: "Practice with live market data at zero risk. Track virtual P&L with real-time charting.", color: "#3b82f6" },
  { icon: Link2, title: "Multi-Broker Sync", desc: "Connect Zerodha, Groww, Angel One and more. One unified portfolio view.", color: "#8b5cf6" },
  { icon: Flame, title: "FIRE Calculator", desc: "Model your Financial Independence journey with SIP, expenses, and inflation.", color: "#f59e0b" },
  { icon: BarChart2, title: "Portfolio Analytics", desc: "Sector allocation, concentration risk, and performance attribution at a glance.", color: "#06b6d4" },
  { icon: Bell, title: "Smart Alerts", desc: "Price targets, portfolio events, dividends, and AI-detected opportunity alerts.", color: "#f59e0b" },
  { icon: Wallet, title: "Tradebook Manager", desc: "Import and analyze your complete trade history. Spot winning patterns.", color: "#10b981" },
  { icon: TrendingUp, title: "Stock & MF Screener", desc: "Discover stocks and mutual funds with AI recommendations for your risk profile.", color: "#ec4899" },
];

export default function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" style={{ paddingTop: 100, paddingBottom: 100 }}>
      <div className="container" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <div className="section-label" style={{ justifyContent: "center" }}>
            <BarChart2 size={14} />
            Platform Features
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>
            <TextReveal text="Everything you need to trade smarter" highlight="smarter" />
          </h2>
          <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 500, margin: "0 auto" }}>
            Professional-grade tools built for the Indian market.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, borderRadius: 12, overflow: "hidden", background: "#1f2937" }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <SpotlightCard
                style={{
                  background: "#151d2b",
                  padding: 28,
                  cursor: "default",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    background: `${f.color}12`,
                    border: `1px solid ${f.color}25`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                    transition: "all 0.3s",
                  }}
                >
                  <f.icon size={20} style={{ color: f.color }} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", marginBottom: 6 }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
