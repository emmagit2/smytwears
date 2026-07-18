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

// ────────────────────────────────────────────────────────────
// Affiliates — matches routes/affiliates.js exactly, including
// the new PATCH /:id route for suspend / reinstate / commission edits.
// ────────────────────────────────────────────────────────────
export const affiliatesApi = {
  apply: (payload) => api.post("/affiliates", payload),

  // First-time approval only: generates referral_code + sends welcome email.
  // commission_rate is optional — omit it to use the DB default (10).
  approve: (affiliate_id, commission_rate) =>
    api.post("/affiliates/approve", { affiliate_id, commission_rate }),

  stats: (code) => api.get(`/affiliates/stats?code=${code}`),
  list:  (params) => api.get("/affiliates", { params }),
  payout: (id, amount) => api.patch(`/affiliates/${id}/payout`, { amount }),

  // Suspend, reinstate to pending, or re-approve an already-approved
  // affiliate (i.e. one that already has a referral_code).
  updateStatus: (id, status) => api.patch(`/affiliates/${id}`, { status }),

  // Change an existing affiliate's commission rate independently of status.
  updateCommission: (id, commission_rate) =>
    api.patch(`/affiliates/${id}`, { commission_rate }),

  // Email-code verification flow (login/signup without a password).
  requestCode:    (email)         => api.post("/affiliates/request-code", { email }),
  verifyCode:     (email, code)   => api.post("/affiliates/verify-code", { email, code }),
  checkAffiliate: (email)         => api.get("/affiliates/check", { params: { email } }),

  // Verify + save affiliate payout bank account (Paystack account resolve).
  addBankDetails: (affiliateId, payload) =>
    api.post(`/affiliates/${affiliateId}/bank-details`, payload),
};

export const contactApi = {
  submit: (payload) => api.post("/contact", payload),
};

// In apiClient.js, update the deliveryApi object to add `rates`:

export const deliveryApi = {
  states: ()             => api.get("/delivery/states"),
  lgas:   (state)        => api.get(`/delivery/lgas/${state}`),
  wards:  (state, lga)   => api.get(`/delivery/wards/${state}/${encodeURIComponent(lga)}`),
  rates:  (payload)      => api.post("/delivery/rates", payload), // NEW
};

export default api;