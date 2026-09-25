import { getResend } from './resend';

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

  const resend = getResend();
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
                <tr><td style="padding: 8px 0;"><strong>Order Reference:</strong></td><td style="padding: 8px 0;">${order.checkout_reference}</td></tr>
                <tr><td style="padding: 8px 0;"><strong>Total Bowls:</strong></td><td style="padding: 8px 0;">${totalBowls}</td></tr>
                <tr><td style="padding: 8px 0;"><strong>Total Amount:</strong></td><td style="padding: 8px 0; color: #4a7c59; font-weight: bold;">£${totalAmount.toFixed(2)}</td></tr>
                <tr><td style="padding: 8px 0;"><strong>Delivery Date(s):</strong></td><td style="padding: 8px 0;">${formattedDates}</td></tr>
                <tr><td style="padding: 8px 0;"><strong>Delivery Location:</strong></td><td style="padding: 8px 0;">${orderDetails?.delivery?.location ?? 'N/A'}</td></tr>
                <tr><td style="padding: 8px 0;"><strong>Delivery Address:</strong></td><td style="padding: 8px 0;">${order.address_line1}${order.address_line2 ? `, ${order.address_line2}` : ''}, ${order.city}, ${order.postcode}</td></tr>
              </table>
            </div>
            <p style="color: #2c2c2c; line-height: 1.6;">You'll be sent a message the day before with an approximate delivery slot. Your bowls will be left on your doorstep. If you've requested otherwise, please ensure someone is available to take the delivery.</p>
            <p style="color: #2c2c2c; line-height: 1.6;">If you have any questions, contact us at <a href="mailto:elliesoats@hotmail.com" style="color: #4a7c59; text-decoration: none; font-weight: bold;">elliesoats@hotmail.com</a> or Instagram <a href="https://instagram.com/ellies.oats" style="color: #4a7c59; text-decoration: none; font-weight: bold;">@ellies.oats</a>.</p>
            <p style="color: #2c2c2c; line-height: 1.6; margin-bottom: 0;">Best regards,<br/><strong>Ellie's Oats</strong></p>
          </div>
        </div>
      `,
    });
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4a7c59;">New order received</h1>
        <p><strong>Reference:</strong> ${order.checkout_reference}</p>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Bowls:</strong> ${totalBowls}</p>
        <p><strong>Amount:</strong> £${totalAmount.toFixed(2)}</p>
        <p><strong>Delivery:</strong> ${formattedDatesShort}</p>
        <p><strong>Phone:</strong> ${order.customer_phone}</p>
        ${customerEmail ? `<p><strong>Email:</strong> ${customerEmail}</p>` : ''}
      </div>
    `,
  });
}
