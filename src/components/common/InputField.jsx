import React from "react";

function InputField({
  label,
  type = "number",
  value,
  onChange,
  placeholder,
  prefix,
  suffix,
  hint,
}) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
        {label}
      </label>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        {prefix && (
          <span
            style={{
              position: "absolute",
              left: 12,
              color: "#64748b",
              fontSize: 14,
              fontWeight: 500,
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            {prefix}
          </span>
        )}
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          placeholder={placeholder || "0"}
          style={{
            width: "100%",
            padding: "10px 12px",
            paddingLeft: prefix ? "30px" : "12px",
            paddingRight: suffix ? "36px" : "12px",
            border: "1.5px solid #e2e8f0",
            borderRadius: 8,
            fontSize: 14,
            background: "#fff",
            outline: "none",
            transition: "border-color 0.15s",
            fontFamily: "'Plus Poppins', sans-serif",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
          onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
        />
        {suffix && (
          <span
            style={{
              position: "absolute",
              right: 12,
              color: "#64748b",
              fontSize: 13,
              fontWeight: 500,
              pointerEvents: "none",
            }}
          >
            {suffix}
          </span>
        )}
      </div>
      {hint && (
        <span style={{ fontSize: 11, color: "#94a3b8" }}>{hint}</span>
      )}
    </div>
  );
}

export default InputField;