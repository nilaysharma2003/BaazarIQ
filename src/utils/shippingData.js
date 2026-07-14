export const COURIERS = {
  Delhivery: {
    icon: "🚀",
    color: "#ef4444",
    bg: "#fef2f2",
    border: "#fecaca",
    deliveryDays: { Local: "1-2", Regional: "2-3", National: "3-5" },
    codCharge: 45,
    codPercent: 0.015,
    rates: {
      Local: { base: 35, perKg: 18 },
      Regional: { base: 45, perKg: 22 },
      National: { base: 55, perKg: 28 },
    },
    expressMultiplier: 1.5,
    features: ["Pan India Coverage", "Real-time Tracking", "COD Available"],
  },
  Bluedart: {
    icon: "💙",
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
    deliveryDays: { Local: "1", Regional: "1-2", National: "2-3" },
    codCharge: 50,
    codPercent: 0.02,
    rates: {
      Local: { base: 55, perKg: 25 },
      Regional: { base: 70, perKg: 32 },
      National: { base: 90, perKg: 40 },
    },
    expressMultiplier: 1.3,
    features: ["Fastest Delivery", "Premium Service", "High Value Shipments"],
  },
  DTDC: {
    icon: "📦",
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
    deliveryDays: { Local: "1-2", Regional: "3-4", National: "4-6" },
    codCharge: 40,
    codPercent: 0.013,
    rates: {
      Local: { base: 30, perKg: 15 },
      Regional: { base: 38, perKg: 19 },
      National: { base: 48, perKg: 24 },
    },
    expressMultiplier: 1.6,
    features: ["Economical Rates", "Wide Network", "COD Available"],
  },
  XpressBees: {
    icon: "🐝",
    color: "#f97316",
    bg: "#fff7ed",
    border: "#fed7aa",
    deliveryDays: { Local: "1-2", Regional: "2-3", National: "3-4" },
    codCharge: 42,
    codPercent: 0.014,
    rates: {
      Local: { base: 32, perKg: 16 },
      Regional: { base: 42, perKg: 20 },
      National: { base: 52, perKg: 26 },
    },
    expressMultiplier: 1.45,
    features: ["Ecommerce Focused", "API Integration", "COD Available"],
  },
  Ekart: {
    icon: "🛒",
    color: "#0891b2",
    bg: "#ecfeff",
    border: "#a5f3fc",
    deliveryDays: { Local: "1-2", Regional: "2-4", National: "4-6" },
    codCharge: 38,
    codPercent: 0.012,
    rates: {
      Local: { base: 28, perKg: 14 },
      Regional: { base: 36, perKg: 18 },
      National: { base: 46, perKg: 23 },
    },
    expressMultiplier: 1.55,
    features: ["Flipkart Network", "Economical", "Wide Coverage"],
  },
  Shadowfax: {
    icon: "⚡",
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    deliveryDays: { Local: "Same Day", Regional: "1-2", National: "2-4" },
    codCharge: 35,
    codPercent: 0.011,
    rates: {
      Local: { base: 40, perKg: 20 },
      Regional: { base: 50, perKg: 25 },
      National: { base: 65, perKg: 32 },
    },
    expressMultiplier: 1.2,
    features: ["Same Day Delivery", "Hyperlocal", "Quick Commerce"],
  },
};

export const ZONE_DATA = {
  // Metro to Metro = Local
  // Same state = Regional
  // Different state = National
  // This is simplified logic based on pincode prefix
  getZone: (pickupPin, deliveryPin) => {
    if (!pickupPin || !deliveryPin || pickupPin.length < 3 || deliveryPin.length < 3)
      return null;

    const pickupPrefix = pickupPin.substring(0, 2);
    const deliveryPrefix = deliveryPin.substring(0, 2);

    // Same first 2 digits = Local
    if (pickupPin.substring(0, 4) === deliveryPin.substring(0, 4)) return "Local";

    // Same first 2 digits = Regional (same state approx)
    if (pickupPrefix === deliveryPrefix) return "Regional";

    // Different prefix = National
    return "National";
  },
};

export function calcVolumetric(length, width, height) {
  const l = parseFloat(length) || 0;
  const w = parseFloat(width) || 0;
  const h = parseFloat(height) || 0;
  return (l * w * h) / 5000;
}

export function calcShipping({
  actualWeight,
  length,
  width,
  height,
  zone,
  deliveryType,
  codEnabled,
  codAmount,
  selectedCourier,
}) {
  const actual = parseFloat(actualWeight) || 0;
  const volumetric = calcVolumetric(length, width, height);
  const chargeable = Math.max(actual, volumetric);
  const isExpress = deliveryType === "Express";
  const isCOD = codEnabled;
  const cod = parseFloat(codAmount) || 0;

  const results = {};

  const couriersToCalc =
    selectedCourier === "All"
      ? Object.keys(COURIERS)
      : [selectedCourier];

  couriersToCalc.forEach((name) => {
    const courier = COURIERS[name];
    if (!courier || !zone) return;

    const rate = courier.rates[zone];
    let shippingCost = rate.base + chargeable * rate.perKg;

    if (isExpress) shippingCost *= courier.expressMultiplier;

    let codCharge = 0;
    if (isCOD && cod > 0) {
      codCharge = Math.max(
        courier.codCharge,
        cod * courier.codPercent
      );
    }

    const totalCost = shippingCost + codCharge;

    results[name] = {
      shippingCost: parseFloat(shippingCost.toFixed(2)),
      codCharge: parseFloat(codCharge.toFixed(2)),
      totalCost: parseFloat(totalCost.toFixed(2)),
      deliveryDays: courier.deliveryDays[zone],
      volumetric: parseFloat(volumetric.toFixed(3)),
      chargeable: parseFloat(chargeable.toFixed(3)),
      actual,
    };
  });

  return { results, volumetric, chargeable, actual };
}

export function getShippingInsights({
  results,
  volumetric,
  actual,
  chargeable,
  zone,
  inputs,
}) {
  const insights = [];

  if (!zone || Object.keys(results).length === 0) return insights;

  const sorted = Object.entries(results).sort(
    (a, b) => a[1].totalCost - b[1].totalCost
  );
  const cheapest = sorted[0];
  const fastest = Object.entries(results).sort((a, b) => {
    const daysA = parseInt(a[1].deliveryDays) || 0;
    const daysB = parseInt(b[1].deliveryDays) || 0;
    return daysA - daysB;
  })[0];

  // Cheapest courier
  insights.push({
    type: "success",
    icon: "💰",
    title: `Cheapest: ${cheapest[0]}`,
    msg: `${cheapest[0]} is the most economical at ₹${cheapest[1].totalCost.toFixed(
      0
    )} for ${zone} delivery`,
  });

  // Fastest courier
  if (fastest[0] !== cheapest[0]) {
    insights.push({
      type: "info",
      icon: "⚡",
      title: `Fastest: ${fastest[0]}`,
      msg: `${fastest[0]} delivers in ${fastest[1].deliveryDays} days but costs ₹${(
        fastest[1].totalCost - cheapest[1].totalCost
      ).toFixed(0)} more than ${cheapest[0]}`,
    });
  }

  // Volumetric vs actual weight
  if (volumetric > actual) {
    insights.push({
      type: "warn",
      icon: "📦",
      title: "Volumetric Weight is Higher",
      msg: `Your package shape is costing you money. Volumetric weight (${volumetric.toFixed(
        2
      )}kg) > actual (${actual}kg). Try reducing dimensions to save on shipping`,
    });
  } else {
    insights.push({
      type: "success",
      icon: "⚖️",
      title: "Actual Weight is Chargeable",
      msg: `Good - actual weight (${actual}kg) is higher than volumetric (${volumetric.toFixed(
        2
      )}kg). Your package shape is efficient`,
    });
  }

  // Zone insight
  if (zone === "National") {
    insights.push({
      type: "warn",
      icon: "🗺️",
      title: "National Zone Detected",
      msg: "National shipping costs 2-3x more than local. Consider local warehousing or FBA to reduce shipping costs for distant customers",
    });
  }

  // COD insight
  if (inputs.codEnabled && parseFloat(inputs.codAmount) > 0) {
    insights.push({
      type: "info",
      icon: "💵",
      title: "COD Charges Added",
      msg: `COD adds ₹${cheapest[1].codCharge.toFixed(
        0
      )} to your shipping cost. Encourage prepaid orders to save this charge`,
    });
  }

  return insights;
}