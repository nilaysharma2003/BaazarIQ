import CATEGORY_DATA from "./categoryData";

export function calcFBA({
  sellingPrice,
  productCost,
  weightGm,
  shippingCost,
  gstPct,
  category,
  shippingMethod,
  stepLevel,
}) {
  const sp = parseFloat(sellingPrice) || 0;
  const pc = parseFloat(productCost) || 0;
  const wt = (parseFloat(weightGm) || 0) / 1000; // convert grams to kg
  const sc = parseFloat(shippingCost) || 0;
  const gst = parseFloat(gstPct) || 0;

  const referralPct = category
    ? CATEGORY_DATA[category]?.referral || 0.12
    : 0.12;
  const referralFee = sp * referralPct;

  // Closing fee based on price tier
  let closingFee = 0;
  if (sp <= 250) closingFee = 14;
  else if (sp <= 500) closingFee = 20;
  else if (sp <= 1000) closingFee = 30;
  else closingFee = 40;

  // Step level multiplier
  let stepMultiplier = 1;
  if (stepLevel === "Premium") stepMultiplier = 1.1;
  else if (stepLevel === "Advanced") stepMultiplier = 1.2;
  else if (stepLevel === "Standard") stepMultiplier = 0.95;

  // Shipping fee based on weight, method and step level
  let amazonShipping = 0;
  if (shippingMethod === "Amazon FBA") {
    if (wt <= 0.5) amazonShipping = 42;
    else if (wt <= 1) amazonShipping = 58;
    else if (wt <= 2) amazonShipping = 78;
    else amazonShipping = 78 + Math.ceil((wt - 2) / 0.5) * 18;
  } else if (shippingMethod === "Amazon Easy Ship") {
    if (wt <= 0.5) amazonShipping = 35;
    else if (wt <= 1) amazonShipping = 49;
    else if (wt <= 2) amazonShipping = 65;
    else amazonShipping = 65 + Math.ceil((wt - 2) / 0.5) * 15;
  } else if (shippingMethod === "Seller Flex") {
    if (wt <= 0.5) amazonShipping = 28;
    else if (wt <= 1) amazonShipping = 38;
    else if (wt <= 2) amazonShipping = 52;
    else amazonShipping = 52 + Math.ceil((wt - 2) / 0.5) * 12;
  } else {
    // Self Ship
    if (wt <= 0.5) amazonShipping = 20;
    else if (wt <= 1) amazonShipping = 30;
    else amazonShipping = 30 + Math.ceil((wt - 1) / 0.5) * 10;
  }

  amazonShipping = amazonShipping * stepMultiplier;

  const gstAmount = sp * (gst / 100);
  const totalFees = referralFee + closingFee + amazonShipping + gstAmount;
  const totalCost = pc + sc + totalFees;
  const profit = sp - totalCost;
  const roi = pc > 0 ? (profit / pc) * 100 : 0;
  const margin = sp > 0 ? (profit / sp) * 100 : 0;

  return {
    referralFee,
    closingFee,
    amazonShipping,
    gstAmount,
    totalFees,
    totalCost,
    profit,
    roi,
    margin,
    referralPct,
  };
}

export function getProfitStatus(margin) {
  if (margin >= 30)
    return {
      label: "Excellent Profit",
      color: "#16a34a",
      bg: "#f0fdf4",
      border: "#bbf7d0",
      icon: "🚀",
    };
  if (margin >= 15)
    return {
      label: "Average Margin",
      color: "#d97706",
      bg: "#fffbeb",
      border: "#fde68a",
      icon: "📊",
    };
  return {
    label: "Low Profit",
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
    icon: "⚠️",
  };
}

export function getInsights(results, inputs) {
  const insights = [];
  const { margin, roi, referralPct, profit, referralFee, amazonShipping } =
    results;
  const sp = parseFloat(inputs.sellingPrice) || 0;

  if (margin < 15 && sp > 0) {
    const suggestedPrice = Math.ceil(sp * 1.1);
    insights.push({
      type: "warn",
      icon: "💡",
      title: "Price Optimization",
      msg: `Increase selling price to ₹${suggestedPrice} to push margin above 15%`,
    });
  }
  if (referralFee > sp * 0.18) {
    insights.push({
      type: "warn",
      icon: "📌",
      title: "High Referral Fee",
      msg: `Referral fee is ${(referralPct * 100).toFixed(0)}% - consider a lower-fee category or bundle`,
    });
  }
  if (margin >= 30) {
    insights.push({
      type: "success",
      icon: "✅",
      title: "Healthy Margin",
      msg: `${margin.toFixed(1)}% margin is excellent. You can offer discounts up to ${(
        margin - 15
      ).toFixed(0)}% and stay profitable`,
    });
  }
  if (roi > 50) {
    insights.push({
      type: "success",
      icon: "📈",
      title: "Strong ROI",
      msg: `ROI of ${roi.toFixed(1)}% means every ₹100 invested returns ₹${roi.toFixed(
        0
      )} in profit`,
    });
  }
  if (amazonShipping > sp * 0.15) {
    insights.push({
      type: "warn",
      icon: "🚚",
      title: "Shipping Cost Heavy",
      msg: `Shipping is ${((amazonShipping / sp) * 100).toFixed(
        0
      )}% of price. Consider Self Ship for lighter products or bundling`,
    });
  }
  if (profit < 0) {
    insights.push({
      type: "danger",
      icon: "🔴",
      title: "Selling at a Loss",
      msg: `You're losing ₹${Math.abs(profit).toFixed(
        0
      )} per unit. Increase price or reduce product/shipping cost`,
    });
  }
  if (insights.length === 0 && sp > 0) {
    insights.push({
      type: "info",
      icon: "ℹ️",
      title: "Analysis Complete",
      msg: "Your product setup looks balanced. Adjust inputs to simulate different scenarios.",
    });
  }
  return insights;
}