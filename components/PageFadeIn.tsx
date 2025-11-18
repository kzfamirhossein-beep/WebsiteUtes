"use client";

import { useEffect, useState } from "react";

export default function PageFadeIn({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay to ensure blank state is visible first
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  if (!visible) {
    return <div className="fixed inset-0 bg-[#1f1f1f]" />;
  }

  return <>{children}</>;
}

