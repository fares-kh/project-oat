'use client';

import { useEffect, useState } from 'react';
import { getActivePromo, type PromoBanner as PromoBannerConfig } from '@/lib/promo-config';

export default function PromoBanner() {
  const [promo, setPromo] = useState<PromoBannerConfig | null>(null);

  // Evaluate on the client so time-based promos aren't baked in at build time.
  useEffect(() => {
    setPromo(getActivePromo());
  }, []);

  if (!promo) {
    return null;
  }

  return (
    <section className="w-full bg-brand-green py-6 md:py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {promo.headline}
            </h2>
            <p className="text-white/90 text-lg">{promo.body}</p>
          </div>
          <a
            href={promo.ctaHref}
            className="inline-flex shrink-0 items-center justify-center px-8 py-3 bg-white text-brand-green font-semibold rounded-lg hover:bg-brand-beige-light transition whitespace-nowrap"
          >
            {promo.ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
