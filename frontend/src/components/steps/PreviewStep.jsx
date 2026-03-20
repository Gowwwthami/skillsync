import { useState } from "react";
import { useResume } from "../../context/ResumeContext";
import { TEMPLATES } from "../../constants";
import { renderTemplate } from "../../templates/templateEngine";
import { exportToPDF } from "../../engines/pdfExport";
import { calcATSScore } from "../../engines/atsScorer";
import axios from "axios";
import { API_BASE } from "../../constants";
import toast from "react-hot-toast";

export default function PreviewStep({ onBack, onRestart }) {
  const { resume, jdData, selectedTemplate, atsScore } = useResume();
  const [activeTab, setActiveTab] = useState("preview");
  const [saving, setSaving] = useState(false);

  const score = atsScore || calcATSScore(resume, jdData);

  const scoreColor = (s) =>
    s >= 80 ? "#16a34a" : s >= 60 ? "#d97706" : "#dc2626";

  const scoreBg = (s) =>
    s >= 80 ? "bg-green-50 border-green-200" : s >= 60 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200";

  const handleExport = () => {
    const html = renderTemplate(selectedTemplate, resume);
    exportToPDF(html, resume?.name || "Resume");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post(`${API_BASE}/resumes`, {
        jdText: "",
        jdAnalysis: jdData,
        resumeJSON: resume,
        template: selectedTemplate,
        atsScore: score,
      });
      toast.success("Resume saved to your account!");
    } catch (err) {
      toast.error("Failed to save resume");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
        {[
          { id: "preview", label: "📄 Resume Preview" },
          { id: "ats",     label: "📊 ATS Score"      },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Preview Tab ─────────────────────────────────────── */}
      {activeTab === "preview" && (
        <div className="space-y-3">
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-slate-100 px-4 py-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {TEMPLATES[selectedTemplate]?.name} Template
              </span>
              <div className="flex items-center gap-3">
                {score && (
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ color: scoreColor(score.total), background: `${scoreColor(score.total)}15` }}
                  >
                    ATS {score.total}/100
                  </span>
                )}
                <span className="text-xs text-green-600">● ATS Optimized</span>
              </div>
            </div>
            <div className="overflow-auto bg-white" style={{ maxHeight: "520px" }}>
              <div
                style={{ zoom: "0.7" }}
                dangerouslySetInnerHTML={{
                  __html: renderTemplate(selectedTemplate, resume),
                }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button onClick={onBack} className="btn-secondary flex-1">
              ← Change Template
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-secondary flex-1">
              {saving ? "Saving..." : "💾 Save"}
            </button>
            <button onClick={handleExport} className="btn-primary flex-1">
              📥 Export PDF
            </button>
          </div>

          <button
            onClick={onRestart}
            className="w-full text-xs text-slate-400 hover:text-slate-600 transition-colors py-1"
          >
            🔄 Start over with a new job description
          </button>
        </div>
      )}

      {/* ── ATS Score Tab ───────────────────────────────────── */}
      {activeTab === "ats" && score && (
        <div className="space-y-4">

          {/* Total score */}
          <div className={`rounded-xl p-6 text-center border ${scoreBg(score.total)}`}>
            <div
              className="text-6xl font-black mb-1"
              style={{ color: scoreColor(score.total) }}
            >
              {score.total}
            </div>
            <div className="text-slate-600 font-semibold">ATS Compatibility Score</div>
            <div
              className="inline-block mt-2 text-2xl font-black px-4 py-1 rounded-full"
              style={{
                color: scoreColor(score.total),
                background: `${scoreColor(score.total)}15`,
              }}
            >
              Grade: {score.grade}
            </div>
            <div className="text-sm text-slate-500 mt-2">
              {score.total >= 85
                ? "🎉 Excellent — very likely to pass ATS filters"
                : score.total >= 70
                ? "👍 Good — a few improvements recommended"
                : score.total >= 55
                ? "⚠️ Fair — review suggestions below"
                : "❌ Needs work — add missing keywords"}
            </div>
          </div>

          {/* Breakdown bars */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-700">Score Breakdown</h3>
            {Object.entries(score.breakdown).map(([cat, data]) => (
              <div key={cat}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">{cat}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{data.weight}</span>
                    <span
                      className="font-bold"
                      style={{ color: scoreColor(data.score) }}
                    >
                      {data.score}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${data.score}%`,
                      background: scoreColor(data.score),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Missing keywords */}
          {score.missing?.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="text-xs font-bold text-amber-700 mb-2">
                ⚠️ Missing Keywords ({score.missing.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {score.missing.map((k, i) => (
                  <span key={i} className="badge bg-amber-100 text-amber-700 border border-amber-300">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {score.suggestions?.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="text-xs font-bold text-blue-700 mb-2">
                💡 How to Improve Your Score
              </div>
              <ul className="space-y-1.5">
                {score.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-blue-700">
                    <span className="mt-0.5 flex-shrink-0">→</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Export from ATS tab too */}
          <div className="flex gap-3">
            <button onClick={handleExport} className="btn-primary flex-1">
              📥 Export PDF
            </button>
            <button onClick={onRestart} className="btn-secondary flex-1">
              🔄 New Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
