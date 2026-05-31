import React from 'react';
import { AlertTriangle, Info, ShoppingBag, Truck } from 'lucide-react';

export default function Disclaimer() {
  const sections = [
    {
      icon: Info,
      title: 'General Disclaimer',
      content: `The information provided on the SMYT website is for general informational and commercial purposes only. While we make every effort to ensure the accuracy of the information on this site, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or availability of the website or the products listed.`,
    },
    {
      icon: ShoppingBag,
      title: 'Product Information',
      content: `Product colours may vary slightly from what is displayed on your screen due to differences in monitor calibration and lighting conditions. Sizes are based on our SMYT size guide. We recommend consulting the size guide before ordering. SMYT is not responsible for purchases made without checking the size guide.`,
    },
    {
      icon: Truck,
      title: 'Shipping & Delivery',
      content: `Delivery timelines provided (Standard: 3–5 business days; Express: 1–2 business days) are estimates and not guarantees. Delivery delays due to circumstances beyond our control — including weather events, logistics partner delays, or public holidays — are not the responsibility of SMYT. Free delivery applies to orders above ₦50,000 within Nigeria only.`,
    },
    {
      icon: AlertTriangle,
      title: 'Returns & Refunds',
      content: `Items may be returned within 7 days of delivery if they are unworn, unwashed, and in original packaging with tags attached. SMYT reserves the right to refuse returns that do not meet these conditions. Refunds are processed within 5–7 business days after the returned item is inspected. Sale items are non-refundable.`,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-0.5" style={{ backgroundColor: '#8e2424' }} />
          <span className="text-xs uppercase tracking-[0.3em] text-gray-400 font-semibold">Legal</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight">Disclaimer</h1>
        <p className="text-gray-500 text-sm mt-3">Last updated: May 2026</p>
        <p className="mt-4 text-gray-600 leading-relaxed">
          Please read this disclaimer carefully before using the SMYT website or purchasing any products. By accessing this website, you agree to the terms outlined below.
        </p>
      </div>

      <div className="space-y-10">
        {sections.map(({ icon: Icon, title, content }) => (
          <div key={title} className="border-l-2 pl-6" style={{ borderColor: '#8e2424' }}>
            <div className="flex items-center gap-3 mb-3">
              <Icon className="w-4 h-4 flex-shrink-0" style={{ color: '#8e2424' }} />
              <h2 className="text-sm uppercase tracking-wider font-bold">{title}</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{content}</p>
          </div>
        ))}

        <div className="border-l-2 pl-6" style={{ borderColor: '#8e2424' }}>
          <h2 className="text-sm uppercase tracking-wider font-bold mb-3">Limitation of Liability</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            To the fullest extent permitted by applicable law, SMYT shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from the use of this website or purchase of products. Our total liability shall not exceed the amount paid for the specific product in question.
          </p>
        </div>

        <div className="border-l-2 pl-6" style={{ borderColor: '#8e2424' }}>
          <h2 className="text-sm uppercase tracking-wider font-bold mb-3">Governing Law</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            This disclaimer is governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising in connection with this disclaimer shall be subject to the exclusive jurisdiction of Nigerian courts.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-100 p-6">
          <h2 className="text-sm uppercase tracking-wider font-bold mb-2">Questions?</h2>
          <p className="text-gray-600 text-sm">
            Contact us at{' '}
            <a href="mailto:selfmadeyoutoday@gmail.com" className="font-semibold" style={{ color: '#8e2424' }}>
              selfmadeyoutoday@gmail.com
            </a>
            {' '}or call <a href="tel:07054527285" className="font-semibold" style={{ color: '#8e2424' }}>07054527285</a>.
          </p>
        </div>
      </div>
    </div>
  );
}