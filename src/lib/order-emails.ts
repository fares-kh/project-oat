import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_KEY);

type OrderRow = {
  checkout_reference: string;
  amount: number;
  address_line1: string;
  address_line2: string | null;
  city: string;
  postcode: string;
  customer_phone: string;
  items: {
    customer?: {
      email?: string;
      firstName?: string;
      lastName?: string;
    };
    delivery?: {
      dates?: string[];
      location?: string;
    };
    totalBowls?: number;
    totalAmount?: number;
  };
};

function shouldSkipEmails(): boolean {
  return process.env.SKIP_ORDER_EMAILS === 'true';
}

function getAdminNotifyEmail(): string {
  return process.env.ADMIN_NOTIFY_EMAIL ?? 'elliesoats@hotmail.com';
}

export async function sendOrderPaidEmails(order: OrderRow): Promise<void> {
  if (shouldSkipEmails()) {
    console.log('SKIP_ORDER_EMAILS=true — confirmation emails not sent');
    return;
  }

  const orderDetails = order.items;
  const customerEmail = orderDetails?.customer?.email;
  const customerName =
    `${orderDetails?.customer?.firstName ?? ''} ${orderDetails?.customer?.lastName ?? ''}`.trim();
  const deliveryDates = orderDetails?.delivery?.dates ?? [];
  const totalBowls = orderDetails?.totalBowls ?? 0;
  const totalAmount = orderDetails?.totalAmount ?? order.amount;

  if (customerEmail) {
    const formattedDates = deliveryDates
      .map((date: string) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      })
      .join(', ');

    await resend.emails.send({
      from: "Ellie's Oats <noreply@elliesoats.co.uk>",
      replyTo: 'elliesoats@hotmail.com',
      to: customerEmail,
      subject: `Order Confirmation - ${customerName}, ${order.checkout_reference}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="text-align: center; padding: 30px 20px 20px;">
            <img src="https://elliesoats.co.uk/logo.png" alt="Ellie's Oats" style="width: 200px; height: auto;" />
          </div>
          <div style="background-color: #e8dcc8; padding: 30px; border-radius: 12px; margin: 20px;">
            <h1 style="color: #4a7c59; margin-top: 0; font-size: 24px;">Order Confirmed! 🎉</h1>
            <p style="color: #2c2c2c; line-height: 1.6;">Hi ${customerName},</p>
            <p style="color: #2c2c2c; line-height: 1.6;">Thank you for your order with Ellie's Oats! Your payment has been received and your order is confirmed.</p>
            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #4a7c59; margin-top: 0; font-size: 18px;">Order Details</h2>
              <table style="width: 100%; color: #2c2c2c;">
                <tr>
                  <td style="padding: 8px 0;"><strong>Order Reference:</strong></td>
                  <td style="padding: 8px 0;">${order.checkout_reference}</td>
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
                  <td style="padding: 8px 0;">${orderDetails?.delivery?.location ?? 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Delivery Address:</strong></td>
                  <td style="padding: 8px 0;">${order.address_line1}${order.address_line2 ? ', ' + order.address_line2 : ''}, ${order.city}, ${order.postcode}</td>
                </tr>
              </table>
            </div>
            <p style="color: #2c2c2c; line-height: 1.6;">You'll be sent a message the day before with an approximate delivery slot. Your bowls will be left on your doorstep. If you've requested otherwise, please ensure someone is available to take the delivery.</p>
            <p style="color: #2c2c2c; line-height: 1.6;">If you have any questions or need to make changes to your order, please contact us at <a href="mailto:elliesoats@hotmail.com" style="color: #4a7c59; text-decoration: none; font-weight: bold;">elliesoats@hotmail.com</a> or via Instagram <a href="https://instagram.com/ellies.oats" style="color: #4a7c59; text-decoration: none; font-weight: bold;">@ellies.oats</a>.</p>
            <p style="color: #2c2c2c; line-height: 1.6; margin-bottom: 0;">Best regards,<br/><strong>Ellie's Oats</strong></p>
          </div>
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p style="margin: 5px 0;">Ellie's Oats - Fuelling Your Fitness Goals</p>
            <p style="margin: 5px 0;">
              <a href="https://instagram.com/ellies.oats" style="color: #4a7c59; text-decoration: none;">Instagram</a> |
              <a href="mailto:elliesoats@hotmail.com" style="color: #4a7c59; text-decoration: none;">Email Us</a>
            </p>
          </div>
        </div>
      `,
    });

    console.log(`Confirmation email sent to ${customerEmail}`);
  } else {
    console.log('No customer email found, skipping confirmation email');
  }

  const formattedDatesShort = deliveryDates
    .map((date: string) => {
      const d = new Date(date);
      return d.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
    })
    .join(', ');

  await resend.emails.send({
    from: "Ellie's Oats <noreply@elliesoats.co.uk>",
    to: getAdminNotifyEmail(),
    subject: `New Order: ${customerName}, ${order.checkout_reference}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="text-align: center; padding: 30px 20px 20px;">
          <img src="https://elliesoats.co.uk/logo.png" alt="Ellie's Oats" style="width: 200px; height: auto;" />
        </div>
        <div style="background-color: #e8dcc8; padding: 30px; border-radius: 12px; margin: 20px;">
          <h1 style="color: #4a7c59; margin-top: 0; font-size: 24px;">🎉 New Order Received!</h1>
          <p style="color: #2c2c2c; line-height: 1.6;">You have a new order from <strong>${customerName}</strong>.</p>
          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #4a7c59; margin-top: 0; font-size: 18px;">Order Summary</h2>
            <table style="width: 100%; color: #2c2c2c;">
              <tr>
                <td style="padding: 8px 0;"><strong>Reference:</strong></td>
                <td style="padding: 8px 0;">${order.checkout_reference}</td>
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
                <td style="padding: 8px 0;">${formattedDatesShort}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Location:</strong></td>
                <td style="padding: 8px 0;">${orderDetails?.delivery?.location ?? 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Address:</strong></td>
                <td style="padding: 8px 0;">${order.address_line1}${order.address_line2 ? ', ' + order.address_line2 : ''}, ${order.city}, ${order.postcode}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Phone:</strong></td>
                <td style="padding: 8px 0;">${order.customer_phone}</td>
              </tr>
              ${
                customerEmail
                  ? `
              <tr>
                <td style="padding: 8px 0;"><strong>Email:</strong></td>
                <td style="padding: 8px 0;">${customerEmail}</td>
              </tr>
              `
                  : ''
              }
            </table>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.elliesoats.co.uk/admin" style="display: inline-block; background-color: #4a7c59; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
              View in Admin Dashboard
            </a>
          </div>
          <p style="color: #2c2c2c; line-height: 1.6; font-size: 14px; margin-bottom: 0;">
            <strong>Date:</strong> ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
          <p style="margin: 5px 0;">Ellie's Oats - Admin Notification</p>
        </div>
      </div>
    `,
  });

  console.log('Admin notification email sent');
}
