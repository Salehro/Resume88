#!/usr/bin/env node
// Idempotent patcher that adds "Glossary" links to the navbar and footer
// of all existing blog posts (index.html + 12 posts).

const fs = require("fs");
const path = require("path");

const BLOG_DIR = path.join(__dirname, "..", "public", "blog");
const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith(".html"));

let updated = 0;
for (const f of files) {
  const p = path.join(BLOG_DIR, f);
  let html = fs.readFileSync(p, "utf8");
  const before = html;

  // Add Glossary link in navbar (between Blog link and the CTA)
  if (!html.includes('<a href="/glossary/">Glossary</a>')) {
    html = html.replace(
      '<a href="/blog/">Blog</a>\n      <a href="/" class="nav-cta">',
      '<a href="/blog/">Blog</a>\n      <a href="/glossary/">Glossary</a>\n      <a href="/" class="nav-cta">'
    );
  }

  // Add Glossary link in footer
  if (!html.includes('<a href="/glossary/">Glossary</a>\n  ')) {
    html = html.replace(
      '<a href="/blog/">Blog</a>\n    <a href="https://github.com/Salehro/resume88"',
      '<a href="/blog/">Blog</a>\n    <a href="/glossary/">Glossary</a>\n    <a href="https://github.com/Salehro/resume88"'
    );
  }

  if (html !== before) {
    fs.writeFileSync(p, html);
    updated++;
  }
}

console.log(`✓ Patched ${updated} blog files with glossary links`);
