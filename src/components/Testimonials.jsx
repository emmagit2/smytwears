import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Emeka Okafor',
    city: 'Lagos',
    rating: 5,
    text: "The Self Starter jogger is genuinely the best quality streetwear I've bought in Nigeria. The fabric is thick, the stitching is clean, and it fits exactly right. SMYT is built different fr.",
    product: 'Self Starter Jogger — Black',
    initials: 'EO',
  },
  {
    name: 'Chioma Adeyemi',
    city: 'Abuja',
    rating: 5,
    text: 'I ordered the No Shortcuts oversize tee and I absolutely love it. The print is crisp, the cotton is premium, and the message hits every time. This brand understands the hustle.',
    product: 'No Shortcuts Oversize Tee',
    initials: 'CA',
  },
  {
    name: 'Tunde Balogun',
    city: 'Port Harcourt',
    rating: 5,
    text: "Got the Movement Hoodie for my birthday. Best gift I've ever given myself. The heavyweight fleece is insane quality. I get compliments everywhere. SMYT is the real deal.",
    product: 'Movement Hoodie — Black',
    initials: 'TB',
  },
  {
    name: 'Amara Nwosu',
    city: 'Enugu',
    rating: 5,
    text: 'Delivery was fast and the packaging was premium. The SMYT duffle bag exceeded my expectations — solid build, great size, and the branding is sharp. Will definitely order again.',
    product: 'SMYT Duffle Bag',
    initials: 'AN',
  },
  {
    name: 'Fola Adeleke',
    city: 'Ibadan',
    rating: 5,
    text: 'Queens Jogger fits like a dream. The fabric is so soft and the embroidered logo is a nice touch. SMYT for the women who build — I see you! 100% recommend.',
    product: 'Queens Jogger — Black',
    initials: 'FA',
  },
];

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array(count).fill(0).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-current" style={{ color: '#8e2424' }} />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((current - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((current + 1) % testimonials.length);

  // Show 3 on desktop, 1 on mobile
  const visible = [
    testimonials[current % testimonials.length],
    testimonials[(current + 1) % testimonials.length],
    testimonials[(current + 2) % testimonials.length],
  ];

  return (
    <section className="py-20 sm:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-0.5" style={{ backgroundColor: '#8e2424' }} />
              <span className="text-xs uppercase tracking-[0.3em] text-gray-400 font-semibold">
                Customer Reviews
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
              What the Movement<br />
              <span style={{ color: '#8e2424' }}>is Saying</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:border-gray-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 flex items-center justify-center text-white transition-colors"
              style={{ backgroundColor: '#8e2424' }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visible.map((t, i) => (
            <div
              key={`${t.name}-${i}`}
              className={`border p-8 relative transition-all duration-300 ${
                i === 0 ? 'border-gray-900' : 'border-gray-100'
              }`}
            >
              {/* Accent bar on featured */}
              {i === 0 && (
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#8e2424' }} />
              )}

              <Quote className="w-6 h-6 mb-4" style={{ color: '#8e2424' }} />

              <Stars count={t.rating} />
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">"{t.text}"</p>

              <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-3">
                <div
                  className="w-10 h-10 flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: i === 0 ? '#8e2424' : '#1a1a1a' }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.city} · {t.product}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 py-6 border-t border-gray-100">
          <div className="text-center">
            <p className="text-3xl font-black text-gray-900">4.9</p>
            <div className="flex justify-center mt-1"><Stars count={5} /></div>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Average Rating</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-gray-100" />
          <div className="text-center">
            <p className="text-3xl font-black text-gray-900">1,200+</p>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Happy Customers</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-gray-100" />
          <div className="text-center">
            <p className="text-3xl font-black text-gray-900">98%</p>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Would Recommend</p>
          </div>
        </div>
      </div>
    </section>
  );
}