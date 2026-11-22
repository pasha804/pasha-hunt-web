import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
    return `<a href="${esc(full)}" target="_blank" style="color:#0f766e; text-decoration:underline;">${esc(url)}</a>`;
  });
}

const CSS = `
@page { size: A4; margin: 12mm 15mm; }
@media print {
  body { background: #fff !important; padding: 0 !important; margin: 0 !important; }
  .page-container { box-shadow: none !important; margin: 0 !important; padding: 0 !important; width: 100% !important; max-width: 100% !important; }
}
@media screen {
  body {
    background: #0B0F14;
    padding: 24px 12px;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif;
  }
  .page-container {
    background: #FFFFFF;
    width: 210mm;
    max-width: 100%;
    min-height: 297mm;
    margin: 0 auto;
    padding: 16mm 20mm;
    box-shadow: 0 10px 35px rgba(0,0,0,0.4);
    border-radius: 6px;
    box-sizing: border-box;
    color: #1a1a1a;
  }
}
body { font-size: 10pt; color: #1a1a1a; line-height: 1.45; }
h1 { font-size: 20pt; margin: 0; color: #070A0E; font-weight: 800; letter-spacing: -0.5px; }
.title { color: #0f766e; font-weight: 700; font-size: 11pt; margin: 2px 0 6px; }
.contact { font-size: 9pt; color: #444; margin-bottom: 12px; }
h2 { font-size: 9.5pt; letter-spacing: 1.5px; color: #0f766e; border-bottom: 1.5px solid #0f766e; padding-bottom: 2px; margin: 14px 0 6px; text-transform: uppercase; font-weight: 700; }
.role { display: flex; justify-content: space-between; margin-top: 8px; }
.role .dates { color: #555; font-size: 8.5pt; white-space: nowrap; font-weight: 600; }
.note { color: #555; font-size: 8.5pt; font-style: italic; }
ul { margin: 3px 0 0 0; padding-left: 18px; }
li { margin: 3px 0; font-size: 9.5pt; line-height: 1.4; }
table { border-collapse: collapse; width: 100%; margin-top: 4px; }
td { vertical-align: top; padding: 3px 10px 3px 0; font-size: 9pt; line-height: 1.35; }
td.k { font-weight: 700; white-space: nowrap; color: #334155; width: 175px; }
.badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 8pt; font-weight: 700; margin-left: 6px; }
.badge-gold { background: #FEF3C7; color: #D97706; }
.badge-green { background: #DCFCE7; color: #15803D; }
`;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const version = (searchParams.get('version') || 'active').toLowerCase();

  let profile: any = {};
  try {
    const pPath = path.join(process.cwd(), 'data', 'profile.json');
    if (fs.existsSync(pPath)) {
      profile = JSON.parse(fs.readFileSync(pPath, 'utf-8'));
    }
  } catch (e) {
    profile = {};
  }

  const isOriginal = version === 'original' || version === 'baseline';

  // Format contact
  const contact = profile.contact || {};
  const contactParts: string[] = [];
  if (profile.location) contactParts.push(`<span>${esc(profile.location)}</span>`);
  if (contact.phone) contactParts.push(`<a href="tel:${esc(contact.phone)}" style="color:#334155; text-decoration:none;">${esc(contact.phone)}</a>`);
  if (contact.email) contactParts.push(`<a href="mailto:${esc(contact.email)}" style="color:#0f766e; text-decoration:none; font-weight:600;">${esc(contact.email)}</a>`);
  if (contact.linkedin) contactParts.push(`<a href="${esc(contact.linkedin)}" target="_blank" style="color:#0f766e; text-decoration:none;">LinkedIn</a>`);
  if (contact.github) contactParts.push(`<a href="${esc(contact.github)}" target="_blank" style="color:#0f766e; text-decoration:none;">GitHub</a>`);
  if (contact.portfolio) contactParts.push(`<a href="${esc(contact.portfolio)}" target="_blank" style="color:#0f766e; text-decoration:none;">Portfolio</a>`);

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
    const items = projects.slice(0, isOriginal ? 3 : 5).map((p: any) => {
      const name = p.name || p.title || 'Project';
      const tech = p.tech || p.technologies || '';
      const text = p.text || (Array.isArray(p.bullets) ? p.bullets[0] : '');
      const techHtml = tech ? ` <em>(${esc(tech)})</em>` : '';
      return `<li><b>${esc(name)}</b>${techHtml}: ${linkify(esc(text))}</li>`;
    }).join('');
    projectsHtml = `<h2>PROJECTS &amp; PORTFOLIO</h2><ul>${items}</ul>`;
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
    skillsHtml = `<h2>SKILLS &amp; TECHNOLOGIES</h2><table>${skillRows.join('')}</table>`;
  }

  // Certifications
  let certsHtml = '';
  const certs = profile.certifications || profile.certificates || [];
  if (certs.length > 0) {
    const certItems = certs.map((c: any) => `<li>${esc(String(c))}</li>`).join('');
    certsHtml = `<h2>CERTIFICATIONS &amp; CREDENTIALS</h2><ul>${certItems}</ul>`;
  }

  // Education
  let eduHtml = '';
  if (profile.education) {
    if (Array.isArray(profile.education)) {
      const eduItems = profile.education.map((e: any) => `<li><b>${esc(String(e))}</b></li>`).join('');
      eduHtml = `<h2>EDUCATION</h2><ul>${eduItems}</ul>`;
    } else {
      eduHtml = `<h2>EDUCATION</h2><div><b>${esc(String(profile.education))}</b></div>`;
    }
  }

  const titleHeader = isOriginal ? "Software Developer / QA Engineer" : (profile.default_title || profile.title || "");

  const fullHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${isOriginal ? "Baseline Uploaded Resume" : "Pasha Hunt Master ATS CV (96% Elite)"}</title>
  <style>${CSS}</style>
</head>
<body>
  <div class="page-container">
    <h1>${esc(profile.name || 'Muhammad Mubashar')}</h1>
    <div class="title">
      ${esc(titleHeader)}
      ${isOriginal ? '<span class="badge badge-gold">78% Standard ATS</span>' : '<span class="badge badge-green">96% Elite ATS Ready</span>'}
    </div>
    <div class="contact">${contactHtml}</div>
    ${summary ? `<h2>PROFESSIONAL SUMMARY</h2><div>${esc(summary)}</div>` : ''}
    ${experienceHtml ? `<h2>EXPERIENCE</h2>${experienceHtml}` : ''}
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
