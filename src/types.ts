export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  displayOnHome?: boolean;
  sortOrder?: number;
  itemCount?: number;
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  brand: string;
  model: string;
  price: number;
  originalPrice?: number;
  stock: number;
  inStock: boolean;
  featured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isDeal?: boolean;
  discountPercent?: number;
  description: string;
  specifications: Record<string, string>;
  warranty?: string;
  images: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'bank_transfer' | 'save_to_buy' | 'klump';

export type PaymentStatus = 'pending' | 'verified' | 'rejected' | 'failed';

export type OrderStatus =
  | 'received'
  | 'payment_pending'
  | 'payment_confirmed'
  | 'processing'
  | 'preparing'
  | 'ready_for_pickup'
  | 'dispatched'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type FulfillmentType = 'pickup' | 'delivery';

export interface DeliveryAddress {
  state: string;
  lga: string;
  address: string;
  landmark?: string;
  phone: string;
  altPhone?: string;
  notes?: string;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  title: string;
  note?: string;
  timestamp: string;
  actor?: string;
}

export interface Order {
  id: string;
  orderRef: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  fulfillmentType: FulfillmentType;
  pickupShowroom?: string;
  deliveryAddress?: DeliveryAddress;
  receiptUrl?: string;
  receiptFileName?: string;
  notes?: string;
  timeline: OrderTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export type SaveToBuyDuration = 1 | 2 | 3 | 4;
export type SaveToBuyFrequency = 'weekly' | 'monthly';
export type SaveToBuyStatus =
  | 'awaiting_first_payment'
  | 'active'
  | 'payment_due'
  | 'overdue'
  | 'completed'
  | 'cancelled';

export interface InstallmentScheduleItem {
  installmentNumber: number;
  dueDate: string;
  amountDue: number;
  amountPaid: number;
  status: 'pending' | 'due' | 'paid' | 'overdue';
  paymentDate?: string;
  receiptUrl?: string;
  receiptFileName?: string;
  receiptStatus?: 'pending' | 'verified' | 'rejected';
}

export interface SaveToBuyPlan {
  id: string;
  planRef: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  durationMonths: SaveToBuyDuration;
  interestRatePercent: number; // 1m: 3%, 2m: 5%, 3m: 7%, 4m: 7%
  interestAmount: number;
  totalPayable: number;
  amountPaid: number;
  balance: number;
  paymentFrequency: SaveToBuyFrequency;
  installmentAmount: number;
  totalInstallments: number;
  installmentsSchedule: InstallmentScheduleItem[];
  fulfillmentType: FulfillmentType;
  pickupShowroom?: string;
  deliveryAddress?: DeliveryAddress;
  status: SaveToBuyStatus;
  productReleased: boolean;
  releasedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentReceipt {
  id: string;
  paymentRef: string;
  type: 'order_payment' | 'save_to_buy_installment';
  orderId?: string;
  orderRef?: string;
  planId?: string;
  planRef?: string;
  installmentNumber?: number;
  customerId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  amount: number;
  bankName: string;
  accountName: string;
  accountNumber: string;
  receiptUrl: string;
  receiptFileName?: string;
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface Slide {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  image: string;
  link: string;
  buttonText?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  showroom?: string;
  status: 'new' | 'read' | 'resolved';
  createdAt: string;
}

export interface Showroom {
  id: string;
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  mapQuery: string;
}

export interface StoreBankAccount {
  bankName: string;
  accountName: string;
  accountNumber: string;
}
