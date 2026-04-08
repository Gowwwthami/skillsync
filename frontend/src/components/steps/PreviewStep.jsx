import { useEffect, useState } from "react";
import { useResume } from "../../context/ResumeContext";
import { TEMPLATES } from "../../constants";
import { renderTemplate } from "../../templates/templateEngine";
import { exportToPDF } from "../../engines/pdfExport";
import { calcATSScore } from "../../engines/atsScorer";
import axios from "axios";
import { API_BASE } from "../../constants";
import toast from "react-hot-toast";

export default function PreviewStep({ onBack, onRestart }) {
  const { resume, jdData, selectedTemplate, atsScore, originalFormat, useOriginalFormat, uploadedPdf, profile } = useResume();
  const [activeTab, setActiveTab] = useState("preview");
  const [saving, setSaving] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const scoreSource = resume || profile;
  const score = scoreSource ? (atsScore || calcATSScore(scoreSource, jdData)) : null;

  const scoreColor = (s) =>
    s >= 80 ? "#16a34a" : s >= 60 ? "#d97706" : "#dc2626";

  const scoreBg = (s) =>
    s >= 80 ? "bg-green-50 border-green-200" : s >= 60 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200";

  // Determine which template to use
  const effectiveTemplate = useOriginalFormat ? "original" : selectedTemplate;
  const formatToUse = useOriginalFormat ? originalFormat : null;

  useEffect(() => {
    if (!uploadedPdf) {
      setPdfUrl(null);
      return;
    }
    const url = URL.createObjectURL(uploadedPdf);
    setPdfUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [uploadedPdf]);

  const handleExport = () => {
    if (uploadedPdf) {
      const url = URL.createObjectURL(uploadedPdf);
      const link = document.createElement("a");
      link.href = url;
      link.download = uploadedPdf.name || "resume.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      return;
    }
    const html = renderTemplate(effectiveTemplate, resume, formatToUse);
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
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
        {[
          { id: "preview", label: "📄 Resume Preview" },
          { id: "ats",     label: "📊 ATS Score"      },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Preview Tab ─────────────────────────────────────── */}
      {activeTab === "preview" && (
        <div className="space-y-3">
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {uploadedPdf
                  ? "Original Uploaded PDF"
                  : useOriginalFormat 
                  ? `Original Format (${originalFormat.layoutStyle})` 
                  : `${TEMPLATES[selectedTemplate]?.name} Template`}
              </span>
              <div className="flex items-center gap-3">
                {useOriginalFormat && !uploadedPdf && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300">
                    Format Preserved
                  </span>
                )}
                {score && (
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ color: scoreColor(score.total), background: `${scoreColor(score.total)}15` }}
                  >
                    ATS {score.total}/100
                  </span>
                )}
                <span className="text-xs text-green-600 dark:text-green-400">● ATS Optimized</span>
              </div>
            </div>
            <div className="overflow-auto bg-white" style={{ maxHeight: "520px" }}>
              {uploadedPdf && pdfUrl ? (
                <object data={pdfUrl} type="application/pdf" width="100%" height="520">
                  <p className="text-sm text-slate-500 p-4">PDF preview is not supported in this browser.</p>
                </object>
              ) : resume ? (
                <div
                  style={{ zoom: "0.7" }}
                  dangerouslySetInnerHTML={{
                    __html: renderTemplate(effectiveTemplate, resume, formatToUse),
                  }}
                />
              ) : (
                <div className="p-4 text-sm text-slate-500">
                  Resume data not available yet. Please generate a resume or upload a PDF.
                </div>
              )}
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
            className="w-full text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors py-1"
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
            <div className="text-slate-600 dark:text-slate-400 font-semibold">ATS Compatibility Score</div>
            <div
              className="inline-block mt-2 text-2xl font-black px-4 py-1 rounded-full"
              style={{
                color: scoreColor(score.total),
                background: `${scoreColor(score.total)}15`,
              }}
            >
              Grade: {score.grade}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
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
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Score Breakdown</h3>
            {Object.entries(score.breakdown).map(([cat, data]) => (
              <div key={cat}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">{cat}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 dark:text-slate-500">{data.weight}</span>
                    <span
                      className="font-bold"
                      style={{ color: scoreColor(data.score) }}
                    >
                      {data.score}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
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
            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4">
              <div className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-2">
                ⚠️ Missing Keywords ({score.missing.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {score.missing.map((k, i) => (
                  <span key={i} className="badge bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {score.suggestions?.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4">
              <div className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-2">
                💡 How to Improve Your Score
              </div>
              <ul className="space-y-1.5">
                {score.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-blue-700 dark:text-blue-300">
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
