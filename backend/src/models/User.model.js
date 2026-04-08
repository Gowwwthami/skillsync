import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const educationSchema = new mongoose.Schema({
  degree: String,
  school: String,
  year: String,
  gpa: String,
});

const experienceSchema = new mongoose.Schema({
  role: String,
  company: String,
  period: String,
  description: String,
  bullets: [String],
});

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  technologies: [String],
  highlights: [String],
  url: String,
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  passwordHash: { type: String, required: function() { return !this.googleId; } },
  googleId: { type: String, sparse: true, index: true },
  resetOTP: { type: String },
  resetOTPExpires: { type: Date },
  profile: {
    title:    String,
    phone:    String,
    location: String,
    summary:  String,
    github:   String,
    linkedin: String,
    leetcode: String,
    skills:      [String],
    education:   [educationSchema],
    achievements:[String],
    experience:  [experienceSchema],
    projects:    [projectSchema],
  },
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

// Compare plain password with hash
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

// Remove sensitive fields before sending to client
userSchema.methods.toPublic = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

export default mongoose.model("User", userSchema);