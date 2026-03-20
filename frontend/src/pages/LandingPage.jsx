import { useNavigate } from "react-router-dom";
import { APP_NAME, APP_TAGLINE, APP_DESCRIPTION, TEMPLATES } from "../constants";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-black text-sm">SS</span>
            </div>
            <span className="text-xl font-black tracking-tight">
              Skill<span className="text-blue-600">Sync</span>
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it works</a>
            <a href="#templates" className="hover:text-slate-900 transition-colors">Templates</a>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/auth?mode=login")}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
            >
              Log in
            </button>
            <button
              onClick={() => navigate("/auth?mode=register")}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-purple-50/40 pt-24 pb-28">

        {/* Background blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            Powered by Claude AI
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight mb-6">
            Skill<span className="text-blue-600">Sync</span>
            <br />
            <span className="text-slate-400 font-light text-4xl md:text-5xl">
              {APP_TAGLINE}
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Paste any job description. SkillSync analyzes it with AI, matches your
            GitHub projects, and builds a tailored, ATS-optimized resume — in under
            60 seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/auth?mode=register")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105"
            >
              Build My Resume — Free ✨
            </button>
            <button
              onClick={() => navigate("/auth?mode=login")}
              className="border-2 border-slate-200 hover:border-blue-300 text-slate-700 font-bold px-8 py-4 rounded-2xl text-base transition-all hover:bg-blue-50"
            >
              Log In →
            </button>
          </div>

          {/* Social proof */}
          <p className="text-xs text-slate-400 mt-6">
            No credit card required · Free to use · Export PDF instantly
          </p>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">

          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-800 mb-3">
              From job post to resume in 4 steps
            </h2>
            <p className="text-slate-500">No manual editing. No guessing keywords. Just results.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                icon: "📋",
                title: "Paste the JD",
                desc: "Drop in any job description. Our AI extracts every keyword, required skill, and responsibility.",
              },
              {
                step: "02",
                icon: "🐙",
                title: "Connect GitHub",
                desc: "We scan your repos, detect tech stacks, and rank your best projects against the JD.",
              },
              {
                step: "03",
                icon: "✨",
                title: "AI Generates Resume",
                desc: "Claude writes ATS-optimized bullets with metrics, action verbs, and embedded keywords.",
              },
              {
                step: "04",
                icon: "📥",
                title: "Export PDF",
                desc: "Pick a template, check your ATS score, and download a print-ready PDF in one click.",
              },
            ].map((item) => (
              <div key={item.step} className="relative bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all">
                <div className="text-xs font-black text-blue-400 mb-3 tracking-widest">{item.step}</div>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section id="features" className="py-24 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-5xl mx-auto px-6">

          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-800 mb-3">
              Everything you need to get hired
            </h2>
            <p className="text-slate-500">Built for engineers, designers, and everyone in between.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🤖",
                color: "bg-blue-50 text-blue-600",
                title: "Claude AI Analysis",
                desc: "State-of-the-art LLM extracts job requirements and writes tailored content that passes ATS filters.",
              },
              {
                icon: "📊",
                color: "bg-green-50 text-green-600",
                title: "ATS Score Engine",
                desc: "Real-time scoring across keyword match, skill alignment, action verbs, and section completeness.",
              },
              {
                icon: "🐙",
                color: "bg-purple-50 text-purple-600",
                title: "GitHub Integration",
                desc: "Auto-fetches your repos, detects tech stacks, and picks the most relevant projects for the role.",
              },
              {
                icon: "🎨",
                color: "bg-orange-50 text-orange-600",
                title: "3 Pro Templates",
                desc: "Modern, Minimalist ATS, and Elegant Professional — all optimized for both humans and machines.",
              },
              {
                icon: "📥",
                color: "bg-pink-50 text-pink-600",
                title: "1-Click PDF Export",
                desc: "Print-ready, ATS-compliant PDF. No images, clean fonts, proper heading hierarchy.",
              },
              {
                icon: "🔒",
                color: "bg-slate-100 text-slate-600",
                title: "Secure & Private",
                desc: "JWT auth, encrypted passwords, your data stays yours. No selling, no ads.",
              },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-all hover:border-blue-100">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Templates Preview ──────────────────────────────── */}
      <section id="templates" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">

          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-800 mb-3">
              3 templates. All ATS-ready.
            </h2>
            <p className="text-slate-500">Switch between them with one click. Preview live before exporting.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(TEMPLATES).map((t) => (
              <div key={t.id} className="rounded-2xl border-2 border-slate-100 overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all group">

                {/* Template color preview bar */}
                <div
                  className="h-28 flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${t.accent}22, ${t.accent}44)` }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg"
                    style={{ background: t.accent }}
                  >
                    {t.name[0]}
                  </div>
                </div>

                {/* Template info */}
                <div className="p-5">
                  <h3 className="font-bold text-slate-800 mb-1">{t.name}</h3>
                  <p className="text-sm text-slate-500">{t.description}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full font-medium">
                      ATS Optimized
                    </span>
                    <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full font-medium">
                      PDF Ready
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ATS Score Preview ──────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-black mb-4">
            Know your ATS score before you apply
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            Our scoring engine checks keyword match, skill alignment, action verbs,
            soft skills, and section completeness — then tells you exactly what to fix.
          </p>

          {/* Score breakdown preview */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-8 max-w-lg mx-auto border border-white/20">
            <div className="text-6xl font-black mb-2">87</div>
            <div className="text-blue-200 text-sm mb-6">ATS Compatibility Score</div>

            {[
              { label: "Keyword Match",    score: 92, color: "bg-green-400" },
              { label: "Skill Alignment",  score: 85, color: "bg-green-400" },
              { label: "Action Verbs",     score: 80, color: "bg-yellow-400" },
              { label: "Soft Skills",      score: 70, color: "bg-yellow-400" },
              { label: "Section Complete", score: 100, color: "bg-green-400"},
            ].map((item) => (
              <div key={item.label} className="mb-3">
                <div className="flex justify-between text-xs text-blue-100 mb-1">
                  <span>{item.label}</span>
                  <span className="font-bold text-white">{item.score}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────── */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-black text-slate-800 mb-4">
            Ready to land your next role?
          </h2>
          <p className="text-slate-500 text-lg mb-8">
            Join SkillSync and start building resumes that actually get past ATS filters.
          </p>
          <button
            onClick={() => navigate("/auth?mode=register")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105"
          >
            Get Started Free →
          </button>
          <p className="text-xs text-slate-400 mt-4">
            No credit card · No setup · Cancel anytime
          </p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-xs">SS</span>
              </div>
              <span className="text-white font-black">
                Skill<span className="text-blue-400">Sync</span>
              </span>
            </div>

            {/* Links */}
            <div className="flex gap-6 text-sm">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#templates" className="hover:text-white transition-colors">Templates</a>
              <a href="https://github.com" className="hover:text-white transition-colors">GitHub</a>
            </div>

            {/* Copyright */}
            <div className="text-xs">
              © {new Date().getFullYear()} SkillSync. Built with Claude AI.
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}