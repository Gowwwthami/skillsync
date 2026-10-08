import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { analyzeGitHubProfile } from "../services/github/analyzer.js";
import { fetchRepos, fetchReadme } from "../services/github/fetcher.js";
import { config } from "../config/index.js";
import { Groq } from "groq-sdk";

const router = Router();
const groq = new Groq({ apiKey: config.groqKey });

// POST /api/github/analyze
router.post("/analyze", protect, async (req, res, next) => {
  try {
    const { username, jdAnalysis } = req.body;
    if (!username) return res.status(400).json({ error: "GitHub username required" });

    const repos = await analyzeGitHubProfile(username, jdAnalysis || {});
    res.json({ repos });
  } catch (err) { next(err); }
});

// POST /api/github/projects — fetch and analyze repos for resume projects section
router.post("/projects", protect, async (req, res, next) => {
  try {
    const { username, jdKeywords = [] } = req.body;
    if (!username) return res.status(400).json({ error: "GitHub username required" });

    // Fetch repos
    const repos = await fetchRepos(username);
    
    // Get detailed info for top repos (most starred, recently updated)
    const topRepos = repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 10);

    const projects = await Promise.allSettled(
      topRepos.map(async (repo) => {
        const readme = await fetchReadme(username, repo.name);
        
        return {
          name: repo.name,
          description: repo.description || "",
          url: repo.html_url,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language || "",
          topics: repo.topics || [],
          readme: readme.slice(0, 2000),
          updatedAt: repo.updated_at,
        };
      })
    );

    const validProjects = projects
      .filter(p => p.status === "fulfilled")
      .map(p => p.value);

    // Use AI to select and describe best projects based on JD keywords
    const prompt = `You are a resume expert. Given these GitHub projects and job description keywords, select the 3-5 BEST projects that would impress a recruiter for this role.

Job Description Keywords: ${jdKeywords.join(", ") || "software engineering, full-stack, web development"}

GitHub Projects:
${JSON.stringify(validProjects, null, 2)}

Return a JSON array with 3-5 projects formatted for a resume:
[
  {
    "name": "Project Name",
    "description": "One compelling sentence describing what the project does",
    "technologies": ["Tech1", "Tech2", "Tech3"],
    "highlights": ["Key achievement or feature", "Another highlight with metrics if possible"],
    "url": "GitHub URL"
  }
]

Guidelines:
- Select projects that best match the job description keywords
- Prioritize projects with more stars/forks
- Write compelling descriptions that show impact
- Include specific technologies used
- Add quantifiable highlights where possible
- Return ONLY valid JSON, no markdown or explanation.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a resume writing expert. Format GitHub projects professionally for resumes." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    let selectedProjects;
    try {
      const responseText = completion.choices[0].message.content.trim();
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)```/) || 
                        responseText.match(/```\s*([\s\S]*?)```/) ||
                        [null, responseText];
      const jsonText = jsonMatch[1] || responseText;
      selectedProjects = JSON.parse(jsonText);
    } catch (parseErr) {
      console.error("Failed to parse AI response:", parseErr);
      // Fallback: return top 3 projects with basic formatting
      selectedProjects = validProjects.slice(0, 3).map(p => ({
        name: p.name,
        description: p.description || `A ${p.language} project with ${p.stars} stars`,
        technologies: [p.language, ...p.topics].filter(Boolean).slice(0, 5),
        highlights: [`${p.stars} stars on GitHub`, p.forks > 0 ? `${p.forks} forks` : null].filter(Boolean),
        url: p.url,
      }));
    }

    res.json({
      success: true,
      projects: selectedProjects,
      totalRepos: repos.length,
    });
  } catch (err) { 
    console.error("GitHub projects error:", err);
    // Check if it's a rate limit error
    if (err.status === 429 || (err.message && err.message.includes("rate limit"))) {
      return res.status(429).json({ 
        error: "AI service is busy. Please wait a moment and try again.",
        retryAfter: 30
      });
    }
    next(err); 
  }
});

export default router;