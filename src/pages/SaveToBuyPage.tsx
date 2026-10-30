import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, SaveToBuyPlan, SaveToBuyDuration, SaveToBuyFrequency } from '../types';
import { formatNaira, calculateSaveToBuy } from '../utils/formatters';
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  CreditCard,
  Copy,
  Check,
  Upload,
  ArrowRight,
  AlertTriangle,
  Lock,
  Unlock,
  Package,
  Store,
  Truck
} from 'lucide-react';

interface SaveToBuyPageProps {
  initialProduct?: Product;
  onNavigateToProduct: (product: Product) => void;
  onStartCheckout: (product: Product) => void;
}

export const SaveToBuyPage: React.FC<SaveToBuyPageProps> = ({
  initialProduct,
  onNavigateToProduct,
  onStartCheckout
}) => {
  const {
    products,
    saveToBuyPlans,
    storeBankAccounts,
    submitInstallmentPayment
  } = useStore();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    initialProduct || products[0] || null
  );
  const [duration, setDuration] = useState<SaveToBuyDuration>(3);
  const [frequency, setFrequency] = useState<SaveToBuyFrequency>('monthly');

  // Installment payment modal state
  const [payingPlan, setPayingPlan] = useState<SaveToBuyPlan | null>(null);
  const [selectedInstallmentNumber, setSelectedInstallmentNumber] = useState<number>(1);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<string>('Moniepoint MFB (5240879532)');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // Active calculator
  const activePrice = selectedProduct ? selectedProduct.price : 100000;
  const calc = calculateSaveToBuy(activePrice, duration, frequency);

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedAccount(num);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const handleInstallmentReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setReceiptPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmitInstallment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingPlan || !receiptPreview) return;

    const item = payingPlan.installmentsSchedule.find(
      i => i.installmentNumber === selectedInstallmentNumber
    );
    const amount = item?.amountDue || payingPlan.installmentAmount;

    setIsSubmittingPayment(true);
    try {
      await submitInstallmentPayment(
        payingPlan.id,
        selectedInstallmentNumber,
        amount,
        receiptPreview,
        receiptFile?.name || 'receipt.jpg',
        selectedBank.includes('Moniepoint') ? 'Moniepoint MFB' : 'Sterling Bank PLC',
        selectedBank.includes('5240879532') ? '5240879532' : '0142262389'
      );
      setIsSubmittingPayment(false);
      setPayingPlan(null);
      setReceiptFile(null);
      setReceiptPreview(null);
    } catch (err) {
      setIsSubmittingPayment(false);
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-10">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0A1931] via-slate-900 to-emerald-950 text-white p-6 sm:p-10 shadow-xl border border-emerald-900/40">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/80 text-white text-xs font-bold tracking-wide">
            <Clock className="w-3.5 h-3.5" />
            <span>OFFICIAL SAVE TO BUY SAVINGS SCHEME</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Lock Down Prices, Save in Installments & Own Genuine Electronics
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Smart Choice makes home appliances accessible. Choose your dream television, refrigerator, air conditioner, or generator, pick 1 to 4 months duration with fixed 3%, 5%, or 7% rates, and make flexible weekly or monthly transfers.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-emerald-300">
            <span className="flex items-center gap-1">✓ Fixed Rates: 1m (3%), 2m (5%), 3m (7%), 4m (7%)</span>
            <span className="flex items-center gap-1">✓ No hidden bank charges</span>
            <span className="flex items-center gap-1">✓ Pick up at Port Harcourt showrooms</span>
          </div>
        </div>
      </div>

      {/* Interactive Calculator & Starter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Product & Duration Selectors */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="text-base sm:text-lg font-bold text-[#0A1931] flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-700" />
              <span>Step 1: Choose Your Product & Plan</span>
            </h2>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Live Rate Engine
            </span>
          </div>

          {/* Select Product */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Select Product:
            </label>
            <select
              value={selectedProduct?.id || ''}
              onChange={e => {
                const prod = products.find(p => p.id === e.target.value);
                if (prod) setSelectedProduct(prod);
              }}
              className="w-full border border-gray-300 rounded-xl p-3 text-xs sm:text-sm font-semibold text-gray-800 bg-white focus:border-emerald-600 outline-none shadow-2xs"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} — {formatNaira(p.price)} ({p.categoryName})
                </option>
              ))}
            </select>
          </div>

          {/* Selected Product Card Preview */}
          {selectedProduct && (
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
              <img
                src={selectedProduct.images[0] || ''}
                alt={selectedProduct.name}
                className="w-16 h-16 object-contain bg-white rounded-lg p-1 border shrink-0"
              />
              <div className="flex-1 min-w-0 text-xs">
                <span className="font-bold text-blue-900 uppercase text-[10px]">{selectedProduct.brand}</span>
                <p className="font-bold text-gray-900 truncate">{selectedProduct.name}</p>
                <p className="text-emerald-800 font-extrabold text-sm mt-0.5">{formatNaira(selectedProduct.price)}</p>
              </div>
              <button
                onClick={() => onNavigateToProduct(selectedProduct)}
                className="text-xs text-blue-700 hover:underline font-semibold shrink-0"
              >
                View Specs
              </button>
            </div>
          )}

          {/* Duration & Exact Rates */}
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Select Savings Duration:
              </label>
              <span className="text-[11px] text-gray-500 font-semibold">Max interest is 7%</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { months: 1, rate: 3 },
                { months: 2, rate: 5 },
                { months: 3, rate: 7 },
                { months: 4, rate: 7 }
              ].map(item => (
                <button
                  key={item.months}
                  type="button"
                  onClick={() => setDuration(item.months as any)}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center text-center transition ${
                    duration === item.months
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-2xs'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="text-sm font-black">{item.months} {item.months === 1 ? 'Month' : 'Months'}</span>
                  <span className="text-xs text-emerald-700 font-bold mt-0.5">{item.rate}% Interest</span>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Frequency */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Payment Frequency:
            </label>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setFrequency('monthly')}
                className={`p-3 rounded-xl border text-center transition ${
                  frequency === 'monthly'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-2xs'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="font-bold">Monthly Installments</div>
                <div className="text-[11px] text-gray-500">{duration} payments total</div>
              </button>

              <button
                type="button"
                onClick={() => setFrequency('weekly')}
                className={`p-3 rounded-xl border text-center transition ${
                  frequency === 'weekly'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-2xs'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="font-bold">Weekly Installments</div>
                <div className="text-[11px] text-gray-500">{duration * 4} payments total (4 wks/mo)</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Real-time Schedule & Total Payable Card */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
          <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0A1931] uppercase tracking-wide">
              Dynamic Savings Calculation
            </h2>
            <span className="text-xs font-extrabold text-[#D91E2A]">
              ₦100k = {duration === 1 ? '₦103k' : duration === 2 ? '₦105k' : '₦107k'} rate
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Product Cash Price:</span>
              <span className="font-bold text-gray-900">{formatNaira(activePrice)}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Interest Rate:</span>
              <span className="font-bold text-emerald-700">{calc.interestRatePercent}%</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Interest Amount:</span>
              <span className="font-bold text-emerald-700">+{formatNaira(calc.interestAmount)}</span>
            </div>

            <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline text-sm font-black text-gray-900">
              <span>Total Payable:</span>
              <span className="text-xl font-black text-emerald-800">{formatNaira(calc.totalPayable)}</span>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950">
              <span className="block text-[11px] uppercase font-bold text-emerald-800 tracking-wider">
                Estimated {frequency === 'weekly' ? 'Weekly' : 'Monthly'} Installment
              </span>
              <span className="text-lg font-black text-emerald-900">
                {formatNaira(calc.installmentAmount)}
              </span>
              <span className="text-xs text-emerald-700 block">
                across {calc.totalInstallments} installments
              </span>
            </div>
          </div>

          {/* Payment Schedule Dates Preview */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>Projected Payment Schedule</span>
            </h4>
            <div className="max-h-48 overflow-y-auto divide-y divide-gray-100 border border-gray-200 rounded-xl text-xs">
              {calc.schedule.map((inst, idx) => (
                <div key={idx} className="p-2 flex items-center justify-between hover:bg-gray-50">
                  <span className="font-semibold text-gray-700">
                    Installment #{inst.installmentNumber}
                  </span>
                  <span className="text-gray-500 font-mono text-[11px]">{inst.dueDate}</span>
                  <span className="font-bold text-gray-900">{formatNaira(inst.amountDue)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Launch Plan Button */}
          {selectedProduct && (
            <button
              onClick={() => onStartCheckout(selectedProduct)}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-md text-sm"
            >
              <span>Setup Plan for {selectedProduct.name.slice(0, 24)}...</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* MY ACTIVE SAVE TO BUY PLANS */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0A1931]">
              Customer Save to Buy Plans & Tracking
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Monitor your balances, submit installment receipts, track approvals, and await product release
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 w-fit">
            {saveToBuyPlans.length} {saveToBuyPlans.length === 1 ? 'Registered Plan' : 'Registered Plans'}
          </span>
        </div>

        {saveToBuyPlans.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-xs sm:text-sm">
            <Clock className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="font-semibold text-gray-800">You don't have any active Save to Buy plans yet.</p>
            <p className="mt-1 text-gray-500">Configure a plan above or select Save to Buy on any product page.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {saveToBuyPlans.map(plan => {
              const progressPercent = Math.min(
                100,
                Math.round((plan.amountPaid / plan.totalPayable) * 100)
              );

              return (
                <div
                  key={plan.id}
                  className="bg-gray-50/70 rounded-2xl border border-gray-200 p-5 space-y-4 hover:border-emerald-300 transition"
                >
                  {/* Plan Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        {plan.planRef}
                      </span>
                      <h3 className="font-bold text-gray-900 text-sm mt-1 line-clamp-1">
                        {plan.productName}
                      </h3>
                      <p className="text-[11px] text-gray-500">Customer: {plan.customerName}</p>
                    </div>

                    {/* Status Badge */}
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                      plan.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : plan.status === 'overdue'
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-blue-100 text-blue-800 border border-blue-300'
                    }`}>
                      {plan.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-600">Saved: {formatNaira(plan.amountPaid)}</span>
                      <span className="text-emerald-800">{progressPercent}% Paid</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-500">
                      <span>Total: {formatNaira(plan.totalPayable)}</span>
                      <span className="font-bold text-red-600">Balance: {formatNaira(plan.balance)}</span>
                    </div>
                  </div>

                  {/* Product Release Guard Badge */}
                  <div className={`p-2.5 rounded-xl text-xs flex items-center justify-between ${
                    plan.productReleased
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : plan.balance === 0
                      ? 'bg-amber-50 text-amber-900 border border-amber-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {plan.productReleased ? (
                        <Unlock className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <Lock className="w-4 h-4 text-gray-500" />
                      )}
                      <span className="font-bold text-[11px]">
                        {plan.productReleased
                          ? 'Product Released for Pickup / Delivery'
                          : plan.balance === 0
                          ? '100% Paid! Awaiting Admin Release Authorization'
                          : 'Product Release Locked (Balance remaining)'}
                      </span>
                    </div>
                  </div>

                  {/* Installments Breakdown */}
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] font-bold text-gray-700 uppercase">Installments:</p>
                    <div className="max-h-36 overflow-y-auto divide-y divide-gray-200 text-xs border border-gray-200 rounded-lg bg-white">
                      {plan.installmentsSchedule.map(inst => (
                        <div key={inst.installmentNumber} className="p-2 flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-gray-800">#{inst.installmentNumber}</span>
                            <span className="text-[10px] text-gray-400 ml-1.5">Due: {inst.dueDate}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">{formatNaira(inst.amountDue)}</span>

                            {inst.status === 'paid' && inst.receiptStatus === 'verified' ? (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                                Verified
                              </span>
                            ) : inst.receiptStatus === 'pending' ? (
                              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                                Pending Verification
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setPayingPlan(plan);
                                  setSelectedInstallmentNumber(inst.installmentNumber);
                                }}
                                className="text-[10px] bg-emerald-700 text-white px-2 py-1 rounded font-bold hover:bg-emerald-800 transition"
                              >
                                Pay & Upload
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pay Installment Modal */}
      {payingPlan && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-base font-bold text-[#0A1931]">
                Pay Save to Buy Installment #{selectedInstallmentNumber}
              </h3>
              <button
                onClick={() => setPayingPlan(null)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Plan: <strong>{payingPlan.planRef}</strong> ({payingPlan.productName})
            </p>

            {/* Bank Accounts with Copy Button */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-800">
                Transfer to Official Smart Choice Account:
              </label>
              {storeBankAccounts.map((b, idx) => (
                <div key={idx} className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#0A1931]">{b.bankName}</span>
                    <span className="block font-mono font-bold text-[#D91E2A]">{b.accountNumber}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(b.accountNumber)}
                    className="px-2.5 py-1 bg-white border border-red-300 rounded text-xs font-semibold hover:border-red-500"
                  >
                    {copiedAccount === b.accountNumber ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>

            {/* Receipt upload form */}
            <form onSubmit={handleSubmitInstallment} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Upload Transfer Receipt (JPG, PNG, PDF)
                </label>
                <input
                  type="file"
                  required
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleInstallmentReceiptChange}
                  className="text-xs border border-gray-300 rounded-lg p-2 w-full"
                />
              </div>

              {receiptPreview && (
                <div className="p-2 bg-gray-50 rounded border">
                  <img src={receiptPreview} alt="Receipt preview" className="h-20 object-contain mx-auto" />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPayingPlan(null)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayment || !receiptPreview}
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
                >
                  {isSubmittingPayment ? 'Submitting...' : 'Submit Receipt for Verification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
