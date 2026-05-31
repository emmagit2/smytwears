import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { affiliatesApi } from '@/api/apiClient';
import { TrendingUp, DollarSign, Users, Copy, CheckCircle, Share2, ArrowRight, Clock } from 'lucide-react';
import { formatPrice } from '@/data/products';

  export default function AffiliateDashboard() {
    const [code, setCode] = useState('');
    const [affiliate, setAffiliate] = useState(null);
    const [found, setFound] = useState(null); // null=idle, true=found, false=not found
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

const lookup = async (e) => {
  e.preventDefault();
  if (!code.trim()) return;
  setLoading(true);
  try {
    const { data } = await affiliatesApi.stats(code.trim().toUpperCase());
    setAffiliate(data);
    setFound(true);
  } catch (err) {
    setAffiliate(null);
    setFound(false);
  } finally {
    setLoading(false);
  }
};

    const copyLink = () => {
      navigator.clipboard.writeText(`https://smytstore.com/shop?ref=${affiliate.referral_code}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    const pending = (affiliate?.total_earnings || 0) - (affiliate?.paid_out || 0);

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-0.5" style={{ backgroundColor: '#8e2424' }} />
            <span className="text-xs uppercase tracking-[0.3em] text-gray-400 font-semibold">Partner Programme</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900">Affiliate Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Enter your referral code to view your stats</p>
        </div>

        {/* Code Lookup */}
        {!found && (
          <div className="border border-gray-100 p-8 max-w-md">
            <form onSubmit={lookup} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-gray-700 mb-1.5">
                  Your Referral Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="e.g. SMYT-JOHN1234"
                  className="w-full border border-gray-200 px-4 py-3 text-sm uppercase tracking-wider focus:outline-none focus:border-gray-900 transition-colors"
                />
              </div>
              {found === false && (
                <p className="text-xs text-red-500">Code not found. Check your code or <Link to="/affiliate" className="underline">apply here</Link>.</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-xs uppercase tracking-widest font-bold text-white disabled:opacity-60"
                style={{ backgroundColor: '#8e2424' }}
              >
                {loading ? 'Looking up...' : 'View My Stats'}
              </button>
            </form>
            <div className="mt-6 border-t border-gray-100 pt-5 text-center">
              <p className="text-xs text-gray-400">Not an affiliate yet?</p>
              <Link to="/affiliate" className="text-xs font-bold uppercase tracking-wider mt-1 inline-flex items-center gap-1" style={{ color: '#8e2424' }}>
                Apply to Join <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}

        {/* Dashboard */}
        {found && affiliate && (
          <div className="space-y-8">
            {/* Status banner */}
            <div className={`flex items-center gap-3 px-5 py-3 border ${
              affiliate.status === 'approved' ? 'border-green-200 bg-green-50' :
              affiliate.status === 'pending' ? 'border-amber-200 bg-amber-50' :
              'border-red-200 bg-red-50'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                affiliate.status === 'approved' ? 'bg-green-500' :
                affiliate.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
              }`} />
              <p className="text-xs font-bold uppercase tracking-wider text-gray-700">
                {affiliate.status === 'approved' ? `Welcome back, ${affiliate.full_name.split(' ')[0]}! Your account is active.` :
                 affiliate.status === 'pending' ? 'Your application is under review. We\'ll notify you soon.' :
                 'Your account has been suspended. Contact us for help.'}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Users, label: 'Total Referrals', value: affiliate.total_referrals || 0, suffix: '' },
                { icon: TrendingUp, label: 'Total Sales', value: formatPrice(affiliate.total_sales || 0), suffix: '' },
                { icon: DollarSign, label: 'Total Earned', value: formatPrice(affiliate.total_earnings || 0), suffix: '' },
                { icon: Clock, label: 'Pending Payout', value: formatPrice(pending), suffix: '' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="border border-gray-100 p-5">
                  <Icon className="w-4 h-4 text-gray-400 mb-3" />
                  <p className="text-xl sm:text-2xl font-black text-gray-900">{value}</p>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Referral link */}
            <div className="border border-gray-100 p-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 mb-4 flex items-center gap-2">
                <Share2 className="w-4 h-4" style={{ color: '#8e2424' }} />
                Your Referral Link
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-50 border border-gray-100 px-4 py-3 text-xs text-gray-500 font-mono truncate">
                  smytstore.com/shop?ref={affiliate.referral_code}
                </div>
                <button
                  onClick={copyLink}
                  className="flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-wider font-bold text-white transition-all flex-shrink-0"
                  style={{ backgroundColor: copied ? '#16a34a' : '#8e2424' }}
                >
                  {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-3">
                Share this link or use code <strong>{affiliate.referral_code}</strong> at checkout. You earn {affiliate.commission_rate}% per sale.
              </p>
            </div>

            {/* Commission info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-gray-100 p-6">
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 mb-3">Commission Rate</h3>
                <p className="text-4xl font-black" style={{ color: '#8e2424' }}>{affiliate.commission_rate}%</p>
                <p className="text-xs text-gray-400 mt-1">Per confirmed order via your code</p>
              </div>
              <div className="border border-gray-100 p-6">
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 mb-3">Bank Details</h3>
                {affiliate.bank_name ? (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-800">{affiliate.bank_account_name}</p>
                    <p className="text-xs text-gray-500">{affiliate.bank_name}</p>
                    <p className="text-xs font-mono text-gray-700">{affiliate.bank_account_number}</p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No bank details on file. Contact us to add your payout account.</p>
                )}
              </div>
            </div>

            <button
              onClick={() => { setFound(null); setAffiliate(null); setCode(''); }}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline"
            >
              Log out of dashboard
            </button>
          </div>
        )}
      </div>
    );
  }