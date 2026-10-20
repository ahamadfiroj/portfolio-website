import { ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/data";

export default function Projects() {
  return (
    <section id="work" className="border-t border-line bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-page px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
          Products I&apos;ve worked on
        </h2>
        <p className="mt-4 max-w-xl text-lg text-muted">
          Built and maintained on the FabHotels engineering team.
        </p>

        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => {
            const Tag = p.liveUrl ? "a" : "div";
            return (
              <li key={p.id} className="md:last:col-span-2 lg:last:col-span-1">
                <Tag
                  {...(p.liveUrl ? { href: p.liveUrl, target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`group flex h-full flex-col rounded-2xl border border-line bg-fog/60 p-6 sm:p-7 ${
                    p.liveUrl ? "transition-colors hover:border-ink/40 hover:bg-paper" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-cobalt">{p.kind}</p>
                      <h3 className="mt-1 font-display text-2xl font-bold text-ink">{p.title}</h3>
                    </div>
                    {p.liveUrl && (
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-ink transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-white">
                        <ArrowUpRight size={18} aria-label="Opens the live site in a new tab" />
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-base leading-relaxed text-ink">{p.description}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.impact}</p>
                  <ul className="mt-auto flex flex-wrap gap-1.5 pt-6" aria-label={`${p.title} stack`}>
                    {p.technologies.map((t) => (
                      <li key={t} className="rounded-md border border-line bg-paper px-2.5 py-1 text-[13px] text-muted">
                        {t}
                      </li>
                    ))}
                  </ul>
                </Tag>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
