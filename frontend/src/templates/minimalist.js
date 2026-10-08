export function renderMinimalist(r) {
  return `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:760px;margin:0 auto;padding:32px 40px;background:#fff;color:#000;font-size:11pt;line-height:1.5">

  <!-- Header -->
  <div style="text-align:center;margin-bottom:18px;padding-bottom:14px;border-bottom:2px solid #000">
    <h1 style="font-size:22pt;font-weight:bold;letter-spacing:1px;text-transform:uppercase;margin:0;color:#000;font-family:Arial,Helvetica,sans-serif">${r.name || "Full Name"}</h1>
    ${r.title ? `<div style="font-size:11pt;color:#333;margin-top:4px">${r.title}</div>` : ""}
    <div style="font-size:10pt;color:#000;margin-top:6px">
      ${[r.email, r.phone, r.location, r.github ? `github.com/${r.github}` : "", r.linkedin].filter(Boolean).join(" | ")}
    </div>
  </div>

  <!-- Summary -->
  ${r.summary ? `
  <div style="margin-bottom:14px">
    <h2 style="font-size:10pt;font-weight:bold;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #999;padding-bottom:3px;margin-bottom:6px;color:#000;font-family:Arial,Helvetica,sans-serif">Professional Summary</h2>
    <p style="font-size:11pt;color:#000;margin:0;line-height:1.5">${r.summary}</p>
  </div>` : ""}

  <!-- Skills -->
  <div style="margin-bottom:14px">
    <h2 style="font-size:10pt;font-weight:bold;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #999;padding-bottom:3px;margin-bottom:6px;color:#000;font-family:Arial,Helvetica,sans-serif">Technical Skills</h2>
    <p style="font-size:11pt;color:#000;margin:0">${(r.skills || []).join(", ")}</p>
  </div>

  <!-- Projects -->
  ${(r.projects || []).length ? `
  <div style="margin-bottom:14px">
    <h2 style="font-size:10pt;font-weight:bold;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #999;padding-bottom:3px;margin-bottom:8px;color:#000;font-family:Arial,Helvetica,sans-serif">Projects</h2>
    ${(r.projects || []).map(p => `
      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:baseline">
          <span style="font-weight:bold;font-size:11pt;color:#000">${p.name}</span>
          ${p.url ? `<span style="font-size:9pt;color:#333">${p.url.replace(/^https?:\/\//, "")}</span>` : ""}
        </div>
        <div style="font-size:10pt;color:#000;margin:2px 0">${(Array.isArray(p.technologies) ? p.technologies : typeof p.technologies === "string" ? p.technologies.split(",").map((t) => t.trim()).filter(Boolean) : []).join(", ")}</div>
        <p style="font-size:10.5pt;color:#000;margin:0 0 4px;line-height:1.4">${p.description || ""}</p>
        ${(p.highlights || []).length ? `
        <ul style="margin:4px 0 0;padding-left:20px">
          ${(p.highlights || []).map(b => `<li style="margin-bottom:2px;font-size:10pt;line-height:1.4">${b}</li>`).join("")}
        </ul>` : ""}
      </div>`).join("")}
  </div>` : ""}

  <!-- Experience -->
  ${(r.experience || []).length ? `
  <div style="margin-bottom:14px">
    <h2 style="font-size:10pt;font-weight:bold;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #999;padding-bottom:3px;margin-bottom:8px;color:#000;font-family:Arial,Helvetica,sans-serif">Work Experience</h2>
    ${(r.experience || []).map(e => `
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between">
          <span style="font-weight:bold;font-size:11pt;color:#000">${e.role}</span>
          <span style="font-size:10pt;color:#333">${e.period}</span>
        </div>
        <div style="font-size:10pt;color:#000;margin-bottom:3px">${e.company}</div>
        <ul style="margin:0;padding-left:20px">
          ${(e.bullets || [e.description || ""]).map(b => `<li style="font-size:10.5pt;margin-bottom:2px;line-height:1.4">${b}</li>`).join("")}
        </ul>
      </div>`).join("")}
  </div>` : ""}

  <!-- Bottom row -->
  <div style="display:flex;gap:40px;margin-top:4px">
    <div style="flex:1">
      <h2 style="font-size:10pt;font-weight:bold;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #999;padding-bottom:3px;margin-bottom:8px;color:#000;font-family:Arial,Helvetica,sans-serif">Education</h2>
      ${(r.education || []).map(e => `
        <div style="margin-bottom:6px">
          <div style="font-weight:bold;font-size:11pt;color:#000">${e.degree}</div>
          <div style="font-size:10pt;color:#000">${e.school} | ${e.year}</div>
        </div>`).join("")}
    </div>
    ${(r.achievements || []).length ? `
    <div style="flex:1">
      <h2 style="font-size:10pt;font-weight:bold;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #999;padding-bottom:3px;margin-bottom:8px;color:#000;font-family:Arial,Helvetica,sans-serif">Achievements</h2>
      <ul style="margin:0;padding-left:18px">
        ${(r.achievements || []).map(a => `<li style="font-size:10.5pt;margin-bottom:3px;line-height:1.4">${a}</li>`).join("")}
      </ul>
    </div>` : ""}
  </div>
</div>`;
}