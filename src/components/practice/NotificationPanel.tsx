"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  BellOff,
  Check,
  Trash2,
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

const severityColors: Record<string, string> = {
  info: "border-l-accent-400 bg-accent-500/5",
  success: "border-l-green-400 bg-green-500/5",
  warning: "border-l-amber-400 bg-amber-500/5",
  error: "border-l-red-400 bg-red-500/5",
};

const severityIconColors: Record<string, string> = {
  info: "text-accent-400 bg-accent-500/10",
  success: "text-green-400 bg-green-500/10",
  warning: "text-amber-400 bg-amber-500/10",
  error: "text-red-400 bg-red-500/10",
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
      className="glass rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell size={20} className="text-brand-400" />
            {unreadCount > 0 && (
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
            <p className="text-xs text-slate-500">
              {unreadCount} unread alert{unreadCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-brand-400 transition-colors cursor-pointer"
              title="Mark all as read"
            >
              <CheckCheck size={18} />
            </button>
          )}
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Notification settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 px-5 pt-3 pb-2">
        {(["ALL", "UNREAD"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              filter === f
                ? "bg-brand-500/20 text-brand-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {f === "ALL" ? "All" : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="max-h-[480px] overflow-y-auto">
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
                className={`relative border-l-2 mx-3 my-2 rounded-xl p-4 transition-all ${
                  severityColors[notification.severity]
                } ${!notification.read ? "" : "opacity-60"}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      severityIconColors[notification.severity]
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className={`text-sm font-semibold ${
                          !notification.read ? "text-white" : "text-slate-300"
                        }`}
                      >
                        {notification.title}
                      </h4>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-brand-400" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[11px] text-slate-600">
                        {timeAgo(notification.timestamp)}
                      </span>
                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <button
                            onClick={() => markRead(notification.id)}
                            className="p-1 rounded hover:bg-white/5 text-slate-500 hover:text-brand-400 cursor-pointer"
                            title="Mark as read"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => dismiss(notification.id)}
                          className="p-1 rounded hover:bg-white/5 text-slate-500 hover:text-red-400 cursor-pointer"
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
          <div className="text-center py-12">
            <BellOff size={32} className="text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No notifications</p>
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
            className="border-t border-white/5 overflow-hidden"
          >
            <div className="p-5 space-y-3">
              <h4 className="text-sm font-semibold text-white mb-3">
                Notification Preferences
              </h4>
              {[
                { key: "priceAlerts", label: "Price Alerts", desc: "When a stock hits your alert price" },
                { key: "targetHit", label: "Target Hit", desc: "When a position reaches your target" },
                { key: "stopLoss", label: "Stop Loss Alerts", desc: "When a position nears your stop loss" },
                { key: "aiInsights", label: "AI Insights", desc: "Portfolio recommendations from StockSage" },
                { key: "achievements", label: "Achievements", desc: "Trading milestones and badges" },
              ].map((pref) => (
                <label
                  key={pref.key}
                  className="flex items-center justify-between py-2 cursor-pointer group"
                >
                  <div>
                    <div className="text-sm text-slate-300 group-hover:text-white transition-colors">
                      {pref.label}
                    </div>
                    <div className="text-xs text-slate-600">{pref.desc}</div>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 accent-brand-500 cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
