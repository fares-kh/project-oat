"use client"

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { products, type Product, oatSoakingOptions, toppingOptions, toppingCategories } from '@/data/products';

interface BowlOrder {
  productId: string;
  oatSoaking: string | null; // null for signature bowls
  toppings: string[]; // empty for signature bowls
  extraToppings: Record<string, number>;
  price: number;
  isSignature: boolean;
}

export default function OrderPage() {
  // ============================================
  // DELIVERY CONFIGURATION BY LOCATION
  // ============================================
  // Configure delivery dates per location
  const deliveryConfig: Record<string, {
    useCustomDates: boolean;
    customDates: string[];
    excludedDates?: string[]; // Dates to exclude from delivery
    postcodeValidation: {
      enabled: boolean;
      validPrefixes: string[];
      excludedPrefixes?: string[];
    };
  }> = {
    'Lancashire': {
      useCustomDates: false,
      customDates: [],
      excludedDates: ['2026-04-06'],
      postcodeValidation: {
        enabled: true,
        validPrefixes: ['BB1', 'BB2', 'BB3', 'BB4', 'BB5', 'BB6', 'BB7', 'BB9', 'BB10', 'BB11', 'BB12'],
        excludedPrefixes: ['BB8', 'BB18']
      }
    },
    'Manchester': {
      useCustomDates: false,
      customDates: [
        '2026-02-26',
      ],
      excludedDates: ['2026-04-06'],
      postcodeValidation: {
        enabled: true,
        validPrefixes: ['M', 'BL9', 'BL8', 'BL0', 'OL12', 'OL15', 'OL16', 'OL11', 'OL10', 'WA13', 'WA14', 'WA15'],
        excludedPrefixes: ['M35', 'M43', 'M34', 'M29', 'M38', 'M46']
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
  const [ordersByDate, setOrdersByDate] = useState<Record<string, BowlOrder[]>>({});
  const [totalBowls, setTotalBowls] = useState(0);
  const [customDateInput, setCustomDateInput] = useState('');
  const [customDateError, setCustomDateError] = useState('');
  const [previewDates, setPreviewDates] = useState<string[]>([]);
  const [isCustomDateActive, setIsCustomDateActive] = useState(false);
  const [previewLocation, setPreviewLocation] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOatSoaking, setSelectedOatSoaking] = useState<string>('dairy-yoghurt');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [extraToppings, setExtraToppings] = useState<Record<string, number>>({});
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [needPaperSpoons, setNeedPaperSpoons] = useState(false);
  const [addressErrors, setAddressErrors] = useState({
    firstName: '',
    lastName: '',
    addressLine1: '',
    city: '',
    phoneNumber: ''
  });
  
  // T&Cs modal state
  const [showTCModal, setShowTCModal] = useState(false);
  const [hasAcceptedTC, setHasAcceptedTC] = useState(false);
  
  const datePickerRef = useRef<HTMLInputElement>(null);

  // Get delivery dates based on selected location
  const getValidDeliveryDates = () => {
    const locationConfig = deliveryConfig[selectedLocation];
    
    if (!locationConfig) {
      return getAutomaticDeliveryDates();
    }

    const excludedDates = locationConfig.excludedDates || [];

    if (locationConfig.useCustomDates) {
      const today = new Date();
      return locationConfig.customDates.filter(dateStr => {
        const date = new Date(dateStr);
        return date > today && !excludedDates.includes(dateStr);
      });
    }

    const automaticDates = getAutomaticDeliveryDates();
    return automaticDates.filter(dateStr => !excludedDates.includes(dateStr));
  };

  // Auto delivery logic
  const getAutomaticDeliveryDates = () => {
    const today = new Date();
    const validDates: string[] = [];
    const cutoffDate = new Date();
    cutoffDate.setDate(today.getDate() + 2); // 2-day cutoff
    
    // Target days: 1=Monday, 3=Wednesday, 5=Friday
    const deliveryDays = [1, 3];
    
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
      setPostcodeError('Please enter a valid UK postcode.');
      return false;
    }
    
      const excludedPrefixes = locationConfig.postcodeValidation.excludedPrefixes || [];
      const isExcluded = excludedPrefixes.some(prefix => {
        const upperPrefix = prefix.toUpperCase();
        if (cleanPostcode.startsWith(upperPrefix)) {
          const nextChar = cleanPostcode.slice(upperPrefix.length, upperPrefix.length + 1);
          return nextChar === '' || /\d/.test(nextChar);
        }
        return false;
      });

      if (isExcluded) {
        setPostcodeError(`Sorry, we don't deliver to this postcode.`);
        return false;
      }
    
    // Check if postcode matches valid prefixes
    const isValid = locationConfig.postcodeValidation.validPrefixes.some(prefix => 
      cleanPostcode.startsWith(prefix.toUpperCase())
    );

    if (!isValid) {
      setPostcodeError(`Sorry, we don't deliver to this postcode.`);
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
    const initialOrders: Record<string, BowlOrder[]> = {};
    previewDates.forEach(date => {
      initialOrders[date] = [];
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
    
    // Validate: must be Mon/Wed and past cutoff
    if (![1, 3].includes(dayOfWeek)) {
      setCustomDateError('Please select a Monday or Wednesday.');
      return;
    }
    
    if (selectedDay <= cutoffDate) {
      setCustomDateError('Date must be more than 2 days in advance.');
      return;
    }
    
    const locationConfig = deliveryConfig[selectedLocation];
    const excludedDates = locationConfig?.excludedDates || [];
    if (excludedDates.includes(dateValue)) {
      setCustomDateError('This date is not available for delivery.');
      return;
    }
    
    // Valid date - add to selection
    setCustomDateError('');
    toggleDateSelection(dateValue);
  };

  const getCurrentDateCart = () => {
    const currentDate = selectedDates[currentDateIndex];
    return ordersByDate[currentDate] || [];
  };

  const getCurrentDateTotal = () => {
    const cart = getCurrentDateCart();
    return cart.length;
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    // Only reset customization for Build Your Own
    if (!product.isSignature) {
      setSelectedOatSoaking('dairy-yoghurt');
      setSelectedToppings([]);
    } else {
      setSelectedOatSoaking('');
      setSelectedToppings([]);
    }
    setExtraToppings({});
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setSelectedOatSoaking('dairy-yoghurt');
    setSelectedToppings([]);
    setExtraToppings({});
  };

  const addToCart = () => {
    if (selectedProduct) {
      const currentDate = selectedDates[currentDateIndex];
      const newOrders = { ...ordersByDate };
      
      if (!newOrders[currentDate]) {
        newOrders[currentDate] = [];
      }
      
      const extraToppingsCost = Object.values(extraToppings).reduce((sum, qty) => sum + qty, 0);
      const totalPrice = selectedProduct.price + extraToppingsCost;
      
      const newBowl: BowlOrder = {
        productId: selectedProduct.id,
        oatSoaking: selectedProduct.isSignature ? null : selectedOatSoaking,
        toppings: selectedProduct.isSignature ? [] : [...selectedToppings],
        extraToppings: { ...extraToppings },
        price: totalPrice,
        isSignature: selectedProduct.isSignature || false
      };
      
      newOrders[currentDate].push(newBowl);
      setOrdersByDate(newOrders);
      
      const total = Object.values(newOrders).reduce((sum, dateOrders) => {
        return sum + dateOrders.length;
      }, 0);
      setTotalBowls(total);
      
      closeProductModal();
    }
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
      // Check if this is the last date
      if (currentDateIndex < selectedDates.length - 1) {
        // Move to next date
        setCurrentDateIndex(currentDateIndex + 1);
      } else {
        // All dates completed, show T&Cs modal
        setShowTCModal(true);
      }
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
          needPaperSpoons: needPaperSpoons,
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

  const renderIngredientsWithStyling = (ingredients: string) => {
    if (!ingredients) {
      return null;
    }
    
    const allergens = [
      'ALMONDS', 'CASHEWS', 'HAZELNUTS', 'WALNUTS', 'OAT', 'OATS', 
      'MILK', 'METABISULPHITE', 'PEANUT', 'PEANUTS', 'SULPHUR', 'DIOXIDE', 'WHEAT', 'SOYA',
    ];
    
    const sections = ingredients.split(/(May contain:|May also contain:|Plant-based coconut \(base only\):|Made in a kitchen that also handles:|For allergens see ingredients in BOLD\.)/);
    
    return sections.map((section, sectionIndex) => {
      const isHeader = /^(May contain:|May also contain:|Plant-based coconut \(base only\):|Made in a kitchen that also handles:|For allergens see ingredients in BOLD\.)$/.test(section);
      
      if (isHeader) {
        return (
          <React.Fragment key={sectionIndex}>
            <br />
            <br />
            <span>{section}</span>
          </React.Fragment>
        );
      }
      
      const words = section.split(/(\s+)/);
      
      return words.map((word, wordIndex) => {
        const cleanWord = word.replace(/[.,;:()[\]]/g, '');
        
        const isAllergen = allergens.includes(cleanWord);
        
        if (isAllergen) {
          return (
            <span key={`${sectionIndex}-${wordIndex}`} className="font-bold underline">
              {word}
            </span>
          );
        }
        return <span key={`${sectionIndex}-${wordIndex}`}>{word}</span>;
      });
    });
  };

  const getTotalPrice = () => {
    return Object.values(ordersByDate).reduce((total, dateOrders) => {
      return total + dateOrders.reduce((dateTotal, bowl) => {
        return dateTotal + bowl.price;
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
                <p className="mb-6">Ordering 12 or more bowls? Give us an email at {' '}
                    <a href="mailto:elliesoats@hotmail.com" className="text-brand-green hover:underline font-medium">
                      elliesoats@hotmail.com
                    </a>{' '} or Instagram message at {' '}
                    <a href="https://instagram.com/ellies.oats" target="_blank" rel="noopener noreferrer" className="text-brand-green hover:underline font-medium">
                      @ellies.oats
                    </a> for our bulk-buy discount</p>
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
                      <div className="text-sm mt-1">
                        Delivery: {loc === 'Lancashire' ? 'Between 6am and 9am' : 'Between 9am and 1pm'}
                      </div>
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
                {selectedLocation == 'Lancashire' ?
                      <p className="font-semibold mb-6">Please note we deliver to most places in east Lancashire, excluding Colne & Barnoldswick</p>
                    : <p className="font-semibold mb-6">Please note we do not deliver to Bolton, Wigan, Oldham, Tameside or Stockport</p>}
                
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
                      <div className="text-sm text-dark">Select any Monday or Wednesday beyond 3 weeks</div>
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
                
                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product) => {
                    const currentCart = getCurrentDateCart();
                    const quantity = currentCart.filter(bowl => bowl.productId === product.id).length;
                    return (
                      <div 
                        key={product.id} 
                        onClick={() => openProductModal(product)}
                        className="relative cursor-pointer p-6 border-2 border-brand-beige rounded-xl hover:border-brand-green hover:shadow-lg transition-all duration-200 group flex gap-4"
                      >
                        {product.monthlySpecial && 
                          <div className="absolute top-3 right-3 bg-brand-green text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                            MONTHLY SPECIAL
                          </div>
                        }
                        
                        {/* Product Image */}
                        <div className="shrink-0">
                          <Image 
                            src={product.image} 
                            alt={product.name}
                            width={120}
                            height={120}
                            className="rounded-lg object-cover"
                          />
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="font-bold text-lg mb-1">{product.name}</div>
                          <div className="text-brand-green font-bold text-xl mb-2">£{product.price.toFixed(2)}</div>
                          <div className="text-sm text-zinc-600 mb-3">{product.description}</div>
                          
                          {quantity > 0 && (
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-brand-beige">
                              <span className="text-sm font-medium text-brand-green">Added to cart</span>
                              <span className="bg-brand-green text-white font-bold px-3 py-1 rounded-full text-sm">{quantity}</span>
                            </div>
                          )}
                          
                          <div className="mt-3 text-brand-green text-sm font-medium group-hover:underline">
                          </div>
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

                  <div className="flex items-center gap-3 p-4 bg-brand-beige-light rounded-lg border-2 border-brand-beige">
                    <input
                      id="needPaperSpoons"
                      type="checkbox"
                      checked={needPaperSpoons}
                      onChange={(e) => setNeedPaperSpoons(e.target.checked)}
                      className="w-5 h-5 text-brand-green bg-background border-brand-beige rounded focus:ring-brand-green focus:ring-2 cursor-pointer"
                    />
                    <label htmlFor="needPaperSpoons" className="text-sm font-medium cursor-pointer select-none">
                      Need paper spoons?
                    </label>
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
                    <div className="flex justify-between"><span>Delivery Time:</span><span className="font-medium">{selectedLocation === 'Lancashire' ? 'Between 6am and 9am' : 'Between 9am and 1pm'}</span></div>
                    <div className="flex justify-between"><span>Address:</span><span className="font-medium text-right">{addressLine1}{addressLine2 && `, ${addressLine2}`}, {city}, {postcode.toUpperCase()}</span></div>
                    {deliveryNotes && <div className="flex justify-between"><span>Delivery Notes:</span><span className="font-medium text-right">{deliveryNotes}</span></div>}
                    <div className="flex justify-between"><span>Phone:</span><span className="font-medium">{phoneNumber}</span></div>
                    {needPaperSpoons && <div className="flex justify-between"><span>Paper Spoons:</span><span className="font-medium"> Yes</span></div>}
                  </div>
                </div>

                {/* Orders by Date */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Orders by Delivery Date</h3>
                  {selectedDates.map(date => {
                    const dateOrders = ordersByDate[date];
                    const dateTotal = dateOrders.reduce((sum, bowl) => sum + bowl.price, 0);
                    
                    return (
                      <div key={date} className="mb-4">
                        <h4 className="font-semibold mb-2">📅 {formatDate(date)}</h4>
                        <div className="space-y-2">
                          {dateOrders.map((bowl, index) => {
                            const product = products.find(p => p.id === bowl.productId)!;
                            const toppingNames = bowl.toppings.map(id => 
                              toppingOptions.find(t => t.id === id)?.name
                            ).filter(Boolean);
                            const extraToppingsList = Object.entries(bowl.extraToppings)
                              .map(([id, qty]) => `${toppingOptions.find(t => t.id === id)?.name} x${qty}`)
                              .filter(Boolean);
                            
                            return (
                              <div key={`${date}-${index}`} className="flex justify-between text-sm border-b border-brand-beige pb-2">
                                <div className="flex-1">
                                  <div className="font-medium">{product.name}</div>
                                  {!bowl.isSignature && 
                                    <div className="text-xs">
                                      {bowl.oatSoaking && oatSoakingOptions.find(o => o.id === bowl.oatSoaking)?.name}
                                    </div>
                                  }
                                  {!bowl.isSignature && toppingNames.length > 0 && (
                                    <div className="text-xs">
                                      Toppings: {toppingNames.join(', ')}
                                    </div>
                                  )}
                                  {extraToppingsList.length > 0 && (
                                    <div className="text-xs text-zinc-600">
                                      {bowl.isSignature ? 'Added' : 'Extra'}: {extraToppingsList.join(', ')}
                                    </div>
                                  )}
                                </div>
                                <span className="font-medium">£{bowl.price.toFixed(2)}</span>
                              </div>
                            );
                          })}
                          <div className="flex justify-between font-medium pt-2">
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

                <div className="flex space-x-4 justify-between">
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
                        const dateOrders = ordersByDate[date];
                        if (!dateOrders || dateOrders.length === 0) return null;
                        
                        return (
                          <div key={date} className="pb-3 mb-3 border-b border-brand-beige last:border-0">
                            <div className="text-xs font-medium text-brand-green mb-2">
                              {formatDate(date)}
                            </div>
                            {dateOrders.map((bowl, bowlIdx) => {
                              const product = products.find(p => p.id === bowl.productId)!;
                              const toppingNames = bowl.toppings.map(id => 
                                toppingOptions.find(t => t.id === id)?.name
                              ).filter(Boolean);
                              
                              return (
                                <div key={`${date}-${bowlIdx}`} className="py-2 border-b border-brand-beige/50 last:border-0">
                                  <div className="flex justify-between items-start mb-1">
                                    <div className="text-sm font-medium">{product.name}</div>
                                    <div className="font-medium text-sm">£{bowl.price.toFixed(2)}</div>
                                  </div>
                                  {!bowl.isSignature && 
                                    <>
                                      <div className="text-xs text-zinc-600">
                                        {bowl.oatSoaking && oatSoakingOptions.find(o => o.id === bowl.oatSoaking)?.name}
                                      </div>
                                      {toppingNames.length > 0 && (
                                        <div className="text-xs text-zinc-600 mt-1">
                                          {toppingNames.join(', ')}
                                        </div>
                                      )}
                                    </>
                                  }
                                  {Object.keys(bowl.extraToppings).length > 0 && (
                                    <div className="text-xs text-brand-green mt-1">
                                      {bowl.isSignature ? 'Added' : 'Extra'}: {Object.entries(bowl.extraToppings)
                                        .map(([id, qty]) => `${toppingOptions.find(t => t.id === id)?.name} x${qty}`)
                                        .join(', ')}
                                    </div>
                                  )}
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

      {/* Product Modal */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeProductModal}
        >
          <div 
            className="bg-background rounded-2xl shadow-2xl max-w-5xl w-full relative max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeProductModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-brand-beige flex items-center justify-center transition z-10"
            >
              <span className="text-2xl text-zinc-600">×</span>
            </button>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-8">
              {/* Two-column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* LEFT COLUMN - Product Info */}
                <div>
                  {/* Product Image */}
                  <div className="mb-6 flex justify-center">
                    <Image 
                      src={selectedProduct.image} 
                      alt={selectedProduct.name}
                      width={200}
                      height={200}
                      className="rounded-xl object-cover"
                    />
                  </div>

                  {/* Product details */}
                  <div className="mb-6">
                    {selectedProduct.monthlySpecial && 
                      <div className="inline-block bg-brand-green text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                        MONTHLY SPECIAL
                      </div>
                    }
                    <h3 className="text-2xl font-bold mb-2">{selectedProduct.name}</h3>
                    <p className="text-brand-green font-bold text-2xl mb-3">£{selectedProduct.price.toFixed(2)}</p>
                    <p className="mb-4">{selectedProduct.description}</p>
                    
                  {/* Ingredients */}
                  {selectedProduct.ingredients && (
                    <div className="mt-4 p-4 bg-brand-beige/50 rounded-lg">
                      <h4 className="text-sm font-semibold mb-2">Ingredients</h4>
                      <div className="text-sm leading-relaxed">
                        {renderIngredientsWithStyling(selectedProduct.ingredients)}
                        <div>For allergens see ingredients in <strong className='underline'>BOLD.</strong></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN - Customization */}
              <div className="border-l border-brand-beige pl-8">
                {selectedProduct.isSignature ? (
                  /* SIGNATURE BOWL - Only show optional extras */
                  <>
                    {/* Extra Toppings Section */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">Add Optional Toppings - £1 each</h4>
                      
                      <div className="space-y-2">
                        {toppingOptions.map(topping => {
                          const quantity = extraToppings[topping.id] || 0;
                          return (
                            <div
                              key={topping.id}
                              className="flex items-center justify-between p-2 border border-brand-beige rounded-lg hover:border-brand-green transition"
                            >
                              <span className="text-sm">{topping.name}</span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    const newQuantity = Math.max(0, quantity - 1);
                                    if (newQuantity === 0) {
                                      const newExtras = { ...extraToppings };
                                      delete newExtras[topping.id];
                                      setExtraToppings(newExtras);
                                    } else {
                                      setExtraToppings({ ...extraToppings, [topping.id]: newQuantity });
                                    }
                                  }}
                                  className="cursor-pointer w-7 h-7 rounded-full border border-brand-green text-brand-green hover:bg-brand-green hover:text-white flex items-center justify-center text-lg font-bold transition"
                                >
                                  −
                                </button>
                                <span className="w-8 text-center font-medium">{quantity}</span>
                                <button
                                  onClick={() => {
                                    setExtraToppings({ ...extraToppings, [topping.id]: quantity + 1 });
                                  }}
                                  className="cursor-pointer w-7 h-7 rounded-full border border-brand-green text-brand-green hover:bg-brand-green hover:text-white flex items-center justify-center text-lg font-bold transition"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  /* BUILD YOUR OWN - Show full customization */
                  <>
                    {/* Oat Soaking Selection */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Choose your oat soaking</h4>
                      <div className="space-y-2">
                        {oatSoakingOptions.map(option => (
                          <button
                            key={option.id}
                            onClick={() => setSelectedOatSoaking(option.id)}
                            className={`cursor-pointer w-full p-3 text-sm border-2 rounded-lg text-left transition flex items-center justify-between ${
                              selectedOatSoaking === option.id
                                ? 'border-brand-green bg-brand-beige/30'
                                : 'border-brand-beige hover:border-brand-green'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              {option.name}
                              {option.isGlutenFree && (
                                <span className="text-xs bg-brand-green text-white px-2 py-0.5 rounded">GF available</span>
                              )}
                            </span>
                            {selectedOatSoaking === option.id && (
                              <span className="text-brand-green">✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Toppings Selection */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">Pick 4 toppings</h4>
                      <p className="text-sm text-zinc-600 mb-3">
                        {selectedToppings.length}/4 selected
                        {selectedToppings.length > 4 && (
                          <span className="text-brand-error ml-2">Maximum 4 toppings</span>
                        )}
                      </p>
                      
                      {/* Two-column grid for toppings */}
                      <div className="grid grid-cols-2 gap-4">
                        {toppingCategories
                          .filter(cat => cat.id !== 'extras') // Exclude extras from main grid
                          .map(category => {
                            const categoryToppings = toppingOptions.filter(t => t.category === category.id);
                            return (
                              <div key={category.id}>
                                <h5 className="text-md font-medium mb-2">{category.name}</h5>
                                <div className="space-y-1">
                                  {categoryToppings.map(topping => {
                                    const isSelected = selectedToppings.includes(topping.id);
                                    const canSelect = selectedToppings.length < 4 || isSelected;
                                    
                                    return (
                                      <button
                                        key={topping.id}
                                        onClick={() => {
                                          if (isSelected) {
                                            setSelectedToppings(selectedToppings.filter(id => id !== topping.id));
                                          } else if (canSelect) {
                                            setSelectedToppings([...selectedToppings, topping.id]);
                                          }
                                        }}
                                        disabled={!canSelect && !isSelected}
                                        className={`cursor-pointer w-full p-2 text-sm border rounded-lg text-left transition flex items-center justify-between ${
                                          isSelected
                                            ? 'border-brand-beige bg-brand-beige/30'
                                            : canSelect
                                              ? 'border-brand-beige hover:border-brand-green'
                                              : 'border-brand-beige opacity-50 cursor-not-allowed'
                                        }`}
                                      >
                                        <span>{topping.name}</span>
                                        {isSelected && (
                                          <span className="text-brand-green">✓</span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    {/* Extra Toppings Section */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">Additional toppings - £1 each</h4>
                      
                      <div className="space-y-2">
                        {toppingOptions.map(topping => {
                          const quantity = extraToppings[topping.id] || 0;
                          return (
                            <div
                              key={topping.id}
                              className="flex items-center justify-between p-2 border border-brand-beige rounded-lg hover:border-brand-green transition"
                            >
                              <span className="text-sm">{topping.name}</span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    const newQuantity = Math.max(0, quantity - 1);
                                    if (newQuantity === 0) {
                                      const newExtras = { ...extraToppings };
                                      delete newExtras[topping.id];
                                      setExtraToppings(newExtras);
                                    } else {
                                      setExtraToppings({ ...extraToppings, [topping.id]: newQuantity });
                                    }
                                  }}
                                  className="cursor-pointer w-7 h-7 rounded-full border border-brand-green text-brand-green hover:bg-brand-green hover:text-white flex items-center justify-center text-lg font-bold transition"
                                >
                                  −
                                </button>
                                <span className="w-8 text-center font-medium">{quantity}</span>
                                <button
                                  onClick={() => {
                                    setExtraToppings({ ...extraToppings, [topping.id]: quantity + 1 });
                                  }}
                                  className="cursor-pointer w-7 h-7 rounded-full border border-brand-green text-brand-green hover:bg-brand-green hover:text-white flex items-center justify-center text-lg font-bold transition"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            </div>

            {/* Action Buttons at Bottom */}
            <div className="border-t border-brand-beige p-6">
              {!selectedProduct.isSignature && selectedToppings.length < 4 && (
                <p className="text-sm text-brand-error text-center mb-3">
                  Please select {4 - selectedToppings.length} more topping{4 - selectedToppings.length !== 1 ? 's' : ''} to continue
                </p>
              )}
              <div className="flex space-x-3">
                <button
                  onClick={closeProductModal}
                  className="flex-1 px-6 border-2 border-brand-beige text-zinc-700 rounded-lg font-semibold hover:bg-brand-beige transition"
                >
                  Cancel
                </button>
                <button
                  onClick={addToCart}
                  disabled={!selectedProduct.isSignature && selectedToppings.length < 4}
                  className="flex-1 px-6 py-3 bg-brand-green hover:bg-brand-green-hover disabled:bg-brand-grey disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
                >
                  Add for £{(selectedProduct.price + Object.values(extraToppings).reduce((s, q) => s + q, 0)).toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms & Conditions Modal */}
      {showTCModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
            }
          }}
        >
          <div 
            className="bg-background rounded-2xl shadow-2xl max-w-4xl w-full relative max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-brand-beige">
              <h2 className="text-2xl font-bold">Terms & Conditions</h2>
              <p className="text-sm text-zinc-600 mt-1">Please read and accept our terms to continue</p>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6 flex-1">
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-bold mb-3">Additional Info</h3>
                <ul className="space-y-3 mb-6">
                  <li>Including day of delivery, bowls will have a two day shelf life. Keep refrigerated.</li>
                  <li>Bowls will be left on the doorstep, similar to a milk delivery. Customers are responsible for ensuring a safe and suitable drop-off location. If you require the bowl handing to you, this must be specified in the &apos;additional info&apos; box when placing your order. If you would like your bowls delivered before a specific time we will do our best, but this cannot be guaranteed - must be specified in the &apos;additional info&apos; box when placing your order.</li>
                  <li>We reserve the right to make minor changes to menus or delivery schedules where necessary, with customers notified in advance where possible.</li>
                </ul>

                <h3 className="text-lg font-bold mb-3">Allergens</h3>
                <ul className="space-y-3 mb-6">
                  <li>All bowls are prepared in a kitchen that handles all 14 major allergens. Therefore, we cannot guarantee any dish is allergen-free. Customers with food allergies or intolerances should contact us before ordering (via Instagram or email) to discuss ingredients and suitability. By placing an order, customers acknowledge and accept this risk.</li>
                </ul>

                <h3 className="text-lg font-bold mb-3">Refunds & Cancellations</h3>
                <ul className="space-y-3">
                  <li>Due to the perishable nature of our food, refunds are not available once an order has been placed.</li>
                  <li>No refunds will be issued for missed deliveries where access to the delivery location was unavailable.</li>
                  <li>In the unlikely event that we are unable to fulfil a delivery, customers will be offered a replacement delivery or refund.</li>
                </ul>
              </div>
            </div>

            {/* Footer with checkbox and button */}
            <div className="border-t border-brand-beige p-6">
              <label className="flex items-start space-x-3 mb-4 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={hasAcceptedTC}
                  onChange={(e) => setHasAcceptedTC(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-brand-beige checked:bg-brand-green checked:border-brand-green cursor-pointer"
                />
                <span className="text-sm group-hover:text-brand-green transition">
                  I have read and accept the Terms & Conditions, including allergen information and refund policy
                </span>
              </label>
              
              <button
                onClick={() => {
                  setShowTCModal(false);
                  setCurrentStep(5);
                }}
                disabled={!hasAcceptedTC}
                className="w-full px-6 py-3 bg-brand-green hover:bg-brand-green-hover disabled:bg-brand-grey disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
              >
                Continue to Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
