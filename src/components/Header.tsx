import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
  Phone,
  MapPin,
  Clock,
  User as UserIcon,
  ShieldCheck,
  Percent,
  Sparkles,
  SearchCode
} from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, params?: any) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  searchQuery,
  onSearchChange,
  onSearchSubmit
}) => {
  const { cartCount, wishlist, isAdmin, adminModeOverride, setAdminModeOverride, currentUser, loginWithGoogle, logout } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Shop Now', view: 'shop' },
    { label: 'Categories', view: 'categories' },
    { label: 'Deals', view: 'shop', params: { filter: 'deal' }, icon: Percent, badge: 'Hot' },
    { label: 'New Arrivals', view: 'shop', params: { filter: 'new' }, icon: Sparkles },
    { label: 'Save to Buy', view: 'save-to-buy', badge: '3% - 7%' },
    { label: 'Track Order', view: 'track-order', icon: SearchCode },
    { label: 'About Us', view: 'about' },
    { label: 'Contact Us', view: 'contact' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      {/* Top Bar - Port Harcourt Showroom Notice & Contact */}
      <div className="bg-[#0A1931] text-white text-xs px-4 py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 text-gray-200">
              <MapPin className="w-3.5 h-3.5 text-[#D91E2A]" />
              <strong>Showroom 1:</strong> 71 NTA Rd, Mgbuoba | <strong>Showroom 2:</strong> Smart Choice Plaza (37 NTA Rd)
            </span>
            <span className="flex items-center gap-1.5 text-gray-200">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <a href="tel:+2348165896158" className="hover:text-white underline">+234 816 589 6158</a> / <a href="tel:+2348165929400" className="hover:text-white underline">+234 816 592 9400</a>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Port Harcourt, Rivers State</span>
            <div className="h-3 w-[1px] bg-gray-600" />
            <button
              onClick={() => onNavigate('admin')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded font-semibold text-[11px] transition ${
                currentView.startsWith('admin') ? 'bg-[#D91E2A] text-white' : 'text-amber-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 md:gap-6">
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Official Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center focus:outline-none group text-left"
          >
            <img
              src="/assets/aistudio/IMG-20260926-WA0019_1__18539efc.jpg"
              alt="Smart Choice Electronics Group"
              className="h-10 sm:h-12 w-auto object-contain transition duration-200 group-hover:opacity-95"
            />
          </button>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-2xl hidden sm:block">
          <form onSubmit={onSearchSubmit} className="relative flex items-center">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                placeholder="Search appliances and electronics"
                className="w-full bg-white text-gray-900 placeholder-gray-400 text-sm rounded-full pl-4 pr-24 py-2 border border-red-300 focus:border-[#D91E2A] focus:ring-2 focus:ring-red-100 transition shadow-sm outline-none"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-4 bg-[#D91E2A] hover:bg-[#b81822] text-white text-xs font-semibold rounded-full flex items-center gap-1.5 transition shadow-sm"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Actions (Wishlist, Cart, My Account) */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Wishlist */}
          <button
            onClick={() => onNavigate('wishlist')}
            className="relative p-2 text-gray-700 hover:text-[#D91E2A] rounded-full hover:bg-gray-100 transition focus:outline-none"
            title="Wishlist"
          >
            <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#D91E2A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Icon with SMALL RED BADGE (no large orange/yellow background) */}
          <button
            onClick={() => onNavigate('cart')}
            className="relative p-2 text-gray-700 hover:text-[#0A1931] rounded-full hover:bg-gray-100 transition focus:outline-none flex items-center"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-[#D91E2A] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Account Dropdown */}
          <div className="relative">
            <button
              onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
              className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full hover:bg-gray-100 text-gray-700 text-xs font-semibold transition focus:outline-none"
            >
              <UserIcon className="w-5 h-5 text-gray-700" />
              <span className="hidden lg:inline text-xs">
                {currentUser ? currentUser.displayName || 'Account' : 'My Account'}
              </span>
            </button>

            {accountDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50 text-xs"
                onClick={() => setAccountDropdownOpen(false)}
              >
                {currentUser ? (
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-semibold text-gray-900 truncate">{currentUser.displayName || 'Customer'}</p>
                    <p className="text-gray-500 truncate text-[11px]">{currentUser.email}</p>
                  </div>
                ) : (
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">Welcome to Smart Choice</p>
                    <button
                      onClick={loginWithGoogle}
                      className="mt-1.5 w-full bg-[#0A1931] text-white py-1.5 px-3 rounded-lg text-xs font-medium hover:bg-slate-800 transition"
                    >
                      Sign In with Google
                    </button>
                  </div>
                )}

                <button
                  onClick={() => onNavigate('customer-dashboard')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 font-medium flex items-center gap-2"
                >
                  <UserIcon className="w-3.5 h-3.5 text-gray-500" />
                  My Orders & Dashboard
                </button>
                <button
                  onClick={() => onNavigate('save-to-buy')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 font-medium flex items-center gap-2"
                >
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  My Save to Buy Plans
                </button>
                <button
                  onClick={() => onNavigate('track-order')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 font-medium flex items-center gap-2"
                >
                  <SearchCode className="w-3.5 h-3.5 text-blue-600" />
                  Track Order
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={() => onNavigate('admin')}
                  className="w-full text-left px-4 py-2 hover:bg-amber-50 text-amber-700 font-semibold flex items-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Dashboard
                </button>
                {currentUser && (
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-medium"
                  >
                    Log Out
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 pb-2.5 sm:hidden">
        <form onSubmit={onSearchSubmit} className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search appliances and electronics"
            className="w-full bg-white text-gray-900 placeholder-gray-400 text-xs rounded-full pl-3.5 pr-20 py-2 border border-red-300 focus:border-[#D91E2A] outline-none"
          />
          <button
            type="submit"
            className="absolute right-1 top-1 bottom-1 px-3 bg-[#D91E2A] text-white text-xs font-semibold rounded-full flex items-center gap-1"
          >
            <Search className="w-3 h-3" />
            <span>Search</span>
          </button>
        </form>
      </div>

      {/* Primary Navigation Bar (Desktop) */}
      <nav className="hidden md:block bg-[#0A1931] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {navLinks.map((item, idx) => {
              const isActive = currentView === item.view && (!item.params || currentView === 'shop');
              return (
                <button
                  key={idx}
                  onClick={() => onNavigate(item.view, item.params)}
                  className={`px-3.5 py-2.5 text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-colors relative ${
                    isActive
                      ? 'text-[#D91E2A] bg-white/10'
                      : 'text-gray-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon && <item.icon className="w-3.5 h-3.5" />}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 text-[9px] uppercase px-1.5 py-0.2 bg-[#D91E2A] text-white rounded font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-xs text-amber-300 font-semibold py-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Direct Port Harcourt Delivery & Pickup
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 flex">
          <div className="w-4/5 max-w-sm bg-white h-full overflow-y-auto p-4 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <img
                  src="/assets/aistudio/IMG-20260926-WA0019_1__18539efc.jpg"
                  alt="Smart Choice"
                  className="h-9 w-auto"
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded text-gray-500 hover:text-gray-900"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-4 space-y-1">
                {navLinks.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onNavigate(item.view, item.params);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-800 hover:bg-red-50 hover:text-[#D91E2A] flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      {item.icon && <item.icon className="w-4 h-4 text-gray-500" />}
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="text-[10px] bg-red-100 text-[#D91E2A] px-2 py-0.5 rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="border-t border-gray-200 my-4 pt-4 space-y-2 text-xs">
                <button
                  onClick={() => {
                    onNavigate('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 bg-[#0A1931] text-white py-2 rounded-lg font-bold"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Admin Dashboard
                </button>
              </div>
            </div>

            {/* Showrooms in mobile drawer */}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-xs text-gray-600 space-y-1.5">
              <p className="font-bold text-gray-900 text-[11px] uppercase tracking-wider">Port Harcourt Showrooms</p>
              <p className="text-[11px] leading-snug">
                <strong>Showroom 1:</strong> 71 NTA Rd, Mgbuoba
              </p>
              <p className="text-[11px] leading-snug">
                <strong>Showroom 2:</strong> Smart Choice Plaza (37 NTA Rd)
              </p>
              <a
                href="https://wa.me/2348165896158"
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-1 text-emerald-700 font-bold hover:underline"
              >
                WhatsApp: +234 816 589 6158
              </a>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
