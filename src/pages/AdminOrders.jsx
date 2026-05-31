import React, { useState, useEffect, useCallback } from 'react';
import { Search, Eye, X, Check, Truck, Package, Clock, XCircle, RefreshCw, AlertCircle, ChevronDown } from 'lucide-react';
import { ordersApi } from '@/api/apiClient';
import { formatPrice } from '@/data/products';

const statusConfig = {
  pending:          { label: 'Pending',          classes: 'bg-yellow-50 text-yellow-700',  icon: Clock },
  processing:       { label: 'Processing',       classes: 'bg-blue-50 text-blue-700',      icon: Package },
  confirmed:        { label: 'Confirmed',        classes: 'bg-indigo-50 text-indigo-700',  icon: Check },
  shipped:          { label: 'Shipped',          classes: 'bg-purple-50 text-purple-700',  icon: Truck },
  out_for_delivery: { label: 'Out for Delivery', classes: 'bg-orange-50 text-orange-700',  icon: Truck },
  delivered:        { label: 'Delivered',        classes: 'bg-green-50 text-green-700',    icon: Check },
  cancelled:        { label: 'Cancelled',        classes: 'bg-red-50 text-red-700',        icon: XCircle },
};

const VALID_STATUSES = ['confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];
const paymentLabels  = { bank_transfer: 'Bank Transfer', card: 'Card', pay_on_delivery: 'Pay on Delivery' };

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = statusConfig[status] ?? { label: status, classes: 'bg-gray-50 text-gray-700' };
  return (
    <span className={`text-xs px-2.5 py-1 font-semibold uppercase tracking-wider ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="bg-background border border-border p-4">
      <div className="w-8 h-0.5 bg-foreground mb-3" />
      <p className="text-xl font-black">{value}</p>
      <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1 font-medium">{label}</p>
    </div>
  );
}

// ─── Order Detail Modal ───────────────────────────────────────────────────────

function OrderModal({ order, onClose, onStatusUpdated }) {
  const [newStatus, setNewStatus]       = useState('');
  const [trackingInfo, setTrackingInfo] = useState('');
  const [paymentRef, setPaymentRef]     = useState('');
  const [updatingStatus,   setUpdatingStatus]   = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [statusError,   setStatusError]   = useState('');
  const [paymentError,  setPaymentError]  = useState('');
  const [statusSuccess, setStatusSuccess] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState('');

  const handleUpdateStatus = async () => {
    if (!newStatus) return;
    setUpdatingStatus(true);
    setStatusError('');
    setStatusSuccess('');
    try {
      await ordersApi.updateStatus({
        order_id:     order.id,
        status:       newStatus,
        ...(trackingInfo && { tracking_info: trackingInfo }),
      });
      setStatusSuccess(`Status updated to ${statusConfig[newStatus]?.label ?? newStatus}`);
      setNewStatus('');
      setTrackingInfo('');
      onStatusUpdated();
    } catch (err) {
      setStatusError(err?.response?.data?.error ?? 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!paymentRef.trim()) return;
    setConfirmingPayment(true);
    setPaymentError('');
    setPaymentSuccess('');
    try {
      await ordersApi.confirmPayment({ order_id: order.id, payment_reference: paymentRef.trim() });
      setPaymentSuccess('Payment confirmed — order marked as confirmed');
      setPaymentRef('');
      onStatusUpdated();
    } catch (err) {
      setPaymentError(err?.response?.data?.error ?? 'Failed to confirm payment');
    } finally {
      setConfirmingPayment(false);
    }
  };

  const items         = Array.isArray(order.items) ? order.items : [];
  const showPaymentOp = order.payment_method === 'bank_transfer' && order.payment_status !== 'paid';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-background w-full max-w-lg border border-border max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-background z-10">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Order Details</p>
            <p className="font-black text-lg tracking-widest font-mono">{order.order_number ?? order.id}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status row */}
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Status</span>
            <StatusBadge status={order.status} />
          </div>

          {/* Payment status */}
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Payment</span>
            <span className={`text-xs px-2.5 py-1 font-semibold uppercase tracking-wider ${
              order.payment_status === 'paid'
                ? 'bg-green-50 text-green-700'
                : 'bg-yellow-50 text-yellow-700'
            }`}>
              {order.payment_status ?? 'Pending'}
            </span>
          </div>

          {/* Customer */}
          <div className="bg-secondary p-4 space-y-1.5">
            <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-2">Customer</p>
            <p className="font-bold">{order.customer_name}</p>
            <p className="text-sm text-muted-foreground">{order.customer_email}</p>
            <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
            <p className="text-sm text-muted-foreground">
              {order.delivery_address}, {order.delivery_state}
            </p>
          </div>

          {/* Items */}
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-3">Items Ordered</p>
            <div className="space-y-3">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between items-start border-b border-border pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-semibold">{item.product_name ?? item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.color ?? ''}{item.color && item.size ? ' / ' : ''}{item.size ?? ''} × {item.quantity ?? item.qty ?? 1}
                    </p>
                  </div>
                  <p className="font-bold text-sm whitespace-nowrap ml-4">
                    {formatPrice((item.unit_price ?? item.price ?? 0) * (item.quantity ?? item.qty ?? 1))}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-2 border-t border-border pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(order.subtotal ?? 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery</span>
              <span>
                {(order.delivery_fee ?? 0) === 0
                  ? <span className="text-green-600 font-semibold">FREE</span>
                  : formatPrice(order.delivery_fee)}
              </span>
            </div>
            <div className="flex justify-between font-black text-base border-t border-border pt-2">
              <span>Total</span>
              <span>{formatPrice(order.total ?? 0)}</span>
            </div>
          </div>

          {/* Payment method */}
          <div className="flex justify-between items-center text-sm border-t border-border pt-4">
            <span className="text-muted-foreground">Payment Method</span>
            <span className="font-semibold">{paymentLabels[order.payment_method] ?? order.payment_method}</span>
          </div>

          {/* ── Confirm Bank Transfer ─────────────────────────────────────── */}
          {showPaymentOp && (
            <div className="border border-border p-4 space-y-3">
              <p className="text-xs uppercase tracking-widest font-bold">Confirm Bank Transfer</p>
              <input
                value={paymentRef}
                onChange={e => setPaymentRef(e.target.value)}
                placeholder="Payment reference / transaction ID"
                className="w-full border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-foreground"
              />
              {paymentError   && <p className="text-xs text-red-600">{paymentError}</p>}
              {paymentSuccess && <p className="text-xs text-green-600">{paymentSuccess}</p>}
              <button
                onClick={handleConfirmPayment}
                disabled={confirmingPayment || !paymentRef.trim()}
                className="w-full bg-foreground text-background py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-foreground/90 transition-colors disabled:opacity-40"
              >
                {confirmingPayment ? 'Confirming…' : 'Confirm Payment'}
              </button>
            </div>
          )}

          {/* ── Update Status ─────────────────────────────────────────────── */}
          <div className="border border-border p-4 space-y-3">
            <p className="text-xs uppercase tracking-widest font-bold">Update Status</p>
            <div className="relative">
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
                className="w-full appearance-none border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-foreground pr-8 bg-background"
              >
                <option value="">— Select new status —</option>
                {VALID_STATUSES.map(s => (
                  <option key={s} value={s}>{statusConfig[s]?.label ?? s}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            <input
              value={trackingInfo}
              onChange={e => setTrackingInfo(e.target.value)}
              placeholder="Tracking info / notes (optional)"
              className="w-full border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-foreground"
            />
            {statusError   && <p className="text-xs text-red-600">{statusError}</p>}
            {statusSuccess && <p className="text-xs text-green-600">{statusSuccess}</p>}
            <button
              onClick={handleUpdateStatus}
              disabled={updatingStatus || !newStatus}
              className="w-full border border-foreground text-foreground py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-foreground hover:text-background transition-colors disabled:opacity-40"
            >
              {updatingStatus ? 'Updating…' : 'Update Status'}
            </button>
          </div>

          {/* Contact actions */}
          <div className="flex gap-3 pt-2 border-t border-border">
            <a
              href={`mailto:${order.customer_email}?subject=Your SMYT Order ${order.order_number ?? order.id}`}
              className="flex-1 text-center border border-border py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-muted transition-colors"
            >
              Email Customer
            </a>
            <a
              href={`https://wa.me/234${order.customer_phone?.replace(/^0/, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center bg-foreground text-background py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-foreground/90 transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminOrders() {
  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [query, setQuery]             = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected]       = useState(null);
  const [page, setPage]               = useState(1);
  const [totalCount, setTotalCount]   = useState(0);
  const LIMIT = 20;

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: LIMIT };
      if (statusFilter !== 'all') params.status = statusFilter;
      const res = await ordersApi.list(params);
      setOrders(res.data.orders ?? []);
      setTotalCount(res.data.total ?? 0);
    } catch (err) {
      setError(err?.response?.data?.error ?? 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Reset to page 1 when filter changes
  useEffect(() => { setPage(1); }, [statusFilter]);

  const handleStatusUpdated = useCallback(() => {
    fetchOrders();
    // Re-fetch the selected order to reflect latest state
    if (selected) {
      ordersApi.get(selected.id)
        .then(res => setSelected(res.data))
        .catch(() => {});
    }
  }, [fetchOrders, selected]);

  // Client-side search filter (by order_number or customer_name)
  const filtered = orders.filter(o => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      (o.order_number ?? '').toLowerCase().includes(q) ||
      (o.customer_name ?? '').toLowerCase().includes(q)
    );
  });

  // Summary stats derived from current page (real totals would need a summary endpoint)
  const deliveredCount   = orders.filter(o => o.status === 'delivered').length;
  const processingCount  = orders.filter(o => o.status === 'processing').length;
  const pageRevenue      = orders.reduce((sum, o) => sum + (o.total ?? 0), 0);

  const totalPages = Math.ceil(totalCount / LIMIT);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard label="Total Orders"  value={totalCount} />
        <SummaryCard label="Delivered"     value={deliveredCount} />
        <SummaryCard label="Processing"    value={processingCount} />
        <SummaryCard label="Page Revenue"  value={formatPrice(pageRevenue)} />
      </div>

      {/* Toolbar */}
      <div className="bg-background border border-border p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by order ID or customer…"
            className="w-full border border-border pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-foreground"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {['all', ...Object.keys(statusConfig)].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 text-xs uppercase tracking-wider font-semibold transition-colors ${
                statusFilter === status
                  ? 'bg-foreground text-background'
                  : 'border border-border hover:bg-muted'
              }`}
            >
              {status === 'all' ? 'All' : (statusConfig[status]?.label ?? status)}
            </button>
          ))}
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="ml-auto flex items-center gap-1.5 border border-border px-3 py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-muted transition-colors disabled:opacity-40"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
          <button onClick={fetchOrders} className="ml-auto text-xs underline font-semibold">Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-background border border-border overflow-x-auto">
        {loading && orders.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">Loading orders…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">No orders found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary">
                {['Order', 'Customer', 'Date', 'Payment', 'Total', 'Status', ''].map((h, i) => (
                  <th
                    key={h + i}
                    className={`text-left px-4 py-3 text-xs uppercase tracking-widest font-semibold text-muted-foreground
                      ${h === 'Customer' ? 'hidden sm:table-cell' : ''}
                      ${h === 'Date'    ? 'hidden md:table-cell' : ''}
                      ${h === 'Payment' ? 'hidden lg:table-cell' : ''}
                      ${h === ''        ? 'text-right' : ''}
                    `}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="px-4 py-4">
                    <p className="font-bold text-xs font-mono">{order.order_number ?? order.id}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {Array.isArray(order.items) ? order.items.length : '?'} item{(Array.isArray(order.items) && order.items.length !== 1) ? 's' : ''}
                    </p>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <p className="text-sm text-muted-foreground">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('en-NG') : '—'}
                    </p>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <p className="text-xs">{paymentLabels[order.payment_method] ?? order.payment_method}</p>
                    <p className={`text-xs mt-0.5 font-semibold ${
                      order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {order.payment_status ?? 'pending'}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-bold">{formatPrice(order.total ?? 0)}</p>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => setSelected(order)}
                      className="w-8 h-8 inline-flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            Page {page} of {totalPages} &mdash; {totalCount} orders
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="px-4 py-2 border border-border text-xs uppercase tracking-wider font-semibold hover:bg-muted transition-colors disabled:opacity-40"
            >
              Prev
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
              className="px-4 py-2 border border-border text-xs uppercase tracking-wider font-semibold hover:bg-muted transition-colors disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selected && (
        <OrderModal
          order={selected}
          onClose={() => setSelected(null)}
          onStatusUpdated={handleStatusUpdated}
        />
      )}
    </div>
  );
}