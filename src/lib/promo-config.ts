export type PromoBanner = {
  id: string;
  enabled: boolean;
  startDate: string;
  endDate: string;
  headline: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
};

export const promoBanners: PromoBanner[] = [
  {
    id: 'manchester-half-marathon-2026',
    enabled: true,
    startDate: '2026-09-01',
    endDate: '2026-10-02',
    headline: 'Manchester Half Marathon fuel',
    body: 'Pre-order your oat bowls for delivery on Friday 2nd October. This is a special afternoon/evening delivery.',
    ctaLabel: 'Order for race day',
    ctaHref: '/order',
  },
];

function parseDateOnly(dateStr: string): Date {
  return new Date(`${dateStr}T12:00:00`);
}

function isPromoActive(promo: PromoBanner, today: Date): boolean {
  if (!promo.enabled) {
    return false;
  }

  const start = parseDateOnly(promo.startDate);
  const end = parseDateOnly(promo.endDate);
  return today >= start && today <= end;
}

export function getActivePromo(today: Date = new Date()): PromoBanner | null {
  return promoBanners.find((promo) => isPromoActive(promo, today)) ?? null;
}
