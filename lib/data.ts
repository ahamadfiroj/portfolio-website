// All portfolio content lives here. Components only render it.

export const personalInfo = {
  name: "Firoj Ahamad",
  title: "Forward Deployed, Full-stack & Frontend Engineer",
  email: "famd786@gmail.com",
  phone: "+919005214654",
  location: "Gurugram, India",
  github: "https://github.com/ahamadfiroj",
  linkedin: "https://www.linkedin.com/in/firoj-ahamad-90921b114/",
  bio: "Forward Deployed, Full-stack and Frontend Engineer. Five years shipping React and Next.js products at FabHotels, and sole engineer on GramKick, from the UI to the Node.js API to the Cloud Run deploy.",
  resumeUrl: "https://drive.google.com/uc?export=download&id=1zS_g5f5KWZwxQYRNhTv07wi0AkoedidD",
};

// How people can hire me. Shown in the hero and the contact form.
export const availability = {
  roles: ["Forward Deployed Engineer", "Full-stack Engineer", "Frontend Engineer"],
  engagements: ["Full-time", "Hybrid", "Remote", "Freelance or contract"],
  note: "Based in Gurugram. Happy to work on-site in Delhi NCR, hybrid, or remote across time zones.",
};

export const hero = {
  badge: "Available for full-time, hybrid, remote and freelance work",
  headline: "I turn real customer problems into shipped software.",
  intro:
    "I work close to the people using the product, write a clear plan, then build it across the stack: React and Next.js interfaces, Node.js APIs on MongoDB and Redis, and Docker deploys to Cloud Run.",
  proof: [
    { value: "5 yrs", label: "shipping production web apps" },
    { value: "15–20%", label: "more bookings at FabHotels" },
    { value: "4 portals", label: "built solo for GramKick" },
    { value: "5 → 1", label: "APIs merged, no contract broken" },
  ],
};

// AI experience, shown in the hero and in its own section right after it.
export const ai = {
  heading: "I build with AI agents every day, and I ship AI features.",
  intro:
    "AI coding agents are part of how I plan, build and review. I give them real project context, check every change they make, and gate it with types, lint and tests, so the speed doesn't cost quality.",
  tools: [
    { name: "Claude Code", use: "Agentic coding in the terminal: plans, multi-file refactors, CLAUDE.md project memory and custom skills." },
    { name: "Cursor", use: "Daily editor: inline edits, codebase chat and fast UI iteration." },
    { name: "ChatGPT", use: "Research, debugging partner, and first drafts of specs and docs." },
    { name: "Gemini CLI", use: "Second-opinion reviews and large-context questions across a codebase." },
    { name: "Antigravity", use: "Agent-first IDE for running tasks in parallel and checking UI changes in the browser." },
  ],
  practices: [
    "Project context files (CLAUDE.md, AGENTS.md) so agents follow the codebase's rules",
    "Written plan before any large change, reviewed by me first",
    "Every AI diff read line by line before it ships",
    "Type checks, lint and tests as the gate, not trust",
  ],
  shipped: {
    title: "AI I've shipped",
    detail:
      "A support assistant inside the GramKick merchant and dealer portals. It's read-only, rate-limited per merchant, and guarded against prompt injection and secret leaks.",
  },
};

// "Where I fit": one panel per role, with what a team gets and the proof.
export const roleFit = [
  {
    role: "Forward Deployed Engineer",
    pitch: "I work with the customer, turn a messy workflow into a written plan, then ship it myself.",
    points: ["Discovery calls and on-site work", "AI-assisted prototypes in days, not weeks", "Fast fixes after go-live"],
    proof: "GramKick: wrote specs for wallet payments, WhatsApp OTP login and the Cloud Run move, then built all three.",
  },
  {
    role: "Full-stack Engineer",
    pitch: "Strong frontend, working Node.js backend. I own a feature from the database to the deploy.",
    points: ["REST APIs in Express", "MongoDB and Redis data models", "Docker and CI/CD pipelines"],
    proof: "Merged five separate GramKick APIs into one Express service without changing a single route or response.",
  },
  {
    role: "Frontend Engineer",
    pitch: "Five years of React in production. Fast, accessible UI and component libraries teams reuse.",
    points: ["React, Next.js and TypeScript", "Redux Toolkit and Saga", "Design systems in Storybook"],
    proof: "At FabHotels, moved a React 16 codebase to React 18 with TypeScript; bookings rose 15–20%.",
  },
];

// How I run an engagement. This is a real sequence, so it's numbered.
export const workProcess = [
  { step: "Listen", detail: "Sit with the users, watch the workflow, collect the pain points." },
  { step: "Write it down", detail: "A short spec with scope, data model and rollout plan, reviewed before code." },
  { step: "Build", detail: "Ship in small slices across UI, API and data, demoed every few days." },
  { step: "Deploy", detail: "Docker, CI/CD and health checks, so releases are routine." },
  { step: "Stay on", detail: "Watch errors and feedback, fix fast, and hand over clean docs." },
];

// The hero diagram. depth: deep | working | basics
export const gramkickStack = [
  { layer: "Portals", detail: "Customer, merchant, dealer and admin", depth: "deep" },
  { layer: "Web app", detail: "Next.js 16, React 19, Redux Toolkit, Tailwind, own UI kit", depth: "deep" },
  { layer: "API", detail: "Express 5, five services in one deploy, OTP auth, UPI payments", depth: "working" },
  { layer: "Data", detail: "MongoDB, Redis for caching, rate limits and idempotency", depth: "working" },
  { layer: "Tests", detail: "node:test suites per service, lint and type checks", depth: "basics" },
  { layer: "Deploy", detail: "Docker, GitHub Actions, Google Cloud Run, Render", depth: "basics" },
] as const;

export const gramkick = {
  name: "GramKick",
  url: "https://www.gramkick.com/",
  period: "2026 – present",
  summary:
    "A marketplace that lets shoppers buy from nearby kirana stores with live stock and quick local delivery, and gives store owners and wholesale dealers a digital catalogue, orders and payments in one place.",
  ownership: "I own it end to end: product scoping, UI, API, data model, tests and deploys.",
  layers: [
    {
      title: "Frontend",
      depth: "deep",
      points: [
        "Four role-based portals in one Next.js 16 app: customer, merchant, dealer and admin",
        "Own component library (@gramkick/ui) and an i18n package with a build-time check for missing translations",
        "In-browser barcode scanning for in-store billing, PDF invoices, virtualised long lists",
        "SEO basics done properly: sitemap, robots, web manifest, per-page metadata",
      ],
    },
    {
      title: "Backend",
      depth: "working",
      points: [
        "Express 5 service that combines the core, merchant, customer, dealer and admin APIs on one port",
        "OTP login, UPI QR codes and pay links, PhonePe subscriptions, WhatsApp order alerts",
        "Redis for caching, rate limiting and idempotent order writes",
        "AI support assistant: read-only, rate-limited, with prompt-injection guardrails",
        "Bulk catalogue import from Excel and Cloudinary image storage",
      ],
    },
    {
      title: "Testing",
      depth: "basics",
      points: [
        "13 node:test suites covering each service",
        "ESLint and TypeScript type checks run before every build",
      ],
    },
    {
      title: "DevOps",
      depth: "basics",
      points: [
        "Multi-stage Docker image, deployed to Google Cloud Run through GitHub Actions",
        "Render Blueprints, health checks that ping MongoDB and Redis, graceful shutdown",
      ],
    },
  ],
} as const;

export const skillTiers = [
  {
    tier: "Deep",
    blurb: "Used daily for five years in production.",
    items: ["React", "Next.js", "TypeScript", "JavaScript", "Redux Toolkit", "Redux Saga", "Tailwind CSS", "Styled Components", "HTML and CSS", "Storybook", "Micro frontends", "Web performance"],
  },
  {
    tier: "Working",
    blurb: "I ship features with these and own them in production.",
    items: ["Node.js", "Express", "REST API design", "MongoDB", "Redis", "Auth and OTP flows", "Payment integrations", "Sentry"],
  },
  {
    tier: "Basics",
    blurb: "I can set these up, keep them running and fix them.",
    items: ["node:test", "Manual and regression testing", "Docker", "GitHub Actions", "Jenkins", "Google Cloud Run", "AWS", "Render"],
  },
  {
    tier: "AI and workflow",
    blurb: "AI agents and habits that speed up delivery.",
    items: ["Claude Code", "Cursor", "ChatGPT", "Gemini CLI", "Antigravity", "LLM API integration", "Prompt design and guardrails", "Written specs before code", "Figma to code", "Git", "Postman"],
  },
];

export const projects = [
  {
    id: 1,
    title: "FabHotels",
    kind: "B2C hotel booking",
    description: "Hotel booking for travellers across Indian and international cities.",
    impact: "Booking flows on Next.js with server rendering for SEO, built as micro frontends.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Micro frontends", "Sentry"],
    liveUrl: "https://www.fabhotels.com/",
  },
  {
    id: 2,
    title: "TravelPlusApp",
    kind: "B2B corporate travel",
    description: "Corporate travel and expense platform for hotel, flight, bus, cab and train bookings.",
    impact: "Employee trip app and admin approval app joined through a micro frontend setup.",
    technologies: ["React", "TypeScript", "Redux Saga", "Styled Components", "Node.js", "Storybook"],
    liveUrl: "https://www.travelplusapp.com/",
  },
  {
    id: 3,
    title: "Internal operations tools",
    kind: "Admin portals",
    description: "Eight-plus admin portals for hotel settlements, invoices, sales onboarding and corporate bookings.",
    impact: "Role-based access, invoice and voucher email templates, hotelier payouts.",
    technologies: ["React", "TypeScript", "Redux", "Node.js", "Role management"],
    liveUrl: undefined,
  },
];

export const experience = [
  {
    title: "Full-stack Engineer, sole owner",
    company: "GramKick",
    period: "2026 – present",
    location: "Remote",
    description: "Building a kirana delivery marketplace alone, from product plan to production.",
    achievements: [
      "Shipped four web portals, a consolidated Express API, and Cloud Run deploys",
      "Built a guarded AI support assistant for merchants and dealers",
      "Wrote design specs for payments, login and infrastructure moves before building them",
    ],
  },
  {
    title: "Senior Software Engineer, Frontend",
    company: "FabHotels",
    period: "Apr 2022 – present",
    location: "Gurugram",
    description: "Lead frontend for the hotel, operations and B2C teams.",
    achievements: [
      "Raised bookings by 15–20% and user satisfaction by 12–16% with faster, clearer booking UI",
      "Moved a React 16 JavaScript codebase to React 18, TypeScript, Redux Toolkit and Redux Saga",
      "Built a Storybook component library shared across teams",
      "Brought Cursor and Claude Code into daily work to speed up delivery and cut tech debt",
      "Wrote Node.js and Express middleware for API proxying, logging and safe error handling",
      "Set up CI/CD with Jenkins on GCP and AWS",
    ],
  },
  {
    title: "Frontend Engineer, intern",
    company: "FabHotels",
    period: "Oct 2021 – Apr 2022",
    location: "Gurugram",
    description: "Learned production React on real features, bug fixes and code reviews.",
    achievements: [],
  },
  {
    title: "Subject Matter Expert, freelance",
    company: "Chegg India",
    period: "Jul 2018 – Oct 2021",
    location: "Delhi",
    description: "Solved engineering problems for students worldwide, then moved into frontend development.",
    achievements: [],
  },
];

export const education = [
  { degree: "M.Tech", institution: "Jamia Millia Islamia, New Delhi", year: "2020" },
  { degree: "B.Tech", institution: "AKTU, Lucknow", year: "2017" },
];
