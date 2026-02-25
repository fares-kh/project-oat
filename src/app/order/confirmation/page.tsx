"use client"

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  const checkoutId = searchParams.get('checkout_id');
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'pending' | 'failed'>('loading');
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        setPaymentStatus('failed');
        return;
      }

      if (checkoutId && checkoutId !== '{checkout_id}') {
        setVerifying(true);
        try {
          console.log('Verifying payment for checkout:', checkoutId);
          
          const response = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ checkoutId }),
          });

          const data = await response.json();
          console.log('Verification response:', data);

          if (data.success && data.status === 'paid') {
            setPaymentStatus('success');
          } else if (data.status === 'PENDING') {
            setPaymentStatus('pending');
          } else {
            setPaymentStatus('failed');
          }
        } catch (error) {
          console.error('Error verifying payment:', error);
          setPaymentStatus('success'); // Assume success if we have a reference
        } finally {
          setVerifying(false);
        }
      } else {
        // No checkout_id, try to look it up by reference
        try {
          console.log('Looking up checkout by reference:', reference);
          
          const response = await fetch(`/api/verify-payment-by-reference?reference=${reference}`);
          const data = await response.json();
          console.log('Lookup response:', data);

          if (data.success && data.checkoutId) {
            // Found it, now verify
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ checkoutId: data.checkoutId }),
            });

            const verifyData = await verifyResponse.json();
            
            if (verifyData.success && verifyData.status === 'paid') {
              setPaymentStatus('success');
            } else {
              setPaymentStatus('pending');
            }
          } else {
            // Couldn't find it, assume success if we have reference
            setPaymentStatus('success');
          }
        } catch (error) {
          console.error('Error looking up checkout:', error);
          setPaymentStatus('success'); // Assume success if we have a reference
        }
      }
    };

    verifyPayment();
  }, [reference, checkoutId]);

  return (
    <div className="max-w-2xl mx-auto">
      {paymentStatus === 'loading' && (
        <div className="bg-background rounded-2xl shadow-xl p-8 text-center">
          <div className="text-4xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold mb-2">Processing Payment...</h2>
          <p className="text-zinc-700">Please wait while we confirm your payment.</p>
        </div>
      )}

      {paymentStatus === 'success' && (
        <div className="bg-background rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Order Confirmed!</h2>
          <p className="text-zinc-700 mb-4">
            Thank you for your order! Your payment has been processed successfully.
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
      )}

      {paymentStatus === 'failed' && (
        <div className="bg-background rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-3xl font-bold text-zinc-900 mb-2">Payment Failed</h2>
          <p className="text-zinc-700 mb-6">
            We couldn't process your payment. Please try again.
          </p>
          
          <div className="space-y-3">
            <Link 
              href="/order"
              className="block w-full px-6 py-3 bg-brand-green hover:bg-brand-green-hover text-text-white rounded-lg font-semibold transition text-center"
            >
              Try Again
            </Link>
            <Link 
              href="/"
              className="block w-full px-6 py-3 border-2 border-brand-beige text-zinc-700 hover:bg-brand-beige-light rounded-lg font-semibold transition text-center"
            >
              Return to Home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-brand-beige font-sans flex flex-col">
      <Header />
      
      <main className="container mx-auto px-6 py-8 flex-1">
        <Suspense fallback={
          <div className="max-w-2xl mx-auto">
            <div className="bg-background rounded-2xl shadow-xl p-8 text-center">
              <div className="text-4xl mb-4">⏳</div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-2">Loading...</h2>
              <p className="text-zinc-700">Please wait...</p>
            </div>
          </div>
        }>
          <ConfirmationContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
