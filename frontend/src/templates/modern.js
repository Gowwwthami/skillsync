export function renderModern(r) {
  return `
<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:800px;margin:0 auto;background:#fff;color:#1e293b;font-size:13px;line-height:1.55;min-height:297mm">
  <!-- Header -->
  <div style="background:linear-gradient(135deg,#1d4ed8,#2563eb);color:#fff;padding:28px 36px 22px">
    <div style="font-size:28px;font-weight:800;letter-spacing:.3px">${r.name || "Full Name"}</div>
    <div style="font-size:14px;font-weight:500;opacity:.85;margin-top:3px">${r.title || ""}</div>
    <div style="margin-top:8px;font-size:11.5px;opacity:.8;display:flex;flex-wrap:wrap;gap:0 16px">
      ${r.email ? `<span>✉ ${r.email}</span>` : ""}
      ${r.phone ? `<span>✆ ${r.phone}</span>` : ""}
      ${r.location ? `<span>⌖ ${r.location}</span>` : ""}
      ${r.github ? `<span>⌥ github.com/${r.github}</span>` : ""}
      ${r.linkedin ? `<span>in ${r.linkedin}</span>` : ""}
    </div>
  </div>

  <!-- Body: 2-column -->
  <div style="display:flex">
    <!-- Main column (65%) -->
    <div style="width:63%;padding:22px 20px 22px 28px;border-right:1px solid #e2e8f0">
      ${r.summary ? `
        <div style="margin-bottom:18px">
          <div style="font-size:10px;font-weight:800;color:#2563eb;letter-spacing:1.8px;text-transform:uppercase;margin-bottom:6px;border-bottom:2px solid #dbeafe;padding-bottom:4px">SUMMARY</div>
          <div style="font-size:12.5px;color:#374151;line-height:1.65">${r.summary}</div>
        </div>` : ""}

      <!-- Projects -->
      <div style="margin-bottom:18px">
        <div style="font-size:10px;font-weight:800;color:#2563eb;letter-spacing:1.8px;text-transform:uppercase;margin-bottom:10px;border-bottom:2px solid #dbeafe;padding-bottom:4px">PROJECTS</div>
        ${(r.projects || []).map(p => `
          <div style="margin-bottom:13px">
            <div style="display:flex;justify-content:space-between;align-items:baseline">
              <span style="font-weight:700;font-size:13px">${p.name}</span>
              <span style="font-size:10.5px;color:#64748b">${p.period || ""}</span>
            </div>
            <div style="font-size:11px;color:#2563eb;margin:2px 0 4px">${(p.tech || []).join(" · ")}</div>
            <ul style="margin:0;padding-left:15px;color:#374151">
              ${(p.bullets || []).map(b => `<li style="margin-bottom:2px;font-size:12px">${b}</li>`).join("")}
            </ul>
          </div>`).join("")}
      </div>

      <!-- Experience -->
      ${(r.experience || []).length ? `
      <div>
        <div style="font-size:10px;font-weight:800;color:#2563eb;letter-spacing:1.8px;text-transform:uppercase;margin-bottom:10px;border-bottom:2px solid #dbeafe;padding-bottom:4px">EXPERIENCE</div>
        ${(r.experience || []).map(e => `
          <div style="margin-bottom:12px">
            <div style="display:flex;justify-content:space-between">
              <span style="font-weight:700">${e.role}</span>
              <span style="font-size:10.5px;color:#64748b">${e.period}</span>
            </div>
            <div style="font-size:11px;color:#2563eb;margin-bottom:3px">${e.company}</div>
            <ul style="margin:0;padding-left:15px">
              ${(e.bullets || [e.description || ""]).map(b => `<li style="font-size:12px;margin-bottom:2px">${b}</li>`).join("")}
            </ul>
          </div>`).join("")}
      </div>` : ""}
    </div>

    <!-- Sidebar (35%) -->
    <div style="width:37%;padding:22px 20px">
      <!-- Skills -->
      <div style="margin-bottom:18px">
        <div style="font-size:10px;font-weight:800;color:#2563eb;letter-spacing:1.8px;text-transform:uppercase;margin-bottom:8px;border-bottom:2px solid #dbeafe;padding-bottom:4px">SKILLS</div>
        <div style="display:flex;flex-wrap:wrap;gap:4px">
          ${(r.skills || []).map(s => `<span style="background:#dbeafe;color:#1d4ed8;padding:2px 8px;border-radius:20px;font-size:10.5px;font-weight:500">${s}</span>`).join("")}
        </div>
      </div>

      <!-- Education -->
      <div style="margin-bottom:18px">
        <div style="font-size:10px;font-weight:800;color:#2563eb;letter-spacing:1.8px;text-transform:uppercase;margin-bottom:8px;border-bottom:2px solid #dbeafe;padding-bottom:4px">EDUCATION</div>
        ${(r.education || []).map(e => `
          <div style="margin-bottom:8px">
            <div style="font-weight:700;font-size:12px">${e.degree}</div>
            <div style="color:#475569;font-size:11px">${e.school}</div>
            <div style="color:#94a3b8;font-size:10.5px">${e.year}${e.gpa ? ` · GPA: ${e.gpa}` : ""}</div>
          </div>`).join("")}
      </div>

      <!-- Achievements -->
      ${(r.achievements || []).length ? `
      <div>
        <div style="font-size:10px;font-weight:800;color:#2563eb;letter-spacing:1.8px;text-transform:uppercase;margin-bottom:8px;border-bottom:2px solid #dbeafe;padding-bottom:4px">ACHIEVEMENTS</div>
        <ul style="margin:0;padding-left:14px">
          ${(r.achievements || []).map(a => `<li style="font-size:11.5px;margin-bottom:4px;color:#374151">${a}</li>`).join("")}
        </ul>
      </div>` : ""}
    </div>
  </div>
</div>`;
}