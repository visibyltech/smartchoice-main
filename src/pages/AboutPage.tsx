import React from 'react';
import { ShieldCheck, Store, Clock, Award, Users, MapPin, Truck } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (view: string, params?: any) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#D91E2A] bg-red-50 px-3 py-1 rounded-full">
          About Smart Choice Electronics Group
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-[#0A1931] leading-tight">
          Port Harcourt's Leading Destination for Premium Electronics & Uninterrupted Power
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Smart Choice Electronics Group was founded to provide Nigerian households and businesses with 100% genuine consumer electronics, industrial generators, solar inverters, and modern furnishings—backed by reliable local warranty support and flexible payment plans.
        </p>
      </div>

      {/* Showroom presence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-gray-50 p-6 sm:p-10 rounded-3xl border border-gray-200">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <Store className="w-4 h-4 text-emerald-700" />
            <span>Dual Port Harcourt Showroom Presence</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
            Visit Our Showrooms at 71 NTA Road & Smart Choice Plaza
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Unlike virtual dropshippers, Smart Choice maintains two large walk-in showrooms situated along NTA Road, Mgbuoba, Port Harcourt. Customers can inspect televisions, test soundbars, view solar generators, and choose showroom collection or express home delivery.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('contact')}
              className="bg-[#0A1931] hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-full transition shadow-xs"
            >
              Get Directions & Showroom Details
            </button>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
          <img
            src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1000&q=80"
            alt="Electronics Showroom"
            className="w-full h-64 sm:h-80 object-cover"
          />
        </div>
      </div>

      {/* Four Pillars of Smart Choice */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-sm">100% Originality Guarantee</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Direct partnerships with official manufacturers: Hisense, LG, Panasonic, Firman, Perkins, Felicity Solar, and Luminous.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-sm">Save to Buy System</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Transparent 1 to 4 month installment plans at fixed 3%, 5%, and 7% rates to empower customers to own goods without financial strain.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-[#D91E2A] flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-sm">Fast Logistics & Care</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Carefully packaged transit across Port Harcourt and Rivers State with on-site technician support for generators and ACs.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-sm">Verified Specifications</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Accurate product dimensions, true wattages, genuine copper windings, and authentic manufacturer warranties.
          </p>
        </div>
      </div>
    </div>
  );
};
