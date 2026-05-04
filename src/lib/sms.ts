import type { CartItem, PackageDelivery, RideBooking } from './storage';

const VENDOR_PHONE = '1234567890'; // Replace with actual vendor phone

export const openSMS = (message: string) => {
  const encodedMessage = encodeURIComponent(message);
  window.location.href = `sms:${VENDOR_PHONE}?body=${encodedMessage}`;
};

export const generateGrocerySMS = (items: CartItem[], subtotal: number, deliveryFee: number, total: number, lang: 'en' | 'hi') => {
  const isHi = lang === 'hi';
  const itemsText = items.map(item => `${isHi ? item.nameHindi : item.name} - ${item.quantity}${item.unit}`).join('\n');
  
  const title = isHi ? 'ग्राम कनेक्ट ऑर्डर' : 'GRAM CONNECT ORDER';
  const subtotalLabel = isHi ? 'उप-कुल' : 'Subtotal';
  const deliveryLabel = isHi ? 'डिलीवरी' : 'Delivery';
  const totalLabel = isHi ? 'कुल' : 'Total';
  const paymentLabel = isHi ? 'पेमेंट: कैश (COD)' : 'Payment: COD';

  const message = `001
${title}

${itemsText}

${subtotalLabel}: ₹${subtotal}
${deliveryLabel}: ₹${deliveryFee}
${totalLabel}: ₹${total}

${paymentLabel}`;

  openSMS(message);
};

export const generateRideSMS = (ride: Omit<RideBooking, 'id' | 'timestamp' | 'status'>, lang: 'en' | 'hi') => {
  const isHi = lang === 'hi';
  
  let vehicleName = '';
  if (ride.vehicle === 'scooter') vehicleName = isHi ? 'स्कूटर' : 'Scooter';
  else vehicleName = isHi ? 'रिक्शा' : 'Rickshaw';
  
  const title = isHi ? 'राइड बुकिंग' : 'RIDE BOOKING';
  const pickupLabel = isHi ? 'पिकअप' : 'Pickup';
  const dropLabel = isHi ? 'ड्रॉप' : 'Drop';
  const vehicleLabel = isHi ? 'वाहन' : 'Vehicle';
  const distanceLabel = isHi ? 'दूरी' : 'Distance';
  const fareLabel = isHi ? 'किराया' : 'Fare';
  const statusLabel = isHi ? 'स्थिति: अनुरोध किया गया' : 'Status: REQUESTED';

  const message = `002
${title}

${pickupLabel}: ${ride.pickup}
${dropLabel}: ${ride.drop}
${vehicleLabel}: ${vehicleName}
${distanceLabel}: ${ride.distance} km
${fareLabel}: ₹${ride.fare}

${statusLabel}`;

  openSMS(message);
};

export const generatePackageSMS = (pkg: Omit<PackageDelivery, 'id' | 'timestamp' | 'status'>, lang: 'en' | 'hi') => {
  const isHi = lang === 'hi';
  
  let paymentText = '';
  if (pkg.payment === 'COD' && pkg.codAmount) {
    paymentText = isHi ? `कैश (₹${pkg.codAmount})` : `COD (₹${pkg.codAmount})`;
  } else {
    paymentText = isHi ? 'प्रीपेड' : 'Prepaid';
  }

  const title = isHi ? 'कूरियर' : 'PACKAGE DELIVERY';
  const pickupLabel = isHi ? 'पिकअप' : 'Pickup';
  const dropLabel = isHi ? 'ड्रॉप' : 'Drop';
  const receiverLabel = isHi ? 'पाने वाला' : 'Receiver';
  const phoneLabel = isHi ? 'फोन' : 'Phone';
  const packageLabel = isHi ? 'सामान' : 'Package';
  const paymentLabel = isHi ? 'पेमेंट' : 'Payment';
  const statusLabel = isHi ? 'स्थिति: अनुरोध किया गया' : 'Status: REQUESTED';

  const message = `002
${title}

${pickupLabel}: ${pkg.pickup}
${dropLabel}: ${pkg.drop}

${receiverLabel}: ${pkg.receiverName}
${phoneLabel}: ${pkg.receiverPhone}

${packageLabel}: ${pkg.packageType}
${paymentLabel}: ${paymentText}

${statusLabel}`;

  openSMS(message);
};
