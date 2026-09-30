import { getSumupConfig } from '@/lib/sumup-client';

export type SumUpCheckout = {
  id: string;
  status: string;
  checkout_reference?: string;
  merchant_sandbox?: boolean;
};

export async function fetchSumUpCheckout(checkoutId: string): Promise<SumUpCheckout> {
  const { apiKey } = await getSumupConfig();

  const response = await fetch(`https://api.sumup.com/v0.1/checkouts/${checkoutId}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`SumUp checkout lookup failed (${response.status}): ${body}`);
  }

  return response.json();
}

export type SumUpAccountProfile = {
  merchant_code: string;
  sandbox: boolean;
  company_name: string;
};

/** Validate credentials and return merchant metadata for dev scripts. */
export async function fetchSumUpAccountProfile(): Promise<SumUpAccountProfile> {
  const { apiKey, merchantCode } = await getSumupConfig();

  const merchantResponse = await fetch(
    `https://api.sumup.com/v1/merchants/${merchantCode}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      cache: 'no-store',
    }
  );

  if (!merchantResponse.ok) {
    const body = await merchantResponse.text();
    throw new Error(`SumUp merchant lookup failed (${merchantResponse.status}): ${body}`);
  }

  const merchant = await merchantResponse.json();

  return {
    merchant_code: merchant.merchant_code,
    sandbox: Boolean(merchant.sandbox),
    company_name: merchant.company?.name ?? 'Unknown',
  };
}
