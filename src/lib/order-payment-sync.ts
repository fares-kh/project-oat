import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendOrderPaidEmails } from '@/lib/order-emails';
import { fetchSumUpCheckout } from '@/lib/sumup';

export type OrderPaymentStatus = 'paid' | 'pending' | 'failed' | 'not_found';

export type OrderPaymentSyncResult = {
  status: OrderPaymentStatus;
  reference?: string;
  /** True when this call changed the database row. */
  synced: boolean;
  sumupStatus?: string;
  /** Present while checkout is still open at SumUp (e.g. customer left without paying). */
  hostedCheckoutUrl?: string;
};

type OrderLookup = {
  id: string;
  checkout_reference: string;
  sumup_checkout_id: string;
  status: string;
};

async function loadOrderByCheckoutId(checkoutId: string): Promise<OrderLookup | null> {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('id, checkout_reference, sumup_checkout_id, status')
    .eq('sumup_checkout_id', checkoutId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

async function loadOrderByReference(reference: string): Promise<OrderLookup | null> {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('id, checkout_reference, sumup_checkout_id, status')
    .eq('checkout_reference', reference)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

function normalizeCheckoutId(id: string): string {
  return id.startsWith('c-') ? id.slice(2) : id;
}

function checkoutIdsMatch(a: string, b: string): boolean {
  return normalizeCheckoutId(a) === normalizeCheckoutId(b);
}

function hostedCheckoutUrl(checkout: { id: string; hosted_checkout_url?: string }): string {
  if (checkout.hosted_checkout_url) {
    return checkout.hosted_checkout_url;
  }
  const id = checkout.id.startsWith('c-') ? checkout.id : `c-${checkout.id}`;
  return `https://checkout.sumup.com/pay/${id}`;
}

function mapSumUpStatus(status: string): OrderPaymentStatus {
  if (status === 'PAID') {
    return 'paid';
  }

  if (status === 'FAILED' || status === 'CANCELLED') {
    return 'failed';
  }

  return 'pending';
}

async function markOrderPaid(checkoutId: string): Promise<OrderPaymentSyncResult> {
  const existing = await loadOrderByCheckoutId(checkoutId);

  if (!existing) {
    return { status: 'not_found', synced: false };
  }

  if (existing.status === 'paid') {
    const checkout = await fetchSumUpCheckout(checkoutId);
    if (mapSumUpStatus(checkout.status) !== 'paid') {
      console.warn(
        'Order marked paid in DB but SumUp checkout is not PAID:',
        checkoutId,
        checkout.status
      );
      return {
        status: 'pending',
        reference: existing.checkout_reference,
        synced: false,
        sumupStatus: checkout.status,
        hostedCheckoutUrl: hostedCheckoutUrl(checkout),
      };
    }
    return {
      status: 'paid',
      reference: existing.checkout_reference,
      synced: false,
      sumupStatus: 'PAID',
    };
  }

  const { data: updatedOrder, error: updateError } = await supabaseAdmin
    .from('orders')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('sumup_checkout_id', checkoutId)
    .select()
    .single();

  if (updateError || !updatedOrder) {
    throw new Error(updateError?.message ?? 'Failed to update order to paid');
  }

  try {
    await sendOrderPaidEmails(updatedOrder);
  } catch (emailError) {
    console.error('Order payment sync: email send failed:', emailError);
  }

  return {
    status: 'paid',
    reference: updatedOrder.checkout_reference,
    synced: true,
    sumupStatus: 'PAID',
  };
}

async function markOrderFailed(checkoutId: string): Promise<OrderPaymentSyncResult> {
  const existing = await loadOrderByCheckoutId(checkoutId);

  if (!existing) {
    return { status: 'not_found', synced: false };
  }

  if (existing.status === 'failed') {
    return {
      status: 'failed',
      reference: existing.checkout_reference,
      synced: false,
    };
  }

  const { error: updateError } = await supabaseAdmin
    .from('orders')
    .update({
      status: 'failed',
      updated_at: new Date().toISOString(),
    })
    .eq('sumup_checkout_id', checkoutId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  return {
    status: 'failed',
    reference: existing.checkout_reference,
    synced: true,
  };
}

/**
 * Ask SumUp for checkout status and reconcile the orders row.
 * Used by the webhook and when the customer lands on /order/confirmation
 * (e.g. localhost where SumUp cannot POST the webhook).
 */
export async function syncOrderPaymentByCheckoutId(
  checkoutId: string
): Promise<OrderPaymentSyncResult> {
  const checkout = await fetchSumUpCheckout(checkoutId);
  const mapped = mapSumUpStatus(checkout.status);

  if (mapped === 'paid') {
    return markOrderPaid(checkoutId);
  }

  if (mapped === 'failed') {
    return markOrderFailed(checkoutId);
  }

  const existing = await loadOrderByCheckoutId(checkoutId);

  return {
    status: 'pending',
    reference: existing?.checkout_reference,
    synced: false,
    sumupStatus: checkout.status,
    hostedCheckoutUrl: hostedCheckoutUrl(checkout),
  };
}

export type SyncByReferenceOptions = {
  /** checkout_id from SumUp redirect_url, when present */
  checkoutIdFromRedirect?: string | null;
};

export async function syncOrderPaymentByReference(
  reference: string,
  options: SyncByReferenceOptions = {}
): Promise<OrderPaymentSyncResult> {
  const order = await loadOrderByReference(reference);

  if (!order) {
    return { status: 'not_found', synced: false };
  }

  const redirectCheckoutId = options.checkoutIdFromRedirect?.trim();
  if (
    redirectCheckoutId &&
    !checkoutIdsMatch(order.sumup_checkout_id, redirectCheckoutId)
  ) {
    console.warn(
      'sync: redirect checkout_id does not match order row',
      reference,
      redirectCheckoutId,
      order.sumup_checkout_id
    );
  }

  return syncOrderPaymentByCheckoutId(order.sumup_checkout_id);
}
