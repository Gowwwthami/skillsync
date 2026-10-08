// ─────────────────────────────────────────────────────────────
// Groq API — Resume Evaluation & Gap Analysis
// Model: llama3-8b-8192 (fast, free, accurate)
// What it does:
//   - Scores resume vs job description (0-100)
//   - Identifies exact gaps between resume and JD
//   - Generates structured improvement feedback
// ─────────────────────────────────────────────────────────────

const GROQ_API   = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama3-8b-8192";

// ── Base Groq call ─────────────────────────────────────────────
async function callGroq(systemPrompt, userPrompt, maxTokens = 1500) {
  const key = import.meta.env.VITE_GROQ_KEY;
  if (!key) throw new Error("VITE_GROQ_KEY missing from .env");

  const res = await fetch(GROQ_API, {
    method:  "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type":  "application/json",
    },
    body: JSON.stringify({
      model:       GROQ_MODEL,
      max_tokens:  maxTokens,
      temperature: 0.3,      // lower = more consistent output
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userPrompt   },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq error: ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

// ── Main evaluation function ───────────────────────────────────
export async function evaluateResumeWithGroq(resumeText, jobDescription) {
  const system = `You are a senior ATS resume evaluator and career coach.
You analyze resumes against job descriptions and provide structured, actionable feedback.
Always return ONLY valid JSON. No markdown. No explanation outside JSON.`;

  const prompt = `Evaluate this resume against the job description.

RESUME:
${resumeText.slice(0, 3000)}

JOB DESCRIPTION:
${jobDescription.slice(0, 2000)}

Return this exact JSON:
{
  "overallScore": number (0-100),
  "breakdown": {
    "relevance":     number (0-100),
    "keywords":      number (0-100),
    "experience":    number (0-100),
    "presentation":  number (0-100),
    "impact":        number (0-100)
  },
  "strengths": string[] (top 3 things done well),
  "criticalGaps": string[] (must-fix issues),
  "missingKeywords": string[] (important JD keywords not in resume),
  "missingSkills": string[] (skills JD needs but resume lacks),
  "experienceGaps": string[] (experience requirements not met),
  "summaryFeedback": string (2-3 sentence overall assessment),
  "priorityActions": [
    {
      "priority": "high|medium|low",
      "action": string,
      "reason": string
    }
  ]
}`;

  const raw = await callGroq(system, prompt, 1500);

  try {
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    throw new Error("Groq returned invalid JSON — try again");
  }
}

// ── Bullet point quality analyzer ─────────────────────────────
export async function analyzeBulletQuality(bullets) {
  const system = `You are an ATS resume expert. Analyze bullet point quality.
Return ONLY valid JSON. No markdown.`;

  const prompt = `Analyze these resume bullet points for ATS compatibility and impact.

BULLETS:
${bullets.map((b, i) => `${i + 1}. ${b}`).join("\n")}

Return this exact JSON:
{
  "bulletAnalysis": [
    {
      "original":    string,
      "score":       number (0-100),
      "issues":      string[],
      "hasMetric":   boolean,
      "hasVerb":     boolean,
      "suggestion":  string
    }
  ],
  "averageScore":    number,
  "bulletsWithNoMetrics": number,
  "bulletsWithNoVerbs":   number
}`;

  const raw = await callGroq(system, prompt, 1000);

  try {
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    throw new Error("Groq bullet analysis failed");
  }
}

// ── Seniority match checker ────────────────────────────────────
export async function checkSeniorityMatch(resumeText, jdText) {
  const system = `You are an HR specialist. Assess seniority alignment.
Return ONLY valid JSON. No markdown.`;

  const prompt = `Does this candidate's experience level match the job requirements?

RESUME SUMMARY: ${resumeText.slice(0, 1000)}
JOB DESCRIPTION: ${jdText.slice(0, 800)}

Return this exact JSON:
{
  "resumeSeniority":   "intern|junior|mid|senior|lead|staff",
  "jdSeniority":       "intern|junior|mid|senior|lead|staff",
  "isMatch":           boolean,
  "yearsDifference":   number,
  "recommendation":    string
}`;

  const raw = await callGroq(system, prompt, 400);

  try {
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    return { isMatch: true, recommendation: "Unable to assess seniority" };
  }
}