"use client";

import { Globe, MessageCircle, Users, Mail } from "lucide-react";

const links = {
  Product: ["Features", "Pricing", "Paper Trading", "StockSage AI", "FIRE Calculator"],
  Resources: ["Blog", "Glossary", "Documentation", "API Reference", "Compare"],
  Company: ["About", "Careers", "Contact", "Privacy Policy", "Terms"],
};

const socials = [
  { icon: MessageCircle, label: "Twitter" },
  { icon: Users, label: "LinkedIn" },
  { icon: Globe, label: "Website" },
  { icon: Mail, label: "Email" },
];

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #1f2937" }}>
      <div className="container" style={{ paddingTop: 48, paddingBottom: 24 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 48,
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "#fff" }}>U</div>
              <span style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9" }}>UseMoney</span>
            </div>
            <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, maxWidth: 280, marginBottom: 20 }}>
              AI-powered trading copilot for Indian markets. Unify brokers, get insights, and practice risk-free.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    background: "#111827",
                    border: "1px solid #1f2937",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#64748b",
                    transition: "all 0.15s",
                  }}
                >
                  <s.icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([cat, items]) => (
            <div key={cat}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
                {cat}
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" style={{ fontSize: 13, color: "#475569", transition: "color 0.15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#f1f5f9"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "#475569"; }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid #1f2937", paddingTop: 20, textAlign: "center" }}>
          <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.8, maxWidth: 640, margin: "0 auto 12px" }}>
            UseMoney is not a SEBI-registered Research Analyst or Investment Advisor. All AI outputs are educational and informational only.
            Market data may be delayed. Past performance is not indicative of future results.
          </p>
          <div style={{ fontSize: 12, color: "#374151" }}>
            © {new Date().getFullYear()} UseMoney. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
