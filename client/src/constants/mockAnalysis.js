export const mockAnalysisResult = {
  id: "scan-demo-001",

  image: "",

  item: {
    name: "Plastic Bottle",
    category: "Plastic",
    material: "PET",
  },

  confidence: 94,

  recyclability: {
    status: "conditional",
    label: "Recyclable where accepted",
  },

  disposal: {
    stream: "Recycling",

    action: "Empty → Rinse → Recycle",

    description:
      "Place the clean PET bottle in your recycling stream where accepted.",

    preparationSteps: [
      "Empty any remaining liquid.",
      "Rinse the bottle if needed.",
      "Follow your local recycling rules.",
    ],

    localRuleWarning:
      "Recycling acceptance can vary by location. Check your local waste authority before disposal.",

    ecoTip:
      "Reuse your bottle when practical before recycling it.",
  },

  explanation:
    "The AI identified shape and material cues commonly associated with a PET beverage bottle.",
};
