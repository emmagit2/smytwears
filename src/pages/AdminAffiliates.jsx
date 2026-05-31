import React, { useState, useEffect } from 'react';
import { affiliatesApi } from '@/api/apiClient';
import { CheckCircle, XCircle, Clock, Search, TrendingUp, DollarSign, Users } from 'lucide-react';
import { formatPrice } from '@/data/products';

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-green-50 text-green-700 border-green-200',
  suspended: 'bg-red-50 text-red-700 border-red-200',
};

export default function AdminAffiliates() {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

useEffect(() => {
  affiliatesApi.list().then(({ data }) => {
    setAffiliates(data);
    setLoading(false);
  }).catch(() => setLoading(false));
}, []);

 const updateStatus = async (id, status) => {
  await affiliatesApi.approve({ id, status });
  setAffiliates(prev => prev.map(a => a.id === id ? { ...a, status } : a));
};
  const filtered = affiliates.filter(a => {
    const matchSearch = a.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.referral_code?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || a.status === filter;
    return matchSearch && matchFilter;
  });

  const totalEarnings = affiliates.reduce((s, a) => s + (a.total_earnings || 0), 0);
  const totalSales = affiliates.reduce((s, a) => s + (a.total_sales || 0), 0);

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Users, label: 'Total Affiliates', value: affiliates.length },
          { icon: CheckCircle, label: 'Approved', value: affiliates.filter(a => a.status === 'approved').length },
          { icon: Clock, label: 'Pending', value: affiliates.filter(a => a.status === 'pending').length },
          { icon: DollarSign, label: 'Total Commissions', value: formatPrice(totalEarnings) },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white border border-gray-100 p-5 rounded-sm">
            <Icon className="w-4 h-4 text-gray-400 mb-2" />
            <p className="text-xl font-black text-gray-900">{value}</p>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 p-5 mb-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 focus:outline-none focus:border-gray-400"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'suspended'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-bold border transition-colors ${
                filter === s ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-500 hover:border-gray-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading affiliates...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">No affiliates found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Name', 'Code', 'Instagram', 'Status', 'Referrals', 'Sales', 'Earned', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-gray-500 font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900 text-xs">{a.full_name}</p>
                    <p className="text-[11px] text-gray-400">{a.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5">{a.referral_code}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{a.instagram_handle || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 border ${STATUS_STYLES[a.status]}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-700 font-semibold">{a.total_referrals || 0}</td>
                  <td className="px-4 py-3 text-xs text-gray-700">{formatPrice(a.total_sales || 0)}</td>
                  <td className="px-4 py-3 text-xs font-bold" style={{ color: '#8e2424' }}>{formatPrice(a.total_earnings || 0)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      {a.status !== 'approved' && (
                        <button
                          onClick={() => updateStatus(a.id, 'approved')}
                          className="p-1.5 text-green-600 hover:bg-green-50 transition-colors" title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {a.status !== 'suspended' && (
                        <button
                          onClick={() => updateStatus(a.id, 'suspended')}
                          className="p-1.5 text-red-500 hover:bg-red-50 transition-colors" title="Suspend"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                      {a.status !== 'pending' && (
                        <button
                          onClick={() => updateStatus(a.id, 'pending')}
                          className="p-1.5 text-amber-500 hover:bg-amber-50 transition-colors" title="Set Pending"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}