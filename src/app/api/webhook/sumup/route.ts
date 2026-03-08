import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    console.log('SumUp webhook received:', JSON.stringify(payload, null, 2));

    const { event_type, id: checkoutId } = payload;

    if (event_type !== 'CHECKOUT_STATUS_CHANGED') {
      console.log('Ignoring webhook event type:', event_type);
      return NextResponse.json({ received: true });
    }

    console.log(`Webhook: Checkout status changed for ID: ${checkoutId}`);

    const sumupResponse = await fetch(`https://api.sumup.com/v0.1/checkouts/${checkoutId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.SUMUP_API_KEY}`,
      },
    });

    if (!sumupResponse.ok) {
      console.error('Webhook: Failed to verify checkout with SumUp API');
      return NextResponse.json({ 
        received: true, 
        error: 'Failed to verify checkout' 
      }, { status: 500 });
    }

    const checkout = await sumupResponse.json();
    const status = checkout.status; // e.g., "PAID", "PENDING", "FAILED"

    console.log(`Webhook: Verified checkout ${checkoutId} has status: ${status}`);


    if (status === 'PAID') {
      console.log(`Webhook: Updating order status to 'paid' for checkout: ${checkoutId}`);
      
      const { data: existingOrder } = await supabaseAdmin
        .from('orders')
        .select('checkout_reference, status')
        .eq('sumup_checkout_id', checkoutId)
        .single();

      if (!existingOrder) {
        console.error(`Webhook: No order found with checkout ID: ${checkoutId}`);
        return NextResponse.json({ 
          received: true, 
          error: 'Order not found' 
        });
      }

      if (existingOrder.status === 'paid') {
        console.log(`Webhook: Order ${existingOrder.checkout_reference} already marked as paid, skipping`);
        return NextResponse.json({ 
          received: true, 
          message: 'Order already paid' 
        });
      }

      // Update the order
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
        console.error('Webhook: Error updating order:', updateError);
        return NextResponse.json({ 
          received: true, 
          error: updateError.message 
        }, { status: 500 });
      }

      console.log(`Webhook: Successfully updated order ${updatedOrder.checkout_reference} to paid`);
      
      // TODO: Send confirmation email here if needed
      
      return NextResponse.json({ 
        received: true, 
        updated: true,
        reference: updatedOrder.checkout_reference 
      });
    } else if (status === 'FAILED' || status === 'CANCELLED') {
      // Optionally handle failed/cancelled payments
      console.log(`Webhook: Payment ${status} for checkout: ${checkoutId}`);
      
      const { data: updatedOrder, error: updateError } = await supabaseAdmin
        .from('orders')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('sumup_checkout_id', checkoutId)
        .select()
        .single();

      if (updateError) {
        console.error('Webhook: Error marking order as failed:', updateError);
      } else {
        console.log(`Webhook: Marked order ${updatedOrder.checkout_reference} as failed`);
      }
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ 
      received: true, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}

// Allow SumUp to verify the webhook endpoint
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    status: 'ok',
    message: 'SumUp webhook endpoint is active' 
  });
}
