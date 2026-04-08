import { useNavigate } from "react-router-dom";
import { APP_NAME, APP_TAGLINE, TEMPLATES } from "../constants";
import ThemeToggle from "../components/ui/ThemeToggle";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">

      {/* ── Navbar (Twitter-style minimal) ─────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="text-lg font-bold tracking-tight">
              Skill<span className="text-blue-500">Sync</span>
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => navigate("/auth?mode=login")}
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors px-3 py-2"
            >
              Log in
            </button>
            <button
              onClick={() => navigate("/auth?mode=register")}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero (Twitter-style centered) ──────────────────── */}
      <section className="pt-20 pb-16">
        <div className="max-w-2xl mx-auto px-6 text-center">

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
            <span className="text-blue-500">AI-Powered</span> Resume Builder
          </h1>

          {/* Subheading */}
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
            Paste any job description. We analyze it with AI, match your GitHub projects, 
            and build a tailored, ATS-optimized resume in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/auth?mode=register")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-3 rounded-full text-base transition-all"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate("/auth?mode=login")}
              className="border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold px-8 py-3 rounded-full text-base transition-all"
            >
              Sign In
            </button>
          </div>

          {/* Social proof */}
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-6">
            No credit card required · Free forever
          </p>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────── */}
      <section id="how-it-works" className="py-16 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-6">

          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              How it works
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Four simple steps to your perfect resume</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: "1", icon: "📋", title: "Paste JD", desc: "Drop in any job description" },
              { step: "2", icon: "🐙", title: "Connect GitHub", desc: "We scan your repos" },
              { step: "3", icon: "✨", title: "AI Generates", desc: "ATS-optimized content" },
              { step: "4", icon: "📥", title: "Export PDF", desc: "Download instantly" },
            ].map((item) => (
              <div key={item.step} className="text-center p-4">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section id="features" className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-6">

          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              Features
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Everything you need to land your dream job</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: "🤖", title: "AI Analysis", desc: "Claude-powered JD analysis" },
              { icon: "📊", title: "ATS Scoring", desc: "Real-time compatibility check" },
              { icon: "🐙", title: "GitHub Sync", desc: "Auto-import your projects" },
              { icon: "🎨", title: "Templates", desc: "3 professional designs" },
              { icon: "📥", title: "PDF Export", desc: "ATS-ready downloads" },
              { icon: "🔒", title: "Secure", desc: "Your data stays private" },
            ].map((f) => (
              <div key={f.title} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <div className="text-xl mb-2">{f.icon}</div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Templates Preview ──────────────────────────────── */}
      <section id="templates" className="py-16 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-6">

          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              Templates
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Choose from 3 professional designs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.values(TEMPLATES).map((t) => (
              <div key={t.id} className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800">
                <div
                  className="h-20 flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${t.accent}22, ${t.accent}44)` }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white"
                    style={{ background: t.accent }}
                  >
                    {t.name[0]}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-1">{t.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ────────────────────────────────────── */}
      <section className="py-16 bg-blue-500 text-white">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Ready to land your next role?
          </h2>
          <p className="text-blue-100 text-sm mb-6">
            Join thousands of job seekers using SkillSync to build better resumes.
          </p>
          <button
            onClick={() => navigate("/auth?mode=register")}
            className="bg-white text-blue-500 font-bold px-8 py-3 rounded-full text-sm transition-all hover:bg-blue-50"
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">S</span>
              </div>
              <span className="text-slate-800 dark:text-slate-100 font-bold text-sm">
                Skill<span className="text-blue-500">Sync</span>
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} SkillSync
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}