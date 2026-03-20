import { fetchRepos, fetchReadme, fetchLanguages, fetchCommitCount } from "./fetcher.js";

function detectProjectType(repo, langs, readme) {
  const text = `${repo.name} ${repo.description || ""} ${readme}`.toLowerCase();
  if (text.includes("machine learning") || text.includes("neural") || langs.includes("Jupyter Notebook")) return "ml";
  if (text.includes("react") || text.includes("next.js") || text.includes("vue")) return "webapp";
  if (text.includes("api") || text.includes("server") || text.includes("backend")) return "backend";
  if (text.includes("docker") || text.includes("kubernetes") || text.includes("terraform")) return "devops";
  if (langs.includes("JavaScript") || langs.includes("TypeScript")) return "frontend";
  return "general";
}

function calcRecencyScore(updatedAt) {
  const days = (Date.now() - new Date(updatedAt)) / 86400000;
  return Math.max(0, Math.round(100 - days * 0.4));
}

function calcContributionScore(repo, commitCount) {
  return Math.min(100,
    repo.stargazers_count * 8 +
    repo.forks_count * 5 +
    Math.min(commitCount * 0.5, 40) +
    (repo.size > 1000 ? 15 : 0)
  );
}

function calcRelevanceScore(project, jdAnalysis) {
  const { keywords = [], skills = [] } = jdAnalysis;
  const text = `${project.name} ${project.description} ${project.readme} ${project.languages.join(" ")}`.toLowerCase();
  const allTerms = [...keywords, ...skills].map(k => k.toLowerCase());

  const matched = allTerms.filter(k => text.includes(k)).length;
  const keywordScore = (matched / Math.max(allTerms.length, 1)) * 100;

  const langMatches = project.languages.filter(l =>
    skills.some(s => l.toLowerCase().includes(s.toLowerCase()))
  ).length;
  const techScore = Math.min(100, langMatches * 30 + 20);

  return Math.round(
    keywordScore          * 0.40 +
    techScore             * 0.30 +
    project.recencyScore  * 0.20 +
    project.contributionScore * 0.10
  );
}

export async function analyzeGitHubProfile(username, jdAnalysis) {
  const repos = await fetchRepos(username);

  const results = await Promise.allSettled(
    repos.slice(0, 20).map(async repo => {
      const [readme, languages, commitCount] = await Promise.all([
        fetchReadme(username, repo.name),
        fetchLanguages(username, repo.name),
        fetchCommitCount(username, repo.name),
      ]);

      const recencyScore      = calcRecencyScore(repo.updated_at);
      const contributionScore = calcContributionScore(repo, commitCount);

      return {
        name:        repo.name,
        description: repo.description || "",
        readme:      readme.slice(0, 500),
        languages,
        stars:       repo.stargazers_count,
        forks:       repo.forks_count,
        commitCount,
        updatedAt:   repo.updated_at,
        url:         repo.html_url,
        type:        detectProjectType(repo, languages, readme),
        recencyScore,
        contributionScore,
      };
    })
  );

  return results
    .filter(r => r.status === "fulfilled")
    .map(r => r.value)
    .map(repo => ({ ...repo, relevanceScore: calcRelevanceScore(repo, jdAnalysis) }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 6);
}