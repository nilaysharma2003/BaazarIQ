import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CALCULATORS from "../../data/calculators";
import theme from "../../utils/theme";

function Logo() {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: theme.teal,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={theme.navy}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      </div>
      <div>
        <div
          style={{
            fontWeight: 700,
            fontSize: 17,
            letterSpacing: "-0.5px",
            lineHeight: 1.1,
          }}
        >
          <span style={{ color: "#ffffff"  }}>Baazar</span>
          <span style={{ color: theme.teal }}>IQ</span>
        </div>
        <div
          style={{
            fontSize: 9,
            color: theme.grayMuted,
            letterSpacing: "0.8px",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          Seller Tools
        </div>
      </div>
    </span>
  );
}

function Header() {
  const [dropOpen, setDropOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: theme.navy,
        borderBottom: `1px solid ${theme.border}`,
        fontFamily: "'Plus Poppins', sans-serif",
      }}
    >
      {/* Top announcement bar */}
      <div
        style={{
          background: theme.teal,
          padding: "7px 24px",
          textAlign: "center",
          fontSize: 12,
          color: theme.navy,
          fontWeight: 600,
          letterSpacing: "0.2px",
        }}
      >
        🎉 BaazarIQ is 100% free — No sign-up required. Start calculating now!
      </div>

      {/* Main nav */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          height: 62,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
        }}
      >
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <Logo />
        </button>

        {/* Nav links */}
        <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background:
                currentPath === "/" ? "rgba(53,208,178,0.15)" : "none",
              color: currentPath === "/" ? theme.teal : theme.grayMuted,
              border: "none",
              padding: "7px 14px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "'Plus Poppins', sans-serif",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = theme.white)}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color =
                currentPath === "/" ? theme.teal : theme.grayMuted)
            }
          >
            Home
          </button>

          {/* Dropdown */}
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => setDropOpen(true)}
            onMouseLeave={(e) => {
              try {
                if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
                  setDropOpen(false);
                }
              } catch {
                setDropOpen(false);
              }
            }}
          >
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: "none",
                color: theme.grayMuted,
                border: "none",
                padding: "7px 14px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "'Plus Poppins', sans-serif",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = theme.white)}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = theme.grayMuted)
              }
            >
              All Tools
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                style={{
                  transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {dropOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 0px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: theme.navyLight,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 14,
                  padding: "8px",
                  width: 320,
                  boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
                  zIndex: 200,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: theme.grayMuted,
                    letterSpacing: "0.6px",
                    textTransform: "uppercase",
                    padding: "6px 10px",
                    marginBottom: 4,
                  }}
                >
                  All Seller Tools
                </div>
                {CALCULATORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      navigate(c.href);
                      setDropOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      padding: "9px 10px",
                      border: "none",
                      background:
                        currentPath === c.href
                          ? "rgba(53,208,178,0.1)"
                          : "transparent",
                      borderRadius: 8,
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "'Plus Poppins', sans-serif",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(53,208,178,0.08)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        currentPath === c.href
                          ? "rgba(53,208,178,0.1)"
                          : "transparent")
                    }
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        background: "rgba(53,208,178,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        flexShrink: 0,
                      }}
                    >
                      {c.icon}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: theme.white,
                        }}
                      >
                        {c.name}
                      </div>
                      <div style={{ fontSize: 11, color: theme.grayMuted }}>
                        {c.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {["Resources", "Blog"].map((label) => (
            <button
              key={label}
              style={{
                background: "none",
                color: theme.grayMuted,
                border: "none",
                padding: "7px 14px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "'Plus Poppins', sans-serif",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = theme.white)}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = theme.grayMuted)
              }
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "rgba(53,208,178,0.1)",
              border: `1px solid rgba(53,208,178,0.3)`,
              borderRadius: 100,
              padding: "4px 12px",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: theme.teal,
              }}
            />
            <span
              style={{ fontSize: 11, fontWeight: 600, color: theme.teal }}
            >
              8 Free Tools
            </span>
          </div>
          <button
            onClick={() => navigate("/fba")}
            style={{
              background: theme.teal,
              color: theme.navy,
              border: "none",
              padding: "9px 18px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Plus Poppins', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Try FBA Calc →
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;