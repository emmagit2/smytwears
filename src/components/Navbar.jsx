import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { IMAGES } from '@/data/images';
import AnnouncementBar from './AnnouncementBar';
import SearchOverlay from './SearchOverlay';

const shopDropdown = [
  { label: 'All Products', path: '/shop' },
  { label: 'Men', path: '/shop?category=men' },
  { label: 'Women', path: '/shop?category=women' },
  { label: 'Accessories', path: '/shop?category=accessories' },
  { label: 'Caps', path: '/shop?category=caps' },
];

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop', dropdown: shopDropdown },
  { label: 'About', path: '/about' },
  { label: 'Track Order', path: '/track' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setShopOpen(false);
  }, [location]);

  return (
    <>
      <AnnouncementBar />
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100'
          : 'bg-white border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 lg:h-20">

            {/* Mobile menu btn */}
            <button className="lg:hidden p-2 -ml-2 hover:bg-gray-50 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img src={IMAGES.logo} alt="SMYT" className="h-10 sm:h-12" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                link.dropdown ? (
                  <div key={link.path} className="relative group" onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}>
                    <Link
                      to={link.path}
                      className="flex items-center gap-1 px-4 py-2 text-xs uppercase tracking-[0.15em] font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {link.label}
                      <ChevronDown className="w-3 h-3" />
                    </Link>
                    <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-white border border-gray-100 shadow-xl py-2 w-48">
                        {link.dropdown.map(item => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className="block px-5 py-2.5 text-xs uppercase tracking-wider font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                        {/* Red accent line */}
                        <div className="mx-5 mt-2 pt-2 border-t border-gray-100">
                          <Link to="/shop" className="block text-xs font-bold uppercase tracking-widest" style={{ color: '#8e2424' }}>
                            View All →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 text-xs uppercase tracking-[0.15em] font-semibold transition-colors ${
                      location.pathname === link.path
                        ? 'text-gray-900'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-1">
              <button onClick={() => setSearchOpen(true)} className="p-2.5 hover:bg-gray-50 transition-colors rounded-sm">
                <Search className="w-4.5 h-4.5 w-[18px] h-[18px]" />
              </button>
              <Link to="/wishlist" className="p-2.5 hover:bg-gray-50 transition-colors relative hidden sm:flex rounded-sm">
                <Heart className="w-[18px] h-[18px]" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 text-white text-[9px] font-bold flex items-center justify-center rounded-full" style={{ backgroundColor: '#8e2424' }}>
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="p-2.5 hover:bg-gray-50 transition-colors relative rounded-sm">
                <ShoppingBag className="w-[18px] h-[18px]" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 text-white text-[9px] font-bold flex items-center justify-center rounded-full" style={{ backgroundColor: '#8e2424' }}>
                    {itemCount}
                  </span>
                )}
              </Link>
              <Link to="/login" className="hidden sm:flex p-2.5 hover:bg-gray-50 transition-colors rounded-sm">
                <User className="w-[18px] h-[18px]" />
              </Link>
              {/* CTA */}
              <Link
                to="/shop"
                className="hidden lg:flex ml-3 items-center px-5 py-2 text-xs uppercase tracking-widest font-bold text-white transition-colors"
                style={{ backgroundColor: '#8e2424' }}
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 top-[calc(2rem+5rem)] z-40 bg-white overflow-y-auto">
            <div className="px-4 py-2 border-b border-gray-100">
              <div className="flex flex-col divide-y divide-gray-100">
                {navLinks.map(link => (
                  <div key={link.path}>
                    <Link to={link.path} className="flex items-center justify-between py-4 text-sm font-semibold uppercase tracking-wider text-gray-800">
                      {link.label}
                    </Link>
                    {link.dropdown && (
                      <div className="pb-3 pl-4 space-y-2">
                        {link.dropdown.map(item => (
                          <Link key={item.path} to={item.path} className="block text-xs uppercase tracking-wider text-gray-500 py-1">
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <Link to="/login" className="py-4 text-sm font-semibold uppercase tracking-wider text-gray-800">Account</Link>
              </div>
            </div>
            <div className="p-4">
              <Link to="/shop" className="block w-full text-center py-3 text-xs uppercase tracking-widest font-bold text-white" style={{ backgroundColor: '#8e2424' }}>
                Shop Collection
              </Link>
            </div>
          </div>
        )}
      </header>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}