import Scan from "../models/Scan.js";

const getScanMetrics = async (userId, dateFilter = {}) => {
  const [
    totalScans,
    recyclable,
    generalWaste,
    compost,
    specialDisposal,
    reuse,
    unknown,
  ] = await Promise.all([
    Scan.countDocuments({ userId, ...dateFilter }),
    Scan.countDocuments({ userId, disposalStatus: "recyclable", ...dateFilter }),
    Scan.countDocuments({ userId, disposalStatus: "general-waste", ...dateFilter }),
    Scan.countDocuments({ userId, disposalStatus: "compost", ...dateFilter }),
    Scan.countDocuments({ userId, disposalStatus: "special-disposal", ...dateFilter }),
    Scan.countDocuments({ userId, disposalStatus: "reuse", ...dateFilter }),
    Scan.countDocuments({ userId, disposalStatus: "unknown", ...dateFilter }),
  ]);

  return {
    totalScans,
    recyclable,
    generalWaste,
    compost,
    specialDisposal,
    reuse,
    unknown,
  };
};

const calculateMetricChange = (current, previous) => {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
};

const calculatePercentagesWithLargestRemainder = (items, totalCount) => {
  if (totalCount === 0 || items.length === 0) return items;

  // Calculate precise percentages and floor them
  let mapped = items.map(item => {
    const precise = (item.count / totalCount) * 100;
    return {
      ...item,
      percentage: Math.floor(precise),
      remainder: precise - Math.floor(precise)
    };
  });

  // Distribute the missing percentage points to those with the largest remainder
  const currentTotal = mapped.reduce((sum, item) => sum + item.percentage, 0);
  const shortfall = 100 - currentTotal;

  // Sort by remainder descending
  mapped.sort((a, b) => b.remainder - a.remainder);

  for (let i = 0; i < shortfall; i++) {
    if (mapped[i]) {
      mapped[i].percentage += 1;
    }
  }

  // Remove the temporary remainder field and return original order if needed
  // (We actually want it sorted by count descending for the UI)
  mapped.sort((a, b) => b.count - a.count);

  return mapped.map(({ remainder, ...rest }) => rest);
};

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const now = new Date();
    const currentPeriodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const previousPeriodStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const previousPeriodEnd = currentPeriodStart;

    const [
      allTimeMetrics,
      currentMetrics,
      previousMetrics,
      recentScans,
      rawCategoryBreakdown,
    ] = await Promise.all([
      getScanMetrics(userId),
      getScanMetrics(userId, { createdAt: { $gte: currentPeriodStart } }),
      getScanMetrics(userId, { createdAt: { $gte: previousPeriodStart, $lt: previousPeriodEnd } }),

      Scan.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("imageUrl wasteName category material confidence disposalStatus createdAt")
        .lean(),

      Scan.aggregate([
        { $match: { userId } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $project: { _id: 0, category: "$_id", count: 1 } },
        { $sort: { count: -1 } },
      ]),
    ]);

    const comparisons = {
      totalScans: calculateMetricChange(currentMetrics.totalScans, previousMetrics.totalScans),
      recyclable: calculateMetricChange(currentMetrics.recyclable, previousMetrics.recyclable),
      generalWaste: calculateMetricChange(currentMetrics.generalWaste, previousMetrics.generalWaste),
      compost: calculateMetricChange(currentMetrics.compost, previousMetrics.compost),
      specialDisposal: calculateMetricChange(currentMetrics.specialDisposal, previousMetrics.specialDisposal),
      reuse: calculateMetricChange(currentMetrics.reuse, previousMetrics.reuse),
      unknown: calculateMetricChange(currentMetrics.unknown, previousMetrics.unknown),
    };

    const categoryBreakdown = calculatePercentagesWithLargestRemainder(
      rawCategoryBreakdown, 
      allTimeMetrics.totalScans
    );

    return res.status(200).json({
      success: true,
      metrics: allTimeMetrics,
      comparisons,
      categoryBreakdown,
      recentScans,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard summary",
    });
  }
};

const WASTE_CATEGORIES = [
  "Plastic", "Paper", "Glass", "Metal", "Organic", "E-Waste", "General Waste", "Other"
];

const generateDateRange = (startDate, endDate) => {
  const dates = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    // Avoid timezone offset shifting by formatting manually or using UTC
    const dateString = new Date(current.getTime() - (current.getTimezoneOffset() * 60000))
      .toISOString()
      .split("T")[0];
    dates.push(dateString);
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

export const getDashboardTrends = async (req, res) => {
  try {
    const userId = req.user._id;
    const allowedRanges = [7, 30, 90];
    const range = Number(req.query.range) || 30;

    if (!allowedRanges.includes(range)) {
      return res.status(400).json({
        success: false,
        message: "Invalid trend range",
      });
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (range - 1));

    const rawTrendData = await Scan.aggregate([
      {
        $match: {
          userId,
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Kolkata" },
            },
            category: "$category",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]);

    // Zero-fill dates
    const dates = generateDateRange(startDate, endDate);
    
    // Map raw data for easy lookup
    const trendMap = {};
    rawTrendData.forEach((item) => {
      const date = item._id.date;
      const category = item._id.category;
      if (!trendMap[date]) trendMap[date] = {};
      trendMap[date][category] = item.count;
    });

    const trendData = dates.map((date) => {
      const row = { date, total: 0 };
      
      for (const category of WASTE_CATEGORIES) {
        const count = trendMap[date]?.[category] || 0;
        row[category] = count;
        row.total += count;
      }

      return row;
    });

    return res.status(200).json({
      success: true,
      range,
      startDate: dates[0],
      endDate: dates[dates.length - 1],
      data: trendData,
    });

  } catch (error) {
    console.error("Dashboard Trends error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard trends",
    });
  }
};
