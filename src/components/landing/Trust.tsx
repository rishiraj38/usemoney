"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Lock, Eye, Server, ArrowRight } from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";
import TextReveal from "@/components/ui/TextReveal";
const items = [
  { icon: Eye, title: "Read-Only Access", desc: "We only read your holdings and positions. UseMoney never places trades, withdraws funds, or modifies your broker account." },
  { icon: Lock, title: "End-to-End Encryption", desc: "All data encrypted in transit (TLS 1.3) and at rest (AES-256). Credentials are never stored — OAuth tokens only." },
  { icon: Server, title: "SOC 2 Infrastructure", desc: "Hosted on AWS Mumbai region. Your data never leaves India. Regular third-party security audits." },
  { icon: Shield, title: "SEBI Compliant", desc: "We are not a SEBI-registered advisor. All AI outputs are educational and informational — never investment advice." },
];

export default function Trust() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="trust"
      style={{ paddingTop: 100, paddingBottom: 100, background: "#0c1120", position: "relative", overflow: "hidden" }}
    >
      {/* CSS glow orbs — no canvas, no lag */}
      <div style={{ position: "absolute", top: "20%", right: "15%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.06), transparent 60%)", filter: "blur(60px)", animation: "aurora-2 10s ease-in-out infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "20%", left: "20%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.05), transparent 60%)", filter: "blur(60px)", animation: "aurora-1 8s ease-in-out infinite", pointerEvents: "none" }} />
      <style>{`
        @keyframes aurora-1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-15px)} }
        @keyframes aurora-2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-15px,20px)} }
      `}</style>

      <div className="container" ref={ref} style={{ position: "relative", zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <div className="section-label" style={{ justifyContent: "center" }}>
            <Shield size={14} />
            Security & Trust
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>
            <TextReveal text="Your data, your control" highlight="control" highlightColor="#3b82f6" />
          </h2>
          <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 460, margin: "0 auto" }}>
            Security-first architecture. We never have access to place trades or move your money.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <SpotlightCard
                style={{
                  background: "#151d2b",
                  border: "1px solid #1f2937",
                  borderRadius: 12,
                  padding: 24,
                  display: "flex",
                  gap: 16,
                  height: "100%",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    background: "#3b82f612",
                    border: "1px solid #3b82f625",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <item.icon size={20} style={{ color: "#3b82f6" }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9", marginBottom: 6 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="card"
          style={{ marginTop: 24, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="animate-pulse-green" style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
            <span style={{ fontSize: 13, color: "#94a3b8" }}>
              Broker credentials are <strong style={{ color: "#f1f5f9" }}>never stored</strong>. Secure OAuth tokens revocable anytime.
            </span>
          </div>
          <a href="#" style={{ fontSize: 13, color: "#10b981", display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
            Security docs <ArrowRight size={12} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
