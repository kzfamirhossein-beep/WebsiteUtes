"use client";

import { useEffect } from "react";

function toHex(n: number) {
  const h = Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return h;
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export default function BrandColors() {
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/UTES_logo_8192_transparent.png";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = 120;
      const h = 120;
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      const { data } = ctx.getImageData(0, 0, w, h);

      let rSum = 0, gSum = 0, bSum = 0, count = 0;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        if (a < 200) continue; // skip transparent
        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        if (luminance < 30 || luminance > 245) continue; // skip near black/white
        rSum += r; gSum += g; bSum += b; count++;
      }
      if (count === 0) return;
      const r = rSum / count;
      const g = gSum / count;
      const b = bSum / count;
      const hex = rgbToHex(r, g, b);

      const root = document.documentElement;
      root.style.setProperty("--brand", hex);
      // Also update ring color variable so Tailwind ring-gold maps nicely
      root.style.setProperty("--brand-strong", hex);
    };
  }, []);

  return null;
}


