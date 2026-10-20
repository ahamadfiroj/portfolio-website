"use client";

import { useState } from "react";
import { Github, Linkedin, Mail, Phone } from "lucide-react";
import { availability, personalInfo } from "@/lib/data";

type Status = { kind: "idle" | "sending" | "sent" | "error"; message?: string };

const field =
  "w-full rounded-lg border border-line bg-paper px-4 py-3 text-base text-ink placeholder:text-muted/70 focus:border-cobalt focus:outline-none focus:ring-2 focus:ring-cobalt/20";

export default function Contact() {
  const [engagement, setEngagement] = useState(availability.engagements[0]);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ kind: "sending" });
    const subject = `${engagement}${form.company.trim() ? ` at ${form.company.trim()}` : ""}`;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, subject, message: form.message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({ kind: "error", message: data.error || "Message not sent. Try again, or email me directly." });
        return;
      }
      setStatus({ kind: "sent" });
      setForm({ name: "", email: "", company: "", message: "" });
    } catch {
      setStatus({ kind: "error", message: "Message not sent: check your connection, or email me directly." });
    }
  };

  return (
    <section id="contact" className="bg-ink py-20 text-white sm:py-28">
      <div className="mx-auto grid max-w-page gap-14 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="font-display text-4xl font-extrabold tracking-[-0.025em] sm:text-5xl">
            Hiring, or need something built?
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/75">
            Tell me about the role or the project. I reply within a day.
          </p>
          <p className="mt-3 max-w-md text-base text-white/60">{availability.note}</p>

          <ul className="mt-10 space-y-4 text-base">
            <li>
              <a href={`mailto:${personalInfo.email}`} className="inline-flex items-center gap-3 hover:text-marigold">
                <Mail size={18} aria-hidden /> {personalInfo.email}
              </a>
            </li>
            <li>
              <a href={`tel:${personalInfo.phone}`} className="inline-flex items-center gap-3 hover:text-marigold">
                <Phone size={18} aria-hidden /> +91 90052 14654
              </a>
            </li>
            <li>
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 hover:text-marigold">
                <Linkedin size={18} aria-hidden /> LinkedIn
              </a>
            </li>
            <li>
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 hover:text-marigold">
                <Github size={18} aria-hidden /> GitHub
              </a>
            </li>
          </ul>
        </div>

        <form onSubmit={submit} className="rounded-2xl bg-fog p-6 text-ink sm:p-8" noValidate={false}>
          <fieldset>
            <legend className="text-sm font-medium">What kind of work?</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {availability.engagements.map((opt) => (
                <label
                  key={opt}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cobalt ${
                    engagement === opt ? "border-ink bg-ink text-white" : "border-line bg-paper text-ink hover:border-ink/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="engagement"
                    value={opt}
                    checked={engagement === opt}
                    onChange={() => setEngagement(opt)}
                    className="sr-only"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium">Your name</span>
              <input name="name" required value={form.name} onChange={update} className={`${field} mt-1.5`} autoComplete="name" />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Work email</span>
              <input name="email" type="email" required value={form.email} onChange={update} className={`${field} mt-1.5`} autoComplete="email" />
            </label>
          </div>
          <label className="mt-4 block">
            <span className="text-sm font-medium">Company (optional)</span>
            <input name="company" value={form.company} onChange={update} className={`${field} mt-1.5`} autoComplete="organization" />
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-medium">About the role or project</span>
            <textarea
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={update}
              placeholder="Team, stack, timeline, and where you're based"
              className={`${field} mt-1.5 resize-y`}
            />
          </label>

          <button
            type="submit"
            disabled={status.kind === "sending"}
            className="mt-6 w-full rounded-full bg-cobalt px-6 py-3.5 font-medium text-white transition-colors hover:bg-cobalt-deep disabled:opacity-60"
          >
            {status.kind === "sending" ? "Sending…" : "Send message"}
          </button>

          <p role="status" aria-live="polite" className="mt-4 min-h-[1.5rem] text-[15px]">
            {status.kind === "sent" && <span className="text-emerald-700">Message sent. I&apos;ll reply within a day.</span>}
            {status.kind === "error" && <span className="text-red-700">{status.message}</span>}
          </p>
        </form>
      </div>
    </section>
  );
}
