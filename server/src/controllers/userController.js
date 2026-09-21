import User from "../models/User.js";
import uploadImage from "../services/cloudinaryService.js";
import bcrypt from "bcryptjs";

// GET /api/users/profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const SustainabilityProfile = (await import("../models/SustainabilityProfile.js")).default;
    let profile = await SustainabilityProfile.findOne({ userId: req.user._id });

    // Auto-create for legacy
    if (!profile) {
      profile = await SustainabilityProfile.create({
        userId: req.user._id,
        onboardingCompleted: false,
      });
    }

    // Convert mongoose document to plain object to attach custom fields
    const userObj = user.toObject();
    userObj.onboardingCompleted = profile.onboardingCompleted;

    return res.status(200).json({
      success: true,
      user: userObj,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) {
      if (
        typeof name !== "string" ||
        name.trim().length < 2
      ) {
        return res.status(400).json({
          success: false,
          message: "Name must contain at least 2 characters",
        });
      }

      user.name = name.trim();
    }

    if (email !== undefined) {
      const normalizedEmail =
        email.trim().toLowerCase();

      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email is already in use",
        });
      }

      user.email = normalizedEmail;
    }

    // Handle string avatar URL if provided (legacy)
    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    // Handle file upload
    if (req.file) {
      const uploadedImage = await uploadImage(req.file.buffer);
      user.avatar = uploadedImage.secure_url;
    }

    await user.save();
    
    // Create notification (optional)
    import("../services/notificationService.js").then(({ createNotification }) => {
      createNotification({
        userId: req.user._id,
        type: "profile_updated",
        title: "Profile updated",
        message: "Your profile information was updated successfully.",
        link: "/profile",
      }).catch(err => console.error("Failed to create profile notification:", err));
    });

    const safeUser = await User.findById(user._id).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const { notifications, darkMode } = req.body;
    
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      notifications !== undefined &&
      typeof notifications === "boolean"
    ) {
      user.notifications = notifications;
    }

    if (
      darkMode !== undefined &&
      typeof darkMode === "boolean"
    ) {
      user.darkMode = darkMode;
    }

    await user.save();

    const safeUser = await User.findById(user._id).select("-password");

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide both current and new passwords",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    // Find user and explicitly select password
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect current password",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Update password error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update password",
    });
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Fetch all user scans to delete Cloudinary images
    const Scan = (await import("../models/Scan.js")).default;
    const { deleteImage } = await import("../services/cloudinaryService.js");
    
    const userScans = await Scan.find({ userId });
    
    for (const scan of userScans) {
      if (scan.imageId) {
        try {
          await deleteImage(scan.imageId);
        } catch (err) {
          console.error(`Failed to delete Cloudinary image ${scan.imageId} during account deletion:`, err.message);
        }
      }
    }

    // 2. Delete all MongoDB Scans
    await Scan.deleteMany({ userId });

    // 3. Delete Gamification Data
    const UserBadge = (await import("../models/UserBadge.js")).default;
    const UserChallenge = (await import("../models/UserChallenge.js")).default;
    
    await UserBadge.deleteMany({ userId });
    await UserChallenge.deleteMany({ userId });

    // 4. Delete Notifications
    const Notification = (await import("../models/Notification.js")).default;
    await Notification.deleteMany({ userId });

    // 5. Delete User Account
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "Account and all associated data successfully deleted",
    });
  } catch (error) {
    console.error("Account deletion error:", error);
    next(error);
  }
};
