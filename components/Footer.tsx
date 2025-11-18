"use client";

import { useLanguage } from "@/components/LanguageContext";

export default function Footer() {
  const { lang } = useLanguage();
  const text = lang === "fa" 
    ? `© ${new Date().getFullYear()} اوتس. تمامی حقوق محفوظ است.`
    : `© ${new Date().getFullYear()} UTES. All rights reserved.`;

  return (
    <footer className="relative z-10 border-t border-gold/20 opacity-0 animate-fade-in" style={{ animationDelay: "1.8s" }}>
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-gray-300">
        {text}
      </div>
    </footer>
  );
}

