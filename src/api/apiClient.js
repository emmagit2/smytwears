import axios from "axios";
import { supabase } from "@/lib/supabase";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers["Authorization"] = `Bearer ${session.access_token}`;
  }
  return config;
});

export const ordersApi = {
  place:          (payload)     => api.post("/orders", payload),
  track:          (orderNumber) => api.get(`/orders/track?order_number=${orderNumber}`),
  list:           (params = {}) => api.get("/orders", { params }),
  get:            (id)          => api.get(`/orders/${id}`),
  updateStatus:   (payload)     => api.post("/orders/status", payload),
  confirmPayment: (payload)     => api.post("/orders/payment", payload),
};

export const productsApi = {
  list:        (params = {})        => api.get("/products", { params }),
  get:         (id)                 => api.get(`/products/${id}`),
  create:      (payload)            => api.post("/products", payload),
  update:      (id, payload)        => api.patch(`/products/${id}`, payload),
  delete:      (id)                 => api.delete(`/products/${id}`),
  saveImages:  (id, images)         => api.post(`/products/${id}/images/urls`, images),
  deleteImage: (productId, imageId) => api.delete(`/products/${productId}/images/${imageId}`),
};

export const paymentsApi = {
  initialize: (orderNumber) => api.post("/payments/initialize", { order_number: orderNumber }),
  verify:     (reference)   => api.get(`/payments/verify?reference=${reference}`),
};

export const affiliatesApi = {
  apply:   (payload)    => api.post("/affiliates", payload),
  approve: (payload)    => api.post("/affiliates/approve", payload),
  stats:   (code)       => api.get(`/affiliates/stats?code=${code}`),
  list:    (params)     => api.get("/affiliates", { params }),
  payout:  (id, amt)    => api.patch(`/affiliates/${id}/payout`, { amount: amt }),
};

export const contactApi = {
  submit: (payload) => api.post("/contact", payload),
};

export const deliveryApi = {
  states: ()             => api.get("/delivery/states"),
  lgas:   (state)        => api.get(`/delivery/lgas/${state}`),
  wards:  (state, lga)   => api.get(`/delivery/wards/${state}/${encodeURIComponent(lga)}`),
};

export default api;