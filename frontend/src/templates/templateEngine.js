import { renderModern } from "./modern";
import { renderMinimalist } from "./minimalist";
import { renderElegant } from "./elegant";

const renderers = { modern: renderModern, minimalist: renderMinimalist, elegant: renderElegant };

export function renderTemplate(templateId, resumeData) {
  const renderer = renderers[templateId] || renderModern;
  return renderer(resumeData);
}