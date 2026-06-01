import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import AdminProducts from './AdminProducts';
import AdminUpload from './AdminUpload';
import AdminOrders from './AdminOrders';
import AdminAffiliates from './AdminAffiliates';
import AdminCustomers from './AdminCustomers';
import { ordersApi, productsApi } from '@/lib/api';
import { IMAGES } from '@/data/images';
import {
  LayoutDashboard, Package, PlusCircle, ShoppingCart,
  LogOut, Menu, X, Users, UserCircle
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard',      path: '/admin',            icon: LayoutDashboard, exact: true },
  { label: 'Products',       path: '/admin/products',   icon: Package },
  { label: 'Upload Product', path: '/admin/upload',     icon: PlusCircle },
  { label: 'Orders',         path: '/admin/orders',     icon: ShoppingCart },
  { label: 'Customers',      path: '/admin/customers',  icon: UserCircle },
  { label: 'Affiliates',     path: '/admin/affiliates', icon: Users },
];

function AdminSidebar({ mobile, onClose }) {
  const location = useLocation();
  return (
    <div className={`${mobile ? 'flex' : 'hidden lg:flex'} flex-col h-full bg-foreground text-background w-64 flex-shrink-0`}>
      <div className="px-6 py-6 border-b border-background/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={IMAGES.logo} alt="SMYT" className="h-9 brightness-0 invert" />
          </div>
          {mobile && (
            <button onClick={onClose} className="text-background/60 hover:text-background">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-background/40 mt-2 font-medium">
          Admin Panel
        </p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map(({ label, path, icon: Icon, exact }) => {
          const isActive = exact
            ? location.pathname === path
            : location.pathname.startsWith(path);
          return (
            <Link
              key={path}
              to={path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent text-white'
                  : 'text-background/60 hover:text-background hover:bg-background/10'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-5 border-t border-background/10">
        <p className="text-[10px] uppercase tracking-widest text-background/30 font-semibold">
          Built, Not Given.
        </p>
        <Link to="/" className="flex items-center gap-2 mt-4 text-xs text-background/50 hover:text-background transition-colors">
          <LogOut className="w-3.5 h-3.5" />
          Back to Store
        </Link>
      </div>
    </div>
  );
}

export default function Admin() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const currentItem = navItems.find(item =>
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)
  ) || navItems[0];

  return (
    <div className="flex h-screen bg-secondary overflow-hidden">
      <AdminSidebar />

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <AdminSidebar mobile onClose={() => setMobileOpen(false)} />
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-background border-b border-border px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1 hover:bg-muted transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold tracking-tight">{currentItem.label}</h1>
              <p className="text-xs text-muted-foreground">SMYT Admin Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-xs text-muted-foreground font-medium">Admin</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="upload" element={<AdminUpload />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="affiliates" element={<AdminAffiliates />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

const PAID_STATUSES = ['paid', 'confirmed', 'delivered', 'completed', 'processing'];

function formatRevenue(val) {
  if (val >= 1_000_000) return `₦${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000)     return `₦${(val / 1_000).toFixed(0)}K`;
  return `₦${val.toLocaleString()}`;
}

function AdminDashboard() {
  const [liveStats, setLiveStats] = useState({
    revenue: null,
    customers: null,
    orders: null,
    products: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchAll() {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          ordersApi.list({ limit: 10000 }),
          productsApi.list({ limit: 10000 }),
        ]);

        // Normalise — your API may wrap in .data.orders or just .data
        const orders   = ordersRes.data?.orders   ?? ordersRes.data   ?? [];
        const products = productsRes.data?.products ?? productsRes.data ?? [];

        const revenue = orders
          .filter(o => PAID_STATUSES.includes((o.status ?? '').toLowerCase()))
          .reduce((sum, o) => sum + Number(o.total_amount ?? o.total ?? o.amount ?? 0), 0);

        const uniqueCustomers = new Set(
          orders
            .map(o => o.customer_email ?? o.email ?? o.customer_id ?? o.user_id)
            .filter(Boolean)
        ).size;

        setLiveStats({
          revenue,
          customers: uniqueCustomers,
          orders: orders.length,
          products: Array.isArray(products) ? products.length : products,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error('Dashboard stats error:', err);
        setLiveStats(s => ({ ...s, loading: false, error: 'Failed to load' }));
      }
    }

    fetchAll();
  }, []);

  const { loading, error, revenue, customers, orders, products } = liveStats;

  const stats = [
    {
      label: 'Total Products',
      value: loading ? '…' : error ? '—' : (products ?? '—').toLocaleString(),
      change: error ?? 'All listed products',
      color: 'bg-foreground',
    },
    {
      label: 'Total Orders',
      value: loading ? '…' : error ? '—' : (orders ?? '—').toLocaleString(),
      change: error ?? 'All time',
      color: 'bg-accent',
    },
    {
      label: 'Revenue',
      value: loading ? '…' : error ? '—' : formatRevenue(revenue ?? 0),
      change: error ?? 'Paid orders only',
      color: 'bg-foreground',
    },
    {
      label: 'Customers',
      value: loading ? '…' : error ? '—' : (customers ?? '—').toLocaleString(),
      change: error ?? 'Unique by email',
      color: 'bg-accent',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-background border border-border p-6">
            <div className={`w-10 h-1 ${stat.color} mb-4`} />
            <p className={`text-2xl font-black tracking-tight ${loading ? 'animate-pulse text-muted-foreground' : ''}`}>
              {stat.value}
            </p>
            <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mt-1">
              {stat.label}
            </p>
            <p className={`text-xs mt-2 font-medium ${error ? 'text-red-500' : 'text-green-600'}`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-background border border-border p-6">
        <h2 className="text-sm uppercase tracking-[0.2em] font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/admin/upload" className="flex items-center gap-3 border-2 border-dashed border-border hover:border-foreground p-5 transition-colors group">
            <PlusCircle className="w-5 h-5 text-muted-foreground group-hover:text-accent" />
            <span className="text-sm font-medium">Upload New Product</span>
          </Link>
          <Link to="/admin/products" className="flex items-center gap-3 border-2 border-dashed border-border hover:border-foreground p-5 transition-colors group">
            <Package className="w-5 h-5 text-muted-foreground group-hover:text-accent" />
            <span className="text-sm font-medium">Manage Products</span>
          </Link>
          <Link to="/admin/orders" className="flex items-center gap-3 border-2 border-dashed border-border hover:border-foreground p-5 transition-colors group">
            <ShoppingCart className="w-5 h-5 text-muted-foreground group-hover:text-accent" />
            <span className="text-sm font-medium">View Orders</span>
          </Link>
        </div>
      </div>

      {/* Brand strip */}
      <div className="bg-foreground text-background p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-background/50 font-medium">SMYT Brand</p>
          <p className="text-xl font-black tracking-tight mt-1">Self Made You Today</p>
        </div>
        <div className="flex gap-2">
          <div className="w-6 h-6 bg-background" />
          <div className="w-6 h-6 bg-accent" />
          <div className="w-6 h-6 bg-background/20" />
        </div>
      </div>
    </div>
  );
}
