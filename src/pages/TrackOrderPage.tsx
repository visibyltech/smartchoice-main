import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';
import { formatNaira } from '../utils/formatters';
import {
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  Store,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const TrackOrderPage: React.FC = () => {
  const { orders } = useStore();

  const [orderRef, setOrderRef] = useState('');
  const [identifier, setIdentifier] = useState(''); // email or phone
  const [searched, setSearched] = useState(false);
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);

    const refClean = orderRef.trim().toUpperCase();
    const idClean = identifier.trim().toLowerCase();

    const match = orders.find(o => {
      const matchesRef = o.orderRef.toUpperCase() === refClean;
      const matchesId =
        !idClean ||
        o.customerEmail.toLowerCase().includes(idClean) ||
        o.customerPhone.includes(idClean);
      return matchesRef && matchesId;
    });

    setFoundOrder(match || null);
  };

  const statusSteps: { key: OrderStatus; label: string }[] = [
    { key: 'received', label: 'Order Received' },
    { key: 'payment_pending', label: 'Payment Pending' },
    { key: 'payment_confirmed', label: 'Payment Confirmed' },
    { key: 'processing', label: 'Processing' },
    { key: 'preparing', label: 'Preparing Order' },
    { key: 'ready_for_pickup', label: 'Ready for Pickup / Dispatched' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' }
  ];

  const getStepState = (stepKey: OrderStatus, currentStatus: OrderStatus) => {
    if (currentStatus === 'cancelled') return 'cancelled';
    const stepOrder = [
      'received',
      'payment_pending',
      'payment_confirmed',
      'processing',
      'preparing',
      'ready_for_pickup',
      'dispatched',
      'out_for_delivery',
      'delivered'
    ];
    const currentIndex = stepOrder.indexOf(currentStatus);
    const stepIndex = stepOrder.indexOf(stepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0A1931]">
          Track Your Port Harcourt Order
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          Enter your unique Smart Choice Order Reference (e.g. SC-XXXXXX) and your email address or phone number.
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Order Reference *
            </label>
            <input
              type="text"
              required
              value={orderRef}
              onChange={e => setOrderRef(e.target.value)}
              placeholder="e.g. SC-829140"
              className="w-full border border-gray-300 rounded-xl p-3 text-sm font-mono uppercase focus:border-[#D91E2A] outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
              Customer Email or Phone Number *
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder="e.g. 0803 123 4567 or email@domain.com"
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:border-[#D91E2A] outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#D91E2A] hover:bg-[#b81822] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Track Order Status</span>
          </button>
        </form>
      </div>

      {/* Results View */}
      {searched && (
        <div className="space-y-6">
          {!foundOrder ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-xs space-y-2">
              <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
              <p className="font-bold text-red-900 text-sm">No matching order found</p>
              <p className="text-red-700 max-w-md mx-auto">
                Please double-check your Order Reference and customer telephone or email. Orders placed under other credentials can only be accessed with matching details.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
              {/* Order summary header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-2">
                <div>
                  <span className="text-xs font-mono font-bold text-[#D91E2A] bg-red-50 px-2.5 py-1 rounded">
                    {foundOrder.orderRef}
                  </span>
                  <h2 className="text-lg font-black text-gray-900 mt-1">
                    Order for {foundOrder.customerName}
                  </h2>
                  <p className="text-xs text-gray-500">
                    Placed on {new Date(foundOrder.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-gray-500 block">Total Amount</span>
                  <span className="text-xl font-black text-[#0A1931]">
                    {formatNaira(foundOrder.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Order Status Timeline
                </h3>

                <div className="relative pl-6 border-l-2 border-red-200 space-y-6 text-xs">
                  {foundOrder.timeline.map((evt, idx) => (
                    <div key={idx} className="relative">
                      {/* Step marker icon */}
                      <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#D91E2A] ring-4 ring-red-100 flex items-center justify-center text-white" />
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-gray-900 text-sm">{evt.title}</span>
                          <span className="text-[11px] text-gray-400">
                            {new Date(evt.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {evt.note && <p className="text-gray-600 mt-0.5">{evt.note}</p>}
                        {evt.actor && (
                          <span className="text-[10px] text-gray-400 font-medium">
                            Updated by: {evt.actor}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items in order */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Ordered Items
                </h4>
                <div className="divide-y divide-gray-100 text-xs">
                  {foundOrder.items.map(item => (
                    <div key={item.product.id} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.images[0] || ''}
                          alt={item.product.name}
                          className="w-10 h-10 object-contain bg-gray-50 rounded border p-1"
                        />
                        <div>
                          <p className="font-bold text-gray-900">{item.product.name}</p>
                          <p className="text-gray-500">Qty: {item.quantity} × {formatNaira(item.product.price)}</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">
                        {formatNaira(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fulfilment info */}
              <div className="p-4 bg-gray-50 rounded-2xl text-xs space-y-2 border border-gray-200">
                <div className="flex items-center gap-2 font-bold text-[#0A1931]">
                  {foundOrder.fulfillmentType === 'pickup' ? (
                    <>
                      <Store className="w-4 h-4 text-emerald-600" />
                      <span>Showroom Collection: {foundOrder.pickupShowroom === 'showroom-2' ? 'Showroom 2 (Smart Choice Plaza, 37 NTA Rd)' : 'Showroom 1 (71 NTA Road, Mgbuoba)'}</span>
                    </>
                  ) : (
                    <>
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span>Home Delivery: {foundOrder.deliveryAddress?.address}, {foundOrder.deliveryAddress?.lga}, {foundOrder.deliveryAddress?.state}</span>
                    </>
                  )}
                </div>
                <div className="text-gray-500 text-[11px]">
                  Payment Method: <strong>{foundOrder.paymentMethod === 'bank_transfer' ? 'Direct Bank Transfer' : foundOrder.paymentMethod === 'save_to_buy' ? 'Save to Buy Installments' : 'Klump BNPL'}</strong> • Status: <strong className="uppercase">{foundOrder.paymentStatus}</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
