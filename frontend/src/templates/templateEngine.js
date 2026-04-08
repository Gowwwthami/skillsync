import { renderModern } from "./modern";
import { renderMinimalist } from "./minimalist";
import { renderElegant } from "./elegant";
import { renderOriginalFormat } from "./originalFormat";
import { renderATSClassic } from "./atsClassic";

const renderers = { atsClassic: renderATSClassic, modern: renderModern, minimalist: renderMinimalist, elegant: renderElegant, original: renderOriginalFormat };

export function renderTemplate(templateId, resumeData, formatAnalysis = null) {
  if (templateId === "original" && formatAnalysis) {
    return renderOriginalFormat(resumeData, formatAnalysis);
  }
  const renderer = renderers[templateId] || renderModern;
  return renderer(resumeData);
}

export { renderOriginalFormat };