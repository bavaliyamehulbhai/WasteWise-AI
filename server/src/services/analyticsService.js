import Scan from "../models/Scan.js";
import { getDateRange, getPreviousDateRange, generateDateArray } from "../utils/dateUtils.js";

const WASTE_CATEGORIES = [
  "Plastic",
  "Paper",
  "Glass",
  "Metal",
  "Organic",
  "E-Waste",
  "General Waste",
  "Other",
];

const DISPOSAL_STATUSES = [
  "recyclable",
  "general-waste",
  "compost",
  "special-disposal",
  "reuse",
  "unknown",
];

export const getAnalytics = async (userId, range) => {
  const currentRange = getDateRange(range);
  const previousRange = getPreviousDateRange(range);

  const [
    summaryData,
    previousSummaryData,
    categoriesData,
    trendsData,
    confidenceData,
  ] = await Promise.all([
    getSummary(userId, currentRange.start, currentRange.end),
    getSummary(userId, previousRange.start, previousRange.end),
    getCategories(userId, currentRange.start, currentRange.end),
    getTrends(userId, currentRange.start, currentRange.end),
    getConfidence(userId, currentRange.start, currentRange.end),
  ]);

  // Transform Summary
  const summary = {
    totalScans: 0,
    recyclable: 0,
    generalWaste: 0,
    compost: 0,
    specialDisposal: 0,
    reuse: 0,
    unknown: 0,
  };

  summaryData.forEach((item) => {
    summary.totalScans += item.count;
    const key = item._id.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    if (summary[key] !== undefined) {
      summary[key] = item.count;
    }
  });

  const previousTotal = previousSummaryData.reduce((acc, item) => acc + item.count, 0);
  
  const comparison = {
    previousTotal,
    totalChange: previousTotal === 0 ? null : Math.round(((summary.totalScans - previousTotal) / previousTotal) * 100),
  };

  return {
    summary,
    comparison,
    categories: categoriesData,
    disposal: transformDisposal(summaryData, summary.totalScans),
    trends: transformTrends(trendsData, currentRange.start, currentRange.end),
    confidence: {
      averageReportedConfidence: confidenceData[0]?.average ? Number(confidenceData[0].average.toFixed(1)) : null,
    },
    impact: {
      available: false,
      co2e: null,
      waterImpact: null,
      materialsRecovered: null,
      methodologyVersion: null,
    },
  };
};

const getSummary = async (userId, start, end) => {
  return Scan.aggregate([
    {
      $match: {
        userId,
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: "$disposalStatus",
        count: { $sum: 1 },
      },
    },
  ]);
};

const getCategories = async (userId, start, end) => {
  const result = await Scan.aggregate([
    {
      $match: {
        userId,
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  const total = result.reduce((sum, item) => sum + item.count, 0);

  // Zero-fill categories
  const mapped = WASTE_CATEGORIES.map((cat) => {
    const found = result.find((r) => r._id === cat);
    const count = found ? found.count : 0;
    return {
      category: cat,
      count,
      percentage: total === 0 ? 0 : Number(((count / total) * 100).toFixed(1)),
    };
  });

  return mapped.sort((a, b) => b.count - a.count);
};

const transformDisposal = (summaryData, total) => {
  return DISPOSAL_STATUSES.map((status) => {
    const found = summaryData.find((s) => s._id === status);
    const count = found ? found.count : 0;
    return {
      status,
      count,
      percentage: total === 0 ? 0 : Number(((count / total) * 100).toFixed(1)),
    };
  }).sort((a, b) => b.count - a.count);
};

const getTrends = async (userId, start, end) => {
  return Scan.aggregate([
    {
      $match: {
        userId,
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "Asia/Kolkata",
            },
          },
          category: "$category",
        },
        count: { $sum: 1 },
      },
    },
  ]);
};

const transformTrends = (trendsData, start, end) => {
  const dates = generateDateArray(start, end);
  
  return dates.map((date) => {
    const dataPoint = { date, total: 0 };
    
    // Initialize all categories with 0
    WASTE_CATEGORIES.forEach((cat) => {
      dataPoint[cat] = 0;
    });

    // Populate actual data
    const dateData = trendsData.filter((t) => t._id.date === date);
    dateData.forEach((item) => {
      dataPoint[item._id.category] = item.count;
      dataPoint.total += item.count;
    });

    return dataPoint;
  });
};

const getConfidence = async (userId, start, end) => {
  return Scan.aggregate([
    {
      $match: {
        userId,
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: null,
        average: { $avg: "$confidence" },
      },
    },
  ]);
};
