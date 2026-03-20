import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { analyzeGitHubProfile } from "../services/github/analyzer.js";

const router = Router();

// POST /api/github/analyze
router.post("/analyze", protect, async (req, res, next) => {
  try {
    const { username, jdAnalysis } = req.body;
    if (!username) return res.status(400).json({ error: "GitHub username required" });

    const repos = await analyzeGitHubProfile(username, jdAnalysis || {});
    res.json({ repos });
  } catch (err) { next(err); }
});

export default router;