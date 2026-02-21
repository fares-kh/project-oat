import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    const checkoutReference = `OAT-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const amountInPence = Math.round(orderData.amount * 100);
    
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };
    
    const orderSummaryLines = orderData.delivery.dates.map((date: string) => {
      const dateFormatted = formatDate(date);
      const dateCart = orderData.ordersByDate[date];
      
      const items = Object.entries(dateCart)
        .map(([productId, quantity]: [string, any]) => {
          const productNames: Record<string, string> = {
            'banana-bread': 'Banana Bread',
            'apple-cinnamon': 'Apple & Cinnamon',
            'blueberry': 'Blueberry',
            'peanut-butter': 'Peanut Butter',
            'mixed-berry': 'Mixed Berry',
            'chocolate': 'Chocolate'
          };
          const productName = productNames[productId] || productId;
          return `${productName} x${quantity}`;
        })
        .join(', ');
      
      return `${dateFormatted}: ${items}`;
    }).join(' | ');
    
    const description = [
        orderSummaryLines,
        `${orderData.customer.firstName} ${orderData.customer.lastName}`,
        `${orderData.customer.phone}`,
        orderData.customer.address.line1,
        orderData.customer.address.line2,
        orderData.customer.address.city,
        `${orderData.customer.address.postcode.toUpperCase()}`,
       orderData.delivery.notes && 'Notes: ' + orderData.delivery.notes
    ].join(' | ');
    
    const sumupResponse = await fetch('https://api.sumup.com/v0.1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SUMUP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        checkout_reference: checkoutReference,
        amount: amountInPence / 100,
        currency: 'GBP',
        merchant_code: process.env.SUMUP_MERCHANT_CODE,
        description: 'ONLINE ORDER: ' + description,
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/confirmation?reference=${checkoutReference}`,
        hosted_checkout: { 
          enabled: true
        }
      })
    });

    if (!sumupResponse.ok) {
      const errorData = await sumupResponse.json();
      console.error('SumUp API Error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create checkout', details: errorData },
        { status: sumupResponse.status }
      );
    }

    const checkout = await sumupResponse.json();
    console.log('SumUp Hosted Checkout response:', checkout);
    
    console.log('Checkout created:', {
      reference: checkoutReference,
      checkoutId: checkout.id,
      amount: orderData.amount,
      hostedCheckoutUrl: checkout.hosted_checkout_url,
    });

    if (!checkout.hosted_checkout_url) {
      console.error('No hosted_checkout_url in response');
      return NextResponse.json(
        { error: 'Failed to get hosted checkout URL', details: checkout },
        { status: 500 }
      );
    }

    // TODO: Store order in your database here
    // await saveOrderToDatabase({
    //   checkoutReference,
    //   checkoutId: checkout.id,
    //   orderData,
    //   status: 'pending',
    //   createdAt: new Date(),
    // });
    
    return NextResponse.json({
      success: true,
      checkoutId: checkout.id,
      checkoutReference: checkoutReference,
      checkoutUrl: checkout.hosted_checkout_url,
    });

  } catch (error) {
    console.error('Error creating SumUp checkout:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
