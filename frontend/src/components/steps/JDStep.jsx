import { useState } from "react";
import { useResume } from "../../context/ResumeContext";
import { analyzeJD } from "../../engines/claudeApi";
import toast from "react-hot-toast";

export default function JDStep({ onNext, onBack }) {
  const { jdText, setJdText, jdData, setJdData } = useResume();
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!jdText.trim()) {
      toast.error("Please paste a job description first");
      return;
    }
    if (jdText.trim().length < 100) {
      toast.error("Job description seems too short — paste the full JD");
      return;
    }
    setLoading(true);
    try {
      const result = await analyzeJD(jdText);
      setJdData(result);
      toast.success("JD analyzed successfully!");
    } catch (err) {
      const errorMsg = err?.message || "";
      if (errorMsg.includes("VITE_GROQ_KEY is missing")) {
        toast.error("Groq API key is missing. Check your frontend/.env file.");
      } else if (errorMsg.includes("401") || errorMsg.includes("Unauthorized")) {
        toast.error("Invalid Groq API key. Please check your VITE_GROQ_KEY.");
      } else {
        toast.error(`Failed to analyze JD: ${errorMsg}`);
      }
      console.error("JD Analysis Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Paste the full job description below. Our AI will extract keywords,
        required skills, and domain information to tailor your resume.
      </p>

      {/* JD Textarea */}
      <div>
        <label className="label">Job Description</label>
        <textarea
          value={jdText}
          onChange={e => setJdText(e.target.value)}
          rows={10}
          className="input font-mono text-xs leading-relaxed resize-none"
          placeholder="Paste the full job description here...

Example:
We are looking for a Senior Software Engineer to join our backend team.
Requirements:
- 3+ years of Node.js experience
- Strong knowledge of REST APIs and MongoDB
- Experience with AWS or cloud platforms
..."
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Minimum 100 characters
          </span>
          <span className={`text-xs ${jdText.length >= 100 ? "text-green-500" : "text-slate-400 dark:text-slate-500"}`}>
            {jdText.length} characters
          </span>
        </div>
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={loading || jdText.length < 100}
        className="btn-primary w-full"
      >
        {loading
          ? <><Spinner /> Analyzing with Claude AI...</>
          : "🔍 Analyze Job Description"
        }
      </button>

      {/* Results */}
      {jdData && (
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 animate-fade-in">

          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-lg">✓</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  {jdData.title || "Position Analyzed"}
                </span>
              </div>
              {jdData.company && (
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">@ {jdData.company}</div>
              )}
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              {jdData.domain && (
                <span className="badge bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300">{jdData.domain}</span>
              )}
              {jdData.seniority && (
                <span className="badge bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300">{jdData.seniority}</span>
              )}
            </div>
          </div>

          {/* Keywords */}
          {jdData.keywords?.length > 0 && (
            <div>
              <div className="label mb-2">Extracted Keywords ({jdData.keywords.length})</div>
              <div className="flex flex-wrap gap-1.5">
                {jdData.keywords.map((k, i) => (
                  <span key={i} className="badge bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {jdData.skills?.length > 0 && (
            <div>
              <div className="label mb-2">Required Skills ({jdData.skills.length})</div>
              <div className="flex flex-wrap gap-1.5">
                {jdData.skills.map((s, i) => (
                  <span key={i} className="badge bg-green-50 dark:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-500/30">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {jdData.summary && (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
              <div className="label mb-1">AI Summary</div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{jdData.summary}</p>
            </div>
          )}

          <button onClick={onNext} className="btn-primary w-full">
            Continue to GitHub →
          </button>
        </div>
      )}

      <button onClick={onBack} className="btn-secondary w-full">
        ← Back to Profile
      </button>
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