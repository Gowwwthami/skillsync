// Render resume using the original uploaded format
export function renderOriginalFormat(profile, formatAnalysis) {
  if (!profile) {
    return "<div style=\"font-family: Arial, Helvetica, sans-serif; padding: 24px; color: #666;\">Resume data not available.</div>";
  }
  const {
    sectionOrder = ["summary", "experience", "education", "skills", "projects"],
    layoutStyle = "single-column",
    emphasisStyle = "moderate",
    contentDensity = "standard",
    colorScheme = "monochrome"
  } = formatAnalysis || {};

  // Determine colors based on scheme
  const colors = {
    monochrome: { primary: "#000", secondary: "#333", accent: "#666", bg: "#fff" },
    "blue-accent": { primary: "#1d4ed8", secondary: "#333", accent: "#1d4ed8", bg: "#fff" },
    colored: { primary: "#2563eb", secondary: "#333", accent: "#7c3aed", bg: "#fff" }
  }[colorScheme] || colors.monochrome;

  // Determine font sizes based on content density
  const fontSizes = {
    brief: { name: "20pt", heading: "10pt", body: "10pt", small: "9pt" },
    standard: { name: "22pt", heading: "11pt", body: "11pt", small: "10pt" },
    detailed: { name: "24pt", heading: "12pt", body: "11pt", small: "10pt" }
  }[contentDensity] || fontSizes.standard;

  // Determine border style based on emphasis
  const borderStyle = {
    minimal: "border-bottom: 1px solid #ccc",
    moderate: "border-bottom: 2px solid " + colors.primary,
    heavy: "border: 2px solid " + colors.primary + "; padding: 8px"
  }[emphasisStyle] || borderStyle.moderate;

  // Render each section
  const renderSection = (sectionName) => {
    switch (sectionName) {
      case "summary":
        return profile.summary ? `
          <div style="margin-bottom: 16px">
            <h2 style="font-size: ${fontSizes.heading}; font-weight: bold; color: ${colors.primary}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; ${borderStyle}; padding-bottom: 4px; font-family: Arial, Helvetica, sans-serif">Professional Summary</h2>
            <p style="font-size: ${fontSizes.body}; color: ${colors.secondary}; line-height: 1.5; margin: 0">${profile.summary}</p>
          </div>` : "";

      case "experience":
        return (profile.experience || []).length ? `
          <div style="margin-bottom: 16px">
            <h2 style="font-size: ${fontSizes.heading}; font-weight: bold; color: ${colors.primary}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; ${borderStyle}; padding-bottom: 4px; font-family: Arial, Helvetica, sans-serif">Experience</h2>
            ${(profile.experience || []).map(e => `
              <div style="margin-bottom: 12px">
                <div style="display: flex; justify-content: space-between">
                  <span style="font-weight: bold; font-size: ${fontSizes.body}; color: ${colors.secondary}">${e.role}</span>
                  <span style="font-size: ${fontSizes.small}; color: ${colors.accent}">${e.period}</span>
                </div>
                <div style="font-size: ${fontSizes.small}; color: ${colors.primary}; margin-bottom: 3px">${e.company}</div>
                <p style="font-size: ${fontSizes.small}; color: ${colors.secondary}; margin: 0; line-height: 1.4">${e.description || ""}</p>
              </div>`).join("")}
          </div>` : "";

      case "education":
        return (profile.education || []).length ? `
          <div style="margin-bottom: 16px">
            <h2 style="font-size: ${fontSizes.heading}; font-weight: bold; color: ${colors.primary}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; ${borderStyle}; padding-bottom: 4px; font-family: Arial, Helvetica, sans-serif">Education</h2>
            ${(profile.education || []).map(e => `
              <div style="margin-bottom: 8px">
                <div style="font-weight: bold; font-size: ${fontSizes.body}; color: ${colors.secondary}">${e.degree}</div>
                <div style="font-size: ${fontSizes.small}; color: ${colors.secondary}">${e.school}</div>
                <div style="font-size: ${fontSizes.small}; color: ${colors.accent}">${e.year}${e.gpa ? ` | GPA: ${e.gpa}` : ""}</div>
              </div>`).join("")}
          </div>` : "";

      case "skills":
        return (profile.skills || []).length ? `
          <div style="margin-bottom: 16px">
            <h2 style="font-size: ${fontSizes.heading}; font-weight: bold; color: ${colors.primary}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; ${borderStyle}; padding-bottom: 4px; font-family: Arial, Helvetica, sans-serif">Skills</h2>
            <p style="font-size: ${fontSizes.body}; color: ${colors.secondary}; line-height: 1.6; margin: 0">${(profile.skills || []).join(", ")}</p>
          </div>` : "";

      case "projects":
        return (profile.projects || []).length ? `
          <div style="margin-bottom: 16px">
            <h2 style="font-size: ${fontSizes.heading}; font-weight: bold; color: ${colors.primary}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; ${borderStyle}; padding-bottom: 4px; font-family: Arial, Helvetica, sans-serif">Projects</h2>
            ${(profile.projects || []).map(p => `
              <div style="margin-bottom: 10px">
                <div style="display: flex; justify-content: space-between">
                  <span style="font-weight: bold; font-size: ${fontSizes.body}; color: ${colors.secondary}">${p.name}</span>
                  ${p.url ? `<span style="font-size: ${fontSizes.small}; color: ${colors.accent}">${p.url.replace(/^https?:\/\//, "")}</span>` : ""}
                </div>
                <div style="font-size: ${fontSizes.small}; color: ${colors.primary}; margin: 2px 0">${(Array.isArray(p.technologies) ? p.technologies : typeof p.technologies === "string" ? p.technologies.split(",").map((t) => t.trim()).filter(Boolean) : []).join(", ")}</div>
                <p style="font-size: ${fontSizes.small}; color: ${colors.secondary}; margin: 0; line-height: 1.4">${p.description || ""}</p>
              </div>`).join("")}
          </div>` : "";

      case "achievements":
        return (profile.achievements || []).length ? `
          <div style="margin-bottom: 16px">
            <h2 style="font-size: ${fontSizes.heading}; font-weight: bold; color: ${colors.primary}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; ${borderStyle}; padding-bottom: 4px; font-family: Arial, Helvetica, sans-serif">Achievements</h2>
            <ul style="margin: 0; padding-left: 20px">
              ${(profile.achievements || []).map(a => `<li style="font-size: ${fontSizes.small}; margin-bottom: 4px; color: ${colors.secondary}; line-height: 1.4">${a}</li>`).join("")}
            </ul>
          </div>` : "";

      default:
        return "";
    }
  };

  // Header section
  const header = `
    <div style="${layoutStyle === "sidebar-left" || layoutStyle === "sidebar-right" ? "display: flex; gap: 24px" : ""}">
      <div style="${layoutStyle === "sidebar-left" || layoutStyle === "sidebar-right" ? "flex: 1" : "text-align: center; margin-bottom: 18px; padding-bottom: 14px; border-bottom: 2px solid " + colors.primary}">
        <h1 style="font-size: ${fontSizes.name}; font-weight: bold; color: ${colors.secondary}; margin: 0; font-family: Arial, Helvetica, sans-serif">${profile.name || "Full Name"}</h1>
        ${profile.title ? `<div style="font-size: ${fontSizes.body}; color: ${colors.accent}; margin-top: 4px">${profile.title}</div>` : ""}
        <div style="font-size: ${fontSizes.small}; color: ${colors.secondary}; margin-top: 6px">
          ${[profile.email, profile.phone, profile.location, profile.github ? `github.com/${profile.github}` : "", profile.linkedin].filter(Boolean).join(" | ")}
        </div>
      </div>
    </div>
  `;

  // Render sections in the order they appeared in the original
  const sections = sectionOrder.map(renderSection).filter(Boolean).join("");

  // Layout wrapper
  if (layoutStyle === "two-column") {
    // Split sections into two columns
    const midPoint = Math.ceil(sectionOrder.length / 2);
    const leftSections = sectionOrder.slice(0, midPoint).map(renderSection).filter(Boolean).join("");
    const rightSections = sectionOrder.slice(midPoint).map(renderSection).filter(Boolean).join("");

    return `
      <div style="font-family: Arial, Helvetica, sans-serif; max-width: 800px; margin: 0 auto; padding: 32px 40px; background: ${colors.bg}; color: ${colors.secondary}; font-size: ${fontSizes.body}; line-height: 1.5">
        ${header}
        <div style="display: flex; gap: 32px; margin-top: 20px">
          <div style="flex: 1">${leftSections}</div>
          <div style="flex: 1">${rightSections}</div>
        </div>
      </div>`;
  }

  // Single column or sidebar layouts
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 800px; margin: 0 auto; padding: 32px 40px; background: ${colors.bg}; color: ${colors.secondary}; font-size: ${fontSizes.body}; line-height: 1.5">
      ${header}
      <div style="margin-top: 20px">
        ${sections}
      </div>
    </div>`;
}
