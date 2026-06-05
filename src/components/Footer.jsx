import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle } from 'lucide-react';
import { IMAGES } from '@/data/images';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <img src={IMAGES.logo} alt="SMYT" className="h-12 mb-4 brightness-0 invert" />
            <p className="text-sm text-background/60 leading-relaxed">
              Self Made You Today. A premium streetwear brand for young, ambitious Nigerians who 
              believe in building themselves daily. No shortcuts. No excuses.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold mb-6">Navigate</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', path: '/' },
                { label: 'Men', path: '/shop?category=men' },
                { label: 'Women', path: '/shop?category=women' },
                { label: 'Accessories', path: '/shop?category=accessories' },
                { label: 'About', path: '/about' },
                { label: 'Contact', path: '/contact' },
                { label: 'Affiliate Programme', path: '/affiliate' },
                { label: 'Wishlist', path: '/wishlist' },
              ].map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-background/60 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold mb-6">Contact</h4>
            <ul className="space-y-3 text-sm text-background/60">
              <li>Lagos, Nigeria</li>
              <li>
                <a href="tel:07054527285" className="hover:text-background transition-colors">
                  07054527285
                </a>
              </li>
              <li>
                <a href="mailto:info@smytwears.com" className="hover:text-background transition-colors">
                  info@smytwears.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold mb-6">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/selfmade.smyt"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-background/20 flex items-center justify-center hover:bg-background/10 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.tiktok.com/@smyt.bng"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-background/20 flex items-center justify-center hover:bg-background/10 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.05a8.27 8.27 0 004.76 1.51V7.12a4.83 4.83 0 01-1-.43z" />
                </svg>
              </a>
              <a
                href="https://wa.me/2347054527285"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-background/20 flex items-center justify-center hover:bg-background/10 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/40 tracking-wider">
            © {new Date().getFullYear()} SMYT — Self Made You Today. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-xs text-background/40 hover:text-background transition-colors">Privacy Policy</Link>
            <Link to="/disclaimer" className="text-xs text-background/40 hover:text-background transition-colors">Disclaimer</Link>
            <Link to="/track" className="text-xs text-background/40 hover:text-background transition-colors">Track Order</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}