import { Router } from "express";
import { 
  register, 
  login, 
  getMe, 
  forgotPassword, 
  verifyOTP, 
  resetPassword,
  googleAuthCallback 
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

// Google OAuth route
router.post("/google", googleAuthCallback);

export default router;