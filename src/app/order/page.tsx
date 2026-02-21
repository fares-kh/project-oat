"use client"

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function OrderPage() {
  // ============================================
  // DELIVERY CONFIGURATION BY LOCATION
  // ============================================
  // Configure delivery dates per location
  const deliveryConfig: Record<string, {
    useCustomDates: boolean;
    customDates: string[];
    postcodeValidation: {
      enabled: boolean;
      validPrefixes: string[];
    };
  }> = {
    'Lancashire': {
      useCustomDates: false,
      customDates: [],
      postcodeValidation: {
        enabled: true,
        validPrefixes: ['PR', 'BD', 'LA', 'HX', 'BB1', 'BB2', 'BB3', 'BB4', 'BB5', 'BB6', 'BB7', 'BB9', 'BB10', 'BB11', 'BB12']
      }
    },
    'Manchester': {
      useCustomDates: true,
      customDates: [
        '2026-02-26',
      ],
      postcodeValidation: {
        enabled: true,
        validPrefixes: ['M']
      }
    }
  };
  // ============================================

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [postcode, setPostcode] = useState('');
  const [postcodeError, setPostcodeError] = useState('');
  const [ordersByDate, setOrdersByDate] = useState<Record<string, Record<string, number>>>({});
  const [totalBowls, setTotalBowls] = useState(0);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const [customDateInput, setCustomDateInput] = useState('');
  const [customDateError, setCustomDateError] = useState('');
  const [previewDates, setPreviewDates] = useState<string[]>([]);
  const [isCustomDateActive, setIsCustomDateActive] = useState(false);
  const [previewLocation, setPreviewLocation] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [addressErrors, setAddressErrors] = useState({
    firstName: '',
    lastName: '',
    addressLine1: '',
    city: '',
    phoneNumber: ''
  });
  
  const datePickerRef = useRef<HTMLInputElement>(null);

  // Get delivery dates based on selected location
  const getValidDeliveryDates = () => {
    const locationConfig = deliveryConfig[selectedLocation];
    
    if (!locationConfig) {
      return getAutomaticDeliveryDates();
    }

    if (locationConfig.useCustomDates) {
      const today = new Date();
      return locationConfig.customDates.filter(dateStr => {
        const date = new Date(dateStr);
        return date > today;
      });
    }

    return getAutomaticDeliveryDates();
  };

  // Auto delivery logic
  const getAutomaticDeliveryDates = () => {
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

  const validDates = selectedLocation ? getValidDeliveryDates() : [];

  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
  }, []);

  const handleLocationPreview = (location: string) => {
    setPreviewLocation(location);
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setPreviewDates([]);
    setPreviewLocation('');
    setPostcode('');
    setPostcodeError('');
    setCurrentStep(2);
  };

  const validatePostcode = (postcodeInput: string): boolean => {
    if (!postcodeInput.trim()) {
      setPostcodeError('Please enter a postcode.');
      return false;
    }

    const locationConfig = deliveryConfig[selectedLocation];
    if (!locationConfig || !locationConfig.postcodeValidation.enabled) {
      return true;
    }

    const cleanPostcode = postcodeInput.replace(/\s/g, '').toUpperCase();
    
    if (cleanPostcode.length < 5 || cleanPostcode.length > 7) {
      setPostcodeError('Please enter a valid UK postcode (e.g., M1 4BT or PR1 2HE).');
      return false;
    }
    
    const isValid = locationConfig.postcodeValidation.validPrefixes.some(prefix => 
      cleanPostcode.startsWith(prefix.toUpperCase())
    );

    // to fix error
    if (!isValid) {
      const prefixList = locationConfig.postcodeValidation.validPrefixes.join(', ');
      setPostcodeError(`Sorry, we don't deliver to this postcode. We deliver to: ${prefixList} areas in ${selectedLocation}.`);
      return false;
    }

    setPostcodeError('');
    return true;
  };

  const handlePostcodeSubmit = () => {
    if (validatePostcode(postcode)) {
      setCurrentStep(3);
    }
  };

  const toggleDateSelection = (date: string) => {
    setPreviewDates(prev => {
      if (prev.includes(date)) {
        return prev.filter(d => d !== date);
      } else {
        return [...prev, date].sort();
      }
    });
    setIsCustomDateActive(false);
  };

  const handleDatesConfirm = () => {
    if (previewDates.length === 0) {
      return;
    }
    setSelectedDates(previewDates);
    setCurrentDateIndex(0);
    // Initialize empty carts for each date
    const initialOrders: Record<string, Record<string, number>> = {};
    previewDates.forEach(date => {
      initialOrders[date] = {};
    });
    setOrdersByDate(initialOrders);
    setCurrentStep(4);
  };

  const handleCustomDateChange = (dateValue: string) => {
    setCustomDateInput(dateValue);
    setIsCustomDateActive(true);
    
    if (!dateValue) {
      setCustomDateError('');
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
      return;
    }
    
    if (selectedDay <= cutoffDate) {
      setCustomDateError('Date must be more than 2 days in advance.');
      return;
    }
    
    // Valid date - add to selection
    setCustomDateError('');
    toggleDateSelection(dateValue);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const currentDate = selectedDates[currentDateIndex];
    const newOrders = { ...ordersByDate };
    
    if (!newOrders[currentDate]) {
      newOrders[currentDate] = {};
    }
    
    if (quantity === 0) {
      delete newOrders[currentDate][productId];
    } else {
      newOrders[currentDate][productId] = quantity;
    }
    
    setOrdersByDate(newOrders);
    
    // Calculate total bowls across all dates
    const total = Object.values(newOrders).reduce((sum, dateCart) => {
      return sum + Object.values(dateCart).reduce((s, q) => s + q, 0);
    }, 0);
    setTotalBowls(total);
  };

  const getCurrentDateCart = () => {
    const currentDate = selectedDates[currentDateIndex];
    return ordersByDate[currentDate] || {};
  };

  const getCurrentDateTotal = () => {
    const cart = getCurrentDateCart();
    return Object.values(cart).reduce((s, q) => s + q, 0);
  };

  const proceedToNextDate = () => {
    if (currentDateIndex < selectedDates.length - 1) {
      setCurrentDateIndex(currentDateIndex + 1);
    } else {
      setCurrentStep(5);
    }
  };

  const proceedToAddress = () => {
    const currentDateTotal = getCurrentDateTotal();
    if (currentDateTotal >= 2) {
      proceedToNextDate();
    }
  };

  const validateAddress = () => {
    const errors = {
      firstName: '',
      lastName: '',
      addressLine1: '',
      city: '',
      phoneNumber: ''
    };

    let isValid = true;

    if (!firstName.trim()) {
      errors.firstName = 'First name is required.';
      isValid = false;
    }

    if (!lastName.trim()) {
      errors.lastName = 'Last name is required.';
      isValid = false;
    }

    if (!addressLine1.trim()) {
      errors.addressLine1 = 'Address Line 1 is required.';
      isValid = false;
    }

    if (!city.trim()) {
      errors.city = 'City is required.';
      isValid = false;
    }

    const phoneRegex = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
    if (!phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required.';
      isValid = false;
    } else if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      errors.phoneNumber = 'Please enter a valid UK phone number (e.g., 07123 456789).';
      isValid = false;
    }

    setAddressErrors(errors);
    return isValid;
  };

  const proceedToCheckout = () => {
    if (validateAddress()) {
      setCurrentStep(6);
    }
  };

  const handleCheckout = async () => {
    setIsProcessingPayment(true);
    
    try {
      const orderData = {
        customer: {
          firstName: firstName,
          lastName: lastName,
          phone: phoneNumber,
          address: {
            line1: addressLine1,
            line2: addressLine2,
            city: city,
            postcode: postcode,
          }
        },
        delivery: {
          location: selectedLocation,
          dates: selectedDates,
          notes: deliveryNotes,
        },
        ordersByDate: ordersByDate,
        totalBowls: totalBowls,
        amount: getTotalPrice(),
      };

      const response = await fetch('/api/create-sumup-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        window.location.href = data.checkoutUrl;
      } else {
        console.error('Checkout creation failed:', data);
        alert(`Failed to create checkout: ${data.error || 'Unknown error'}`);
        setIsProcessingPayment(false);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('An error occurred while processing your payment. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const getTotalPrice = () => {
    return Object.values(ordersByDate).reduce((total, dateCart) => {
      return total + Object.entries(dateCart).reduce((dateTotal, [productId, quantity]) => {
        const product = products.find(p => p.id === productId)!;
        return dateTotal + (product.price * quantity);
      }, 0);
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

  const BackButton = ({ onClick, label }: { onClick: () => void; label?: string }) => (
    <button 
      onClick={onClick} 
      className="cursor-pointer px-6 py-3 border border-brand-beige rounded-lg hover:bg-brand-beige-light transition"
    >
      ← {label || 'Back'}
    </button>
  );

  const ContinueButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
    <button 
      onClick={onClick} 
      className="cursor-pointer px-6 py-3 bg-brand-green hover:bg-brand-green-hover text-text-white rounded-lg font-semibold"
    >
      Continue with {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-brand-beige font-sans flex flex-col">
      <Header />

      <div className="border-b shadow-sm">
        {/* Step navigation */}
        <div className="container mx-auto px-6 justify-items-center md:justify-items-start">
          <nav className="flex">
            <StepIndicator step={1} title="Location" isActive={currentStep===1} isCompleted={currentStep>1} />
            <StepIndicator step={2} title="Postcode" isActive={currentStep===2} isCompleted={currentStep>2} />
            <StepIndicator step={3} title="Delivery Date" isActive={currentStep===3} isCompleted={currentStep>3} />
            <StepIndicator step={4} title="Products" isActive={currentStep===4} isCompleted={currentStep>4} />
            <StepIndicator step={5} title="Address" isActive={currentStep===5} isCompleted={currentStep>5} />
            <StepIndicator step={6} title="Checkout" isActive={currentStep===6} isCompleted={currentStep>6} />
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
                <div className="space-y-3">
                  {locations.map((loc) => (
                    <button 
                      key={loc} 
                      onClick={() => handleLocationPreview(loc)} 
                      className={`cursor-pointer w-full p-6 border-2 rounded-xl transition text-left relative ${
                        previewLocation === loc 
                          ? 'border-brand-green bg-brand-beige-light' 
                          : 'border-brand-beige hover:border-brand-green hover:bg-brand-beige-light'
                      }`}
                    >
                      <div className="font-semibold">{loc}</div>
                      <div className="text-sm text-dark mt-2">Weekly delivery available</div>
                      {previewLocation === loc && (
                        <div className="absolute top-6 right-6 text-brand-green text-2xl">✓</div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Proceed button - only shown when a location is previewed */}
                {previewLocation && (
                  <div className="mt-6 flex justify-end">
                    <ContinueButton 
                      onClick={() => handleLocationSelect(previewLocation)} 
                      label={previewLocation} 
                    />
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-background rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-4">Verify Your Postcode</h2>
                <p className="mb-6">Please enter your postcode to confirm we deliver to your area in {selectedLocation}.</p>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="postcode" className="block text-sm font-medium mb-2">
                      Postcode
                    </label>
                    <input
                      id="postcode"
                      type="text"
                      value={postcode}
                      onChange={(e) => {
                        setPostcode(e.target.value.toUpperCase());
                        setPostcodeError('');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handlePostcodeSubmit();
                        }
                      }}
                      placeholder="e.g. M1 1AA"
                      className="w-full px-4 py-3 border-2 border-brand-beige rounded-lg focus:border-brand-green focus:outline-none transition"
                    />
                  </div>

                  {postcodeError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {postcodeError}
                    </div>
                  )}

                  <div className="p-4 bg-brand-beige-light rounded-lg text-sm">
                    <p className="font-semibold mb-2">📍 We deliver to these areas in {selectedLocation}:</p>
                    <p className="text-text-dark">
                      {deliveryConfig[selectedLocation].postcodeValidation.validPrefixes.join(', ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <BackButton onClick={() => setCurrentStep(1)} label="Back to location" />
                  <button
                    onClick={handlePostcodeSubmit}
                    disabled={!postcode.trim()}
                    className="px-6 py-3 bg-brand-green hover:bg-brand-green-hover disabled:bg-brand-grey disabled:cursor-not-allowed text-text-white rounded-lg font-semibold transition"
                  >
                    Verify Postcode
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-background rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-4 font-brand">Choose Delivery Dates</h2>
                <p className="mb-6">Select one or more delivery dates. You can order different items for each day. Orders must be placed at least 2 days in advance.</p>
                
                {previewDates.length > 0 && (
                  <div className="mb-4 p-3 bg-brand-green/10 border border-brand-green rounded-lg">
                    <p className="text-sm font-medium text-brand-green">
                      {previewDates.length} date{previewDates.length > 1 ? 's' : ''} selected: {previewDates.map(d => formatDate(d)).join(', ')}
                    </p>
                  </div>
                )}
                
                <div className="space-y-3">
                  {validDates.length > 0 ? validDates.map((d) => (
                    <button 
                      key={d} 
                      onClick={() => toggleDateSelection(d)} 
                      className={`cursor-pointer w-full p-4 border-2 rounded-xl transition text-left relative ${
                        previewDates.includes(d)
                          ? 'border-brand-green bg-brand-beige-light' 
                          : 'border-brand-beige hover:border-brand-green hover:bg-brand-beige-light'
                      }`}
                    >
                      <div className="font-semibold">{formatDate(d)}</div>
                      {previewDates.includes(d) && (
                        <div className="absolute top-4 right-4 text-brand-green text-2xl">✓</div>
                      )}
                    </button>
                  )) : (
                    <div className="text-center py-8">No available delivery dates within the cutoff period.</div>
                  )}
                  
                  {/* Custom date option */}
                  {!deliveryConfig[selectedLocation].useCustomDates &&
                    <button 
                      onClick={() => { 
                        setIsCustomDateActive(true); 
                        datePickerRef.current?.showPicker?.() || datePickerRef.current?.click();
                      }} 
                      className={`cursor-pointer w-full p-4 border-2 rounded-xl transition text-left relative hover:bg-brand-beige ${
                        isCustomDateActive && previewDates.includes(customDateInput)
                          ? 'border-brand-green bg-brand-beige-light' 
                          : 'border-brand-beige hover:border-brand-green hover:bg-brand-beige-light'
                      }`}
                    >
                      <div className="font-semibold">📅 Choose a custom date</div>
                      <div className="text-sm text-dark">Select any Monday, Wednesday, or Friday beyond 3 weeks</div>
                      {isCustomDateActive && previewDates.includes(customDateInput) && (
                        <div className="absolute top-4 right-4 text-brand-green text-2xl">✓</div>
                      )}
                    </button>
                  }
                  
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
                    <div className="p-3 bg-brand-error border border-brand-error text-text-white rounded-lg font-bold text-sm">
                      {customDateError}
                    </div>
                  )}
                </div>
                
                {/* Proceed button - only shown when dates are selected */}
                <div className="mt-6 flex items-center justify-between">
                  <BackButton onClick={() => setCurrentStep(2)}/>
                  {previewDates.length > 0 && (
                    <button
                      onClick={handleDatesConfirm}
                      className="cursor-pointer px-6 py-3 bg-brand-green hover:bg-brand-green-hover text-text-white rounded-lg font-semibold"
                    >
                      Continue with {previewDates.length} date{previewDates.length > 1 ? 's' : ''}
                    </button>
                  )}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="bg-background rounded-2xl shadow-lg p-8">
                {previewDates.length > 1 &&
                <div className="mb-4 p-4 bg-brand-green/10 border border-brand-green rounded-lg">
                  <h3 className="font-bold text-brand-green">Ordering for: {formatDate(selectedDates[currentDateIndex])}</h3>
                  <p className="text-sm text-brand-green mt-1">
                    Date {currentDateIndex + 1} of {selectedDates.length}
                    {currentDateIndex < selectedDates.length - 1 && ` • Next: ${formatDate(selectedDates[currentDateIndex + 1])}`}
                  </p>
                </div>
                }

                <h2 className="text-2xl font-bold mb-4">Choose Your Bowls</h2>
                <p className="mb-6">Select your favourite oat bowls for this date. Minimum order: 2 bowls per date.</p>
                <div className="space-y-6">
                  {products.map((product) => {
                    const currentCart = getCurrentDateCart();
                    return (
                      <div key={product.id} className="flex items-center justify-between p-4 border border-brand-beige rounded-xl">
                        <div>
                          <div className="font-semibold">{product.name}</div>
                          <div className="text-brand-green font-medium">£{product.price.toFixed(2)}</div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button onClick={() => updateQuantity(product.id, Math.max(0, (currentCart[product.id]||0)-1))} className="w-8 h-8 rounded-full border border-brand-grey flex items-center justify-center">-</button>
                          <span className="w-8 text-center font-medium">{currentCart[product.id]||0}</span>
                          <button onClick={() => updateQuantity(product.id, (currentCart[product.id]||0)+1)} className="w-8 h-8 rounded-full border border-brand-grey flex items-center justify-center">+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 bg-brand-footer rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Bowls for this date:</span>
                    <span className={`text-lg font-bold ${getCurrentDateTotal() >= 2 ? 'text-brand-green' : 'text-brand-error'}`}>{getCurrentDateTotal()}</span>
                  </div>
                  {getCurrentDateTotal() < 2 && <p className="text-brand-error text-sm mt-2">You need at least 2 bowls for this date to proceed.</p>}
                  
                  {totalBowls > 0 && (
                    <div className="mt-3 pt-3 border-t border-brand-beige">
                      <div className="flex justify-between">
                        <span className="font-medium">Total across all dates:</span>
                        <span className="font-bold text-brand-green">{totalBowls} bowls</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-4 mt-6 justify-between">
                  <BackButton onClick={() => {
                    if (currentDateIndex > 0) {
                      setCurrentDateIndex(currentDateIndex - 1);
                    } else {
                      setCurrentStep(3);
                    }
                  }} label={currentDateIndex > 0 ? 'Previous date' : 'Back'} />
                  <button 
                    onClick={proceedToAddress} 
                    disabled={getCurrentDateTotal() < 2} 
                    className="cursor-pointer px-6 py-3 bg-brand-green hover:bg-brand-green-hover disabled:bg-brand-grey text-text-white rounded-lg font-semibold"
                  >
                    {currentDateIndex < selectedDates.length - 1 ? 'Next Date' : 'Continue to Address'}
                  </button>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="bg-background rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-4">Delivery Address</h2>
                <p className="mb-6">Please provide your delivery address details.</p>
                
                <div className="space-y-4">
                  {/* Name fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                        First Name <span className="text-brand-error">*</span>
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          setAddressErrors({...addressErrors, firstName: ''});
                        }}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                          addressErrors.firstName 
                            ? 'border-brand-error focus:border-brand-error' 
                            : 'border-brand-beige focus:border-brand-green'
                        }`}
                      />
                      {addressErrors.firstName && (
                        <p className="text-brand-error text-sm mt-1">{addressErrors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                        Last Name <span className="text-brand-error">*</span>
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                          setAddressErrors({...addressErrors, lastName: ''});
                        }}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                          addressErrors.lastName 
                            ? 'border-brand-error focus:border-brand-error' 
                            : 'border-brand-beige focus:border-brand-green'
                        }`}
                      />
                      {addressErrors.lastName && (
                        <p className="text-brand-error text-sm mt-1">{addressErrors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="addressLine1" className="block text-sm font-medium mb-2">
                      Address Line 1 <span className="text-brand-error">*</span>
                    </label>
                    <input
                      id="addressLine1"
                      type="text"
                      value={addressLine1}
                      onChange={(e) => {
                        setAddressLine1(e.target.value);
                        setAddressErrors({...addressErrors, addressLine1: ''});
                      }}
                      placeholder="e.g. 123 Main Street"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                        addressErrors.addressLine1 
                          ? 'border-brand-error focus:border-brand-error' 
                          : 'border-brand-beige focus:border-brand-green'
                      }`}
                    />
                    {addressErrors.addressLine1 && (
                      <p className="text-brand-error text-sm mt-1">{addressErrors.addressLine1}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="addressLine2" className="block text-sm font-medium mb-2">
                      Address Line 2 <span className="text-text-dark text-xs">(optional)</span>
                    </label>
                    <input
                      id="addressLine2"
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="e.g. Apartment 4B"
                      className="w-full px-4 py-3 border-2 border-brand-beige rounded-lg focus:border-brand-green focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium mb-2">
                      City <span className="text-brand-error">*</span>
                    </label>
                    <input
                      id="city"
                      type="text"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        setAddressErrors({...addressErrors, city: ''});
                      }}
                      placeholder="e.g. Manchester"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                        addressErrors.city 
                          ? 'border-brand-error focus:border-brand-error' 
                          : 'border-brand-beige focus:border-brand-green'
                      }`}
                    />
                    {addressErrors.city && (
                      <p className="text-brand-error text-sm mt-1">{addressErrors.city}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="postcode-display" className="block text-sm font-medium mb-2">
                      Postcode <span className="text-brand-error">*</span>
                    </label>
                    <input
                      id="postcode-display"
                      type="text"
                      value={postcode.toUpperCase()}
                      disabled
                      className="w-full px-4 py-3 border-2 border-brand-beige rounded-lg bg-brand-beige-light text-text-dark cursor-not-allowed"
                    />
                    <p className="text-text-dark text-xs mt-1">
                      <button onClick={() => setCurrentStep(2)} className="cursor-pointer underline text-brand-green">Change postcode</button>
                    </p>
                  </div>

                  <div>
                    <label htmlFor="deliveryNotes" className="block text-sm font-medium mb-2">
                      Delivery Notes <span className="text-text-dark text-xs">(optional)</span>
                    </label>
                    <textarea
                      id="deliveryNotes"
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      placeholder="e.g. Leave at reception, Gate code: 1234"
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-brand-beige rounded-lg focus:border-brand-green focus:outline-none transition resize-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium mb-2">
                      Phone Number <span className="text-brand-error">*</span>
                    </label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setAddressErrors({...addressErrors, phoneNumber: ''});
                      }}
                      placeholder="e.g. 07123 456789"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                        addressErrors.phoneNumber 
                          ? 'border-brand-error focus:border-brand-error' 
                          : 'border-brand-beige focus:border-brand-green'
                      }`}
                    />
                    {addressErrors.phoneNumber && (
                      <p className="text-brand-error text-sm mt-1">{addressErrors.phoneNumber}</p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4 mt-6 justify-between">
                  <BackButton onClick={() => setCurrentStep(4)} label="Back to products" />
                  <button 
                    onClick={proceedToCheckout}
                    className="cursor-pointer px-6 py-3 bg-brand-green hover:bg-brand-green-hover text-text-white rounded-lg font-semibold"
                  >
                    Continue to Checkout
                  </button>
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="bg-background rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-4">Checkout</h2>
                
                {/* Delivery Info */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Delivery Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span>Name:</span><span className="font-medium">{firstName} {lastName}</span></div>
                    <div className="flex justify-between"><span>Location:</span><span className="font-medium">{selectedLocation}</span></div>
                    <div className="flex justify-between"><span>Address:</span><span className="font-medium text-right">{addressLine1}{addressLine2 && `, ${addressLine2}`}, {city}, {postcode.toUpperCase()}</span></div>
                    {deliveryNotes && <div className="flex justify-between"><span>Delivery Notes:</span><span className="font-medium text-right">{deliveryNotes}</span></div>}
                    <div className="flex justify-between"><span>Phone:</span><span className="font-medium">{phoneNumber}</span></div>
                  </div>
                </div>

                {/* Orders by Date */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Orders by Delivery Date</h3>
                  {selectedDates.map(date => {
                    const dateCart = ordersByDate[date];
                    const dateTotal = Object.entries(dateCart).reduce((sum, [productId, quantity]) => {
                      const product = products.find(p => p.id === productId)!;
                      return sum + (product.price * quantity);
                    }, 0);
                    
                    return (
                      <div key={date} className="mb-4">
                        <h4 className="font-semibold mb-2">📅 {formatDate(date)}</h4>
                        <div className="space-y-1">
                          {Object.entries(dateCart).map(([productId, quantity]) => {
                            const product = products.find(p => p.id === productId)!;
                            return (
                              <div key={productId} className="flex justify-between text-sm">
                                <span>{product.name} × {quantity}</span>
                                <span>£{(product.price * quantity).toFixed(2)}</span>
                              </div>
                            );
                          })}
                          <div className="flex justify-between font-medium pt-2 border-t border-brand-beige">
                            <span>Date Subtotal:</span>
                            <span>£{dateTotal.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  <div className="flex justify-between font-bold text-lg pt-3 border-t-2 border-brand-green">
                    <span>Total ({selectedDates.length} delivery date{selectedDates.length > 1 ? 's' : ''}):</span>
                    <span>£{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                <p className="text-dark text-sm mb-6">You will be redirected to our secure payment provider to complete your order.</p>

                <div className="flex space-x-4">
                  <BackButton onClick={() => setCurrentStep(5)} label="Back to address" />
                  <button 
                    onClick={handleCheckout} 
                    disabled={isProcessingPayment}
                    className="px-6 py-3 bg-brand-green hover:bg-brand-green-hover disabled:bg-brand-grey disabled:cursor-not-allowed text-text-white rounded-lg font-semibold transition flex items-center gap-2"
                  >
                    {isProcessingPayment ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Complete Payment'
                    )}
                  </button>
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
                </div>

                <div className="max-h-96 opacity-100 overflow-y-auto">
                  {totalBowls > 0 ? (
                    <div className="space-y-3">
                      {selectedDates.map((date, dateIdx) => {
                        const dateCart = ordersByDate[date];
                        if (!dateCart || Object.keys(dateCart).length === 0) return null;
                        
                        return (
                          <div key={date} className="pb-3 mb-3 border-b border-brand-beige last:border-0">
                            <div className="text-xs font-medium text-brand-green mb-2">
                              {formatDate(date)}
                            </div>
                            {Object.entries(dateCart).map(([productId, quantity]) => {
                              const product = products.find(p => p.id === productId)!;
                              return (
                                <div key={`${date}-${productId}`} className="flex justify-between items-center py-1">
                                  <div>
                                    <div className="text-sm font-medium">{product.name}</div>
                                    <div className="text-xs text-text-dark">Qty: {quantity}</div>
                                  </div>
                                  <div className="font-medium text-sm">£{(product.price * quantity).toFixed(2)}</div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}

                      <div className="pt-3 border-t-2 border-brand-green">
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
              </div>

              <div className="lg:hidden mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">View basket</span>
                    <div className="flex items-center space-x-2">
                      <span className="bg-brand-green text-text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">{totalBowls}</span>
                      <span className="font-bold text-brand-green">£{getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
              </div>

            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
