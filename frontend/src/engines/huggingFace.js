// ─────────────────────────────────────────────────────────────
// Hugging Face — Keyword & Skill Extraction
// Model: ml6team/keyphrase-extraction-distilbert-inspec
// What it does:
//   - Reads raw resume text
//   - Returns keyphrases the model thinks are important
//   - We then match these against ATS term lists
// ─────────────────────────────────────────────────────────────

const HF_API    = "https://api-inference.huggingface.co/models";
const HF_MODEL  = "ml6team/keyphrase-extraction-distilbert-inspec";

// Known tech skills for detection
const TECH_SKILLS = [
  "javascript","typescript","python","java","c++","c#","go","rust","ruby","php",
  "react","vue","angular","next.js","node.js","express","django","flask","spring",
  "mongodb","postgresql","mysql","redis","elasticsearch","firebase",
  "aws","gcp","azure","docker","kubernetes","terraform","ci/cd","jenkins","github actions",
  "machine learning","deep learning","tensorflow","pytorch","scikit-learn","pandas","numpy",
  "rest api","graphql","microservices","websocket","oauth","jwt",
  "git","linux","bash","agile","scrum","jira",
];

// Terms ATS systems specifically look for
const ATS_IMPORTANT_TERMS = [
  "led","managed","developed","built","designed","implemented","optimized",
  "increased","decreased","reduced","improved","achieved","delivered","launched",
  "collaborated","mentored","architected","automated","streamlined","scaled",
  "cross-functional","stakeholder","end-to-end","full-stack","production",
  "performance","scalability","reliability","security","compliance",
];

// ── Main extraction function ───────────────────────────────────
export async function extractKeywordsFromResume(resumeText) {
  const key = import.meta.env.VITE_HUGGINGFACE_KEY;

  if (!key) throw new Error("VITE_HUGGINGFACE_KEY missing from .env");

  // Hugging Face has a 512 token limit — split into chunks if needed
  const chunks  = chunkText(resumeText, 400);
  const results = [];

  for (const chunk of chunks) {
    try {
      const res = await fetch(`${HF_API}/${HF_MODEL}`, {
        method:  "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type":  "application/json",
        },
        body: JSON.stringify({ inputs: chunk }),
      });

      // Model may be loading — wait and retry once
      if (res.status === 503) {
        await sleep(3000);
        const retry = await fetch(`${HF_API}/${HF_MODEL}`, {
          method:  "POST",
          headers: {
            "Authorization": `Bearer ${key}`,
            "Content-Type":  "application/json",
          },
          body: JSON.stringify({ inputs: chunk }),
        });
        if (retry.ok) {
          const data = await retry.json();
          results.push(...(data || []));
        }
        continue;
      }

      if (!res.ok) {
        console.warn(`HF API error: ${res.status}`);
        continue;
      }

      const data = await res.json();
      results.push(...(data || []));
    } catch (err) {
      console.warn("HF chunk error:", err.message);
    }
  }

  return processHFResults(results, resumeText);
}

// ── Process raw HF output into structured data ─────────────────
function processHFResults(rawResults, resumeText) {
  const textLower = resumeText.toLowerCase();

  // Extract keyphrases from HF model output
  // HF returns array of {word, score} or token classification format
  const keyphrases = rawResults
    .filter(item => item.score > 0.5)
    .map(item => (item.word || item.entity_group || "").toLowerCase().trim())
    .filter(phrase => phrase.length > 2)
    .filter((phrase, idx, arr) => arr.indexOf(phrase) === idx); // deduplicate

  // Detect tech skills by scanning resume text directly
  const detectedSkills = TECH_SKILLS.filter(skill =>
    textLower.includes(skill.toLowerCase())
  );

  // Find ATS terms present in the resume
  const atsTermsFound = ATS_IMPORTANT_TERMS.filter(term =>
    textLower.includes(term.toLowerCase())
  );

  // Combine HF keyphrases with skill detection
  const allKeywords = [
    ...new Set([
      ...keyphrases,
      ...detectedSkills,
    ]),
  ].slice(0, 30);

  return {
    keyphrases,                          // From HF model
    detectedSkills,                      // Tech skills found in text
    atsTermsFound,                       // ATS action words found
    allKeywords,                         // Combined unique list
    skillCount:    detectedSkills.length,
    atsTermCount:  atsTermsFound.length,
    keywordDensity: calcKeywordDensity(resumeText, allKeywords),
  };
}

// ── Compare resume keywords against JD keywords ───────────────
export function compareKeywordsWithJD(resumeKeywords, jdKeywords) {
  const resumeSet = new Set(resumeKeywords.map(k => k.toLowerCase()));
  const jdSet     = jdKeywords.map(k => k.toLowerCase());

  const matched = jdSet.filter(k => resumeSet.has(k));
  const missing = jdSet.filter(k => !resumeSet.has(k));

  return {
    matched,
    missing,
    matchScore: Math.round((matched.length / Math.max(jdSet.length, 1)) * 100),
    coverage:   `${matched.length}/${jdSet.length} JD keywords found`,
  };
}

// ── Helpers ────────────────────────────────────────────────────
function chunkText(text, maxWords) {
  const words  = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += maxWords) {
    chunks.push(words.slice(i, i + maxWords).join(" "));
  }
  return chunks;
}

function calcKeywordDensity(text, keywords) {
  const wordCount = text.split(/\s+/).length;
  return Math.round((keywords.length / Math.max(wordCount, 1)) * 100);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}