import React from "react";
import { useNavigate } from "react-router-dom";
import theme from "../../utils/theme";

const BLOGS = [
  {
    href: "/blog/amazon-fba-fees",
    icon: "📦",
    category: "Amazon FBA",
    title: "How to Calculate Amazon FBA Fees in India",
    desc: "A complete guide to understanding Amazon FBA referral fees, closing fees, shipping charges and GST for Indian sellers.",
    readTime: "8 min read",
    color: "#f97316",
    bg: "#fff7ed",
  },
  {
    href: "/blog/best-marketplace-india",
    icon: "🏪",
    category: "Marketplace",
    title: "Best Marketplace for Indian Sellers in 2025",
    desc: "A detailed comparison of Amazon, Flipkart, Meesho and Jiomart to help you choose the right platform for your products.",
    readTime: "10 min read",
    color: "#2563eb",
    bg: "#eff6ff",
  },
  {
    href: "/blog/reduce-shipping-costs",
    icon: "🚚",
    category: "Shipping",
    title: "How to Reduce Shipping Costs for Ecommerce in India",
    desc: "Practical strategies to cut shipping expenses and improve profit margins for Indian ecommerce sellers.",
    readTime: "7 min read",
    color: "#35d0b2",
    bg: "#f0fdfa",
  },
  {
    href: "/blog/gst-ecommerce-india",
    icon: "🧾",
    category: "GST and Tax",
    title: "GST for Ecommerce Sellers in India - Complete Guide",
    desc: "Everything Indian ecommerce sellers need to know about GST registration, rates, filing and how it affects your profit.",
    readTime: "9 min read",
    color: "#7c3aed",
    bg: "#faf5ff",
  },
  {
    href: "/blog/barcode-guide",
    icon: "📊",
    category: "Barcode",
    title: "How to Generate Barcodes for Amazon and Flipkart Products",
    desc: "A complete guide to barcode types, requirements and how to generate free barcodes for your ecommerce listings.",
    readTime: "7 min read",
    color: "#0891b2",
    bg: "#ecfeff",
  },
  {
    href: "/blog/utm-tracking-guide",
    icon: "🔗",
    category: "Marketing",
    title: "UTM Tracking Guide for Ecommerce Sellers in India",
    desc: "Learn how to use UTM parameters to track which marketing channels drive the most sales for your ecommerce store.",
    readTime: "8 min read",
    color: "#16a34a",
    bg: "#f0fdf4",
  },
];

function BlogIndex() {
  const navigate = useNavigate();

  return (
    <div style={{ background: "#f1f5f9", minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>

      {/* Hero */}
      <section style={{
        background: theme.navy, padding: "100px 24px 110px",
        textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(ellipse at 30% 50%, rgba(53,208,178,0.12) 0%,transparent 60%),radial-gradient(ellipse at 70% 50%, rgba(37,99,235,0.08) 0%,transparent 60%)",
        }} />
        <div style={{ position: "relative", maxWidth: 800, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(53,208,178,0.1)", border: "1px solid rgba(53,208,178,0.2)",
            borderRadius: theme.radius.full, padding: "6px 18px", marginBottom: 20,
          }}>
            <span style={{ fontSize: 16 }}>📝</span>
            <span style={{ color: theme.teal, fontSize: theme.fontSize.xs, fontWeight: theme.fontWeight.semibold }}>
              Free Ecommerce Guides
            </span>
          </div>
          <p style={{ color: "#35d0b2", fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
            Seller Knowledge Base for Indian Ecommerce
          </p>
          <h1 style={{
            fontSize: "clamp(42px, 6vw, 72px)", fontWeight: 900,
            letterSpacing: "-2px", lineHeight: 1.1, color: "#f8fafc", marginBottom: 20,
          }}>
            BaazarIQ Blog
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 18, maxWidth: 580, margin: "0 auto 16px", lineHeight: 1.75 }}>
            Free guides, tips and strategies to help Indian ecommerce sellers
            maximize profits on Amazon, Flipkart, Meesho and Jiomart.
          </p>
          <p style={{ color: "#64748b", fontSize: 15, maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.7 }}>
            No sign-up required. All content is free forever.
          </p>
          <div style={{
            display: "flex", justifyContent: "center", gap: 0, flexWrap: "wrap",
            borderTop: "1px solid rgba(53,208,178,0.15)", paddingTop: 28,
          }}>
            {[
              ["6 Guides", "Free Forever"],
              ["Expert Tips", "Verified Info"],
              ["Updated", "2025"],
              ["Free Tools", "Included"],
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

      {/* Blog Grid */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 64px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
          {BLOGS.map((blog) => (
            <div key={blog.href} onClick={() => navigate(blog.href)} style={{
              background: "#fff", borderRadius: 16,
              border: "1px solid #e8ecf0", overflow: "hidden",
              cursor: "pointer", transition: "all 0.2s",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)"; e.currentTarget.style.borderColor = blog.color; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor = "#e8ecf0"; }}
            >
              {/* Card top color bar */}
              <div style={{ height: 4, background: blog.color }} />

              <div style={{ padding: "24px" }}>
                {/* Icon + Category */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: blog.bg, display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0,
                  }}>{blog.icon}</div>
                  <div>
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: blog.color,
                      textTransform: "uppercase", letterSpacing: "0.5px",
                    }}>{blog.category}</span>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{blog.readTime}</div>
                  </div>
                </div>

                {/* Title */}
                <h2 style={{
                  fontSize: 17, fontWeight: 700, color: "#0f172a",
                  marginBottom: 10, lineHeight: 1.4, letterSpacing: "-0.3px",
                }}>{blog.title}</h2>

                {/* Description */}
                <p style={{
                  fontSize: 13, color: "#64748b",
                  lineHeight: 1.65, marginBottom: 20,
                }}>{blog.desc}</p>

                {/* Read more */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  color: blog.color, fontSize: 13, fontWeight: 700,
                }}>
                  Read Guide
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          background: theme.navy, borderRadius: 16, padding: "40px",
          textAlign: "center", marginTop: 48,
          border: "1px solid rgba(53,208,178,0.2)",
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#f8fafc", marginBottom: 10 }}>
            Try Our Free Seller Tools
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 15, marginBottom: 24 }}>
            All tools are 100% free. No sign-up, no credit card, no catch.
          </p>
          <button onClick={() => navigate("/")} style={{
            background: theme.teal, color: theme.navy, border: "none",
            padding: "12px 28px", borderRadius: 10, fontSize: 15,
            fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins', sans-serif",
          }}>View All Free Tools</button>
        </div>
      </div>
    </div>
  );
}

export default BlogIndex;