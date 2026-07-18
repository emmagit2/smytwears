import React, { useState, useEffect } from 'react';
import { affiliatesApi } from '@/api/apiClient';
import { CheckCircle, XCircle, Clock, Search, DollarSign, Users, Pencil, Check, X } from 'lucide-react';
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

  // Commission editing state
  const [editingId, setEditingId] = useState(null);
  const [rateInput, setRateInput] = useState('');
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    affiliatesApi.list().then(({ data }) => {
      setAffiliates(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // First-time approval (pending → approved): must go through /approve
  // since that's the only route that generates a referral_code.
  const approveAffiliate = async (id) => {
    try {
      const { data } = await affiliatesApi.approve(id);
      setAffiliates(prev => prev.map(a =>
        a.id === id ? { ...a, status: 'approved', referral_code: data.referral_code } : a
      ));
    } catch (err) {
      console.error('Failed to approve affiliate:', err);
    }
  };

  // Suspend / reinstate-to-pending / re-approve-an-already-approved
  // affiliate: goes through PATCH /:id, which never touches referral_code.
  const setStatus = async (id, status) => {
    try {
      await affiliatesApi.updateStatus(id, status);
      setAffiliates(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const startEditingCommission = (a) => {
    setEditingId(a.id);
    setRateInput(String(a.commission_rate ?? 10));
  };

  const cancelEditingCommission = () => {
    setEditingId(null);
    setRateInput('');
  };

  const saveCommission = async (id) => {
    const rate = parseFloat(rateInput);
    if (isNaN(rate) || rate < 0 || rate > 100) return;
    setSavingId(id);
    try {
      await affiliatesApi.updateCommission(id, rate);
      setAffiliates(prev => prev.map(a => a.id === id ? { ...a, commission_rate: rate } : a));
      setEditingId(null);
    } catch (err) {
      // keep the row in edit mode so the admin can retry
      console.error('Failed to update commission:', err);
    } finally {
      setSavingId(null);
    }
  };

  const filtered = affiliates.filter(a => {
    const matchSearch = a.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.referral_code?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || a.status === filter;
    return matchSearch && matchFilter;
  });

  const totalEarnings = affiliates.reduce((s, a) => s + (a.total_earnings || 0), 0);

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
                {['Name', 'Code', 'Instagram', 'Status', 'Referrals', 'Sales', 'Commission', 'Earned', 'Actions'].map(h => (
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
                    <span className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5">
                      {a.referral_code || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{a.instagram_handle || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 border ${STATUS_STYLES[a.status]}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-700 font-semibold">{a.total_referrals || 0}</td>
                  <td className="px-4 py-3 text-xs text-gray-700">{formatPrice(a.total_sales || 0)}</td>

                  {/* Commission column - editable */}
                  <td className="px-4 py-3">
                    {editingId === a.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="100"
                          autoFocus
                          value={rateInput}
                          onChange={e => setRateInput(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') saveCommission(a.id);
                            if (e.key === 'Escape') cancelEditingCommission();
                          }}
                          className="w-16 border border-gray-200 px-2 py-1 text-xs focus:outline-none focus:border-gray-900"
                        />
                        <span className="text-xs text-gray-400">%</span>
                        <button
                          onClick={() => saveCommission(a.id)}
                          disabled={savingId === a.id}
                          className="p-1 text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50"
                          title="Save"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={cancelEditingCommission}
                          disabled={savingId === a.id}
                          className="p-1 text-gray-400 hover:bg-gray-100 transition-colors"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditingCommission(a)}
                        className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-gray-900 group"
                        title="Click to edit commission rate"
                      >
                        {a.commission_rate}%
                        <Pencil className="w-3 h-3 text-gray-300 group-hover:text-gray-500 transition-colors" />
                      </button>
                    )}
                  </td>

                  <td className="px-4 py-3 text-xs font-bold" style={{ color: '#8e2424' }}>{formatPrice(a.total_earnings || 0)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      {a.status !== 'approved' && (
                        <button
                          onClick={() => a.referral_code ? setStatus(a.id, 'approved') : approveAffiliate(a.id)}
                          className="p-1.5 text-green-600 hover:bg-green-50 transition-colors"
                          title={a.referral_code ? 'Reinstate' : 'Approve'}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {a.status !== 'suspended' && (
                        <button
                          onClick={() => setStatus(a.id, 'suspended')}
                          className="p-1.5 text-red-500 hover:bg-red-50 transition-colors" title="Suspend"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                      {a.status !== 'pending' && (
                        <button
                          onClick={() => setStatus(a.id, 'pending')}
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