import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CALCULATORS from "../../data/calculators";
import theme from "../../utils/theme";

function Footer() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <footer style={{
      background: theme.navy,
      color: theme.grayMuted,
      fontFamily: "'Poppins', sans-serif",
      borderTop: `1px solid ${theme.border}`,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "40px 16px 24px" : "56px 24px 40px" }}>

        {/* Main grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1.8fr 1fr 1fr 1fr",
          gap: isMobile ? 32 : 40,
          marginBottom: 40,
        }}>

          {/* Brand column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 32, height: 32, borderRadius: theme.radius.sm,
                background: theme.teal, display: "flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke={theme.navy} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: theme.fontWeight.bold, fontSize: theme.fontSize.md, letterSpacing: "-0.5px", lineHeight: theme.lineHeight.tight }}>
                  <span style={{ color: theme.white }}>Baazar</span>
                  <span style={{ color: theme.teal }}>IQ</span>
                </div>
                <div style={{ fontSize: theme.fontSize.xs, color: theme.grayMuted, letterSpacing: "0.8px", fontWeight: theme.fontWeight.semibold, textTransform: "uppercase" }}>
                  Seller Tools
                </div>
              </div>
            </div>

            <p style={{ fontSize: theme.fontSize.sm, lineHeight: theme.lineHeight.relaxed, color: theme.grayLight, marginBottom: 20, maxWidth: 260 }}>
              Free professional tools for ecommerce sellers across Amazon,
              Flipkart, Meesho, and Jiomart. Built for Indian sellers.
            </p>

            {/* Newsletter */}
            <div style={{ marginBottom: 20 }}>
              <div style={{
                fontSize: theme.fontSize.xs, fontWeight: theme.fontWeight.semibold,
                color: theme.grayMuted, marginBottom: 8,
                textTransform: "uppercase", letterSpacing: "0.5px",
              }}>Get tool updates</div>
              <div style={{ display: "flex", gap: 6 }}>
                <input type="email" placeholder="your@email.com" style={{
                  flex: 1, padding: "9px 12px",
                  background: theme.navyLight, border: `1px solid ${theme.border}`,
                  borderRadius: theme.radius.sm, color: theme.white,
                  fontSize: theme.fontSize.sm, outline: "none",
                  fontFamily: "'Poppins', sans-serif", minWidth: 0,
                }} />
                <button style={{
                  background: theme.teal, color: theme.navy, border: "none",
                  padding: "9px 14px", borderRadius: theme.radius.sm,
                  fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.bold,
                  cursor: "pointer", fontFamily: "'Poppins', sans-serif", whiteSpace: "nowrap",
                }}>Subscribe</button>
              </div>
            </div>

            {/* Social links */}
            <div style={{ display: "flex", gap: 8 }}>
              {[{ icon: "f", label: "Facebook" }, { icon: "in", label: "LinkedIn" }, { icon: "tw", label: "Twitter" }, { icon: "yt", label: "YouTube" }].map((s) => (
                <div key={s.label} title={s.label} style={{
                  width: 32, height: 32, borderRadius: theme.radius.sm,
                  background: theme.navyLight, border: `1px solid ${theme.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", fontSize: theme.fontSize.xs,
                  fontWeight: theme.fontWeight.bold, color: theme.grayMuted, transition: "all 0.15s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = theme.teal; e.currentTarget.style.color = theme.navy; e.currentTarget.style.borderColor = theme.teal; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = theme.navyLight; e.currentTarget.style.color = theme.grayMuted; e.currentTarget.style.borderColor = theme.border; }}
                >{s.icon}</div>
              ))}
            </div>
          </div>

          {/* Mobile: tools in 2 columns */}
          {isMobile ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <h4 style={{ color: theme.white, fontWeight: theme.fontWeight.bold, marginBottom: 12, fontSize: theme.fontSize.xs, textTransform: "uppercase", letterSpacing: "0.6px" }}>
                  Quick Tools
                </h4>
                {CALCULATORS.slice(0, 4).map((c) => (
                  <button key={c.id} onClick={() => navigate(c.href)} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "none", border: "none", color: theme.grayLight,
                    fontSize: theme.fontSize.xs, padding: "5px 0", cursor: "pointer",
                    textAlign: "left", fontFamily: "'Poppins', sans-serif",
                    transition: "color 0.15s", width: "100%",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = theme.teal)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = theme.grayLight)}
                  >
                    <span style={{ fontSize: 14 }}>{c.icon}</span>
                    <span style={{ fontSize: theme.fontSize.xs }}>{c.name}</span>
                  </button>
                ))}
              </div>
              <div>
                <h4 style={{ color: theme.white, fontWeight: theme.fontWeight.bold, marginBottom: 12, fontSize: theme.fontSize.xs, textTransform: "uppercase", letterSpacing: "0.6px" }}>
                  More Tools
                </h4>
                {CALCULATORS.slice(4).map((c) => (
                  <button key={c.id} onClick={() => navigate(c.href)} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "none", border: "none", color: theme.grayLight,
                    fontSize: theme.fontSize.xs, padding: "5px 0", cursor: "pointer",
                    textAlign: "left", fontFamily: "'Poppins', sans-serif",
                    transition: "color 0.15s", width: "100%",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = theme.teal)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = theme.grayLight)}
                  >
                    <span style={{ fontSize: 14 }}>{c.icon}</span>
                    <span style={{ fontSize: theme.fontSize.xs }}>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Quick Tools Desktop */}
              <div>
                <h4 style={{ color: theme.white, fontWeight: theme.fontWeight.bold, marginBottom: 16, fontSize: theme.fontSize.xs, textTransform: "uppercase", letterSpacing: "0.6px" }}>
                  Quick Tools
                </h4>
                {CALCULATORS.slice(0, 4).map((c) => (
                  <button key={c.id} onClick={() => navigate(c.href)} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "none", border: "none", color: theme.grayLight,
                    fontSize: theme.fontSize.sm, padding: "5px 0", cursor: "pointer",
                    textAlign: "left", fontFamily: "'Poppins', sans-serif",
                    transition: "color 0.15s", width: "100%",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = theme.teal)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = theme.grayLight)}
                  >
                    <span style={{ fontSize: 14 }}>{c.icon}</span>
                    {c.name}
                  </button>
                ))}
              </div>

              {/* More Tools Desktop */}
              <div>
                <h4 style={{ color: theme.white, fontWeight: theme.fontWeight.bold, marginBottom: 16, fontSize: theme.fontSize.xs, textTransform: "uppercase", letterSpacing: "0.6px" }}>
                  More Tools
                </h4>
                {CALCULATORS.slice(4).map((c) => (
                  <button key={c.id} onClick={() => navigate(c.href)} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "none", border: "none", color: theme.grayLight,
                    fontSize: theme.fontSize.sm, padding: "5px 0", cursor: "pointer",
                    textAlign: "left", fontFamily: "'Poppins', sans-serif",
                    transition: "color 0.15s", width: "100%",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = theme.teal)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = theme.grayLight)}
                  >
                    <span style={{ fontSize: 14 }}>{c.icon}</span>
                    {c.name}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Company */}
          <div>
            <h4 style={{ color: theme.white, fontWeight: theme.fontWeight.bold, marginBottom: 16, fontSize: theme.fontSize.xs, textTransform: "uppercase", letterSpacing: "0.6px" }}>
              Company
            </h4>
            {["About Us", "Contact Us", "Privacy Policy", "Terms of Service", "Careers"].map((l) => (
              <div key={l} style={{
                color: theme.grayLight, fontSize: theme.fontSize.sm,
                padding: "5px 0", cursor: "pointer", transition: "color 0.15s",
              }}
                onMouseEnter={(e) => (e.target.style.color = theme.teal)}
                onMouseLeave={(e) => (e.target.style.color = theme.grayLight)}
              >{l}</div>
            ))}
            <div onClick={() => navigate("/blog")} style={{
              color: theme.teal, fontSize: theme.fontSize.sm,
              padding: "5px 0", cursor: "pointer", fontWeight: theme.fontWeight.semibold,
            }}>Blog</div>

            <div style={{ marginTop: 20 }}>
              <h4 style={{ color: theme.white, fontWeight: theme.fontWeight.bold, marginBottom: 12, fontSize: theme.fontSize.xs, textTransform: "uppercase", letterSpacing: "0.6px" }}>
                Contact
              </h4>
              <div style={{ fontSize: theme.fontSize.sm, color: theme.grayLight, lineHeight: theme.lineHeight.relaxed }}>
                <div>hello@baazariq.in</div>
                <div>+91 98765 43210</div>
                <div>Noida, India</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{
          background: theme.navyLight, border: `1px solid ${theme.border}`,
          borderRadius: theme.radius.md, padding: isMobile ? "16px" : "20px 28px",
          display: "flex", justifyContent: "space-around",
          flexWrap: "wrap", gap: 16, marginBottom: 32,
        }}>
          {[["8+", "Free Tools Available"], ["100%", "No Sign-up Required"], ["4", "Marketplaces Covered"], ["Real-time", "Live Calculations"], ["Rs.0", "Always Free"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: isMobile ? theme.fontSize.md : theme.fontSize.xl, fontWeight: theme.fontWeight.extrabold, color: theme.teal, marginBottom: 2 }}>{n}</div>
              <div style={{ fontSize: theme.fontSize.xs, color: theme.grayMuted }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: `1px solid ${theme.border}`, paddingTop: 20,
          display: "flex", flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          gap: 12,
        }}>
          <p style={{ fontSize: theme.fontSize.sm, color: theme.grayMuted }}>2025 BaazarIQ. All rights reserved.</p>
          <div style={{ display: "flex", gap: isMobile ? 12 : 20, flexWrap: "wrap" }}>
            {["Privacy Policy", "Terms of Service", "Sitemap"].map((l) => (
              <span key={l} style={{ fontSize: theme.fontSize.xs, color: theme.grayMuted, cursor: "pointer", transition: "color 0.15s" }}
                onMouseEnter={(e) => (e.target.style.color = theme.teal)}
                onMouseLeave={(e) => (e.target.style.color = theme.grayMuted)}
              >{l}</span>
            ))}
          </div>
          <p style={{ fontSize: theme.fontSize.sm, color: theme.grayMuted }}>Made with love for Indian sellers</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;