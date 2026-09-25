#!/usr/bin/env node
/**
 * Validate SumUp sandbox credentials from .env.local.
 *
 * Usage:
 *   npm run sumup:verify
 *
 * Requires SUMUP_API_KEY and SUMUP_MERCHANT_CODE in .env.local.
 */

const apiKey = process.env.SUMUP_API_KEY;
const merchantCode = process.env.SUMUP_MERCHANT_CODE;

if (!apiKey) {
  console.error('Missing SUMUP_API_KEY. Copy .env.example to .env.local and fill it in.');
  process.exit(1);
}

async function main() {
  const meRes = await fetch('https://api.sumup.com/v0.1/me', {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!meRes.ok) {
    console.error('SumUp /me failed:', meRes.status, await meRes.text());
    process.exit(1);
  }

  const me = await meRes.json();
  const profileCode = me?.merchant_profile?.merchant_code;

  const merchantRes = await fetch(
    `https://api.sumup.com/v1/merchants/${profileCode ?? merchantCode}`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );

  if (!merchantRes.ok) {
    console.error('SumUp merchant lookup failed:', merchantRes.status, await merchantRes.text());
    process.exit(1);
  }

  const merchant = await merchantRes.json();

  console.log('\nSumUp credentials look valid.\n');
  console.log('  Account:       ', me?.account?.username ?? '(unknown)');
  console.log('  Merchant code: ', merchant.merchant_code);
  console.log('  Company:       ', merchant.company?.name ?? '(unknown)');
  console.log('  Sandbox:       ', merchant.sandbox ? 'yes (test mode)' : 'NO — live merchant');
  console.log('  Env code match:', merchantCode === merchant.merchant_code ? 'yes' : 'NO');

  if (merchantCode && merchantCode !== merchant.merchant_code) {
    console.error(
      `\nSUMUP_MERCHANT_CODE in .env.local (${merchantCode}) does not match the key (${merchant.merchant_code}).`
    );
    process.exit(1);
  }

  if (!merchant.sandbox) {
    console.warn('\nWarning: this is a LIVE merchant. Use a sandbox key for local E2E testing.');
  }

  console.log('\nNext: npm run dev, place an order, pay with test card 4200 0000 0000 0091.');
  console.log('On localhost the confirmation page syncs payment even without a webhook.\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
