import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  Slide,
  CartItem,
  Order,
  SaveToBuyPlan,
  PaymentReceipt,
  ContactMessage,
  Showroom,
  StoreBankAccount,
  OrderStatus,
  PaymentStatus,
  SaveToBuyStatus,
  SaveToBuyDuration,
  SaveToBuyFrequency,
  FulfillmentType,
  DeliveryAddress,
  PaymentMethod
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SLIDES,
  SHOWROOMS,
  STORE_BANK_ACCOUNTS
} from '../data/initialData';
import {
  db,
  auth,
  handleFirestoreError,
  OperationType
} from '../firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { calculateSaveToBuy, generateRef } from '../utils/formatters';

const AUTHORIZED_ADMIN_EMAIL = 'smartchoiceglobalresourcesltd@gmail.com';

interface StoreConfig {
  cloudinaryConfigured: boolean;
  cloudinaryCloudName: string;
  cloudinaryApiKey: string;
  klumpConfigured: boolean;
  klumpPublicKey: string;
  authorizedAdminEmail: string;
  showrooms: Showroom[];
  storeBankAccounts: StoreBankAccount[];
}

interface StoreContextType {
  // Products & Categories
  products: Product[];
  categories: Category[];
  slides: Slide[];
  showrooms: Showroom[];
  storeBankAccounts: StoreBankAccount[];
  storeConfig: StoreConfig | null;

  // Shopping Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  setCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  createOrder: (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    totalAmount: number;
    paymentMethod: PaymentMethod;
    fulfillmentType: FulfillmentType;
    pickupShowroom?: string;
    deliveryAddress?: DeliveryAddress;
    receiptUrl?: string;
    receiptFileName?: string;
    notes?: string;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => Promise<void>;
  updateOrderPaymentStatus: (orderId: string, status: PaymentStatus, note?: string) => Promise<void>;

  // Save to Buy Plans
  saveToBuyPlans: SaveToBuyPlan[];
  createSaveToBuyPlan: (data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    product: Product;
    durationMonths: SaveToBuyDuration;
    paymentFrequency: SaveToBuyFrequency;
    fulfillmentType: FulfillmentType;
    pickupShowroom?: string;
    deliveryAddress?: DeliveryAddress;
    initialReceiptUrl?: string;
    initialReceiptFileName?: string;
    initialDepositAmount?: number;
    initialBankName?: string;
    initialAccountName?: string;
    initialAccountNumber?: string;
  }) => Promise<SaveToBuyPlan>;
  submitInstallmentPayment: (
    planId: string,
    installmentNumber: number,
    amount: number,
    receiptUrl: string,
    receiptFileName: string,
    bankName: string,
    accountNumber: string
  ) => Promise<void>;
  verifyInstallmentReceipt: (receiptId: string, verified: boolean, reason?: string) => Promise<void>;
  authorizeProductRelease: (planId: string) => Promise<void>;

  // Payment Receipts
  paymentReceipts: PaymentReceipt[];
  verifyPaymentReceipt: (receiptId: string, verified: boolean, reason?: string) => Promise<void>;

  // Contact Messages
  contactMessages: ContactMessage[];
  submitContactForm: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
    showroom?: string;
  }) => Promise<void>;

  // Admin Product & Content Management
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<Category>;
  updateCategory: (categoryId: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  addSlide: (slide: Omit<Slide, 'id'>) => Promise<Slide>;
  updateSlide: (slideId: string, updates: Partial<Slide>) => Promise<void>;
  deleteSlide: (slideId: string) => Promise<void>;
  uploadProductImage: (fileDataUrl: string) => Promise<{ url: string; configured: boolean }>;

  // Auth & Admin Identity
  currentUser: User | null;
  isAdmin: boolean;
  loginWithGoogle: () => Promise<User>;
  signInWithEmail: (email: string, password: string) => Promise<User>;
  signUpWithEmail: (email: string, password: string, fullName: string, phone: string) => Promise<User>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | null>(null);

const CART_STORAGE_KEY = 'smart_choice_cart_v1';
const WISHLIST_STORAGE_KEY = 'smart_choice_wishlist_v1';
const ORDERS_STORAGE_KEY = 'smart_choice_orders_v1';
const PLANS_STORAGE_KEY = 'smart_choice_plans_v1';
const RECEIPTS_STORAGE_KEY = 'smart_choice_receipts_v1';
const PRODUCTS_STORAGE_KEY = 'smart_choice_products_v1';
const CATEGORIES_STORAGE_KEY = 'smart_choice_categories_v1';
const SLIDES_STORAGE_KEY = 'smart_choice_slides_v1';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products & Categories
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [slides, setSlides] = useState<Slide[]>(() => {
    try {
      const saved = localStorage.getItem(SLIDES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_SLIDES;
    } catch {
      return INITIAL_SLIDES;
    }
  });

  const [showrooms] = useState<Showroom[]>(SHOWROOMS);
  const [storeBankAccounts] = useState<StoreBankAccount[]>(STORE_BANK_ACCOUNTS);
  const [storeConfig, setStoreConfig] = useState<StoreConfig | null>(null);

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders, Plans, Receipts, Messages
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [saveToBuyPlans, setSaveToBuyPlans] = useState<SaveToBuyPlan[]>(() => {
    try {
      const saved = localStorage.getItem(PLANS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [paymentReceipts, setPaymentReceipts] = useState<PaymentReceipt[]>(() => {
    try {
      const saved = localStorage.getItem(RECEIPTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Strict Admin Verification (Only smartchoiceglobalresourcesltd@gmail.com)
  const isAdmin = Boolean(
    currentUser &&
    currentUser.email?.toLowerCase().trim() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()
  );

  // Fetch backend config
  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setStoreConfig(data))
      .catch(err => console.warn('Store config fetch warning:', err));
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(saveToBuyPlans));
  }, [saveToBuyPlans]);

  useEffect(() => {
    localStorage.setItem(RECEIPTS_STORAGE_KEY, JSON.stringify(paymentReceipts));
  }, [paymentReceipts]);

  useEffect(() => {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(SLIDES_STORAGE_KEY, JSON.stringify(slides));
  }, [slides]);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync with strict ABAC scoping
  useEffect(() => {
    // 1. Products (Public read)
    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      snapshot => {
        const remoteProds: Product[] = [];
        snapshot.forEach(docSnap => {
          remoteProds.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        setProducts(remoteProds);
      },
      error => {
        console.warn('Firestore products sync note:', error.message);
      }
    );

    // 2. Categories (Public read)
    const unsubCategories = onSnapshot(
      collection(db, 'categories'),
      snapshot => {
        if (!snapshot.empty) {
          const remoteCats: Category[] = [];
          snapshot.forEach(docSnap => {
            remoteCats.push({ id: docSnap.id, ...(docSnap.data() as any) });
          });
          setCategories(remoteCats);
        }
      },
      error => {
        console.warn('Firestore categories sync note:', error.message);
      }
    );

    // 3. Slides (Public read)
    const unsubSlides = onSnapshot(
      collection(db, 'slides'),
      snapshot => {
        if (!snapshot.empty) {
          const remoteSlides: Slide[] = [];
          snapshot.forEach(docSnap => {
            remoteSlides.push({ id: docSnap.id, ...(docSnap.data() as any) });
          });
          setSlides(remoteSlides);
        }
      },
      error => {
        console.warn('Firestore slides sync note:', error.message);
      }
    );

    // 4. Scoped Orders Listener
    let unsubOrders = () => {};
    if (isAdmin) {
      unsubOrders = onSnapshot(
        collection(db, 'orders'),
        snapshot => {
          if (!snapshot.empty) {
            const remoteOrders: Order[] = [];
            snapshot.forEach(docSnap => {
              remoteOrders.push({ id: docSnap.id, ...(docSnap.data() as any) });
            });
            setOrders(remoteOrders);
          }
        },
        error => console.warn('Firestore admin orders sync:', error.message)
      );
    } else if (currentUser) {
      unsubOrders = onSnapshot(
        query(collection(db, 'orders'), where('customerId', '==', currentUser.uid)),
        snapshot => {
          const userOrders: Order[] = [];
          snapshot.forEach(docSnap => {
            userOrders.push({ id: docSnap.id, ...(docSnap.data() as any) });
          });
          setOrders(userOrders);
        },
        error => console.warn('Firestore customer orders sync:', error.message)
      );
    }

    // 5. Scoped Save To Buy Plans Listener
    let unsubPlans = () => {};
    if (isAdmin) {
      unsubPlans = onSnapshot(
        collection(db, 'saveToBuyPlans'),
        snapshot => {
          if (!snapshot.empty) {
            const remotePlans: SaveToBuyPlan[] = [];
            snapshot.forEach(docSnap => {
              remotePlans.push({ id: docSnap.id, ...(docSnap.data() as any) });
            });
            setSaveToBuyPlans(remotePlans);
          }
        },
        error => console.warn('Firestore admin plans sync:', error.message)
      );
    } else if (currentUser) {
      unsubPlans = onSnapshot(
        query(collection(db, 'saveToBuyPlans'), where('customerId', '==', currentUser.uid)),
        snapshot => {
          const userPlans: SaveToBuyPlan[] = [];
          snapshot.forEach(docSnap => {
            userPlans.push({ id: docSnap.id, ...(docSnap.data() as any) });
          });
          setSaveToBuyPlans(userPlans);
        },
        error => console.warn('Firestore customer plans sync:', error.message)
      );
    }

    // 6. Scoped Payment Receipts Listener
    let unsubPayments = () => {};
    if (isAdmin) {
      unsubPayments = onSnapshot(
        collection(db, 'payments'),
        snapshot => {
          if (!snapshot.empty) {
            const remotePayments: PaymentReceipt[] = [];
            snapshot.forEach(docSnap => {
              remotePayments.push({ id: docSnap.id, ...(docSnap.data() as any) });
            });
            setPaymentReceipts(remotePayments);
          }
        },
        error => console.warn('Firestore admin payments sync:', error.message)
      );
    } else if (currentUser) {
      unsubPayments = onSnapshot(
        query(collection(db, 'payments'), where('customerId', '==', currentUser.uid)),
        snapshot => {
          const userReceipts: PaymentReceipt[] = [];
          snapshot.forEach(docSnap => {
            userReceipts.push({ id: docSnap.id, ...(docSnap.data() as any) });
          });
          setPaymentReceipts(userReceipts);
        },
        error => console.warn('Firestore customer payments sync:', error.message)
      );
    }

    return () => {
      unsubProducts();
      unsubCategories();
      unsubSlides();
      unsubOrders();
      unsubPlans();
      unsubPayments();
    };
  }, [currentUser, isAdmin]);

  // Cart operations (Preserves all state)
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        const newQty = Math.min(product.stock, currentQty + quantity);
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      } else {
        const addQty = Math.min(product.stock, Math.max(1, quantity));
        return [...prev, { product, quantity: addQty }];
      }
    });
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > item.product.stock) return item;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const setCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const finalQty = Math.min(item.product.stock, quantity);
          return { ...item, quantity: finalQty };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Order Creation (Bound strictly to authenticated customer)
  const createOrder = async (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    totalAmount: number;
    paymentMethod: PaymentMethod;
    fulfillmentType: FulfillmentType;
    pickupShowroom?: string;
    deliveryAddress?: DeliveryAddress;
    receiptUrl?: string;
    receiptFileName?: string;
    notes?: string;
  }): Promise<Order> => {
    if (!currentUser) {
      throw new Error('Customer authentication is required before an order can be created.');
    }

    const orderRef = generateRef('SC');
    const orderId = 'order_' + Date.now();
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: orderId,
      orderRef,
      customerId: currentUser.uid,
      customerName: orderData.customerName,
      customerEmail: currentUser.email || orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      items: orderData.items,
      subtotal: orderData.subtotal,
      deliveryFee: orderData.deliveryFee,
      totalAmount: orderData.totalAmount,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: 'pending',
      orderStatus: orderData.paymentMethod === 'bank_transfer' ? 'payment_pending' : 'received',
      fulfillmentType: orderData.fulfillmentType,
      pickupShowroom: orderData.pickupShowroom,
      deliveryAddress: orderData.deliveryAddress,
      receiptUrl: orderData.receiptUrl,
      receiptFileName: orderData.receiptFileName,
      notes: orderData.notes,
      timeline: [
        {
          status: 'received',
          title: 'Order Placed',
          note: `Order placed via ${orderData.paymentMethod === 'bank_transfer' ? 'Direct Bank Transfer' : orderData.paymentMethod === 'save_to_buy' ? 'Save to Buy Installment' : 'Klump BNPL'}.`,
          timestamp: now,
          actor: 'Customer'
        },
        ...(orderData.receiptUrl ? [
          {
            status: 'payment_pending' as OrderStatus,
            title: 'Payment Receipt Uploaded',
            note: 'Bank transfer receipt submitted. Pending administrator verification.',
            timestamp: now,
            actor: 'Customer'
          }
        ] : [])
      ],
      createdAt: now,
      updatedAt: now
    };

    setOrders(prev => [newOrder, ...prev]);

    try {
      await setDoc(doc(db, 'orders', orderId), newOrder);
    } catch (err) {
      console.warn('Firestore order save error, cached locally:', err);
    }

    if (orderData.receiptUrl) {
      const receiptId = 'rec_' + Date.now();
      const newReceipt: PaymentReceipt = {
        id: receiptId,
        paymentRef: generateRef('RCP'),
        type: 'order_payment',
        orderId,
        orderRef,
        customerId: currentUser.uid,
        customerName: orderData.customerName,
        customerEmail: currentUser.email || orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        amount: orderData.totalAmount,
        bankName: data.initialBankName || STORE_BANK_ACCOUNTS[0]?.bankName || 'Company Bank Account',
        accountName: data.initialAccountName || STORE_BANK_ACCOUNTS[0]?.accountName || 'SMART CHOICE GLOBAL RESOURCES LTD',
        accountNumber: data.initialAccountNumber || STORE_BANK_ACCOUNTS[0]?.accountNumber || '',
        receiptUrl: orderData.receiptUrl,
        receiptFileName: orderData.receiptFileName,
        status: 'pending',
        createdAt: now
      };
      setPaymentReceipts(prev => [newReceipt, ...prev]);
      try {
        await setDoc(doc(db, 'payments', receiptId), newReceipt);
      } catch (err) {
        console.warn('Firestore payment receipt save error:', err);
      }
    }

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, note?: string) => {
    if (!isAdmin) {
      throw new Error('Only the authorised administrator can update order status.');
    }

    const now = new Date().toISOString();
    const statusTitles: Record<OrderStatus, string> = {
      received: 'Order Received',
      payment_pending: 'Awaiting Payment Verification',
      payment_confirmed: 'Payment Verified & Confirmed',
      processing: 'Order Processing',
      preparing: 'Preparing Goods for Fulfillment',
      ready_for_pickup: 'Ready for Showroom Collection',
      dispatched: 'Order Dispatched to Courier',
      out_for_delivery: 'Out for Final Delivery',
      delivered: 'Order Delivered / Collected Successfully',
      cancelled: 'Order Cancelled'
    };

    setOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          const updatedTimeline = [
            ...order.timeline,
            {
              status,
              title: statusTitles[status] || status,
              note: note || undefined,
              timestamp: now,
              actor: 'Administrator'
            }
          ];
          return {
            ...order,
            orderStatus: status,
            timeline: updatedTimeline,
            updatedAt: now
          };
        }
        return order;
      })
    );

    try {
      await updateDoc(doc(db, 'orders', orderId), {
        orderStatus: status,
        updatedAt: now
      });
    } catch (err) {
      console.warn('Firestore order status update error:', err);
    }
  };

  const updateOrderPaymentStatus = async (orderId: string, status: PaymentStatus, note?: string) => {
    if (!isAdmin) {
      throw new Error('Only the authorised administrator can update payment status.');
    }

    const now = new Date().toISOString();
    setOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          const nextOrderStatus = status === 'verified' ? 'payment_confirmed' : order.orderStatus;
          const updatedTimeline = [
            ...order.timeline,
            {
              status: nextOrderStatus,
              title: status === 'verified' ? 'Payment Verified by Admin' : 'Payment Issue / Rejected',
              note: note || (status === 'verified' ? 'Payment confirmed into Smart Choice account.' : 'Receipt rejected.'),
              timestamp: now,
              actor: 'Administrator'
            }
          ];
          return {
            ...order,
            paymentStatus: status,
            orderStatus: nextOrderStatus,
            timeline: updatedTimeline,
            updatedAt: now
          };
        }
        return order;
      })
    );

    try {
      await updateDoc(doc(db, 'orders', orderId), {
        paymentStatus: status,
        updatedAt: now
      });
    } catch (err) {
      console.warn('Firestore order payment update error:', err);
    }
  };

  // Save to Buy Plan Creation
  const createSaveToBuyPlan = async (data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    product: Product;
    durationMonths: SaveToBuyDuration;
    paymentFrequency: SaveToBuyFrequency;
    fulfillmentType: FulfillmentType;
    pickupShowroom?: string;
    deliveryAddress?: DeliveryAddress;
    initialReceiptUrl?: string;
    initialReceiptFileName?: string;
    initialDepositAmount?: number;
    initialBankName?: string;
    initialAccountName?: string;
    initialAccountNumber?: string;
  }): Promise<SaveToBuyPlan> => {
    if (!currentUser) {
      throw new Error('Authentication required to create a Save to Buy plan.');
    }

    const planRef = generateRef('STB');
    const planId = 'plan_' + Date.now();
    const now = new Date().toISOString();

    const calculation = calculateSaveToBuy(data.product.price, data.durationMonths, data.paymentFrequency);
    // A submitted receipt is NOT a verified payment. Keep the plan unpaid
    // until an administrator approves the matching payment record.
    const initialDeposit = data.initialDepositAmount || 0;
    const balance = calculation.totalPayable;
    const schedule = [...calculation.schedule];
    if (initialDeposit > 0 && schedule.length > 0) {
      schedule[0].receiptUrl = data.initialReceiptUrl;
      schedule[0].receiptFileName = data.initialReceiptFileName;
      schedule[0].receiptStatus = 'pending';
    }

    const newPlan: SaveToBuyPlan = {
      id: planId,
      planRef,
      customerId: currentUser.uid,
      customerName: data.customerName,
      customerEmail: currentUser.email || data.customerEmail,
      customerPhone: data.customerPhone,
      productId: data.product.id,
      productName: data.product.name,
      productPrice: data.product.price,
      productImage: data.product.images[0] || '',
      durationMonths: data.durationMonths,
      interestRatePercent: calculation.interestRatePercent,
      interestAmount: calculation.interestAmount,
      totalPayable: calculation.totalPayable,
      amountPaid: 0,
      balance,
      paymentFrequency: data.paymentFrequency,
      installmentAmount: calculation.installmentAmount,
      totalInstallments: calculation.totalInstallments,
      installmentsSchedule: schedule,
      fulfillmentType: data.fulfillmentType,
      pickupShowroom: data.pickupShowroom,
      deliveryAddress: data.deliveryAddress,
      status: 'awaiting_first_payment',
      productReleased: false,
      createdAt: now,
      updatedAt: now
    };

    setSaveToBuyPlans(prev => [newPlan, ...prev]);

    try {
      await setDoc(doc(db, 'saveToBuyPlans', planId), newPlan);
    } catch (err) {
      console.warn('Firestore plan save error:', err);
    }

    if (data.initialReceiptUrl && initialDeposit > 0) {
      const receiptId = 'rec_' + Date.now();
      const newReceipt: PaymentReceipt = {
        id: receiptId,
        paymentRef: generateRef('RCP'),
        type: 'save_to_buy_installment',
        planId,
        planRef,
        installmentNumber: 1,
        customerId: currentUser.uid,
        customerName: data.customerName,
        customerEmail: currentUser.email || data.customerEmail,
        customerPhone: data.customerPhone,
        amount: initialDeposit,
        bankName: 'Moniepoint MFB / Sterling Bank PLC',
        accountName: 'SMART CHOICE GLOBAL RESOURCES LTD',
        accountNumber: '5240879532',
        receiptUrl: data.initialReceiptUrl,
        receiptFileName: data.initialReceiptFileName,
        status: 'pending',
        createdAt: now
      };
      setPaymentReceipts(prev => [newReceipt, ...prev]);
      try {
        await setDoc(doc(db, 'payments', receiptId), newReceipt);
      } catch (err) {
        console.warn('Firestore payment save error:', err);
      }
    }

    return newPlan;
  };

  const submitInstallmentPayment = async (
    planId: string,
    installmentNumber: number,
    amount: number,
    receiptUrl: string,
    receiptFileName: string,
    bankName: string,
    accountNumber: string
  ) => {
    if (!currentUser) throw new Error('Customer authentication required.');

    const now = new Date().toISOString();
    const receiptId = 'rec_' + Date.now();
    const plan = saveToBuyPlans.find(p => p.id === planId);

    const newReceipt: PaymentReceipt = {
      id: receiptId,
      paymentRef: generateRef('RCP'),
      type: 'save_to_buy_installment',
      planId,
      planRef: plan?.planRef,
      installmentNumber,
      customerId: currentUser.uid,
      customerName: plan?.customerName || 'Customer',
      customerEmail: currentUser.email || plan?.customerEmail,
      customerPhone: plan?.customerPhone,
      amount,
      bankName,
      accountName: 'SMART CHOICE GLOBAL RESOURCES LTD',
      accountNumber,
      receiptUrl,
      receiptFileName,
      status: 'pending',
      createdAt: now
    };

    setPaymentReceipts(prev => [newReceipt, ...prev]);

    setSaveToBuyPlans(prev =>
      prev.map(p => {
        if (p.id === planId) {
          const updatedSchedule = p.installmentsSchedule.map(item => {
            if (item.installmentNumber === installmentNumber) {
              return {
                ...item,
                receiptUrl,
                receiptFileName,
                receiptStatus: 'pending' as const,
                paymentDate: now
              };
            }
            return item;
          });
          return {
            ...p,
            installmentsSchedule: updatedSchedule,
            updatedAt: now
          };
        }
        return p;
      })
    );

    try {
      await setDoc(doc(db, 'payments', receiptId), newReceipt);
      await updateDoc(doc(db, 'saveToBuyPlans', planId), {
        updatedAt: now
      });
    } catch (err) {
      console.warn('Firestore submit installment error:', err);
    }
  };

  const verifyInstallmentReceipt = async (receiptId: string, verified: boolean, reason?: string) => {
    if (!isAdmin) throw new Error('Unauthorized.');

    const now = new Date().toISOString();
    const receipt = paymentReceipts.find(r => r.id === receiptId);
    if (!receipt || !receipt.planId) return;

    setPaymentReceipts(prev =>
      prev.map(r => (r.id === receiptId ? { ...r, status: verified ? 'verified' : 'rejected', rejectionReason: reason, verifiedAt: now, verifiedBy: AUTHORIZED_ADMIN_EMAIL } : r))
    );

    setSaveToBuyPlans(prev =>
      prev.map(plan => {
        if (plan.id === receipt.planId) {
          const newAmountPaid = verified ? plan.amountPaid + receipt.amount : plan.amountPaid;
          const newBalance = Math.max(0, plan.totalPayable - newAmountPaid);
          const newStatus: SaveToBuyStatus = newBalance === 0 ? 'completed' : 'active';

          const updatedSchedule = plan.installmentsSchedule.map(item => {
            if (item.installmentNumber === receipt.installmentNumber) {
              return {
                ...item,
                amountPaid: verified ? item.amountPaid + receipt.amount : item.amountPaid,
                status: verified && item.amountPaid + receipt.amount >= item.amountDue ? ('paid' as const) : ('due' as const),
                receiptStatus: verified ? ('verified' as const) : ('rejected' as const)
              };
            }
            return item;
          });

          return {
            ...plan,
            amountPaid: newAmountPaid,
            balance: newBalance,
            status: newStatus,
            installmentsSchedule: updatedSchedule,
            updatedAt: now
          };
        }
        return plan;
      })
    );

    try {
      await updateDoc(doc(db, 'payments', receiptId), {
        status: verified ? 'verified' : 'rejected',
        rejectionReason: reason || null,
        verifiedAt: now,
        verifiedBy: AUTHORIZED_ADMIN_EMAIL
      });
    } catch (err) {
      console.warn('Firestore payment update error:', err);
    }
  };

  const authorizeProductRelease = async (planId: string) => {
    if (!isAdmin) throw new Error('Only the authorised administrator can authorize goods release.');

    const plan = saveToBuyPlans.find(p => p.id === planId);
    if (!plan || plan.balance > 0) {
      throw new Error('Product cannot be released until every required installment payment has been completed and verified.');
    }
    const now = new Date().toISOString();

    setSaveToBuyPlans(prev =>
      prev.map(p => (p.id === planId ? { ...p, productReleased: true, releasedAt: now, updatedAt: now } : p))
    );

    try {
      await updateDoc(doc(db, 'saveToBuyPlans', planId), {
        productReleased: true,
        releasedAt: now,
        updatedAt: now
      });
    } catch (err) {
      console.warn('Firestore release plan error:', err);
    }
  };

  const verifyPaymentReceipt = async (receiptId: string, verified: boolean, reason?: string) => {
    if (!isAdmin) throw new Error('Unauthorized.');

    const receipt = paymentReceipts.find(r => r.id === receiptId);
    if (!receipt) return;

    if (receipt.type === 'save_to_buy_installment') {
      await verifyInstallmentReceipt(receiptId, verified, reason);
    } else {
      const now = new Date().toISOString();
      setPaymentReceipts(prev =>
        prev.map(r => (r.id === receiptId ? { ...r, status: verified ? 'verified' : 'rejected', rejectionReason: reason, verifiedAt: now, verifiedBy: AUTHORIZED_ADMIN_EMAIL } : r))
      );

      if (receipt.orderId) {
        await updateOrderPaymentStatus(receipt.orderId, verified ? 'verified' : 'rejected', reason);
      }

      try {
        await updateDoc(doc(db, 'payments', receiptId), {
          status: verified ? 'verified' : 'rejected',
          rejectionReason: reason || null,
          verifiedAt: now,
          verifiedBy: AUTHORIZED_ADMIN_EMAIL
        });
      } catch (err) {
        console.warn('Firestore payment verify error:', err);
      }
    }
  };

  // Contact Form
  const submitContactForm = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
    showroom?: string;
  }) => {
    const messageId = 'msg_' + Date.now();
    const now = new Date().toISOString();
    const newMsg: ContactMessage = {
      id: messageId,
      ...data,
      status: 'new',
      createdAt: now
    };

    setContactMessages(prev => [newMsg, ...prev]);

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.warn('Contact dispatch warning:', err);
    }

    try {
      await setDoc(doc(db, 'contactMessages', messageId), newMsg);
    } catch (err) {
      console.warn('Firestore message save error:', err);
    }
  };

  // Cloudinary Product Image Upload Helper
  const uploadProductImage = async (fileDataUrl: string): Promise<{ url: string; configured: boolean }> => {
    try {
      const res = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: fileDataUrl, folder: 'smartchoice/products' })
      });
      const data = await res.json();
      if (data.url) {
        return { url: data.url, configured: Boolean(data.configured) };
      }
      return { url: fileDataUrl, configured: false };
    } catch (err) {
      console.warn('Cloudinary upload endpoint fallback to file data:', err);
      return { url: fileDataUrl, configured: false };
    }
  };

  // Admin Product Management
  const addProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
    if (!isAdmin) throw new Error('Unauthorized.');

    const id = 'prod_' + Date.now();
    const now = new Date().toISOString();
    const newProduct: Product = {
      id,
      ...productData,
      createdAt: now,
      updatedAt: now
    };

    setProducts(prev => [newProduct, ...prev]);

    try {
      await setDoc(doc(db, 'products', id), newProduct);
    } catch (err) {
      console.warn('Firestore add product error:', err);
    }

    return newProduct;
  };

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    if (!isAdmin) throw new Error('Unauthorized.');

    const now = new Date().toISOString();
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, ...updates, updatedAt: now } : p))
    );

    try {
      await updateDoc(doc(db, 'products', productId), {
        ...updates,
        updatedAt: now
      });
    } catch (err) {
      console.warn('Firestore update product error:', err);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!isAdmin) throw new Error('Unauthorized.');

    setProducts(prev => prev.filter(p => p.id !== productId));
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (err) {
      console.warn('Firestore delete product error:', err);
    }
  };

  // Admin Category Management
  const addCategory = async (catData: Omit<Category, 'id'>): Promise<Category> => {
    if (!isAdmin) throw new Error('Unauthorized.');

    const id = 'cat_' + Date.now();
    const newCat: Category = {
      id,
      ...catData,
      createdAt: new Date().toISOString()
    };

    setCategories(prev => [...prev, newCat]);

    try {
      await setDoc(doc(db, 'categories', id), newCat);
    } catch (err) {
      console.warn('Firestore add category error:', err);
    }

    return newCat;
  };

  const updateCategory = async (categoryId: string, updates: Partial<Category>) => {
    if (!isAdmin) throw new Error('Unauthorized.');

    setCategories(prev =>
      prev.map(c => (c.id === categoryId ? { ...c, ...updates } : c))
    );

    try {
      await updateDoc(doc(db, 'categories', categoryId), updates);
    } catch (err) {
      console.warn('Firestore update category error:', err);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    if (!isAdmin) throw new Error('Unauthorized.');

    setCategories(prev => prev.filter(c => c.id !== categoryId));
    try {
      await deleteDoc(doc(db, 'categories', categoryId));
    } catch (err) {
      console.warn('Firestore delete category error:', err);
    }
  };

  // Admin Slideshow Management
  const addSlide = async (slideData: Omit<Slide, 'id'>): Promise<Slide> => {
    if (!isAdmin) throw new Error('Unauthorized.');

    const id = 'slide_' + Date.now();
    const newSlide: Slide = {
      id,
      ...slideData
    };

    setSlides(prev => [...prev, newSlide]);

    try {
      await setDoc(doc(db, 'slides', id), newSlide);
    } catch (err) {
      console.warn('Firestore add slide error:', err);
    }

    return newSlide;
  };

  const updateSlide = async (slideId: string, updates: Partial<Slide>) => {
    if (!isAdmin) throw new Error('Unauthorized.');

    setSlides(prev =>
      prev.map(s => (s.id === slideId ? { ...s, ...updates } : s))
    );

    try {
      await updateDoc(doc(db, 'slides', slideId), updates);
    } catch (err) {
      console.warn('Firestore update slide error:', err);
    }
  };

  const deleteSlide = async (slideId: string) => {
    if (!isAdmin) throw new Error('Unauthorized.');

    setSlides(prev => prev.filter(s => s.id !== slideId));
    try {
      await deleteDoc(doc(db, 'slides', slideId));
    } catch (err) {
      console.warn('Firestore delete slide error:', err);
    }
  };

  // Authentication Methods
  const loginWithGoogle = async (): Promise<User> => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    setCurrentUser(result.user);

    try {
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        fullName: result.user.displayName || 'Customer',
        phone: result.user.phoneNumber || '',
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('User profile sync notice:', e);
    }

    return result.user;
  };

  const signInWithEmail = async (email: string, password: string): Promise<User> => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    setCurrentUser(result.user);
    return result.user;
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    fullName: string,
    phone: string
  ): Promise<User> => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: fullName });
    const updatedUser = { ...result.user, displayName: fullName } as User;
    setCurrentUser(updatedUser);

    try {
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email,
        fullName,
        phone,
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Firestore user profile creation error:', e);
    }

    return updatedUser;
  };

  const sendPasswordReset = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        slides,
        showrooms,
        storeBankAccounts,
        storeConfig,
        cart,
        cartCount,
        cartSubtotal,
        addToCart,
        updateCartQuantity,
        setCartQuantity,
        removeFromCart,
        clearCart,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        createOrder,
        updateOrderStatus,
        updateOrderPaymentStatus,
        saveToBuyPlans,
        createSaveToBuyPlan,
        submitInstallmentPayment,
        verifyInstallmentReceipt,
        authorizeProductRelease,
        paymentReceipts,
        verifyPaymentReceipt,
        contactMessages,
        submitContactForm,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addSlide,
        updateSlide,
        deleteSlide,
        uploadProductImage,
        currentUser,
        isAdmin,
        loginWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        sendPasswordReset,
        logout
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
