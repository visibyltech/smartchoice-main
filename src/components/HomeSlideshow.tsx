import React, { useState, useEffect, useRef } from 'react';
import { Slide } from '../types';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface HomeSlideshowProps {
  slides: Slide[];
  onNavigate: (view: string, params?: any) => void;
}

export const HomeSlideshow: React.FC<HomeSlideshowProps> = ({ slides, onNavigate }) => {
  const activeSlides = slides.filter(s => s.isActive);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeSlides.length);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeSlides.length]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % activeSlides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStart(null);
  };

  if (activeSlides.length === 0) return null;

  const currentSlide = activeSlides[currentIndex];

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-gray-900 shadow-md group my-3"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slide Image with Overlay */}
      <div className="relative h-[280px] sm:h-[380px] md:h-[440px] w-full">
        {activeSlides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
          </div>
        ))}

        {/* Content Box */}
        <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-center max-w-xl text-white">
          {currentSlide.badge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D91E2A] text-white text-[11px] font-extrabold uppercase tracking-wider w-fit mb-2 shadow-sm">
              <span>{currentSlide.badge}</span>
            </div>
          )}

          <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-white drop-shadow-sm">
            {currentSlide.title}
          </h1>

          <p className="mt-2 text-xs sm:text-sm md:text-base text-gray-200 line-clamp-2 sm:line-clamp-3 max-w-lg">
            {currentSlide.subtitle}
          </p>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => {
                if (currentSlide.link.startsWith('/category/')) {
                  const slug = currentSlide.link.replace('/category/', '');
                  onNavigate('shop', { categorySlug: slug });
                } else if (currentSlide.link === '/save-to-buy') {
                  onNavigate('save-to-buy');
                } else if (currentSlide.link === '/contact') {
                  onNavigate('contact');
                } else {
                  onNavigate('shop');
                }
              }}
              className="bg-[#D91E2A] hover:bg-[#b81822] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full flex items-center gap-2 transition shadow-md"
            >
              <span>{currentSlide.buttonText || 'Shop Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('save-to-buy')}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full border border-white/30 transition"
            >
              Save to Buy (3%-7%)
            </button>
          </div>
        </div>
      </div>

      {/* Discreet Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition shadow-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition shadow-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Discreet Navigation Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-1.5">
        {activeSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === currentIndex
                ? 'w-6 h-2 bg-[#D91E2A]'
                : 'w-2 h-2 bg-white/60 hover:bg-white'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
