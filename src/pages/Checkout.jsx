import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { formatPrice, getProductImage } from '@/data/products';
import { ordersApi, paymentsApi, deliveryApi } from '@/api/apiClient';
import { ChevronRight, Check, Loader2 } from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = ['Contact & Delivery', 'Delivery Method', 'Payment'];
const FREE_DELIVERY_THRESHOLD = 50000;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const normalizeState = (name = '') => name.toLowerCase().trim();

const getBaseDeliveryFee = (stateName = '', subtotal = 0) => {
  if (subtotal >= FREE_DELIVERY_THRESHOLD) return 0;
  const s = normalizeState(stateName);
  if (s === 'lagos')                return 2500;
  if (s === 'fct' || s === 'abuja') return 3000;
  return 3500;
};

const getExpressSurcharge = (stateName = '') =>
  normalizeState(stateName) === 'lagos' ? 1200 : 2500;

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
  loadingLgas, loadingWards, baseDeliveryFee,
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
            disabled={!form.stateCode || loadingLgas}
            className={inputClass}
          >
            <option value="">Select LGA</option>
            {lgas.map((l) => (
              <option key={l.name} value={l.name}>{l.name}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Area / Ward" loading={loadingWards}>
          <select
            name="ward"
            value={form.ward}
            onChange={onFieldChange}
            disabled={!form.lga || loadingWards}
            className={inputClass}
          >
            <option value="">Select area (optional)</option>
            {wards.map((w) => (
              <option key={w.name} value={w.name}>{w.name}</option>
            ))}
          </select>
        </FormField>

      </div>

      {form.state && (
        <div className="mt-4 p-3 border border-border bg-secondary text-sm">
          <span className="text-muted-foreground">Estimated delivery to {form.state}: </span>
          <span className="font-semibold">
            {baseDeliveryFee === 0 ? '🎉 Free' : formatPrice(baseDeliveryFee)}
          </span>
        </div>
      )}

      <button
        onClick={onContinue}
        className="mt-6 bg-foreground text-background px-10 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-foreground/90 transition-colors"
      >
        Continue
      </button>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function DeliveryMethodStep({ deliveryMethod, baseDeliveryFee, expressSurcharge, onSelect, onBack, onContinue }) {
  const options = [
    {
      value: 'standard',
      label: 'Standard Delivery',
      desc:  '3–5 business days',
      price: baseDeliveryFee === 0 ? 'FREE' : formatPrice(baseDeliveryFee),
    },
    {
      value: 'express',
      label: 'Express Delivery',
      desc:  '1–2 business days',
      price: formatPrice(baseDeliveryFee + expressSurcharge),
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold mb-6">Delivery Method</h2>
      <div className="space-y-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`w-full flex items-center justify-between border p-5 text-left transition-colors ${
              deliveryMethod === opt.value
                ? 'border-foreground bg-secondary'
                : 'border-border hover:border-foreground/30'
            }`}
          >
            <div>
              <p className="text-sm font-semibold">{opt.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
            </div>
            <span className="text-sm font-bold">{opt.price}</span>
          </button>
        ))}
      </div>
      <div className="flex gap-3 mt-8">
        <button onClick={onBack}     className="border border-border px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-muted">Back</button>
        <button onClick={onContinue} className="bg-foreground text-background px-10 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-foreground/90">Continue</button>
      </div>
    </div>
  );
}

function PaymentStep({ total, loading, error, onBack, onPlaceOrder }) {
  return (
    <div>
      <h2 className="text-lg font-bold mb-6">Payment</h2>
      <div className="border border-border p-5 bg-secondary text-sm text-muted-foreground mb-6">
        <p className="font-semibold text-foreground mb-1">Pay securely via Paystack</p>
        <p>You'll be redirected to Paystack to complete your payment. All methods accepted — card, bank transfer, USSD, mobile money, and more.</p>
      </div>
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

function OrderSummary({ items, subtotal, deliveryFee, total, stateName }) {
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
          <span className="text-muted-foreground">Delivery</span>
          <span>
            {!stateName
              ? <span className="text-muted-foreground text-xs">Select state</span>
              : deliveryFee === 0
              ? <span className="text-green-600 font-semibold">FREE</span>
              : formatPrice(deliveryFee)}
          </span>
        </div>
        {subtotal >= FREE_DELIVERY_THRESHOLD && (
          <p className="text-xs text-green-600">🎉 Free delivery on orders above {formatPrice(FREE_DELIVERY_THRESHOLD)}</p>
        )}
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
  const { items, subtotal, clearCart } = useCart();

  const [step,           setStep]           = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState('');

  const [allStates,    setAllStates]    = useState([]);
  const [lgas,         setLgas]         = useState([]);
  const [wards,        setWards]        = useState([]);
  const [loadingLgas,  setLoadingLgas]  = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  const [form, setForm] = useState({
    firstName: '', lastName: '',
    email: '',    phone: '',
    address: '',  stateCode: '',
    state: '',    lga: '',  ward: '',
  });

  // ── Derived totals ──────────────────────────────────────────────────────────
  const baseDeliveryFee  = getBaseDeliveryFee(form.state, subtotal);
  const expressSurcharge = getExpressSurcharge(form.state);
  const deliveryFee      = deliveryMethod === 'express'
    ? baseDeliveryFee + expressSurcharge
    : baseDeliveryFee;
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

  const handleContactContinue = () => {
    const { firstName, email, phone, address, stateCode, lga } = form;
    if (!firstName || !email || !phone || !address || !stateCode || !lga) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setStep(1);
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
        delivery_method:  deliveryMethod,
        items: items.map((item) => ({
          product_id:   item.id,
          product_name: item.name,
          size:         item.size,
          color:        item.color,
          quantity:     item.quantity,
          unit_price:   item.price,
        })),
      });

      // orders.js already initializes Paystack and returns paystack_url.
      // Fall back to a separate /payments/initialize call only if it's missing
      // (e.g. Paystack was briefly unreachable when the order was placed).
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
              baseDeliveryFee={baseDeliveryFee}
              onFieldChange={handleFieldChange}
              onStateChange={handleStateChange}
              onLgaChange={handleLgaChange}
              onContinue={handleContactContinue}
              error={error}
            />
          )}
          {step === 1 && (
            <DeliveryMethodStep
              deliveryMethod={deliveryMethod}
              baseDeliveryFee={baseDeliveryFee}
              expressSurcharge={expressSurcharge}
              onSelect={setDeliveryMethod}
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
          />
        </div>
      </div>
    </div>
  );
}
