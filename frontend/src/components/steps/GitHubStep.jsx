import { useState } from "react";
import { useResume } from "../../context/ResumeContext";
import { API_BASE } from "../../constants";
import axios from "axios";
import toast from "react-hot-toast";

export default function GitHubStep({ onNext, onBack }) {
  const { profile, jdData, githubRepos, setGithubRepos, selectedRepos, setSelectedRepos } = useResume();
  const [username, setUsername] = useState(profile.github || "");
  const [loading, setLoading] = useState(false);

  const fetchRepos = async () => {
    if (!username.trim()) {
      toast.error("Enter a GitHub username");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE}/github/analyze`, {
        username: username.trim(),
        jdAnalysis: jdData || {},
      });
      setGithubRepos(data.repos || []);
      setSelectedRepos([]);
      toast.success(`Found ${data.repos.length} repos!`);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to fetch GitHub repos");
    } finally {
      setLoading(false);
    }
  };

  const toggleRepo = (repo) => {
    setSelectedRepos(prev => {
      const exists = prev.find(r => r.name === repo.name);
      if (exists) return prev.filter(r => r.name !== repo.name);
      if (prev.length >= 4) {
        toast.error("Max 4 projects allowed");
        return prev;
      }
      return [...prev, repo];
    });
  };

  const isSelected = (repo) => selectedRepos.some(r => r.name === repo.name);

  const scoreColor = (score) =>
    score >= 70 ? "text-green-600" : score >= 40 ? "text-yellow-600" : "text-red-500";

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-500">
        We'll fetch your GitHub repos and rank them by relevance to the job description.
        Select up to 4 projects to include in your resume.
      </p>

      {/* Username input */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="label">GitHub Username</label>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === "Enter" && fetchRepos()}
            placeholder="e.g. torvalds"
            className="input"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={fetchRepos}
            disabled={loading}
            className="btn-primary whitespace-nowrap"
          >
            {loading
              ? <><Spinner /> Fetching...</>
              : "🐙 Fetch Repos"
            }
          </button>
        </div>
      </div>

      {/* Repo list */}
      {githubRepos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700">
              Select Projects ({selectedRepos.length}/4)
            </h3>
            <span className="text-xs text-slate-400">
              Sorted by JD relevance
            </span>
          </div>

          {githubRepos.map((repo) => (
            <div
              key={repo.name}
              onClick={() => toggleRepo(repo)}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                isSelected(repo)
                  ? "border-blue-500 bg-blue-50 shadow-sm"
                  : "border-slate-200 hover:border-blue-300 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Repo name + type badge */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-800 text-sm">
                      {repo.name}
                    </span>
                    <span className="badge bg-slate-100 text-slate-500 text-xs">
                      {repo.type}
                    </span>
                    {isSelected(repo) && (
                      <span className="badge bg-blue-100 text-blue-700 text-xs">
                        ✓ Selected
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {repo.description && (
                    <p className="text-xs text-slate-500 mt-1 truncate">
                      {repo.description}
                    </p>
                  )}

                  {/* Languages */}
                  {repo.languages?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {repo.languages.slice(0, 5).map(lang => (
                        <span
                          key={lang}
                          className="badge bg-purple-50 text-purple-700 border border-purple-200 text-xs"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Scores */}
                <div className="text-right flex-shrink-0">
                  <div className={`text-lg font-black ${scoreColor(repo.relevanceScore)}`}>
                    {repo.relevanceScore}%
                  </div>
                  <div className="text-xs text-slate-400">relevance</div>
                  <div className="mt-1 text-xs text-slate-400">
                    ⭐ {repo.stars}  🔀 {repo.forks}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skip option */}
      {githubRepos.length === 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-sm text-slate-500 mb-3">
            No GitHub account? You can skip this step — AI will generate
            project examples based on your skills.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="btn-secondary flex-1">
          ← Back
        </button>
        <button
          onClick={onNext}
          className="btn-primary flex-1"
        >
          {selectedRepos.length > 0
            ? `Continue with ${selectedRepos.length} project${selectedRepos.length > 1 ? "s" : ""} →`
            : "Skip GitHub →"
          }
        </button>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}