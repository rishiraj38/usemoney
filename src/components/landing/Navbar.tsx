"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";

const links = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Security", href: "#trust" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      id="main-nav"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: 64,
        background: scrolled ? "rgba(10, 14, 23, 0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #1f2937" : "1px solid transparent",
        transition: "all 0.3s ease",
      }}
    >
      <div
        className="container"
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 14,
              color: "#fff",
            }}
          >
            U
          </div>
          <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em", color: "#f1f5f9" }}>
            UseMoney
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex" style={{ alignItems: "center", gap: 4 }}>
          {links.map((link) => (
            <a key={link.label} href={link.href} className="btn btn-ghost" style={{ fontSize: 13 }}>
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex" style={{ alignItems: "center", gap: 8 }}>
          <a href="https://qa.usemoney.ai" className="btn btn-ghost" style={{ fontSize: 13 }}>
            Sign In
          </a>
          <a href="https://qa.usemoney.ai" className="btn btn-primary btn-sm">
            Get Started
            <ArrowRight size={14} />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden"
          style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: 4 }}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          className="md:hidden"
          style={{
            background: "#111827",
            borderTop: "1px solid #1f2937",
            padding: "12px 24px 20px",
          }}
        >
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{ display: "block", padding: "10px 0", color: "#94a3b8", fontSize: 14 }}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            <a href="https://qa.usemoney.ai" className="btn btn-secondary" style={{ justifyContent: "center" }}>Sign In</a>
            <a href="https://qa.usemoney.ai" className="btn btn-primary" style={{ justifyContent: "center" }}>Get Started <ArrowRight size={14} /></a>
          </div>
        </div>
      )}
    </nav>
  );
}
