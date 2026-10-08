import { ACTION_VERBS, SOFT_SKILLS } from "../constants";

export function calcATSScore(resume, jdData) {
  if (!resume || !jdData) return null;

  const resumeText = JSON.stringify(resume).toLowerCase();
  const jdKeywords = [...(jdData.keywords || []), ...(jdData.skills || [])].map(k => k.toLowerCase());

  // 1. Keyword Match (30%)
  const matchedKeywords = jdKeywords.filter(k => resumeText.includes(k));
  const keywordScore = Math.round((matchedKeywords.length / Math.max(jdKeywords.length, 1)) * 100);

  // 2. Skill Alignment (25%)
  const resumeSkills = (resume.skills || []).map(s => s.toLowerCase());
  const matchedSkills = jdKeywords.filter(k => resumeSkills.some(s => s.includes(k) || k.includes(s)));
  const skillScore = Math.round((matchedSkills.length / Math.max(jdKeywords.length, 1)) * 100);

  // 3. Action Verbs (15%)
  const allBullets = [
    ...(resume.projects || []).flatMap(p => p.bullets || []),
    ...(resume.experience || []).flatMap(e => e.bullets || []),
  ].join(" ");
  const verbsFound = ACTION_VERBS.filter(v => allBullets.toLowerCase().includes(v.toLowerCase()));
  const verbScore = Math.min(100, verbsFound.length * 12);

  // 4. Soft Skills (10%)
  const softFound = SOFT_SKILLS.filter(s => resumeText.includes(s));
  const softScore = Math.min(100, softFound.length * 20);

  // 5. Section Completeness (10%)
  const requiredSections = ["name", "email", "skills", "projects", "education"];
  const presentSections = requiredSections.filter(s => resume[s] && (Array.isArray(resume[s]) ? resume[s].length > 0 : true));
  const sectionScore = Math.round((presentSections.length / requiredSections.length) * 100);

  // 6. Format & Length (10%)
  const bulletCount = allBullets.split("\n").filter(Boolean).length;
  const formatScore = bulletCount >= 6 && bulletCount <= 20 ? 95 : 70;

  // Weighted total
  const total = Math.round(
    keywordScore * 0.30 +
    skillScore   * 0.25 +
    verbScore    * 0.15 +
    softScore    * 0.10 +
    sectionScore * 0.10 +
    formatScore  * 0.10
  );

  // Missing keywords
  const missing = jdKeywords.filter(k => !resumeText.includes(k)).slice(0, 10);

  // Suggestions
  const suggestions = [];
  if (keywordScore < 70) suggestions.push("Add more JD keywords to your project bullets and summary");
  if (skillScore < 60) suggestions.push("Include more JD-required skills in your skills section");
  if (verbScore < 60) suggestions.push("Start every bullet point with a strong action verb");
  if (softScore < 40) suggestions.push("Mention leadership, teamwork, or collaboration in your descriptions");
  if (!resume.summary) suggestions.push("Add a professional summary with target role keywords");
  if ((resume.projects || []).length < 2) suggestions.push("Add more projects relevant to the job domain");

  return {
    total: Math.min(100, total),
    breakdown: {
      "Keyword Match":        { score: keywordScore, weight: "30%", matched: matchedKeywords.length, total: jdKeywords.length },
      "Skill Alignment":      { score: skillScore,   weight: "25%", matched: matchedSkills.length, total: jdKeywords.length },
      "Action Verbs":         { score: verbScore,    weight: "15%", found: verbsFound },
      "Soft Skills":          { score: softScore,    weight: "10%", found: softFound },
      "Section Completeness": { score: sectionScore, weight: "10%", present: presentSections },
      "Format & Length":      { score: formatScore,  weight: "10%" },
    },
    missing,
    suggestions,
    grade: total >= 85 ? "A" : total >= 70 ? "B" : total >= 55 ? "C" : "D",
  };
}