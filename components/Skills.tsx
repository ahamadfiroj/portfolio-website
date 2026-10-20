import { skillTiers } from "@/lib/data";

// Visual weight follows depth: deep is solid, basics is outlined.
const chip = [
  "bg-cobalt text-white",
  "bg-cobalt-tint text-ink",
  "border border-dashed border-ink/40 bg-paper text-ink",
  "border border-line bg-paper text-ink",
];

// How many of the three meter bars are filled for each tier.
const meter = [3, 2, 1, 0];

export default function Skills() {
  return (
    <section id="skills" className="py-20 sm:py-28">
      <div className="mx-auto max-w-page px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
          Skills, sorted by how deep they go
        </h2>
        <p className="mt-4 max-w-xl text-lg text-muted">
          Heavy on the frontend, solid on the backend, and enough testing and DevOps to ship on my own.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {skillTiers.map((t, i) => (
            <div key={t.tier} className="rounded-2xl border border-line bg-paper p-6 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-display text-2xl font-bold text-ink">{t.tier}</h3>
                {meter[i] > 0 && (
                  <span className="flex gap-1" role="img" aria-label={`Depth ${meter[i]} of 3`}>
                    {[0, 1, 2].map((b) => (
                      <span key={b} className={`h-2 w-6 rounded-full ${b < meter[i] ? "bg-cobalt" : "bg-line"}`} />
                    ))}
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-[15px] text-muted">{t.blurb}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {t.items.map((s) => (
                  <li key={s} className={`rounded-lg px-3 py-1.5 text-[15px] font-medium ${chip[i] ?? chip[3]}`}>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
