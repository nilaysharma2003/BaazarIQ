export const MARKETPLACES = {
  Amazon: {
    color: "#f97316",
    bg: "#fff7ed",
    border: "#fed7aa",
    icon: "🛒",
    description: "India's largest marketplace with highest customer trust",
    customerReach: 95,
    trustScore: 95,
    returnRate: 8,
    paymentSpeed: 7,
    sellerSupport: 80,
    categories: {
      Fashion: { commission: 0.15, closing: 30 },
      Electronics: { commission: 0.08, closing: 40 },
      "Beauty & Personal Care": { commission: 0.10, closing: 25 },
      "Home & Kitchen": { commission: 0.12, closing: 30 },
      "Sports & Outdoors": { commission: 0.11, closing: 25 },
      "Books & Stationery": { commission: 0.06, closing: 14 },
      "Toys & Baby": { commission: 0.13, closing: 25 },
      "Health & Wellness": { commission: 0.09, closing: 25 },
      Automotive: { commission: 0.09, closing: 30 },
    },
  },
  Flipkart: {
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
    icon: "🏪",
    description: "Strong in Fashion & Electronics with large customer base",
    customerReach: 80,
    trustScore: 85,
    returnRate: 10,
    paymentSpeed: 7,
    sellerSupport: 75,
    categories: {
      Fashion: { commission: 0.18, closing: 35 },
      Electronics: { commission: 0.09, closing: 45 },
      "Beauty & Personal Care": { commission: 0.12, closing: 28 },
      "Home & Kitchen": { commission: 0.14, closing: 32 },
      "Sports & Outdoors": { commission: 0.13, closing: 28 },
      "Books & Stationery": { commission: 0.07, closing: 16 },
      "Toys & Baby": { commission: 0.15, closing: 28 },
      "Health & Wellness": { commission: 0.10, closing: 28 },
      Automotive: { commission: 0.10, closing: 32 },
    },
  },
  Meesho: {
    color: "#9333ea",
    bg: "#faf5ff",
    border: "#e9d5ff",
    icon: "🛍️",
    description: "Zero commission on most categories, best for small sellers",
    customerReach: 55,
    trustScore: 60,
    returnRate: 15,
    paymentSpeed: 14,
    sellerSupport: 55,
    categories: {
      Fashion: { commission: 0.0, closing: 0 },
      Electronics: { commission: 0.02, closing: 10 },
      "Beauty & Personal Care": { commission: 0.0, closing: 0 },
      "Home & Kitchen": { commission: 0.0, closing: 0 },
      "Sports & Outdoors": { commission: 0.01, closing: 0 },
      "Books & Stationery": { commission: 0.0, closing: 0 },
      "Toys & Baby": { commission: 0.0, closing: 0 },
      "Health & Wellness": { commission: 0.0, closing: 0 },
      Automotive: { commission: 0.01, closing: 0 },
    },
  },
  Jiomart: {
    color: "#0891b2",
    bg: "#ecfeff",
    border: "#a5f3fc",
    icon: "🏬",
    description: "Growing platform with competitive rates and Reliance backing",
    customerReach: 60,
    trustScore: 70,
    returnRate: 7,
    paymentSpeed: 10,
    sellerSupport: 65,
    categories: {
      Fashion: { commission: 0.12, closing: 20 },
      Electronics: { commission: 0.06, closing: 30 },
      "Beauty & Personal Care": { commission: 0.08, closing: 18 },
      "Home & Kitchen": { commission: 0.10, closing: 22 },
      "Sports & Outdoors": { commission: 0.09, closing: 20 },
      "Books & Stationery": { commission: 0.04, closing: 10 },
      "Toys & Baby": { commission: 0.10, closing: 20 },
      "Health & Wellness": { commission: 0.07, closing: 18 },
      Automotive: { commission: 0.07, closing: 22 },
    },
  },
};

export const CATEGORY_LIST = [
  "Fashion",
  "Electronics",
  "Beauty & Personal Care",
  "Home & Kitchen",
  "Sports & Outdoors",
  "Books & Stationery",
  "Toys & Baby",
  "Health & Wellness",
  "Automotive",
];

// Overall platform score out of 100
// Weights: Profit 40%, Customer Reach 25%, Trust 20%, Return Rate 10%, Payment Speed 5%
export function calcPlatformScore(profitMargin, marketplace) {
  const profitScore = Math.min(Math.max(profitMargin, 0), 40);
  const reachScore = (marketplace.customerReach / 100) * 25;
  const trustScore = (marketplace.trustScore / 100) * 20;
  const returnScore = ((100 - marketplace.returnRate * 5) / 100) * 10;
  const paymentScore = ((14 - marketplace.paymentSpeed) / 14) * 5;

  return Math.min(
    100,
    profitScore + reachScore + trustScore + returnScore + paymentScore
  ).toFixed(0);
}

export function calcCommission({
  sellingPrice,
  productCost,
  gstPct,
  category,
}) {
  const sp = parseFloat(sellingPrice) || 0;
  const pc = parseFloat(productCost) || 0;
  const gst = parseFloat(gstPct) || 0;

  const results = {};

  Object.entries(MARKETPLACES).forEach(([name, data]) => {
    const catData = data.categories[category] || {
      commission: 0.12,
      closing: 25,
    };

    const commissionFee = sp * catData.commission;
    const closingFee = catData.closing;
    const gstAmount = sp * (gst / 100);
    const shippingFeeMap = {
      Amazon: 50,
      Flipkart: 45,
      Meesho: 0,
      Jiomart: 40,
    };
    const shippingFee = shippingFeeMap[name] || 0;
    const totalFees = commissionFee + closingFee + gstAmount + shippingFee;
    const profit = sp - totalFees - pc;
    const margin = sp > 0 ? (profit / sp) * 100 : 0;
    const roi = pc > 0 ? (profit / pc) * 100 : 0;
    const platformScore = calcPlatformScore(margin, data);

    results[name] = {
      commissionPct: catData.commission * 100,
      commissionFee,
      closingFee,
      shippingFee,
      gstAmount,
      totalFees,
      profit,
      margin,
      roi,
      platformScore,
      customerReach: data.customerReach,
      trustScore: data.trustScore,
      returnRate: data.returnRate,
      paymentSpeed: data.paymentSpeed,
    };
  });

  return results;
}

export function getMarketplaceInsights(results, inputs) {
  const insights = [];
  const sp = parseFloat(inputs.sellingPrice) || 0;
  const category = inputs.category;

  if (!sp || !category) return insights;

  // Sort by platform score (not just profit)
  const sortedByScore = Object.entries(results).sort(
    (a, b) => b[1].platformScore - a[1].platformScore
  );
  const sortedByProfit = Object.entries(results).sort(
    (a, b) => b[1].profit - a[1].profit
  );

  const bestOverall = sortedByScore[0];
  const bestProfit = sortedByProfit[0];
  const meesho = results["Meesho"];
  const amazon = results["Amazon"];

  // Best overall platform
  insights.push({
    type: "success",
    icon: "🏆",
    title: `Best Overall: ${bestOverall[0]}`,
    msg: `${bestOverall[0]} scores ${bestOverall[1].platformScore}/100 considering profit, customer reach, trust and returns - best all-round platform for this product`,
  });

  // If best profit != best overall
  if (bestProfit[0] !== bestOverall[0]) {
    insights.push({
      type: "info",
      icon: "💡",
      title: `${bestProfit[0]} Has Best Profit`,
      msg: `${bestProfit[0]} gives ₹${bestProfit[1].profit.toFixed(0)} profit per unit but has lower customer traffic. Good for testing, not for scaling`,
    });
  }

  // Amazon reach insight
  if (amazon) {
    insights.push({
      type: "info",
      icon: "📦",
      title: "Amazon Customer Reach",
      msg: `Amazon has 95/100 customer reach score - highest in India. Even with higher fees, volume can make up for lower margin per unit`,
    });
  }

  // Meesho warning
  if (meesho && meesho.customerReach < 60) {
    insights.push({
      type: "warn",
      icon: "⚠️",
      title: "Meesho Reach is Limited",
      msg: `Meesho has lower customer trust (60/100) and higher return rates (15%). Best for testing new products, not for primary sales channel`,
    });
  }

  // Return rate warning
  const highReturnPlatforms = Object.entries(results).filter(
    ([name]) => MARKETPLACES[name].returnRate > 10
  );
  if (highReturnPlatforms.length > 0) {
    insights.push({
      type: "warn",
      icon: "🔄",
      title: "High Return Rate Warning",
      msg: `${highReturnPlatforms.map(([n]) => n).join(", ")} ${
        highReturnPlatforms.length > 1 ? "have" : "has"
      } return rates above 10%. Factor this into your actual profit calculation`,
    });
  }

  // Profit warning
  if (bestOverall[1].margin < 15) {
    insights.push({
      type: "danger",
      icon: "🔴",
      title: "Low Margin Everywhere",
      msg: `Even on the best platform, margin is only ${bestOverall[1].margin.toFixed(
        1
      )}%. Consider increasing price to ₹${Math.ceil(
        sp * 1.2
      )} for healthy margins`,
    });
  }

  // Category specific
  if (category === "Electronics") {
    insights.push({
      type: "info",
      icon: "📱",
      title: "Electronics Tip",
      msg: "Electronics have lower commission but high return rates (8-12%). Amazon is preferred by buyers for electronics due to warranty support",
    });
  }

  if (category === "Fashion") {
    insights.push({
      type: "info",
      icon: "👗",
      title: "Fashion Tip",
      msg: "Fashion has highest commission but also highest demand. Meesho works well for budget fashion, Amazon/Flipkart for premium brands",
    });
  }

  return insights;
}