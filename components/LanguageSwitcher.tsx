"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [lang]);

  const currentLang = lang === "fa" ? "فارسی" : "English";

  return (
    <div ref={containerRef} className="relative text-sm">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="btn-3d inline-flex items-center rounded-md border border-gold/40 px-3 py-1.5 text-gray-200 transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span>{currentLang}</span>
      </button>
      <div
        role="menu"
        className={`absolute left-1/2 top-full mt-1 flex -translate-x-1/2 flex-col gap-1 rounded-md border border-gold/40 bg-[#1f1f1f] p-1 shadow-lg transition-all duration-200 ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0 pointer-events-none"
        }`}
      >
        <button
          type="button"
          role="menuitem"
          onClick={() => setLang("fa")}
          className={`inline-flex w-full items-center justify-center rounded px-2 py-1.5 text-sm transition-colors ${
            lang === "fa" ? "bg-gold text-black" : "text-gray-200 hover:bg-white/5"
          }`}
          aria-pressed={lang === "fa"}
        >
          <span>فارسی</span>
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={() => setLang("en")}
          className={`inline-flex w-full items-center justify-center rounded px-2 py-1.5 text-sm transition-colors ${
            lang === "en" ? "bg-gold text-black" : "text-white hover:bg-white/5"
          }`}
          aria-pressed={lang === "en"}
        >
          <span>English</span>
        </button>
      </div>
    </div>
  );
}
















