"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { name: "AI", href: "#ai" },
  { name: "Roles", href: "#roles" },
  { name: "GramKick", href: "#gramkick" },
  { name: "Work", href: "#work" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the mobile menu is open: Escape closes it, and so does
  // widening the window to the desktop layout.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const desktop = window.matchMedia("(min-width: 768px)");
    const onResize = () => desktop.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  return (
    <>
    {/* Tapping anywhere outside the open menu closes it. */}
    {open && (
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-30 bg-ink/30 md:hidden"
      />
    )}
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b border-line bg-white transition-shadow ${
        scrolled || open ? "shadow-[0_6px_20px_-12px_rgba(19,32,58,0.35)]" : ""
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-page items-center justify-between px-4 sm:px-6" aria-label="Main">
        <a href="#top" className="font-display text-lg font-bold tracking-tight text-ink">
          Firoj Ahamad
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="text-[15px] text-muted transition-colors hover:text-ink">
                {item.name}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="hidden rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cobalt sm:inline-block"
          >
            Hire me
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <ul id="mobile-nav" className="border-t border-line px-4 pb-4 pt-2 md:hidden">
          {[...navItems, { name: "Hire me", href: "#contact" }].map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-base text-ink"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
    </>
  );
}
