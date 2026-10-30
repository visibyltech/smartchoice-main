import React, { useRef } from 'react';
import { Category, Product } from '../types';
import { ProductCard } from './ProductCard';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface CategorySliderProps {
  category: Category;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onViewAllCategory: (category: Category) => void;
  onSaveToBuyDirect?: (product: Product) => void;
}

export const CategorySlider: React.FC<CategorySliderProps> = ({
  category,
  products,
  onSelectProduct,
  onViewAllCategory,
  onSaveToBuyDirect
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // If there are no products in this category yet, skip rendering or show placeholder
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-4 my-2">
      {/* Category Header */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b-2 border-red-100">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-6 bg-[#D91E2A] rounded-full" />
          <h2 className="text-base sm:text-lg font-bold text-[#0A1931] tracking-tight">
            {category.name}
          </h2>
          <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
            {products.length} {products.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Discreet Slider Controls */}
          <div className="hidden sm:flex items-center space-x-1">
            <button
              onClick={() => scroll('left')}
              className="p-1.5 rounded-full border border-gray-200 text-gray-600 hover:text-black hover:border-gray-400 bg-white shadow-xs transition"
              aria-label={`Scroll ${category.name} left`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1.5 rounded-full border border-gray-200 text-gray-600 hover:text-black hover:border-gray-400 bg-white shadow-xs transition"
              aria-label={`Scroll ${category.name} right`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* View All link */}
          <button
            onClick={() => onViewAllCategory(category)}
            className="text-xs sm:text-sm font-semibold text-[#D91E2A] hover:text-[#0A1931] flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Horizontal Slider: On mobile shows approx 2 cards with partial next card visible */}
      <div
        ref={sliderRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400"
        style={{ scrollbarWidth: 'thin' }}
      >
        {products.map(product => (
          <div
            key={product.id}
            className="w-[44vw] sm:w-[220px] md:w-[240px] shrink-0 snap-start"
          >
            <ProductCard
              product={product}
              onSelect={onSelectProduct}
              onSaveToBuyDirect={onSaveToBuyDirect}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
