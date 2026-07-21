import React from "react";
import { useNavigate } from "react-router-dom";
import theme from "../../utils/theme";

function BlogLayout({ title, subtitle, category, readTime, date, children, relatedTools = [] }) {
  const navigate = useNavigate();

  return (
    <div style={{ background: "#f1f5f9", minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>

      {/* Hero */}
      <section style={{
        background: theme.navy, padding: "80px 24px 90px",
        textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(ellipse at 30% 50%, rgba(53,208,178,0.12) 0%,transparent 60%),radial-gradient(ellipse at 70% 50%, rgba(37,99,235,0.08) 0%,transparent 60%)",
        }} />
        <div style={{ position: "relative", maxWidth: 800, margin: "0 auto" }}>

          {/* Badge */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
            <span style={{
              background: "rgba(53,208,178,0.1)", border: "1px solid rgba(53,208,178,0.2)",
              borderRadius: theme.radius.full, padding: "6px 18px",
              color: theme.teal, fontSize: theme.fontSize.xs, fontWeight: theme.fontWeight.semibold,
            }}>{category}</span>
          </div>

          {/* Teal subtitle line */}
          <p style={{ color: "#35d0b2", fontSize: 16, fontWeight: 600, marginBottom: 12, letterSpacing: "0.3px" }}>
            {category} Guide for Indian Sellers
          </p>

          {/* Title */}
          <h1 style={{
            fontSize: "clamp(42px, 6vw, 72px)", fontWeight: theme.fontWeight.black,
            letterSpacing: "-2px", lineHeight: 1.1, color: "#f8fafc", marginBottom: 20,
          }}>{title}</h1>

          {/* Subtitle */}
          <p style={{
            color: "#94a3b8", fontSize: 18,
            maxWidth: 580, margin: "0 auto 16px", lineHeight: 1.75,
          }}>
            {subtitle}
          </p>
          <p style={{
            color: "#64748b", fontSize: 15,
            maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.7,
          }}>
            Free guide updated for 2025. No sign-up required to use our tools.
          </p>

          {/* Stats bar */}
          <div style={{
            display: "flex", justifyContent: "center", gap: 0, flexWrap: "wrap",
            borderTop: "1px solid rgba(53,208,178,0.15)", paddingTop: 28,
          }}>
            {[
              ["Free Guide", "No Sign-up Needed"],
              ["Expert Tips", "Verified Info"],
              ["Free Tools", "Try Them Now"],
              ["Updated", "2025"],
            ].map(([n, l], i) => (
              <div key={l} style={{
                textAlign: "center", padding: "0 28px",
                borderRight: i < 3 ? "1px solid rgba(53,208,178,0.15)" : "none",
              }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#35d0b2", marginBottom: 3 }}>{n}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 300px",
          gap: 32, marginTop: 32, paddingBottom: 48, alignItems: "start",
        }}>

          {/* Main content */}
          <div style={{
            background: "#fff", borderRadius: theme.radius.lg,
            border: "1px solid #e8ecf0", padding: "40px",
            boxShadow: theme.shadow.sm, lineHeight: theme.lineHeight.relaxed,
          }}>
            {children}
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 24 }}>

            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <div style={{
                background: "#fff", borderRadius: theme.radius.lg,
                border: "1px solid #e8ecf0", padding: "20px", boxShadow: theme.shadow.sm,
              }}>
                <h3 style={{
                  fontWeight: theme.fontWeight.bold, fontSize: theme.fontSize.sm,
                  color: "#0f172a", marginBottom: 14,
                  textTransform: "uppercase", letterSpacing: "0.5px",
                }}>
                  Try These Tools
                </h3>
                {relatedTools.map((tool) => (
                  <button key={tool.href} onClick={() => navigate(tool.href)} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    width: "100%", padding: "10px 12px", marginBottom: 8,
                    background: "#f8fafc", border: "1px solid #e8ecf0",
                    borderRadius: theme.radius.sm, cursor: "pointer",
                    textAlign: "left", fontFamily: "'Poppins', sans-serif",
                    transition: "all 0.15s",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.teal; e.currentTarget.style.background = "rgba(53,208,178,0.05)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e8ecf0"; e.currentTarget.style.background = "#f8fafc"; }}
                  >
                    <span style={{ fontSize: 20 }}>{tool.icon}</span>
                    <div>
                      <div style={{ fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.semibold, color: "#0f172a" }}>{tool.name}</div>
                      <div style={{ fontSize: theme.fontSize.xs, color: "#64748b" }}>{tool.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* View All Tools */}
            <button onClick={() => navigate("/")} style={{
              background: theme.teal, color: theme.navy, border: "none",
              padding: "12px", borderRadius: theme.radius.sm,
              fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.bold,
              cursor: "pointer", fontFamily: "'Poppins', sans-serif", width: "100%",
            }}>View All Free Tools</button>

            {/* Go Back */}
            <button onClick={() => navigate(-1)} style={{
              background: "#fff", color: "#374151", border: "1px solid #e8ecf0",
              padding: "12px", borderRadius: theme.radius.sm,
              fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.semibold,
              cursor: "pointer", fontFamily: "'Poppins', sans-serif", width: "100%",
            }}>Go Back</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable blog components
export function H2({ children }) {
  return <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginTop: 32, marginBottom: 12, letterSpacing: "-0.5px" }}>{children}</h2>;
}

export function H3({ children }) {
  return <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginTop: 24, marginBottom: 8 }}>{children}</h3>;
}

export function P({ children }) {
  return <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 16 }}>{children}</p>;
}

export function Tip({ children }) {
  return (
    <div style={{ background: "rgba(53,208,178,0.08)", border: "1px solid rgba(53,208,178,0.25)", borderRadius: 10, padding: "14px 18px", marginBottom: 16 }}>
      <p style={{ fontSize: 14, color: "#0f766e", lineHeight: 1.6, margin: 0 }}>
        <strong>Tip:</strong> {children}
      </p>
    </div>
  );
}

export function Warning({ children }) {
  return (
    <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "14px 18px", marginBottom: 16 }}>
      <p style={{ fontSize: 14, color: "#92400e", lineHeight: 1.6, margin: 0 }}>
        <strong>Note:</strong> {children}
      </p>
    </div>
  );
}

export function Table({ headers, rows }) {
  return (
    <div style={{ overflowX: "auto", marginBottom: 20 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ background: "#f8fafc" }}>
            {headers.map((h) => (
              <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, color: "#374151", borderBottom: "2px solid #e8ecf0", whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "10px 14px", color: "#374151" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BlogLayout;