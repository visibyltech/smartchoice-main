import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, PaymentMethod, FulfillmentType } from '../types';
import { formatNaira, calculateSaveToBuy } from '../utils/formatters';
import {
  CreditCard,
  Clock,
  Zap,
  Copy,
  Check,
  Upload,
  MapPin,
  Store,
  Truck,
  AlertCircle,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Loader2
} from 'lucide-react';

interface CheckoutPageProps {
  directProduct?: Product;
  directQuantity?: number;
  initialPaymentMethod?: PaymentMethod;
  onSuccess: (orderOrPlan: any, type: 'order' | 'plan') => void;
  onCancel: () => void;
  onOpenAuth?: (mode?: 'signin' | 'register') => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  directProduct,
  directQuantity = 1,
  initialPaymentMethod = 'bank_transfer',
  onSuccess,
  onCancel,
  onOpenAuth
}) => {
  const {
    cart,
    cartSubtotal,
    createOrder,
    createSaveToBuyPlan,
    showrooms,
    storeBankAccounts,
    storeConfig,
    currentUser
  } = useStore();

  // If a direct product was passed, use it; otherwise use full cart
  const checkoutItems = directProduct
    ? [{ product: directProduct, quantity: directQuantity }]
    : cart;

  const itemsSubtotal = directProduct
    ? directProduct.price * directQuantity
    : cartSubtotal;

  // Selected Payment Method: 'bank_transfer' (Buy & Pay Now) | 'save_to_buy' | 'klump'
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialPaymentMethod);

  // Fulfillment Type: 'pickup' | 'delivery'
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('pickup');
  const [selectedShowroom, setSelectedShowroom] = useState<string>(showrooms[0]?.id || 'showroom-1');

  // Customer Contact Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('');

  // Auto-sync customer details when currentUser signs in
  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.email && !email) setEmail(currentUser.email);
      if (currentUser.displayName && (!firstName && !lastName)) {
        const parts = currentUser.displayName.trim().split(' ');
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || '');
      }
    }
  }, [currentUser]);

  // Delivery Address Fields (only revealed and required when Home Delivery is selected)
  const [state, setState] = useState('Rivers State');
  const [lga, setLga] = useState('Obio-Akpor (Port Harcourt)');
  const [address, setAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Delivery fee calculation
  const deliveryFee = fulfillmentType === 'delivery' ? 5000 : 0;
  const grandTotal = itemsSubtotal + deliveryFee;

  // Save to Buy state
  const [durationMonths, setDurationMonths] = useState<1 | 2 | 3 | 4>(3);
  const [frequency, setFrequency] = useState<'weekly' | 'monthly'>('monthly');

  // Bank Transfer Receipt Upload state
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [copiedBankIndex, setCopiedBankIndex] = useState<number | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Save to Buy calculations
  const primaryProduct = checkoutItems[0]?.product;
  const saveToBuyCalc = primaryProduct
    ? calculateSaveToBuy(primaryProduct.price * (checkoutItems[0]?.quantity || 1), durationMonths, frequency)
    : null;

  // Copy Account Number with "Account number copied" tooltip
  const handleCopyAccount = (accNumber: string, index: number) => {
    navigator.clipboard.writeText(accNumber);
    setCopiedBankIndex(index);
    setTimeout(() => setCopiedBankIndex(null), 2500);
  };

  // Handle receipt file upload (JPG, JPEG, PNG, PDF)
  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate authentication before allowing checkout to proceed
    if (!currentUser) {
      setErrorMessage('A customer account is required to place an order or activate Save to Buy. Please sign in or create an account.');
      if (onOpenAuth) onOpenAuth('signin');
      return;
    }

    if (!firstName || !lastName || !email || !phone) {
      setErrorMessage('Please provide your first name, last name, email address, and phone number.');
      return;
    }

    if (fulfillmentType === 'delivery' && (!address || !lga || !state)) {
      setErrorMessage('Please provide your complete delivery street address, LGA, and State.');
      return;
    }

    if (paymentMethod === 'save_to_buy' && !receiptFile) {
      setErrorMessage('Please transfer your first Save to Buy installment to one of the company accounts below and upload the transfer receipt before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (paymentMethod === 'bank_transfer') {
        // Receipt URL generation: in production can be signed upload to Cloudinary
        let receiptDataUrl = receiptPreview || undefined;
        let receiptName = receiptFile?.name || undefined;

        const order = await createOrder({
          customerName: `${firstName} ${lastName}`.trim(),
          customerEmail: email,
          customerPhone: phone,
          items: checkoutItems,
          subtotal: itemsSubtotal,
          deliveryFee,
          totalAmount: grandTotal,
          paymentMethod: 'bank_transfer',
          fulfillmentType,
          pickupShowroom: fulfillmentType === 'pickup' ? selectedShowroom : undefined,
          deliveryAddress: fulfillmentType === 'delivery' ? {
            state,
            lga,
            address,
            phone,
            notes: deliveryNotes
          } : undefined,
          receiptUrl: receiptDataUrl,
          receiptFileName: receiptName,
          notes: deliveryNotes
        });

        setIsSubmitting(false);
        onSuccess(order, 'order');
      } else if (paymentMethod === 'save_to_buy') {
        if (!primaryProduct) {
          throw new Error('Please select a product for Save to Buy.');
        }

        const plan = await createSaveToBuyPlan({
          customerName: `${firstName} ${lastName}`.trim(),
          customerEmail: email,
          customerPhone: phone,
          product: primaryProduct,
          durationMonths,
          paymentFrequency: frequency,
          fulfillmentType,
          pickupShowroom: fulfillmentType === 'pickup' ? selectedShowroom : undefined,
          deliveryAddress: fulfillmentType === 'delivery' ? {
            state,
            lga,
            address,
            phone,
            notes: deliveryNotes
          } : undefined,
          initialReceiptUrl: receiptPreview || undefined,
          initialReceiptFileName: receiptFile?.name || undefined,
          initialDepositAmount: saveToBuyCalc?.installmentAmount || 0,
          initialBankName: storeBankAccounts[0]?.bankName || '',
          initialAccountName: storeBankAccounts[0]?.accountName || '',
          initialAccountNumber: storeBankAccounts[0]?.accountNumber || ''
        });

        setIsSubmitting(false);
        onSuccess(plan, 'plan');
      } else if (paymentMethod === 'klump') {
        // Initiate real Klump checkout via backend endpoint
        const origin = window.location.origin.replace(/\/$/, '');
        const redirectUrl = `${origin}/track-order`;
        const orderRef = 'KLUMP-' + Date.now();

        const klumpResponse = await fetch('/api/klump/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: grandTotal,
            currency: 'NGN',
            redirect_url: redirectUrl,
            customer: {
              email,
              phone,
              firstname: firstName,
              lastname: lastName
            },
            items: checkoutItems.map(i => ({
              image_url: i.product.images[0] || '',
              item_url: window.location.href,
              name: i.product.name,
              unit_price: i.product.price,
              quantity: i.quantity
            })),
            order_reference: orderRef
          })
        });

        const rawText = await klumpResponse.text();
        let klumpData: any;
        try {
          klumpData = JSON.parse(rawText);
        } catch (parseErr) {
          console.error('[KLUMP ERROR] Unparseable response received from endpoint:', rawText);
          throw new Error(
            `Unable to connect to Klump checkout (${klumpResponse.status}). The server returned an unexpected format. Please ensure Vercel has finished deploying the latest serverless API.`
          );
        }

        if (klumpData.configured === false) {
          setErrorMessage(
            `Klump Notice: ${klumpData.message || 'Merchant keys are not configured.'} You can choose "Buy and Pay Now" via Moniepoint/Sterling Bank transfer or "Save to Buy" to complete your purchase immediately.`
          );
          setIsSubmitting(false);
          return;
        }

        if (!klumpResponse.ok || klumpData.status === 'error') {
          throw new Error(
            klumpData.message || klumpData.error || 'Klump transaction initiation failed. Please check customer details and try again.'
          );
        }

        if (klumpData.data?.checkout_url) {
          // Pre-record pending order so customer or admin can track it
          await createOrder({
            customerName: `${firstName} ${lastName}`.trim(),
            customerEmail: email,
            customerPhone: phone,
            items: checkoutItems,
            subtotal: itemsSubtotal,
            deliveryFee,
            totalAmount: grandTotal,
            paymentMethod: 'klump',
            fulfillmentType,
            pickupShowroom: fulfillmentType === 'pickup' ? selectedShowroom : undefined,
            deliveryAddress: fulfillmentType === 'delivery' ? {
              state,
              lga,
              address,
              phone,
              notes: deliveryNotes
            } : undefined,
            notes: `Klump BNPL Session: ${orderRef}`
          });

          // Forward to Klump's hosted checkout
          window.location.href = klumpData.data.checkout_url;
          return;
        } else {
          // Fallback if checkout_url is not returned
          const order = await createOrder({
            customerName: `${firstName} ${lastName}`.trim(),
            customerEmail: email,
            customerPhone: phone,
            items: checkoutItems,
            subtotal: itemsSubtotal,
            deliveryFee,
            totalAmount: grandTotal,
            paymentMethod: 'klump',
            fulfillmentType,
            pickupShowroom: fulfillmentType === 'pickup' ? selectedShowroom : undefined,
            deliveryAddress: fulfillmentType === 'delivery' ? {
              state,
              lga,
              address,
              phone,
              notes: deliveryNotes
            } : undefined,
            notes: `Klump Transaction Reference: ${orderRef}`
          });
          setIsSubmitting(false);
          onSuccess(order, 'order');
        }
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'An error occurred while creating your order.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Checkout Heading */}
      <div className="text-center sm:text-left pb-4 mb-6 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0A1931]">Secure Checkout</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Smart Choice Electronics Group • Port Harcourt, Rivers State
        </p>
      </div>

      {/* Account Requirement Notice if unauthenticated */}
      {!currentUser && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Customer Account Required for Checkout</h4>
              <p className="text-gray-600 text-[11px] sm:text-xs leading-relaxed">
                Please sign in or create an account to finalize your order, receive delivery receipts, and track your purchase. Your cart is preserved.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={() => onOpenAuth && onOpenAuth('signin')}
              className="flex-1 sm:flex-none px-4 py-2 bg-[#0A1931] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => onOpenAuth && onOpenAuth('register')}
              className="flex-1 sm:flex-none px-4 py-2 bg-[#D91E2A] hover:bg-[#b81822] text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Register
            </button>
          </div>
        </div>
      )}

      {/* THREE COMPACT, NEAR-SQUARE PAYMENT CARDS SIDE BY SIDE, INCLUDING ON MOBILE (Mandatory) */}
      <div className="mb-8">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
          Select Payment Method
        </label>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {/* Card 1: Buy and Pay Now */}
          <button
            type="button"
            onClick={() => setPaymentMethod('bank_transfer')}
            className={`aspect-[4/3] sm:aspect-square p-2 sm:p-4 rounded-xl sm:rounded-2xl border-2 flex flex-col items-center justify-center text-center transition shadow-2xs focus:outline-none ${
              paymentMethod === 'bank_transfer'
                ? 'border-[#D91E2A] bg-red-50/60 ring-2 ring-red-100'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className={`p-2 rounded-full mb-1 sm:mb-2 ${
              paymentMethod === 'bank_transfer' ? 'bg-[#D91E2A] text-white' : 'bg-gray-100 text-gray-700'
            }`}>
              <CreditCard className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-[11px] sm:text-sm font-bold text-gray-900 leading-tight">
              Buy and Pay Now
            </h3>
            <p className="text-[9px] sm:text-xs text-gray-500 mt-0.5 line-clamp-2 hidden sm:block">
              Direct transfer to Moniepoint or Sterling Bank
            </p>
          </button>

          {/* Card 2: Save to Buy */}
          <button
            type="button"
            onClick={() => setPaymentMethod('save_to_buy')}
            className={`aspect-[4/3] sm:aspect-square p-2 sm:p-4 rounded-xl sm:rounded-2xl border-2 flex flex-col items-center justify-center text-center transition shadow-2xs focus:outline-none ${
              paymentMethod === 'save_to_buy'
                ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-100'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className={`p-2 rounded-full mb-1 sm:mb-2 ${
              paymentMethod === 'save_to_buy' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}>
              <Clock className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-[11px] sm:text-sm font-bold text-gray-900 leading-tight">
              Save to Buy
            </h3>
            <p className="text-[9px] sm:text-xs text-gray-500 mt-0.5 line-clamp-2 hidden sm:block">
              Lock price with 1 to 4 months installment plans
            </p>
          </button>

          {/* Card 3: Buy Now, Pay Later with Klump */}
          <button
            type="button"
            onClick={() => setPaymentMethod('klump')}
            className={`aspect-[4/3] sm:aspect-square p-2 sm:p-4 rounded-xl sm:rounded-2xl border-2 flex flex-col items-center justify-center text-center transition shadow-2xs focus:outline-none ${
              paymentMethod === 'klump'
                ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-100'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className={`p-2 rounded-full mb-1 sm:mb-2 ${
              paymentMethod === 'klump' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}>
              <Zap className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-[11px] sm:text-sm font-bold text-gray-900 leading-tight">
              Pay Later (Klump)
            </h3>
            <p className="text-[9px] sm:text-xs text-gray-500 mt-0.5 line-clamp-2 hidden sm:block">
              Klump BNPL flexible instalments
            </p>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Fulfillment + Customer Info + Payment Specifics */}
        <div className="lg:col-span-7 space-y-6">
          {/* FULFILLMENT METHOD: Showroom Pickup vs Home Delivery */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#0A1931] uppercase tracking-wider flex items-center gap-2">
              <Store className="w-4 h-4 text-[#D91E2A]" />
              <span>Fulfilment Method</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFulfillmentType('pickup')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center text-center transition ${
                  fulfillmentType === 'pickup'
                    ? 'border-[#0A1931] bg-slate-50 font-bold text-[#0A1931]'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <Store className="w-5 h-5 mb-1 text-emerald-600" />
                <span className="text-xs sm:text-sm">Showroom Pickup</span>
                <span className="text-[10px] text-emerald-700 font-extrabold mt-0.5">₦0 (FREE)</span>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentType('delivery')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center text-center transition ${
                  fulfillmentType === 'delivery'
                    ? 'border-[#0A1931] bg-slate-50 font-bold text-[#0A1931]'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <Truck className="w-5 h-5 mb-1 text-blue-600" />
                <span className="text-xs sm:text-sm">Home Delivery</span>
                <span className="text-[10px] text-gray-500 font-bold mt-0.5">+₦5,000 Port Harcourt</span>
              </button>
            </div>

            {/* If Pickup: Select Preferred Showroom (No address requested, ₦0 fee) */}
            {fulfillmentType === 'pickup' && (
              <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2">
                <label className="block text-xs font-bold text-emerald-950">
                  Select Your Preferred Port Harcourt Collection Showroom:
                </label>
                <div className="space-y-2 text-xs">
                  {showrooms.map(s => (
                    <label
                      key={s.id}
                      className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition ${
                        selectedShowroom === s.id
                          ? 'border-emerald-600 bg-white font-semibold shadow-xs'
                          : 'border-gray-200 bg-white/70 hover:bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="showroom"
                        value={s.id}
                        checked={selectedShowroom === s.id}
                        onChange={() => setSelectedShowroom(s.id)}
                        className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <div className="text-gray-900 font-bold">{s.name}</div>
                        <div className="text-gray-500 text-[11px]">{s.address}</div>
                        <div className="text-emerald-700 font-medium text-[11px] mt-0.5">Tel/WhatsApp: {s.phone}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Customer Contact Details */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#0A1931] uppercase tracking-wider">
              Customer Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="e.g. Chukwuma"
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:border-[#D91E2A] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="e.g. Okeke"
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:border-[#D91E2A] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:border-[#D91E2A] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Phone Number / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="0803 123 4567"
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:border-[#D91E2A] outline-none"
                />
              </div>
            </div>

            {/* REVEAL AND REQUIRE ADDRESS ONLY WHEN DELIVERY IS SELECTED */}
            {fulfillmentType === 'delivery' && (
              <div className="pt-3 border-t border-gray-200 space-y-3">
                <h4 className="text-xs font-bold text-[#D91E2A] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Port Harcourt Delivery Address</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={e => setState(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 bg-gray-50 focus:border-[#D91E2A] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">LGA (Local Government Area) *</label>
                    <input
                      type="text"
                      required
                      value={lga}
                      onChange={e => setLga(e.target.value)}
                      placeholder="e.g. Obio-Akpor, Port Harcourt City, Ikwerre"
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:border-[#D91E2A] outline-none"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block font-semibold text-gray-700 mb-1">Full Street Address & Landmark *</label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="e.g. Plot 14 Peter Odili Road, Trans-Amadi, Port Harcourt"
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:border-[#D91E2A] outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* PAYMENT METHOD DETAILS */}

          {/* OPTION A: Buy and Pay Now */}
          {paymentMethod === 'bank_transfer' && (
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#0A1931] uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#D91E2A]" />
                <span>Store Bank Accounts (Direct Bank Transfer)</span>
              </h3>

              <p className="text-xs text-gray-600">
                Please transfer the total order amount of{' '}
                <strong className="text-gray-900 font-extrabold">{formatNaira(grandTotal)}</strong> to any of our official Smart Choice business accounts below:
              </p>

              {/* Official Store Accounts with COPY ICON & "Account number copied" */}
              <div className="space-y-3">
                {storeBankAccounts.map((bank, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-red-200 bg-red-50/40 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-extrabold text-[#0A1931] text-sm">{bank.bankName}</p>
                      <p className="text-gray-600 text-[11px] font-medium">Account Name: <strong className="text-gray-900">{bank.accountName}</strong></p>
                      <p className="font-mono text-sm font-bold text-[#D91E2A] mt-0.5 tracking-wider">{bank.accountNumber}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyAccount(bank.accountNumber, idx)}
                      className="px-3 py-1.5 bg-white border border-red-300 hover:border-[#D91E2A] text-gray-800 rounded-lg flex items-center gap-1.5 transition shadow-2xs font-semibold shrink-0"
                    >
                      {copiedBankIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 text-[11px]">Account number copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-gray-500" />
                          <span className="text-[11px]">Copy Number</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Receipt Upload (JPG, JPEG, PNG, PDF) */}
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <label className="block text-xs font-bold text-gray-800">
                  Upload Payment Transfer Receipt (JPG, JPEG, PNG, PDF)
                </label>
                <div className="border-2 border-dashed border-gray-300 hover:border-[#D91E2A] rounded-xl p-4 text-center cursor-pointer transition bg-gray-50/50">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleReceiptChange}
                    className="hidden"
                    id="receipt-upload"
                  />
                  <label htmlFor="receipt-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-xs font-semibold text-gray-700">
                      {receiptFile ? receiptFile.name : 'Click to select payment receipt file'}
                    </span>
                    <span className="text-[10px] text-gray-400 mt-0.5">Max size: 10MB</span>
                  </label>
                </div>

                {receiptPreview && (
                  <div className="mt-2 flex items-center gap-3 p-2 bg-gray-100 rounded-lg">
                    <img src={receiptPreview} alt="Receipt preview" className="w-12 h-12 object-cover rounded" />
                    <span className="text-xs text-gray-700 font-medium truncate">{receiptFile?.name}</span>
                  </div>
                )}
                <p className="text-[11px] text-gray-500">
                  Note: Uploaded receipts remain pending until verified by a Smart Choice administrator.
                </p>
              </div>
            </div>
          )}

          {/* OPTION B: Save to Buy (Complete Installment Savings System) */}
          {paymentMethod === 'save_to_buy' && primaryProduct && saveToBuyCalc && (
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <span>Save to Buy Installment Configuration</span>
                </h3>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Max Interest 7%
                </span>
              </div>

              {/* Exact Duration & Interest Rates Selection: 1m: 3%, 2m: 5%, 3m: 7%, 4m: 7% */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Select Plan Duration & Exact Interest Rate:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { m: 1, rate: 3 },
                    { m: 2, rate: 5 },
                    { m: 3, rate: 7 },
                    { m: 4, rate: 7 }
                  ].map(plan => (
                    <button
                      key={plan.m}
                      type="button"
                      onClick={() => setDurationMonths(plan.m as any)}
                      className={`p-2.5 rounded-xl border text-center transition ${
                        durationMonths === plan.m
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-2xs'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <div className="font-extrabold">{plan.m} {plan.m === 1 ? 'Month' : 'Months'}</div>
                      <div className="text-[11px] text-emerald-700 font-bold mt-0.5">{plan.rate}% Interest</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Frequency: Weekly or Monthly */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Payment Frequency:
                </label>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setFrequency('monthly')}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      frequency === 'monthly'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    Monthly ({durationMonths} {durationMonths === 1 ? 'installment' : 'installments'})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFrequency('weekly')}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      frequency === 'weekly'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    Weekly ({durationMonths * 4} installments)
                  </button>
                </div>
              </div>

              {/* DYNAMIC CALCULATION BREAKDOWN */}
              <div className="bg-emerald-900/5 p-4 rounded-xl border border-emerald-200 space-y-2 text-xs">
                <div className="flex justify-between text-gray-700">
                  <span>Product Cash Price:</span>
                  <span className="font-bold">{formatNaira(primaryProduct.price)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Interest Amount ({saveToBuyCalc.interestRatePercent}%):</span>
                  <span className="font-bold text-emerald-700">+{formatNaira(saveToBuyCalc.interestAmount)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-emerald-950 pt-1 border-t border-emerald-200">
                  <span>Total Payable:</span>
                  <span>{formatNaira(saveToBuyCalc.totalPayable)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-800 font-semibold pt-1">
                  <span>Estimated {frequency === 'weekly' ? 'Weekly' : 'Monthly'} Installment:</span>
                  <span className="text-emerald-800 font-extrabold">{formatNaira(saveToBuyCalc.installmentAmount)} / {frequency === 'weekly' ? 'week' : 'month'}</span>
                </div>
              </div>

              {/* Company bank accounts for the first Save to Buy installment */}
              <div className="pt-3 border-t border-gray-100 space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wide text-[#0A1931]">Transfer your first installment to Smart Choice</h4>
                <p className="text-xs text-gray-600">Transfer <strong className="text-emerald-800">{formatNaira(saveToBuyCalc.installmentAmount)}</strong> to one of the official company accounts below. Your payment will remain pending until an administrator verifies the receipt.</p>
                {storeBankAccounts.map((bank, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-[#0A1931]">{bank.bankName}</p>
                      <p className="text-[11px] text-gray-600">Account Name: <strong>{bank.accountName}</strong></p>
                      <p className="font-mono text-sm font-black tracking-wider text-emerald-800">{bank.accountNumber}</p>
                    </div>
                    <button type="button" onClick={() => handleCopyAccount(bank.accountNumber, idx)} className="shrink-0 rounded-lg border border-emerald-300 bg-white px-3 py-2 text-[11px] font-bold text-gray-800">
                      {copiedBankIndex === idx ? <><Check className="inline w-3.5 h-3.5 text-emerald-600" /> Copied</> : <><Copy className="inline w-3.5 h-3.5" /> Copy</>}
                    </button>
                  </div>
                ))}
              </div>

              {/* First Deposit Receipt Upload */}
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <label className="block text-xs font-bold text-gray-800">
                  Upload First Installment Transfer Receipt (Required)
                </label>
                <div className="border-2 border-dashed border-gray-300 hover:border-emerald-500 rounded-xl p-3 text-center cursor-pointer transition">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleReceiptChange}
                    className="hidden"
                    id="save-receipt-upload"
                  />
                  <label htmlFor="save-receipt-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-5 h-5 text-gray-400 mb-1" />
                    <span className="text-xs font-semibold text-gray-700">
                      {receiptFile ? receiptFile.name : 'Upload transfer receipt'}
                    </span>
                  </label>
                </div>
                {receiptFile && <p className="text-[11px] text-emerald-700 font-semibold">Receipt selected: {receiptFile.name}</p>}
                <p className="text-[11px] text-amber-800 font-medium">
                  <strong>Important Rule:</strong> The product will not be released until every required payment has been completed and verified by the admin.
                </p>
              </div>
            </div>
          )}

          {/* OPTION C: Klump BNPL */}
          {paymentMethod === 'klump' && (
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span>Buy Now, Pay Later with Klump</span>
                </h3>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                  Official Merchant Checkout
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Spread your electronics and appliance purchase with Klump Buy Now, Pay Later. Klump independently determines your personalized down payment, repayment duration, and installment schedule directly on its secure financing checkout.
              </p>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>How Klump Checkout Operates:</span>
                </div>
                <ul className="list-disc list-inside text-[11px] space-y-1 text-slate-600 pl-1">
                  <li>Clicking "Proceed to Klump BNPL" initiates your order session.</li>
                  <li>You will be redirected to Klump's secure checkout portal.</li>
                  <li>Klump verifies your eligibility and determines your exact repayment schedule.</li>
                  <li>Your order is released upon verified payment confirmation from Klump.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Delivery or Order Notes */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Order Notes / Special Delivery Directions (Optional)
            </label>
            <textarea
              rows={2}
              value={deliveryNotes}
              onChange={e => setDeliveryNotes(e.target.value)}
              placeholder="e.g. Call before dispatch, close to landmark, preferred pickup time"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:border-[#D91E2A] outline-none"
            />
          </div>
        </div>

        {/* Right Column: Order Summary & Submission */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4 sticky top-24">
            <h3 className="text-sm font-bold text-[#0A1931] uppercase tracking-wider pb-3 border-b border-gray-100">
              Items in Order
            </h3>

            {/* Item list */}
            <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto pr-1 text-xs">
              {checkoutItems.map(item => (
                <div key={item.product.id} className="py-2.5 flex items-center gap-3">
                  <img
                    src={item.product.images[0] || ''}
                    alt={item.product.name}
                    className="w-12 h-12 object-contain bg-gray-50 rounded border p-1 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">{item.product.name}</p>
                    <p className="text-gray-500">Qty: {item.quantity} × {formatNaira(item.product.price)}</p>
                  </div>
                  <span className="font-bold text-gray-900 shrink-0">
                    {formatNaira(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="pt-3 border-t border-gray-200 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-bold text-gray-900">{formatNaira(itemsSubtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Fulfilment ({fulfillmentType === 'pickup' ? 'Showroom Pickup' : 'Home Delivery'}):</span>
                <span className={fulfillmentType === 'pickup' ? 'text-emerald-700 font-bold' : 'font-bold text-gray-900'}>
                  {fulfillmentType === 'pickup' ? '₦0 (FREE)' : formatNaira(deliveryFee)}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline text-base font-black text-[#0A1931]">
                <span>Total Amount:</span>
                <span className="text-xl text-[#D91E2A]">{formatNaira(grandTotal)}</span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full font-bold py-3.5 px-4 rounded-xl text-white text-sm transition shadow-md flex items-center justify-center gap-2 ${
                paymentMethod === 'save_to_buy'
                  ? 'bg-emerald-700 hover:bg-emerald-800'
                  : paymentMethod === 'klump'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-[#D91E2A] hover:bg-[#b81822]'
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {paymentMethod === 'klump'
                      ? 'Connecting to Klump Payment Portal...'
                      : paymentMethod === 'save_to_buy'
                      ? 'Submitting receipt for admin verification...'
                      : 'Submitting Order & Recording Transfer...'}
                  </span>
                </>
              ) : paymentMethod === 'save_to_buy' ? (
                <span>Submit Save to Buy Plan & Receipt</span>
              ) : paymentMethod === 'klump' ? (
                <span>Proceed to Klump BNPL</span>
              ) : (
                <span>Place Order & Confirm Transfer</span>
              )}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="w-full text-center text-xs text-gray-500 hover:text-gray-800 font-semibold py-1 transition"
            >
              Cancel and Return
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
