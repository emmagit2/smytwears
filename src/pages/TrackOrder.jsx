import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { IMAGES } from '@/data/images';

const MOCK_ORDERS = {
  'SMYT-A1B2C3': {
    id: 'SMYT-A1B2C3',
    customer: 'Emeka Okafor',
    status: 'delivered',
    product: 'Self Starter Jogger — Black (M)',
    date: '2026-05-20',
    estimatedDelivery: '2026-05-24',
    city: 'Lagos',
    steps: [
      { label: 'Order Confirmed', date: 'May 20, 2026 · 10:34 AM', done: true },
      { label: 'Processing', date: 'May 20, 2026 · 2:00 PM', done: true },
      { label: 'Shipped', date: 'May 21, 2026 · 9:15 AM', done: true },
      { label: 'Out for Delivery', date: 'May 24, 2026 · 8:00 AM', done: true },
      { label: 'Delivered', date: 'May 24, 2026 · 1:22 PM', done: true },
    ],
  },
  'SMYT-D4E5F6': {
    id: 'SMYT-D4E5F6',
    customer: 'Chioma Adeyemi',
    status: 'shipped',
    product: 'Built Different Tee — White (L)',
    date: '2026-05-23',
    estimatedDelivery: '2026-05-27',
    city: 'Abuja',
    steps: [
      { label: 'Order Confirmed', date: 'May 23, 2026 · 11:00 AM', done: true },
      { label: 'Processing', date: 'May 23, 2026 · 3:00 PM', done: true },
      { label: 'Shipped', date: 'May 24, 2026 · 8:00 AM', done: true },
      { label: 'Out for Delivery', date: 'Estimated May 27', done: false },
      { label: 'Delivered', date: '', done: false },
    ],
  },
  'SMYT-G7H8I9': {
    id: 'SMYT-G7H8I9',
    customer: 'Tunde Balogun',
    status: 'processing',
    product: 'Movement Hoodie — Black (XL)',
    date: '2026-05-25',
    estimatedDelivery: '2026-05-29',
    city: 'Port Harcourt',
    steps: [
      { label: 'Order Confirmed', date: 'May 25, 2026 · 9:00 AM', done: true },
      { label: 'Processing', date: 'May 25, 2026 · 9:30 AM', done: true },
      { label: 'Shipped', date: 'Expected May 26', done: false },
      { label: 'Out for Delivery', date: 'Expected May 29', done: false },
      { label: 'Delivered', date: '', done: false },
    ],
  },
};

const statusConfig = {
  processing: { label: 'Processing', color: '#2563eb', bg: '#eff6ff' },
  shipped: { label: 'Shipped', color: '#7c3aed', bg: '#f5f3ff' },
  delivered: { label: 'Delivered', color: '#16a34a', bg: '#f0fdf4' },
};

export default function TrackOrder() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const order = MOCK_ORDERS[query.trim().toUpperCase()];
    if (order) {
      setResult(order);
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="py-16 text-white" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #8e2424 100%)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-white/40" />
            <span className="text-xs uppercase tracking-[0.3em] text-white/60 font-semibold">SMYT</span>
            <div className="w-8 h-px bg-white/40" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">Track Your Order</h1>
          <p className="text-white/60 text-sm max-w-sm mx-auto">
            Enter your SMYT order number below to get real-time updates on your delivery.
          </p>

          {/* Search */}
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
              className="px-8 py-4 text-xs uppercase tracking-widest font-bold text-white whitespace-nowrap"
              style={{ backgroundColor: '#8e2424' }}
            >
              Track Order
            </button>
          </form>
          <p className="text-white/30 text-xs mt-3">Try: SMYT-A1B2C3 · SMYT-D4E5F6 · SMYT-G7H8I9</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {notFound && (
          <div className="border border-red-100 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-800">Order not found</p>
            <p className="text-red-600 text-sm mt-1">Check your order number and try again. It was sent to your email after purchase.</p>
          </div>
        )}

        {result && (() => {
          const cfg = statusConfig[result.status] || statusConfig.processing;
          const doneCount = result.steps.filter(s => s.done).length;

          return (
            <div className="space-y-6">
              {/* Order summary card */}
              <div className="bg-white border border-gray-100 shadow-sm p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Order Number</p>
                    <p className="text-xl font-black mt-1 font-mono">{result.id}</p>
                  </div>
                  <span
                    className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider self-start sm:self-auto"
                    style={{ backgroundColor: cfg.bg, color: cfg.color }}
                  >
                    {cfg.label}
                  </span>
                </div>
                <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Customer</p>
                    <p className="font-semibold mt-1">{result.customer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Product</p>
                    <p className="font-semibold mt-1">{result.product}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Est. Delivery</p>
                    <p className="font-semibold mt-1">{result.estimatedDelivery}</p>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="bg-white border border-gray-100 shadow-sm p-6">
                <h3 className="text-xs uppercase tracking-widest font-bold text-gray-900 mb-6">Delivery Progress</h3>
                <div className="relative">
                  {/* Track line */}
                  <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-100" />
                  <div
                    className="absolute left-5 top-5 w-0.5 transition-all duration-700"
                    style={{
                      backgroundColor: '#8e2424',
                      height: `${Math.max(0, ((doneCount - 1) / (result.steps.length - 1))) * 100}%`,
                    }}
                  />

                  <div className="space-y-6">
                    {result.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-5 relative">
                        {/* Dot */}
                        <div
                          className="w-10 h-10 flex items-center justify-center flex-shrink-0 z-10 border-2"
                          style={{
                            backgroundColor: step.done ? '#8e2424' : 'white',
                            borderColor: step.done ? '#8e2424' : '#e5e7eb',
                          }}
                        >
                          {step.done ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-gray-300" />
                          )}
                        </div>
                        <div className="pt-2">
                          <p className={`text-sm font-semibold ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>
                            {step.label}
                          </p>
                          {step.date && (
                            <p className="text-xs text-gray-400 mt-0.5">{step.date}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-white border border-gray-100 shadow-sm p-6 flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: '#8e2424' }}>
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Delivering to</p>
                  <p className="font-semibold text-sm mt-0.5">{result.city}, Nigeria</p>
                </div>
              </div>

              <p className="text-xs text-center text-gray-400">
                Need help? <a href="/contact" className="font-semibold underline" style={{ color: '#8e2424' }}>Contact us</a> or call <a href="tel:07054527285" className="font-semibold underline" style={{ color: '#8e2424' }}>07054527285</a>
              </p>
            </div>
          );
        })()}
      </div>
    </div>
  );
}