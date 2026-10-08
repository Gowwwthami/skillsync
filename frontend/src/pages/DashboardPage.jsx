import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResume } from "../context/ResumeContext";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ui/ThemeToggle";
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
  const navigate = useNavigate();
  const { step, setStep, reset } = useResume();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Navbar */}
      <nav className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-lg tracking-tight">Skill<span className="text-blue-500">Sync</span></span>
          </div>
          
          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button onClick={reset} className="text-xs text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg">Reset</button>
            
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full p-1 pr-3 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium hidden sm:block">{user?.name?.split(" ")[0]}</span>
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-20">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => { setShowDropdown(false); navigate("/profile"); }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      View Profile
                    </button>
                    <button
                      onClick={() => { setShowDropdown(false); navigate("/profile"); }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </button>
                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
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
                  i < step ? "bg-green-500 text-white shadow-sm"
                  : i === step ? "bg-blue-500 text-white shadow-lg scale-110"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600"}`}>
                  {i < step ? "✓" : s.icon}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i === step ? "text-blue-500" : i < step ? "text-green-500" : "text-slate-400 dark:text-slate-600"}`}>{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${i < step ? "bg-green-400" : "bg-slate-200 dark:bg-slate-800"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Card */}
        <div className="card animate-fade-in">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <span className="text-2xl">{STEPS[step]?.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{STEPS[step]?.label}</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">Step {step + 1} of {STEPS.length}</p>
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