import Notification from "../models/Notification.js";
import Scan from "../models/Scan.js";
import classifyWaste from "../services/aiService.js";
import uploadImage from "../services/cloudinaryService.js";
import validateAIResult from "../utils/validateAIResult.js";

export const classifyWasteImage = async (req, res) => {
  try {
    // Check image
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a waste image",
      });
    }

    // Check authenticated user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    // 1. Upload image to Cloudinary
    const uploadedImage = await uploadImage(req.file.buffer);

    // 2. Send image URL to AI (faster than base64)
    const aiResult = await classifyWaste(uploadedImage.secure_url);
    
    // 3. Validate AI result
    const result = validateAIResult(aiResult);

    // 4. Save everything in MongoDB
    const scan = await Scan.create({
      userId: req.user._id,
      imageUrl: uploadedImage.secure_url,
      wasteName: result.wasteName,
      category: result.category,
      material: result.material,
      confidence: result.confidence,
      disposalStatus: result.disposalStatus,
      disposalGuide: result.disposalGuide,
    });

    // 5. Create Notification
    await Notification.create({
      userId: req.user._id,
      type: "success",
      title: "Scan Successful",
      message: `You successfully scanned a ${result.wasteName}! Check disposal guidelines.`,
    });

    return res.status(201).json({
      success: true,
      message: "Waste classified and scan saved successfully",
      scan,
    });
  } catch (error) {
    console.error("AI classification error:", error);

    return res.status(500).json({
      success: false,
      message: "Waste classification failed",
    });
  }
};
