"use client"

import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

type PaymentStatus = 'loading' | 'paid' | 'pending' | 'failed' | 'missing';

type SyncResponse = {
  success?: boolean;
  status?: 'paid' | 'pending' | 'failed' | 'not_found';
  reference?: string;
  synced?: boolean;
  error?: string;
};

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('loading');
  const [syncError, setSyncError] = useState<string | null>(null);

  const syncPayment = useCallback(async (): Promise<PaymentStatus> => {
    if (!reference) {
      return 'missing';
    }

    try {
      const response = await fetch(
        `/api/sync-order-payment?reference=${encodeURIComponent(reference)}`
      );
      const data: SyncResponse = await response.json();

      if (response.status === 404) {
        return 'missing';
      }

      if (!response.ok) {
        setSyncError(data.error ?? 'Unable to verify payment');
        return 'pending';
      }

      setSyncError(null);

      if (data.status === 'paid') {
        return 'paid';
      }

      if (data.status === 'failed') {
        return 'failed';
      }

      return 'pending';
    } catch {
      setSyncError('Unable to reach the server. Please refresh in a moment.');
      return 'pending';
    }
  }, [reference]);

  useEffect(() => {
    if (!reference) {
      return;
    }

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 8;

    const run = async () => {
      const status = await syncPayment();
      if (cancelled) {
        return;
      }

      setPaymentStatus(status);

      if (status === 'pending' && attempts < maxAttempts) {
        attempts += 1;
        window.setTimeout(run, 2000);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [reference, syncPayment]);

  if (paymentStatus === 'missing' || !reference) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-background rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-3xl font-bold text-zinc-900 mb-2">No Order Found</h2>
          <p className="text-zinc-700 mb-6">
            We couldn&apos;t find your order reference. Please contact us if you need assistance.
          </p>
          <Link
            href="/order"
            className="block w-full px-6 py-3 bg-brand-green hover:bg-brand-green-hover text-text-white rounded-lg font-semibold transition text-center"
          >
            Place New Order
          </Link>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'loading' || paymentStatus === 'pending') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-background rounded-2xl shadow-xl p-8 text-center">
          <div className="text-4xl mb-4">⏳</div>
          <h2 className="text-3xl font-bold mb-2">
            {paymentStatus === 'loading' ? 'Confirming payment…' : 'Payment processing…'}
          </h2>
          <p className="text-zinc-700 mb-4">
            {paymentStatus === 'loading'
              ? 'Checking your payment with our payment provider.'
              : 'Your payment is still being confirmed. This usually takes a few seconds.'}
          </p>
          <div className="bg-brand-beige-light rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold mb-2">Order Reference:</h3>
            <p className="font-mono text-brand-green text-lg">{reference}</p>
          </div>
          {syncError && <p className="text-sm text-brand-error mb-4">{syncError}</p>}
          <button
            type="button"
            onClick={() => {
              setPaymentStatus('loading');
              void syncPayment().then(setPaymentStatus);
            }}
            className="w-full px-6 py-3 border-2 border-brand-green text-brand-green hover:bg-brand-beige-light rounded-lg font-semibold transition"
          >
            Check again
          </button>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-background rounded-2xl shadow-xl p-8 text-center">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-3xl font-bold mb-2">Payment Not Completed</h2>
          <p className="text-zinc-700 mb-4">
            Your payment was not successful. You have not been charged for this order.
          </p>
          <div className="bg-brand-beige-light rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold mb-2">Order Reference:</h3>
            <p className="font-mono text-brand-green text-lg">{reference}</p>
          </div>
          <Link
            href="/order"
            className="block w-full px-6 py-3 bg-brand-green hover:bg-brand-green-hover text-text-white rounded-lg font-semibold transition text-center"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-background rounded-2xl shadow-xl p-8 text-center">
        <div className="text-4xl mb-4">✅</div>
        <h2 className="text-3xl font-bold mb-2">Payment Confirmed!</h2>
        <p className="text-zinc-700 mb-4">
          Thank you for your order! You&apos;ll receive a confirmation email shortly.
        </p>

        <div className="bg-brand-beige-light rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold mb-2">Order Reference:</h3>
          <p className="font-mono text-brand-green text-lg">{reference}</p>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-brand-green hover:bg-brand-green-hover text-text-white rounded-lg font-semibold transition text-center"
          >
            Return to Home
          </Link>
          <Link
            href="/order"
            className="block w-full px-6 py-3 border-2 border-brand-green text-brand-green hover:bg-brand-beige-light rounded-lg font-semibold transition text-center"
          >
            Place Another Order
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-brand-beige font-sans flex flex-col">
      <Header />

      <main className="container mx-auto px-6 py-8 flex-1">
        <Suspense
          fallback={
            <div className="max-w-2xl mx-auto">
              <div className="bg-background rounded-2xl shadow-xl p-8 text-center">
                <div className="text-4xl mb-4">⏳</div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">Loading...</h2>
                <p className="text-zinc-700">Please wait...</p>
              </div>
            </div>
          }
        >
          <ConfirmationContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
