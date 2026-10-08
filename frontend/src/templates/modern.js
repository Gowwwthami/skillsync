export function renderModern(r) {
  return `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:800px;margin:0 auto;background:#fff;color:#000;font-size:11pt;line-height:1.4;min-height:297mm">
  <!-- Header -->
  <div style="background:#1d4ed8;color:#fff;padding:24px 32px 20px">
    <h1 style="font-size:24pt;font-weight:bold;letter-spacing:0.5px;margin:0;color:#fff;font-family:Arial,Helvetica,sans-serif">${r.name || "Full Name"}</h1>
    <div style="font-size:12pt;font-weight:500;margin-top:4px;color:#fff">${r.title || ""}</div>
    <div style="margin-top:8px;font-size:10pt;color:#fff;display:flex;flex-wrap:wrap;gap:0 16px">
      ${r.email ? `<span>Email: ${r.email}</span>` : ""}
      ${r.phone ? `<span>Phone: ${r.phone}</span>` : ""}
      ${r.location ? `<span>Location: ${r.location}</span>` : ""}
      ${r.github ? `<span>GitHub: github.com/${r.github}</span>` : ""}
      ${r.linkedin ? `<span>LinkedIn: ${r.linkedin}</span>` : ""}
    </div>
  </div>

  <!-- Body: 2-column -->
  <div style="display:flex">
    <!-- Main column (65%) -->
    <div style="width:63%;padding:20px 18px 20px 24px;border-right:1px solid #ccc">
      ${r.summary ? `
        <div style="margin-bottom:16px">
          <h2 style="font-size:11pt;font-weight:bold;color:#000;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;border-bottom:2px solid #1d4ed8;padding-bottom:4px;font-family:Arial,Helvetica,sans-serif">SUMMARY</h2>
          <p style="font-size:11pt;color:#000;line-height:1.5;margin:0">${r.summary}</p>
        </div>` : ""}

      <!-- Projects -->
      ${(r.projects || []).length ? `
      <div style="margin-bottom:16px">
        <h2 style="font-size:11pt;font-weight:bold;color:#000;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;border-bottom:2px solid #1d4ed8;padding-bottom:4px;font-family:Arial,Helvetica,sans-serif">PROJECTS</h2>
        ${(r.projects || []).map(p => `
          <div style="margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;align-items:baseline">
              <span style="font-weight:bold;font-size:11pt;color:#000">${p.name}</span>
              ${p.url ? `<a href="${p.url}" style="font-size:9pt;color:#1d4ed8;text-decoration:none">View →</a>` : ""}
            </div>
            <div style="font-size:10pt;color:#1d4ed8;margin:2px 0 4px">${(Array.isArray(p.technologies) ? p.technologies : typeof p.technologies === "string" ? p.technologies.split(",").map((t) => t.trim()).filter(Boolean) : []).join(", ")}</div>
            <p style="font-size:10.5pt;color:#000;margin:0 0 4px;line-height:1.4">${p.description || ""}</p>
            ${(p.highlights || []).length ? `
            <ul style="margin:0;padding-left:20px;color:#000">
              ${(p.highlights || []).map(b => `<li style="margin-bottom:2px;font-size:10pt;line-height:1.4">${b}</li>`).join("")}
            </ul>` : ""}
          </div>`).join("")}
      </div>` : ""}

      <!-- Experience -->
      ${(r.experience || []).length ? `
      <div>
        <h2 style="font-size:11pt;font-weight:bold;color:#000;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;border-bottom:2px solid #1d4ed8;padding-bottom:4px;font-family:Arial,Helvetica,sans-serif">EXPERIENCE</h2>
        ${(r.experience || []).map(e => `
          <div style="margin-bottom:12px">
            <div style="display:flex;justify-content:space-between">
              <span style="font-weight:bold;font-size:11pt;color:#000">${e.role}</span>
              <span style="font-size:10pt;color:#333">${e.period}</span>
            </div>
            <div style="font-size:10pt;color:#1d4ed8;margin-bottom:3px">${e.company}</div>
            <ul style="margin:0;padding-left:20px">
              ${(e.bullets || [e.description || ""]).map(b => `<li style="font-size:10.5pt;margin-bottom:2px;line-height:1.4">${b}</li>`).join("")}
            </ul>
          </div>`).join("")}
      </div>` : ""}
    </div>

    <!-- Sidebar (35%) -->
    <div style="width:37%;padding:20px 18px">
      <!-- Skills -->
      <div style="margin-bottom:16px">
        <h2 style="font-size:11pt;font-weight:bold;color:#000;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;border-bottom:2px solid #1d4ed8;padding-bottom:4px;font-family:Arial,Helvetica,sans-serif">SKILLS</h2>
        <p style="font-size:10.5pt;color:#000;line-height:1.6;margin:0">${(r.skills || []).join(", ")}</p>
      </div>

      <!-- Education -->
      <div style="margin-bottom:16px">
        <h2 style="font-size:11pt;font-weight:bold;color:#000;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;border-bottom:2px solid #1d4ed8;padding-bottom:4px;font-family:Arial,Helvetica,sans-serif">EDUCATION</h2>
        ${(r.education || []).map(e => `
          <div style="margin-bottom:8px">
            <div style="font-weight:bold;font-size:11pt;color:#000">${e.degree}</div>
            <div style="color:#333;font-size:10pt">${e.school}</div>
            <div style="color:#555;font-size:10pt">${e.year}${e.gpa ? ` | GPA: ${e.gpa}` : ""}</div>
          </div>`).join("")}
      </div>

      <!-- Achievements -->
      ${(r.achievements || []).length ? `
      <div>
        <h2 style="font-size:11pt;font-weight:bold;color:#000;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;border-bottom:2px solid #1d4ed8;padding-bottom:4px;font-family:Arial,Helvetica,sans-serif">ACHIEVEMENTS</h2>
        <ul style="margin:0;padding-left:18px">
          ${(r.achievements || []).map(a => `<li style="font-size:10.5pt;margin-bottom:4px;color:#000;line-height:1.4">${a}</li>`).join("")}
        </ul>
      </div>` : ""}
    </div>
  </div>
</div>`;
}