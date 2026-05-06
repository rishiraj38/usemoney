"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function CTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section style={{ paddingTop: 60, paddingBottom: 100 }}>
      <div className="container" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ position: "relative", borderRadius: 16, overflow: "hidden" }}
        >
          {/* Animated glowing border */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 16,
              padding: 1,
              background: "conic-gradient(from var(--angle, 0deg), #10b981, #3b82f6, #8b5cf6, #10b981)",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              animation: "spin-border 4s linear infinite",
            }}
          />
          <style>{`
            @property --angle {
              syntax: '<angle>';
              initial-value: 0deg;
              inherits: false;
            }
            @keyframes spin-border {
              to { --angle: 360deg; }
            }
          `}</style>

          <div
            style={{
              position: "relative",
              background: "#151d2b",
              borderRadius: 15,
              padding: "64px 48px",
              textAlign: "center",
            }}
          >
            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 48,
                marginBottom: 40,
                paddingBottom: 32,
                borderBottom: "1px solid #1f2937",
              }}
            >
              {[
                { label: "Active Traders", val: 10847 },
                { label: "Brokers Connected", val: 28450 },
                { label: "Paper Trades", val: 156000 },
              ].map((s) => (
                <div key={s.label}>
                  <div className="mono" style={{ fontSize: 28, fontWeight: 700, color: "#f1f5f9" }}>
                    <AnimatedCounter target={s.val} duration={2.5} />
                    <span style={{ color: "#10b981" }}>+</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </motion.div>

            <h2 style={{ fontSize: 36, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>
              Start trading smarter today
            </h2>
            <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 440, margin: "0 auto 32px" }}>
              Free forever. No credit card needed. Connect your first broker in under 2 minutes.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
              <a href="https://qa.usemoney.ai" className="btn btn-primary btn-lg" id="final-cta">
                Get Started Free <ArrowRight size={16} />
              </a>
              <a href="https://qa.usemoney.ai" className="btn btn-secondary btn-lg">
                View Live Demo
              </a>
            </div>
            <div style={{ marginTop: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 24, fontSize: 13, color: "#475569" }}>
              <span>✓ No credit card</span>
              <span>✓ Free forever tier</span>
              <span>✓ Read-only access</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
