"use client";

import { useEffect } from "react";

function toRgbString(r: number, g: number, b: number) {
  return `${Math.round(r)} ${Math.round(g)} ${Math.round(b)}`;
}

export default function BrandPaletteLoader({ src = "/UTES_logo_8192_transparent.png" }: { src?: string }) {
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      const w = 64;
      const h = 64;
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      const data = ctx.getImageData(0, 0, w, h).data;
      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3];
        if (a < 16) continue; // skip transparent
        const rr = data[i], gg = data[i + 1], bb = data[i + 2];
        // skip near-black background
        if (rr < 8 && gg < 8 && bb < 8) continue;
        r += rr; g += gg; b += bb; count++;
      }
      if (count > 0) {
        r /= count; g /= count; b /= count;
        // bias towards warmer/gold tones if present
        const brand = toRgbString(r, g * 0.95, b * 0.8);
        document.documentElement.style.setProperty("--brand", brand);
      }
    };
  }, [src]);

  return null;
}


