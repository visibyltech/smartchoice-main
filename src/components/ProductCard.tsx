import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { formatNaira } from '../utils/formatters';
import { ShoppingCart, Heart, Clock, Check, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onSaveToBuyDirect?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onSaveToBuyDirect
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleSaveToBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSaveToBuyDirect) {
      onSaveToBuyDirect(product);
    } else {
      onSelect(product);
    }
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-white rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-lg transition duration-200 flex flex-col justify-between overflow-hidden cursor-pointer w-full text-left"
    >
      {/* Badges & Wishlist Overlay */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex flex-col gap-1">
          {product.discountPercent ? (
            <span className="bg-[#D91E2A] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-xs">
              -{product.discountPercent}%
            </span>
          ) : product.isNewArrival ? (
            <span className="bg-[#0A1931] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs">
              NEW
            </span>
          ) : product.isBestSeller ? (
            <span className="bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs">
              TOP
            </span>
          ) : null}
        </div>

        <button
          onClick={handleWishlist}
          className={`pointer-events-auto p-1.5 rounded-full transition shadow-xs focus:outline-none ${
            isWishlisted
              ? 'bg-red-50 text-[#D91E2A]'
              : 'bg-white/90 text-gray-500 hover:text-[#D91E2A] hover:bg-white'
          }`}
          title="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Image Container - properly contained */}
      <div className="relative w-full aspect-square bg-gray-50 overflow-hidden flex items-center justify-center p-3">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center">
            <span className="text-xs font-bold text-red-600 uppercase border border-red-300 bg-red-50 px-2 py-1 rounded">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
            <span className="font-semibold text-blue-900 truncate uppercase tracking-wider">{product.brand}</span>
            <span className="text-[10px] text-gray-400 truncate">{product.categoryName}</span>
          </div>

          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-[#D91E2A] transition-colors leading-snug">
            {product.name}
          </h3>
        </div>

        <div className="mt-2.5 pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-extrabold text-[#0A1931]">
              {formatNaira(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] text-gray-400 line-through">
                {formatNaira(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Save to Buy hint */}
          <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
            <Clock className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>Save to Buy from {formatNaira(Math.round((product.price * 1.03) / 4))}/mo</span>
          </div>

          {/* Action Buttons */}
          <div className="mt-2.5 grid grid-cols-2 gap-1.5">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full bg-[#0A1931] hover:bg-slate-800 disabled:opacity-50 text-white text-[11px] font-bold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition shadow-xs focus:outline-none"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Cart</span>
            </button>
            <button
              onClick={handleSaveToBuy}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold py-1.5 px-1 rounded-lg flex items-center justify-center gap-0.5 transition shadow-xs focus:outline-none"
            >
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Save2Buy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
