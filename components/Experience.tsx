import { education, experience } from "@/lib/data";

export default function Experience() {
  return (
    <section id="experience" className="border-t border-line bg-paper py-20 sm:py-28">
      <div className="mx-auto grid max-w-page gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_18rem]">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">Experience</h2>

          <ol className="mt-10 border-l-2 border-line">
            {experience.map((job, i) => (
              <li key={`${job.company}-${job.title}`} className="relative pb-10 pl-7 last:pb-0">
                <span
                  className={`absolute -left-[7px] top-2 h-3 w-3 rounded-full ${
                    i === 0 ? "bg-marigold" : "bg-cobalt"
                  }`}
                  aria-hidden
                />
                <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
                  {job.period.includes("present") && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">Current</span>
                  )}
                  {job.period}, {job.location}
                </p>
                <h3 className="mt-1.5 font-display text-xl font-bold text-ink sm:text-2xl">
                  {job.title} <span className="font-semibold text-muted">at {job.company}</span>
                </h3>
                <p className="mt-2 max-w-2xl text-base text-ink">{job.description}</p>
                {job.achievements.length > 0 && (
                  <ul className="mt-3 max-w-2xl space-y-2">
                    {job.achievements.map((a) => (
                      <li key={a} className="relative pl-4 text-[15px] leading-relaxed text-muted">
                        <span className="absolute left-0 top-[0.65em] h-1 w-1.5 rounded-full bg-ink/50" aria-hidden />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>

        <aside className="h-fit rounded-2xl border border-line bg-fog/60 p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-bold text-ink">Education</h2>
          <ul className="mt-5 space-y-5">
            {education.map((e) => (
              <li key={e.degree}>
                <p className="font-medium text-ink">{e.degree}</p>
                <p className="text-[15px] text-muted">
                  {e.institution}, {e.year}
                </p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
