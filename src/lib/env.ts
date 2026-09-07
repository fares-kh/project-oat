/**
 * Environment access for server-side code.
 *
 * Values are read when a handler runs, never at module load, so the app can be
 * built and type-checked without credentials.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. See .env.example.`
    );
  }
  return value;
}

export function getSupabaseConfig() {
  return {
    url: required('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL),
    serviceRoleKey: required(
      'SUPABASE_SERVICE_ROLE_KEY',
      process.env.SUPABASE_SERVICE_ROLE_KEY
    ),
  };
}

export function getResendKey(): string {
  return required('RESEND_KEY', process.env.RESEND_KEY);
}

export function getSumUpConfig() {
  return {
    apiKey: required('SUMUP_API_KEY', process.env.SUMUP_API_KEY),
    merchantCode: required('SUMUP_MERCHANT_CODE', process.env.SUMUP_MERCHANT_CODE),
  };
}

export function getBaseUrl(): string {
  return required('NEXT_PUBLIC_BASE_URL', process.env.NEXT_PUBLIC_BASE_URL);
}
