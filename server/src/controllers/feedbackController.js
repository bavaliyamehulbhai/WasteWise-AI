import ScanFeedback from "../models/ScanFeedback.js";
import Scan from "../models/Scan.js";

/**
 * @desc    Submit user feedback for a scan
 * @route   POST /api/feedback
 * @access  Private
 */
export const submitFeedback = async (req, res) => {
  try {
    const { scanId, correct, correctedCategory, correctedMaterial, comment } = req.body;

    if (!scanId || typeof correct !== "boolean") {
      return res.status(400).json({ message: "Scan ID and correct flag are required" });
    }

    const scan = await Scan.findOne({ _id: scanId, userId: req.user._id });
    if (!scan) {
      return res.status(404).json({ message: "Scan not found or unauthorized" });
    }

    // Check if feedback already exists for this scan
    const existingFeedback = await ScanFeedback.findOne({ scanId });
    if (existingFeedback) {
      return res.status(400).json({ message: "Feedback already submitted for this scan" });
    }

    const feedback = await ScanFeedback.create({
      userId: req.user._id,
      scanId,
      correct,
      correctedCategory: correct ? "" : correctedCategory,
      correctedMaterial: correct ? "" : correctedMaterial,
      comment
    });

    res.status(201).json(feedback);
  } catch (error) {
    console.error("Submit Feedback Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * @desc    Get user feedback for a specific scan
 * @route   GET /api/feedback/:scanId
 * @access  Private
 */
export const getFeedback = async (req, res) => {
  try {
    const { scanId } = req.params;

    const feedback = await ScanFeedback.findOne({ 
      scanId,
      userId: req.user._id
    });

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.json(feedback);
  } catch (error) {
    console.error("Get Feedback Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
