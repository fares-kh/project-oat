import { NextRequest, NextResponse } from 'next/server';
import { syncOrderPaymentByReference } from '@/lib/order-payment-sync';

/**
 * Reconcile an order with SumUp by checkout reference.
 *
 * Primary path: SumUp webhook updates the row when return_url is reachable.
 * Fallback: customer redirect to /order/confirmation triggers this call so
 * localhost and missed webhooks still flip pending → paid.
 */
export async function GET(request: NextRequest) {
  try {
    const reference = request.nextUrl.searchParams.get('reference');

    if (!reference) {
      return NextResponse.json({ error: 'Missing reference parameter' }, { status: 400 });
    }

    const result = await syncOrderPaymentByReference(reference);

    if (result.status === 'not_found') {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('sync-order-payment error:', error);
    return NextResponse.json(
      {
        error: 'Failed to sync payment',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
