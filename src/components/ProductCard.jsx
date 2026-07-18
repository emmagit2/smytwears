import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { formatPrice, getProductImage } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

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

  const { addToCart }                    = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wishlisted  = isInWishlist(product.id);
  const image       = getProductImage(product);
  const hasDiscount = !!product.original_price;
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

        {/* ── IMAGE ── */}
        <div
          className="relative overflow-hidden bg-white"
          style={{
            aspectRatio: '3/4',
            borderRadius: '8px',
            transition: 'box-shadow .35s ease',
            boxShadow: hovered
              ? 'inset 0 0 30px rgba(205,60,60,0.12), inset 0 0 60px rgba(255,240,240,0.18)'
              : 'inset 0 0 0px transparent',
          }}
        >
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

          {/* Hover overlay — gradient only */}
          <div
            className="absolute inset-0"
            style={{
              background: hovered
                ? 'linear-gradient(to top, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.18) 40%, transparent 65%)'
                : 'linear-gradient(to top, rgba(10,10,10,0) 0%, transparent 100%)',
              transition: 'background .4s ease',
            }}
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.is_new && (
              <span
                className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 text-white"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                New
              </span>
            )}
            {hasDiscount && (
              <span className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 bg-black text-white">
                −{discountPct}%
              </span>
            )}
            {product.is_best_seller && (
              <span className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 bg-white text-black">
                Best
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center transition-all"
            style={{
              background: wishlisted ? 'var(--accent)' : 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(4px)',
              borderRadius: '50%',
              transform: hovered ? 'scale(1)' : 'scale(0.8)',
              opacity: hovered || wishlisted ? 1 : 0,
              transition: 'all .25s ease',
            }}
            aria-label="Wishlist"
          >
            <Heart
              className="w-3 h-3"
              style={{
                fill: wishlisted ? '#fff' : 'none',
                color: wishlisted ? '#fff' : '#0a0a0a',
              }}
            />
          </button>

          {/* CTA bar */}
          <div
            className="absolute inset-x-0 bottom-0 flex gap-1.5 p-2"
            style={{
              transform: hovered ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform .3s cubic-bezier(.25,.46,.45,.94)',
            }}
          >
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[9px] font-black uppercase tracking-[0.18em]"
              style={{
                backgroundColor: addedFlash ? '#166534' : '#fff',
                color: addedFlash ? '#fff' : '#0a0a0a',
                transition: 'background-color .2s',
                borderRadius: '4px',
              }}
            >
              <ShoppingBag className="w-3 h-3" />
              {addedFlash ? 'Added!' : 'Add to Bag'}
            </button>
            <Link
              to={`/product/${product.id}`}
              onClick={e => e.stopPropagation()}
              className="w-9 flex items-center justify-center bg-black text-white hover:bg-gray-800 transition-colors"
              style={{ borderRadius: '4px' }}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Sold out */}
          {!product.in_stock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-500 border border-gray-300 px-2.5 py-1">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* ── INFO — compact, no description ── */}
        <div className="mt-2 space-y-1">

          {/* Name + description + price */}
          <div className="flex items-start justify-between gap-1.5">
            <div className="flex-1 min-w-0">
              <h3 className="text-[14px] font-black leading-none text-gray-900 line-clamp-1 tracking-tight">
                {product.name}
              </h3>
              {product.description && (
                <p className="text-[11px] text-gray-400 line-clamp-1 mt-1.5" style={{ lineHeight: '1.35' }}>
                  {product.description}
                </p>
              )}
            </div>
            <div className="text-right shrink-0 flex items-baseline gap-1">
              {product.original_price && (
                <span className="text-[10px] text-gray-400 line-through leading-none">
                  {formatPrice(product.original_price)}
                </span>
              )}
              <span className="text-[12px] font-black text-gray-900 leading-none">
                {formatPrice(product.price)}
              </span>
            </div>
          </div>

          {/* Color swatches */}
          {product.colors?.length > 0 && (
            <div className="flex items-center gap-1 pt-0.5">
              {product.colors.slice(0, 5).map((color, i) => (
                <span
                  key={i}
                  title={color}
                  className="w-2.5 h-2.5 rounded-full border border-gray-200 flex-shrink-0"
                  style={{ backgroundColor: colorToHex(color) }}
                />
              ))}
              {product.colors.length > 5 && (
                <span className="text-[9px] text-gray-400 font-medium">
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