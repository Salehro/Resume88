import { useState, useCallback, useRef } from "react";

// ─── MOCK SUPABASE (artifact preview only — remove in real project) ───────────
const supabase = {
  from: () => ({
    select: () => ({ order: async () => ({ data: [
      {id:1,type:"view",     template:null,   color:null,      created_at: new Date(Date.now()-2*60000).toISOString()},
      {id:2,type:"build",    template:null,   color:null,      created_at: new Date(Date.now()-5*60000).toISOString()},
      {id:3,type:"download", template:"modern",  color:"blue", created_at: new Date(Date.now()-8*60000).toISOString()},
      {id:4,type:"view",     template:null,   color:null,      created_at: new Date(Date.now()-15*60000).toISOString()},
      {id:5,type:"download", template:"sidebar", color:"violet",created_at: new Date(Date.now()-20*60000).toISOString()},
      {id:6,type:"build",    template:null,   color:null,      created_at: new Date(Date.now()-30*60000).toISOString()},
      {id:7,type:"view",     template:null,   color:null,      created_at: new Date(Date.now()-2*3600000).toISOString()},
      {id:8,type:"download", template:"classic", color:"teal", created_at: new Date(Date.now()-3*3600000).toISOString()},
      {id:9,type:"view",     template:null,   color:null,      created_at: new Date(Date.now()-5*3600000).toISOString()},
      {id:10,type:"download",template:"modern",  color:"blue", created_at: new Date(Date.now()-1*86400000).toISOString()},
      {id:11,type:"build",   template:null,   color:null,      created_at: new Date(Date.now()-2*86400000).toISOString()},
      {id:12,type:"view",    template:null,   color:null,      created_at: new Date(Date.now()-3*86400000).toISOString()},
      {id:13,type:"download",template:"creative",color:"rose", created_at: new Date(Date.now()-4*86400000).toISOString()},
      {id:14,type:"view",    template:null,   color:null,      created_at: new Date(Date.now()-5*86400000).toISOString()},
      {id:15,type:"build",   template:null,   color:null,      created_at: new Date(Date.now()-6*86400000).toISOString()},
    ]}) }),
    insert: async () => {},
  }),
};
const trackEvent = async () => {};

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    badge: "100% Free — No Login, No Sign Up, No Credit Card. Ever.",
    headline: "Build a Professional Resume",
    sub: "Create, customize, and download your resume as PDF in minutes. Completely free, forever.",
    feat1: "No account required", feat2: "Instant PDF download", feat3: "6 beautiful templates",
    guided: "Guided Step-by-Step", guidedSub: "— beginner friendly",
    manual: "Manual Mode — fill everything at once",
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
    headline: "Créez un CV Professionnel",
    sub: "Créez, personnalisez et téléchargez votre CV en PDF en quelques minutes. Totalement gratuit, pour toujours.",
    feat1: "Sans compte requis", feat2: "Téléchargement PDF instantané", feat3: "6 modèles élégants",
    guided: "Guide Étape par Étape", guidedSub: "— idéal pour débutants",
    manual: "Mode Manuel — tout remplir d'un coup",
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
    headline: "Crea un Currículum Profesional",
    sub: "Crea, personaliza y descarga tu currículum en PDF en minutos. Completamente gratis, para siempre.",
    feat1: "Sin cuenta requerida", feat2: "Descarga PDF instantánea", feat3: "6 plantillas hermosas",
    guided: "Guía Paso a Paso", guidedSub: "— amigable para principiantes",
    manual: "Modo Manual — completa todo de una vez",
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
    headline: "أنشئ سيرة ذاتية احترافية",
    sub: "أنشئ سيرتك الذاتية وخصّصها وحمّلها بصيغة PDF في دقائق. مجاني تماماً وللأبد.",
    feat1: "لا حاجة لحساب", feat2: "تحميل PDF فوري", feat3: "6 قوالب جميلة",
    guided: "دليل خطوة بخطوة", guidedSub: "— مناسب للمبتدئين",
    manual: "الوضع اليدوي — أملأ كل شيء دفعة واحدة",
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
    headline: "Erstelle einen professionellen Lebenslauf",
    sub: "Erstelle, passe an und lade deinen Lebenslauf als PDF in Minuten herunter. Völlig kostenlos, für immer.",
    feat1: "Kein Konto erforderlich", feat2: "Sofortiger PDF-Download", feat3: "6 schöne Vorlagen",
    guided: "Schritt-für-Schritt-Anleitung", guidedSub: "— anfängerfreundlich",
    manual: "Manueller Modus — alles auf einmal ausfüllen",
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
    headline: "创建专业简历",
    sub: "在几分钟内创建、自定义并下载PDF简历。完全免费，永久有效。",
    feat1: "无需账户", feat2: "即时PDF下载", feat3: "6个精美模板",
    guided: "逐步引导", guidedSub: "— 适合初学者",
    manual: "手动模式 — 一次性填写所有内容",
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
    headline: "Crie um Currículo Profissional",
    sub: "Crie, personalize e baixe seu currículo em PDF em minutos. Completamente grátis, para sempre.",
    feat1: "Sem conta necessária", feat2: "Download PDF instantâneo", feat3: "6 modelos bonitos",
    guided: "Guia Passo a Passo", guidedSub: "— amigável para iniciantes",
    manual: "Modo Manual — preencha tudo de uma vez",
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

// ─── PDF PRINT ────────────────────────────────────────────────────────────────
function exportPDF(tmplId, pal, resume) {
  const win = window.open("","_blank");
  win.document.write(getPrintHTML(tmplId, pal, resume));
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.document.title = (resume.personal.name || "resume").replace(/\s+/g,"-").toLowerCase();
    win.print();
  }, 700);
}

function getPrintHTML(tmplId, pal, r) {
  const {accent:a, dark:dk, muted:mu} = pal;
  const contact = [
    r.personal.email, r.personal.phone, r.personal.location,
    r.personal.linkedin, r.personal.github, r.personal.website
  ].filter(Boolean);
  const photoHtml = r.personal.photo
    ? `<img src="${r.personal.photo}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:2px solid ${mu}" />`
    : "";
  const expH = r.experience.map(e=>`<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;flex-wrap:wrap"><strong>${e.title}${e.company?" — "+e.company:""}</strong><span style="font-size:11px;color:#888">${e.start||""}${e.end?" – "+e.end:e.start?" – Present":""}</span></div>${e.location?"<div style='font-size:11px;color:#888'>"+e.location+"</div>":""}<ul style="margin:4px 0 0 14px;padding:0">${(e.bullets||"").split("\n").filter(Boolean).map(b=>"<li style='font-size:12px;margin-bottom:2px'>"+b.replace(/^[•\-]\s*/,"")+"</li>").join("")}</ul></div>`).join("");
  const eduH = r.education.map(e=>`<div style="margin-bottom:8px;display:flex;justify-content:space-between;flex-wrap:wrap"><div><strong>${e.degree}${e.field?" in "+e.field:""}</strong><div style="font-size:12px;color:#555">${e.school}</div></div><span style="font-size:11px;color:#888">${e.year||""}</span></div>`).join("");
  const skillH = `<div style="display:flex;flex-wrap:wrap;gap:5px">${r.skills.map(s=>`<span style="background:${mu};color:${dk};padding:2px 10px;border-radius:20px;font-size:11px">${s.name}${s.level?" · "+s.level:""}</span>`).join("")}</div>`;
  const langH = r.languages.length ? `<div style="display:flex;flex-wrap:wrap;gap:5px">${r.languages.map(l=>`<span style="background:${mu};color:${dk};padding:2px 10px;border-radius:20px;font-size:11px">${l.name} · ${l.level}</span>`).join("")}</div>` : "";
  const hobbyH = r.hobbies.length ? r.hobbies.join(" · ") : "";
  const projH = r.projects.map(p=>`<div style="margin-bottom:8px"><strong>${p.name}</strong>${p.url?" <span style='font-size:11px;color:"+a+"'>"+p.url+"</span>":""}<p style="margin:2px 0;font-size:12px;color:#555">${p.description||""}</p></div>`).join("");
  const certH = r.certifications.map(c=>`<div style="margin-bottom:4px;font-size:12px"><strong>${c.name}</strong>${c.issuer?" — "+c.issuer:""} ${c.year?"("+c.year+")":""}</div>`).join("");

  const sec = (title, body) => body ? `<div style="margin-bottom:16px"><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:${a};border-bottom:1px solid ${mu};padding-bottom:3px;margin-bottom:8px">${title}</div>${body}</div>` : "";

  const footer = `<div style="margin-top:24px;padding-top:8px;border-top:1px solid ${mu};text-align:center;font-size:10px;color:${a}">Built with <a href="https://www.resume88.com" style="color:${a};text-decoration:none;font-weight:600">resume88.com</a></div>`;

  const base = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${(resume.personal.name||"resume").replace(/\s+/g,"-").toLowerCase()}</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;line-height:1.5;color:#1a1a1a}@media print{@page{size:A4;margin:1cm}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>`;
  const name = r.personal.name||"Your Name", title=r.personal.title||"";
  const mainSections = `
    ${r.personal.summary?sec("Summary","<p style='font-size:12px;color:#444;line-height:1.6'>"+r.personal.summary+"</p>"):""}
    ${r.experience.length?sec("Experience",expH):""}
    ${r.education.length?sec("Education",eduH):""}
    ${r.skills.length?sec("Skills",skillH):""}
    ${r.languages.length?sec("Languages",langH):""}
    ${r.projects.length?sec("Projects",projH):""}
    ${r.certifications.length?sec("Certifications",certH):""}
    ${r.hobbies.length?sec("Interests",`<p style='font-size:12px;color:#555'>${hobbyH}</p>`):""}
  `;
  const sidebarLeft = `
    ${r.personal.photo?`<div style='margin-bottom:12px'>${photoHtml}</div>`:""}
    <div style="font-size:20px;font-weight:700;margin-bottom:2px">${name}</div>
    <div style="font-size:12px;opacity:.8;margin-bottom:12px">${title}</div>
    <div style="font-size:11px;line-height:2;margin-bottom:12px;border-bottom:1px solid rgba(255,255,255,.2);padding-bottom:12px">${contact.map(c=>"<div>"+c+"</div>").join("")}</div>
    ${r.skills.length?`<div style='margin-bottom:12px'><div style='font-size:10px;text-transform:uppercase;letter-spacing:1px;opacity:.7;margin-bottom:6px'>Skills</div><div style='display:flex;flex-wrap:wrap;gap:3px'>${r.skills.map(s=>"<span style='background:rgba(255,255,255,.2);border-radius:10px;padding:1px 8px;font-size:10px;margin-bottom:2px'>"+s.name+"</span>").join("")}</div></div>`:""}
    ${r.languages.length?`<div style='margin-bottom:12px'><div style='font-size:10px;text-transform:uppercase;letter-spacing:1px;opacity:.7;margin-bottom:6px'>Languages</div>${r.languages.map(l=>"<div style='font-size:11px;opacity:.9;margin-bottom:3px'>"+l.name+" · "+l.level+"</div>").join("")}</div>`:""}
    ${r.certifications.length?`<div><div style='font-size:10px;text-transform:uppercase;letter-spacing:1px;opacity:.7;margin-bottom:6px'>Certifications</div>${r.certifications.map(c=>"<div style='font-size:11px;opacity:.9;margin-bottom:3px'>"+c.name+"</div>").join("")}</div>`:""}
  `;

  if (tmplId==="sidebar"||tmplId==="creative") return base+`<div style="display:flex;min-height:100vh"><div style="width:33%;background:${a};color:#fff;padding:24px 16px">${sidebarLeft}</div><div style="flex:1;padding:24px 20px">${mainSections}</div></div></body></html>`;
  if (tmplId==="modern") return base+`<div style="background:linear-gradient(135deg,${dk},${a});color:#fff;padding:28px 36px">${photoHtml?`<div style="display:flex;align-items:center;gap:16px"><div>${photoHtml}</div><div><div style="font-size:26px;font-weight:800">${name}</div><div style="font-size:14px;opacity:.8">${title}</div><div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:8px;font-size:11px;opacity:.7">${contact.map(c=>"<span>"+c+"</span>").join("")}</div></div></div>`:`<div style="font-size:26px;font-weight:800">${name}</div><div style="font-size:14px;opacity:.8;margin-top:2px">${title}</div><div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:8px;font-size:11px;opacity:.7">${contact.map(c=>"<span>"+c+"</span>").join("")}</div>`}</div><div style="padding:24px 36px">${mainSections}</div></body></html>`;
  if (tmplId==="corporate") return base+`<div style="height:6px;background:${a}"></div><div style="padding:18px 36px 14px;border-bottom:1px solid ${mu};display:flex;justify-content:space-between;align-items:center">${photoHtml?`<div style="display:flex;align-items:center;gap:14px">${photoHtml}<div><div style="font-size:22px;font-weight:700;color:${dk}">${name}</div><div style="color:${a};font-size:13px;font-weight:600">${title}</div></div></div>`:`<div><div style="font-size:22px;font-weight:700;color:${dk}">${name}</div><div style="color:${a};font-size:13px;font-weight:600">${title}</div></div>`}<div style="text-align:right;font-size:11px;color:#666;line-height:1.8">${contact.map(c=>"<div>"+c+"</div>").join("")}</div></div><div style="padding:20px 36px">${mainSections}</div></body></html>`;
  if (tmplId==="minimal") return base+`<div style="padding:40px 48px;max-width:720px"><div style="text-align:center;margin-bottom:20px;padding-bottom:16px;border-bottom:2px solid ${a}">${photoHtml?`<div style="margin-bottom:10px;display:flex;justify-content:center">${photoHtml}</div>`:""}<div style="font-size:28px;font-weight:300;letter-spacing:2px;text-transform:uppercase">${name}</div>${title?`<div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-top:4px;color:${a}">${title}</div>`:""}<div style="font-size:11px;color:#888;margin-top:8px;display:flex;justify-content:center;gap:14px;flex-wrap:wrap">${contact.map(c=>"<span>"+c+"</span>").join("")}</div></div>${mainSections}</div></body></html>`;
  // classic (default)
  return base+`<div style="padding:32px 40px;max-width:760px"><div style="margin-bottom:18px;padding-bottom:12px;border-bottom:3px solid ${a};display:flex;justify-content:space-between;align-items:center">${photoHtml?`<div style="display:flex;align-items:center;gap:14px">${photoHtml}<div><div style="font-size:24px;font-weight:700;color:${dk}">${name}</div>${title?`<div style="font-size:13px;font-weight:600;color:${a}">${title}</div>`:""}<div style="margin-top:5px;font-size:11px;color:#666;display:flex;gap:12px;flex-wrap:wrap">${contact.map(c=>"<span>"+c+"</span>").join("")}</div></div></div>`:`<div><div style="font-size:24px;font-weight:700;color:${dk}">${name}</div>${title?`<div style="font-size:13px;font-weight:600;color:${a}">${title}</div>`:""}</div><div style="text-align:right;font-size:11px;color:#666;line-height:1.8">${contact.map(c=>"<div>"+c+"</div>").join("")}</div>`}</div>${mainSections}</div></body></html>`;
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
  if (view==="templates") return <TemplateScreen tmplId={tmplId} palKey={palKey} resume={resume} pal={pal} onSelectTemplate={t=>{setTmplId(t);saveAll(resume,t,palKey);}} onSelectPalette={p=>{setPalKey(p);saveAll(resume,tmplId,p);}} onBack={()=>{ setView("editor"); setShowPreview(true); }} onExport={()=>exportPDF(tmplId,pal,resume)} />;
  if (view==="guided") return <GuidedFlow resume={resume} setResume={setResume} step={step} setStep={setStep} update={update} onFinish={()=>{ setView("editor"); setShowPreview(true); }} onSkip={()=>{ setView("editor"); setShowPreview(false); }} />;
  return <EditorLayout resume={resume} setResume={setResume} update={update} tmplId={tmplId} pal={pal} tab={tab} setTab={setTab} onTemplates={()=>setView("templates")} onExport={()=>exportPDF(tmplId,pal,resume)} onBack={()=>setView("start")} saveAll={saveAll} showPreviewInit={showPreview} />;
}

// ─── START ────────────────────────────────────────────────────────────────────
function StartScreen({onGuided,onManual,hasSaved,onAdmin}) {
  const t = TRANSLATIONS[getLang()];
  const isRtl = getLang() === "ar";
  const [form, setForm] = useState({name:"",email:"",message:""});
  const [status, setStatus] = useState("idle");
  const [showContact, setShowContact] = useState(false);

  const sendMessage = async () => {
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "cef56cba-c7ee-4301-90e7-b2a6f6b62e76",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-start p-4 pt-10" dir={isRtl?"rtl":"ltr"}>      {/* FREE badge — big & prominent */}
      <div className="mb-6 px-5 py-2.5 bg-green-400 text-green-950 font-bold text-sm rounded-full shadow-lg animate-pulse text-center max-w-lg">
        🎉 {t.badge}
      </div>

      {/* Main card */}
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center mb-6">
        <div className="text-6xl mb-3">📄</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume88</h1>
        <p className="text-gray-500 text-sm mb-5">{t.sub}</p>

        {/* Feature pills */}
        <div className="flex justify-center flex-wrap gap-2 mb-7">
          {[`✅ ${t.feat1}`, `✅ ${t.feat2}`, `✅ ${t.feat3}`].map((f,i)=>(
            <span key={i} className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-100">{f}</span>
          ))}
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button onClick={onGuided} className="w-full py-3.5 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition shadow-md flex items-center justify-center gap-2 text-sm">
            🧙 {t.guided} <span className="text-blue-300 font-normal">{t.guidedSub}</span>
          </button>
          <button onClick={onManual} className="w-full py-3.5 border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold hover:border-blue-300 hover:bg-blue-50 transition flex items-center justify-center gap-2 text-sm">
            ✏️ {t.manual}
          </button>
        </div>

        {hasSaved && <p className="mt-4 text-xs text-green-600 bg-green-50 rounded-xl py-2 px-3">✅ {t.saved}</p>}

        {/* Built by + links */}
        <p className="mt-6 text-xs text-gray-400 flex items-center justify-center gap-2 flex-wrap">
          🛠 {t.builtBy} ·{" "}
          <a href="https://github.com/Salehro/resume88" target="_blank" rel="noreferrer"
            className="text-blue-400 hover:underline">GitHub</a>
          · 
          <button onClick={()=>setShowContact(s=>!s)}
            className="text-blue-400 hover:underline focus:outline-none">
            Contact
          </button>
          ·
          <button onClick={onAdmin}
            className="text-gray-300 hover:text-gray-400 focus:outline-none text-xs opacity-40 hover:opacity-70">
            ⚙
          </button>
        </p>

        {/* Inline contact form — slides open */}
        {showContact && (
          <div className="mt-4 border-t pt-4">
            <p className="text-xs text-gray-400 mb-3">{t.contactSub}</p>
            {status === "sent" ? (
              <div className="text-center py-3 text-green-600 font-semibold text-sm">{t.sent}</div>
            ) : (
              <div className="space-y-2">
                <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                  placeholder={t.namePh}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                <input value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}
                  placeholder={t.emailPh} type="email"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                <textarea value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))}
                  placeholder={t.msgPh} rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none" />
                {status==="error" && <p className="text-xs text-red-500">{t.sendErr}</p>}
                <button onClick={sendMessage} disabled={status==="sending"}
                  className="w-full py-2 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-60">
                  {status==="sending" ? t.sending : t.send}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b px-4 py-2.5 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-gray-400 hover:text-gray-600 px-1">←</button>
          <span className="font-bold text-gray-800 text-sm hidden sm:block">📄 Resume Builder</span>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Score pill */}
          <div className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold ${scoreBg} ${scoreColor}`}>
            {score}% Complete
          </div>
          <button onClick={()=>setMobPreview(s=>!s)} className={`lg:hidden px-2.5 py-1.5 rounded-lg text-xs font-medium ${mobPreview?"bg-blue-100 text-blue-700":"bg-gray-100 text-gray-600"}`}>
            {mobPreview?"✏️ Edit":"👁 Preview"}
          </button>
          <button onClick={onTemplates} className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1">
            🎨 <span className="hidden sm:inline">Templates</span>
          </button>
          <button onClick={onExport} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700">⬇ PDF</button>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {!mobPreview && (
          <div className="hidden sm:flex flex-col w-40 bg-white border-r py-3 px-2 gap-0.5 flex-shrink-0">
            {TABS.map(t=>(
              <button key={t.key} onClick={()=>setTab(t.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition ${t.key===tab?"bg-blue-50 text-blue-700":"text-gray-500 hover:bg-gray-50"}`}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
            <div className="mt-auto border-t pt-2">
              <button onClick={onTemplates} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-purple-600 hover:bg-purple-50">
                🎨 Templates
              </button>
            </div>
          </div>
        )}
        {/* Form */}
        {!mobPreview ? (
          <div className="flex-1 overflow-auto">
            <div className="sm:hidden flex gap-1 p-2 bg-white border-b overflow-x-auto">
              {TABS.map(t=>(
                <button key={t.key} onClick={()=>setTab(t.key)} className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-medium ${t.key===tab?"bg-blue-600 text-white":"bg-gray-100 text-gray-500"}`}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            <div className="p-5 max-w-xl">
              {/* Tip box */}
              {TIPS[tab] && <div className="mb-4 text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">{TIPS[tab]}</div>}
              <TabContent tab={tab} resume={resume} setResume={setResume} update={update} />
              {/* Score card */}
              {tips.length > 0 && (
                <div className={`mt-6 border rounded-2xl p-4 ${scoreBg}`}>
                  <div className={`font-bold text-sm mb-2 ${scoreColor}`}>📊 Resume Score: {score}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div className="h-2 rounded-full transition-all" style={{width:score+"%",background:score>=80?"#16a34a":score>=50?"#ca8a04":"#dc2626"}} />
                  </div>
                  <p className="text-xs text-gray-600 font-medium mb-1">To improve your score:</p>
                  {tips.map((t,i)=><div key={i} className="text-xs text-gray-600 py-0.5">• {t}</div>)}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto bg-gray-300 p-4 flex justify-center">
            <div className="w-full max-w-[680px] bg-white shadow-xl rounded-lg overflow-hidden">
              <ResumeDoc tmplId={tmplId} pal={pal} resume={resume} />
            </div>
          </div>
        )}
        {/* Desktop preview */}
        {!mobPreview && (
          <div className="hidden lg:flex flex-col w-[400px] flex-shrink-0 bg-gray-200 border-l">
            <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Live Preview</span>
              <button onClick={onTemplates} className="text-xs text-purple-600 hover:underline">🎨 Change Template</button>
            </div>
            <div className="flex-1 overflow-auto p-3 flex justify-center">
              <div className="w-full bg-white shadow-lg rounded overflow-hidden" style={{transform:"scale(0.72)",transformOrigin:"top center",width:"138%",marginLeft:"-19%"}}>
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
      <h2 className="text-base font-bold text-gray-800 mb-3">📝 Professional Summary</h2>
      <textarea rows={6} placeholder="Results-driven professional with X years of experience in..."
        value={resume.personal.summary}
        onChange={e=>update(["personal","summary"],e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none" />
    </div>
  );
}

// ─── PERSONAL TAB with photo upload ──────────────────────────────────────────
function Field({label, value, onChange, placeholder="", type="text", half=false}) {
  return (
    <div className={`mb-3 ${half?"flex-1":""}`}>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white" />
    </div>
  );
}

function PersonalTab({resume,update,setResume}) {
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
      <h2 className="text-base font-bold text-gray-800 mb-4">👤 Personal Information</h2>
      {/* Photo upload */}
      <div className="mb-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer hover:border-blue-400 transition" onClick={()=>fileRef.current.click()}>
          {resume.personal.photo
            ? <img src={resume.personal.photo} alt="profile" className="w-full h-full object-cover" />
            : <span className="text-2xl">📷</span>}
        </div>
        <div>
          <button onClick={()=>fileRef.current.click()} className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition">Upload Photo</button>
          {resume.personal.photo && <button onClick={()=>update(["personal","photo"],"")} className="ml-2 px-3 py-1.5 bg-red-50 border border-red-100 text-red-500 rounded-lg text-xs hover:bg-red-100">Remove</button>}
          <p className="text-xs text-gray-400 mt-1">Optional · shown in some templates</p>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
      </div>
      <div className="flex gap-2">
        <Field label="Full Name *" value={resume.personal.name} onChange={e=>update(["personal","name"],e.target.value)} placeholder="Jane Smith" half />
        <Field label="Professional Title" value={resume.personal.title} onChange={e=>update(["personal","title"],e.target.value)} placeholder="Software Engineer" half />
      </div>
      <div className="flex gap-2">
        <Field label="Email *" value={resume.personal.email} onChange={e=>update(["personal","email"],e.target.value)} placeholder="jane@email.com" type="email" half />
        <Field label="Phone" value={resume.personal.phone} onChange={e=>update(["personal","phone"],e.target.value)} placeholder="+1 555-000-0000" half />
      </div>
      <Field label="Location" value={resume.personal.location} onChange={e=>update(["personal","location"],e.target.value)} placeholder="San Francisco, CA" />
      <Field label="LinkedIn URL" value={resume.personal.linkedin} onChange={e=>update(["personal","linkedin"],e.target.value)} placeholder="linkedin.com/in/jane" />
      <div className="flex gap-2">
        <Field label="GitHub" value={resume.personal.github} onChange={e=>update(["personal","github"],e.target.value)} placeholder="github.com/jane" half />
        <Field label="Portfolio / Website" value={resume.personal.website} onChange={e=>update(["personal","website"],e.target.value)} placeholder="janesmith.com" half />
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ─────────────────────────────────────────────────────────
const ADMIN_PASSWORD = "resume88admin"; // change this to your own password

function AdminDashboard({ onExit }) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  const login = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwErr(false); }
    else { setPwErr(true); setPw(""); }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: events } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });

      if (!events) return;

      const now = new Date();
      const todayStr = now.toISOString().slice(0,10);
      const weekAgo = new Date(now - 7*24*60*60*1000);

      const views   = events.filter(e=>e.type==="view");
      const builds  = events.filter(e=>e.type==="build");
      const downloads = events.filter(e=>e.type==="download");
      const today   = events.filter(e=>e.created_at?.slice(0,10)===todayStr);

      // Last 7 days chart
      const days = Array.from({length:7}, (_,i)=>{
        const d = new Date(now - (6-i)*24*60*60*1000);
        const str = d.toISOString().slice(0,10);
        const label = d.toLocaleDateString("en-US",{weekday:"short"});
        return {
          label,
          views:    events.filter(e=>e.type==="view"     && e.created_at?.slice(0,10)===str).length,
          builds:   events.filter(e=>e.type==="build"    && e.created_at?.slice(0,10)===str).length,
          downloads:events.filter(e=>e.type==="download" && e.created_at?.slice(0,10)===str).length,
        };
      });

      // Template breakdown
      const tmplCounts = {};
      downloads.forEach(e=>{ if(e.template) tmplCounts[e.template]=(tmplCounts[e.template]||0)+1; });
      const totalTmpl = Object.values(tmplCounts).reduce((a,b)=>a+b,0)||1;
      const templates = Object.entries(tmplCounts).sort((a,b)=>b[1]-a[1]);

      // Color breakdown
      const colorCounts = {};
      downloads.forEach(e=>{ if(e.color) colorCounts[e.color]=(colorCounts[e.color]||0)+1; });
      const colors = Object.entries(colorCounts).sort((a,b)=>b[1]-a[1]);

      setData({ views:views.length, builds:builds.length, downloads:downloads.length,
        today:today.length, days, templates, totalTmpl, colors,
        recent: events.slice(0,12) });
      setLastRefresh(new Date().toLocaleTimeString());
    } catch(e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { if (authed) fetchData(); }, [authed, fetchData]);

  // ── LOGIN SCREEN ────────────────────────────────────────────────────────────
  if (!authed) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center">
        <div className="text-4xl mb-3">🔐</div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Admin Access</h2>
        <p className="text-xs text-gray-400 mb-5">Resume88 Dashboard</p>
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&login()}
          placeholder="Enter password"
          className={`w-full border ${pwErr?"border-red-400":"border-gray-200"} rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 mb-3`} />
        {pwErr && <p className="text-xs text-red-500 mb-2">Incorrect password</p>}
        <button onClick={login}
          className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition">
          Login
        </button>
        <button onClick={onExit} className="mt-3 text-xs text-gray-400 hover:underline">← Back to Resume88</button>
      </div>
    </div>
  );

  // ── DASHBOARD ───────────────────────────────────────────────────────────────
  const TMPL_ICONS = {classic:"📋",sidebar:"▌",modern:"⚡",minimal:"○",corporate:"🏢",creative:"🎨"};
  const COLOR_HEX  = {blue:"#2563eb",violet:"#7c3aed",teal:"#0f766e",rose:"#e11d48",orange:"#ea580c",slate:"#475569",emerald:"#059669",indigo:"#4f46e5"};

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
      {/* Top bar */}
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xl">📊</span>
          <div>
            <h1 className="font-bold text-gray-800">Resume88 — Admin Dashboard</h1>
            {lastRefresh && <p className="text-xs text-gray-400">Last updated: {lastRefresh}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchData} disabled={loading}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50">
            {loading ? "⏳ Loading..." : "🔄 Refresh"}
          </button>
          <button onClick={onExit}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700">
            ← Back to App
          </button>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {loading && !data ? (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <div className="text-center"><div className="text-4xl mb-3 animate-spin">⏳</div><p>Loading dashboard data...</p></div>
          </div>
        ) : data ? (<>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard icon="👁" label="Total Views"     value={data.views.toLocaleString()}     sub="All time"           color="blue"   />
            <StatCard icon="📄" label="Resumes Built"   value={data.builds.toLocaleString()}    sub="Guided completions" color="purple" />
            <StatCard icon="⬇" label="PDF Downloads"   value={data.downloads.toLocaleString()} sub="All time"           color="green"  />
            <StatCard icon="🔥" label="Today"           value={data.today.toLocaleString()}     sub="All events today"   color="orange" />
          </div>

          {/* Conversion rate */}
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

          {/* 7-day chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
            <h2 className="font-bold text-gray-700 mb-4 text-sm">📈 Last 7 Days</h2>
            <div className="flex items-end gap-3 h-36">
              {data.days.map((d,i)=>(
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-0.5 items-end" style={{height:"100px"}}>
                    {[{v:d.views,c:"#93c5fd"},{v:d.builds,c:"#c4b5fd"},{v:d.downloads,c:"#6ee7b7"}].map(({v,c},j)=>(
                      <div key={j} className="flex-1 rounded-t transition-all" title={v}
                        style={{height:`${Math.max((v/maxDay)*100,v>0?8:0)}%`, background:c}} />
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
            {/* Templates */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-bold text-gray-700 mb-4 text-sm">🎨 Most Used Templates</h2>
              {data.templates.length === 0
                ? <p className="text-xs text-gray-400">No downloads yet</p>
                : data.templates.map(([tmpl,count])=>(
                  <div key={tmpl} className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700">{TMPL_ICONS[tmpl]||"📄"} {tmpl.charAt(0).toUpperCase()+tmpl.slice(1)}</span>
                      <span className="text-gray-400">{count} ({((count/data.totalTmpl)*100).toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-blue-400 transition-all"
                        style={{width:((count/data.totalTmpl)*100)+"%"}} />
                    </div>
                  </div>
                ))
              }
            </div>

            {/* Colors */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-bold text-gray-700 mb-4 text-sm">🎨 Most Used Colors</h2>
              {data.colors.length === 0
                ? <p className="text-xs text-gray-400">No downloads yet</p>
                : data.colors.map(([color,count])=>(
                  <div key={color} className="flex items-center gap-3 mb-2.5">
                    <div className="w-5 h-5 rounded-full flex-shrink-0 border border-gray-100"
                      style={{background:COLOR_HEX[color]||"#888"}} />
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="font-medium text-gray-700 capitalize">{color}</span>
                        <span className="text-gray-400">{count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full transition-all"
                          style={{width:((count/data.colors[0][1])*100)+"%", background:COLOR_HEX[color]||"#888"}} />
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Recent activity */}
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
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[e.type]||"bg-gray-50 text-gray-600"}`}>
                      {icons[e.type]||"•"} {e.type}
                    </span>
                    <span className="text-xs text-gray-600 flex-1">{labels[e.type]||e.type}
                      {e.template && <span className="text-gray-400"> · {e.template}</span>}
                    </span>
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b px-5 py-3 flex items-center justify-between">
        <span className="font-bold text-gray-800">📄 Resume Builder</span>
        <div className="flex items-center gap-3"><span className="text-sm text-gray-400">{step+1}/{GUIDED_STEPS.length}</span><button onClick={onSkip} className="text-xs text-blue-500 hover:underline">Skip to Editor</button></div>
      </div>
      <div className="h-1.5 bg-gray-200"><div className="h-full bg-blue-500 transition-all" style={{width:((step)/GUIDED_STEPS.length*100)+"%"}} /></div>
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:flex flex-col w-48 bg-white border-r p-3 gap-0.5">
          {GUIDED_STEPS.map((s,i)=>(
            <button key={s.key} onClick={()=>setStep(i)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition ${i===step?"bg-blue-50 text-blue-700":i<step?"text-green-600":"text-gray-400"}`}>
              <span>{i<step?"✅":s.icon}</span>{s.label}
            </button>
          ))}
        </div>
        <div className="flex-1 flex flex-col overflow-auto">
          <div className="flex-1 p-6 max-w-xl mx-auto w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-1">{cur.icon} {cur.label}</h2>
            {TIPS[cur.key] && <div className="mb-4 text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">{TIPS[cur.key]}</div>}
            <TabContent tab={cur.key} resume={resume} setResume={setResume} update={update} />
          </div>
          <div className="bg-white border-t px-6 py-3 flex justify-between">
            {step>0 ? <button onClick={()=>setStep(s=>s-1)} className="px-4 py-2 border rounded-xl text-sm text-gray-600 hover:bg-gray-50">← Back</button> : <div/>}
            {step<GUIDED_STEPS.length-1
              ? <button onClick={()=>setStep(s=>s+1)} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700">Next →</button>
              : <button onClick={onFinish} className="px-6 py-2 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700">Finish & Preview 🎉</button>}
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
    <img src={r.personal.photo} alt="profile" style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",border:ring?`2px solid ${mu}`:"2px solid white",flexShrink:0}} />
  ) : null;

  const Sec = ({title,children}) => (
    <div className="mb-4">
      <div className="text-xs font-bold uppercase tracking-widest pb-1 mb-2 border-b" style={{color:a,borderColor:mu}}>{title}</div>
      {children}
    </div>
  );
  const ExpList = () => r.experience.map(e=>(
    <div key={e.id} className="mb-3">
      <div className="flex justify-between items-baseline flex-wrap gap-1">
        <span className="text-xs font-semibold text-gray-800">{e.title}{e.company&&<span className="font-normal text-gray-500"> — {e.company}</span>}</span>
        <span className="text-xs text-gray-400 whitespace-nowrap">{e.start}{e.end?` – ${e.end}`:e.start?" – Present":""}</span>
      </div>
      {e.location&&<div className="text-xs text-gray-400">{e.location}</div>}
      {e.bullets&&<ul className="mt-0.5 ml-3">{e.bullets.split("\n").filter(Boolean).map((b,i)=><li key={i} className="text-xs text-gray-600 list-disc mb-0.5">{b.replace(/^[•\-]\s*/,"")}</li>)}</ul>}
    </div>
  ));
  const EduList = () => r.education.map(e=>(
    <div key={e.id} className="mb-2 flex justify-between items-baseline flex-wrap gap-1">
      <div><div className="text-xs font-semibold text-gray-800">{e.degree}{e.field&&` in ${e.field}`}</div><div className="text-xs text-gray-500">{e.school}</div></div>
      <span className="text-xs text-gray-400">{e.year}</span>
    </div>
  ));
  const SkillTags = ({dark=false}) => (
    <div className="flex flex-wrap gap-1">
      {r.skills.map((s,i)=><span key={i} className="text-xs px-2 py-0.5 rounded-full" style={dark?{background:"rgba(255,255,255,.2)",color:"#fff"}:{background:mu,color:dk}}>{s.name}{s.level&&<span style={{opacity:.7}}> · {s.level}</span>}</span>)}
    </div>
  );
  const LangTags = ({dark=false}) => r.languages.length>0 ? (
    <div className="flex flex-wrap gap-1">
      {r.languages.map((l,i)=><span key={i} className="text-xs px-2 py-0.5 rounded-full" style={dark?{background:"rgba(255,255,255,.2)",color:"#fff"}:{background:mu,color:dk}}>{l.name} · {l.level}</span>)}
    </div>
  ) : null;
  const ProjList = () => r.projects.map(p=>(
    <div key={p.id} className="mb-2"><div className="text-xs font-semibold text-gray-800">{p.name}{p.url&&<a className="text-xs font-normal ml-1" style={{color:a}}>{p.url}</a>}</div>{p.description&&<p className="text-xs text-gray-600 mt-0.5">{p.description}</p>}</div>
  ));
  const CertList = ({dark=false}) => r.certifications.map(c=>(
    <div key={c.id} className="text-xs mb-1" style={dark?{color:"rgba(255,255,255,.9)"}:{}}><span className="font-semibold">{c.name}</span>{c.issuer&&` — ${c.issuer}`}{c.year&&` (${c.year})`}</div>
  ));

  const name = r.personal.name||"Your Name", title=r.personal.title||"";

  const MainContent = ({skipSkills=false}) => (<>
    {r.personal.summary&&<Sec title="Summary"><p className="text-xs text-gray-600 leading-relaxed">{r.personal.summary}</p></Sec>}
    {r.experience.length>0&&<Sec title="Experience"><ExpList/></Sec>}
    {r.education.length>0&&<Sec title="Education"><EduList/></Sec>}
    {!skipSkills&&r.skills.length>0&&<Sec title="Skills"><SkillTags/></Sec>}
    {!skipSkills&&r.languages.length>0&&<Sec title="Languages"><LangTags/></Sec>}
    {r.projects.length>0&&<Sec title="Projects"><ProjList/></Sec>}
    {r.certifications.length>0&&!skipSkills&&<Sec title="Certifications"><CertList/></Sec>}
    {r.hobbies.length>0&&<Sec title="Interests"><p className="text-xs text-gray-600">{r.hobbies.join(" · ")}</p></Sec>}
  </>);

  if (tmplId==="classic") return (
    <div className="p-7 text-xs min-h-[900px]" style={{fontFamily:"'Segoe UI',Arial,sans-serif"}}>
      <div className="pb-3 mb-4 border-b-4" style={{borderColor:a}}>
        <div className="flex items-center gap-3">
          <Photo size={56} />
          <div className="flex-1">
            <div className="text-xl font-bold" style={{color:dk}}>{name}</div>
            {title&&<div className="text-xs font-semibold mt-0.5" style={{color:a}}>{title}</div>}
            {contact.length>0&&<div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">{contact.map((c,i)=><span key={i}>{c}</span>)}</div>}
          </div>
        </div>
      </div>
      <MainContent/>
    </div>
  );

  if (tmplId==="sidebar") return (
    <div className="flex text-xs min-h-[900px]" style={{fontFamily:"'Segoe UI',Arial,sans-serif"}}>
      <div className="w-[33%] text-white p-5 flex flex-col gap-3" style={{background:a}}>
        {r.personal.photo&&<div className="flex justify-center mb-1"><Photo size={72} ring /></div>}
        <div><div className="font-bold text-base leading-tight">{name}</div>{title&&<div className="text-xs opacity-75 mt-0.5">{title}</div>}</div>
        {contact.length>0&&<div className="text-xs opacity-85 space-y-0.5 border-t border-white/20 pt-2">{contact.map((c,i)=><div key={i}>{c}</div>)}</div>}
        {r.skills.length>0&&<div className="border-t border-white/20 pt-2"><div className="text-xs uppercase tracking-widest opacity-60 mb-1">Skills</div><SkillTags dark/></div>}
        {r.languages.length>0&&<div className="border-t border-white/20 pt-2"><div className="text-xs uppercase tracking-widest opacity-60 mb-1">Languages</div><LangTags dark/></div>}
        {r.certifications.length>0&&<div className="border-t border-white/20 pt-2"><div className="text-xs uppercase tracking-widest opacity-60 mb-1">Certifications</div><CertList dark/></div>}
        {r.hobbies.length>0&&<div className="border-t border-white/20 pt-2"><div className="text-xs uppercase tracking-widest opacity-60 mb-1">Interests</div><p className="text-xs opacity-85">{r.hobbies.join(", ")}</p></div>}
      </div>
      <div className="flex-1 p-5"><MainContent skipSkills/></div>
    </div>
  );

  if (tmplId==="modern") return (
    <div className="text-xs min-h-[900px]" style={{fontFamily:"'Segoe UI',Arial,sans-serif"}}>
      <div className="px-7 py-6 text-white" style={{background:`linear-gradient(135deg,${dk},${a})`}}>
        <div className="flex items-center gap-4">
          <Photo size={64} ring />
          <div><div className="text-xl font-extrabold tracking-tight">{name}</div>{title&&<div className="text-xs opacity-80 mt-0.5">{title}</div>}{contact.length>0&&<div className="flex flex-wrap gap-3 mt-2 text-xs opacity-70">{contact.map((c,i)=><span key={i}>{c}</span>)}</div>}</div>
        </div>
      </div>
      <div className="p-6"><MainContent/></div>
    </div>
  );

  if (tmplId==="minimal") return (
    <div className="p-8 text-xs min-h-[900px]" style={{fontFamily:"Georgia,'Times New Roman',serif"}}>
      <div className="text-center mb-5 pb-4 border-b-2" style={{borderColor:a}}>
        {r.personal.photo&&<div className="flex justify-center mb-2"><Photo size={64}/></div>}
        <div className="text-2xl font-light tracking-[3px] uppercase text-gray-800">{name}</div>
        {title&&<div className="text-xs tracking-[2px] uppercase mt-1" style={{color:a}}>{title}</div>}
        {contact.length>0&&<div className="flex justify-center flex-wrap gap-3 mt-2 text-xs text-gray-400">{contact.map((c,i)=><span key={i}>{c}</span>)}</div>}
      </div>
      <MainContent/>
    </div>
  );

  if (tmplId==="corporate") return (
    <div className="text-xs min-h-[900px]" style={{fontFamily:"'Segoe UI',Arial,sans-serif"}}>
      <div className="h-2 w-full" style={{background:a}} />
      <div className="px-7 pt-4 pb-3 border-b-2" style={{borderColor:mu}}>
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <Photo size={52} ring />
            <div><div className="text-lg font-bold" style={{color:dk}}>{name}</div>{title&&<div className="text-xs font-semibold mt-0.5" style={{color:a}}>{title}</div>}</div>
          </div>
          {contact.length>0&&<div className="text-right text-xs text-gray-500 space-y-0.5">{contact.map((c,i)=><div key={i}>{c}</div>)}</div>}
        </div>
      </div>
      <div className="px-7 py-5"><MainContent/></div>
    </div>
  );

  if (tmplId==="creative") return (
    <div className="text-xs min-h-[900px]" style={{fontFamily:"'Segoe UI',Arial,sans-serif"}}>
      <div className="relative px-7 py-6" style={{background:lt}}>
        <div className="absolute left-0 top-0 w-2 h-full" style={{background:a}} />
        <div className="flex items-center gap-4">
          <Photo size={60} ring />
          <div>
            <div className="text-2xl font-black tracking-tight" style={{color:dk}}>{name}</div>
            {title&&<span className="inline-block mt-1 px-2.5 py-0.5 text-xs font-bold text-white rounded-full" style={{background:a}}>{title}</span>}
            {contact.length>0&&<div className="flex flex-wrap gap-2 mt-1.5 text-xs text-gray-500">{contact.map((c,i)=><span key={i}>• {c}</span>)}</div>}
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="flex-1 p-5">
          {r.personal.summary&&<Sec title="Profile"><p className="text-xs text-gray-600 leading-relaxed">{r.personal.summary}</p></Sec>}
          {r.experience.length>0&&<Sec title="Experience"><ExpList/></Sec>}
          {r.education.length>0&&<Sec title="Education"><EduList/></Sec>}
          {r.projects.length>0&&<Sec title="Projects"><ProjList/></Sec>}
          {r.hobbies.length>0&&<Sec title="Interests"><p className="text-xs text-gray-600">{r.hobbies.join(" · ")}</p></Sec>}
        </div>
        <div className="w-[32%] p-4 border-l" style={{borderColor:mu,background:lt+"80"}}>
          {r.skills.length>0&&<div className="mb-3"><div className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{color:a}}>Skills</div><SkillTags/></div>}
          {r.languages.length>0&&<div className="mb-3"><div className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{color:a}}>Languages</div><LangTags/></div>}
          {r.certifications.length>0&&<div><div className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{color:a}}>Certifications</div><CertList/></div>}
        </div>
      </div>
    </div>
  );
  return null;
}

// ─── SUB EDITORS ─────────────────────────────────────────────────────────────
function ExperienceEditor({experience,setResume}) {
  const add = () => setResume(r=>({...r,experience:[...r.experience,{id:uid(),title:"",company:"",location:"",start:"",end:"",bullets:""}]}));
  const upd = (id,f,v) => setResume(r=>({...r,experience:r.experience.map(e=>e.id===id?{...e,[f]:v}:e)}));
  const del = (id) => setResume(r=>({...r,experience:r.experience.filter(e=>e.id!==id)}));
  return (
    <div>
      <h2 className="text-base font-bold text-gray-800 mb-4">💼 Work Experience</h2>
      {experience.map((e,idx)=>(
        <div key={e.id} className="mb-4 p-4 border border-gray-200 rounded-2xl bg-white shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Position #{idx+1}</span>
            <button onClick={()=>del(e.id)} className="text-red-400 hover:text-red-600 text-xs">✕ Remove</button>
          </div>
          {[["Job Title","title","Software Engineer"],["Company","company","Acme Corp"],["Location","location","San Francisco, CA"]].map(([l,f,ph])=>(
            <div key={f} className="mb-2"><label className="block text-xs text-gray-500 mb-0.5">{l}</label><input value={e[f]} placeholder={ph} onChange={ev=>upd(e.id,f,ev.target.value)} className="w-full border border-gray-100 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-gray-50" /></div>
          ))}
          <div className="flex gap-2 mb-2">
            {[["Start","start","Jan 2022"],["End (blank = present)","end","Dec 2024"]].map(([l,f,ph])=>(
              <div key={f} className="flex-1"><label className="block text-xs text-gray-500 mb-0.5">{l}</label><input value={e[f]} placeholder={ph} onChange={ev=>upd(e.id,f,ev.target.value)} className="w-full border border-gray-100 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-gray-50" /></div>
            ))}
          </div>
          <label className="block text-xs text-gray-500 mb-0.5">Key Responsibilities & Achievements (one per line)</label>
          <textarea rows={4} value={e.bullets} placeholder={"• Led a team of 5 engineers\n• Increased performance by 40%"} onChange={ev=>upd(e.id,"bullets",ev.target.value)} className="w-full border border-gray-100 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-gray-50 resize-none" />
        </div>
      ))}
      <button onClick={add} className="w-full py-2.5 border-2 border-dashed border-blue-200 text-blue-400 rounded-2xl text-sm hover:bg-blue-50 transition">+ Add Work Experience</button>
    </div>
  );
}

function EducationEditor({education,setResume}) {
  const add = () => setResume(r=>({...r,education:[...r.education,{id:uid(),degree:"",field:"",school:"",year:""}]}));
  const upd = (id,f,v) => setResume(r=>({...r,education:r.education.map(e=>e.id===id?{...e,[f]:v}:e)}));
  const del = (id) => setResume(r=>({...r,education:r.education.filter(e=>e.id!==id)}));
  return (
    <div>
      <h2 className="text-base font-bold text-gray-800 mb-4">🎓 Education</h2>
      {education.map((e,idx)=>(
        <div key={e.id} className="mb-4 p-4 border border-gray-200 rounded-2xl bg-white shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Degree #{idx+1}</span>
            <button onClick={()=>del(e.id)} className="text-red-400 hover:text-red-600 text-xs">✕ Remove</button>
          </div>
          {[["Degree","degree","Bachelor of Science"],["Field of Study","field","Computer Science"],["School / University","school","Stanford University"],["Year","year","2020"]].map(([l,f,ph])=>(
            <div key={f} className="mb-2"><label className="block text-xs text-gray-500 mb-0.5">{l}</label><input value={e[f]} placeholder={ph} onChange={ev=>upd(e.id,f,ev.target.value)} className="w-full border border-gray-100 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-gray-50" /></div>
          ))}
        </div>
      ))}
      <button onClick={add} className="w-full py-2.5 border-2 border-dashed border-blue-200 text-blue-400 rounded-2xl text-sm hover:bg-blue-50 transition">+ Add Education</button>
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
      <h2 className="text-base font-bold text-gray-800 mb-2">⚡ Skills</h2>
      <p className="text-xs text-gray-400 mb-3">Add skills with an optional proficiency level</p>
      <div className="flex gap-2 mb-2">
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="e.g. React, Python, Figma" className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
        <select value={level} onChange={e=>setLevel(e.target.value)} className="border border-gray-200 rounded-xl px-2 py-2 text-xs focus:outline-none bg-white">
          {SKILL_LEVELS.map(l=><option key={l}>{l}</option>)}
        </select>
        <button onClick={add} className="px-3 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700">Add</button>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        {skills.map(s=>(
          <span key={s.name} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs border border-blue-100">
            {s.name}{s.level&&<span className="opacity-60"> · {s.level}</span>}
            <button onClick={()=>remove(s.name)} className="text-blue-300 hover:text-red-400 ml-1">✕</button>
          </span>
        ))}
      </div>
    </div>
  );
}

function LanguagesEditor({languages,setResume}) {
  const [name,setName] = useState(""); const [level,setLevel] = useState("Professional");
  const add = () => {
    if (!name.trim()) return;
    setResume(r=>({...r,languages:[...r.languages,{name:name.trim(),level}]}));
    setName("");
  };
  return (
    <div>
      <h2 className="text-base font-bold text-gray-800 mb-2">🌐 Languages</h2>
      <p className="text-xs text-gray-400 mb-3">Add languages you can use in a work setting</p>
      <div className="flex gap-2 mb-3">
        <input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="e.g. Spanish" className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
        <select value={level} onChange={e=>setLevel(e.target.value)} className="border border-gray-200 rounded-xl px-2 py-2 text-xs focus:outline-none bg-white">
          {LANG_LEVELS.map(l=><option key={l}>{l}</option>)}
        </select>
        <button onClick={add} className="px-3 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700">Add</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {languages.map((l,i)=>(
          <span key={i} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs border border-indigo-100">
            🌐 {l.name} <span className="opacity-60">· {l.level}</span>
            <button onClick={()=>setResume(r=>({...r,languages:r.languages.filter((_,j)=>j!==i)}))} className="text-indigo-300 hover:text-red-400 ml-1">✕</button>
          </span>
        ))}
      </div>
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
      <h2 className="text-base font-bold text-gray-800 mb-2">🎯 Hobbies & Interests</h2>
      <p className="text-xs text-gray-400 mb-3">Optional — only include if relevant or if you have space</p>
      <div className="flex gap-2 mb-3">
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="e.g. Open Source, Chess, Photography" className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
        <button onClick={add} className="px-3 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700">Add</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {hobbies.map((h,i)=>(
          <span key={i} className="flex items-center gap-1 bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs border border-orange-100">
            {h}<button onClick={()=>setResume(r=>({...r,hobbies:r.hobbies.filter((_,j)=>j!==i)}))} className="text-orange-300 hover:text-red-400 ml-1">✕</button>
          </span>
        ))}
      </div>
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
      <h2 className="text-base font-bold text-gray-800 mb-4">🏆 Projects & Certifications</h2>
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Projects</h3>
        {resume.projects.map((p,i)=>(
          <div key={p.id} className="mb-3 p-3 border border-gray-200 rounded-2xl bg-white shadow-sm">
            <div className="flex justify-between mb-2"><span className="text-xs text-gray-400">#{i+1}</span><button onClick={()=>delP(p.id)} className="text-red-400 text-xs">✕</button></div>
            {[["Name","name","My App"],["URL","url","github.com/user/app"]].map(([l,f,ph])=>(
              <div key={f} className="mb-2"><label className="block text-xs text-gray-400 mb-0.5">{l}</label><input value={p[f]} placeholder={ph} onChange={e=>updP(p.id,f,e.target.value)} className="w-full border border-gray-100 rounded-xl px-2 py-1.5 text-xs bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-200" /></div>
            ))}
            <label className="block text-xs text-gray-400 mb-0.5">Description</label>
            <textarea rows={2} value={p.description} onChange={e=>updP(p.id,"description",e.target.value)} className="w-full border border-gray-100 rounded-xl px-2 py-1.5 text-xs bg-gray-50 focus:outline-none resize-none" />
          </div>
        ))}
        <button onClick={addP} className="w-full py-2 border-2 border-dashed border-gray-200 text-gray-400 rounded-2xl text-xs hover:bg-gray-50 transition">+ Add Project</button>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Certifications</h3>
        {resume.certifications.map((c,i)=>(
          <div key={c.id} className="mb-3 p-3 border border-gray-200 rounded-2xl bg-white shadow-sm">
            <div className="flex justify-between mb-2"><span className="text-xs text-gray-400">#{i+1}</span><button onClick={()=>delC(c.id)} className="text-red-400 text-xs">✕</button></div>
            <div className="grid grid-cols-2 gap-2">
              {[["Name","name","AWS Solutions Architect"],["Issuer","issuer","Amazon"],["Year","year","2024"]].map(([l,f,ph])=>(
                <div key={f} className={f==="name"?"col-span-2":""}>
                  <label className="block text-xs text-gray-400 mb-0.5">{l}</label>
                  <input value={c[f]} placeholder={ph} onChange={e=>updC(c.id,f,e.target.value)} className="w-full border border-gray-100 rounded-xl px-2 py-1.5 text-xs bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-200" />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button onClick={addC} className="w-full py-2 border-2 border-dashed border-gray-200 text-gray-400 rounded-2xl text-xs hover:bg-gray-50 transition">+ Add Certification</button>
      </div>
    </div>
  );
}