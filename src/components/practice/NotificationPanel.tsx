"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  BellOff,
  Check,
  Target,
  AlertTriangle,
  TrendingUp,
  Bot,
  Trophy,
  BarChart2,
  Info,
  X,
  Settings,
  CheckCheck,
} from "lucide-react";
import type { Notification } from "@/types/practice";

const iconMap: Record<string, React.ElementType> = {
  PRICE_ALERT: TrendingUp,
  TARGET_HIT: Target,
  STOP_LOSS: AlertTriangle,
  TRADE_EXECUTED: Check,
  AI_INSIGHT: Bot,
  PORTFOLIO_UPDATE: BarChart2,
  ACHIEVEMENT: Trophy,
};

const severityBg: Record<string, string> = {
  info: "rgba(59,130,246,0.08)",
  success: "rgba(34,197,94,0.08)",
  warning: "rgba(251,191,36,0.08)",
  error: "rgba(239,68,68,0.08)",
};

const severityBorder: Record<string, string> = {
  info: "rgba(59,130,246,0.2)",
  success: "rgba(34,197,94,0.2)",
  warning: "rgba(251,191,36,0.2)",
  error: "rgba(239,68,68,0.2)",
};

const severityIconBg: Record<string, string> = {
  info: "rgba(59,130,246,0.15)",
  success: "rgba(34,197,94,0.15)",
  warning: "rgba(251,191,36,0.15)",
  error: "rgba(239,68,68,0.15)",
};

const severityIconColor: Record<string, string> = {
  info: "#60a5fa",
  success: "#34d399",
  warning: "#fbbf24",
  error: "#f87171",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface NotificationPanelProps {
  notifications: Notification[];
}

export default function NotificationPanel({
  notifications: initialNotifications,
}: NotificationPanelProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered =
    filter === "ALL" ? notifications : notifications.filter((n) => !n.read);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const dismiss = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        borderRadius: 20,
        overflow: "hidden",
        background: "rgba(15,23,42,0.6)",
        border: "1px solid #1f2937",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ position: "relative" }}>
            <Bell size={22} style={{ color: "#34d399" }} />
            {unreadCount > 0 && (
              <div style={{
                position: "absolute",
                top: -6,
                right: -6,
                width: 18,
                height: 18,
                background: "#ef4444",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>
                  {unreadCount}
                </span>
              </div>
            )}
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>Notifications</h3>
            <p style={{ fontSize: 13, color: "#64748b" }}>
              {unreadCount} unread alert{unreadCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              style={{
                padding: 8,
                borderRadius: 10,
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
              title="Mark all as read"
            >
              <CheckCheck size={18} />
            </button>
          )}
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            style={{
              padding: 8,
              borderRadius: 10,
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
            title="Notification settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 24px 8px" }}>
        {(["ALL", "UNREAD"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "6px 14px",
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              transition: "all 0.15s",
              background: filter === f ? "rgba(16,185,129,0.15)" : "transparent",
              color: filter === f ? "#34d399" : "#94a3b8",
            }}
          >
            {f === "ALL" ? "All" : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      {/* Notification Grid — horizontal card layout */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
        gap: 12,
        padding: "12px 20px 20px",
        maxHeight: 480,
        overflowY: "auto",
      }}>
        <AnimatePresence mode="popLayout">
          {filtered.map((notification) => {
            const Icon = iconMap[notification.type] || Info;
            return (
              <motion.div
                key={notification.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                style={{
                  position: "relative",
                  borderRadius: 16,
                  padding: "16px 20px",
                  background: severityBg[notification.severity],
                  border: `1px solid ${severityBorder[notification.severity]}`,
                  opacity: notification.read ? 0.6 : 1,
                  transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      background: severityIconBg[notification.severity],
                    }}
                  >
                    <Icon size={20} style={{ color: severityIconColor[notification.severity] }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <h4 style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: notification.read ? "#94a3b8" : "#fff",
                      }}>
                        {notification.title}
                      </h4>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                        {!notification.read && (
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399" }} />
                        )}
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5, marginTop: 4 }}>
                      {notification.message}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                      <span style={{ fontSize: 11, color: "#475569" }}>
                        {timeAgo(notification.timestamp)}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        {!notification.read && (
                          <button
                            onClick={() => markRead(notification.id)}
                            style={{
                              padding: 4,
                              borderRadius: 6,
                              background: "transparent",
                              border: "none",
                              color: "#64748b",
                              cursor: "pointer",
                              display: "flex",
                            }}
                            title="Mark as read"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => dismiss(notification.id)}
                          style={{
                            padding: 4,
                            borderRadius: 6,
                            background: "transparent",
                            border: "none",
                            color: "#64748b",
                            cursor: "pointer",
                            display: "flex",
                          }}
                          title="Dismiss"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0", gridColumn: "1 / -1" }}>
            <BellOff size={32} style={{ color: "#475569", margin: "0 auto 12px" }} />
            <p style={{ fontSize: 14, color: "#64748b" }}>No notifications</p>
          </div>
        )}
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}
          >
            <div style={{ padding: "20px 24px" }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 16 }}>
                Notification Preferences
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                {[
                  { key: "priceAlerts", label: "Price Alerts", desc: "When a stock hits your alert price" },
                  { key: "targetHit", label: "Target Hit", desc: "When a position reaches your target" },
                  { key: "stopLoss", label: "Stop Loss Alerts", desc: "When a position nears your stop loss" },
                  { key: "aiInsights", label: "AI Insights", desc: "Portfolio recommendations from StockSage" },
                  { key: "achievements", label: "Achievements", desc: "Trading milestones and badges" },
                ].map((pref) => (
                  <label
                    key={pref.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      borderRadius: 12,
                      cursor: "pointer",
                      background: "rgba(15,23,42,0.5)",
                      border: "1px solid #1f2937",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, color: "#e2e8f0" }}>{pref.label}</div>
                      <div style={{ fontSize: 12, color: "#475569" }}>{pref.desc}</div>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      style={{ width: 18, height: 18, accentColor: "#10b981", cursor: "pointer" }}
                    />
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
