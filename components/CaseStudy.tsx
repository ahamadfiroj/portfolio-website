import { ExternalLink } from "lucide-react";
import { gramkick } from "@/lib/data";

const depthTag = {
  deep: "bg-cobalt text-white",
  working: "bg-cobalt-tint text-ink",
  basics: "border border-dashed border-ink/40 text-ink",
} as const;

export default function CaseStudy() {
  return (
    <section id="gramkick" className="py-20 sm:py-28">
      <div className="mx-auto max-w-page px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:items-end">
          <div>
            <p className="text-base font-medium text-cobalt">Case study, {gramkick.period}</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.025em] text-ink sm:text-6xl">
              GramKick, built by one engineer
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{gramkick.summary}</p>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink">{gramkick.ownership}</p>
          </div>

          <div className="rounded-2xl bg-ink p-6 text-white">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-5">
              <div>
                <dt className="text-sm text-white/70">Portals</dt>
                <dd className="font-display text-3xl font-bold">4</dd>
              </div>
              <div>
                <dt className="text-sm text-white/70">APIs merged</dt>
                <dd className="font-display text-3xl font-bold">5 → 1</dd>
              </div>
              <div>
                <dt className="text-sm text-white/70">Test suites</dt>
                <dd className="font-display text-3xl font-bold">13</dd>
              </div>
              <div>
                <dt className="text-sm text-white/70">Engineers</dt>
                <dd className="font-display text-3xl font-bold">1</dd>
              </div>
            </dl>
            <a
              href={gramkick.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-marigold px-5 py-3 font-medium text-ink transition-colors hover:bg-white"
            >
              Visit gramkick.com <ExternalLink size={16} aria-hidden />
            </a>
          </div>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {gramkick.layers.map((layer) => (
            <div key={layer.title} className="bg-paper p-6 sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-2xl font-bold text-ink">{layer.title}</h3>
                <span className={`rounded px-2 py-0.5 text-[13px] font-medium capitalize ${depthTag[layer.depth]}`}>
                  {layer.depth}
                </span>
              </div>
              <ul className="mt-5 space-y-3">
                {layer.points.map((p) => (
                  <li key={p} className="relative pl-5 text-[15px] leading-relaxed text-ink">
                    <span className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-marigold" aria-hidden />
                    {p}
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
