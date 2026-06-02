import React, { useState, useRef, useCallback } from "react";
import JsBarcode from "jsbarcode";

const COURIERS = [
  { id: "delhivery", name: "Delhivery", icon: "🚀", color: "#ef4444", bg: "#fef2f2" },
  { id: "bluedart", name: "Bluedart", icon: "💙", color: "#2563eb", bg: "#eff6ff" },
  { id: "dtdc", name: "DTDC", icon: "📦", color: "#f59e0b", bg: "#fffbeb" },
  { id: "xpressbees", name: "XpressBees", icon: "🐝", color: "#f97316", bg: "#fff7ed" },
  { id: "ekart", name: "Ekart", icon: "🛒", color: "#0891b2", bg: "#ecfeff" },
  { id: "shadowfax", name: "Shadowfax", icon: "⚡", color: "#7c3aed", bg: "#f5f3ff" },
  { id: "custom", name: "Custom", icon: "✏️", color: "#64748b", bg: "#f8fafc" },
];

const LABEL_SIZES = [
  { id: "4x6", label: "4×6 inch", width: 400, height: 600 },
  { id: "6x4", label: "6×4 inch", width: 600, height: 400 },
  { id: "a4", label: "A4 Paper", width: 595, height: 842 },
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry",
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

function BarcodeDisplay({ value }) {
  const ref = useRef(null);
  React.useEffect(() => {
    if (ref.current && value) {
      try {
        JsBarcode(ref.current, value, {
          format: "CODE128", width: 2, height: 50,
          displayValue: true, fontSize: 11, margin: 4,
          lineColor: "#0f172a", background: "transparent",
        });
      } catch {}
    }
  }, [value]);
  if (!value) return null;
  return <svg ref={ref} style={{ maxWidth: "100%" }} />;
}

function LabelPreview({ inputs }) {
  const courier = COURIERS.find(c => c.id === inputs.courier) || COURIERS[0];
  const labelSize = LABEL_SIZES.find(s => s.id === inputs.labelSize) || LABEL_SIZES[0];
  const scale = 480 / labelSize.width;

  return (
    <div
      id="shipping-label"
      style={{
        width: labelSize.width * scale,
        height: labelSize.height * scale,
        background: "#fff",
        border: "2px solid #0f172a",
        borderRadius: 8,
        overflow: "hidden",
        fontFamily: "'Poppins', sans-serif",
        position: "relative",
        fontSize: 12 * scale,
      }}
    >
      {/* Header */}
      <div style={{
        background: "#0f172a", color: "#fff",
        padding: `${8 * scale}px ${12 * scale}px`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 14 * scale, fontWeight: 800, letterSpacing: "-0.5px" }}>
            {courier.icon} {inputs.courier === "custom" && inputs.customCourier ? inputs.customCourier : courier.name}
          </div>
          <div style={{ fontSize: 9 * scale, color: "#94a3b8", marginTop: 1 }}>SHIPPING LABEL</div>
        </div>
        <div style={{ textAlign: "right" }}>
          {inputs.orderId && (
            <div style={{ fontSize: 10 * scale, color: "#35d0b2", fontWeight: 700 }}>
              AWB: {inputs.orderId}
            </div>
          )}
          {inputs.weight && (
            <div style={{ fontSize: 9 * scale, color: "#94a3b8" }}>{inputs.weight} kg</div>
          )}
        </div>
      </div>

      {/* COD Badge */}
      {inputs.codEnabled && inputs.codAmount && (
        <div style={{
          background: "#dc2626", color: "#fff",
          padding: `${4 * scale}px ${12 * scale}px`,
          fontSize: 11 * scale, fontWeight: 800,
          textAlign: "center", letterSpacing: "1px",
        }}>
          COD: ₹{inputs.codAmount} — COLLECT BEFORE DELIVERY
        </div>
      )}

      {/* Fragile badge */}
      {inputs.fragile && (
        <div style={{
          background: "#fef9c3", color: "#854d0e",
          padding: `${3 * scale}px ${12 * scale}px`,
          fontSize: 10 * scale, fontWeight: 700,
          textAlign: "center", border: `1px solid #fde68a`,
        }}>
          ⚠️ FRAGILE — HANDLE WITH CARE
        </div>
      )}

      {/* FROM / TO */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
        {/* FROM */}
        <div style={{
          padding: `${10 * scale}px ${12 * scale}px`,
          borderRight: "1px solid #e2e8f0",
          borderBottom: "1px solid #e2e8f0",
        }}>
          <div style={{ fontSize: 9 * scale, fontWeight: 700, color: "#94a3b8", letterSpacing: "1px", marginBottom: 4 * scale }}>
            FROM
          </div>
          <div style={{ fontWeight: 800, fontSize: 12 * scale, color: "#0f172a" }}>{inputs.senderName || "Sender Name"}</div>
          {inputs.senderCompany && <div style={{ fontSize: 10 * scale, color: "#64748b" }}>{inputs.senderCompany}</div>}
          <div style={{ fontSize: 10 * scale, color: "#374151", marginTop: 3 * scale, lineHeight: 1.4 }}>
            {inputs.senderAddress1 && <div>{inputs.senderAddress1}</div>}
            {inputs.senderAddress2 && <div>{inputs.senderAddress2}</div>}
            {(inputs.senderCity || inputs.senderState) && (
              <div>{[inputs.senderCity, inputs.senderState].filter(Boolean).join(", ")}</div>
            )}
            {inputs.senderPin && <div>PIN: {inputs.senderPin}</div>}
          </div>
          {inputs.senderPhone && (
            <div style={{ fontSize: 10 * scale, color: "#0f172a", fontWeight: 600, marginTop: 4 * scale }}>
              📞 {inputs.senderPhone}
            </div>
          )}
        </div>

        {/* TO */}
        <div style={{
          padding: `${10 * scale}px ${12 * scale}px`,
          borderBottom: "1px solid #e2e8f0",
          background: "#fafafa",
        }}>
          <div style={{ fontSize: 9 * scale, fontWeight: 700, color: "#94a3b8", letterSpacing: "1px", marginBottom: 4 * scale }}>
            TO
          </div>
          <div style={{ fontWeight: 800, fontSize: 13 * scale, color: "#0f172a" }}>{inputs.receiverName || "Receiver Name"}</div>
          <div style={{ fontSize: 10 * scale, color: "#374151", marginTop: 3 * scale, lineHeight: 1.4 }}>
            {inputs.receiverAddress1 && <div>{inputs.receiverAddress1}</div>}
            {inputs.receiverAddress2 && <div>{inputs.receiverAddress2}</div>}
            {(inputs.receiverCity || inputs.receiverState) && (
              <div>{[inputs.receiverCity, inputs.receiverState].filter(Boolean).join(", ")}</div>
            )}
            {inputs.receiverPin && (
              <div style={{ fontWeight: 800, fontSize: 13 * scale, color: "#0f172a", marginTop: 3 * scale }}>
                PIN: {inputs.receiverPin}
              </div>
            )}
          </div>
          {inputs.receiverPhone && (
            <div style={{ fontSize: 11 * scale, color: "#0f172a", fontWeight: 700, marginTop: 4 * scale }}>
              📞 {inputs.receiverPhone}
            </div>
          )}
        </div>
      </div>

      {/* Product description */}
      {inputs.productDesc && (
        <div style={{
          padding: `${6 * scale}px ${12 * scale}px`,
          borderBottom: "1px solid #e2e8f0",
          background: "#f8fafc",
        }}>
          <span style={{ fontSize: 9 * scale, fontWeight: 700, color: "#94a3b8" }}>PRODUCT: </span>
          <span style={{ fontSize: 10 * scale, color: "#374151" }}>{inputs.productDesc}</span>
          {inputs.productValue && (
            <span style={{ fontSize: 10 * scale, color: "#374151" }}> | Value: ₹{inputs.productValue}</span>
          )}
        </div>
      )}

      {/* Special instructions */}
      {inputs.specialInstructions && (
        <div style={{
          padding: `${5 * scale}px ${12 * scale}px`,
          borderBottom: "1px solid #e2e8f0",
          background: "#fffbeb",
        }}>
          <span style={{ fontSize: 9 * scale, fontWeight: 700, color: "#d97706" }}>NOTE: </span>
          <span style={{ fontSize: 9 * scale, color: "#374151" }}>{inputs.specialInstructions}</span>
        </div>
      )}

      {/* Barcode */}
      <div style={{
        padding: `${8 * scale}px ${12 * scale}px`,
        display: "flex", justifyContent: "center", alignItems: "center",
        background: "#fff",
      }}>
        {inputs.orderId ? (
          <BarcodeDisplay value={inputs.orderId} />
        ) : (
          <div style={{ color: "#94a3b8", fontSize: 10 * scale, padding: `${8 * scale}px` }}>
            Enter Order ID to generate barcode
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        background: "#f8fafc", borderTop: "1px solid #e2e8f0",
        padding: `${5 * scale}px ${12 * scale}px`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 8 * scale, color: "#94a3b8" }}>Generated by BaazarIQ</span>
        {inputs.returnLabel && (
          <span style={{ fontSize: 8 * scale, color: "#dc2626", fontWeight: 700 }}>RETURN LABEL</span>
        )}
        <span style={{ fontSize: 8 * scale, color: "#94a3b8" }}>
          {new Date().toLocaleDateString("en-IN")}
        </span>
      </div>
    </div>
  );
}

function ShippingLabelGenerator() {
  const [inputs, setInputs] = useState({
    // Sender
    senderName: "", senderCompany: "", senderAddress1: "",
    senderAddress2: "", senderCity: "", senderState: "Delhi",
    senderPin: "", senderPhone: "",
    // Receiver
    receiverName: "", receiverAddress1: "",
    receiverAddress2: "", receiverCity: "", receiverState: "",
    receiverPin: "", receiverPhone: "",
    // Package
    orderId: "", weight: "", length: "", width: "", height: "",
    productDesc: "", productValue: "",
    // Options
    courier: "delhivery", customCourier: "",
    labelSize: "6x4", codEnabled: false, codAmount: "",
    fragile: false, returnLabel: false, specialInstructions: "",
  });
  const [activeSection, setActiveSection] = useState("sender");

  const set = useCallback((k, v) => {
    setInputs(prev => {
      if (prev[k] === v) return prev;
      return { ...prev, [k]: v };
    });
  }, []);

  const swapAddresses = () => {
    setInputs(prev => ({
      ...prev,
      senderName: prev.receiverName,
      senderCompany: "",
      senderAddress1: prev.receiverAddress1,
      senderAddress2: prev.receiverAddress2,
      senderCity: prev.receiverCity,
      senderState: prev.receiverState,
      senderPin: prev.receiverPin,
      senderPhone: prev.receiverPhone,
      receiverName: prev.senderName,
      receiverAddress1: prev.senderAddress1,
      receiverAddress2: prev.senderAddress2,
      receiverCity: prev.senderCity,
      receiverState: prev.senderState,
      receiverPin: prev.senderPin,
      receiverPhone: prev.senderPhone,
    }));
  };

  const printLabel = () => {
    const label = document.getElementById("shipping-label");
    if (!label) return;
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>Shipping Label</title>
      <style>
        body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #fff; }
        @media print { body { margin: 0; } }
      </style></head>
      <body>${label.outerHTML}
      <script>window.onload = function() { window.print(); window.close(); }</script>
      </body></html>
    `);
    win.document.close();
  };

  const getAIWarnings = () => {
    const warnings = [];
    if (inputs.senderPin && inputs.senderPin.length !== 6) warnings.push({ type: "error", msg: "Sender PIN code must be exactly 6 digits" });
    if (inputs.receiverPin && inputs.receiverPin.length !== 6) warnings.push({ type: "error", msg: "Receiver PIN code must be exactly 6 digits" });
    if (inputs.senderPhone && inputs.senderPhone.replace(/\D/g, "").length !== 10) warnings.push({ type: "warn", msg: "Sender phone should be 10 digits" });
    if (inputs.receiverPhone && inputs.receiverPhone.replace(/\D/g, "").length !== 10) warnings.push({ type: "warn", msg: "Receiver phone should be 10 digits" });
    if (inputs.codEnabled && !inputs.codAmount) warnings.push({ type: "warn", msg: "COD is enabled but amount is not entered" });
    if (!inputs.orderId) warnings.push({ type: "info", msg: "Enter Order ID to auto-generate barcode on label" });
    if (inputs.weight && parseFloat(inputs.weight) > 30) warnings.push({ type: "warn", msg: "Weight above 30kg — verify with courier for heavy shipment charges" });
    return warnings;
  };

  const warnings = getAIWarnings();
  const inputStyle = {
    padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8,
    fontSize: 13, background: "#fff", outline: "none", width: "100%",
    fontFamily: "'Poppins', sans-serif", color: "#0f172a",
  };
  const labelStyle = { fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 };

  const sections = [
    { id: "sender", label: "📤 Sender" },
    { id: "receiver", label: "📥 Receiver" },
    { id: "package", label: "📦 Package" },
    { id: "options", label: "⚙️ Options" },
  ];

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
            <span style={{ fontSize: 16 }}>🏷️</span>
            <span style={{ color: "#35d0b2", fontSize: 14, fontWeight: 600 }}>Free Shipping Label Generator</span>
          </div>
          <p style={{ color: "#35d0b2", fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
            Professional Shipping Labels for Indian Ecommerce Sellers
          </p>
          <h1 style={{
            fontSize: "clamp(42px, 6vw, 72px)", fontWeight: 900,
            letterSpacing: "-2px", lineHeight: 1.1, color: "#f8fafc", marginBottom: 20,
          }}>
            Shipping Label Generator
            <br />
            for Sellers
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 18, maxWidth: 620, margin: "0 auto 16px", lineHeight: 1.75 }}>
            Generate professional shipping labels with auto barcode, COD badge, courier
            branding and fragile warnings — print directly from browser or save as PDF, free forever.
          </p>
          <p style={{ color: "#64748b", fontSize: 15, maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.7 }}>
            Supports Delhivery, Bluedart, DTDC, XpressBees, Ekart and Shadowfax — with
            live label preview, return label mode and AI validation for every shipment.
          </p>
          <div style={{
            display: "flex", justifyContent: "center", gap: 0, flexWrap: "wrap",
            borderTop: "1px solid rgba(53,208,178,0.15)", paddingTop: 28,
          }}>
            {[
              ["6 Couriers", "Supported"],
              ["Auto Barcode", "From Order ID"],
              ["COD Badge", "Included"],
              ["Print Ready", "Direct Printing"],
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24, paddingBottom: 48, alignItems: "start" }}>


          {/* LEFT: Form */}
          <div style={{
            background: "#fff", borderRadius: 16,
            border: "1px solid #e8ecf0", overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}>
            {/* Section tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid #e8ecf0", background: "#f8fafc" }}>
              {sections.map(s => (
                <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
                  flex: 1, padding: "12px 8px", border: "none",
                  background: activeSection === s.id ? "#fff" : "transparent",
                  color: activeSection === s.id ? "#35d0b2" : "#64748b",
                  fontWeight: 600, fontSize: 12, cursor: "pointer",
                  fontFamily: "'Poppins', sans-serif",
                  borderBottom: activeSection === s.id ? "2px solid #35d0b2" : "2px solid transparent",
                }}>{s.label}</button>
              ))}
            </div>

            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 14 }}>

              {/* SENDER SECTION */}
              {activeSection === "sender" && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={labelStyle}>Sender Name *</label>
                      <input type="text" value={inputs.senderName} onChange={e => set("senderName", e.target.value)}
                        placeholder="Rahul Sharma" style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = "#35d0b2"; }}
                        onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                    </div>
                    <div>
                      <label style={labelStyle}>Business / Company Name</label>
                      <input type="text" value={inputs.senderCompany} onChange={e => set("senderCompany", e.target.value)}
                        placeholder="BaazarIQ Store" style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = "#35d0b2"; }}
                        onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Address Line 1 *</label>
                    <input type="text" value={inputs.senderAddress1} onChange={e => set("senderAddress1", e.target.value)}
                      placeholder="Shop No. 12, Market Road" style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = "#35d0b2"; }}
                      onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Address Line 2</label>
                    <input type="text" value={inputs.senderAddress2} onChange={e => set("senderAddress2", e.target.value)}
                      placeholder="Near Bus Stand, Laxmi Nagar" style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = "#35d0b2"; }}
                      onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={labelStyle}>City *</label>
                      <input type="text" value={inputs.senderCity} onChange={e => set("senderCity", e.target.value)}
                        placeholder="New Delhi" style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = "#35d0b2"; }}
                        onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                    </div>
                    <div>
                      <label style={labelStyle}>State *</label>
                      <select value={inputs.senderState} onChange={e => set("senderState", e.target.value)}
                        style={{ ...inputStyle }}
                        onFocus={e => { e.target.style.borderColor = "#35d0b2"; }}
                        onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }}>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>PIN Code *</label>
                      <input type="text" value={inputs.senderPin} onChange={e => set("senderPin", e.target.value.slice(0, 6))}
                        placeholder="110001" style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = "#35d0b2"; }}
                        onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Phone Number *</label>
                    <input type="text" value={inputs.senderPhone} onChange={e => set("senderPhone", e.target.value)}
                      placeholder="9876543210" style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = "#35d0b2"; }}
                      onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                  </div>
                  <button onClick={() => setActiveSection("receiver")} style={{
                    background: "#35d0b2", color: "#030a10", border: "none",
                    padding: "11px", borderRadius: 10, fontSize: 14, fontWeight: 700,
                    cursor: "pointer", fontFamily: "'Poppins', sans-serif",
                  }}>Next: Receiver Details →</button>
                </>
              )}

              {/* RECEIVER SECTION */}
              {activeSection === "receiver" && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: "#64748b" }}>Enter receiver details</span>
                    <button onClick={swapAddresses} style={{
                      background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8,
                      padding: "5px 12px", fontSize: 12, fontWeight: 600,
                      color: "#16a34a", cursor: "pointer", fontFamily: "'Poppins', sans-serif",
                    }}>⇄ Swap Addresses</button>
                  </div>
                  <div>
                    <label style={labelStyle}>Receiver Name *</label>
                    <input type="text" value={inputs.receiverName} onChange={e => set("receiverName", e.target.value)}
                      placeholder="Priya Patel" style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = "#35d0b2"; }}
                      onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Address Line 1 *</label>
                    <input type="text" value={inputs.receiverAddress1} onChange={e => set("receiverAddress1", e.target.value)}
                      placeholder="Flat 402, Sunrise Apartments" style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = "#35d0b2"; }}
                      onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Address Line 2</label>
                    <input type="text" value={inputs.receiverAddress2} onChange={e => set("receiverAddress2", e.target.value)}
                      placeholder="MG Road, Andheri West" style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = "#35d0b2"; }}
                      onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={labelStyle}>City *</label>
                      <input type="text" value={inputs.receiverCity} onChange={e => set("receiverCity", e.target.value)}
                        placeholder="Mumbai" style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = "#35d0b2"; }}
                        onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                    </div>
                    <div>
                      <label style={labelStyle}>State *</label>
                      <select value={inputs.receiverState} onChange={e => set("receiverState", e.target.value)}
                        style={{ ...inputStyle }}
                        onFocus={e => { e.target.style.borderColor = "#35d0b2"; }}
                        onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }}>
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>PIN Code *</label>
                      <input type="text" value={inputs.receiverPin} onChange={e => set("receiverPin", e.target.value.slice(0, 6))}
                        placeholder="400001" style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = "#35d0b2"; }}
                        onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Phone Number *</label>
                    <input type="text" value={inputs.receiverPhone} onChange={e => set("receiverPhone", e.target.value)}
                      placeholder="9876543210" style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = "#35d0b2"; }}
                      onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => setActiveSection("sender")} style={{
                      flex: 1, background: "#f1f5f9", color: "#374151", border: "1px solid #e2e8f0",
                      padding: "11px", borderRadius: 10, fontSize: 14, fontWeight: 700,
                      cursor: "pointer", fontFamily: "'Poppins', sans-serif",
                    }}>← Back</button>
                    <button onClick={() => setActiveSection("package")} style={{
                      flex: 2, background: "#35d0b2", color: "#030a10", border: "none",
                      padding: "11px", borderRadius: 10, fontSize: 14, fontWeight: 700,
                      cursor: "pointer", fontFamily: "'Poppins', sans-serif",
                    }}>Next: Package Details →</button>
                  </div>
                </>
              )}

              {/* PACKAGE SECTION */}
              {activeSection === "package" && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={labelStyle}>Order ID / AWB *</label>
                      <input type="text" value={inputs.orderId} onChange={e => set("orderId", e.target.value)}
                        placeholder="ORD-2025-001234" style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = "#35d0b2"; }}
                        onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>Auto-generates barcode</span>
                    </div>
                    <div>
                      <label style={labelStyle}>Weight (kg) *</label>
                      <input type="text" value={inputs.weight} onChange={e => set("weight", e.target.value)}
                        placeholder="0.5" style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = "#35d0b2"; }}
                        onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    {["length", "width", "height"].map(dim => (
                      <div key={dim}>
                        <label style={labelStyle}>{dim.charAt(0).toUpperCase() + dim.slice(1)} (cm)</label>
                        <input type="text" value={inputs[dim]} onChange={e => set(dim, e.target.value)}
                          placeholder="30" style={inputStyle}
                          onFocus={e => { e.target.style.borderColor = "#35d0b2"; }}
                          onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label style={labelStyle}>Product Description</label>
                    <input type="text" value={inputs.productDesc} onChange={e => set("productDesc", e.target.value)}
                      placeholder="Men's Running Shoes, Size 10" style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = "#35d0b2"; }}
                      onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Declared Product Value (₹)</label>
                    <input type="text" value={inputs.productValue} onChange={e => set("productValue", e.target.value)}
                      placeholder="999" style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = "#35d0b2"; }}
                      onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Special Instructions</label>
                    <input type="text" value={inputs.specialInstructions} onChange={e => set("specialInstructions", e.target.value)}
                      placeholder="Do not bend, Keep dry" style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = "#35d0b2"; }}
                      onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => setActiveSection("receiver")} style={{
                      flex: 1, background: "#f1f5f9", color: "#374151", border: "1px solid #e2e8f0",
                      padding: "11px", borderRadius: 10, fontSize: 14, fontWeight: 700,
                      cursor: "pointer", fontFamily: "'Poppins', sans-serif",
                    }}>← Back</button>
                    <button onClick={() => setActiveSection("options")} style={{
                      flex: 2, background: "#35d0b2", color: "#030a10", border: "none",
                      padding: "11px", borderRadius: 10, fontSize: 14, fontWeight: 700,
                      cursor: "pointer", fontFamily: "'Poppins', sans-serif",
                    }}>Next: Options →</button>
                  </div>
                </>
              )}

              {/* OPTIONS SECTION */}
              {activeSection === "options" && (
                <>
                  {/* Courier selector */}
                  <div>
                    <label style={labelStyle}>Courier Partner</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                      {COURIERS.map(c => (
                        <button key={c.id} onClick={() => set("courier", c.id)} style={{
                          padding: "8px 6px", borderRadius: 8, cursor: "pointer",
                          border: `1.5px solid ${inputs.courier === c.id ? c.color : "#e2e8f0"}`,
                          background: inputs.courier === c.id ? c.bg : "#fff",
                          display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                          fontFamily: "'Poppins', sans-serif", transition: "all 0.15s",
                        }}>
                          <span style={{ fontSize: 18 }}>{c.icon}</span>
                          <span style={{ fontSize: 10, fontWeight: 600, color: inputs.courier === c.id ? c.color : "#64748b" }}>{c.name}</span>
                        </button>
                      ))}
                    </div>
                    {inputs.courier === "custom" && (
                      <input type="text" value={inputs.customCourier} onChange={e => set("customCourier", e.target.value)}
                        placeholder="Enter courier name" style={{ ...inputStyle, marginTop: 8 }}
                        onFocus={e => { e.target.style.borderColor = "#35d0b2"; }}
                        onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                    )}
                  </div>

                  {/* Label size */}
                  <div>
                    <label style={labelStyle}>Label Size</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {LABEL_SIZES.map(s => (
                        <button key={s.id} onClick={() => set("labelSize", s.id)} style={{
                          flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer",
                          border: `1.5px solid ${inputs.labelSize === s.id ? "#35d0b2" : "#e2e8f0"}`,
                          background: inputs.labelSize === s.id ? "rgba(53,208,178,0.08)" : "#fff",
                          color: inputs.labelSize === s.id ? "#35d0b2" : "#64748b",
                          fontWeight: 600, fontSize: 12, fontFamily: "'Poppins', sans-serif",
                        }}>{s.label}</button>
                      ))}
                    </div>
                  </div>

                  {/* COD Toggle */}
                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: "14px", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: inputs.codEnabled ? 12 : 0 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>💵 Cash on Delivery (COD)</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>Shows COD amount on label</div>
                      </div>
                      <button onClick={() => set("codEnabled", !inputs.codEnabled)} style={{
                        width: 44, height: 24, borderRadius: 100,
                        background: inputs.codEnabled ? "#35d0b2" : "#e2e8f0",
                        border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s",
                      }}>
                        <div style={{
                          position: "absolute", top: 2, left: inputs.codEnabled ? 22 : 2,
                          width: 20, height: 20, borderRadius: "50%",
                          background: "#fff", transition: "left 0.2s",
                        }} />
                      </button>
                    </div>
                    {inputs.codEnabled && (
                      <input type="text" value={inputs.codAmount} onChange={e => set("codAmount", e.target.value)}
                        placeholder="Enter COD amount (₹)" style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = "#35d0b2"; }}
                        onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }} />
                    )}
                  </div>

                  {/* Fragile Toggle */}
                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: "14px", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>⚠️ Fragile Item</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>Adds "Handle with Care" warning on label</div>
                      </div>
                      <button onClick={() => set("fragile", !inputs.fragile)} style={{
                        width: 44, height: 24, borderRadius: 100,
                        background: inputs.fragile ? "#35d0b2" : "#e2e8f0",
                        border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s",
                      }}>
                        <div style={{
                          position: "absolute", top: 2, left: inputs.fragile ? 22 : 2,
                          width: 20, height: 20, borderRadius: "50%",
                          background: "#fff", transition: "left 0.2s",
                        }} />
                      </button>
                    </div>
                  </div>

                  {/* Return Label Toggle */}
                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: "14px", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>🔄 Return Label</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>Marks label as return shipment</div>
                      </div>
                      <button onClick={() => set("returnLabel", !inputs.returnLabel)} style={{
                        width: 44, height: 24, borderRadius: 100,
                        background: inputs.returnLabel ? "#35d0b2" : "#e2e8f0",
                        border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s",
                      }}>
                        <div style={{
                          position: "absolute", top: 2, left: inputs.returnLabel ? 22 : 2,
                          width: 20, height: 20, borderRadius: "50%",
                          background: "#fff", transition: "left 0.2s",
                        }} />
                      </button>
                    </div>
                  </div>

                  <button onClick={() => setActiveSection("sender")} style={{
                    background: "#f1f5f9", color: "#374151", border: "1px solid #e2e8f0",
                    padding: "11px", borderRadius: 10, fontSize: 14, fontWeight: 700,
                    cursor: "pointer", fontFamily: "'Poppins', sans-serif",
                  }}>← Back to Sender</button>
                </>
              )}
            </div>
          {/* Checklist */}
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", marginBottom: 12 }}>Label Checklist</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  ["Sender Name", !!inputs.senderName],
                  ["Sender Address", !!inputs.senderAddress1],
                  ["Sender PIN Code", inputs.senderPin.length === 6],
                  ["Receiver Name", !!inputs.receiverName],
                  ["Receiver Address", !!inputs.receiverAddress1],
                  ["Receiver PIN Code", inputs.receiverPin.length === 6],
                  ["Order ID / Barcode", !!inputs.orderId],
                  ["Weight", !!inputs.weight],
                ].map(([label, done]) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                    <span style={{ fontSize: 14, color: done ? "#16a34a" : "#e2e8f0" }}>{done ? "✅" : "⬜"}</span>
                    <span style={{ color: done ? "#374151" : "#94a3b8" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Preview */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 24 }}>

            {/* Label Preview */}
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>Label Preview</h3>
                  <p style={{ fontSize: 12, color: "#94a3b8" }}>Live preview — updates as you type</p>
                </div>
                <div style={{
                  background: "rgba(53,208,178,0.1)", border: "1px solid rgba(53,208,178,0.2)",
                  borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 600, color: "#35d0b2",
                }}>
                  {LABEL_SIZES.find(s => s.id === inputs.labelSize)?.label}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                <LabelPreview inputs={inputs} />
              </div>

              {/* Print/Download buttons */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <button onClick={printLabel} style={{
                  background: "#35d0b2", color: "#030a10", border: "none",
                  padding: "12px", borderRadius: 10, fontSize: 14, fontWeight: 700,
                  cursor: "pointer", fontFamily: "'Poppins', sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                  🖨️ Print Label
                </button>
                <button onClick={printLabel} style={{
                  background: "#fff", color: "#374151", border: "1px solid #e2e8f0",
                  padding: "12px", borderRadius: 10, fontSize: 14, fontWeight: 700,
                  cursor: "pointer", fontFamily: "'Poppins', sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                  ⬇️ Save as PDF
                </button>
              </div>
            </div>

            {/* AI Warnings */}
            {warnings.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 18 }}>🤖</span>
                  <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>AI Validation</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {warnings.map((w, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: 8,
                      padding: "8px 12px", borderRadius: 8,
                      background: w.type === "error" ? "#fef2f2" : w.type === "warn" ? "#fffbeb" : "#eff6ff",
                      border: `1px solid ${w.type === "error" ? "#fecaca" : w.type === "warn" ? "#fde68a" : "#bfdbfe"}`,
                    }}>
                      <span style={{ fontSize: 14, flexShrink: 0 }}>
                        {w.type === "error" ? "❌" : w.type === "warn" ? "⚠️" : "ℹ️"}
                      </span>
                      <span style={{ fontSize: 12, color: w.type === "error" ? "#dc2626" : w.type === "warn" ? "#d97706" : "#2563eb" }}>
                        {w.msg}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            </div>
        </div>

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
                How to Create Your Shipping Label in 60 Seconds
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[
                ["Step 1 — Enter sender details", "Add your business name, full address and phone number so couriers can contact you if needed."],
                ["Step 2 — Enter receiver details", "Add the customer's complete delivery address including PIN code — this is critical for delivery."],
                ["Step 3 — Add package details", "Enter weight, dimensions and Order ID. The Order ID auto-generates a scannable barcode."],
                ["Step 4 — Print or save PDF", "Preview the label, choose your courier, enable COD if needed, then print directly or save as PDF."],
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
            ["What information is required on a shipping label?", "A shipping label must include sender name and address, receiver name and address, PIN codes, phone numbers, and a tracking barcode. COD amount is required for cash on delivery orders."],
            ["Can I print on regular paper?", "Yes — you can print on A4 plain paper and cut it out. However, thermal label paper (4×6 inch) is recommended for professional shipping as it's waterproof and adhesive."],
            ["What is a return label?", "A return label has the sender and receiver addresses swapped. Use the Return Label toggle to instantly generate one when a customer wants to return a product."],
            ["How is the barcode generated?", "The barcode is automatically generated from your Order ID using Code 128 format — the same standard used by all major Indian couriers including Delhivery, Bluedart and DTDC."],
            ["What is COD on a shipping label?", "COD (Cash on Delivery) means the delivery person collects payment from the customer at the time of delivery. The COD amount is displayed prominently on the label so the delivery person knows how much to collect."],
          ].map(([q, a]) => <FAQItem key={q} q={q} a={a} />)}
        </div>
      </div>
    </div>
  );
}

export default ShippingLabelGenerator;