import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import ClientWidgets from "@/components/ClientWidgets";
import { personalInfo } from "@/lib/data";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const title = "Firoj Ahamad | Forward Deployed, Full-stack & Frontend Engineer";
const description =
  "Frontend-heavy full-stack engineer with 5 years of React and Next.js. Built GramKick end to end: four web portals, an Express API on MongoDB and Redis, and the Docker and Cloud Run deploy. Works AI-first with Claude Code, Cursor, ChatGPT, Gemini CLI and Antigravity. Open to full-time, hybrid, remote and freelance roles.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Firoj Ahamad",
    "Forward Deployed Engineer",
    "Full-stack Engineer",
    "Frontend Engineer",
    "AI-native engineer",
    "Claude Code",
    "Cursor",
    "LLM integration",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Freelance React developer",
    "Gurugram",
  ],
  authors: [{ name: "Firoj Ahamad", url: "https://github.com/ahamadfiroj" }],
  creator: "Firoj Ahamad",
  publisher: "Firoj Ahamad",
  metadataBase: new URL("https://portfolio-website-1dpz.vercel.app"),
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: "/apple-icon",
  },
  openGraph: { title, description, type: "profile" },
  twitter: { card: "summary", title, description },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: personalInfo.name,
  jobTitle: "Forward Deployed / Full-stack Engineer",
  email: `mailto:${personalInfo.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Gurugram", addressCountry: "IN" },
  sameAs: [personalInfo.github, personalInfo.linkedin],
  knowsAbout: ["React", "Next.js", "TypeScript", "Node.js", "Express", "MongoDB", "Redis", "Docker", "Google Cloud Run"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
        <ClientWidgets />
      </body>
    </html>
  );
}
