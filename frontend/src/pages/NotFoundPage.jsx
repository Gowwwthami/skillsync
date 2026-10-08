import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center text-center px-6">
      <div>
        <div className="text-7xl mb-4">🔍</div>
        <h1 className="text-4xl font-black text-slate-800 mb-2">404</h1>
        <p className="text-slate-500 mb-8">This page doesn't exist.</p>
        <button
          onClick={() => navigate("/")}
          className="btn-primary"
        >
          ← Back to SkillSync
        </button>
      </div>
    </div>
  );
}