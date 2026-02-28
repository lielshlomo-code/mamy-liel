"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DailyCount } from "@/lib/types";

interface ClicksChartProps {
  data: DailyCount[];
  color?: string;
  label?: string;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("he-IL", { day: "numeric", month: "short" });
}

export default function ClicksChart({
  data,
  color = "#0a0a0a",
  label = "לחיצות",
}: ClicksChartProps) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-text-secondary py-12 text-center">
        אין נתונים עדיין
      </p>
    );
  }

  return (
    <div className="h-64 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id={`gradient-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.15} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 11, fill: "#555" }}
            tickLine={false}
            axisLine={{ stroke: "#e0e0e0" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#555" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            labelFormatter={(v) => formatDate(String(v))}
            formatter={(value) => [value, label]}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              fontSize: "13px",
              direction: "rtl",
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke={color}
            strokeWidth={2}
            fill={`url(#gradient-${color.replace("#", "")})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
