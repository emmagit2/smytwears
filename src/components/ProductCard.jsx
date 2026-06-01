import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { formatPrice, getProductImage } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

/* ─── Color name → hex map ───────────────────────────────────── */
const COLOR_MAP = {
  black: '#0a0a0a', white: '#f5f5f0', red: '#cc2200',
  ash: '#6b7280', grey: '#6b7280', gray: '#6b7280',
  navy: '#1e3a5f', cream: '#f5f5dc', blue: '#1d4ed8',
  green: '#166534', orange: '#ea580c', brown: '#78350f',
};

function colorToHex(color) {
  if (!color) return '#888';
  if (color.startsWith('#')) return color;
  return COLOR_MAP[color.toLowerCase()] || '#888';
}

export default function ProductCard({ product }) {
  const [hovered,    setHovered]    = useState(false);
  const [addedFlash, setAddedFlash] = useState(false);

  const { addToCart }                        = useCart();
  const { toggleWishlist, isInWishlist }     = useWishlist();
  const wishlisted                           = isInWishlist(product.id);
  const image                                = getProductImage(product);
  const hasDiscount                          = !!product.original_price;
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes?.[0] || '', product.colors?.[0] || '');
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 1200);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      className="group relative flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ '--accent': '#8e2424' }}
    >
      <Link to={`/product/${product.id}`} className="block">

        {/* ── IMAGE CONTAINER ── */}
        <div
          className="relative overflow-hidden bg-white"
          style={{
            aspectRatio: '3/4',
            borderRadius: '10px',
            transition: 'box-shadow .35s ease',
            boxShadow: hovered
              ? 'inset 0 0 30px rgba(205,60,60,0.15), inset 0 0 70px rgba(255,240,240,0.20)'
              : 'inset 0 0 0px transparent',
          }}
        >
          {/* Image */}
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover"
              style={{
                transform: hovered ? 'scale(1.06)' : 'scale(1)',
                transition: 'transform .6s cubic-bezier(.25,.46,.45,.94)',
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400">No Image</span>
            </div>
          )}

          {/* Dark gradient on hover */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
            style={{
              opacity: hovered ? 1 : 0,
              transition: 'opacity .35s ease',
            }}
          />

          {/* ── TOP BADGES ── */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.is_new && (
              <span
                className="text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 text-white"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                New
              </span>
            )}
            {hasDiscount && (
              <span className="text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 bg-black text-white">
                −{discountPct}%
              </span>
            )}
            {product.is_best_seller && (
              <span className="text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 bg-white text-black">
                Best Seller
              </span>
            )}
          </div>

          {/* ── WISHLIST ── */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all"
            style={{
              background: wishlisted ? 'var(--accent)' : 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(4px)',
              transform: hovered ? 'scale(1)' : 'scale(0.85)',
              opacity: hovered || wishlisted ? 1 : 0,
              transition: 'all .25s ease',
            }}
            aria-label="Wishlist"
          >
            <Heart
              className="w-3.5 h-3.5"
              style={{
                fill: wishlisted ? '#fff' : 'none',
                color: wishlisted ? '#fff' : '#0a0a0a',
              }}
            />
          </button>

          {/* ── BOTTOM CTA (on hover) ── */}
          <div
            className="absolute inset-x-0 bottom-0 flex gap-2 p-3"
            style={{
              transform: hovered ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform .3s cubic-bezier(.25,.46,.45,.94)',
            }}
          >
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[10px] font-black uppercase tracking-[0.18em] transition-colors"
              style={{
                backgroundColor: addedFlash ? '#166534' : '#fff',
                color: addedFlash ? '#fff' : '#0a0a0a',
                transition: 'background-color .2s',
              }}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {addedFlash ? 'Added!' : 'Add to Bag'}
            </button>

            <Link
              to={`/product/${product.id}`}
              onClick={(e) => e.stopPropagation()}
              className="w-10 flex items-center justify-center bg-black text-white hover:bg-gray-800 transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Out of stock overlay */}
          {!product.in_stock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 border border-gray-300 px-3 py-1.5">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* ── PRODUCT INFO ── */}
        <div className="mt-2.5 space-y-1">

          {/* Name + price row */}
          <div className="flex items-start justify-between gap-2">
            <h3
              className="text-[13px] font-semibold leading-snug text-gray-900 flex-1 line-clamp-1 tracking-tight"
              style={{ fontFamily: 'inherit' }}
            >
              {product.name}
            </h3>
            <div className="text-right shrink-0">
              <span className="text-[13px] font-black text-gray-900 block">
                {formatPrice(product.price)}
              </span>
              {product.original_price && (
                <span className="text-[11px] text-gray-400 line-through block leading-none mt-0.5">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>
          </div>

          {/* Color swatches */}
          {product.colors?.length > 0 && (
            <div className="flex items-center gap-1.5 pt-0.5">
              {product.colors.slice(0, 5).map((color, i) => (
                <span
                  key={i}
                  title={color}
                  className="w-3 h-3 rounded-full border border-gray-200 flex-shrink-0"
                  style={{ backgroundColor: colorToHex(color) }}
                />
              ))}
              {product.colors.length > 5 && (
                <span className="text-[10px] text-gray-400 font-medium">
                  +{product.colors.length - 5}
                </span>
              )}
            </div>
          )}

        </div>
      </Link>
    </div>
  );
}