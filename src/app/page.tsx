"use client"

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function OrderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [cart, setCart] = useState({} as Record<string, number>);
  const [totalBowls, setTotalBowls] = useState(0);
  const [isOrderingOpen, setIsOrderingOpen] = useState(true);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const [customDateInput, setCustomDateInput] = useState('');
  const [customDateError, setCustomDateError] = useState('');
  const [previewDate, setPreviewDate] = useState('');
  const [isCustomDateActive, setIsCustomDateActive] = useState(false);
  
  const datePickerRef = useRef<HTMLInputElement>(null);

  // Delivery days: next Monday, Wednesday, and Friday (excluding next 2 days)
  const getValidDeliveryDates = () => {
    const today = new Date();
    const validDates: string[] = [];
    const cutoffDate = new Date();
    cutoffDate.setDate(today.getDate() + 2); // 2-day cutoff
    
    // Target days: 1=Monday, 3=Wednesday, 5=Friday
    const deliveryDays = [1, 3, 5];
    
    // Look ahead up to 3 weeks to find delivery days
    for (let daysAhead = 1; daysAhead <= 21; daysAhead++) {
      const checkDate = new Date();
      checkDate.setDate(today.getDate() + daysAhead);
      
      const dayOfWeek = checkDate.getDay();
      
      // If it's a delivery day and past the cutoff
      if (deliveryDays.includes(dayOfWeek) && checkDate > cutoffDate) {
        validDates.push(checkDate.toISOString().split('T')[0]);
        
        // Stop after finding 6 valid dates (2 weeks worth)
        if (validDates.length >= 6) break;
      }
    }

    return validDates;
  };

  const locations = ['Lancashire', 'Manchester'];

  const products = [
    { id: 'classic-oat', name: 'Classic Oat Bowl', price: 6.5 },
    { id: 'berry-boost', name: 'Berry Boost Bowl', price: 7.0 },
    { id: 'matcha-dream', name: 'Matcha Dream Bowl', price: 7.5 },
    { id: 'tropical-twist', name: 'Tropical Twist Bowl', price: 7.25 }
  ];

  const validDates = getValidDeliveryDates();

  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    setIsOrderingOpen(dayOfWeek !== 0 && dayOfWeek !== 6); // closed on weekends
  }, []);

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setPreviewDate('');
    setCurrentStep(2);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setIsCustomDateActive(false);
    setCustomDateInput('');
    setCustomDateError('');
    setPreviewDate('');
    setCurrentStep(3);
  };

  const handleDatePreview = (date: string) => {
    setPreviewDate(date);
    setIsCustomDateActive(false);
  };

  const handleCustomDateChange = (dateValue: string) => {
    setCustomDateInput(dateValue);
    setIsCustomDateActive(true);
    
    if (!dateValue) {
      setCustomDateError('');
      setPreviewDate('');
      return;
    }
    
    const selectedDay = new Date(dateValue);
    const dayOfWeek = selectedDay.getDay();
    const today = new Date();
    const cutoffDate = new Date();
    cutoffDate.setDate(today.getDate() + 2);
    
    // Validate: must be Mon/Wed/Fri and past cutoff
    if (![1, 3, 5].includes(dayOfWeek)) {
      setCustomDateError('Please select a Monday, Wednesday, or Friday.');
      setPreviewDate('');
      return;
    }
    
    if (selectedDay <= cutoffDate) {
      setCustomDateError('Date must be more than 2 days in advance.');
      setPreviewDate('');
      return;
    }
    
    // Valid date - set as preview
    setCustomDateError('');
    setPreviewDate(dateValue);
  };

  const handleCustomDateSubmit = () => {
    if (!customDateInput) {
      setCustomDateError('Please select a date.');
      return;
    }
    
    if (customDateError) {
      return; // Don't submit if there's an error
    }
    
    handleDateSelect(customDateInput);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const newCart = { ...cart };
    if (quantity === 0) delete newCart[productId];
    else newCart[productId] = quantity;
    setCart(newCart);
    const total = Object.values(newCart).reduce((s, q) => s + q, 0);
    setTotalBowls(total);
  };

  const proceedToCheckout = () => {
    if (totalBowls >= 2) setCurrentStep(4);
  };

  const handleCheckout = () => {
    setCurrentStep(5);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = products.find(p => p.id === productId)!;
      return total + (product.price * quantity);
    }, 0);
  };

  const StepIndicator = ({ step, title, isActive, isCompleted }: any) => (
    <div
      className={`relative flex items-center py-3 cursor-pointer transition-all duration-300 ${
        isActive 
          ? 'bg-[#9e9b65] text-white z-10 px-4 md:px-6' 
          : isCompleted 
            ? 'text-zinc-700 hover:bg-[#c4c2a8] px-3 md:px-6' 
            : 'bg-[#e7e1c9] text-zinc-400 px-3'
      }`}
      onClick={() => isCompleted && setCurrentStep(step)}
      style={{ 
        clipPath: step === 1 
          ? 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)' 
          : 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 12px 50%)',
        marginLeft: '0',
        fontFamily: 'Futura, sans-serif',
        cursor: isCompleted ? 'pointer' : 'default'
      }}
    >
      <div className="flex items-center gap-2 whitespace-nowrap">
        <span className={`flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold ${
          isActive ? 'bg-white text-[#9e9b65]' : isCompleted ? 'bg-[#9e9b65] text-white' : 'bg-zinc-300 text-zinc-500'
        }`}>
          {step}
        </span>
        {isActive && <span className="font-semibold text-sm md:text-base">{title}</span>}
        {isCompleted && <span className="hidden md:inline font-semibold text-sm md:text-base">{title}</span>}
      </div>
    </div>
  );

  if (!isOrderingOpen) {
    return (
      <div className="min-h-screen bg-[#e7e1c9] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">⏸️</div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">Ordering Closed</h2>
          <p className="text-zinc-700">Our ordering system is currently closed. Please check back during our opening hours.</p>
          <button onClick={() => setIsOrderingOpen(true)} className="mt-6 bg-[#9e9b65] hover:bg-[#7c7a4e] text-white px-6 py-3 rounded-lg font-medium">Refresh Status</button>
        </div>
      </div>
    );
  }

  if (currentStep === 5) {
    return (
      <div className="min-h-screen bg-[#F6F5EF] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">Order Confirmed!</h2>
          <p className="text-zinc-700 mb-4">Your oat bowls are confirmed for delivery to {selectedLocation} on {formatDate(selectedDate)}.</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
            <h3 className="font-semibold text-zinc-900 mb-2">Order Summary:</h3>
            {Object.entries(cart).map(([productId, quantity]) => {
              const product = products.find(p => p.id === productId)!;
              return (
                <div key={productId} className="flex justify-between text-sm">
                  <span>{product.name} × {quantity}</span>
                  <span>£{(product.price * quantity).toFixed(2)}</span>
                </div>
              );
            })}
          </div>
          <p className="text-zinc-700 text-sm">You'll receive a confirmation email shortly. Thank you!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e7e1c9] font-sans">
      {/* Header */}
      <header className="bg-[#e7e1c9] sticky top-0 z-40 border-b border-black/5">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Image src="/logo.png" alt="logo" width={120} height={40} priority />
          </div>
          <nav className="hidden md:flex">
            <div className="flex gap-6" style={{ fontFamily: 'Futura, sans-serif' }}>
              <a href="/" className="text-zinc-900 hover:text-[#9e9b65]">Home</a>
              <a href="/menu" className="text-zinc-900 hover:text-[#9e9b65]">Menu</a>
              <a href="/contact" className="text-zinc-900 hover:text-[#9e9b65]">Contact</a>
            </div>
          </nav>
          <div className="md:hidden">
            <button onClick={() => setIsBurgerOpen(!isBurgerOpen)} className="px-3 py-2 border rounded">Menu</button>
          </div>
        </div>
        {isBurgerOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="container mx-auto px-6 py-4">
              <a href="/" className="block mb-2">Home</a>
              <a href="/menu" className="block mb-2">Menu</a>
              <a href="/contact" className="block">Contact</a>
            </div>
          </div>
        )}
      </header>

      {/* Location & Date bar with embedded step navigation */}
      <div className="border-b shadow-sm">
        {/* Location & Date info */}
        {(selectedLocation || selectedDate) && (
          <div className="bg-[#fff7e6] border-b border-[#f0e1c6] py-3">
            <div className="container mx-auto px-6 flex flex-wrap items-center gap-4">
              {selectedLocation && (
                <div className="flex items-center gap-2 text-zinc-800 font-medium" style={{ fontFamily: 'Futura, sans-serif' }}>
                  📍 {selectedLocation}
                  <button onClick={() => setCurrentStep(1)} className="underline text-sm">Change</button>
                </div>
              )}
              {selectedDate && (
                <div className="flex items-center gap-2 text-zinc-800 font-medium" style={{ fontFamily: 'Futura, sans-serif' }}>
                  📅 {formatDate(selectedDate)}
                  <button onClick={() => setCurrentStep(2)} className="underline text-sm">Change</button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Step navigation */}
        <div className="container mx-auto px-6 justify-items-center md:justify-items-start">
          <nav className="flex" style={{ backgroundColor: '#e7e1c9' }}>
            <StepIndicator step={1} title="Location" isActive={currentStep===1} isCompleted={currentStep>1} />
            <StepIndicator step={2} title="Delivery Date" isActive={currentStep===2} isCompleted={currentStep>2} />
            <StepIndicator step={3} title="Products" isActive={currentStep===3} isCompleted={currentStep>3} />
            <StepIndicator step={4} title="Checkout" isActive={currentStep===4} isCompleted={currentStep>4} />
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4">
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-zinc-900 mb-4" style={{ fontFamily: 'Futura, sans-serif' }}>Choose Your Location</h2>
                <p className="text-zinc-700 mb-6">Select where you'd like your oat bowls delivered</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {locations.map((loc) => (
                    <button key={loc} onClick={() => handleLocationSelect(loc)} className="p-6 border-2 border-[#e7e1c9] rounded-xl hover:border-[#9e9b65] hover:bg-[#f7f7f2] transition text-left">
                      <div className="font-semibold text-zinc-900">{loc}</div>
                      <div className="text-sm text-zinc-600 mt-2">Weekly delivery available</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-zinc-900 mb-4" style={{ fontFamily: 'Futura, sans-serif' }}>Choose Delivery Date</h2>
                <p className="text-zinc-700 mb-6">Select your preferred delivery date. Orders must be placed at least 2 days in advance.</p>
                <div className="space-y-3">
                  {validDates.length > 0 ? validDates.map((d) => (
                    <button 
                      key={d} 
                      onClick={() => handleDatePreview(d)} 
                      className={`w-full p-4 border-2 rounded-xl transition text-left relative ${
                        previewDate === d 
                          ? 'border-[#9e9b65] bg-[#f7f7f2]' 
                          : 'border-[#e7e1c9] hover:border-[#9e9b65] hover:bg-[#f7f7f2]'
                      }`}
                    >
                      <div className="font-semibold text-zinc-900">{formatDate(d)}</div>
                      <div className="text-sm text-zinc-600">Delivery to {selectedLocation}</div>
                      {previewDate === d && (
                        <div className="absolute top-4 right-4 text-[#9e9b65] text-2xl">✓</div>
                      )}
                    </button>
                  )) : (
                    <div className="text-center py-8 text-zinc-600">No available delivery dates within the cutoff period.</div>
                  )}
                  
                  {/* Custom date option */}
                  <button 
                    onClick={() => { 
                      setIsCustomDateActive(true); 
                      setPreviewDate(''); 
                      datePickerRef.current?.showPicker?.() || datePickerRef.current?.click();
                    }} 
                    className={`w-full p-4 border-2 rounded-xl transition text-left relative ${
                      isCustomDateActive && previewDate === customDateInput
                        ? 'border-[#9e9b65] bg-[#f7f7f2]' 
                        : 'border-[#9e9b65] bg-[#f7f7f2] hover:bg-[#e7e1c9]'
                    }`}
                  >
                    <div className="font-semibold text-zinc-900">📅 Choose a custom date</div>
                    <div className="text-sm text-zinc-600">Select any Monday, Wednesday, or Friday beyond 3 weeks</div>
                    {isCustomDateActive && previewDate === customDateInput && (
                      <div className="absolute top-4 right-4 text-[#9e9b65] text-2xl">✓</div>
                    )}
                  </button>
                  
                  {/* Hidden date picker that triggers on button click */}
                  <input 
                    ref={datePickerRef}
                    type="date" 
                    value={customDateInput}
                    onChange={(e) => handleCustomDateChange(e.target.value)}
                    className="sr-only"
                  />
                  
                  {/* Error message for custom date */}
                  {isCustomDateActive && customDateError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {customDateError}
                    </div>
                  )}
                </div>
                
                {/* Proceed button - only shown when a valid date is previewed */}
                {previewDate && !customDateError && (
                  <div className="mt-6 flex items-center justify-between">
                    <button onClick={() => setCurrentStep(1)} className="underline text-sm text-zinc-800">← Back to locations</button>
                    <button 
                      onClick={() => handleDateSelect(previewDate)}
                      className="px-6 py-3 bg-[#9e9b65] hover:bg-[#7c7a4e] text-white rounded-lg font-semibold"
                    >
                      Continue with {formatDate(previewDate)}
                    </button>
                  </div>
                )}
                
                {(!previewDate || customDateError) && (
                  <button onClick={() => setCurrentStep(1)} className="mt-6 underline text-sm text-zinc-800">← Back to locations</button>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-zinc-900 mb-4">Choose Your Bowls</h2>
                <p className="text-zinc-700 mb-6">Select your favourite oat bowls. Minimum order: 2 bowls total.</p>
                <div className="space-y-6">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border border-[#e7e1c9] rounded-xl">
                      <div>
                        <div className="font-semibold text-zinc-900">{product.name}</div>
                        <div className="text-[#9e9b65] font-medium">£{product.price.toFixed(2)}</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button onClick={() => updateQuantity(product.id, Math.max(0, (cart[product.id]||0)-1))} className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center">-</button>
                        <span className="w-8 text-center font-medium">{cart[product.id]||0}</span>
                        <button onClick={() => updateQuantity(product.id, (cart[product.id]||0)+1)} className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center">+</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-[#F6F5EF] rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-zinc-900">Total Bowls:</span>
                    <span className={`text-lg font-bold ${totalBowls >= 2 ? 'text-[#9e9b65]' : 'text-red-600'}`}>{totalBowls} {totalBowls >= 2 ? '✓' : ''}</span>
                  </div>
                  {totalBowls < 2 && <p className="text-red-600 text-sm mt-2">You need at least 2 bowls to proceed.</p>}
                </div>

                <div className="flex space-x-4 mt-6">
                  <button onClick={() => setCurrentStep(2)} className="px-6 py-3 border border-[#e7e1c9] rounded-lg text-zinc-800">← Back</button>
                  <button onClick={proceedToCheckout} disabled={totalBowls < 2} className="px-6 py-3 bg-[#9e9b65] hover:bg-[#7c7a4e] disabled:bg-zinc-300 text-white rounded-lg">Proceed to Checkout</button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-zinc-900 mb-4">Checkout</h2>
                <div className="mb-6">
                  <h3 className="font-semibold text-zinc-900 mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span>Location:</span><span className="font-medium">{selectedLocation}</span></div>
                    <div className="flex justify-between"><span>Delivery Date:</span><span className="font-medium">{formatDate(selectedDate)}</span></div>
                    <div className="border-t pt-3 mt-3">
                      {Object.entries(cart).map(([productId, quantity]) => {
                        const product = products.find(p => p.id === productId)!;
                        return (
                          <div key={productId} className="flex justify-between py-1"><span>{product.name} × {quantity}</span><span>£{(product.price * quantity).toFixed(2)}</span></div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-3 border-t"><span>Total:</span><span>£{getTotalPrice().toFixed(2)}</span></div>
                  </div>
                </div>

                <div className="bg-white/50 rounded-lg p-4 mb-6">
                  <p className="text-zinc-700 text-sm">You will be redirected to our secure payment provider to complete your order.</p>
                </div>

                <div className="flex space-x-4">
                  <button onClick={() => setCurrentStep(3)} className="px-6 py-3 border border-[#e7e1c9] rounded-lg text-zinc-800">← Back to Cart</button>
                  <button onClick={handleCheckout} className="px-6 py-3 bg-[#9e9b65] hover:bg-[#7c7a4e] text-white rounded-lg">Complete Payment</button>
                </div>
              </div>
            )}
          </div>

          {/* Basket sidebar */}
          <aside className="lg:w-1/4">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="text-sm font-medium text-zinc-700 mb-3">YOUR ORDER</div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-zinc-900">Basket</h3>
                  {/* <button onClick={() => setIsBasketOpen(!isBasketOpen)} className="text-sm text-zinc-600">Toggle</button> */}
                </div>

                <div className="max-h-96 opacity-100">
                  {totalBowls > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(cart).map(([productId, quantity]) => {
                        const product = products.find(p => p.id === productId)!;
                        return (
                          <div key={productId} className="flex justify-between items-center py-2 border-b border-[#f0eae0]">
                            <div>
                              <div className="text-sm font-medium">{product.name}</div>
                              <div className="text-xs text-zinc-500">Qty: {quantity}</div>
                            </div>
                            <div className="font-medium">£{(product.price * quantity).toFixed(2)}</div>
                          </div>
                        );
                      })}

                      <div className="pt-3">
                        <div className="flex justify-between font-semibold"><span>Total Items:</span><span>{totalBowls}</span></div>
                        <div className="flex justify-between font-bold text-lg mt-2"><span>Total:</span><span>£{getTotalPrice().toFixed(2)}</span></div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-zinc-500">
                      <div className="text-3xl opacity-40 mb-2">🧺</div>
                      <p>Your basket is empty</p>
                      <p className="text-sm mt-1">Add items to get started</p>
                    </div>
                  )}
                </div>

                <button onClick={proceedToCheckout} disabled={totalBowls < 2 || currentStep === 4} className="w-full mt-4 bg-[#9e9b65] hover:bg-[#7c7a4e] disabled:bg-zinc-300 text-white py-3 rounded-lg">{currentStep === 4 ? 'GO TO CHECKOUT' : 'PROCEED TO CHECKOUT'}</button>
              </div>

              <div className="lg:hidden mt-4">
                {/* <button onClick={() => setIsBasketOpen(!isBasketOpen)} className="w-full bg-white border border-[#e7e1c9] rounded-lg p-4 text-left">  */}
                  <div className="flex justify-between items-center">
                    <span className="font-medium">View basket</span>
                    <div className="flex items-center space-x-2">
                      <span className="bg-[#9e9b65] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">{totalBowls}</span>
                      <span className="font-bold text-[#9e9b65]">£{getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                {/* </button> */}
              </div>

            </div>
          </aside>
        </div>
      </main>

      <footer className="bg-[#F6F5EF] text-black pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 footer-content mb-10">
            <div className="footer-section flex flex-col items-start">
              <Image src="/logo.png" alt="OAT & MATCHA Logo" width={120} height={40} priority />
            </div>
            <div className="footer-section">
            </div>
            <div className="footer-section flex flex-col items-start">
              <h3 className="mb-4 text-xl font-bold" style={{ fontFamily: 'Futura, sans-serif', color: '#9e9b65' }}>Follow Us</h3>
              <div className="flex gap-4">
                <a href="https://www.tiktok.com/@yourbrand" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-black hover:text-[#9e9b65] transition font-semibold" style={{ fontFamily: 'Futura, sans-serif' }}>
                  TikTok
                </a>
                <a href="https://www.instagram.com/yourbrand" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-black hover:text-[#9e9b65] transition font-semibold" style={{ fontFamily: 'Futura, sans-serif' }}>
                  Instagram
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-[#bbb] pt-6 text-center text-black text-sm copyright" style={{ fontFamily: 'Futura, sans-serif' }}>
            &copy; 2025 Ellie's Oats. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
