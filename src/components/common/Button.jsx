import React from "react";

function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  fullWidth = false,
}) {
  const styles = {
    primary: {
      background: disabled ? "#f1f5f9" : "#2563eb",
      color: disabled ? "#94a3b8" : "#fff",
      border: "none",
    },
    secondary: {
      background: "#f8fafc",
      color: "#374151",
      border: "1px solid #e2e8f0",
    },
    danger: {
      background: "#fef2f2",
      color: "#dc2626",
      border: "1px solid #fecaca",
    },
    dark: {
      background: "#0f172a",
      color: "#fff",
      border: "none",
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        width: fullWidth ? "100%" : "auto",
        padding: "10px 20px",
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 600,
        cursor: disabled ? "default" : "pointer",
        fontFamily: "'Plus Poppins', sans-serif",
        transition: "all 0.15s",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.opacity = "0.9";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "1";
      }}
    >
      {children}
    </button>
  );
}

export default Button;