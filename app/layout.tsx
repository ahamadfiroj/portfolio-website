import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Firoj Ahamad - Senior Frontend Developer Portfolio",
  description: "Professional portfolio of Firoj Ahamad showcasing 4+ years of experience transforming Figma designs into interactive web applications using React, Next.js, TypeScript, and comprehensive testing expertise",
  keywords: ["Firoj Ahamad", "Frontend Developer", "React", "Next.js", "TypeScript", "Figma to Code", "Manual Testing", "Portfolio", "Web Developer"],
  authors: [{ name: "Firoj Ahamad" }],
  metadataBase: new URL('https://portfolio-website-1dpz.vercel.app'),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon', type: 'image/png' }
    ],
    shortcut: '/favicon.svg',
    apple: '/apple-icon',
  },
  openGraph: {
    title: "Firoj Ahamad - Senior Frontend Developer Portfolio",
    description: "Professional portfolio showcasing expertise in React, Next.js, TypeScript, Figma to code conversion, and manual testing",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-icon" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className="antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
