import mongoose from "mongoose";
import Scan from "../models/Scan.js";
import { createScanFromImage } from "../services/scanService.js";

export const createScan = async (req, res, next) => {
  try {
    // 1. Check image
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
        code: "VALIDATION_ERROR"
      });
    }

    // 2. Delegate to the core scan service pipeline
    const { scan, gamification } = await createScanFromImage({
      userId: req.user._id,
      imageBuffer: req.file.buffer,
      mimeType: req.file.mimetype,
    });

    // 3. Success
    return res.status(201).json({
      success: true,
      message: "Waste classified successfully",
      scan,
      gamification,
    });
  } catch (error) {
    console.error("Create scan error:", error);
    
    // User-friendly error message mapping
    let friendlyMessage = "Unable to classify this image right now. Please try again.";
    
    if (error.message.includes("Invalid AI response") || error.message.includes("missing field")) {
       friendlyMessage = "The AI was unable to correctly identify the waste in this image. Please try a clearer photo.";
    } else if (error.message.includes("Unsupported AI provider")) {
       friendlyMessage = "Our AI classification engine is currently unavailable.";
    }

    return res.status(500).json({
      success: false,
      message: friendlyMessage,
      code: error.message.includes("Unsupported") ? "AI_PROVIDER_ERROR" : "AI_INVALID_RESPONSE"
    });
  }
};

const allowedCategories = [
  "Plastic",
  "Paper",
  "Glass",
  "Metal",
  "Organic",
  "E-Waste",
  "General Waste",
  "Other",
];

const allowedStatuses = [
  "recyclable",
  "general-waste",
  "compost",
  "special-disposal",
  "reuse",
  "unknown",
];

export const getScans = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      category = "",
      status = "",
      startDate = "",
      endDate = "",
      sort = "newest",
    } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);
    const currentLimit = Math.min(
      Math.max(Number(limit) || 10, 1),
      50
    );

    const query = {
      userId: req.user._id,
    };

    // Search
    if (search.trim()) {
      // Escape regex to prevent injection
      const safeSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(safeSearch, "i");

      query.$or = [
        { wasteName: searchRegex },
        { category: searchRegex },
        { material: searchRegex },
      ];
    }

    // Category
    if (category) {
      if (!allowedCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category",
          code: "VALIDATION_ERROR"
        });
      }
      query.category = category;
    }

    // Disposal status
    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid disposal status",
          code: "VALIDATION_ERROR"
        });
      }
      query.disposalStatus = status;
    }

    // Date range
    if (startDate || endDate) {
      query.createdAt = {};

      if (startDate) {
        const start = new Date(`${startDate}T00:00:00`);
        if (Number.isNaN(start.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid start date",
            code: "VALIDATION_ERROR"
          });
        }
        query.createdAt.$gte = start;
      }

      if (endDate) {
        const end = new Date(`${endDate}T23:59:59.999`);
        if (Number.isNaN(end.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid end date",
            code: "VALIDATION_ERROR"
          });
        }
        query.createdAt.$lte = end;
      }
    }

    // Prevent invalid date range
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be after end date",
        code: "VALIDATION_ERROR"
      });
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    const skip = (currentPage - 1) * currentLimit;

    const [scans, total] = await Promise.all([
      Scan.find(query)
        .select("imageUrl wasteName category material confidence disposalStatus disposalGuide createdAt")
        .sort(sortOption)
        .skip(skip)
        .limit(currentLimit)
        .lean(),
      Scan.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      scans,
      pagination: {
        page: currentPage,
        limit: currentLimit,
        total,
        totalPages: Math.ceil(total / currentLimit),
      },
    });
  } catch (error) {
    console.error("Get scans error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch scans",
      code: "INTERNAL_ERROR"
    });
  }
};

export const getScanById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid scan ID",
        code: "VALIDATION_ERROR"
      });
    }

    const scan = await Scan.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: "Scan not found",
        code: "RESOURCE_NOT_FOUND"
      });
    }

    return res.status(200).json({
      success: true,
      scan,
    });
  } catch (error) {
    console.error("Get scan error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch scan",
      code: "INTERNAL_ERROR"
    });
  }
};

export const deleteScan = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid scan ID",
        code: "VALIDATION_ERROR"
      });
    }

    const scan = await Scan.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: "Scan not found",
        code: "RESOURCE_NOT_FOUND"
      });
    }

    // Cloudinary Cleanup
    if (scan.imageId) {
      try {
        const { deleteImage } = await import("../services/cloudinaryService.js");
        await deleteImage(scan.imageId);
      } catch (err) {
        console.error("Failed to delete image from Cloudinary:", err);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Scan deleted successfully",
    });
  } catch (error) {
    console.error("Delete scan error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete scan",
      code: "INTERNAL_ERROR"
    });
  }
};
