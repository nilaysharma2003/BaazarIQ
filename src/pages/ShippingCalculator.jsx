import React, { useState, useCallback } from "react";
import InputField from "../components/common/InputField";
import SelectField from "../components/common/SelectField";
import Button from "../components/common/Button";
import {
  COURIERS, ZONE_DATA, calcVolumetric, calcShipping, getShippingInsights,
} from "../utils/shippingData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 14, marginBottom: 14 }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", background: "none", border: "none",
        display: "flex", justifyContent: "space-between",
        alignItems: "center", cursor: "pointer", textAlign: "left", gap: 8,
        fontFamily: "'Plus Poppins', sans-serif",
      }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: "#0f172a" }}>{q}</span>
        <span style={{ fontSize: 18, color: "#94a3b8", transform: open ? "rotate(180deg)" : "", transition: "transform 0.2s", flexShrink: 0 }}>▾</span>
      </button>
      {open && <p style={{ fontSize: 14, color: "#64748b", marginTop: 10, lineHeight: 1.7 }}>{a}</p>}
    </div>
  );
}

function WeightVisualizer({ actual, volumetric, chargeable }) {
  const max = Math.max(actual, volumetric, 1) * 1.2;
  return (
    <div style={{ background: "#f8fafc", borderRadius: 12, padding: 16, marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 12 }}>Weight Comparison</div>
      {[
        { label: "Actual Weight", value: actual, color: "#2563eb" },
        { label: "Volumetric Weight", value: volumetric, color: "#f97316" },
        { label: "Chargeable Weight", value: chargeable, color: chargeable === volumetric ? "#ef4444" : "#16a34a" },
      ].map(({ label, value, color }) => (
        <div key={label} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: "#64748b" }}>{label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color }}>{value.toFixed(2)} kg</span>
          </div>
          <div style={{ height: 8, background: "#e2e8f0", borderRadius: 100, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${Math.min((value / max) * 100, 100)}%`,
              background: color, borderRadius: 100, transition: "width 0.5s ease",
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function PackageVisualizer({ length, width, height }) {
  const l = parseFloat(length) || 0;
  const w = parseFloat(width) || 0;
  const h = parseFloat(height) || 0;
  const hasdims = l > 0 && w > 0 && h > 0;
  const maxDim = Math.max(l, w, h, 1);
  const boxW = Math.max(60, (w / maxDim) * 120);
  const boxH = Math.max(40, (h / maxDim) * 100);
  const depth = Math.max(20, (l / maxDim) * 50);

  return (
    <div style={{
      background: "#f8fafc", borderRadius: 12, padding: 16,
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: 140, marginBottom: 16,
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 12, alignSelf: "flex-start" }}>
        Package Preview
      </div>
      {hasdims ? (
        <div style={{ position: "relative", display: "inline-block" }}>
          <div style={{
            width: boxW, height: boxH,
            background: "linear-gradient(135deg,#bfdbfe,#93c5fd)",
            border: "2px solid #2563eb", borderRadius: 4,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 11, color: "#1d4ed8", fontWeight: 600 }}>{w}×{h}</span>
          </div>
          <div style={{
            position: "absolute", top: -depth * 0.4, right: -depth * 0.6,
            width: boxW, height: depth * 0.5,
            background: "linear-gradient(135deg,#dbeafe,#bfdbfe)",
            border: "2px solid #2563eb", borderRadius: "4px 4px 0 0",
            transform: "skewX(-45deg)", transformOrigin: "bottom left",
          }} />
          <div style={{
            position: "absolute", top: 0, right: -depth * 0.6,
            width: depth * 0.6, height: boxH,
            background: "linear-gradient(135deg,#93c5fd,#60a5fa)",
            border: "2px solid #2563eb", borderRadius: "0 4px 4px 0",
          }}>
            <span style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%,-50%) rotate(90deg)",
              fontSize: 10, color: "#1d4ed8", fontWeight: 600, whiteSpace: "nowrap",
            }}>{l}cm</span>
          </div>
        </div>
      ) : (
        <div style={{ color: "#94a3b8", fontSize: 13 }}>Enter dimensions to preview</div>
      )}
      {hasdims && <div style={{ fontSize: 11, color: "#64748b", marginTop: 12 }}>{l} × {w} × {h} cm</div>}
    </div>
  );
}

function CourierCard({ name, data, courier, isCheapest, isFastest }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 14,
      border: `2px solid ${isCheapest ? courier.color : courier.border}`,
      padding: "16px", position: "relative",
      boxShadow: isCheapest ? `0 6px 20px ${courier.color}22` : "none",
      transition: "all 0.2s",
    }}>
      {isCheapest && (
        <div style={{
          position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
          background: courier.color, color: "#fff",
          fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 100, whiteSpace: "nowrap",
        }}>💰 CHEAPEST</div>
      )}
      {isFastest && !isCheapest && (
        <div style={{
          position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
          background: "#7c3aed", color: "#fff",
          fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 100, whiteSpace: "nowrap",
        }}>⚡ FASTEST</div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: courier.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
          {courier.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a" }}>{name}</div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>Delivery in {data.deliveryDays} days</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: courier.color, fontFamily: "'JetBrains Mono',monospace" }}>₹{data.totalCost.toFixed(0)}</div>
          <div style={{ fontSize: 10, color: "#94a3b8" }}>total cost</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {[["Shipping Cost", `₹${data.shippingCost.toFixed(2)}`], ["COD Charge", `₹${data.codCharge.toFixed(2)}`], ["Chargeable Wt", `${data.chargeable.toFixed(2)} kg`]].map(([l, v]) => (
          <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748b", padding: "3px 0", borderBottom: "1px solid #f8fafc" }}>
            <span>{l}</span>
            <span style={{ fontWeight: 600, color: "#374151" }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 10 }}>
        {courier.features.map(f => (
          <span key={f} style={{ fontSize: 10, background: courier.bg, color: courier.color, padding: "2px 8px", borderRadius: 100, fontWeight: 600, border: `1px solid ${courier.border}` }}>{f}</span>
        ))}
      </div>
    </div>
  );
}

function ShippingCalculator() {
  const [inputs, setInputs] = useState({
    actualWeight: "", length: "", width: "", height: "",
    pickupPin: "", deliveryPin: "", deliveryType: "Standard",
    selectedCourier: "All", codEnabled: false, codAmount: "",
  });

  const set = useCallback((k, v) => {
    setInputs((prev) => {
      if (prev[k] === v) return prev;
      return { ...prev, [k]: v };
    });
  }, []);

  const zone = ZONE_DATA.getZone(inputs.pickupPin, inputs.deliveryPin);
  const volumetric = calcVolumetric(inputs.length, inputs.width, inputs.height);
  const actual = parseFloat(inputs.actualWeight) || 0;
  const chargeable = Math.max(actual, volumetric);

  const hasEnough = actual > 0 && zone && inputs.pickupPin.length === 6 && inputs.deliveryPin.length === 6;

  const { results } = hasEnough ? calcShipping({ ...inputs, zone }) : { results: {} };

  const insights = hasEnough ? getShippingInsights({ results, volumetric, actual, chargeable, zone, inputs }) : [];

  const cheapest = Object.entries(results).sort((a, b) => a[1].totalCost - b[1].totalCost)[0]?.[0];
  const fastest = Object.entries(results).sort((a, b) => parseInt(a[1].deliveryDays) - parseInt(b[1].deliveryDays))[0]?.[0];

  const chartData = Object.entries(results).map(([name, data]) => ({
    name, "Shipping Cost": data.shippingCost, "COD Charge": data.codCharge,
  }));

  const resetForm = () => setInputs({
    actualWeight: "", length: "", width: "", height: "",
    pickupPin: "", deliveryPin: "", deliveryType: "Standard",
    selectedCourier: "All", codEnabled: false, codAmount: "",
  });

  return (
    <div style={{ background: "#f1f5f9", minHeight: "100vh", fontFamily: "'Plus Poppins', sans-serif" }}>

      {/* Hero — BIGGER like FBA Calculator */}
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
            <span style={{ fontSize: 16 }}>🚚</span>
            <span style={{ color: "#35d0b2", fontSize: 14, fontWeight: 600 }}>Multi-Courier Comparison Tool</span>
          </div>

          {/* Subtitle */}
          <p style={{ color: "#35d0b2", fontSize: 16, fontWeight: 600, marginBottom: 12, letterSpacing: "0.3px" }}>
            India's Smartest Shipping Cost Calculator
          </p>

          {/* Main heading */}
          <h1 style={{
            fontSize: "clamp(42px, 6vw, 72px)",
            fontWeight: 900, letterSpacing: "-2px",
            lineHeight: 1.1, color: "#f8fafc", marginBottom: 20,
          }}>
            Ship Smarter{" "}
            <span style={{
              //background: "#35d0b2", borderRadius: 12,
              padding: "4px 20px", color: "#f8fafc",
              display: "inline-block", marginLeft: 8,
            }}>
              Save More 
            </span>
          </h1>

          {/* Description */}
          <p style={{
            color: "#94a3b8", fontSize: 18,
            maxWidth: 580, margin: "0 auto 32px", lineHeight: 1.75,
          }}>
            Enter your package weight, dimensions and pincodes to instantly
            compare shipping costs across 6+ couriers — including volumetric
            weight calculation, COD charges and zone-based pricing.
          </p>

          {/* Stats bar */}
          <div style={{
            display: "flex", justifyContent: "center",
            gap: 0, flexWrap: "wrap",
            borderTop: "1px solid rgba(53,208,178,0.15)",
            paddingTop: 28,
          }}>
            {[
              ["6 Couriers", "Compared Instantly"],
              ["Volumetric Wt", "Auto Calculated"],
              ["Zone Detection", "By Pincode"],
              ["COD Charges", "Included"],
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

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24, paddingBottom: 48 }}>

          {/* LEFT: Form */}
          <div style={{
            background: "#fff", borderRadius: 16,
            border: "1px solid #e2e8f0", overflow: "hidden",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}>
            <div style={{
              padding: "20px 24px", borderBottom: "1px solid #f1f5f9",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "#f8fafc",
            }}>
              <div>
                <h2 style={{ fontWeight: 700, fontSize: 17, color: "#0f172a" }}>Shipment Details</h2>
                <p style={{ color: "#94a3b8", fontSize: 13 }}>Enter package and delivery info</p>
              </div>
              <Button onClick={resetForm} variant="secondary">↺ Reset</Button>
            </div>

            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "#f8fafc", borderRadius: 10, padding: "16px", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 12 }}>📦 Package Dimensions</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <InputField label="Actual Weight" value={inputs.actualWeight} onChange={(v) => set("actualWeight", v)} suffix="kg" placeholder="0.5" hint="Dead weight of package"/>
                  <InputField label="Length" value={inputs.length} onChange={(v) => set("length", v)} suffix="cm" placeholder="30"/>
                  <InputField label="Width" value={inputs.width} onChange={(v) => set("width", v)} suffix="cm" placeholder="20"/>
                  <InputField label="Height" value={inputs.height} onChange={(v) => set("height", v)} suffix="cm" placeholder="15"/>
                </div>
              </div>

              {(actual > 0 || volumetric > 0) && (
                <WeightVisualizer actual={actual} volumetric={volumetric} chargeable={chargeable}/>
              )}

              <div style={{ background: "#f8fafc", borderRadius: 10, padding: "16px", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 12 }}>🗺️ Delivery Details</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <InputField label="Pickup Pincode" value={inputs.pickupPin} onChange={(v) => set("pickupPin", v)} placeholder="110001" hint="Your warehouse pincode"/>
                  <InputField label="Delivery Pincode" value={inputs.deliveryPin} onChange={(v) => set("deliveryPin", v)} placeholder="400001" hint="Customer pincode"/>
                </div>
                {zone && (
                  <div style={{
                    marginTop: 10,
                    background: zone === "Local" ? "#f0fdf4" : zone === "Regional" ? "#fffbeb" : "#fef2f2",
                    border: `1px solid ${zone === "Local" ? "#bbf7d0" : zone === "Regional" ? "#fde68a" : "#fecaca"}`,
                    borderRadius: 8, padding: "8px 12px",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <span style={{ fontSize: 16 }}>{zone === "Local" ? "🟢" : zone === "Regional" ? "🟡" : "🔴"}</span>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: 13, color: zone === "Local" ? "#16a34a" : zone === "Regional" ? "#d97706" : "#dc2626" }}>
                        {zone} Zone Detected
                      </span>
                      <span style={{ fontSize: 12, color: "#64748b", marginLeft: 8 }}>
                        {zone === "Local" ? "Same city/area" : zone === "Regional" ? "Same state" : "Different state"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Delivery Type</div>
                <div style={{ background: "#f8fafc", borderRadius: 10, padding: "4px", display: "flex", gap: 4 }}>
                  {["Standard", "Express"].map((t) => (
                    <button key={t} onClick={() => set("deliveryType", t)} style={{
                      flex: 1, padding: "8px", borderRadius: 7, border: "none",
                      background: inputs.deliveryType === t ? "#35d0b2" : "transparent",
                      color: inputs.deliveryType === t ? "#030a10" : "#64748b",
                      fontWeight: 600, fontSize: 13, cursor: "pointer",
                      fontFamily: "'Plus Poppins',sans-serif",
                    }}>
                      {t === "Standard" ? "🚚 Standard" : "⚡ Express"}
                    </button>
                  ))}
                </div>
                {inputs.deliveryType === "Express" && (
                  <p style={{ fontSize: 11, color: "#f97316", marginTop: 6 }}>⚡ Express adds 20-60% to shipping cost</p>
                )}
              </div>

              <SelectField label="Courier Partner" value={inputs.selectedCourier}
                onChange={(v) => set("selectedCourier", v)} placeholder="Select Courier"
                options={[
                  { value: "All", label: "🔍 Compare All Couriers" },
                  ...Object.keys(COURIERS).map((c) => ({ value: c, label: `${COURIERS[c].icon} ${c}` })),
                ]}/>

              <div style={{ background: "#f8fafc", borderRadius: 10, padding: "14px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: inputs.codEnabled ? 12 : 0 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>💵 Cash on Delivery (COD)</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>Additional COD charges apply</div>
                  </div>
                  <button onClick={() => set("codEnabled", !inputs.codEnabled)} style={{
                    width: 44, height: 24, borderRadius: 100,
                    background: inputs.codEnabled ? "#35d0b2" : "#e2e8f0",
                    border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s",
                  }}>
                    <div style={{
                      position: "absolute", top: 2,
                      left: inputs.codEnabled ? 22 : 2,
                      width: 20, height: 20, borderRadius: "50%",
                      background: "#fff", transition: "left 0.2s",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                    }} />
                  </button>
                </div>
                {inputs.codEnabled && (
                  <InputField label="COD Order Amount" value={inputs.codAmount}
                    onChange={(v) => set("codAmount", v)} prefix="₹" placeholder="999"
                    hint="COD charge = max(flat fee, % of order)"/>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Results */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <PackageVisualizer length={inputs.length} width={inputs.width} height={inputs.height}/>

            {hasEnough ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  {[
                    { label: "Actual Weight", value: `${actual.toFixed(2)} kg`, color: "#2563eb", bg: "#eff6ff" },
                    { label: "Volumetric Wt", value: `${volumetric.toFixed(2)} kg`, color: "#f97316", bg: "#fff7ed" },
                    { label: "Chargeable Wt", value: `${chargeable.toFixed(2)} kg`, color: chargeable === volumetric ? "#ef4444" : "#16a34a", bg: chargeable === volumetric ? "#fef2f2" : "#f0fdf4" },
                  ].map(({ label, value, color, bg }) => (
                    <div key={label} style={{ background: bg, borderRadius: 12, padding: "12px", border: `1px solid ${color}22`, textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>{label}</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color, fontFamily: "'JetBrains Mono',monospace" }}>{value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {Object.entries(results).sort((a, b) => a[1].totalCost - b[1].totalCost).map(([name, data]) => (
                    <CourierCard key={name} name={name} data={data} courier={COURIERS[name]} isCheapest={name === cheapest} isFastest={name === fastest}/>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "48px 24px", textAlign: "center", flex: 1 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🚚</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#64748b", marginBottom: 8 }}>Enter shipment details</h3>
                <p style={{ fontSize: 13, color: "#94a3b8" }}>Fill in weight, dimensions and both pincodes to compare courier rates</p>
              </div>
            )}
          </div>
        </div>

        {/* Chart */}
        {hasEnough && chartData.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "24px", marginBottom: 32 }}>
            <h2 style={{ fontWeight: 700, fontSize: 17, marginBottom: 4, color: "#0f172a" }}>Courier Cost Comparison</h2>
            <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 20 }}>Shipping cost breakdown across all couriers</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 600 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => `₹${v}`} contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="Shipping Cost" fill="#35d0b2" radius={[6, 6, 0, 0]} />
                <Bar dataKey="COD Charge" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* AI Insights */}
        {hasEnough && insights.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "rgba(53,208,178,0.12)",
                border: "1px solid rgba(53,208,178,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
              }}>🤖</div>
              <div>
                <h2 style={{ fontWeight: 800, fontSize: 18, color: "#0f172a" }}>AI Insights</h2>
                <p style={{ color: "#64748b", fontSize: 13 }}>Smart shipping recommendations</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
              {insights.map((ins, i) => {
                const cfg = {
                  success: { bg: "#f0fdf4", border: "#bbf7d0", ic: "#16a34a" },
                  warn: { bg: "#fffbeb", border: "#fde68a", ic: "#d97706" },
                  danger: { bg: "#fef2f2", border: "#fecaca", ic: "#dc2626" },
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

        {/* FAQ */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "32px", marginBottom: 48 }}>
          <div style={{
            display: "inline-block", background: "rgba(53,208,178,0.1)",
            border: "1px solid rgba(53,208,178,0.2)", borderRadius: 100,
            padding: "4px 14px", color: "#35d0b2", fontSize: 12, fontWeight: 600, marginBottom: 16,
          }}>FAQ</div>
          <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 24, letterSpacing: "-0.5px", color: "#0f172a" }}>
            Frequently Asked Questions
          </h2>
          {[
            ["What is Volumetric Weight?", "Volumetric weight = (L × W × H) / 5000. Couriers charge based on whichever is higher — actual or volumetric. A large but light package may be charged at volumetric weight."],
            ["What is Chargeable Weight?", "Chargeable weight is the maximum of actual weight and volumetric weight. This is what the courier charges you for."],
            ["What is COD charge?", "Cash on Delivery charge is an extra fee couriers charge for handling cash collection. It's typically a flat fee or a percentage of the order value, whichever is higher."],
            ["Which courier is best for ecommerce?", "Delhivery and XpressBees are most popular for ecommerce due to competitive rates and good coverage. Bluedart is best for high-value or urgent shipments."],
            ["What is Express delivery?", "Express delivery is faster but costs 20-60% more than standard. Use it only for urgent or high-value orders."],
          ].map(([q, a]) => <FAQItem key={q} q={q} a={a}/>)}
        </div>
      </div>
    </div>
  );
}

export default ShippingCalculator;