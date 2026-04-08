import { useState, useEffect } from "react";
import { useResume } from "../../context/ResumeContext";
import { useAuth } from "../../context/AuthContext";
import ResumeUpload from "../ResumeUpload";
import GitHubProjectsFetcher from "../GitHubProjectsFetcher";
import toast from "react-hot-toast";

export default function ProfileStep({ onNext }) {
  const { profile, setProfile, originalFormat, setOriginalFormat, useOriginalFormat, setUseOriginalFormat, setUploadedPdf, setResume } = useResume();
  const { user, saveProfile, fetchProfile } = useAuth();
  const [tempSkill, setTempSkill] = useState("");
  const [tempEdu, setTempEdu] = useState({ degree: "", school: "", year: "", gpa: "" });
  const [tempAch, setTempAch] = useState("");
  const [tempExp, setTempExp] = useState({ role: "", company: "", period: "", description: "" });
  const [tempProject, setTempProject] = useState({ name: "", description: "", technologies: "", url: "" });
  const [saving, setSaving] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [formatDetected, setFormatDetected] = useState(false);
  const [rawExtractedText, setRawExtractedText] = useState("");

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
    setResume((prev) => ({
      ...(prev || {}),
      ...data,
    }));
    setUploadSuccess(true);
    setShowManualForm(true); // Show the form so user can review/edit
    toast.success("Resume uploaded successfully! Please review and edit if needed.");
  };

  // Handle format analysis from uploaded resume
  const handleFormatAnalyzed = (formatAnalysis) => {
    setOriginalFormat(formatAnalysis);
    setFormatDetected(true);
    setUseOriginalFormat(true); // Default to using original format
    toast.success(`Detected ${formatAnalysis.layoutStyle} layout with ${formatAnalysis.contentDensity} content`);
  };

  // Handle raw text when AI parsing fails
  const handleRawText = (text) => {
    setRawExtractedText(text);
  };

  const handleFileUploaded = (file) => {
    setUploadedPdf(file);
  };

  // Load saved profile on mount
  useEffect(() => {
    const loadSavedProfile = async () => {
      try {
        const userData = await fetchProfile();
        if (userData?.profile) {
          // Merge saved profile with current profile (current takes precedence if user already entered data)
          setProfile(prev => ({
            ...prev,
            name: prev.name || userData.name || "",
            email: prev.email || userData.email || "",
            title: prev.title || userData.profile.title || "",
            phone: prev.phone || userData.profile.phone || "",
            location: prev.location || userData.profile.location || "",
            github: prev.github || userData.profile.github || "",
            linkedin: prev.linkedin || userData.profile.linkedin || "",
            leetcode: prev.leetcode || userData.profile.leetcode || "",
            summary: prev.summary || userData.profile.summary || "",
            skills: prev.skills?.length > 0 ? prev.skills : (userData.profile.skills || []),
            education: prev.education?.length > 0 ? prev.education : (userData.profile.education || []),
            achievements: prev.achievements?.length > 0 ? prev.achievements : (userData.profile.achievements || []),
            experience: prev.experience?.length > 0 ? prev.experience : (userData.profile.experience || []),
            projects: prev.projects?.length > 0 ? prev.projects : (userData.profile.projects || []),
          }));
        }
      } catch (err) {
        console.error("Failed to load saved profile:", err);
      }
    };
    
    if (user) {
      loadSavedProfile();
    }
  }, [user]);

  // Auto-save profile when continuing
  const handleContinue = async () => {
    if (!profile.name || !profile.email) {
      toast.error("Please fill in your name and email");
      return;
    }

    setSaving(true);
    try {
      await saveProfile(profile);
      toast.success("Profile saved!");
      onNext();
    } catch (err) {
      toast.error("Failed to save profile, but you can continue");
      onNext();
    } finally {
      setSaving(false);
    }
  };

  const update = (k, v) => setProfile(p => ({ ...p, [k]: v }));
  const addToArray = (key, val) => { if (val) setProfile(p => ({ ...p, [key]: [...(p[key] || []), val] })); };
  const removeFromArray = (key, idx) => setProfile(p => ({ ...p, [key]: p[key].filter((_, i) => i !== idx) }));

  return (
    <div className="space-y-6">
      {/* Choice Buttons */}
      {!showManualForm && !uploadSuccess && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 text-center">
            How would you like to fill your profile?
          </h3>
          
          {/* Upload Resume Option */}
          <button
            onClick={() => setShowManualForm(false)}
            className="w-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 border-2 border-blue-300 dark:border-blue-500/30 rounded-xl p-6 text-left hover:border-blue-500 dark:hover:border-blue-400 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Upload Resume PDF</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Auto-fill from your existing resume. We'll extract your information automatically.
                </p>
              </div>
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Manual Fill Option */}
          <button
            onClick={() => setShowManualForm(true)}
            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-6 text-left hover:border-slate-400 dark:hover:border-slate-500 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Fill Manually</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Enter your information step by step. Takes longer but gives you full control.
                </p>
              </div>
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
      )}

      {/* Resume Upload Section - Show when upload is selected or after successful upload */}
      {(!showManualForm || uploadSuccess) && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {uploadSuccess ? "Resume Uploaded Successfully" : "Auto-fill from Resume"}
            </h3>
            {uploadSuccess && (
              <span className="text-green-500 text-sm font-medium">✓ Extracted</span>
            )}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            {uploadSuccess 
              ? "Your resume has been parsed. Please review the information below and make any necessary edits."
              : "Upload your existing resume PDF and we'll automatically extract your information."}
          </p>
          <ResumeUpload 
            onExtracted={handleResumeExtracted} 
            onFormatAnalyzed={handleFormatAnalyzed}
            onRawText={handleRawText}
            onFileUploaded={handleFileUploaded}
          />
          
          {/* Format Preservation Toggle */}
          {formatDetected && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Original Format Detected
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {originalFormat.layoutStyle} • {originalFormat.contentDensity} • {originalFormat.colorScheme}
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useOriginalFormat}
                    onChange={(e) => setUseOriginalFormat(e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-green-700 dark:text-green-300">Use original format</span>
                </label>
              </div>
            </div>
          )}
          
          {/* Raw Text Display (when AI parsing fails) */}
          {rawExtractedText && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">
                Extracted Text (AI parsing unavailable)
              </p>
              <div className="max-h-32 overflow-y-auto text-xs text-amber-700 dark:text-amber-400 bg-white dark:bg-slate-800 p-2 rounded border border-amber-100 dark:border-amber-500/20">
                {rawExtractedText}
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                Please copy relevant information from above and fill in the form manually.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Toggle Button to Show/Hide Manual Form */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowManualForm(!showManualForm)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-2"
        >
          {showManualForm ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Hide Manual Form
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Fill Manually Instead
            </>
          )}
        </button>
      </div>

      {/* Manual Form - Collapsible */}
      {showManualForm && (
        <div className="space-y-6 animate-fade-in">
          <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wide">
              Contact Information
            </h3>
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
                <span key={i} className="badge bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 flex items-center gap-1">
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
              <div key={i} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2.5 mb-2 text-sm">
                <span className="text-slate-800 dark:text-slate-200"><b>{e.degree}</b> — {e.school}, {e.year}</span>
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
              <div key={i} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2 mb-2 text-sm">
                <span className="text-slate-800 dark:text-slate-200">{a}</span>
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
              <div key={i} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2.5 mb-2 text-sm">
                <span className="text-slate-800 dark:text-slate-200"><b>{e.role}</b> at {e.company}, {e.period}</span>
                <button onClick={() => removeFromArray("experience", i)} className="text-red-400 text-xs hover:text-red-600">Remove</button>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10 border border-purple-200 dark:border-purple-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="label !mb-0 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Projects
              </label>
            </div>
            
            {/* GitHub Fetch Button */}
            <GitHubProjectsFetcher
              username={profile.github}
              jdKeywords={[]}
              onProjectsFetched={(projects) => {
                setProfile(prev => ({ ...prev, projects: [...(prev.projects || []), ...projects] }));
              }}
              className="mb-4"
            />

            {/* Manual Project Add */}
            <div className="border-t border-purple-200 dark:border-purple-500/20 pt-3">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Or add manually:</p>
              <div className="space-y-2">
                <input 
                  value={tempProject.name || ""} 
                  onChange={e => setTempProject(p => ({ ...p, name: e.target.value }))}
                  placeholder="Project Name" 
                  className="input text-sm" 
                />
                <textarea 
                  value={tempProject.description || ""} 
                  onChange={e => setTempProject(p => ({ ...p, description: e.target.value }))}
                  placeholder="Description" 
                  rows={2}
                  className="input text-sm" 
                />
                <input 
                  value={tempProject.technologies || ""} 
                  onChange={e => setTempProject(p => ({ ...p, technologies: e.target.value }))}
                  placeholder="Technologies (comma-separated)" 
                  className="input text-sm" 
                />
                <input 
                  value={tempProject.url || ""} 
                  onChange={e => setTempProject(p => ({ ...p, url: e.target.value }))}
                  placeholder="GitHub/Project URL" 
                  className="input text-sm" 
                />
                <button 
                  onClick={() => { 
                    if (tempProject.name) { 
                      addToArray("projects", { 
                        ...tempProject, 
                        technologies: tempProject.technologies?.split(",").map(t => t.trim()).filter(Boolean) || [] 
                      }); 
                      setTempProject({ name: "", description: "", technologies: "", url: "" }); 
                    }
                  }} 
                  className="btn-secondary text-sm w-full"
                >
                  + Add Project
                </button>
              </div>
            </div>

            {/* Project List */}
            {(profile.projects || []).map((p, i) => (
              <div key={i} className="mt-3 bg-white dark:bg-slate-800 rounded-lg p-3 border border-purple-100 dark:border-purple-500/20">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">{p.name}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{p.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(Array.isArray(p.technologies)
                        ? p.technologies
                        : typeof p.technologies === "string"
                          ? p.technologies.split(",").map((t) => t.trim()).filter(Boolean)
                          : []).map((tech, j) => (
                        <span key={j} className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline mt-1 inline-block">
                        View Project →
                      </a>
                    )}
                  </div>
                  <button onClick={() => removeFromArray("projects", i)} className="text-red-400 text-xs hover:text-red-600 ml-2">Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Continue Button */}
      <button 
        onClick={handleContinue} 
        disabled={!profile.name || !profile.email || saving} 
        className="btn-primary w-full"
      >
        {saving ? "Saving..." : "Continue to Job Description →"}
      </button>
    </div>
  );
}