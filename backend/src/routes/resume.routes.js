import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import Resume from "../models/Resume.model.js";
import multer from "multer";
import { Groq } from "groq-sdk";
import { config } from "../config/index.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const loadPdfParse = async () => {
  const toParseFn = (mod) => {
    if (!mod) return null;
    if (typeof mod === "function") return mod;
    if (typeof mod.default === "function") return mod.default;
    if (typeof mod.pdf === "function") return mod.pdf;
    if (typeof mod.PDFParse === "function") {
      return async (buffer) => {
        const parser = new mod.PDFParse({ data: buffer });
        try {
          const result = await parser.getText();
          return { text: result.text };
        } finally {
          await parser.destroy();
        }
      };
    }
    return null;
  };

  try {
    const mod = await import("pdf-parse");
    const parseFn = toParseFn(mod.default ?? mod);
    if (parseFn) return parseFn;
  } catch {
    // fall through to require
  }

  const cjs = require("pdf-parse");
  const parseFn = toParseFn(cjs);
  if (parseFn) return parseFn;
  throw new Error("pdf-parse export is not compatible with this loader");
};

const normalizeExtractedResume = (data = {}) => {
  const toString = (val) => (typeof val === "string" ? val.trim() : "");
  const toArray = (val) => {
    if (Array.isArray(val)) return val.filter(Boolean);
    if (typeof val === "string") {
      return val.split(",").map((t) => t.trim()).filter(Boolean);
    }
    return [];
  };
  const mapObjArray = (val, mapFn) => (Array.isArray(val) ? val.map(mapFn).filter(Boolean) : []);

  return {
    name: toString(data.name),
    email: toString(data.email),
    phone: toString(data.phone),
    location: toString(data.location),
    title: toString(data.title),
    summary: toString(data.summary),
    github: toString(data.github),
    linkedin: toString(data.linkedin),
    leetcode: toString(data.leetcode),
    website: toString(data.website),
    skills: toArray(data.skills),
    education: mapObjArray(data.education, (e) => ({
      degree: toString(e?.degree),
      school: toString(e?.school),
      year: toString(e?.year),
      gpa: toString(e?.gpa),
    })),
    experience: mapObjArray(data.experience, (e) => ({
      role: toString(e?.role),
      company: toString(e?.company),
      period: toString(e?.period),
      description: toString(e?.description),
    })),
    achievements: toArray(data.achievements),
    projects: mapObjArray(data.projects, (p) => ({
      name: toString(p?.name),
      description: toString(p?.description),
      technologies: toArray(p?.technologies),
      url: toString(p?.url),
    })),
  };
};

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

// Initialize Groq client
const groq = new Groq({ apiKey: config.groqKey });

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

// POST /api/resumes/upload — upload and parse resume PDF
router.post("/upload", protect, upload.single("resume"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Parse PDF to extract text
    const pdfParse = await loadPdfParse();
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ error: "Could not extract text from PDF. Please ensure the PDF contains readable text." });
    }

    // Use a single AI call to extract both data and format analysis
    const prompt = `Extract structured information from this resume text and analyze its format.

Resume text:
${resumeText.substring(0, 3000)}

Return a JSON object with TWO top-level keys:
1. "data" - containing:
   - name: Full name
   - email: Email address
   - phone: Phone number
   - location: City, State/Country
   - title: Job title
  - summary: Professional summary
  - github: GitHub username or URL
  - linkedin: LinkedIn URL
  - leetcode: LeetCode username or URL
  - website: Portfolio/website URL
  - skills: Array of technical skills
   - education: Array of {degree, school, year, gpa}
   - experience: Array of {role, company, period, description}
   - achievements: Array of strings
   - projects: Array of {name, description, technologies, url}

2. "formatAnalysis" - containing:
   - sectionOrder: array of section names in order
   - layoutStyle: "single-column" | "two-column" | "sidebar-left" | "sidebar-right"
   - emphasisStyle: "minimal" | "moderate" | "heavy"
   - contentDensity: "brief" | "standard" | "detailed"
   - colorScheme: "monochrome" | "blue-accent" | "colored"

Return ONLY valid JSON. No markdown.`;

    let extractedData;
    let formatAnalysis;

    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a resume parsing assistant. Extract structured data and analyze format. Return valid JSON only." },
          { role: "user", content: prompt },
        ],
        temperature: 0.1,
        max_tokens: 4000,
      });

      const responseText = completion.choices[0].message.content.trim();
      // Remove markdown code blocks if present
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)```/) || 
                        responseText.match(/```\s*([\s\S]*?)```/) ||
                        [null, responseText];
      const jsonText = jsonMatch[1] || responseText;
      const parsed = JSON.parse(jsonText);
      
      extractedData = normalizeExtractedResume(parsed.data || parsed);
      formatAnalysis = parsed.formatAnalysis || { 
        sectionOrder: ["summary", "experience", "education", "skills"],
        layoutStyle: "single-column",
        emphasisStyle: "moderate",
        contentDensity: "standard",
        colorScheme: "monochrome"
      };
    } catch (err) {
      console.error("AI parsing error:", err);
      // For any AI error (including rate limits), return fallback data but still allow upload
      // This way users can at least get the raw text and manually fill in details
      extractedData = normalizeExtractedResume({});
      formatAnalysis = { 
        sectionOrder: ["summary", "experience", "education", "skills"],
        layoutStyle: "single-column",
        emphasisStyle: "moderate",
        contentDensity: "standard",
        colorScheme: "monochrome"
      };
      
      // Check if it's a rate limit error to add a warning message
      const isRateLimit = err.status === 429 || (err.message && err.message.includes("rate limit"));
      
      return res.json({
        success: true,
        data: extractedData,
        formatAnalysis,
        rawText: resumeText.substring(0, 1000) + "...",
        warning: isRateLimit 
          ? "AI service is busy. Raw text extracted - please fill in details manually."
          : "Could not parse resume automatically. Raw text provided - please fill in details manually.",
        isRateLimit: isRateLimit,
      });
    }

    res.json({
      success: true,
      data: extractedData,
      formatAnalysis,
      rawText: resumeText.substring(0, 500) + "...",
    });
  } catch (err) { 
    next(err); 
  }
});

export default router;