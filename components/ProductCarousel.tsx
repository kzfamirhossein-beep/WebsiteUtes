"use client";

import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/components/LanguageContext";

interface Product {
  id: number;
  name: string;
  nameFa: string;
  description: string;
  descriptionFa: string;
  price: string;
  image: string;
  category?: string;
}

interface ProductCarouselProps {
  products: Product[];
  title: string;
}

export default function ProductCarousel({ products, title }: ProductCarouselProps) {
  const { lang } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const productsPerView = 3;
  const navLabels = lang === "fa" ? { prev: "قبلی", next: "بعدی" } : { prev: "Previous", next: "Next" };

  // Calculate which products to show based on selected index
  const getVisibleProducts = () => {
    if (products.length <= productsPerView) {
      return products;
    }
    
    // Show selected product and adjacent ones
    const start = Math.max(0, Math.min(selectedIndex - 1, products.length - productsPerView));
    return products.slice(start, start + productsPerView);
  };

  const visibleProducts = useMemo(() => getVisibleProducts(), [products, selectedIndex]);
  const direction = selectedIndex > prevIndex ? 'right' : selectedIndex < prevIndex ? 'left' : null;

  // Check if a product index is in the currently visible set
  const isProductVisible = (index: number) => {
    if (products.length <= productsPerView) return true;
    const start = Math.max(0, Math.min(selectedIndex - 1, products.length - productsPerView));
    const end = start + productsPerView;
    return index >= start && index < end;
  };

  useEffect(() => {
    if (!isTransitioning) {
      setDisplayProducts(visibleProducts);
    }
  }, [selectedIndex, isTransitioning, visibleProducts]);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (products.length <= productsPerView || isPaused || isTransitioning) return;

    const interval = setInterval(() => {
      setSelectedIndex((currentIndex) => {
        const nextIndex = (currentIndex + 1) % products.length;
        
        // Check if next product needs transition
        if (products.length > productsPerView) {
          const start = Math.max(0, Math.min(currentIndex - 1, products.length - productsPerView));
          const end = start + productsPerView;
          const needsTransition = nextIndex < start || nextIndex >= end;
          
          if (needsTransition) {
            setPrevIndex(currentIndex);
            setIsTransitioning(true);
            
            setTimeout(() => {
              setIsTransitioning(false);
            }, 700);
          }
        }
        
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, isTransitioning, products.length, productsPerView]);

  const navigateToIndex = (index: number) => {
    if (index === selectedIndex || isTransitioning) return;
    
    // Check if the clicked product is already visible
    const needsTransition = !isProductVisible(index);
    
    if (needsTransition) {
      // Product is outside visible set - animate transition
      setPrevIndex(selectedIndex);
      setIsTransitioning(true);
      
      // First: slide out current products
      setTimeout(() => {
        setSelectedIndex(index);
        // Then: slide in new products
        setTimeout(() => {
          setIsTransitioning(false);
        }, 100);
      }, 600);
    } else {
      // Product is already visible - just update selection without animation
      setSelectedIndex(index);
    }
  };

  const handleDotClick = (index: number) => {
    navigateToIndex(index);
  };

  const handlePrevious = () => {
    if (products.length === 0) return;
    const step = lang === "fa" ? 1 : -1;
    const nextIndex = (selectedIndex + step + products.length) % products.length;
    navigateToIndex(nextIndex);
  };

  const handleNext = () => {
    if (products.length === 0) return;
    const step = lang === "fa" ? -1 : 1;
    const nextIndex = (selectedIndex + step + products.length) % products.length;
    navigateToIndex(nextIndex);
  };

  return (
    <section className="space-y-6 py-4">
      <h2 className="font-display text-2xl font-semibold text-gray-200">{title}</h2>
      
      {/* Products Grid with transition container */}
      <div 
        className="relative overflow-visible min-h-[400px] py-2"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${
            isTransitioning 
              ? direction === 'right' 
                ? '-translate-x-full opacity-0' 
                : direction === 'left'
                ? 'translate-x-full opacity-0'
                : ''
              : 'translate-x-0 opacity-100'
          }`}
          style={{
            transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            willChange: isTransitioning ? 'transform, opacity' : 'auto'
          }}
        >
          {(isTransitioning ? displayProducts : visibleProducts).map((product, idx) => {
            const actualIndex = products.indexOf(product);
            const isSelected = actualIndex === selectedIndex;
            
            return (
              <div 
                key={`${product.id}-${selectedIndex}-${idx}`}
                onClick={() => handleDotClick(actualIndex)}
                className={`group rounded-lg border bg-[#1f1f1f]/50 p-4 cursor-pointer ${
                  isSelected 
                    ? "border-gold bg-[#1f1f1f]/70 shadow-lg shadow-gold/20" 
                    : "border-gold/30 hover:bg-white/5 hover:border-gold/50"
                }`}
                style={{
                  transform: isSelected ? 'scale(1.015)' : 'scale(1)',
                  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
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
                <p className="text-sm text-gray-300">{lang === "fa" ? product.descriptionFa : product.description}</p>
                <p className="mt-2 text-gold font-semibold">{product.price}</p>
              </div>
            );
          })}
        </div>

        {products.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevious}
              aria-label={navLabels.prev}
              className="group absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-1/2 rounded-full border border-gold/40 bg-black/70 p-3 text-gray-200 transition hover:bg-gold/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M11.28 4.22a.75.75 0 010 1.06L7.56 9l3.72 3.72a.75.75 0 11-1.06 1.06l-4.25-4.25a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label={navLabels.next}
              className="group absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-1/2 rounded-full border border-gold/40 bg-black/70 p-3 text-gray-200 transition hover:bg-gold/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M8.72 15.78a.75.75 0 010-1.06L12.44 11 8.72 7.28a.75.75 0 111.06-1.06l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0z" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Navigation Dots - One per product */}
      {products.length > productsPerView && (
        <div className="flex justify-center items-center gap-2 pt-4 flex-wrap">
          {products.map((product, index) => (
            <button
              key={product.id}
              onClick={() => handleDotClick(index)}
              className={`transition-all duration-300 ${
                selectedIndex === index
                  ? "w-8 h-2 bg-gold rounded-full"
                  : "w-2 h-2 bg-gold/40 rounded-full hover:bg-gold/60"
              }`}
              aria-label={`Show ${lang === "fa" ? product.nameFa : product.name}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

