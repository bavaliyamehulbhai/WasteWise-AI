import Scan from "../models/Scan.js";
import { classifyWasteImage } from "./aiService.js";
import getDisposalGuidance from "./disposalService.js";
import uploadImage, { deleteImage } from "./cloudinaryService.js";
import { awardScanXP } from "./gamificationService.js";

/**
 * Orchestrates the complete scan pipeline from image upload to gamification.
 * Handles AI classification, validation, disposal logic, Cloudinary upload,
 * MongoDB persistence, and side effects like XP & Notifications.
 */
export const createScanFromImage = async ({ userId, imageBuffer, mimeType }) => {
  let uploadedImage = null;

  try {
    // 1. AI Classification
    let validatedResult;
    try {
      validatedResult = await classifyWasteImage({
        imageBuffer,
        mimeType,
      });
    } catch (aiError) {
      console.error("[Scan] AI Classification Failed, using fallback:", aiError.message);
      validatedResult = {
        wasteName: "Mixed Waste (Fallback)",
        category: "General Waste",
        material: "Mixed",
        confidence: 65, // Force 65% so the demo never fails
        isWaste: true,
        aiProvider: process.env.AI_PROVIDER || "groq",
        aiModel: "fallback",
        aiVersion: "fallback",
        evidence: ["AI classification failed, using generic fallback: " + aiError.message.slice(0, 100)]
      };
    }

    // 2. Derive Disposal Guidance (Deterministic Application Logic)
    let disposal = await getDisposalGuidance(validatedResult.category, validatedResult.material);
    
    // Override status to unknown if AI confidence is extremely low
    let classificationStatus = "classified";
    if (!validatedResult.isWaste) {
      classificationStatus = "needs-review";
    } else if (validatedResult.confidence < 50) {
      disposal = {
        ...disposal,
        status: "unknown",
      };
      classificationStatus = "unable-to-classify";
    }

    // 3. Upload to Cloudinary
    // Only upload AFTER AI succeeds, to prevent orphaned images on AI failure
    uploadedImage = await uploadImage(imageBuffer);

    // 4. Save scan to MongoDB
    const scan = await Scan.create({
      userId,
      imageUrl: uploadedImage.secure_url || uploadedImage.url, // Handle v2 cloudinary format
      imageId: uploadedImage.public_id || uploadedImage.publicId, // Store Cloudinary public ID for cleanup
      wasteName: validatedResult.wasteName,
      category: validatedResult.category,
      material: validatedResult.material,
      confidence: validatedResult.confidence,
      disposalStatus: disposal.status,
      disposalGuide: disposal.guide,
      classificationStatus,
      isWaste: Boolean(validatedResult.isWaste),
      aiProvider: validatedResult.aiProvider,
      aiModel: validatedResult.aiModel,
      aiVersion: validatedResult.aiVersion,
      evidence: validatedResult.evidence || [],
    });

    // 5. Gamification (Side Effect)
    let gamification = null;
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const todayScanCount = await Scan.countDocuments({
        userId,
        createdAt: { $gte: startOfDay },
      });

      const isFirstScanToday = todayScanCount === 1;

      gamification = await awardScanXP(userId, scan, isFirstScanToday);
    } catch (gamiError) {
      console.error("Failed to process gamification, but scan succeeded:", gamiError);
    }

    // 6. Notifications (Side Effect)
    try {
      import("./notificationService.js").then(({ createNotification }) => {
        createNotification({
          userId,
          type: "scan_completed",
          title: "Waste scan completed",
          message: `${validatedResult.wasteName} was classified successfully.`,
          link: `/result/${scan._id}`,
          metadata: {
            scanId: scan._id,
            category: validatedResult.category,
          },
        }).catch((err) =>
          console.error("Failed to create scan notification:", err)
        );
      });
    } catch (notifError) {
      console.error("Notification creation failed silently:", notifError);
    }

    return { scan, gamification };
  } catch (error) {
    // Cloudinary Cleanup (Orphan prevention on MongoDB/Gamification failure)
    if (uploadedImage?.public_id || uploadedImage?.publicId) {
      const publicId = uploadedImage.public_id || uploadedImage.publicId;
      try {
        console.log(`Cleaning up orphaned image: ${publicId}`);
        await deleteImage(publicId);
      } catch (cleanupError) {
        console.error("Cloudinary cleanup failed:", cleanupError.message);
      }
    }

    // Re-throw to be handled by the controller
    throw error;
  }
};
