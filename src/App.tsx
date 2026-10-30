/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { SaveToBuyPage } from './pages/SaveToBuyPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { WishlistPage } from './pages/WishlistPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { Product, Category, PaymentMethod } from './types';
import { formatNaira } from './utils/formatters';
import { CheckCircle2, ArrowRight, Store, Copy, Check, Clock } from 'lucide-react';

function AppContent() {
  const { products, categories, storeBankAccounts } = useStore();

  const [currentView, setCurrentView] = useState<string>('home');
  const [previousView, setPreviousView] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | undefined>(undefined);
  const [activeFilter, setActiveFilter] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  // Checkout specific parameters
  const [checkoutDirectProduct, setCheckoutDirectProduct] = useState<Product | undefined>(undefined);
  const [checkoutDirectQuantity, setCheckoutDirectQuantity] = useState<number>(1);
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<PaymentMethod>('bank_transfer');

  // Completed order/plan state
  const [completedEntity, setCompletedEntity] = useState<any | null>(null);
  const [completedType, setCompletedType] = useState<'order' | 'plan' | null>(null);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedProduct]);

  const handleNavigate = (view: string, params?: any) => {
    setPreviousView(currentView);
    if (params?.categorySlug) {
      setActiveCategorySlug(params.categorySlug);
    } else if (view !== 'shop') {
      setActiveCategorySlug(undefined);
    }

    if (params?.filter) {
      setActiveFilter(params.filter);
    } else {
      setActiveFilter(undefined);
    }

    setCurrentView(view);
  };

  const handleSelectProduct = (product: Product) => {
    setPreviousView(currentView);
    setSelectedProduct(product);
    setCurrentView('product');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setPreviousView(currentView);
      setCurrentView('shop');
    }
  };

  const handleCheckoutNow = (product: Product, quantity: number) => {
    setPreviousView(currentView);
    setCheckoutDirectProduct(product);
    setCheckoutDirectQuantity(quantity);
    setCheckoutPaymentMethod('bank_transfer');
    setCurrentView('checkout');
  };

  const handleSaveToBuyDirect = (product: Product) => {
    setPreviousView(currentView);
    setCheckoutDirectProduct(product);
    setCheckoutDirectQuantity(1);
    setCheckoutPaymentMethod('save_to_buy');
    setCurrentView('checkout');
  };

  const handleCartProceedCheckout = () => {
    setPreviousView('cart');
    setCheckoutDirectProduct(undefined);
    setCheckoutDirectQuantity(1);
    setCheckoutPaymentMethod('bank_transfer');
    setCurrentView('checkout');
  };

  const handleCheckoutSuccess = (orderOrPlan: any, type: 'order' | 'plan') => {
    setCompletedEntity(orderOrPlan);
    setCompletedType(type);
    setCurrentView('order-success');
  };

  const handleCopyAccount = (acc: string) => {
    navigator.clipboard.writeText(acc);
    setCopiedBank(acc);
    setTimeout(() => setCopiedBank(null), 2500);
  };

  // If in admin mode
  if (currentView === 'admin') {
    return <AdminDashboard onExitAdmin={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-gray-900 font-sans selection:bg-[#D91E2A] selection:text-white">
      {/* Universal Compact Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onSaveToBuyDirect={handleSaveToBuyDirect}
          />
        )}

        {currentView === 'shop' && (
          <ShopPage
            initialCategorySlug={activeCategorySlug}
            initialFilter={activeFilter}
            onSelectProduct={handleSelectProduct}
            onSaveToBuyDirect={handleSaveToBuyDirect}
          />
        )}

        {currentView === 'categories' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            <div className="text-center space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0A1931]">All Product Categories</h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Browse our complete selection of original home appliances, industrial power generators, and inverters
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map(c => {
                const count = products.filter(p => p.categoryId === c.id).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => handleNavigate('shop', { categorySlug: c.slug })}
                    className="p-4 bg-white rounded-2xl border border-gray-200 hover:border-[#D91E2A] hover:shadow-md transition text-left space-y-2 group"
                  >
                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                      <img
                        src={c.image || 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80'}
                        alt={c.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#D91E2A] transition">
                        {c.name}
                      </h3>
                      <p className="text-xs text-gray-500">{count} products available</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentView === 'product' && selectedProduct && (
          <ProductPage
            product={selectedProduct}
            onBack={() => setCurrentView(previousView || 'shop')}
            onCheckoutNow={handleCheckoutNow}
            onSaveToBuyDirect={handleSaveToBuyDirect}
          />
        )}

        {currentView === 'cart' && (
          <CartPage
            onContinueShopping={() => setCurrentView('shop')}
            onProceedToCheckout={handleCartProceedCheckout}
            onSaveToBuyDirect={handleSaveToBuyDirect}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            directProduct={checkoutDirectProduct}
            directQuantity={checkoutDirectQuantity}
            initialPaymentMethod={checkoutPaymentMethod}
            onSuccess={handleCheckoutSuccess}
            onCancel={() => setCurrentView(previousView || 'cart')}
          />
        )}

        {currentView === 'save-to-buy' && (
          <SaveToBuyPage
            initialProduct={checkoutDirectProduct || selectedProduct || undefined}
            onNavigateToProduct={handleSelectProduct}
            onStartCheckout={handleSaveToBuyDirect}
          />
        )}

        {currentView === 'track-order' && <TrackOrderPage />}

        {currentView === 'about' && <AboutPage onNavigate={handleNavigate} />}

        {currentView === 'contact' && <ContactPage />}

        {currentView === 'wishlist' && (
          <WishlistPage
            onSelectProduct={handleSelectProduct}
            onSaveToBuyDirect={handleSaveToBuyDirect}
            onContinueShopping={() => setCurrentView('shop')}
          />
        )}

        {currentView === 'customer-dashboard' && (
          <CustomerDashboardPage onNavigate={handleNavigate} />
        )}

        {/* ORDER / PLAN SUCCESS CONFIRMATION SCREEN */}
        {currentView === 'order-success' && completedEntity && (
          <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                {completedType === 'plan' ? `Plan Ref: ${completedEntity.planRef}` : `Order Ref: ${completedEntity.orderRef}`}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
                {completedType === 'plan' ? 'Save to Buy Plan Activated!' : 'Order Placed Successfully!'}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                Thank you for choosing Smart Choice Electronics Group. A confirmation has been generated for customer <strong>{completedEntity.customerName}</strong>.
              </p>
            </div>

            {/* Bank details card if bank transfer */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 text-left space-y-3 shadow-xs">
              <h3 className="font-bold text-xs uppercase text-gray-700 tracking-wider">
                Smart Choice Corporate Bank Accounts
              </h3>
              <p className="text-xs text-gray-600">
                If you have not completed your transfer, please send to any of our Port Harcourt business accounts below:
              </p>

              <div className="space-y-2 text-xs">
                {storeBankAccounts.map((b, idx) => (
                  <div key={idx} className="p-3 bg-red-50/50 border border-red-200 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#0A1931]">{b.bankName}</p>
                      <p className="text-gray-500 text-[11px]">{b.accountName}</p>
                      <p className="font-mono text-sm font-bold text-[#D91E2A] mt-0.5">{b.accountNumber}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyAccount(b.accountNumber)}
                      className="px-3 py-1 bg-white border border-red-300 rounded text-xs font-semibold hover:border-red-500"
                    >
                      {copiedBank === b.accountNumber ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              {completedType === 'plan' ? (
                <button
                  onClick={() => setCurrentView('save-to-buy')}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-6 rounded-xl text-xs transition shadow-md"
                >
                  View My Save to Buy Dashboard
                </button>
              ) : (
                <button
                  onClick={() => setCurrentView('track-order')}
                  className="bg-[#D91E2A] hover:bg-[#b81822] text-white font-bold py-3 px-6 rounded-xl text-xs transition shadow-md"
                >
                  Track Live Order Timeline
                </button>
              )}
              <button
                onClick={() => setCurrentView('home')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-xl text-xs transition"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Official Footer with Both Showrooms */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
