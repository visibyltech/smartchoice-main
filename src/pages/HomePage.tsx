import React from 'react';
import { useStore } from '../context/StoreContext';
import { HomeSlideshow } from '../components/HomeSlideshow';
import { CategorySlider } from '../components/CategorySlider';
import { ProductCard } from '../components/ProductCard';
import { Product, Category } from '../types';
import {
  Sparkles,
  Percent,
  Clock,
  ShieldCheck,
  Truck,
  CreditCard,
  Store,
  ArrowRight,
  Flame,
  Award,
  Layers
} from 'lucide-react';
import { formatNaira } from '../utils/formatters';

interface HomePageProps {
  onNavigate: (view: string, params?: any) => void;
  onSelectProduct: (product: Product) => void;
  onSaveToBuyDirect?: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectProduct,
  onSaveToBuyDirect
}) => {
  const { products, categories, slides } = useStore();

  const dealProducts = products.filter(p => p.isDeal);
  const featuredProducts = products.filter(p => p.featured);
  const newArrivals = products.filter(p => p.isNewArrival);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 space-y-8">
      {/* 1. Automatic Slideshow (Televisions, Refrigerators, Inverters, ACs, Generators, Furniture) */}
      <HomeSlideshow slides={slides} onNavigate={onNavigate} />

      {/* 2. Quick Category Bubbles Row */}
      <section className="py-2 overflow-x-auto scrollbar-thin">
        <div className="flex items-center gap-3 min-w-max pb-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onNavigate('shop', { categorySlug: cat.slug })}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-gray-200 hover:border-[#D91E2A] hover:shadow-xs transition text-xs font-semibold text-gray-800 shrink-0"
            >
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <Layers className="w-4 h-4 text-[#D91E2A]" />
              )}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Promotional Flash Deals Banner & Highlights */}
      {dealProducts.length > 0 && (
        <section className="bg-gradient-to-r from-red-600 to-[#D91E2A] rounded-2xl p-4 sm:p-6 text-white shadow-md">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/20">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-amber-300 animate-bounce" />
              <h2 className="text-base sm:text-xl font-black uppercase tracking-tight">
                Hot Deals & Special Discounts
              </h2>
              <span className="hidden sm:inline-block bg-white text-[#D91E2A] text-xs font-bold px-2 py-0.5 rounded-full">
                Limited Stock in Port Harcourt
              </span>
            </div>
            <button
              onClick={() => onNavigate('shop', { filter: 'deal' })}
              className="text-xs sm:text-sm font-bold text-white hover:underline flex items-center gap-1"
            >
              <span>View All Deals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {dealProducts.slice(0, 4).map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                onSaveToBuyDirect={onSaveToBuyDirect}
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. Save to Buy Promotional Callout Card */}
      <section className="bg-gradient-to-r from-[#0A1931] via-slate-900 to-emerald-950 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-emerald-900/40">
        <div className="space-y-2 max-w-xl">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-700/50 px-3 py-1 rounded-full">
            Save to Buy Installment Program
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Own High-End Electronics with Flexible Installment Savings
          </h2>
          <p className="text-xs sm:text-sm text-gray-300">
            No massive lump-sums needed. Choose your product, pick 1 to 4 months, and make steady weekly or monthly transfers with zero hidden bank fees.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
          <button
            onClick={() => onNavigate('save-to-buy')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-full transition shadow-md flex items-center justify-center gap-2"
          >
            <Clock className="w-4 h-4" />
            <span>Calculate Your Plan</span>
          </button>
          <button
            onClick={() => onNavigate('shop')}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm py-3 px-5 rounded-full border border-white/20 transition text-center"
          >
            Browse Products
          </button>
        </div>
      </section>

      {/* 5. EVERY CATEGORY HAS ITS OWN INDEPENDENT HORIZONTAL PRODUCT SLIDER (Mandatory requirement) */}
      <section className="space-y-4">
        {categories.map(category => {
          const categoryProducts = products.filter(p => p.categoryId === category.id);
          return (
            <CategorySlider
              key={category.id}
              category={category}
              products={categoryProducts}
              onSelectProduct={onSelectProduct}
              onViewAllCategory={cat => onNavigate('shop', { categorySlug: cat.slug })}
              onSaveToBuyDirect={onSaveToBuyDirect}
            />
          );
        })}
      </section>

      {/* 6. Why Shop with Smart Choice Electronics Group */}
      <section className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-2xs space-y-6">
        <div className="text-center space-y-1.5 max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-black text-[#0A1931]">
            Why Smart Choice is Port Harcourt's #1 Electronics Destination
          </h2>
          <p className="text-xs text-gray-500">
            Trusted by thousands of homes, hotels, and corporate offices across Rivers State.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
            <div className="p-2.5 rounded-xl bg-red-50 text-[#D91E2A] w-fit">
              <Store className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Two Physical Walk-In Showrooms</h3>
            <p className="text-gray-600 leading-relaxed">
              Showroom 1 at 71 NTA Road & Showroom 2 at Smart Choice Plaza (37 NTA Road), Mgbuoba. Walk in to inspect before buying.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Official Manufacturer Warranties</h3>
            <p className="text-gray-600 leading-relaxed">
              Direct factory warranties on Hisense, LG, Panasonic, Firman, and Perkins. Dedicated local technicians available.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 w-fit">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Moniepoint & Sterling Verified</h3>
            <p className="text-gray-600 leading-relaxed">
              Pay securely to verified corporate accounts under SMART CHOICE GLOBAL RESOURCES LTD with instant receipt auditing.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
