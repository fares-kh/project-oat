/**
 * SumUp credential helper.
 *
 * Set SUMUP_SANDBOX_MODE=true to route checkouts to the sandbox merchant
 * (mock payments, no real money). Sandbox vs live is determined by merchant
 * code and which API key is used.
 *
 * Merchant code is auto-resolved from the SumUp memberships API when not set.
 */

const PLACEHOLDER = /^your_.*_here$/i;

function isSandboxMode(): boolean {
  return process.env.SUMUP_SANDBOX_MODE === 'true';
}

function isPlaceholder(value: string | undefined): boolean {
  return !value || PLACEHOLDER.test(value);
}

function getApiKey(): string {
  if (isSandboxMode()) {
    const sandboxKey = process.env.SUMUP_SANDBOX_API_KEY;
    if (!isPlaceholder(sandboxKey)) return sandboxKey!;
  }
  return process.env.SUMUP_API_KEY!;
}

type Membership = {
  type: string;
  status: string;
  resource_id: string;
  resource?: {
    attributes?: {
      is_test_account?: boolean;
      merchant_code?: string;
    };
  };
};

let cachedConfig: { apiKey: string; merchantCode: string } | null = null;

async function resolveMerchantCode(apiKey: string): Promise<string> {
  const envCode = isSandboxMode()
    ? process.env.SUMUP_SANDBOX_MERCHANT_CODE
    : process.env.SUMUP_MERCHANT_CODE;

  if (!isPlaceholder(envCode)) return envCode!;

  const response = await fetch('https://api.sumup.com/v0.1/memberships', {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!response.ok) {
    throw new Error(
      `SumUp auth failed (${response.status}) — check your SumUp API key`
    );
  }

  const data = await response.json();
  const merchants: Membership[] = (data.items ?? []).filter(
    (m: Membership) => m.type === 'merchant' && m.status === 'accepted'
  );

  if (merchants.length === 0) {
    throw new Error('No SumUp merchant accounts found for this API key');
  }

  if (isSandboxMode()) {
    const testMerchant = merchants.find(
      (m) => m.resource?.attributes?.is_test_account === true
    );
    if (testMerchant) return testMerchant.resource_id;
    throw new Error(
      'No sandbox merchant found — create one at https://developer.sumup.com'
    );
  }

  const liveMerchant = merchants.find(
    (m) => !m.resource?.attributes?.is_test_account
  );
  return liveMerchant?.resource_id ?? merchants[0].resource_id;
}

export async function getSumupConfig(): Promise<{
  apiKey: string;
  merchantCode: string;
  isSandbox: boolean;
}> {
  const sandbox = isSandboxMode();
  const apiKey = getApiKey();

  if (!apiKey || isPlaceholder(apiKey)) {
    throw new Error(
      sandbox
        ? 'Missing SumUp sandbox API key — set SUMUP_SANDBOX_API_KEY in .env.local'
        : 'Missing SumUp API key — set SUMUP_API_KEY'
    );
  }

  if (!cachedConfig || cachedConfig.apiKey !== apiKey) {
    const merchantCode = await resolveMerchantCode(apiKey);
    cachedConfig = { apiKey, merchantCode };
    console.log(
      `SumUp: using ${sandbox ? 'SANDBOX' : 'LIVE'} merchant ${merchantCode}`
    );
  }

  return { ...cachedConfig!, isSandbox: sandbox };
}
