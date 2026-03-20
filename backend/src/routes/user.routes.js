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
    const allowed = ["profile"];
    const updates = {};
    allowed.forEach(key => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({ user: user.toPublic() });
  } catch (err) { next(err); }
});

export default router;