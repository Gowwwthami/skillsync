import { useState } from "react";
import axios from "axios";
import { API_BASE } from "../constants";
import toast from "react-hot-toast";

export default function GitHubProjectsFetcher({ username, jdKeywords = [], onProjectsFetched, className = "" }) {
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchProjects = async () => {
    if (!username) {
      toast.error("Please enter your GitHub username first");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Fetching your best GitHub projects...");

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${API_BASE}/github/projects`,
        { username, jdKeywords },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success && data.projects?.length > 0) {
        onProjectsFetched(data.projects);
        setFetched(true);
        toast.success(`Found ${data.projects.length} great projects from your ${data.totalRepos} repos!`, { id: toastId });
      } else {
        toast.error("No suitable projects found. Try adding more details to your GitHub repos.", { id: toastId });
      }
    } catch (err) {
      console.error("GitHub fetch error:", err);
      let errorMsg = "Failed to fetch GitHub projects";
      if (err?.response?.status === 429) {
        errorMsg = err?.response?.data?.error || "AI service is busy. Please wait 30 seconds and try again.";
      } else {
        errorMsg = err?.response?.data?.error || "Failed to fetch GitHub projects";
      }
      toast.error(errorMsg, { id: toastId, duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <button
        onClick={fetchProjects}
        disabled={loading || !username}
        className={`
          w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all
          ${fetched 
            ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-500/30" 
            : "bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-700 dark:hover:bg-slate-600"
          }
          ${loading || !username ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Analyzing your repos...
          </>
        ) : fetched ? (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Projects Added!
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            Fetch Best Projects from GitHub
          </>
        )}
      </button>
      
      {!username && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
          Enter your GitHub username in the Contact Information section above
        </p>
      )}
      
      {jdKeywords.length > 0 && (
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 text-center">
          Will match projects to: {jdKeywords.slice(0, 5).join(", ")}{jdKeywords.length > 5 ? "..." : ""}
        </p>
      )}
    </div>
  );
}
