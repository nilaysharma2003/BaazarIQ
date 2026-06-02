import React from "react";

function ResultCard({ label, value, icon, color, bg, size = "normal" }) {
  return (
    <div
      style={{
        background: bg || "#f8fafc",
        borderRadius: 12,
        padding: "14px 16px",
        border: `1px solid ${color}22`,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 14 }}>{icon}</span>
        <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>
          {label}
        </span>
      </div>
      <div
        style={{
          fontSize: size === "large" ? 24 : 18,
          fontWeight: 800,
          color: color || "#0f172a",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default ResultCard;