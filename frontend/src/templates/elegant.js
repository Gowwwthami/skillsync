export function renderElegant(r) {
  return `
<div style="font-family:Georgia,serif;max-width:780px;margin:0 auto;padding:34px 48px;background:#fffdf9;color:#1a1a1a;font-size:12.5px;line-height:1.7">

  <!-- Header -->
  <div style="border-bottom:3px double #7c3aed;padding-bottom:16px;margin-bottom:20px">
    <div style="font-size:30px;font-weight:400;letter-spacing:2.5px;color:#3b0764">${r.name || "Full Name"}</div>
    ${r.title ? `<div style="font-size:13px;color:#7c3aed;font-style:italic;margin-top:3px">${r.title}</div>` : ""}
    <div style="margin-top:8px;font-size:11px;color:#555;letter-spacing:.3px">
      ${[r.email, r.phone, r.location, r.github ? `github.com/${r.github}` : "", r.linkedin].filter(Boolean).join("   •   ")}
    </div>
  </div>

  <!-- Summary -->
  ${r.summary ? `<p style="font-style:italic;color:#374151;margin:0 0 20px;font-size:12.5px;border-left:3px solid #7c3aed;padding-left:12px">${r.summary}</p>` : ""}

  <!-- Projects -->
  <div style="margin-bottom:20px">
    <div style="font-size:11px;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px">Projects & Work</div>
    ${(r.projects || []).map(p => `
      <div style="margin-bottom:14px;padding-bottom:14px;border-bottom:1px dotted #e9d5ff">
        <div style="display:flex;justify-content:space-between;align-items:baseline">
          <span style="font-weight:700;font-size:13.5px;color:#1a1a1a">${p.name}</span>
          <span style="font-size:10.5px;color:#7c3aed;font-style:italic">${p.period || ""}</span>
        </div>
        <div style="font-size:11px;color:#6d28d9;margin:3px 0">${(p.tech || []).join("  ·  ")}</div>
        <ul style="margin:5px 0 0;padding-left:18px;color:#374151">
          ${(p.bullets || []).map(b => `<li style="margin-bottom:3px;font-size:12px">${b}</li>`).join("")}
        </ul>
      </div>`).join("")}
  </div>

  <!-- 2-column bottom -->
  <div style="display:flex;gap:36px">
    <div style="flex:1.4">
      ${(r.experience || []).length ? `
      <div style="margin-bottom:16px">
        <div style="font-size:11px;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Experience</div>
        ${(r.experience || []).map(e => `
          <div style="margin-bottom:10px">
            <div style="display:flex;justify-content:space-between">
              <span style="font-weight:700">${e.role}</span>
              <span style="font-size:10.5px;color:#888;font-style:italic">${e.period}</span>
            </div>
            <div style="font-size:11px;color:#6d28d9;margin-bottom:2px">${e.company}</div>
            <ul style="margin:0;padding-left:16px">
              ${(e.bullets || [e.description || ""]).map(b => `<li style="font-size:12px;margin-bottom:2px;color:#374151">${b}</li>`).join("")}
            </ul>
          </div>`).join("")}
      </div>` : ""}
    </div>

    <div style="flex:1">
      <div style="margin-bottom:16px">
        <div style="font-size:11px;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Skills</div>
        <div style="color:#374151;font-size:12px;line-height:1.8">${(r.skills || []).join("  ·  ")}</div>
      </div>

      <div style="margin-bottom:16px">
        <div style="font-size:11px;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Education</div>
        ${(r.education || []).map(e => `
          <div style="margin-bottom:6px">
            <div style="font-weight:700;font-size:12px">${e.degree}</div>
            <div style="font-size:11px;color:#555;font-style:italic">${e.school}</div>
            <div style="font-size:10.5px;color:#888">${e.year}${e.gpa ? `  ·  GPA: ${e.gpa}` : ""}</div>
          </div>`).join("")}
      </div>

      ${(r.achievements || []).length ? `
      <div>
        <div style="font-size:11px;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Awards</div>
        <ul style="margin:0;padding-left:16px">
          ${(r.achievements || []).map(a => `<li style="font-size:11.5px;margin-bottom:4px;color:#374151">${a}</li>`).join("")}
        </ul>
      </div>` : ""}
    </div>
  </div>
</div>`;
}