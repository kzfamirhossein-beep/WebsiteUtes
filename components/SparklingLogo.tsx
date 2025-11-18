"use client";

import Image from "next/image";
import { useMemo, useState, useCallback, useRef } from "react";

type Spark = {
  id: number;
  top: string;
  left: string;
  delay: string;
  duration: string;
  size: number; // base size in px
};

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function SparklingLogo() {
  const nextId = useRef(0);
  const genSpark = useCallback((): Spark => {
    const angle = random(0, Math.PI * 2);
    const radiusPct = random(38, 48);
    const jitter = random(-10, 10);
    const top = `${50 + Math.sin(angle) * (radiusPct + jitter)}%`;
    const left = `${50 + Math.cos(angle) * (radiusPct + jitter)}%`;
    const delay = `${random(0, 2.0).toFixed(2)}s`;
    const duration = `${random(1.0, 1.8).toFixed(2)}s`;
    const size = Math.round(random(6, 14));
    return { id: nextId.current++, top, left, delay, duration, size };
  }, []);

  const [sparks, setSparks] = useState<Spark[]>(() => {
    const count = 12;
    return Array.from({ length: count }, () => genSpark());
  });

  return (
    <div className="relative inline-flex items-center justify-center">
      <span className="absolute -inset-6 rounded-full bg-gold/10 blur-3xl animate-breath" aria-hidden />
      <span className="absolute -inset-3 rounded-full bg-gold/10 blur-xl" aria-hidden />
      <Image
        src="/UTES_logo_8192_transparent.png"
        alt="لوگوی اوتس"
        width={112}
        height={112}
        priority
        className="animate-pulse-glow"
        style={{ willChange: "filter, transform" }}
      />
      {/* Sparkles - refined star bursts using clip-path and subtle glow */}
      <div className="pointer-events-none absolute inset-0">
        {sparks.map((s, i) => (
          <span
            key={s.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 opacity-0 animate-twinkle"
            style={{ top: s.top, left: s.left, animationDelay: s.delay as any, animationDuration: s.duration as any }}
          >
            <span
              className="block bg-gold"
              style={{
                width: s.size,
                height: s.size,
                clipPath:
                  "polygon(50% 0%, 60% 35%, 100% 50%, 60% 65%, 50% 100%, 40% 65%, 0% 50%, 40% 35%)",
                borderRadius: 2,
                boxShadow: "0 0 10px rgba(var(--brand),0.45)",
                filter: "saturate(140%)",
              }}
              onAnimationIteration={() => {
                setSparks((curr) => {
                  const next = curr.slice();
                  next[i] = genSpark();
                  return next;
                });
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}


