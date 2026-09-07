# Ellie's Oats

Storefront and ordering site for Ellie's Oats Ltd — [elliesoats.co.uk](https://elliesoats.co.uk).

Customers pick delivery dates, build oat bowls, and pay through SumUp hosted
checkout. Orders are stored in Supabase and confirmed by email through Resend.
The client manages orders at `/admin`.

Built with Next.js 16 (App Router), React 19, Tailwind CSS v4 and TypeScript.

## Getting started

Requires Node 22 (see `.nvmrc`).

```bash
npm install
cp .env.example .env.local   # fill in values for anything you need to exercise
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Secrets are read when a request is handled, not at import, so `npm run build`,
`npm run typecheck` and `npm test` all work without a `.env.local`. A route
whose variable is missing returns a 500 naming it. You only need real values
for the flows you are actually testing.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve a production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint with autofix |
| `npm test` | Vitest, single run |
| `npm run test:watch` | Vitest in watch mode |
| `npm run format` | Prettier write |

Prettier is configured but has not been applied repo-wide, so `format` will
reformat files broadly. Run it deliberately rather than in passing.

## Environment variables

All are documented in `.env.example`. Use a SumUp **sandbox** merchant and a
separate Supabase project for anything that is not production.

| Variable | Used by |
| --- | --- |
| `NEXT_PUBLIC_BASE_URL` | SumUp redirect and webhook URLs |
| `SUMUP_API_KEY`, `SUMUP_MERCHANT_CODE` | Checkout creation, webhook verification |
| `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Order storage |
| `RESEND_KEY` | Customer and admin email |
| `ADMIN_PASSWORD` | `/admin` login |
| `ADMIN_API_SECRET` | Optional bearer access to the orders API |

## Layout

```
src/
  app/            # routes; api/ holds the route handlers
  components/     # Header, Footer, HeroVideo, SpecialCard, Menu*
  data/products   # catalogue: bowls, toppings, nutrition, allergens
  lib/            # env access, Supabase and Resend clients, delivery rules
  theme/          # MUI theme for the date picker
```

## How an order flows

1. `/order` validates the postcode and delivery dates against `lib/delivery-config`.
2. `POST /api/create-sumup-checkout` revalidates, writes a `pending` order to
   Supabase, and returns a SumUp hosted checkout URL.
3. The customer pays on SumUp and is redirected to `/order/confirmation`.
4. SumUp calls `POST /api/webhook/sumup`. The handler re-fetches the checkout
   from SumUp rather than trusting the payload, marks the order `paid`, and
   sends the customer and admin emails.
5. `/admin` lists paid orders, grouped by delivery date.

## Delivery rules

`src/lib/delivery-config.ts` owns postcode eligibility and date restrictions,
and is covered by `src/lib/delivery-config.test.ts`.

Standard delivery is Mondays and Wednesdays with a two-day lead time, extended
to three days after 2pm. OL12, OL13 and OL16 are fortnightly from 26 Aug 2026.

Note that the Monday/Wednesday rule and the cutoff are currently also
implemented separately in `src/app/order/page.tsx` and in the checkout route.
Change all three together until they are consolidated.

## Testing

```bash
npm test
```

Tests run with `TZ=Europe/London` so date cutoffs behave the same everywhere.

## Deployment

Deployed on Vercel. `main` is production. CI runs typecheck, lint, tests and a
build on every pull request, with no secrets, so a build that depends on one
fails in CI rather than in production.
