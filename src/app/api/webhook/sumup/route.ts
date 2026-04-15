import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_KEY);

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
      
      try {
        const orderDetails = updatedOrder.items;
        const customerEmail = orderDetails?.customer?.email;
        const customerName = `${orderDetails?.customer?.firstName || ''} ${orderDetails?.customer?.lastName || ''}`.trim();
        
        if (customerEmail) {
          // Format delivery dates
          const deliveryDates = orderDetails?.delivery?.dates || [];
          const formattedDates = deliveryDates.map((date: string) => {
            const d = new Date(date);
            return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
          }).join(', ');

          const totalBowls = orderDetails?.totalBowls || 0;
          const totalAmount = orderDetails?.totalAmount || updatedOrder.amount;

          await resend.emails.send({
            from: 'Ellie\'s Oats <noreply@elliesoats.co.uk>',
            replyTo: 'elliesoats@hotmail.com',
            to: customerEmail,
            subject: `Order Confirmation - ${customerName}, ${updatedOrder.checkout_reference}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <!-- Logo -->
                <div style="text-align: center; padding: 30px 20px 20px;">
                  <img src="https://elliesoats.co.uk/logo.png" alt="Ellie's Oats" style="width: 200px; height: auto;" />
                </div>
                
                <!-- Main Content -->
                <div style="background-color: #e8dcc8; padding: 30px; border-radius: 12px; margin: 20px;">
                  <h1 style="color: #4a7c59; margin-top: 0; font-size: 24px;">Order Confirmed! 🎉</h1>
                  <p style="color: #2c2c2c; line-height: 1.6;">Hi ${customerName},</p>
                  <p style="color: #2c2c2c; line-height: 1.6;">Thank you for your order with Ellie's Oats! Your payment has been received and your order is confirmed.</p>
                  
                  <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h2 style="color: #4a7c59; margin-top: 0; font-size: 18px;">Order Details</h2>
                    <table style="width: 100%; color: #2c2c2c;">
                      <tr>
                        <td style="padding: 8px 0;"><strong>Order Reference:</strong></td>
                        <td style="padding: 8px 0;">${updatedOrder.checkout_reference}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;"><strong>Total Bowls:</strong></td>
                        <td style="padding: 8px 0;">${totalBowls}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;"><strong>Total Amount:</strong></td>
                        <td style="padding: 8px 0; color: #4a7c59; font-weight: bold;">£${totalAmount.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;"><strong>Delivery Date(s):</strong></td>
                        <td style="padding: 8px 0;">${formattedDates}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;"><strong>Delivery Location:</strong></td>
                        <td style="padding: 8px 0;">${orderDetails?.delivery?.location || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;"><strong>Delivery Address:</strong></td>
                        <td style="padding: 8px 0;">${updatedOrder.address_line1}${updatedOrder.address_line2 ? ', ' + updatedOrder.address_line2 : ''}, ${updatedOrder.city}, ${updatedOrder.postcode}</td>
                      </tr>
                    </table>
                  </div>

                  <p style="color: #2c2c2c; line-height: 1.6;">You’ll be sent a message the day before with an approximate delivery slot. Your bowls will be left on your doorstep. If you’ve requested otherwise, please ensure someone is available to take the delivery.</p>
                  <p style="color: #2c2c2c; line-height: 1.6;">If you have any questions or need to make changes to your order, please contact us at <a href="mailto:elliesoats@hotmail.com" style="color: #4a7c59; text-decoration: none; font-weight: bold;">elliesoats@hotmail.com</a> or via Instagram <a href="https://instagram.com/ellies.oats" style="color: #4a7c59; text-decoration: none; font-weight: bold;">@ellies.oats</a>.</p>
                  <p style="color: #2c2c2c; line-height: 1.6; margin-bottom: 0;">Best regards,<br/><strong>Ellie's Oats</strong></p>
                </div>
                
                <!-- Footer -->
                <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
                  <p style="margin: 5px 0;">Ellie's Oats - Fuelling Your Fitness Goals</p>
                  <p style="margin: 5px 0;">
                    <a href="https://instagram.com/ellies.oats" style="color: #4a7c59; text-decoration: none;">Instagram</a> | 
                    <a href="mailto:elliesoats@hotmail.com" style="color: #4a7c59; text-decoration: none;">Email Us</a>
                  </p>
                </div>
              </div>
            `
          });
          
          console.log(`Webhook: Confirmation email sent to ${customerEmail}`);
        } else {
          console.log('Webhook: No customer email found, skipping confirmation email');
        }
      } catch (emailError) {
        console.error('Webhook: Error sending confirmation email:', emailError);
        // Don't fail the webhook if email fails
      }

      // Send admin notification email
      try {
        const orderDetails = updatedOrder.items;
        const customerName = `${orderDetails?.customer?.firstName || ''} ${orderDetails?.customer?.lastName || ''}`.trim();
        const totalBowls = orderDetails?.totalBowls || 0;
        const totalAmount = orderDetails?.totalAmount || updatedOrder.amount;
        const deliveryDates = orderDetails?.delivery?.dates || [];
        const formattedDates = deliveryDates.map((date: string) => {
          const d = new Date(date);
          return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
        }).join(', ');

        await resend.emails.send({
          from: 'Ellie\'s Oats <noreply@elliesoats.co.uk>',
          to: 'elliesoats@hotmail.com',
          subject: `New Order: ${customerName}, ${updatedOrder.checkout_reference}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
              <!-- Logo -->
              <div style="text-align: center; padding: 30px 20px 20px;">
                <img src="https://elliesoats.co.uk/logo.png" alt="Ellie's Oats" style="width: 200px; height: auto;" />
              </div>
              
              <!-- Main Content -->
              <div style="background-color: #e8dcc8; padding: 30px; border-radius: 12px; margin: 20px;">
                <h1 style="color: #4a7c59; margin-top: 0; font-size: 24px;">🎉 New Order Received!</h1>
                <p style="color: #2c2c2c; line-height: 1.6;">You have a new order from <strong>${customerName}</strong>.</p>
                
                <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h2 style="color: #4a7c59; margin-top: 0; font-size: 18px;">Order Summary</h2>
                  <table style="width: 100%; color: #2c2c2c;">
                    <tr>
                      <td style="padding: 8px 0;"><strong>Reference:</strong></td>
                      <td style="padding: 8px 0;">${updatedOrder.checkout_reference}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;"><strong>Customer:</strong></td>
                      <td style="padding: 8px 0;">${customerName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;"><strong>Total Bowls:</strong></td>
                      <td style="padding: 8px 0;">${totalBowls}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;"><strong>Amount:</strong></td>
                      <td style="padding: 8px 0; color: #4a7c59; font-weight: bold;">£${totalAmount.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;"><strong>Delivery Date(s):</strong></td>
                      <td style="padding: 8px 0;">${formattedDates}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;"><strong>Location:</strong></td>
                      <td style="padding: 8px 0;">${orderDetails?.delivery?.location || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;"><strong>Address:</strong></td>
                      <td style="padding: 8px 0;">${updatedOrder.address_line1}${updatedOrder.address_line2 ? ', ' + updatedOrder.address_line2 : ''}, ${updatedOrder.city}, ${updatedOrder.postcode}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;"><strong>Phone:</strong></td>
                      <td style="padding: 8px 0;">${updatedOrder.customer_phone}</td>
                    </tr>
                    ${orderDetails?.customer?.email ? `
                    <tr>
                      <td style="padding: 8px 0;"><strong>Email:</strong></td>
                      <td style="padding: 8px 0;">${orderDetails.customer.email}</td>
                    </tr>
                    ` : ''}
                  </table>
                </div>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://www.elliesoats.co.uk/admin" style="display: inline-block; background-color: #4a7c59; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                    View in Admin Dashboard
                  </a>
                </div>

                <p style="color: #2c2c2c; line-height: 1.6; font-size: 14px; margin-bottom: 0;">
                  <strong>Date:</strong> ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}
                </p>
              </div>
              
              <!-- Footer -->
              <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
                <p style="margin: 5px 0;">Ellie's Oats - Admin Notification</p>
              </div>
            </div>
          `,
        });

        console.log('Webhook: Admin notification email sent');
      } catch (adminEmailError) {
        console.error('Webhook: Error sending admin notification email:', adminEmailError);
      }
      
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
