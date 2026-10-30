import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { formatNaira } from '../utils/formatters';
import {
  ArrowLeft,
  ShoppingCart,
  CreditCard,
  Clock,
  ShieldCheck,
  CheckCircle,
  Truck,
  MapPin,
  Heart,
  Share2,
  Maximize2,
  X
} from 'lucide-react';

interface ProductPageProps {
  product: Product;
  onBack: () => void;
  onCheckoutNow: (product: Product, quantity: number) => void;
  onSaveToBuyDirect: (product: Product) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({
  product,
  onBack,
  onCheckoutNow,
  onSaveToBuyDirect
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const images = product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80'];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleCheckoutNow = () => {
    onCheckoutNow(product, quantity);
  };

  const handleSaveToBuy = () => {
    onSaveToBuyDirect(product);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-600 hover:text-[#0A1931] mb-6 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to products</span>
      </button>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Gallery (4-5 Photos) with Thumbnails & Lightbox */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Photo View - NO ugly prev/next buttons over the image as requested */}
          <div
            onClick={() => setLightboxOpen(true)}
            className="relative aspect-square w-full bg-white rounded-2xl border border-gray-200 overflow-hidden flex items-center justify-center p-4 sm:p-6 group cursor-zoom-in shadow-xs"
          >
            <img
              src={images[selectedImageIndex]}
              alt={`${product.name} - View ${selectedImageIndex + 1}`}
              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-102"
            />

            {/* Click to enlarge hint */}
            <div className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur-xs rounded-full text-gray-700 shadow-sm opacity-80 group-hover:opacity-100 transition">
              <Maximize2 className="w-4 h-4" />
            </div>

            {/* In stock badge */}
            <div className="absolute top-3 left-3">
              {product.inStock ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5" />
                  In Stock ({product.stock} units)
                </span>
              ) : (
                <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails (Supports 4-5 photographs) */}
          {images.length > 1 && (
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl bg-white border-2 overflow-hidden p-1.5 transition ${
                    idx === selectedImageIndex
                      ? 'border-[#D91E2A] ring-2 ring-red-100 shadow-sm'
                      : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & THREE MANDATORY PURCHASE BUTTONS */}
        <div className="lg:col-span-6 space-y-5">
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#0A1931] uppercase tracking-wider">{product.brand}</span>
              <span>•</span>
              <span className="text-gray-600">{product.categoryName}</span>
              {product.model && (
                <>
                  <span>•</span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono text-[11px]">
                    Model: {product.model}
                  </span>
                </>
              )}
            </div>

            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-2 rounded-full border transition ${
                isWishlisted
                  ? 'border-red-200 bg-red-50 text-[#D91E2A]'
                  : 'border-gray-200 text-gray-500 hover:text-[#D91E2A]'
              }`}
              title="Add to wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Product Name */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 pb-3 border-b border-gray-200">
            <span className="text-2xl sm:text-3xl font-black text-[#0A1931]">
              {formatNaira(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-base text-gray-400 line-through">
                {formatNaira(product.originalPrice)}
              </span>
            )}
            {product.discountPercent && (
              <span className="bg-[#D91E2A] text-white text-xs font-bold px-2 py-0.5 rounded">
                Save {product.discountPercent}%
              </span>
            )}
          </div>

          {/* MANDATORY THREE PURCHASE BUTTONS IMMEDIATELY BELOW PRODUCT NAME AND PRICE, BEFORE DESCRIPTION */}
          <div className="bg-gray-50 p-4 sm:p-5 rounded-2xl border border-gray-200 space-y-3.5">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 font-bold text-sm transition"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="px-4 py-1.5 font-bold text-sm text-gray-900 min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 font-bold text-sm transition"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            {/* ACTION BUTTONS: Add to Cart and Checkout side by side, Save to Buy directly underneath */}
            <div className="space-y-2.5 pt-1">
              <div className="grid grid-cols-2 gap-3">
                {/* 1. Add to Cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="w-full h-12 bg-[#0A1931] hover:bg-slate-800 disabled:opacity-50 text-white font-bold px-3 sm:px-4 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 transition shadow-sm focus:outline-none text-xs sm:text-sm"
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span className="truncate">Add to Cart</span>
                </button>

                {/* 2. Checkout */}
                <button
                  type="button"
                  onClick={handleCheckoutNow}
                  disabled={!product.inStock}
                  className="w-full h-12 bg-[#D91E2A] hover:bg-[#b81822] disabled:opacity-50 text-white font-bold px-3 sm:px-4 rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 transition shadow-md focus:outline-none text-xs sm:text-sm"
                >
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span className="truncate">Checkout</span>
                </button>
              </div>

              {/* 3. Save to Buy directly underneath */}
              <button
                type="button"
                onClick={handleSaveToBuy}
                className="w-full h-12 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-sm focus:outline-none text-xs sm:text-sm"
              >
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span>Save to Buy (Flexible 1 - 4 Months Savings)</span>
              </button>
            </div>

            {addedNotice && (
              <div className="text-center py-1.5 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg animate-fade-in">
                ✓ Added to your shopping cart!
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2 pt-2">
            <h3 className="text-sm font-bold text-[#0A1931] uppercase tracking-wider">Product Overview</h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Warranty Info (Do not invent warranty information) */}
          {product.warranty && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-medium">
              <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0" />
              <div>
                <strong className="block text-blue-950 font-bold">Official Warranty Guarantee:</strong>
                <span>{product.warranty}</span>
              </div>
            </div>
          )}

          {/* Verified Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-bold text-[#0A1931] uppercase tracking-wider">
                Verified Technical Specifications
              </h3>
              <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200 text-xs">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="grid grid-cols-2 p-2.5 hover:bg-gray-50">
                    <span className="font-semibold text-gray-600">{key}</span>
                    <span className="text-gray-900 font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Showroom Pickup & Delivery Notice */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#D91E2A] shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900">Port Harcourt Showroom Collection:</strong>
                <p>Free pickup available at either Showroom 1 (71 NTA Road) or Showroom 2 (Smart Choice Plaza, 37 NTA Road).</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-900">Fast Home Delivery:</strong>
                <p>Port Harcourt & Greater Rivers State door delivery available upon checkout.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal (Click to Enlarge) */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 text-white hover:text-red-400 bg-white/10 hover:bg-white/20 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="max-w-4xl max-h-[85vh] p-2"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={images[selectedImageIndex]}
              alt={product.name}
              className="max-h-[80vh] max-w-full object-contain mx-auto rounded-lg shadow-2xl"
            />
            <div className="text-center mt-3 text-white text-xs font-semibold">
              {product.name} ({selectedImageIndex + 1} of {images.length})
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
