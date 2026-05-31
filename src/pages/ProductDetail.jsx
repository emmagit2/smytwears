import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { fetchProductById, fetchRelatedProducts, formatPrice, getProductImage, getProductImages } from '@/data/products';
import { useCart } from '@/context/CartContext';
import ProductCard from '../components/ProductCard';
import { useQuery } from '@tanstack/react-query';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState('details');

  useEffect(() => {
    setSelectedImage(0);
    setSelectedColor(0);
    setSelectedSize('');
    setQuantity(1);
    window.scrollTo(0, 0);
  }, [id]);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
  });

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['related', product?.category, id],
    queryFn: () => fetchRelatedProducts(product),
    enabled: !!product,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="animate-pulse bg-muted aspect-square" />
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted w-20" />
            <div className="h-8 bg-muted w-3/4" />
            <div className="h-6 bg-muted w-32" />
            <div className="h-20 bg-muted w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Link to="/shop" className="mt-4 inline-block underline">Back to Shop</Link>
      </div>
    );
  }

  const images = getProductImages(product);
  const mainImage = images[selectedImage]?.url || getProductImage(product);

  const handleAddToCart = () => {
    if (!selectedSize) { alert('Please select a size'); return; }
    addToCart(product, selectedSize, product.colors?.[selectedColor] || '', quantity);
  };

  const handleBuyNow = () => {
    if (!selectedSize) { alert('Please select a size'); return; }
    addToCart(product, selectedSize, product.colors?.[selectedColor] || '', quantity);
    navigate('/cart');
  };

  const accordions = [
    { key: 'details', title: 'Product Details', content: product.details },
    { key: 'shipping', title: 'Shipping & Returns', content: product.shipping },
    { key: 'care', title: 'Care Instructions', content: product.care },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Images */}
        <div>
          <div className="aspect-square overflow-hidden bg-muted border border-border">
            <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {images.map((img, i) => (
                <div
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square overflow-hidden border-2 cursor-pointer ${
                    selectedImage === i ? 'border-foreground' : 'border-border'
                  }`}
                >
                  <img src={img.url} alt={img.alt_text || product.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">SMYT</span>
          <h1 className="text-2xl sm:text-3xl font-bold mt-2 tracking-tight">{product.name}</h1>

          <div className="flex items-center gap-3 mt-4">
            <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
            {product.original_price && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>

          <p className="mt-6 text-muted-foreground leading-relaxed text-sm">{product.description}</p>

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold mb-3">
                Color — {product.colors[selectedColor]}
              </h3>
              <div className="flex gap-2">
                {product.colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    className={`px-3 py-1.5 text-xs font-medium border-2 transition-colors ${
                      selectedColor === i ? 'border-foreground bg-secondary' : 'border-border hover:border-foreground/40'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          {product.sizes?.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs uppercase tracking-[0.2em] font-semibold">Size</h3>
                <button className="text-xs text-muted-foreground underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2.5 text-xs font-medium uppercase tracking-wider border transition-colors ${
                      selectedSize === size
                        ? 'bg-foreground text-background border-foreground'
                        : 'border-border hover:border-foreground'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-8">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold mb-3">Quantity</h3>
            <div className="inline-flex border border-border">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 h-10 flex items-center justify-center text-sm font-medium border-x border-border">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 border-2 border-foreground text-foreground py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-muted transition-colors"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-foreground text-background py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-foreground/90 transition-colors"
            >
              Buy Now
            </button>
          </div>

          {/* Accordions */}
          <div className="mt-10 border-t border-border">
            {accordions.map(acc => (
              <div key={acc.key} className="border-b border-border">
                <button
                  onClick={() => setOpenAccordion(openAccordion === acc.key ? '' : acc.key)}
                  className="w-full flex items-center justify-between py-4 text-sm font-medium"
                >
                  {acc.title}
                  {openAccordion === acc.key ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === acc.key && (
                  <p className="pb-4 text-sm text-muted-foreground leading-relaxed">{acc.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold tracking-tight mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}