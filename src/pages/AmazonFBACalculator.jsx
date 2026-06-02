import React, { useState } from "react";
import InputField from "../components/common/InputField";
import SelectField from "../components/common/SelectField";
import Button from "../components/common/Button";
import FeeBreakdownChart from "../components/charts/FeeBreakdownChart";
import { calcFBA, getProfitStatus, getInsights } from "../utils/calculations";
import CATEGORY_DATA from "../utils/categoryData";

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #e8ecf0", paddingBottom: 14, marginBottom: 14 }}>
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

function AmazonFBACalculator() {
  const [inputs, setInputs] = useState({
    category: "", subcategory: "", sellingPrice: "", productCost: "",
    weightGm: "", shippingCost: "", gstPct: "18",
    shippingMethod: "Amazon FBA", area: "Local", stepLevel: "Basic",
  });
  const [copied, setCopied] = useState(false);

  const set = (k, v) => setInputs((prev) => ({ ...prev, [k]: v }));

  const hasPrice = parseFloat(inputs.sellingPrice) > 0;
  const results = hasPrice ? calcFBA(inputs) : {
    referralFee: 0, closingFee: 0, amazonShipping: 0,
    gstAmount: 0, totalFees: 0, totalCost: 0,
    profit: 0, roi: 0, margin: 0, referralPct: 0.12,
  };

  const profitStatus = getProfitStatus(results.margin);
  const insights = hasPrice ? getInsights(results, inputs) : [];
  const subcategories = inputs.category ? CATEGORY_DATA[inputs.category]?.subs || [] : [];

  const copyResults = () => {
    const txt = `FBA Profit Summary
──────────────────
Selling Price: ₹${inputs.sellingPrice}
Product Cost: ₹${inputs.productCost}
Weight: ${inputs.weightGm}gm
Shipping Method: ${inputs.shippingMethod}
Step Level: ${inputs.stepLevel}
──────────────────
Referral Fee: ₹${results.referralFee.toFixed(2)}
Closing Fee: ₹${results.closingFee.toFixed(2)}
Shipping Fee: ₹${results.amazonShipping.toFixed(2)}
GST: ₹${results.gstAmount.toFixed(2)}
Total Fees: ₹${results.totalFees.toFixed(2)}
Total Cost: ₹${results.totalCost.toFixed(2)}
──────────────────
Net Profit: ₹${results.profit.toFixed(2)}
ROI: ${results.roi.toFixed(1)}%
Margin: ${results.margin.toFixed(1)}%`;
    navigator.clipboard.writeText(txt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const resetForm = () => setInputs({
    category: "", subcategory: "", sellingPrice: "", productCost: "",
    weightGm: "", shippingCost: "", gstPct: "18",
    shippingMethod: "Amazon FBA", area: "Local", stepLevel: "Basic",
  });

  return (
    <div style={{ background: "#f1f5f9", minHeight: "100vh", fontFamily: "'Plus Poppins', sans-serif" }}>

      {/* Hero — dark #030a10 BIGGER */}
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
            <span style={{ fontSize: 16 }}>📦</span>
            <span style={{ color: "#35d0b2", fontSize: 14, fontWeight: 600 }}>Amazon Seller Tool</span>
          </div>

          {/* Subtitle */}
          <p style={{ color: "#35d0b2", fontSize: 16, fontWeight: 600, marginBottom: 12, letterSpacing: "0.3px" }}>
            Free Amazon Profit Tool for Indian Sellers
          </p>

          {/* Main heading */}
          <h1 style={{
            fontSize: "clamp(42px, 6vw, 72px)",
            fontWeight: 900,
            letterSpacing: "-2px",
            lineHeight: 1.1,
            color: "#f8fafc",
            marginBottom: 20,
          }}>
            Amazon FBA Profit Calculator
          </h1>

          {/* Description */}
          <p style={{
            color: "#94a3b8", fontSize: 18,
            maxWidth: 620, margin: "0 auto 16px",
            lineHeight: 1.75,
          }}>
            Calculate your exact net profit before listing on Amazon. Enter your
            selling price, product cost, weight and category — and instantly see
            referral fees, closing fees, shipping charges, GST and your final
            profit margin.
          </p>
          <p style={{
            color: "#64748b", fontSize: 15,
            maxWidth: 560, margin: "0 auto 32px",
            lineHeight: 1.7,
          }}>
            Supports FBA, Easy Ship, Self Ship and Seller Flex — with AI-powered
            insights to help you price smarter and sell profitably on Amazon India.
          </p>

          {/* Stats bar */}
          <div style={{
            display: "flex", justifyContent: "center",
            gap: 0, flexWrap: "wrap",
            borderTop: "1px solid rgba(53,208,178,0.15)",
            paddingTop: 28,
          }}>
            {[
              ["Referral Fee", "Auto Calculated"],
              ["GST", "All Rates Covered"],
              ["FBA + FBM", "Both Supported"],
              ["AI Insights", "Included Free"],
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

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 24, marginTop: 24, paddingBottom: 48,
        }}>

          {/* LEFT: Form */}
          <div style={{
            background: "#ffffff", borderRadius: 16,
            border: "1px solid #e8ecf0",
            overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}>
            <div style={{
              padding: "20px 24px", borderBottom: "1px solid #f1f5f9",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "#f8fafc",
            }}>
              <div>
                <h2 style={{ fontWeight: 700, fontSize: 17, color: "#0f172a" }}>Product Details</h2>
                <p style={{ color: "#94a3b8", fontSize: 13 }}>Fill in your listing information</p>
              </div>
              <Button onClick={resetForm} variant="secondary">↺ Reset</Button>
            </div>

            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: inputs.category ? "1fr 1fr" : "1fr", gap: 14 }}>
                <SelectField label="Category" value={inputs.category}
                  onChange={(v) => set("category", v)} placeholder="Select Category"
                  options={Object.keys(CATEGORY_DATA)} />
                {inputs.category && (
                  <SelectField label="Subcategory" value={inputs.subcategory}
                    onChange={(v) => set("subcategory", v)} placeholder="Select a Subcategory"
                    options={subcategories} />
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <InputField label="Selling Price" value={inputs.sellingPrice}
                  onChange={(v) => set("sellingPrice", v)} prefix="₹" placeholder="999" />
                <InputField label="Product Cost" value={inputs.productCost}
                  onChange={(v) => set("productCost", v)} prefix="₹" placeholder="400" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <InputField label="Weight (gm)" value={inputs.weightGm}
                  onChange={(v) => set("weightGm", v)} suffix="gm" placeholder="500"
                  hint="Enter weight in grams" />
                <InputField label="Your Shipping Cost" value={inputs.shippingCost}
                  onChange={(v) => set("shippingCost", v)} prefix="₹" placeholder="0" />
              </div>

              <SelectField label="Area" value={inputs.area}
                onChange={(v) => set("area", v)} placeholder="Select Area"
                options={["Local", "Regional", "National"]} />

              <SelectField label="Shipping Method" value={inputs.shippingMethod}
                onChange={(v) => set("shippingMethod", v)} placeholder="Select Shipping Method"
                options={["Amazon FBA", "Self Ship", "Amazon Easy Ship", "Seller Flex"]} />

              <SelectField label="Select Step Level" value={inputs.stepLevel}
                onChange={(v) => set("stepLevel", v)} placeholder="Select Step Level"
                options={["Basic", "Premium", "Advanced", "Standard"]} />

              <SelectField label="GST Percentage" value={inputs.gstPct}
                onChange={(v) => set("gstPct", v)} placeholder="Select GST %"
                options={[
                  { value: "0", label: "0%" }, { value: "5", label: "5%" },
                  { value: "12", label: "12%" }, { value: "18", label: "18%" },
                  { value: "28", label: "28%" },
                ]} />

              {hasPrice && (
                <div style={{
                  background: profitStatus.bg,
                  border: `1px solid ${profitStatus.border}`,
                  borderRadius: 10, padding: "12px 16px",
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <span style={{ fontSize: 22 }}>{profitStatus.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: profitStatus.color, fontSize: 15 }}>
                      {profitStatus.label}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>
                      Profit margin: {results.margin.toFixed(1)}%
                    </div>
                  </div>
                </div>
              )}

              <button onClick={copyResults} disabled={!hasPrice} style={{
                background: hasPrice ? "#35d0b2" : "#f1f5f9",
                color: hasPrice ? "#030a10" : "#94a3b8",
                border: "none", borderRadius: 10, padding: "12px",
                fontSize: 14, fontWeight: 700,
                cursor: hasPrice ? "pointer" : "default",
                fontFamily: "'Plus Poppins', sans-serif",
              }}>
                {copied ? "✅ Copied!" : "📋 Copy Result Summary"}
              </button>
            </div>
          </div>

          {/* RIGHT: Results */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{
              background: results.profit >= 0
                ? "linear-gradient(135deg,#0a2818,#0f3d24)"
                : "linear-gradient(135deg,#2a0a0a,#3d0f0f)",
              borderRadius: 16, padding: "24px", color: "#fff",
              border: `1px solid ${results.profit >= 0 ? "rgba(53,208,178,0.2)" : "rgba(239,68,68,0.2)"}`,
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#94a3b8", marginBottom: 4 }}>
                Net Profit per Unit
              </div>
              <div style={{
                fontSize: 40, fontWeight: 800,
                fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-1px",
                color: results.profit >= 0 ? "#35d0b2" : "#ef4444",
              }}>
                {hasPrice ? `${results.profit >= 0 ? "+" : ""}₹${results.profit.toFixed(2)}` : "₹ —"}
              </div>
              {hasPrice && (
                <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
                  {[["ROI", `${results.roi.toFixed(1)}%`],
                    ["Margin", `${results.margin.toFixed(1)}%`],
                    ["Total Fees", `₹${results.totalFees.toFixed(2)}`]].map(([l, v]) => (
                    <div key={l}>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{l}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "#35d0b2" }}>{v}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Referral Fee", value: results.referralFee, icon: "💸", color: "#ef4444", bg: "#fef2f2" },
                { label: "Closing Fee", value: results.closingFee, icon: "📋", color: "#f59e0b", bg: "#fffbeb" },
                { label: "Shipping Fee", value: results.amazonShipping, icon: "🚚", color: "#35d0b2", bg: "#f0fdfa" },
                { label: "GST Amount", value: results.gstAmount, icon: "🧾", color: "#06b6d4", bg: "#ecfeff" },
                { label: "Total Fees", value: results.totalFees, icon: "🧮", color: "#f97316", bg: "#fff7ed" },
                { label: "Total Cost", value: results.totalCost, icon: "💼", color: "#64748b", bg: "#f8fafc" },
              ].map(({ label, value, icon, color, bg }) => (
                <div key={label} style={{
                  background: bg, borderRadius: 12,
                  padding: "14px 16px", border: `1px solid ${color}22`,
                  display: "flex", flexDirection: "column", gap: 4,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 14 }}>{icon}</span>
                    <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{label}</span>
                  </div>
                  <div style={{
                    fontSize: 18, fontWeight: 800, color,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {hasPrice ? `₹${value.toFixed(2)}` : "₹ —"}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: "#ffffff", borderRadius: 16,
              border: "1px solid #e8ecf0", padding: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: "#0f172a" }}>Fee Breakdown</h3>
              <p style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8 }}>Visual distribution of costs</p>
              <FeeBreakdownChart results={results} />
            </div>
          </div>
        </div>

        {/* AI Insights */}
        {hasPrice && insights.length > 0 && (
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
                <p style={{ color: "#64748b", fontSize: 13 }}>Recommendations based on your numbers</p>
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

        {/* How It Works */}
        <div style={{
          background: "#ffffff", borderRadius: 16,
          padding: "48px 40px", marginBottom: 32,
          border: "1px solid #e8ecf0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 48, alignItems: "start" }}>
            <div>
              <div style={{
                display: "inline-block",
                background: "rgba(53,208,178,0.1)",
                border: "1px solid rgba(53,208,178,0.25)",
                borderRadius: 100, padding: "4px 14px",
                color: "#35d0b2", fontSize: 12, fontWeight: 600, marginBottom: 16,
              }}>
                How It Works
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.8px", lineHeight: 1.3, color: "#0f172a" }}>
                How the Amazon FBA Fee Calculator Works for Sellers
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[
                ["Step 1 — Enter product details", "Add price, cost, and shipping to Amazon so the calculator can estimate your total revenue and base expenses."],
                ["Step 2 — Select category and specs", "Choose product category and enter size, weight, and dimensions to calculate referral and fulfillment fees."],
                ["Step 3 — Add additional costs", "Include storage period, prep fees, taxes, and other costs to reflect your full Amazon expense structure."],
                ["Step 4 — Review profitability", "Instantly see total fees, net profit, margin, and ROI so you can validate or adjust your pricing strategy."],
              ].map(([title, desc]) => (
                <div key={title} style={{
                  display: "flex", gap: 14,
                  background: "#f8fafc", borderRadius: 12,
                  padding: "18px", border: "1px solid #e8ecf0",
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "#35d0b2", display: "flex",
                    alignItems: "center", justifyContent: "center",
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

        {/* Input Descriptions */}
        <div style={{
          background: "#ffffff", borderRadius: 16,
          border: "1px solid #e8ecf0", padding: "40px", marginBottom: 32,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{
              display: "inline-block",
              background: "rgba(53,208,178,0.1)",
              border: "1px solid rgba(53,208,178,0.25)",
              borderRadius: 100, padding: "4px 14px",
              color: "#35d0b2", fontSize: 12, fontWeight: 600, marginBottom: 12,
            }}>
              Input Guide
            </div>
            <h2 style={{ fontWeight: 800, fontSize: 22, letterSpacing: "-0.5px", marginBottom: 6, color: "#0f172a" }}>
              Understanding Each Input Field
            </h2>
            <p style={{ color: "#64748b", fontSize: 14 }}>
              Here's what each field means and how to fill it correctly.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
            {[
              ["💰", "Selling Price", "#2563eb", "#eff6ff", "The price at which you list your product on Amazon. This is what the customer pays."],
              ["📦", "Product Cost", "#16a34a", "#f0fdf4", "The amount you paid to manufacture or buy the product. Also called COGS (Cost of Goods Sold)."],
              ["⚖️", "Weight (gm)", "#7c3aed", "#faf5ff", "The actual weight of your product in grams. Used to calculate Amazon's fulfillment fee."],
              ["🚚", "Shipping Method", "#0891b2", "#ecfeff", "How your product ships — FBA (Amazon ships), Easy Ship (Amazon picks up), Self Ship, or Seller Flex."],
              ["🗂️", "Category", "#ea580c", "#fff7ed", "The product category on Amazon. Different categories have different referral fee percentages."],
              ["🪜", "Step Level", "#9333ea", "#faf5ff", "Amazon's fulfillment pricing tier — Basic is standard. Premium and Advanced have higher charges but better service."],
              ["🧾", "GST Percentage", "#d97706", "#fffbeb", "Goods & Services Tax on your product. Common rates are 0%, 5%, 12%, 18% and 28%."],
              ["📍", "Area", "#16a34a", "#f0fdf4", "Delivery zone — Local, Regional, or National. Affects the shipping fee Amazon charges per order."],
              ["🏷️", "Your Shipping Cost", "#2563eb", "#eff6ff", "Any extra packaging or shipping cost you personally bear before Amazon handles the order."],
            ].map(([icon, label, color, bg, desc]) => (
              <div key={label} style={{
                background: bg, borderRadius: 12,
                padding: "16px 18px", border: `1px solid ${color}22`,
                transition: "border-color 0.15s",
              }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = color}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = `${color}22`}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>{icon}</span>
                  <span style={{ fontWeight: 700, fontSize: 14, color }}>{label}</span>
                </div>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{
          background: "#ffffff", borderRadius: 16,
          border: "1px solid #e8ecf0", padding: "32px", marginBottom: 48,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}>
          <div style={{
            display: "inline-block",
            background: "rgba(53,208,178,0.1)",
            border: "1px solid rgba(53,208,178,0.25)",
            borderRadius: 100, padding: "4px 14px",
            color: "#35d0b2", fontSize: 12, fontWeight: 600, marginBottom: 16,
          }}>FAQ</div>
          <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 24, color: "#0f172a" }}>
            Frequently Asked Questions
          </h2>
          {[
            ["What is Amazon FBA?", "Fulfillment by Amazon (FBA) means Amazon stores, packs, and ships your products. You pay storage + fulfillment fees but get Prime badge and Amazon customer support."],
            ["How is Referral Fee calculated?", "Referral fee is a percentage of the selling price, varying by category — typically 5% to 20%. Electronics are lower (~8%), Fashion higher (~15%)."],
            ["What is Closing Fee?", "A flat fee charged per item sold, based on the selling price tier. Ranges from ₹14 to ₹40+."],
            ["What is the difference between FBA, Easy Ship and Self Ship?", "FBA means Amazon stores and ships your product. Easy Ship means you store it but Amazon picks it up and delivers. Self Ship means you handle everything yourself."],
            ["What is Step Level?", "Step level refers to Amazon's fulfillment pricing tier. Basic is the standard rate, while Premium and Advanced have slightly higher shipping charges but better service levels."],
            ["Should I use FBA or Self Ship?", "FBA is better for high-volume, lightweight products. Self Ship can save shipping fees for heavy or slow-moving items."],
          ].map(([q, a]) => <FAQItem key={q} q={q} a={a} />)}
        </div>
      </div>
    </div>
  );
}

export default AmazonFBACalculator;