import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// POST /api/jd/analyze
// Note: actual JD analysis is done client-side via Claude
// This route saves the analysis to the user's session if needed
router.post("/analyze", protect, async (req, res, next) => {
  try {
    const { jdText, analysis } = req.body;
    if (!jdText) return res.status(400).json({ error: "JD text required" });
    res.json({ analysis });
  } catch (err) { next(err); }
});

export default router;