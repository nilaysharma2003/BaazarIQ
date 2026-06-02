import React, { useState, useCallback } from "react";
import SelectField from "../components/common/SelectField";
import InputField from "../components/common/InputField";
import Button from "../components/common/Button";
import {
  MARKETPLACES,
  CATEGORY_LIST,
  calcCommission,
  getMarketplaceInsights,
} from "../utils/commissionData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function ScoreBar({ label, value, max = 100, color }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 3,
        }}
      >
        <span style={{ fontSize: 11, color: "#64748b" }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color }}>{value}</span>
      </div>
      <div
        style={{
          height: 5,
          background: "#f1f5f9",
          borderRadius: 100,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(value / max) * 100}%`,
            background: color,
            borderRadius: 100,
            transition: "width 0.6s ease",
          }}
        />
      </div>
    </div>
  );
}

function MarketplaceCard({ name, data, marketplace, isBest, isTopProfit }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        border: `2px solid ${isBest ? marketplace.color : marketplace.border}`,
        padding: "20px",
        position: "relative",
        boxShadow: isBest
          ? `0 8px 24px ${marketplace.color}33`
          : "0 2px 8px rgba(0,0,0,0.04)",
        transition: "all 0.2s",
      }}
    >
      {/* Best badge */}
      {isBest && (
        <div
          style={{
            position: "absolute",
            top: -12,
            left: "50%",
            transform: "translateX(-50%)",
            background: marketplace.color,
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
            padding: "3px 12px",
            borderRadius: 100,
            whiteSpace: "nowrap",
          }}
        >
          🏆 BEST OVERALL
        </div>
      )}

      {/* Top profit badge */}
      {isTopProfit && !isBest && (
        <div
          style={{
            position: "absolute",
            top: -12,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#16a34a",
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
            padding: "3px 12px",
            borderRadius: 100,
            whiteSpace: "nowrap",
          }}
        >
          💰 BEST PROFIT
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: marketplace.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
          }}
        >
          {marketplace.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>
            {name}
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>
            {data.commissionPct.toFixed(0)}% commission
          </div>
        </div>
        {/* Platform Score Badge */}
        <div
          style={{
            background: marketplace.bg,
            border: `1px solid ${marketplace.border}`,
            borderRadius: 8,
            padding: "4px 8px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: marketplace.color,
            }}
          >
            {data.platformScore}
          </div>
          <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600 }}>
            SCORE
          </div>
        </div>
      </div>

      {/* Profit highlight */}
      <div
        style={{
          background: data.profit >= 0 ? marketplace.bg : "#fef2f2",
          borderRadius: 10,
          padding: "12px",
          marginBottom: 12,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 2 }}>
          Net Profit
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: data.profit >= 0 ? marketplace.color : "#dc2626",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {data.profit >= 0 ? "+" : ""}₹{data.profit.toFixed(0)}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginTop: 6,
          }}
        >
          <span style={{ fontSize: 12, color: "#64748b" }}>
            Margin:{" "}
            <strong style={{ color: marketplace.color }}>
              {data.margin.toFixed(1)}%
            </strong>
          </span>
          <span style={{ fontSize: 12, color: "#64748b" }}>
            ROI:{" "}
            <strong style={{ color: marketplace.color }}>
              {data.roi.toFixed(1)}%
            </strong>
          </span>
        </div>
      </div>

      {/* Platform indicators */}
      <div style={{ marginBottom: 12 }}>
        <ScoreBar
          label="Customer Reach"
          value={data.customerReach}
          color={marketplace.color}
        />
        <ScoreBar
          label="Trust Score"
          value={data.trustScore}
          color={marketplace.color}
        />
        <ScoreBar
          label={`Return Rate: ${data.returnRate}%`}
          value={100 - data.returnRate * 5}
          color={data.returnRate > 10 ? "#ef4444" : "#16a34a"}
        />
      </div>

      {/* Fee breakdown toggle */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        style={{
          width: "100%",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          padding: "7px",
          fontSize: 12,
          fontWeight: 600,
          color: "#64748b",
          cursor: "pointer",
          fontFamily: "'Poppins', sans-serif",
          marginBottom: showDetails ? 12 : 0,
        }}
      >
        {showDetails ? "▲ Hide Fees" : "▼ Show Fee Breakdown"}
      </button>

      {showDetails && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            ["Commission Fee", `₹${data.commissionFee.toFixed(2)}`, "#ef4444"],
            ["Closing Fee", `₹${data.closingFee.toFixed(2)}`, "#f59e0b"],
            ["GST Amount", `₹${data.gstAmount.toFixed(2)}`, "#06b6d4"],
            ["Total Fees", `₹${data.totalFees.toFixed(2)}`, "#8b5cf6"],
          ].map(([label, value, color]) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 0",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <span style={{ fontSize: 12, color: "#64748b" }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderBottom: "1px solid #f1f5f9",
        paddingBottom: 14,
        marginBottom: 14,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          textAlign: "left",
          gap: 8,
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 15, color: "#0f172a" }}>
          {q}
        </span>
        <span
          style={{
            fontSize: 18,
            color: "#94a3b8",
            transform: open ? "rotate(180deg)" : "",
            transition: "transform 0.2s",
            flexShrink: 0,
          }}
        >
          ▾
        </span>
      </button>
      {open && (
        <p
          style={{
            fontSize: 14,
            color: "#64748b",
            marginTop: 10,
            lineHeight: 1.7,
          }}
        >
          {a}
        </p>
      )}
    </div>
  );
}

function MarketplaceCommission() {
  const [inputs, setInputs] = useState({
    category: "",
    sellingPrice: "",
    productCost: "",
    gstPct: "18",
  });
  const [copied, setCopied] = useState(false);

  const set = useCallback((k, v) => {
    setInputs((prev) => {
      if (prev[k] === v) return prev;
      return { ...prev, [k]: v };
    });
  }, []);

  const hasPrice =
    parseFloat(inputs.sellingPrice) > 0 && inputs.category !== "";

  const results = hasPrice ? calcCommission(inputs) : null;
  const insights =
    hasPrice && results ? getMarketplaceInsights(results, inputs) : [];

  const bestOverall =
    results
      ? Object.entries(results).sort(
          (a, b) => b[1].platformScore - a[1].platformScore
        )[0][0]
      : null;

  const bestProfit =
    results
      ? Object.entries(results).sort(
          (a, b) => b[1].profit - a[1].profit
        )[0][0]
      : null;

  const chartData = results
    ? Object.entries(results).map(([name, data]) => ({
        name,
        Profit: parseFloat(data.profit.toFixed(0)),
        Fees: parseFloat(data.totalFees.toFixed(0)),
        Score: parseFloat(data.platformScore),
      }))
    : [];

  const copyResults = () => {
    if (!results) return;
    const txt = Object.entries(results)
      .map(
        ([name, data]) =>
          `${name}: Profit ₹${data.profit.toFixed(0)} | Score ${
            data.platformScore
          }/100 | Margin ${data.margin.toFixed(1)}% | Fees ₹${data.totalFees.toFixed(0)}`
      )
      .join("\n");
    navigator.clipboard
      .writeText(`Marketplace Commission Comparison\n──────────────────\n${txt}`)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  const resetForm = () =>
    setInputs({
      category: "",
      sellingPrice: "",
      productCost: "",
      gstPct: "18",
    });

  return (
    <div style={{ background: "#f1f5f9", minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>

      {/* ✅ UPDATED HERO — matches FBA Calculator style */}
      <section
        style={{
          background: "#030a10",
          padding: "80px 24px 90px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse at 30% 50%, rgba(53,208,178,0.12) 0%,transparent 60%),radial-gradient(ellipse at 70% 50%, rgba(37,99,235,0.08) 0%,transparent 60%)",
          }}
        />

        <div style={{ position: "relative", maxWidth: 800, margin: "0 auto" }}>

          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(53,208,178,0.1)",
              border: "1px solid rgba(53,208,178,0.2)",
              borderRadius: 100,
              padding: "6px 18px",
              marginBottom: 20,
            }}
          >
            <span style={{ fontSize: 16 }}>💸</span>
            <span style={{ color: "#35d0b2", fontSize: 14, fontWeight: 600 }}>
              Multi-Platform Comparison Tool
            </span>
          </div>

          {/* Subtitle */}
          <p
            style={{
              color: "#35d0b2",
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 12,
              letterSpacing: "0.3px",
            }}
          >
            Compare Fees Across All Major Indian Marketplaces
          </p>

          {/* Main Heading */}
          <h1
            style={{
              fontSize: "clamp(42px, 6vw, 58px)",
              fontWeight: 900,
              letterSpacing: "-2px",
              lineHeight: 1.15,
              color: "#f8fafc",
              marginBottom: 20,
            }}
          >
            Marketplace Commission Calculator
          </h1>

          {/* Description */}
          <p
            style={{
              color: "#94a3b8",
              fontSize: 18,
              maxWidth: 620,
              margin: "0 auto 16px",
              lineHeight: 1.75,
            }}
          >
            Compare commission fees, closing charges and net profit across
            Amazon, Flipkart, Meesho and Jiomart — all in one place. Find the
            most profitable marketplace for your product before you list.
          </p>
          <p
            style={{
              color: "#64748b",
              fontSize: 15,
              maxWidth: 560,
              margin: "0 auto 32px",
              lineHeight: 1.7,
            }}
          >
            Our unique Platform Score ranks each marketplace by profit margin,
            customer reach, trust score and return rate — not just fees — so you
            make smarter selling decisions.
          </p>

          {/* Stats Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 0,
              flexWrap: "wrap",
              borderTop: "1px solid rgba(53,208,178,0.15)",
              paddingTop: 28,
            }}
          >
            {[
              ["4 Marketplaces", "Compared Instantly"],
              ["Platform Score", "Not Just Fees"],
              ["AI Insights", "Included Free"],
              ["100% Free", "No Sign-up Needed"],
            ].map(([n, l], i) => (
              <div
                key={l}
                style={{
                  textAlign: "center",
                  padding: "0 28px",
                  borderRight:
                    i < 3 ? "1px solid rgba(53,208,178,0.15)" : "none",
                }}
              >
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: "#35d0b2",
                    marginBottom: 3,
                  }}
                >
                  {n}
                </div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Score explanation */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e2e8f0",
          padding: "14px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            gap: 24,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {[
            ["40%", "Profit Margin"],
            ["25%", "Customer Reach"],
            ["20%", "Trust Score"],
            ["10%", "Return Rate"],
            ["5%", "Payment Speed"],
          ].map(([pct, label]) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  fontWeight: 800,
                  color: "#2563eb",
                  fontSize: 14,
                }}
              >
                {pct}
              </span>
              <span style={{ color: "#64748b", fontSize: 13 }}>{label}</span>
            </div>
          ))}
          <div style={{ color: "#94a3b8", fontSize: 12, alignSelf: "center" }}>
            ← Platform Score weights
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Input Form */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            padding: "28px",
            marginTop: 24,
            marginBottom: 24,
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <div>
              <h2 style={{ fontWeight: 700, fontSize: 17 }}>
                Product Details
              </h2>
              <p style={{ color: "#94a3b8", fontSize: 13 }}>
                Enter details to compare all marketplaces instantly
              </p>
            </div>
            <Button onClick={resetForm} variant="secondary">
              ↺ Reset
            </Button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            <SelectField
              label="Product Category"
              value={inputs.category}
              onChange={(v) => set("category", v)}
              placeholder="Select Category"
              options={CATEGORY_LIST}
            />
            <InputField
              label="Selling Price"
              value={inputs.sellingPrice}
              onChange={(v) => set("sellingPrice", v)}
              prefix="₹"
              placeholder="999"
            />
            <InputField
              label="Product Cost"
              value={inputs.productCost}
              onChange={(v) => set("productCost", v)}
              prefix="₹"
              placeholder="400"
            />
            <SelectField
              label="GST Percentage"
              value={inputs.gstPct}
              onChange={(v) => set("gstPct", v)}
              placeholder="Select GST %"
              options={[
                { value: "0", label: "0%" },
                { value: "5", label: "5%" },
                { value: "12", label: "12%" },
                { value: "18", label: "18%" },
                { value: "28", label: "28%" },
              ]}
            />
          </div>

          {hasPrice && (
            <div style={{ marginTop: 16 }}>
              <Button onClick={copyResults} variant="dark" fullWidth>
                {copied ? "✅ Copied!" : "📋 Copy Comparison Summary"}
              </Button>
            </div>
          )}
        </div>

        {/* Results */}
        {hasPrice && results && (
          <>
            {/* Marketplace Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: 24,
                marginBottom: 32,
                paddingTop: 16,
              }}
            >
              {Object.entries(results)
                .sort((a, b) => b[1].platformScore - a[1].platformScore)
                .map(([name, data]) => (
                  <MarketplaceCard
                    key={name}
                    name={name}
                    data={data}
                    marketplace={MARKETPLACES[name]}
                    isBest={name === bestOverall}
                    isTopProfit={name === bestProfit}
                  />
                ))}
            </div>

            {/* Comparison Table */}
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                marginBottom: 32,
              }}
            >
              <div
                style={{
                  padding: "20px 24px",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <h2 style={{ fontWeight: 700, fontSize: 17 }}>
                  Full Comparison Table
                </h2>
                <p style={{ color: "#94a3b8", fontSize: 13 }}>
                  Side by side breakdown including platform scores
                </p>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 13,
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      <th
                        style={{
                          padding: "12px 16px",
                          textAlign: "left",
                          fontWeight: 600,
                          color: "#64748b",
                          borderBottom: "1px solid #e2e8f0",
                        }}
                      >
                        Metric
                      </th>
                      {Object.keys(MARKETPLACES).map((name) => (
                        <th
                          key={name}
                          style={{
                            padding: "12px 16px",
                            textAlign: "right",
                            fontWeight: 700,
                            color: MARKETPLACES[name].color,
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          {MARKETPLACES[name].icon} {name}
                          {name === bestOverall && (
                            <span
                              style={{
                                fontSize: 10,
                                background: MARKETPLACES[name].color,
                                color: "#fff",
                                padding: "1px 6px",
                                borderRadius: 100,
                                marginLeft: 6,
                              }}
                            >
                              BEST
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Platform Score", (d) => `${d.platformScore}/100`],
                      ["Customer Reach", (d) => `${d.customerReach}/100`],
                      ["Trust Score", (d) => `${d.trustScore}/100`],
                      ["Return Rate", (d) => `${d.returnRate}%`],
                      ["Commission %", (d) => `${d.commissionPct.toFixed(0)}%`],
                      ["Commission Fee", (d) => `₹${d.commissionFee.toFixed(2)}`],
                      ["Closing Fee", (d) => `₹${d.closingFee.toFixed(2)}`],
                      ["GST Amount", (d) => `₹${d.gstAmount.toFixed(2)}`],
                      ["Total Fees", (d) => `₹${d.totalFees.toFixed(2)}`],
                      ["Net Profit", (d) => `₹${d.profit.toFixed(2)}`],
                      ["Margin %", (d) => `${d.margin.toFixed(1)}%`],
                      ["ROI %", (d) => `${d.roi.toFixed(1)}%`],
                    ].map(([label, fn], i) => (
                      <tr
                        key={label}
                        style={{
                          background: i % 2 === 0 ? "#fff" : "#fafafa",
                        }}
                      >
                        <td
                          style={{
                            padding: "11px 16px",
                            fontWeight: 600,
                            color: "#374151",
                            borderBottom: "1px solid #f1f5f9",
                          }}
                        >
                          {label}
                        </td>
                        {Object.entries(results).map(([name, data]) => (
                          <td
                            key={name}
                            style={{
                              padding: "11px 16px",
                              textAlign: "right",
                              fontWeight:
                                name === bestOverall &&
                                label === "Platform Score"
                                  ? 800
                                  : 500,
                              color:
                                label === "Net Profit"
                                  ? data.profit >= 0
                                    ? "#16a34a"
                                    : "#dc2626"
                                  : label === "Platform Score"
                                  ? MARKETPLACES[name].color
                                  : "#0f172a",
                              borderBottom: "1px solid #f1f5f9",
                            }}
                          >
                            {fn(data)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bar Chart */}
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                border: "1px solid #e2e8f0",
                padding: "24px",
                marginBottom: 32,
              }}
            >
              <h2
                style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}
              >
                Profit vs Fees vs Platform Score
              </h2>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: 13,
                  marginBottom: 20,
                }}
              >
                Visual breakdown across all platforms
              </p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fontWeight: 600 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(v, name) =>
                      name === "Score" ? `${v}/100` : `₹${v}`
                    }
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Profit" fill="#22c55e" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Fees" fill="#ef4444" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Score" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* AI Insights */}
            {insights.length > 0 && (
              <div style={{ marginBottom: 48 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "linear-gradient(135deg,#35d0b2,#2563eb)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                    }}
                  >
                    🤖
                  </div>
                  <div>
                    <h2 style={{ fontWeight: 800, fontSize: 18 }}>
                      AI Insights
                    </h2>
                    <p style={{ color: "#64748b", fontSize: 13 }}>
                      Smart recommendations based on profit AND market reach
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill,minmax(260px,1fr))",
                    gap: 14,
                  }}
                >
                  {insights.map((ins, i) => {
                    const cfg = {
                      success: {
                        bg: "#f0fdf4",
                        border: "#bbf7d0",
                        ic: "#16a34a",
                      },
                      warn: {
                        bg: "#fffbeb",
                        border: "#fde68a",
                        ic: "#d97706",
                      },
                      danger: {
                        bg: "#fef2f2",
                        border: "#fecaca",
                        ic: "#dc2626",
                      },
                      info: {
                        bg: "#eff6ff",
                        border: "#bfdbfe",
                        ic: "#2563eb",
                      },
                    };
                    const c = cfg[ins.type] || cfg.info;
                    return (
                      <div
                        key={i}
                        style={{
                          background: c.bg,
                          border: `1px solid ${c.border}`,
                          borderRadius: 12,
                          padding: "16px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 8,
                          }}
                        >
                          <span style={{ fontSize: 18 }}>{ins.icon}</span>
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: 14,
                              color: c.ic,
                            }}
                          >
                            {ins.title}
                          </span>
                        </div>
                        <p
                          style={{
                            fontSize: 13,
                            color: "#374151",
                            lineHeight: 1.5,
                          }}
                        >
                          {ins.msg}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!hasPrice && (
          <div
            style={{
              textAlign: "center",
              padding: "64px 24px",
              color: "#94a3b8",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>💸</div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#64748b",
                marginBottom: 8,
              }}
            >
              Enter product details above
            </h3>
            <p style={{ fontSize: 14 }}>
              Select a category and enter selling price to compare all
              marketplaces instantly
            </p>
          </div>
        )}

        {/* FAQ */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            padding: "32px",
            marginBottom: 48,
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "rgba(53,208,178,0.1)",
              border: "1px solid rgba(53,208,178,0.2)",
              borderRadius: 100,
              padding: "4px 14px",
              color: "#35d0b2",
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            FAQ
          </div>
          <h2
            style={{
              fontWeight: 800,
              fontSize: 22,
              marginBottom: 24,
              letterSpacing: "-0.5px",
            }}
          >
            Frequently Asked Questions
          </h2>
          {[
            [
              "What is the Platform Score?",
              "Platform Score is a weighted score out of 100 that considers profit margin (40%), customer reach (25%), trust score (20%), return rate (10%) and payment speed (5%). It helps you pick the best platform overall, not just the one with lowest fees.",
            ],
            [
              "Why is Amazon ranked higher even with higher fees?",
              "Amazon has 95/100 customer reach and 95/100 trust score. Even with higher fees, the volume of sales on Amazon often makes up for the lower per-unit margin.",
            ],
            [
              "Which marketplace has the lowest commission?",
              "Meesho has the lowest commission — often 0% on most categories. But it also has lower customer reach and higher return rates.",
            ],
            [
              "Should I sell on multiple marketplaces?",
              "Yes — most successful sellers list on 2-3 platforms. Use this calculator to decide which platform to prioritize based on your margins and goals.",
            ],
          ].map(([q, a]) => (
            <FAQItem key={q} q={q} a={a} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MarketplaceCommission;