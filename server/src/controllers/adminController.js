import User from "../models/User.js";
import ScanFeedback from "../models/ScanFeedback.js";
import Scan from "../models/Scan.js";
import SystemSettings from "../models/SystemSettings.js";
import AuditLog from "../models/AuditLog.js";

const logAudit = async (userId, action, resourceType, resourceId, metadata = {}, ipAddress = "") => {
  try {
    await AuditLog.create({
      userId,
      action,
      resourceType,
      resourceId,
      metadata,
      ipAddress
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
};

/**
 * @desc    Get paginated users list
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 50); // cap at 50
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      success: true,
      users,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc    Update user role/status
 * @route   PUT /api/admin/users/:id
 * @access  Private/Admin
 */
export const updateUser = async (req, res) => {
  try {
    const { role, status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user._id.toString() === req.user._id.toString() && role !== "admin") {
      return res.status(400).json({ success: false, message: "Cannot remove your own admin role" });
    }

    const previousState = { role: user.role, status: user.status };

    if (role) user.role = role;
    if (status) user.status = status;

    await user.save();

    await logAudit(
      req.user._id,
      "USER_UPDATED",
      "User",
      user._id.toString(),
      { previous: previousState, new: { role: user.role, status: user.status } },
      req.ip
    );

    res.json({
      success: true,
      message: "User updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc    Get AI feedback queue
 * @route   GET /api/admin/feedback
 * @access  Private/Admin/Reviewer
 */
export const getFeedbackQueue = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const skip = (page - 1) * limit;

    const feedbackList = await ScanFeedback.find({})
      .populate("userId", "name email")
      .populate("scanId", "wasteName category confidence imageUrl classificationStatus aiModel aiVersion")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ScanFeedback.countDocuments();

    res.json({
      success: true,
      feedback: feedbackList,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc    Get dashboard summary metrics
 * @route   GET /api/admin/metrics
 * @access  Private/Admin
 */
export const getDashboardMetrics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: "active" });
    const totalScans = await Scan.countDocuments();
    const totalFeedback = await ScanFeedback.countDocuments();
    
    // Calculate AI Success vs Review rate
    const successfulScans = await Scan.countDocuments({ classificationStatus: "classified" });
    const aiSuccessRate = totalScans > 0 ? Math.round((successfulScans / totalScans) * 100) : 0;

    res.json({
      success: true,
      metrics: {
        totalUsers,
        activeUsers,
        totalScans,
        totalFeedback,
        aiSuccessRate
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc    Review user feedback
 * @route   PUT /api/admin/feedback/:id/review
 * @access  Private/Admin/Reviewer
 */
export const reviewFeedback = async (req, res) => {
  try {
    const { status } = req.body; // "accepted" or "rejected"
    const feedback = await ScanFeedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }

    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    // Update feedback review status
    feedback.reviewStatus = status;
    feedback.reviewedBy = req.user._id;
    feedback.reviewedAt = new Date();

    await feedback.save();

    await logAudit(
      req.user._id,
      "FEEDBACK_REVIEWED",
      "ScanFeedback",
      feedback._id.toString(),
      { status },
      req.ip
    );

    res.json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc    Get system settings
 * @route   GET /api/admin/settings
 * @access  Private/Admin
 */
export const getSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();
    
    // Create default if none exists
    if (!settings) {
      settings = await SystemSettings.create({});
    }

    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc    Update system settings
 * @route   PUT /api/admin/settings
 * @access  Private/Admin
 */
export const updateSettings = async (req, res) => {
  try {
    const settingsData = req.body;
    let settings = await SystemSettings.findOne();
    
    if (!settings) {
      settings = new SystemSettings();
    }

    // Update fields
    Object.assign(settings, settingsData);
    await settings.save();

    await logAudit(
      req.user._id,
      "SETTINGS_UPDATED",
      "SystemSettings",
      settings._id.toString(),
      { updatedFields: Object.keys(settingsData) },
      req.ip
    );

    res.json({ success: true, settings, message: "Settings updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/**
 * @desc    Get system audit logs
 * @route   GET /api/admin/logs
 * @access  Private/Admin
 */
export const getAuditLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const skip = (page - 1) * limit;

    const logs = await AuditLog.find({})
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AuditLog.countDocuments();

    res.json({
      success: true,
      logs,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
