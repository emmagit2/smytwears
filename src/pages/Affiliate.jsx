import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Users, TrendingUp, DollarSign, Share2 } from 'lucide-react';
import { affiliatesApi } from '@/api/apiClient';
import { IMAGES } from '@/data/images';

const perks = [
  { icon: DollarSign, title: '10% Commission', desc: 'Earn 10% on every sale made through your referral link. Paid monthly.' },
  { icon: Share2, title: 'Unique Link', desc: 'Get your own personal referral code to share with your audience anywhere.' },
  { icon: TrendingUp, title: 'Real-Time Stats', desc: 'Track your clicks, conversions, and earnings live in your dashboard.' },
  { icon: Users, title: 'Community', desc: 'Join a growing network of SMYT brand ambassadors across Nigeria.' },
];

export default function Affiliate() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', instagram_handle: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const generateCode = (name) => {
    const slug = name.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `SMYT-${slug}${rand}`;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!form.full_name || !form.email || !form.phone) {
    setError('Please fill in all required fields.');
    return;
  }
  setLoading(true);
  setError('');
  try {
    await affiliatesApi.apply({
      ...form,
      referral_code: generateCode(form.full_name),
      status: 'pending',
      commission_rate: 10,
      total_referrals: 0,
      total_sales: 0,
      total_earnings: 0,
      paid_out: 0,
    });
    setSubmitted(true);
  } catch (err) {
    setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
};
  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 sm:py-32 overflow-hidden bg-gray-950">
        <img
          src={IMAGES.hero}
          alt="Affiliate"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: '#8e2424' }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-0.5" style={{ backgroundColor: '#8e2424' }} />
            <span className="text-xs uppercase tracking-[0.3em] font-semibold" style={{ color: '#8e2424' }}>
              Partner Programme
            </span>
            <div className="w-8 h-0.5" style={{ backgroundColor: '#8e2424' }} />
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter leading-none">
            EARN WITH<br />
            <span style={{ color: '#8e2424' }}>SMYT</span>
          </h1>
          <p className="mt-6 text-white/60 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Share the brand, earn real money. Join our affiliate programme and get paid 10% on every order you refer.
          </p>
          <a
            href="#apply"
            className="mt-8 inline-flex items-center gap-3 px-8 py-4 text-xs uppercase tracking-[0.2em] font-bold text-white"
            style={{ backgroundColor: '#8e2424' }}
          >
            Apply Now <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Perks */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900">Why Partner With Us</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {perks.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div
                  className="w-14 h-14 mx-auto flex items-center justify-center mb-5 text-white"
                  style={{ backgroundColor: '#8e2424' }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 mb-2">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black tracking-tight text-center text-gray-900 mb-14">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Apply', desc: 'Fill out the form below. We review all applications within 48 hours.' },
              { step: '02', title: 'Share', desc: 'Get your unique code and share it on your socials, stories, or messages.' },
              { step: '03', title: 'Earn', desc: 'Every time someone orders using your code, you earn 10% commission.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative">
                <div className="text-6xl font-black text-gray-100 mb-2">{step}</div>
                <h3 className="text-base font-black uppercase tracking-wider text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply Form */}
      <section id="apply" className="py-20 bg-white">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black tracking-tight text-gray-900">Apply to Join</h2>
            <p className="text-sm text-gray-400 mt-2">Takes less than 2 minutes</p>
          </div>

          {submitted ? (
            <div className="text-center py-16 border border-gray-100 px-8">
              <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#8e2424' }} />
              <h3 className="text-xl font-black text-gray-900 mb-2">Application Received!</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                We&apos;ll review your application and reach out within 48 hours via email.
                Once approved, you&apos;ll get your unique referral code.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 border border-gray-100 p-8">
              {[
                { label: 'Full Name *', key: 'full_name', type: 'text', placeholder: 'John Doe' },
                { label: 'Email Address *', key: 'email', type: 'email', placeholder: 'john@gmail.com' },
                { label: 'Phone Number *', key: 'phone', type: 'tel', placeholder: '+234 801 234 5678' },
                { label: 'Instagram Handle', key: 'instagram_handle', type: 'text', placeholder: '@yourhandle' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs uppercase tracking-wider font-bold text-gray-700 mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition-colors"
                  />
                </div>
              ))}

              {error && <p className="text-xs text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-xs uppercase tracking-widest font-bold text-white transition-opacity disabled:opacity-60"
                style={{ backgroundColor: '#8e2424' }}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>

              <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                By applying, you agree to our affiliate terms. Commission is paid monthly via bank transfer.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}