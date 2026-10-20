import { personalInfo } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-ink pb-28 text-white/60 sm:pb-10">
      <div className="mx-auto flex max-w-page flex-col gap-2 border-t border-white/15 px-4 pt-8 text-sm sm:flex-row sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} {personalInfo.name}, {personalInfo.location}
        </p>
        <p>Built with Next.js, Tailwind CSS and MongoDB.</p>
      </div>
    </footer>
  );
}
