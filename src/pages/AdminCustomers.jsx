import React, { useState } from 'react';
import { Search, Mail, Phone, MapPin, X, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/data/products';

const MOCK_CUSTOMERS = [
  { id: 1, name: 'Emeka Okafor', email: 'emeka@email.com', phone: '08012345678', state: 'Lagos', orders: 3, totalSpent: 132000, lastOrder: '2026-05-20', status: 'active' },
  { id: 2, name: 'Chioma Adeyemi', email: 'chioma@email.com', phone: '07087654321', state: 'Abuja', orders: 1, totalSpent: 18000, lastOrder: '2026-05-23', status: 'active' },
  { id: 3, name: 'Tunde Balogun', email: 'tunde@email.com', phone: '09011223344', state: 'Ogun', orders: 5, totalSpent: 198000, lastOrder: '2026-05-22', status: 'active' },
  { id: 4, name: 'Amara Nwosu', email: 'amara@email.com', phone: '08099887766', state: 'Enugu', orders: 2, totalSpent: 90000, lastOrder: '2026-05-24', status: 'active' },
  { id: 5, name: 'Fola Adeleke', email: 'fola@email.com', phone: '07055443322', state: 'Lagos', orders: 4, totalSpent: 228000, lastOrder: '2026-05-18', status: 'vip' },
  { id: 6, name: 'Kola Fashola', email: 'kola@email.com', phone: '08123456789', state: 'Oyo', orders: 1, totalSpent: 12000, lastOrder: '2026-05-21', status: 'inactive' },
  { id: 7, name: 'Ngozi Eze', email: 'ngozi@email.com', phone: '09034567890', state: 'Anambra', orders: 6, totalSpent: 360000, lastOrder: '2026-05-25', status: 'vip' },
  { id: 8, name: 'Bayo Ogundimu', email: 'bayo@email.com', phone: '08065432109', state: 'Lagos', orders: 2, totalSpent: 51000, lastOrder: '2026-05-10', status: 'active' },
];

const statusConfig = {
  active:   { label: 'Active',   classes: 'bg-blue-50 text-blue-700' },
  vip:      { label: 'VIP',      classes: 'bg-yellow-50 text-yellow-700' },
  inactive: { label: 'Inactive', classes: 'bg-gray-100 text-gray-500' },
};

export default function AdminCustomers() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = MOCK_CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.email.toLowerCase().includes(query.toLowerCase()) ||
    c.state.toLowerCase().includes(query.toLowerCase())
  );

  const totalRevenue = MOCK_CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0);
  const vipCount = MOCK_CUSTOMERS.filter(c => c.status === 'vip').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: MOCK_CUSTOMERS.length },
          { label: 'VIP Customers', value: vipCount },
          { label: 'Active', value: MOCK_CUSTOMERS.filter(c => c.status === 'active').length },
          { label: 'Total Revenue', value: formatPrice(totalRevenue) },
        ].map(s => (
          <div key={s.label} className="bg-background border border-border p-4">
            <div className="w-8 h-0.5 bg-foreground mb-3" />
            <p className="text-xl font-black">{s.value}</p>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-background border border-border p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search customers..."
            className="w-full border border-border pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-foreground"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-background border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary">
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-muted-foreground">Customer</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-muted-foreground hidden md:table-cell">Location</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-muted-foreground hidden sm:table-cell">Orders</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-muted-foreground">Spent</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-muted-foreground hidden lg:table-cell">Last Order</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-muted-foreground">Status</th>
              <th className="text-right px-4 py-3 text-xs uppercase tracking-widest font-semibold text-muted-foreground">View</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(customer => {
              const cfg = statusConfig[customer.status];
              return (
                <tr key={customer.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-foreground text-background flex items-center justify-center text-xs font-black flex-shrink-0">
                        {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <p className="text-sm text-muted-foreground">{customer.state}</p>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <p className="font-semibold">{customer.orders}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-bold">{formatPrice(customer.totalSpent)}</p>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <p className="text-sm text-muted-foreground">{customer.lastOrder}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2.5 py-1 font-semibold uppercase tracking-wider ${cfg.classes}`}>
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => setSelected(customer)}
                      className="w-8 h-8 inline-flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Customer Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-background w-full max-w-md border border-border">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-sm uppercase tracking-[0.2em] font-bold">Customer Profile</h2>
              <button onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Avatar + Name */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-foreground text-background flex items-center justify-center text-lg font-black">
                  {selected.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-lg font-black tracking-tight">{selected.name}</p>
                  <span className={`text-xs px-2.5 py-1 font-semibold uppercase tracking-wider ${statusConfig[selected.status].classes}`}>
                    {statusConfig[selected.status].label}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span>{selected.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span>{selected.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span>{selected.state}, Nigeria</span>
                </div>
              </div>

              {/* Order Stats */}
              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
                <div className="text-center">
                  <p className="text-2xl font-black">{selected.orders}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-black">{formatPrice(selected.totalSpent)}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Total Spent</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-black">{selected.lastOrder}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Last Order</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2 border-t border-border">
                <a
                  href={`mailto:${selected.email}`}
                  className="flex-1 flex items-center justify-center gap-2 border border-border py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-muted transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Email
                </a>
                <a
                  href={`https://wa.me/234${selected.phone.replace(/^0/, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-foreground/90 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}