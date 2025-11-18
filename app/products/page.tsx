"use client";

import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/components/LanguageContext";
import ScrollFadeIn from "@/components/ScrollFadeIn";

interface Product {
  id: number;
  name: string;
  nameFa: string;
  description: string;
  descriptionFa: string;
  price: string;
  image: string;
  featured: boolean;
  category?: string;
}

export default function ProductsPage() {
  const { lang } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  
  const categoryCopy = lang === "fa"
    ? {
        suits: {
          title: "کت و شلوار",
          description: "مجموعه‌ای از کت و شلوارهای دست‌دوز با پارچه‌های ممتاز و برش حرفه‌ای برای حضورهای رسمی.",
        },
        pants: {
          title: "شلوار",
          description: "شلوارهایی با برش دقیق و پارچه‌های باکیفیت برای استایل روزمره یا رسمی.",
        },
        weave: {
          title: "بافت",
          description: "پارچه‌های بافت لوکس با طراحی مدرن و اصیل برای تکمیل مجموعه پارچه‌های شما.",
        },
        shirt: {
          title: "پیراهن",
          description: "پیراهن‌های رسمی و روزمره با دوخت دقیق و جزئیات ظریف.",
        },
      }
    : {
        suits: {
          title: "Suits",
          description: "Tailored suits crafted with premium fabrics and precision cuts for your formal moments.",
        },
        pants: {
          title: "Pants",
          description: "Sharp trousers built for everyday versatility and polished occasions.",
        },
        weave: {
          title: "Weave",
          description: "Luxurious woven fabrics blending heritage patterns with modern finishes.",
        },
        shirt: {
          title: "Shirts",
          description: "Refined dress shirts and smart casual tops with elevated detailing.",
        },
      };

  const t = lang === "fa"
    ? {
        title: "محصولات",
        description: "مجموعه‌ای منتخب برای رشد کسب‌وکار شما.",
        learnMore: "بیشتر بدانید",
      }
    : {
        title: "Products",
        description: "Explore our curated selection designed to help your business grow.",
        learnMore: "Learn more",
      };

  const categorizedProducts = useMemo(() => {
    return {
      suits: products.filter((product) => product.category === "suits"),
      pants: products.filter((product) => product.category === "pants"),
      weave: products.filter((product) => product.category === "weave"),
      shirt: products.filter((product) => product.category === "shirt"),
    };
  }, [products]);

  const categoryOrder: Array<keyof typeof categorizedProducts> = ["suits", "pants", "weave", "shirt"];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-200">
        <div className="flex items-center gap-3 text-gray-300">
          <span className="h-12 w-12 animate-spin rounded-full border-2 border-gold/40 border-t-gold" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero section with fade-in */}
      <section className="relative z-40 flex min-h-[40vh] items-center justify-center overflow-hidden px-6 text-center">
        <div className="max-w-3xl space-y-6 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl text-gray-200">
            {t.title}
          </h1>
          <p className="text-lg text-gray-300">
            {t.description}
          </p>
        </div>
      </section>

      <div className="space-y-16 py-8">
        {categoryOrder.map((key) => {
          const items = categorizedProducts[key];
          if (items.length === 0) return null;
          const copy = categoryCopy[key];

          return (
            <section key={key} className="space-y-6">
              <ScrollFadeIn>
                <header className="space-y-2">
                  <h2 className="font-display text-3xl font-semibold text-gray-200">{copy.title}</h2>
                  <p className="text-gray-300 max-w-2xl">{copy.description}</p>
                </header>
              </ScrollFadeIn>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((product) => (
                  <ScrollFadeIn key={product.id}>
                    <div className="flex flex-col rounded-lg border border-gold/30 bg-[#1f1f1f]/50 p-4 hover:bg-white/5 transition">
                      {product.image ? (
                          <div className="mb-3 overflow-hidden rounded bg-black/30">
                            <div className="relative aspect-[4/3] w-full">
                              <img
                                src={product.image}
                                alt={lang === "fa" ? product.nameFa : product.name}
                                className="absolute inset-0 h-full w-full object-contain"
                              />
                            </div>
                          </div>
                      ) : (
                        <div className="mb-3 aspect-[4/3] w-full rounded bg-gold/10" />
                      )}
                      <h3 className="font-medium text-gray-200">{lang === "fa" ? product.nameFa : product.name}</h3>
                      <p className="mb-3 text-sm text-gray-300">{lang === "fa" ? product.descriptionFa : product.description}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="font-semibold text-gray-200">{product.price}</span>
                        <button className="btn-3d rounded-md bg-gold px-3 py-2 text-sm text-black hover:opacity-90">{t.learnMore}</button>
                      </div>
                    </div>
                  </ScrollFadeIn>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}


