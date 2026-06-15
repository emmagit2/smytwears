import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, MapPin, Package, XCircle } from 'lucide-react';

const PRIMARY = '#8e2424';

const STATUS_STEPS = {
  processing:        1,
  confirmed:         2,
  shipped:           3,
  out_for_delivery:  4,
  delivered:         5,
  cancelled:         0,
};

const STEPS = [
  { key: 'processing',       label: 'Order Placed' },
  { key: 'confirmed',        label: 'Payment Confirmed' },
  { key: 'shipped',          label: 'Shipped' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered',        label: 'Delivered' },
];

const STATUS_CONFIG = {
  processing:        { label: 'Processing',        color: '#2563eb', bg: '#eff6ff' },
  confirmed:         { label: 'Confirmed',         color: '#7c3aed', bg: '#f5f3ff' },
  shipped:           { label: 'Shipped',           color: '#0891b2', bg: '#ecfeff' },
  out_for_delivery:  { label: 'Out for Delivery',  color: '#d97706', bg: '#fffbeb' },
  delivered:         { label: 'Delivered',         color: '#16a34a', bg: '#f0fdf4' },
  cancelled:         { label: 'Cancelled',         color: '#dc2626', bg: '#fef2f2' },
};

const PAYMENT_CONFIG = {
  pending: { label: 'Payment Pending', color: '#d97706', bg: '#fffbeb' },
  paid:    { label: 'Paid',            color: '#16a34a', bg: '#f0fdf4' },
  failed:  { label: 'Payment Failed',  color: '#dc2626', bg: '#fef2f2' },
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-NG', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function formatPrice(n) {
  return '₦' + Number(n).toLocaleString('en-NG');
}

export default function TrackOrder() {
  const [query,   setQuery]   = useState('');
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const num = params.get('order');
    if (num) { setQuery(num); fetchOrder(num); }
  }, []);

  async function fetchOrder(orderNumber) {
    const num = (orderNumber || query).trim().toUpperCase();
    if (!num) return;
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || ''}/api/orders/track?order_number=${encodeURIComponent(num)}`
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Order not found. Check your order number and try again.');
      } else {
        setOrder(data);
      }
    } catch {
      setError('Could not connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    fetchOrder(query);
  }

  const statusCfg  = order ? (STATUS_CONFIG[order.status]  || STATUS_CONFIG.processing) : null;
  const paymentCfg = order ? (PAYMENT_CONFIG[order.payment_status] || PAYMENT_CONFIG.pending) : null;
  const doneCount  = order ? (STATUS_STEPS[order.status] ?? 1) : 0;
  const cancelled  = order?.status === 'cancelled';

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="py-16 text-white" style={{ background: `linear-gradient(135deg, #1a1a1a 0%, ${PRIMARY} 100%)` }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-white/40" />
            <span className="text-xs uppercase tracking-[0.3em] text-white/60 font-semibold">SMYT</span>
            <div className="w-8 h-px bg-white/40" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">Track Your Order</h1>
          <p className="text-white/60 text-sm max-w-sm mx-auto">
            Enter your SMYT order number to get live updates on your delivery.
          </p>

          <form onSubmit={handleSearch} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="e.g. SMYT-A1B2C3"
                className="w-full pl-11 pr-4 py-4 text-gray-900 text-sm focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 text-xs uppercase tracking-widest font-bold text-white whitespace-nowrap disabled:opacity-60"
              style={{ backgroundColor: PRIMARY }}
            >
              {loading ? 'Searching…' : 'Track Order'}
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6">

        {error && (
          <div className="border border-red-100 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-800">Order not found</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {loading && (
          <div className="bg-white border border-gray-100 p-6 animate-pulse space-y-4">
            <div className="h-4 bg-gray-100 rounded w-1/3" />
            <div className="h-8 bg-gray-100 rounded w-1/2" />
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
          </div>
        )}

        {order && !loading && (
          <>
            <div className="bg-white border border-gray-100 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Order Number</p>
                  <p className="text-xl font-black mt-1 font-mono">{order.order_number}</p>
                </div>
                <div className="flex flex-wrap gap-2 self-start">
                  <span
                    className="inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-wider"
                    style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
                  >
                    {statusCfg.label}
                  </span>
                  <span
                    className="inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-wider"
                    style={{ backgroundColor: paymentCfg.bg, color: paymentCfg.color }}
                  >
                    {paymentCfg.label}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Customer</p>
                  <p className="font-semibold mt-1">{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Items</p>
                  <p className="font-semibold mt-1">{order.items_count} item{order.items_count !== 1 ? 's' : ''}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Total</p>
                  <p className="font-semibold mt-1">{formatPrice(order.total)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Order Date</p>
                  <p className="font-semibold mt-1">{formatDate(order.created_date)}</p>
                </div>
              </div>
            </div>

            {cancelled ? (
              <div className="bg-white border border-red-100 shadow-sm p-6 flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-red-50 flex-shrink-0">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">This order has been cancelled</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    If you have questions, <a href="/contact" style={{ color: PRIMARY }} className="underline">contact us</a>.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-100 shadow-sm p-6">
                <h3 className="text-xs uppercase tracking-widest font-bold text-gray-900 mb-6">Delivery Progress</h3>
                <div className="relative">
                  <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-100" />
                  <div
                    className="absolute left-5 top-5 w-0.5 transition-all duration-700"
                    style={{
                      backgroundColor: PRIMARY,
                      height: `${Math.max(0, ((doneCount - 1) / (STEPS.length - 1))) * 100}%`,
                    }}
                  />
                  <div className="space-y-6">
                    {STEPS.map((step, i) => {
                      const done    = i < doneCount;
                      const current = i === doneCount - 1;
                      return (
                        <div key={step.key} className="flex items-start gap-5 relative">
                          <div
                            className="w-10 h-10 flex items-center justify-center flex-shrink-0 z-10 border-2 transition-colors"
                            style={{
                              backgroundColor: done ? PRIMARY : 'white',
                              borderColor:     done ? PRIMARY : '#e5e7eb',
                            }}
                          >
                            {done
                              ? <CheckCircle className="w-4 h-4 text-white" />
                              : <div className="w-2 h-2 rounded-full bg-gray-300" />
                            }
                          </div>
                          <div className="pt-2">
                            <p className={`text-sm font-semibold ${done ? 'text-gray-900' : 'text-gray-400'}`}>
                              {step.label}
                              {current && (
                                <span
                                  className="ml-2 text-xs font-bold px-2 py-0.5 uppercase tracking-wide"
                                  style={{ backgroundColor: '#fff7ed', color: '#d97706' }}
                                >
                                  Current
                                </span>
                              )}
                            </p>
                            {done && i === 0 && (
                              <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.created_date)}</p>
                            )}
                            {done && i === doneCount - 1 && i > 0 && (
                              <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.updated_date)}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {order.tracking_info && (
              <div className="bg-white border border-gray-100 shadow-sm p-6">
                <p className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-2">Tracking Info</p>
                <p className="text-sm text-gray-700 leading-relaxed">{order.tracking_info}</p>
              </div>
            )}

            <div className="bg-white border border-gray-100 shadow-sm p-6 flex items-center gap-4">
              <div
                className="w-10 h-10 flex items-center justify-center text-white flex-shrink-0"
                style={{ backgroundColor: PRIMARY }}
              >
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Delivering to</p>
                <p className="font-semibold text-sm mt-0.5">{order.delivery_state}, Nigeria</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Last Updated</p>
                <p className="text-sm font-semibold mt-0.5">{formatDate(order.updated_date)}</p>
              </div>
            </div>

            <p className="text-xs text-center text-gray-400">
              Need help?{' '}
              <a href="/contact" className="font-semibold underline" style={{ color: PRIMARY }}>Contact us</a>
              {' '}or call{' '}
              <a href="tel:07054527285" className="font-semibold underline" style={{ color: PRIMARY }}>07054527285</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}