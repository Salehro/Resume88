#!/usr/bin/env node
// Injects FAQPage JSON-LD schema into each blog post, just before </head>.
// Idempotent — if the schema is already present (marked with "id": "resume88-faq"),
// it replaces it instead of adding a duplicate.
// Run: node scripts/add-faq-schema.js

const fs = require("fs");
const path = require("path");

const BLOG_DIR = path.join(__dirname, "..", "public", "blog");

// FAQs per post. Each is 3–5 Q&A pairs extracted from the actual content of the post.
const faqs = {
  "how-to-write-a-resume-2026.html": [
    ["How long should a resume be in 2026?",
     "For most people with fewer than 10 years of experience, one page is ideal. Senior professionals with 10+ years of experience can use two pages, but three pages or more is almost never appropriate for a standard job application."],
    ["What sections should a modern resume include?",
     "A modern resume has seven core sections in this order: Header (name + contact), Professional Summary, Work Experience, Education, Skills, Projects/Certifications/Languages, and optionally Interests. You do not need an Objective section or 'References available on request'."],
    ["Should I use a PDF or Word document?",
     "Always submit a PDF unless the application specifically requires a Word document. PDFs preserve formatting across devices, look professional, and modern Applicant Tracking Systems (ATS) parse them correctly."],
    ["How do I quantify achievements on my resume?",
     "Use the action verb + task + measurable result formula. Include numbers like scale (team size, audience size), frequency (weekly, monthly), money (revenue, savings), time saved, percentages, and rankings. Even when you do not have official metrics, a reasonable estimate is fine."],
    ["Should I tailor my resume for every job?",
     "Yes. Tailor the summary, skills section, and at least two bullet points for every application. Use the exact language from the job description. This is the single highest-leverage thing you can do to improve your application-to-interview rate."],
  ],
  "free-resume-templates.html": [
    ["Which free resume template should I use?",
     "For most situations, pick Classic or Modern. Use Corporate for formal Fortune 500 or consulting roles. Use Minimal for academic or publishing roles. Use Creative for design or marketing. Use Sidebar when you need to fit a lot of skills and certifications on one page."],
    ["Are free resume templates ATS-friendly?",
     "The single-column templates (Classic, Modern, Minimal, Corporate) are the most ATS-friendly because Applicant Tracking Systems parse them cleanly. The Sidebar and Creative templates are slightly less ATS-friendly because of the sidebar layout."],
    ["Can I download a free resume template as a Word file?",
     "Word templates often break when opened on different versions of Word or different devices. A web-based builder produces a consistent result every time, and the PDF export is optimized for print. We recommend PDF over Word."],
    ["Are Resume88 templates actually free?",
     "Yes. All six templates are available for free with no signup, no credit card, no watermark, and unlimited PDF exports."],
  ],
  "resume-with-no-experience.html": [
    ["How do I write a resume with no work experience?",
     "Lead with your education, then highlight school projects, volunteer work, internships, personal projects, and online courses with completion proof. Use the same structure as an experienced resume: action verb + task + measurable result."],
    ["What should a student resume include?",
     "A student resume should include a header, a professional summary, education (moved to the top), experience (jobs, volunteer work, or significant projects), skills, projects, and optionally certifications, awards, or languages. Keep it to one page."],
    ["Can I include unpaid experience on my resume?",
     "Yes. Volunteer work, internships, school projects, personal projects, and freelance gigs all count as experience. The key is describing them with specific actions and results."],
    ["How long should my first resume be?",
     "Always one page. There is no exception to this rule when you are early in your career."],
  ],
  "ats-friendly-resume.html": [
    ["What is an ATS-friendly resume?",
     "An ATS-friendly resume is one formatted so that Applicant Tracking Systems can parse it cleanly. It uses a single-column layout, standard section headings (Summary, Experience, Education, Skills), simple bullet points, no tables or text boxes, and no images."],
    ["How do I know if my resume will pass an ATS?",
     "Open your resume PDF, press Ctrl+A (or Cmd+A) to select all text, copy it, and paste it into a plain text editor. If all your content is readable and in the right order, your resume is ATS-friendly. If it is scrambled or missing pieces, your layout is breaking ATS parsers."],
    ["Can an ATS read a PDF resume?",
     "Yes. All modern Applicant Tracking Systems can read text-based PDFs correctly. The old advice that you must submit a Word document is outdated."],
    ["How important is keyword matching for ATS?",
     "Very important. Modern ATS score your resume by keyword match against the job description. Use the exact language the job posting uses for every skill you actually have."],
    ["What should I avoid on an ATS-friendly resume?",
     "Avoid tables, text boxes, headers/footers, images, decorative fonts, creative section names, and fancy Unicode characters. Also avoid keyword stuffing or hidden white text — modern ATS detect both."],
  ],
  "resume-vs-cv.html": [
    ["What is the difference between a resume and a CV?",
     "In the US and Canada, a resume is a short 1–2 page document used for most jobs, while a CV is a long comprehensive document used for academic, medical, and research positions. In the UK, Europe, and most of the rest of the world, 'CV' simply means what Americans call a resume."],
    ["Should I use 'resume' or 'CV' on my file name?",
     "Match your local convention. In the US or Canada, use 'resume' (jane-smith-resume.pdf). In the UK, Europe, Australia, India, or most other countries, use 'CV' (jane-smith-cv.pdf)."],
    ["How long should a CV be?",
     "In the UK, Europe, Australia, and most of the world, a CV should be 1–3 pages for a regular job application. A CV in the US context (for academic or medical roles) can be much longer — often 5–20+ pages."],
    ["Do I need a photo on my CV?",
     "It depends on where you are applying. Photos are expected in Germany, France, Austria, and parts of continental Europe. In the US, UK, Canada, Australia, and New Zealand, photos are not standard and can actually hurt your application."],
  ],
  "resume-mistakes-to-avoid.html": [
    ["What is the biggest mistake people make on their resumes?",
     "Writing job descriptions instead of achievements. A bullet point like 'Responsible for managing social media' tells the reader nothing. 'Grew Instagram following from 8k to 42k in 9 months' is specific, memorable, and proves capability."],
    ["Should I include 'Responsible for' in my resume bullets?",
     "No. 'Responsible for' is passive and generic. Replace it with a strong action verb like Led, Built, Launched, Managed, or Reduced, and follow it with a specific result."],
    ["Is a typo on a resume really a big deal?",
     "Yes. Roughly 58% of recruiters say they would immediately reject a resume with a typo. Run a spell checker, read your resume out loud, and have a second person proofread it before submitting."],
    ["Should I include a photo on my resume?",
     "In the US, Canada, UK, and Australia, no — photos are not standard and may get your resume filtered out. In Germany, Austria, France, and parts of continental Europe, photos are expected."],
  ],
  "professional-summary-examples.html": [
    ["What is a professional summary on a resume?",
     "A professional summary is a short paragraph at the top of your resume, below the contact info, that introduces who you are professionally, what you are good at, and what you bring. It is 2 to 4 sentences long and it is the first real content a recruiter reads."],
    ["Should I use an objective or a summary on my resume?",
     "Use a professional summary, not an objective. Objectives are outdated and focus on what you want. Summaries focus on what you bring — which is what recruiters care about."],
    ["How long should a professional summary be?",
     "Between 2 and 4 sentences. Longer summaries get skimmed; shorter summaries lack impact."],
    ["What should I include in a professional summary?",
     "Your job title and years of experience, your top 2–3 specialized skills, and at least one measurable achievement or unique credential. Avoid buzzwords like 'hard-working' or 'results-driven'."],
    ["Should I write my summary first or last?",
     "Write it last. It is much easier to summarize your resume after you have written the rest of it."],
  ],
  "resume-format-guide.html": [
    ["What is the best resume format?",
     "The reverse chronological format is the best choice for approximately 95% of job seekers. It lists your work experience from most recent to oldest, tells a clear career story, and parses cleanly in Applicant Tracking Systems."],
    ["Should I use a functional resume?",
     "No, in almost all cases. Functional resumes have a bad reputation because recruiters use them as a red flag for employment gaps or missing experience. Unless you are in a field where functional resumes are the literal standard, stick with reverse chronological."],
    ["What is a combination resume?",
     "A combination resume merges a skills-focused section at the top with a traditional reverse-chronological work experience section below. It is useful for career changers and senior professionals with specialized technical skills."],
    ["When should I use a combination resume format?",
     "Consider a combination format if you are making a career change, if you have a specialized technical skill set that deserves prominent placement, or if you are a senior professional whose skills have evolved beyond any single job title."],
  ],
  "how-long-should-a-resume-be.html": [
    ["How long should a resume be?",
     "For 0–10 years of experience: one page. For 10–20 years: one or two pages (prefer one). For 20+ years or senior executives: two pages maximum. For academic or medical CVs: as long as needed, often 5–20+ pages."],
    ["Can a resume be two pages?",
     "Yes — if you have 10+ years of experience and every bullet on page 2 adds genuine value. A 1.5-page resume is the worst of both options; either cut to one page or fill two pages completely."],
    ["Is a one-page resume better than a two-page resume?",
     "For professionals with fewer than 10 years of experience, yes. A one-page resume forces you to edit ruthlessly and keeps your strongest material front and center. Recruiters prefer it."],
    ["Can I reduce the font size to fit my resume on one page?",
     "Only down to 10pt body text. Below that, your resume becomes hard to read. If you are tempted to go smaller, you have too much content — cut weaker bullets instead."],
  ],
  "resume-action-verbs.html": [
    ["What are resume action verbs?",
     "Resume action verbs are strong, specific verbs that start a bullet point and describe a concrete achievement. Examples include Built, Launched, Led, Scaled, Negotiated, and Reduced. They are contrasted with weak phrases like 'Responsible for' or 'Helped with'."],
    ["What can I use instead of 'Responsible for' on my resume?",
     "Use a specific action verb that describes what you actually did. For leadership, try Led, Directed, or Managed. For building, try Built, Created, or Designed. For improvement, try Optimized, Streamlined, or Reduced. Pair every verb with a measurable result."],
    ["How many different action verbs should a resume have?",
     "Do not repeat the same verb more than twice across your resume. Variety keeps the writing fresh and shows the range of your contributions. Use different verbs for different types of achievements — leadership, building, improvement, growth, and so on."],
    ["What are the best action verbs for a resume?",
     "The best action verb depends on what you did. For leadership: Led, Directed, Managed. For building: Built, Launched, Engineered. For growth: Grew, Scaled, Expanded. For improvement: Optimized, Reduced, Streamlined. For communication: Presented, Authored, Negotiated."],
  ],
  "quantify-resume-achievements.html": [
    ["How do I quantify achievements on my resume?",
     "Use the action verb + task + measurable result formula. Metrics can be scale (team size, audience), frequency (daily, weekly), money (revenue, savings, budget), time (saved or reduced), percentages, or rankings. Every resume should have at least one quantified bullet per job."],
    ["What if I don't have numbers for my job?",
     "You almost always do. Try these angles: How big was it (team size, users, accounts)? How often did it happen (daily, weekly)? Compared to what (last year, the team average, before you got there)? A reasonable estimate is fine as long as you can defend it."],
    ["Can I estimate metrics on my resume?",
     "Yes, estimates are acceptable as long as they are reasonable, defensible, and honest. Round numbers rather than fabricating precise ones. Never invent metrics that did not happen."],
    ["How many quantified bullets should a resume have?",
     "Aim for at least one quantified bullet per job, and ideally 2–3. If at least half of your bullets include a specific number, you are ahead of about 70% of applicants."],
  ],
  "download-resume-pdf-free.html": [
    ["How can I download a resume as a PDF for free?",
     "Use a resume builder that exports to PDF without a paywall. Resume88 is a genuinely free option — no signup, no credit card, no watermark, unlimited downloads. Pick a template, fill in your info, click Export PDF, and save."],
    ["Are free resume builders actually free?",
     "Most are not. Many use a dark pattern where you fill in all your information for free, then hit a paywall at the download step. A few are genuinely free — Resume88 is open source and has no paywall, no watermark, and no signup."],
    ["Can I download my resume as a PDF without an account?",
     "Yes, with Resume88. No email, no Google login, no account of any kind is required. Your data stays in your browser (localStorage) and never touches a server."],
    ["Why should I use PDF instead of Word for my resume?",
     "PDFs preserve formatting across devices, look professional, and modern Applicant Tracking Systems parse them correctly. Word documents can break formatting when opened on different software or devices."],
    ["What is the best file name for a PDF resume?",
     "Use something like firstname-lastname-resume.pdf (e.g., jane-smith-resume.pdf). Do not use 'resume.pdf' or 'resume_final_v3.pdf' — those look unprofessional and get lost in recruiter folders."],
  ],
};

const FAQ_ID_MARKER = "@id";

function buildFaqScript(pairs) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "resume88-faq",
    "mainEntity": pairs.map(([q, a]) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": a,
      },
    })),
  };
  return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
}

let updated = 0;
for (const [filename, pairs] of Object.entries(faqs)) {
  const filePath = path.join(BLOG_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠ Missing file: ${filename}`);
    continue;
  }
  let html = fs.readFileSync(filePath, "utf8");
  const script = buildFaqScript(pairs);

  // If a previous FAQ schema block exists, replace it.
  const existingFaqRegex = /<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "FAQPage"[\s\S]*?<\/script>/;
  if (existingFaqRegex.test(html)) {
    html = html.replace(existingFaqRegex, script);
  } else {
    // Insert just before </head>
    html = html.replace("</head>", `${script}\n</head>`);
  }

  fs.writeFileSync(filePath, html);
  updated++;
}

console.log(`✓ Added/updated FAQ schema on ${updated} blog posts`);
