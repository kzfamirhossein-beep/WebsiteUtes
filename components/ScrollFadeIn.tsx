"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageContext";

type ScrollFadeInProps = {
  children: React.ReactNode;
  className?: string;
};

export default function ScrollFadeIn({ children, className = "" }: ScrollFadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();
  const isRTL = lang === "fa";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible
          ? "translate-x-0 opacity-100"
          : isRTL
          ? "translate-x-full opacity-0"
          : "-translate-x-full opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

