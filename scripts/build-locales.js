#!/usr/bin/env node
// Builds locale landing pages into public/{locale}/index.html
// Run with: node scripts/build-locales.js

const fs = require("fs");
const path = require("path");

const BASE_URL = "https://www.resume88.com";
const PUBLIC_DIR = path.join(__dirname, "..", "public");

// Each locale:
//   hreflang: the hreflang tag value (e.g. "fr", "en-GB")
//   dir: "ltr" | "rtl"
//   slug: URL segment (e.g. "fr", "en-gb")
//   lang: HTML lang attribute
//   title, description, h1, lede, cta, ctaSub, trustBar[], steps[{n,t,d}], finalH, finalSub, builtBy
const locales = [
  {
    slug: "fr",
    lang: "fr",
    hreflang: "fr",
    dir: "ltr",
    country: "France",
    title: "Créateur de CV gratuit — Sans inscription, sans compte | Resume88",
    description: "Créez un CV professionnel en quelques minutes. 6 modèles, 8 couleurs, téléchargement PDF instantané. Sans inscription, sans carte bancaire, 100% gratuit pour toujours.",
    keywords: "créateur cv gratuit, cv en ligne gratuit, modèle cv pdf, cv sans inscription, constructeur de cv, cv professionnel gratuit",
    badge: "100% Gratuit — Sans inscription, sans carte bancaire. Jamais.",
    h1: "Créez votre CV en quelques minutes",
    lede: "Sans inscription, sans carte bancaire, sans compte à créer. Un CV professionnel prêt à télécharger en PDF, totalement gratuit.",
    cta: "Créer mon CV — Gratuit",
    ctaSub: "Sans compte  ·  PDF gratuit  ·  5 minutes",
    trustBar: ["Toujours gratuit", "Sans inscription", "Export PDF instantané", "Données privées"],
    whyTitle: "Pourquoi Resume88 ?",
    whyBullets: [
      ["Gratuit pour toujours", "Pas de frais cachés, pas de plan premium, pas de carte bancaire requise."],
      ["Sans compte", "Commencez immédiatement. Pas d'inscription, pas de vérification e-mail."],
      ["6 modèles professionnels", "Classic, Modern, Minimal, Corporate, Creative, Sidebar — tous testés pour les ATS."],
      ["Vos données restent privées", "Rien n'est envoyé à un serveur. Vos informations restent dans votre navigateur."],
    ],
    stepsTitle: "Trois étapes simples",
    steps: [
      { n: "01", t: "Remplissez vos informations", d: "Ajoutez votre expérience, vos compétences et votre formation." },
      { n: "02", t: "Choisissez un modèle", d: "6 mises en page et 8 thèmes de couleurs au choix." },
      { n: "03", t: "Téléchargez votre PDF", d: "Un seul clic. Votre CV est prêt à envoyer." },
    ],
    finalH: "Votre prochain emploi commence par un bon CV",
    finalSub: "Rejoignez des milliers de personnes qui ont créé leur CV avec Resume88 — en moins de 5 minutes.",
    footer: "100% gratuit. Sans compte. Sans inscription. Jamais.",
    builderLabel: "Créer mon CV",
    navBlog: "Blog",
  },
  {
    slug: "es",
    lang: "es",
    hreflang: "es",
    dir: "ltr",
    country: "Spain",
    title: "Creador de currículum gratis — Sin registro, sin cuenta | Resume88",
    description: "Crea un currículum profesional en minutos. 6 plantillas, 8 colores, descarga PDF instantánea. Sin registro, sin tarjeta, 100% gratis para siempre.",
    keywords: "currículum gratis, creador cv online, plantilla currículum pdf, cv sin registro, currículum profesional, hacer curriculum online gratis",
    badge: "100% Gratis — Sin registro, sin tarjeta. Nunca.",
    h1: "Crea tu currículum en minutos",
    lede: "Sin registro, sin tarjeta de crédito, sin crear cuenta. Un currículum profesional listo para descargar en PDF, completamente gratis.",
    cta: "Crear mi currículum — Gratis",
    ctaSub: "Sin cuenta  ·  PDF gratis  ·  5 minutos",
    trustBar: ["Siempre gratis", "Sin registro", "PDF instantáneo", "Datos privados"],
    whyTitle: "¿Por qué Resume88?",
    whyBullets: [
      ["Gratis para siempre", "Sin costes ocultos, sin plan premium, sin tarjeta requerida."],
      ["Sin cuenta", "Empieza de inmediato. Sin registro, sin verificación de correo."],
      ["6 plantillas profesionales", "Classic, Modern, Minimal, Corporate, Creative, Sidebar — todas compatibles con ATS."],
      ["Tus datos son privados", "Nada se envía a un servidor. Tu información se queda en tu navegador."],
    ],
    stepsTitle: "Tres pasos simples",
    steps: [
      { n: "01", t: "Completa tus datos", d: "Añade experiencia, habilidades y educación." },
      { n: "02", t: "Elige una plantilla", d: "6 diseños y 8 temas de color disponibles." },
      { n: "03", t: "Descarga tu PDF", d: "Un clic. Tu currículum está listo para enviar." },
    ],
    finalH: "Tu próximo empleo empieza con un buen currículum",
    finalSub: "Únete a miles de personas que han creado su currículum con Resume88 — en menos de 5 minutos.",
    footer: "100% gratis. Sin cuenta. Sin registro. Nunca.",
    builderLabel: "Crear mi currículum",
    navBlog: "Blog",
  },
  {
    slug: "de",
    lang: "de",
    hreflang: "de",
    dir: "ltr",
    country: "Germany",
    title: "Lebenslauf kostenlos erstellen — Ohne Anmeldung | Resume88",
    description: "Erstellen Sie einen professionellen Lebenslauf in Minuten. 6 Vorlagen, 8 Farben, PDF-Sofort-Download. Ohne Anmeldung, ohne Kreditkarte, 100% kostenlos für immer.",
    keywords: "lebenslauf kostenlos, lebenslauf erstellen online, lebenslauf vorlage pdf, lebenslauf ohne anmeldung, cv generator deutsch",
    badge: "100% Kostenlos — Ohne Anmeldung, ohne Kreditkarte. Niemals.",
    h1: "Lebenslauf in Minuten erstellen",
    lede: "Ohne Anmeldung, ohne Kreditkarte, ohne Konto. Ein professioneller Lebenslauf als PDF — völlig kostenlos.",
    cta: "Lebenslauf erstellen — Kostenlos",
    ctaSub: "Kein Konto  ·  Kostenloses PDF  ·  5 Minuten",
    trustBar: ["Immer kostenlos", "Ohne Anmeldung", "Sofortiger PDF-Export", "Daten bleiben privat"],
    whyTitle: "Warum Resume88?",
    whyBullets: [
      ["Für immer kostenlos", "Keine versteckten Kosten, kein Premium-Plan, keine Kreditkarte nötig."],
      ["Kein Konto erforderlich", "Sofort loslegen. Keine Anmeldung, keine E-Mail-Verifizierung."],
      ["6 professionelle Vorlagen", "Classic, Modern, Minimal, Corporate, Creative, Sidebar — alle ATS-getestet."],
      ["Ihre Daten bleiben privat", "Nichts wird an einen Server gesendet. Ihre Daten bleiben in Ihrem Browser."],
    ],
    stepsTitle: "Drei einfache Schritte",
    steps: [
      { n: "01", t: "Daten eingeben", d: "Erfahrung, Fähigkeiten und Ausbildung hinzufügen." },
      { n: "02", t: "Vorlage auswählen", d: "6 Layouts und 8 Farbthemen zur Auswahl." },
      { n: "03", t: "PDF herunterladen", d: "Ein Klick. Ihr Lebenslauf ist fertig." },
    ],
    finalH: "Ihr nächster Job beginnt mit einem guten Lebenslauf",
    finalSub: "Schließen Sie sich Tausenden an, die ihren Lebenslauf mit Resume88 erstellt haben — in unter 5 Minuten.",
    footer: "100% kostenlos. Kein Konto. Keine Anmeldung. Niemals.",
    builderLabel: "Lebenslauf erstellen",
    navBlog: "Blog",
  },
  {
    slug: "pt",
    lang: "pt",
    hreflang: "pt",
    dir: "ltr",
    country: "Brazil/Portugal",
    title: "Criador de currículo grátis — Sem cadastro, sem conta | Resume88",
    description: "Crie um currículo profissional em minutos. 6 modelos, 8 cores, download em PDF instantâneo. Sem cadastro, sem cartão, 100% grátis para sempre.",
    keywords: "currículo grátis, criar currículo online, modelo currículo pdf, currículo sem cadastro, fazer curriculo online gratis",
    badge: "100% Grátis — Sem cadastro, sem cartão. Nunca.",
    h1: "Crie seu currículo em minutos",
    lede: "Sem cadastro, sem cartão de crédito, sem conta. Um currículo profissional pronto para baixar em PDF, completamente grátis.",
    cta: "Criar meu currículo — Grátis",
    ctaSub: "Sem conta  ·  PDF grátis  ·  5 minutos",
    trustBar: ["Sempre grátis", "Sem cadastro", "PDF instantâneo", "Dados privados"],
    whyTitle: "Por que Resume88?",
    whyBullets: [
      ["Grátis para sempre", "Sem custos ocultos, sem plano premium, sem cartão necessário."],
      ["Sem conta necessária", "Comece agora. Sem cadastro, sem verificação de e-mail."],
      ["6 modelos profissionais", "Classic, Modern, Minimal, Corporate, Creative, Sidebar — todos compatíveis com ATS."],
      ["Seus dados ficam privados", "Nada é enviado a um servidor. Suas informações ficam no seu navegador."],
    ],
    stepsTitle: "Três passos simples",
    steps: [
      { n: "01", t: "Preencha seus dados", d: "Adicione experiência, habilidades e educação." },
      { n: "02", t: "Escolha um modelo", d: "6 layouts e 8 temas de cores para escolher." },
      { n: "03", t: "Baixe seu PDF", d: "Um clique. Seu currículo está pronto para enviar." },
    ],
    finalH: "Seu próximo emprego começa com um bom currículo",
    finalSub: "Junte-se a milhares de pessoas que criaram seu currículo com Resume88 — em menos de 5 minutos.",
    footer: "100% grátis. Sem conta. Sem cadastro. Nunca.",
    builderLabel: "Criar meu currículo",
    navBlog: "Blog",
  },
  {
    slug: "ar",
    lang: "ar",
    hreflang: "ar",
    dir: "rtl",
    country: "Arab world",
    title: "منشئ السيرة الذاتية مجاني — بدون تسجيل | Resume88",
    description: "أنشئ سيرة ذاتية احترافية في دقائق. 6 قوالب، 8 ألوان، تحميل PDF فوري. بدون تسجيل، بدون بطاقة بنكية، 100% مجاني إلى الأبد.",
    keywords: "سيرة ذاتية مجانية, منشئ cv مجاني, قالب سيرة ذاتية pdf, سيرة ذاتية بدون تسجيل, عمل سيرة ذاتية اون لاين",
    badge: "مجاني 100% — بدون تسجيل، بدون بطاقة بنكية. أبداً.",
    h1: "أنشئ سيرتك الذاتية في دقائق",
    lede: "بدون تسجيل، بدون بطاقة بنكية، بدون إنشاء حساب. سيرة ذاتية احترافية جاهزة للتحميل كـ PDF، مجاناً تماماً.",
    cta: "أنشئ سيرتي الذاتية — مجاناً",
    ctaSub: "بدون حساب  ·  PDF مجاني  ·  5 دقائق",
    trustBar: ["مجاني دائماً", "بدون تسجيل", "تصدير PDF فوري", "بياناتك خاصة"],
    whyTitle: "لماذا Resume88؟",
    whyBullets: [
      ["مجاني للأبد", "لا رسوم خفية، لا خطط مدفوعة، لا بطاقة بنكية."],
      ["بدون حساب", "ابدأ فوراً. بدون تسجيل أو تحقق من البريد الإلكتروني."],
      ["6 قوالب احترافية", "كلاسيكي، حديث، بسيط، مؤسسي، إبداعي، وشريط جانبي."],
      ["بياناتك خاصة", "لا شيء يُرسل إلى خادم. معلوماتك تبقى في متصفحك."],
    ],
    stepsTitle: "ثلاث خطوات بسيطة",
    steps: [
      { n: "01", t: "أملأ بياناتك", d: "أضف الخبرة والمهارات والتعليم." },
      { n: "02", t: "اختر قالباً", d: "6 تصاميم و8 ألوان للاختيار من بينها." },
      { n: "03", t: "حمّل ملف PDF", d: "نقرة واحدة. سيرتك الذاتية جاهزة للإرسال." },
    ],
    finalH: "وظيفتك القادمة تبدأ بسيرة ذاتية رائعة",
    finalSub: "انضم إلى الآلاف الذين أنشأوا سيرتهم الذاتية باستخدام Resume88 — في أقل من 5 دقائق.",
    footer: "100% مجاني. بدون حساب. بدون تسجيل. أبداً.",
    builderLabel: "أنشئ سيرتي الذاتية",
    navBlog: "المدونة",
  },
  {
    slug: "zh",
    lang: "zh",
    hreflang: "zh",
    dir: "ltr",
    country: "China",
    title: "免费简历制作工具 — 无需注册，无需账号 | Resume88",
    description: "几分钟内创建专业简历。6 个模板、8 种颜色、即时 PDF 下载。无需注册，无需信用卡，永久 100% 免费。",
    keywords: "免费简历, 简历制作, 简历模板 pdf, 免注册简历, 在线简历生成, 简历生成器",
    badge: "100% 免费 — 无需注册、无需信用卡。永远。",
    h1: "几分钟内创建你的简历",
    lede: "无需注册、无需信用卡、无需创建账户。专业简历即时下载为 PDF，完全免费。",
    cta: "免费创建简历",
    ctaSub: "无需账号  ·  免费 PDF  ·  5 分钟",
    trustBar: ["永远免费", "无需注册", "即时 PDF 导出", "数据保持私密"],
    whyTitle: "为什么选择 Resume88？",
    whyBullets: [
      ["永久免费", "无隐藏费用，无高级版本，无需信用卡。"],
      ["无需账号", "立即开始。无需注册，无需邮箱验证。"],
      ["6 个专业模板", "经典、现代、极简、商务、创意和侧边栏 — 全部兼容 ATS。"],
      ["数据保持私密", "不向服务器发送任何内容。您的信息保留在浏览器中。"],
    ],
    stepsTitle: "三个简单步骤",
    steps: [
      { n: "01", t: "填写您的信息", d: "添加经验、技能和教育。" },
      { n: "02", t: "选择模板", d: "6 种布局和 8 种配色可供选择。" },
      { n: "03", t: "下载 PDF", d: "一键完成。您的简历已准备好发送。" },
    ],
    finalH: "你的下一份工作从一份好简历开始",
    finalSub: "加入数千名使用 Resume88 创建简历的人 — 不到 5 分钟。",
    footer: "100% 免费。无账号。无注册。永远。",
    builderLabel: "创建我的简历",
    navBlog: "博客",
  },
  // Country-targeted English pages
  {
    slug: "en-gb",
    lang: "en-GB",
    hreflang: "en-GB",
    dir: "ltr",
    country: "United Kingdom",
    title: "Free CV Builder UK — No Signup, No Credit Card | Resume88",
    description: "Create a professional CV in minutes. 6 templates, 8 colours, instant PDF download. No signup, no credit card, 100% free — designed for the UK job market.",
    keywords: "free cv builder uk, cv maker uk, cv template uk free, cv builder no signup, free cv download, uk cv template",
    badge: "100% Free — No Login, No Sign Up, No Credit Card. Ever.",
    h1: "Build Your CV in Minutes — Free",
    lede: "No signup, no credit card, no account to create. A polished, professional CV ready to download as PDF — made with the UK job market in mind.",
    cta: "Build My CV — Free",
    ctaSub: "No account needed  ·  Free PDF download  ·  Takes 5 minutes",
    trustBar: ["Always free", "No signup required", "Instant PDF export", "Data stays private"],
    whyTitle: "Why Resume88 works for UK job seekers",
    whyBullets: [
      ["Free forever", "No hidden fees, no premium tier, no credit card required."],
      ["UK-friendly formatting", "2-page layouts, no photo by default, clean British CV conventions."],
      ["6 professional templates", "Classic, Modern, Minimal, Corporate, Creative, Sidebar — all ATS-tested."],
      ["Your data stays private", "Nothing is sent to a server. Your information stays in your browser."],
    ],
    stepsTitle: "Three simple steps",
    steps: [
      { n: "01", t: "Fill in your details", d: "Add your experience, skills, and education." },
      { n: "02", t: "Choose a template", d: "6 layouts and 8 colour themes to pick from." },
      { n: "03", t: "Download your PDF", d: "One click. Your CV is ready to send." },
    ],
    finalH: "Your next role starts with a great CV",
    finalSub: "Join thousands of UK job seekers who've built their CV with Resume88 — in under 5 minutes.",
    footer: "100% free. No account. No signup. Ever.",
    builderLabel: "Build My CV",
    navBlog: "Blog",
  },
  {
    slug: "en-ca",
    lang: "en-CA",
    hreflang: "en-CA",
    dir: "ltr",
    country: "Canada",
    title: "Free Resume Builder Canada — No Signup Required | Resume88",
    description: "Create a professional resume in minutes. 6 templates, 8 colors, instant PDF download. Free, no signup, no credit card — built for the Canadian job market.",
    keywords: "free resume builder canada, resume maker canada, resume template canada free, canadian resume builder, free resume download canada",
    badge: "100% Free — No Login, No Sign Up, No Credit Card. Ever.",
    h1: "Build Your Resume in Minutes — Free",
    lede: "No signup, no credit card, no account. A polished, professional resume ready to download as PDF — designed with Canadian job market conventions in mind.",
    cta: "Build My Resume — Free",
    ctaSub: "No account needed  ·  Free PDF download  ·  Takes 5 minutes",
    trustBar: ["Always free", "No signup required", "Instant PDF export", "Data stays private"],
    whyTitle: "Why Resume88 works for Canadian job seekers",
    whyBullets: [
      ["Free forever", "No hidden fees, no premium tier, no credit card required."],
      ["Canada-friendly formatting", "1–2 page layouts, no photo by default, clean professional style that fits Canadian hiring norms."],
      ["6 professional templates", "Classic, Modern, Minimal, Corporate, Creative, Sidebar — all ATS-tested."],
      ["Your data stays private", "Nothing is sent to a server. Your information stays in your browser."],
    ],
    stepsTitle: "Three simple steps",
    steps: [
      { n: "01", t: "Fill in your details", d: "Add your experience, skills, and education." },
      { n: "02", t: "Choose a template", d: "6 layouts and 8 color themes to pick from." },
      { n: "03", t: "Download your PDF", d: "One click. Your resume is ready to send." },
    ],
    finalH: "Your next job starts with a great resume",
    finalSub: "Join thousands of Canadian job seekers who've built their resume with Resume88 — in under 5 minutes.",
    footer: "100% free. No account. No signup. Ever.",
    builderLabel: "Build My Resume",
    navBlog: "Blog",
  },
  {
    slug: "en-au",
    lang: "en-AU",
    hreflang: "en-AU",
    dir: "ltr",
    country: "Australia",
    title: "Free Resume Builder Australia — No Signup | Resume88",
    description: "Create a professional Australian resume in minutes. 6 templates, 8 colors, instant PDF download. Free forever, no signup, no credit card.",
    keywords: "free resume builder australia, resume maker australia, australian resume template, cv builder australia, resume download australia free",
    badge: "100% Free — No Login, No Sign Up, No Credit Card. Ever.",
    h1: "Build Your Resume in Minutes — Free",
    lede: "No signup, no credit card, no account. A polished, professional Australian-style resume ready to download as PDF — made for local employers and agencies.",
    cta: "Build My Resume — Free",
    ctaSub: "No account needed  ·  Free PDF download  ·  Takes 5 minutes",
    trustBar: ["Always free", "No signup required", "Instant PDF export", "Data stays private"],
    whyTitle: "Why Resume88 works for Australian job seekers",
    whyBullets: [
      ["Free forever", "No hidden fees, no premium tier, no credit card required."],
      ["Australia-friendly formatting", "2–3 page layouts common in Australian hiring, no photo by default, straightforward professional style."],
      ["6 professional templates", "Classic, Modern, Minimal, Corporate, Creative, Sidebar — all ATS-tested."],
      ["Your data stays private", "Nothing is sent to a server. Your information stays in your browser."],
    ],
    stepsTitle: "Three simple steps",
    steps: [
      { n: "01", t: "Fill in your details", d: "Add your experience, skills, and education." },
      { n: "02", t: "Choose a template", d: "6 layouts and 8 color themes to pick from." },
      { n: "03", t: "Download your PDF", d: "One click. Your resume is ready to send." },
    ],
    finalH: "Your next job starts with a great resume",
    finalSub: "Join thousands of Australian job seekers who've built their resume with Resume88 — in under 5 minutes.",
    footer: "100% free. No account. No signup. Ever.",
    builderLabel: "Build My Resume",
    navBlog: "Blog",
  },
  {
    slug: "en-in",
    lang: "en-IN",
    hreflang: "en-IN",
    dir: "ltr",
    country: "India",
    title: "Free Resume Builder India — No Signup, No Credit Card | Resume88",
    description: "Create a professional resume or CV in minutes. 6 templates, 8 colors, instant PDF download. Free forever, no signup, no credit card — built for Indian job seekers.",
    keywords: "free resume builder india, resume maker india, cv builder india free, indian resume template, free cv download india, resume pdf india",
    badge: "100% Free — No Login, No Sign Up, No Credit Card. Ever.",
    h1: "Build Your Resume in Minutes — Free",
    lede: "No signup, no credit card, no account. A polished, professional resume or CV ready to download as PDF — designed for Indian job seekers applying to MNCs, startups, and local companies.",
    cta: "Build My Resume — Free",
    ctaSub: "No account needed  ·  Free PDF download  ·  Takes 5 minutes",
    trustBar: ["Always free", "No signup required", "Instant PDF export", "Data stays private"],
    whyTitle: "Why Resume88 works for Indian job seekers",
    whyBullets: [
      ["Free forever", "No hidden fees, no premium tier, no credit card required. A real free alternative."],
      ["ATS-friendly for MNCs", "Works with every major Applicant Tracking System used by Indian and global employers."],
      ["6 professional templates", "Classic, Modern, Minimal, Corporate, Creative, Sidebar — all tested."],
      ["Your data stays private", "Nothing is sent to a server. Your information stays in your browser."],
    ],
    stepsTitle: "Three simple steps",
    steps: [
      { n: "01", t: "Fill in your details", d: "Add your experience, skills, and education." },
      { n: "02", t: "Choose a template", d: "6 layouts and 8 color themes to pick from." },
      { n: "03", t: "Download your PDF", d: "One click. Your resume is ready to send." },
    ],
    finalH: "Your next job starts with a great resume",
    finalSub: "Join thousands of Indian job seekers who've built their resume with Resume88 — in under 5 minutes.",
    footer: "100% free. No account. No signup. Ever.",
    builderLabel: "Build My Resume",
    navBlog: "Blog",
  },
  {
    slug: "en-nz",
    lang: "en-NZ",
    hreflang: "en-NZ",
    dir: "ltr",
    country: "New Zealand",
    title: "Free Resume Builder NZ — No Signup Required | Resume88",
    description: "Create a professional New Zealand CV in minutes. 6 templates, 8 colors, instant PDF download. Free, no signup, no credit card.",
    keywords: "free cv builder nz, resume maker new zealand, nz cv template free, cv builder new zealand, free resume download nz",
    badge: "100% Free — No Login, No Sign Up, No Credit Card. Ever.",
    h1: "Build Your CV in Minutes — Free",
    lede: "No signup, no credit card, no account. A polished, professional CV ready to download as PDF — made for New Zealand job seekers.",
    cta: "Build My CV — Free",
    ctaSub: "No account needed  ·  Free PDF download  ·  Takes 5 minutes",
    trustBar: ["Always free", "No signup required", "Instant PDF export", "Data stays private"],
    whyTitle: "Why Resume88 works for NZ job seekers",
    whyBullets: [
      ["Free forever", "No hidden fees, no premium tier, no credit card required."],
      ["NZ-friendly formatting", "2–3 page layouts common in New Zealand, no photo by default, professional local style."],
      ["6 professional templates", "Classic, Modern, Minimal, Corporate, Creative, Sidebar — all ATS-tested."],
      ["Your data stays private", "Nothing is sent to a server. Your information stays in your browser."],
    ],
    stepsTitle: "Three simple steps",
    steps: [
      { n: "01", t: "Fill in your details", d: "Add your experience, skills, and education." },
      { n: "02", t: "Choose a template", d: "6 layouts and 8 color themes to pick from." },
      { n: "03", t: "Download your PDF", d: "One click. Your CV is ready to send." },
    ],
    finalH: "Your next job starts with a great CV",
    finalSub: "Join thousands of New Zealand job seekers who've built their CV with Resume88 — in under 5 minutes.",
    footer: "100% free. No account. No signup. Ever.",
    builderLabel: "Build My CV",
    navBlog: "Blog",
  },
];

// Build hreflang block shared across all pages
function hreflangBlock(selfSlug) {
  const tags = locales
    .map(l => `<link rel="alternate" hreflang="${l.hreflang}" href="${BASE_URL}/${l.slug}/" />`)
    .join("\n");
  return tags + `\n<link rel="alternate" hreflang="en" href="${BASE_URL}/" />\n<link rel="alternate" hreflang="x-default" href="${BASE_URL}/" />`;
}

function localeCss() {
  return `
  body { font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif; color: #1f2937; margin: 0; background: #fff; line-height: 1.6; }
  .hero { max-width: 760px; margin: 0 auto; padding: 80px 24px 40px; text-align: center; }
  .badge { display: inline-flex; align-items: center; gap: 8px; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; border-radius: 999px; padding: 6px 16px; font-size: 13px; font-weight: 500; margin-bottom: 32px; }
  .badge::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: #2563eb; }
  h1 { font-size: clamp(34px, 5vw, 54px); font-weight: 800; letter-spacing: -0.8px; line-height: 1.15; color: #0f172a; margin: 0 0 18px; }
  .lede { font-size: 18px; line-height: 1.6; color: #64748b; margin: 0 auto 32px; max-width: 560px; }
  .cta-btn { display: inline-block; background: #2563eb; color: #fff; font-weight: 700; font-size: 17px; padding: 16px 36px; border-radius: 16px; text-decoration: none; box-shadow: 0 4px 14px rgba(37,99,235,0.2); transition: all 0.2s ease; }
  .cta-btn:hover { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(37,99,235,0.3); }
  .cta-sub { display: block; color: #94a3b8; font-size: 13px; margin-top: 16px; letter-spacing: 0.3px; }
  .trust-bar { border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; background: #f8fafc; }
  .trust-bar-inner { max-width: 960px; margin: 0 auto; padding: 20px 24px; display: flex; flex-wrap: wrap; justify-content: center; gap: 36px; }
  .trust-bar-inner span { color: #64748b; font-size: 14px; font-weight: 500; }
  .section { max-width: 960px; margin: 0 auto; padding: 80px 24px; }
  .section h2 { font-size: 30px; font-weight: 800; letter-spacing: -0.4px; color: #0f172a; margin: 0 0 40px; text-align: center; }
  .why-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 22px; }
  .why-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 18px; padding: 28px; transition: all 0.25s ease; }
  .why-card:hover { border-color: #bfdbfe; box-shadow: 0 8px 24px rgba(37,99,235,0.08); transform: translateY(-2px); }
  .why-card h3 { font-size: 17px; font-weight: 700; color: #0f172a; margin: 0 0 10px; }
  .why-card p { font-size: 14px; color: #64748b; margin: 0; line-height: 1.6; }
  .steps-section { background: #f8fafc; }
  .steps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 32px; }
  .step { text-align: center; }
  .step-num { display: inline-block; background: #2563eb; color: #fff; width: 44px; height: 44px; line-height: 44px; border-radius: 50%; font-weight: 800; margin-bottom: 16px; }
  .step h3 { font-size: 17px; color: #0f172a; margin: 0 0 8px; }
  .step p { font-size: 14px; color: #64748b; margin: 0; }
  .final { background: linear-gradient(135deg, #1e3a8a, #2563eb); padding: 80px 24px; text-align: center; }
  .final h2 { color: #fff; font-size: 32px; font-weight: 800; margin: 0 0 14px; }
  .final p { color: rgba(255,255,255,0.85); font-size: 16px; margin: 0 0 32px; }
  .final .cta-btn { background: #fff; color: #2563eb; }
  footer { text-align: center; padding: 40px 24px; color: #94a3b8; font-size: 13px; border-top: 1px solid #f1f5f9; }
  footer a { color: #64748b; margin: 0 10px; text-decoration: none; }
  footer a:hover { color: #2563eb; }
  .brand { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 28px; font-weight: 800; font-size: 20px; color: #0f172a; letter-spacing: -0.3px; text-decoration: none; }
  .brand img { width: 32px; height: 32px; border-radius: 8px; }
  .brand span { color: #2563eb; }
  @media (max-width: 640px) { .hero { padding: 56px 20px 32px; } .section { padding: 56px 20px; } .final { padding: 56px 20px; } }
  [dir="rtl"] .cta-sub, [dir="rtl"] .lede, [dir="rtl"] h1 { text-align: center; }
  `;
}

function pageHtml(l) {
  const url = `${BASE_URL}/${l.slug}/`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": l.title,
    "description": l.description,
    "url": url,
    "inLanguage": l.hreflang,
    "publisher": {
      "@type": "Organization",
      "name": "Resume88",
      "url": BASE_URL,
    },
  };

  return `<!DOCTYPE html>
<html lang="${l.lang}" dir="${l.dir}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${l.title}</title>
<meta name="description" content="${l.description}" />
<meta name="keywords" content="${l.keywords}" />
<meta name="robots" content="index, follow" />
<meta name="author" content="Resume88" />
<link rel="canonical" href="${url}" />
${hreflangBlock(l.slug)}
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${l.title}" />
<meta property="og:description" content="${l.description}" />
<meta property="og:image" content="${BASE_URL}/og-image.png" />
<meta property="og:locale" content="${l.hreflang.replace("-", "_")}" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="icon" href="/favicon.ico" />
<style>${localeCss()}</style>
<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>
</head>
<body>

<section class="hero">
  <a href="/" class="brand"><img src="/favicon.ico" alt="Resume88 logo" width="32" height="32" />Resume<span>88</span></a>
  <div class="badge">${l.badge}</div>
  <h1>${l.h1}</h1>
  <p class="lede">${l.lede}</p>
  <a href="/" class="cta-btn">${l.cta}</a>
  <span class="cta-sub">${l.ctaSub}</span>
</section>

<div class="trust-bar">
  <div class="trust-bar-inner">
    ${l.trustBar.map(item => `<span>&#10003; ${item}</span>`).join("\n    ")}
  </div>
</div>

<section class="section">
  <h2>${l.whyTitle}</h2>
  <div class="why-grid">
    ${l.whyBullets.map(([h, p]) => `<div class="why-card"><h3>${h}</h3><p>${p}</p></div>`).join("\n    ")}
  </div>
</section>

<section class="section steps-section" style="max-width:none;">
  <div style="max-width:960px;margin:0 auto;">
    <h2>${l.stepsTitle}</h2>
    <div class="steps-grid">
      ${l.steps.map(s => `<div class="step"><div class="step-num">${s.n}</div><h3>${s.t}</h3><p>${s.d}</p></div>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="final">
  <h2>${l.finalH}</h2>
  <p>${l.finalSub}</p>
  <a href="/" class="cta-btn">${l.cta}</a>
</section>

<footer>
  <p>${l.footer}</p>
  <p style="margin-top:10px;">
    <a href="/">${l.builderLabel}</a>
    &middot;
    <a href="/blog/">${l.navBlog}</a>
  </p>
</footer>

</body>
</html>
`;
}

let count = 0;
for (const l of locales) {
  const dir = path.join(PUBLIC_DIR, l.slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), pageHtml(l));
  count++;
}

// Emit the hreflang block for use by the main index.html
const mainHreflang = locales
  .map(l => `    <link rel="alternate" hreflang="${l.hreflang}" href="${BASE_URL}/${l.slug}/" />`)
  .join("\n") +
  `\n    <link rel="alternate" hreflang="en" href="${BASE_URL}/" />\n    <link rel="alternate" hreflang="x-default" href="${BASE_URL}/" />`;

fs.writeFileSync(path.join(__dirname, "_hreflang-snippet.txt"), mainHreflang + "\n");

console.log(`✓ Generated ${count} locale landing pages at public/{${locales.map(l => l.slug).join(",")}}/index.html`);
console.log(`✓ Saved hreflang snippet to scripts/_hreflang-snippet.txt`);
