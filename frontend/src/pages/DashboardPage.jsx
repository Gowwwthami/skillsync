import { useResume } from "../context/ResumeContext";
import { useAuth } from "../context/AuthContext";
import ProfileStep from "../components/steps/ProfileStep";
import JDStep from "../components/steps/JDStep";
import GitHubStep from "../components/steps/GitHubStep";
import GenerateStep from "../components/steps/GenerateStep";
import TemplateStep from "../components/steps/TemplateStep";
import PreviewStep from "../components/steps/PreviewStep";
import AIAnalysisStep from "../components/steps/AIAnalysisStep";

const STEPS = [
  { id: "profile",   label: "Profile",        icon: "👤" },
  { id: "jd",        label: "Job Description", icon: "📋" },
  { id: "github",    label: "GitHub",          icon: "🐙" },
  { id: "generate",  label: "Generate",        icon: "✨" },
  { id: "template",  label: "Template",        icon: "🎨" },
  { id: "preview",   label: "Preview & Export",icon: "📤" },
  { id: "aianalysis", label: "AI Analysis", icon: "🤖" },
];

export default function DashboardPage() {
  const { step, setStep, reset } = useResume();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow">AI</div>
            <div className="flex items-center gap-3">
  <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow">
    <span className="text-white font-black text-sm">SS</span>
  </div>
  <div>
    <span className="font-black text-slate-800 text-lg tracking-tight">Skill<span className="text-blue-600">Sync</span></span>
  </div>
</div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">Hey, {user?.name?.split(" ")[0]} 👋</span>
            <button onClick={reset} className="text-xs text-slate-400 hover:text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg">Reset</button>
            <button onClick={logout} className="text-xs text-red-400 hover:text-red-600">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Step Progress Bar */}
        <div className="flex items-center mb-8 px-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <button onClick={() => i < step && setStep(i)} className={`flex flex-col items-center gap-1 group ${i > step ? "cursor-not-allowed" : "cursor-pointer"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold transition-all duration-300 ${
                  i < step ? "bg-green-500 text-white shadow-sm shadow-green-200"
                  : i === step ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110"
                  : "bg-slate-200 text-slate-400"}`}>
                  {i < step ? "✓" : s.icon}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i === step ? "text-blue-600" : i < step ? "text-green-600" : "text-slate-400"}`}>{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${i < step ? "bg-green-400" : "bg-slate-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Card */}
        <div className="card animate-fade-in">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <span className="text-2xl">{STEPS[step]?.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{STEPS[step]?.label}</h2>
              <p className="text-xs text-slate-400">Step {step + 1} of {STEPS.length}</p>
            </div>
          </div>

          {step === 0 && <ProfileStep onNext={() => setStep(1)} />}
          {step === 1 && <JDStep onNext={() => setStep(2)} onBack={() => setStep(0)} />}
          {step === 2 && <GitHubStep onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <GenerateStep onNext={() => setStep(4)} onBack={() => setStep(2)} />}
          {step === 4 && <TemplateStep onNext={() => setStep(5)} onBack={() => setStep(3)} />}
          {step === 5 && <PreviewStep onBack={() => setStep(4)} onRestart={reset} />}
            {step === 6 && <AIAnalysisStep onBack={() => setStep(5)} onNext={() => setStep(5)} />}
        </div>
      </div>
    </div>
  );
}