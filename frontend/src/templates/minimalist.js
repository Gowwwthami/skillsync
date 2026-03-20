export function renderMinimalist(r) {
  return `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:760px;margin:0 auto;padding:36px 48px;background:#fff;color:#111;font-size:12.5px;line-height:1.65">

  <!-- Header -->
  <div style="text-align:center;margin-bottom:20px;padding-bottom:16px;border-bottom:2px solid #111">
    <div style="font-size:24px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">${r.name || "Full Name"}</div>
    ${r.title ? `<div style="font-size:12px;color:#555;margin-top:3px;letter-spacing:.5px">${r.title}</div>` : ""}
    <div style="font-size:11px;color:#333;margin-top:6px">
      ${[r.email, r.phone, r.location, r.github ? `github.com/${r.github}` : "", r.linkedin].filter(Boolean).join("  |  ")}
    </div>
  </div>

  <!-- Summary -->
  ${r.summary ? `
  <div style="margin-bottom:16px">
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;border-bottom:1px solid #ccc;padding-bottom:3px;margin-bottom:6px">Professional Summary</div>
    <div style="font-size:12px;color:#222">${r.summary}</div>
  </div>` : ""}

  <!-- Skills -->
  <div style="margin-bottom:16px">
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;border-bottom:1px solid #ccc;padding-bottom:3px;margin-bottom:6px">Technical Skills</div>
    <div style="font-size:12px">${(r.skills || []).join("  ·  ")}</div>
  </div>

  <!-- Projects -->
  <div style="margin-bottom:16px">
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;border-bottom:1px solid #ccc;padding-bottom:3px;margin-bottom:8px">Projects</div>
    ${(r.projects || []).map(p => `
      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:baseline">
          <span style="font-weight:700;font-size:13px">${p.name}</span>
          <span style="font-size:10.5px;color:#666">${p.period || ""}</span>
        </div>
        <div style="font-size:11px;color:#444;margin:2px 0">${(p.tech || []).join(", ")}</div>
        <ul style="margin:4px 0 0;padding-left:18px">
          ${(p.bullets || []).map(b => `<li style="margin-bottom:2px;font-size:12px">${b}</li>`).join("")}
        </ul>
      </div>`).join("")}
  </div>

  <!-- Experience -->
  ${(r.experience || []).length ? `
  <div style="margin-bottom:16px">
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;border-bottom:1px solid #ccc;padding-bottom:3px;margin-bottom:8px">Work Experience</div>
    ${(r.experience || []).map(e => `
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between">
          <span style="font-weight:700">${e.role}</span>
          <span style="font-size:10.5px;color:#666">${e.period}</span>
        </div>
        <div style="font-size:11px;color:#444;margin-bottom:3px">${e.company}</div>
        <ul style="margin:0;padding-left:18px">
          ${(e.bullets || [e.description || ""]).map(b => `<li style="font-size:12px;margin-bottom:2px">${b}</li>`).join("")}
        </ul>
      </div>`).join("")}
  </div>` : ""}

  <!-- Bottom row -->
  <div style="display:flex;gap:40px;margin-top:4px">
    <div style="flex:1">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;border-bottom:1px solid #ccc;padding-bottom:3px;margin-bottom:8px">Education</div>
      ${(r.education || []).map(e => `
        <div style="margin-bottom:6px">
          <div style="font-weight:700;font-size:12px">${e.degree}</div>
          <div style="font-size:11px;color:#444">${e.school}  |  ${e.year}</div>
        </div>`).join("")}
    </div>
    ${(r.achievements || []).length ? `
    <div style="flex:1">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;border-bottom:1px solid #ccc;padding-bottom:3px;margin-bottom:8px">Achievements</div>
      <ul style="margin:0;padding-left:16px">
        ${(r.achievements || []).map(a => `<li style="font-size:11.5px;margin-bottom:3px">${a}</li>`).join("")}
      </ul>
    </div>` : ""}
  </div>
</div>`;
}