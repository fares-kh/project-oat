import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('admin_session');
    const authHeader = request.headers.get('authorization');
    const adminToken = process.env.ADMIN_API_SECRET;
    
    let isAuthenticated = false;
    
    if (sessionCookie?.value) {
      isAuthenticated = true;
    }
    else if (adminToken && authHeader === `Bearer ${adminToken}`) {
      isAuthenticated = true;
    }
    
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Fetch all paid orders from Supabase
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('status', 'paid')
      .order('paid_at', { ascending: false });

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders from database' },
        { status: 500 }
      );
    }

    console.log(`Found ${orders?.length || 0} paid orders in database`);

    // Transform to match frontend expectations
    const transactions = (orders || []).map(order => ({
      id: order.id,
      checkout_reference: order.checkout_reference,
      amount: Number(order.amount) * 100, // Convert back to pence for frontend
      currency: 'GBP',
      status: 'PAID',
      date: order.paid_at || order.created_at,
      merchant_data: {
        order_details: JSON.stringify(order.items),
        customer_phone: order.customer_phone,
        customer_address: `${order.address_line1}${order.address_line2 ? ', ' + order.address_line2 : ''}, ${order.city}, ${order.postcode}`,
        delivery_notes: order.delivery_notes,
        need_paper_spoons: order.need_paper_spoons ? 'true' : 'false'
      }
    }));

    return NextResponse.json({
      success: true,
      transactions,
      count: transactions.length
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
