import React, { useState, useEffect, useCallback } from "react";
import QRCode from "qrcode";

const COUNTRY_CODES = [
  { flag: "🇮🇳", name: "India", code: "+91" },
  { flag: "🇺🇸", name: "USA", code: "+1" },
  { flag: "🇬🇧", name: "UK", code: "+44" },
  { flag: "🇦🇪", name: "UAE", code: "+971" },
  { flag: "🇸🇬", name: "Singapore", code: "+65" },
  { flag: "🇦🇺", name: "Australia", code: "+61" },
  { flag: "🇨🇦", name: "Canada", code: "+1" },
  { flag: "🇩🇪", name: "Germany", code: "+49" },
  { flag: "🇫🇷", name: "France", code: "+33" },
  { flag: "🇧🇷", name: "Brazil", code: "+55" },
  { flag: "🇿🇦", name: "South Africa", code: "+27" },
  { flag: "🇳🇬", name: "Nigeria", code: "+234" },
  { flag: "🇯🇵", name: "Japan", code: "+81" },
  { flag: "🇨🇳", name: "China", code: "+86" },
  { flag: "🇷🇺", name: "Russia", code: "+7" },
];

const MESSAGE_TEMPLATES = [
  { id: "Custom", icon: "💬", label: "Custom Message", desc: "Write your own message", message: "" },
  { id: "Order", icon: "🛍️", label: "Order Inquiry", desc: "For product/order questions", message: "Hi! I'd like to inquire about your products. Can you help me?" },
  { id: "Support", icon: "🛠️", label: "Customer Support", desc: "For help & assistance", message: "Hi, I need help with my order. Can you assist me?" },
  { id: "Appointment", icon: "📅", label: "Appointment Booking", desc: "Book a time slot", message: "Hi! I'd like to book an appointment. What slots are available?" },
  { id: "Sales", icon: "💰", label: "Sales Inquiry", desc: "For pricing & offers", message: "Hi! I'm interested in your products/services. Can you share more details?" },
  { id: "Return", icon: "🔄", label: "Return / Refund", desc: "For returns & refunds", message: "Hi, I want to initiate a return for my recent order. Can you help?" },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #e8ecf0", paddingBottom: 14, marginBottom: 14 }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", background: "none", border: "none",
        display: "flex", justifyContent: "space-between",
        alignItems: "center", cursor: "pointer", textAlign: "left", gap: 8,
        fontFamily: "'Poppins', sans-serif",
      }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: "#0f172a" }}>{q}</span>
        <span style={{ fontSize: 18, color: "#94a3b8", transform: open ? "rotate(180deg)" : "", transition: "transform 0.2s", flexShrink: 0 }}>▾</span>
      </button>
      {open && <p style={{ fontSize: 14, color: "#64748b", marginTop: 10, lineHeight: 1.7 }}>{a}</p>}
    </div>
  );
}

function WhatsAppLinkGenerator() {
  const [inputs, setInputs] = useState({
    linkType: "Business",
    countryCode: "+91",
    phoneNumber: "",
    businessName: "",
    buttonLabel: "",
    messageTemplate: "Custom",
    message: "",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    groupName: "",
    multiMode: false,
    multiMessages: ["", "", "", "", ""],
  });
  const [copied, setCopied] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [utmExpanded, setUtmExpanded] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const set = useCallback((k, v) => {
    setInputs((prev) => {
      if (prev[k] === v) return prev;
      return { ...prev, [k]: v };
    });
  }, []);

  const generateLink = useCallback(() => {
    if (inputs.linkType === "Group") {
      const groupNameEncoded = encodeURIComponent(inputs.groupName || "MyGroup");
      return `https://chat.whatsapp.com/${groupNameEncoded}`;
    }
    const cleanNumber = inputs.countryCode.replace("+", "") + inputs.phoneNumber.replace(/\D/g, "");
    let url = `https://wa.me/${cleanNumber}`;
    const params = new URLSearchParams();
    if (inputs.message) params.append("text", inputs.message);
    if (inputs.utmSource) params.append("utm_source", inputs.utmSource);
    if (inputs.utmMedium) params.append("utm_medium", inputs.utmMedium);
    if (inputs.utmCampaign) params.append("utm_campaign", inputs.utmCampaign);
    const paramStr = params.toString();
    if (paramStr) url += "?" + paramStr;
    return url;
  }, [inputs]);

  const isValidPhone = inputs.linkType === "Group"
    ? !!inputs.groupName
    : inputs.phoneNumber.replace(/\D/g, "").length >= 10;

  useEffect(() => {
    if (isValidPhone) {
      QRCode.toDataURL(generateLink(), {
        width: 180, margin: 1,
        color: { dark: "#0f172a", light: "#ffffff" },
      }).then((url) => setQrDataUrl(url)).catch(() => {});
    } else {
      setQrDataUrl("");
    }
  }, [inputs, isValidPhone, generateLink]);

  const copyLink = () => {
    navigator.clipboard.writeText(generateLink()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const copyMarkdown = () => {
    const md = `[Chat on WhatsApp](${generateLink()})`;
    navigator.clipboard.writeText(md).then(() => {
      setCopiedMarkdown(true);
      setTimeout(() => setCopiedMarkdown(false), 2000);
    });
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = `whatsapp-qr-${inputs.phoneNumber}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const resetForm = () => setInputs({
    linkType: "Business", countryCode: "+91", phoneNumber: "",
    businessName: "", buttonLabel: "", messageTemplate: "Custom",
    message: "", utmSource: "", utmMedium: "", utmCampaign: "",
    groupName: "", multiMode: false, multiMessages: ["", "", "", "", ""],
  });

  const generatedLink = generateLink();
  const hasUtm = inputs.utmSource || inputs.utmMedium || inputs.utmCampaign;

  const aiSuggestions = [
    { icon: "🛍️", title: "Product Inquiry", msg: `Hi ${inputs.businessName || "[Business]"}! I saw your products and I'm interested. Can you share more details?` },
    { icon: "📦", title: "Order Status", msg: `Hi ${inputs.businessName || "[Business]"}! I placed an order recently and wanted to check the status.` },
    { icon: "💰", title: "Price Quote", msg: `Hi ${inputs.businessName || "[Business]"}! Could you please share a price quote for your products?` },
    { icon: "🤝", title: "Business Partnership", msg: `Hi! I'm interested in partnering with ${inputs.businessName || "[Business]"}. Can we connect?` },
    { icon: "📅", title: "Book Appointment", msg: `Hi ${inputs.businessName || "[Business]"}! I'd like to book an appointment. What slots are available?` },
    { icon: "🔄", title: "After Sales Support", msg: `Hi! I recently purchased from ${inputs.businessName || "[Business]"} and need some assistance.` },
  ];

  // Consistent padding for all sections
  const sectionPad = isMobile ? "20px 16px" : "32px";
  const outerPad = isMobile ? "0 16px" : "0 24px";

  return (
    <div style={{ background: "#f1f5f9", minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>

      {/* ── HERO ── */}
      <section style={{
        background: "#030a10",
        padding: isMobile ? "48px 16px 56px" : "80px 24px 90px",
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
            borderRadius: 100, padding: "6px 18px", marginBottom: 16,
          }}>
            <span style={{ fontSize: 14 }}>💬</span>
            <span style={{ color: "#35d0b2", fontSize: 13, fontWeight: 600 }}>Free WhatsApp Link Generator</span>
          </div>

          <p style={{ color: "#35d0b2", fontSize: isMobile ? 13 : 16, fontWeight: 600, marginBottom: 10, letterSpacing: "0.3px" }}>
            Turn Your Number Into a One-Click Chat Button — Free Forever
          </p>

          <h1 style={{
            fontSize: isMobile ? "clamp(28px,7vw,40px)" : "clamp(42px,6vw,72px)",
            fontWeight: 900, letterSpacing: "-2px",
            lineHeight: 1.1, color: "#f8fafc", marginBottom: 16,
          }}>
            WhatsApp Link Generator
          </h1>

          <p style={{
            color: "#94a3b8",
            fontSize: isMobile ? 14 : 18,
            maxWidth: 620, margin: "0 auto 12px", lineHeight: 1.75,
          }}>
            Generate WhatsApp click-to-chat links with pre-filled messages, QR codes,
            UTM tracking and AI message suggestions — instantly, for free.
          </p>

          {!isMobile && (
            <p style={{ color: "#64748b", fontSize: 15, maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.7 }}>
              Used by Indian ecommerce sellers and small businesses to connect with
              customers on WhatsApp directly from Instagram bio, website, packaging and email.
            </p>
          )}

          {/* Stats bar */}
          <div style={{
            display: "flex", justifyContent: "center", gap: 0,
            flexWrap: isMobile ? "wrap" : "nowrap",
            borderTop: "1px solid rgba(53,208,178,0.15)",
            paddingTop: 24, marginTop: isMobile ? 20 : 0,
          }}>
            {[["wa.me Links", "Instant Generation"], ["QR Code", "Download PNG"], ["UTM Tracking", "Campaign Ready"], ["100% Free", "No Sign-up Needed"]].map(([n, l], i) => (
              <div key={l} style={{
                textAlign: "center",
                padding: isMobile ? "8px 16px" : "0 28px",
                borderRight: isMobile ? "none" : (i < 3 ? "1px solid rgba(53,208,178,0.15)" : "none"),
                width: isMobile ? "50%" : "auto",
                marginBottom: isMobile ? 8 : 0,
              }}>
                <div style={{ fontSize: isMobile ? 13 : 15, fontWeight: 800, color: "#35d0b2", marginBottom: 2 }}>{n}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: outerPad }}>

        {/* Two column → single column on mobile */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 20,
          marginTop: 24,
          paddingBottom: 48,
        }}>

          {/* LEFT: Form */}
          <div style={{
            background: "#ffffff", borderRadius: 16,
            border: "1px solid #e8ecf0", overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}>
            <div style={{
              padding: "20px 24px", borderBottom: "1px solid #f1f5f9",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "#f8fafc",
            }}>
              <div>
                <h2 style={{ fontWeight: 700, fontSize: 17, color: "#0f172a" }}>WhatsApp Link Details</h2>
                <p style={{ color: "#94a3b8", fontSize: 13 }}>Fill in your info to generate the link</p>
              </div>
              <button onClick={resetForm} style={{
                background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8,
                padding: "6px 14px", fontSize: 12, fontWeight: 600,
                color: "#64748b", cursor: "pointer", fontFamily: "'Poppins', sans-serif",
              }}>↺ Reset</button>
            </div>

            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Link Type */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>Link Type</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["Personal", "Business", "Group"].map((t) => (
                    <button key={t} onClick={() => set("linkType", t)} style={{
                      flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer",
                      border: `1.5px solid ${inputs.linkType === t ? "#35d0b2" : "#e2e8f0"}`,
                      background: inputs.linkType === t ? "#35d0b2" : "#fff",
                      color: inputs.linkType === t ? "#030a10" : "#64748b",
                      fontWeight: 600, fontSize: isMobile ? 11 : 13,
                      fontFamily: "'Poppins', sans-serif", transition: "all 0.15s",
                    }}>{t}</button>
                  ))}
                </div>
              </div>

              {/* Country Code + Phone */}
              {inputs.linkType !== "Group" && (
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.5fr", gap: 12 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Country Code</label>
                    <select value={inputs.countryCode} onChange={(e) => set("countryCode", e.target.value)} style={{
                      padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8,
                      fontSize: 13, background: "#fff", cursor: "pointer",
                      fontFamily: "'Poppins', sans-serif", color: "#0f172a", outline: "none",
                    }}
                      onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.name} value={c.code}>{c.flag} {c.name} ({c.code})</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Phone Number</label>
                    <input type="text" value={inputs.phoneNumber} onChange={(e) => set("phoneNumber", e.target.value)}
                      placeholder="9876543210"
                      style={{
                        padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8,
                        fontSize: 13, background: "#fff", outline: "none",
                        fontFamily: "'Poppins', sans-serif", color: "#0f172a", width: "100%", boxSizing: "border-box",
                      }}
                      onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                    />
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>Enter number without country code or spaces</span>
                  </div>
                </div>
              )}

              {/* Group Name */}
              {inputs.linkType === "Group" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Group Name *</label>
                  <input type="text" value={inputs.groupName} onChange={(e) => set("groupName", e.target.value)}
                    placeholder="My WhatsApp Group"
                    style={{
                      padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8,
                      fontSize: 13, background: "#fff", outline: "none",
                      fontFamily: "'Poppins', sans-serif", color: "#0f172a", width: "100%", boxSizing: "border-box",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                  />
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>Enter your WhatsApp group invite link name</span>
                </div>
              )}

              {/* Business Name */}
              {inputs.linkType === "Business" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Business Name (optional)</label>
                  <input type="text" value={inputs.businessName} onChange={(e) => set("businessName", e.target.value)}
                    placeholder="BaazarIQ Store"
                    style={{
                      padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8,
                      fontSize: 13, background: "#fff", outline: "none",
                      fontFamily: "'Poppins', sans-serif", color: "#0f172a", width: "100%", boxSizing: "border-box",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                  />
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>Used in AI message suggestions</span>
                </div>
              )}

              {/* Message Template */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>Message Template</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {MESSAGE_TEMPLATES.map((t) => (
                    <button key={t.id} onClick={() => {
                      set("messageTemplate", t.id);
                      if (t.message) set("message", t.message);
                    }} style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                      borderRadius: 10, cursor: "pointer",
                      border: `1.5px solid ${inputs.messageTemplate === t.id ? "#35d0b2" : "#e2e8f0"}`,
                      background: inputs.messageTemplate === t.id ? "rgba(53,208,178,0.08)" : "#fff",
                      textAlign: "left", fontFamily: "'Poppins', sans-serif", transition: "all 0.15s",
                    }}>
                      <span style={{ fontSize: 18 }}>{t.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: inputs.messageTemplate === t.id ? "#35d0b2" : "#0f172a" }}>{t.label}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{t.desc}</div>
                      </div>
                      {inputs.messageTemplate === t.id && <span style={{ color: "#35d0b2", fontSize: 16 }}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Textarea */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Pre-filled Message</label>
                <textarea value={inputs.message} onChange={(e) => set("message", e.target.value)}
                  placeholder="Type your message here... e.g. Hi! I saw your product and I'm interested."
                  rows={4}
                  style={{
                    padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8,
                    fontSize: 13, background: "#fff", outline: "none", resize: "vertical",
                    fontFamily: "'Poppins', sans-serif", color: "#0f172a", width: "100%", boxSizing: "border-box",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>This message will appear pre-typed when someone opens your link</span>
                  <span style={{ fontSize: 11, color: inputs.message.length > 200 ? "#dc2626" : "#94a3b8", fontWeight: 600 }}>
                    {inputs.message.length} / 200
                  </span>
                </div>
              </div>

              {/* UTM Parameters */}
              <div style={{ background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <button onClick={() => setUtmExpanded(!utmExpanded)} style={{
                  width: "100%", padding: "12px 16px", background: "none", border: "none",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  cursor: "pointer", fontFamily: "'Poppins', sans-serif",
                }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>⚙️ UTM Tracking Parameters (Optional)</span>
                  <span style={{ fontSize: 16, color: "#94a3b8", transform: utmExpanded ? "rotate(180deg)" : "", transition: "transform 0.2s" }}>▾</span>
                </button>
                {utmExpanded && (
                  <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { key: "utmSource", label: "UTM Source", placeholder: "instagram", hint: "Where traffic comes from" },
                      { key: "utmMedium", label: "UTM Medium", placeholder: "bio", hint: "Marketing medium (bio, story, post, email)" },
                      { key: "utmCampaign", label: "UTM Campaign", placeholder: "summer_sale_2025", hint: "Campaign name for tracking" },
                    ].map(({ key, label, placeholder, hint }) => (
                      <div key={key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}</label>
                        <input type="text" value={inputs[key]} onChange={(e) => set(key, e.target.value)}
                          placeholder={placeholder}
                          style={{
                            padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8,
                            fontSize: 13, background: "#fff", outline: "none",
                            fontFamily: "'Poppins', sans-serif", color: "#0f172a",
                            width: "100%", boxSizing: "border-box",
                          }}
                          onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                          onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                        />
                        <span style={{ fontSize: 11, color: "#94a3b8" }}>{hint}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Multiple Links Mode */}
              <div style={{ background: "#f8fafc", borderRadius: 10, padding: "14px 16px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: inputs.multiMode ? 12 : 0 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>🗂️ Multiple Links Mode</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>Generate up to 5 links with different messages</div>
                  </div>
                  <button onClick={() => set("multiMode", !inputs.multiMode)} style={{
                    width: 44, height: 24, borderRadius: 100,
                    background: inputs.multiMode ? "#35d0b2" : "#e2e8f0",
                    border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0,
                  }}>
                    <div style={{
                      position: "absolute", top: 2, left: inputs.multiMode ? 22 : 2,
                      width: 20, height: 20, borderRadius: "50%",
                      background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                    }} />
                  </button>
                </div>
                {inputs.multiMode && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {inputs.multiMessages.map((msg, i) => (
                      <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>Link {i + 1} Message</label>
                        <input type="text" value={msg}
                          onChange={(e) => {
                            const newMsgs = [...inputs.multiMessages];
                            newMsgs[i] = e.target.value;
                            set("multiMessages", newMsgs);
                          }}
                          placeholder={`Message for link ${i + 1}`}
                          style={{
                            padding: "8px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8,
                            fontSize: 12, background: "#fff", outline: "none",
                            fontFamily: "'Poppins', sans-serif", color: "#0f172a",
                            width: "100%", boxSizing: "border-box",
                          }}
                          onFocus={(e) => { e.target.style.borderColor = "#2563eb"; }}
                          onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Results */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Generated Link */}
            <div style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #e8ecf0", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>Your WhatsApp Link</h3>
                  <p style={{ fontSize: 12, color: "#94a3b8" }}>Ready to copy and share</p>
                </div>
                <div style={{
                  background: "rgba(53,208,178,0.1)", border: "1px solid rgba(53,208,178,0.2)",
                  borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 600, color: "#35d0b2",
                }}>wa.me</div>
              </div>

              <div style={{
                background: "#0f172a", borderRadius: 12, padding: "14px 16px", marginBottom: 16,
                wordBreak: "break-all", fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12, color: "#35d0b2", lineHeight: 1.6,
              }}>
                {isValidPhone ? generatedLink : "https://wa.me/ — enter phone number to generate"}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <button onClick={copyLink} disabled={!isValidPhone} style={{
                  background: isValidPhone ? "#35d0b2" : "#f1f5f9",
                  color: isValidPhone ? "#030a10" : "#94a3b8",
                  border: "none", padding: "10px 4px", borderRadius: 8,
                  fontSize: isMobile ? 11 : 12, fontWeight: 700,
                  cursor: isValidPhone ? "pointer" : "default",
                  fontFamily: "'Poppins', sans-serif",
                }}>
                  {copied ? "✅ Copied!" : "📋 Copy Link"}
                </button>
                <button onClick={() => isValidPhone && window.open(generatedLink, "_blank")}
                  disabled={!isValidPhone} style={{
                    background: isValidPhone ? "#25d366" : "#f1f5f9",
                    color: isValidPhone ? "#fff" : "#94a3b8",
                    border: "none", padding: "10px 4px", borderRadius: 8,
                    fontSize: isMobile ? 11 : 12, fontWeight: 700,
                    cursor: isValidPhone ? "pointer" : "default",
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                  💬 Open WA
                </button>
                <button onClick={copyMarkdown} disabled={!isValidPhone} style={{
                  background: isValidPhone ? "#eff6ff" : "#f1f5f9",
                  color: isValidPhone ? "#2563eb" : "#94a3b8",
                  border: `1px solid ${isValidPhone ? "#bfdbfe" : "#e2e8f0"}`,
                  padding: "10px 4px", borderRadius: 8,
                  fontSize: isMobile ? 11 : 12, fontWeight: 700,
                  cursor: isValidPhone ? "pointer" : "default",
                  fontFamily: "'Poppins', sans-serif",
                }}>
                  {copiedMarkdown ? "✅ Copied!" : "📝 Markdown"}
                </button>
              </div>
            </div>

            {/* Link Health Checker */}
            <div style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #e8ecf0", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", marginBottom: 12 }}>Link Health Checker</h3>
              <div style={{
                background: !inputs.phoneNumber ? "#f8fafc" : isValidPhone ? "#f0fdf4" : "#fef2f2",
                border: `1px solid ${!inputs.phoneNumber ? "#e2e8f0" : isValidPhone ? "#bbf7d0" : "#fecaca"}`,
                borderRadius: 10, padding: "12px 16px",
                display: "flex", alignItems: "center", gap: 10, marginBottom: 12,
              }}>
                <span style={{ fontSize: 20 }}>
                  {!inputs.phoneNumber ? "📱" : isValidPhone ? "✅" : "❌"}
                </span>
                <span style={{
                  fontSize: 13, fontWeight: 600,
                  color: !inputs.phoneNumber ? "#94a3b8" : isValidPhone ? "#16a34a" : "#dc2626",
                }}>
                  {!inputs.phoneNumber ? "Enter phone number to validate" : isValidPhone ? "Valid number — link is ready" : "Invalid number format"}
                </span>
              </div>
              {isValidPhone && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[
                    ["Full Number", `${inputs.countryCode}${inputs.phoneNumber}`],
                    ["Link Format", `wa.me/${inputs.countryCode.replace("+", "")}${inputs.phoneNumber}`],
                  ].map(([l, v]) => (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 0", borderBottom: "1px solid #f1f5f9" }}>
                      <span style={{ color: "#64748b" }}>{l}</span>
                      <span style={{ color: "#0f172a", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", wordBreak: "break-all" }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* QR Code */}
            <div style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #e8ecf0", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", textAlign: "center" }}>
              <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", marginBottom: 4 }}>QR Code</h3>
              <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>Scan to open WhatsApp chat</p>
              {qrDataUrl ? (
                <>
                  <img src={qrDataUrl} alt="WhatsApp QR Code" style={{ width: 180, height: 180, borderRadius: 12, border: "1px solid #e2e8f0", marginBottom: 16 }} />
                  <br />
                  <button onClick={downloadQR} style={{
                    background: "#35d0b2", color: "#030a10", border: "none",
                    padding: "10px 20px", borderRadius: 8, fontSize: 13,
                    fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins', sans-serif",
                  }}>⬇️ Download PNG</button>
                  <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 8 }}>Scan with any camera app</p>
                </>
              ) : (
                <div style={{
                  width: 180, height: 180, background: "#f8fafc", borderRadius: 12,
                  border: "1px solid #e2e8f0", display: "flex", alignItems: "center",
                  justifyContent: "center", margin: "0 auto 12px", flexDirection: "column", gap: 8,
                }}>
                  <span style={{ fontSize: 32 }}>📱</span>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>QR code will appear here</span>
                </div>
              )}
            </div>

            {/* UTM Preview */}
            {isValidPhone && hasUtm && (
              <div style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #e8ecf0", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", marginBottom: 8 }}>UTM Tracked Link</h3>
                <div style={{
                  background: "#0f172a", borderRadius: 12, padding: "14px 16px",
                  wordBreak: "break-all", fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12, color: "#35d0b2", lineHeight: 1.6,
                }}>
                  {generatedLink}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Message Suggestions */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "rgba(53,208,178,0.12)", border: "1px solid rgba(53,208,178,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>🤖</div>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: isMobile ? 16 : 18, color: "#0f172a" }}>AI Message Suggestions</h2>
              <p style={{ color: "#64748b", fontSize: 13 }}>Smart pre-filled messages for your business</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
            {aiSuggestions.map((s, i) => (
              <div key={i} style={{
                background: "#fff", border: "1px solid #e8ecf0", borderRadius: 12, padding: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 18 }}>{s.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{s.title}</span>
                </div>
                <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, marginBottom: 12 }}>{s.msg}</p>
                <button onClick={() => set("message", s.msg)} style={{
                  background: "rgba(53,208,178,0.1)", border: "1px solid rgba(53,208,178,0.2)",
                  borderRadius: 6, padding: "5px 12px", cursor: "pointer",
                  fontSize: 12, fontWeight: 600, color: "#35d0b2",
                  fontFamily: "'Poppins', sans-serif",
                }}>Use This</button>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div style={{ background: "#ffffff", borderRadius: 16, padding: sectionPad, marginBottom: 32, border: "1px solid #e8ecf0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr", gap: isMobile ? 20 : 48, alignItems: "start" }}>
            <div>
              <div style={{
                display: "inline-block", background: "rgba(53,208,178,0.1)",
                border: "1px solid rgba(53,208,178,0.2)", borderRadius: 100,
                padding: "4px 14px", color: "#35d0b2", fontSize: 12, fontWeight: 600, marginBottom: 12,
              }}>How It Works</div>
              <h2 style={{ fontSize: isMobile ? 20 : 26, fontWeight: 800, letterSpacing: "-0.8px", lineHeight: 1.3, color: "#0f172a" }}>
                How to Create Your WhatsApp Link in Seconds
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
              {[
                ["Step 1 — Enter your number", "Add your WhatsApp number with country code so the link connects directly to your chat."],
                ["Step 2 — Write your message", "Add a pre-filled message so customers know exactly what to say when they contact you."],
                ["Step 3 — Add UTM tracking", "Optionally add UTM parameters to track which campaigns are driving WhatsApp conversations."],
                ["Step 4 — Copy & share", "Copy the link and add it to your website, Instagram bio, Facebook page or email signature."],
              ].map(([title, desc]) => (
                <div key={title} style={{ display: "flex", gap: 14, background: "#f8fafc", borderRadius: 12, padding: "16px", border: "1px solid #e8ecf0" }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", background: "#35d0b2",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, color: "#030a10", fontSize: 14, fontWeight: 700,
                  }}>✓</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6, color: "#0f172a" }}>{title}</div>
                    <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Where to Use */}
        <div style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #e8ecf0", padding: sectionPad, marginBottom: 32, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h2 style={{ fontWeight: 800, fontSize: isMobile ? 18 : 22, color: "#0f172a", marginBottom: 8 }}>Where to Use Your WhatsApp Link</h2>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>Add your link anywhere customers can find you</p>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill,minmax(200px,1fr))", gap: 14 }}>
            {[
              { icon: "📸", title: "Instagram Bio", desc: "Add in your profile link for instant customer chats", color: "#e1306c", bg: "#fdf2f8" },
              { icon: "🌐", title: "Website", desc: "Add a floating WhatsApp button on your store", color: "#2563eb", bg: "#eff6ff" },
              { icon: "📧", title: "Email Signature", desc: "Let email recipients chat with you in one click", color: "#ea580c", bg: "#fff7ed" },
              { icon: "📘", title: "Facebook Page", desc: "Add as your page's contact button", color: "#1877f2", bg: "#eff6ff" },
              { icon: "🖨️", title: "Print Materials", desc: "Add QR code on packaging, flyers and business cards", color: "#7c3aed", bg: "#faf5ff" },
              { icon: "📱", title: "WhatsApp Status", desc: "Share your link in your own WhatsApp status", color: "#25d366", bg: "#f0fdf4" },
            ].map((item) => (
              <div key={item.title} style={{
                background: item.bg, border: `1px solid ${item.color}22`,
                borderRadius: 12, padding: isMobile ? "14px" : "18px", textAlign: "center",
                transition: "all 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = item.color; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${item.color}22`; }}
              >
                <div style={{ fontSize: isMobile ? 22 : 28, marginBottom: 8 }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: isMobile ? 12 : 14, color: item.color, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: isMobile ? 11 : 12, color: "#64748b", lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #e8ecf0", padding: sectionPad, marginBottom: 48, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{
            display: "inline-block", background: "rgba(53,208,178,0.1)",
            border: "1px solid rgba(53,208,178,0.2)", borderRadius: 100,
            padding: "4px 14px", color: "#35d0b2", fontSize: 12, fontWeight: 600, marginBottom: 16,
          }}>FAQ</div>
          <h2 style={{ fontWeight: 800, fontSize: isMobile ? 18 : 22, marginBottom: 24, color: "#0f172a" }}>Frequently Asked Questions</h2>
          {[
            ["What is a WhatsApp link?", "A WhatsApp link (wa.me link) lets anyone start a WhatsApp chat with you in one click — without saving your number. It's perfect for businesses, sellers and creators."],
            ["What is a pre-filled message?", "A pre-filled message appears automatically typed in the chat when someone opens your link. It saves the customer time and helps you understand why they're reaching out."],
            ["What are UTM parameters?", "UTM parameters are tracking codes added to your link URL. They help you track which source (Instagram, Facebook, email etc.) is sending you the most WhatsApp conversations in Google Analytics."],
            ["Is this WhatsApp link generator free?", "Yes — 100% free, forever. No sign-up, no account, no limits. Generate as many links as you need."],
            ["Will the link work on both mobile and desktop?", "Yes. On mobile it opens the WhatsApp app directly. On desktop it opens WhatsApp Web. Both work perfectly."],
            ["How do I add my WhatsApp link to Instagram bio?", "Copy your generated link, go to your Instagram profile → Edit Profile → Website/Bio → paste the link and save."],
          ].map(([q, a]) => <FAQItem key={q} q={q} a={a} />)}
        </div>
      </div>
    </div>
  );
}

export default WhatsAppLinkGenerator;