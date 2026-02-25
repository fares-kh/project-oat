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
    
    const productNames: Record<string, string> = {
      'blueberry-cheesecake': 'Blueberry Cheesecake',
      'sticky-toffee': 'Sticky Toffee',
      'apple-of-my-eye': 'Apple of My Eye',
      'monthly-special': 'Monthly Special',
      'build-your-own': 'Build Your Own'
    };

    const toppingNames: Record<string, string> = {
      'banana': 'Banana',
      'strawberry': 'Strawberry',
      'apple': 'Apple',
      'raspberry': 'Raspberry',
      'peanut-butter': 'Peanut butter',
      'almond-butter': 'Almond butter',
      'nutella': 'Nutella',
      'cacao-nibs': 'Cacao nibs',
      'granola': 'Homemade granola',
      'chia-seeds': 'Chia seeds',
      'goji-berries': 'Goji berries',
      'mixed-seeds': 'Mixed seeds',
      'honey': 'Honey',
      'cinnamon': 'Cinnamon',
      'dark-choc-chips': 'Dark Choc Chips',
      'protein-vanilla': 'Protein powder (vanilla)',
      'protein-chocolate': 'Protein powder (chocolate)',
      'matcha-powder': 'Matcha powder'
    };

    const oatSoakingNames: Record<string, string> = {
      'dairy-yoghurt': 'Dairy Greek yoghurt',
      'coconut-yoghurt': 'Plant-based coconut yoghurt'
    };
    
    let bowlNumber = 0;
    const detailedLineItems: any[] = [];
    
    orderData.delivery.dates.forEach((date: string) => {
      const dateFormatted = formatDate(date);
      const dateBowls = orderData.ordersByDate[date] || [];
      
      dateBowls.forEach((bowl: any) => {
        bowlNumber++;
        const productName = productNames[bowl.productId] || bowl.productId;
        const oatSoaking = bowl.oatSoaking ? (oatSoakingNames[bowl.oatSoaking] || bowl.oatSoaking) : null;
        
        const toppings = bowl.toppings?.map((id: string) => toppingNames[id] || id) || [];
        
        // Format extra toppings
        const extraToppings = Object.entries(bowl.extraToppings || {})
          .map(([id, qty]: [string, any]) => ({
            name: toppingNames[id] || id,
            quantity: qty
          }));
        
        detailedLineItems.push({
          bowlNumber,
          productId: bowl.productId,
          productName,
          isSignature: bowl.isSignature || false,
          oatSoaking,
          toppings,
          extraToppings,
          price: bowl.price,
          deliveryDate: dateFormatted
        });
      });
    });
    
    const description = [
      `${orderData.customer.firstName} ${orderData.customer.lastName}`,
      `${orderData.totalBowls} bowl${orderData.totalBowls > 1 ? 's' : ''}`,
      `Delivery: ${orderData.delivery.dates.map((d: string) => formatDate(d)).join(', ')}`,
      orderData.delivery.location,
      orderData.customer.address.postcode.toUpperCase()
    ].join(' | ');
    
    const fullOrderData = {
      checkoutReference,
      customer: orderData.customer,
      delivery: orderData.delivery,
      detailedLineItems,
      totalBowls: orderData.totalBowls,
      totalAmount: orderData.amount,
      createdAt: new Date().toISOString()
    };

    const merchantData = {
      order_details: JSON.stringify(fullOrderData),
      customer_phone: orderData.customer.phone,
      customer_address: `${orderData.customer.address.line1}, ${orderData.customer.address.city}, ${orderData.customer.address.postcode}`,
      delivery_notes: orderData.delivery.notes || '',
      need_paper_spoons: orderData.delivery.needPaperSpoons || false
    };

    console.log('\n=== MERCHANT DATA ===');
    console.log('Checkout Reference:', checkoutReference);
    console.log('Description (visible to customer):', description);
    console.log('Merchant Data Keys:', Object.keys(merchantData));
    console.log('Order Details Preview:', JSON.stringify(fullOrderData, null, 2));
    console.log('Customer Phone:', merchantData.customer_phone);
    console.log('Customer Address:', merchantData.customer_address);
    console.log('Delivery Notes:', merchantData.delivery_notes);
    console.log('Need Paper Spoons:', merchantData.need_paper_spoons);
    console.log('Total Bowls:', detailedLineItems.length);
    console.log('==================\n');

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
        description: description,
        merchant_data: merchantData,
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
      detailedLineItems: detailedLineItems.length,
      merchantData: checkout.merchant_data,
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
    //   fullOrderData,
    //   status: 'pending',
    // });

    // TODO: Send detailed confirmation email to customer
    // await sendOrderConfirmationEmail({
    //   to: orderData.customer.email,
    //   orderData: fullOrderData
    // });

    // TODO: Send order notification to merchant/kitchen
    // await sendMerchantNotification({
    //   orderData: fullOrderData
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
