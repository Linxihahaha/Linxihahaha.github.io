// Builds the downloadable resume PDFs in assets/resume/ from the content below.
// Mirrors the Figma file "Linxi Li – Resume v2 (Recruiter Review)", frames "Resume v3 — …".
// Run: node _resume/build.mjs   (needs Google Chrome; GitHub Pages ignores folders starting with "_")

import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'assets', 'resume');
const tmpDir = join(root, '_resume', 'html');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const NB = ' ';
const credentials = `MSc, TU${NB}Delft · iF & Red${NB}Dot winner · Mandarin (native), English${NB}(fluent).`;

const shared = {
  name: 'Linxi Li',
  contact: [
    ['hellolinxi.com', 'https://hellolinxi.com'],
    ['linkedin.com/in/lilinxi', 'https://www.linkedin.com/in/lilinxi/'],
    ['Linxi_Li@outlook.com', 'mailto:Linxi_Li@outlook.com'],
    ['+86 159 2129 4126', 'tel:+8615921294126'],
    ['Shanghai, China', null],
  ],
  experience: [
    {
      org: 'Apple', title: 'UX Designer, On-site Contractor', dates: 'Sep 2025 – Aug 2026  ·  Shanghai',
      bullets: [
        'Led the **0→1 UX architecture** of a production-ramp monitoring platform for Apple product launches, replacing Excel trackers, email threads and **100+ page weekly reports** with one shared real-time view.',
        'Designed the callout-first summary dashboard and key-metric visualizations so leaders spot cross-product risks at a glance; reporting moved from **weekly snapshots to minute-level updates**.',
        'Unified **18 modules** under one design language (solo, then with a second designer) and aligned **11+ stakeholders** across product, business and engineering; **Wave 1 launched** and set the structure for Wave 2.',
        'Designed v2.0 features for an OEM production-line build-up data platform, improving readability and workflow efficiency for multi-role, high-frequency tasks across input/output, capacity, delivery and shipping.',
      ],
    },
    {
      org: 'Freelance', title: 'Independent UX Designer', dates: 'Feb 2023 – Aug 2025  ·  Shanghai',
      bullets: [
        "**Emergo by UL** — Supported human-factors and summative usability validation for a modular surgical robotics system's NMPA registration amendment: **14 simulated-surgery sessions** with **57+ clinical professionals**.",
        '**PayPal** — Designed the UI/UX of a visualization-driven risk & control portal, turning the search, comparison and simulation of controls across business hierarchies into guided decision support.',
        "**Chenhui Venture Partners** — Designed an AI-chatbot game that simulates startup challenges for the firm's AI Lab.",
      ],
    },
    {
      org: 'Philips', title: 'Senior UX Designer, Healthcare', dates: 'Nov 2017 – Jan 2023  ·  Shanghai',
      note: 'Associate UX Designer (2017)  →  UX Designer (2019)  →  Senior UX Designer (2022)',
      bullets: [
        'Designed a radiology **equipment data-management system** deployed in **10+ hospitals**, replacing paper tracking boards, plus **3+ 0→1 clinical tools** for report management, ultrasound ROI drawing and maintenance scheduling.',
        'Ran usability evaluations for a **PACS and a radiology AI platform**, contributing to their first **NMPA registrations**.',
        'Localized the **Vue radiology suite** (acquired from Carestream) and designed China-first products: a respiratory-therapist app, a film-printing kiosk and a **post-PCI home-care platform**.',
        'Extended the design system for **large wall-mounted dashboards** with six task-type patterns used in live projects.',
        'Mapped sleep & respiratory-care service journeys through field research with distributors and service partners.',
      ],
    },
  ],
  education: [
    { school: 'Delft University of Technology', degree: 'MSc, Design for Interaction', dates: '2015 – 2017  ·  Delft, The Netherlands',
      note: 'Project: Excelscope 2.0, affordable malaria diagnosis for rural Uganda · exhibited at Dutch Design Week 2017' },
    { school: 'National Chengchi University', degree: 'Exchange Program, Communication', dates: '2014  ·  Taipei' },
    { school: 'Sun Yat-sen University', degree: 'Bachelor, Creative Media', dates: '2011 – 2015  ·  Guangzhou' },
  ],
  skills: [
    ['Design', 'Enterprise UX · data visualization · design systems · prototyping · large-screen & kiosk UI'],
    ['Research', 'Co-creation workshops · field research · interviews · surveys · usability testing · service blueprints'],
    'DOMAIN',
    ['Tools', 'Figma · Sketch · Framer · Axure · After Effects · Claude Code'],
  ],
  awards: [
    ['Design patent (GUI)', 'Medical-system event timeline — UI/UX designer · CN307853843S', '2022'],
    ['Red Dot Best Design Team', 'Philips healthcare design team — team member for five years', '2022'],
    ['iF & Red Dot: Best of the Best', 'Philips NightOwl baby monitor — companion IoT app UI/UX', '2021, 2022'],
    ['iF & Red Dot', 'Philips air purifier & rice cooker series — LED & tangible UI/UX', '2018, 2019, 2021'],
    ['iF Design Award', 'Philips Design Language System — added the large-screen display patterns', '2022'],
  ],
};

const versions = [
  {
    file: 'LinxiLi-Resume', label: 'General',
    headline: 'Senior UX Designer  ·  Complex Systems for Enterprise & Healthcare',
    summary: "Senior UX designer with 8+ years turning complex systems into clear, usable products — from medical informatics in 10+ hospitals at Philips to Apple's 0→1 production-ramp platform and PayPal's risk & control portal.",
    domain: ['Domain', 'Healthcare informatics · supply chain & manufacturing · fintech compliance · consumer IoT'],
  },
  {
    file: 'LinxiLi-Resume-Healthcare-MedTech', label: 'Healthcare & MedTech',
    headline: 'Senior UX Designer  ·  Healthcare, MedTech & Regulated Systems',
    summary: 'Senior UX designer with 8+ years designing for clinicians, patients and hospital operations: medical informatics in 10+ hospitals at Philips, usability work behind NMPA registrations, and 0→1 data-platform UX at Apple.',
    domain: ['Healthcare', 'Medical informatics · clinical workflows · human factors & usability engineering · NMPA'],
  },
  {
    file: 'LinxiLi-Resume-Data-Supply-Chain', label: 'Data-Intensive & Supply Chain',
    headline: 'Senior UX Designer  ·  Data-Intensive Enterprise & Supply-Chain Systems',
    summary: "Senior UX designer with 8+ years making dense operational data clear and decision-ready: Apple's 0→1 production-ramp platform, PayPal's risk & control portal and equipment data across 10+ hospitals at Philips.",
    domain: ['Domain', 'Supply chain & manufacturing (Supply Chain Professional Certificate) · production ramp'],
  },
  {
    file: 'LinxiLi-Resume-Risk-Compliance-Fintech', label: 'Risk, Compliance & Fintech',
    headline: 'Senior UX Designer  ·  Risk, Compliance & Regulated Enterprise Systems',
    summary: "Senior UX designer with 8+ years designing for high-stakes, regulated decisions: PayPal's risk & control portal, usability validation behind NMPA registrations, and real-time risk views on Apple's production-ramp platform.",
    domain: ['Domain', 'Risk & control management · compliance workflows · NMPA regulatory usability · fintech'],
  },
];

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

const section = (title, body) => `
    <section class="section">
      <h2 class="section__title"><span>${esc(title)}</span></h2>
      <div class="section__content">${body}</div>
    </section>`;

function render(v) {
  const contact = shared.contact.map(([t, href], i) =>
    href ? `<a href="${href}"${i === 0 ? ' class="site"' : ''}>${esc(t)}</a>` : `<span>${esc(t)}</span>`).join('<span class="sep">·</span>');
  const exp = shared.experience.map(r => `
        <div class="role">
          <div class="row"><p class="role__name"><strong>${esc(r.org)}</strong>  ·  ${esc(r.title)}</p><p class="meta">${esc(r.dates)}</p></div>
          ${r.note ? `<p class="meta">${esc(r.note)}</p>` : ''}
          <ul class="bullets">${r.bullets.map(b => `<li><span>${md(b)}</span></li>`).join('')}</ul>
        </div>`).join('');
  const edu = shared.education.map(e => `
        <div class="school">
          <div class="row"><p class="role__name"><strong>${esc(e.school)}</strong>  ·  ${esc(e.degree)}</p><p class="meta">${esc(e.dates)}</p></div>
          ${e.note ? `<p class="meta">${esc(e.note)}</p>` : ''}
        </div>`).join('');
  const skills = shared.skills.map(s => s === 'DOMAIN' ? v.domain : s)
    .map(([k, val]) => `<div class="skill"><p class="skill__label">${esc(k)}</p><p>${esc(val)}</p></div>`).join('');
  const awards = shared.awards.map(([a, rest, year]) =>
    `<div class="row award"><p><strong>${esc(a)}</strong>  ·  ${esc(rest)}</p><p class="meta">${esc(year)}</p></div>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Linxi Li — Resume (${esc(v.label)})</title>
<meta name="author" content="Linxi Li">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=block" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  :root { --ink: #16181d; --body: #30343c; --meta: #6b717d; --accent: #4a55d4; --rule: #dcdfe6; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #fff; }
  body { font-family: Inter, sans-serif; color: var(--body); font-size: 9pt; line-height: 12.5pt; letter-spacing: -0.005em;
         -webkit-print-color-adjust: exact; print-color-adjust: exact; font-feature-settings: "kern"; }
  a { color: inherit; text-decoration: none; }
  strong { font-weight: 600; color: var(--ink); }
  .page { width: 595pt; height: 842pt; padding: 28pt 44pt 24pt; display: flex; flex-direction: column; gap: 9pt; overflow: hidden; }
  .header { display: flex; flex-direction: column; gap: 3pt; }
  .name { font-size: 26pt; line-height: 30pt; font-weight: 600; color: var(--ink); letter-spacing: -0.02em; }
  .headline { font-size: 10.5pt; line-height: 14pt; font-weight: 500; color: var(--accent); letter-spacing: 0; white-space: pre-wrap; }
  .contact { padding-top: 3pt; font-size: 8.5pt; line-height: 12pt; color: var(--meta); letter-spacing: 0; }
  .contact .site { color: var(--accent); font-weight: 500; }
  .contact .sep { margin: 0 6pt; }
  .rule { height: 0.75pt; background: var(--rule); }
  .summary { font-size: 9.5pt; line-height: 13.5pt; }
  .section { display: flex; flex-direction: column; gap: 7pt; }
  .section__title { display: flex; align-items: center; gap: 8pt; font-size: 8pt; line-height: 10pt; font-weight: 600; color: var(--accent);
                    text-transform: uppercase; letter-spacing: 0.1em; }
  .section__title::after { content: ""; flex: 1; height: 0.75pt; background: var(--rule); }
  .section__content { display: flex; flex-direction: column; }
  .experience { gap: 8pt; }
  .education { gap: 5pt; }
  .skills { gap: 3pt; }
  .awards { gap: 2.5pt; }
  .role { display: flex; flex-direction: column; gap: 3.5pt; }
  .role > .meta { margin-top: -3.5pt; }
  .row { display: flex; justify-content: space-between; align-items: baseline; gap: 12pt; white-space: pre-wrap; }
  .role__name { font-size: 10pt; line-height: 14pt; color: var(--ink); letter-spacing: 0; }
  .meta { font-size: 8.5pt; line-height: 12pt; color: var(--meta); letter-spacing: 0; white-space: pre-wrap; }
  .row .meta { flex: none; }
  .bullets { list-style: none; display: flex; flex-direction: column; gap: 2.5pt; }
  /* in-flow bullet (no absolute positioning) keeps the PDF text layer in reading order for ATS parsers */
  .bullets li { display: flex; gap: 6pt; }
  .bullets li::before { content: "•"; flex: none; width: 6pt; color: var(--meta); }
  .bullets li > span { flex: 1; }
  .skill { display: flex; gap: 8pt; }
  .skill__label { flex: none; width: 58pt; font-weight: 600; color: var(--ink); }
  .award p:first-child { white-space: pre-wrap; }
</style>
</head>
<body>
  <main class="page">
    <header class="header">
      <h1 class="name">${esc(shared.name)}</h1>
      <p class="headline">${esc(v.headline)}</p>
      <p class="contact">${contact}</p>
    </header>
    <div class="rule"></div>
    <p class="summary">${esc(v.summary)}<br>${esc(credentials)}</p>
    ${section('Experience', exp).replace('section__content', 'section__content experience')}
    ${section('Education', edu).replace('section__content', 'section__content education')}
    ${section('Skills', skills).replace('section__content', 'section__content skills')}
    ${section('Awards & Patent', awards).replace('section__content', 'section__content awards')}
  </main>
</body>
</html>`;
}

mkdirSync(outDir, { recursive: true });
mkdirSync(tmpDir, { recursive: true });
for (const v of versions) {
  const html = join(tmpDir, `${v.file}.html`);
  const pdf = join(outDir, `${v.file}.pdf`);
  writeFileSync(html, render(v));
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=15000',
    `--print-to-pdf=${pdf}`, `file://${html}`], { stdio: 'ignore' });
  const pages = (readFileSync(pdf, 'latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  console.log(`${v.file}.pdf  pages=${pages}`);
}
