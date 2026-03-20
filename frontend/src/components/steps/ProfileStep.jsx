import { useState } from "react";
import { useResume } from "../../context/ResumeContext";
import { useAuth } from "../../context/AuthContext";

export default function ProfileStep({ onNext }) {
  const { profile, setProfile } = useResume();
  const { user } = useAuth();
  const [tempSkill, setTempSkill] = useState("");
  const [tempEdu, setTempEdu] = useState({ degree: "", school: "", year: "", gpa: "" });
  const [tempAch, setTempAch] = useState("");
  const [tempExp, setTempExp] = useState({ role: "", company: "", period: "", description: "" });

  const update = (k, v) => setProfile(p => ({ ...p, [k]: v }));
  const addToArray = (key, val) => { if (val) setProfile(p => ({ ...p, [key]: [...(p[key] || []), val] })); };
  const removeFromArray = (key, idx) => setProfile(p => ({ ...p, [key]: p[key].filter((_, i) => i !== idx) }));

  return (
    <div className="space-y-6">
      {/* Contact Info */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Contact Information</h3>
        <div className="grid grid-cols-2 gap-3">
          {[["name","Full Name"],["email","Email Address"],["phone","Phone Number"],["location","Location (City, Country)"],["title","Target Job Title"],["github","GitHub Username"],["linkedin","LinkedIn Profile URL"],["leetcode","LeetCode Username"]].map(([f, l]) => (
            <div key={f}>
              <label className="label">{l}</label>
              <input value={profile[f] || ""} onChange={e => update(f, e.target.value)} placeholder={l} className="input" />
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div>
        <label className="label">Professional Summary (optional — AI will enhance)</label>
        <textarea value={profile.summary || ""} onChange={e => update("summary", e.target.value)} rows={3} className="input" placeholder="Briefly describe yourself..." />
      </div>

      {/* Skills */}
      <div>
        <label className="label">Technical Skills</label>
        <div className="flex gap-2 mb-2">
          <input value={tempSkill} onChange={e => setTempSkill(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { addToArray("skills", tempSkill.trim()); setTempSkill(""); }}}
            placeholder="e.g. React, Python, AWS — press Enter" className="input" />
          <button onClick={() => { addToArray("skills", tempSkill.trim()); setTempSkill(""); }} className="btn-primary whitespace-nowrap">Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(profile.skills || []).map((s, i) => (
            <span key={i} className="badge bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
              {s} <button onClick={() => removeFromArray("skills", i)} className="hover:text-red-500 ml-1 text-lg leading-none">×</button>
            </span>
          ))}
        </div>
      </div>

      {/* Education */}
      <div>
        <label className="label">Education</label>
        <div className="grid grid-cols-4 gap-2 mb-2">
          {[["degree","Degree"],["school","School"],["year","Year"],["gpa","GPA"]].map(([f, p]) => (
            <input key={f} value={tempEdu[f]} onChange={e => setTempEdu(d => ({ ...d, [f]: e.target.value }))} placeholder={p} className="input text-xs" />
          ))}
        </div>
        <button onClick={() => { if (tempEdu.degree) { addToArray("education", { ...tempEdu }); setTempEdu({ degree: "", school: "", year: "", gpa: "" }); }}} className="btn-secondary text-sm mb-3">+ Add Education</button>
        {(profile.education || []).map((e, i) => (
          <div key={i} className="flex justify-between items-center bg-slate-50 rounded-xl px-4 py-2.5 mb-2 text-sm">
            <span><b>{e.degree}</b> — {e.school}, {e.year}</span>
            <button onClick={() => removeFromArray("education", i)} className="text-red-400 hover:text-red-600 text-xs">Remove</button>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div>
        <label className="label">Achievements / Awards</label>
        <div className="flex gap-2 mb-2">
          <input value={tempAch} onChange={e => setTempAch(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { addToArray("achievements", tempAch.trim()); setTempAch(""); }}}
            placeholder="e.g. Winner — HackMIT 2024" className="input" />
          <button onClick={() => { addToArray("achievements", tempAch.trim()); setTempAch(""); }} className="btn-primary">Add</button>
        </div>
        {(profile.achievements || []).map((a, i) => (
          <div key={i} className="flex justify-between items-center bg-slate-50 rounded-xl px-4 py-2 mb-2 text-sm">
            <span>{a}</span>
            <button onClick={() => removeFromArray("achievements", i)} className="text-red-400 text-xs hover:text-red-600">Remove</button>
          </div>
        ))}
      </div>

      {/* Work Experience */}
      <div>
        <label className="label">Work Experience (optional)</label>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {[["role","Job Role"],["company","Company"],["period","Period"],["description","Description"]].map(([f, p]) => (
            <input key={f} value={tempExp[f]} onChange={e => setTempExp(d => ({ ...d, [f]: e.target.value }))} placeholder={p} className={`input text-xs ${f === "description" ? "col-span-2" : ""}`} />
          ))}
        </div>
        <button onClick={() => { if (tempExp.role) { addToArray("experience", { ...tempExp }); setTempExp({ role: "", company: "", period: "", description: "" }); }}} className="btn-secondary text-sm mb-3">+ Add Experience</button>
        {(profile.experience || []).map((e, i) => (
          <div key={i} className="flex justify-between items-center bg-slate-50 rounded-xl px-4 py-2.5 mb-2 text-sm">
            <span><b>{e.role}</b> at {e.company}, {e.period}</span>
            <button onClick={() => removeFromArray("experience", i)} className="text-red-400 text-xs hover:text-red-600">Remove</button>
          </div>
        ))}
      </div>

      <button onClick={onNext} disabled={!profile.name || !profile.email} className="btn-primary w-full">
        Continue to Job Description →
      </button>
    </div>
  );
}