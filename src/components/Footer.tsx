import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  CreditCard,
  Truck,
  RefreshCw,
  ExternalLink,
  MessageCircle,
  Clock
} from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, params?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { categories } = useStore();

  return (
    <footer className="bg-[#0A1931] text-gray-300 pt-12 pb-8 border-t-4 border-[#D91E2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-slate-800 text-sm">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-red-950/60 text-[#D91E2A]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Genuine Products</h4>
              <p className="text-xs text-gray-400 mt-0.5">Direct manufacturer warranty on all electronics</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-950/60 text-blue-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Save to Buy Plans</h4>
              <p className="text-xs text-gray-400 mt-0.5">Lock prices at 3%, 5%, or 7% fixed interest</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-950/60 text-emerald-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Port Harcourt Delivery</h4>
              <p className="text-xs text-gray-400 mt-0.5">Fast home delivery or free showroom pickup</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950/60 text-amber-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Secure Payment Options</h4>
              <p className="text-xs text-gray-400 mt-0.5">Bank transfer, Save to Buy, & Klump BNPL</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-10 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/IMG-20260926-WA0019_1__18539efc.jpg"
                alt="Smart Choice Electronics Group"
                className="h-12 w-auto object-contain bg-white rounded p-1"
              />
            </div>
            <p className="text-xs text-gray-400 leading-relaxed pr-4">
              Smart Choice Electronics Group is Port Harcourt's trusted destination for genuine home appliances, power generation, solar systems, televisions, and contemporary living solutions.
            </p>
            <div className="text-xs space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D91E2A]" />
                <a
                  href="mailto:smartchoiceglobalresourcesltd@gmail.com"
                  className="hover:text-white transition underline"
                >
                  smartchoiceglobalresourcesltd@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Showroom 1 & 2 Port Harcourt Locations */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider text-amber-400">
              Our Port Harcourt Showrooms
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Showroom 1 */}
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <p className="font-bold text-white text-sm">Showroom 1 (Main NTA)</p>
                <p className="text-gray-400 leading-snug">
                  71 NTA Road, Mgbuoba, Port Harcourt, Rivers State, Nigeria.
                </p>
                <div className="pt-1 flex flex-col gap-1.5">
                  <a
                    href="tel:+2348165896158"
                    className="flex items-center gap-1.5 text-blue-400 hover:text-white"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    +234 816 589 6158
                  </a>
                  <a
                    href="https://wa.me/2348165896158"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp Showroom 1
                  </a>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=71+NTA+Road+Mgbuoba+Port+Harcourt"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-gray-400 hover:text-white text-[11px]"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Google Maps Directions
                  </a>
                </div>
              </div>

              {/* Showroom 2 */}
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <p className="font-bold text-white text-sm">Showroom 2 (Plaza)</p>
                <p className="text-gray-400 leading-snug">
                  Smart Choice Plaza, 37 NTA Road, Mgbuoba, Port Harcourt, Rivers State, Nigeria.
                </p>
                <div className="pt-1 flex flex-col gap-1.5">
                  <a
                    href="tel:+2348165929400"
                    className="flex items-center gap-1.5 text-blue-400 hover:text-white"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    +234 816 592 9400
                  </a>
                  <a
                    href="https://wa.me/2348165929400"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp Showroom 2
                  </a>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=37+NTA+Road+Mgbuoba+Port+Harcourt"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-gray-400 hover:text-white text-[11px]"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Google Maps Directions
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links & Categories */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider text-amber-400">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition">
                  Shop All Electronics
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('save-to-buy')} className="hover:text-white transition text-emerald-400 font-semibold">
                  Save to Buy Plans (3%-7%)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('track-order')} className="hover:text-white transition">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition">
                  About Smart Choice
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition">
                  Contact Us & Directions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="text-amber-400 hover:underline font-semibold">
                  Staff & Admin Portal
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} Smart Choice Electronics Group. All Rights Reserved. Port Harcourt, Rivers State, Nigeria.
          </p>
          <div className="flex items-center space-x-6 text-gray-400">
            <span>Showroom Pickup Available</span>
            <span>•</span>
            <span>Moniepoint MFB & Sterling Bank Verified</span>
            <span>•</span>
            <span>Klump BNPL Integration</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
