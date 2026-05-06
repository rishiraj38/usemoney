"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  X,
  Eye,
  StickyNote,
} from "lucide-react";
import type { PaperTrade } from "@/types/practice";

function formatCurrency(val: number): string {
  return `₹${val.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

function getTimeSince(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

interface TradesTableProps {
  trades: PaperTrade[];
}

export default function TradesTable({ trades }: TradesTableProps) {
  const [filter, setFilter] = useState<"ALL" | "OPEN" | "CLOSED">("ALL");
  const [selectedTrade, setSelectedTrade] = useState<PaperTrade | null>(null);

  const filtered = trades.filter((t) => {
    if (filter === "ALL") return true;
    return t.status === filter;
  });

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border-b border-white/5">
        <div>
          <h3 className="text-lg font-semibold text-white">Paper Trades</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            {filtered.length} {filter.toLowerCase()} positions
          </p>
        </div>
        <div className="flex items-center gap-1 mt-3 sm:mt-0 bg-navy-800/50 rounded-lg p-1">
          {(["ALL", "OPEN", "CLOSED"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                filter === f
                  ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-white/5">
              <th className="text-left py-3 px-5">Stock</th>
              <th className="text-left py-3 px-3">Type</th>
              <th className="text-right py-3 px-3">Qty</th>
              <th className="text-right py-3 px-3">Entry</th>
              <th className="text-right py-3 px-3">Current</th>
              <th className="text-right py-3 px-3">P&L</th>
              <th className="text-right py-3 px-3">SL / Target</th>
              <th className="text-center py-3 px-5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((trade, i) => {
              const pnl =
                trade.status === "CLOSED"
                  ? trade.pnl!
                  : trade.type === "BUY"
                    ? (trade.currentPrice - trade.entryPrice) * trade.quantity
                    : (trade.entryPrice - trade.currentPrice) * trade.quantity;
              const pnlPct =
                trade.status === "CLOSED"
                  ? trade.pnlPercent!
                  : ((pnl / (trade.entryPrice * trade.quantity)) * 100);
              const isPositive = pnl >= 0;

              return (
                <motion.tr
                  key={trade.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-white/3 hover:bg-white/2 transition-colors group"
                >
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                          isPositive
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {trade.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          {trade.symbol}
                        </div>
                        <div className="text-xs text-slate-500">
                          {getTimeSince(trade.executedAt)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                        trade.type === "BUY"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {trade.type === "BUY" ? (
                        <ArrowUpRight size={12} />
                      ) : (
                        <ArrowDownRight size={12} />
                      )}
                      {trade.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right text-sm text-slate-300 font-mono">
                    {trade.quantity}
                  </td>
                  <td className="py-3.5 px-3 text-right text-sm text-slate-300 font-mono">
                    {formatCurrency(trade.entryPrice)}
                  </td>
                  <td className="py-3.5 px-3 text-right text-sm text-white font-mono font-medium">
                    {trade.status === "CLOSED"
                      ? formatCurrency(trade.exitPrice!)
                      : formatCurrency(trade.currentPrice)}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div
                      className={`text-sm font-semibold font-mono ${
                        isPositive ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {formatCurrency(pnl)}
                    </div>
                    <div
                      className={`text-xs font-mono ${
                        isPositive ? "text-green-500/70" : "text-red-500/70"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {pnlPct.toFixed(2)}%
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-right text-xs text-slate-500 font-mono">
                    {trade.stopLoss && trade.target ? (
                      <span>
                        <span className="text-red-400/60">
                          {formatCurrency(trade.stopLoss)}
                        </span>
                        {" / "}
                        <span className="text-green-400/60">
                          {formatCurrency(trade.target)}
                        </span>
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <button
                      onClick={() => setSelectedTrade(trade)}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      aria-label={`View details for ${trade.symbol}`}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Trade Detail Modal */}
      <AnimatePresence>
        {selectedTrade && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
            onClick={() => setSelectedTrade(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-6 max-w-lg w-full border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 font-bold">
                    {selectedTrade.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {selectedTrade.symbol}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {selectedTrade.companyName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTrade(null)}
                  className="p-2 rounded-lg hover:bg-white/5 text-slate-400 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-navy-800/50 rounded-xl p-3">
                  <div className="text-xs text-slate-500 mb-1">Type</div>
                  <div
                    className={`text-sm font-semibold ${
                      selectedTrade.type === "BUY"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {selectedTrade.type}
                  </div>
                </div>
                <div className="bg-navy-800/50 rounded-xl p-3">
                  <div className="text-xs text-slate-500 mb-1">Quantity</div>
                  <div className="text-sm font-semibold text-white">
                    {selectedTrade.quantity}
                  </div>
                </div>
                <div className="bg-navy-800/50 rounded-xl p-3">
                  <div className="text-xs text-slate-500 mb-1">Entry Price</div>
                  <div className="text-sm font-semibold text-white font-mono">
                    {formatCurrency(selectedTrade.entryPrice)}
                  </div>
                </div>
                <div className="bg-navy-800/50 rounded-xl p-3">
                  <div className="text-xs text-slate-500 mb-1">Current Price</div>
                  <div className="text-sm font-semibold text-white font-mono">
                    {formatCurrency(selectedTrade.currentPrice)}
                  </div>
                </div>
                {selectedTrade.stopLoss && (
                  <div className="bg-navy-800/50 rounded-xl p-3">
                    <div className="text-xs text-slate-500 mb-1">Stop Loss</div>
                    <div className="text-sm font-semibold text-red-400 font-mono">
                      {formatCurrency(selectedTrade.stopLoss)}
                    </div>
                  </div>
                )}
                {selectedTrade.target && (
                  <div className="bg-navy-800/50 rounded-xl p-3">
                    <div className="text-xs text-slate-500 mb-1">Target</div>
                    <div className="text-sm font-semibold text-green-400 font-mono">
                      {formatCurrency(selectedTrade.target)}
                    </div>
                  </div>
                )}
              </div>

              {selectedTrade.notes && (
                <div className="flex items-start gap-2 bg-brand-500/5 border border-brand-500/10 rounded-xl p-3">
                  <StickyNote size={16} className="text-brand-400 mt-0.5" />
                  <p className="text-sm text-slate-400">
                    {selectedTrade.notes}
                  </p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                {selectedTrade.status === "OPEN" && (
                  <>
                    <button className="flex-1 btn-primary justify-center !py-2.5 !text-sm cursor-pointer">
                      Close Position
                    </button>
                    <button className="flex-1 btn-secondary justify-center !py-2.5 !text-sm cursor-pointer">
                      Edit SL/Target
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
