"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { ChartDataPoint } from "@/types/practice";

interface PerformanceChartProps {
  data: ChartDataPoint[];
}

function formatRupee(val: number): string {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  return `₹${val.toLocaleString("en-IN")}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl p-3 text-sm border border-white/10 shadow-xl">
      <div className="text-slate-400 text-xs mb-1">{label}</div>
      <div className="text-white font-semibold font-mono">
        {formatRupee(payload[0].value)}
      </div>
      <div
        className={`text-xs font-mono mt-0.5 ${
          payload[0].payload.pnl >= 0 ? "text-green-400" : "text-red-400"
        }`}
      >
        P&L: {payload[0].payload.pnl >= 0 ? "+" : ""}
        {formatRupee(payload[0].payload.pnl)}
      </div>
    </div>
  );
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  const isPositive = useMemo(() => {
    if (data.length < 2) return true;
    return data[data.length - 1].value >= data[0].value;
  }, [data]);

  const gradientColor = isPositive ? "#10b981" : "#ef4444";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Portfolio Performance
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Practice session — last 22 days
          </p>
        </div>
        <div className="flex items-center gap-2">
          {["1W", "1M", "3M", "ALL"].map((period, i) => (
            <button
              key={period}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all cursor-pointer ${
                i === 1
                  ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                  : "text-slate-500 hover:text-white hover:bg-white/5"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={gradientColor} stopOpacity={0.3} />
                <stop
                  offset="100%"
                  stopColor={gradientColor}
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.03)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatRupee}
              dx={-8}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={gradientColor}
              strokeWidth={2}
              fill="url(#chartGradient)"
              dot={false}
              activeDot={{
                r: 5,
                fill: gradientColor,
                stroke: "#0a1628",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
