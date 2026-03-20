import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import Resume from "../models/Resume.model.js";

const router = Router();

// GET /api/resumes — get all resumes for logged in user
router.get("/", protect, async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .sort("-createdAt")
      .limit(20);
    res.json({ resumes });
  } catch (err) { next(err); }
});

// POST /api/resumes — save a new resume
router.post("/", protect, async (req, res, next) => {
  try {
    const { jdText, jdAnalysis, resumeJSON, template, atsScore } = req.body;

    const resume = await Resume.create({
      userId: req.user._id,
      jdText,
      jdAnalysis,
      resumeJSON,
      template,
      atsScore,
      title: `${resumeJSON?.name || "Resume"} — ${jdAnalysis?.title || "Job"}`,
    });

    res.status(201).json({ resume });
  } catch (err) { next(err); }
});

// GET /api/resumes/:id — get single resume
router.get("/:id", protect, async (req, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!resume) return res.status(404).json({ error: "Resume not found" });
    res.json({ resume });
  } catch (err) { next(err); }
});

// PUT /api/resumes/:id — update resume
router.put("/:id", protect, async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: req.body },
      { new: true }
    );
    if (!resume) return res.status(404).json({ error: "Resume not found" });
    res.json({ resume });
  } catch (err) { next(err); }
});

// DELETE /api/resumes/:id — delete resume
router.delete("/:id", protect, async (req, res, next) => {
  try {
    await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    res.json({ message: "Deleted successfully" });
  } catch (err) { next(err); }
});

export default router;