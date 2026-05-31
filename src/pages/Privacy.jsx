import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function Privacy() {
  const sections = [
    {
      icon: FileText,
      title: '1. Information We Collect',
      content: `When you place an order or create an account on the SMYT website, we collect personal information including your name, email address, phone number, delivery address, and payment details. We also collect non-personal information such as browser type, IP address, and browsing behaviour on our site to help us improve your shopping experience.`,
    },
    {
      icon: Eye,
      title: '2. How We Use Your Information',
      content: `We use the information you provide to process and fulfil your orders, send order confirmations and delivery updates, respond to customer service requests, personalise your shopping experience, send promotional emails and updates (you can opt out at any time), and improve our website and product offerings.`,
    },
    {
      icon: Lock,
      title: '3. Data Security',
      content: `We take reasonable precautions to protect your personal information from unauthorised access, use, or disclosure. All payment information is processed through secure, encrypted payment gateways. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
    },
    {
      icon: Shield,
      title: '4. Sharing Your Information',
      content: `SMYT does not sell, trade, or rent your personal information to third parties. We may share your information with trusted third-party service providers who assist us in operating our website and conducting our business (such as delivery partners), provided they agree to keep your information confidential.`,
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
        <h1 className="text-4xl font-black tracking-tight">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mt-3">Last updated: May 2026</p>
        <p className="mt-4 text-gray-600 leading-relaxed">
          At SMYT (Self Made You Today), we are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your personal information when you visit our website or make a purchase.
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
          <h2 className="text-sm uppercase tracking-wider font-bold mb-3">5. Cookies</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Our website uses cookies to enhance your browsing experience and remember your preferences. You can choose to disable cookies through your browser settings, but this may affect some functionality of the site.
          </p>
        </div>

        <div className="border-l-2 pl-6" style={{ borderColor: '#8e2424' }}>
          <h2 className="text-sm uppercase tracking-wider font-bold mb-3">6. Your Rights</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            You have the right to access, correct, or delete the personal information we hold about you. To make a request, contact us at <a href="mailto:selfmadeyoutoday@gmail.com" className="font-semibold underline" style={{ color: '#8e2424' }}>selfmadeyoutoday@gmail.com</a>.
          </p>
        </div>

        <div className="border-l-2 pl-6" style={{ borderColor: '#8e2424' }}>
          <h2 className="text-sm uppercase tracking-wider font-bold mb-3">7. Changes to This Policy</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            SMYT reserves the right to update this Privacy Policy at any time. Changes will be posted on this page with a revised date. Your continued use of the website constitutes acceptance of the updated policy.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-100 p-6">
          <h2 className="text-sm uppercase tracking-wider font-bold mb-2">Contact Us</h2>
          <p className="text-gray-600 text-sm">
            For any privacy-related questions, contact us at:{' '}
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