import { Bot, ShieldCheck, Sparkles } from "lucide-react";
import { ai } from "@/lib/data";

export default function AiWorkflow() {
  return (
    <section id="ai" className="bg-ink py-20 text-white sm:py-28">
      <div className="mx-auto max-w-page px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-base font-medium text-marigold">
              <Sparkles size={18} aria-hidden /> AI-native engineering
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl sm:leading-[1.08]">
              {ai.heading}
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-white/75">{ai.intro}</p>
        </div>

        <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
          {ai.tools.map((t) => (
            <li key={t.name} className="bg-ink p-6 sm:last:col-span-2 lg:last:col-span-1">
              <Bot size={22} className="text-marigold" aria-hidden />
              <h3 className="mt-4 font-display text-xl font-bold">{t.name}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/70">{t.use}</p>
            </li>
          ))}
        </ul>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-white/10 p-6 sm:p-7">
            <h3 className="font-display text-xl font-bold">How I keep AI output production-grade</h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {ai.practices.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-white/85">
                  <ShieldCheck size={18} className="mt-0.5 shrink-0 text-marigold" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-marigold p-6 text-ink sm:p-7">
            <h3 className="font-display text-xl font-bold">{ai.shipped.title}</h3>
            <p className="mt-3 text-base leading-relaxed">{ai.shipped.detail}</p>
            <a href="#gramkick" className="mt-5 inline-block text-[15px] font-semibold underline underline-offset-4">
              Read the GramKick case study
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
