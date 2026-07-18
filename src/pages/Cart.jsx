import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, getProductImage } from '@/data/products';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/30 mb-6" />
        <h1 className="text-3xl font-bold tracking-tight">Your Cart is Empty</h1>
        <p className="mt-3 text-muted-foreground">Looks like you haven't added anything yet.</p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-2 bg-foreground text-background px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-foreground/90 transition-colors"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-10">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-0">
          <div className="hidden sm:grid grid-cols-12 gap-4 text-xs uppercase tracking-[0.15em] font-semibold text-muted-foreground pb-4 border-b border-border">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          {items.map(item => (
            <div key={item.cartId} className="grid grid-cols-12 gap-4 items-center py-6 border-b border-border">
              {/* Product */}
              <div className="col-span-12 sm:col-span-6 flex gap-4">
                <Link to={`/product/${item.id}`} className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 border border-border overflow-hidden bg-muted">
                  {getProductImage(item) ? (
                    <img src={getProductImage(item)} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-muted" />
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.id}`} className="text-sm font-medium hover:underline line-clamp-2">
                    {item.name}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1">{item.color} / {item.size}</p>
                  <p className="text-sm font-bold mt-1 sm:hidden">{formatPrice(item.price)}</p>
                </div>
                <button onClick={() => removeFromCart(item.cartId)} className="sm:hidden self-start p-1">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Quantity */}
              <div className="col-span-6 sm:col-span-2 flex items-center justify-start sm:justify-center">
                <div className="inline-flex border border-border">
                  <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-muted">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 h-8 flex items-center justify-center text-xs font-medium border-x border-border">
                    {item.quantity}
                  </span>
                  <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-muted">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="hidden sm:block col-span-2 text-right text-sm font-medium">
                {formatPrice(item.price)}
              </div>

              {/* Total + Remove */}
              <div className="col-span-6 sm:col-span-2 flex items-center justify-end gap-3">
                <span className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</span>
                <button onClick={() => removeFromCart(item.cartId)} className="hidden sm:block p-1 hover:bg-muted transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border border-border p-6 sticky top-24">
            <h2 className="text-sm uppercase tracking-[0.2em] font-semibold mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Delivery fee is calculated at checkout based on your address.
              </p>
            </div>
            <Link
              to="/checkout"
              className="mt-6 block w-full bg-foreground text-background py-3.5 text-center text-xs uppercase tracking-[0.2em] font-semibold hover:bg-foreground/90 transition-colors"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/shop"
              className="mt-3 block text-center text-xs text-muted-foreground underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}