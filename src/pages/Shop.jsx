import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { fetchProducts } from '@/data/products';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { useQuery } from '@tanstack/react-query';

const categories = ['all', 'men', 'women', 'accessories', 'caps'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const sortOptions = [
  { label: 'Popular', value: 'popular' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

export default function Shop() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialCategory = params.get('category') || 'all';

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [category, setCategory] = useState(initialCategory);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [selectedSize, setSelectedSize] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [page, setPage] = useState(1);
  const perPage = 9;

  useEffect(() => {
    setCategory(initialCategory);
    setPage(1);
  }, [initialCategory]);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts({ limit: 100 }),
  });

  const filtered = useMemo(() => {
    let result = [...products];

    if (category !== 'all') result = result.filter(p => p.category === category);
    result = result.filter(p => p.price <= maxPrice);
    if (selectedSize) result = result.filter(p => p.sizes?.includes(selectedSize));

    switch (sortBy) {
      case 'newest':
        result = result.filter(p => p.is_new).concat(result.filter(p => !p.is_new));
        break;
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        result = result.filter(p => p.is_best_seller).concat(result.filter(p => !p.is_best_seller));
    }

    return result;
  }, [products, category, maxPrice, selectedSize, sortBy]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginatedProducts = filtered.slice((page - 1) * perPage, page * perPage);

  const clearFilters = () => {
    setCategory('all');
    setMaxPrice(100000);
    setSelectedSize('');
    setSortBy('popular');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Shop All</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} products</p>
        </div>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 border border-border text-sm font-medium"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className={`${
          filtersOpen ? 'fixed inset-0 z-50 bg-background p-6 overflow-y-auto' : 'hidden'
        } lg:block lg:relative lg:w-64 flex-shrink-0`}>
          <div className="flex items-center justify-between lg:hidden mb-6">
            <h2 className="text-lg font-bold">Filters</h2>
            <button onClick={() => setFiltersOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category */}
          <div className="mb-8">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold mb-4">Category</h3>
            <div className="space-y-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setPage(1); }}
                  className={`block text-sm capitalize w-full text-left py-1 transition-colors ${
                    category === cat ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat === 'all' ? 'All Products' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold mb-4">Price Range</h3>
            <input
              type="range"
              min={0}
              max={100000}
              step={1000}
              value={maxPrice}
              onChange={e => { setMaxPrice(Number(e.target.value)); setPage(1); }}
              className="w-full accent-foreground"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>₦0</span>
              <span>₦{maxPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Size */}
          <div className="mb-8">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold mb-4">Size</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => { setSelectedSize(selectedSize === size ? '' : size); setPage(1); }}
                  className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
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

          {/* Sort */}
          <div className="mb-8">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold mb-4">Sort By</h3>
            <div className="space-y-2">
              {sortOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setSortBy(opt.value); setPage(1); }}
                  className={`block text-sm w-full text-left py-1 transition-colors ${
                    sortBy === opt.value ? 'text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={clearFilters}
            className="text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground underline"
          >
            Clear All Filters
          </button>

          <button
            onClick={() => setFiltersOpen(false)}
            className="lg:hidden mt-6 w-full bg-foreground text-background py-3 text-sm uppercase tracking-[0.15em] font-semibold"
          >
            Apply Filters
          </button>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {isLoading
              ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : paginatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
            }
          </div>

          {!isLoading && paginatedProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No products match your filters.</p>
              <button onClick={clearFilters} className="mt-4 text-sm underline font-medium">
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => { setPage(p); window.scrollTo(0, 0); }}
                  className={`w-10 h-10 text-sm font-medium transition-colors ${
                    page === p
                      ? 'bg-foreground text-background'
                      : 'border border-border hover:bg-muted'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}