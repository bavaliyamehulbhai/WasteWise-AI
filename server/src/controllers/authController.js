import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
        code: "VALIDATION_ERROR"
      });
    }

    // 2. Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // 3. Check password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
        code: "VALIDATION_ERROR"
      });
    }

    // 4. Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
        code: "VALIDATION_ERROR"
      });
    }

    // 5. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    // 6b. Create Sustainability Profile
    const SustainabilityProfile = (await import("../models/SustainabilityProfile.js")).default;
    await SustainabilityProfile.create({
      userId: user._id,
      onboardingCompleted: false,
    });

    // 7. Generate JWT
    const token = generateToken(user._id.toString());

    // 8. Safe response
    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        notifications: user.notifications ?? true,
        darkMode: user.darkMode ?? false,
        onboardingCompleted: false,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create account",
      code: "INTERNAL_ERROR"
    });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
        code: "VALIDATION_ERROR"
      });
    }

    // 2. Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // 3. Find user (Must explicitly select password since we set select: false in model)
    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        code: "AUTH_INVALID"
      });
    }

    // 4. Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        code: "AUTH_INVALID"
      });
    }

    // 5. Generate JWT
    const token = generateToken(user._id.toString());

    // 6. Create Notification
    await Notification.create({
      userId: user._id,
      type: "system",
      title: "Login Successful",
      message: `Welcome back to WasteWise, ${user.name}!`,
    });

    // 6b. Fetch Sustainability Profile to get onboarding status
    const SustainabilityProfile = (await import("../models/SustainabilityProfile.js")).default;
    let profile = await SustainabilityProfile.findOne({ userId: user._id });
    
    // Auto-create for legacy users who login
    if (!profile) {
      profile = await SustainabilityProfile.create({
        userId: user._id,
        onboardingCompleted: false,
      });
    }

    // 7. Return safe user data
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        notifications: user.notifications ?? true,
        darkMode: user.darkMode ?? false,
        onboardingCompleted: profile.onboardingCompleted,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to login",
      code: "INTERNAL_ERROR"
    });
  }
};
