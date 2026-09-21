import DisposalRule from "../models/DisposalRule.js";

const disposalRules = {
  Plastic: {
    status: "recyclable",
    guide:
      "Check local recycling guidance. Empty and clean the item when required by your local program.",
  },
  Paper: {
    status: "recyclable",
    guide:
      "Keep paper clean and dry and follow local paper-recycling guidance.",
  },
  Glass: {
    status: "recyclable",
    guide: "Handle carefully and follow local glass-recycling guidance.",
  },
  Metal: {
    status: "recyclable",
    guide: "Separate metal where your local recycling program accepts it.",
  },
  Organic: {
    status: "compost",
    guide: "Use an approved compost or organic-waste stream where available.",
  },
  "E-Waste": {
    status: "special-disposal",
    guide: "Use an authorized e-waste collection or take-back program.",
  },
  "General Waste": {
    status: "general-waste",
    guide: "Use the general-waste stream according to local waste rules.",
  },
  Other: {
    status: "unknown",
    guide: "Check local disposal guidance before discarding this item.",
  },
};

const getDisposalGuidance = async (category, material) => {
  try {
    // 1. Try to find an authoritative verified rule from the DB
    const verifiedRule = await DisposalRule.findOne({ 
      category,
      status: "verified" 
    });

    if (verifiedRule) {
      const fallbackRule = disposalRules[category] || disposalRules["Other"];
      return {
        status: fallbackRule.status, // use the enum-valid status based on category
        guide: verifiedRule.disposalMethod,
        isVerified: true
      };
    }
  } catch (error) {
    console.error("Failed to fetch verified rule from DB:", error);
  }

  // 2. Fallback to generic hardcoded rules
  const rule = disposalRules[category] || disposalRules["Other"];
  return {
    ...rule,
    isVerified: false
  };
};

export default getDisposalGuidance;
