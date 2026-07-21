// Commission rates updated for 2026
// Amazon: Zero referral fees for products under Rs.1000 (effective March 16, 2026)
// Source: Amazon Seller Central India, March 2026 fee revision

// Get Amazon commission based on selling price slab (2026 rules)
function getAmazonCommission(sellingPrice, category, envCommission) {
  const sp = parseFloat(sellingPrice) || 0;
  // Zero referral fee for products under Rs.1000 across most categories
  const zeroFeeCategories = [
    "Fashion", "Beauty & Personal Care", "Home & Kitchen",
    "Sports & Outdoors", "Toys & Baby", "Health & Wellness", "Automotive"
  ];
  if (sp < 1000 && zeroFeeCategories.includes(category)) return 0;
  return envCommission;
}

// Get Amazon closing fee based on selling price slab (2026 rules)
function getAmazonClosingFee(sellingPrice) {
  const sp = parseFloat(sellingPrice) || 0;
  if (sp < 300) return 20;
  if (sp < 500) return 26;
  if (sp < 1000) return 30;
  return 40;
}

// Get Flipkart closing fee based on selling price slab
function getFlipkartClosingFee(sellingPrice) {
  const sp = parseFloat(sellingPrice) || 0;
  if (sp < 300) return 20;
  if (sp < 500) return 28;
  if (sp < 1000) return 35;
  return 45;
}

// Environment variables with fallbacks
const ENV = {
  AMAZON_SHIPPING: parseFloat(process.env.REACT_APP_AMAZON_SHIPPING_FEE) || 50,
  FLIPKART_SHIPPING: parseFloat(process.env.REACT_APP_FLIPKART_SHIPPING_FEE) || 45,
  MEESHO_SHIPPING: parseFloat(process.env.REACT_APP_MEESHO_SHIPPING_FEE) || 0,
  JIOMART_SHIPPING: parseFloat(process.env.REACT_APP_JIOMART_SHIPPING_FEE) || 40,
};

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
    shippingFee: ENV.AMAZON_SHIPPING,
    // 2026 rates: 0% for products under Rs.1000 in most categories
    // Above Rs.1000: reduced rates effective March 2026
    categories: {
      Fashion: {
        commission: parseFloat(process.env.REACT_APP_AMAZON_COMMISSION_FASHION) || 0.09,
        baseCommission: 0.09,
      },
      Electronics: {
        commission: parseFloat(process.env.REACT_APP_AMAZON_COMMISSION_ELECTRONICS) || 0.07,
        baseCommission: 0.07,
      },
      "Beauty & Personal Care": {
        commission: parseFloat(process.env.REACT_APP_AMAZON_COMMISSION_DEFAULT) || 0.09,
        baseCommission: 0.09,
      },
      "Home & Kitchen": {
        commission: parseFloat(process.env.REACT_APP_AMAZON_COMMISSION_DEFAULT) || 0.09,
        baseCommission: 0.09,
      },
      "Sports & Outdoors": {
        commission: parseFloat(process.env.REACT_APP_AMAZON_COMMISSION_DEFAULT) || 0.09,
        baseCommission: 0.09,
      },
      "Books & Stationery": {
        commission: parseFloat(process.env.REACT_APP_AMAZON_COMMISSION_BOOKS) || 0.06,
        baseCommission: 0.06,
      },
      "Toys & Baby": {
        commission: parseFloat(process.env.REACT_APP_AMAZON_COMMISSION_DEFAULT) || 0.09,
        baseCommission: 0.09,
      },
      "Health & Wellness": {
        commission: parseFloat(process.env.REACT_APP_AMAZON_COMMISSION_DEFAULT) || 0.09,
        baseCommission: 0.09,
      },
      Automotive: {
        commission: parseFloat(process.env.REACT_APP_AMAZON_COMMISSION_DEFAULT) || 0.09,
        baseCommission: 0.09,
      },
    },
  },
  Flipkart: {
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
    icon: "🏪",
    description: "Strong in Fashion and Electronics with large customer base",
    customerReach: 80,
    trustScore: 85,
    returnRate: 10,
    paymentSpeed: 7,
    sellerSupport: 75,
    shippingFee: ENV.FLIPKART_SHIPPING,
    categories: {
      Fashion: {
        commission: parseFloat(process.env.REACT_APP_FLIPKART_COMMISSION_FASHION) || 0.15,
        baseCommission: 0.15,
      },
      Electronics: {
        commission: parseFloat(process.env.REACT_APP_FLIPKART_COMMISSION_ELECTRONICS) || 0.08,
        baseCommission: 0.08,
      },
      "Beauty & Personal Care": {
        commission: parseFloat(process.env.REACT_APP_FLIPKART_COMMISSION_DEFAULT) || 0.10,
        baseCommission: 0.10,
      },
      "Home & Kitchen": {
        commission: parseFloat(process.env.REACT_APP_FLIPKART_COMMISSION_DEFAULT) || 0.12,
        baseCommission: 0.12,
      },
      "Sports & Outdoors": {
        commission: parseFloat(process.env.REACT_APP_FLIPKART_COMMISSION_DEFAULT) || 0.11,
        baseCommission: 0.11,
      },
      "Books & Stationery": {
        commission: parseFloat(process.env.REACT_APP_FLIPKART_COMMISSION_DEFAULT) || 0.06,
        baseCommission: 0.06,
      },
      "Toys & Baby": {
        commission: parseFloat(process.env.REACT_APP_FLIPKART_COMMISSION_DEFAULT) || 0.12,
        baseCommission: 0.12,
      },
      "Health & Wellness": {
        commission: parseFloat(process.env.REACT_APP_FLIPKART_COMMISSION_DEFAULT) || 0.09,
        baseCommission: 0.09,
      },
      Automotive: {
        commission: parseFloat(process.env.REACT_APP_FLIPKART_COMMISSION_DEFAULT) || 0.09,
        baseCommission: 0.09,
      },
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
    shippingFee: ENV.MEESHO_SHIPPING,
    categories: {
      Fashion: {
        commission: parseFloat(process.env.REACT_APP_MEESHO_COMMISSION_FASHION) || 0.0,
        baseCommission: 0.0,
      },
      Electronics: {
        commission: parseFloat(process.env.REACT_APP_MEESHO_COMMISSION_ELECTRONICS) || 0.02,
        baseCommission: 0.02,
      },
      "Beauty & Personal Care": {
        commission: parseFloat(process.env.REACT_APP_MEESHO_COMMISSION_DEFAULT) || 0.0,
        baseCommission: 0.0,
      },
      "Home & Kitchen": {
        commission: parseFloat(process.env.REACT_APP_MEESHO_COMMISSION_DEFAULT) || 0.0,
        baseCommission: 0.0,
      },
      "Sports & Outdoors": {
        commission: parseFloat(process.env.REACT_APP_MEESHO_COMMISSION_DEFAULT) || 0.01,
        baseCommission: 0.01,
      },
      "Books & Stationery": {
        commission: parseFloat(process.env.REACT_APP_MEESHO_COMMISSION_DEFAULT) || 0.0,
        baseCommission: 0.0,
      },
      "Toys & Baby": {
        commission: parseFloat(process.env.REACT_APP_MEESHO_COMMISSION_DEFAULT) || 0.0,
        baseCommission: 0.0,
      },
      "Health & Wellness": {
        commission: parseFloat(process.env.REACT_APP_MEESHO_COMMISSION_DEFAULT) || 0.0,
        baseCommission: 0.0,
      },
      Automotive: {
        commission: parseFloat(process.env.REACT_APP_MEESHO_COMMISSION_DEFAULT) || 0.01,
        baseCommission: 0.01,
      },
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
    shippingFee: ENV.JIOMART_SHIPPING,
    categories: {
      Fashion: {
        commission: parseFloat(process.env.REACT_APP_JIOMART_COMMISSION_FASHION) || 0.10,
        baseCommission: 0.10,
      },
      Electronics: {
        commission: parseFloat(process.env.REACT_APP_JIOMART_COMMISSION_ELECTRONICS) || 0.05,
        baseCommission: 0.05,
      },
      "Beauty & Personal Care": {
        commission: parseFloat(process.env.REACT_APP_JIOMART_COMMISSION_DEFAULT) || 0.07,
        baseCommission: 0.07,
      },
      "Home & Kitchen": {
        commission: parseFloat(process.env.REACT_APP_JIOMART_COMMISSION_DEFAULT) || 0.08,
        baseCommission: 0.08,
      },
      "Sports & Outdoors": {
        commission: parseFloat(process.env.REACT_APP_JIOMART_COMMISSION_DEFAULT) || 0.08,
        baseCommission: 0.08,
      },
      "Books & Stationery": {
        commission: parseFloat(process.env.REACT_APP_JIOMART_COMMISSION_DEFAULT) || 0.04,
        baseCommission: 0.04,
      },
      "Toys & Baby": {
        commission: parseFloat(process.env.REACT_APP_JIOMART_COMMISSION_DEFAULT) || 0.08,
        baseCommission: 0.08,
      },
      "Health & Wellness": {
        commission: parseFloat(process.env.REACT_APP_JIOMART_COMMISSION_DEFAULT) || 0.06,
        baseCommission: 0.06,
      },
      Automotive: {
        commission: parseFloat(process.env.REACT_APP_JIOMART_COMMISSION_DEFAULT) || 0.06,
        baseCommission: 0.06,
      },
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

export function calcPlatformScore(profitMargin, marketplace) {
  const profitScore = Math.min(Math.max(profitMargin, 0), 40);
  const reachScore = (marketplace.customerReach / 100) * 25;
  const trustScore = (marketplace.trustScore / 100) * 20;
  const returnScore = ((100 - marketplace.returnRate * 5) / 100) * 10;
  const paymentScore = ((14 - marketplace.paymentSpeed) / 14) * 5;
  return Math.min(100, profitScore + reachScore + trustScore + returnScore + paymentScore).toFixed(0);
}

export function calcCommission({ sellingPrice, productCost, gstPct, category }) {
  const sp = parseFloat(sellingPrice) || 0;
  const pc = parseFloat(productCost) || 0;
  const gst = parseFloat(gstPct) || 0;
  const results = {};

  Object.entries(MARKETPLACES).forEach(([name, data]) => {
    const catData = data.categories[category] || {
      commission: 0.09,
      baseCommission: 0.09,
    };

    // Apply Amazon 2026 price-based commission rules
    let commissionRate = catData.commission;
    if (name === "Amazon") {
      commissionRate = getAmazonCommission(sp, category, catData.baseCommission);
    }

    // Apply price-based closing fees
    let closingFee = 0;
    if (name === "Amazon") {
      closingFee = getAmazonClosingFee(sp);
    } else if (name === "Flipkart") {
      closingFee = getFlipkartClosingFee(sp);
    } else if (name === "Meesho") {
      closingFee = 0;
    } else if (name === "Jiomart") {
      closingFee = sp < 500 ? 15 : sp < 1000 ? 20 : 25;
    }

    const commissionFee = sp * commissionRate;
    const gstAmount = sp * (gst / 100);
    const shippingFee = data.shippingFee || 0;
    const totalFees = commissionFee + closingFee + gstAmount + shippingFee;
    const profit = sp - totalFees - pc;
    const margin = sp > 0 ? (profit / sp) * 100 : 0;
    const roi = pc > 0 ? (profit / pc) * 100 : 0;
    const platformScore = calcPlatformScore(margin, data);

    results[name] = {
      commissionPct: commissionRate * 100,
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

  const sortedByScore = Object.entries(results).sort((a, b) => b[1].platformScore - a[1].platformScore);
  const sortedByProfit = Object.entries(results).sort((a, b) => b[1].profit - a[1].profit);

  const bestOverall = sortedByScore[0];
  const bestProfit = sortedByProfit[0];
  const meesho = results["Meesho"];
  const amazon = results["Amazon"];

  insights.push({
    type: "success", icon: "🏆",
    title: `Best Overall: ${bestOverall[0]}`,
    msg: `${bestOverall[0]} scores ${bestOverall[1].platformScore}/100 considering profit, customer reach, trust and returns - best all-round platform for this product`,
  });

  if (bestProfit[0] !== bestOverall[0]) {
    insights.push({
      type: "info", icon: "💡",
      title: `${bestProfit[0]} Has Best Profit`,
      msg: `${bestProfit[0]} gives Rs.${bestProfit[1].profit.toFixed(0)} profit per unit but has lower customer traffic. Good for testing, not for scaling`,
    });
  }

  // Amazon 2026 zero fee insight
  if (amazon && sp < 1000 && amazon.commissionPct === 0) {
    insights.push({
      type: "success", icon: "🎉",
      title: "Amazon Zero Referral Fee!",
      msg: `Great news! Since your product is priced below Rs.1000, Amazon charges 0% referral fee as per their March 2026 update. You only pay closing fee and shipping.`,
    });
  }

  if (amazon && sp >= 1000) {
    insights.push({
      type: "info", icon: "📦",
      title: "Amazon Customer Reach",
      msg: "Amazon has 95/100 customer reach score - highest in India. Even with fees, volume can make up for lower margin per unit",
    });
  }

  if (meesho && meesho.customerReach < 60) {
    insights.push({
      type: "warn", icon: "⚠️",
      title: "Meesho Reach is Limited",
      msg: "Meesho has lower customer trust (60/100) and higher return rates (15%). Best for testing new products, not for primary sales channel",
    });
  }

  const highReturnPlatforms = Object.entries(results).filter(([name]) => MARKETPLACES[name].returnRate > 10);
  if (highReturnPlatforms.length > 0) {
    insights.push({
      type: "warn", icon: "🔄",
      title: "High Return Rate Warning",
      msg: `${highReturnPlatforms.map(([n]) => n).join(", ")} ${highReturnPlatforms.length > 1 ? "have" : "has"} return rates above 10%. Factor this into your actual profit calculation`,
    });
  }

  if (bestOverall[1].margin < 15) {
    insights.push({
      type: "danger", icon: "🔴",
      title: "Low Margin Everywhere",
      msg: `Even on the best platform, margin is only ${bestOverall[1].margin.toFixed(1)}%. Consider increasing price to Rs.${Math.ceil(sp * 1.2)} for healthy margins`,
    });
  }

  if (category === "Electronics") {
    insights.push({
      type: "info", icon: "📱",
      title: "Electronics Tip",
      msg: "Electronics have lower commission but high return rates (8-12%). Amazon is preferred by buyers for electronics due to warranty support",
    });
  }

  if (category === "Fashion") {
    insights.push({
      type: "info", icon: "👗",
      title: "Fashion Tip",
      msg: sp < 1000
        ? "Your fashion product is under Rs.1000 - Amazon charges 0% referral fee! This is a huge advantage for budget fashion sellers."
        : "Fashion above Rs.1000 has commission fees. Meesho works well for budget fashion, Amazon/Flipkart for premium brands",
    });
  }

  return insights;
}