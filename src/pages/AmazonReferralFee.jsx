import React, { useState, useMemo } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

// ─── FEE DATA ────────────────────────────────────────────────────────────────

const CATEGORY_FEES = [
  { id: "apparel_baby", name: "Apparel – Baby", group: "Fashion", referral: (p) => p <= 1000 ? 0 : 7, closingFBA: (p) => p <= 250 ? 17 : p <= 500 ? 30 : p <= 1000 ? 40 : 60, closingES: (p) => p <= 250 ? 8 : p <= 500 ? 12 : p <= 1000 ? 16 : 22, highReturn: false },
  { id: "apparel_mens", name: "Apparel – Men's Clothing", group: "Fashion", referral: (p) => p <= 1000 ? 0 : 17, closingFBA: (p) => p <= 250 ? 17 : p <= 500 ? 30 : p <= 1000 ? 40 : 60, closingES: (p) => p <= 250 ? 8 : p <= 500 ? 12 : p <= 1000 ? 16 : 22, highReturn: true },
  { id: "apparel_womens", name: "Apparel – Women's Clothing", group: "Fashion", referral: (p) => p <= 1000 ? 0 : 17, closingFBA: (p) => p <= 250 ? 17 : p <= 500 ? 30 : p <= 1000 ? 40 : 60, closingES: (p) => p <= 250 ? 8 : p <= 500 ? 12 : p <= 1000 ? 16 : 22, highReturn: true },
  { id: "shoes", name: "Shoes & Footwear", group: "Fashion", referral: (p) => p <= 1000 ? 0 : 15, closingFBA: (p) => p <= 250 ? 17 : p <= 500 ? 30 : p <= 1000 ? 40 : 60, closingES: (p) => p <= 250 ? 8 : p <= 500 ? 12 : p <= 1000 ? 16 : 22, highReturn: true },
  { id: "watches", name: "Watches", group: "Fashion", referral: (p) => p <= 1000 ? 0 : 13, closingFBA: (p) => p <= 250 ? 17 : p <= 500 ? 30 : p <= 1000 ? 40 : 60, closingES: (p) => p <= 250 ? 8 : p <= 500 ? 12 : p <= 1000 ? 16 : 22, highReturn: false },
  { id: "jewellery", name: "Jewellery", group: "Fashion", referral: (p) => p <= 1000 ? 0 : 13, closingFBA: (p) => p <= 250 ? 17 : p <= 500 ? 30 : p <= 1000 ? 40 : 60, closingES: (p) => p <= 250 ? 8 : p <= 500 ? 12 : p <= 1000 ? 16 : 22, highReturn: false },
  { id: "bags", name: "Bags, Wallets & Luggage", group: "Fashion", referral: (p) => p <= 1000 ? 0 : 14, closingFBA: (p) => p <= 250 ? 17 : p <= 500 ? 30 : p <= 1000 ? 40 : 60, closingES: (p) => p <= 250 ? 8 : p <= 500 ? 12 : p <= 1000 ? 16 : 22, highReturn: false },
  { id: "mobiles", name: "Mobile Phones", group: "Electronics", referral: (p) => p <= 1000 ? 0 : 4, closingFBA: (p) => p <= 500 ? 30 : p <= 1000 ? 40 : 60, closingES: (p) => p <= 500 ? 14 : p <= 1000 ? 22 : 30, highReturn: false },
  { id: "laptops", name: "Laptops & Computers", group: "Electronics", referral: (p) => p <= 1000 ? 0 : 4, closingFBA: (p) => p <= 500 ? 30 : p <= 1000 ? 40 : 60, closingES: (p) => p <= 500 ? 14 : p <= 1000 ? 22 : 30, highReturn: false },
  { id: "tablets", name: "Tablets", group: "Electronics", referral: (p) => p <= 1000 ? 0 : 5, closingFBA: (p) => p <= 500 ? 30 : p <= 1000 ? 40 : 60, closingES: (p) => p <= 500 ? 14 : p <= 1000 ? 22 : 30, highReturn: false },
  { id: "cameras", name: "Cameras & Photography", group: "Electronics", referral: (p) => p <= 1000 ? 0 : 5, closingFBA: (p) => p <= 500 ? 30 : p <= 1000 ? 40 : 60, closingES: (p) => p <= 500 ? 14 : p <= 1000 ? 22 : 30, highReturn: false },
  { id: "audio", name: "Audio & Headphones", group: "Electronics", referral: (p) => p <= 1000 ? 0 : 7, closingFBA: (p) => p <= 500 ? 30 : p <= 1000 ? 40 : 60, closingES: (p) => p <= 500 ? 14 : p <= 1000 ? 22 : 30, highReturn: false },
  { id: "accessories", name: "Mobile Accessories", group: "Electronics", referral: (p) => p <= 1000 ? 0 : 12, closingFBA: (p) => p <= 500 ? 30 : p <= 1000 ? 40 : 60, closingES: (p) => p <= 500 ? 14 : p <= 1000 ? 22 : 30, highReturn: false },
  { id: "beauty", name: "Beauty & Personal Care", group: "Beauty", referral: (p) => p <= 1000 ? 0 : 10, closingFBA: (p) => p <= 250 ? 17 : p <= 500 ? 30 : p <= 1000 ? 40 : 60, closingES: (p) => p <= 250 ? 8 : p <= 500 ? 12 : p <= 1000 ? 16 : 22, highReturn: false },
  { id: "skincare", name: "Skincare & Face Care", group: "Beauty", referral: (p) => p <= 1000 ? 0 : 10, closingFBA: (p) => p <= 250 ? 17 : p <= 500 ? 30 : p <= 1000 ? 40 : 60, closingES: (p) => p <= 250 ? 8 : p <= 500 ? 12 : p <= 1000 ? 16 : 22, highReturn: false },
  { id: "haircare", name: "Hair Care", group: "Beauty", referral: (p) => p <= 1000 ? 0 : 10, closingFBA: (p) => p <= 250 ? 17 : p <= 500 ? 30 : p <= 1000 ? 40 : 60, closingES: (p) => p <= 250 ? 8 : p <= 500 ? 12 : p <= 1000 ? 16 : 22, highReturn: false },
  { id: "home_kitchen", name: "Home & Kitchen", group: "Home", referral: (p) => p <= 1000 ? 0 : 12, closingFBA: (p) => p <= 250 ? 17 : p <= 500 ? 30 : p <= 1000 ? 40 : 60, closingES: (p) => p <= 250 ? 8 : p <= 500 ? 12 : p <= 1000 ? 16 : 22, highReturn: false },
  { id: "furniture", name: "Furniture", group: "Home", referral: (p) => p <= 1000 ? 0 : 11, closingFBA: (p) => p <= 500 ? 30 : p <= 1000 ? 40 : 80, closingES: (p) => p <= 500 ? 14 : p <= 1000 ? 22 : 40, highReturn: false },
  { id: "kitchen_appliances", name: "Kitchen Appliances", group: "Home", referral: (p) => p <= 1000 ? 0 : 9, closingFBA: (p) => p <= 500 ? 30 : p <= 1000 ? 40 : 60, closingES: (p) => p <= 500 ? 14 : p <= 1000 ? 22 : 30, highReturn: false },
  { id: "tools", name: "Tools & Home Improvement", group: "Home", referral: (p) => p <= 1000 ? 0 : 11, closingFBA: (p) => p <= 500 ? 30 : p <= 1000 ? 40 : 60, closingES: (p) => p <= 500 ? 14 : p <= 1000 ? 22 : 30, highReturn: false },
  { id: "sports", name: "Sports & Outdoors", group: "Sports", referral: (p) => p <= 1000 ? 0 : 11, closingFBA: (p) => p <= 250 ? 17 : p <= 500 ? 30 : p <= 1000 ? 40 : 60, closingES: (p) => p <= 250 ? 8 : p <= 500 ? 12 : p <= 1000 ? 16 : 22, highReturn: false },
  { id: "fitness", name: "Fitness & Gym Equipment", group: "Sports", referral: (p) => p <= 1000 ? 0 : 11, closingFBA: (p) => p <= 500 ? 30 : p <= 1000 ? 40 : 80, closingES: (p) => p <= 500 ? 14 : p <= 1000 ? 22 : 40, highReturn: false },
  { id: "books", name: "Books", group: "Media", referral: (p) => 4, closingFBA: (p) => p <= 250 ? 12 : p <= 500 ? 14 : 16, closingES: (p) => p <= 250 ? 5 : p <= 500 ? 6 : 8, highReturn: false },
  { id: "toys", name: "Toys & Baby Products", group: "Kids", referral: (p) => p <= 1000 ? 0 : 13, closingFBA: (p) => p <= 250 ? 17 : p <= 500 ? 30 : p <= 1000 ? 40 : 60, closingES: (p) => p <= 250 ? 8 : p <= 500 ? 12 : p <= 1000 ? 16 : 22, highReturn: false },
  { id: "baby_care", name: "Baby Care", group: "Kids", referral: (p) => p <= 1000 ? 0 : 9, closingFBA: (p) => p <= 250 ? 17 : p <= 500 ? 30 : p <= 1000 ? 40 : 60, closingES: (p) => p <= 250 ? 8 : p <= 500 ? 12 : p <= 1000 ? 16 : 22, highReturn: false },
  { id: "health", name: "Health & Wellness", group: "Health", referral: (p) => p <= 1000 ? 0 : 9, closingFBA: (p) => p <= 250 ? 17 : p <= 500 ? 30 : p <= 1000 ? 40 : 60, closingES: (p) => p <= 250 ? 8 : p <= 500 ? 12 : p <= 1000 ? 16 : 22, highReturn: false },
  { id: "supplements", name: "Health Supplements & Protein", group: "Health", referral: (p) => p <= 1000 ? 0 : 9, closingFBA: (p) => p <= 250 ? 17 : p <= 500 ? 30 : p <= 1000 ? 40 : 60, closingES: (p) => p <= 250 ? 8 : p <= 500 ? 12 : p <= 1000 ? 16 : 22, highReturn: false },
  { id: "automotive", name: "Automotive Accessories", group: "Automotive", referral: (p) => p <= 1000 ? 0 : 14, closingFBA: (p) => p <= 500 ? 30 : p <= 1000 ? 40 : 60, closingES: (p) => p <= 500 ? 14 : p <= 1000 ? 22 : 30, highReturn: false },
  { id: "grocery", name: "Grocery & Gourmet Foods", group: "Grocery", referral: (p) => 0, closingFBA: (p) => p <= 250 ? 8 : p <= 500 ? 12 : 16, closingES: (p) => p <= 250 ? 4 : p <= 500 ? 6 : 10, highReturn: false },
  { id: "office", name: "Office Products & Stationery", group: "Office", referral: (p) => p <= 1000 ? 0 : 11, closingFBA: (p) => p <= 250 ? 17 : p <= 500 ? 30 : p <= 1000 ? 40 : 60, closingES: (p) => p <= 250 ? 8 : p <= 500 ? 12 : p <= 1000 ? 16 : 22, highReturn: false },
  { id: "pet", name: "Pet Supplies", group: "Pets", referral: (p) => p <= 1000 ? 0 : 9, closingFBA: (p) => p <= 250 ? 17 : p <= 500 ? 30 : p <= 1000 ? 40 : 60, closingES: (p) => p <= 250 ? 8 : p <= 500 ? 12 : p <= 1000 ? 16 : 22, highReturn: false },
];

function calcShipping(weightGm, method, area) {
  const wt = parseFloat(weightGm) / 1000 || 0;
  if (method === "Self Ship") return 0;
  if (method === "Amazon FBA") {
    const base = wt <= 0.5 ? 42 : wt <= 1 ? 58 : wt <= 2 ? 78 : 78 + Math.ceil((wt - 2) / 0.5) * 18;
    const zoneMultiplier = area === "Local" ? 1 : area === "Regional" ? 1.1 : 1.2;
    return Math.round(base * zoneMultiplier);
  }
  if (method === "Amazon Easy Ship") {
    const base = wt <= 0.5 ? 35 : wt <= 1 ? 49 : wt <= 2 ? 65 : 65 + Math.ceil((wt - 2) / 0.5) * 15;
    const zoneMultiplier = area === "Local" ? 1 : area === "Regional" ? 1.1 : 1.2;
    return Math.round(base * zoneMultiplier);
  }
  return 0;
}

function calcAll(inputs, category) {
  if (!category || !inputs.sellingPrice) return null;
  const sp = parseFloat(inputs.sellingPrice) || 0;
  const pc = parseFloat(inputs.productCost) || 0;
  const gst = parseFloat(inputs.gstPct) || 18;
  const adSpend = parseFloat(inputs.adSpend) || 0;
  const weightGm = parseFloat(inputs.weightGm) || 500;

  const referralPct = category.referral(sp);
  const referralFee = sp * referralPct / 100;

  const closingFBA = category.closingFBA(sp);
  const closingES = category.closingES(sp);
  const closingSS = category.closingES(sp);

  const shippingFBA = calcShipping(weightGm, "Amazon FBA", inputs.area);
  const shippingES = calcShipping(weightGm, "Amazon Easy Ship", inputs.area);

  const gstOnFees = (fees) => fees * (gst / 100);
  const adFee = sp * (adSpend / 100);
  const refundAdminFee = referralFee * 0.1;
  const pickPackFBA = weightGm <= 500 ? 14 : weightGm <= 1000 ? 20 : weightGm <= 2000 ? 30 : 40;

  const totalFBA = referralFee + closingFBA + shippingFBA + pickPackFBA + gstOnFees(referralFee + closingFBA + shippingFBA);
  const totalES = referralFee + closingES + shippingES + gstOnFees(referralFee + closingES + shippingES);
  const totalSS = referralFee + closingSS + gstOnFees(referralFee + closingSS);

  const profitFBA = sp - totalFBA - pc - adFee;
  const profitES = sp - totalES - pc - adFee;
  const profitSS = sp - totalSS - pc - adFee;

  const marginFBA = sp > 0 ? (profitFBA / sp) * 100 : 0;
  const marginES = sp > 0 ? (profitES / sp) * 100 : 0;
  const marginSS = sp > 0 ? (profitSS / sp) * 100 : 0;

  const breakEvenFBA = Math.ceil((pc + totalFBA + adFee) / (1 - 0));
  const minPriceFBA = Math.ceil((pc + adFee) / (1 - (referralPct / 100) - ((closingFBA + shippingFBA + pickPackFBA) / sp || 0.15)));

  return {
    sp, pc, referralPct, referralFee, gst, adFee, refundAdminFee,
    fba: { closing: closingFBA, shipping: shippingFBA, pickPack: pickPackFBA, gstFees: gstOnFees(referralFee + closingFBA + shippingFBA), total: totalFBA, profit: profitFBA, margin: marginFBA },
    es: { closing: closingES, shipping: shippingES, gstFees: gstOnFees(referralFee + closingES + shippingES), total: totalES, profit: profitES, margin: marginES },
    ss: { closing: closingSS, shipping: 0, gstFees: gstOnFees(referralFee + closingSS), total: totalSS, profit: profitSS, margin: marginSS },
    breakEvenFBA, minPriceFBA,
    isZeroReferral: referralPct === 0,
    isHighReturn: category.highReturn,
  };
}

// ─── SUB COMPONENTS ──────────────────────────────────────────────────────────

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 14, marginBottom: 14 }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", background: "none", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left", gap: 8, fontFamily: "'Plus Poppins', sans-serif" }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: "#0f172a" }}>{q}</span>
        <span style={{ fontSize: 18, color: "#94a3b8", transform: open ? "rotate(180deg)" : "", transition: "transform 0.2s", flexShrink: 0 }}>▾</span>
      </button>
      {open && <p style={{ fontSize: 14, color: "#64748b", marginTop: 10, lineHeight: 1.7 }}>{a}</p>}
    </div>
  );
}

function FulfillmentCard({ label, icon, results, field, color, bg, border, isBest }) {
  const r = results[field];
  return (
    <div style={{ background: isBest ? bg : "#fff", borderRadius: 14, border: `2px solid ${isBest ? color : "#e8ecf0"}`, padding: "18px", position: "relative", boxShadow: isBest ? `0 8px 24px ${color}22` : "none" }}>
      {isBest && (
        <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: color, color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 12px", borderRadius: 100, whiteSpace: "nowrap" }}>
          💰 BEST OPTION
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{ fontWeight: 800, fontSize: 15, color: "#0f172a" }}>{label}</span>
      </div>
      <div style={{ background: r.profit >= 0 ? bg : "#fef2f2", borderRadius: 10, padding: "12px", textAlign: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 2 }}>Net Profit</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: r.profit >= 0 ? color : "#dc2626", fontFamily: "'JetBrains Mono', monospace" }}>
          {r.profit >= 0 ? "+" : ""}₹{r.profit.toFixed(0)}
        </div>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Margin: <strong style={{ color }}>{r.margin.toFixed(1)}%</strong></div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {[
          ["Closing Fee", `₹${r.closing.toFixed(0)}`],
          ["Shipping Fee", `₹${r.shipping.toFixed(0)}`],
          ...(field === "fba" ? [["Pick & Pack", `₹${r.pickPack.toFixed(0)}`]] : []),
          ["GST on Fees", `₹${r.gstFees.toFixed(0)}`],
          ["Total Fees", `₹${r.total.toFixed(0)}`],
        ].map(([l, v]) => (
          <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #f8fafc", fontSize: 12 }}>
            <span style={{ color: "#64748b" }}>{l}</span>
            <span style={{ fontWeight: 700, color: "#374151", fontFamily: "'JetBrains Mono', monospace" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

function AmazonReferralFee() {
  const [inputs, setInputs] = useState({
    sellingPrice: "",
    productCost: "",
    weightGm: "500",
    gstPct: "18",
    area: "National",
    adSpend: "0",
    length: "",
    width: "",
    height: "",
  });
  const [categorySearch, setCategorySearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [reverseProfit, setReverseProfit] = useState("");
  const [showVolumetric, setShowVolumetric] = useState(false);

  const set = (k, v) => setInputs(prev => ({ ...prev, [k]: v }));

  const filteredCategories = useMemo(() => {
    if (!categorySearch) return CATEGORY_FEES;
    const q = categorySearch.toLowerCase();
    return CATEGORY_FEES.filter(c => c.name.toLowerCase().includes(q) || c.group.toLowerCase().includes(q));
  }, [categorySearch]);

  const results = useMemo(() => {
    if (!selectedCategory || !inputs.sellingPrice) return null;
    return calcAll(inputs, selectedCategory);
  }, [inputs, selectedCategory]);

  // Volumetric weight
  const volumetricWt = useMemo(() => {
    const l = parseFloat(inputs.length) || 0;
    const w = parseFloat(inputs.width) || 0;
    const h = parseFloat(inputs.height) || 0;
    return l > 0 && w > 0 && h > 0 ? (l * w * h / 5000).toFixed(2) : null;
  }, [inputs.length, inputs.width, inputs.height]);

  const chargeableWt = volumetricWt ? Math.max(parseFloat(inputs.weightGm) / 1000, parseFloat(volumetricWt)).toFixed(2) : null;

  // Reverse calculator
  const reverseCalc = useMemo(() => {
    if (!selectedCategory || !reverseProfit || !inputs.productCost) return null;
    const targetProfit = parseFloat(reverseProfit) || 0;
    const pc = parseFloat(inputs.productCost) || 0;
    const referralDecimal = selectedCategory.referral(1000) / 100;
    const estimatedSP = Math.ceil((targetProfit + pc + 60) / (1 - referralDecimal - 0.18));
    return estimatedSP;
  }, [reverseProfit, inputs.productCost, selectedCategory]);

  // Best fulfillment
  const bestMethod = useMemo(() => {
    if (!results) return null;
    const methods = [
      { key: "fba", profit: results.fba.profit },
      { key: "es", profit: results.es.profit },
      { key: "ss", profit: results.ss.profit },
    ];
    return methods.sort((a, b) => b.profit - a.profit)[0].key;
  }, [results]);

  // Groups for category display
  const groups = useMemo(() => {
    const g = {};
    filteredCategories.forEach(c => {
      if (!g[c.group]) g[c.group] = [];
      g[c.group].push(c);
    });
    return g;
  }, [filteredCategories]);

  // Pie chart data
  const pieData = results ? [
    { name: "Referral Fee", value: parseFloat(results.referralFee.toFixed(2)), color: "#ef4444" },
    { name: "Closing Fee", value: parseFloat(results.fba.closing.toFixed(2)), color: "#f59e0b" },
    { name: "Shipping", value: parseFloat(results.fba.shipping.toFixed(2)), color: "#8b5cf6" },
    { name: "GST on Fees", value: parseFloat(results.fba.gstFees.toFixed(2)), color: "#06b6d4" },
    { name: "Product Cost", value: parseFloat(results.pc.toFixed(2)), color: "#64748b" },
    { name: "Net Profit", value: Math.max(0, parseFloat(results.fba.profit.toFixed(2))), color: "#35d0b2" },
  ].filter(d => d.value > 0) : [];

  // Bar chart comparison
  const barData = results ? [
    { name: "FBA", profit: parseFloat(results.fba.profit.toFixed(0)), fees: parseFloat(results.fba.total.toFixed(0)), margin: parseFloat(results.fba.margin.toFixed(1)) },
    { name: "Easy Ship", profit: parseFloat(results.es.profit.toFixed(0)), fees: parseFloat(results.es.total.toFixed(0)), margin: parseFloat(results.es.margin.toFixed(1)) },
    { name: "Self Ship", profit: parseFloat(results.ss.profit.toFixed(0)), fees: parseFloat(results.ss.total.toFixed(0)), margin: parseFloat(results.ss.margin.toFixed(1)) },
  ] : [];

  // AI Insights
  const insights = useMemo(() => {
    if (!results) return [];
    const ins = [];
    const sp = results.sp;

    if (results.isZeroReferral) {
      ins.push({ type: "success", icon: "🎉", title: "Zero Referral Fee!", msg: `Great news! Products under ₹1,000 in this category pay 0% referral fee as of March 2026. You save ₹${(sp * selectedCategory.referral(sp + 1000) / 100).toFixed(0)} compared to pricing above ₹1,000.` });
    }
    if (results.isHighReturn) {
      ins.push({ type: "warn", icon: "⚠️", title: "High Return Rate Category", msg: `${selectedCategory.name} has a higher-than-average return rate. Factor in refund admin fees of ~₹${results.refundAdminFee.toFixed(0)} per returned unit in your calculations.` });
    }
    if (bestMethod === "ss") {
      ins.push({ type: "info", icon: "🚚", title: "Self Ship Saves Most", msg: `For this product, Self Ship saves you ₹${(results.fba.total - results.ss.total).toFixed(0)} per unit vs FBA. If you have reliable courier partners, consider self-shipping.` });
    }
    if (bestMethod === "fba") {
      ins.push({ type: "success", icon: "📦", title: "FBA is Most Profitable Here", msg: `FBA gives you ₹${(results.fba.profit - results.es.profit).toFixed(0)} more profit per unit than Easy Ship due to better closing fee structure for this price range.` });
    }
    if (results.fba.margin < 15) {
      ins.push({ type: "danger", icon: "🔴", title: "Low Profit Margin", msg: `Margin is only ${results.fba.margin.toFixed(1)}%. Try pricing at ₹${Math.ceil(sp * 1.15)} to push margin above 15%.` });
    }
    if (results.adFee > 0 && results.fba.profit < 0) {
      ins.push({ type: "danger", icon: "📉", title: "Ads Eating Profit", msg: `With ${inputs.adSpend}% ad spend, you're losing money. Either reduce ACoS or increase selling price by ₹${Math.ceil(results.adFee)}.` });
    }
    if (parseFloat(inputs.sellingPrice) > 1000 && selectedCategory.referral(500) === 0) {
      ins.push({ type: "info", icon: "💡", title: "Price Under ₹1,000 to Save Referral Fee", msg: `Pricing under ₹1,000 in this category eliminates the referral fee entirely, potentially increasing your profit by ₹${results.referralFee.toFixed(0)}.` });
    }
    return ins;
  }, [results, bestMethod, selectedCategory, inputs]);

  return (
    <div style={{ background: "#f1f5f9", minHeight: "100vh", fontFamily: "'Plus Poppins', sans-serif" }}>

      {/* ── HERO ── */}
      <section style={{ background: "#030a10", padding: "80px 24px 90px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 30% 50%, rgba(53,208,178,0.12) 0%,transparent 60%),radial-gradient(ellipse at 70% 50%, rgba(37,99,235,0.08) 0%,transparent 60%)" }} />
        <div style={{ position: "relative", maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(53,208,178,0.1)", border: "1px solid rgba(53,208,178,0.2)", borderRadius: 100, padding: "6px 18px", marginBottom: 20 }}>
            <span style={{ fontSize: 16 }}>💰</span>
            <span style={{ color: "#35d0b2", fontSize: 14, fontWeight: 600 }}>Amazon India Fee Lookup</span>
          </div>
          <p style={{ color: "#35d0b2", fontSize: 16, fontWeight: 600, marginBottom: 12, letterSpacing: "0.3px" }}>
            Updated March 2026 - Zero Referral Fees Expanded to ₹1,000
          </p>
          <h1 style={{ fontSize: "clamp(42px, 6vw, 72px)", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1.1, color: "#f8fafc", marginBottom: 20 }}>
            Know Every Fee.{" "}
            <span style={{ background: "#35d0b2", borderRadius: 12, padding: "4px 20px", color: "#030a10", display: "inline-block", marginLeft: 8 }}>
              Price Smart. 💰
            </span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 18, maxWidth: 580, margin: "0 auto 32px", lineHeight: 1.75 }}>
            Look up referral fees, closing fees, shipping charges and compare FBA vs Easy Ship vs Self Ship - before you list on Amazon India.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 0, flexWrap: "wrap", borderTop: "1px solid rgba(53,208,178,0.15)", paddingTop: 28 }}>
            {[["30+ Categories", "All Fee Slabs"], ["FBA vs Easy Ship", "Side by Side"], ["Reverse Calculator", "Target Profit"], ["100% Free", "Updated 2026"]].map(([n, l], i) => (
              <div key={l} style={{ textAlign: "center", padding: "0 28px", borderRight: i < 3 ? "1px solid rgba(53,208,178,0.15)" : "none" }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#35d0b2", marginBottom: 3 }}>{n}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ZERO FEE BANNER ── */}
      <div style={{ background: "linear-gradient(135deg,#035d38,#047857)", padding: "14px 24px", textAlign: "center" }}>
        <p style={{ color: "#fff", fontSize: 14, fontWeight: 600, margin: 0 }}>
          🎉 <strong>Big Update (March 2026):</strong> Amazon India expanded Zero Referral Fees to products priced under ₹1,000 across 1,800+ categories - 10x expansion!
        </p>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24, paddingBottom: 48 }}>

          {/* ── LEFT ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Category Selector */}
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
                <h2 style={{ fontWeight: 800, fontSize: 17, color: "#0f172a" }}>Step 1 - Select Category</h2>
                <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 2 }}>Search and select your Amazon product category</p>
              </div>
              <div style={{ padding: "16px 24px" }}>
                <input
                  type="text" value={categorySearch} onChange={e => setCategorySearch(e.target.value)}
                  placeholder="🔍 Search category - e.g. fashion, electronics, beauty..."
                  style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, background: "#fff", color: "#0f172a", outline: "none", fontFamily: "'Plus Poppins', sans-serif", boxSizing: "border-box" }}
                  onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                />
                <div style={{ maxHeight: 280, overflowY: "auto", marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                  {Object.entries(groups).map(([group, cats]) => (
                    <div key={group}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", padding: "4px 8px" }}>{group}</div>
                      {cats.map(cat => (
                        <button key={cat.id} onClick={() => setSelectedCategory(cat)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", border: `1.5px solid ${selectedCategory?.id === cat.id ? "#35d0b2" : "transparent"}`, background: selectedCategory?.id === cat.id ? "rgba(53,208,178,0.08)" : "transparent", borderRadius: 10, cursor: "pointer", fontFamily: "'Plus Poppins', sans-serif", textAlign: "left", transition: "all 0.15s" }}
                          onMouseEnter={e => { if (selectedCategory?.id !== cat.id) e.currentTarget.style.background = "#f8fafc"; }}
                          onMouseLeave={e => { if (selectedCategory?.id !== cat.id) e.currentTarget.style.background = "transparent"; }}>
                          <div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: selectedCategory?.id === cat.id ? "#35d0b2" : "#0f172a" }}>{cat.name}</span>
                            {cat.highReturn && <span style={{ fontSize: 10, background: "#fef2f2", color: "#dc2626", padding: "1px 6px", borderRadius: 100, marginLeft: 6, fontWeight: 700 }}>High Returns</span>}
                          </div>
                          <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>
                            {cat.referral(500) === 0 ? <span style={{ color: "#16a34a", fontWeight: 700 }}>0% ≤₹1k</span> : `${cat.referral(1500)}%`}
                          </span>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <h2 style={{ fontWeight: 800, fontSize: 16, color: "#0f172a", marginBottom: 16 }}>Step 2 - Product Details</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {[["Selling Price", "sellingPrice", "₹", "999", ""], ["Product Cost", "productCost", "₹", "400", ""]].map(([label, key, prefix, ph]) => (
                    <div key={key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.4px" }}>{label} <span style={{ color: "#dc2626" }}>*</span></label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: 14, fontWeight: 600 }}>{prefix}</span>
                        <input type="text" value={inputs[key]} onChange={e => set(key, e.target.value)} placeholder={ph}
                          style={{ width: "100%", padding: "11px 12px 11px 28px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, background: "#fff", color: "#0f172a", outline: "none", fontFamily: "'Plus Poppins', sans-serif", boxSizing: "border-box" }}
                          onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                          onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Weight + Volumetric */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.4px" }}>Weight (gm)</label>
                    <button onClick={() => setShowVolumetric(!showVolumetric)} style={{ fontSize: 11, color: "#2563eb", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 100, padding: "2px 10px", cursor: "pointer", fontFamily: "'Plus Poppins', sans-serif", fontWeight: 700 }}>
                      {showVolumetric ? "✓ Volumetric On" : "+ Add Dimensions"}
                    </button>
                  </div>
                  <input type="text" value={inputs.weightGm} onChange={e => set("weightGm", e.target.value)} placeholder="500"
                    style={{ width: "100%", padding: "11px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, background: "#fff", color: "#0f172a", outline: "none", fontFamily: "'Plus Poppins', sans-serif", boxSizing: "border-box" }}
                    onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }} />
                  {showVolumetric && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                        {[["Length", "length"], ["Width", "width"], ["Height", "height"]].map(([label, key]) => (
                          <div key={key}>
                            <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 4 }}>{label} (cm)</label>
                            <input type="text" value={inputs[key]} onChange={e => set(key, e.target.value)} placeholder="0"
                              style={{ width: "100%", padding: "8px 10px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, background: "#fff", color: "#0f172a", outline: "none", fontFamily: "'Plus Poppins', sans-serif", boxSizing: "border-box" }} />
                          </div>
                        ))}
                      </div>
                      {volumetricWt && (
                        <div style={{ marginTop: 10, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "10px 12px" }}>
                          <div style={{ fontSize: 12, color: "#d97706", fontWeight: 600 }}>
                            📦 Volumetric Weight: {volumetricWt} kg | Actual: {(parseFloat(inputs.weightGm) / 1000).toFixed(2)} kg
                          </div>
                          <div style={{ fontSize: 12, color: "#92400e", marginTop: 2 }}>
                            ⚖️ Chargeable Weight: <strong>{chargeableWt} kg</strong> (Amazon charges the higher one)
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.4px" }}>Delivery Area</label>
                    <select value={inputs.area} onChange={e => set("area", e.target.value)} style={{ padding: "11px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, background: "#fff", color: "#0f172a", outline: "none", fontFamily: "'Plus Poppins', sans-serif" }}>
                      {["Local", "Regional", "National"].map(a => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.4px" }}>GST %</label>
                    <select value={inputs.gstPct} onChange={e => set("gstPct", e.target.value)} style={{ padding: "11px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, background: "#fff", color: "#0f172a", outline: "none", fontFamily: "'Plus Poppins', sans-serif" }}>
                      {["0", "5", "12", "18", "28"].map(g => <option key={g} value={g}>{g}%</option>)}
                    </select>
                  </div>
                </div>

                {/* Ad Spend */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                    Ad Spend / ACoS % <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: 11, textTransform: "none" }}>(optional)</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <input type="text" value={inputs.adSpend} onChange={e => set("adSpend", e.target.value)} placeholder="0"
                      style={{ width: "100%", padding: "11px 36px 11px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, background: "#fff", color: "#0f172a", outline: "none", fontFamily: "'Plus Poppins', sans-serif", boxSizing: "border-box" }}
                      onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                      onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }} />
                    <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: 14, fontWeight: 600 }}>%</span>
                  </div>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>Advertising Cost of Sales - deducted from profit calculation</span>
                </div>
              </div>
            </div>

            {/* Reverse Calculator */}
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", padding: "24px" }}>
              <div style={{ display: "inline-block", background: "rgba(53,208,178,0.1)", border: "1px solid rgba(53,208,178,0.2)", borderRadius: 100, padding: "3px 12px", color: "#35d0b2", fontSize: 11, fontWeight: 700, marginBottom: 12 }}>🔄 Reverse Calculator</div>
              <h3 style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", marginBottom: 4 }}>What price should I sell at?</h3>
              <p style={{ fontSize: 12, color: "#64748b", marginBottom: 14 }}>Enter your target profit to get the recommended selling price</p>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 6 }}>Target Profit per Unit (₹)</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: 14, fontWeight: 600 }}>₹</span>
                    <input type="text" value={reverseProfit} onChange={e => setReverseProfit(e.target.value)} placeholder="200"
                      style={{ width: "100%", padding: "11px 12px 11px 28px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, background: "#fff", color: "#0f172a", outline: "none", fontFamily: "'Plus Poppins', sans-serif", boxSizing: "border-box" }} />
                  </div>
                </div>
              </div>
              {reverseCalc && (
                <div style={{ marginTop: 14, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 12, color: "#16a34a", fontWeight: 600, marginBottom: 4 }}>✅ Recommended Selling Price</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#15803d", fontFamily: "'JetBrains Mono', monospace" }}>₹{reverseCalc.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>Based on product cost + estimated Amazon fees + target profit</div>
                </div>
              )}
            </div>

            {/* Price Slab Checker */}
            {selectedCategory && inputs.sellingPrice && (
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", padding: "24px" }}>
                <div style={{ display: "inline-block", background: "rgba(53,208,178,0.1)", border: "1px solid rgba(53,208,178,0.2)", borderRadius: 100, padding: "3px 12px", color: "#35d0b2", fontSize: 11, fontWeight: 700, marginBottom: 12 }}>📊 Price Slab Visualizer</div>
                <h3 style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", marginBottom: 14 }}>Where does your price fall?</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { range: "≤ ₹1,000", pct: selectedCategory.referral(500), active: parseFloat(inputs.sellingPrice) <= 1000 },
                    { range: "₹1,001 – ₹5,000", pct: selectedCategory.referral(2000), active: parseFloat(inputs.sellingPrice) > 1000 && parseFloat(inputs.sellingPrice) <= 5000 },
                    { range: "> ₹5,000", pct: selectedCategory.referral(6000), active: parseFloat(inputs.sellingPrice) > 5000 },
                  ].map(({ range, pct, active }) => (
                    <div key={range} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: 10, background: active ? "rgba(53,208,178,0.1)" : "#f8fafc", border: `1.5px solid ${active ? "#35d0b2" : "#e8ecf0"}`, transition: "all 0.15s" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {active && <span style={{ fontSize: 14 }}>👉</span>}
                        <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? "#0f172a" : "#64748b" }}>{range}</span>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 800, color: pct === 0 ? "#16a34a" : active ? "#35d0b2" : "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>
                        {pct === 0 ? "0% FREE" : `${pct}%`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {results ? (
              <>
                {/* Referral Fee Banner */}
                <div style={{ background: results.isZeroReferral ? "linear-gradient(135deg,#0a3d20,#166534)" : "linear-gradient(135deg,#0a1628,#1e3a5f)", borderRadius: 16, padding: "24px", color: "#fff", border: `1px solid ${results.isZeroReferral ? "rgba(53,208,178,0.3)" : "rgba(37,99,235,0.2)"}`, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>Referral Fee - {selectedCategory.name}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
                    <div style={{ fontSize: 44, fontWeight: 900, fontFamily: "'JetBrains Mono', monospace", color: results.isZeroReferral ? "#35d0b2" : "#fff" }}>
                      {results.isZeroReferral ? "0%" : `${results.referralPct}%`}
                    </div>
                    {results.isZeroReferral && <div style={{ background: "#35d0b2", color: "#030a10", fontSize: 12, fontWeight: 800, padding: "4px 12px", borderRadius: 100 }}>ZERO FEE ✓</div>}
                  </div>
                  <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                    {[
                      ["Referral Fee", `₹${results.referralFee.toFixed(2)}`],
                      ["Referral %", `${results.referralPct}%`],
                      ["Selling Price", `₹${results.sp}`],
                    ].map(([l, v]) => (
                      <div key={l}>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{l}</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "#35d0b2" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fulfillment Comparison */}
                <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", padding: "20px" }}>
                  <h3 style={{ fontWeight: 800, fontSize: 16, color: "#0f172a", marginBottom: 4 }}>Fulfillment Comparison</h3>
                  <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>FBA vs Easy Ship vs Self Ship - choose what's best for you</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    <FulfillmentCard label="Amazon FBA" icon="📦" results={results} field="fba" color="#f97316" bg="#fff7ed" border="#fed7aa" isBest={bestMethod === "fba"} />
                    <FulfillmentCard label="Easy Ship" icon="🚚" results={results} field="es" color="#2563eb" bg="#eff6ff" border="#bfdbfe" isBest={bestMethod === "es"} />
                    <FulfillmentCard label="Self Ship" icon="🏠" results={results} field="ss" color="#16a34a" bg="#f0fdf4" border="#bbf7d0" isBest={bestMethod === "ss"} />
                  </div>
                </div>

                {/* Bar Chart */}
                <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", padding: "20px" }}>
                  <h3 style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", marginBottom: 4 }}>Profit vs Fees - All Methods</h3>
                  <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 14 }}>Visual breakdown across fulfillment options</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={barData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 600 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={v => `₹${v}`} contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
                      <Bar dataKey="profit" name="Profit" fill="#35d0b2" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="fees" name="Total Fees" fill="#ef4444" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", padding: "20px" }}>
                  <h3 style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", marginBottom: 4 }}>Fee Breakdown (FBA)</h3>
                  <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>Where does your selling price go?</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                        {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                      <Tooltip formatter={v => `₹${v.toFixed(2)}`} contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Break-even + Min Price */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ background: "#eff6ff", borderRadius: 14, padding: "16px", border: "1px solid #bfdbfe" }}>
                    <div style={{ fontSize: 11, color: "#2563eb", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 6 }}>Break-even Units</div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: "#1d4ed8", fontFamily: "'JetBrains Mono', monospace" }}>
                      {results.fba.profit > 0 ? Math.ceil(results.pc / results.fba.profit) : "∞"}
                    </div>
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>units to recover product cost</div>
                  </div>
                  <div style={{ background: "#f0fdf4", borderRadius: 14, padding: "16px", border: "1px solid #bbf7d0" }}>
                    <div style={{ fontSize: 11, color: "#16a34a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 6 }}>Min Sell Price</div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: "#15803d", fontFamily: "'JetBrains Mono', monospace" }}>
                      ₹{results.minPriceFBA.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>for 20% profit margin</div>
                  </div>
                </div>

                {/* Refund Fee */}
                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8ecf0", padding: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>🔄 Refund Administration Fee</div>
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Amazon charges ~10% of referral fee if customer returns</div>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#f97316", fontFamily: "'JetBrains Mono', monospace" }}>₹{results.refundAdminFee.toFixed(2)}</div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", padding: "64px 24px", textAlign: "center", flex: 1 }}>
                <div style={{ fontSize: 52, marginBottom: 16 }}>💰</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#64748b", marginBottom: 8 }}>Select a category & enter price</h3>
                <p style={{ fontSize: 14, color: "#94a3b8" }}>Choose your product category and fill in the selling price to see all fees instantly</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Insights */}
        {insights.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#35d0b2,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🤖</div>
              <div>
                <h2 style={{ fontWeight: 800, fontSize: 18, color: "#0f172a" }}>AI Insights</h2>
                <p style={{ color: "#64748b", fontSize: 13 }}>Smart recommendations based on your product and fees</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
              {insights.map((ins, i) => {
                const cfg = { success: { bg: "#f0fdf4", border: "#bbf7d0", ic: "#16a34a" }, warn: { bg: "#fffbeb", border: "#fde68a", ic: "#d97706" }, danger: { bg: "#fef2f2", border: "#fecaca", ic: "#dc2626" }, info: { bg: "#eff6ff", border: "#bfdbfe", ic: "#2563eb" } };
                const c = cfg[ins.type] || cfg.info;
                return (
                  <div key={i} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, padding: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 18 }}>{ins.icon}</span>
                      <span style={{ fontWeight: 700, fontSize: 14, color: c.ic }}>{ins.title}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.5, margin: 0 }}>{ins.msg}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Full Category Fee Table */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", overflow: "hidden", marginBottom: 32 }}>
          <div style={{ padding: "22px 28px", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
            <div style={{ display: "inline-block", background: "rgba(53,208,178,0.1)", border: "1px solid rgba(53,208,178,0.2)", borderRadius: 100, padding: "3px 12px", color: "#35d0b2", fontSize: 11, fontWeight: 700, marginBottom: 8 }}>Fee Reference Table</div>
            <h2 style={{ fontWeight: 800, fontSize: 20, color: "#0f172a" }}>All Category Referral Fees - Amazon India 2026</h2>
            <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>Updated March 2026 - Zero fee expanded to products priced ≤₹1,000</p>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {["Category", "Group", "≤ ₹1,000", "> ₹1,000", "High Returns", "FBA Closing (₹1k)", "ES Closing (₹1k)"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#64748b", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CATEGORY_FEES.map((cat, i) => (
                  <tr key={cat.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa", cursor: "pointer" }}
                    onClick={() => setSelectedCategory(cat)}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(53,208,178,0.05)"}
                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fafafa"}>
                    <td style={{ padding: "11px 16px", fontWeight: 600, color: selectedCategory?.id === cat.id ? "#35d0b2" : "#0f172a", borderBottom: "1px solid #f1f5f9" }}>
                      {selectedCategory?.id === cat.id && "→ "}{cat.name}
                    </td>
                    <td style={{ padding: "11px 16px", color: "#64748b", borderBottom: "1px solid #f1f5f9" }}>{cat.group}</td>
                    <td style={{ padding: "11px 16px", borderBottom: "1px solid #f1f5f9" }}>
                      <span style={{ background: "#f0fdf4", color: "#16a34a", fontWeight: 800, padding: "2px 8px", borderRadius: 100, fontSize: 12 }}>0% FREE</span>
                    </td>
                    <td style={{ padding: "11px 16px", fontWeight: 700, color: "#0f172a", borderBottom: "1px solid #f1f5f9", fontFamily: "'JetBrains Mono', monospace" }}>{cat.referral(1500)}%</td>
                    <td style={{ padding: "11px 16px", borderBottom: "1px solid #f1f5f9" }}>
                      {cat.highReturn ? <span style={{ background: "#fef2f2", color: "#dc2626", padding: "2px 8px", borderRadius: 100, fontSize: 11, fontWeight: 700 }}>Yes ⚠️</span> : <span style={{ color: "#94a3b8" }}>-</span>}
                    </td>
                    <td style={{ padding: "11px 16px", color: "#374151", borderBottom: "1px solid #f1f5f9", fontFamily: "'JetBrains Mono', monospace" }}>₹{cat.closingFBA(1000)}</td>
                    <td style={{ padding: "11px 16px", color: "#374151", borderBottom: "1px solid #f1f5f9", fontFamily: "'JetBrains Mono', monospace" }}>₹{cat.closingES(1000)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "12px 16px", background: "#f8fafc", borderTop: "1px solid #e8ecf0" }}>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>💡 Click any row to select that category and calculate fees instantly</p>
          </div>
        </div>

        {/* How It Works */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "48px 40px", marginBottom: 32, border: "1px solid #e8ecf0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 48, alignItems: "start" }}>
            <div>
              <div style={{ display: "inline-block", background: "rgba(53,208,178,0.1)", border: "1px solid rgba(53,208,178,0.2)", borderRadius: 100, padding: "4px 14px", color: "#35d0b2", fontSize: 12, fontWeight: 700, marginBottom: 16 }}>How It Works</div>
              <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.8px", lineHeight: 1.3, color: "#0f172a" }}>How Amazon Calculates Your Fees</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                ["Step 1 - Referral Fee", "Amazon charges a % of your selling price depending on category. As of March 2026, products ≤₹1,000 in most categories pay 0%."],
                ["Step 2 - Closing Fee", "A flat fee per order based on your price slab and fulfillment method. Ranges from ₹5 to ₹100+."],
                ["Step 3 - Shipping Fee", "Weight handling charges based on actual or volumetric weight (whichever is higher) and delivery zone."],
                ["Step 4 - Net Profit", "Selling Price − Referral Fee − Closing Fee − Shipping Fee − GST on Fees − Product Cost = Your profit."],
              ].map(([title, desc]) => (
                <div key={title} style={{ display: "flex", gap: 14, background: "#f8fafc", borderRadius: 12, padding: "18px", border: "1px solid #e8ecf0" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#35d0b2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#030a10", fontSize: 14, fontWeight: 700 }}>✓</div>
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
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", padding: "40px", marginBottom: 48 }}>
          <div style={{ display: "inline-block", background: "rgba(53,208,178,0.1)", border: "1px solid rgba(53,208,178,0.2)", borderRadius: 100, padding: "4px 14px", color: "#35d0b2", fontSize: 12, fontWeight: 700, marginBottom: 16 }}>FAQ</div>
          <h2 style={{ fontWeight: 800, fontSize: 24, marginBottom: 24, color: "#0f172a", letterSpacing: "-0.5px" }}>Frequently Asked Questions</h2>
          {[
            ["What is Amazon Referral Fee?", "Referral fee is Amazon's commission for helping you sell on their platform. It's a percentage of your selling price, ranging from 0% to 22% depending on your product category and price."],
            ["What changed in March 2026?", "Amazon India expanded zero referral fees to products priced under ₹1,000 across 1,800+ categories - a 10x expansion from the previous ₹300 limit. This is a huge benefit for sellers of affordable products."],
            ["What is the difference between FBA, Easy Ship and Self Ship?", "FBA: Amazon stores and ships - higher fees but Prime badge. Easy Ship: You store, Amazon picks up and delivers - medium fees. Self Ship: You handle everything - lowest Amazon fees but you bear courier costs."],
            ["What is Volumetric Weight?", "Volumetric weight = (Length × Width × Height) ÷ 5000. Amazon charges based on whichever is higher - actual weight or volumetric weight. A large but light item like a pillow may be charged at 3x its actual weight."],
            ["What is Closing Fee?", "A flat fee per order charged in addition to the referral fee. It varies by selling price slab and fulfillment method. FBA closing fees are higher than Easy Ship closing fees."],
            ["What is Refund Administration Fee?", "When a customer returns a product, Amazon refunds your referral fee but deducts approximately 10% of it as a handling charge. This is called the Refund Administration Fee."],
            ["How does the Reverse Calculator work?", "Enter your target profit per unit and your product cost. Our calculator estimates the minimum selling price you need to achieve that profit after all Amazon fees are deducted."],
          ].map(([q, a]) => <FAQItem key={q} q={q} a={a} />)}
        </div>
      </div>
    </div>
  );
}

export default AmazonReferralFee;
