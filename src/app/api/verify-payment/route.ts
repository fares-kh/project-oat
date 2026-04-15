import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const { checkoutId } = await request.json();

    if (!checkoutId) {
      return NextResponse.json(
        { error: 'Missing checkoutId' },
        { status: 400 }
      );
    }

    // Just check what the webhook has done in the database
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('status, paid_at, checkout_reference')
      .eq('sumup_checkout_id', checkoutId)
      .single();

    if (error || !order) {
      console.error('Order not found for checkout:', checkoutId, error);
      return NextResponse.json(
        { success: false, status: 'not_found' },
        { status: 404 }
      );
    }

    console.log('Order status check:', order.checkout_reference, order.status);

    return NextResponse.json({
      success: true,
      status: order.status, // 'pending' or 'paid' (set by webhook)
      order
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
