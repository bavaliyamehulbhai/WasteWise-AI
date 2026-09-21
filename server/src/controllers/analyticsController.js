import { getAnalytics } from "../services/analyticsService.js";

export const getAnalyticsData = async (req, res) => {
  try {
    const allowedRanges = [7, 30, 90];
    const range = Number(req.query.range) || 30;

    if (!allowedRanges.includes(range)) {
      return res.status(400).json({
        success: false,
        message: "Range must be 7, 30, or 90 days",
      });
    }

    const data = await getAnalytics(req.user._id, range);

    return res.status(200).json({
      success: true,
      range,
      ...data,
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load analytics",
    });
  }
};
