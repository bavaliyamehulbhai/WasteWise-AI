// Mock data matching the new model
export const mockScans = [
  {
    id: "scan_001",
    wasteName: "Plastic Bottle",
    category: "Plastic",
    confidence: 94,
    disposalStatus: "recyclable",
    createdAt: new Date().toISOString()
  },
  {
    id: "scan_002",
    wasteName: "Aluminum Can",
    category: "Metal",
    confidence: 91,
    disposalStatus: "recyclable",
    createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  },
  {
    id: "scan_003",
    wasteName: "Used Tissue",
    category: "Paper",
    confidence: 88,
    disposalStatus: "trash",
    createdAt: new Date(Date.now() - 86400000).toISOString() // Yesterday
  },
  {
    id: "scan_004",
    wasteName: "Cardboard Box",
    category: "Paper",
    confidence: 97,
    disposalStatus: "recyclable",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "scan_005",
    wasteName: "Glass Bottle",
    category: "Glass",
    confidence: 88,
    disposalStatus: "recyclable",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: "scan_006",
    wasteName: "AA Battery",
    category: "Electronic",
    confidence: 99,
    disposalStatus: "special",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];
