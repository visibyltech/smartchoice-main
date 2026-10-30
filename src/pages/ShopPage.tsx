import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  Check,
  ChevronDown
} from 'lucide-react';
import { formatNaira } from '../utils/formatters';

interface ShopPageProps {
  initialCategorySlug?: string;
  initialFilter?: string;
  onSelectProduct: (product: Product) => void;
  onSaveToBuyDirect?: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategorySlug,
  initialFilter,
  onSelectProduct,
  onSaveToBuyDirect
}) => {
  const { products, categories } = useStore();

  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>(initialCategorySlug || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [dealOnly, setDealOnly] = useState<boolean>(initialFilter === 'deal');
  const [newOnly, setNewOnly] = useState<boolean>(initialFilter === 'new');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc'>('featured');
  const [searchFilter, setSearchFilter] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Price range bounds
  const maxProductPrice = useMemo(() => {
    return products.reduce((max, p) => Math.max(max, p.price), 10000000);
  }, [products]);

  const [maxPrice, setMaxPrice] = useState<number>(maxProductPrice);

  // Extract unique brands dynamically
  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    products.forEach(p => {
      if (p.brand) brands.add(p.brand);
    });
    return Array.from(brands).sort();
  }, [products]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedCategorySlug !== 'all') {
        const cat = categories.find(c => c.slug === selectedCategorySlug);
        if (cat && product.categoryId !== cat.id) return false;
      }

      // Brand filter
      if (selectedBrand !== 'all' && product.brand !== selectedBrand) {
        return false;
      }

      // In stock filter
      if (inStockOnly && !product.inStock) {
        return false;
      }

      // Deal filter
      if (dealOnly && !product.isDeal) {
        return false;
      }

      // New arrival filter
      if (newOnly && !product.isNewArrival) {
        return false;
      }

      // Price filter
      if (product.price > maxPrice) {
        return false;
      }

      // Search filter
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        const matchesCat = product.categoryName.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesBrand && !matchesCat) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, categories, selectedCategorySlug, selectedBrand, inStockOnly, dealOnly, newOnly, maxPrice, searchFilter, sortBy]);

  const clearFilters = () => {
    setSelectedCategorySlug('all');
    setSelectedBrand('all');
    setInStockOnly(false);
    setDealOnly(false);
    setNewOnly(false);
    setMaxPrice(maxProductPrice);
    setSearchFilter('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Page Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0A1931]">
            Shop Electronics & Appliances
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} in Port Harcourt inventory
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-800 rounded-lg text-xs font-bold"
          >
            <Filter className="w-4 h-4 text-[#D91E2A]" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 font-semibold hidden sm:inline">Sort By:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-semibold text-gray-800 outline-none focus:border-[#D91E2A]"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <div className="hidden md:block space-y-6 bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#D91E2A]" />
              <span>Filter Catalog</span>
            </h3>
            <button
              onClick={clearFilters}
              className="text-[11px] text-[#D91E2A] hover:underline font-semibold"
            >
              Reset All
            </button>
          </div>

          {/* Dynamic Categories Filter (Mandatory requirement) */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-900">Categories</h4>
            <div className="space-y-1 max-h-56 overflow-y-auto text-xs pr-1">
              <button
                onClick={() => setSelectedCategorySlug('all')}
                className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between ${
                  selectedCategorySlug === 'all'
                    ? 'bg-red-50 text-[#D91E2A] font-bold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>All Categories</span>
                <span>{products.length}</span>
              </button>

              {categories.map(cat => {
                const count = products.filter(p => p.categoryId === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategorySlug(cat.slug)}
                    className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between text-xs ${
                      selectedCategorySlug === cat.slug
                        ? 'bg-red-50 text-[#D91E2A] font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="text-[11px] text-gray-400 shrink-0 ml-1">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-900">Brand / Manufacturer</h4>
            <div className="space-y-1 max-h-48 overflow-y-auto text-xs pr-1">
              <button
                onClick={() => setSelectedBrand('all')}
                className={`w-full text-left px-2 py-1 rounded ${
                  selectedBrand === 'all' ? 'text-[#D91E2A] font-bold' : 'text-gray-600 hover:text-black'
                }`}
              >
                All Brands
              </button>
              {availableBrands.map(brand => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`w-full text-left px-2 py-1 rounded truncate ${
                    selectedBrand === brand ? 'text-[#D91E2A] font-bold' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2 pt-2 border-t border-gray-100 text-xs">
            <div className="flex justify-between font-semibold">
              <span className="text-gray-900">Max Price:</span>
              <span className="text-[#D91E2A] font-bold">{formatNaira(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="50000"
              max={maxProductPrice}
              step="25000"
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#D91E2A]"
            />
          </div>

          {/* Availability & Deal Toggles */}
          <div className="space-y-2.5 pt-2 border-t border-gray-100 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-gray-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => setInStockOnly(e.target.checked)}
                className="rounded text-[#D91E2A] focus:ring-[#D91E2A]"
              />
              <span>In Stock Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-gray-700">
              <input
                type="checkbox"
                checked={dealOnly}
                onChange={e => setDealOnly(e.target.checked)}
                className="rounded text-[#D91E2A] focus:ring-[#D91E2A]"
              />
              <span>Promotional Deals Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-gray-700">
              <input
                type="checkbox"
                checked={newOnly}
                onChange={e => setNewOnly(e.target.checked)}
                className="rounded text-[#D91E2A] focus:ring-[#D91E2A]"
              />
              <span>New Arrivals Only</span>
            </label>
          </div>
        </div>

        {/* Product Grid: TWO-COLUMN MOBILE GRID AND SUITABLE MULTI-COLUMN DESKTOP GRID (Mandatory) */}
        <div className="md:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800">No matching products found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Try clearing some filters or searching for generic terms like "TV", "Inverter", or "Generator".
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-[#D91E2A] text-white rounded-full text-xs font-bold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  onSaveToBuyDirect={onSaveToBuyDirect}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 flex justify-end">
          <div className="w-4/5 max-w-xs bg-white h-full overflow-y-auto p-5 space-y-5 shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <h3 className="font-bold text-sm text-[#0A1931]">Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-gray-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile categories */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-gray-800 uppercase block">Categories:</span>
                <select
                  value={selectedCategorySlug}
                  onChange={e => setSelectedCategorySlug(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                >
                  <option value="all">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Mobile brands */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-gray-800 uppercase block">Brand:</span>
                <select
                  value={selectedBrand}
                  onChange={e => setSelectedBrand(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                >
                  <option value="all">All Brands</option>
                  {availableBrands.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Mobile toggles */}
              <div className="space-y-2 pt-2 border-t text-xs">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={e => setInStockOnly(e.target.checked)}
                  />
                  <span>In Stock Only</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={dealOnly}
                    onChange={e => setDealOnly(e.target.checked)}
                  />
                  <span>Deals Only</span>
                </label>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 bg-[#D91E2A] text-white font-bold rounded-xl text-xs"
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
              <button
                onClick={clearFilters}
                className="w-full py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl text-xs"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
