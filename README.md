# 📄 Resume88 — Free Resume Builder

> **Build a professional resume in minutes. No login. No signup. No credit card. Ever.**

🌐 **Live App:** [resume88.com](https://www.resume88.com)

![Resume88](https://img.shields.io/badge/Resume88-Free%20%26%20Open%20Source-blue?style=flat-square)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat-square&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Free-3ECF8E?style=flat-square&logo=supabase)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)

---

## ✨ Features

- 🎯 **Two modes** — Guided step-by-step wizard or full manual editor
- 🎨 **6 professional templates** — Classic, Sidebar, Modern, Minimal, Corporate, Creative
- 🌈 **8 color themes** — Blue, Violet, Teal, Rose, Orange, Slate, Emerald, Indigo
- 📷 **Profile photo upload** — shown in supported templates
- 📊 **Resume completeness score** — live feedback as you build
- 🌐 **Multi-language UI** — auto-detects English, French, Spanish, Arabic, German, Chinese, Portuguese
- ⬇️ **PDF export** — clean A4 layout, print-ready
- 💾 **Auto-save** — progress saved to localStorage, never lost
- 📱 **Fully responsive** — works on mobile, tablet, and desktop
- 🔒 **100% private** — no data sent to any server, everything stays in your browser

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- npm v9 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Salehro/resume88.git
cd resume88

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
```

### Configure Environment Variables

Open `.env` and fill in your values:

```env
REACT_APP_ADMIN_PASSWORD=your_admin_password
REACT_APP_WEB3FORMS_KEY=your_web3forms_key
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_KEY=your_supabase_anon_key
```

| Variable | Where to get it |
|---|---|
| `REACT_APP_ADMIN_PASSWORD` | Choose any strong password |
| `REACT_APP_WEB3FORMS_KEY` | Free at [web3forms.com](https://web3forms.com) |
| `REACT_APP_SUPABASE_URL` | Supabase project → Settings → API |
| `REACT_APP_SUPABASE_KEY` | Supabase project → Settings → API (anon key) |

### Run Locally

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser. ✅

---

## 🗄️ Supabase Setup

Resume88 uses Supabase to power the admin analytics dashboard.

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **SQL Editor** and run:

```sql
CREATE TABLE events (
  id bigint generated always as identity primary key,
  type text not null,
  template text,
  color text,
  created_at timestamptz default now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert"
  ON events FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public select"
  ON events FOR SELECT TO anon
  USING (true);
```

4. Copy your **Project URL** and **anon key** into your `.env` file

---

## 📊 Admin Dashboard

Access your private analytics dashboard by clicking the subtle **⚙** icon at the bottom of the home screen and entering your admin password.

The dashboard shows:
- 👁 Total views, builds, and PDF downloads
- 📈 7-day activity chart
- 🎨 Most used templates and color themes
- 🕐 Real-time activity feed
- 📊 Conversion rates (visitors → builders → downloaders)

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

```bash
# Build the production app
npm run build
```

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import your repository
3. Add your environment variables in **Settings → Environment Variables**
4. Deploy — your app is live in 60 seconds ✅

### Environment Variables in Vercel

Add all four variables from your `.env` file in:
`Vercel Project → Settings → Environment Variables`

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev) | UI framework |
| [Tailwind CSS 3](https://tailwindcss.com) | Styling |
| [Supabase](https://supabase.com) | Analytics database |
| [Web3Forms](https://web3forms.com) | Contact form (no backend) |
| [Vercel](https://vercel.com) | Hosting & deployment |

---

## 📁 Project Structure

```
resume88/
├── public/
│   ├── index.html        # SEO meta tags, structured data
│   ├── robots.txt        # Search engine crawling rules
│   ├── sitemap.xml       # Google sitemap
│   └── manifest.json     # PWA manifest
├── src/
│   ├── App.js            # Main application (all components)
│   ├── supabase.js       # Supabase client + trackEvent helper
│   ├── index.js          # React entry point
│   └── index.css         # Tailwind imports
├── .env                  # Secret keys (never committed)
├── .env.example          # Template for env variables
└── .gitignore            # Protects .env from being pushed
```

---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# 1. Fork the repo
# 2. Create your branch
git checkout -b feature/amazing-feature

# 3. Commit your changes
git commit -m "Add amazing feature"

# 4. Push to your branch
git push origin feature/amazing-feature

# 5. Open a Pull Request on GitHub
```

---

## 📬 Contact

Built by **Guidjedj Saleh**

- 🐙 GitHub: [@Salehro](https://github.com/Salehro)
- 🌐 App: [resume88.com](https://www.resume88.com)
- 💬 Use the contact form on the app homepage

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

```
MIT License — free to use, modify, and distribute.
Just keep the credit. 🙏
```

---

<p align="center">Made with ❤️ by Guidjedj Saleh · <a href="https://www.resume88.com">resume88.com</a></p>