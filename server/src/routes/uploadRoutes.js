import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Upload an image to Cloudinary
// @route   POST /api/upload
// @access  Private
router.post("/", protect, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No image file provided",
    });
  }

  // Cloudinary automatically returns the accessible URL in req.file.path
  const imageUrl = req.file.path;

  return res.status(200).json({
    success: true,
    message: "Image uploaded successfully",
    imageUrl,
  });
});

export default router;
