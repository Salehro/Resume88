#!/usr/bin/env node
// Builds static glossary pages from scripts/glossary-terms.js into public/glossary/
// Run with: node scripts/build-glossary.js

const fs = require("fs");
const path = require("path");
const terms = require("./glossary-terms");

const OUT_DIR = path.join(__dirname, "..", "public", "glossary");
const BASE_URL = "https://www.resume88.com";

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// Build a lookup for related terms
const termMap = Object.fromEntries(terms.map(t => [t.slug, t]));

function navbar() {
  return `<nav class="nav">
  <div class="nav-inner">
    <a href="/" class="nav-logo"><img src="/favicon.ico" alt="Resume88 logo" width="28" height="28" />Resume<span>88</span></a>
    <div class="nav-links">
      <a href="/blog/">Blog</a>
      <a href="/glossary/">Glossary</a>
      <a href="/" class="nav-cta">Build My Resume — Free</a>
    </div>
  </div>
</nav>`;
}

function footer() {
  return `<footer>
  <p>&copy; 2026 Resume88 &middot;
    <a href="/">Resume Builder</a>
    <a href="/blog/">Blog</a>
    <a href="/glossary/">Glossary</a>
    <a href="https://github.com/Salehro/resume88" target="_blank" rel="noreferrer">GitHub</a>
  </p>
  <p style="margin-top:8px;">100% free. No login. No signup. Ever.</p>
</footer>`;
}

function termPage(t) {
  const url = `${BASE_URL}/glossary/${t.slug}.html`;
  const title = `${t.term} — Resume88 Glossary`;
  const description = t.short;
  const relatedCards = (t.related || [])
    .map(slug => {
      const r = termMap[slug];
      if (r) {
        return `<a href="/glossary/${r.slug}.html" class="related-card"><div class="related-card-title">${r.term}</div><div class="related-card-desc">${r.short}</div></a>`;
      }
      // Fall back to blog posts when slug isn't a glossary term
      const blogMap = {
        "responsible-for": ["/blog/resume-action-verbs.html", "185 Resume Action Verbs", "Replace \"responsible for\" with something better."],
        "relevant-coursework": ["/blog/resume-with-no-experience.html", "Resume With No Experience", "Includes guidance on coursework."],
        "contact-info": ["/blog/how-to-write-a-resume-2026.html", "How to Write a Resume", "Covers the header and contact info."],
        "tailoring": ["/blog/ats-friendly-resume.html", "ATS-Friendly Resume Guide", "Tailoring and keywords explained."],
        "two-page-resume": ["/blog/how-long-should-a-resume-be.html", "How Long Should a Resume Be?", "One page, two pages, or more."],
        "file-format": ["/blog/download-resume-pdf-free.html", "Download Resume as PDF Free", "Why PDF beats Word docs."],
        "career-change": ["/blog/professional-summary-examples.html", "Professional Summary Examples", "Includes career change examples."],
        "projects": ["/blog/resume-with-no-experience.html", "Resume With No Experience", "Why projects matter."],
        "federal-resume": ["/blog/resume-vs-cv.html", "Resume vs CV", "Covers federal and academic CVs."],
        "resume-format": ["/blog/resume-format-guide.html", "Resume Format Guide", "Chronological, functional, or combination."],
        "resume-parsing": ["/blog/ats-friendly-resume.html", "ATS-Friendly Resume Guide", "How ATS parses your resume."],
        "resume-vs-cv": ["/blog/resume-vs-cv.html", "Resume vs CV", "The actual difference explained."],
        "c-suite-resume": ["/blog/professional-summary-examples.html", "Professional Summary Examples", "Includes executive examples."],
      };
      const fallback = blogMap[slug];
      if (fallback) {
        return `<a href="${fallback[0]}" class="related-card"><div class="related-card-title">${fallback[1]}</div><div class="related-card-desc">${fallback[2]}</div></a>`;
      }
      return "";
    })
    .filter(Boolean)
    .join("\n      ");

  const exampleBlock = t.example
    ? `<div class="example"><strong>Example:</strong> ${t.example}</div>`
    : "";

  const schema = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "name": t.term,
    "description": t.short,
    "inDefinedTermSet": {
      "@type": "DefinedTermSet",
      "name": "Resume88 Glossary",
      "url": `${BASE_URL}/glossary/`,
    },
    "url": url,
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<meta name="description" content="${description}" />
<meta name="robots" content="index, follow" />
<meta name="author" content="Resume88" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="article" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${BASE_URL}/og-image.png" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="icon" href="/favicon.ico" />
<link rel="stylesheet" href="/blog/blog.css" />
<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>
</head>
<body>

${navbar()}

<article>
  <div class="post-meta">
    <span class="category">Glossary</span>
    <a href="/glossary/" style="color:#94a3b8;">&larr; All terms</a>
  </div>

  <h1>${t.term}</h1>
  <p class="lede">${t.short}</p>

  <p>${t.definition}</p>

  <p>${t.detail}</p>

  ${exampleBlock}

  <div class="final-cta">
    <h3>Ready to put this into practice?</h3>
    <p>Build a polished, professional resume with Resume88 in under 10 minutes. Free, no signup, instant PDF download.</p>
    <a href="/" class="btn">Build My Resume &rarr;</a>
    <div class="trust">100% free &middot; No login &middot; No credit card &middot; Instant PDF</div>
  </div>

  ${relatedCards ? `<div class="related">
    <h3>Related terms &amp; guides</h3>
    <div class="related-grid">
      ${relatedCards}
    </div>
  </div>` : ""}

</article>

${footer()}

</body>
</html>
`;
}

function indexPage() {
  const sorted = [...terms].sort((a, b) => a.term.localeCompare(b.term));
  const cards = sorted.map(t =>
    `<a href="/glossary/${t.slug}.html" class="post-card">
    <span class="category">Term</span>
    <h2>${t.term}</h2>
    <p>${t.short}</p>
    <span class="read">Read definition &rarr;</span>
  </a>`
  ).join("\n\n  ");

  const url = `${BASE_URL}/glossary/`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "name": "Resume88 Glossary",
    "description": "A plain-English glossary of resume and job-application terms.",
    "url": url,
    "hasDefinedTerm": sorted.map(t => ({
      "@type": "DefinedTerm",
      "name": t.term,
      "url": `${BASE_URL}/glossary/${t.slug}.html`,
      "description": t.short,
    })),
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Resume Glossary — ${terms.length} Resume Terms Explained | Resume88</title>
<meta name="description" content="A plain-English glossary of ${terms.length} resume terms — ATS, action verbs, chronological, functional, keywords, and more. Free, searchable, updated for 2026." />
<meta name="keywords" content="resume glossary, resume terms, resume dictionary, what is ATS, what is a resume summary, resume terminology" />
<meta name="robots" content="index, follow" />
<meta name="author" content="Resume88" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="Resume Glossary — ${terms.length} Resume Terms Explained" />
<meta property="og:description" content="A plain-English glossary of ${terms.length} resume and job-application terms." />
<meta property="og:image" content="${BASE_URL}/og-image.png" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="icon" href="/favicon.ico" />
<link rel="stylesheet" href="/blog/blog.css" />
<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>
</head>
<body>

${navbar()}

<section class="hero-block">
  <h1>The Resume Glossary</h1>
  <p>${terms.length} plain-English definitions of the terms you'll see on job postings, resume advice blogs, and inside every ATS. No jargon, no fluff.</p>
</section>

<main class="post-grid">

  ${cards}

</main>

${footer()}

</body>
</html>
`;
}

// Generate all term pages
let count = 0;
for (const t of terms) {
  const file = path.join(OUT_DIR, `${t.slug}.html`);
  fs.writeFileSync(file, termPage(t));
  count++;
}

// Generate index
fs.writeFileSync(path.join(OUT_DIR, "index.html"), indexPage());

console.log(`✓ Generated ${count} glossary term pages + index at public/glossary/`);
