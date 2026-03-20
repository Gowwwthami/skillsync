// ─────────────────────────────────────────────────────────────
// Google Gemini API — Content Improvement & Suggestions
// Model: gemini-1.5-flash (free, fast)
// What it does:
//   - Rewrites weak bullets with action verbs + metrics
//   - Suggests missing skills to add to resume
//   - Recommends additional ATS keywords
//   - Generates improved summary paragraph
// ─────────────────────────────────────────────────────────────

const GEMINI_API = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// ── Base Gemini call ───────────────────────────────────────────
async function callGemini(prompt, maxTokens = 1500) {
  const key = import.meta.env.VITE_GEMINI_KEY;
  if (!key) throw new Error("VITE_GEMINI_KEY missing from .env");

  const res = await fetch(`${GEMINI_API}?key=${key}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }],
      }],
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature:     0.7,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err?.error?.message || `Gemini error: ${res.status}`
    );
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// ── Rewrite weak bullet points ─────────────────────────────────
export async function improveBulletPoints(bullets, jobDescription) {
  const prompt = `You are an expert resume writer specializing in ATS optimization.

Rewrite these resume bullet points to be more impactful, ATS-friendly, and results-oriented.
Each rewritten bullet must:
- Start with a strong action verb
- Include a measurable metric or outcome (%, numbers, time saved, users, etc.)
- Be relevant to this job: ${jobDescription.slice(0, 500)}
- Be under 20 words

ORIGINAL BULLETS:
${bullets.map((b, i) => `${i + 1}. ${b}`).join("\n")}

Return ONLY valid JSON, no markdown:
{
  "improvedBullets": [
    {
      "original":    string,
      "improved":    string,
      "improvement": string (what was changed and why)
    }
  ]
}`;

  const raw = await callGemini(prompt, 1200);

  try {
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    throw new Error("Gemini bullet improvement failed");
  }
}

// ── Suggest missing skills ─────────────────────────────────────
export async function suggestMissingSkills(resumeText, jobDescription) {
  const prompt = `You are a career advisor helping a candidate improve their resume.

Analyze the gap between the candidate's current skills and what the job requires.

RESUME:
${resumeText.slice(0, 2000)}

JOB DESCRIPTION:
${jobDescription.slice(0, 1500)}

Return ONLY valid JSON, no markdown:
{
  "mustHaveSkills": string[] (critical missing skills that block the application),
  "niceToHaveSkills": string[] (skills that would strengthen candidacy),
  "quickWins": string[] (skills candidate likely has but didn't mention),
  "learningPath": [
    {
      "skill":       string,
      "priority":    "high|medium|low",
      "timeToLearn": string,
      "resource":    string
    }
  ],
  "overallSkillMatch": number (0-100)
}`;

  const raw = await callGemini(prompt, 1000);

  try {
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    throw new Error("Gemini skill suggestion failed");
  }
}

// ── Recommend ATS keywords ─────────────────────────────────────
export async function recommendATSKeywords(resumeText, jobDescription) {
  const prompt = `You are an ATS optimization specialist.

Identify keywords that should be added to this resume to improve ATS compatibility.
Focus on keywords that appear in the job description but not in the resume.

RESUME:
${resumeText.slice(0, 2000)}

JOB DESCRIPTION:
${jobDescription.slice(0, 1500)}

Return ONLY valid JSON, no markdown:
{
  "highPriorityKeywords": string[] (appear multiple times in JD, missing from resume),
  "mediumPriorityKeywords": string[],
  "industryTerms": string[] (standard industry terms to add),
  "whereToAdd": [
    {
      "keyword": string,
      "section": "summary|skills|projects|experience",
      "context": string (suggested sentence using this keyword)
    }
  ]
}`;

  const raw = await callGemini(prompt, 1000);

  try {
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    throw new Error("Gemini keyword recommendation failed");
  }
}

// ── Generate improved summary ──────────────────────────────────
export async function generateImprovedSummary(resumeText, jobDescription) {
  const prompt = `Write an improved professional summary for this resume.

Requirements:
- 3 sentences maximum
- Include the target job title
- Embed 3-4 keywords from the job description naturally
- Highlight the candidate's strongest relevant skills
- Start with years of experience or key qualification

CURRENT RESUME:
${resumeText.slice(0, 1500)}

TARGET JOB:
${jobDescription.slice(0, 800)}

Return ONLY valid JSON, no markdown:
{
  "improvedSummary": string,
  "keywordsEmbedded": string[],
  "reasoning": string
}`;

  const raw = await callGemini(prompt, 500);

  try {
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    throw new Error("Gemini summary generation failed");
  }
}