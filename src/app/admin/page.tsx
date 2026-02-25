'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface OrderItem {
  bowlNumber: number;
  productName: string;
  isSignature: boolean;
  oatSoaking: string | null;
  toppings: string[];
  extraToppings: Array<{ name: string; quantity: number }>;
  price: number;
  deliveryDate: string;
}

interface Order {
  id: string;
  checkout_reference: string;
  status: string;
  amount: number;
  customer_name: string;
  customer_phone: string;
  address: string;
  delivery_location: string;
  delivery_notes: string | null;
  need_paper_spoons: boolean;
  delivery_dates: string[];
  items: {
    detailedLineItems: OrderItem[];
    totalBowls: number;
    customer: {
      email: string;
      firstName: string;
      lastName: string;
    };
  };
  created_at: string;
  paid_at: string;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('Fetching orders from API...');
      
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      
      console.log('API Response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch orders');
      }

      // Transform the response to match our Order interface
      const transformedOrders = data.transactions.map((t: any) => {
        const orderDetails = typeof t.merchant_data.order_details === 'string' 
          ? JSON.parse(t.merchant_data.order_details)
          : t.merchant_data.order_details;

        return {
          id: t.id,
          checkout_reference: t.checkout_reference,
          status: t.status,
          amount: t.amount / 100, // Convert from pence to pounds
          customer_name: orderDetails.customer.firstName + ' ' + orderDetails.customer.lastName,
          customer_phone: t.merchant_data.customer_phone,
          address: t.merchant_data.customer_address,
          delivery_location: orderDetails.delivery.location,
          delivery_notes: t.merchant_data.delivery_notes,
          need_paper_spoons: t.merchant_data.need_paper_spoons === 'true',
          delivery_dates: orderDetails.delivery.dates,
          items: orderDetails,
          created_at: orderDetails.createdAt,
          paid_at: t.date
        };
      });

      setOrders(transformedOrders);
      console.log(`Loaded ${transformedOrders.length} orders`);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDeliveryDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gradient-to-b from-pink-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Dashboard</h1>
            </div>

            {/* Stats */}
            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="text-sm text-gray-600 mb-1">Total Orders</div>
                  <div className="text-3xl font-bold text-pink-600">{orders.length}</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="text-sm text-gray-600 mb-1">Total Bowls</div>
                  <div className="text-3xl font-bold text-purple-600">
                    {orders.reduce((sum, order) => sum + order.items.totalBowls, 0)}
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
                <p className="mt-4 text-gray-600">Loading orders...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-800 font-semibold">Error loading orders</p>
                <p className="text-red-600 mt-2">{error}</p>
                <button
                  onClick={fetchOrders}
                  className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && orders.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg">No paid orders yet</p>
                <p className="text-gray-500 mt-2">Orders will appear here once customers complete payment</p>
              </div>
            )}

            {/* Orders List */}
            {!loading && !error && orders.length > 0 && (
              <div className="space-y-4">
                {orders.map((order) => {
                  const isExpanded = expandedOrders.has(order.id);
                  
                  return (
                    <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      {/* Order Header - Clickable */}
                      <button
                        onClick={() => toggleOrderExpansion(order.id)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="bg-pink-100 rounded-full p-3">
                            <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">{order.customer_name}</div>
                            <div className="text-sm text-gray-600">{order.checkout_reference}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <div className="font-bold text-gray-900">£{order.amount.toFixed(2)}</div>
                            <div className="text-sm text-gray-600">{order.items.totalBowls} bowl{order.items.totalBowls > 1 ? 's' : ''}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600">{formatDate(order.paid_at)}</div>
                            <div className="text-xs text-green-600 font-semibold">PAID</div>
                          </div>
                          <svg
                            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>

                      {/* Expanded Order Details */}
                      {isExpanded && (
                        <div className="border-t border-gray-200 px-6 py-6 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Customer Information */}
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Customer Details
                              </h3>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="text-gray-600">Name:</span>
                                  <span className="ml-2 text-gray-900">{order.items.customer.firstName} {order.items.customer.lastName}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Phone:</span>
                                  <span className="ml-2 text-gray-900">{order.customer_phone}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Address:</span>
                                  <div className="ml-2 text-gray-900">
                                    {order.address}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Delivery Information */}
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Delivery Details
                              </h3>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="text-gray-600">Location:</span>
                                  <span className="ml-2 text-gray-900 font-medium">{order.delivery_location}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Dates:</span>
                                  <div className="ml-2 mt-1">
                                    {order.delivery_dates.map((date, idx) => (
                                      <div key={idx} className="text-gray-900 bg-white rounded px-2 py-1 inline-block mr-2 mb-1">
                                        {formatDeliveryDate(date)}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                {order.delivery_notes && (
                                  <div>
                                    <span className="text-gray-600">Notes:</span>
                                    <span className="ml-2 text-gray-900 italic">{order.delivery_notes}</span>
                                  </div>
                                )}
                                <div>
                                  <span className="text-gray-600">Paper Spoons:</span>
                                  <span className="ml-2 text-gray-900">{order.need_paper_spoons ? 'Yes' : 'No'}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="mt-8">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                              <svg className="w-5 h-5 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              Order Items ({order.items.detailedLineItems.length} bowls)
                            </h3>
                            <div className="space-y-4">
                              {order.items.detailedLineItems.map((item, idx) => (
                                <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                                  <div className="flex justify-between items-start mb-3">
                                    <div>
                                      <div className="font-semibold text-gray-900">
                                        Bowl #{item.bowlNumber} - {item.productName}
                                        {item.isSignature && (
                                          <span className="ml-2 text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">Signature</span>
                                        )}
                                      </div>
                                      <div className="text-sm text-gray-600 mt-1">
                                        Delivery: {item.deliveryDate}
                                      </div>
                                    </div>
                                    <div className="font-semibold text-gray-900">£{item.price.toFixed(2)}</div>
                                  </div>
                                  
                                  {item.oatSoaking && (
                                    <div className="text-sm mb-2">
                                      <span className="text-gray-600">Base:</span>
                                      <span className="ml-2 text-gray-900">{item.oatSoaking}</span>
                                    </div>
                                  )}
                                  
                                  {item.toppings.length > 0 && (
                                    <div className="text-sm mb-2">
                                      <span className="text-gray-600">Toppings:</span>
                                      <div className="ml-2 mt-1 flex flex-wrap gap-1">
                                        {item.toppings.map((topping, tIdx) => (
                                          <span key={tIdx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                            {topping}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {item.extraToppings.length > 0 && (
                                    <div className="text-sm">
                                      <span className="text-gray-600">Extra Toppings:</span>
                                      <div className="ml-2 mt-1 flex flex-wrap gap-1">
                                        {item.extraToppings.map((extra, eIdx) => (
                                          <span key={eIdx} className="bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs">
                                            {extra.name} x{extra.quantity}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
