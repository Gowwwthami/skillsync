import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { APP_NAME, APP_TAGLINE } from "../constants";
import toast from "react-hot-toast";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, user } = useAuth();

  // Read ?mode=login or ?mode=register from URL
  const [isLogin, setIsLogin] = useState(searchParams.get("mode") !== "register");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  // Sync tab with URL param
  useEffect(() => {
    setIsLogin(searchParams.get("mode") !== "register");
    setErrors({});
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
  }, [searchParams]);

  const update = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!isLogin && !form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 8) errs.password = "Minimum 8 characters";
    if (!isLogin && form.password !== form.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
        toast.success("Welcome back! 👋");
      } else {
        await register(form.name, form.email, form.password);
        toast.success("Account created! Let's build your resume 🚀");
      }
      navigate("/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.error || "Something went wrong. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (loginMode) => {
    navigate(`/auth?mode=${loginMode ? "login" : "register"}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-purple-50/40 flex">

      {/* ── Left Panel (desktop only) ───────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-12 flex-col justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-white font-black">SS</span>
          </div>
          <span className="text-white text-xl font-black">SkillSync</span>
        </div>

        {/* Center content */}
        <div>
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            {APP_TAGLINE}
          </h2>
          <p className="text-blue-100 text-lg mb-10">
            AI-powered resumes tailored to every job description.
            Built for engineers who want to get hired faster.
          </p>

          {/* Feature list */}
          {[
            "Analyzes job descriptions with Claude AI",
            "Matches your GitHub projects automatically",
            "Generates ATS-optimized bullets with metrics",
            "Scores your resume before you apply",
          ].map((f) => (
            <div key={f} className="flex items-center gap-3 mb-3">
              <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-blue-100 text-sm">{f}</span>
            </div>
          ))}
        </div>

        {/* Bottom quote */}
        <div className="bg-white/10 rounded-2xl p-5 border border-white/20">
          <p className="text-white text-sm italic">
            "SkillSync helped me land interviews at 3 FAANG companies
            by perfectly matching my resume to each job description."
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-400 flex items-center justify-center text-white text-xs font-bold">A</div>
            <div>
              <div className="text-white text-xs font-semibold">Arjun M.</div>
              <div className="text-blue-200 text-xs">Software Engineer</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel — Auth Form ─────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-sm">SS</span>
            </div>
            <span className="text-xl font-black">
              Skill<span className="text-blue-600">Sync</span>
            </span>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">

            {/* Tab switcher */}
            <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
              <button
                onClick={() => switchMode(true)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isLogin
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => switchMode(false)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  !isLogin
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-black text-slate-800 mb-1">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-slate-400 text-sm mb-6">
              {isLogin
                ? "Log in to continue building your resume"
                : "Start building ATS-optimized resumes for free"}
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name — register only */}
              {!isLogin && (
                <div>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => update("name", e.target.value)}
                    placeholder="Arjun Mehta"
                    className={`input ${errors.name ? "border-red-400 focus:ring-red-400" : ""}`}
                    autoFocus
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => update("email", e.target.value)}
                  placeholder="arjun@example.com"
                  className={`input ${errors.email ? "border-red-400 focus:ring-red-400" : ""}`}
                  autoFocus={isLogin}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="label">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => update("password", e.target.value)}
                  placeholder={isLogin ? "Your password" : "Minimum 8 characters"}
                  className={`input ${errors.password ? "border-red-400 focus:ring-red-400" : ""}`}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password — register only */}
              {!isLogin && (
                <div>
                  <label className="label">Confirm Password</label>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={e => update("confirmPassword", e.target.value)}
                    placeholder="Repeat your password"
                    className={`input ${errors.confirmPassword ? "border-red-400 focus:ring-red-400" : ""}`}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              )}

              {/* Forgot password link */}
              {isLogin && (
                <div className="text-right">
                  <button type="button" className="text-xs text-blue-600 hover:text-blue-800 transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-2"
              >
                {loading
                  ? <><Spinner /> {isLogin ? "Logging in..." : "Creating account..."}</>
                  : isLogin ? "Log In →" : "Create Account →"
                }
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-xs text-slate-400">or</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Switch mode */}
            <p className="text-center text-sm text-slate-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              {" "}
              <button
                type="button"
                onClick={() => switchMode(!isLogin)}
                className="text-blue-600 font-semibold hover:text-blue-800 transition-colors"
              >
                {isLogin ? "Sign up free" : "Log in"}
              </button>
            </p>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-slate-400 mt-4 px-4">
            By continuing, you agree to SkillSync's Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Spinner ────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}