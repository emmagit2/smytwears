import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye } from 'lucide-react';
import { formatPrice, getProductImage } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ProductCard({ product }) {
  const [hovered, setHovered]   = useState(false);
  const { addToCart }           = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);

  const image = getProductImage(product); // ✅ pass full product object

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const firstSize  = product.sizes?.[0]  || '';
    const firstColor = product.colors?.[0] || '';
    addToCart(product, firstSize, firstColor);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted border border-border">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs uppercase tracking-wider">
              No Image
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.is_new && (
              <span className="bg-foreground text-background text-[10px] uppercase tracking-widest px-2 py-1 font-semibold">
                New
              </span>
            )}
            {product.original_price && (
              <span className="bg-accent text-accent-foreground text-[10px] uppercase tracking-widest px-2 py-1 font-semibold">
                Sale
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-accent text-accent' : 'text-foreground'}`} />
          </button>

          {/* Quick View overlay */}
          {hovered && (
            <div className="absolute inset-x-0 bottom-0 bg-foreground/90 backdrop-blur-sm p-3 transition-all">
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-background text-foreground text-xs uppercase tracking-widest py-2 font-semibold hover:bg-muted transition-colors"
                >
                  Add to Cart
                </button>
                <Link
                  to={`/product/${product.id}`}
                  className="w-10 flex items-center justify-center bg-background text-foreground hover:bg-muted transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Eye className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-4 space-y-1">
          <h3 className="text-sm font-medium text-foreground leading-tight">{product.name}</h3>
          <p className="text-xs text-muted-foreground leading-snug line-clamp-2">{product.description}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">{formatPrice(product.price)}</span>
            {product.original_price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
          {/* Color dots */}
          {product.colors?.length > 0 && (
            <div className="flex gap-1 pt-1">
              {product.colors.slice(0, 4).map((color, i) => (
                <span
                  key={i}
                  className="w-3 h-3 border border-border"
                  title={color}
                  style={{ backgroundColor: color.toLowerCase() }}
                />
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}