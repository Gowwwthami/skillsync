// frontend/src/engines/claudeApi.js
// Uses Groq (free) as primary AI
// Falls back to Claude if VITE_ANTHROPIC_KEY has credits

const GROQ_API    = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL  = "llama3-8b-8192";

import { ACTION_VERBS } from "../constants";

// ─────────────────────────────────────────────────────────────
// Base Groq call — completely free
// ─────────────────────────────────────────────────────────────
async function callGroq(systemPrompt, userPrompt, maxTokens = 1500) {
  const key = import.meta.env.VITE_GROQ_KEY;

  if (!key) {
    throw new Error(
      "VITE_GROQ_KEY is missing from frontend/.env — get a free key at console.groq.com"
    );
  }

  const res = await fetch(GROQ_API, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type":  "application/json",
    },
    body: JSON.stringify({
      model:       GROQ_MODEL,
      max_tokens:  maxTokens,
      temperature: 0.3,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userPrompt   },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err?.error?.message || `Groq API error: ${res.status}`
    );
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

// ─────────────────────────────────────────────────────────────
// JD Analyzer — powered by Groq (free)
// ─────────────────────────────────────────────────────────────
export async function analyzeJD(jdText) {
  const system = `You are a job description analyzer.
Return ONLY valid JSON. No markdown fences. No explanation. No text before or after the JSON.
If you add any text outside the JSON object, the application will break.`;

  const prompt = `Analyze this job description and return a JSON object.

JOB DESCRIPTION:
${jdText.slice(0, 3000)}

Return this exact JSON structure:
{
  "title": "job title here",
  "company": "company name or empty string",
  "domain": "one of: frontend, backend, fullstack, ml, devops, mobile, data, cloud",
  "seniority": "one of: intern, junior, mid, senior, lead, staff",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "skills": ["skill1", "skill2", "skill3"],
  "responsibilities": ["responsibility1", "responsibility2"],
  "softSkills": ["softskill1", "softskill2"],
  "summary": "2 sentence summary of the role"
}

Rules:
- keywords array: 10-15 most important technical terms from the JD
- skills array: specific technologies, tools, languages mentioned
- Return ONLY the JSON object, nothing else`;

  const raw = await callGroq(system, prompt, 1000);

  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("JD parse error, raw response:", raw);
    throw new Error("Failed to parse JD analysis — please try again");
  }
}

// ─────────────────────────────────────────────────────────────
// Resume Generator — powered by Groq (free)
// ─────────────────────────────────────────────────────────────
export async function generateResume(profile, jdData, selectedRepos) {
  const system = `You are an expert ATS resume writer.
Return ONLY valid JSON. No markdown fences. No explanation. No text outside the JSON.`;

  const repoContext = selectedRepos?.length > 0
    ? `\nGITHUB PROJECTS TO USE:\n${selectedRepos.map(r =>
        `- ${r.name}: ${r.description || ""} (${(r.languages || []).join(", ")})`
      ).join("\n")}`
    : "\nNo GitHub projects — generate 3 realistic projects based on candidate skills.";

  const prompt = `Generate an ATS-optimized resume as JSON.

CANDIDATE:
Name: ${profile.name || ""}
Email: ${profile.email || ""}
Phone: ${profile.phone || ""}
Location: ${profile.location || ""}
Title: ${profile.title || ""}
GitHub: ${profile.github || ""}
LinkedIn: ${profile.linkedin || ""}
Skills: ${(profile.skills || []).join(", ")}
Education: ${(profile.education || []).map(e => `${e.degree} from ${e.school} (${e.year})`).join("; ")}
Achievements: ${(profile.achievements || []).join("; ")}
Experience: ${(profile.experience || []).map(e => `${e.role} at ${e.company} (${e.period})`).join("; ")}
${repoContext}

TARGET JOB:
Title: ${jdData?.title || ""}
Domain: ${jdData?.domain || ""}
Required Skills: ${(jdData?.skills || []).join(", ")}
Keywords to embed: ${(jdData?.keywords || []).slice(0, 10).join(", ")}

Return this EXACT JSON (no extra fields):
{
  "name": "${profile.name || ""}",
  "title": "${jdData?.title || profile.title || ""}",
  "email": "${profile.email || ""}",
  "phone": "${profile.phone || ""}",
  "location": "${profile.location || ""}",
  "github": "${profile.github || ""}",
  "linkedin": "${profile.linkedin || ""}",
  "summary": "2-3 sentences with JD keywords embedded",
  "skills": ["skill1", "skill2", "skill3"],
  "projects": [
    {
      "name": "Project Name",
      "tech": ["tech1", "tech2"],
      "period": "Jan 2024 - Present",
      "link": "",
      "bullets": [
        "Built X using Y resulting in Z% improvement",
        "Implemented X to handle Y users",
        "Optimized X reducing latency by Y ms"
      ]
    }
  ],
  "experience": [],
  "education": ${JSON.stringify(profile.education || [])},
  "achievements": ${JSON.stringify(profile.achievements || [])}
}

STRICT RULES:
1. Every bullet MUST start with: ${ACTION_VERBS.slice(0, 10).join(", ")}
2. Every bullet MUST have a metric (%, ms, users, etc.)
3. Generate exactly 3 projects with 3 bullets each
4. Embed these keywords: ${(jdData?.keywords || []).slice(0, 8).join(", ")}
5. Skills must include: ${(jdData?.skills || []).slice(0, 6).join(", ")}
6. Return ONLY the JSON, absolutely nothing else`;

  const raw = await callGroq(system, prompt, 2000);

  let parsed;
  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    parsed = JSON.parse(cleaned);
  } catch (e) {
    console.error("Resume parse error, raw:", raw);
    throw new Error("Failed to parse generated resume — please try again");
  }

  // Always use real profile data for personal info
  return {
    ...parsed,
    name:     profile.name     || parsed.name,
    email:    profile.email    || parsed.email,
    phone:    profile.phone    || parsed.phone,
    location: profile.location || parsed.location,
    github:   profile.github   || parsed.github,
    linkedin: profile.linkedin || parsed.linkedin,
    education: profile.education?.length
      ? profile.education
      : (parsed.education || []),
    achievements: profile.achievements?.length
      ? profile.achievements
      : (parsed.achievements || []),
    skills: [
      ...new Set([
        ...(profile.skills || []),
        ...(parsed.skills  || []),
      ]),
    ].slice(0, 14),
  };
}