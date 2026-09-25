import { getSupabaseAdmin } from './supabase-admin';
import { sendOrderPaidEmails } from './order-emails';
import { fetchSumUpCheckout } from './sumup';

export type OrderPaymentStatus = 'paid' | 'pending' | 'failed' | 'not_found';

export type OrderPaymentSyncResult = {
  status: OrderPaymentStatus;
  reference?: string;
  /** True when this call changed the database row. */
  synced: boolean;
  sumupStatus?: string;
};

type OrderLookup = {
  id: string;
  checkout_reference: string;
  sumup_checkout_id: string;
  status: string;
};

async function loadOrderByCheckoutId(checkoutId: string): Promise<OrderLookup | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
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
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('orders')
    .select('id, checkout_reference, sumup_checkout_id, status')
    .eq('checkout_reference', reference)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
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
  const supabase = getSupabaseAdmin();
  const existing = await loadOrderByCheckoutId(checkoutId);

  if (!existing) {
    return { status: 'not_found', synced: false };
  }

  if (existing.status === 'paid') {
    return {
      status: 'paid',
      reference: existing.checkout_reference,
      synced: false,
      sumupStatus: 'PAID',
    };
  }

  const { data: updatedOrder, error: updateError } = await supabase
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
  const supabase = getSupabaseAdmin();
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

  const { error: updateError } = await supabase
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
 * Ask SumUp for the authoritative checkout status and reconcile the orders row.
 * Used by the webhook and as a fallback when the customer lands on /order/confirmation
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
  };
}

export async function syncOrderPaymentByReference(
  reference: string
): Promise<OrderPaymentSyncResult> {
  const order = await loadOrderByReference(reference);

  if (!order) {
    return { status: 'not_found', synced: false };
  }

  if (order.status === 'paid') {
    return {
      status: 'paid',
      reference: order.checkout_reference,
      synced: false,
      sumupStatus: 'PAID',
    };
  }

  return syncOrderPaymentByCheckoutId(order.sumup_checkout_id);
}
