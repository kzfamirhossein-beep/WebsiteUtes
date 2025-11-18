"use client";

import { useEffect, useRef, useState } from "react";
import LanguageNav from "@/components/LanguageNav";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function ScrollableHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const lastScrollY = useRef(0);
  const scrollContainer = useRef<Window | HTMLElement | null>(null);

  const detectScrollContainer = (): Window | HTMLElement | null => {
    if (typeof window === "undefined") {
      return null;
    }

    const candidates: (HTMLElement | null)[] = [
      document.querySelector<HTMLElement>("[data-scroll-container]"),
      document.querySelector<HTMLElement>(".overflow-y-auto"),
      document.querySelector<HTMLElement>(".overflow-y-scroll"),
      document.body,
    ];

    const match = candidates.find((el) => el && el.scrollHeight > el.clientHeight);
    return match || window;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    scrollContainer.current = detectScrollContainer();

    const getScrollTop = () =>
      scrollContainer.current === window
        ? window.scrollY
        : (scrollContainer.current as HTMLElement)?.scrollTop || 0;

    const handleScroll = () => {
      const current = getScrollTop();

      const nextCompact = current > 80;
      setIsCompact((prev) => (prev !== nextCompact ? nextCompact : prev));

      if (current < 40) {
        setIsVisible(true);
      } else if (current > lastScrollY.current + 4) {
        setIsVisible(false);
      } else if (current < lastScrollY.current - 4) {
        setIsVisible(true);
      }

      lastScrollY.current = current;
    };

    const target = scrollContainer.current || window;
    target.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      target.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isCompact ? "backdrop-blur-lg bg-black/60 shadow-lg" : "bg-transparent"
      }`}
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(-100%)",
      }}
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-center gap-6 px-6 transition-all ${
          isCompact ? "py-2 text-sm" : "py-5"
        }`}
      >
        <LanguageNav />
        <LanguageSwitcher />
      </nav>
    </header>
  );
}
