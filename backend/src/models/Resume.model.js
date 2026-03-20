import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  title:   String,
  jdText:  String,
  jdAnalysis: {
    title:           String,
    company:         String,
    domain:          String,
    seniority:       String,
    keywords:        [String],
    skills:          [String],
    responsibilities:[String],
    softSkills:      [String],
  },
  resumeJSON: mongoose.Schema.Types.Mixed,
  template: {
    type: String,
    enum: ["modern", "minimalist", "elegant"],
    default: "modern",
  },
  atsScore: {
    total:       Number,
    breakdown:   mongoose.Schema.Types.Mixed,
    missing:     [String],
    suggestions: [String],
    grade:       String,
  },
}, { timestamps: true });

export default mongoose.model("Resume", resumeSchema);