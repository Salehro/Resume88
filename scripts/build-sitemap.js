#!/usr/bin/env node
// Regenerates public/sitemap.xml from all static assets in public/
// Run: node scripts/build-sitemap.js

const fs = require("fs");
const path = require("path");
const glossaryTerms = require("./glossary-terms");

const BASE_URL = "https://www.resume88.com";
const TODAY = new Date().toISOString().slice(0, 10);

const urls = [];

// Home
urls.push({ loc: `${BASE_URL}/`, lastmod: TODAY, priority: "1.0", changefreq: "weekly" });

// Blog hub
urls.push({ loc: `${BASE_URL}/blog/`, lastmod: TODAY, priority: "0.9", changefreq: "weekly" });

// Blog posts
const blogPosts = [
  "how-to-write-a-resume-2026.html",
  "free-resume-templates.html",
  "resume-with-no-experience.html",
  "ats-friendly-resume.html",
  "resume-vs-cv.html",
  "resume-mistakes-to-avoid.html",
  "professional-summary-examples.html",
  "resume-format-guide.html",
  "how-long-should-a-resume-be.html",
  "resume-action-verbs.html",
  "quantify-resume-achievements.html",
  "download-resume-pdf-free.html",
];
for (const p of blogPosts) {
  urls.push({
    loc: `${BASE_URL}/blog/${p}`,
    lastmod: TODAY,
    priority: "0.8",
    changefreq: "monthly",
  });
}

// Glossary hub
urls.push({ loc: `${BASE_URL}/glossary/`, lastmod: TODAY, priority: "0.8", changefreq: "monthly" });

// Glossary term pages
for (const t of glossaryTerms) {
  urls.push({
    loc: `${BASE_URL}/glossary/${t.slug}.html`,
    lastmod: TODAY,
    priority: "0.6",
    changefreq: "monthly",
  });
}

// Locale pages (with hreflang alternates baked in)
const locales = [
  { slug: "fr", lang: "fr" },
  { slug: "es", lang: "es" },
  { slug: "de", lang: "de" },
  { slug: "pt", lang: "pt" },
  { slug: "ar", lang: "ar" },
  { slug: "zh", lang: "zh" },
  { slug: "en-gb", lang: "en-GB" },
  { slug: "en-ca", lang: "en-CA" },
  { slug: "en-au", lang: "en-AU" },
  { slug: "en-in", lang: "en-IN" },
  { slug: "en-nz", lang: "en-NZ" },
];
for (const l of locales) {
  urls.push({
    loc: `${BASE_URL}/${l.slug}/`,
    lastmod: TODAY,
    priority: "0.8",
    changefreq: "monthly",
    alternates: locales.map(ll => ({ hreflang: ll.lang, href: `${BASE_URL}/${ll.slug}/` }))
      .concat([
        { hreflang: "en", href: `${BASE_URL}/` },
        { hreflang: "x-default", href: `${BASE_URL}/` },
      ]),
  });
}

// Write sitemap with xhtml:link alternates for locale pages
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
];

for (const u of urls) {
  xml.push("  <url>");
  xml.push(`    <loc>${u.loc}</loc>`);
  xml.push(`    <lastmod>${u.lastmod}</lastmod>`);
  xml.push(`    <changefreq>${u.changefreq}</changefreq>`);
  xml.push(`    <priority>${u.priority}</priority>`);
  if (u.alternates) {
    for (const a of u.alternates) {
      xml.push(`    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`);
    }
  }
  xml.push("  </url>");
}

xml.push("</urlset>");

const outPath = path.join(__dirname, "..", "public", "sitemap.xml");
fs.writeFileSync(outPath, xml.join("\n") + "\n");
console.log(`✓ Wrote ${urls.length} URLs to public/sitemap.xml`);
