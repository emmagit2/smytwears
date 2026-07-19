import React from 'react';
import paystackImg from '@/assets/paystack.png';
import verveImg from '@/assets/verve.png';
import mastercardImg from '@/assets/mastercard.png';

// Paystack "P" icon
export function PaystackLogo({ className = '', height = 'h-6' }) {
  return (
    <img
      src={paystackImg}
      alt="Paystack"
      className={`${height} w-auto object-contain ${className}`}
    />
  );
}

// Verve card logo (own container)
export function VerveLogo({ className = '', height = 'h-7' }) {
  return (
    <img
      src={verveImg}
      alt="Verve"
      className={`${height} w-auto object-contain ${className}`}
    />
  );
}

// Mastercard logo
export function MastercardLogo({ className = '', height = 'h-7' }) {
  return (
    <img
      src={mastercardImg}
      alt="Mastercard"
      className={`${height} w-auto object-contain ${className}`}
    />
  );
}

// Full trust strip — used on Home page
export default function PaymentLogos({ className = '' }) {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <span className="text-xs uppercase tracking-[0.25em] font-medium text-muted-foreground">
        Trusted &amp; Secure Payments
      </span>
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
        <PaystackLogo height="h-7" />
        <div className="h-7 w-px bg-border" />
        <VerveLogo />
        <div className="h-7 w-px bg-border" />
        <MastercardLogo />
      </div>
    </div>
  );
}