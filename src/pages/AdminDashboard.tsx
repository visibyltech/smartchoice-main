import React, { useState } from 'react';
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
  Upload,
  ArrowUp,
  ArrowDown,
  Store
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
    storeConfig,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    addSlide,
    updateSlide,
    deleteSlide,
    updateOrderStatus,
    verifyPaymentReceipt,
    authorizeProductRelease
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'products'
    | 'categories'
    | 'slides'
    | 'orders'
    | 'payments'
    | 'save-to-buy'
    | 'klump'
    | 'delivery'
    | 'messages'
  >('overview');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');

  // Product Create/Edit Modal state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
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
    images: [''],
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
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'verified' ? o.totalAmount : 0), 0);
  const pendingOrders = orders.filter(o => o.orderStatus === 'payment_pending' || o.orderStatus === 'received').length;
  const confirmedOrders = orders.filter(o => o.paymentStatus === 'verified').length;
  const lowStockProducts = products.filter(p => p.stock <= 5).length;
  const activePlans = saveToBuyPlans.filter(p => p.status === 'active').length;
  const completedPlans = saveToBuyPlans.filter(p => p.status === 'completed').length;
  const pendingReceipts = paymentReceipts.filter(r => r.status === 'pending').length;

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
      description: 'Brand new official home appliance with Nigerian warranty.',
      warranty: '2 Years Manufacturer Warranty',
      images: [
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?auto=format&fit=crop&w=800&q=80'
      ],
      specifications: {
        'Condition': 'Brand New Factory Sealed',
        'Origin': 'Official Manufacturer Unit',
        'Warranty': 'Local Port Harcourt Service Center'
      }
    });
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
      images: product.images.length > 0 ? [...product.images] : [''],
      specifications: { ...product.specifications }
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const category = categories.find(c => c.id === productForm.categoryId);
    const categoryName = category ? category.name : 'General Merchandise';
    const slug = productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const filteredImages = productForm.images.filter(img => img.trim().length > 0);
    if (filteredImages.length === 0) {
      filteredImages.push('https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80');
    }

    if (editingProduct) {
      await updateProduct(editingProduct.id, {
        ...productForm,
        slug,
        categoryName,
        images: filteredImages
      });
    } else {
      await addProduct({
        ...productForm,
        slug,
        categoryName,
        images: filteredImages
      });
    }
    setProductModalOpen(false);
  };

  // Add image URL slot (supports 4-5 images)
  const addImageSlot = () => {
    if (productForm.images.length < 5) {
      setProductForm(prev => ({
        ...prev,
        images: [...prev.images, '']
      }));
    }
  };

  const updateImageUrl = (index: number, val: string) => {
    setProductForm(prev => {
      const updated = [...prev.images];
      updated[index] = val;
      return { ...prev, images: updated };
    });
  };

  const removeImageUrl = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const setAsMainImage = (index: number) => {
    setProductForm(prev => {
      const main = prev.images[index];
      const remaining = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: [main, ...remaining] };
    });
  };

  // Handle local photo file upload to convert to Data URL for image slot
  const handlePhotoFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateImageUrl(index, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSpec = () => {
    if (!specKey.trim() || !specVal.trim()) return;
    setProductForm(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [specKey.trim()]: specVal.trim()
      }
    }));
    setSpecKey('');
    setSpecVal('');
  };

  const handleRemoveSpec = (keyToRemove: string) => {
    setProductForm(prev => {
      const updated = { ...prev.specifications };
      delete updated[keyToRemove];
      return { ...prev, specifications: updated };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Admin Bar */}
      <header className="bg-[#0A1931] text-white px-6 py-3 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-[#D91E2A]" />
          <div>
            <h1 className="text-base font-extrabold tracking-tight">Smart Choice Admin Portal</h1>
            <p className="text-[10px] text-gray-400">Port Harcourt Store Operations & Verification</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 rounded-full font-bold hidden sm:inline">
            ● System Active
          </span>
          <button
            onClick={onExitAdmin}
            className="text-xs font-bold text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition"
          >
            Exit to Storefront
          </button>
        </div>
      </header>

      {/* Main Admin Layout: Sidebar + Workspace */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-[#0D2240] text-gray-300 p-4 border-r border-slate-800 shrink-0">
          <nav className="space-y-1 text-xs font-semibold">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'products', label: 'Products Catalog', icon: Package, count: products.length },
              { id: 'categories', label: 'Categories', icon: Layers, count: categories.length },
              { id: 'slides', label: 'Homepage Slides', icon: ImageIcon, count: slides.length },
              { id: 'orders', label: 'Orders & Fulfillment', icon: ShoppingCart, count: orders.length, alert: pendingOrders > 0 },
              { id: 'payments', label: 'Payment Receipts', icon: CreditCard, count: pendingReceipts, alert: pendingReceipts > 0 },
              { id: 'save-to-buy', label: 'Save to Buy Plans', icon: Clock, count: saveToBuyPlans.length },
              { id: 'klump', label: 'Klump Transactions', icon: Zap },
              { id: 'delivery', label: 'Delivery & Pickups', icon: Truck },
              { id: 'messages', label: 'Contact Inquiries', icon: MessageSquare, count: contactMessages.length }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                    isActive
                      ? 'bg-[#D91E2A] text-white shadow-sm font-bold'
                      : 'hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      tab.alert ? 'bg-amber-400 text-black' : 'bg-slate-800 text-gray-300'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Info Box */}
          <div className="mt-8 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-gray-400 space-y-1">
            <p className="font-bold text-white uppercase text-[10px] tracking-wider">Showrooms Connected</p>
            <p>1. 71 NTA Road (+234 816 589 6158)</p>
            <p>2. Smart Choice Plaza (+234 816 592 9400)</p>
          </div>
        </aside>

        {/* Workspace */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <h2 className="text-xl sm:text-2xl font-black text-[#0A1931]">Store Analytics Overview</h2>
                <span className="text-xs text-gray-500 font-semibold">Real-time Port Harcourt Store Performance</span>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                  <span className="text-xs text-gray-500 font-semibold uppercase">Total Confirmed Revenue</span>
                  <div className="text-xl sm:text-2xl font-black text-emerald-800">{formatNaira(totalRevenue)}</div>
                  <span className="text-[10px] text-gray-400">Verified bank transfers & payments</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                  <span className="text-xs text-gray-500 font-semibold uppercase">Pending Receipts</span>
                  <div className="text-xl sm:text-2xl font-black text-[#D91E2A]">{pendingReceipts}</div>
                  <span className="text-[10px] text-gray-400">Requires admin confirmation</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                  <span className="text-xs text-gray-500 font-semibold uppercase">Save to Buy Plans</span>
                  <div className="text-xl sm:text-2xl font-black text-blue-900">{activePlans} Active / {completedPlans} Done</div>
                  <span className="text-[10px] text-gray-400">1 to 4 month installment plans</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
                  <span className="text-xs text-gray-500 font-semibold uppercase">Products in Catalog</span>
                  <div className="text-xl sm:text-2xl font-black text-[#0A1931]">{products.length} Items</div>
                  <span className="text-[10px] text-amber-600 font-bold">{lowStockProducts} low stock items</span>
                </div>
              </div>

              {/* Recent Orders & Save to Buy alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <h3 className="font-bold text-sm text-gray-900">Recent Customer Orders</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-xs text-blue-600 font-bold hover:underline">
                      View All ({orders.length})
                    </button>
                  </div>
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
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <h3 className="font-bold text-sm text-gray-900">Pending Receipt Verifications</h3>
                    <button onClick={() => setActiveTab('payments')} className="text-xs text-[#D91E2A] font-bold hover:underline">
                      Manage Receipts
                    </button>
                  </div>
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
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS CATALOG */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0A1931]">Products Management</h2>
                  <p className="text-xs text-gray-500">Add, edit, archive, upload 4-5 photos, manage stock and verified specifications</p>
                </div>

                <button
                  onClick={openNewProductModal}
                  className="bg-[#D91E2A] hover:bg-[#b81822] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Products Table */}
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
                      {products.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="p-3.5 flex items-center gap-3">
                            <img
                              src={p.images[0] || ''}
                              alt={p.name}
                              className="w-12 h-12 object-contain bg-gray-50 rounded border p-1"
                            />
                            <div>
                              <p className="font-bold text-gray-900 line-clamp-1">{p.name}</p>
                              <span className="text-[10px] text-gray-500 font-mono">Brand: {p.brand}</span>
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
                          <td className="p-3.5 font-semibold text-gray-600">{p.images.length} photos</td>
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
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete ${p.name}?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DYNAMIC CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0A1931]">Dynamic Categories</h2>
                  <p className="text-xs text-gray-500">Created categories immediately appear in storefront sliders, shop filters, and product forms</p>
                </div>
                <button
                  onClick={() => {
                    setCategoryForm({ name: '', image: '', displayOnHome: true });
                    setCategoryModalOpen(true);
                  }}
                  className="bg-[#D91E2A] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2"
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
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded"
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

          {/* TAB 4: HOMEPAGE SLIDES */}
          {activeTab === 'slides' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0A1931]">Homepage Slideshow Manager</h2>
                  <p className="text-xs text-gray-500">Manage slideshow titles, imagery, links, badges, and activation</p>
                </div>
                <button
                  onClick={() => {
                    setSlideForm({
                      title: '',
                      subtitle: '',
                      badge: 'NEW ARRIVALS 2026',
                      image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80',
                      link: '/shop',
                      buttonText: 'Shop Now',
                      sortOrder: slides.length + 1,
                      isActive: true
                    });
                    setSlideModalOpen(true);
                  }}
                  className="bg-[#D91E2A] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Slide</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {slides.map(slide => (
                  <div key={slide.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
                    <div className="relative h-40">
                      <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 p-3 flex flex-col justify-between text-white">
                        <span className="text-[10px] font-bold bg-[#D91E2A] px-2 py-0.5 rounded w-fit">{slide.badge}</span>
                        <h4 className="font-bold text-sm leading-snug drop-shadow">{slide.title}</h4>
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-between text-xs">
                      <div>
                        <p className="text-gray-500 line-clamp-1">{slide.subtitle}</p>
                        <span className="text-[11px] font-mono text-blue-700">{slide.link}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateSlide(slide.id, { isActive: !slide.isActive })}
                          className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                            slide.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {slide.isActive ? 'Active' : 'Disabled'}
                        </button>
                        <button
                          onClick={() => deleteSlide(slide.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ORDERS & FULFILLMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0A1931]">Orders & Timeline Tracking</h2>
                  <p className="text-xs text-gray-500">Update order fulfillment status, attach notes, inspect receipts</p>
                </div>
              </div>

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

                    {/* Order details & delivery */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <p className="font-bold text-gray-700">Fulfillment Method:</p>
                        <p className="text-gray-900 font-semibold">
                          {order.fulfillmentType === 'pickup'
                            ? `Showroom Pickup at ${order.pickupShowroom === 'showroom-2' ? 'Showroom 2 (Smart Choice Plaza)' : 'Showroom 1 (71 NTA Rd)'}`
                            : `Home Delivery: ${order.deliveryAddress?.address}, ${order.deliveryAddress?.lga}, ${order.deliveryAddress?.state}`}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="font-bold text-gray-700">Payment Status:</p>
                        <p className="text-gray-900 font-semibold uppercase">
                          {order.paymentMethod} • {order.paymentStatus}
                        </p>
                        {order.receiptUrl && (
                          <a
                            href={order.receiptUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block text-blue-700 font-bold hover:underline"
                          >
                            View Customer Receipt ↗
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Change Status Control */}
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
                            onClick={() => updateOrderStatus(order.id, st as any, `Updated by Admin to ${st}`)}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase transition ${
                              order.orderStatus === st
                                ? 'bg-[#0A1931] text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                          >
                            {st.replace(/_/g, ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PAYMENT RECEIPTS */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0A1931]">Payment Receipts Verification</h2>
                  <p className="text-xs text-gray-500">Verify or reject customer bank transfers for direct orders and Save to Buy installments</p>
                </div>
              </div>

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
                            onClick={() => verifyPaymentReceipt(rec.id, true)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                          >
                            Verify & Credit
                          </button>
                          <button
                            onClick={() => {
                              setRejectReceiptId(rec.id);
                              setRejectModalOpen(true);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: SAVE TO BUY MANAGEMENT */}
          {activeTab === 'save-to-buy' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0A1931]">Save to Buy Customer Plans</h2>
                  <p className="text-xs text-gray-500">Monitor balances, confirm installments, and authorize release ONLY when balance reaches ₦0</p>
                </div>
              </div>

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
            </div>
          )}

          {/* TAB 8: KLUMP TRANSACTIONS */}
          {activeTab === 'klump' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0A1931]">Klump BNPL Integration & Financing</h2>
                  <p className="text-xs text-gray-500">Monitor financing requests and verified Klump merchant transactions</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4 text-xs">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-bold text-blue-950 text-sm">Klump Merchant API Status</p>
                      <p className="text-blue-800">
                        {storeConfig?.klumpConfigured
                          ? 'Klump credentials configured and active'
                          : 'Klump Merchant Keys (KLUMP_PUBLIC_KEY, KLUMP_SECRET_KEY) pending live activation in server environment'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-gray-600 space-y-2">
                  <p className="font-bold text-gray-900">Integration Guidelines:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Klump checkout sessions are initiated via <code>POST /api/klump/checkout</code></li>
                    <li>Klump transaction verifications are executed via <code>GET /api/klump/verify/:reference</code></li>
                    <li>Orders are updated automatically upon verified callback from Klump servers.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: DELIVERY & PICKUPS */}
          {activeTab === 'delivery' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0A1931]">Delivery & Showroom Fulfillment</h2>
                  <p className="text-xs text-gray-500">Manage showroom collections (71 NTA Road & Smart Choice Plaza) and Greater Port Harcourt dispatch</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs space-y-3">
                  <h3 className="font-bold text-sm text-[#0A1931] flex items-center gap-2">
                    <Store className="w-4 h-4 text-emerald-600" />
                    <span>Showroom Pickups ({orders.filter(o => o.fulfillmentType === 'pickup').length})</span>
                  </h3>
                  <div className="divide-y divide-gray-100 text-xs">
                    {orders.filter(o => o.fulfillmentType === 'pickup').map(o => (
                      <div key={o.id} className="py-2.5 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-gray-900">{o.customerName} ({o.customerPhone})</p>
                          <p className="text-gray-500">
                            Location: {o.pickupShowroom === 'showroom-2' ? 'Showroom 2 (Smart Choice Plaza)' : 'Showroom 1 (71 NTA Rd)'}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                          {o.orderStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs space-y-3">
                  <h3 className="font-bold text-sm text-[#0A1931] flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span>Home Deliveries ({orders.filter(o => o.fulfillmentType === 'delivery').length})</span>
                  </h3>
                  <div className="divide-y divide-gray-100 text-xs">
                    {orders.filter(o => o.fulfillmentType === 'delivery').map(o => (
                      <div key={o.id} className="py-2.5 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-gray-900">{o.customerName} ({o.customerPhone})</p>
                          <p className="text-gray-500">{o.deliveryAddress?.address}, {o.deliveryAddress?.lga}</p>
                        </div>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                          {o.orderStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: CONTACT MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0A1931]">Customer Inquiries</h2>
                  <p className="text-xs text-gray-500">Inquiries submitted via the Contact Us page</p>
                </div>
              </div>

              {contactMessages.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-xs text-gray-500">
                  No contact messages received yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {contactMessages.map(msg => (
                    <div key={msg.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900 text-sm">{msg.firstName} {msg.lastName}</span>
                        <span className="text-gray-400 text-[11px]">{new Date(msg.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-gray-500">
                        Email: <strong className="text-gray-700">{msg.email}</strong> • Phone: <strong className="text-gray-700">{msg.phone}</strong> • Showroom: <strong className="text-blue-900">{msg.showroom}</strong>
                      </p>
                      <div className="p-3 bg-gray-50 rounded-xl text-gray-800 leading-relaxed">
                        {msg.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* PRODUCT CREATE / EDIT MODAL (Supports 4-5 Photos, Specifications Builder, Categories) */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-base font-black text-[#0A1931]">
                {editingProduct ? 'Edit Product' : 'Add New Product to Catalog'}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 font-bold text-lg"
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
                    className="w-full border border-gray-300 rounded-xl p-2.5 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={productForm.categoryId}
                    onChange={e => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-2.5 bg-white font-semibold"
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
                    className="w-full border border-gray-300 rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Model / SKU</label>
                  <input
                    type="text"
                    value={productForm.model}
                    onChange={e => setProductForm({ ...productForm, model: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Warranty Term</label>
                  <input
                    type="text"
                    value={productForm.warranty}
                    onChange={e => setProductForm({ ...productForm, warranty: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Selling Price (₦) *</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    value={productForm.price}
                    onChange={e => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-xl p-2.5 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Original Price (₦ strike-through)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={e => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-xl p-2.5"
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
                    className="w-full border border-gray-300 rounded-xl p-2.5"
                  />
                </div>
              </div>

              {/* 4 to 5 Photographs Management (Mandatory requirement) */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-gray-900 uppercase tracking-wider text-[11px]">
                    Product Photographs (4 - 5 Images Supported)
                  </label>
                  {productForm.images.length < 5 && (
                    <button
                      type="button"
                      onClick={addImageSlot}
                      className="text-xs text-blue-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Another Photo Slot</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {productForm.images.map((imgUrl, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="font-bold text-gray-500 w-6 text-center">#{idx + 1}</span>
                      {imgUrl ? (
                        <img src={imgUrl} alt={`Slot ${idx + 1}`} className="w-10 h-10 object-contain rounded bg-white border" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                      <input
                        type="text"
                        placeholder="Image URL or upload local image"
                        value={imgUrl}
                        onChange={e => updateImageUrl(idx, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg p-2 text-xs"
                      />
                      <label className="cursor-pointer bg-white border border-gray-300 hover:border-gray-500 px-2 py-1.5 rounded-lg text-[11px] font-semibold text-gray-700">
                        Browse
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => handlePhotoFileUpload(idx, e)}
                        />
                      </label>
                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={() => setAsMainImage(idx)}
                          className="text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded font-bold hover:bg-blue-100"
                        >
                          Make Main
                        </button>
                      )}
                      {productForm.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageUrl(idx)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={productForm.description}
                  onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2.5"
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
                    placeholder="Spec Name (e.g. Horsepower)"
                    value={specKey}
                    onChange={e => setSpecKey(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg p-2 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 1.5 HP Copper)"
                    value={specVal}
                    onChange={e => setSpecVal(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg p-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="bg-[#0A1931] text-white px-3 py-1.5 rounded-lg font-bold text-xs"
                  >
                    Add
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
                  <span>Published / Available</span>
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

              {/* Modal Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#D91E2A] hover:bg-[#b81822] text-white font-bold rounded-xl transition shadow-md"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
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
                const slug = categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                await addCategory({
                  name: categoryForm.name,
                  slug,
                  image: categoryForm.image || 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80',
                  displayOnHome: categoryForm.displayOnHome,
                  sortOrder: categories.length + 1
                });
                setCategoryModalOpen(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block font-bold text-gray-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smart Projectors & Screens"
                  value={categoryForm.name}
                  onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Category Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={categoryForm.image}
                  onChange={e => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2.5"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="flex-1 py-2.5 border rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#D91E2A] text-white rounded-xl font-bold"
                >
                  Save Category
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
                await addSlide(slideForm);
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
                  className="w-full border border-gray-300 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Subtitle Description</label>
                <input
                  type="text"
                  value={slideForm.subtitle}
                  onChange={e => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Image URL *</label>
                <input
                  type="text"
                  required
                  value={slideForm.image}
                  onChange={e => setSlideForm({ ...slideForm, image: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={slideForm.badge}
                    onChange={e => setSlideForm({ ...slideForm, badge: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Destination Link</label>
                  <input
                    type="text"
                    value={slideForm.link}
                    onChange={e => setSlideForm({ ...slideForm, link: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSlideModalOpen(false)}
                  className="flex-1 py-2.5 border rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#D91E2A] text-white rounded-xl font-bold"
                >
                  Create Slide
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
            <p className="text-gray-600">
              Please enter the official reason for rejecting this transfer receipt. The reason will be recorded and visible to the customer.
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-2.5"
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
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700"
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
