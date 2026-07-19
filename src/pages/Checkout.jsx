import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { formatPrice, getProductImage } from '@/data/products';
import { ordersApi, paymentsApi, deliveryApi } from '@/api/apiClient';
import { getStoredReferral } from '@/components/ReferralCapture';
import { PaystackLogo } from '@/components/PaymentLogos';
import { ChevronRight, Check, Loader2 } from 'lucide-react';
import { trackInitiateCheckout } from "@/lib/metaPixel";

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = ['Contact & Delivery', 'Delivery Method', 'Payment'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Reads a cookie by name — used to grab Meta's _fbp/_fbc cookies so they
// can be forwarded to the backend and attached to the server-side
// Conversions API Purchase event later (for match quality + dedup).
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
};

// ─── Shared UI ────────────────────────────────────────────────────────────────

const inputClass =
  'w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground bg-background disabled:opacity-50';

function FormField({ label, required, loading: fieldLoading, children }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider font-medium mb-2">
        {label}{required && ' *'}
        {fieldLoading && <Loader2 className="inline w-3 h-3 animate-spin ml-1" />}
      </label>
      {children}
    </div>
  );
}

// ─── Step components ──────────────────────────────────────────────────────────
function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center gap-2 mb-10 text-sm overflow-x-auto">
      {STEPS.map((label, i) => (
        <React.Fragment key={label}>
          <div
            className={`flex items-center gap-2 whitespace-nowrap ${
              i === currentStep   ? 'text-foreground font-semibold'
              : i < currentStep  ? 'text-accent'
              :                    'text-muted-foreground'
            }`}
          >
            <span
              className={`w-6 h-6 flex items-center justify-center text-xs border ${
                i < currentStep  ? 'bg-foreground text-background border-foreground'
                : i === currentStep ? 'border-foreground'
                :                    'border-border'
              }`}
            >
              {i < currentStep ? <Check className="w-3 h-3" /> : i + 1}
            </span>
            {label}
          </div>
          {i < STEPS.length - 1 && (
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function ContactStep({
  form, allStates, lgas, wards,
  loadingLgas, loadingWards, loadingRates,
  onFieldChange, onStateChange, onLgaChange,
  onContinue, error,
}) {
  return (
    <div>
      <h2 className="text-lg font-bold mb-6">Contact & Delivery Information</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <FormField label="First Name" required>
          <input name="firstName" value={form.firstName} onChange={onFieldChange} className={inputClass} />
        </FormField>

        <FormField label="Last Name" required>
          <input name="lastName" value={form.lastName} onChange={onFieldChange} className={inputClass} />
        </FormField>

        <FormField label="Email" required>
          <input name="email" type="email" value={form.email} onChange={onFieldChange} className={inputClass} />
        </FormField>

        <FormField label="Phone" required>
          <input name="phone" value={form.phone} onChange={onFieldChange} className={inputClass} />
        </FormField>

        <div className="sm:col-span-2">
          <FormField label="Street Address" required>
            <input
              name="address"
              value={form.address}
              onChange={onFieldChange}
              placeholder="12 Herbert Macaulay Way"
              className={inputClass}
            />
          </FormField>
        </div>

        <FormField label="State" required>
          <select value={form.stateCode} onChange={onStateChange} className={inputClass}>
            <option value="">Select state</option>
            {allStates.map((s) => (
              <option key={s.alias} value={s.alias}>{s.name}</option>
            ))}
          </select>
        </FormField>

        <FormField label="LGA" required loading={loadingLgas}>
          <select
            name="lga"
            value={form.lga}
            onChange={onLgaChange}
            disabled={loadingLgas}
            className={inputClass}
          >
            {!form.stateCode ? (
              <option value="">Select a state first</option>
            ) : (
              <>
                <option value="">Select LGA</option>
                {lgas.map((l) => (
                  <option key={l.name} value={l.name}>{l.name}</option>
                ))}
              </>
            )}
          </select>
        </FormField>

        <FormField label="Area / Ward" loading={loadingWards}>
          <select
            name="ward"
            value={form.ward}
            onChange={onFieldChange}
            disabled={loadingWards}
            className={inputClass}
          >
            {!form.lga ? (
              <option value="">Select an LGA first</option>
            ) : (
              <>
                <option value="">Select area (optional)</option>
                {wards.map((w) => (
                  <option key={w.name} value={w.name}>{w.name}</option>
                ))}
              </>
            )}
          </select>
        </FormField>

      </div>

      <button
        onClick={onContinue}
        disabled={loadingRates}
        className="mt-6 bg-foreground text-background px-10 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loadingRates
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Checking delivery rates...</>
          : 'Continue'}
      </button>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function DeliveryMethodStep({ couriers, selectedCourier, onSelect, onBack, onContinue }) {
  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Delivery Method</h2>
      <p className="text-xs text-muted-foreground mb-6">
        Orders are processed within 3–5 business days before dispatch.
        The delivery time shown below starts counting after that.
      </p>

      {couriers.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No delivery options available for this address. Please go back and check your address details.
        </p>
      ) : (
        <div className="space-y-3">
          {couriers.map((c) => (
            <button
              key={c.courier_id}
              onClick={() => onSelect(c)}
              className={`w-full flex items-center justify-between border p-5 text-left transition-colors ${
                selectedCourier?.courier_id === c.courier_id
                  ? 'border-foreground bg-secondary'
                  : 'border-border hover:border-foreground/30'
              }`}
            >
              <div>
                <p className="text-sm font-semibold">{c.courier_name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{c.delivery_eta}</p>
              </div>
              <span className="text-sm font-bold">{formatPrice(c.delivery_price)}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-3 mt-8">
        <button onClick={onBack} className="border border-border px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-muted">Back</button>
        <button
          onClick={onContinue}
          disabled={!selectedCourier}
          className="bg-foreground text-background px-10 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
function PaymentStep({ total, loading, error, onBack, onPlaceOrder, referralCode }) {

  return (
    <div>
      <h2 className="text-lg font-bold mb-6">Payment</h2>
      <div className="border border-border p-5 bg-secondary text-sm text-muted-foreground mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="font-semibold text-foreground">Pay securely via Paystack</p>
          <PaystackLogo height="h-12" width="w-20" />
        </div>
        <p>You'll be redirected to Paystack to complete your payment. All methods accepted — card, bank transfer, USSD, mobile money, and more.</p>
      </div>
      {referralCode && (
        <div className="border border-border p-3 mb-6 text-xs text-muted-foreground">
          Referral code applied: <span className="font-semibold text-foreground">{referralCode}</span>
        </div>
      )}
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button onClick={onBack} className="border border-border px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-muted">Back</button>
        <button
          onClick={onPlaceOrder}
          disabled={loading}
          className="bg-foreground text-background px-10 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
            : `Pay ${formatPrice(total)}`}
        </button>
      </div>
    </div>
  );
}

function OrderSummary({ items, subtotal, deliveryFee, total, stateName, courierName }) {
  return (
    <div className="border border-border p-6 sticky top-24">
      <h2 className="text-sm uppercase tracking-[0.2em] font-semibold mb-6">Order Summary</h2>
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.cartId} className="flex gap-3">
            <div className="w-14 h-14 border border-border overflow-hidden flex-shrink-0 relative bg-muted">
              {getProductImage(item) && (
                <img src={getProductImage(item)} alt={item.name} className="w-full h-full object-cover" />
              )}
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-background text-[10px] font-bold flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{item.name}</p>
              <p className="text-[11px] text-muted-foreground">{item.color} / {item.size}</p>
            </div>
            <span className="text-xs font-bold whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="space-y-2 text-sm border-t border-border pt-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Delivery{courierName ? ` (${courierName})` : ''}
          </span>
          <span>
            {!stateName || !deliveryFee
              ? <span className="text-muted-foreground text-xs">Select delivery</span>
              : formatPrice(deliveryFee)}
          </span>
        </div>
        <div className="flex justify-between border-t border-border pt-2 font-bold">
          <span>Total</span>
          <span className="text-lg">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Checkout() {
  // Cart state is read first, since the InitiateCheckout tracking call
  // below needs `items` and `subtotal` to build a meaningful payload.
  const { items, subtotal, clearCart } = useCart();

  useEffect(() => {
    if (items.length === 0) return;
    trackInitiateCheckout(items, subtotal);
    // Fires once on mount using cart state at that point — matches the
    // intent of "user started checkout with this cart", not a live feed
    // of every subsequent quantity change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [step,           setStep]           = useState(0);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState('');

  const [allStates,    setAllStates]    = useState([]);
  const [lgas,         setLgas]         = useState([]);
  const [wards,        setWards]        = useState([]);
  const [loadingLgas,  setLoadingLgas]  = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // Live Shipbubble rates for the current address + cart.
  const [couriers,        setCouriers]        = useState([]);
  const [selectedCourier, setSelectedCourier]  = useState(null);
  const [requestToken,    setRequestToken]     = useState(null);
  const [loadingRates,    setLoadingRates]     = useState(false);

  const [form, setForm] = useState({
    firstName: '', lastName: '',
    email: '',    phone: '',
    address: '',  stateCode: '',
    state: '',    lga: '',  ward: '',
  });

  // Referral code captured earlier in the visit (see ReferralCapture.jsx),
  // read once when the checkout page mounts.
  const [referralCode] = useState(() => getStoredReferral());

  // ── Derived totals ──────────────────────────────────────────────────────────
  const deliveryFee = selectedCourier?.delivery_price || 0;
  const total = subtotal + deliveryFee;

  // ── Data fetching ───────────────────────────────────────────────────────────
  useEffect(() => {
    deliveryApi.states()
      .then((r) => setAllStates(Array.isArray(r.data) ? r.data : []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!form.stateCode) return;
    setLgas([]); setWards([]); setLoadingLgas(true);
    deliveryApi.lgas(form.stateCode)
      .then((r) => setLgas(Array.isArray(r.data) ? r.data : []))
      .catch(console.error)
      .finally(() => setLoadingLgas(false));
  }, [form.stateCode]);

  useEffect(() => {
    if (!form.stateCode || !form.lga) return;
    setWards([]); setLoadingWards(true);
    deliveryApi.wards(form.stateCode, form.lga)
      .then((r) => setWards(Array.isArray(r.data) ? r.data : []))
      .catch(console.error)
      .finally(() => setLoadingWards(false));
  }, [form.stateCode, form.lga]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleFieldChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleStateChange = (e) => {
    const selected = allStates.find((s) => s.alias === e.target.value);
    setForm((prev) => ({
      ...prev,
      stateCode: e.target.value,
      state:     selected?.name || '',
      lga: '', ward: '',
    }));
  };

  const handleLgaChange = (e) =>
    setForm((prev) => ({ ...prev, lga: e.target.value, ward: '' }));

  const handleContactContinue = async () => {
    const { firstName, email, phone, address, stateCode, lga, state } = form;
    if (!firstName || !email || !phone || !address || !stateCode || !lga) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setLoadingRates(true);
    // Reset any previously selected courier since the address may have changed.
    setSelectedCourier(null);

    try {
      const { data } = await deliveryApi.rates({
        customer: {
          name:    `${form.firstName} ${form.lastName}`.trim(),
          email:   form.email,
          phone:   form.phone,
          address: `${address}, ${form.ward}, ${lga}, ${state}, Nigeria`,
        },
        items: items.map((item) => ({
          product_name: item.name,
          quantity:     item.quantity,
          unit_price:   item.price,
        })),
      });

      setCouriers(data.couriers || []);
      setRequestToken(data.request_token || null);
      setStep(1);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        'Could not fetch delivery rates for this address. Please check the address and try again.'
      );
    } finally {
      setLoadingRates(false);
    }
  };

  const handlePlaceOrder = async () => {
    setError('');
    setLoading(true);
    try {
      const { data: order } = await ordersApi.place({
        customer_name:    `${form.firstName} ${form.lastName}`.trim(),
        customer_email:   form.email,
        customer_phone:   form.phone,
        delivery_address: `${form.address}, ${form.ward}, ${form.lga}, ${form.state}`,
        delivery_state:   form.state,
        payment_method:   'card',
        delivery_method:  selectedCourier?.courier_name,
        delivery_fee:     deliveryFee,
        // Shipbubble shipment info — backend saves these so it can create
        // the actual shipment/label after payment is confirmed.
        shipping: {
          request_token: requestToken,
          courier_id:    selectedCourier?.courier_id,
          service_code:  selectedCourier?.service_code,
        },
        // Meta browser cookies — forwarded so the backend can attach them
        // to the server-side Conversions API Purchase event later, once
        // payment is confirmed (better match quality + dedup vs Pixel).
        fbp: getCookie('_fbp'),
        fbc: getCookie('_fbc'),
        ...(referralCode && { affiliate_code: referralCode }),
        items: items.map((item) => ({
          product_id:   item.id,
          product_name: item.name,
          size:         item.size,
          color:        item.color,
          quantity:     item.quantity,
          unit_price:   item.price,
        })),
      });

      let redirectUrl = order.paystack_url;

      if (!redirectUrl) {
        const { data: payment } = await paymentsApi.initialize(order.order_number);
        redirectUrl = payment.authorization_url;
      }

      clearCart();
      window.location.href = redirectUrl;
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Something went wrong.');
      setLoading(false);
    }
  };

  // ── Empty cart guard ────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Link to="/shop" className="mt-4 inline-block underline text-sm">Continue Shopping</Link>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Checkout</h1>
      <StepIndicator currentStep={step} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {step === 0 && (
            <ContactStep
              form={form}
              allStates={allStates}
              lgas={lgas}
              wards={wards}
              loadingLgas={loadingLgas}
              loadingWards={loadingWards}
              loadingRates={loadingRates}
              onFieldChange={handleFieldChange}
              onStateChange={handleStateChange}
              onLgaChange={handleLgaChange}
              onContinue={handleContactContinue}
              error={error}
            />
          )}
          {step === 1 && (
            <DeliveryMethodStep
              couriers={couriers}
              selectedCourier={selectedCourier}
              onSelect={setSelectedCourier}
              onBack={() => setStep(0)}
              onContinue={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <PaymentStep
              total={total}
              loading={loading}
              error={error}
              onBack={() => setStep(1)}
              onPlaceOrder={handlePlaceOrder}
              referralCode={referralCode}
            />
          )}
        </div>

        <div className="lg:col-span-1">
          <OrderSummary
            items={items}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            total={total}
            stateName={form.state}
            courierName={selectedCourier?.courier_name}
          />
        </div>
      </div>
    </div>
  );
}