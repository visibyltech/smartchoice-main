import React from 'react';
import { useStore } from '../context/StoreContext';
import { formatNaira } from '../utils/formatters';
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Store,
  Clock
} from 'lucide-react';

interface CartPageProps {
  onContinueShopping: () => void;
  onProceedToCheckout: () => void;
  onSaveToBuyDirect?: (product: any) => void;
  onOpenAuth?: (mode?: 'signin' | 'register', onComplete?: () => void) => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  onContinueShopping,
  onProceedToCheckout,
  onSaveToBuyDirect,
  onOpenAuth
}) => {
  const { cart, cartSubtotal, updateCartQuantity, removeFromCart, clearCart, currentUser } = useStore();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Your Shopping Cart is Empty</h2>
        <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
          Explore our wide range of televisions, refrigerators, air conditioners, power inverters, and home appliances.
        </p>
        <button
          onClick={onContinueShopping}
          className="mt-6 inline-flex items-center gap-2 bg-[#D91E2A] hover:bg-[#b81822] text-white font-bold px-6 py-3 rounded-full text-sm transition shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Start Shopping Now</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-[#0A1931]" />
          <h1 className="text-xl sm:text-2xl font-black text-[#0A1931]">
            Shopping Cart ({cart.reduce((t, i) => t + i.quantity, 0)} {cart.reduce((t, i) => t + i.quantity, 0) === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-gray-500 hover:text-red-600 font-semibold flex items-center gap-1 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Item List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 shadow-xs overflow-hidden">
            {cart.map(item => {
              const itemSubtotal = item.product.price * item.quantity;
              return (
                <div key={item.product.id} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  {/* Product Thumbnail & Details */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-20 h-20 bg-gray-50 rounded-xl border border-gray-200 p-2 shrink-0 flex items-center justify-center">
                      <img
                        src={item.product.images[0] || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=300&q=80'}
                        alt={item.product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                        {item.product.brand}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Unit Price: <span className="font-semibold text-gray-800">{formatNaira(item.product.price)}</span>
                      </p>
                      {item.product.stock <= 5 && (
                        <p className="text-[11px] text-amber-600 font-semibold">
                          Only {item.product.stock} units remaining in stock
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Controls: Minus, Plus, Subtotal, Remove */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                    {/* VISIBLE MINUS AND PLUS CONTROLS (Mandatory) */}
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-2xs">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, -1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-extrabold text-base transition disabled:opacity-30"
                        title="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-9 text-center font-bold text-sm text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-extrabold text-base transition disabled:opacity-30"
                        title="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-24">
                      <span className="text-[10px] text-gray-400 block uppercase">Subtotal</span>
                      <span className="text-sm sm:text-base font-extrabold text-[#0A1931]">
                        {formatNaira(itemSubtotal)}
                      </span>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Shopping button */}
          <div className="pt-2">
            <button
              onClick={onContinueShopping}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 hover:text-[#0A1931] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4 sticky top-24">
            <h2 className="text-base font-bold text-[#0A1931] pb-3 border-b border-gray-100 uppercase tracking-wide">
              Order Summary
            </h2>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-gray-900">{formatNaira(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Showroom Pickup:</span>
                <span className="text-emerald-700 font-bold">₦0 (FREE)</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Port Harcourt Delivery:</span>
                <span className="font-semibold text-gray-900">Calculated at checkout</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
              <span className="text-sm font-bold text-gray-900">Estimated Total:</span>
              <span className="text-xl font-black text-[#0A1931]">
                {formatNaira(cartSubtotal)}
              </span>
            </div>

            {/* Proceed to Checkout */}
            <button
              onClick={() => {
                if (!currentUser && onOpenAuth) {
                  onOpenAuth('signin', onProceedToCheckout);
                } else {
                  onProceedToCheckout();
                }
              }}
              className="w-full bg-[#D91E2A] hover:bg-[#b81822] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-md text-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {!currentUser && (
              <p className="text-[11px] text-gray-500 text-center font-medium">
                You will be prompted to sign in or register before completing order.
              </p>
            )}

            {/* Save to Buy Option */}
            <div className="pt-3 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500 mb-2">Want to pay in easy installments?</p>
              <button
                onClick={() => {
                  if (cart.length > 0 && onSaveToBuyDirect) {
                    onSaveToBuyDirect(cart[0].product);
                  }
                }}
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs transition"
              >
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>Save to Buy (Pay in 1 - 4 Months)</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-2 text-[11px] text-gray-500 space-y-1.5">
              <div className="flex items-center gap-2">
                <Store className="w-3.5 h-3.5 text-[#0A1931]" />
                <span>Pickup available at 71 NTA Rd & 37 NTA Rd</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Official Nigerian Manufacturer Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
