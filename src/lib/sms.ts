import { storage } from './storage';
import type { CartItem, PackageDelivery, RideBooking } from './storage';

const VENDOR_PHONE = '1234567890'; // Replace with actual vendor phone

export const openSMS = (message: string) => {
  const encodedMessage = encodeURIComponent(message);
  window.location.href = `sms:${VENDOR_PHONE}?body=${encodedMessage}`;
};

const getUserInfoBlock = (isHi: boolean, headerSuffix: string = '', includeAddress: boolean = true) => {
  const profile = storage.getProfile();
  if (!profile) return '';

  const userDetailsHeader = isHi ? `यूज़र की जानकारी${headerSuffix}` : `USER DETAILS${headerSuffix}`;
  const nameLabel = isHi ? '👤 नाम' : '👤 Name';
  const phoneLabel = isHi ? '📱 फोन' : '📱 Phone';

  let block = `${userDetailsHeader}\n\n${nameLabel}: ${profile.name}\n${phoneLabel}: ${profile.phone}`;
  
  if (includeAddress) {
    const addressLabel = isHi ? '📍 पता' : '📍 Address';
    block += `\n${addressLabel}: ${profile.village}, ${profile.landmark}, ${profile.pincode}`;
  }

  return block;
};

export const generateGrocerySMS = (items: CartItem[], subtotal: number, deliveryFee: number, total: number, lang: 'en' | 'hi') => {
  const isHi = lang === 'hi';
  const itemsText = items.map(item => `${isHi ? item.nameHindi : item.name} - ${item.quantity} ${item.unit} - ₹${item.price * item.quantity}`).join('\n');
  
  const title = isHi ? '🛒 किराने का ऑर्डर' : '🛒 GROCERIES ORDER';
  const itemsLabel = isHi ? '📦 सामान:' : '📦 ITEMS:';
  const subtotalLabel = isHi ? '💰 उप-कुल' : '💰 Subtotal';
  const deliveryLabel = isHi ? '🚚 डिलीवरी' : '🚚 Delivery';
  const totalLabel = isHi ? '✅ कुल' : '✅ TOTAL';
  const paymentLabel = isHi ? 'पेमेंट: कैश ऑन डिलीवरी' : 'Payment: Cash on Delivery';

  const userBlock = getUserInfoBlock(isHi, '');

  const message = `001

${userBlock}

${title}

${itemsLabel}
${itemsText}

${subtotalLabel}: ₹${subtotal}
${deliveryLabel}: ₹${deliveryFee}
━━━━━━━━━━━━
${totalLabel}: ₹${total}

${paymentLabel}`;

  openSMS(message);
};

export const generateRideSMS = (ride: Omit<RideBooking, 'id' | 'timestamp' | 'status'>, lang: 'en' | 'hi') => {
  const isHi = lang === 'hi';
  
  const vehicleName = ride.vehicle === 'scooter' 
    ? (isHi ? 'स्कूटर' : 'Scooter') 
    : (isHi ? 'रिक्शा' : 'Rickshaw');
  
  const title = isHi ? '🛵 राइड बुकिंग' : '🛵 RIDE BOOKING';
  const pickupLabel = isHi ? '📍 पिकअप' : '📍 Pickup';
  const dropLabel = isHi ? '📍 ड्रॉप' : '📍 Drop';
  const vehicleLabel = isHi ? '🚗 वाहन' : '🚗 Vehicle';
  const distanceLabel = isHi ? '🛣️ दूरी' : '🛣️ Distance';
  const fareLabel = isHi ? '💰 किराया' : '💰 Fare';
  const statusLabel = isHi ? '📌 स्थिति: अनुरोध किया गया' : '📌 Status: REQUESTED';

  const userBlock = getUserInfoBlock(isHi, '', false);

  const message = `002

${userBlock}

${title}

${pickupLabel}: ${ride.pickup}
${dropLabel}: ${ride.drop}
${vehicleLabel}: ${vehicleName}
${distanceLabel}: ${ride.distance} km

${fareLabel}: ₹${ride.fare}

━━━━━━━━━━━━
${statusLabel}`;

  openSMS(message);
};

export const generatePackageSMS = (pkg: Omit<PackageDelivery, 'id' | 'timestamp' | 'status'>, lang: 'en' | 'hi') => {
  const isHi = lang === 'hi';
  
  const paymentText = (pkg.payment === 'COD' && pkg.codAmount)
    ? (isHi ? `कैश (₹${pkg.codAmount})` : `COD (₹${pkg.codAmount})`)
    : (isHi ? 'प्रीपेड' : 'Prepaid');

  const title = isHi ? '📦 कूरियर डिलीवरी' : '📦 PACKAGE DELIVERY';
  const pickupLabel = isHi ? '📍 पिकअप' : '📍 Pickup';
  const dropLabel = isHi ? '📍 ड्रॉप' : '📍 Drop';
  const receiverNameLabel = isHi ? '👤 पाने वाला' : '👤 Receiver';
  const receiverPhoneLabel = isHi ? '📱 फोन' : '📱 Phone';
  const packageLabel = isHi ? '📦 सामान' : '📦 Package';
  const weightLabel = isHi ? '⚖️ वजन' : '⚖️ Weight';
  const paymentLabel = isHi ? '💰 पेमेंट' : '💰 Payment';
  const statusLabel = isHi ? '📌 स्थिति: अनुरोध किया गया' : '📌 Status: REQUESTED';

  const userBlock = getUserInfoBlock(isHi, '-', false);

  const message = `003

${userBlock}

${title}

${pickupLabel}: ${pkg.pickup}
${dropLabel}: ${pkg.drop}

${receiverNameLabel}: ${pkg.receiverName}
${receiverPhoneLabel}: ${pkg.receiverPhone}

${packageLabel}: ${pkg.packageType}
${weightLabel}: ${pkg.weight || 'N/A'}

${paymentLabel}: ${paymentText}

━━━━━━━━━━━━
${statusLabel}`;

  openSMS(message);
};
