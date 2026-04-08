import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import User from "../models/User.model.js";

const router = Router();

// GET /api/users/profile
router.get("/profile", protect, async (req, res, next) => {
  try {
    res.json({ user: req.user.toPublic() });
  } catch (err) { next(err); }
});

// PUT /api/users/profile
router.put("/profile", protect, async (req, res, next) => {
  try {
    const allowedProfileFields = [
      "title", "phone", "location", "summary", "github",
      "linkedin", "leetcode", "skills", "education", "achievements", "experience",
      "projects"
    ];
    
    const updates = {};
    allowedProfileFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[`profile.${field}`] = req.body[field];
      }
    });

    // Also allow updating name
    if (req.body.name) updates.name = req.body.name;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({ user: user.toPublic() });
  } catch (err) { next(err); }
});

export default router;