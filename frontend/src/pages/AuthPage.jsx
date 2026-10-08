import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ui/ThemeToggle";
import toast from "react-hot-toast";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, forgotPassword, verifyOTP, resetPassword, googleAuth, user } = useAuth();
  const googleButtonRef = useRef(null);

  // Read ?mode=login or ?mode=register from URL
  const [isLogin, setIsLogin] = useState(searchParams.get("mode") !== "register");
  const [loading, setLoading] = useState(false);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOTP, setForgotOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

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

  const googleInitialized = useRef(false);

  const handleGoogleCallback = useCallback(async (response) => {
    setLoading(true);
    try {
      await googleAuth(response.credential);
      toast.success(isLogin ? "Welcome back! 👋" : "Account created! Let's build your resume 🚀");
      navigate("/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.error || "Google sign-in failed. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [googleAuth, isLogin, navigate]);

  // Initialize Google Sign-In once
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("VITE_GOOGLE_CLIENT_ID is missing");
      return;
    }
    if (!window.google || !googleButtonRef.current) return;
    if (!googleInitialized.current) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCallback,
      });
      googleInitialized.current = true;
    }
  }, [handleGoogleCallback]);

  // Render Google button when mode changes
  useEffect(() => {
    if (!window.google || !googleButtonRef.current) return;
    googleButtonRef.current.innerHTML = "";
    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: "outline",
      size: "large",
      width: 280,
      text: isLogin ? "signin_with" : "signup_with",
    });
  }, [isLogin]);

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

  // Forgot password handlers
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !/\S+@\S+\.\S+/.test(forgotEmail)) {
      toast.error("Please enter a valid email");
      return;
    }
    
    setLoading(true);
    try {
      await forgotPassword(forgotEmail);
      toast.success("OTP sent to your email!");
      setForgotStep(2);
    } catch (err) {
      const msg = err?.response?.data?.error || "Failed to send OTP. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!forgotOTP || forgotOTP.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    
    setLoading(true);
    try {
      await verifyOTP(forgotEmail, forgotOTP);
      toast.success("OTP verified!");
      setForgotStep(3);
    } catch (err) {
      const msg = err?.response?.data?.error || "Invalid OTP. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setLoading(true);
    try {
      await resetPassword(forgotEmail, forgotOTP, newPassword);
      toast.success("Password reset successfully! Welcome back! 👋");
      setShowForgotModal(false);
      setForgotStep(1);
      setForgotEmail("");
      setForgotOTP("");
      setNewPassword("");
      setConfirmNewPassword("");
      navigate("/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.error || "Failed to reset password. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotStep(1);
    setForgotEmail("");
    setForgotOTP("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex">

      {/* ── Left Panel (desktop only) ───────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 p-12 flex-col justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-white font-black">S</span>
          </div>
          <span className="text-white text-xl font-black">SkillSync</span>
        </div>

        {/* Center content */}
        <div>
          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            AI-Powered Resume Builder
          </h2>
          <p className="text-blue-100 text-base mb-8">
            Paste any job description. We analyze it with AI and build a tailored, ATS-optimized resume.
          </p>

          {/* Feature list */}
          {[
            "AI analyzes job descriptions",
            "Auto-matches GitHub projects",
            "ATS-optimized content",
            "Export PDF instantly",
          ].map((f) => (
            <div key={f} className="flex items-center gap-3 mb-2">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-blue-100 text-sm">{f}</span>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="text-blue-200 text-sm">
          © {new Date().getFullYear()} SkillSync
        </div>
      </div>

      {/* ── Right Panel — Auth Form ─────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        {/* Theme toggle */}
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="text-xl font-bold">
              Skill<span className="text-blue-500">Sync</span>
            </span>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">

            {/* Tab switcher */}
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 mb-6">
              <button
                onClick={() => switchMode(true)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isLogin
                    ? "bg-white dark:bg-slate-700 text-blue-500 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => switchMode(false)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  !isLogin
                    ? "bg-white dark:bg-slate-700 text-blue-500 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-slate-400 dark:text-slate-500 text-sm mb-6">
              {isLogin
                ? "Log in to continue building your resume"
                : "Start building ATS-optimized resumes for free"}
            </p>

            {/* Google Sign In Button */}
            <div ref={googleButtonRef} className="w-full mb-4"></div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              <span className="text-xs text-slate-400 dark:text-slate-500">or continue with email</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            </div>

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

              {/* Password with visibility toggle */}
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={e => update("password", e.target.value)}
                    placeholder={isLogin ? "Your password" : "Minimum 8 characters"}
                    className={`input pr-10 ${errors.password ? "border-red-400 focus:ring-red-400" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password — register only */}
              {!isLogin && (
                <div>
                  <label className="label">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={e => update("confirmPassword", e.target.value)}
                      placeholder="Repeat your password"
                      className={`input pr-10 ${errors.confirmPassword ? "border-red-400 focus:ring-red-400" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOffIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              )}

              {/* Forgot password link */}
              {isLogin && (
                <div className="text-right">
                  <button 
                    type="button" 
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                  >
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

            {/* Switch mode */}
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-5">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              {" "}
              <button
                type="button"
                onClick={() => switchMode(!isLogin)}
                className="text-blue-500 font-semibold hover:text-blue-600 transition-colors"
              >
                {isLogin ? "Sign up free" : "Log in"}
              </button>
            </p>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4 px-4">
            By continuing, you agree to SkillSync's Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-8 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {forgotStep === 1 && "Reset Password"}
                {forgotStep === 2 && "Enter OTP"}
                {forgotStep === 3 && "New Password"}
              </h2>
              <button
                onClick={closeForgotModal}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Step 1: Email */}
            {forgotStep === 1 && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-slate-500 text-sm">
                  Enter your email address and we'll send you an OTP to reset your password.
                </p>
                <div>
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="arjun@example.com"
                    className="input"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? <><Spinner /> Sending OTP...</> : "Send OTP"}
                </button>
              </form>
            )}

            {/* Step 2: OTP */}
            {forgotStep === 2 && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <p className="text-slate-500 text-sm">
                  We've sent a 6-digit OTP to <strong>{forgotEmail}</strong>. Enter it below.
                </p>
                <div>
                  <label className="label">OTP Code</label>
                  <input
                    type="text"
                    value={forgotOTP}
                    onChange={e => setForgotOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="input text-center text-2xl tracking-widest"
                    maxLength={6}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? <><Spinner /> Verifying...</> : "Verify OTP"}
                </button>
                <button
                  type="button"
                  onClick={() => setForgotStep(1)}
                  className="w-full text-sm text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Back to email
                </button>
              </form>
            )}

            {/* Step 3: New Password */}
            {forgotStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <p className="text-slate-500 text-sm">
                  Create a new password for your account.
                </p>
                <div>
                  <label className="label">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="input pr-10"
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showNewPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="label">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmNewPassword ? "text" : "password"}
                      value={confirmNewPassword}
                      onChange={e => setConfirmNewPassword(e.target.value)}
                      placeholder="Repeat your password"
                      className="input pr-10"
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmNewPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? <><Spinner /> Resetting...</> : "Reset Password"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Icons ────────────────────────────────────────────────────
function EyeIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function EyeOffIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

function CloseIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
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