import React, { useState, useEffect, useRef, useCallback } from "react";
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";

const BARCODE_TYPES = [
  {
    id: "EAN13",
    label: "EAN-13",
    icon: "🔢",
    desc: "International retail standard — 13 digits",
    placeholder: "5901234123457",
    validate: (v) => /^\d{13}$/.test(v),
    error: "EAN-13 requires exactly 13 digits",
    useCase: "Best for international retail products sold in India, Europe and globally",
  },
  {
    id: "UPC",
    label: "UPC-A",
    icon: "🇺🇸",
    desc: "US/Canada retail standard — 12 digits",
    placeholder: "012345678905",
    validate: (v) => /^\d{12}$/.test(v),
    error: "UPC-A requires exactly 12 digits",
    useCase: "Best for products sold on US marketplaces like Amazon.com",
  },
  {
    id: "CODE128",
    label: "Code 128",
    icon: "📦",
    desc: "High density alphanumeric — warehouse & logistics",
    placeholder: "SKU-ABC-12345",
    validate: (v) => v.length >= 1 && v.length <= 80,
    error: "Code 128 supports 1-80 characters",
    useCase: "Best for internal SKUs, warehouse labels and shipment tracking",
  },
  {
    id: "CODE39",
    label: "Code 39",
    icon: "🏭",
    desc: "Industrial alphanumeric — asset tracking",
    placeholder: "PROD-001",
    validate: (v) => /^[A-Z0-9+\-. $/]+$/.test(v) && v.length >= 1,
    error: "Code 39 supports A-Z, 0-9 and special chars only",
    useCase: "Best for asset management, inventory bins and industrial use",
  },
  {
    id: "QR",
    label: "QR Code",
    icon: "⬛",
    desc: "2D code — URLs, text, product info",
    placeholder: "https://yourstore.com/product",
    validate: (v) => v.length >= 1 && v.length <= 2000,
    error: "QR Code supports up to 2000 characters",
    useCase: "Best for linking to product pages, WhatsApp, or digital catalogs",
  },
];

const LABEL_SIZES = [
  { id: "small", label: "Small — 38×25mm", width: 152, height: 100 },
  { id: "medium", label: "Medium — 50×30mm", width: 200, height: 120 },
  { id: "large", label: "Large — 100×50mm", width: 400, height: 200 },
];

function getAIRecommendation({ barcodeType }) {
  const recs = [];
  if (barcodeType === "EAN13") {
    recs.push({ type: "success", icon: "✅", title: "Great Choice for Retail", msg: "EAN-13 is accepted by Flipkart, Amazon India, Meesho and all major Indian marketplaces. Perfect for retail shelf products." });
    recs.push({ type: "info", icon: "💡", title: "Check Digit Included", msg: "The last digit of EAN-13 is a check digit. Our generator auto-validates it to ensure your barcode scans correctly." });
  }
  if (barcodeType === "UPC") {
    recs.push({ type: "info", icon: "🌐", title: "US Market Focused", msg: "UPC-A is primarily for US/Canada markets. For Indian marketplaces, EAN-13 is more widely accepted." });
  }
  if (barcodeType === "CODE128") {
    recs.push({ type: "success", icon: "📦", title: "Perfect for Internal Use", msg: "Code 128 is ideal for SKU labels, warehouse bins and shipment tracking. No registration needed." });
    recs.push({ type: "warn", icon: "⚠️", title: "Not for Retail Shelves", msg: "Code 128 is not accepted at POS systems. Use EAN-13 or UPC-A for retail product listings." });
  }
  if (barcodeType === "CODE39") {
    recs.push({ type: "info", icon: "🏭", title: "Industrial Standard", msg: "Code 39 is widely used in manufacturing and asset tracking. Good for internal inventory systems." });
  }
  if (barcodeType === "QR") {
    recs.push({ type: "success", icon: "📱", title: "Mobile Friendly", msg: "QR codes can be scanned by any smartphone. Great for product pages, WhatsApp links and digital catalogs." });
    recs.push({ type: "info", icon: "🔗", title: "Add a URL", msg: "Encode your product URL in the QR code so customers can scan and buy directly from packaging." });
  }
  return recs;
}

function BarcodeCanvas({ inputs, size }) {
  const canvasRef = useRef(null);
  const qrCanvasRef = useRef(null);
  const [error, setError] = useState("");
  const [valid, setValid] = useState(false);

  const selectedType = BARCODE_TYPES.find((t) => t.id === inputs.barcodeType);
  const labelSize = LABEL_SIZES.find((s) => s.id === size) || LABEL_SIZES[1];

  useEffect(() => {
    if (!inputs.barcodeNumber) { setValid(false); setError(""); return; }
    if (!selectedType.validate(inputs.barcodeNumber)) {
      setValid(false);
      setError(selectedType.error);
      return;
    }
    setError("");
    setValid(true);

    if (inputs.barcodeType === "QR") {
      if (qrCanvasRef.current) {
        QRCode.toCanvas(qrCanvasRef.current, inputs.barcodeNumber, {
          width: 120, margin: 1,
          color: { dark: inputs.darkMode ? "#ffffff" : "#000000", light: "#00000000" },
        }).catch(() => setError("QR generation failed"));
      }
    } else {
      if (canvasRef.current) {
        try {
          JsBarcode(canvasRef.current, inputs.barcodeNumber, {
            format: inputs.barcodeType,
            width: 2, height: 60,
            displayValue: true,
            fontSize: 12,
            margin: 8,
            lineColor: inputs.darkMode ? "#ffffff" : "#000000",
            background: "transparent",
          });
        } catch (e) {
          setError("Invalid barcode value for selected format");
          setValid(false);
        }
      }
    }
  }, [inputs.barcodeNumber, inputs.barcodeType, inputs.darkMode, selectedType]);

  const bg = inputs.darkMode ? "#1a1a2e" : "#ffffff";
  const textColor = inputs.darkMode ? "#ffffff" : "#1a1a2e";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        id="barcode-label"
        style={{
          background: bg,
          border: "2px solid #e2e8f0",
          borderRadius: 12,
          padding: 20,
          width: labelSize.width,
          minHeight: labelSize.height,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {inputs.brandName && (
          <div style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "1px" }}>
            {inputs.brandName}
          </div>
        )}
        {inputs.productName && (
          <div style={{ fontSize: 13, fontWeight: 700, color: textColor, textAlign: "center" }}>
            {inputs.productName}
          </div>
        )}
        {inputs.barcodeType === "QR" ? (
          <canvas ref={qrCanvasRef} style={{ display: valid ? "block" : "none" }} />
        ) : (
          <canvas ref={canvasRef} style={{ display: valid ? "block" : "none", maxWidth: "100%" }} />
        )}
        {!valid && !error && (
          <div style={{ padding: "20px 0", color: "#94a3b8", fontSize: 12, textAlign: "center" }}>
            Enter a valid barcode number to preview
          </div>
        )}
        {inputs.mrp && (
          <div style={{ fontSize: 13, fontWeight: 700, color: textColor }}>MRP: ₹{inputs.mrp}</div>
        )}
        {inputs.sku && (
          <div style={{ fontSize: 10, color: "#64748b" }}>SKU: {inputs.sku}</div>
        )}
      </div>

      {inputs.barcodeNumber && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 12px", borderRadius: 8,
          background: error ? "rgba(239,68,68,0.1)" : valid ? "rgba(37,99,235,0.1)" : "transparent",
          border: `1px solid ${error ? "rgba(239,68,68,0.2)" : valid ? "rgba(37,99,235,0.2)" : "transparent"}`,
        }}>
          <span style={{ fontSize: 16 }}>{error ? "❌" : valid ? "✅" : ""}</span>
          <span style={{ fontSize: 12, color: error ? "#ef4444" : "#2563eb", fontWeight: 600 }}>
            {error || (valid ? "Valid barcode — ready to download" : "")}
          </span>
        </div>
      )}
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 14, marginBottom: 14 }}>
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

function BarcodeGenerator() {
  const [inputs, setInputs] = useState({
    barcodeType: "EAN13",
    barcodeNumber: "",
    productName: "",
    brandName: "",
    mrp: "",
    sku: "",
    darkMode: false,
    labelSize: "medium",
    quantity: 1,
  });
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkList, setBulkList] = useState([]);
  const [copied, setCopied] = useState(false);

  const set = useCallback((k, v) => {
    setInputs((prev) => {
      if (prev[k] === v) return prev;
      return { ...prev, [k]: v };
    });
  }, []);

  const selectedType = BARCODE_TYPES.find((t) => t.id === inputs.barcodeType);
  const aiRecs = getAIRecommendation(inputs);

  const generateBulk = () => {
    if (!inputs.barcodeNumber) return;
    const base = inputs.barcodeNumber.replace(/\D/g, "");
    const list = [];
    for (let i = 0; i < inputs.quantity; i++) {
      const num = (parseInt(base) + i).toString().padStart(inputs.barcodeNumber.length, "0");
      list.push(num);
    }
    setBulkList(list);
  };

  const copyBarcode = () => {
    navigator.clipboard.writeText(inputs.barcodeNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadBarcode = () => {
    const label = document.getElementById("barcode-label");
    if (!label) return;
    const canvas = label.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `barcode-${inputs.barcodeNumber}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const printBarcode = () => {
    const label = document.getElementById("barcode-label");
    if (!label) return;
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>Print Barcode</title>
      <style>body{display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#fff}
      @media print{body{margin:0}}</style></head>
      <body>${label.outerHTML}<script>window.onload=()=>{window.print();window.close()}</script></body></html>
    `);
    win.document.close();
  };

  const resetForm = () => setInputs({
    barcodeType: "EAN13", barcodeNumber: "", productName: "",
    brandName: "", mrp: "", sku: "", darkMode: false,
    labelSize: "medium", quantity: 1,
  });

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "#f1f5f9", minHeight: "100vh" }}>

      {/* ✅ UPDATED HERO — matches FBA Calculator style */}
      <section style={{
        background: "#030a10",
        padding: "80px 24px 90px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background glow */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(ellipse at 30% 50%, rgba(53,208,178,0.12) 0%,transparent 60%),radial-gradient(ellipse at 70% 50%, rgba(37,99,235,0.08) 0%,transparent 60%)",
        }} />

        <div style={{ position: "relative", maxWidth: 800, margin: "0 auto" }}>

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(53,208,178,0.1)",
            border: "1px solid rgba(53,208,178,0.2)",
            borderRadius: 100, padding: "6px 18px", marginBottom: 20,
          }}>
            <span style={{ fontSize: 16 }}>📊</span>
            <span style={{ color: "#35d0b2", fontSize: 14, fontWeight: 600 }}>Free Barcode Generator</span>
          </div>

          {/* Subtitle */}
          <p style={{
            color: "#35d0b2", fontSize: 16, fontWeight: 600,
            marginBottom: 12, letterSpacing: "0.3px",
          }}>
            Generate Barcodes Instantly — No Sign-up, No Cost
          </p>

          {/* Main Heading */}
          <h1 style={{
            fontSize: "clamp(42px, 6vw, 72px)",
            fontWeight: 900,
            letterSpacing: "-2px",
            lineHeight: 1.1,
            color: "#f8fafc",
            marginBottom: 20,
          }}>
            Barcode Generator
            <br />
            for Sellers
          </h1>

          {/* Description */}
          <p style={{
            color: "#94a3b8", fontSize: 18,
            maxWidth: 620, margin: "0 auto 16px",
            lineHeight: 1.75,
          }}>
            Generate EAN-13, UPC-A, Code 128, Code 39 and QR codes instantly —
            with a built-in label designer, bulk barcode generator and AI
            recommendations for every barcode type.
          </p>
          <p style={{
            color: "#64748b", fontSize: 15,
            maxWidth: 560, margin: "0 auto 32px",
            lineHeight: 1.7,
          }}>
            Used by Indian ecommerce sellers for Amazon, Flipkart and Meesho
            product listings, warehouse labels, packaging and digital catalogs.
          </p>

          {/* Stats Bar */}
          <div style={{
            display: "flex", justifyContent: "center",
            gap: 0, flexWrap: "wrap",
            borderTop: "1px solid rgba(53,208,178,0.15)",
            paddingTop: 28,
          }}>
            {[
              ["5 Barcode Types", "EAN, UPC, QR & More"],
              ["Bulk Generator", "Up to 50 at Once"],
              ["Label Designer", "Brand + MRP + SKU"],
              ["100% Free", "No Sign-up Needed"],
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

      {/* Main */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24, paddingBottom: 48 }}>

          {/* LEFT: Form */}
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8ecf0", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
            <div style={{ padding: "22px 28px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(135deg,#f8fafc,#fff)" }}>
              <div>
                <h2 style={{ fontWeight: 800, fontSize: 17, color: "#0f172a" }}>Barcode Details</h2>
                <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 2 }}>Fill in your product information</p>
              </div>
              <button onClick={resetForm} style={{ background: "#f8fafc", border: "1px solid #e8ecf0", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#64748b", cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>↺ Reset</button>
            </div>

            <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Barcode type selector */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.4px" }}>Barcode Type</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {BARCODE_TYPES.map((t) => (
                    <button key={t.id} onClick={() => set("barcodeType", t.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, cursor: "pointer", border: `1.5px solid ${inputs.barcodeType === t.id ? "#2563eb" : "#e8ecf0"}`, background: inputs.barcodeType === t.id ? "#eff6ff" : "#f8fafc", textAlign: "left", fontFamily: "'Poppins', sans-serif", transition: "all 0.15s" }}>
                      <span style={{ fontSize: 20 }}>{t.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: inputs.barcodeType === t.id ? "#2563eb" : "#0f172a" }}>{t.label}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{t.desc}</div>
                      </div>
                      {inputs.barcodeType === t.id && <span style={{ color: "#2563eb", fontSize: 16 }}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Barcode number */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.4px" }}>Barcode Number / Data</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="text" value={inputs.barcodeNumber} onChange={(e) => set("barcodeNumber", e.target.value)} placeholder={selectedType.placeholder}
                    style={{ flex: 1, padding: "11px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, background: "#fff", color: "#0f172a", outline: "none", fontFamily: "'Poppins', sans-serif" }}
                    onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }} />
                  <button onClick={copyBarcode} style={{ background: "#f8fafc", border: "1px solid #e8ecf0", borderRadius: 10, padding: "11px 14px", cursor: "pointer", color: "#64748b", fontSize: 13 }}>
                    {copied ? "✅" : "📋"}
                  </button>
                </div>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>{selectedType.desc}</span>
              </div>

              {/* Product details */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { key: "productName", label: "Product Name", placeholder: "Pen Set" },
                  { key: "brandName", label: "Brand Name", placeholder: "MyBrand" },
                  { key: "mrp", label: "MRP / Price", placeholder: "299" },
                  { key: "sku", label: "SKU Code", placeholder: "SKU-001" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.4px" }}>{label}</label>
                    <input type="text" value={inputs[key]} onChange={(e) => set(key, e.target.value)} placeholder={placeholder}
                      style={{ padding: "11px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, background: "#fff", color: "#0f172a", outline: "none", fontFamily: "'Poppins', sans-serif" }}
                      onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }} />
                  </div>
                ))}
              </div>

              {/* Label size */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.4px" }}>Label Size</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {LABEL_SIZES.map((s) => (
                    <button key={s.id} onClick={() => set("labelSize", s.id)} style={{ flex: 1, padding: "8px 6px", borderRadius: 8, cursor: "pointer", border: `1.5px solid ${inputs.labelSize === s.id ? "#2563eb" : "#e8ecf0"}`, background: inputs.labelSize === s.id ? "#eff6ff" : "#f8fafc", color: inputs.labelSize === s.id ? "#2563eb" : "#64748b", fontSize: 11, fontWeight: 600, fontFamily: "'Poppins', sans-serif" }}>
                      {s.label.split("—")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dark mode toggle */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc", borderRadius: 10, padding: "12px 16px", border: "1px solid #e8ecf0" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Dark Label</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>Dark background with white barcode</div>
                </div>
                <button onClick={() => set("darkMode", !inputs.darkMode)} style={{ width: 44, height: 24, borderRadius: 100, background: inputs.darkMode ? "#2563eb" : "#e2e8f0", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                  <div style={{ position: "absolute", top: 2, left: inputs.darkMode ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
                </button>
              </div>

              {/* Bulk generator */}
              <div style={{ background: "#f8fafc", borderRadius: 10, padding: "14px 16px", border: "1px solid #e8ecf0" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: bulkMode ? 12 : 0 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>🗂️ Bulk Generator</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>Generate sequential barcodes</div>
                  </div>
                  <button onClick={() => setBulkMode(!bulkMode)} style={{ width: 44, height: 24, borderRadius: 100, background: bulkMode ? "#2563eb" : "#e2e8f0", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                    <div style={{ position: "absolute", top: 2, left: bulkMode ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
                  </button>
                </div>
                {bulkMode && (
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 4 }}>Quantity (max 50)</label>
                      <input type="number" min="1" max="50" value={inputs.quantity} onChange={(e) => set("quantity", Math.min(50, parseInt(e.target.value) || 1))}
                        style={{ width: "100%", padding: "8px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, background: "#fff", color: "#0f172a", outline: "none", fontFamily: "'Poppins', sans-serif", boxSizing: "border-box" }} />
                    </div>
                    <button onClick={generateBulk} style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>Generate</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Preview */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8ecf0", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.06)" }}>
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: 15, color: "#0f172a" }}>Label Preview</h3>
                  <p style={{ fontSize: 12, color: "#94a3b8" }}>Live preview as you type</p>
                </div>
                <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 100, padding: "4px 12px", fontSize: 11, fontWeight: 700, color: "#2563eb" }}>
                  {selectedType.label}
                </div>
              </div>

              <BarcodeCanvas inputs={inputs} size={inputs.labelSize} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%" }}>
                <button onClick={downloadBarcode} style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "#fff", border: "none", padding: "12px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: "0 4px 12px rgba(37,99,235,0.25)" }}>
                  ⬇️ Download PNG
                </button>
                <button onClick={printBarcode} style={{ background: "#f8fafc", color: "#374151", border: "1px solid #e8ecf0", padding: "12px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  🖨️ Print Label
                </button>
              </div>
            </div>

            {/* Use case */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8ecf0", padding: "18px 20px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Best Use Case</div>
              <p style={{ fontSize: 13, color: "#0f172a", lineHeight: 1.6 }}>{selectedType.useCase}</p>
            </div>

            {/* Bulk list */}
            {bulkList.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8ecf0", padding: "18px", maxHeight: 280, overflowY: "auto" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>🗂️ Bulk Generated — {bulkList.length} barcodes</div>
                {bulkList.map((num, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>#{i + 1}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", fontFamily: "'JetBrains Mono', monospace" }}>{num}</span>
                    <button onClick={() => { set("barcodeNumber", num); setBulkMode(false); }} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontSize: 11, color: "#2563eb", fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>Preview</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Recommendations */}
        {aiRecs.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#35d0b2,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🤖</div>
              <div>
                <h2 style={{ fontWeight: 800, fontSize: 18, color: "#0f172a" }}>AI Recommendations</h2>
                <p style={{ color: "#64748b", fontSize: 13 }}>Smart tips based on your barcode type</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
              {aiRecs.map((rec, i) => {
                const cfg = { success: { bg: "#f0fdf4", border: "#bbf7d0", ic: "#16a34a" }, warn: { bg: "#fffbeb", border: "#fde68a", ic: "#d97706" }, danger: { bg: "#fef2f2", border: "#fecaca", ic: "#dc2626" }, info: { bg: "#eff6ff", border: "#bfdbfe", ic: "#2563eb" } };
                const c = cfg[rec.type] || cfg.info;
                return (
                  <div key={i} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, padding: "16px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 18 }}>{rec.icon}</span>
                      <span style={{ fontWeight: 700, fontSize: 14, color: c.ic }}>{rec.title}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.5, margin: 0 }}>{rec.msg}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Barcode type guide */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8ecf0", padding: "36px", marginBottom: 32 }}>
          <div style={{ display: "inline-block", background: "rgba(53,208,178,0.1)", border: "1px solid rgba(53,208,178,0.2)", borderRadius: 100, padding: "4px 14px", color: "#35d0b2", fontSize: 12, fontWeight: 700, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.4px" }}>Guide</div>
          <h2 style={{ fontWeight: 900, fontSize: 24, marginBottom: 8, color: "#0f172a", letterSpacing: "-0.5px" }}>Which Barcode Type Should I Use?</h2>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>Quick guide to choosing the right format for your product</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 14 }}>
            {[
              { type: "EAN-13", use: "Retail products", platforms: "Amazon, Flipkart, Meesho", color: "#2563eb" },
              { type: "UPC-A", use: "US market products", platforms: "Amazon.com, Walmart", color: "#7c3aed" },
              { type: "Code 128", use: "Internal SKUs", platforms: "Warehouse, logistics", color: "#f59e0b" },
              { type: "Code 39", use: "Asset tracking", platforms: "Manufacturing, industrial", color: "#f97316" },
              { type: "QR Code", use: "Digital links", platforms: "Packaging, marketing", color: "#06b6d4" },
            ].map((item) => (
              <div key={item.type} style={{ background: "#f8fafc", border: "1px solid #e8ecf0", borderRadius: 12, padding: "16px", borderTop: `3px solid ${item.color}` }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: item.color, marginBottom: 6 }}>{item.type}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 4 }}>{item.use}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>{item.platforms}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8ecf0", padding: "40px", marginBottom: 48 }}>
          <div style={{ display: "inline-block", background: "rgba(53,208,178,0.1)", border: "1px solid rgba(53,208,178,0.2)", borderRadius: 100, padding: "4px 14px", color: "#35d0b2", fontSize: 12, fontWeight: 700, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.4px" }}>FAQ</div>
          <h2 style={{ fontWeight: 900, fontSize: 24, marginBottom: 24, color: "#0f172a", letterSpacing: "-0.5px" }}>Frequently Asked Questions</h2>
          {[
            ["What barcode do I need for Amazon India?", "For Amazon India, you need an EAN-13 barcode. It's the international standard accepted by Amazon.in and all major Indian marketplaces including Flipkart and Meesho."],
            ["Can I use a free barcode generator for retail?", "For internal use and testing, yes. For retail shelf products, you need a GS1-registered barcode number. The barcode image itself can be generated free — but the number must be officially registered."],
            ["What is the difference between EAN-13 and UPC-A?", "EAN-13 is 13 digits and used internationally. UPC-A is 12 digits and used primarily in the US and Canada. EAN-13 is more widely accepted for Indian ecommerce."],
            ["Can I generate multiple barcodes at once?", "Yes — use the Bulk Generator feature. Enter a starting barcode number, set the quantity (up to 50), and click Generate to create sequential barcodes."],
            ["What format should I download?", "PNG is best for printing labels directly. For professional printing or resizing without quality loss, SVG format is recommended."],
          ].map(([q, a]) => <FAQItem key={q} q={q} a={a} />)}
        </div>
      </div>
    </div>
  );
}

export default BarcodeGenerator;