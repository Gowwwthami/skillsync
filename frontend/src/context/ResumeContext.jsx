import { createContext, useContext, useState } from "react";

const ResumeContext = createContext(null);

const initialProfile = {
  name: "", email: "", phone: "", location: "", title: "",
  github: "", linkedin: "", leetcode: "", summary: "",
  skills: [], education: [], achievements: [], experience: [], projects: [],
};

const initialFormatAnalysis = {
  sectionOrder: ["summary", "experience", "education", "skills", "projects"],
  layoutStyle: "single-column",
  emphasisStyle: "moderate",
  contentDensity: "standard",
  colorScheme: "monochrome",
};

export function ResumeProvider({ children }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState(initialProfile);
  const [jdText, setJdText] = useState("");
  const [jdData, setJdData] = useState(null);
  const [githubRepos, setGithubRepos] = useState([]);
  const [selectedRepos, setSelectedRepos] = useState([]);
  const [resume, setResume] = useState(null);
  const [uploadedPdf, setUploadedPdf] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("atsClassic");
  const [atsScore, setAtsScore] = useState(null);
  const [originalFormat, setOriginalFormat] = useState(initialFormatAnalysis);
  const [useOriginalFormat, setUseOriginalFormat] = useState(false);

  const reset = () => {
    setStep(0);
    setProfile(initialProfile);
    setJdText("");
    setJdData(null);
    setGithubRepos([]);
    setSelectedRepos([]);
    setResume(null);
    setUploadedPdf(null);
    setSelectedTemplate("atsClassic");
    setAtsScore(null);
    setOriginalFormat(initialFormatAnalysis);
    setUseOriginalFormat(false);
  };

  return (
    <ResumeContext.Provider value={{
      step, setStep,
      profile, setProfile,
      jdText, setJdText,
      jdData, setJdData,
      githubRepos, setGithubRepos,
      selectedRepos, setSelectedRepos,
      resume, setResume,
      uploadedPdf, setUploadedPdf,
      selectedTemplate, setSelectedTemplate,
      atsScore, setAtsScore,
      originalFormat, setOriginalFormat,
      useOriginalFormat, setUseOriginalFormat,
      reset,
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export const useResume = () => useContext(ResumeContext);