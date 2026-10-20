import { Mail, Download, Sparkles } from "lucide-react";
import { ai, availability, gramkickStack, hero, personalInfo } from "@/lib/data";

// Fill strength encodes how deep my ownership goes at each layer.
const depthStyle = {
  deep: "bg-cobalt text-white border-cobalt",
  working: "bg-cobalt-tint text-ink border-cobalt/30",
  basics: "bg-paper text-ink border-dashed border-ink/40",
} as const;

const depthLabel = { deep: "Deep", working: "Working", basics: "Basics" } as const;

export default function Hero() {
  return (
    <section id="top" className="relative pt-28 sm:pt-32">

      <div className="mx-auto grid max-w-page gap-14 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5 text-sm text-ink">
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {hero.badge}
          </p>

          <h1 className="font-display text-[2.5rem] font-extrabold leading-[1.03] tracking-[-0.03em] text-ink sm:text-[3.4rem] lg:text-[4rem]">
            {hero.headline}
          </h1>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Roles I'm looking for">
            {availability.roles.map((r, i) => (
              <li
                key={r}
                className={`rounded-full px-3.5 py-1.5 text-[15px] font-semibold ${
                  i === 0 ? "bg-ink text-white" : "border border-ink/25 bg-paper text-ink"
                }`}
              >
                {r}
              </li>
            ))}
          </ul>

          <p className="mt-6 max-w-[36rem] text-lg leading-relaxed text-muted">
            I&apos;m {personalInfo.name}. {hero.intro}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-cobalt px-6 py-3 font-medium text-white shadow-[0_8px_24px_-8px_rgba(37,71,208,0.6)] transition-colors hover:bg-cobalt-deep"
            >
              <Mail size={18} aria-hidden /> Get in touch
            </a>
            <a
              href={personalInfo.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-paper px-6 py-3 font-medium text-ink transition-colors hover:border-ink"
            >
              <Download size={18} aria-hidden /> Download resume
            </a>
          </div>

          <a href="#ai" className="group mt-8 block max-w-[36rem] rounded-xl border border-line bg-paper p-4 transition-colors hover:border-ink/40">
            <span className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Sparkles size={16} className="text-marigold" aria-hidden />
              AI-native workflow
              <span className="ml-auto text-sm font-medium text-cobalt group-hover:underline">See how I use AI</span>
            </span>
            <span className="mt-3 flex flex-wrap gap-1.5">
              {ai.tools.map((t) => (
                <span key={t.name} className="rounded-md bg-ink px-2.5 py-1 text-[13px] font-medium text-white">
                  {t.name}
                </span>
              ))}
            </span>
          </a>
        </div>

        <figure className="rounded-2xl border border-line bg-paper p-5 shadow-[0_24px_60px_-30px_rgba(19,32,58,0.35)] sm:p-7">
          <figcaption className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
            <span className="font-display text-lg font-bold text-ink">What I own at GramKick</span>
            <a href="#gramkick" className="text-sm font-medium text-cobalt hover:underline">
              Read the case study
            </a>
          </figcaption>

          <ol className="space-y-2">
            {gramkickStack.map((row, i) => (
              <li
                key={row.layer}
                style={{ animationDelay: `${250 + i * 90}ms` }}
                className={`stack-row grid grid-cols-[5.5rem_1fr] items-center gap-3 rounded-lg border px-4 py-3 ${depthStyle[row.depth]}`}
              >
                <span className="font-display text-[15px] font-bold">{row.layer}</span>
                <span className="text-[13px] leading-snug opacity-90">{row.detail}</span>
              </li>
            ))}
          </ol>

          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-muted" aria-label="Legend: how deep my ownership goes">
            {(Object.keys(depthLabel) as Array<keyof typeof depthLabel>).map((d) => (
              <li key={d} className="flex items-center gap-2">
                <span className={`h-3 w-5 rounded-sm border ${depthStyle[d]}`} aria-hidden />
                {depthLabel[d]}
              </li>
            ))}
          </ul>
        </figure>
      </div>

      {/* Proof bar: the four facts a recruiter scans for first. */}
      <div className="mx-auto mt-16 max-w-page px-4 pb-16 sm:px-6 sm:pb-20">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
          {hero.proof.map((p) => (
            <div key={p.label} className="flex flex-col-reverse bg-paper px-5 py-5 sm:px-7 sm:py-6">
              <dt className="mt-1 text-sm text-muted">{p.label}</dt>
              <dd className="font-display text-2xl font-bold text-ink sm:text-3xl">{p.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
