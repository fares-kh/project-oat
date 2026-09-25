# End-to-end payment testing

This guide aligns with the **ENV** and **SEC4** roadmap items: sandbox credentials,
payment sync on the confirmation page, and (optionally) a public URL for webhooks.

## What you need

| Item | Local dev | Deployed preview / dev |
| --- | --- | --- |
| SumUp sandbox API key | `.env.local` | Vercel Preview env |
| `SUMUP_MERCHANT_CODE` | `.env.local` | Vercel Preview env |
| Dev Supabase project | `.env.local` | Vercel Preview env |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` | `https://dev.elliesoats.co.uk` or preview URL |
| Webhook delivery | **Not required** — confirmation page syncs | SumUp POSTs to `/api/webhook/sumup` |
| Resend | Optional — set `SKIP_ORDER_EMAILS=true` | Real key or skip |

**Never use production SumUp or production Supabase for E2E testing.**

## 1. Configure `.env.local`

```bash
cp .env.example .env.local
```

Minimum for a checkout + paid order on localhost:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
SUMUP_API_KEY=<sandbox key from SumUp Developer Settings>
SUMUP_MERCHANT_CODE=<sandbox merchant code, e.g. MMRYG1JG>
NEXT_PUBLIC_SUPABASE_URL=<dev project>
SUPABASE_SERVICE_ROLE_KEY=<dev service role>
ADMIN_PASSWORD=dev
SKIP_ORDER_EMAILS=true
```

Verify SumUp credentials:

```bash
npm run sumup:verify
```

You should see `Sandbox: yes (test mode)` and `Env code match: yes`.

## 2. Run the app

```bash
npm install
npm run dev
```

Open http://localhost:3000/order and complete an order.

## 3. Pay with a sandbox card

| Field | Value |
| --- | --- |
| Card | `4200 0000 0000 0091` (Visa, success) |
| Expiry | Any future date, e.g. `12/30` |
| CVV | Any 3 digits |
| Name | Anything |

To test a **decline**, use order total **£11.00** (SumUp sandbox failure amount).

## 4. What should happen

1. Checkout creates a `pending` row in Supabase.
2. You pay on SumUp hosted checkout.
3. SumUp redirects to `/order/confirmation?reference=OAT-...`.
4. The confirmation page calls `GET /api/sync-order-payment?reference=...`.
5. The server asks SumUp for checkout status and sets the row to **`paid`**.
6. `/admin` shows the order (after login).

### Why localhost works without a webhook

SumUp cannot POST to `http://localhost:3000/api/webhook/sumup`. The confirmation
page **sync fallback** (SEC4) reconciles with SumUp directly when the customer
returns, so E2E on localhost is seamless.

On **deployed** dev/preview, both paths work: webhook (primary) and confirmation
sync (fallback if webhook is slow or missed).

## 5. Deployed dev (recommended for full webhook test)

When `dev.elliesoats.co.uk` is set up (ENV epic):

1. Point the domain at the `develop` branch in Vercel.
2. Set Preview env vars with sandbox credentials and
   `NEXT_PUBLIC_BASE_URL=https://dev.elliesoats.co.uk`.
3. Register webhook URL in SumUp sandbox dashboard if required (return_url is
   set automatically on each checkout).
4. Protect the site (Vercel Auth or Basic Auth) but **exclude**
   `/api/webhook/sumup` from the gate.

## 6. Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| Stays `pending` after confirmation | Missing/wrong `SUMUP_API_KEY`; check browser Network tab for `/api/sync-order-payment` |
| Checkout creation 500 | Missing env var — response names the variable |
| `sumup:verify` code mismatch | `SUMUP_MERCHANT_CODE` does not match the sandbox key |
| Paid on SumUp, not in admin | Row still `pending` — hit confirmation URL again or call sync API manually |
| Emails fail locally | Set `SKIP_ORDER_EMAILS=true` or add `RESEND_KEY` |

Manual sync for a reference:

```bash
curl "http://localhost:3000/api/sync-order-payment?reference=OAT-..."
```

## 7. Security reminders

- Rotate any API key that was pasted into chat, email, or Trello.
- Do not commit `.env.local`.
- Use a separate Supabase project for dev; never test against production orders.
