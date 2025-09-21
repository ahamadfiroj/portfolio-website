import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Firoj Ahamad - Senior Frontend Developer Portfolio",
  description: "Professional portfolio of Firoj Ahamad showcasing 4+ years of experience transforming Figma designs into interactive web applications using React, Next.js, TypeScript, and comprehensive testing expertise",
  keywords: ["Firoj Ahamad", "Frontend Developer", "React", "Next.js", "TypeScript", "Figma to Code", "Manual Testing", "Portfolio", "Web Developer"],
  authors: [{ name: "Firoj Ahamad" }],
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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
