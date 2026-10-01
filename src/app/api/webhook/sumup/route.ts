import { NextRequest, NextResponse } from 'next/server';
import { syncOrderPaymentByCheckoutId } from '@/lib/order-payment-sync';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const { event_type, id: checkoutId } = payload;

    if (event_type !== 'CHECKOUT_STATUS_CHANGED') {
      console.log('SumUp webhook: ignoring event type', event_type);
      return NextResponse.json({ received: true });
    }

    if (!checkoutId) {
      return NextResponse.json({ received: true, error: 'Missing checkout id' });
    }

    console.log('SumUp webhook: syncing checkout', checkoutId);
    const result = await syncOrderPaymentByCheckoutId(checkoutId);

    return NextResponse.json({
      received: true,
      ...result,
    });
  } catch (error) {
    console.error('SumUp webhook error:', error);
    return NextResponse.json(
      {
        received: true,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'SumUp webhook endpoint is active',
  });
}
