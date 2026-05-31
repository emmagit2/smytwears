import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { fetchProducts, formatPrice, getProductImage } from '@/data/products';
import { useQuery } from '@tanstack/react-query';

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const { data: allProducts = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts({ limit: 100 }),
  });

  const wishlistProducts = allProducts.filter(p => wishlist.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="w-16 h-16 border-2 border-gray-200 flex items-center justify-center mb-6">
          <Heart className="w-7 h-7 text-gray-300" />
        </div>
        <h2 className="text-xl font-black tracking-tight text-gray-900 mb-2">Your wishlist is empty</h2>
        <p className="text-sm text-gray-400 mb-8 max-w-xs">
          Browse the collection and save your favourite pieces here.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3 text-xs uppercase tracking-widest font-bold text-white"
          style={{ backgroundColor: '#8e2424' }}
        >
          Browse Collection <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-6 h-0.5" style={{ backgroundColor: '#8e2424' }} />
          <span className="text-xs uppercase tracking-[0.3em] text-gray-400 font-semibold">Saved Items</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
          Wishlist <span className="text-gray-300">({wishlistProducts.length})</span>
        </h1>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlistProducts.map(product => (
          <div key={product.id} className="group relative">
            <Link to={`/product/${product.id}`}>
              <div className="relative aspect-square overflow-hidden bg-gray-50 border border-gray-100">
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {product.is_new && (
                  <span className="absolute top-2 left-2 bg-gray-900 text-white text-[9px] uppercase tracking-widest px-2 py-0.5 font-bold">
                    New
                  </span>
                )}
              </div>
            </Link>

            {/* Actions */}
            <div className="absolute top-2 right-2 flex flex-col gap-1.5">
              <button
                onClick={() => toggleWishlist(product.id)}
                className="w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors"
                title="Remove from wishlist"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
              </button>
              <button
                onClick={() => addToCart(product, product.sizes?.[0], product.colors?.[0])}
                className="w-8 h-8 flex items-center justify-center shadow-sm text-white transition-colors"
                style={{ backgroundColor: '#8e2424' }}
                title="Add to cart"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Info */}
            <div className="mt-3 space-y-0.5">
              <Link to={`/product/${product.id}`}>
                <h3 className="text-sm font-semibold text-gray-900 leading-tight hover:opacity-70 transition-opacity">
                  {product.name}
                </h3>
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{formatPrice(product.price)}</span>
                {product.original_price && (
                  <span className="text-xs text-gray-400 line-through">{formatPrice(product.original_price)}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA bar */}
      <div className="mt-14 border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-400">
          {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''} saved
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => wishlistProducts.forEach(p => addToCart(p, p.sizes?.[0], p.colors?.[0]))}
            className="px-8 py-3 text-xs uppercase tracking-widest font-bold text-white transition-colors"
            style={{ backgroundColor: '#8e2424' }}
          >
            Add All to Cart
          </button>
          <Link
            to="/shop"
            className="px-8 py-3 text-xs uppercase tracking-widest font-bold border border-gray-200 text-gray-700 hover:border-gray-900 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}