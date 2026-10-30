import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatNaira } from '../utils/formatters';
import {
  User,
  Package,
  Clock,
  Heart,
  MapPin,
  CreditCard,
  LogOut,
  LogIn,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface CustomerDashboardPageProps {
  onNavigate: (view: string, params?: any) => void;
}

export const CustomerDashboardPage: React.FC<CustomerDashboardPageProps> = ({ onNavigate }) => {
  const {
    currentUser,
    loginWithGoogle,
    logout,
    orders,
    saveToBuyPlans,
    paymentReceipts,
    wishlist
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'plans' | 'payments' | 'profile'>('orders');

  // Customer's own orders (filter by user ID or customer email if logged in)
  const myOrders = orders.filter(
    o =>
      (currentUser && (o.customerId === currentUser.uid || o.customerEmail.toLowerCase() === currentUser.email?.toLowerCase())) ||
      !currentUser
  );

  const myPlans = saveToBuyPlans.filter(
    p =>
      (currentUser && (p.customerId === currentUser.uid || p.customerEmail.toLowerCase() === currentUser.email?.toLowerCase())) ||
      !currentUser
  );

  const myReceipts = paymentReceipts.filter(
    r =>
      (currentUser && (r.customerId === currentUser.uid || r.customerEmail?.toLowerCase() === currentUser.email?.toLowerCase())) ||
      !currentUser
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Account Header */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-[#0A1931] text-white flex items-center justify-center font-bold text-2xl">
            {currentUser?.displayName ? currentUser.displayName[0].toUpperCase() : <User className="w-8 h-8" />}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              {currentUser ? currentUser.displayName || 'Valued Customer' : 'Customer Account Portal'}
            </h1>
            <p className="text-xs text-gray-500">
              {currentUser ? currentUser.email : 'Sign in to sync your order history and Save to Buy plans'}
            </p>
          </div>
        </div>

        <div>
          {currentUser ? (
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-[#D91E2A] hover:bg-red-100 rounded-xl text-xs font-bold transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0A1931] text-white hover:bg-slate-800 rounded-xl text-xs font-bold transition shadow-sm"
            >
              <LogIn className="w-4 h-4 text-emerald-400" />
              <span>Sign In with Google</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-[#0A1931] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({myOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('plans')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'plans'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Save to Buy Plans ({myPlans.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'payments'
              ? 'bg-[#D91E2A] text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payment Receipts ({myReceipts.length})</span>
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {myOrders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-xs space-y-3">
              <Package className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="font-bold text-gray-800">No order history recorded</p>
              <button
                onClick={() => onNavigate('shop')}
                className="px-5 py-2 bg-[#D91E2A] text-white font-bold rounded-full hover:bg-[#b81822]"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#D91E2A] bg-red-50 px-2 py-0.5 rounded">
                        {order.orderRef}
                      </span>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Placed: {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                      <span className="font-black text-gray-900 text-sm">
                        {formatNaira(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100 text-xs">
                    {order.items.map(item => (
                      <div key={item.product.id} className="py-2 flex items-center justify-between">
                        <span className="font-medium text-gray-800 truncate mr-2">
                          {item.quantity}x {item.product.name}
                        </span>
                        <span className="font-bold text-gray-900 shrink-0">
                          {formatNaira(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-between items-center text-xs">
                    <span className="text-gray-500">
                      Fulfilment: <strong>{order.fulfillmentType === 'pickup' ? 'Showroom Pickup' : 'Home Delivery'}</strong>
                    </span>
                    <button
                      onClick={() => onNavigate('track-order')}
                      className="text-blue-700 font-bold hover:underline"
                    >
                      View Live Timeline →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Save to Buy Plans */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          {myPlans.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-xs space-y-3">
              <Clock className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="font-bold text-gray-800">No active Save to Buy plans</p>
              <button
                onClick={() => onNavigate('save-to-buy')}
                className="px-5 py-2 bg-emerald-700 text-white font-bold rounded-full hover:bg-emerald-800"
              >
                Configure a Plan
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {myPlans.map(plan => (
                <div key={plan.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {plan.planRef}
                      </span>
                      <h3 className="font-bold text-gray-900 text-sm mt-1">{plan.productName}</h3>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                      {plan.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Saved:</span>
                      <span className="font-bold text-emerald-700">{formatNaira(plan.amountPaid)} / {formatNaira(plan.totalPayable)}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full"
                        style={{ width: `${Math.min(100, Math.round((plan.amountPaid / plan.totalPayable) * 100))}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-400">{plan.durationMonths} Months ({plan.interestRatePercent}% Interest)</span>
                      <span className="font-bold text-red-600">Balance: {formatNaira(plan.balance)}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-xs">
                    <span className="text-[11px] text-gray-500">
                      Release Status: <strong>{plan.productReleased ? 'Released' : 'Locked'}</strong>
                    </span>
                    <button
                      onClick={() => onNavigate('save-to-buy')}
                      className="text-emerald-700 font-bold hover:underline"
                    >
                      Manage Installments →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Payment Receipts */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          {myReceipts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-xs text-gray-500">
              No payment receipts uploaded yet.
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 text-xs">
              {myReceipts.map(rec => (
                <div key={rec.id} className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-mono font-bold text-gray-700">{rec.paymentRef}</span>
                    <p className="font-bold text-gray-900 mt-0.5">
                      {rec.type === 'save_to_buy_installment' ? `Save to Buy Plan ${rec.planRef} (Installment #${rec.installmentNumber})` : `Order Payment (${rec.orderRef})`}
                    </p>
                    <p className="text-[11px] text-gray-400">{new Date(rec.createdAt).toLocaleString()}</p>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-gray-900 block text-sm">{formatNaira(rec.amount)}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      rec.status === 'verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rec.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rec.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
