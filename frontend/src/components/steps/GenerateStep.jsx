import { useState } from "react";
import { useResume } from "../../context/ResumeContext";
import { generateResume } from "../../engines/claudeApi";
import { calcATSScore } from "../../engines/atsScorer";
import toast from "react-hot-toast";

const PROGRESS_STEPS = [
  "Reading your profile...",
  "Analyzing job requirements...",
  "Matching GitHub projects...",
  "Writing ATS-optimized bullets...",
  "Embedding keywords...",
  "Finalizing resume...",
];

export default function GenerateStep({ onNext, onBack }) {
  const {
    profile, jdData, selectedRepos,
    resume, setResume,
    setAtsScore,
  } = useResume();

  const [loading, setLoading] = useState(false);
  const [progressIdx, setProgressIdx] = useState(0);

  const handleGenerate = async () => {
    setLoading(true);
    setProgressIdx(0);

    // Animate progress messages
    const interval = setInterval(() => {
      setProgressIdx(prev => {
        if (prev >= PROGRESS_STEPS.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 900);

    try {
      const result = await generateResume(profile, jdData, selectedRepos);
      setResume(result);

      // Calculate ATS score immediately
      const score = calcATSScore(result, jdData);
      setAtsScore(score);

      clearInterval(interval);
      toast.success("Resume generated successfully! 🎉");
      onNext();
    } catch (err) {
      clearInterval(interval);
      toast.error("Generation failed. Check your Anthropic API key.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Summary of what will be generated */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-700 mb-3">
          Resume Generation Summary
        </h3>

        {[
          {
            icon: "👤",
            label: "Candidate",
            value: profile.name || "—",
          },
          {
            icon: "🎯",
            label: "Target Role",
            value: jdData?.title || "—",
          },
          {
            icon: "🏢",
            label: "Domain",
            value: jdData?.domain || "—",
          },
          {
            icon: "🔑",
            label: "Keywords Found",
            value: `${(jdData?.keywords || []).length} extracted`,
          },
          {
            icon: "🐙",
            label: "Projects Selected",
            value: selectedRepos.length > 0
              ? `${selectedRepos.length} GitHub projects`
              : "AI will generate examples",
          },
          {
            icon: "🛠️",
            label: "Your Skills",
            value: `${(profile.skills || []).length} listed`,
          },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="text-base w-6 text-center">{item.icon}</span>
            <span className="text-sm text-slate-500 w-36">{item.label}</span>
            <span className="text-sm font-semibold text-slate-800">{item.value}</span>
          </div>
        ))}
      </div>

      {/* What Claude will do */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">
          What Claude AI will do
        </h3>
        <ul className="space-y-1.5">
          {[
            "Write ATS-optimized project bullets with metrics",
            "Embed JD keywords naturally into your content",
            "Tailor your skills section to match requirements",
            "Generate a professional summary for the target role",
            "Start every bullet with a strong action verb",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-blue-700">
              <span className="text-blue-400 mt-0.5">→</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Progress indicator */}
      {loading && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 text-center animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm font-semibold text-slate-700 mb-1">
            {PROGRESS_STEPS[progressIdx]}
          </p>
          <p className="text-xs text-slate-400">
            This takes about 15–20 seconds
          </p>
          <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-700"
              style={{ width: `${((progressIdx + 1) / PROGRESS_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Already generated notice */}
      {resume && !loading && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-green-500 text-xl">✓</span>
          <div>
            <p className="text-sm font-semibold text-green-800">Resume already generated</p>
            <p className="text-xs text-green-600">Click Continue or regenerate below</p>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary flex-1" disabled={loading}>
          ← Back
        </button>

        {resume && !loading ? (
          <button onClick={onNext} className="btn-primary flex-1">
            Continue →
          </button>
        ) : (
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn-primary flex-1"
          >
            {loading
              ? <><Spinner /> Generating...</>
              : "✨ Generate My Resume"
            }
          </button>
        )}
      </div>

      {/* Regenerate option */}
      {resume && !loading && (
        <button
          onClick={handleGenerate}
          className="w-full text-xs text-slate-400 hover:text-slate-600 transition-colors py-1"
        >
          🔄 Regenerate resume
        </button>
      )}
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