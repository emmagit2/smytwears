import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const STORAGE_KEY = 'smyt_affiliate_ref';
const EXPIRY_DAYS = 30;

/**
 * Reads ?ref=CODE from the URL on every route change and stores it in
 * localStorage with an expiry, so it survives browsing around the site
 * even if the visitor doesn't buy on their first visit.
 *
 * Mount this once near the top of the app, inside <BrowserRouter>
 * (e.g. alongside <ScrollToTop /> in App.jsx), so it sees every route.
 */
export default function ReferralCapture() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    if (!ref) return;

    const record = {
      code:      ref.trim().toUpperCase(),
      expiresAt: Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch (err) {
      console.error('Failed to store affiliate referral:', err);
    }
  }, [location.search]);

  return null;
}

/**
 * Reads the stored referral code, if any and not expired.
 * Call this at checkout time to attach affiliate_code to the order.
 */
export function getStoredReferral() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const record = JSON.parse(raw);
    if (!record?.code || !record?.expiresAt) return null;

    if (Date.now() > record.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return record.code;
  } catch (err) {
    console.error('Failed to read affiliate referral:', err);
    return null;
  }
}