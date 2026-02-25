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

    const apiKey = process.env.SUMUP_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'SumUp API key not configured' },
        { status: 500 }
      );
    }

    // Fetch checkout status from SumUp
    const response = await fetch(`https://api.sumup.com/v0.1/checkouts/${checkoutId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('SumUp API Error:', response.status);
      return NextResponse.json(
        { error: 'Failed to verify payment with SumUp' },
        { status: response.status }
      );
    }

    const checkout = await response.json();
    console.log('Checkout status:', checkout.status);

    // Update order status in Supabase
    if (checkout.status === 'PAID') {
      const { data: updatedOrder, error: updateError } = await supabaseAdmin
        .from('orders')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('sumup_checkout_id', checkoutId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating order status:', updateError);
        return NextResponse.json(
          { error: 'Failed to update order status' },
          { status: 500 }
        );
      }

      console.log('Order marked as paid:', updatedOrder?.checkout_reference);

      return NextResponse.json({
        success: true,
        status: 'paid',
        order: updatedOrder
      });
    } else {
      return NextResponse.json({
        success: true,
        status: checkout.status
      });
    }

  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
