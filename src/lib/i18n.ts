import { useState, useEffect } from 'react';
import { storage } from './storage';

export const t = {
  en: {
    // Onboarding
    welcome: "Welcome to Gram Connect",
    subtitle: "Order groceries via SMS",
    name: "Name",
    namePlaceholder: "e.g. Rahul Kumar",
    phone: "Phone",
    phonePlaceholder: "10-digit mobile number",
    village: "Village",
    villagePlaceholder: "e.g. Rampur",
    landmark: "Landmark",
    landmarkPlaceholder: "e.g. Near Shiv Mandir",
    pincode: "Pincode",
    pincodePlaceholder: "6-digit pincode",
    start: "Start Ordering",

    // Navigation
    home: "Home",
    ride: "Ride",
    package: "Package",
    cart: "Cart",
    profile: "Profile",

    // General Actions
    add: "Add",
    checkout: "Checkout (SMS)",
    startShopping: "Start Shopping",
    saveProfile: "Save Profile",
    viewHistory: "View History",
    
    // Groceries
    gramMart: "Gram Connect",
    dailyNeeds: "Daily Needs",
    all: "All",
    emptyCart: "Your cart is empty",
    subtotal: "Subtotal",
    deliveryFee: "Delivery Fee",
    total: "Total",
    reviewCart: "Review Cart",

    // Ride
    bookRide: "Book a Ride",
    pickupLocation: "Pickup",
    dropLocation: "Drop",
    selectVehicle: "Vehicle",
    scooter: "Scooter",
    rickshaw: "Rickshaw",
    estimatedDistance: "Distance (km)",
    estimatedFare: "Estimated Fare",
    bookRideSMS: "Book Ride (SMS)",

    // Package
    sendPackage: "Send Package",
    receiverName: "Receiver Name",
    receiverPhone: "Receiver Phone",
    packageContents: "Contents",
    weight: "Weight",
    weightPlaceholder: "e.g. 2 kg or 500g",
    paymentType: "Payment",
    prepaid: "Prepaid",
    cod: "COD",
    codAmount: "Amount to Collect (₹)",
    sendPackageSMS: "Send Package (SMS)",

    // History
    activityHistory: "Activity History",
    groceries: "Groceries",
    rides: "Rides",
    packages: "Packages",
    items: "items",

    // Alerts
    completeProfileFirst: "Please complete profile before booking.",
    profileSaved: "Profile Saved ✓",
  },
  hi: {
    // Onboarding
    welcome: "Welcome to Gram Connect", // Keep Welcome to Gram Connect ONLY in English as requested earlier
    subtitle: "SMS से सामान मंगाएं",
    name: "नाम",
    namePlaceholder: "उदा. राहुल कुमार",
    phone: "फोन",
    phonePlaceholder: "10-अंको का मोबाइल नंबर",
    village: "गांव",
    villagePlaceholder: "उदा. रामपुर",
    landmark: "पता",
    landmarkPlaceholder: "उदा. शिव मंदिर के पास",
    pincode: "पिनकोड",
    pincodePlaceholder: "6-अंको का पिनकोड",
    start: "ऑर्डर शुरू करें",

    // Navigation
    home: "होम",
    ride: "राइड",
    package: "कूरियर",
    cart: "कार्ट",
    profile: "प्रोफाइल",

    // General Actions
    add: "जोड़ें",
    checkout: "ऑर्डर करें (SMS)",
    startShopping: "खरीदारी शुरू करें",
    saveProfile: "प्रोफाइल सेव करें",
    viewHistory: "हिस्ट्री देखें",
    
    // Groceries
    gramMart: "ग्राम कनेक्ट",
    dailyNeeds: "रोजमर्रा की जरूरतें",
    all: "सभी",
    emptyCart: "आपकी कार्ट खाली है",
    subtotal: "उप-कुल",
    deliveryFee: "डिलीवरी शुल्क",
    total: "कुल",
    reviewCart: "कार्ट देखें",

    // Ride
    bookRide: "राइड बुक करें",
    pickupLocation: "पिकअप",
    dropLocation: "ड्रॉप",
    selectVehicle: "वाहन",
    scooter: "स्कूटर",
    rickshaw: "रिक्शा",
    estimatedDistance: "दूरी (किमी)",
    estimatedFare: "अनुमानित किराया",
    bookRideSMS: "राइड बुक करें (SMS)",

    // Package
    sendPackage: "कूरियर भेजें",
    receiverName: "पाने वाले का नाम",
    receiverPhone: "फोन",
    packageContents: "सामान",
    weight: "वजन",
    weightPlaceholder: "उदा. 2 kg या 500g",
    paymentType: "पेमेंट",
    prepaid: "प्रीपेड",
    cod: "कैश",
    codAmount: "रकम (₹)",
    sendPackageSMS: "कूरियर भेजें (SMS)",

    // History
    activityHistory: "आपकी एक्टिविटी",
    groceries: "किराना",
    rides: "राइड्स",
    packages: "कूरियर",
    items: "सामान",

    // Alerts
    completeProfileFirst: "बुकिंग से पहले प्रोफाइल पूरी करें।",
    profileSaved: "प्रोफाइल सेव हो गई ✓",
  }
};

export const useTranslation = () => {
  const [lang, setLang] = useState<'en' | 'hi'>(() => {
    const profile = storage.getProfile();
    return profile?.language || 'en';
  });

  useEffect(() => {
    const handleLanguageChange = () => {
      const profile = storage.getProfile();
      setLang(profile?.language || 'en');
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  return {
    t: t[lang],
    lang
  };
};
