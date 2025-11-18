"use client";

import SparklingLogo from "@/components/SparklingLogo";

export default function PositionedLogo() {
  return (
    <div className="absolute right-0 top-0 z-40 opacity-0 animate-fade-in" style={{ animationDelay: "0.8s" }}>
      <div className="relative inline-flex items-center justify-center pointer-events-none">
        <div className="scale-[0.65]">
          <SparklingLogo />
        </div>
      </div>
    </div>
  );
}

