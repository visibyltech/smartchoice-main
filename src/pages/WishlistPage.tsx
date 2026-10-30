import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';

interface WishlistPageProps {
  onSelectProduct: (product: Product) => void;
  onSaveToBuyDirect?: (product: Product) => void;
  onContinueShopping: () => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  onSelectProduct,
  onSaveToBuyDirect,
  onContinueShopping
}) => {
  const { wishlist, products } = useStore();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2.5">
          <Heart className="w-6 h-6 text-[#D91E2A] fill-current" />
          <h1 className="text-xl sm:text-2xl font-black text-[#0A1931]">
            My Wishlist ({wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <button
          onClick={onContinueShopping}
          className="text-xs sm:text-sm font-semibold text-gray-600 hover:text-[#0A1931] flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-3">
          <Heart className="w-12 h-12 text-gray-300 mx-auto" />
          <h2 className="text-lg font-bold text-gray-800">Your wishlist is currently empty</h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Click the heart icon on any appliance or electronics item while browsing to save it here for later.
          </p>
          <button
            onClick={onContinueShopping}
            className="mt-3 inline-flex items-center gap-2 bg-[#D91E2A] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#b81822] transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Discover Products</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistedProducts.map(product => (
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
  );
};
