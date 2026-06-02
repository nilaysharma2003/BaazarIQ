import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import AmazonFBACalculator from "./pages/AmazonFBACalculator";
import MarketplaceCommission from "./pages/MarketplaceCommission";
import ShippingCalculator from "./pages/ShippingCalculator";
import BarcodeGenerator from "./pages/BarcodeGenerator";
import WhatsAppLinkGenerator from "./pages/WhatsAppLinkGenerator";
import UTMBuilder from "./pages/UTMBuilder";
import ShippingLabelGenerator from "./pages/ShippingLabelGenerator"; // ✅ NEW
// import AmazonReferralFee from "./pages/AmazonReferralFee";


function ComingSoon({ tool }) {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        textAlign: "center",
        background: "#f1f5f9",
      }}
    >
      <div style={{ maxWidth: 480 }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>{tool?.icon || "🚧"}</div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            marginBottom: 12,
            letterSpacing: "-0.5px",
            color: "#0f172a",
          }}
        >
          {tool?.name || "Coming Soon"}
        </h1>
        <p style={{ color: "#64748b", fontSize: 16, marginBottom: 8 }}>
          This tool is coming soon.
        </p>
        <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 28 }}>
          We're building it to the same quality as our other tools. Stay tuned!
        </p>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: 100,
            padding: "6px 16px",
            marginBottom: 28,
          }}
        >
          <span style={{ fontSize: 12 }}>🚧</span>
          <span style={{ color: "#d97706", fontSize: 13, fontWeight: 600 }}>
            Coming Soon
          </span>
        </div>
        <br />
        <button
          onClick={() => window.location.href = "/"}
          style={{
            background: "#35d0b2",
            color: "#030a10",
            border: "none",
            padding: "12px 24px",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'Plus Poppins', sans-serif",
            marginTop: 8,
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/fba" element={<MainLayout><AmazonFBACalculator /></MainLayout>} />
        <Route path="/commission" element={<MainLayout><MarketplaceCommission /></MainLayout>} />
        <Route path="/shipping" element={<MainLayout><ShippingCalculator /></MainLayout>} />
        <Route path="/barcode" element={<MainLayout><BarcodeGenerator /></MainLayout>} />
        <Route path="/whatsapp" element={<MainLayout><WhatsAppLinkGenerator /></MainLayout>} />
        <Route path="/utm" element={<MainLayout><UTMBuilder /></MainLayout>} />
        <Route path="/label" element={<MainLayout><ShippingLabelGenerator /></MainLayout>} /> {/* ✅ NEW */}
        {/* <Route path="/referral" element={<MainLayout><AmazonReferralFee /></MainLayout>} /> */}
        <Route path="*" element={<MainLayout><ComingSoon /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;