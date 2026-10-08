import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ResumeUpload from "../components/ResumeUpload";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, saveProfile, fetchProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Profile form state
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    title: "",
    phone: "",
    location: "",
    github: "",
    linkedin: "",
    leetcode: "",
    summary: "",
    skills: [],
    education: [],
    achievements: [],
    experience: []
  });

  // Temp states for adding items
  const [tempSkill, setTempSkill] = useState("");
  const [tempEdu, setTempEdu] = useState({ degree: "", school: "", year: "", gpa: "" });
  const [tempAch, setTempAch] = useState("");
  const [tempExp, setTempExp] = useState({ role: "", company: "", period: "", description: "" });

  // Load user profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const userData = await fetchProfile();
      if (userData) {
        setProfile({
          name: userData.name || "",
          email: userData.email || "",
          title: userData.profile?.title || "",
          phone: userData.profile?.phone || "",
          location: userData.profile?.location || "",
          github: userData.profile?.github || "",
          linkedin: userData.profile?.linkedin || "",
          leetcode: userData.profile?.leetcode || "",
          summary: userData.profile?.summary || "",
          skills: userData.profile?.skills || [],
          education: userData.profile?.education || [],
          achievements: userData.profile?.achievements || [],
          experience: userData.profile?.experience || []
        });
      }
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveProfile(profile);
      toast.success("Profile saved successfully!");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    loadProfile(); // Reload original data
    setIsEditing(false);
  };

  // Handle extracted resume data
  const handleResumeExtracted = (data) => {
    const normalizeList = (val) => (Array.isArray(val) ? val.filter(Boolean) : []);
    const normalizeProjects = (projects) => normalizeList(projects).map((p) => {
      const techs = Array.isArray(p?.technologies)
        ? p.technologies
        : typeof p?.technologies === "string"
          ? p.technologies.split(",").map((t) => t.trim()).filter(Boolean)
          : [];
      return {
        name: p?.name || "",
        description: p?.description || "",
        technologies: techs,
        url: p?.url || "",
      };
    });

    setProfile(prev => ({
      ...prev,
      name: data.name || prev.name || "",
      email: data.email || prev.email || "",
      phone: data.phone || prev.phone || "",
      location: data.location || prev.location || "",
      title: data.title || prev.title || "",
      github: data.github || prev.github || "",
      linkedin: data.linkedin || prev.linkedin || "",
      leetcode: data.leetcode || prev.leetcode || "",
      summary: data.summary || prev.summary || "",
      skills: normalizeList(data.skills).length > 0
        ? [...new Set([...(prev.skills || []), ...normalizeList(data.skills)])]
        : (prev.skills || []),
      education: normalizeList(data.education).length > 0 ? normalizeList(data.education) : (prev.education || []),
      achievements: normalizeList(data.achievements).length > 0 ? normalizeList(data.achievements) : (prev.achievements || []),
      experience: normalizeList(data.experience).length > 0 ? normalizeList(data.experience) : (prev.experience || []),
      projects: normalizeProjects(data.projects).length > 0 ? normalizeProjects(data.projects) : (prev.projects || []),
    }));
    toast.success("Profile auto-filled from resume!");
    setIsEditing(true); // Switch to edit mode so user can review
  };

  const handleFileUploaded = (file) => {
    // Keep for potential reuse in preview/export if needed later
  };

  const updateField = (field, value) => {
    setProfile(p => ({ ...p, [field]: value }));
  };

  const addToArray = (key, val) => {
    if (val && (typeof val === "string" ? val.trim() : true)) {
      setProfile(p => ({ ...p, [key]: [...(p[key] || []), val] }));
    }
  };

  const removeFromArray = (key, idx) => {
    setProfile(p => ({ ...p, [key]: p[key].filter((_, i) => i !== idx) }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Navbar */}
      <nav className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-lg tracking-tight">
              Skill<span className="text-blue-500">Sync</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/dashboard")}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">My Profile</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage your personal information</p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="btn-secondary"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-primary"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {/* Resume Upload Section - Only show when editing */}
        {isEditing && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Auto-fill from Resume
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Upload your existing resume PDF and we'll automatically extract your information.
            </p>
            <ResumeUpload onExtracted={handleResumeExtracted} onFileUploaded={handleFileUploaded} />
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6">
          
          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wide">Contact Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Full Name</label>
                {isEditing ? (
                  <input 
                    value={profile.name} 
                    onChange={e => updateField("name", e.target.value)}
                    className="input" 
                  />
                ) : (
                  <p className="text-slate-800 dark:text-slate-200 py-2">{profile.name || "-"}</p>
                )}
              </div>
              <div>
                <label className="label">Email</label>
                <p className="text-slate-800 dark:text-slate-200 py-2">{profile.email || "-"}</p>
              </div>
              <div>
                <label className="label">Phone</label>
                {isEditing ? (
                  <input 
                    value={profile.phone} 
                    onChange={e => updateField("phone", e.target.value)}
                    className="input" 
                    placeholder="Phone Number"
                  />
                ) : (
                  <p className="text-slate-800 dark:text-slate-200 py-2">{profile.phone || "-"}</p>
                )}
              </div>
              <div>
                <label className="label">Location</label>
                {isEditing ? (
                  <input 
                    value={profile.location} 
                    onChange={e => updateField("location", e.target.value)}
                    className="input" 
                    placeholder="City, Country"
                  />
                ) : (
                  <p className="text-slate-800 dark:text-slate-200 py-2">{profile.location || "-"}</p>
                )}
              </div>
              <div>
                <label className="label">Target Job Title</label>
                {isEditing ? (
                  <input 
                    value={profile.title} 
                    onChange={e => updateField("title", e.target.value)}
                    className="input" 
                    placeholder="e.g. Software Engineer"
                  />
                ) : (
                  <p className="text-slate-800 dark:text-slate-200 py-2">{profile.title || "-"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wide">Social Links</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="label">GitHub</label>
                {isEditing ? (
                  <input 
                    value={profile.github} 
                    onChange={e => updateField("github", e.target.value)}
                    className="input" 
                    placeholder="Username"
                  />
                ) : (
                  <p className="text-slate-800 dark:text-slate-200 py-2">{profile.github || "-"}</p>
                )}
              </div>
              <div>
                <label className="label">LinkedIn</label>
                {isEditing ? (
                  <input 
                    value={profile.linkedin} 
                    onChange={e => updateField("linkedin", e.target.value)}
                    className="input" 
                    placeholder="Profile URL"
                  />
                ) : (
                  <p className="text-slate-800 dark:text-slate-200 py-2 truncate">{profile.linkedin || "-"}</p>
                )}
              </div>
              <div>
                <label className="label">LeetCode</label>
                {isEditing ? (
                  <input 
                    value={profile.leetcode} 
                    onChange={e => updateField("leetcode", e.target.value)}
                    className="input" 
                    placeholder="Username"
                  />
                ) : (
                  <p className="text-slate-800 dark:text-slate-200 py-2">{profile.leetcode || "-"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="label">Professional Summary</label>
            {isEditing ? (
              <textarea 
                value={profile.summary} 
                onChange={e => updateField("summary", e.target.value)}
                rows={3}
                className="input" 
                placeholder="Briefly describe yourself..."
              />
            ) : (
              <p className="text-slate-800 dark:text-slate-200 py-2">{profile.summary || "-"}</p>
            )}
          </div>

          {/* Skills */}
          <div>
            <label className="label">Technical Skills</label>
            {isEditing ? (
              <>
                <div className="flex gap-2 mb-2">
                  <input 
                    value={tempSkill} 
                    onChange={e => setTempSkill(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { addToArray("skills", tempSkill.trim()); setTempSkill(""); }}}
                    placeholder="e.g. React, Python — press Enter"
                    className="input" 
                  />
                  <button 
                    onClick={() => { addToArray("skills", tempSkill.trim()); setTempSkill(""); }}
                    className="btn-primary whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s, i) => (
                    <span key={i} className="badge bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 flex items-center gap-1">
                      {s} <button onClick={() => removeFromArray("skills", i)} className="hover:text-red-500 ml-1 text-lg leading-none">×</button>
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-wrap gap-2 py-2">
                {profile.skills.length > 0 ? profile.skills.map((s, i) => (
                  <span key={i} className="badge bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">{s}</span>
                )) : <p className="text-slate-400 dark:text-slate-500">-</p>}
              </div>
            )}
          </div>

          {/* Education */}
          <div>
            <label className="label">Education</label>
            {isEditing && (
              <div className="grid grid-cols-4 gap-2 mb-2">
                <input value={tempEdu.degree} onChange={e => setTempEdu(d => ({ ...d, degree: e.target.value }))} placeholder="Degree" className="input text-xs" />
                <input value={tempEdu.school} onChange={e => setTempEdu(d => ({ ...d, school: e.target.value }))} placeholder="School" className="input text-xs" />
                <input value={tempEdu.year} onChange={e => setTempEdu(d => ({ ...d, year: e.target.value }))} placeholder="Year" className="input text-xs" />
                <input value={tempEdu.gpa} onChange={e => setTempEdu(d => ({ ...d, gpa: e.target.value }))} placeholder="GPA" className="input text-xs" />
              </div>
            )}
            {isEditing && (
              <button 
                onClick={() => { if (tempEdu.degree) { addToArray("education", { ...tempEdu }); setTempEdu({ degree: "", school: "", year: "", gpa: "" }); }}}
                className="btn-secondary text-sm mb-3"
              >
                + Add Education
              </button>
            )}
            <div className="space-y-2">
              {profile.education.map((e, i) => (
                <div key={i} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2.5 text-sm">
                  <span className="text-slate-800 dark:text-slate-200"><b>{e.degree}</b> — {e.school}, {e.year}</span>
                  {isEditing && <button onClick={() => removeFromArray("education", i)} className="text-red-400 hover:text-red-600 text-xs">Remove</button>}
                </div>
              ))}
              {profile.education.length === 0 && !isEditing && <p className="text-slate-400 dark:text-slate-500 py-2">-</p>}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <label className="label">Achievements / Awards</label>
            {isEditing && (
              <div className="flex gap-2 mb-2">
                <input 
                  value={tempAch} 
                  onChange={e => setTempAch(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { addToArray("achievements", tempAch.trim()); setTempAch(""); }}}
                  placeholder="e.g. Winner — HackMIT 2024"
                  className="input" 
                />
                <button 
                  onClick={() => { addToArray("achievements", tempAch.trim()); setTempAch(""); }}
                  className="btn-primary"
                >
                  Add
                </button>
              </div>
            )}
            <div className="space-y-2">
              {profile.achievements.map((a, i) => (
                <div key={i} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2 text-sm">
                  <span className="text-slate-800 dark:text-slate-200">{a}</span>
                  {isEditing && <button onClick={() => removeFromArray("achievements", i)} className="text-red-400 text-xs hover:text-red-600">Remove</button>}
                </div>
              ))}
              {profile.achievements.length === 0 && !isEditing && <p className="text-slate-400 dark:text-slate-500 py-2">-</p>}
            </div>
          </div>

          {/* Work Experience */}
          <div>
            <label className="label">Work Experience</label>
            {isEditing && (
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input value={tempExp.role} onChange={e => setTempExp(d => ({ ...d, role: e.target.value }))} placeholder="Job Role" className="input text-xs" />
                <input value={tempExp.company} onChange={e => setTempExp(d => ({ ...d, company: e.target.value }))} placeholder="Company" className="input text-xs" />
                <input value={tempExp.period} onChange={e => setTempExp(d => ({ ...d, period: e.target.value }))} placeholder="Period" className="input text-xs" />
                <input value={tempExp.description} onChange={e => setTempExp(d => ({ ...d, description: e.target.value }))} placeholder="Description" className="input text-xs col-span-2" />
              </div>
            )}
            {isEditing && (
              <button 
                onClick={() => { if (tempExp.role) { addToArray("experience", { ...tempExp }); setTempExp({ role: "", company: "", period: "", description: "" }); }}}
                className="btn-secondary text-sm mb-3"
              >
                + Add Experience
              </button>
            )}
            <div className="space-y-2">
              {profile.experience.map((e, i) => (
                <div key={i} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2.5 text-sm">
                  <span className="text-slate-800 dark:text-slate-200"><b>{e.role}</b> at {e.company}, {e.period}</span>
                  {isEditing && <button onClick={() => removeFromArray("experience", i)} className="text-red-400 text-xs hover:text-red-600">Remove</button>}
                </div>
              ))}
              {profile.experience.length === 0 && !isEditing && <p className="text-slate-400 dark:text-slate-500 py-2">-</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
