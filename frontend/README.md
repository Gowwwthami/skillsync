Resume Text + Job Description
         │
         ▼
┌─────────────────────────────────────────────────────┐
│  STEP 1: Hugging Face                               │
│  → Extract keyphrases from resume                   │
│  → Detect skills and tech stack                     │
│  → Find ATS-important terms                         │
│  Output: { keywords[], skills[], atsTerms[] }        │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  STEP 2: Groq (LLaMA/Mixtral)                       │
│  → Score resume vs job description (0-100)          │
│  → Find gaps between resume and JD                  │
│  → Generate structured feedback                     │
│  Output: { score, gaps[], feedback{} }              │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  STEP 3: Google Gemini                              │
│  → Rewrite weak bullets with action verbs           │
│  → Suggest missing skills to add                   │
│  → Recommend keywords for better ATS score         │
│  Output: { improvedBullets[], missingSkills[],      │
│            keywordSuggestions[] }                   │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
         Final ATS Score + Full Report
         Displayed on SkillSync Dashboard
         
# SkillSync 🎯

> Match your skills. Land your role.

AI-powered resume builder that analyzes any job description and generates
an ATS-optimized, tailored resume in under 60 seconds.

## Features
- 🤖 Claude AI — JD analysis + resume generation
- 🐙 GitHub integration — auto-pulls your best projects
- 📊 ATS Score Engine — keyword match, skill alignment, verb scoring
- 🎨 3 Resume Templates — Modern, Minimalist, Elegant
- 📥 PDF Export — print-ready, ATS-compliant

## Tech Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express + MongoDB
- AI: Anthropic Claude (claude-sonnet-4-20250514)
- Auth: JWT
- Deploy: Vercel (frontend) + Render (backend)

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free)
- Anthropic API key

### Installation
\`\`\`bash
# Clone
git clone https://github.com/YOUR_USERNAME/skillsync
cd skillsync

# Backend
cd backend && npm install
cp .env.example .env   # fill in your keys
npm run dev

# Frontend (new terminal)
cd frontend && npm install
cp .env.example .env   # fill in your keys
npm run dev
\`\`\`

## Live Demo
[skillsync.vercel.app](https://skillsync.vercel.app)

## License
MIT
```

---

### 10. Vercel Project Name
```
When deploying → Project Name field → type: skillsync
Your URL will be: skillsync.vercel.app
```

### 11. Render Service Name
```
When creating web service → Name field → type: skillsync-api
Your URL will be: skillsync-api.onrender.com