"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, X as XIcon, Star } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "Forever",
    cta: "Start Free",
    popular: false,
    features: [
      { text: "Unlimited StockSage Chat", ok: true },
      { text: "FIRE Calculator", ok: true },
      { text: "Manual Tradebook", ok: true },
      { text: "Manual Paper Trading", ok: true },
      { text: "1 Broker (30 days)", ok: true },
      { text: "Research Credits", ok: false },
      { text: "Live Charting", ok: false },
    ],
  },
  {
    name: "Pro",
    price: "₹999",
    oldPrice: "₹3,999",
    period: "Lifetime · One-time",
    badge: "75% OFF",
    cta: "Upgrade to Pro",
    popular: true,
    features: [
      { text: "Everything in Free", ok: true },
      { text: "50 Research Credits/mo", ok: true },
      { text: "Unlimited Broker Sync", ok: true },
      { text: "Unlimited Holdings", ok: true },
      { text: "Stock & MF Discovery", ok: true },
      { text: "Paper Trading + Live Charts", ok: true },
      { text: "Credit Pack Purchases", ok: true },
    ],
  },
  {
    name: "Premium",
    price: "₹1,499",
    oldPrice: "₹2,999",
    period: "Per month",
    cta: "Go Premium",
    popular: false,
    features: [
      { text: "Everything in Pro", ok: true },
      { text: "200 Research Credits/mo", ok: true },
      { text: "Learning Modules", ok: true },
      { text: "Portfolio AI Analysis", ok: true },
      { text: "AI Trading Strategies", ok: true },
      { text: "Paper Trading AI Analysis", ok: true },
      { text: "Priority Support", ok: true },
    ],
  },
];

export default function Pricing() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="pricing" style={{ paddingTop: 100, paddingBottom: 100 }}>
      <div className="container" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <div className="section-label" style={{ justifyContent: "center" }}>
            <Star size={14} />
            Pricing
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>
            Simple, transparent pricing
          </h2>
          <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 420, margin: "0 auto" }}>
            Start free. Upgrade when you need more power.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            maxWidth: 960,
            margin: "0 auto",
          }}
        >
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              style={{
                position: "relative",
                background: plan.popular ? "#151d2b" : "#111827",
                border: plan.popular ? "2px solid #10b981" : "1px solid #1f2937",
                borderRadius: 12,
                padding: 28,
              }}
            >
              {/* Popular */}
              {plan.popular && (
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#10b981",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "4px 16px",
                    borderRadius: 6,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    whiteSpace: "nowrap",
                  }}
                >
                  Most Popular
                </div>
              )}

              {/* Badge */}
              {plan.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    background: "#f59e0b",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: 4,
                  }}
                >
                  {plan.badge}
                </div>
              )}

              <div style={{ fontSize: 13, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>
                {plan.name}
              </div>

              <div style={{ marginBottom: 4 }}>
                <span className="mono" style={{ fontSize: 36, fontWeight: 700, color: "#f1f5f9" }}>{plan.price}</span>
                {plan.oldPrice && (
                  <span className="mono" style={{ fontSize: 16, color: "#475569", textDecoration: "line-through", marginLeft: 8 }}>{plan.oldPrice}</span>
                )}
              </div>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>{plan.period}</div>

              <button
                className={`btn ${plan.popular ? "btn-primary" : "btn-secondary"}`}
                style={{ width: "100%", marginBottom: 24, cursor: "pointer" }}
              >
                {plan.cta}
              </button>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {plan.features.map((f) => (
                  <li key={f.text} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {f.ok ? (
                      <Check size={14} style={{ color: "#10b981", flexShrink: 0 }} />
                    ) : (
                      <XIcon size={14} style={{ color: "#374151", flexShrink: 0 }} />
                    )}
                    <span style={{ fontSize: 13, color: f.ok ? "#94a3b8" : "#374151" }}>{f.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
