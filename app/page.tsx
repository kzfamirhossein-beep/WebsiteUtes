"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import ScrollFadeIn from "@/components/ScrollFadeIn";
import ProductCarousel from "@/components/ProductCarousel";

interface HomeContent {
  hero: {
    h1: string;
    h1Fa: string;
    p: string;
    pFa: string;
  };
  about: {
    title: string;
    titleFa: string;
    body: string;
    bodyFa: string;
  };
  mission: {
    title: string;
    titleFa: string;
    body: string;
    bodyFa: string;
  };
  vision: {
    title: string;
    titleFa: string;
    body: string;
    bodyFa: string;
  };
}

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

export default function HomePage() {
  const { lang } = useLanguage();
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoOpacity, setVideoOpacity] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [homeRes, productsRes] = await Promise.all([
          fetch("/api/home"),
          fetch("/api/products"),
        ]);
        const homeData = await homeRes.json();
        const productsData = await productsRes.json();
        setHomeContent(homeData);
        setProducts(productsData);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle video fade-out on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      
      const heroRect = heroRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      // Calculate when hero section is leaving the viewport
      // Start fading when hero bottom is at 70% of viewport
      const fadeStartRatio = 0.7;
      const heroBottom = heroRect.bottom + scrollY;
      const fadeStart = heroBottom - viewportHeight * fadeStartRatio;
      const fadeEnd = heroBottom;
      
      if (scrollY < fadeStart) {
        // Still in hero section - keep video visible
        setVideoOpacity(0.4);
      } else if (scrollY >= fadeEnd) {
        // Past hero section - hide video completely
        setVideoOpacity(0);
      } else {
        // Fading out - calculate opacity based on scroll position
        const fadeRange = fadeEnd - fadeStart;
        const fadeProgress = fadeRange > 0 ? (scrollY - fadeStart) / fadeRange : 1;
        setVideoOpacity(Math.max(0, 0.4 * (1 - fadeProgress)));
      }
    };

    // Initial opacity after fade-in animation completes
    const initialTimeout = setTimeout(() => {
      if (window.scrollY === 0) {
        setVideoOpacity(0.4);
      } else {
        handleScroll();
      }
    }, 2000);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearTimeout(initialTimeout);
    };
  }, []);

  if (loading || !homeContent) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-200">
        <div className="flex items-center gap-3 text-gray-300">
          <span className="h-12 w-12 animate-spin rounded-full border-2 border-gold/40 border-t-gold" />
          <span className="tracking-wide uppercase text-sm">Loading</span>
        </div>
      </div>
    );
  }

  // Group products by category
  const suitsProducts = products.filter((p: Product) => p.category === "suits");
  const pantsProducts = products.filter((p: Product) => p.category === "pants");
  const weaveProducts = products.filter((p: Product) => p.category === "weave");
  const shirtProducts = products.filter((p: Product) => p.category === "shirt");

  const t = lang === "fa"
    ? {
        h1: homeContent.hero.h1Fa,
        p: homeContent.hero.pFa,
        viewProducts: "مشاهده محصولات",
        contact: "تماس با ما",
        featuredProducts: "محصولات ویژه",
        suits: "کت و شلوار",
        pants: "شلوار",
        weave: "بافت",
        shirt: "پیراهن",
        aboutTitle: homeContent.about.titleFa,
        aboutBody: homeContent.about.bodyFa,
        missionTitle: homeContent.mission.titleFa,
        missionBody: homeContent.mission.bodyFa,
        visionTitle: homeContent.vision.titleFa,
        visionBody: homeContent.vision.bodyFa,
      }
    : {
        h1: homeContent.hero.h1,
        p: homeContent.hero.p,
        viewProducts: "View Products",
        contact: "Contact Us",
        featuredProducts: "Featured Products",
        suits: "Suits",
        pants: "Pants",
        weave: "Weave",
        shirt: "Shirt",
        aboutTitle: homeContent.about.title,
        aboutBody: homeContent.about.body,
        missionTitle: homeContent.mission.title,
        missionBody: homeContent.mission.body,
        visionTitle: homeContent.vision.title,
        visionBody: homeContent.vision.body,
      };

  return (
    <div>
      {/* Full-viewport background video (home page only) */}
      <video
        className="pointer-events-none fixed z-[30] animate-fade-in"
        src="/1103.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        style={{
          animationDelay: "0.2s",
          animationFillMode: "both",
          top: 0,
          left: "-12vw",
          width: "100vw",
          height: "100vh",
          minWidth: "100vw",
          minHeight: "100vh",
          objectFit: "cover",
          objectPosition: "center",
          opacity: videoOpacity,
          transition: "opacity 0.3s ease-out",
        }}
      />
      {/* Hero section - fills viewport on first load */}
      <section ref={heroRef} className="relative z-40 flex min-h-[90vh] items-center justify-center overflow-hidden px-6 text-center">
        <div className="max-w-3xl space-y-6">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl text-gray-200">
              {t.h1}
          </h1>
          <p className="text-lg text-gray-300">
            {t.p}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                document.getElementById("about-us")?.scrollIntoView({ 
                  behavior: "smooth", 
                  block: "start" 
                });
              }}
              className="btn-3d rounded-md bg-gold px-5 py-3 text-black hover:opacity-90"
            >
              {t.viewProducts}
            </button>
            <Link
              href="/contact"
              className="btn-3d rounded-md border border-gold px-5 py-3 text-gray-200 hover:bg-gold/10"
            >
              {t.contact}
            </Link>
          </div>
        </div>
      </section>

      {/* Additional spacing to push content down */}
      <div className="h-[10vh]" />

      {/* Additional content sections to increase page length */}
      <ScrollFadeIn>
        <section id="about-us" className="space-y-12 py-8">
          <div className="space-y-4">
            <h2 className="font-display text-3xl font-semibold text-gray-200">{lang === "fa" ? t.aboutTitle : t.aboutTitle}</h2>
            <p className="text-lg text-gray-300 leading-relaxed max-w-3xl">
              {t.aboutBody}
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-3">
              <h3 className="font-display text-xl font-semibold text-gray-200">{t.missionTitle}</h3>
              <p className="text-gray-300">
                {t.missionBody}
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-display text-xl font-semibold text-gray-200">{t.visionTitle}</h3>
              <p className="text-gray-300">
                {t.visionBody}
              </p>
            </div>
          </div>

          {suitsProducts.length > 0 && (
            <div className="pt-6">
              <ProductCarousel products={suitsProducts} title={t.suits} />
            </div>
          )}
        </section>
      </ScrollFadeIn>

      {/* Product Categories Sections */}

      {pantsProducts.length > 0 && (
        <ScrollFadeIn>
          <ProductCarousel products={pantsProducts} title={t.pants} />
        </ScrollFadeIn>
      )}

      {weaveProducts.length > 0 && (
        <ScrollFadeIn>
          <ProductCarousel products={weaveProducts} title={t.weave} />
        </ScrollFadeIn>
      )}

      {shirtProducts.length > 0 && (
        <ScrollFadeIn>
          <ProductCarousel products={shirtProducts} title={t.shirt} />
        </ScrollFadeIn>
      )}
    </div>
  );
}


