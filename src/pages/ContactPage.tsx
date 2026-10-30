import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
  Clock,
  Send,
  CheckCircle2,
  Store
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { submitContactForm, showrooms } = useStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [preferredShowroom, setPreferredShowroom] = useState('Showroom 1 (71 NTA Road)');

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitContactForm({
        firstName,
        lastName,
        email,
        phone,
        message,
        showroom: preferredShowroom
      });
      setIsSubmitting(false);
      setSubmitted(true);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      setIsSubmitting(false);
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Page Title */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-black text-[#0A1931]">
          Contact Smart Choice Electronics Group
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          We operate two physical electronics showrooms in Port Harcourt, Rivers State. Visit us in person, chat with our showroom team on WhatsApp, or send an inquiry below.
        </p>
      </div>

      {/* SHOWROOM 1 & SHOWROOM 2 CARDS (Both Must Be Fully Displayed as Requested) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Showroom 1 Card */}
        <div className="bg-white rounded-3xl border-2 border-red-100 p-6 sm:p-8 shadow-xs space-y-5 hover:border-red-300 transition">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-red-50 text-[#D91E2A] rounded-xl">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-lg">Showroom 1 (Main NTA)</h3>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Open for Showroom Collection
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-gray-700">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#D91E2A] shrink-0 mt-0.5" />
              <p>
                <strong>Showroom Address:</strong><br />
                71 NTA Road, Mgbuoba, Port Harcourt, Rivers State, Nigeria.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <strong className="block text-gray-900">Telephone / Calls:</strong>
                <a href="tel:+2348165896158" className="text-blue-700 hover:underline font-bold">
                  +234 816 589 6158
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <strong className="block text-gray-900">Working Hours:</strong>
                <span>Monday – Saturday: 8:00 AM – 6:30 PM</span>
              </div>
            </div>
          </div>

          {/* Action Links for Showroom 1: Clickable Call, WhatsApp Inquiry, Google Maps Directions */}
          <div className="pt-3 border-t border-gray-100 flex flex-wrap gap-2.5">
            <a
              href="https://wa.me/2348165896158?text=Hello%20Smart%20Choice%20Showroom%201,%20I%20am%20inquiring%20about%20your%20electronics%20in%20Port%20Harcourt"
              target="_blank"
              rel="noreferrer"
              className="flex-1 min-w-36 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs transition shadow-2xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Showroom 1</span>
            </a>

            <a
              href="https://www.google.com/maps/search/?api=1&query=71+NTA+Road+Mgbuoba+Port+Harcourt+Rivers+State"
              target="_blank"
              rel="noreferrer"
              className="flex-1 min-w-36 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs transition border border-gray-200"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gray-600" />
              <span>Google Maps Directions</span>
            </a>
          </div>
        </div>

        {/* Showroom 2 Card */}
        <div className="bg-white rounded-3xl border-2 border-blue-100 p-6 sm:p-8 shadow-xs space-y-5 hover:border-blue-300 transition">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-blue-50 text-[#0A1931] rounded-xl">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-lg">Showroom 2 (Smart Choice Plaza)</h3>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                  Plaza & Bulk Inverters
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-gray-700">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p>
                <strong>Showroom Address:</strong><br />
                Smart Choice Plaza, 37 NTA Road, Mgbuoba, Port Harcourt, Rivers State, Nigeria.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <strong className="block text-gray-900">Telephone / Calls:</strong>
                <a href="tel:+2348165929400" className="text-blue-700 hover:underline font-bold">
                  +234 816 592 9400
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <strong className="block text-gray-900">Working Hours:</strong>
                <span>Monday – Saturday: 8:00 AM – 6:30 PM</span>
              </div>
            </div>
          </div>

          {/* Action Links for Showroom 2 */}
          <div className="pt-3 border-t border-gray-100 flex flex-wrap gap-2.5">
            <a
              href="https://wa.me/2348165929400?text=Hello%20Smart%20Choice%20Showroom%202,%20I%20am%20inquiring%20about%20your%20products%20at%20Smart%20Choice%20Plaza"
              target="_blank"
              rel="noreferrer"
              className="flex-1 min-w-36 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs transition shadow-2xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Showroom 2</span>
            </a>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Smart+Choice+Plaza+37+NTA+Road+Mgbuoba+Port+Harcourt"
              target="_blank"
              rel="noreferrer"
              className="flex-1 min-w-36 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs transition border border-gray-200"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gray-600" />
              <span>Google Maps Directions</span>
            </a>
          </div>
        </div>
      </div>

      {/* Official Business Email */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-red-50 to-slate-50 border border-red-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#D91E2A] text-white rounded-xl">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">Official Group Business Email</h4>
            <a
              href="mailto:smartchoiceglobalresourcesltd@gmail.com"
              className="text-[#D91E2A] hover:underline font-bold text-xs sm:text-sm"
            >
              smartchoiceglobalresourcesltd@gmail.com
            </a>
          </div>
        </div>
        <span className="text-gray-500 font-medium">Prompt response within 1 business hour</span>
      </div>

      {/* Contact Inquiry Form */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xs max-w-2xl mx-auto space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-lg sm:text-xl font-bold text-[#0A1931]">
            Send an Inquiry to Our Port Harcourt Sales Team
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Fill out your inquiry and our team will get back to you via phone, WhatsApp, or email.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-emerald-950 text-base">Inquiry Sent Successfully!</h3>
            <p className="text-xs text-emerald-800 max-w-md mx-auto">
              Thank you for contacting Smart Choice Electronics Group. Our sales specialists at your selected showroom will contact you promptly.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-3 text-xs font-bold text-emerald-700 underline"
            >
              Send another inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="e.g. Somto"
                  className="w-full border border-gray-300 rounded-xl p-2.5 focus:border-[#D91E2A] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="e.g. Amadi"
                  className="w-full border border-gray-300 rounded-xl p-2.5 focus:border-[#D91E2A] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="somto@example.com"
                  className="w-full border border-gray-300 rounded-xl p-2.5 focus:border-[#D91E2A] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Phone Number / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+234 803 000 0000"
                  className="w-full border border-gray-300 rounded-xl p-2.5 focus:border-[#D91E2A] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Preferred Showroom for Pickup / Inquiry:
              </label>
              <select
                value={preferredShowroom}
                onChange={e => setPreferredShowroom(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-2.5 bg-white text-xs font-semibold focus:border-[#D91E2A] outline-none"
              >
                <option value="Showroom 1 (71 NTA Road)">Showroom 1 — 71 NTA Road, Mgbuoba</option>
                <option value="Showroom 2 (Smart Choice Plaza, 37 NTA Road)">Showroom 2 — Smart Choice Plaza (37 NTA Road)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Your Message or Appliance Question *</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Ask about product availability, Save to Buy plans, generator installations, or showroom pickup..."
                className="w-full border border-gray-300 rounded-xl p-3 focus:border-[#D91E2A] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#D91E2A] hover:bg-[#b81822] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Sending Message...' : 'Submit Inquiry'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
