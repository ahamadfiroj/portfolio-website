# Firoj Ahamad: Portfolio

Designed, built and maintained by **Firoj Ahamad**. Personal portfolio for Firoj Ahamad, a Forward Deployed, Full-stack and Frontend Engineer based in Gurugram, India. Open to full-time, hybrid, remote and freelance work.

**Live site:** https://portfolio-website-1dpz.vercel.app

It's aimed at hiring managers, recruiters and startup founders, and answers three questions quickly:

1. **What roles?** Forward Deployed Engineer, Full-stack Engineer, Frontend Engineer.
2. **What can he do?** Heavy frontend (5 years of React, Next.js and TypeScript), working backend (Node.js, Express, MongoDB, Redis), basics of testing and DevOps (node:test, Docker, GitHub Actions, Cloud Run), and an AI-native workflow (Claude Code, Cursor, ChatGPT, Gemini CLI, Antigravity).
3. **Where's the proof?** [GramKick](https://www.gramkick.com/), a kirana delivery marketplace built solo end to end, plus product work at FabHotels and TravelPlusApp.

## What's on the page

| Section | Purpose |
|---|---|
| Hero | Headline, target roles, availability, resume download, AI tools, and a diagram of the GramKick stack showing ownership depth |
| AI-native engineering | Tools used daily, how AI output is kept production-grade, and the AI assistant shipped in GramKick |
| Where I fit | One panel per role with proof, plus a 5-step "how I work with a customer" process |
| GramKick case study | Frontend, backend, testing and DevOps work on a product built by one engineer |
| Products | FabHotels, TravelPlusApp and internal operations tools |
| Skills | Grouped by depth: Deep, Working, Basics, AI and workflow |
| Experience | Timeline plus education |
| Contact | Form with engagement type (full-time, hybrid, remote, freelance), saved to MongoDB and emailed via Resend |

Site-wide extras: a live chat widget (visitor ↔ admin), a WhatsApp button, and a password-protected admin panel at `/admin` for replying to chats.

## Tech stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 3.4 with custom design tokens, Bricolage Grotesque and IBM Plex Sans via `next/font`
- **Backend:** Next.js route handlers, MongoDB (native driver), Resend for email
- **Auth (admin):** JWT with `jose`, bcrypt-hashed passwords, OTP password reset
- **Server:** custom `server.js` running Next.js and Socket.io on one port

## Getting started

Requires Node.js 18+.

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev                  # runs server.js on http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build
npm start        # production server (server.js with NODE_ENV=production)
npm run lint     # ESLint
```

If the browser shows `ChunkLoadError` in development, stop the server, run `rm -rf .next`, and start it again. Never run two dev servers against the same folder at once.

## Environment variables

| Variable | Needed for |
|---|---|
| `MONGODB_URI` | Contact form, chat, admin users (required) |
| `JWT_SECRET` | Admin login. Always set in production. |
| `RESEND_API_KEY` | All outgoing email |
| `ADMIN_EMAIL`, `EMAIL_USER` | Who receives contact and chat notifications |
| `NEXT_PUBLIC_SITE_URL` | Socket.io CORS origin in production |
| `REDIS_URL` | Only for the experimental `/chat` Redis demo |
| `PORT` | Server port (default 3000) |

`.env.example` doesn't list all of these yet.

## Editing content

**All text lives in `lib/data.ts`.** Components only render it, so you rarely need to touch them.

| Export | Controls |
|---|---|
| `personalInfo` | Name, title, email, phone, links, resume URL |
| `hero`, `availability` | Headline, intro, proof bar, roles and engagement types |
| `ai` | AI tools, practices, and the shipped AI feature |
| `roleFit`, `workProcess` | "Where I fit" panels and the 5-step process |
| `gramkickStack`, `gramkick` | Hero diagram and the case study |
| `projects`, `skillTiers`, `experience`, `education` | The remaining sections |

Design tokens (colours, fonts, page width) are in `tailwind.config.js`. The site is light-only. The only page-load motion is the hero diagram reveal, which is pure CSS and respects reduced-motion settings.

## Project structure

```
app/
  page.tsx              home page: assembles the sections
  layout.tsx            fonts, SEO metadata, JSON-LD, chat + WhatsApp widgets
  admin/                admin login, password reset, chat inbox
  api/                  contact, chat, admin auth, resume upload
components/
  Navbar, Hero, AiWorkflow, RoleFit, CaseStudy,
  Projects, Skills, Experience, Contact, Footer
  ChatWidget, ChatMessages, WhatsAppButton      site-wide widgets
lib/
  data.ts               all portfolio content
  mongodb.ts, email*.ts, notifications.ts, otp.ts
models/                 Chat, User, PasswordReset types
server.js               Next.js + Socket.io server
```

## Deployment

- **Vercel:** works, but `server.js` doesn't run there, so chat updates by polling every 5 seconds.
- **Railway or any Node host:** run `npm run build && npm start` to use the custom server.

## Contact

- Email: famd786@gmail.com
- LinkedIn: https://www.linkedin.com/in/firoj-ahamad-90921b114/
- GitHub: https://github.com/ahamadfiroj
