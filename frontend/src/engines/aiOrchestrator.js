// ─────────────────────────────────────────────────────────────
// AI Orchestrator — Runs all 3 AIs in the right order
// and combines results into one unified report
// ─────────────────────────────────────────────────────────────

import { extractKeywordsFromResume, compareKeywordsWithJD } from "./huggingFace.js";
import { evaluateResumeWithGroq, analyzeBulletQuality }      from "./groqApi.js";
import {
  improveBulletPoints,
  suggestMissingSkills,
  recommendATSKeywords,
  generateImprovedSummary,
} from "./geminiApi.js";

// ── Convert resume JSON to plain text ─────────────────────────
export function resumeToText(resumeJSON) {
  if (!resumeJSON) return "";

  const parts = [];

  if (resumeJSON.name)    parts.push(resumeJSON.name);
  if (resumeJSON.title)   parts.push(resumeJSON.title);
  if (resumeJSON.summary) parts.push(resumeJSON.summary);

  if (resumeJSON.skills?.length) {
    parts.push("Skills: " + resumeJSON.skills.join(", "));
  }

  (resumeJSON.projects || []).forEach(p => {
    parts.push(p.name);
    if (p.tech?.length) parts.push(p.tech.join(", "));
    (p.bullets || []).forEach(b => parts.push(b));
  });

  (resumeJSON.experience || []).forEach(e => {
    parts.push(`${e.role} at ${e.company}`);
    (e.bullets || []).forEach(b => parts.push(b));
  });

  (resumeJSON.education || []).forEach(e => {
    parts.push(`${e.degree} ${e.school} ${e.year}`);
  });

  (resumeJSON.achievements || []).forEach(a => parts.push(a));

  return parts.join("\n");
}

// ── Get all bullets from resume ────────────────────────────────
function getAllBullets(resumeJSON) {
  return [
    ...(resumeJSON.projects   || []).flatMap(p => p.bullets || []),
    ...(resumeJSON.experience || []).flatMap(e => e.bullets || []),
  ];
}

// ── MAIN: Run full AI analysis pipeline ───────────────────────
export async function runFullAIAnalysis(resumeJSON, jobDescriptionText, onProgress) {

  const resumeText = resumeToText(resumeJSON);
  const bullets    = getAllBullets(resumeJSON);
  const report     = {};

  // ── Stage 1: Hugging Face (keyword extraction) ─────────────
  onProgress?.("🔍 Extracting keywords with Hugging Face...", 10);
  try {
    report.hfAnalysis = await extractKeywordsFromResume(resumeText);

    // Compare resume keywords against JD keywords
    const jdWords = jobDescriptionText
      .toLowerCase()
      .split(/\W+/)
      .filter(w => w.length > 3);

    report.keywordComparison = compareKeywordsWithJD(
      report.hfAnalysis.allKeywords,
      jdWords
    );
  } catch (err) {
    console.warn("HF failed, continuing:", err.message);
    report.hfAnalysis        = { error: err.message };
    report.keywordComparison = { matchScore: 0, missing: [], matched: [] };
  }

  // ── Stage 2: Groq (evaluation & gap analysis) ──────────────
  onProgress?.("⚡ Evaluating resume quality with Groq...", 40);
  try {
    report.groqEvaluation = await evaluateResumeWithGroq(
      resumeText,
      jobDescriptionText
    );
  } catch (err) {
    console.warn("Groq failed, continuing:", err.message);
    report.groqEvaluation = { error: err.message, overallScore: 0 };
  }

  // Analyze bullet quality separately
  if (bullets.length > 0) {
    try {
      report.bulletAnalysis = await analyzeBulletQuality(bullets);
    } catch (err) {
      console.warn("Groq bullets failed:", err.message);
      report.bulletAnalysis = { error: err.message };
    }
  }

  // ── Stage 3: Gemini (suggestions & improvements) ───────────
  onProgress?.("✨ Generating improvements with Gemini...", 70);
  try {
    // Run Gemini calls in parallel for speed
    const [improved, skills, keywords, summary] = await Promise.allSettled([
      improveBulletPoints(bullets.slice(0, 6), jobDescriptionText),
      suggestMissingSkills(resumeText, jobDescriptionText),
      recommendATSKeywords(resumeText, jobDescriptionText),
      generateImprovedSummary(resumeText, jobDescriptionText),
    ]);

    report.improvedBullets   = improved.status  === "fulfilled" ? improved.value  : null;
    report.skillSuggestions  = skills.status    === "fulfilled" ? skills.value    : null;
    report.keywordSuggestions= keywords.status  === "fulfilled" ? keywords.value  : null;
    report.improvedSummary   = summary.status   === "fulfilled" ? summary.value   : null;
  } catch (err) {
    console.warn("Gemini failed:", err.message);
  }

  // ── Stage 4: Calculate unified final score ─────────────────
  onProgress?.("📊 Calculating final ATS score...", 90);
  report.finalScore = calcUnifiedScore(report);

  onProgress?.("✅ Analysis complete!", 100);
  return report;
}

// ── Unified score from all 3 AIs ──────────────────────────────
function calcUnifiedScore(report) {
  const scores = [];

  // Groq score (most reliable — 50% weight)
  if (report.groqEvaluation?.overallScore) {
    scores.push({ value: report.groqEvaluation.overallScore, weight: 0.50 });
  }

  // HF keyword match (30% weight)
  if (report.keywordComparison?.matchScore !== undefined) {
    scores.push({ value: report.keywordComparison.matchScore, weight: 0.30 });
  }

  // Bullet quality from Groq (20% weight)
  if (report.bulletAnalysis?.averageScore) {
    scores.push({ value: report.bulletAnalysis.averageScore, weight: 0.20 });
  }

  if (scores.length === 0) return { total: 0, grade: "N/A" };

  // Normalize weights
  const totalWeight = scores.reduce((sum, s) => sum + s.weight, 0);
  const total = Math.round(
    scores.reduce((sum, s) => sum + (s.value * s.weight), 0) / totalWeight
  );

  return {
    total,
    grade:        total >= 85 ? "A" : total >= 70 ? "B" : total >= 55 ? "C" : "D",
    groqScore:    report.groqEvaluation?.overallScore    || 0,
    keywordScore: report.keywordComparison?.matchScore   || 0,
    bulletScore:  report.bulletAnalysis?.averageScore    || 0,
  };
}