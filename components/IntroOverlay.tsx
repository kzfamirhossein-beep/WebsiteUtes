"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function IntroOverlay() {
  const [closing, setClosing] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setClosing(true), 900); // start fade
    const t2 = setTimeout(() => setRemoved(true), 1900); // remove from DOM
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (removed) return null;

  return (
    <div
      className={
        "fixed inset-0 z-50 flex items-center justify-center bg-black/90 animate-vignette " +
        (closing ? " animate-overlay-out pointer-events-none" : " animate-overlay-in")
      }
    >
      <div className="relative flex flex-col items-center gap-4 rounded-2xl border border-gold/30 bg-black/40 px-8 py-6 shadow-[0_0_0_1px_rgba(160,124,0,0.15)] backdrop-blur-md animate-pop">
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gold/20" />
        <Image className="animate-glow" src="/UTES_logo_8192_transparent.png" alt="لوگوی اوتس" width={64} height={64} priority />
        <div className="relative w-40 overflow-hidden">
          <span className="block text-center font-display text-2xl font-semibold tracking-wide text-gold">اوتس</span>
          <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent blur-[2px] animate-shimmer" />
        </div>
        <div className="h-px w-48 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      </div>
    </div>
  );
}


