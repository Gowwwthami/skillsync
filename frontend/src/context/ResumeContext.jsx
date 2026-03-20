import { createContext, useContext, useState } from "react";

const ResumeContext = createContext(null);

const initialProfile = {
  name: "", email: "", phone: "", location: "", title: "",
  github: "", linkedin: "", leetcode: "", summary: "",
  skills: [], education: [], achievements: [], experience: [],
};

export function ResumeProvider({ children }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState(initialProfile);
  const [jdText, setJdText] = useState("");
  const [jdData, setJdData] = useState(null);
  const [githubRepos, setGithubRepos] = useState([]);
  const [selectedRepos, setSelectedRepos] = useState([]);
  const [resume, setResume] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [atsScore, setAtsScore] = useState(null);

  const reset = () => {
    setStep(0);
    setProfile(initialProfile);
    setJdText("");
    setJdData(null);
    setGithubRepos([]);
    setSelectedRepos([]);
    setResume(null);
    setSelectedTemplate("modern");
    setAtsScore(null);
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
      selectedTemplate, setSelectedTemplate,
      atsScore, setAtsScore,
      reset,
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export const useResume = () => useContext(ResumeContext);