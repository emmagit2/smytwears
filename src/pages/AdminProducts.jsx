import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, formatPrice, getProductImage } from '@/data/products';
import { productsApi } from '@/api/apiClient';
import { PlusCircle, Search, Pencil, Trash2, Eye, Package } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function AdminProducts() {
  const [query,          setQuery]          = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const queryClient = useQueryClient();

  const categories = ['all', 'men', 'women', 'accessories', 'caps'];

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn:  () => fetchProducts({ limit: 100 }),
  });

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await productsApi.delete(id);
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  const filtered = products.filter(p => {
    const matchQuery = p.name.toLowerCase().includes(query.toLowerCase());
    const matchCat   = categoryFilter === 'all' || p.category === categoryFilter;
    return matchQuery && matchCat;
  });

  return (
    <div className="space-y-6">

      {/* Toolbar */}
      <div className="bg-background border border-border p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full border border-border pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-foreground"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-2 text-xs uppercase tracking-wider font-semibold transition-colors ${
                  categoryFilter === cat
                    ? 'bg-foreground text-background'
                    : 'border border-border hover:bg-muted'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <Link
          to="/admin/upload"
          className="flex items-center gap-2 bg-foreground text-background px-5 py-2.5 text-xs uppercase tracking-wider font-bold hover:bg-foreground/90 transition-colors whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="bg-background border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary">
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-muted-foreground">Product</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-muted-foreground hidden sm:table-cell">Category</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-muted-foreground">Price</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-muted-foreground hidden md:table-cell">Status</th>
              <th className="text-right px-4 py-3 text-xs uppercase tracking-widest font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground text-sm">
                  Loading products...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground text-sm">
                  No products found.
                </td>
              </tr>
            ) : filtered.map(product => {
              const imageUrl = getProductImage(product);
              return (
                <tr key={product.id} className="border-b border-border hover:bg-secondary/50 transition-colors">

                  {/* Product */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {/* Image with fallback */}
                      <div className="w-12 h-12 border border-border overflow-hidden flex-shrink-0 bg-secondary flex items-center justify-center">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        {/* Fallback icon — shown if no image or image fails to load */}
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ display: imageUrl ? 'none' : 'flex' }}
                        >
                          <Package className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </div>

                      <div>
                        <p className="font-medium text-sm leading-tight">{product.name}</p>
                        <div className="flex gap-1 mt-1">
                          {product.is_new && (
                            <span className="text-[10px] bg-foreground text-background px-1.5 py-0.5 uppercase tracking-wider font-semibold">New</span>
                          )}
                          {product.is_best_seller && (
                            <span className="text-[10px] bg-secondary border border-border text-foreground px-1.5 py-0.5 uppercase tracking-wider font-semibold">Best Seller</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium capitalize">
                      {product.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-bold">{formatPrice(product.price)}</p>
                      {product.original_price && (
                        <p className="text-xs text-muted-foreground line-through">{formatPrice(product.original_price)}</p>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className={`text-xs px-2.5 py-1 font-semibold uppercase tracking-wider ${
                      product.in_stock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {product.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/product/${product.id}`}
                        className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} products</p>
    </div>
  );
} 