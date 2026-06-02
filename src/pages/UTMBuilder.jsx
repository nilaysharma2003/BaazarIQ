import React, { useState, useEffect, useCallback } from "react";
import QRCode from "qrcode";

const PLATFORM_PRESETS = [
  { id: "google", icon: "🔍", label: "Google Ads", source: "google", medium: "cpc", color: "#4285f4", bg: "#eff6ff" },
  { id: "facebook", icon: "📘", label: "Facebook", source: "facebook", medium: "social", color: "#1877f2", bg: "#eff6ff" },
  { id: "instagram", icon: "📸", label: "Instagram", source: "instagram", medium: "social", color: "#e1306c", bg: "#fdf2f8" },
  { id: "email", icon: "📧", label: "Email", source: "newsletter", medium: "email", color: "#ea580c", bg: "#fff7ed" },
  { id: "whatsapp", icon: "💬", label: "WhatsApp", source: "whatsapp", medium: "messaging", color: "#25d366", bg: "#f0fdf4" },
  { id: "youtube", icon: "▶️", label: "YouTube", source: "youtube", medium: "video", color: "#dc2626", bg: "#fef2f2" },
  { id: "linkedin", icon: "💼", label: "LinkedIn", source: "linkedin", medium: "social", color: "#0a66c2", bg: "#eff6ff" },
  { id: "twitter", icon: "🐦", label: "Twitter/X", source: "twitter", medium: "social", color: "#0f172a", bg: "#f8fafc" },
];

const MEDIUM_PRESETS = ["cpc", "email", "social", "organic", "referral", "video", "display", "messaging", "affiliate", "sms"];
const SOURCE_PRESETS = ["google", "facebook", "instagram", "newsletter", "youtube", "linkedin", "twitter", "whatsapp", "bing", "direct"];

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

function validateUTM(inputs) {
  const warnings = [];
  const fields = [
    { key: "source", label: "UTM Source" },
    { key: "medium", label: "UTM Medium" },
    { key: "campaign", label: "UTM Campaign" },
    { key: "term", label: "UTM Term" },
    { key: "content", label: "UTM Content" },
  ];

  fields.forEach(({ key, label }) => {
    const val = inputs[key];
    if (!val) return;
    if (val !== val.toLowerCase()) warnings.push({ type: "warn", field: label, msg: `${label} contains uppercase — use lowercase for consistent GA4 reporting` });
    if (val.includes(" ")) warnings.push({ type: "error", field: label, msg: `${label} contains spaces — replace with underscores or dashes` });
    if (/[^a-z0-9_.,-]/i.test(val)) warnings.push({ type: "warn", field: label, msg: `${label} contains special characters — keep it simple` });
  });

  if (!inputs.url) warnings.push({ type: "error", field: "URL", msg: "Website URL is required" });
  else if (!inputs.url.startsWith("http")) warnings.push({ type: "error", field: "URL", msg: "URL must start with http:// or https://" });

  if (inputs.term && inputs.medium !== "cpc") warnings.push({ type: "info", field: "UTM Term", msg: "UTM Term is typically used only for paid search (cpc) campaigns" });

  return warnings;
}

function getAIInsights(inputs) {
  const insights = [];
  if (!inputs.source && !inputs.medium && !inputs.campaign) return insights;

  if (inputs.source === "google" && inputs.medium === "cpc") {
    insights.push({ type: "success", icon: "✅", title: "Google Ads Setup", msg: "Perfect setup for Google Ads. Add utm_term with your keyword and utm_content with ad variation to get full visibility." });
  }
  if (inputs.medium === "email") {
    insights.push({ type: "info", icon: "📧", title: "Email Campaign Tip", msg: "For email campaigns, use utm_content to differentiate between header, footer and CTA button links in the same email." });
  }
  if (inputs.medium === "social") {
    insights.push({ type: "info", icon: "📱", title: "Social Media Tip", msg: "Use utm_content to track which post variation or creative performs best across your social campaigns." });
  }
  if (inputs.campaign && inputs.campaign.includes(" ")) {
    insights.push({ type: "warn", icon: "⚠️", title: "Campaign Name Issue", msg: `Replace spaces with underscores in campaign name: "${inputs.campaign.replace(/ /g, "_")}"` });
  }
  if (inputs.source && inputs.source !== inputs.source.toLowerCase()) {
    insights.push({ type: "warn", icon: "🔤", title: "Lowercase Recommended", msg: "GA4 is case-sensitive. 'Instagram' and 'instagram' will appear as separate sources in reports." });
  }
  if (inputs.campaign && !inputs.term && inputs.medium === "cpc") {
    insights.push({ type: "warn", icon: "🔍", title: "Add UTM Term", msg: "For paid search campaigns, add utm_term with your target keyword to see which keywords drive conversions." });
  }
  if (inputs.source && inputs.medium && inputs.campaign) {
    insights.push({ type: "success", icon: "📊", title: "GA4 Ready", msg: "Your UTM link has all required parameters. It will appear under Acquisition → Traffic Acquisition in GA4." });
  }

  return insights;
}

function UTMBuilder() {
  const [inputs, setInputs] = useState({
    url: "",
    source: "",
    medium: "",
    campaign: "",
    term: "",
    content: "",
    campaignId: "",
  });
  const [copied, setCopied] = useState(false);
  const [copiedParams, setCopiedParams] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");
  
  const [bulkUrls, setBulkUrls] = useState("");
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("utm_history") || "[]"); } catch { return []; }
  });
  const [activeTab, setActiveTab] = useState("builder");

  const set = useCallback((k, v) => {
    setInputs((prev) => {
      if (prev[k] === v) return prev;
      return { ...prev, [k]: v };
    });
  }, []);

  const generateURL = useCallback(() => {
    if (!inputs.url) return "";
    try {
      const base = inputs.url.includes("?") ? inputs.url + "&" : inputs.url + "?";
      const params = [];
      if (inputs.source) params.push(`utm_source=${encodeURIComponent(inputs.source)}`);
      if (inputs.medium) params.push(`utm_medium=${encodeURIComponent(inputs.medium)}`);
      if (inputs.campaign) params.push(`utm_campaign=${encodeURIComponent(inputs.campaign)}`);
      if (inputs.term) params.push(`utm_term=${encodeURIComponent(inputs.term)}`);
      if (inputs.content) params.push(`utm_content=${encodeURIComponent(inputs.content)}`);
      if (inputs.campaignId) params.push(`utm_id=${encodeURIComponent(inputs.campaignId)}`);
      if (params.length === 0) return inputs.url;
      return base + params.join("&");
    } catch { return ""; }
  }, [inputs]);

  const isValid = inputs.url && inputs.source && inputs.medium && inputs.campaign;
  const generatedURL = generateURL();
  const warnings = validateUTM(inputs);
  const aiInsights = getAIInsights(inputs);

  useEffect(() => {
    if (isValid) {
      QRCode.toDataURL(generatedURL, {
        width: 180, margin: 1,
        color: { dark: "#0f172a", light: "#ffffff" },
      }).then(setQrDataUrl).catch(() => {});
    } else {
      setQrDataUrl("");
    }
  }, [generatedURL, isValid]);

  const copyURL = () => {
    navigator.clipboard.writeText(generatedURL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      // Save to history
      const newEntry = { url: generatedURL, source: inputs.source, medium: inputs.medium, campaign: inputs.campaign, date: new Date().toLocaleDateString() };
      const newHistory = [newEntry, ...history.filter(h => h.url !== generatedURL)].slice(0, 5);
      setHistory(newHistory);
      try { localStorage.setItem("utm_history", JSON.stringify(newHistory)); } catch {}
    });
  };

  const copyParams = () => {
    const params = `utm_source=${inputs.source}&utm_medium=${inputs.medium}&utm_campaign=${inputs.campaign}${inputs.term ? `&utm_term=${inputs.term}` : ""}${inputs.content ? `&utm_content=${inputs.content}` : ""}`;
    navigator.clipboard.writeText(params).then(() => {
      setCopiedParams(true);
      setTimeout(() => setCopiedParams(false), 2000);
    });
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = `utm-qr-${inputs.campaign || "campaign"}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const copyCSV = () => {
    const csv = `Website URL,UTM Source,UTM Medium,UTM Campaign,UTM Term,UTM Content,UTM ID,Full URL\n${inputs.url},${inputs.source},${inputs.medium},${inputs.campaign},${inputs.term},${inputs.content},${inputs.campaignId},${generatedURL}`;
    navigator.clipboard.writeText(csv);
  };

  const applyPreset = (preset) => {
    setInputs(prev => ({ ...prev, source: preset.source, medium: preset.medium }));
  };

  const generateBulkURLs = () => {
    if (!bulkUrls.trim()) return "";
    return bulkUrls.trim().split("\n").map(url => {
      const base = url.trim().includes("?") ? url.trim() + "&" : url.trim() + "?";
      const params = [];
      if (inputs.source) params.push(`utm_source=${encodeURIComponent(inputs.source)}`);
      if (inputs.medium) params.push(`utm_medium=${encodeURIComponent(inputs.medium)}`);
      if (inputs.campaign) params.push(`utm_campaign=${encodeURIComponent(inputs.campaign)}`);
      if (inputs.term) params.push(`utm_term=${encodeURIComponent(inputs.term)}`);
      if (inputs.content) params.push(`utm_content=${encodeURIComponent(inputs.content)}`);
      return base + params.join("&");
    }).join("\n");
  };

  const resetForm = () => {
    setInputs({ url: "", source: "", medium: "", campaign: "", term: "", content: "", campaignId: "" });
    setBulkUrls("");
  };

  const inputStyle = {
    padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8,
    fontSize: 13, background: "#fff", outline: "none",
    fontFamily: "'Poppins', sans-serif", color: "#0f172a", width: "100%",
  };

  const labelStyle = { fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 };

  return (
    <div style={{ background: "#f1f5f9", minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>

      {/* Hero */}
      <section style={{
        background: "#030a10", padding: "80px 24px 90px",
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
            borderRadius: 100, padding: "6px 18px", marginBottom: 20,
          }}>
            <span style={{ fontSize: 16 }}>🔗</span>
            <span style={{ color: "#35d0b2", fontSize: 14, fontWeight: 600 }}>Free UTM Builder</span>
          </div>
          <p style={{ color: "#35d0b2", fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
            Track Every Click. Optimize Every Campaign.
          </p>
          <h1 style={{
            fontSize: "clamp(42px, 6vw, 72px)", fontWeight: 900,
            letterSpacing: "-2px", lineHeight: 1.1, color: "#f8fafc", marginBottom: 20,
          }}>
            UTM Campaign URL Builder
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 18, maxWidth: 620, margin: "0 auto 16px", lineHeight: 1.75 }}>
            Generate GA4-ready UTM tracking URLs with one-click platform presets,
            bulk URL generator, QR codes and AI-powered naming suggestions — completely free.
          </p>
          <p style={{ color: "#64748b", fontSize: 15, maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.7 }}>
            Track every click from Google Ads, Facebook, Instagram, Email and WhatsApp
            campaigns — and see exactly which source drives the most sales in Google Analytics 4.
          </p>
          <div style={{
            display: "flex", justifyContent: "center", gap: 0, flexWrap: "wrap",
            borderTop: "1px solid rgba(53,208,178,0.15)", paddingTop: 28,
          }}>
            {[
              ["GA4 Ready", "Auto Validated"],
              ["8 Platforms", "One Click Presets"],
              ["Bulk Generator", "Multiple URLs"],
              ["QR Code", "Download Free"],
            ].map(([n, l], i) => (
              <div key={l} style={{ textAlign: "center", padding: "0 28px", borderRight: i < 3 ? "1px solid rgba(53,208,178,0.15)" : "none" }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#35d0b2", marginBottom: 3 }}>{n}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 8, marginTop: 24, marginBottom: 0 }}>
          {[["builder", "🔗 URL Builder"], ["bulk", "📋 Bulk Generator"], ["history", "🕐 History"]].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)} style={{
              padding: "10px 20px", borderRadius: "10px 10px 0 0",
              border: "1px solid #e2e8f0", borderBottom: activeTab === id ? "1px solid #fff" : "1px solid #e2e8f0",
              background: activeTab === id ? "#fff" : "#f1f5f9",
              color: activeTab === id ? "#35d0b2" : "#64748b",
              fontWeight: 600, fontSize: 13, cursor: "pointer",
              fontFamily: "'Poppins', sans-serif",
            }}>{label}</button>
          ))}
        </div>

        {/* BUILDER TAB */}
        {activeTab === "builder" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, paddingBottom: 48 }}>

            {/* LEFT: Form */}
            <div style={{
              background: "#fff", borderRadius: "0 16px 16px 16px",
              border: "1px solid #e8ecf0", overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}>
              <div style={{
                padding: "20px 24px", borderBottom: "1px solid #f1f5f9",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: "#f8fafc",
              }}>
                <div>
                  <h2 style={{ fontWeight: 700, fontSize: 17, color: "#0f172a" }}>Campaign Parameters</h2>
                  <p style={{ color: "#94a3b8", fontSize: 13 }}>Fill required fields to generate your UTM URL</p>
                </div>
                <button onClick={resetForm} style={{
                  background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8,
                  padding: "6px 14px", fontSize: 12, fontWeight: 600,
                  color: "#64748b", cursor: "pointer", fontFamily: "'Poppins', sans-serif",
                }}>↺ Reset</button>
              </div>

              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>

                {/* Platform Presets */}
                <div>
                  <label style={labelStyle}>Quick Platform Presets</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                    {PLATFORM_PRESETS.map((p) => (
                      <button key={p.id} onClick={() => applyPreset(p)} style={{
                        padding: "8px 6px", borderRadius: 8, cursor: "pointer",
                        border: `1.5px solid ${inputs.source === p.source && inputs.medium === p.medium ? p.color : "#e2e8f0"}`,
                        background: inputs.source === p.source && inputs.medium === p.medium ? p.bg : "#fff",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                        fontFamily: "'Poppins', sans-serif", transition: "all 0.15s",
                      }}>
                        <span style={{ fontSize: 18 }}>{p.icon}</span>
                        <span style={{ fontSize: 10, fontWeight: 600, color: inputs.source === p.source ? p.color : "#64748b" }}>{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Website URL */}
                <div>
                  <label style={labelStyle}>
                    Website URL <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input type="text" value={inputs.url} onChange={(e) => set("url", e.target.value)}
                    placeholder="https://yourstore.com/product"
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                  />
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>The page you want to track traffic to</span>
                </div>

                {/* Source + Medium */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={labelStyle}>UTM Source <span style={{ color: "#dc2626" }}>*</span></label>
                    <input type="text" value={inputs.source} onChange={(e) => set("source", e.target.value.toLowerCase())}
                      placeholder="google, facebook, newsletter"
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                    />
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
                      {SOURCE_PRESETS.slice(0, 5).map(s => (
                        <button key={s} onClick={() => set("source", s)} style={{
                          fontSize: 10, padding: "2px 8px", borderRadius: 100,
                          border: "1px solid #e2e8f0", background: inputs.source === s ? "#35d0b2" : "#f8fafc",
                          color: inputs.source === s ? "#030a10" : "#64748b",
                          cursor: "pointer", fontFamily: "'Poppins', sans-serif",
                        }}>{s}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>UTM Medium <span style={{ color: "#dc2626" }}>*</span></label>
                    <input type="text" value={inputs.medium} onChange={(e) => set("medium", e.target.value.toLowerCase())}
                      placeholder="cpc, email, social"
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                    />
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
                      {MEDIUM_PRESETS.slice(0, 5).map(m => (
                        <button key={m} onClick={() => set("medium", m)} style={{
                          fontSize: 10, padding: "2px 8px", borderRadius: 100,
                          border: "1px solid #e2e8f0", background: inputs.medium === m ? "#35d0b2" : "#f8fafc",
                          color: inputs.medium === m ? "#030a10" : "#64748b",
                          cursor: "pointer", fontFamily: "'Poppins', sans-serif",
                        }}>{m}</button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Campaign */}
                <div>
                  <label style={labelStyle}>UTM Campaign <span style={{ color: "#dc2626" }}>*</span></label>
                  <input type="text" value={inputs.campaign} onChange={(e) => set("campaign", e.target.value)}
                    placeholder="summer_sale_2025, diwali_offer"
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                  />
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>Use underscores instead of spaces. e.g. diwali_sale_2025</span>
                </div>

                {/* Term + Content */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={labelStyle}>UTM Term</label>
                    <input type="text" value={inputs.term} onChange={(e) => set("term", e.target.value.toLowerCase())}
                      placeholder="running_shoes, laptop_bag"
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                    />
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>Paid search keywords only</span>
                  </div>
                  <div>
                    <label style={labelStyle}>UTM Content</label>
                    <input type="text" value={inputs.content} onChange={(e) => set("content", e.target.value.toLowerCase())}
                      placeholder="banner_v1, cta_button"
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                    />
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>Differentiate ads or links</span>
                  </div>
                </div>

                {/* Campaign ID */}
                <div>
                  <label style={labelStyle}>Campaign ID</label>
                  <input type="text" value={inputs.campaignId} onChange={(e) => set("campaignId", e.target.value)}
                    placeholder="campaign_001"
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                  />
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>Unique ID to identify this campaign in GA4</span>
                </div>

                {/* Validation warnings */}
                {warnings.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {warnings.map((w, i) => (
                      <div key={i} style={{
                        display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 12px",
                        borderRadius: 8,
                        background: w.type === "error" ? "#fef2f2" : w.type === "warn" ? "#fffbeb" : "#eff6ff",
                        border: `1px solid ${w.type === "error" ? "#fecaca" : w.type === "warn" ? "#fde68a" : "#bfdbfe"}`,
                      }}>
                        <span style={{ fontSize: 14, flexShrink: 0 }}>{w.type === "error" ? "❌" : w.type === "warn" ? "⚠️" : "ℹ️"}</span>
                        <span style={{ fontSize: 12, color: w.type === "error" ? "#dc2626" : w.type === "warn" ? "#d97706" : "#2563eb" }}>{w.msg}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Results */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 0 }}>

              {/* Generated URL */}
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>Generated UTM URL</h3>
                    <p style={{ fontSize: 12, color: "#94a3b8" }}>Your GA4-ready tracking link</p>
                  </div>
                  <div style={{
                    background: isValid ? "rgba(53,208,178,0.1)" : "#f8fafc",
                    border: `1px solid ${isValid ? "rgba(53,208,178,0.2)" : "#e2e8f0"}`,
                    borderRadius: 100, padding: "3px 10px",
                    fontSize: 11, fontWeight: 600, color: isValid ? "#35d0b2" : "#94a3b8",
                  }}>{isValid ? "✅ Ready" : "Fill required fields"}</div>
                </div>

                {/* URL box */}
                <div style={{
                  background: "#0f172a", borderRadius: 12, padding: "14px 16px", marginBottom: 14,
                  wordBreak: "break-all", fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11, color: "#35d0b2", lineHeight: 1.8, minHeight: 80,
                }}>
                  {isValid ? generatedURL : "https://yoursite.com?utm_source=...&utm_medium=...&utm_campaign=..."}
                </div>

                {/* Action buttons */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                  {[
                    { label: copied ? "✅ Copied!" : "📋 Copy URL", onClick: copyURL, primary: true },
                    { label: copiedParams ? "✅ Copied!" : "🔗 Copy Params", onClick: copyParams, primary: false },
                    { label: "📊 Copy CSV", onClick: copyCSV, primary: false },
                    { label: "⬇️ QR Code", onClick: downloadQR, primary: false, disabled: !qrDataUrl },
                  ].map(({ label, onClick, primary, disabled }) => (
                    <button key={label} onClick={onClick} disabled={!isValid || disabled} style={{
                      background: !isValid || disabled ? "#f1f5f9" : primary ? "#35d0b2" : "#fff",
                      color: !isValid || disabled ? "#94a3b8" : primary ? "#030a10" : "#374151",
                      border: primary ? "none" : "1px solid #e2e8f0",
                      padding: "9px 6px", borderRadius: 8,
                      fontSize: 11, fontWeight: 700, cursor: !isValid || disabled ? "default" : "pointer",
                      fontFamily: "'Poppins', sans-serif",
                    }}>{label}</button>
                  ))}
                </div>
              </div>

              {/* Parameter Breakdown */}
              {isValid && (
                <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", marginBottom: 14 }}>Parameter Breakdown</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { label: "utm_source", value: inputs.source, color: "#2563eb", required: true },
                      { label: "utm_medium", value: inputs.medium, color: "#7c3aed", required: true },
                      { label: "utm_campaign", value: inputs.campaign, color: "#35d0b2", required: true },
                      { label: "utm_term", value: inputs.term, color: "#f59e0b", required: false },
                      { label: "utm_content", value: inputs.content, color: "#f97316", required: false },
                      { label: "utm_id", value: inputs.campaignId, color: "#64748b", required: false },
                    ].filter(p => p.value || p.required).map(({ label, value, color, required }) => (
                      <div key={label} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "8px 12px", borderRadius: 8,
                        background: value ? "#f8fafc" : "#fef2f2",
                        border: `1px solid ${value ? "#e2e8f0" : "#fecaca"}`,
                      }}>
                        <span style={{
                          fontSize: 11, fontWeight: 700, color: "#fff",
                          background: color, padding: "2px 8px", borderRadius: 100, whiteSpace: "nowrap",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}>{label}</span>
                        <span style={{ fontSize: 12, color: value ? "#0f172a" : "#dc2626", fontFamily: "'JetBrains Mono', monospace", flex: 1 }}>
                          {value || (required ? "⚠️ Required" : "—")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GA4 Preview */}
              {isValid && (
                <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <span style={{ fontSize: 20 }}>📊</span>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>GA4 Preview</h3>
                      <p style={{ fontSize: 11, color: "#94a3b8" }}>How this will appear in Google Analytics</p>
                    </div>
                  </div>
                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: "14px", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Acquisition → Traffic Acquisition
                    </div>
                    {[
                      ["Session Source", inputs.source, "#2563eb"],
                      ["Session Medium", inputs.medium, "#7c3aed"],
                      ["Session Campaign", inputs.campaign, "#35d0b2"],
                    ].map(([label, value, color]) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #e2e8f0" }}>
                        <span style={{ fontSize: 12, color: "#64748b" }}>{label}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* QR Code */}
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", textAlign: "center" }}>
                <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", marginBottom: 4 }}>QR Code</h3>
                <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>Scan to open your UTM-tagged URL</p>
                {qrDataUrl ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <img src={qrDataUrl} alt="UTM QR Code" style={{ width: 160, height: 160, borderRadius: 12, border: "1px solid #e2e8f0" }} />
                    <button onClick={downloadQR} style={{
                      background: "#35d0b2", color: "#030a10", border: "none",
                      padding: "9px 18px", borderRadius: 8, fontSize: 12,
                      fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins', sans-serif",
                    }}>⬇️ Download PNG</button>
                  </div>
                ) : (
                  <div style={{
                    width: 160, height: 160, background: "#f8fafc", borderRadius: 12,
                    border: "1px solid #e2e8f0", display: "flex", alignItems: "center",
                    justifyContent: "center", margin: "0 auto", flexDirection: "column", gap: 8,
                  }}>
                    <span style={{ fontSize: 28 }}>🔗</span>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>QR appears here</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* BULK TAB */}
        {activeTab === "bulk" && (
          <div style={{ background: "#fff", borderRadius: "0 16px 16px 16px", border: "1px solid #e8ecf0", padding: "28px", marginBottom: 48, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontWeight: 700, fontSize: 18, color: "#0f172a", marginBottom: 6 }}>Bulk UTM Generator</h2>
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>Paste up to 10 URLs (one per line) — UTM parameters from the Builder tab will be applied to all</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label style={labelStyle}>Input URLs (one per line)</label>
                <textarea value={bulkUrls} onChange={(e) => setBulkUrls(e.target.value)}
                  placeholder={"https://yourstore.com/product1\nhttps://yourstore.com/product2\nhttps://yourstore.com/product3"}
                  rows={10}
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={(e) => { e.target.style.borderColor = "#2563eb"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; }}
                />
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  {!inputs.source || !inputs.medium || !inputs.campaign ? (
                    <div style={{ fontSize: 12, color: "#d97706", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "8px 12px" }}>
                      ⚠️ Fill UTM Source, Medium and Campaign in the Builder tab first
                    </div>
                  ) : (
                    <button onClick={() => navigator.clipboard.writeText(generateBulkURLs())} style={{
                      background: "#35d0b2", color: "#030a10", border: "none",
                      padding: "10px 20px", borderRadius: 8, fontSize: 13,
                      fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins', sans-serif",
                    }}>📋 Copy All UTM URLs</button>
                  )}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Generated UTM URLs</label>
                <div style={{
                  background: "#0f172a", borderRadius: 10, padding: "14px",
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                  color: "#35d0b2", lineHeight: 1.8, minHeight: 240,
                  wordBreak: "break-all", whiteSpace: "pre-wrap",
                }}>
                  {bulkUrls && inputs.source && inputs.medium && inputs.campaign
                    ? generateBulkURLs()
                    : "Generated URLs will appear here..."}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === "history" && (
          <div style={{ background: "#fff", borderRadius: "0 16px 16px 16px", border: "1px solid #e8ecf0", padding: "28px", marginBottom: 48, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontWeight: 700, fontSize: 18, color: "#0f172a", marginBottom: 6 }}>Recent UTM Links</h2>
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>Last 5 generated URLs — saved locally in your browser</p>
            {history.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 24px", color: "#94a3b8" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🕐</div>
                <p>No history yet — generate a UTM link to see it here</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {history.map((h, i) => (
                  <div key={i} style={{ background: "#f8fafc", borderRadius: 12, padding: "16px", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        {[h.source, h.medium, h.campaign].map(tag => (
                          <span key={tag} style={{ fontSize: 11, background: "#35d0b2", color: "#030a10", padding: "2px 8px", borderRadius: 100, fontWeight: 600 }}>{tag}</span>
                        ))}
                      </div>
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>{h.date}</span>
                    </div>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                      color: "#64748b", wordBreak: "break-all", marginBottom: 8,
                    }}>{h.url}</div>
                    <button onClick={() => navigator.clipboard.writeText(h.url)} style={{
                      background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6,
                      padding: "4px 12px", fontSize: 11, fontWeight: 600,
                      color: "#374151", cursor: "pointer", fontFamily: "'Poppins', sans-serif",
                    }}>📋 Copy</button>
                  </div>
                ))}
                <button onClick={() => { setHistory([]); try { localStorage.removeItem("utm_history"); } catch {} }} style={{
                  background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8,
                  padding: "8px 16px", fontSize: 12, fontWeight: 600,
                  color: "#dc2626", cursor: "pointer", fontFamily: "'Poppins', sans-serif", alignSelf: "flex-start",
                }}>🗑️ Clear History</button>
              </div>
            )}
          </div>
        )}

        {/* AI Insights */}
        {aiInsights.length > 0 && activeTab === "builder" && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "rgba(53,208,178,0.12)", border: "1px solid rgba(53,208,178,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
              }}>🤖</div>
              <div>
                <h2 style={{ fontWeight: 800, fontSize: 18, color: "#0f172a" }}>AI Insights</h2>
                <p style={{ color: "#64748b", fontSize: 13 }}>Smart recommendations for your campaign</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
              {aiInsights.map((ins, i) => {
                const cfg = {
                  success: { bg: "#f0fdf4", border: "#bbf7d0", ic: "#16a34a" },
                  warn: { bg: "#fffbeb", border: "#fde68a", ic: "#d97706" },
                  info: { bg: "#eff6ff", border: "#bfdbfe", ic: "#2563eb" },
                };
                const c = cfg[ins.type] || cfg.info;
                return (
                  <div key={i} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, padding: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 18 }}>{ins.icon}</span>
                      <span style={{ fontWeight: 700, fontSize: 14, color: c.ic }}>{ins.title}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{ins.msg}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* How It Works */}
        <div style={{ background: "#ffffff", borderRadius: 16, padding: "48px 40px", marginBottom: 32, border: "1px solid #e8ecf0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 48, alignItems: "start" }}>
            <div>
              <div style={{
                display: "inline-block", background: "rgba(53,208,178,0.1)",
                border: "1px solid rgba(53,208,178,0.2)", borderRadius: 100,
                padding: "4px 14px", color: "#35d0b2", fontSize: 12, fontWeight: 600, marginBottom: 16,
              }}>How It Works</div>
              <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.8px", lineHeight: 1.3, color: "#0f172a" }}>
                How to Build Your UTM Campaign URL
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[
                ["Step 1 — Choose a platform preset", "Click a platform button (Google, Facebook, Instagram etc.) to auto-fill Source and Medium in one click."],
                ["Step 2 — Enter your URL", "Paste the landing page URL you want to track — the page customers will land on after clicking your link."],
                ["Step 3 — Name your campaign", "Enter a campaign name using underscores (e.g. diwali_sale_2025) so GA4 reports are clean and readable."],
                ["Step 4 — Copy and use", "Copy the generated UTM URL and use it in your ads, emails, social posts or WhatsApp campaigns."],
              ].map(([title, desc]) => (
                <div key={title} style={{ display: "flex", gap: 14, background: "#f8fafc", borderRadius: 12, padding: "18px", border: "1px solid #e8ecf0" }}>
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

        {/* FAQ */}
        <div style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #e8ecf0", padding: "32px", marginBottom: 48, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{
            display: "inline-block", background: "rgba(53,208,178,0.1)",
            border: "1px solid rgba(53,208,178,0.2)", borderRadius: 100,
            padding: "4px 14px", color: "#35d0b2", fontSize: 12, fontWeight: 600, marginBottom: 16,
          }}>FAQ</div>
          <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 24, color: "#0f172a" }}>Frequently Asked Questions</h2>
          {[
            ["What are UTM parameters?", "UTM parameters are tags added to URLs that help analytics tools like Google Analytics track where your traffic comes from. They include source, medium, campaign, term and content."],
            ["Which UTM parameters are required?", "utm_source, utm_medium, and utm_campaign are required. utm_term and utm_content are optional but recommended for paid search and A/B testing."],
            ["Why should I use lowercase in UTM parameters?", "Google Analytics 4 is case-sensitive. 'Instagram' and 'instagram' appear as two different sources in GA4 reports. Always use lowercase for consistency."],
            ["Can I use spaces in campaign names?", "No — spaces break URLs. Use underscores (diwali_sale) or hyphens (diwali-sale) instead. Our validator will warn you if spaces are detected."],
            ["What is utm_content used for?", "utm_content helps you A/B test ads or links. For example, if you have two banner designs, use utm_content=banner_v1 and utm_content=banner_v2 to see which performs better."],
            ["Will UTM links work on all platforms?", "Yes — UTM parameters work with Google Analytics 4, Adobe Analytics, Mixpanel, and most other analytics platforms. They're a universal standard."],
          ].map(([q, a]) => <FAQItem key={q} q={q} a={a} />)}
        </div>
      </div>
    </div>
  );
}

export default UTMBuilder;