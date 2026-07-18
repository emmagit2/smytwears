import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { formatPrice } from '@/data/products';
import { ordersApi } from '@/api/apiClient';
import { trackPurchase } from '@/lib/metaPixel';

export default function OrderConfirmation() {
  const params      = new URLSearchParams(window.location.search);
  const orderNumber = params.get('order') || '—';

  const [order, setOrder]     = useState(null);
  const [loading, setLoading] = useState(true);

  // Guards against firing Purchase twice for the same order — e.g. if the
  // user refreshes this page. Meta doesn't dedupe browser Pixel events on
  // its own, so a per-order flag in sessionStorage keeps re-visits/refreshes
  // from inflating conversion numbers.
  const tracked = useRef(false);

  useEffect(() => {
    if (!orderNumber || orderNumber === '—') {
      setLoading(false);
      return;
    }

    ordersApi
      .track(orderNumber)
      .then(({ data }) => {
        setOrder(data);

        const alreadyTracked = sessionStorage.getItem(`purchase_tracked_${orderNumber}`);
        if (!tracked.current && !alreadyTracked && data?.pixel_items?.length) {
          trackPurchase({
            items: data.pixel_items,
            total: data.total,
            // Matches the event_id the backend's Meta CAPI Purchase event
            // uses (order_number) — required for Meta to dedupe this
            // browser Pixel event against the server-side one, instead of
            // counting the same purchase twice.
            order_number: orderNumber,
          });
          tracked.current = true;
          sessionStorage.setItem(`purchase_tracked_${orderNumber}`, '1');
        }
      })
      .catch((err) => console.error('Failed to load order:', err))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 bg-green-50 flex items-center justify-center mx-auto mb-6 rounded-full">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight">Order Confirmed</h1>
      <p className="mt-4 text-muted-foreground">
        Thank you for your order. We've received it and will begin processing shortly.
      </p>
      <div className="mt-8 border border-border p-6 text-left space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Order Number</span>
          <span className="font-bold">{orderNumber}</span>
        </div>
        {loading && (
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground py-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading order details…
          </div>
        )}
        {!loading && order?.total != null && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-bold">{formatPrice(order.total)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Status</span>
          <span className="text-green-600 font-semibold">Confirmed</span>
        </div>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        A confirmation email will be sent shortly. For questions, contact us at{' '}
        <a href="mailto:info@smytwears.com" className="underline">
          info@smytwears.com
        </a>
      </p>
      <Link
        to="/shop"
        className="mt-8 inline-flex items-center gap-2 bg-foreground text-background px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-foreground/90 transition-colors"
      >
        Continue Shopping <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}