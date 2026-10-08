import { useState } from "react";
import { useResume } from "../../context/ResumeContext";
import { runFullAIAnalysis, resumeToText } from "../../engines/aiOrchestrator";
import toast from "react-hot-toast";

export default function AIAnalysisStep({ onBack, onNext }) {
  const { resume, jdText } = useResume();
  const [loading,    setLoading]    = useState(false);
  const [progress,   setProgress]   = useState("");
  const [pct,        setPct]        = useState(0);
  const [report,     setReport]     = useState(null);
  const [activeTab,  setActiveTab]  = useState("score");

  const runAnalysis = async () => {
    setLoading(true);
    setReport(null);
    try {
      const result = await runFullAIAnalysis(
        resume,
        jdText,
        (msg, percent) => { setProgress(msg); setPct(percent); }
      );
      setReport(result);
      toast.success("AI analysis complete!");
    } catch (err) {
      toast.error("Analysis failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = s =>
    s >= 80 ? "text-green-600" : s >= 60 ? "text-yellow-600" : "text-red-500";

  const scoreBg = s =>
    s >= 80 ? "bg-green-50 border-green-200"
    : s >= 60 ? "bg-amber-50 border-amber-200"
    : "bg-red-50 border-red-200";

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">🤖 3-AI Deep Analysis</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Hugging Face extracts keywords → Groq scores your resume →
          Gemini suggests improvements
        </p>
      </div>

      {/* Run button */}
      {!report && (
        <button
          onClick={runAnalysis}
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading
            ? <><Spinner /> {progress}</>
            : "🚀 Run Full AI Analysis (Free)"}
        </button>
      )}

      {/* Progress bar */}
      {loading && (
        <div className="space-y-2">
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-center text-slate-500 dark:text-slate-400">{pct}% complete</p>
        </div>
      )}

      {/* Results */}
      {report && (
        <div className="space-y-4 animate-fade-in">

          {/* Final Score */}
          <div className={`rounded-xl p-5 text-center border ${scoreBg(report.finalScore?.total || 0)}`}>
            <div className={`text-6xl font-black ${scoreColor(report.finalScore?.total || 0)}`}>
              {report.finalScore?.total || 0}
            </div>
            <div className="text-slate-600 dark:text-slate-400 font-semibold mt-1">Unified ATS Score</div>
            <div className={`text-2xl font-black mt-1 ${scoreColor(report.finalScore?.total || 0)}`}>
              Grade: {report.finalScore?.grade}
            </div>

            {/* Sub scores */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              {[
                { label: "Groq Score",    value: report.finalScore?.groqScore    },
                { label: "Keyword Match", value: report.finalScore?.keywordScore },
                { label: "Bullet Quality",value: report.finalScore?.bulletScore  },
              ].map(item => (
                <div key={item.label} className="bg-white dark:bg-slate-800 rounded-lg p-2 border border-slate-200 dark:border-slate-700">
                  <div className={`text-lg font-bold ${scoreColor(item.value || 0)}`}>
                    {item.value || 0}%
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 flex-wrap">
            {[
              { id: "score",    label: "📊 Gaps"      },
              { id: "bullets",  label: "✏️ Bullets"   },
              { id: "skills",   label: "🛠️ Skills"    },
              { id: "keywords", label: "🔑 Keywords"  },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Gap Analysis Tab */}
          {activeTab === "score" && report.groqEvaluation && (
            <div className="space-y-3">
              {report.groqEvaluation.strengths?.length > 0 && (
                <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl p-4">
                  <div className="text-xs font-bold text-green-700 dark:text-green-400 mb-2">✅ Strengths</div>
                  {report.groqEvaluation.strengths.map((s, i) => (
                    <div key={i} className="text-sm text-green-700 dark:text-green-300 flex gap-2">
                      <span>→</span>{s}
                    </div>
                  ))}
                </div>
              )}

              {report.groqEvaluation.criticalGaps?.length > 0 && (
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4">
                  <div className="text-xs font-bold text-red-700 dark:text-red-400 mb-2">❌ Critical Gaps</div>
                  {report.groqEvaluation.criticalGaps.map((g, i) => (
                    <div key={i} className="text-sm text-red-700 dark:text-red-300 flex gap-2">
                      <span>→</span>{g}
                    </div>
                  ))}
                </div>
              )}

              {report.groqEvaluation.priorityActions?.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4">
                  <div className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-2">💡 Priority Actions</div>
                  {report.groqEvaluation.priorityActions.map((a, i) => (
                    <div key={i} className="mb-2">
                      <span className={`badge text-xs mr-2 ${
                        a.priority === "high"   ? "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300"
                        : a.priority === "medium" ? "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300"
                        : "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300"
                      }`}>
                        {a.priority}
                      </span>
                      <span className="text-sm text-slate-700 dark:text-slate-300">{a.action}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Improved Bullets Tab */}
          {activeTab === "bullets" && report.improvedBullets && (
            <div className="space-y-3">
              {report.improvedBullets.improvedBullets?.map((b, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                  <div className="text-xs text-red-500 dark:text-red-400 line-through mb-1">{b.original}</div>
                  <div className="text-sm text-green-700 dark:text-green-400 font-medium mb-1">✓ {b.improved}</div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">{b.improvement}</div>
                </div>
              ))}
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === "skills" && report.skillSuggestions && (
            <div className="space-y-3">
              {report.skillSuggestions.mustHaveSkills?.length > 0 && (
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4">
                  <div className="text-xs font-bold text-red-700 dark:text-red-400 mb-2">🚨 Must-Have (Missing)</div>
                  <div className="flex flex-wrap gap-1">
                    {report.skillSuggestions.mustHaveSkills.map((s, i) => (
                      <span key={i} className="badge bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-500/30">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {report.skillSuggestions.quickWins?.length > 0 && (
                <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl p-4">
                  <div className="text-xs font-bold text-green-700 dark:text-green-400 mb-2">⚡ Quick Wins (You have these — just add them)</div>
                  <div className="flex flex-wrap gap-1">
                    {report.skillSuggestions.quickWins.map((s, i) => (
                      <span key={i} className="badge bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-500/30">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Keywords Tab */}
          {activeTab === "keywords" && report.keywordSuggestions && (
            <div className="space-y-3">
              {report.keywordSuggestions.highPriorityKeywords?.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4">
                  <div className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-2">🔥 High Priority — Add These Now</div>
                  <div className="flex flex-wrap gap-1">
                    {report.keywordSuggestions.highPriorityKeywords.map((k, i) => (
                      <span key={i} className="badge bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30">{k}</span>
                    ))}
                  </div>
                </div>
              )}
              {report.keywordSuggestions.whereToAdd?.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4">
                  <div className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-2">📍 Where to Add Keywords</div>
                  {report.keywordSuggestions.whereToAdd.slice(0, 5).map((item, i) => (
                    <div key={i} className="mb-2 text-sm">
                      <span className="badge bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 mr-2">{item.keyword}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">→ {item.section}: </span>
                      <span className="text-xs text-slate-700 dark:text-slate-300 italic">{item.context}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Rerun button */}
          <button
            onClick={runAnalysis}
            className="w-full text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 py-1"
          >
            🔄 Re-run analysis
          </button>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary flex-1">← Back</button>
        <button onClick={onNext} className="btn-primary flex-1">Continue →</button>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  );
}