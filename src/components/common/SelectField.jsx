import React from "react";

function SelectField({ label, value, onChange, options, placeholder }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
        {label}
      </label>
      <select
        value={value}
        onChange={handleChange}
        style={{
          padding: "10px 12px",
          border: "1.5px solid #e2e8f0",
          borderRadius: 8,
          fontSize: 14,
          background: "#fff",
          outline: "none",
          cursor: "pointer",
          fontFamily: "'Plus Poppins', sans-serif",
          color: value ? "#0f172a" : "#94a3b8",
          appearance: "auto",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
        onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
      >
        <option value="" disabled>
          {placeholder || "Select..."}
        </option>
        {options.map((o) => (
          <option key={o.value || o} value={o.value || o}>
            {o.label || o}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectField;