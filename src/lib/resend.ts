import { Resend } from 'resend';
import { getResendKey } from './env';

let client: Resend | null = null;

export function getResend(): Resend {
  if (!client) {
    client = new Resend(getResendKey());
  }

  return client;
}
