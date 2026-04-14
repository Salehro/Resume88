import { useState, useCallback, useRef, useEffect } from "react";
import { trackEvent, supabase } from './supabase';

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    badge: "100% Free — No Login, No Sign Up, No Credit Card. Ever.",
    headline: "Build Your Resume in Minutes",
    heroSub: "No signup. No credit card. Just a polished, professional resume — ready to download as PDF, completely free.",
    cta: "Build My Resume — Free",
    ctaSub: "No account needed  ·  Free PDF download  ·  Takes 5 minutes",
    trustBar: ["Always free", "No signup required", "Instant PDF export", "Your data stays private"],
    vp1: "Free Forever", vp1d: "No hidden fees, no premium tier, no credit card. Resume88 is and will always be 100% free.",
    vp2: "No Account Needed", vp2d: "Start building immediately. No signup, no email verification, no passwords to remember.",
    vp3: "Instant PDF Download", vp3d: "Your resume is ready to download as a clean, professional PDF in seconds.",
    vp4: "6 Professional Templates", vp4d: "Classic, Modern, Minimal, Corporate, Creative, and Sidebar layouts — all polished and ATS-friendly.",
    vp5: "Works Everywhere", vp5d: "Built for the web. Works on your phone, tablet, or desktop — no app install required.",
    vp6: "Private & Secure", vp6d: "Your data never leaves your browser. Nothing is sent to a server. It's your resume, your data.",
    howTitle: "Three steps. That's it.",
    step1: "Fill in your details", step1d: "Add your experience, skills, education — guided mode walks you through it.",
    step2: "Pick a template & color", step2d: "Choose from 6 professional layouts and 8 color themes.",
    step3: "Download your PDF", step3d: "One click. Your resume is ready to send to employers.",
    finalCta: "Your next job starts with a great resume",
    finalCtaSub: "Join thousands who've built their resume with Resume88 — takes under 5 minutes.",
    sub: "Create, customize, and download your resume as PDF in minutes. Completely free, forever.",
    feat1: "No account required", feat2: "Instant PDF download", feat3: "6 beautiful templates",
    guided: "Guided Step-by-Step", guidedSub: "— beginner friendly",
    manual: "Jump to Editor",
    saved: "Saved progress detected — your data is pre-loaded",
    contact: "Contact & Feedback",
    contactSub: "Have a suggestion or found a bug? I'd love to hear from you.",
    namePh: "Your name", emailPh: "Your email", msgPh: "Your message...",
    send: "Send Message", sending: "Sending...", sent: "Message sent! Thank you 🎉",
    sendErr: "Failed to send. Please try again.",
    builtBy: "Built & open-sourced by Guidjedj Saleh",
  },
  fr: {
    badge: "100% Gratuit — Sans connexion, sans inscription, sans carte bancaire. Jamais.",
    headline: "Créez votre CV en quelques minutes",
    heroSub: "Sans inscription. Sans carte bancaire. Un CV professionnel prêt à télécharger en PDF, totalement gratuit.",
    cta: "Créer mon CV — Gratuit",
    ctaSub: "Sans compte  ·  PDF gratuit  ·  5 minutes",
    trustBar: ["Toujours gratuit", "Sans inscription", "Export PDF instantané", "Données privées"],
    vp1: "Gratuit pour toujours", vp1d: "Pas de frais cachés, pas de forfait premium, pas de carte bancaire.",
    vp2: "Sans compte requis", vp2d: "Commencez immédiatement. Pas d'inscription, pas de vérification.",
    vp3: "Téléchargement PDF instantané", vp3d: "Votre CV est prêt en quelques secondes en PDF professionnel.",
    vp4: "6 modèles professionnels", vp4d: "Classic, Modern, Minimal, Corporate, Creative et Sidebar.",
    vp5: "Fonctionne partout", vp5d: "Sur téléphone, tablette ou ordinateur — aucune installation requise.",
    vp6: "Privé et sécurisé", vp6d: "Vos données restent dans votre navigateur. Rien n'est envoyé à un serveur.",
    howTitle: "Trois étapes. C'est tout.",
    step1: "Remplissez vos informations", step1d: "Ajoutez expérience, compétences, formation.",
    step2: "Choisissez un modèle", step2d: "6 mises en page et 8 thèmes de couleurs.",
    step3: "Téléchargez votre PDF", step3d: "Un clic. Votre CV est prêt.",
    finalCta: "Votre prochain emploi commence par un bon CV",
    finalCtaSub: "Rejoignez des milliers de personnes — en moins de 5 minutes.",
    sub: "Créez, personnalisez et téléchargez votre CV en PDF en quelques minutes. Totalement gratuit, pour toujours.",
    feat1: "Sans compte requis", feat2: "Téléchargement PDF instantané", feat3: "6 modèles élégants",
    guided: "Guide Étape par Étape", guidedSub: "— idéal pour débutants",
    manual: "Aller à l'éditeur",
    saved: "Progression sauvegardée — vos données sont pré-chargées",
    contact: "Contact & Commentaires",
    contactSub: "Une suggestion ou un bug ? Je serais ravi de vous lire.",
    namePh: "Votre nom", emailPh: "Votre email", msgPh: "Votre message...",
    send: "Envoyer", sending: "Envoi...", sent: "Message envoyé ! Merci 🎉",
    sendErr: "Échec de l'envoi. Réessayez.",
    builtBy: "Développé et open-source par Guidjedj Saleh",
  },
  es: {
    badge: "100% Gratis — Sin inicio de sesión, sin registro, sin tarjeta. Nunca.",
    headline: "Crea tu currículum en minutos",
    heroSub: "Sin registro. Sin tarjeta. Un currículum profesional listo para descargar en PDF, completamente gratis.",
    cta: "Crear mi currículum — Gratis",
    ctaSub: "Sin cuenta  ·  PDF gratis  ·  5 minutos",
    trustBar: ["Siempre gratis", "Sin registro", "PDF instantáneo", "Datos privados"],
    vp1: "Gratis para siempre", vp1d: "Sin costes ocultos, sin planes premium, sin tarjeta.",
    vp2: "Sin cuenta necesaria", vp2d: "Empieza ahora. Sin registro, sin verificación.",
    vp3: "Descarga PDF instantánea", vp3d: "Tu currículum listo en segundos como PDF profesional.",
    vp4: "6 plantillas profesionales", vp4d: "Classic, Modern, Minimal, Corporate, Creative y Sidebar.",
    vp5: "Funciona en todas partes", vp5d: "En móvil, tablet u ordenador — sin instalar nada.",
    vp6: "Privado y seguro", vp6d: "Tus datos no salen de tu navegador. Nada se envía a un servidor.",
    howTitle: "Tres pasos. Eso es todo.",
    step1: "Completa tus datos", step1d: "Añade experiencia, habilidades, educación.",
    step2: "Elige una plantilla", step2d: "6 diseños y 8 temas de color.",
    step3: "Descarga tu PDF", step3d: "Un clic. Tu currículum está listo.",
    finalCta: "Tu próximo empleo empieza con un buen currículum",
    finalCtaSub: "Únete a miles de personas — en menos de 5 minutos.",
    sub: "Crea, personaliza y descarga tu currículum en PDF en minutos. Completamente gratis, para siempre.",
    feat1: "Sin cuenta requerida", feat2: "Descarga PDF instantánea", feat3: "6 plantillas hermosas",
    guided: "Guía Paso a Paso", guidedSub: "— amigable para principiantes",
    manual: "Ir al editor",
    saved: "Progreso guardado — tus datos están precargados",
    contact: "Contacto y Sugerencias",
    contactSub: "¿Tienes una sugerencia o encontraste un error? Me encantaría saberlo.",
    namePh: "Tu nombre", emailPh: "Tu correo", msgPh: "Tu mensaje...",
    send: "Enviar Mensaje", sending: "Enviando...", sent: "¡Mensaje enviado! Gracias 🎉",
    sendErr: "Error al enviar. Inténtalo de nuevo.",
    builtBy: "Desarrollado y de código abierto por Guidjedj Saleh",
  },
  ar: {
    badge: "مجاني 100% — بدون تسجيل دخول، بدون اشتراك، بدون بطاقة بنكية. أبداً.",
    headline: "أنشئ سيرتك الذاتية في دقائق",
    heroSub: "بدون تسجيل. بدون بطاقة بنكية. سيرة ذاتية احترافية جاهزة للتحميل كـ PDF، مجاناً تماماً.",
    cta: "أنشئ سيرتي الذاتية — مجاناً",
    ctaSub: "بدون حساب  ·  تحميل PDF مجاني  ·  5 دقائق",
    trustBar: ["مجاني دائماً", "بدون تسجيل", "تصدير PDF فوري", "بياناتك خاصة"],
    vp1: "مجاني للأبد", vp1d: "لا رسوم خفية، لا باقات مدفوعة، لا بطاقة بنكية.",
    vp2: "بدون حساب", vp2d: "ابدأ فوراً. بدون تسجيل أو تحقق.",
    vp3: "تحميل PDF فوري", vp3d: "سيرتك الذاتية جاهزة للتحميل في ثوانٍ.",
    vp4: "6 قوالب احترافية", vp4d: "كلاسيكي، حديث، بسيط، مؤسسي، إبداعي، وشريط جانبي.",
    vp5: "يعمل في كل مكان", vp5d: "على الهاتف أو الجهاز اللوحي أو الكمبيوتر.",
    vp6: "خاص وآمن", vp6d: "بياناتك لا تغادر متصفحك. لا شيء يُرسل إلى خادم.",
    howTitle: "ثلاث خطوات فقط.",
    step1: "أملأ بياناتك", step1d: "أضف الخبرة والمهارات والتعليم.",
    step2: "اختر قالباً", step2d: "6 تصاميم و8 ألوان.",
    step3: "حمّل ملف PDF", step3d: "نقرة واحدة. سيرتك جاهزة.",
    finalCta: "وظيفتك القادمة تبدأ بسيرة ذاتية رائعة",
    finalCtaSub: "انضم إلى الآلاف — في أقل من 5 دقائق.",
    sub: "أنشئ سيرتك الذاتية وخصّصها وحمّلها بصيغة PDF في دقائق. مجاني تماماً وللأبد.",
    feat1: "لا حاجة لحساب", feat2: "تحميل PDF فوري", feat3: "6 قوالب جميلة",
    guided: "دليل خطوة بخطوة", guidedSub: "— مناسب للمبتدئين",
    manual: "الانتقال إلى المحرر",
    saved: "تم اكتشاف تقدم محفوظ — بياناتك محمّلة مسبقاً",
    contact: "تواصل وملاحظات",
    contactSub: "هل لديك اقتراح أو وجدت خطأ؟ يسعدني سماعك.",
    namePh: "اسمك", emailPh: "بريدك الإلكتروني", msgPh: "رسالتك...",
    send: "إرسال الرسالة", sending: "جاري الإرسال...", sent: "تم إرسال الرسالة! شكراً 🎉",
    sendErr: "فشل الإرسال. حاول مجدداً.",
    builtBy: "بُني ونشر كمصدر مفتوح بواسطة Guidjedj Saleh",
  },
  de: {
    badge: "100% Kostenlos — Kein Login, keine Registrierung, keine Kreditkarte. Niemals.",
    headline: "Erstelle deinen Lebenslauf in Minuten",
    heroSub: "Keine Registrierung. Keine Kreditkarte. Ein professioneller Lebenslauf als PDF — völlig kostenlos.",
    cta: "Lebenslauf erstellen — Kostenlos",
    ctaSub: "Kein Konto  ·  Kostenloses PDF  ·  5 Minuten",
    trustBar: ["Immer kostenlos", "Ohne Registrierung", "Sofortiger PDF-Export", "Daten bleiben privat"],
    vp1: "Für immer kostenlos", vp1d: "Keine versteckten Kosten, kein Premium-Plan, keine Kreditkarte.",
    vp2: "Kein Konto erforderlich", vp2d: "Sofort loslegen. Keine Anmeldung, keine Verifizierung.",
    vp3: "Sofortiger PDF-Download", vp3d: "Dein Lebenslauf ist in Sekunden als professionelles PDF bereit.",
    vp4: "6 professionelle Vorlagen", vp4d: "Classic, Modern, Minimal, Corporate, Creative und Sidebar.",
    vp5: "Funktioniert überall", vp5d: "Auf Handy, Tablet oder Desktop — keine Installation nötig.",
    vp6: "Privat und sicher", vp6d: "Deine Daten verlassen nie deinen Browser.",
    howTitle: "Drei Schritte. Das war's.",
    step1: "Daten ausfüllen", step1d: "Erfahrung, Fähigkeiten, Ausbildung hinzufügen.",
    step2: "Vorlage wählen", step2d: "6 Layouts und 8 Farbthemen.",
    step3: "PDF herunterladen", step3d: "Ein Klick. Dein Lebenslauf ist fertig.",
    finalCta: "Dein nächster Job beginnt mit einem guten Lebenslauf",
    finalCtaSub: "Schließe dich Tausenden an — in unter 5 Minuten.",
    sub: "Erstelle, passe an und lade deinen Lebenslauf als PDF in Minuten herunter. Völlig kostenlos, für immer.",
    feat1: "Kein Konto erforderlich", feat2: "Sofortiger PDF-Download", feat3: "6 schöne Vorlagen",
    guided: "Schritt-für-Schritt-Anleitung", guidedSub: "— anfängerfreundlich",
    manual: "Zum Editor",
    saved: "Gespeicherter Fortschritt erkannt — Ihre Daten sind vorgeladen",
    contact: "Kontakt & Feedback",
    contactSub: "Haben Sie einen Vorschlag oder einen Fehler gefunden?",
    namePh: "Ihr Name", emailPh: "Ihre E-Mail", msgPh: "Ihre Nachricht...",
    send: "Nachricht senden", sending: "Wird gesendet...", sent: "Nachricht gesendet! Danke 🎉",
    sendErr: "Senden fehlgeschlagen. Bitte versuchen Sie es erneut.",
    builtBy: "Erstellt und Open-Source von Guidjedj Saleh",
  },
  zh: {
    badge: "100% 免费 — 无需登录、无需注册、无需信用卡。永远。",
    headline: "几分钟内创建你的简历",
    heroSub: "无需注册。无需信用卡。专业简历即时下载为PDF，完全免费。",
    cta: "免费创建简历",
    ctaSub: "无需账户  ·  免费PDF  ·  5分钟",
    trustBar: ["永远免费", "无需注册", "即时PDF导出", "数据保持私密"],
    vp1: "永久免费", vp1d: "无隐藏费用，无高级版，无需信用卡。",
    vp2: "无需账户", vp2d: "立即开始。无需注册，无需验证。",
    vp3: "即时PDF下载", vp3d: "您的简历在几秒钟内即可作为专业PDF下载。",
    vp4: "6个专业模板", vp4d: "经典、现代、极简、商务、创意和侧边栏布局。",
    vp5: "随处使用", vp5d: "手机、平板或电脑 — 无需安装。",
    vp6: "私密安全", vp6d: "数据不离开浏览器。不发送到服务器。",
    howTitle: "三步完成。就这么简单。",
    step1: "填写信息", step1d: "添加经验、技能、教育。",
    step2: "选择模板", step2d: "6种布局和8种配色。",
    step3: "下载PDF", step3d: "一键完成。简历已就绪。",
    finalCta: "你的下一份工作从一份好简历开始",
    finalCtaSub: "加入数千人 — 不到5分钟。",
    sub: "在几分钟内创建、自定义并下载PDF简历。完全免费，永久有效。",
    feat1: "无需账户", feat2: "即时PDF下载", feat3: "6个精美模板",
    guided: "逐步引导", guidedSub: "— 适合初学者",
    manual: "进入编辑器",
    saved: "检测到已保存的进度 — 您的数据已预加载",
    contact: "联系与反馈",
    contactSub: "有建议或发现错误？我很乐意听取您的意见。",
    namePh: "您的姓名", emailPh: "您的邮箱", msgPh: "您的留言...",
    send: "发送消息", sending: "发送中...", sent: "消息已发送！谢谢 🎉",
    sendErr: "发送失败，请重试。",
    builtBy: "由 Guidjedj Saleh 构建并开源",
  },
  pt: {
    badge: "100% Gratuito — Sem login, sem cadastro, sem cartão. Nunca.",
    headline: "Crie seu currículo em minutos",
    heroSub: "Sem cadastro. Sem cartão. Um currículo profissional pronto para download em PDF, completamente grátis.",
    cta: "Criar meu currículo — Grátis",
    ctaSub: "Sem conta  ·  PDF grátis  ·  5 minutos",
    trustBar: ["Sempre grátis", "Sem cadastro", "PDF instantâneo", "Dados privados"],
    vp1: "Grátis para sempre", vp1d: "Sem custos ocultos, sem plano premium, sem cartão.",
    vp2: "Sem conta necessária", vp2d: "Comece agora. Sem cadastro, sem verificação.",
    vp3: "Download PDF instantâneo", vp3d: "Seu currículo pronto em segundos como PDF profissional.",
    vp4: "6 modelos profissionais", vp4d: "Classic, Modern, Minimal, Corporate, Creative e Sidebar.",
    vp5: "Funciona em qualquer lugar", vp5d: "No celular, tablet ou computador — sem instalação.",
    vp6: "Privado e seguro", vp6d: "Seus dados não saem do navegador. Nada é enviado a um servidor.",
    howTitle: "Três passos. Só isso.",
    step1: "Preencha seus dados", step1d: "Adicione experiência, habilidades, educação.",
    step2: "Escolha um modelo", step2d: "6 layouts e 8 temas de cores.",
    step3: "Baixe seu PDF", step3d: "Um clique. Seu currículo está pronto.",
    finalCta: "Seu próximo emprego começa com um bom currículo",
    finalCtaSub: "Junte-se a milhares — em menos de 5 minutos.",
    sub: "Crie, personalize e baixe seu currículo em PDF em minutos. Completamente grátis, para sempre.",
    feat1: "Sem conta necessária", feat2: "Download PDF instantâneo", feat3: "6 modelos bonitos",
    guided: "Guia Passo a Passo", guidedSub: "— amigável para iniciantes",
    manual: "Ir ao editor",
    saved: "Progresso salvo detectado — seus dados estão pré-carregados",
    contact: "Contato e Feedback",
    contactSub: "Tem uma sugestão ou encontrou um bug? Adoraria ouvir de você.",
    namePh: "Seu nome", emailPh: "Seu email", msgPh: "Sua mensagem...",
    send: "Enviar Mensagem", sending: "Enviando...", sent: "Mensagem enviada! Obrigado 🎉",
    sendErr: "Falha ao enviar. Tente novamente.",
    builtBy: "Criado e open-source por Guidjedj Saleh",
  },
};

function getLang() {
  const l = (navigator.language || "en").slice(0,2).toLowerCase();
  return TRANSLATIONS[l] ? l : "en";
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const EMPTY_RESUME = {
  personal: { name:"", title:"", email:"", phone:"", location:"", linkedin:"", github:"", website:"", summary:"", photo:"" },
  experience:[], education:[], skills:[], languages:[], hobbies:[],
  projects:[], certifications:[],
};

const PALETTE_SETS = {
  blue:    { accent:"#2563eb", dark:"#1e40af", light:"#eff6ff", muted:"#dbeafe" },
  violet:  { accent:"#7c3aed", dark:"#5b21b6", light:"#f5f3ff", muted:"#ede9fe" },
  teal:    { accent:"#0f766e", dark:"#115e59", light:"#f0fdfa", muted:"#ccfbf1" },
  rose:    { accent:"#e11d48", dark:"#9f1239", light:"#fff1f2", muted:"#fecdd3" },
  orange:  { accent:"#ea580c", dark:"#9a3412", light:"#fff7ed", muted:"#fed7aa" },
  slate:   { accent:"#475569", dark:"#1e293b", light:"#f8fafc", muted:"#e2e8f0" },
  emerald: { accent:"#059669", dark:"#065f46", light:"#ecfdf5", muted:"#a7f3d0" },
  indigo:  { accent:"#4f46e5", dark:"#3730a3", light:"#eef2ff", muted:"#c7d2fe" },
};

const TEMPLATES = [
  { id:"classic",    label:"Classic",     desc:"Bold header, clean single-column",       icon:"📋" },
  { id:"sidebar",    label:"Sidebar",     desc:"Colored sidebar + photo support",         icon:"▌"  },
  { id:"modern",     label:"Modern",      desc:"Gradient header, sharp & contemporary",   icon:"⚡" },
  { id:"minimal",    label:"Minimal",     desc:"Centered serif header, ultra-clean",      icon:"○"  },
  { id:"corporate",  label:"Corporate",   desc:"Top accent bar, structured layout",       icon:"🏢" },
  { id:"creative",   label:"Creative",    desc:"Bold name, accent block + photo support", icon:"🎨" },
];

const LANG_LEVELS = ["Basic","Conversational","Professional","Fluent","Native"];
const SKILL_LEVELS = ["Beginner","Intermediate","Advanced","Expert"];

const TIPS = {
  personal:   "💡 Use a professional email. LinkedIn/GitHub URLs help recruiters verify your work.",
  summary:    "💡 Keep it 2–4 sentences. Mention your years of experience, main skills, and what you bring to the role.",
  experience: "💡 Use bullet points starting with action verbs: 'Led', 'Built', 'Increased', 'Managed'. Quantify results where possible.",
  education:  "💡 List your most recent degree first. Include GPA only if it's 3.5 or above.",
  skills:     "💡 Mix hard skills (Python, Figma) with soft skills (Team Leadership). Keep it to 8–15 skills.",
  languages:  "💡 Only list languages you can actually use in a work setting.",
  extras:     "💡 Projects and certifications can set you apart, especially if you're early in your career.",
  hobbies:    "💡 Only include hobbies that add value or show personality relevant to the role.",
};

const uid = () => Math.random().toString(36).slice(2,8);
const load = () => { try { return JSON.parse(localStorage.getItem("rb4")||"null"); } catch { return null; } };
const persist = (d) => { try { localStorage.setItem("rb4",JSON.stringify(d)); } catch {} };

// ─── RESUME SCORE ─────────────────────────────────────────────────────────────
function calcScore(r) {
  let s = 0, tips = [];
  if (r.personal.name) s+=10; else tips.push("Add your full name");
  if (r.personal.email) s+=8; else tips.push("Add your email");
  if (r.personal.phone) s+=5; else tips.push("Add your phone number");
  if (r.personal.location) s+=5; else tips.push("Add your location");
  if (r.personal.title) s+=7; else tips.push("Add your job title");
  if (r.personal.summary?.length > 50) s+=10; else tips.push("Write a professional summary (50+ chars)");
  if (r.personal.linkedin) s+=5; else tips.push("Add your LinkedIn URL");
  if (r.experience.length >= 1) s+=15; else tips.push("Add at least one work experience");
  if (r.experience.length >= 1 && r.experience[0].bullets?.length > 30) s+=10; else tips.push("Add bullet points to your experience");
  if (r.education.length >= 1) s+=10; else tips.push("Add your education");
  if (r.skills.length >= 4) s+=10; else tips.push("Add at least 4 skills");
  if (r.skills.length >= 8) s+=5;
  return { score: Math.min(100, s), tips: tips.slice(0,4) };
}

// ─── PDF EXPORT ───────────────────────────────────────────────────────────────
function exportPDF(tmplId, pal, resume) {
  const filename = (resume.personal.name || "resume")
    .replace(/\s+/g,"-").toLowerCase() + ".pdf";

  // Build a full standalone HTML page and open it for printing
  const win = window.open("","_blank");
  if (!win) {
    alert("Please allow popups for resume88.com to download your PDF.");
    return;
  }
  const html = getPrintHTML(tmplId, pal, resume);
  win.document.open();
  win.document.write(html);
  win.document.close();

  // Wait for images (e.g. profile photo) to load before printing
  win.onload = () => {
    win.document.title = filename;
    setTimeout(() => {
      win.focus();
      win.print();
    }, 500);
  };

  // Fallback if onload already fired
  setTimeout(() => {
    if (!win.closed) {
      win.document.title = filename;
      win.focus();
      win.print();
    }
  }, 1500);
}

function getPrintHTML(tmplId, pal, r) {
  const {accent:a, dark:dk, muted:mu} = pal;
  const contact = [
    r.personal.email, r.personal.phone, r.personal.location,
    r.personal.linkedin, r.personal.github, r.personal.website
  ].filter(Boolean);
  const photoHtml = r.personal.photo
    ? `<img src="${r.personal.photo}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid ${mu};box-shadow:0 1px 3px rgba(0,0,0,0.08)" />`
    : "";
  const expH = r.experience.map(e=>`<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;flex-wrap:wrap"><strong style="font-size:12px;color:#1a1a1a">${e.title}${e.company?`<span style="font-weight:400;color:#6b7280"> — ${e.company}</span>`:""}</strong><span style="font-size:10px;color:#9ca3af;letter-spacing:0.3px">${e.start||""}${e.end?" – "+e.end:e.start?" – Present":""}</span></div>${e.location?`<div style="font-size:10px;color:#9ca3af;margin-top:1px">${e.location}</div>`:""}<ul style="margin:4px 0 0 12px;padding:0">${(e.bullets||"").split("\n").filter(Boolean).map(b=>`<li style="font-size:11px;color:#4b5563;line-height:1.6;margin-bottom:2px">${b.replace(/^[•\-]\s*/,"")}</li>`).join("")}</ul></div>`).join("");
  const eduH = r.education.map(e=>`<div style="margin-bottom:10px;display:flex;justify-content:space-between;flex-wrap:wrap"><div><strong style="font-size:12px;color:#1a1a1a">${e.degree}${e.field?" in "+e.field:""}</strong><div style="font-size:11px;color:#6b7280;margin-top:1px">${e.school}</div></div><span style="font-size:10px;color:#9ca3af;letter-spacing:0.3px">${e.year||""}</span></div>`).join("");
  const skillH = `<div style="display:flex;flex-wrap:wrap;gap:4px">${r.skills.map(s=>`<span style="background:${mu};color:${dk};padding:2px 10px;border-radius:20px;font-size:10px;line-height:20px">${s.name}${s.level?`<span style="opacity:0.6"> · ${s.level}</span>`:""}</span>`).join("")}</div>`;
  const langH = r.languages.length ? `<div style="display:flex;flex-wrap:wrap;gap:4px">${r.languages.map(l=>`<span style="background:${mu};color:${dk};padding:2px 10px;border-radius:20px;font-size:10px;line-height:20px">${l.name} · ${l.level}</span>`).join("")}</div>` : "";
  const hobbyH = r.hobbies.length ? r.hobbies.join("  ·  ") : "";
  const projH = r.projects.map(p=>`<div style="margin-bottom:10px"><strong style="font-size:12px;color:#1a1a1a">${p.name}</strong>${p.url?` <span style="font-size:10px;color:${a};margin-left:6px">${p.url}</span>`:""}<p style="margin:2px 0;font-size:11px;color:#6b7280;line-height:1.5">${p.description||""}</p></div>`).join("");
  const certH = r.certifications.map(c=>`<div style="margin-bottom:4px;font-size:11px;color:#374151"><strong>${c.name}</strong>${c.issuer?`<span style="font-weight:400"> — ${c.issuer}</span>`:""} ${c.year?`<span style="color:#9ca3af">(${c.year})</span>`:""}</div>`).join("");

  const sec = (title, body) => body ? `<div style="margin-bottom:18px"><div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.8px;color:${a};border-bottom:1.5px solid ${mu};padding-bottom:4px;margin-bottom:10px;line-height:1">${title}</div>${body}</div>` : "";

  const footer = `<div style="margin-top:24px;padding-top:8px;border-top:1px solid ${mu};text-align:center;font-size:9px;color:${a};letter-spacing:0.5px">Built with <a href="https://www.resume88.com" style="color:${a};text-decoration:none;font-weight:600">resume88.com</a></div>`;

  const base = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${(r.personal.name||"resume").replace(/\s+/g,"-").toLowerCase()}</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',system-ui,-apple-system,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.5;color:#1a1a1a}@media print{@page{size:A4;margin:1cm}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>`;
  const name = r.personal.name||"Your Name", title=r.personal.title||"";
  const mainSections = `
    ${r.personal.summary?sec("Summary",`<p style="font-size:11px;color:#4b5563;line-height:1.7">${r.personal.summary}</p>`):""}
    ${r.experience.length?sec("Experience",expH):""}
    ${r.education.length?sec("Education",eduH):""}
    ${r.skills.length?sec("Skills",skillH):""}
    ${r.languages.length?sec("Languages",langH):""}
    ${r.projects.length?sec("Projects",projH):""}
    ${r.certifications.length?sec("Certifications",certH):""}
    ${r.hobbies.length?sec("Interests",`<p style="font-size:11px;color:#6b7280;letter-spacing:0.3px">${hobbyH}</p>`):""}
  `;
  const sidebarLeft = `
    ${r.personal.photo?`<div style="margin-bottom:12px">${photoHtml}</div>`:""}
    <div style="font-size:16px;font-weight:700;margin-bottom:2px;line-height:1.25">${name}</div>
    <div style="font-size:11px;opacity:.7;margin-bottom:12px">${title}</div>
    <div style="font-size:10px;line-height:2;margin-bottom:12px;border-bottom:1px solid rgba(255,255,255,.15);padding-bottom:10px">${contact.map(c=>"<div>"+c+"</div>").join("")}</div>
    ${r.skills.length?`<div style="margin-bottom:12px"><div style="font-size:9px;text-transform:uppercase;letter-spacing:1.5px;opacity:.5;margin-bottom:6px">Skills</div><div style="display:flex;flex-wrap:wrap;gap:4px">${r.skills.map(s=>`<span style="background:rgba(255,255,255,.15);border-radius:20px;padding:2px 10px;font-size:10px;line-height:20px">${s.name}</span>`).join("")}</div></div>`:""}
    ${r.languages.length?`<div style="margin-bottom:12px"><div style="font-size:9px;text-transform:uppercase;letter-spacing:1.5px;opacity:.5;margin-bottom:6px">Languages</div>${r.languages.map(l=>`<div style="font-size:11px;opacity:.85;margin-bottom:3px">${l.name} · ${l.level}</div>`).join("")}</div>`:""}
    ${r.certifications.length?`<div><div style="font-size:9px;text-transform:uppercase;letter-spacing:1.5px;opacity:.5;margin-bottom:6px">Certifications</div>${r.certifications.map(c=>`<div style="font-size:11px;opacity:.85;margin-bottom:3px">${c.name}</div>`).join("")}</div>`:""}
  `;

  if (tmplId==="sidebar"||tmplId==="creative") return base+`<div style="display:flex;min-height:100vh"><div style="width:33%;background:${a};color:#fff;padding:24px 18px">${sidebarLeft}</div><div style="flex:1;padding:22px 24px">${mainSections}${footer}</div></div></body></html>`;
  if (tmplId==="modern") return base+`<div style="background:linear-gradient(135deg,${dk},${a});color:#fff;padding:28px 32px">${photoHtml?`<div style="display:flex;align-items:center;gap:16px"><div>${photoHtml}</div><div><div style="font-size:23px;font-weight:800;letter-spacing:-0.5px">${name}</div><div style="font-size:12px;opacity:.75;margin-top:4px">${title}</div><div style="display:flex;flex-wrap:wrap;gap:14px;margin-top:10px;font-size:10px;opacity:.6">${contact.map(c=>"<span>"+c+"</span>").join("")}</div></div></div>`:`<div style="font-size:23px;font-weight:800;letter-spacing:-0.5px">${name}</div><div style="font-size:12px;opacity:.75;margin-top:4px">${title}</div><div style="display:flex;flex-wrap:wrap;gap:14px;margin-top:10px;font-size:10px;opacity:.6">${contact.map(c=>"<span>"+c+"</span>").join("")}</div>`}</div><div style="padding:24px 32px">${mainSections}${footer}</div></body></html>`;
  if (tmplId==="corporate") return base+`<div style="height:5px;background:${a}"></div><div style="padding:18px 32px 14px;border-bottom:2px solid ${mu};display:flex;justify-content:space-between;align-items:center">${photoHtml?`<div style="display:flex;align-items:center;gap:14px">${photoHtml}<div><div style="font-size:20px;font-weight:700;color:${dk};line-height:1.2">${name}</div><div style="color:${a};font-size:12px;font-weight:600;margin-top:3px">${title}</div></div></div>`:`<div><div style="font-size:20px;font-weight:700;color:${dk};line-height:1.2">${name}</div><div style="color:${a};font-size:12px;font-weight:600;margin-top:3px">${title}</div></div>`}<div style="text-align:right;font-size:10px;color:#6b7280;line-height:1.9">${contact.map(c=>"<div>"+c+"</div>").join("")}</div></div><div style="padding:22px 32px">${mainSections}${footer}</div></body></html>`;
  if (tmplId==="minimal") return base+`<div style="padding:36px 44px;max-width:720px;font-family:Georgia,'Times New Roman',serif"><div style="text-align:center;margin-bottom:22px;padding-bottom:18px;border-bottom:2px solid ${a}">${photoHtml?`<div style="margin-bottom:10px;display:flex;justify-content:center">${photoHtml}</div>`:""}<div style="font-size:26px;font-weight:300;letter-spacing:3px;text-transform:uppercase;color:#1f2937;line-height:1.2">${name}</div>${title?`<div style="font-size:11px;letter-spacing:2.5px;text-transform:uppercase;margin-top:6px;color:${a}">${title}</div>`:""}<div style="font-size:10px;color:#9ca3af;margin-top:10px;display:flex;justify-content:center;gap:14px;flex-wrap:wrap">${contact.map(c=>"<span>"+c+"</span>").join("")}</div></div>${mainSections}${footer}</div></body></html>`;
  return base+`<div style="padding:28px 32px;max-width:760px"><div style="margin-bottom:18px;padding-bottom:14px;border-bottom:3px solid ${a};display:flex;justify-content:space-between;align-items:center">${photoHtml?`<div style="display:flex;align-items:center;gap:14px">${photoHtml}<div><div style="font-size:22px;font-weight:700;color:${dk};line-height:1.2;letter-spacing:-0.3px">${name}</div>${title?`<div style="font-size:12px;font-weight:600;color:${a};margin-top:3px;letter-spacing:0.2px">${title}</div>`:""}<div style="margin-top:6px;font-size:10px;color:#6b7280;display:flex;gap:12px;flex-wrap:wrap">${contact.map(c=>"<span>"+c+"</span>").join("")}</div></div></div>`:`<div><div style="font-size:22px;font-weight:700;color:${dk};line-height:1.2;letter-spacing:-0.3px">${name}</div>${title?`<div style="font-size:12px;font-weight:600;color:${a};margin-top:3px">${title}</div>`:""}</div><div style="text-align:right;font-size:10px;color:#6b7280;line-height:1.9">${contact.map(c=>"<div>"+c+"</div>").join("")}</div>`}</div>${mainSections}${footer}</div></body></html>`;
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const saved = load();
  const [resume, setResume] = useState(saved?.resume || EMPTY_RESUME);
  const [tmplId, setTmplId] = useState(saved?.tmplId || "classic");
  const [palKey, setPalKey] = useState(saved?.palKey || "blue");
  const [view, setView] = useState("start");
  const [step, setStep] = useState(0);
  const [tab, setTab] = useState("personal");
  const [showPreview, setShowPreview] = useState(false);

  const pal = PALETTE_SETS[palKey] || PALETTE_SETS.blue;

  useEffect(() => { trackEvent("view"); }, []);

  const update = useCallback((path, val) => {
    setResume(prev => {
      const next = path.length===1 ? {...prev,[path[0]]:val} : {...prev,[path[0]]:{...prev[path[0]],[path[1]]:val}};
      persist({ resume:next, tmplId, palKey });
      return next;
    });
  }, [tmplId, palKey]);

  const saveAll = (r=resume,t=tmplId,p=palKey) => persist({resume:r,tmplId:t,palKey:p});

  if (view==="admin") return <AdminDashboard onExit={()=>setView("start")} />;
  if (view==="start") return <StartScreen onGuided={()=>setView("guided")} onManual={()=>setView("editor")} hasSaved={!!saved} onAdmin={()=>setView("admin")} />;
  if (view==="templates") return <TemplateScreen tmplId={tmplId} palKey={palKey} resume={resume} pal={pal} onSelectTemplate={t=>{setTmplId(t);saveAll(resume,t,palKey);}} onSelectPalette={p=>{setPalKey(p);saveAll(resume,tmplId,p);}} onBack={()=>{ setView("editor"); setShowPreview(true); }} onExport={()=>{ trackEvent("download",{template:tmplId,color:palKey}); exportPDF(tmplId,pal,resume); }} />;
  if (view==="guided") return <GuidedFlow resume={resume} setResume={setResume} step={step} setStep={setStep} update={update} onFinish={()=>{ setView("editor"); setShowPreview(true); }} onSkip={()=>{ setView("editor"); setShowPreview(false); }} />;
  return <EditorLayout resume={resume} setResume={setResume} update={update} tmplId={tmplId} pal={pal} tab={tab} setTab={setTab} onTemplates={()=>setView("templates")} onExport={()=>{ trackEvent("download",{template:tmplId,color:palKey}); exportPDF(tmplId,pal,resume); }} onBack={()=>setView("start")} saveAll={saveAll} showPreviewInit={showPreview} palKey={palKey} />;
}

// ─── START SCREEN ─────────────────────────────────────────────────────────────
function StartScreen({onGuided,onManual,hasSaved,onAdmin}) {
  const t = TRANSLATIONS[getLang()];
  const isRtl = getLang() === "ar";
  const [form, setForm] = useState({name:"",email:"",message:""});
  const [status, setStatus] = useState("idle");
  const [showContact, setShowContact] = useState(false);

  // IntersectionObserver for scroll-reveal animations
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-visible"); observer.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".scroll-reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const sendMessage = async () => {
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: process.env.REACT_APP_WEB3FORMS_KEY,
          subject: "New message from Resume88",
          from_name: form.name,
          email: form.email,
          message: form.message,
        }),
      });
      const data = await res.json();
      setStatus(data.success ? "sent" : "error");
    } catch { setStatus("error"); }
  };

  const trustIcons = [
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd"/></svg>,
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd"/></svg>,
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z"/><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z"/></svg>,
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd"/></svg>,
  ];

  const vpIcons = [
    /* Free forever */ <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>,
    /* No account */  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>,
    /* Instant PDF */  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>,
    /* Templates */    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/></svg>,
    /* Works everywhere */ <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"/></svg>,
    /* Private */      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>,
  ];

  return (
    <div className="min-h-screen bg-white" dir={isRtl?"rtl":"ltr"} style={{fontFamily:"'Inter','Segoe UI',system-ui,-apple-system,sans-serif"}}>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-white" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-[0.07]" style={{background:"radial-gradient(circle, #2563eb 0%, transparent 70%)"}} />

        <div className="relative max-w-3xl mx-auto px-5 pt-12 pb-20 sm:pt-16 sm:pb-28 text-center">
          {/* Brand logo */}
          <div className="hero-anim-1 flex items-center justify-center gap-2.5 mb-8">
            <img src="/favicon.ico" alt="Resume88 logo" width="36" height="36" className="rounded-lg" />
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">Resume<span className="text-blue-600">88</span></span>
          </div>
          {/* Badge */}
          <div className="hero-anim-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            {t.badge}
          </div>

          {/* Headline */}
          <h1 className="hero-anim-2 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-5">
            {t.headline}
          </h1>

          {/* Subheadline */}
          <p className="hero-anim-3 text-base sm:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed mb-8">
            {t.heroSub}
          </p>

          {/* Primary CTA */}
          <div className="hero-anim-4 flex flex-col items-center gap-4">
            <button onClick={onGuided}
              className="cta-glow px-8 py-4 bg-blue-600 text-white rounded-2xl text-base sm:text-lg font-bold hover:bg-blue-700 active:bg-blue-800 transition-colors">
              {t.cta}
            </button>
            {hasSaved && (
              <button onClick={onManual} className="text-sm text-green-600 bg-green-50 border border-green-100 rounded-xl px-4 py-2 hover:bg-green-100 transition-colors">
                {t.saved}
              </button>
            )}
            <p className="text-xs text-gray-400 tracking-wide">{t.ctaSub}</p>
          </div>

          {/* Secondary link */}
          <div className="hero-anim-5 mt-4 flex items-center justify-center gap-5 text-sm text-gray-400">
            <button onClick={onManual} className="hover:text-blue-600 transition-colors">
              {t.manual} &rarr;
            </button>
            <span className="text-gray-200">&middot;</span>
            <a href="/blog/" className="hover:text-blue-600 transition-colors">Resume Writing Guides</a>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="scroll-reveal border-y border-gray-100 bg-gray-50/60">
        <div className="max-w-4xl mx-auto px-5 py-5 flex flex-wrap justify-center gap-x-10 gap-y-3">
          {(t.trustBar||[]).map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-500">
              <span className="text-blue-500">{trustIcons[i]}</span>
              <span className="text-sm font-medium">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── VALUE PROPS ── */}
      <section className="max-w-5xl mx-auto px-5 py-20 sm:py-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            [t.vp1, t.vp1d, 0], [t.vp2, t.vp2d, 1], [t.vp3, t.vp3d, 2],
            [t.vp4, t.vp4d, 3], [t.vp5, t.vp5d, 4], [t.vp6, t.vp6d, 5],
          ].map(([title, desc, iconIdx], i) => (
            <div key={i} className={`scroll-reveal scroll-reveal-delay-${(i%3)+1} group rounded-2xl border border-gray-100 bg-white p-6 hover:border-blue-100 hover:shadow-md hover:shadow-blue-50 transition-all`}>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                {vpIcons[iconIdx]}
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── RESUME PREVIEW ── */}
      <section className="scroll-reveal bg-gradient-to-b from-gray-50 to-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-5">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-3">{t.howTitle}</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 sm:gap-6">
            {[
              [t.step1, t.step1d, "01"],
              [t.step2, t.step2d, "02"],
              [t.step3, t.step3d, "03"],
            ].map(([title, desc, num], i) => (
              <div key={i} className={`scroll-reveal scroll-reveal-delay-${i+1} text-center sm:text-left`}>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white text-sm font-bold mb-4">{num}</div>
                <h3 className="text-base font-bold text-gray-900 mb-1.5">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VISUAL / MOCKUP ── */}
      <section className="scroll-reveal max-w-4xl mx-auto px-5 py-10 sm:py-16">
        <div className="float-anim rounded-2xl border border-gray-200/80 bg-white overflow-hidden shadow-xl shadow-gray-200/40">
          <div className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
            <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
            <span className="ml-3 text-xs text-gray-400 font-medium">resume88.com</span>
          </div>
          <div className="p-6 sm:p-8">
            {/* Mini resume mockup */}
            <div className="flex gap-6">
              <div className="hidden sm:block w-[30%] space-y-3">
                <div className="w-16 h-16 rounded-full bg-blue-100 mx-auto" />
                <div className="h-2 bg-gray-200 rounded-full w-3/4 mx-auto" />
                <div className="h-1.5 bg-gray-100 rounded-full w-2/3 mx-auto" />
                <div className="border-t border-gray-100 pt-3 mt-3 space-y-2">
                  <div className="h-1.5 bg-blue-100 rounded-full w-1/3" />
                  <div className="flex flex-wrap gap-1">
                    {["React","Node","Python","Figma"].map(s=><span key={s} className="text-[8px] bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full">{s}</span>)}
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <div className="h-3 bg-gray-800 rounded w-48 mb-1.5" />
                  <div className="h-1.5 bg-blue-400 rounded w-32" />
                </div>
                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <div className="h-1.5 bg-blue-200 rounded-full w-16" />
                  <div className="h-1.5 bg-gray-100 rounded-full w-full" />
                  <div className="h-1.5 bg-gray-100 rounded-full w-11/12" />
                  <div className="h-1.5 bg-gray-100 rounded-full w-4/5" />
                </div>
                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <div className="h-1.5 bg-blue-200 rounded-full w-20" />
                  <div className="flex justify-between items-start">
                    <div className="space-y-1"><div className="h-1.5 bg-gray-200 rounded w-36" /><div className="h-1 bg-gray-100 rounded w-24" /></div>
                    <div className="h-1 bg-gray-100 rounded w-16" />
                  </div>
                  <div className="ml-3 space-y-1">
                    <div className="h-1 bg-gray-100 rounded-full w-5/6" />
                    <div className="h-1 bg-gray-100 rounded-full w-3/4" />
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <div className="h-1.5 bg-blue-200 rounded-full w-16" />
                  <div className="flex justify-between"><div className="space-y-1"><div className="h-1.5 bg-gray-200 rounded w-40" /><div className="h-1 bg-gray-100 rounded w-28" /></div><div className="h-1 bg-gray-100 rounded w-12" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="scroll-reveal bg-gradient-to-b from-white via-blue-50/40 to-white py-20 sm:py-24">
        <div className="max-w-xl mx-auto px-5 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-4">{t.finalCta}</h2>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">{t.finalCtaSub}</p>
          <button onClick={onGuided}
            className="cta-glow px-8 py-4 bg-blue-600 text-white rounded-2xl text-base font-bold hover:bg-blue-700 active:bg-blue-800 transition-colors mb-4">
            {t.cta}
          </button>
          <p className="text-xs text-gray-400 tracking-wide">{t.ctaSub}</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-100 py-8 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-2 flex-wrap">
            {t.builtBy} &middot;{" "}
            <a href="/blog/" className="text-gray-400 hover:text-blue-600 transition-colors">Blog</a>
            &middot;
            <a href="https://github.com/Salehro/resume88" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">GitHub</a>
            &middot;
            <button onClick={()=>setShowContact(s=>!s)} className="text-gray-400 hover:text-blue-600 transition-colors focus:outline-none">{t.contact}</button>
            <button onClick={onAdmin} className="text-gray-300 hover:text-gray-400 focus:outline-none text-xs opacity-30 hover:opacity-60 ml-1">&#9881;</button>
          </p>
          {showContact && (
            <div className="mt-6 max-w-sm mx-auto">
              <p className="text-xs text-gray-400 mb-3">{t.contactSub}</p>
              {status === "sent" ? (
                <div className="text-center py-3 text-green-600 font-semibold text-sm">{t.sent}</div>
              ) : (
                <div className="space-y-2">
                  <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder={t.namePh} className="input-field" />
                  <input value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder={t.emailPh} type="email" className="input-field" />
                  <textarea value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} placeholder={t.msgPh} rows={3} className="input-field resize-none" />
                  {status==="error" && <p className="text-xs text-red-500">{t.sendErr}</p>}
                  <button onClick={sendMessage} disabled={status==="sending"} className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60">
                    {status==="sending" ? t.sending : t.send}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

// ─── TEMPLATE SCREEN ──────────────────────────────────────────────────────────
function TemplateScreen({tmplId,palKey,resume,pal,onSelectTemplate,onSelectPalette,onBack,onExport}) {
  const [hov, setHov] = useState(null);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b px-5 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-gray-400 hover:text-gray-700">←</button>
          <span className="font-bold text-gray-800">🎨 Templates & Colors</span>
        </div>
        <div className="flex gap-2">
          <button onClick={onBack} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">✏️ Back to Edit</button>
          <button onClick={onExport} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">⬇ Export PDF</button>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-full lg:w-[380px] overflow-auto p-5 border-r bg-white flex-shrink-0">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Color Theme</h3>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {Object.entries(PALETTE_SETS).map(([k,p])=>(
              <button key={k} onClick={()=>onSelectPalette(k)} className={`rounded-xl overflow-hidden border-2 transition-all ${k===palKey?"border-gray-800 shadow scale-105":"border-transparent hover:border-gray-300"}`}>
                <div className="h-8" style={{background:`linear-gradient(135deg,${p.dark},${p.accent})`}} />
                <div className="text-xs py-1 text-center capitalize font-medium text-gray-600 bg-white">{k}</div>
              </button>
            ))}
          </div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Template Layout</h3>
          <div className="space-y-2">
            {TEMPLATES.map(t=>(
              <button key={t.id} onClick={()=>onSelectTemplate(t.id)} onMouseEnter={()=>setHov(t.id)} onMouseLeave={()=>setHov(null)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition text-left ${t.id===tmplId?"border-blue-500 bg-blue-50":"border-gray-200 hover:border-gray-300 bg-white"}`}>
                <span className="text-2xl">{t.icon}</span>
                <div className="flex-1"><div className="font-semibold text-gray-800 text-sm">{t.label}</div><div className="text-xs text-gray-400">{t.desc}</div></div>
                {t.id===tmplId && <span className="text-blue-500 text-xs font-bold">✓ Active</span>}
              </button>
            ))}
          </div>
        </div>
        <div className="hidden lg:flex flex-1 bg-gray-200 overflow-auto p-6 justify-center items-start">
          <div className="bg-white shadow-2xl rounded-lg overflow-hidden w-full max-w-[560px]" style={{transform:"scale(0.87)",transformOrigin:"top center",marginBottom:"-120px"}}>
            <ResumeDoc tmplId={hov||tmplId} pal={pal} resume={resume} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── EDITOR LAYOUT ────────────────────────────────────────────────────────────
const TABS = [
  {key:"personal",  label:"Personal",   icon:"👤"},
  {key:"summary",   label:"Summary",    icon:"📝"},
  {key:"experience",label:"Experience", icon:"💼"},
  {key:"education", label:"Education",  icon:"🎓"},
  {key:"skills",    label:"Skills",     icon:"⚡"},
  {key:"languages", label:"Languages",  icon:"🌐"},
  {key:"extras",    label:"Extras",     icon:"🏆"},
  {key:"hobbies",   label:"Interests",  icon:"🎯"},
];

function EditorLayout({resume,setResume,update,tmplId,pal,tab,setTab,onTemplates,onExport,onBack,saveAll,showPreviewInit}) {
  const [mobPreview, setMobPreview] = useState(showPreviewInit ?? false);
  const {score, tips} = calcScore(resume);
  const scoreColor = score>=80?"text-green-600":score>=50?"text-yellow-600":"text-red-500";
  const scoreBg = score>=80?"bg-green-50 border-green-200":score>=50?"bg-yellow-50 border-yellow-200":"bg-red-50 border-red-200";

  return (
    <div className="min-h-screen bg-gray-50/80 flex flex-col">
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-2.5 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <button onClick={onBack} className="text-gray-300 hover:text-gray-500 px-1 transition-colors">←</button>
          <span className="font-bold text-gray-800 text-sm hidden sm:flex items-center gap-1.5 tracking-tight"><img src="/favicon.ico" alt="Resume88" width="18" height="18" className="rounded" />Resume88</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${scoreBg} ${scoreColor}`}>
            <span className="opacity-70">Score</span> {score}%
          </div>
          <button onClick={()=>setMobPreview(s=>!s)} className={`lg:hidden px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${mobPreview?"bg-blue-50 text-blue-600 border border-blue-100":"bg-gray-50 text-gray-500 border border-gray-100"}`}>
            {mobPreview?"Edit":"Preview"}
          </button>
          <button onClick={onTemplates} className="px-3 py-1.5 border border-gray-200/70 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 flex items-center gap-1.5 transition-all">
            <span className="hidden sm:inline">Templates</span><span className="sm:hidden">Style</span>
          </button>
          <button onClick={onExport} className="px-3.5 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/20">Export PDF</button>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {!mobPreview && (
          <div className="hidden sm:flex flex-col w-44 bg-white border-r border-gray-100 py-4 px-2.5 gap-0.5 flex-shrink-0">
            {TABS.map(t=>(
              <button key={t.key} onClick={()=>setTab(t.key)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${t.key===tab?"bg-blue-50 text-blue-700 shadow-sm shadow-blue-100":"text-gray-400 hover:bg-gray-50 hover:text-gray-600"}`}>
                <span className="text-sm">{t.icon}</span>{t.label}
              </button>
            ))}
            <div className="mt-auto border-t border-gray-100 pt-3">
              <button onClick={onTemplates} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all">
                <span className="text-sm">🎨</span> Templates
              </button>
            </div>
          </div>
        )}
        {!mobPreview ? (
          <div className="flex-1 overflow-auto">
            <div className="sm:hidden flex gap-1 p-2.5 bg-white border-b border-gray-100 overflow-x-auto">
              {TABS.map(t=>(
                <button key={t.key} onClick={()=>setTab(t.key)} className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${t.key===tab?"bg-blue-600 text-white shadow-sm":"bg-gray-50 text-gray-400 hover:bg-gray-100"}`}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            <div className="p-6 max-w-xl mx-auto sm:mx-0">
              {TIPS[tab] && <div className="mb-5 text-xs text-blue-600/80 bg-blue-50/60 border border-blue-100/50 rounded-xl px-4 py-2.5 leading-relaxed">{TIPS[tab]}</div>}
              <TabContent tab={tab} resume={resume} setResume={setResume} update={update} />
              {tips.length > 0 && (
                <div className={`mt-8 border rounded-2xl p-5 ${scoreBg}`}>
                  <div className={`font-semibold text-sm mb-2.5 ${scoreColor}`}>Resume Score: {score}%</div>
                  <div className="w-full bg-gray-200/60 rounded-full h-1.5 mb-4">
                    <div className="h-1.5 rounded-full transition-all duration-500" style={{width:score+"%",background:score>=80?"#16a34a":score>=50?"#ca8a04":"#dc2626"}} />
                  </div>
                  <p className="text-xs text-gray-500 font-medium mb-2">To improve your score:</p>
                  {tips.map((t,i)=><div key={i} className="text-xs text-gray-500 py-0.5 flex items-start gap-1.5"><span className="text-gray-300 mt-px">—</span>{t}</div>)}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto bg-gray-200/60 p-4 flex justify-center">
            <div className="w-full max-w-[680px] bg-white shadow-xl rounded-lg overflow-hidden">
              <ResumeDoc tmplId={tmplId} pal={pal} resume={resume} />
            </div>
          </div>
        )}
        {!mobPreview && (
          <div className="hidden lg:flex flex-col w-[400px] flex-shrink-0 bg-gray-100/80 border-l border-gray-200/60">
            <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Preview</span>
              <button onClick={onTemplates} className="text-xs text-gray-400 hover:text-blue-600 transition-colors">Change Template</button>
            </div>
            <div className="flex-1 overflow-auto p-3 flex justify-center">
              <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden" style={{transform:"scale(0.72)",transformOrigin:"top center",width:"138%",marginLeft:"-19%"}}>
                <ResumeDoc tmplId={tmplId} pal={pal} resume={resume} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TabContent({tab,resume,setResume,update}) {
  if (tab==="personal") return <PersonalTab resume={resume} update={update} setResume={setResume} />;
  if (tab==="summary") return <SummaryTab resume={resume} update={update} />;
  if (tab==="experience") return <ExperienceEditor experience={resume.experience} setResume={setResume} />;
  if (tab==="education") return <EducationEditor education={resume.education} setResume={setResume} />;
  if (tab==="skills") return <SkillsEditor skills={resume.skills} setResume={setResume} />;
  if (tab==="languages") return <LanguagesEditor languages={resume.languages} setResume={setResume} />;
  if (tab==="extras") return <ExtrasEditor resume={resume} setResume={setResume} />;
  if (tab==="hobbies") return <HobbiesEditor hobbies={resume.hobbies} setResume={setResume} />;
  return null;
}

function SummaryTab({resume,update}) {
  return (
    <div>
      <h2 className="editor-title mb-1">Professional Summary</h2>
      <p className="editor-subtitle mb-4">A brief overview of your professional background and key strengths</p>
      <textarea rows={6} placeholder="Results-driven professional with X years of experience in..."
        value={resume.personal.summary} onChange={e=>update(["personal","summary"],e.target.value)}
        className="input-field resize-none leading-relaxed" />
    </div>
  );
}

function Field({label, value, onChange, placeholder="", type="text", half=false}) {
  return (
    <div className={`mb-3.5 ${half?"flex-1":""}`}>
      <label className="field-label">{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange}
        className="input-field" />
    </div>
  );
}

function PersonalTab({resume,update}) {
  const fileRef = useRef();
  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => update(["personal","photo"], ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <h2 className="editor-title mb-1">Personal Information</h2>
      <p className="editor-subtitle mb-5">Basic details that appear at the top of your resume</p>
      <div className="mb-6 flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
        <div className="w-[72px] h-[72px] rounded-full bg-white border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all" onClick={()=>fileRef.current.click()}>
          {resume.personal.photo ? <img src={resume.personal.photo} alt="profile" className="w-full h-full object-cover" /> : <span className="text-2xl text-gray-300">+</span>}
        </div>
        <div>
          <button onClick={()=>fileRef.current.click()} className="px-3.5 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-medium hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm">Upload Photo</button>
          {resume.personal.photo && <button onClick={()=>update(["personal","photo"],"")} className="ml-2 px-3 py-1.5 bg-white border border-red-100 text-red-400 rounded-xl text-xs hover:bg-red-50 hover:text-red-500 transition-all">Remove</button>}
          <p className="text-xs text-gray-400 mt-1.5">Optional — visible in some templates</p>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
      </div>
      <div className="flex gap-3">
        <Field label="Full Name *" value={resume.personal.name} onChange={e=>update(["personal","name"],e.target.value)} placeholder="Jane Smith" half />
        <Field label="Professional Title" value={resume.personal.title} onChange={e=>update(["personal","title"],e.target.value)} placeholder="Software Engineer" half />
      </div>
      <div className="flex gap-3">
        <Field label="Email *" value={resume.personal.email} onChange={e=>update(["personal","email"],e.target.value)} placeholder="jane@email.com" type="email" half />
        <Field label="Phone" value={resume.personal.phone} onChange={e=>update(["personal","phone"],e.target.value)} placeholder="+1 555-000-0000" half />
      </div>
      <Field label="Location" value={resume.personal.location} onChange={e=>update(["personal","location"],e.target.value)} placeholder="San Francisco, CA" />
      <Field label="LinkedIn URL" value={resume.personal.linkedin} onChange={e=>update(["personal","linkedin"],e.target.value)} placeholder="linkedin.com/in/jane" />
      <div className="flex gap-3">
        <Field label="GitHub" value={resume.personal.github} onChange={e=>update(["personal","github"],e.target.value)} placeholder="github.com/jane" half />
        <Field label="Portfolio / Website" value={resume.personal.website} onChange={e=>update(["personal","website"],e.target.value)} placeholder="janesmith.com" half />
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD;

function AdminDashboard({ onExit }) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  const [error, setError] = useState(null);

  const login = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwErr(false); }
    else { setPwErr(true); setPw(""); }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: events, error: sbError } = await supabase
        .from("events").select("*").order("created_at", { ascending: false });

      if (sbError) { setError("Supabase error: " + sbError.message); setLoading(false); return; }
      if (!events || events.length === 0) { setError("No events found in the database yet."); setLoading(false); return; }
      const now = new Date();
      const todayStr = now.toISOString().slice(0,10);
      const views = events.filter(e=>e.type==="view");
      const builds = events.filter(e=>e.type==="build");
      const downloads = events.filter(e=>e.type==="download");
      const today = events.filter(e=>e.created_at?.slice(0,10)===todayStr);
      const days = Array.from({length:7}, (_,i)=>{
        const d = new Date(now - (6-i)*24*60*60*1000);
        const str = d.toISOString().slice(0,10);
        const label = d.toLocaleDateString("en-US",{weekday:"short"});
        return { label,
          views:    events.filter(e=>e.type==="view"     && e.created_at?.slice(0,10)===str).length,
          builds:   events.filter(e=>e.type==="build"    && e.created_at?.slice(0,10)===str).length,
          downloads:events.filter(e=>e.type==="download" && e.created_at?.slice(0,10)===str).length,
        };
      });
      const tmplCounts = {};
      downloads.forEach(e=>{ if(e.template) tmplCounts[e.template]=(tmplCounts[e.template]||0)+1; });
      const totalTmpl = Object.values(tmplCounts).reduce((a,b)=>a+b,0)||1;
      const templates = Object.entries(tmplCounts).sort((a,b)=>b[1]-a[1]);
      const colorCounts = {};
      downloads.forEach(e=>{ if(e.color) colorCounts[e.color]=(colorCounts[e.color]||0)+1; });
      const colors = Object.entries(colorCounts).sort((a,b)=>b[1]-a[1]);
      setData({ views:views.length, builds:builds.length, downloads:downloads.length,
        today:today.length, days, templates, totalTmpl, colors, recent:events.slice(0,12) });
      setLastRefresh(new Date().toLocaleTimeString());
    } catch(e) { setError("Exception: " + e.message); console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { if (authed) fetchData(); }, [authed, fetchData]);

  if (!authed) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center">
        <div className="text-4xl mb-3">🔐</div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Admin Access</h2>
        <p className="text-xs text-gray-400 mb-5">Resume88 Dashboard</p>
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()}
          placeholder="Enter password"
          className={`w-full border ${pwErr?"border-red-400":"border-gray-200"} rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 mb-3`} />
        {pwErr && <p className="text-xs text-red-500 mb-2">Incorrect password</p>}
        <button onClick={login} className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition">Login</button>
        <button onClick={onExit} className="mt-3 text-xs text-gray-400 hover:underline">← Back to Resume88</button>
      </div>
    </div>
  );

  const TMPL_ICONS = {classic:"📋",sidebar:"▌",modern:"⚡",minimal:"○",corporate:"🏢",creative:"🎨"};
  const COLOR_HEX = {blue:"#2563eb",violet:"#7c3aed",teal:"#0f766e",rose:"#e11d48",orange:"#ea580c",slate:"#475569",emerald:"#059669",indigo:"#4f46e5"};

  const StatCard = ({icon,label,value,sub,color="blue"}) => {
    const colors = {blue:"bg-blue-50 text-blue-700 border-blue-100",green:"bg-green-50 text-green-700 border-green-100",purple:"bg-purple-50 text-purple-700 border-purple-100",orange:"bg-orange-50 text-orange-700 border-orange-100"};
    return (
      <div className={`rounded-2xl border p-4 ${colors[color]}`}>
        <div className="text-2xl mb-1">{icon}</div>
        <div className="text-3xl font-bold">{value}</div>
        <div className="text-sm font-semibold mt-0.5">{label}</div>
        {sub && <div className="text-xs opacity-70 mt-0.5">{sub}</div>}
      </div>
    );
  };

  const maxDay = data ? Math.max(...data.days.map(d=>Math.max(d.views,d.builds,d.downloads)),1) : 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xl">📊</span>
          <div>
            <h1 className="font-bold text-gray-800">Resume88 — Admin Dashboard</h1>
            {lastRefresh && <p className="text-xs text-gray-400">Last updated: {lastRefresh}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchData} disabled={loading} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50">
            {loading ? "⏳ Loading..." : "🔄 Refresh"}
          </button>
          <button onClick={onExit} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700">← Back to App</button>
        </div>
      </div>
      <div className="p-6 max-w-6xl mx-auto">
        {loading && !data ? (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <div className="text-center"><div className="text-4xl mb-3 animate-spin">⏳</div><p>Loading dashboard data...</p></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3">⚠️</div>
            <p className="text-red-600 font-semibold mb-1">Dashboard Error</p>
            <p className="text-red-500 text-sm">{error}</p>
            <button onClick={fetchData} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700">Try Again</button>
          </div>
        ) : data ? (<>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard icon="👁" label="Total Views"   value={data.views.toLocaleString()}     sub="All time"           color="blue"   />
            <StatCard icon="📄" label="Resumes Built" value={data.builds.toLocaleString()}    sub="Guided completions" color="purple" />
            <StatCard icon="⬇" label="PDF Downloads" value={data.downloads.toLocaleString()} sub="All time"           color="green"  />
            <StatCard icon="🔥" label="Today"         value={data.today.toLocaleString()}     sub="All events today"   color="orange" />
          </div>
          {data.views > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 flex flex-wrap gap-6">
              {[
                {label:"Build Rate",    val:((data.builds/data.views)*100).toFixed(1)+"%",   sub:"visitors who built a resume",  color:"#7c3aed"},
                {label:"Download Rate", val:((data.downloads/data.views)*100).toFixed(1)+"%",sub:"visitors who downloaded PDF",   color:"#059669"},
                {label:"Completion",    val:data.builds>0?((data.downloads/data.builds)*100).toFixed(1)+"%":"—", sub:"builders who downloaded", color:"#2563eb"},
              ].map(({label,val,sub,color})=>(
                <div key={label} className="flex-1 min-w-[120px]">
                  <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</div>
                  <div className="text-2xl font-bold" style={{color}}>{val}</div>
                  <div className="text-xs text-gray-400">{sub}</div>
                </div>
              ))}
            </div>
          )}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
            <h2 className="font-bold text-gray-700 mb-4 text-sm">📈 Last 7 Days</h2>
            <div className="flex items-end gap-3 h-36">
              {data.days.map((d,i)=>(
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-0.5 items-end" style={{height:"100px"}}>
                    {[{v:d.views,c:"#93c5fd"},{v:d.builds,c:"#c4b5fd"},{v:d.downloads,c:"#6ee7b7"}].map(({v,c},j)=>(
                      <div key={j} className="flex-1 rounded-t transition-all" title={v} style={{height:`${Math.max((v/maxDay)*100,v>0?8:0)}%`,background:c}} />
                    ))}
                  </div>
                  <div className="text-xs text-gray-400">{d.label}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-3 justify-center">
              {[["#93c5fd","Views"],["#c4b5fd","Builds"],["#6ee7b7","Downloads"]].map(([c,l])=>(
                <div key={l} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <div className="w-3 h-3 rounded" style={{background:c}} />{l}
                </div>
              ))}
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-bold text-gray-700 mb-4 text-sm">🎨 Most Used Templates</h2>
              {data.templates.length === 0 ? <p className="text-xs text-gray-400">No downloads yet</p>
                : data.templates.map(([tmpl,count])=>(
                  <div key={tmpl} className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700">{TMPL_ICONS[tmpl]||"📄"} {tmpl.charAt(0).toUpperCase()+tmpl.slice(1)}</span>
                      <span className="text-gray-400">{count} ({((count/data.totalTmpl)*100).toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-blue-400 transition-all" style={{width:((count/data.totalTmpl)*100)+"%"}} />
                    </div>
                  </div>
                ))}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-bold text-gray-700 mb-4 text-sm">🎨 Most Used Colors</h2>
              {data.colors.length === 0 ? <p className="text-xs text-gray-400">No downloads yet</p>
                : data.colors.map(([color,count])=>(
                  <div key={color} className="flex items-center gap-3 mb-2.5">
                    <div className="w-5 h-5 rounded-full flex-shrink-0 border border-gray-100" style={{background:COLOR_HEX[color]||"#888"}} />
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="font-medium text-gray-700 capitalize">{color}</span>
                        <span className="text-gray-400">{count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full transition-all" style={{width:((count/data.colors[0][1])*100)+"%",background:COLOR_HEX[color]||"#888"}} />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-700 mb-4 text-sm">🕐 Recent Activity</h2>
            <div className="space-y-2">
              {data.recent.map((e,i)=>{
                const icons = {view:"👁",build:"📄",download:"⬇"};
                const labels = {view:"Someone visited Resume88",build:"Someone built a resume",download:"Someone downloaded a PDF"};
                const colors = {view:"bg-blue-50 text-blue-600",build:"bg-purple-50 text-purple-600",download:"bg-green-50 text-green-600"};
                const time = new Date(e.created_at);
                const ago = Math.floor((Date.now()-time)/60000);
                const timeStr = ago < 1 ? "just now" : ago < 60 ? `${ago}m ago` : ago < 1440 ? `${Math.floor(ago/60)}h ago` : time.toLocaleDateString();
                return (
                  <div key={i} className="flex items-center gap-3 py-1.5 border-b border-gray-50 last:border-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[e.type]||"bg-gray-50 text-gray-600"}`}>{icons[e.type]||"•"} {e.type}</span>
                    <span className="text-xs text-gray-600 flex-1">{labels[e.type]||e.type}{e.template && <span className="text-gray-400"> · {e.template}</span>}</span>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{timeStr}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>) : (
          <div className="text-center text-gray-400 py-20">No data yet. Share your app and come back!</div>
        )}
      </div>
    </div>
  );
}

// ─── GUIDED FLOW ──────────────────────────────────────────────────────────────
const GUIDED_STEPS = [
  {key:"personal",  label:"Personal Info",   icon:"👤"},
  {key:"summary",   label:"Summary",         icon:"📝"},
  {key:"experience",label:"Work Experience", icon:"💼"},
  {key:"education", label:"Education",       icon:"🎓"},
  {key:"skills",    label:"Skills",          icon:"⚡"},
  {key:"languages", label:"Languages",       icon:"🌐"},
  {key:"extras",    label:"Extras",          icon:"🏆"},
];

function GuidedFlow({resume,setResume,step,setStep,update,onFinish,onSkip}) {
  const cur = GUIDED_STEPS[step];
  return (
    <div className="min-h-screen bg-gray-50/80 flex flex-col">
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-100 px-5 py-3 flex items-center justify-between">
        <span className="font-bold text-gray-800 tracking-tight flex items-center gap-2"><img src="/favicon.ico" alt="Resume88" width="20" height="20" className="rounded" />Resume88</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-medium">Step {step+1} of {GUIDED_STEPS.length}</span>
          <button onClick={onSkip} className="text-xs text-gray-400 hover:text-blue-600 transition-colors">Skip to Editor</button>
        </div>
      </div>
      <div className="h-1 bg-gray-100"><div className="h-full bg-blue-500 transition-all duration-500" style={{width:((step)/GUIDED_STEPS.length*100)+"%"}} /></div>
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:flex flex-col w-52 bg-white border-r border-gray-100 p-3.5 gap-0.5">
          {GUIDED_STEPS.map((s,i)=>(
            <button key={s.key} onClick={()=>setStep(i)} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${i===step?"bg-blue-50 text-blue-700 shadow-sm shadow-blue-100":i<step?"text-green-600 hover:bg-green-50/50":"text-gray-400 hover:bg-gray-50"}`}>
              <span className="text-sm">{i<step?"✓":s.icon}</span>{s.label}
            </button>
          ))}
        </div>
        <div className="flex-1 flex flex-col overflow-auto">
          <div className="flex-1 p-6 max-w-xl mx-auto w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-1.5 tracking-tight">{cur.icon} {cur.label}</h2>
            {TIPS[cur.key] && <div className="mb-5 text-xs text-blue-600/80 bg-blue-50/60 border border-blue-100/50 rounded-xl px-4 py-2.5 leading-relaxed">{TIPS[cur.key]}</div>}
            <TabContent tab={cur.key} resume={resume} setResume={setResume} update={update} />
          </div>
          <div className="bg-white/95 backdrop-blur-sm border-t border-gray-100 px-6 py-3.5 flex justify-between">
            {step>0 ? <button onClick={()=>setStep(s=>s-1)} className="px-5 py-2 border border-gray-200/70 rounded-xl text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all">Back</button> : <div/>}
            {step<GUIDED_STEPS.length-1
              ? <button onClick={()=>setStep(s=>s+1)} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/20">Continue</button>
              : <button onClick={()=>{ trackEvent("build"); onFinish(); }} className="px-6 py-2 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-all shadow-sm shadow-green-600/20">Finish & Preview</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RESUME DOCUMENT ──────────────────────────────────────────────────────────
function ResumeDoc({tmplId,pal,resume:r}) {
  const {accent:a,dark:dk,light:lt,muted:mu} = pal;
  const contact = [r.personal.email,r.personal.phone,r.personal.location,r.personal.linkedin,r.personal.github,r.personal.website].filter(Boolean);
  const Photo = ({size=64,ring=false}) => r.personal.photo ? (
    <img src={r.personal.photo} alt="profile" style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",border:ring?`3px solid ${mu}`:"2px solid white",flexShrink:0,boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}} />
  ) : null;

  const Sec = ({title,children}) => (
    <div style={{marginBottom:18}}>
      <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"1.8px",paddingBottom:4,marginBottom:10,borderBottom:`1.5px solid ${mu}`,color:a,lineHeight:1}}>{title}</div>
      {children}
    </div>
  );
  const ExpList = () => r.experience.map(e=>(
    <div key={e.id} style={{marginBottom:14}}>
      <div className="flex justify-between items-baseline flex-wrap gap-1">
        <span style={{fontSize:12,fontWeight:600,color:"#1a1a1a",lineHeight:1.4}}>{e.title}{e.company&&<span style={{fontWeight:400,color:"#6b7280"}}> — {e.company}</span>}</span>
        <span style={{fontSize:10,color:"#9ca3af",whiteSpace:"nowrap",letterSpacing:"0.3px"}}>{e.start}{e.end?` – ${e.end}`:e.start?" – Present":""}</span>
      </div>
      {e.location&&<div style={{fontSize:10,color:"#9ca3af",marginTop:1}}>{e.location}</div>}
      {e.bullets&&<ul style={{marginTop:4,marginLeft:12,paddingLeft:0}}>{e.bullets.split("\n").filter(Boolean).map((b,i)=><li key={i} style={{fontSize:11,color:"#4b5563",lineHeight:1.6,marginBottom:2,listStyleType:"disc"}}>{b.replace(/^[•\-]\s*/,"")}</li>)}</ul>}
    </div>
  ));
  const EduList = () => r.education.map(e=>(
    <div key={e.id} style={{marginBottom:10}} className="flex justify-between items-baseline flex-wrap gap-1">
      <div><div style={{fontSize:12,fontWeight:600,color:"#1a1a1a",lineHeight:1.4}}>{e.degree}{e.field&&` in ${e.field}`}</div><div style={{fontSize:11,color:"#6b7280",marginTop:1}}>{e.school}</div></div>
      <span style={{fontSize:10,color:"#9ca3af",letterSpacing:"0.3px"}}>{e.year}</span>
    </div>
  ));
  const SkillTags = ({dark=false}) => (
    <div className="flex flex-wrap" style={{gap:4}}>
      {r.skills.map((s,i)=><span key={i} style={dark?{background:"rgba(255,255,255,.15)",color:"#fff",padding:"2px 10px",borderRadius:20,fontSize:10,lineHeight:"20px"}:{background:mu,color:dk,padding:"2px 10px",borderRadius:20,fontSize:10,lineHeight:"20px"}}>{s.name}{s.level&&<span style={{opacity:.6}}> · {s.level}</span>}</span>)}
    </div>
  );
  const LangTags = ({dark=false}) => r.languages.length>0 ? (
    <div className="flex flex-wrap" style={{gap:4}}>
      {r.languages.map((l,i)=><span key={i} style={dark?{background:"rgba(255,255,255,.15)",color:"#fff",padding:"2px 10px",borderRadius:20,fontSize:10,lineHeight:"20px"}:{background:mu,color:dk,padding:"2px 10px",borderRadius:20,fontSize:10,lineHeight:"20px"}}>{l.name} · {l.level}</span>)}
    </div>
  ) : null;
  const ProjList = () => r.projects.map(p=>(
    <div key={p.id} style={{marginBottom:10}}><div style={{fontSize:12,fontWeight:600,color:"#1a1a1a"}}>{p.name}{p.url&&<span style={{fontSize:10,fontWeight:400,marginLeft:6,color:a}}>{p.url}</span>}</div>{p.description&&<p style={{fontSize:11,color:"#6b7280",marginTop:2,lineHeight:1.5}}>{p.description}</p>}</div>
  ));
  const CertList = ({dark=false}) => r.certifications.map(c=>(
    <div key={c.id} style={{fontSize:11,marginBottom:4,...(dark?{color:"rgba(255,255,255,.85)"}:{color:"#374151"})}}><span style={{fontWeight:600}}>{c.name}</span>{c.issuer&&<span style={{fontWeight:400}}> — {c.issuer}</span>}{c.year&&<span style={{color:dark?"rgba(255,255,255,.5)":"#9ca3af"}}> ({c.year})</span>}</div>
  ));
  const Footer = () => (
    <div style={{marginTop:24,paddingTop:8,borderTop:`1px solid ${mu}`,textAlign:"center",fontSize:9,color:a,letterSpacing:"0.5px"}}>
      Built with <a href="https://www.resume88.com" style={{color:a,fontWeight:600,textDecoration:"none"}}>resume88.com</a>
    </div>
  );

  const name = r.personal.name||"Your Name", title=r.personal.title||"";

  const MainContent = ({skipSkills=false}) => (<>
    {r.personal.summary&&<Sec title="Summary"><p style={{fontSize:11,color:"#4b5563",lineHeight:1.7}}>{r.personal.summary}</p></Sec>}
    {r.experience.length>0&&<Sec title="Experience"><ExpList/></Sec>}
    {r.education.length>0&&<Sec title="Education"><EduList/></Sec>}
    {!skipSkills&&r.skills.length>0&&<Sec title="Skills"><SkillTags/></Sec>}
    {!skipSkills&&r.languages.length>0&&<Sec title="Languages"><LangTags/></Sec>}
    {r.projects.length>0&&<Sec title="Projects"><ProjList/></Sec>}
    {r.certifications.length>0&&!skipSkills&&<Sec title="Certifications"><CertList/></Sec>}
    {r.hobbies.length>0&&<Sec title="Interests"><p style={{fontSize:11,color:"#6b7280",letterSpacing:"0.3px"}}>{r.hobbies.join("  ·  ")}</p></Sec>}
    <Footer/>
  </>);

  /* ── Classic ── */
  if (tmplId==="classic") return (
    <div style={{padding:"28px 32px",fontSize:12,minHeight:900,fontFamily:"'Segoe UI',system-ui,-apple-system,sans-serif",lineHeight:1.5}}>
      <div style={{paddingBottom:14,marginBottom:18,borderBottom:`3px solid ${a}`}}>
        <div className="flex items-center gap-4">
          <Photo size={58} />
          <div className="flex-1">
            <div style={{fontSize:22,fontWeight:700,color:dk,lineHeight:1.2,letterSpacing:"-0.3px"}}>{name}</div>
            {title&&<div style={{fontSize:12,fontWeight:600,marginTop:3,color:a,letterSpacing:"0.2px"}}>{title}</div>}
            {contact.length>0&&<div className="flex flex-wrap gap-2 mt-1.5" style={{fontSize:10,color:"#6b7280"}}>{contact.map((c,i)=><span key={i}>{c}</span>)}</div>}
          </div>
        </div>
      </div>
      <MainContent/>
    </div>
  );

  /* ── Sidebar ── */
  if (tmplId==="sidebar") return (
    <div className="flex" style={{fontSize:12,minHeight:900,fontFamily:"'Segoe UI',system-ui,-apple-system,sans-serif",lineHeight:1.5}}>
      <div style={{width:"33%",background:a,color:"#fff",padding:"24px 18px",display:"flex",flexDirection:"column",gap:14}}>
        {r.personal.photo&&<div className="flex justify-center" style={{marginBottom:4}}><Photo size={76} ring /></div>}
        <div><div style={{fontWeight:700,fontSize:16,lineHeight:1.25}}>{name}</div>{title&&<div style={{fontSize:11,opacity:.7,marginTop:3}}>{title}</div>}</div>
        {contact.length>0&&<div style={{fontSize:10,opacity:.8,lineHeight:2,borderTop:"1px solid rgba(255,255,255,.15)",paddingTop:10}}>{contact.map((c,i)=><div key={i}>{c}</div>)}</div>}
        {r.skills.length>0&&<div style={{borderTop:"1px solid rgba(255,255,255,.15)",paddingTop:10}}><div style={{fontSize:9,textTransform:"uppercase",letterSpacing:"1.5px",opacity:.5,marginBottom:6}}>Skills</div><SkillTags dark/></div>}
        {r.languages.length>0&&<div style={{borderTop:"1px solid rgba(255,255,255,.15)",paddingTop:10}}><div style={{fontSize:9,textTransform:"uppercase",letterSpacing:"1.5px",opacity:.5,marginBottom:6}}>Languages</div><LangTags dark/></div>}
        {r.certifications.length>0&&<div style={{borderTop:"1px solid rgba(255,255,255,.15)",paddingTop:10}}><div style={{fontSize:9,textTransform:"uppercase",letterSpacing:"1.5px",opacity:.5,marginBottom:6}}>Certifications</div><CertList dark/></div>}
        {r.hobbies.length>0&&<div style={{borderTop:"1px solid rgba(255,255,255,.15)",paddingTop:10}}><div style={{fontSize:9,textTransform:"uppercase",letterSpacing:"1.5px",opacity:.5,marginBottom:6}}>Interests</div><p style={{fontSize:10,opacity:.8,lineHeight:1.6}}>{r.hobbies.join(", ")}</p></div>}
      </div>
      <div style={{flex:1,padding:"22px 24px"}}><MainContent skipSkills/></div>
    </div>
  );

  /* ── Modern ── */
  if (tmplId==="modern") return (
    <div style={{fontSize:12,minHeight:900,fontFamily:"'Segoe UI',system-ui,-apple-system,sans-serif",lineHeight:1.5}}>
      <div style={{padding:"28px 32px",color:"#fff",background:`linear-gradient(135deg,${dk},${a})`}}>
        <div className="flex items-center gap-4">
          <Photo size={66} ring />
          <div><div style={{fontSize:23,fontWeight:800,letterSpacing:"-0.5px",lineHeight:1.2}}>{name}</div>{title&&<div style={{fontSize:12,opacity:.75,marginTop:4,letterSpacing:"0.3px"}}>{title}</div>}{contact.length>0&&<div className="flex flex-wrap" style={{gap:14,marginTop:10,fontSize:10,opacity:.6}}>{contact.map((c,i)=><span key={i}>{c}</span>)}</div>}</div>
        </div>
      </div>
      <div style={{padding:"24px 32px"}}><MainContent/></div>
    </div>
  );

  /* ── Minimal ── */
  if (tmplId==="minimal") return (
    <div style={{padding:"36px 44px",fontSize:12,minHeight:900,fontFamily:"Georgia,'Times New Roman',serif",lineHeight:1.6}}>
      <div style={{textAlign:"center",marginBottom:22,paddingBottom:18,borderBottom:`2px solid ${a}`}}>
        {r.personal.photo&&<div className="flex justify-center" style={{marginBottom:10}}><Photo size={66}/></div>}
        <div style={{fontSize:26,fontWeight:300,letterSpacing:"3px",textTransform:"uppercase",color:"#1f2937",lineHeight:1.2}}>{name}</div>
        {title&&<div style={{fontSize:11,letterSpacing:"2.5px",textTransform:"uppercase",marginTop:6,color:a}}>{title}</div>}
        {contact.length>0&&<div className="flex justify-center flex-wrap" style={{gap:14,marginTop:10,fontSize:10,color:"#9ca3af"}}>{contact.map((c,i)=><span key={i}>{c}</span>)}</div>}
      </div>
      <MainContent/>
    </div>
  );

  /* ── Corporate ── */
  if (tmplId==="corporate") return (
    <div style={{fontSize:12,minHeight:900,fontFamily:"'Segoe UI',system-ui,-apple-system,sans-serif",lineHeight:1.5}}>
      <div style={{height:5,width:"100%",background:a}} />
      <div style={{padding:"18px 32px 14px",borderBottom:`2px solid ${mu}`}}>
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Photo size={54} ring />
            <div><div style={{fontSize:20,fontWeight:700,color:dk,lineHeight:1.2}}>{name}</div>{title&&<div style={{fontSize:12,fontWeight:600,marginTop:3,color:a}}>{title}</div>}</div>
          </div>
          {contact.length>0&&<div style={{textAlign:"right",fontSize:10,color:"#6b7280",lineHeight:1.9}}>{contact.map((c,i)=><div key={i}>{c}</div>)}</div>}
        </div>
      </div>
      <div style={{padding:"22px 32px"}}><MainContent/></div>
    </div>
  );

  /* ── Creative ── */
  if (tmplId==="creative") return (
    <div style={{fontSize:12,minHeight:900,fontFamily:"'Segoe UI',system-ui,-apple-system,sans-serif",lineHeight:1.5}}>
      <div style={{position:"relative",padding:"26px 32px",background:lt}}>
        <div style={{position:"absolute",left:0,top:0,width:4,height:"100%",background:a}} />
        <div className="flex items-center gap-4">
          <Photo size={62} ring />
          <div>
            <div style={{fontSize:24,fontWeight:900,letterSpacing:"-0.5px",color:dk,lineHeight:1.2}}>{name}</div>
            {title&&<span style={{display:"inline-block",marginTop:6,padding:"3px 12px",fontSize:10,fontWeight:700,color:"#fff",borderRadius:20,background:a,letterSpacing:"0.3px"}}>{title}</span>}
            {contact.length>0&&<div className="flex flex-wrap" style={{gap:8,marginTop:8,fontSize:10,color:"#6b7280"}}>{contact.map((c,i)=><span key={i}>· {c}</span>)}</div>}
          </div>
        </div>
      </div>
      <div className="flex">
        <div style={{flex:1,padding:"20px 24px"}}>
          {r.personal.summary&&<Sec title="Profile"><p style={{fontSize:11,color:"#4b5563",lineHeight:1.7}}>{r.personal.summary}</p></Sec>}
          {r.experience.length>0&&<Sec title="Experience"><ExpList/></Sec>}
          {r.education.length>0&&<Sec title="Education"><EduList/></Sec>}
          {r.projects.length>0&&<Sec title="Projects"><ProjList/></Sec>}
          {r.hobbies.length>0&&<Sec title="Interests"><p style={{fontSize:11,color:"#6b7280"}}>{r.hobbies.join("  ·  ")}</p></Sec>}
          <Footer/>
        </div>
        <div style={{width:"32%",padding:"20px 16px",borderLeft:`1.5px solid ${mu}`,background:lt+"80"}}>
          {r.skills.length>0&&<div style={{marginBottom:16}}><div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"1.8px",marginBottom:8,color:a}}>Skills</div><SkillTags/></div>}
          {r.languages.length>0&&<div style={{marginBottom:16}}><div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"1.8px",marginBottom:8,color:a}}>Languages</div><LangTags/></div>}
          {r.certifications.length>0&&<div><div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"1.8px",marginBottom:8,color:a}}>Certifications</div><CertList/></div>}
        </div>
      </div>
    </div>
  );
  return null;
}

// ─── SUB EDITORS ──────────────────────────────────────────────────────────────
function ExperienceEditor({experience,setResume}) {
  const add = () => setResume(r=>({...r,experience:[...r.experience,{id:uid(),title:"",company:"",location:"",start:"",end:"",bullets:""}]}));
  const upd = (id,f,v) => setResume(r=>({...r,experience:r.experience.map(e=>e.id===id?{...e,[f]:v}:e)}));
  const del = (id) => setResume(r=>({...r,experience:r.experience.filter(e=>e.id!==id)}));
  return (
    <div>
      <h2 className="editor-title mb-1">Work Experience</h2>
      <p className="editor-subtitle mb-5">Add your relevant work history, most recent first</p>
      {experience.map((e,idx)=>(
        <div key={e.id} className="section-card mb-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Position {idx+1}</span>
            <button onClick={()=>del(e.id)} className="text-gray-300 hover:text-red-500 text-xs transition-colors">Remove</button>
          </div>
          {[["Job Title","title","Software Engineer"],["Company","company","Acme Corp"],["Location","location","San Francisco, CA"]].map(([l,f,ph])=>(
            <div key={f} className="mb-3"><label className="field-label">{l}</label><input value={e[f]} placeholder={ph} onChange={ev=>upd(e.id,f,ev.target.value)} className="input-field-sm" /></div>
          ))}
          <div className="flex gap-3 mb-3">
            {[["Start Date","start","Jan 2022"],["End Date","end","Dec 2024 or leave blank"]].map(([l,f,ph])=>(
              <div key={f} className="flex-1"><label className="field-label">{l}</label><input value={e[f]} placeholder={ph} onChange={ev=>upd(e.id,f,ev.target.value)} className="input-field-sm" /></div>
            ))}
          </div>
          <label className="field-label">Key Responsibilities & Achievements</label>
          <textarea rows={4} value={e.bullets} placeholder={"Led a team of 5 engineers\nIncreased performance by 40%\nOne achievement per line"} onChange={ev=>upd(e.id,"bullets",ev.target.value)} className="input-field-sm resize-none leading-relaxed" />
        </div>
      ))}
      <button onClick={add} className="add-btn-dashed">+ Add Work Experience</button>
    </div>
  );
}

function EducationEditor({education,setResume}) {
  const add = () => setResume(r=>({...r,education:[...r.education,{id:uid(),degree:"",field:"",school:"",year:""}]}));
  const upd = (id,f,v) => setResume(r=>({...r,education:r.education.map(e=>e.id===id?{...e,[f]:v}:e)}));
  const del = (id) => setResume(r=>({...r,education:r.education.filter(e=>e.id!==id)}));
  return (
    <div>
      <h2 className="editor-title mb-1">Education</h2>
      <p className="editor-subtitle mb-5">Add your degrees and academic credentials</p>
      {education.map((e,idx)=>(
        <div key={e.id} className="section-card mb-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Degree {idx+1}</span>
            <button onClick={()=>del(e.id)} className="text-gray-300 hover:text-red-500 text-xs transition-colors">Remove</button>
          </div>
          {[["Degree","degree","Bachelor of Science"],["Field of Study","field","Computer Science"],["School / University","school","Stanford University"],["Year","year","2020"]].map(([l,f,ph])=>(
            <div key={f} className="mb-3"><label className="field-label">{l}</label><input value={e[f]} placeholder={ph} onChange={ev=>upd(e.id,f,ev.target.value)} className="input-field-sm" /></div>
          ))}
        </div>
      ))}
      <button onClick={add} className="add-btn-dashed">+ Add Education</button>
    </div>
  );
}

function SkillsEditor({skills,setResume}) {
  const [input,setInput] = useState("");
  const [level,setLevel] = useState("Intermediate");
  const add = () => {
    const t = input.trim();
    if (!t) return;
    const items = t.split(",").map(s=>s.trim()).filter(Boolean).map(name=>({name,level}));
    setResume(r=>{
      const existing = new Set(r.skills.map(s=>s.name.toLowerCase()));
      const newOnes = items.filter(i=>!existing.has(i.name.toLowerCase()));
      return {...r, skills:[...r.skills,...newOnes]};
    });
    setInput("");
  };
  const remove = (name) => setResume(r=>({...r,skills:r.skills.filter(s=>s.name!==name)}));
  return (
    <div>
      <h2 className="editor-title mb-1">Skills</h2>
      <p className="editor-subtitle mb-4">Add skills with an optional proficiency level</p>
      <div className="flex gap-2 mb-2">
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="e.g. React, Python, Figma" className="input-field flex-1" />
        <select value={level} onChange={e=>setLevel(e.target.value)} className="border border-gray-200/70 rounded-xl px-3 py-2.5 text-xs text-gray-600 focus:outline-none focus:border-blue-300 focus:ring-[3px] focus:ring-blue-100/60 bg-white hover:border-gray-300 cursor-pointer">
          {SKILL_LEVELS.map(l=><option key={l}>{l}</option>)}
        </select>
        <button onClick={add} className="btn-primary whitespace-nowrap">Add</button>
      </div>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
          {skills.map(s=>(
            <span key={s.name} className="tag-pill bg-blue-50 text-blue-700 border-blue-100/80">
              {s.name}{s.level&&<span className="opacity-50 font-normal"> · {s.level}</span>}
              <button onClick={()=>remove(s.name)} className="text-blue-300 hover:text-red-400 ml-0.5 transition-colors">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function LanguagesEditor({languages,setResume}) {
  const [name,setName] = useState("");
  const [level,setLevel] = useState("Professional");
  const add = () => {
    if (!name.trim()) return;
    setResume(r=>({...r,languages:[...r.languages,{name:name.trim(),level}]}));
    setName("");
  };
  return (
    <div>
      <h2 className="editor-title mb-1">Languages</h2>
      <p className="editor-subtitle mb-4">Add languages you can use in a work setting</p>
      <div className="flex gap-2 mb-2">
        <input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="e.g. Spanish" className="input-field flex-1" />
        <select value={level} onChange={e=>setLevel(e.target.value)} className="border border-gray-200/70 rounded-xl px-3 py-2.5 text-xs text-gray-600 focus:outline-none focus:border-blue-300 focus:ring-[3px] focus:ring-blue-100/60 bg-white hover:border-gray-300 cursor-pointer">
          {LANG_LEVELS.map(l=><option key={l}>{l}</option>)}
        </select>
        <button onClick={add} className="btn-primary whitespace-nowrap">Add</button>
      </div>
      {languages.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
          {languages.map((l,i)=>(
            <span key={i} className="tag-pill bg-indigo-50 text-indigo-700 border-indigo-100/80">
              {l.name} <span className="opacity-50 font-normal">· {l.level}</span>
              <button onClick={()=>setResume(r=>({...r,languages:r.languages.filter((_,j)=>j!==i)}))} className="text-indigo-300 hover:text-red-400 ml-0.5 transition-colors">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function HobbiesEditor({hobbies,setResume}) {
  const [input,setInput] = useState("");
  const add = () => {
    const items = input.split(",").map(s=>s.trim()).filter(Boolean);
    setResume(r=>({...r,hobbies:[...new Set([...r.hobbies,...items])]}));
    setInput("");
  };
  return (
    <div>
      <h2 className="editor-title mb-1">Hobbies & Interests</h2>
      <p className="editor-subtitle mb-4">Optional — only include if relevant or if you have space</p>
      <div className="flex gap-2 mb-2">
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="e.g. Open Source, Chess, Photography" className="input-field flex-1" />
        <button onClick={add} className="btn-primary whitespace-nowrap">Add</button>
      </div>
      {hobbies.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
          {hobbies.map((h,i)=>(
            <span key={i} className="tag-pill bg-orange-50 text-orange-700 border-orange-100/80">
              {h}<button onClick={()=>setResume(r=>({...r,hobbies:r.hobbies.filter((_,j)=>j!==i)}))} className="text-orange-300 hover:text-red-400 ml-0.5 transition-colors">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ExtrasEditor({resume,setResume}) {
  const addP = () => setResume(r=>({...r,projects:[...r.projects,{id:uid(),name:"",url:"",description:""}]}));
  const updP = (id,f,v) => setResume(r=>({...r,projects:r.projects.map(p=>p.id===id?{...p,[f]:v}:p)}));
  const delP = (id) => setResume(r=>({...r,projects:r.projects.filter(p=>p.id!==id)}));
  const addC = () => setResume(r=>({...r,certifications:[...r.certifications,{id:uid(),name:"",issuer:"",year:""}]}));
  const updC = (id,f,v) => setResume(r=>({...r,certifications:r.certifications.map(c=>c.id===id?{...c,[f]:v}:c)}));
  const delC = (id) => setResume(r=>({...r,certifications:r.certifications.filter(c=>c.id!==id)}));
  return (
    <div>
      <h2 className="editor-title mb-1">Projects & Certifications</h2>
      <p className="editor-subtitle mb-5">Showcase your work and professional credentials</p>
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Projects</h3>
        {resume.projects.map((p,i)=>(
          <div key={p.id} className="section-card mb-3">
            <div className="flex justify-between items-center mb-3"><span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Project {i+1}</span><button onClick={()=>delP(p.id)} className="text-gray-300 hover:text-red-500 text-xs transition-colors">Remove</button></div>
            {[["Name","name","My App"],["URL","url","github.com/user/app"]].map(([l,f,ph])=>(
              <div key={f} className="mb-3"><label className="field-label">{l}</label><input value={p[f]} placeholder={ph} onChange={e=>updP(p.id,f,e.target.value)} className="input-field-sm" /></div>
            ))}
            <label className="field-label">Description</label>
            <textarea rows={2} value={p.description} onChange={e=>updP(p.id,"description",e.target.value)} className="input-field-sm resize-none" />
          </div>
        ))}
        <button onClick={addP} className="add-btn-dashed">+ Add Project</button>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Certifications</h3>
        {resume.certifications.map((c,i)=>(
          <div key={c.id} className="section-card mb-3">
            <div className="flex justify-between items-center mb-3"><span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Cert {i+1}</span><button onClick={()=>delC(c.id)} className="text-gray-300 hover:text-red-500 text-xs transition-colors">Remove</button></div>
            <div className="grid grid-cols-2 gap-3">
              {[["Name","name","AWS Solutions Architect"],["Issuer","issuer","Amazon"],["Year","year","2024"]].map(([l,f,ph])=>(
                <div key={f} className={f==="name"?"col-span-2":""}>
                  <label className="field-label">{l}</label>
                  <input value={c[f]} placeholder={ph} onChange={e=>updC(c.id,f,e.target.value)} className="input-field-sm" />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button onClick={addC} className="add-btn-dashed">+ Add Certification</button>
      </div>
    </div>
  );
}