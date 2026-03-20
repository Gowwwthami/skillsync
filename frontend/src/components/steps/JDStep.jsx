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
      toast.error("Failed to analyze JD. Check your Anthropic API key.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-500">
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
          <span className="text-xs text-slate-400">
            Minimum 100 characters
          </span>
          <span className={`text-xs ${jdText.length >= 100 ? "text-green-500" : "text-slate-400"}`}>
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
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 animate-fade-in">

          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-lg">✓</span>
                <span className="font-bold text-slate-800">
                  {jdData.title || "Position Analyzed"}
                </span>
              </div>
              {jdData.company && (
                <div className="text-sm text-slate-500 mt-0.5">@ {jdData.company}</div>
              )}
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              {jdData.domain && (
                <span className="badge bg-blue-100 text-blue-700">{jdData.domain}</span>
              )}
              {jdData.seniority && (
                <span className="badge bg-purple-100 text-purple-700">{jdData.seniority}</span>
              )}
            </div>
          </div>

          {/* Keywords */}
          {jdData.keywords?.length > 0 && (
            <div>
              <div className="label mb-2">Extracted Keywords ({jdData.keywords.length})</div>
              <div className="flex flex-wrap gap-1.5">
                {jdData.keywords.map((k, i) => (
                  <span key={i} className="badge bg-blue-50 text-blue-700 border border-blue-200">
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
                  <span key={i} className="badge bg-green-50 text-green-700 border border-green-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {jdData.summary && (
            <div className="bg-white rounded-lg p-3 border border-slate-200">
              <div className="label mb-1">AI Summary</div>
              <p className="text-sm text-slate-600">{jdData.summary}</p>
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