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
    <div
      style={{
        background: "rgba(15,23,42,0.9)",
        border: "1px solid #334155",
        backdropFilter: "blur(12px)",
        borderRadius: 12,
        padding: "12px 16px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 4, fontWeight: 500 }}>{label}</div>
      <div style={{ color: "#fff", fontSize: 16, fontWeight: 700, fontFamily: "var(--font-mono)", marginBottom: 2 }}>
        {formatRupee(payload[0].value)}
      </div>
      <div
        style={{
          fontSize: 12,
          fontFamily: "var(--font-mono)",
          color: payload[0].payload.pnl >= 0 ? "#34d399" : "#f87171",
          fontWeight: 600,
        }}
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
  const strokeColor = isPositive ? "#34d399" : "#f87171";

  // Add min/max domain for YAxis so the chart looks more dynamic
  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const padding = (maxVal - minVal) * 0.1; // 10% padding

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        borderRadius: 20,
        padding: "24px 28px",
        background: "rgba(15,23,42,0.6)",
        border: "1px solid #1f2937",
        backdropFilter: "blur(12px)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 480,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
            Portfolio Performance
          </h3>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
            Practice session — last 22 days
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.2)", padding: 4, borderRadius: 10 }}>
          {["1W", "1M", "3M", "ALL"].map((period, i) => (
            <button
              key={period}
              style={{
                padding: "6px 12px",
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                background: i === 1 ? "rgba(16,185,129,0.15)" : "transparent",
                color: i === 1 ? "#34d399" : "#64748b",
              }}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, width: "100%", minHeight: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={gradientColor} stopOpacity={0.4} />
                <stop offset="100%" stopColor={gradientColor} stopOpacity={0.0} />
              </linearGradient>
              {/* Drop shadow for the line */}
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor={gradientColor} floodOpacity="0.3" />
              </filter>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              dy={12}
              minTickGap={30}
            />
            <YAxis
              domain={[minVal - padding, maxVal + padding]}
              tick={{ fill: "#64748b", fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatRupee}
              dx={-12}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={strokeColor}
              strokeWidth={3}
              fill="url(#chartGradient)"
              dot={false}
              activeDot={{
                r: 6,
                fill: "#fff",
                stroke: strokeColor,
                strokeWidth: 3,
                boxShadow: `0 0 10px ${strokeColor}`,
              }}
              style={{ filter: "url(#shadow)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
