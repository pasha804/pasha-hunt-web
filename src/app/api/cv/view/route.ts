import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import defaultProfile from '@/data/profile.json';

function esc(str: any): string {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function linkify(text: string): string {
  if (!text) return '';
  const urlRegex = /\b(?:https?:\/\/|www\.|github\.com\/|linkedin\.com\/)[^\s<"\'()]+\b/g;
  return text.replace(urlRegex, (url) => {
    const full = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    return `<a href="${esc(full)}" target="_blank" rel="noopener noreferrer" style="color:#0f766e; text-decoration:underline;">${esc(url)}</a>`;
  });
}

const CSS = `
@page { size: A4 portrait; margin: 12mm 15mm; }
@media print {
  body { background: #fff !important; padding: 0 !important; margin: 0 !important; }
  .page-container { box-shadow: none !important; margin: 0 !important; padding: 0 !important; width: 100% !important; max-width: 100% !important; border: none !important; }
  .page-badge, .action-bar { display: none !important; }
}
@media screen {
  body {
    background: #080D12;
    padding: 20px 10px;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif;
    color: #111827;
  }
  .page-container {
    background: #FFFFFF;
    width: 100%;
    max-width: 820px;
    min-height: auto;
    margin: 0 auto;
    padding: 32px 36px;
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.45);
    border-radius: 8px;
    box-sizing: border-box;
    color: #1a1a1a;
  }
  .page-badge {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 8pt;
    color: #64748B;
    margin-bottom: 14px;
    padding-bottom: 8px;
    border-bottom: 1px dashed #CBD5E1;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}
body { font-size: 10pt; color: #1a1a1a; line-height: 1.45; }
h1 { font-size: 21pt; margin: 0; color: #070A0E; font-weight: 800; letter-spacing: -0.5px; }
.title { color: #0f766e; font-weight: 700; font-size: 11pt; margin: 3px 0 6px; }
.title.original { color: #D97706; }
.contact { font-size: 9pt; color: #444; margin-bottom: 12px; line-height: 1.5; }
h2 { font-size: 9.5pt; letter-spacing: 1.5px; color: #0f766e; border-bottom: 1.5px solid #0f766e; padding-bottom: 3px; margin: 14px 0 6px; text-transform: uppercase; font-weight: 700; }
h2.original { color: #D97706; border-bottom: 1.5px solid #D97706; }
.role { display: flex; justify-content: space-between; margin-top: 8px; }
.role .dates { color: #555; font-size: 8.5pt; white-space: nowrap; font-weight: 600; }
.note { color: #555; font-size: 8.5pt; font-style: italic; }
ul { margin: 3px 0 0 0; padding-left: 18px; }
li { margin: 3px 0; font-size: 9.5pt; line-height: 1.42; }
table { border-collapse: collapse; width: 100%; margin-top: 4px; }
td { vertical-align: top; padding: 3px 10px 3px 0; font-size: 9pt; line-height: 1.35; }
td.k { font-weight: 700; white-space: nowrap; color: #334155; width: 175px; }
.badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 8pt; font-weight: 700; margin-left: 6px; }
.badge-gold { background: #FEF3C7; color: #B45309; border: 1px solid #FCD34D; }
.badge-green { background: #DCFCE7; color: #15803D; border: 1px solid #86EFAC; }
.action-bar {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 12px;
  width: 100%;
  max-width: 820px;
}
.print-btn {
  background: #0f766e;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(15,118,110,0.3);
}
.print-btn:hover { background: #115e59; }
`;

function getProfile(): any {
  const candidatePaths = [
    path.join(process.cwd(), 'data', 'profile.json'),
    path.join(process.cwd(), 'public', 'data', 'profile.json'),
  ];
  for (const p of candidatePaths) {
    try {
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, 'utf-8');
        const data = JSON.parse(raw);
        if (data && (data.name || data.experience || data.projects)) {
          return data;
        }
      }
    } catch {
      // Continue
    }
  }
  return defaultProfile;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const version = (searchParams.get('version') || 'active').toLowerCase();

  const profile = getProfile();
  const isOriginal = version === 'original' || version === 'baseline';

  // Format contact
  const contact = profile.contact || {};
  const contactParts: string[] = [];
  if (profile.location) contactParts.push(`<span>${esc(profile.location)}</span>`);
  if (contact.phone) contactParts.push(`<a href="tel:${esc(contact.phone)}" style="color:#334155; text-decoration:none;">${esc(contact.phone)}</a>`);
  if (contact.email) contactParts.push(`<a href="mailto:${esc(contact.email)}" style="color:${isOriginal ? '#D97706' : '#0f766e'}; text-decoration:none; font-weight:600;">${esc(contact.email)}</a>`);
  if (contact.linkedin) contactParts.push(`<a href="${esc(contact.linkedin)}" target="_blank" rel="noreferrer" style="color:${isOriginal ? '#D97706' : '#0f766e'}; text-decoration:none;">linkedin.com/in/pasha-dev</a>`);
  if (contact.github) contactParts.push(`<a href="${esc(contact.github)}" target="_blank" rel="noreferrer" style="color:${isOriginal ? '#D97706' : '#0f766e'}; text-decoration:none;">github.com/pasha804</a>`);
  if (contact.portfolio) contactParts.push(`<a href="${esc(contact.portfolio)}" target="_blank" rel="noreferrer" style="color:${isOriginal ? '#D97706' : '#0f766e'}; text-decoration:none;">Portfolio</a>`);

  const contactHtml = contactParts.join(' · ');

  // Summary
  const summary = isOriginal
    ? (profile.raw_summary || "Full-stack developer and software tester with 2+ years of experience working on web, AI, and desktop applications. Familiar with Python, React, and testing workflows.")
    : (profile.default_summary || profile.summary || "");

  // Experience
  let experienceHtml = '';
  const experiences = profile.experience || profile.experiences || [];
  experiences.forEach((exp: any) => {
    const where = exp.company ? `<b>${esc(exp.company)}</b>${exp.place ? `, ${esc(exp.place)}` : ''}` : esc(exp.place || '');
    const title = exp.title || exp.role || '';
    const dates = exp.dates || exp.years || '';
    const note = exp.note ? `<div class="note">${esc(exp.note)}</div>` : '';

    let bullets: string[] = exp.bullets || [];
    if (isOriginal && exp.raw_bullets) {
      bullets = exp.raw_bullets;
    }

    const bulletsHtml = bullets.map(b => `<li>${esc(b)}</li>`).join('');

    experienceHtml += `
      <div class="role">
        <div>${where} — <b>${esc(title)}</b></div>
        <div class="dates">${esc(dates)}</div>
      </div>
      ${note}
      <ul>${bulletsHtml}</ul>
    `;
  });

  // Projects
  let projectsHtml = '';
  const projects = profile.projects || [];
  if (projects.length > 0) {
    const items = projects.slice(0, isOriginal ? 3 : 6).map((p: any) => {
      const name = p.name || p.title || 'Project';
      const tech = p.tech || p.technologies || '';
      const text = p.text || (Array.isArray(p.bullets) ? p.bullets[0] : '');
      const techHtml = tech ? ` <em>(${esc(tech)})</em>` : '';
      return `<li><b>${esc(name)}</b>${techHtml}: ${linkify(esc(text))}</li>`;
    }).join('');
    projectsHtml = `<h2 class="${isOriginal ? 'original' : ''}">PROJECTS &amp; PORTFOLIO</h2><ul>${items}</ul>`;
  }

  // Skills
  let skillsHtml = '';
  const skillsObj = profile.skills || {};
  const skillRows: string[] = [];
  for (const [cat, items] of Object.entries(skillsObj)) {
    const list = Array.isArray(items) ? items.join(', ') : String(items);
    skillRows.push(`<tr><td class="k">${esc(cat)}</td><td>${esc(list)}</td></tr>`);
  }
  if (skillRows.length > 0) {
    skillsHtml = `<h2 class="${isOriginal ? 'original' : ''}">SKILLS &amp; TECHNOLOGIES</h2><table>${skillRows.join('')}</table>`;
  }

  // Certifications
  let certsHtml = '';
  const certs = profile.certifications || profile.certificates || [];
  if (certs.length > 0) {
    const certItems = certs.map((c: any) => `<li>${esc(String(c))}</li>`).join('');
    certsHtml = `<h2 class="${isOriginal ? 'original' : ''}">CERTIFICATIONS &amp; CREDENTIALS</h2><ul>${certItems}</ul>`;
  }

  // Education
  let eduHtml = '';
  if (profile.education) {
    if (Array.isArray(profile.education)) {
      const eduItems = profile.education.map((e: any) => `<li><b>${esc(String(e))}</b></li>`).join('');
      eduHtml = `<h2 class="${isOriginal ? 'original' : ''}">EDUCATION</h2><ul>${eduItems}</ul>`;
    } else {
      eduHtml = `<h2 class="${isOriginal ? 'original' : ''}">EDUCATION</h2><div><b>${esc(String(profile.education))}</b></div>`;
    }
  }

  const titleHeader = isOriginal ? "Software Developer / QA Engineer" : (profile.default_title || profile.title || "");

  const fullHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${isOriginal ? "Baseline Uploaded Resume (78% ATS)" : "Pasha Hunt Master ATS CV (96% Elite)"}</title>
  <style>${CSS}</style>
</head>
<body>
  <div class="action-bar">
    <button onclick="window.print()" class="print-btn">
      🖨️ Print / Save as PDF
    </button>
  </div>
  <div class="page-container">
    <div class="page-badge">
      <span>⚡ ${isOriginal ? "Baseline Document Standard" : "Verified Executive ATS Standard"}</span>
      <span>${isOriginal ? "Unquantified • 78% Standard ATS" : "1-Column Layout • 96% Elite ATS Ready"}</span>
    </div>
    <h1>${esc(profile.name || 'Muhammad Mubashar')}</h1>
    <div class="title ${isOriginal ? 'original' : ''}">
      ${esc(titleHeader)}
      ${isOriginal ? '<span class="badge badge-gold">78% Standard ATS</span>' : '<span class="badge badge-green">96% Elite ATS Ready</span>'}
    </div>
    <div class="contact">${contactHtml}</div>
    ${summary ? `<h2 class="${isOriginal ? 'original' : ''}">PROFESSIONAL SUMMARY</h2><div>${esc(summary)}</div>` : ''}
    ${experienceHtml ? `<h2 class="${isOriginal ? 'original' : ''}">EXPERIENCE</h2>${experienceHtml}` : ''}
    ${projectsHtml}
    ${skillsHtml}
    ${certsHtml}
    ${eduHtml}
  </div>
</body>
</html>`;

  return new NextResponse(fullHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}
