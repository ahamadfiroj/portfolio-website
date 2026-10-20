import { Check } from "lucide-react";
import { roleFit, workProcess } from "@/lib/data";

// Top rule colour per role, matching the depth palette used elsewhere.
const accent = ["bg-marigold", "bg-cobalt-tint", "bg-cobalt"];

export default function RoleFit() {
  return (
    <section id="roles" className="border-y border-line bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-page px-4 sm:px-6">
        <h2 className="max-w-2xl font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl sm:leading-[1.08]">
          Where I fit on your team
        </h2>
        <p className="mt-4 max-w-xl text-lg text-muted">
          Three roles, one way of working: understand the problem, write it down, then ship it.
        </p>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {roleFit.map((r, i) => (
            <article key={r.role} className="relative flex flex-col overflow-hidden rounded-2xl border border-line bg-fog/60 p-6 sm:p-7">
              <span className={`absolute inset-x-0 top-0 h-1.5 ${accent[i]}`} aria-hidden />
              <h3 className="font-display text-2xl font-bold leading-tight text-ink">{r.role}</h3>
              <p className="mt-3 text-base leading-relaxed text-ink">{r.pitch}</p>
              <ul className="mt-5 space-y-2.5">
                {r.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-[15px] text-ink">
                    <Check size={18} className="mt-0.5 shrink-0 text-cobalt" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-line pt-5 text-[15px] leading-relaxed text-muted">
                <span className="font-semibold text-ink">Proof: </span>
                {r.proof}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-20">
          <h3 className="font-display text-2xl font-bold text-ink sm:text-3xl">How I work with a customer</h3>
          <ol className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {workProcess.map((s, i) => (
              <li key={s.step} className="bg-paper p-6 sm:last:col-span-2 lg:last:col-span-1">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-display text-sm font-bold text-white">
                  {i + 1}
                </span>
                <p className="mt-4 font-display text-lg font-bold text-ink">{s.step}</p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{s.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
