import { useResume } from "../../context/ResumeContext";
import { TEMPLATES } from "../../constants";
import { renderTemplate } from "../../templates/templateEngine";

export default function TemplateStep({ onNext, onBack }) {
  const { resume, selectedTemplate, setSelectedTemplate, useOriginalFormat, setUseOriginalFormat, originalFormat, uploadedPdf } = useResume();

  // Determine effective template for preview
  const effectiveTemplate = useOriginalFormat ? "original" : selectedTemplate;
  const formatToUse = useOriginalFormat ? originalFormat : null;

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Choose a template. All three are ATS-compatible and PDF-ready.
        The preview below updates live as you switch.
      </p>

      {/* Original Format Option (if available) */}
      {originalFormat && !uploadedPdf && (
        <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-300 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Use Original Resume Format
              </h3>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Preserve the layout from your uploaded resume: {originalFormat.layoutStyle}, {originalFormat.contentDensity} content
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useOriginalFormat}
                onChange={(e) => setUseOriginalFormat(e.target.checked)}
                className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
              />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                {useOriginalFormat ? "Enabled" : "Disabled"}
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Template cards */}
      {!uploadedPdf && (
        <div className={`grid gap-3 ${originalFormat ? 'grid-cols-3' : 'grid-cols-3'}`}>
          {Object.values(TEMPLATES)
            .sort((a, b) => (b.recommended === true) - (a.recommended === true))
            .map(t => (
            <button
              key={t.id}
              onClick={() => { setSelectedTemplate(t.id); setUseOriginalFormat(false); }}
              disabled={useOriginalFormat}
              className={`border-2 rounded-xl p-4 text-left transition-all ${
                selectedTemplate === t.id && !useOriginalFormat
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-md"
                  : useOriginalFormat
                  ? "border-slate-100 dark:border-slate-800 opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900"
                  : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500/50 bg-white dark:bg-slate-900 hover:shadow-sm"
              }`}
            >
              {/* Color dot */}
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-5 h-5 rounded-full shadow-sm"
                  style={{ background: t.accent }}
                />
                <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{t.name}</span>
                {t.recommended && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold">
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t.description}</p>
              {selectedTemplate === t.id && !useOriginalFormat && (
                <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-semibold">✓ Selected</div>
              )}
            </button>
          ))}
        </div>
      )}

      {uploadedPdf && (
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4">
          <p className="text-sm text-amber-800 dark:text-amber-300 font-semibold">
            Original PDF output enabled
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
            Templates are disabled because you uploaded a resume PDF.
          </p>
        </div>
      )}

      {/* Live preview */}
      {resume && !uploadedPdf && (
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {useOriginalFormat 
                ? `Live Preview — Original Format (${originalFormat.layoutStyle})`
                : `Live Preview — ${TEMPLATES[selectedTemplate]?.name}`}
            </span>
            <div className="flex items-center gap-2">
              {useOriginalFormat && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300">
                  Format Preserved
                </span>
              )}
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">● ATS Ready</span>
            </div>
          </div>
          <div
            className="overflow-auto bg-white"
            style={{ maxHeight: "400px" }}
          >
            <div
              style={{ zoom: "0.6", transformOrigin: "top left" }}
              dangerouslySetInnerHTML={{
                __html: renderTemplate(effectiveTemplate, resume, formatToUse),
              }}
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary flex-1">← Back</button>
        <button onClick={onNext} className="btn-primary flex-1">
          Preview & Score →
        </button>
      </div>
    </div>
  );
}