

// ── App Branding ──────────────────────────────────────────────
export const APP_NAME         = "SkillSync";
export const APP_TAGLINE      = "Match your skills. Land your role.";
export const APP_DESCRIPTION  = "AI-powered resume builder tailored to any job description";

// ── API URLs ──────────────────────────────────────────────────
export const API_BASE         = import.meta.env.VITE_API_URL || "/api";
export const CLAUDE_API_URL   = "https://api.anthropic.com/v1/messages";
export const CLAUDE_API_VERSION = "2023-06-01";

// ── Claude Config ─────────────────────────────────────────────
export const CLAUDE_MODEL      = "claude-sonnet-4-20250514";
export const CLAUDE_MAX_TOKENS = 1500;

// ── Resume Templates ──────────────────────────────────────────
export const TEMPLATES = {
  atsClassic: {
    id: "atsClassic",
    name: "ATS Classic",
    description: "Single-column, no colors, crisp hierarchy for ATS",
    accent: "#111827",
    recommended: true,
    atsSafe: true,
  },
  modern: {
    id: "modern",
    name: "Modern",
    description: "Two-column, bold headings, modern layout",
    accent: "#2563eb",
    recommended: false,
    atsSafe: true,
  },
  minimalist: {
    id: "minimalist",
    name: "Minimalist ATS",
    description: "Ultra-clean, single-column, maximum ATS compatibility",
    accent: "#111827",
    recommended: true,
    atsSafe: true,
  },
  elegant: {
    id: "elegant",
    name: "Elegant Professional",
    description: "Refined typography, classic layout",
    accent: "#7c3aed",
    recommended: false,
    atsSafe: true,
  },
};

// ── ATS Scoring Weights ───────────────────────────────────────
export const ATS_WEIGHTS = {
  keywordMatch : 0.30,
  skillAlign   : 0.25,
  actionVerbs  : 0.15,
  softSkills   : 0.10,
  sections     : 0.10,
  format       : 0.10,
};

// ── Action Verbs ──────────────────────────────────────────────
export const ACTION_VERBS = [
  "Architected","Built","Designed","Developed","Engineered",
  "Implemented","Optimized","Deployed","Automated","Integrated",
  "Led","Scaled","Reduced","Improved","Delivered","Launched",
  "Migrated","Refactored","Streamlined","Accelerated","Created",
  "Established","Spearheaded","Increased","Managed","Mentored",
  "Collaborated","Analyzed","Coordinated","Resolved","Transformed",
];

// ── Soft Skills ───────────────────────────────────────────────
export const SOFT_SKILLS = [
  "collaboration","communication","leadership","problem-solving",
  "agile","scrum","teamwork","mentoring","adaptability","initiative",
  "cross-functional","stakeholder","ownership","proactive",
];

// ── Job Domains ───────────────────────────────────────────────
export const DOMAINS = [
  "Frontend","Backend","Full Stack","DevOps",
  "Machine Learning","Data Science","Mobile","Cloud",
];

// ── Wizard Steps ──────────────────────────────────────────────
export const STEPS = [
  { id: "profile",  label: "Profile",          icon: "👤" },
  { id: "jd",       label: "Job Description",  icon: "📋" },
  { id: "github",   label: "GitHub",           icon: "🐙" },
  { id: "generate", label: "Generate",         icon: "✨" },
  { id: "template", label: "Template",         icon: "🎨" },
  { id: "preview",  label: "Preview & Export", icon: "📤" },
];