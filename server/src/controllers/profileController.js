import SustainabilityProfile from "../models/SustainabilityProfile.js";
import User from "../models/User.js";

// @desc    Get current user's sustainability profile
// @route   GET /api/profile
// @access  Private
export const getSustainabilityProfile = async (req, res) => {
  try {
    let profile = await SustainabilityProfile.findOne({ userId: req.user._id });

    if (!profile) {
      // Create a default profile if it doesn't exist yet
      profile = await SustainabilityProfile.create({
        userId: req.user._id,
        onboardingCompleted: false,
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Error fetching sustainability profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
    });
  }
};

// @desc    Update current user's sustainability profile
// @route   PUT /api/profile
// @access  Private
export const updateSustainabilityProfile = async (req, res) => {
  try {
    const { preferredLanguage, country, state, city, goals, onboardingCompleted } = req.body;

    let profile = await SustainabilityProfile.findOne({ userId: req.user._id });

    if (!profile) {
      profile = new SustainabilityProfile({
        userId: req.user._id,
      });
    }

    if (preferredLanguage !== undefined) profile.preferredLanguage = preferredLanguage;
    if (country !== undefined) profile.country = country;
    if (state !== undefined) profile.state = state;
    if (city !== undefined) profile.city = city;
    if (goals !== undefined) profile.goals = goals;
    if (onboardingCompleted !== undefined) profile.onboardingCompleted = onboardingCompleted;

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Sustainability profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Error updating sustainability profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
};
