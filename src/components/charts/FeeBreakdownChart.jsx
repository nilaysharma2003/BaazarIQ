import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function FeeBreakdownChart({ results }) {
  const data = [
    { name: "Referral Fee", value: Math.max(0, results.referralFee), color: "#ef4444" },
    { name: "Closing Fee", value: Math.max(0, results.closingFee), color: "#f59e0b" },
    { name: "Shipping Fee", value: Math.max(0, results.amazonShipping), color: "#8b5cf6" },
    { name: "GST", value: Math.max(0, results.gstAmount), color: "#06b6d4" },
    { name: "Profit", value: Math.max(0, results.profit), color: "#22c55e" },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div
        style={{
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
          fontSize: 14,
        }}
      >
        Enter values to see chart
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(v) => `₹${v.toFixed(2)}`}
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            fontSize: 12,
          }}
        />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default FeeBreakdownChart;