"use client"

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function OrderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [cart, setCart] = useState({} as Record<string, number>);
  const [totalBowls, setTotalBowls] = useState(0);
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
    { id: 'blueberry-cheesecake', name: 'Blueberry Cheesecake', price: 5.95 },
    { id: 'sticky-toffee', name: 'Sticky Toffee', price: 5.95 },
    { id: 'apple-of-my-eye', name: 'Apple of My Eye', price: 5.95 },
    { id: 'jam-dodger', name: 'Jam Dodger', price: 5.95 }
  ];

  const validDates = getValidDeliveryDates();

  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
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
          ? 'bg-brand-green text-white z-10 px-4 md:px-6' 
          : isCompleted 
            ? 'text-[#525252] hover:bg-[#d4d2b8] px-3 md:px-6' 
            : 'bg-brand-beige px-3'
      }`}
      onClick={() => isCompleted && setCurrentStep(step)}
      style={{ 
        clipPath: step === 1 
          ? 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)' 
          : 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 12px 50%)',
        marginLeft: '0',
        cursor: isCompleted ? 'pointer' : 'default'
      }}
    >
      <div className="flex items-center gap-2 whitespace-nowrap">
        <span className={`flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold ${
          isActive ? 'bg-background text-brand-green' : isCompleted ? 'bg-brand-green text-white' : 'bg-zinc-300 text-zinc-500'
        }`}>
          {step}
        </span>
        {isActive && <span className="font-semibold text-sm md:text-base">{title}</span>}
        {isCompleted && <span className="hidden md:inline font-semibold text-sm md:text-base">{title}</span>}
      </div>
    </div>
  );

  if (currentStep === 5) {
    // to change
    return (
      <div className="min-h-screen bg-brand-footer flex items-center justify-center p-4">
        <div className="bg-background rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
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
    <div className="min-h-screen bg-brand-beige font-sans flex flex-col">
      <Header />

      {/* Location & Date bar with embedded step navigation */}
      <div className="border-b shadow-sm">
        {/* Location & Date info */}
        {(selectedLocation || selectedDate) && (
          <div className="bg-background py-3">
            <div className="container mx-auto px-6 flex flex-wrap items-center gap-4">
              {selectedLocation && (
                <div className="flex items-center gap-2 font-medium">
                  📍 {selectedLocation}
                  <button onClick={() => setCurrentStep(1)} className="underline text-sm">Change</button>
                </div>
              )}
              {selectedDate && (
                <div className="flex items-center gap-2 font-medium">
                  📅 {formatDate(selectedDate)}
                  <button onClick={() => setCurrentStep(2)} className="underline text-sm">Change</button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Step navigation */}
        <div className="container mx-auto px-6 justify-items-center md:justify-items-start">
          <nav className="flex">
            <StepIndicator step={1} title="Location" isActive={currentStep===1} isCompleted={currentStep>1} />
            <StepIndicator step={2} title="Delivery Date" isActive={currentStep===2} isCompleted={currentStep>2} />
            <StepIndicator step={3} title="Products" isActive={currentStep===3} isCompleted={currentStep>3} />
            <StepIndicator step={4} title="Checkout" isActive={currentStep===4} isCompleted={currentStep>4} />
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8 flex-1">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4">
            {currentStep === 1 && (
              <div className="bg-background rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-4">Choose Your Location</h2>
                <p className="mb-6">Select where you'd like your oat bowls delivered</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {locations.map((loc) => (
                    <button key={loc} onClick={() => handleLocationSelect(loc)} className="p-6 border-2 border-brand-beige rounded-xl hover:border-brand-green hover:bg-brand-beige-light transition text-left">
                      <div className="font-semibold">{loc}</div>
                      <div className="text-sm text-dark mt-2">Weekly delivery available</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-background rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-boldmb-4 font-brand">Choose Delivery Date</h2>
                <p className="mb-6">Select your preferred delivery date. Orders must be placed at least 2 days in advance.</p>
                <div className="space-y-3">
                  {validDates.length > 0 ? validDates.map((d) => (
                    <button 
                      key={d} 
                      onClick={() => handleDatePreview(d)} 
                      className={`w-full p-4 border-2 rounded-xl transition text-left relative ${
                        previewDate === d 
                          ? 'border-brand-green bg-brand-beige-light' 
                          : 'border-brand-beige hover:border-brand-green hover:bg-brand-beige-light'
                      }`}
                    >
                      <div className="font-semibold">{formatDate(d)}</div>
                      <div className="text-sm text-dark">Delivery to {selectedLocation}</div>
                      {previewDate === d && (
                        <div className="absolute top-4 right-4 text-brand-green text-2xl">✓</div>
                      )}
                    </button>
                  )) : (
                    <div className="text-center py-8">No available delivery dates within the cutoff period.</div>
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
                        ? 'border-brand-green bg-brand-beige-light' 
                        : 'border-brand-green bg-brand-beige-light hover:bg-brand-beige'
                    }`}
                  >
                    <div className="font-semibold">📅 Choose a custom date</div>
                    <div className="text-sm text-dark">Select any Monday, Wednesday, or Friday beyond 3 weeks</div>
                    {isCustomDateActive && previewDate === customDateInput && (
                      <div className="absolute top-4 right-4 text-brand-green text-2xl">✓</div>
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
                    <div className="p-3 bg-brand-error border border-brand-error rounded-lg text-brand-error text-sm">
                      {customDateError}
                    </div>
                  )}
                </div>
                
                {/* Proceed button - only shown when a valid date is previewed */}
                {previewDate && !customDateError && (
                  <div className="mt-6 flex items-center justify-between">
                    <button onClick={() => setCurrentStep(1)} className="underline text-sm">← Back to locations</button>
                    <button 
                      onClick={() => handleDateSelect(previewDate)}
                      className="px-6 py-3 bg-brand-green hover:bg-brand-green-hover text-text-white rounded-lg font-semibold"
                    >
                      Continue with {formatDate(previewDate)}
                    </button>
                  </div>
                )}
                
                {(!previewDate || customDateError) && (
                  <button onClick={() => setCurrentStep(1)} className="mt-6 underline text-sm">← Back to locations</button>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-background rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-4">Choose Your Bowls</h2>
                <p className="mb-6">Select your favourite oat bowls. Minimum order: 2 bowls total.</p>
                <div className="space-y-6">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border border-brand-beige rounded-xl">
                      <div>
                        <div className="font-semibold">{product.name}</div>
                        <div className="text-brand-green font-medium">£{product.price.toFixed(2)}</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button onClick={() => updateQuantity(product.id, Math.max(0, (cart[product.id]||0)-1))} className="w-8 h-8 rounded-full border border-brand-grey flex items-center justify-center">-</button>
                        <span className="w-8 text-center font-medium">{cart[product.id]||0}</span>
                        <button onClick={() => updateQuantity(product.id, (cart[product.id]||0)+1)} className="w-8 h-8 rounded-full border border-brand-grey flex items-center justify-center">+</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-brand-footer rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Bowls:</span>
                    <span className={`text-lg font-bold ${totalBowls >= 2 ? 'text-brand-green' : 'text-brand-error'}`}>{totalBowls} {totalBowls >= 2 ? '✓' : ''}</span>
                  </div>
                  {totalBowls < 2 && <p className="text-brand-error text-sm mt-2">You need at least 2 bowls to proceed.</p>}
                </div>

                <div className="flex space-x-4 mt-6">
                  <button onClick={() => setCurrentStep(2)} className="px-6 py-3 border border-brand-beige rounded-lg">← Back</button>
                  <button onClick={proceedToCheckout} disabled={totalBowls < 2} className="px-6 py-3 bg-brand-green hover:bg-brand-green-hover disabled:bg-brand-grey text-text-white rounded-lg">Proceed to Checkout</button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="bg-background rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-4">Checkout</h2>
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Order Summary</h3>
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

                <p className="text-dark text-sm mb-6">You will be redirected to our secure payment provider to complete your order.</p>

                <div className="flex space-x-4">
                  <button onClick={() => setCurrentStep(3)} className="px-6 py-3 border border-brand-beige rounded-lg">← Back to Cart</button>
                  <button onClick={handleCheckout} className="px-6 py-3 bg-brand-green hover:bg-brand-green-hover text-text-white rounded-lg">Complete Payment</button>
                </div>
              </div>
            )}
          </div>

          {/* Basket sidebar */}
          <aside className="lg:w-1/4">
            <div className="sticky top-8">
              <div className="bg-background rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">Basket</h3>
                  {/* <button onClick={() => setIsBasketOpen(!isBasketOpen)} className="text-sm text-zinc-600">Toggle</button> */}
                </div>

                <div className="max-h-96 opacity-100">
                  {totalBowls > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(cart).map(([productId, quantity]) => {
                        const product = products.find(p => p.id === productId)!;
                        return (
                          <div key={productId} className="flex justify-between items-center py-2 border-b border-brand-grey">
                            <div>
                              <div className="text-sm font-medium">{product.name}</div>
                              <div className="text-xs text-text-dark">Qty: {quantity}</div>
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
                    <div className="text-center py-6 text-brand-grey">
                      <div className="text-3xl opacity-40 mb-2">🧺</div>
                      <p>Your basket is empty</p>
                      <p className="text-sm mt-1">Add items to get started</p>
                    </div>
                  )}
                </div>

                {/* <button onClick={proceedToCheckout} disabled={totalBowls < 2 || currentStep === 4} className="w-full mt-4 bg-brand-green hover:bg-brand-green-hover disabled:bg-zinc-300 text-white py-3 rounded-lg">{currentStep === 4 ? 'GO TO CHECKOUT' : 'PROCEED TO CHECKOUT'}</button> */}
              </div>

              <div className="lg:hidden mt-4">
                {/* <button onClick={() => setIsBasketOpen(!isBasketOpen)} className="w-full bg-white border border-brand-beige rounded-lg p-4 text-left">  */}
                  <div className="flex justify-between items-center">
                    <span className="font-medium">View basket</span>
                    <div className="flex items-center space-x-2">
                      <span className="bg-brand-green text-text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">{totalBowls}</span>
                      <span className="font-bold text-brand-green">£{getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                {/* </button> */}
              </div>

            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
