"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";

const NAV_ITEMS = [
  { path: "/", key: "home" },
  { path: "/products", key: "products" },
  { path: "/contact", key: "contact" },
] as const;

type NavKey = (typeof NAV_ITEMS)[number]["key"];

export default function LanguageNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { lang } = useLanguage();

  const labels: Record<NavKey, string> =
    lang === "fa"
      ? { home: "خانه", products: "محصولات", contact: "تماس" }
      : { home: "Home", products: "Products", contact: "Contact" };

  useEffect(() => {
    NAV_ITEMS.forEach(({ path }) => {
      if (path !== pathname) {
        router.prefetch(path);
      }
    });
  }, [router, pathname]);

  const linkClasses = (path: string) =>
    `text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 ${
      pathname === path ? "text-gold" : "text-gray-300 hover:text-gray-200"
    }`;

  return (
    <div className="flex items-center justify-center gap-6">
      {NAV_ITEMS.map(({ path, key }) => (
        <a
          key={path}
          href={path}
          onClick={(event) => {
            event.preventDefault();
            if (pathname !== path) {
              // If navigating to homepage, scroll to top
              if (path === "/") {
                window.scrollTo(0, 0);
                if (document.documentElement) {
                  document.documentElement.scrollTop = 0;
                }
                if (document.body) {
                  document.body.scrollTop = 0;
                }
              }
              router.push(path);
            }
          }}
          className={linkClasses(path)}
          aria-current={pathname === path ? "page" : undefined}
        >
          {labels[key]}
        </a>
      ))}
    </div>
  );
}
