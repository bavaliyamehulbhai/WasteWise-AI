export const mockDashboardData = {
  ecoScore: {
    score: 82,
    label: "Great progress",
    change: "+8%",
  },

  stats: {
    totalScans: 24,
    highConfidence: 21,
    ecoActions: 18,
    estimatedImpact: "12.4 kg",
  },

  wasteBreakdown: [
    {
      category: "Plastic",
      count: 9,
      percentage: 38,
    },
    {
      category: "Paper",
      count: 6,
      percentage: 25,
    },
    {
      category: "Organic",
      count: 5,
      percentage: 21,
    },
    {
      category: "Glass",
      count: 3,
      percentage: 13,
    },
    {
      category: "Other",
      count: 1,
      percentage: 3,
    },
  ],

  impact: {
    recycledItems: 12,
    divertedFromLandfill: "8.7 kg",
    ecoActions: 18,
  },

  recentActivity: [
    {
      id: "1",
      item: "Plastic Bottle",
      category: "Plastic",
      confidence: 94,
      action: "Recycling",
      time: "2 min ago",
    },
    {
      id: "2",
      item: "Cardboard Box",
      category: "Paper",
      confidence: 91,
      action: "Recycling",
      time: "Yesterday",
    },
    {
      id: "3",
      item: "Apple Core",
      category: "Organic",
      confidence: 97,
      action: "Compost",
      time: "2 days ago",
    },
    {
      id: "4",
      item: "Glass Jar",
      category: "Glass",
      confidence: 86,
      action: "Recycling",
      time: "3 days ago",
    },
  ],
};
