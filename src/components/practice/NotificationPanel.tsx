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

const severityIconColor: Record<string, string> = {
  info: "#60a5fa",
  success: "#34d399",
  warning: "#fbbf24",
  error: "#f87171",
};

const severityBgGlow: Record<string, string> = {
  info: "radial-gradient(circle at top left, rgba(59,130,246,0.15), transparent 70%)",
  success: "radial-gradient(circle at top left, rgba(16,185,129,0.15), transparent 70%)",
  warning: "radial-gradient(circle at top left, rgba(251,191,36,0.15), transparent 70%)",
  error: "radial-gradient(circle at top left, rgba(239,68,68,0.15), transparent 70%)",
};

const severityLeftBorder: Record<string, string> = {
  info: "#3b82f6",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
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
      transition={{ duration: 0.5, delay: 0.1 }}
      style={{
        borderRadius: 20,
        overflow: "hidden",
        background: "rgba(15,23,42,0.6)",
        border: "1px solid #1f2937",
        backdropFilter: "blur(12px)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 480,
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "24px 28px 16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ position: "relative" }}>
            <Bell size={22} style={{ color: "#34d399" }} />
            {unreadCount > 0 && (
              <div style={{
                position: "absolute",
                top: -4,
                right: -4,
                width: 14,
                height: 14,
                background: "#ef4444",
                borderRadius: "50%",
                boxShadow: "0 0 10px rgba(239,68,68,0.6)",
              }} />
            )}
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>Notifications</h3>
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
                transition: "all 0.2s",
              }}
              className="hover:text-white hover:bg-white/5"
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
              background: settingsOpen ? "rgba(255,255,255,0.1)" : "transparent",
              border: "none",
              color: settingsOpen ? "#fff" : "#94a3b8",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              transition: "all 0.2s",
            }}
            className="hover:text-white hover:bg-white/5"
            title="Notification settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ padding: "0 28px 16px", display: "flex", gap: 20, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        {(["ALL", "UNREAD"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              position: "relative",
              padding: "0 4px 12px",
              fontSize: 13,
              fontWeight: 600,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: filter === f ? "#34d399" : "#64748b",
              transition: "color 0.2s",
            }}
          >
            {f === "ALL" ? "All" : `Unread (${unreadCount})`}
            {filter === f && (
              <motion.div
                layoutId="activeFilter"
                style={{
                  position: "absolute",
                  bottom: -1,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: "#34d399",
                  borderRadius: "2px 2px 0 0",
                  boxShadow: "0 -2px 10px rgba(52,211,153,0.5)",
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", overflow: "hidden", background: "rgba(0,0,0,0.2)" }}
          >
            <div style={{ padding: "20px 28px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { key: "priceAlerts", label: "Price Alerts" },
                  { key: "targetHit", label: "Target Hit" },
                  { key: "stopLoss", label: "Stop Loss" },
                  { key: "aiInsights", label: "AI Insights" },
                ].map((pref) => (
                  <label
                    key={pref.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      defaultChecked
                      style={{ width: 16, height: 16, accentColor: "#10b981", cursor: "pointer" }}
                    />
                    <span style={{ fontSize: 13, color: "#cbd5e1", fontWeight: 500 }}>{pref.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification List */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "8px 12px 12px",
      }}>
        <AnimatePresence initial={false}>
          {filtered.map((notification) => {
            const Icon = iconMap[notification.type] || Info;
            return (
              <motion.div
                key={notification.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, height: 0, margin: 0 }}
                style={{
                  position: "relative",
                  margin: "8px",
                  borderRadius: 14,
                  padding: "16px 20px",
                  background: notification.read ? "transparent" : severityBgGlow[notification.severity],
                  border: "1px solid rgba(255,255,255,0.05)",
                  opacity: notification.read ? 0.6 : 1,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  overflow: "hidden",
                }}
                className="hover:!bg-white/5 transition-all group"
              >
                {/* Left accent border for unread */}
                {!notification.read && (
                  <div style={{
                    position: "absolute",
                    left: 0,
                    top: 16,
                    bottom: 16,
                    width: 3,
                    borderRadius: "0 4px 4px 0",
                    background: severityLeftBorder[notification.severity],
                    boxShadow: `0 0 10px ${severityLeftBorder[notification.severity]}`,
                  }} />
                )}

                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    background: "rgba(15,23,42,0.8)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <Icon size={18} style={{ color: severityIconColor[notification.severity] }} />
                </div>

                <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                    <h4 style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: notification.read ? "#94a3b8" : "#fff",
                      marginBottom: 4,
                      lineHeight: 1.4,
                    }}>
                      {notification.title}
                    </h4>
                    <span style={{ fontSize: 11, color: "#64748b", whiteSpace: "nowrap", flexShrink: 0, marginTop: 2 }}>
                      {timeAgo(notification.timestamp)}
                    </span>
                  </div>
                  
                  <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5, marginBottom: 12 }}>
                    {notification.message}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: 0 }} className="group-hover:!opacity-100 transition-opacity">
                    {!notification.read && (
                      <button
                        onClick={() => markRead(notification.id)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 6,
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "#cbd5e1",
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                        className="hover:!bg-white/10 hover:!text-white transition-all"
                      >
                        <Check size={12} /> Mark read
                      </button>
                    )}
                    <button
                      onClick={() => dismiss(notification.id)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#cbd5e1",
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                      className="hover:!bg-white/10 hover:!text-white transition-all"
                    >
                      <X size={12} /> Dismiss
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "64px 20px" }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.03)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <BellOff size={28} style={{ color: "#475569" }} />
            </div>
            <h4 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 6 }}>All caught up!</h4>
            <p style={{ fontSize: 13, color: "#64748b" }}>You have no new notifications.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
