import { useResume } from "../../context/ResumeContext";
import { TEMPLATES } from "../../constants";
import { renderTemplate } from "../../templates/templateEngine";

export default function TemplateStep({ onNext, onBack }) {
  const { resume, selectedTemplate, setSelectedTemplate } = useResume();

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-500">
        Choose a template. All three are ATS-compatible and PDF-ready.
        The preview below updates live as you switch.
      </p>

      {/* Template cards */}
      <div className="grid grid-cols-3 gap-3">
        {Object.values(TEMPLATES).map(t => (
          <button
            key={t.id}
            onClick={() => setSelectedTemplate(t.id)}
            className={`border-2 rounded-xl p-4 text-left transition-all ${
              selectedTemplate === t.id
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-slate-200 hover:border-blue-300 bg-white hover:shadow-sm"
            }`}
          >
            {/* Color dot */}
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-5 h-5 rounded-full shadow-sm"
                style={{ background: t.accent }}
              />
              <span className="font-bold text-sm text-slate-800">{t.name}</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{t.description}</p>
            {selectedTemplate === t.id && (
              <div className="mt-2 text-xs text-blue-600 font-semibold">✓ Selected</div>
            )}
          </button>
        ))}
      </div>

      {/* Live preview */}
      {resume && (
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-slate-100 px-4 py-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Live Preview — {TEMPLATES[selectedTemplate]?.name}
            </span>
            <span className="text-xs text-green-600 font-medium">● ATS Ready</span>
          </div>
          <div
            className="overflow-auto bg-white"
            style={{ maxHeight: "400px" }}
          >
            <div
              style={{ zoom: "0.6", transformOrigin: "top left" }}
              dangerouslySetInnerHTML={{
                __html: renderTemplate(selectedTemplate, resume),
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