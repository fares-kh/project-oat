import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        { error: 'Missing reference parameter' },
        { status: 400 }
      );
    }

    // Look up the order by checkout reference
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('sumup_checkout_id')
      .eq('checkout_reference', reference)
      .single();

    if (error || !order) {
      console.error('Order not found for reference:', reference, error);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      checkoutId: order.sumup_checkout_id
    });

  } catch (error) {
    console.error('Error looking up checkout:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
