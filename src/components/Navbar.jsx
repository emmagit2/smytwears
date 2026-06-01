import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { IMAGES } from '@/data/images';
import SearchOverlay from './SearchOverlay';

const shopDropdown = [
  { label: 'All Products', path: '/shop' },
  { label: 'Men',          path: '/shop?category=men' },
  { label: 'Women',        path: '/shop?category=women' },
  { label: 'Accessories',  path: '/shop?category=accessories' },
  { label: 'Caps',         path: '/shop?category=caps' },
];

const navLinks = [
  { label: 'Home',        path: '/' },
  { label: 'Shop',        path: '/shop', dropdown: shopDropdown },
  { label: 'About',       path: '/about' },
  { label: 'Track Order', path: '/track' },
  { label: 'Contact',     path: '/contact' },
];

const BRAND = '#8e2424';

export default function Navbar() {
  const headerRef                     = useRef(null);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [shopHovered, setShopHovered] = useState(false);
  const { itemCount }                 = useCart();
  const { wishlistCount }             = useWishlist();
  const location                      = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setShopHovered(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Base = white. Scrolled = brand color background, everything flips white.
  const navBg       = scrolled ? BRAND : '#ffffff';
  const textColor   = scrolled ? '#ffffff' : '#111111';
  const mutedColor  = scrolled ? 'rgba(255,255,255,0.7)' : '#888888';
  const iconColor   = scrolled ? '#ffffff' : '#555555';
  const borderColor = scrolled ? 'rgba(255,255,255,0.15)' : '#f0f0f0';

  // Shop bubble: on white bg = red outline/text, hover = filled red
  // On brand bg = white outline/text, hover = filled white text on white bg
  const shopBubbleBorder = scrolled ? 'rgba(255,255,255,0.8)' : BRAND;
  const shopBubbleText   = shopHovered ? '#ffffff' : (scrolled ? '#ffffff' : BRAND);
  const shopRippleBg     = scrolled ? 'rgba(255,255,255,0.2)' : BRAND;

  const NAVBAR_HEIGHT = 68;

  return (
    <>

      <header
        ref={headerRef}
        className="sticky top-0 z-50"
        style={{
          background: navBg,
          borderBottom: `1px solid ${borderColor}`,
          boxShadow: scrolled ? '0 2px 24px rgba(142,36,36,0.18)' : 'none',
          transition: 'background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: `${NAVBAR_HEIGHT}px` }}>

            {/* Hamburger — mobile only */}
            <button
              className="lg:hidden flex-shrink-0"
              style={{
                padding: '8px',
                marginLeft: '-4px',
                color: iconColor,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                zIndex: 60,
              }}
              onClick={() => setMobileOpen(prev => !prev)}
              aria-label="Toggle menu"
            >
              {mobileOpen
                ? <X style={{ width: 20, height: 20 }} />
                : <Menu style={{ width: 20, height: 20 }} />
              }
            </button>

            {/* Logo */}
            <Link
              to="/"
              style={{ flexShrink: 0, marginLeft: 'auto', marginRight: 'auto' }}
              className="lg:ml-0 lg:mr-0"
            >
              <img
                src={IMAGES.logo}
                alt="SMYT"
                style={{
                  height: '38px',
                  filter: scrolled ? 'brightness(0) invert(1)' : 'none',
                  transition: 'filter 0.35s ease',
                }}
              />
            </Link>

            {/* Desktop nav */}
            <nav
              className="hidden lg:flex items-center"
              style={{ gap: '28px', flex: 1, justifyContent: 'center' }}
            >
              {navLinks.map(link =>
                link.dropdown ? (
                  <div
                    key={link.path}
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setShopHovered(true)}
                    onMouseLeave={() => setShopHovered(false)}
                  >
                    <button
                      style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '7px 20px',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.18em',
                        fontWeight: 700,
                        color: shopBubbleText,
                        border: `1.5px solid ${shopBubbleBorder}`,
                        borderRadius: '999px',
                        background: 'transparent',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        transition: 'color 0.25s ease, border-color 0.25s ease',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '999px',
                          backgroundColor: shopRippleBg,
                          transform: shopHovered ? 'scale(1)' : 'scale(0)',
                          opacity: shopHovered ? 1 : 0,
                          transition: 'transform 0.28s ease, opacity 0.28s ease',
                        }}
                      />
                      <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '5px' }}>
                        {link.label}
                        <ChevronDown
                          style={{
                            width: 12, height: 12,
                            transform: shopHovered ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease',
                          }}
                        />
                      </span>
                    </button>

                    {/* Dropdown */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: `translateX(-50%) translateY(${shopHovered ? '0px' : '-8px'})`,
                        paddingTop: '10px',
                        opacity: shopHovered ? 1 : 0,
                        visibility: shopHovered ? 'visible' : 'hidden',
                        transition: 'opacity 0.2s ease, transform 0.2s ease',
                        pointerEvents: shopHovered ? 'auto' : 'none',
                        zIndex: 100,
                      }}
                    >
                      <div
                        style={{
                          background: '#fff',
                          border: '1px solid #f0f0f0',
                          borderRadius: '14px',
                          boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                          padding: '8px 0',
                          width: '200px',
                        }}
                      >
                        {link.dropdown.map(item => (
                          <Link
                            key={item.path}
                            to={item.path}
                            style={{
                              display: 'block',
                              padding: '10px 20px',
                              fontSize: '11px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.1em',
                              fontWeight: 500,
                              color: '#999',
                              textDecoration: 'none',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#111'; e.currentTarget.style.background = '#fafafa'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#999'; e.currentTarget.style.background = 'transparent'; }}
                          >
                            {item.label}
                          </Link>
                        ))}
                        <div style={{ margin: '6px 20px 4px', paddingTop: '8px', borderTop: '1px solid #f0f0f0' }}>
                          <Link
                            to="/shop"
                            style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: BRAND, textDecoration: 'none' }}
                          >
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
                    style={{
                      position: 'relative',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.18em',
                      fontWeight: 600,
                      color: location.pathname === link.path ? textColor : mutedColor,
                      textDecoration: 'none',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {link.label}
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        left: 0,
                        height: '1px',
                        backgroundColor: scrolled ? '#ffffff' : BRAND,
                        width: location.pathname === link.path ? '100%' : '0%',
                        transition: 'width 0.2s ease, background-color 0.3s ease',
                      }}
                    />
                  </Link>
                )
              )}
            </nav>

            {/* Right icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
              <button
                onClick={() => setSearchOpen(true)}
                style={{ padding: '8px', color: iconColor, background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px', transition: 'color 0.3s ease' }}
                aria-label="Search"
              >
                <Search style={{ width: 17, height: 17 }} />
              </button>

              <Link
                to="/wishlist"
                className="hidden sm:flex"
                style={{ position: 'relative', padding: '8px', color: iconColor, borderRadius: '8px', transition: 'color 0.3s ease' }}
                aria-label="Wishlist"
              >
                <Heart style={{ width: 17, height: 17 }} />
                {wishlistCount > 0 && (
                  <span style={{ position: 'absolute', top: '4px', right: '4px', width: '14px', height: '14px', background: scrolled ? '#fff' : BRAND, color: scrolled ? BRAND : '#fff', fontSize: '9px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transition: 'background 0.3s ease, color 0.3s ease' }}>
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                style={{ position: 'relative', padding: '8px', color: iconColor, borderRadius: '8px', transition: 'color 0.3s ease' }}
                aria-label="Cart"
              >
                <ShoppingBag style={{ width: 17, height: 17 }} />
                {itemCount > 0 && (
                  <span style={{ position: 'absolute', top: '4px', right: '4px', width: '14px', height: '14px', background: scrolled ? '#fff' : BRAND, color: scrolled ? BRAND : '#fff', fontSize: '9px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transition: 'background 0.3s ease, color 0.3s ease' }}>
                    {itemCount}
                  </span>
                )}
              </Link>

              <Link
                to="/login"
                className="hidden sm:flex"
                style={{ padding: '8px', color: iconColor, borderRadius: '8px', transition: 'color 0.3s ease' }}
                aria-label="Account"
              >
                <User style={{ width: 17, height: 17 }} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer — sits OUTSIDE header so it's not clipped ── */}
      <div
        className="lg:hidden"
        style={{
          position: 'fixed',
          top: `${NAVBAR_HEIGHT + 32}px`, // below announcement bar + navbar
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 49,
          background: '#ffffff',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ flex: 1, padding: '8px 24px' }}>
          {navLinks.map(link => (
            <div key={link.path} style={{ borderBottom: '1px solid #f4f4f4' }}>
              <Link
                to={link.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 0',
                  fontSize: '13px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: location.pathname === link.path ? BRAND : '#1a1a1a',
                  textDecoration: 'none',
                }}
              >
                {link.label}
                {link.dropdown && <ChevronDown style={{ width: 14, height: 14, color: '#ccc' }} />}
              </Link>
              {link.dropdown && (
                <div style={{ paddingBottom: '14px', paddingLeft: '12px' }}>
                  {link.dropdown.map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      style={{
                        display: 'block',
                        padding: '6px 0',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        color: '#aaa',
                        textDecoration: 'none',
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div style={{ borderBottom: '1px solid #f4f4f4' }}>
            <Link to="/login" style={{ display: 'block', padding: '16px 0', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1a1a1a', textDecoration: 'none' }}>
              Account
            </Link>
          </div>
          <div style={{ borderBottom: '1px solid #f4f4f4' }}>
            <Link to="/wishlist" style={{ display: 'block', padding: '16px 0', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1a1a1a', textDecoration: 'none' }}>
              Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
            </Link>
          </div>
        </div>

        <div style={{ padding: '16px 24px 40px' }}>
          <Link
            to="/shop"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: '14px',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              fontWeight: 700,
              color: '#ffffff',
              background: BRAND,
              borderRadius: '999px',
              textDecoration: 'none',
            }}
          >
            Shop Collection
          </Link>
        </div>
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden"
          style={{
            position: 'fixed',
            inset: 0,
            top: `${NAVBAR_HEIGHT + 32}px`,
            background: 'rgba(0,0,0,0.25)',
            zIndex: 48,
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}