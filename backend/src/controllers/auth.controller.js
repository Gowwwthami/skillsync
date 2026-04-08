import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { config } from "../config/index.js";
import { generateOTP, sendPasswordResetOTP, sendWelcomeEmail } from "../utils/email.js";

const signToken = (id) =>
  jwt.sign({ id }, config.jwtSecret, { expiresIn: config.jwtExpiry });

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "Name, email and password are required" });

    if (password.length < 8)
      return res.status(400).json({ error: "Password must be at least 8 characters" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ error: "Email is already registered" });

    const user = await User.create({ name, email, passwordHash: password });
    const token = signToken(user._id);

    res.status(201).json({ token, user: user.toPublic() });
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: "Invalid email or password" });

    const token = signToken(user._id);
    res.json({ token, user: user.toPublic() });
  } catch (err) { next(err); }
};

export const getMe = async (req, res) => {
  res.json({ user: req.user.toPublic() });
};

// Forgot Password - Send OTP
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ error: "No account found with this email" });

    // Check if user signed up with Google
    if (user.googleId && !user.passwordHash)
      return res.status(400).json({ error: "This account uses Google Sign-In. Please use Google to sign in." });

    // Generate OTP
    const otp = generateOTP();
    
    // Save OTP to user with 10-minute expiry
    user.resetOTP = otp;
    user.resetOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Send OTP email
    await sendPasswordResetOTP(email, otp, user.name);

    res.json({ message: "OTP sent to your email" });
  } catch (err) { next(err); }
};

// Verify OTP
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp)
      return res.status(400).json({ error: "Email and OTP are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ error: "User not found" });

    if (user.resetOTP !== otp)
      return res.status(400).json({ error: "Invalid OTP" });

    if (user.resetOTPExpires < new Date())
      return res.status(400).json({ error: "OTP has expired. Please request a new one." });

    res.json({ message: "OTP verified successfully" });
  } catch (err) { next(err); }
};

// Reset Password
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword)
      return res.status(400).json({ error: "Email, OTP, and new password are required" });

    if (newPassword.length < 8)
      return res.status(400).json({ error: "Password must be at least 8 characters" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ error: "User not found" });

    if (user.resetOTP !== otp)
      return res.status(400).json({ error: "Invalid OTP" });

    if (user.resetOTPExpires < new Date())
      return res.status(400).json({ error: "OTP has expired. Please request a new one." });

    // Update password and clear OTP
    user.passwordHash = newPassword;
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;
    await user.save();

    // Generate new token
    const token = signToken(user._id);

    res.json({ 
      message: "Password reset successfully",
      token,
      user: user.toPublic()
    });
  } catch (err) { next(err); }
};

// Google OAuth callback handler
export const googleAuthCallback = async (req, res, next) => {
  try {
    const { email, name, googleId } = req.body;

    if (!email || !googleId)
      return res.status(400).json({ error: "Email and Google ID are required" });

    let user = await User.findOne({ email });
    let isNewUser = false;

    if (user) {
      // Existing user - link Google ID if not already linked
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        passwordHash: undefined, // No password for Google users
      });
      isNewUser = true;
      
      // Send welcome email
      try {
        await sendWelcomeEmail(email, name);
      } catch (emailErr) {
        console.error("Failed to send welcome email:", emailErr);
      }
    }

    const token = signToken(user._id);

    res.json({
      token,
      user: user.toPublic(),
      isNewUser,
    });
  } catch (err) { next(err); }
};