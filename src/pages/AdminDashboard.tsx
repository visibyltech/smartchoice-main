import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Category, Slide, Order, SaveToBuyPlan, OrderStatus } from '../types';
import { formatNaira } from '../utils/formatters';
import {
  LayoutDashboard,
  Package,
  Layers,
  Image as ImageIcon,
  ShoppingCart,
  CreditCard,
  Clock,
  Zap,
  Truck,
  Users,
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  ExternalLink,
  Lock,
  Unlock,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Upload,
  Store,
  Loader2,
  Menu,
  X,
  Settings,
  Check,
  RefreshCw,
  SlidersHorizontal,
  Eye,
  AlertCircle
} from 'lucide-react';

interface AdminDashboardProps {
  onExitAdmin: () => void;
  onNavigateToProduct?: (product: Product) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExitAdmin }) => {
  const {
    products,
    categories,
    slides,
    orders,
    saveToBuyPlans,
    paymentReceipts,
    contactMessages,
    showrooms,
    storeBankAccounts,
    storeConfig,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    deleteCategory,
    addSlide,
    updateSlide,
    deleteSlide,
    updateOrderStatus,
    verifyPaymentReceipt,
    authorizeProductRelease,
    isAdmin,
    currentUser,
    loginWithGoogle,
    uploadProductImage
  } = useStore();

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'products'
    | 'categories'
    | 'orders'
    | 'customers'
    | 'payments-receipts'
    | 'payments-klump'
    | 'save-to-buy'
    | 'inventory'
    | 'settings'
  >('overview');

  // Sidebar Controls
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paymentsSubmenuOpen, setPaymentsSubmenuOpen] = useState(true);

  // Global & Operation Loading States
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isUploadingBatch, setIsUploadingBatch] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [verifyingReceiptId, setVerifyingReceiptId] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [isSavingSlide, setIsSavingSlide] = useState(false);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');

  // Product Create/Edit Modal state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [manualUrlInput, setManualUrlInput] = useState('');
  const [productForm, setProductForm] = useState<{
    name: string;
    categoryId: string;
    brand: string;
    model: string;
    price: number;
    originalPrice?: number;
    stock: number;
    inStock: boolean;
    featured: boolean;
    isBestSeller: boolean;
    isNewArrival: boolean;
    isDeal: boolean;
    discountPercent?: number;
    description: string;
    warranty: string;
    images: string[];
    specifications: Record<string, string>;
  }>({
    name: '',
    categoryId: categories[0]?.id || '',
    brand: '',
    model: '',
    price: 0,
    originalPrice: 0,
    stock: 10,
    inStock: true,
    featured: false,
    isBestSeller: false,
    isNewArrival: true,
    isDeal: false,
    discountPercent: 0,
    description: '',
    warranty: '1 Year Manufacturer Warranty',
    images: [],
    specifications: { 'Voltage': '220V - 240V', 'Colour': 'Silver' }
  });

  // Category Modal state
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '', image: '', displayOnHome: true });

  // Slide Modal state
  const [slideModalOpen, setSlideModalOpen] = useState(false);
  const [slideForm, setSlideForm] = useState({
    title: '',
    subtitle: '',
    badge: 'EXCLUSIVE',
    image: '',
    link: '/shop',
    buttonText: 'Shop Now',
    sortOrder: 1,
    isActive: true
  });

  // Rejection reason prompt state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReceiptId, setRejectReceiptId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Payment not found in bank statement.');

  // Spec helper state
  const [specKey, setSpecKey] = useState('');
  const [specVal, setSpecVal] = useState('');

  // Calculate Overview Stats
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.paymentStatus === 'verified' ? o.totalAmount : 0), 0);
  }, [orders]);

  const pendingOrders = useMemo(() => {
    return orders.filter(o => o.orderStatus === 'payment_pending' || o.orderStatus === 'received').length;
  }, [orders]);

  const pendingReceipts = useMemo(() => {
    return paymentReceipts.filter(r => r.status === 'pending').length;
  }, [paymentReceipts]);

  const activePlans = useMemo(() => {
    return saveToBuyPlans.filter(p => p.status === 'active').length;
  }, [saveToBuyPlans]);

  const completedPlans = useMemo(() => {
    return saveToBuyPlans.filter(p => p.status === 'completed').length;
  }, [saveToBuyPlans]);

  const lowStockProducts = useMemo(() => {
    return products.filter(p => p.stock <= 5).length;
  }, [products]);

  // Aggregated Customers List
  const uniqueCustomers = useMemo(() => {
    const customerMap = new Map<string, {
      email: string;
      name: string;
      phone: string;
      orderCount: number;
      totalSpent: number;
      activePlans: number;
      lastActive: string;
    }>();

    orders.forEach(o => {
      const key = (o.customerEmail || o.customerPhone || 'unknown').toLowerCase();
      const existing = customerMap.get(key);
      const isPaid = o.paymentStatus === 'verified';
      if (existing) {
        existing.orderCount += 1;
        if (isPaid) existing.totalSpent += o.totalAmount;
        if (new Date(o.createdAt) > new Date(existing.lastActive)) {
          existing.lastActive = o.createdAt;
        }
      } else {
        customerMap.set(key, {
          email: o.customerEmail,
          name: o.customerName,
          phone: o.customerPhone,
          orderCount: 1,
          totalSpent: isPaid ? o.totalAmount : 0,
          activePlans: 0,
          lastActive: o.createdAt
        });
      }
    });

    saveToBuyPlans.forEach(p => {
      const key = (p.customerEmail || p.customerPhone || 'unknown').toLowerCase();
      const existing = customerMap.get(key);
      if (existing) {
        if (p.status === 'active') existing.activePlans += 1;
        existing.totalSpent += p.amountPaid;
      } else {
        customerMap.set(key, {
          email: p.customerEmail,
          name: p.customerName,
          phone: p.customerPhone,
          orderCount: 0,
          totalSpent: p.amountPaid,
          activePlans: p.status === 'active' ? 1 : 0,
          lastActive: p.createdAt
        });
      }
    });

    return Array.from(customerMap.values());
  }, [orders, saveToBuyPlans]);

  // Handle open product modal
  const openNewProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      categoryId: categories[0]?.id || '',
      brand: 'Hisense',
      model: '',
      price: 250000,
      originalPrice: 280000,
      stock: 10,
      inStock: true,
      featured: true,
      isBestSeller: false,
      isNewArrival: true,
      isDeal: false,
      discountPercent: 10,
      description: 'Brand new official home appliance with genuine manufacturer warranty.',
      warranty: '2 Years Manufacturer Warranty',
      images: [],
      specifications: {
        'Condition': 'Brand New Factory Sealed',
        'Origin': 'Official Manufacturer Unit',
        'Warranty': 'Local Port Harcourt Service Center'
      }
    });
    setManualUrlInput('');
    setProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      categoryId: product.categoryId,
      brand: product.brand,
      model: product.model,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      stock: product.stock,
      inStock: product.inStock,
      featured: Boolean(product.featured),
      isBestSeller: Boolean(product.isBestSeller),
      isNewArrival: Boolean(product.isNewArrival),
      isDeal: Boolean(product.isDeal),
      discountPercent: product.discountPercent || 0,
      description: product.description,
      warranty: product.warranty || '',
      images: [...product.images],
      specifications: { ...product.specifications }
    });
    setManualUrlInput('');
    setProductModalOpen(true);
  };

  // MULTIPLE IMAGE UPLOAD HANDLER (Android, iOS, tablet, desktop multi-select)
  const handleBatchPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    setIsUploadingBatch(true);
    setUploadProgressText(`Preparing ${fileList.length} photo${fileList.length > 1 ? 's' : ''}...`);

    const uploadedUrls: string[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      setUploadProgressText(`Uploading photo ${i + 1} of ${fileList.length} to Cloudinary...`);

      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Upload to Cloudinary via backend endpoint
        const res = await uploadProductImage(dataUrl);
        if (res && res.url) {
          uploadedUrls.push(res.url);
        } else {
          uploadedUrls.push(dataUrl);
        }
      } catch (uploadErr) {
        console.warn(`Failed Cloudinary upload for file ${file.name}, using local preview:`, uploadErr);
        // Fallback to local Data URL
        const fallbackUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        uploadedUrls.push(fallbackUrl);
      }
    }

    setProductForm(prev => ({
      ...prev,
      images: [...prev.images, ...uploadedUrls]
    }));

    setIsUploadingBatch(false);
    setUploadProgressText('');
    // Reset file input
    e.target.value = '';
  };

  // Add Image URL manually
  const handleAddManualUrl = () => {
    if (manualUrlInput.trim()) {
      setProductForm(prev => ({
        ...prev,
        images: [...prev.images, manualUrlInput.trim()]
      }));
      setManualUrlInput('');
    }
  };

  // Remove photo thumbnail
  const handleRemoveImage = (indexToRemove: number) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Set photo as main cover photo
  const handleSetAsMain = (indexToMain: number) => {
    setProductForm(prev => {
      const target = prev.images[indexToMain];
      const others = prev.images.filter((_, idx) => idx !== indexToMain);
      return {
        ...prev,
        images: [target, ...others]
      };
    });
  };

  // Save Product Form
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProduct(true);

    try {
      const category = categories.find(c => c.id === productForm.categoryId);
      const categoryName = category ? category.name : 'General Merchandise';
      const slug = productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const cleanImages = productForm.images.filter(img => img.trim().length > 0);

      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          ...productForm,
          slug,
          categoryName,
          images: cleanImages
        });
      } else {
        await addProduct({
          ...productForm,
          slug,
          categoryName,
          images: cleanImages
        });
      }

      setIsSavingProduct(false);
      setProductModalOpen(false);
    } catch (err) {
      setIsSavingProduct(false);
      console.error('Failed saving product:', err);
      alert('Error saving product. Please try again.');
    }
  };

  // Delete product with row spinner
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}" from store inventory?`)) {
      return;
    }
    setDeletingProductId(id);
    try {
      await deleteProduct(id);
    } catch (err) {
      console.error(err);
      alert('Failed to delete product.');
    } finally {
      setDeletingProductId(null);
    }
  };

  // Add Spec
  const handleAddSpec = () => {
    if (specKey.trim() && specVal.trim()) {
      setProductForm(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey.trim()]: specVal.trim()
        }
      }));
      setSpecKey('');
      setSpecVal('');
    }
  };

  // Remove Spec
  const handleRemoveSpec = (keyToRemove: string) => {
    setProductForm(prev => {
      const updated = { ...prev.specifications };
      delete updated[keyToRemove];
      return { ...prev, specifications: updated };
    });
  };

  // Update Stock directly
  const handleQuickStockUpdate = async (productId: string, newStock: number) => {
    try {
      await updateProduct(productId, {
        stock: Math.max(0, newStock),
        inStock: newStock > 0
      });
    } catch (err) {
      console.error('Quick stock update failed:', err);
    }
  };

  // Enforce authorized administrator
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-red-200 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-red-100 text-[#D91E2A] rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-gray-900">Restricted Administrator Area</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Access to this management portal is strictly restricted to the authorized administrator account (<strong>smartchoiceglobalresourcesltd@gmail.com</strong>).
          </p>
          <div className="pt-2 space-y-2">
            <button
              onClick={loginWithGoogle}
              className="w-full bg-[#0A1931] hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition shadow-md"
            >
              Sign In with Authorized Admin Account
            </button>
            <button
              onClick={onExitAdmin}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-xs transition"
            >
              Return to Public Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Products for Catalog
  const filteredProducts = products.filter(p => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term) ||
      p.categoryName?.toLowerCase().includes(term) ||
      p.model?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Top Admin Header Bar */}
      <header className="bg-[#0A1931] text-white px-4 sm:px-6 py-3 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 text-gray-300 hover:text-white rounded-lg focus:outline-none"
            aria-label="Open Admin Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop Sidebar Width Toggle */}
          <button
            onClick={() => setIsSidebarCollapsed(prev => !prev)}
            className="hidden md:flex p-1.5 text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#D91E2A] shrink-0" />
            <div>
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight">Smart Choice Admin Portal</h1>
              <p className="text-[10px] text-gray-400 hidden sm:block">Port Harcourt Store Operations & Verification</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 rounded-full font-bold hidden sm:inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live System</span>
          </span>
          <button
            onClick={onExitAdmin}
            className="text-xs font-bold text-gray-200 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-2xs"
          >
            <span>Exit to Storefront</span>
          </button>
        </div>
      </header>

      {/* Main Admin Layout: Collapsible Sidebar + Dynamic Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <aside
          className={`hidden md:flex flex-col bg-[#0D2240] text-gray-300 border-r border-slate-800 transition-all duration-300 shrink-0 select-none ${
            isSidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Navigation Items */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin text-xs font-semibold">
            {/* 1. Dashboard Overview */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                activeTab === 'overview'
                  ? 'bg-[#D91E2A] text-white shadow-sm font-bold'
                  : 'hover:bg-slate-800/70 hover:text-white'
              }`}
              title="Dashboard Overview"
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Overview</span>}
              </div>
            </button>

            {/* 2. Products Management */}
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                activeTab === 'products'
                  ? 'bg-[#D91E2A] text-white shadow-sm font-bold'
                  : 'hover:bg-slate-800/70 hover:text-white'
              }`}
              title="Products Management"
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Products</span>}
              </div>
              {!isSidebarCollapsed && (
                <span className="text-[10px] bg-slate-800 text-gray-300 px-2 py-0.5 rounded-full font-bold">
                  {products.length}
                </span>
              )}
            </button>

            {/* 3. Categories Management */}
            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                activeTab === 'categories'
                  ? 'bg-[#D91E2A] text-white shadow-sm font-bold'
                  : 'hover:bg-slate-800/70 hover:text-white'
              }`}
              title="Categories Management"
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Categories</span>}
              </div>
              {!isSidebarCollapsed && (
                <span className="text-[10px] bg-slate-800 text-gray-300 px-2 py-0.5 rounded-full font-bold">
                  {categories.length}
                </span>
              )}
            </button>

            {/* 4. Orders Management */}
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                activeTab === 'orders'
                  ? 'bg-[#D91E2A] text-white shadow-sm font-bold'
                  : 'hover:bg-slate-800/70 hover:text-white'
              }`}
              title="Orders Management"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Orders</span>}
              </div>
              {!isSidebarCollapsed && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  pendingOrders > 0 ? 'bg-amber-400 text-black' : 'bg-slate-800 text-gray-300'
                }`}>
                  {orders.length}
                </span>
              )}
            </button>

            {/* 5. Customers Management */}
            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                activeTab === 'customers'
                  ? 'bg-[#D91E2A] text-white shadow-sm font-bold'
                  : 'hover:bg-slate-800/70 hover:text-white'
              }`}
              title="Customers Management"
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Customers</span>}
              </div>
              {!isSidebarCollapsed && (
                <span className="text-[10px] bg-slate-800 text-gray-300 px-2 py-0.5 rounded-full font-bold">
                  {uniqueCustomers.length}
                </span>
              )}
            </button>

            {/* 6. Payments & Transactions (Expandable with toggle arrow) */}
            <div>
              <button
                type="button"
                onClick={() => setPaymentsSubmenuOpen(prev => !prev)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                  activeTab.startsWith('payments')
                    ? 'bg-slate-800 text-white font-bold'
                    : 'hover:bg-slate-800/70 hover:text-white'
                }`}
                title="Payments & Transactions"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>Payments & Trans.</span>}
                </div>
                {!isSidebarCollapsed && (
                  <div className="flex items-center gap-1.5">
                    {pendingReceipts > 0 && (
                      <span className="text-[10px] bg-amber-400 text-black px-1.5 py-0.2 rounded-full font-bold">
                        {pendingReceipts}
                      </span>
                    )}
                    {paymentsSubmenuOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </div>
                )}
              </button>

              {/* Sub-menu options */}
              {paymentsSubmenuOpen && !isSidebarCollapsed && (
                <div className="pl-6 pt-1 space-y-1">
                  <button
                    onClick={() => setActiveTab('payments-receipts')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[11px] transition ${
                      activeTab === 'payments-receipts'
                        ? 'bg-[#D91E2A] text-white font-bold'
                        : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <span>Bank Receipts</span>
                    {pendingReceipts > 0 && (
                      <span className="text-[9px] bg-amber-400 text-black px-1.5 py-0.2 rounded-full font-bold">
                        {pendingReceipts}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('payments-klump')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[11px] transition ${
                      activeTab === 'payments-klump'
                        ? 'bg-[#D91E2A] text-white font-bold'
                        : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <span>Klump Transactions</span>
                    <Zap className="w-3 h-3 text-blue-400" />
                  </button>
                </div>
              )}
            </div>

            {/* 7. Save to Buy Management */}
            <button
              onClick={() => setActiveTab('save-to-buy')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                activeTab === 'save-to-buy'
                  ? 'bg-[#D91E2A] text-white shadow-sm font-bold'
                  : 'hover:bg-slate-800/70 hover:text-white'
              }`}
              title="Save to Buy Management"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Save to Buy</span>}
              </div>
              {!isSidebarCollapsed && (
                <span className="text-[10px] bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  {activePlans}
                </span>
              )}
            </button>

            {/* 8. Inventory & Stock Status */}
            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                activeTab === 'inventory'
                  ? 'bg-[#D91E2A] text-white shadow-sm font-bold'
                  : 'hover:bg-slate-800/70 hover:text-white'
              }`}
              title="Inventory & Stock Status"
            >
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Inventory & Stock</span>}
              </div>
              {!isSidebarCollapsed && lowStockProducts > 0 && (
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-1.5 py-0.2 rounded-full font-bold">
                  {lowStockProducts} Low
                </span>
              )}
            </button>

            {/* 9. Website Settings */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                activeTab === 'settings'
                  ? 'bg-[#D91E2A] text-white shadow-sm font-bold'
                  : 'hover:bg-slate-800/70 hover:text-white'
              }`}
              title="Website Settings"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Website Settings</span>}
              </div>
            </button>
          </nav>

          {/* Quick Showrooms Info Box */}
          {!isSidebarCollapsed && (
            <div className="p-3 m-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] text-gray-400 space-y-1.5">
              <p className="font-bold text-white uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-emerald-400" />
                <span>Showrooms Active</span>
              </p>
              <div className="text-[10px] text-gray-400 space-y-1">
                <div>Showroom 1: 71 NTA Road</div>
                <div>Showroom 2: Smart Choice Plaza</div>
              </div>
            </div>
          )}
        </aside>

        {/* MOBILE SLIDE-OUT DRAWER */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 bg-[#0D2240] text-gray-200 flex flex-col p-4 shadow-2xl z-10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#D91E2A]" />
                  <span className="font-bold text-sm text-white">Navigation</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1 text-xs font-semibold overflow-y-auto flex-1">
                {[
                  { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
                  { id: 'products', label: 'Products Management', icon: Package, count: products.length },
                  { id: 'categories', label: 'Categories Management', icon: Layers, count: categories.length },
                  { id: 'orders', label: 'Orders Management', icon: ShoppingCart, count: orders.length },
                  { id: 'customers', label: 'Customers Management', icon: Users, count: uniqueCustomers.length },
                  { id: 'payments-receipts', label: 'Bank Transfer Receipts', icon: CreditCard, count: pendingReceipts },
                  { id: 'payments-klump', label: 'Klump BNPL Transactions', icon: Zap },
                  { id: 'save-to-buy', label: 'Save to Buy Management', icon: Clock, count: activePlans },
                  { id: 'inventory', label: 'Inventory & Stock Status', icon: SlidersHorizontal },
                  { id: 'settings', label: 'Website Settings', icon: Settings }
                ].map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                        isActive ? 'bg-[#D91E2A] text-white font-bold' : 'hover:bg-slate-800 text-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.count !== undefined && (
                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full">
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={onExitAdmin}
                className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition text-center"
              >
                Exit to Public Storefront
              </button>
            </div>
          </div>
        )}

        {/* WORKSPACE AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-2">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0A1931]">Store Analytics Overview</h2>
                  <p className="text-xs text-gray-500">Real-time Port Harcourt Store Operations & Verification</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={openNewProductModal}
                    className="bg-[#D91E2A] hover:bg-[#b81822] text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                  </button>
                </div>
              </div>

              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                  <span className="text-xs text-gray-500 font-semibold uppercase">Total Verified Revenue</span>
                  <div className="text-xl sm:text-2xl font-black text-emerald-800">{formatNaira(totalRevenue)}</div>
                  <span className="text-[10px] text-gray-400">Verified bank transfers & payments</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                  <span className="text-xs text-gray-500 font-semibold uppercase">Pending Receipts</span>
                  <div className="text-xl sm:text-2xl font-black text-[#D91E2A]">{pendingReceipts}</div>
                  <span className="text-[10px] text-gray-400">Requires bank confirmation</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                  <span className="text-xs text-gray-500 font-semibold uppercase">Save to Buy Plans</span>
                  <div className="text-xl sm:text-2xl font-black text-blue-900">{activePlans} Active / {completedPlans} Done</div>
                  <span className="text-[10px] text-gray-400">1 to 4 month installment plans</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                  <span className="text-xs text-gray-500 font-semibold uppercase">Live Catalog</span>
                  <div className="text-xl sm:text-2xl font-black text-[#0A1931]">{products.length} Products</div>
                  <span className="text-[10px] text-amber-600 font-bold">{lowStockProducts} low stock items</span>
                </div>
              </div>

              {/* Recent Orders & Pending Receipts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <h3 className="font-bold text-sm text-gray-900">Recent Customer Orders</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-xs text-blue-600 font-bold hover:underline">
                      View All ({orders.length})
                    </button>
                  </div>
                  {orders.length === 0 ? (
                    <p className="text-xs text-gray-400 py-4 text-center">No orders recorded yet.</p>
                  ) : (
                    <div className="divide-y divide-gray-100 text-xs">
                      {orders.slice(0, 5).map(o => (
                        <div key={o.id} className="py-2.5 flex items-center justify-between">
                          <div>
                            <span className="font-mono font-bold text-[#D91E2A]">{o.orderRef}</span>
                            <span className="text-gray-900 font-bold ml-2">{o.customerName}</span>
                            <p className="text-[11px] text-gray-400">{o.items.length} items • {o.fulfillmentType}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-gray-900 block">{formatNaira(o.totalAmount)}</span>
                            <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                              {o.orderStatus.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <h3 className="font-bold text-sm text-gray-900">Pending Receipt Verifications</h3>
                    <button onClick={() => setActiveTab('payments-receipts')} className="text-xs text-[#D91E2A] font-bold hover:underline">
                      Manage ({pendingReceipts})
                    </button>
                  </div>
                  {paymentReceipts.length === 0 ? (
                    <p className="text-xs text-gray-400 py-4 text-center">No receipts submitted yet.</p>
                  ) : (
                    <div className="divide-y divide-gray-100 text-xs">
                      {paymentReceipts.slice(0, 5).map(r => (
                        <div key={r.id} className="py-2.5 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-gray-900">{r.customerName}</span>
                            <span className="text-[11px] text-gray-500 block">
                              {r.type === 'save_to_buy_installment' ? `Save to Buy Inst #${r.installmentNumber}` : 'Full Order Payment'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-emerald-800">{formatNaira(r.amount)}</span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                              r.status === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {r.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0A1931]">Products Management</h2>
                  <p className="text-xs text-gray-500">
                    Upload products with multiple photos at once, manage stock, prices, and specifications
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:border-[#D91E2A] outline-none w-48 sm:w-64"
                    />
                  </div>

                  <button
                    onClick={openNewProductModal}
                    className="bg-[#D91E2A] hover:bg-[#b81822] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-sm transition shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product</span>
                  </button>
                </div>
              </div>

              {/* Products Table or Clean Empty State */}
              {products.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4 shadow-2xs">
                  <div className="w-16 h-16 bg-red-50 text-[#D91E2A] rounded-2xl flex items-center justify-center mx-auto">
                    <Package className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Your Store Catalog is Empty</h3>
                  <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                    All previous demo products have been cleared. You can now begin uploading the actual business inventory for Smart Choice Electronics with multiple photos and verified specifications.
                  </p>
                  <button
                    onClick={openNewProductModal}
                    className="bg-[#D91E2A] hover:bg-[#b81822] text-white font-bold px-5 py-2.5 rounded-xl text-xs inline-flex items-center gap-2 shadow-md transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload First Product</span>
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 text-gray-700 uppercase font-bold border-b border-gray-200">
                        <tr>
                          <th className="p-3.5">Product</th>
                          <th className="p-3.5">Category</th>
                          <th className="p-3.5">Price</th>
                          <th className="p-3.5">Stock</th>
                          <th className="p-3.5">Photos</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredProducts.map(p => (
                          <tr key={p.id} className="hover:bg-gray-50/80 transition">
                            <td className="p-3.5 flex items-center gap-3">
                              {p.images[0] ? (
                                <img
                                  src={p.images[0]}
                                  alt={p.name}
                                  className="w-12 h-12 object-contain bg-gray-50 rounded-lg border p-1"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                  <ImageIcon className="w-5 h-5" />
                                </div>
                              )}
                              <div>
                                <p className="font-bold text-gray-900 line-clamp-1">{p.name}</p>
                                <span className="text-[10px] text-gray-500 font-mono">Brand: {p.brand} {p.model ? `• ${p.model}` : ''}</span>
                              </div>
                            </td>
                            <td className="p-3.5 font-medium text-gray-600">{p.categoryName}</td>
                            <td className="p-3.5 font-black text-gray-900">{formatNaira(p.price)}</td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                p.stock <= 3 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {p.stock} in stock
                              </span>
                            </td>
                            <td className="p-3.5 font-semibold text-gray-600">{p.images.length} photo{p.images.length === 1 ? '' : 's'}</td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {p.inStock ? 'Published' : 'Draft / Out'}
                              </span>
                            </td>
                            <td className="p-3.5 text-right space-x-2">
                              <button
                                onClick={() => openEditProductModal(p)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Edit Product"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                disabled={deletingProductId === p.id}
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                                title="Delete Product"
                              >
                                {deletingProductId === p.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CATEGORIES MANAGEMENT */}
          {activeTab === 'categories' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0A1931]">Categories Management</h2>
                  <p className="text-xs text-gray-500">Categories immediately sync to homepage navigation, filters, and product uploaders</p>
                </div>
                <button
                  onClick={() => {
                    setCategoryForm({ name: '', image: '', displayOnHome: true });
                    setCategoryModalOpen(true);
                  }}
                  className="bg-[#D91E2A] hover:bg-[#b81822] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(cat => {
                  const prodsCount = products.filter(p => p.categoryId === cat.id).length;
                  return (
                    <div key={cat.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="w-12 h-12 object-cover rounded-xl" />
                        ) : (
                          <div className="w-12 h-12 bg-red-50 text-[#D91E2A] rounded-xl flex items-center justify-center font-bold">
                            <Layers className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-sm text-gray-900">{cat.name}</h4>
                          <span className="text-xs text-gray-500">{prodsCount} products listed</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (confirm(`Delete category ${cat.name}?`)) {
                              deleteCategory(cat.id);
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0A1931]">Orders & Timeline Tracking</h2>
                  <p className="text-xs text-gray-500">Update fulfillment status, inspect payment receipts, and manage dispatch</p>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-xs text-gray-500">
                  No orders placed yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                        <div>
                          <span className="font-mono text-xs font-bold text-[#D91E2A] bg-red-50 px-2 py-0.5 rounded">
                            {order.orderRef}
                          </span>
                          <h3 className="font-bold text-sm text-gray-900 mt-1">
                            {order.customerName} ({order.customerPhone} • {order.customerEmail})
                          </h3>
                          <p className="text-[11px] text-gray-400">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-base font-black text-gray-900">{formatNaira(order.totalAmount)}</span>
                          <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-blue-100 text-blue-900">
                            {order.orderStatus.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Order items preview & fulfillment details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <p className="font-bold text-gray-700">Fulfilment Method:</p>
                          <p className="text-gray-900 font-semibold">
                            {order.fulfillmentType === 'pickup'
                              ? `Showroom Pickup at ${order.pickupShowroom === 'showroom-2' ? 'Showroom 2 (Smart Choice Plaza)' : 'Showroom 1 (71 NTA Rd)'}`
                              : `Home Delivery: ${order.deliveryAddress?.address}, ${order.deliveryAddress?.lga}, ${order.deliveryAddress?.state}`}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="font-bold text-gray-700">Payment Method & Status:</p>
                          <p className="text-gray-900 font-semibold uppercase">
                            {order.paymentMethod.replace(/_/g, ' ')} • {order.paymentStatus}
                          </p>
                          {order.receiptUrl && (
                            <a
                              href={order.receiptUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-block text-blue-700 font-bold hover:underline"
                            >
                              View Payment Receipt ↗
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Order items list */}
                      <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100 divide-y divide-gray-100 text-xs">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="py-1.5 flex items-center justify-between">
                            <span className="font-semibold text-gray-800">{it.product.name} × {it.quantity}</span>
                            <span className="font-bold text-gray-900">{formatNaira(it.product.price * it.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Update Order Status */}
                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2 text-xs">
                        <span className="font-bold text-gray-700">Update Order Status:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            'payment_confirmed',
                            'processing',
                            'preparing',
                            'ready_for_pickup',
                            'dispatched',
                            'out_for_delivery',
                            'delivered'
                          ].map(st => (
                            <button
                              key={st}
                              disabled={updatingOrderId === order.id}
                              onClick={async () => {
                                setUpdatingOrderId(order.id);
                                await updateOrderStatus(order.id, st as any, `Updated by Admin to ${st}`);
                                setUpdatingOrderId(null);
                              }}
                              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase transition ${
                                order.orderStatus === st
                                  ? 'bg-[#0A1931] text-white shadow-xs'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              } disabled:opacity-50`}
                            >
                              {updatingOrderId === order.id && order.orderStatus === st ? (
                                <Loader2 className="w-3 h-3 animate-spin inline mr-1" />
                              ) : null}
                              {st.replace(/_/g, ' ')}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CUSTOMERS MANAGEMENT */}
          {activeTab === 'customers' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0A1931]">Customers Management</h2>
                  <p className="text-xs text-gray-500">All registered and purchasing customers, order frequency, and savings plan history</p>
                </div>
              </div>

              {uniqueCustomers.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-xs text-gray-500">
                  No customers registered or recorded yet.
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 text-gray-700 uppercase font-bold border-b border-gray-200">
                        <tr>
                          <th className="p-3.5">Customer</th>
                          <th className="p-3.5">Phone Number</th>
                          <th className="p-3.5">Total Orders</th>
                          <th className="p-3.5">Save to Buy Plans</th>
                          <th className="p-3.5">Total Spend</th>
                          <th className="p-3.5">Last Activity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {uniqueCustomers.map((cust, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/80 transition">
                            <td className="p-3.5">
                              <p className="font-bold text-gray-900">{cust.name || 'Shopper'}</p>
                              <span className="text-[11px] text-gray-500 font-mono">{cust.email}</span>
                            </td>
                            <td className="p-3.5 font-medium text-gray-700">{cust.phone || 'N/A'}</td>
                            <td className="p-3.5 font-bold text-gray-900">{cust.orderCount}</td>
                            <td className="p-3.5">
                              {cust.activePlans > 0 ? (
                                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                                  {cust.activePlans} Active
                                </span>
                              ) : (
                                <span className="text-gray-400">None</span>
                              )}
                            </td>
                            <td className="p-3.5 font-black text-emerald-800">{formatNaira(cust.totalSpent)}</td>
                            <td className="p-3.5 text-gray-500 text-[11px]">
                              {cust.lastActive ? new Date(cust.lastActive).toLocaleDateString() : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6A: BANK TRANSFER RECEIPTS (Expandable Sub-section) */}
          {activeTab === 'payments-receipts' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0A1931]">Bank Transfer Receipts Verification</h2>
                  <p className="text-xs text-gray-500">Verify customer transfers for direct purchases and Save to Buy installment contributions</p>
                </div>
              </div>

              {paymentReceipts.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-xs text-gray-500">
                  No payment receipts submitted yet.
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 shadow-2xs">
                  {paymentReceipts.map(rec => (
                    <div key={rec.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                      <div className="flex items-start gap-4">
                        {rec.receiptUrl ? (
                          <a href={rec.receiptUrl} target="_blank" rel="noreferrer">
                            <img
                              src={rec.receiptUrl}
                              alt="Receipt"
                              className="w-16 h-16 object-cover rounded-xl border border-gray-300 hover:opacity-80 transition cursor-zoom-in"
                            />
                          </a>
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                            <CreditCard className="w-6 h-6" />
                          </div>
                        )}

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#D91E2A]">{rec.paymentRef}</span>
                            <span className="font-extrabold text-gray-900">{rec.customerName}</span>
                            <span className="text-[10px] text-gray-500">({rec.customerPhone})</span>
                          </div>
                          <p className="text-gray-600">
                            Type: <strong className="text-blue-900">{rec.type === 'save_to_buy_installment' ? `Save to Buy Inst #${rec.installmentNumber}` : 'Full Order Payment'}</strong>
                          </p>
                          <p className="text-[11px] text-gray-400">
                            Submitted on {new Date(rec.createdAt).toLocaleString()}
                          </p>
                          {rec.rejectionReason && (
                            <p className="text-red-600 font-medium">Rejection Reason: {rec.rejectionReason}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right">
                          <span className="text-base font-black text-emerald-800 block">{formatNaira(rec.amount)}</span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            rec.status === 'verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : rec.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {rec.status}
                          </span>
                        </div>

                        {rec.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <button
                              disabled={verifyingReceiptId === rec.id}
                              onClick={async () => {
                                setVerifyingReceiptId(rec.id);
                                await verifyPaymentReceipt(rec.id, true);
                                setVerifyingReceiptId(null);
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 disabled:opacity-50"
                            >
                              {verifyingReceiptId === rec.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                              <span>Verify & Credit</span>
                            </button>
                            <button
                              disabled={verifyingReceiptId === rec.id}
                              onClick={() => {
                                setRejectReceiptId(rec.id);
                                setRejectModalOpen(true);
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6B: KLUMP TRANSACTIONS (Expandable Sub-section) */}
          {activeTab === 'payments-klump' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0A1931]">Klump BNPL Transactions</h2>
                  <p className="text-xs text-gray-500">Monitor Buy Now, Pay Later transactions, API status, and financing callbacks</p>
                </div>
              </div>

              {/* Status Diagnostic Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4 text-xs">
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  storeConfig?.klumpConfigured
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <Zap className={`w-6 h-6 ${storeConfig?.klumpConfigured ? 'text-emerald-600' : 'text-blue-600'}`} />
                    <div>
                      <p className="font-bold text-sm text-gray-900">Klump API Gateway Configuration</p>
                      <p className="text-gray-600 mt-0.5">
                        {storeConfig?.klumpConfigured
                          ? 'Klump credentials configured and active on server runtime.'
                          : 'Klump Merchant Keys are configured in Vercel environment variables. Verified API functions ready at /api/klump/checkout and /api/klump/verify.'}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    storeConfig?.klumpConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {storeConfig?.klumpConfigured ? 'Active' : 'Serverless Ready'}
                  </span>
                </div>

                {/* Klump Orders List */}
                <div className="space-y-3 pt-2">
                  <h3 className="font-bold text-sm text-[#0A1931]">Klump Financing Orders</h3>
                  {orders.filter(o => o.paymentMethod === 'klump').length === 0 ? (
                    <p className="text-gray-400 py-4 text-center">No Klump transactions recorded yet.</p>
                  ) : (
                    <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                      {orders.filter(o => o.paymentMethod === 'klump').map(o => (
                        <div key={o.id} className="p-3.5 flex items-center justify-between hover:bg-gray-50">
                          <div>
                            <span className="font-mono font-bold text-blue-700">{o.orderRef}</span>
                            <span className="font-bold text-gray-900 ml-2">{o.customerName}</span>
                            <p className="text-[11px] text-gray-500">{o.notes || 'Klump BNPL'}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-gray-900 block">{formatNaira(o.totalAmount)}</span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                              o.paymentStatus === 'verified'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {o.paymentStatus}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SAVE TO BUY MANAGEMENT */}
          {activeTab === 'save-to-buy' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0A1931]">Save to Buy Customer Plans</h2>
                  <p className="text-xs text-gray-500">Monitor balances, confirm installments, and authorize release ONLY when balance reaches ₦0</p>
                </div>
              </div>

              {saveToBuyPlans.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-xs text-gray-500">
                  No Save to Buy plans created yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {saveToBuyPlans.map(plan => (
                    <div key={plan.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs space-y-4 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                        <div>
                          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                            {plan.planRef}
                          </span>
                          <h3 className="font-bold text-sm text-gray-900 mt-1">{plan.productName}</h3>
                          <p className="text-gray-500">{plan.customerName} • {plan.customerPhone}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="font-black text-gray-900 text-sm block">
                              Paid {formatNaira(plan.amountPaid)} / {formatNaira(plan.totalPayable)}
                            </span>
                            <span className="font-bold text-red-600 text-[11px]">
                              Remaining Balance: {formatNaira(plan.balance)}
                            </span>
                          </div>

                          {/* Authorize Release Button (locked until balance is 0) */}
                          {plan.productReleased ? (
                            <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                              <Unlock className="w-4 h-4" />
                              <span>Goods Released</span>
                            </span>
                          ) : (
                            <button
                              disabled={plan.balance > 0}
                              onClick={() => authorizeProductRelease(plan.id)}
                              className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition shadow-xs"
                              title={plan.balance > 0 ? 'Disabled: Balance must be ₦0 before release' : 'Authorize Goods Release'}
                            >
                              <Lock className="w-4 h-4" />
                              <span>Authorize Release</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Installments Table */}
                      <div className="space-y-1">
                        <p className="font-bold text-gray-700 uppercase text-[10px]">Installments Progress:</p>
                        <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden bg-gray-50/50">
                          {plan.installmentsSchedule.map(inst => (
                            <div key={inst.installmentNumber} className="p-2.5 flex items-center justify-between">
                              <div>
                                <span className="font-bold text-gray-900">Installment #{inst.installmentNumber}</span>
                                <span className="text-gray-500 ml-2">Due: {inst.dueDate}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-gray-900">{formatNaira(inst.amountDue)}</span>
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                  inst.receiptStatus === 'verified'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : inst.receiptStatus === 'pending'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {inst.receiptStatus || inst.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: INVENTORY & STOCK STATUS */}
          {activeTab === 'inventory' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-2">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0A1931]">Inventory & Stock Status</h2>
                  <p className="text-xs text-gray-500">Monitor stock thresholds, trigger restocks, and toggle availability</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-xl font-bold">
                    {lowStockProducts} Low Stock Items (≤ 5 units)
                  </span>
                </div>
              </div>

              {products.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-xs text-gray-500">
                  No products in inventory yet.
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 text-gray-700 uppercase font-bold border-b border-gray-200">
                        <tr>
                          <th className="p-3.5">Product</th>
                          <th className="p-3.5">Category</th>
                          <th className="p-3.5">Current Stock</th>
                          <th className="p-3.5">Stock Status</th>
                          <th className="p-3.5">In-Stock Toggle</th>
                          <th className="p-3.5 text-right">Quick Restock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {products.map(p => (
                          <tr key={p.id} className="hover:bg-gray-50/80 transition">
                            <td className="p-3.5 flex items-center gap-3">
                              <img
                                src={p.images[0] || ''}
                                alt={p.name}
                                className="w-10 h-10 object-contain bg-gray-50 rounded border p-1"
                              />
                              <div>
                                <p className="font-bold text-gray-900 line-clamp-1">{p.name}</p>
                                <span className="text-[10px] text-gray-500">Brand: {p.brand}</span>
                              </div>
                            </td>
                            <td className="p-3.5 text-gray-600 font-medium">{p.categoryName}</td>
                            <td className="p-3.5 font-bold text-gray-900">{p.stock} units</td>
                            <td className="p-3.5">
                              {p.stock === 0 ? (
                                <span className="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded text-[10px]">
                                  Out of Stock
                                </span>
                              ) : p.stock <= 5 ? (
                                <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">
                                  Low Stock
                                </span>
                              ) : (
                                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                                  Optimal Stock
                                </span>
                              )}
                            </td>
                            <td className="p-3.5">
                              <button
                                onClick={() => handleQuickStockUpdate(p.id, p.inStock ? 0 : 5)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition ${
                                  p.inStock ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
                                }`}
                              >
                                {p.inStock ? 'In Stock' : 'Marked Out'}
                              </button>
                            </td>
                            <td className="p-3.5 text-right space-x-1.5">
                              <button
                                onClick={() => handleQuickStockUpdate(p.id, p.stock + 5)}
                                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded text-[11px] transition"
                              >
                                +5
                              </button>
                              <button
                                onClick={() => handleQuickStockUpdate(p.id, p.stock + 10)}
                                className="px-2 py-1 bg-[#0A1931] hover:bg-slate-800 text-white font-bold rounded text-[11px] transition"
                              >
                                +10
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 9: WEBSITE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0A1931]">Website Settings & Integrations</h2>
                  <p className="text-xs text-gray-500">Configure Cloudinary, Klump BNPL keys, official bank accounts, and showroom addresses</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                {/* 1. Cloudinary Integration */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                      <span>Cloudinary Image Storage</span>
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      storeConfig?.cloudinaryConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {storeConfig?.cloudinaryConfigured ? 'Configured' : 'Local Fallback'}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Cloudinary hosts and serves original electronics product images, banner slides, and verified payment transfer receipts with high speed CDN delivery.
                  </p>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 font-mono text-[11px] space-y-1">
                    <div>Cloud Name: <strong>{storeConfig?.cloudinaryCloudName || 'Configured via Vercel env'}</strong></div>
                    <div>Upload Endpoint: <code>/api/cloudinary/upload</code></div>
                  </div>
                </div>

                {/* 2. Klump BNPL Integration */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span>Klump BNPL Payment Gateway</span>
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      storeConfig?.klumpConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {storeConfig?.klumpConfigured ? 'Active' : 'Serverless Endpoint Ready'}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Provides flexible Buy Now, Pay Later financing for eligible customers across Nigeria. Terms and installments are calculated exclusively by Klump.
                  </p>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 font-mono text-[11px] space-y-1">
                    <div>Public Key: <strong>{storeConfig?.klumpPublicKey ? `${storeConfig.klumpPublicKey.slice(0, 10)}...` : 'Configured via Vercel env'}</strong></div>
                    <div>Checkout Endpoint: <code>/api/klump/checkout</code></div>
                    <div>Verify Endpoint: <code>/api/klump/verify/:reference</code></div>
                  </div>
                </div>

                {/* 3. Official Bank Accounts */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                  <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Official Business Bank Accounts</span>
                  </h3>
                  <div className="space-y-2">
                    {storeBankAccounts.map((acc, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-gray-900">{acc.bankName}</div>
                          <div className="text-[11px] text-gray-500">{acc.accountName}</div>
                        </div>
                        <span className="font-mono font-black text-sm text-[#0A1931]">{acc.accountNumber}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Port Harcourt Showrooms */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                  <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
                    <Store className="w-4 h-4 text-[#D91E2A]" />
                    <span>Port Harcourt Showroom Locations</span>
                  </h3>
                  <div className="space-y-2">
                    {showrooms.map(s => (
                      <div key={s.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="font-bold text-gray-900">{s.name}</div>
                        <div className="text-[11px] text-gray-600 mt-0.5">{s.address}</div>
                        <div className="text-[11px] text-emerald-700 font-medium mt-1">Tel: {s.phone}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Homepage Slideshow Manager */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-sm text-[#0A1931]">Homepage Slideshow Banners</h3>
                    <p className="text-gray-500 text-[11px]">Manage promotional hero banners, links, and tags</p>
                  </div>
                  <button
                    onClick={() => {
                      setSlideForm({
                        title: '',
                        subtitle: '',
                        badge: 'EXCLUSIVE OFFER',
                        image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80',
                        link: '/shop',
                        buttonText: 'Shop Now',
                        sortOrder: slides.length + 1,
                        isActive: true
                      });
                      setSlideModalOpen(true);
                    }}
                    className="bg-[#D91E2A] text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Slide</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {slides.map(slide => (
                    <div key={slide.id} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden flex flex-col justify-between">
                      <div className="relative h-32">
                        <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 p-2.5 flex flex-col justify-between text-white">
                          <span className="text-[10px] font-bold bg-[#D91E2A] px-2 py-0.5 rounded w-fit">{slide.badge}</span>
                          <h4 className="font-bold text-xs leading-snug drop-shadow">{slide.title}</h4>
                        </div>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <span className="text-[11px] text-gray-500 font-mono truncate max-w-[200px]">{slide.link}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateSlide(slide.id, { isActive: !slide.isActive })}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              slide.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {slide.isActive ? 'Active' : 'Disabled'}
                          </button>
                          <button
                            onClick={() => deleteSlide(slide.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* PRODUCT CREATE / EDIT MODAL (WITH MULTIPLE PHOTO UPLOADER) */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3 sm:p-4 overflow-y-auto backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-base font-black text-[#0A1931]">
                {editingProduct ? 'Edit Product Details' : 'Add New Product to Catalog'}
              </h3>
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Hisense 55-inch 4K UHD Smart TV (A6 Series)"
                    className="w-full border border-gray-300 rounded-xl p-2.5 font-semibold text-xs focus:border-[#D91E2A] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={productForm.categoryId}
                    onChange={e => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-2.5 bg-white font-semibold text-xs focus:border-[#D91E2A] outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    value={productForm.brand}
                    onChange={e => setProductForm({ ...productForm, brand: e.target.value })}
                    placeholder="e.g. Hisense, LG, Maxi, Thermocool"
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs focus:border-[#D91E2A] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Model / SKU</label>
                  <input
                    type="text"
                    value={productForm.model}
                    onChange={e => setProductForm({ ...productForm, model: e.target.value })}
                    placeholder="e.g. 55A6G"
                    className="w-full border border-gray-300 rounded-xl p-2.5 font-mono text-xs focus:border-[#D91E2A] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Warranty Term</label>
                  <input
                    type="text"
                    value={productForm.warranty}
                    onChange={e => setProductForm({ ...productForm, warranty: e.target.value })}
                    placeholder="e.g. 1 Year Official Warranty"
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs focus:border-[#D91E2A] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Selling Price (₦) *</label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={productForm.price || ''}
                    onChange={e => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    placeholder="350000"
                    className="w-full border border-gray-300 rounded-xl p-2.5 font-bold text-xs focus:border-[#D91E2A] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Original Price (₦ strike-through)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice || ''}
                    onChange={e => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                    placeholder="390000"
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs focus:border-[#D91E2A] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.stock}
                    onChange={e => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs focus:border-[#D91E2A] outline-none"
                  />
                </div>
              </div>

              {/* MULTIPLE PHOTO UPLOADER & THUMBNAILS GRID (Requirement 5) */}
              <div className="space-y-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-bold text-gray-900 uppercase tracking-wider text-xs">
                      Product Photographs ({productForm.images.length} added)
                    </label>
                    <p className="text-[11px] text-gray-500">
                      Select multiple photos at once from your phone gallery or computer. The first photo is the main cover.
                    </p>
                  </div>
                </div>

                {/* Multi-Photo Picker Dropzone / Button */}
                <div className="border-2 border-dashed border-gray-300 hover:border-[#D91E2A] rounded-2xl p-4 sm:p-5 text-center transition bg-gray-50/60 cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    id="admin-multi-photo-upload"
                    className="hidden"
                    onChange={handleBatchPhotoUpload}
                    disabled={isUploadingBatch}
                  />
                  <label htmlFor="admin-multi-photo-upload" className="cursor-pointer flex flex-col items-center gap-1.5">
                    {isUploadingBatch ? (
                      <>
                        <Loader2 className="w-7 h-7 text-[#D91E2A] animate-spin mb-1" />
                        <span className="font-bold text-gray-900 text-xs">{uploadProgressText}</span>
                        <span className="text-[10px] text-gray-500">Please wait while photos are optimized...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-7 h-7 text-gray-400 mb-0.5" />
                        <span className="font-bold text-gray-800 text-xs sm:text-sm">
                          Click to Select Multiple Photos at Once
                        </span>
                        <span className="text-[10px] text-gray-500">
                          Supports Android photo gallery, iPhone photo picker, iPad, and desktop (JPG, PNG, WebP)
                        </span>
                      </>
                    )}
                  </label>
                </div>

                {/* Add Image by URL fallback */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Or paste an image web URL here..."
                    value={manualUrlInput}
                    onChange={e => setManualUrlInput(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-xs focus:border-[#D91E2A] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddManualUrl}
                    className="bg-[#0A1931] hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
                  >
                    Add URL
                  </button>
                </div>

                {/* Interactive Thumbnails Preview Grid */}
                {productForm.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {productForm.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className={`relative rounded-xl border-2 p-1.5 bg-gray-50 flex flex-col justify-between group overflow-hidden ${
                          idx === 0 ? 'border-[#D91E2A] ring-2 ring-red-100 shadow-2xs' : 'border-gray-200'
                        }`}
                      >
                        <div className="aspect-square w-full rounded-lg overflow-hidden bg-white flex items-center justify-center relative">
                          <img
                            src={imgUrl}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-contain"
                          />
                          {idx === 0 && (
                            <span className="absolute top-1 left-1 bg-[#D91E2A] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                              ★ Main Cover
                            </span>
                          )}
                          {/* Individual Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-md hover:bg-red-700 transition"
                            title="Remove Photo"
                          >
                            ✕
                          </button>
                        </div>

                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetAsMain(idx)}
                            className="mt-1.5 py-1 text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded text-center transition"
                          >
                            Set as Main Cover
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={productForm.description}
                  onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Detailed product highlights, specifications, and warranty coverage..."
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-xs focus:border-[#D91E2A] outline-none"
                />
              </div>

              {/* Specifications Builder */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="block font-bold text-gray-900 uppercase tracking-wider text-[11px]">
                  Verified Specifications Builder
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Spec Name (e.g. Inverter Technology)"
                    value={specKey}
                    onChange={e => setSpecKey(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg p-2 text-xs outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. Dual Inverter 1.5 HP)"
                    value={specVal}
                    onChange={e => setSpecVal(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg p-2 text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="bg-[#0A1931] hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg font-bold text-xs transition"
                  >
                    Add Spec
                  </button>
                </div>

                <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden bg-gray-50/50">
                  {Object.entries(productForm.specifications).map(([k, v]) => (
                    <div key={k} className="p-2 flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-800">{k}: <span className="font-normal text-gray-600">{v}</span></span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(k)}
                        className="text-red-500 hover:underline font-bold text-[11px]"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured / Toggles */}
              <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-100 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.inStock}
                    onChange={e => setProductForm({ ...productForm, inStock: e.target.checked })}
                  />
                  <span className="font-semibold text-gray-800">Published / Available in Catalog</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={e => setProductForm({ ...productForm, featured: e.target.checked })}
                  />
                  <span>Featured Product</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isBestSeller}
                    onChange={e => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                  />
                  <span>Best Seller</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isNewArrival}
                    onChange={e => setProductForm({ ...productForm, isNewArrival: e.target.checked })}
                  />
                  <span>New Arrival</span>
                </label>
              </div>

              {/* Modal Buttons with Loading Indicator */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  disabled={isSavingProduct}
                  onClick={() => setProductModalOpen(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct || isUploadingBatch}
                  className="flex-1 py-3 bg-[#D91E2A] hover:bg-[#b81822] text-white font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSavingProduct ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving product to catalog...</span>
                    </>
                  ) : (
                    <span>{editingProduct ? 'Save Product Changes' : 'Create Product'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE CATEGORY MODAL */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <h3 className="text-base font-bold text-[#0A1931]">Create New Product Category</h3>
            <form
              onSubmit={async e => {
                e.preventDefault();
                setIsSavingCategory(true);
                const slug = categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                await addCategory({
                  name: categoryForm.name,
                  slug,
                  image: categoryForm.image || 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80',
                  displayOnHome: categoryForm.displayOnHome,
                  sortOrder: categories.length + 1
                });
                setIsSavingCategory(false);
                setCategoryModalOpen(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block font-bold text-gray-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solar Generators & Inverter Batteries"
                  value={categoryForm.name}
                  onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Category Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={categoryForm.image}
                  onChange={e => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  disabled={isSavingCategory}
                  onClick={() => setCategoryModalOpen(false)}
                  className="flex-1 py-2.5 border rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingCategory}
                  className="flex-1 py-2.5 bg-[#D91E2A] hover:bg-[#b81822] text-white rounded-xl font-bold flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isSavingCategory && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE SLIDE MODAL */}
      {slideModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-xs">
            <h3 className="text-base font-bold text-[#0A1931]">Add Homepage Banner Slide</h3>
            <form
              onSubmit={async e => {
                e.preventDefault();
                setIsSavingSlide(true);
                await addSlide(slideForm);
                setIsSavingSlide(false);
                setSlideModalOpen(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block font-bold text-gray-700 mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  value={slideForm.title}
                  onChange={e => setSlideForm({ ...slideForm, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Subtitle Description</label>
                <input
                  type="text"
                  value={slideForm.subtitle}
                  onChange={e => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Image URL *</label>
                <input
                  type="text"
                  required
                  value={slideForm.image}
                  onChange={e => setSlideForm({ ...slideForm, image: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={slideForm.badge}
                    onChange={e => setSlideForm({ ...slideForm, badge: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Destination Link</label>
                  <input
                    type="text"
                    value={slideForm.link}
                    onChange={e => setSlideForm({ ...slideForm, link: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  disabled={isSavingSlide}
                  onClick={() => setSlideModalOpen(false)}
                  className="flex-1 py-2.5 border rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingSlide}
                  className="flex-1 py-2.5 bg-[#D91E2A] text-white rounded-xl font-bold flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isSavingSlide && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create Slide</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECT RECEIPT MODAL */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <h3 className="text-base font-bold text-red-600">Reject Payment Receipt</h3>
            <p className="text-gray-600 leading-relaxed">
              Please enter the official reason for rejecting this transfer receipt. The reason will be recorded and visible to the customer.
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-2.5 outline-none focus:border-red-500"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="flex-1 py-2.5 border rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (rejectReceiptId) {
                    await verifyPaymentReceipt(rejectReceiptId, false, rejectionReason);
                  }
                  setRejectModalOpen(false);
                }}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
