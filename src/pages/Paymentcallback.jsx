import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { paymentsApi } from '@/api/apiclient';
import { formatPrice } from '@/data/products';

// Paystack redirects to:
//   /payment/callback?reference=SMYT-XXXXXX&trxref=SMYT-XXXXXX

export default function PaymentCallback() {
  const navigate = useNavigate();
  const params    = new URLSearchParams(window.location.search);
  const reference = params.get('reference') || params.get('trxref');

  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'failed' | 'error'
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    if (!reference) {
      setStatus('error');
      return;
    }

    paymentsApi
      .verify(reference)
      .then(({ data }) => {
        if (data.success) {
          setOrderNumber(data.order_number || reference);
          setStatus('success');
          // Redirect to confirmation after a beat so the user sees the success state
          setTimeout(() => {
            navigate(`/order-confirmation?order=${data.order_number || reference}`, {
              replace: true,
            });
          }, 2000);
        } else {
          setStatus('failed');
        }
      })
      .catch(() => setStatus('error'));
  }, [reference, navigate]);

  // ── Verifying ───────────────────────────────────────────────────────────────
  if (status === 'verifying') {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-muted-foreground" />
        <p className="mt-6 text-muted-foreground text-sm">Confirming your payment…</p>
      </div>
    );
  }

  // ── Success ─────────────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-green-50 flex items-center justify-center mx-auto mb-6 rounded-full">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Payment confirmed</h1>
        <p className="mt-2 text-muted-foreground text-sm">Redirecting to your order…</p>
      </div>
    );
  }

  // ── Failed ──────────────────────────────────────────────────────────────────
  if (status === 'failed') {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-red-50 flex items-center justify-center mx-auto mb-6 rounded-full">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Payment unsuccessful</h1>
        <p className="mt-4 text-muted-foreground text-sm">
          Your payment didn't go through. No charge was made. You can try again below.
        </p>
        {reference && (
          <p className="mt-2 text-xs text-muted-foreground">Reference: {reference}</p>
        )}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/checkout"
            className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-foreground/90 transition-colors"
          >
            Try Again <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center border border-border px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-muted transition-colors"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  // ── Error (missing reference / network failure) ──────────────────────────────
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 bg-red-50 flex items-center justify-center mx-auto mb-6 rounded-full">
        <XCircle className="w-10 h-10 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
      <p className="mt-4 text-muted-foreground text-sm">
        We couldn't verify your payment. If money left your account, please contact us at{' '}
        <a href="mailto:selfmadeyoutoday@gmail.com" className="underline">
          selfmadeyoutoday@gmail.com
        </a>{' '}
        with your reference number.
      </p>
      {reference && (
        <p className="mt-2 text-xs font-mono text-muted-foreground">Ref: {reference}</p>
      )}
      <Link
        to="/shop"
        className="mt-8 inline-flex items-center gap-2 border border-border px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-muted transition-colors"
      >
        Back to Shop
      </Link>
    </div>
  );
}