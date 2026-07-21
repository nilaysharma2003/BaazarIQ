import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CALCULATORS from "../../data/calculators";
import theme from "../../utils/theme";

function Logo() {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
    </span>
  );
}

function Header() {
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100,
      background: theme.navy,
      borderBottom: `1px solid ${theme.border}`,
      fontFamily: "'Poppins', sans-serif",
    }}>
      {/* Announcement bar */}
      <div style={{
        background: theme.teal, padding: "7px 24px",
        textAlign: "center", fontSize: theme.fontSize.xs,
        color: theme.navy, fontWeight: theme.fontWeight.semibold, letterSpacing: "0.2px",
      }}>
        BaazarIQ is 100% free - No sign-up required. Start calculating now!
      </div>

      {/* Main nav */}
      <div style={{
        maxWidth: 1200, margin: "0 auto", height: 62,
        display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 24px",
      }}>
        {/* Logo */}
        <button onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <Logo />
        </button>

        {/* Desktop Nav */}
        {!isMobile && (
          <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <button onClick={() => navigate("/")} style={{
              background: currentPath === "/" ? "rgba(53,208,178,0.15)" : "none",
              color: currentPath === "/" ? theme.teal : theme.grayMuted,
              border: "none", padding: "7px 14px", borderRadius: theme.radius.sm,
              fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.medium,
              cursor: "pointer", fontFamily: "'Poppins', sans-serif", transition: "all 0.15s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = theme.white)}
              onMouseLeave={(e) => (e.currentTarget.style.color = currentPath === "/" ? theme.teal : theme.grayMuted)}
            >Home</button>

            {/* Dropdown */}
            <div style={{ position: "relative" }}
              onMouseEnter={() => setDropOpen(true)}
              onMouseLeave={(e) => {
                try {
                  if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) setDropOpen(false);
                } catch { setDropOpen(false); }
              }}>
              <button style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "none", color: theme.grayMuted, border: "none",
                padding: "7px 14px", borderRadius: theme.radius.sm,
                fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.medium,
                cursor: "pointer", fontFamily: "'Poppins', sans-serif", transition: "all 0.15s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.color = theme.white)}
                onMouseLeave={(e) => (e.currentTarget.style.color = theme.grayMuted)}
              >
                All Tools
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  style={{ transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {dropOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 0px)", left: "50%",
                  transform: "translateX(-50%)", background: theme.navyLight,
                  border: `1px solid ${theme.border}`, borderRadius: theme.radius.md,
                  padding: "8px", width: 320,
                  boxShadow: theme.shadow.lg, zIndex: 200,
                }}>
                  <div style={{
                    fontSize: theme.fontSize.xs, fontWeight: theme.fontWeight.semibold,
                    color: theme.grayMuted, letterSpacing: "0.6px", textTransform: "uppercase",
                    padding: "6px 10px", marginBottom: 4,
                  }}>All Seller Tools</div>
                  {CALCULATORS.map((c) => (
                    <button key={c.id} onClick={() => { navigate(c.href); setDropOpen(false); }} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      width: "100%", padding: "9px 10px", border: "none",
                      background: currentPath === c.href ? "rgba(53,208,178,0.1)" : "transparent",
                      borderRadius: theme.radius.sm, cursor: "pointer", textAlign: "left",
                      fontFamily: "'Poppins', sans-serif", transition: "background 0.15s",
                    }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(53,208,178,0.08)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = currentPath === c.href ? "rgba(53,208,178,0.1)" : "transparent")}
                    >
                      <div style={{
                        width: 34, height: 34, borderRadius: theme.radius.sm,
                        background: "rgba(53,208,178,0.1)", display: "flex",
                        alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0,
                      }}>{c.icon}</div>
                      <div>
                        <div style={{ fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.semibold, color: theme.white }}>{c.name}</div>
                        <div style={{ fontSize: theme.fontSize.xs, color: theme.grayMuted }}>{c.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        )}

        {/* Desktop Right side */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "rgba(53,208,178,0.1)",
              border: `1px solid rgba(53,208,178,0.3)`,
              borderRadius: theme.radius.full, padding: "4px 12px",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: theme.teal }} />
              <span style={{ fontSize: theme.fontSize.xs, fontWeight: theme.fontWeight.semibold, color: theme.teal }}>8 Free Tools</span>
            </div>
            <button onClick={() => navigate("/fba")} style={{
              background: theme.teal, color: theme.navy, border: "none",
              padding: "9px 18px", borderRadius: theme.radius.sm,
              fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.bold,
              cursor: "pointer", fontFamily: "'Poppins', sans-serif",
              display: "flex", alignItems: "center", gap: 6,
            }}>Try FBA Calc</button>
          </div>
        )}

        {/* Mobile Hamburger */}
        {isMobile && (
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{
            background: "none", border: "none", cursor: "pointer",
            color: theme.white, padding: 8, display: "flex",
            flexDirection: "column", gap: 5, alignItems: "center",
          }}>
            <div style={{
              width: 22, height: 2, background: mobileMenuOpen ? theme.teal : theme.white,
              borderRadius: 2, transition: "all 0.2s",
              transform: mobileMenuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
            }} />
            <div style={{
              width: 22, height: 2, background: mobileMenuOpen ? "transparent" : theme.white,
              borderRadius: 2, transition: "all 0.2s",
            }} />
            <div style={{
              width: 22, height: 2, background: mobileMenuOpen ? theme.teal : theme.white,
              borderRadius: 2, transition: "all 0.2s",
              transform: mobileMenuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
            }} />
          </button>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobile && mobileMenuOpen && (
        <div style={{
          position: "fixed", top: 96, left: 0, right: 0, bottom: 0,
          background: theme.navyLight, borderTop: `1px solid ${theme.border}`,
          padding: "16px 24px", display: "flex", flexDirection: "column", gap: 4,
          overflowY: "auto", WebkitOverflowScrolling: "touch", zIndex: 99,
        }}>
          <button onClick={() => navigate("/")} style={{
            background: currentPath === "/" ? "rgba(53,208,178,0.15)" : "none",
            color: currentPath === "/" ? theme.teal : theme.white,
            border: "none", padding: "12px 16px", borderRadius: theme.radius.sm,
            fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold,
            cursor: "pointer", fontFamily: "'Poppins', sans-serif", textAlign: "left",
          }}>Home</button>

          <div style={{
            fontSize: theme.fontSize.xs, fontWeight: theme.fontWeight.semibold,
            color: theme.grayMuted, letterSpacing: "0.6px", textTransform: "uppercase",
            padding: "10px 16px 4px",
          }}>All Tools</div>

          {CALCULATORS.map((c) => (
            <button key={c.id} onClick={() => navigate(c.href)} style={{
              display: "flex", alignItems: "center", gap: 10,
              background: currentPath === c.href ? "rgba(53,208,178,0.1)" : "transparent",
              border: "none", padding: "10px 16px", borderRadius: theme.radius.sm,
              cursor: "pointer", textAlign: "left", fontFamily: "'Poppins', sans-serif",
            }}>
              <span style={{ fontSize: 18 }}>{c.icon}</span>
              <div>
                <div style={{ fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.semibold, color: theme.white }}>{c.name}</div>
                <div style={{ fontSize: theme.fontSize.xs, color: theme.grayMuted }}>{c.desc}</div>
              </div>
            </button>
          ))}

          <button onClick={() => navigate("/fba")} style={{
            background: theme.teal, color: theme.navy, border: "none",
            padding: "12px 16px", borderRadius: theme.radius.md,
            fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.bold,
            cursor: "pointer", fontFamily: "'Poppins', sans-serif", marginTop: 8,
          }}>Try FBA Calculator</button>
        </div>
      )}
    </header>
  );
}

export default Header;