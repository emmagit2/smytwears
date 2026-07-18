import ReactPixel from "react-facebook-pixel";

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

const options = {
  autoConfig: true,
  debug: import.meta.env.DEV,
};

let initialized = false;

export const initMetaPixel = () => {
  if (!PIXEL_ID) {
    console.warn("[MetaPixel] VITE_META_PIXEL_ID is not set — skipping init.");
    return;
  }
  if (initialized) return; // avoid double-init on hot reload / route changes
  ReactPixel.init(PIXEL_ID, {}, options);
  ReactPixel.pageView();
  initialized = true;
};

export const trackPageView = () => {
  if (!initialized) return;
  ReactPixel.pageView();
};

// eventOptions supports passing { eventID } — required for de-duplicating
// a browser Pixel event against the matching server-side Conversions API
// event for the same action (e.g. both tagged with the same order_number).
export const trackEvent = (event, data = {}, eventOptions = {}) => {
  if (!initialized) {
    console.warn(`[MetaPixel] Tried to track "${event}" before init.`);
    return;
  }
  ReactPixel.track(event, data, eventOptions);
};

// ── Standard e-commerce events, shaped to Meta's expected schema ──────────

export const trackViewContent = (product) => {
  trackEvent("ViewContent", {
    content_name: product.name,
    content_ids: [String(product.id)],
    content_type: "product",
    value: product.price,
    currency: "NGN",
  });
};

export const trackAddToCart = (product, quantity = 1) => {
  trackEvent("AddToCart", {
    content_name: product.name,
    content_ids: [String(product.id)],
    content_type: "product",
    value: product.price * quantity,
    currency: "NGN",
  });
};

export const trackInitiateCheckout = (items, total) => {
  trackEvent("InitiateCheckout", {
    content_ids: items.map((i) => String(i.id)),
    content_type: "product",
    num_items: items.reduce((sum, i) => sum + i.quantity, 0),
    value: total,
    currency: "NGN",
  });
};

// order.order_number is used as the eventID so the backend's Meta CAPI
// Purchase event (fired from orders.js once payment is confirmed, using
// the same order_number as its event_id) gets deduplicated against this
// browser-side event instead of counting as two separate purchases.
export const trackPurchase = (order) => {
  trackEvent(
    "Purchase",
    {
      content_ids: order.items.map((i) => String(i.product_id)),
      content_type: "product",
      num_items: order.items.reduce((sum, i) => sum + i.quantity, 0),
      value: order.total,
      currency: "NGN",
    },
    { eventID: order.order_number }
  );
};