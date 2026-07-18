import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { affiliatesApi } from '@/api/apiClient';
import { TrendingUp, DollarSign, Users, Copy, CheckCircle, Share2, ArrowRight, Clock, Mail, ShieldCheck } from 'lucide-react';
import { formatPrice } from '@/data/products';

// Common Nigerian bank codes for a quick-select dropdown.
// Extend this list as needed, or swap for a live Paystack /bank list call.
const NIGERIAN_BANKS = [
  { code: '044', name: 'Access Bank' },
  { code: '023', name: 'Citibank Nigeria' },
  { code: '050', name: 'Ecobank Nigeria' },
  { code: '070', name: 'Fidelity Bank' },
  { code: '011', name: 'First Bank of Nigeria' },
  { code: '214', name: 'First City Monument Bank' },
  { code: '058', name: 'Guaranty Trust Bank' },
  { code: '030', name: 'Heritage Bank' },
  { code: '301', name: 'Jaiz Bank' },
  { code: '082', name: 'Keystone Bank' },
  { code: '076', name: 'Polaris Bank' },
  { code: '221', name: 'Stanbic IBTC Bank' },
  { code: '068', name: 'Standard Chartered Bank' },
  { code: '232', name: 'Sterling Bank' },
  { code: '032', name: 'Union Bank of Nigeria' },
  { code: '033', name: 'United Bank For Africa' },
  { code: '215', name: 'Unity Bank' },
  { code: '035', name: 'Wema Bank' },
  { code: '057', name: 'Zenith Bank' },
];

function BankDetailsForm({ affiliateId, onVerified }) {
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (!bankCode || accountNumber.trim().length !== 10) {
      setError('Please select a bank and enter a valid 10-digit account number.');
      return;
    }

    setVerifying(true);
    try {
      const bankName = NIGERIAN_BANKS.find(b => b.code === bankCode)?.name || '';
      const { data } = await affiliatesApi.addBankDetails(affiliateId, {
        bank_code: bankCode,
        bank_name: bankName,
        account_number: accountNumber.trim(),
      });
      onVerified(data);
    } catch (err) {
      setError(err?.response?.data?.error || 'Verification failed. Please check the details and try again.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Bank</label>
        <select
          value={bankCode}
          onChange={e => setBankCode(e.target.value)}
          className="w-full border border-gray-200 px-3 py-2.5 text-xs focus:outline-none focus:border-gray-900"
        >
          <option value="">Select bank</option>
          {NIGERIAN_BANKS.map(b => (
            <option key={b.code} value={b.code}>{b.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Account Number</label>
        <input
          value={accountNumber}
          onChange={e => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
          placeholder="0123456789"
          inputMode="numeric"
          className="w-full border border-gray-200 px-3 py-2.5 text-xs focus:outline-none focus:border-gray-900"
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={verifying}
        className="w-full flex items-center justify-center gap-2 py-2.5 text-xs uppercase tracking-widest font-bold text-white disabled:opacity-60"
        style={{ backgroundColor: '#8e2424' }}
      >
        {verifying ? 'Verifying...' : (<><ShieldCheck className="w-3.5 h-3.5" /> Verify & Save Account</>)}
      </button>
      <p className="text-[10px] text-gray-400">
        We verify your account name with your bank before saving it, so payouts always go to the right person.
      </p>
    </form>
  );
}

export default function AffiliateDashboard() {
  const [step, setStep]           = useState('email'); // 'email' | 'code' | 'dashboard'
  const [email, setEmail]         = useState('');
  const [code, setCode]           = useState('');
  const [affiliate, setAffiliate] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [copied, setCopied]       = useState(false);

  const requestCode = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError('');
    try {
      await affiliatesApi.requestCode(email.trim());
      setStep('code');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (e) => {
  e.preventDefault();
  if (!code.trim()) return;
  setLoading(true);
  setError('');
  try {
    const { data } = await affiliatesApi.verifyCode(email.trim(), code.trim());
    console.log('affiliate data:', data);   // 👈 add this line
    setAffiliate(data);
    setStep('dashboard');
  } catch (err) {
    setError(err?.response?.data?.error || 'Invalid or expired code.');
  } finally {
    setLoading(false);
  }
};
  const copyLink = () => {
    navigator.clipboard.writeText(`https://smytwears.com/shop?ref=${affiliate.referral_code}`);
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
        <p className="text-sm text-gray-400 mt-1">
          {step === 'email' && 'Enter your affiliate email to receive an access code'}
          {step === 'code' && 'Enter the 5-minute code we emailed you'}
        </p>
      </div>

      {/* Step 1: Email */}
      {step === 'email' && (
        <div className="border border-gray-100 p-8 max-w-md">
          <form onSubmit={requestCode} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-gray-700 mb-1.5">
                Your Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@gmail.com"
                className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-xs uppercase tracking-widest font-bold text-white disabled:opacity-60"
              style={{ backgroundColor: '#8e2424' }}
            >
              {loading ? 'Sending...' : 'Send Access Code'}
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

      {/* Step 2: Code */}
      {step === 'code' && (
        <div className="border border-gray-100 p-8 max-w-md">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 bg-gray-50 border border-gray-100 py-3 px-4 mb-5">
            <Mail className="w-3.5 h-3.5" style={{ color: '#8e2424' }} />
            Code sent to {email}
          </div>
          <form onSubmit={verifyCode} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-gray-700 mb-1.5">
                6-Digit Code
              </label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
                className="w-full border border-gray-200 px-4 py-3 text-sm tracking-[0.3em] text-center focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-xs uppercase tracking-widest font-bold text-white disabled:opacity-60"
              style={{ backgroundColor: '#8e2424' }}
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
            <button
              type="button"
              onClick={() => { setStep('email'); setCode(''); setError(''); }}
              className="w-full text-xs text-gray-400 hover:text-gray-600 underline"
            >
              Use a different email
            </button>
          </form>
        </div>
      )}

      {/* Step 3: Dashboard */}
      {step === 'dashboard' && affiliate && (
        <div className="space-y-8">
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
              Welcome back, {affiliate.full_name.split(' ')[0]}! Your account is active.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Users, label: 'Total Referrals', value: affiliate.total_referrals || 0 },
              { icon: TrendingUp, label: 'Total Sales', value: formatPrice(affiliate.total_sales || 0) },
              { icon: DollarSign, label: 'Total Earned', value: formatPrice(affiliate.total_earnings || 0) },
              { icon: Clock, label: 'Pending Payout', value: formatPrice(pending) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="border border-gray-100 p-5">
                <Icon className="w-4 h-4 text-gray-400 mb-3" />
                <p className="text-xl sm:text-2xl font-black text-gray-900">{value}</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="border border-gray-100 p-6">
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 mb-4 flex items-center gap-2">
              <Share2 className="w-4 h-4" style={{ color: '#8e2424' }} />
              Your Referral Link
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-50 border border-gray-100 px-4 py-3 text-xs text-gray-500 font-mono truncate">
                smytwears.com/shop?ref={affiliate.referral_code}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-gray-100 p-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 mb-3">Commission Rate</h3>
              <p className="text-4xl font-black" style={{ color: '#8e2424' }}>{affiliate.commission_rate}%</p>
              <p className="text-xs text-gray-400 mt-1">Per confirmed order via your code</p>
            </div>

            <div className="border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">Bank Details</h3>
                {affiliate.bank_verified && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-600">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
              </div>

              {affiliate.bank_verified ? (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-800">{affiliate.bank_account_name}</p>
                  <p className="text-xs text-gray-500">{affiliate.bank_name}</p>
                  <p className="text-xs font-mono text-gray-700">{affiliate.bank_account_number}</p>
                </div>
              ) : (
                <BankDetailsForm
                  affiliateId={affiliate.id}
                  onVerified={(updated) => setAffiliate(updated)}
                />
              )}
            </div>
          </div>

          {/* Payout is only ever offered once bank details are verified */}
          {affiliate.bank_verified && pending > 0 && (
            <div className="border border-gray-100 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 mb-1">Ready for Payout</h3>
                <p className="text-xs text-gray-400">{formatPrice(pending)} pending, paid to your verified account.</p>
              </div>
              <button
                className="px-6 py-3 text-xs uppercase tracking-widest font-bold text-white"
                style={{ backgroundColor: '#8e2424' }}
              >
                Request Payout
              </button>
            </div>
          )}

          <button
            onClick={() => { setStep('email'); setAffiliate(null); setEmail(''); setCode(''); }}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline"
          >
            Log out of dashboard
          </button>
        </div>
      )}
    </div>
  );
}