import { productsApi } from '@/api/apiClient';

// ── Fetch functions (replace static exports) ──────────────────

export const fetchProducts = async (params = {}) => {
  const { data } = await productsApi.list(params);
  return data.products || [];
};

export const fetchProductById = async (id) => {
  const { data } = await productsApi.get(id);
  return data;
};

export const fetchRelatedProducts = async (product, limit = 4) => {
  const { data } = await productsApi.list({ category: product.category, limit: limit + 1 });
  return (data.products || []).filter(p => p.id !== product.id).slice(0, limit);
};

export const fetchBestSellers = async () => {
  const { data } = await productsApi.list({ is_best_seller: true });
  return data.products || [];
};

export const fetchNewArrivals = async () => {
  const { data } = await productsApi.list({ is_new: true });
  return data.products || [];
};

// ── Helpers (keep these, they're pure functions) ──────────────

export const formatPrice = (price) => {
  return `₦${Number(price).toLocaleString()}`;
};

export const getProductImage = (product) => {
  if (!product?.product_images?.length) return null;
  const primary = product.product_images.find(img => img.is_primary);
  return primary?.url || product.product_images[0]?.url || null;
};

export const getProductImages = (product) => {
  if (!product?.product_images?.length) return [];
  return [...product.product_images].sort((a, b) => a.sort_order - b.sort_order);
};