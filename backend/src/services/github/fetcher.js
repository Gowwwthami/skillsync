import { config } from "../../config/index.js";

const GH_API = "https://api.github.com";

// Build headers once — used by every fetch call
const ghHeaders = () => ({
  Accept: "application/vnd.github.v3+json",
  ...(config.githubToken && {
    Authorization: `token ${config.githubToken}`,
  }),
});

export async function fetchRepos(username) {
  const res = await fetch(
    `${GH_API}/users/${username}/repos?per_page=100&sort=updated`,
    { headers: ghHeaders() }
  );
  if (!res.ok) throw new Error(`GitHub API error: ${res.status} — check username`);
  const repos = await res.json();
  return repos.filter(r => !r.fork && !r.archived && !r.private);
}

export async function fetchReadme(username, repo) {
  try {
    const res = await fetch(
      `${GH_API}/repos/${username}/${repo}/readme`,
      { headers: { ...ghHeaders(), Accept: "application/vnd.github.v3.raw" } }
    );
    return res.ok ? (await res.text()).slice(0, 3000) : "";
  } catch { return ""; }
}

export async function fetchLanguages(username, repo) {
  try {
    const res = await fetch(
      `${GH_API}/repos/${username}/${repo}/languages`,
      { headers: ghHeaders() }
    );
    return res.ok ? Object.keys(await res.json()) : [];
  } catch { return []; }
}

export async function fetchCommitCount(username, repo) {
  try {
    const res = await fetch(
      `${GH_API}/repos/${username}/${repo}/commits?per_page=1&author=${username}`,
      { headers: ghHeaders() }
    );
    const link = res.headers.get("link") || "";
    const match = link.match(/page=(\d+)>; rel="last"/);
    return match ? parseInt(match[1]) : 1;
  } catch { return 0; }
}