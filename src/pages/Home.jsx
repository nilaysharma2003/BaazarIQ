import React, { useState, useEffect } from "react";
import theme from "../utils/theme";
import CALCULATORS from "../data/calculators";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ background: theme.navy }}>

      {/* Hero */}
      <section style={{
        background: theme.navy,
        padding: isMobile ? "48px 16px 48px" : "100px 24px 100px",
        borderBottom: `1px solid ${theme.border}`,
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 460px",
          gap: isMobile ? 32 : 56,
          alignItems: "center",
        }}>

          {/* Left */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              border: `1px solid ${theme.border}`, borderRadius: 100,
              padding: "5px 14px", marginBottom: 24,
              background: "rgba(53,208,178,0.08)",
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: theme.teal }} />
              <span style={{ fontSize: 12, color: theme.teal, fontWeight: 500 }}>
                Built for Indian ecommerce sellers — 100% Free
              </span>
            </div>

            <h1 style={{
              fontSize: isMobile ? "32px" : "clamp(38px,5vw,60px)",
              fontWeight: 800, color: theme.white,
              lineHeight: 1.12, letterSpacing: "-1.5px", marginBottom: 20,
            }}>
              Free seller tools to
              <br />
              <span style={{ color: theme.teal }}>maximize your profits</span>
            </h1>

            <p style={{
              fontSize: isMobile ? 15 : 17, color: theme.grayMuted,
              lineHeight: 1.75, marginBottom: 24, maxWidth: 500,
            }}>
              Professional-grade calculators for Amazon, Flipkart, Meesho and
              more. Calculate FBA fees, compare marketplace commissions,
              estimate shipping costs — all in one place, completely free.
            </p>

            {/* Feature bullets */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
              {[
                "Real-time calculations as you type",
                "AI-powered insights and recommendations",
                "Compare across 4 major Indian marketplaces",
                "No sign-up, no credit card, always free",
              ].map((text) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%",
                    background: "rgba(53,208,178,0.15)",
                    border: `1px solid rgba(53,208,178,0.3)`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                      stroke={theme.teal} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span style={{ fontSize: 14, color: theme.grayMuted }}>{text}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
              <button onClick={() => navigate("/fba")} style={{
                background: theme.teal, color: theme.navy, border: "none",
                padding: isMobile ? "12px 20px" : "13px 24px",
                borderRadius: 10, fontSize: isMobile ? 14 : 15, fontWeight: 700,
                cursor: "pointer", fontFamily: "'Poppins', sans-serif",
                display: "flex", alignItems: "center", gap: 8,
                width: isMobile ? "100%" : "auto", justifyContent: "center",
              }}>📦 Try FBA Calculator →</button>
              <button onClick={() => document.getElementById("tools-grid").scrollIntoView({ behavior: "smooth" })} style={{
                background: "transparent", color: theme.white,
                border: `1.5px solid ${theme.border}`,
                padding: isMobile ? "12px 20px" : "13px 24px",
                borderRadius: 10, fontSize: isMobile ? 14 : 15, fontWeight: 600,
                cursor: "pointer", fontFamily: "'Poppins', sans-serif",
                width: isMobile ? "100%" : "auto", textAlign: "center",
              }}>View All Tools ↓</button>
            </div>

            {/* Trust stats */}
            <div style={{
              display: "flex", gap: 0, paddingTop: 24,
              borderTop: `1px solid ${theme.border}`, flexWrap: "wrap",
            }}>
              {[["8+", "Free Tools"], ["4", "Marketplaces"], ["100%", "No Sign-up"], ["₹0", "Always Free"]].map(([n, l], i) => (
                <div key={l} style={{
                  textAlign: "center", padding: isMobile ? "0 12px" : "0 24px",
                  borderRight: i < 3 ? `1px solid ${theme.border}` : "none",
                }}>
                  <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: theme.teal, marginBottom: 2 }}>{n}</div>
                  <div style={{ fontSize: 12, color: theme.grayMuted, fontWeight: 500 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Tool preview — hidden on mobile */}
          {!isMobile && (
            <div style={{
              background: theme.navyLight, border: `1px solid ${theme.border}`,
              borderRadius: 20, padding: "24px",
            }}>
              <div style={{
                fontSize: 11, fontWeight: 700, color: theme.grayMuted,
                letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 16,
              }}>Available Tools</div>
              {CALCULATORS.slice(0, 6).map((c) => (
                <button key={c.id} onClick={() => navigate(c.href)} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  width: "100%", padding: "11px 12px",
                  background: theme.navyMid, border: `1px solid ${theme.border}`,
                  borderRadius: 10, cursor: "pointer", textAlign: "left",
                  marginBottom: 8, fontFamily: "'Poppins', sans-serif", transition: "all 0.15s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.teal; e.currentTarget.style.background = "rgba(53,208,178,0.08)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.background = theme.navyMid; }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: "rgba(53,208,178,0.1)", display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
                  }}>{c.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: theme.white, marginBottom: 1 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: theme.grayMuted }}>{c.desc}</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.grayMuted} strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ))}
              <button onClick={() => document.getElementById("tools-grid").scrollIntoView({ behavior: "smooth" })} style={{
                width: "100%", padding: "11px", background: theme.teal,
                color: theme.navy, border: "none", borderRadius: 10,
                fontSize: 13, fontWeight: 700, cursor: "pointer",
                fontFamily: "'Poppins', sans-serif", marginTop: 4,
              }}>View All 8 Tools →</button>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: "#ffffff", padding: isMobile ? "40px 16px" : "64px 24px", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: isMobile ? 32 : 48 }}>
            <h2 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.8px", marginBottom: 12 }}>
              How BaazarIQ Works
            </h2>
            <p style={{ color: theme.grayMuted, fontSize: 16, maxWidth: 480, margin: "0 auto" }}>
              Three simple steps to maximize your ecommerce profits
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fit,minmax(240px,1fr))", gap: isMobile ? 16 : 24 }}>
            {[
              { step: "01", icon: "📋", title: "Enter Product Details", desc: "Add your selling price, product cost, weight and category. Our calculator accepts all Amazon and marketplace inputs." },
              { step: "02", icon: "⚙️", title: "Auto Calculate Fees", desc: "BaazarIQ instantly calculates referral fees, closing fees, shipping charges, GST and all hidden costs." },
              { step: "03", icon: "🤖", title: "Get AI Insights", desc: "Receive smart recommendations to improve your margin, choose the right platform and optimize your pricing." },
              { step: "04", icon: "📈", title: "Scale Your Business", desc: "Use profit data to make smarter sourcing, pricing and platform decisions that grow your ecommerce business." },
            ].map((item) => (
              <div key={item.step} style={{
                background: "#ffffff", border: "1px solid #e2e8f0",
                borderRadius: 16, padding: isMobile ? "18px" : "28px",
                position: "relative", transition: "all 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.teal; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 24px rgba(53,208,178,0.1)`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ position: "absolute", top: 16, right: 16, fontSize: 11, fontWeight: 800, color: theme.teal, opacity: 0.3, letterSpacing: "1px" }}>{item.step}</div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: theme.teal, border: `1px solid ${theme.tealDark}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: isMobile ? 14 : 16, color: "#0f172a", marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: theme.grayMuted, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section id="tools-grid" style={{ padding: isMobile ? "40px 16px" : "64px 24px", background: theme.navy, borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: isMobile ? 32 : 48 }}>
            <h2 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 800, color: theme.white, letterSpacing: "-0.8px", marginBottom: 12 }}>
              All Seller Tools
            </h2>
            <p style={{ color: theme.grayMuted, fontSize: 16 }}>Professional-grade utilities — no login, no cost, no catch.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill,minmax(280px,1fr))", gap: isMobile ? 12 : 20 }}>
            {CALCULATORS.map((c) => (
              <button key={c.id} onClick={() => navigate(c.href)} style={{
                background: theme.navyLight, border: `1px solid ${theme.border}`,
                borderRadius: 16, padding: isMobile ? "16px" : "24px",
                textAlign: "left", cursor: "pointer", transition: "all 0.2s",
                display: "flex", flexDirection: "column", gap: 12,
                fontFamily: "'Poppins', sans-serif",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.teal; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(53,208,178,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(53,208,178,0.1)", border: `1px solid rgba(53,208,178,0.15)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{c.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: isMobile ? 13 : 15, marginBottom: 5, color: theme.white }}>{c.name}</div>
                  {!isMobile && <div style={{ fontSize: 13, color: theme.grayMuted, lineHeight: 1.55 }}>{c.desc}</div>}
                </div>
                <div style={{ color: theme.teal, fontSize: 13, fontWeight: 700, marginTop: "auto" }}>Open Tool →</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Why BaazarIQ */}
      <section style={{ background: "#ffffff", padding: isMobile ? "40px 16px" : "64px 24px", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: isMobile ? 32 : 48 }}>
            <h2 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.8px", marginBottom: 12 }}>
              Why Sellers Choose BaazarIQ
            </h2>
            <p style={{ color: theme.grayMuted, fontSize: 16 }}>Built specifically for the Indian ecommerce market</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fit,minmax(200px,1fr))", gap: isMobile ? 12 : 20 }}>
            {[
              { icon: "⚡", title: "Real-time", desc: "Calculations update instantly as you type — no submit button needed" },
              { icon: "🤖", title: "AI Powered", desc: "Smart recommendations to improve your margins and platform choice" },
              { icon: "🆓", title: "Always Free", desc: "No hidden charges, no premium plans, no credit card required" },
              { icon: "🇮🇳", title: "India First", desc: "Built for Amazon.in, Flipkart, Meesho and Jiomart specifically" },
              { icon: "📊", title: "Data Driven", desc: "Compare platforms with charts and detailed breakdowns" },
              { icon: "🔒", title: "No Sign-up", desc: "Start using immediately — no account or registration needed" },
            ].map((item) => (
              <div key={item.title} style={{
                background: "#ffffff", border: "1px solid #e2e8f0",
                borderRadius: 14, padding: isMobile ? "16px" : "24px",
                textAlign: "center", transition: "all 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.teal; e.currentTarget.style.boxShadow = "0 4px 16px rgba(53,208,178,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: theme.teal, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, margin: "0 auto 12px" }}>{item.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: isMobile ? 13 : 15, color: "#0f172a", marginBottom: 8 }}>{item.title}</h3>
                {!isMobile && <p style={{ fontSize: 13, color: theme.grayMuted, lineHeight: 1.6 }}>{item.desc}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: theme.teal, padding: isMobile ? "40px 16px" : "64px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 800, color: theme.navy, marginBottom: 12, letterSpacing: "-0.5px" }}>
            Start Calculating for Free
          </h2>
          <p style={{ color: theme.navyMid, fontSize: isMobile ? 14 : 16, marginBottom: 28, lineHeight: 1.6 }}>
            Join thousands of Indian sellers who use BaazarIQ to make smarter pricing decisions every day.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/fba")} style={{
              background: theme.navy, color: theme.white, border: "none",
              padding: isMobile ? "12px 20px" : "13px 28px",
              borderRadius: 10, fontSize: isMobile ? 14 : 15, fontWeight: 700,
              cursor: "pointer", fontFamily: "'Poppins', sans-serif",
              width: isMobile ? "100%" : "auto",
            }}>📦 Amazon FBA Calculator</button>
            <button onClick={() => navigate("/commission")} style={{
              background: "rgba(3,10,16,0.2)", color: theme.navy,
              border: `1.5px solid rgba(3,10,16,0.3)`,
              padding: isMobile ? "12px 20px" : "13px 28px",
              borderRadius: 10, fontSize: isMobile ? 14 : 15, fontWeight: 600,
              cursor: "pointer", fontFamily: "'Poppins', sans-serif",
              width: isMobile ? "100%" : "auto",
            }}>💸 Compare Marketplaces</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;