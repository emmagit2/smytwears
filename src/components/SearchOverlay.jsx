import React, { useState, useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice, getProductImage } from '@/data/products';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/data/products';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(),
  });

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const results = query.length > 1
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-md"
        >
          <div className="max-w-2xl mx-auto pt-24 px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Search</h2>
              <button onClick={onClose} className="p-2 hover:bg-muted transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-transparent border-b-2 border-foreground py-3 pl-8 pr-4 text-lg font-medium focus:outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="mt-8 max-h-[60vh] overflow-y-auto">
              {query.length > 1 && results.length === 0 && (
                <p className="text-muted-foreground text-center py-12">
                  No products found for "{query}"
                </p>
              )}
              <div className="space-y-4">
                {results.map(product => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    onClick={() => { onClose(); setQuery(''); }}
                    className="flex items-center gap-4 p-3 hover:bg-muted transition-colors"
                  >
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-16 h-16 object-cover"
                    />
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-sm font-bold">{formatPrice(product.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}