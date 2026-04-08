export function renderElegant(r) {
  return `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:780px;margin:0 auto;padding:32px 44px;background:#fff;color:#000;font-size:11pt;line-height:1.5">

  <!-- Header -->
  <div style="border-bottom:2px solid #000;padding-bottom:14px;margin-bottom:18px">
    <h1 style="font-size:24pt;font-weight:bold;letter-spacing:1px;color:#000;margin:0;font-family:Arial,Helvetica,sans-serif">${r.name || "Full Name"}</h1>
    ${r.title ? `<div style="font-size:12pt;color:#333;margin-top:4px">${r.title}</div>` : ""}
    <div style="margin-top:8px;font-size:10pt;color:#000">
      ${[r.email, r.phone, r.location, r.github ? `github.com/${r.github}` : "", r.linkedin].filter(Boolean).join(" | ")}
    </div>
  </div>

  <!-- Summary -->
  ${r.summary ? `<p style="color:#000;margin:0 0 18px;font-size:11pt;border-left:3px solid #000;padding-left:12px;line-height:1.5">${r.summary}</p>` : ""}

  <!-- Projects -->
  ${(r.projects || []).length ? `
  <div style="margin-bottom:18px">
    <h2 style="font-size:10pt;font-weight:bold;color:#000;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;border-bottom:1px solid #999;padding-bottom:4px;font-family:Arial,Helvetica,sans-serif">Projects</h2>
    ${(r.projects || []).map(p => `
      <div style="margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid #ddd">
        <div style="display:flex;justify-content:space-between;align-items:baseline">
          <span style="font-weight:bold;font-size:11pt;color:#000">${p.name}</span>
          ${p.url ? `<span style="font-size:9pt;color:#333">${p.url.replace(/^https?:\/\//, "")}</span>` : ""}
        </div>
        <div style="font-size:10pt;color:#000;margin:3px 0">${(Array.isArray(p.technologies) ? p.technologies : typeof p.technologies === "string" ? p.technologies.split(",").map((t) => t.trim()).filter(Boolean) : []).join(", ")}</div>
        <p style="font-size:10.5pt;color:#000;margin:0 0 5px;line-height:1.4">${p.description || ""}</p>
        ${(p.highlights || []).length ? `
        <ul style="margin:5px 0 0;padding-left:20px;color:#000">
          ${(p.highlights || []).map(b => `<li style="margin-bottom:3px;font-size:10pt;line-height:1.4">${b}</li>`).join("")}
        </ul>` : ""}
      </div>`).join("")}
  </div>` : ""}

  <!-- 2-column bottom -->
  <div style="display:flex;gap:36px">
    <div style="flex:1.4">
      ${(r.experience || []).length ? `
      <div style="margin-bottom:16px">
        <h2 style="font-size:10pt;font-weight:bold;color:#000;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;border-bottom:1px solid #999;padding-bottom:4px;font-family:Arial,Helvetica,sans-serif">Experience</h2>
        ${(r.experience || []).map(e => `
          <div style="margin-bottom:10px">
            <div style="display:flex;justify-content:space-between">
              <span style="font-weight:bold;font-size:11pt;color:#000">${e.role}</span>
              <span style="font-size:10pt;color:#333">${e.period}</span>
            </div>
            <div style="font-size:10pt;color:#000;margin-bottom:2px">${e.company}</div>
            <ul style="margin:0;padding-left:18px">
              ${(e.bullets || [e.description || ""]).map(b => `<li style="font-size:10.5pt;margin-bottom:2px;color:#000;line-height:1.4">${b}</li>`).join("")}
            </ul>
          </div>`).join("")}
      </div>` : ""}
    </div>

    <div style="flex:1">
      <div style="margin-bottom:16px">
        <h2 style="font-size:10pt;font-weight:bold;color:#000;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;border-bottom:1px solid #999;padding-bottom:4px;font-family:Arial,Helvetica,sans-serif">Skills</h2>
        <p style="color:#000;font-size:11pt;line-height:1.6;margin:0">${(r.skills || []).join(", ")}</p>
      </div>

      <div style="margin-bottom:16px">
        <h2 style="font-size:10pt;font-weight:bold;color:#000;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;border-bottom:1px solid #999;padding-bottom:4px;font-family:Arial,Helvetica,sans-serif">Education</h2>
        ${(r.education || []).map(e => `
          <div style="margin-bottom:6px">
            <div style="font-weight:bold;font-size:11pt;color:#000">${e.degree}</div>
            <div style="font-size:10pt;color:#000">${e.school}</div>
            <div style="font-size:10pt;color:#333">${e.year}${e.gpa ? ` | GPA: ${e.gpa}` : ""}</div>
          </div>`).join("")}
      </div>

      ${(r.achievements || []).length ? `
      <div>
        <h2 style="font-size:10pt;font-weight:bold;color:#000;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;border-bottom:1px solid #999;padding-bottom:4px;font-family:Arial,Helvetica,sans-serif">Awards</h2>
        <ul style="margin:0;padding-left:18px">
          ${(r.achievements || []).map(a => `<li style="font-size:10.5pt;margin-bottom:4px;color:#000;line-height:1.4">${a}</li>`).join("")}
        </ul>
      </div>` : ""}
    </div>
  </div>
</div>`;
}