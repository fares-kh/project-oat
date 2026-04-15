"use client"

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');

  if (!reference) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-background rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-3xl font-bold text-zinc-900 mb-2">No Order Found</h2>
          <p className="text-zinc-700 mb-6">
            We couldn't find your order reference. Please contact us if you need assistance.
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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-background rounded-2xl shadow-xl p-8 text-center">
        <div className="text-4xl mb-4">✅</div>
        <h2 className="text-3xl font-bold mb-2">Payment Confirmed!</h2>
        <p className="text-zinc-700 mb-4">
          Thank you for your order! You'll receive a confirmation email shortly.
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
