"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, MessageSquare } from "lucide-react";
import Marquee from "@/components/ui/Marquee";
import TextReveal from "@/components/ui/TextReveal";

const testimonials = [
  { name: "Priya Sharma", role: "Retail Investor · Mumbai", text: "StockSage AI caught my 60% IT concentration risk that I completely missed. Now my portfolio is properly diversified across sectors." },
  { name: "Arjun Patel", role: "Swing Trader · Ahmedabad", text: "Paper traded my strategy for 3 months risk-free before going live. Saved me from at least ₹50K in potential losses." },
  { name: "Sneha Krishnan", role: "SIP Investor · Bangalore", text: "Seeing all my Zerodha and Groww holdings in one view is a game changer. FIRE calculator motivated me to increase my SIP by 20%." },
  { name: "Rohan Desai", role: "Day Trader · Pune", text: "AI analysis showed I was overtrading on Mondays. Small insight, huge impact on P&L. Pro plan pays for itself many times over." },
  { name: "Ananya Gupta", role: "Long-term Investor · Delhi", text: "The multi-broker sync alone is worth it. No more switching between 3 different apps to check my complete portfolio." },
  { name: "Karthik Iyer", role: "Options Trader · Chennai", text: "StockSage's risk analysis before market open has become part of my morning routine. It catches things my watchlist doesn't." },
];

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div
      className="card"
      style={{
        padding: 24,
        width: 360,
        flexShrink: 0,
        marginRight: 16,
      }}
    >
      <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
        {Array.from({ length: 5 }).map((_, j) => (
          <Star key={j} size={13} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
        ))}
      </div>
      <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7, marginBottom: 20, minHeight: 72 }}>
        &quot;{t.text}&quot;
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "#10b98112",
            border: "1px solid #10b98125",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            fontSize: 12,
            color: "#10b981",
          }}
        >
          {t.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{t.name}</div>
          <div style={{ fontSize: 11, color: "#475569" }}>{t.role}</div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const firstHalf = testimonials.slice(0, 3);
  const secondHalf = testimonials.slice(3);

  return (
    <section id="testimonials" style={{ paddingTop: 100, paddingBottom: 100, overflow: "hidden" }} ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <div className="section-label" style={{ justifyContent: "center" }}>
            <MessageSquare size={14} />
            Testimonials
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>
            <TextReveal text="Trusted by Indian traders" highlight="traders" />
          </h2>
          <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 420, margin: "0 auto" }}>
            Join 10,000+ traders already using UseMoney.
          </p>
        </motion.div>
      </div>

      {/* Row 1: Scroll left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Marquee speed={35} direction="left">
          <div style={{ display: "flex" }}>
            {firstHalf.map((t) => (
              <TestimonialCard key={t.name} t={t} />
            ))}
          </div>
        </Marquee>
      </motion.div>

      {/* Row 2: Scroll right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{ marginTop: 16 }}
      >
        <Marquee speed={40} direction="right">
          <div style={{ display: "flex" }}>
            {secondHalf.map((t) => (
              <TestimonialCard key={t.name} t={t} />
            ))}
          </div>
        </Marquee>
      </motion.div>
    </section>
  );
}
