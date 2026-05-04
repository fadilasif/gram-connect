export interface UserProfile {
  name: string;
  phone: string;
  village: string;
  landmark: string;
  pincode: string;
  language?: 'en' | 'hi';
}

export interface GroceryItem {
  id: string;
  name: string;
  nameHindi: string;
  price: number;
  unit: string;
  category: string;
}

export interface CartItem extends GroceryItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'requested' | 'completed';
  timestamp: number;
}

export interface RideBooking {
  id: string;
  pickup: string;
  drop: string;
  vehicle: 'scooter' | 'rickshaw';
  distance: number;
  fare: number;
  status: 'assigned' | 'ongoing' | 'completed' | 'requested';
  timestamp: number;
}

export interface PackageDelivery {
  id: string;
  pickup: string;
  drop: string;
  receiverName: string;
  receiverPhone: string;
  packageType: string;
  payment: 'COD' | 'prepaid';
  codAmount?: number;
  status: 'assigned' | 'picked' | 'out_for_delivery' | 'delivered' | 'requested';
  timestamp: number;
}

const STORAGE_KEYS = {
  PROFILE: 'gram_mart_profile',
  CART: 'gram_mart_cart',
  ORDERS: 'gram_mart_orders',
  RIDES: 'gram_mart_rides',
  PACKAGES: 'gram_mart_packages',
};

// Generic getter/setter
const getLocal = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage`, error);
    return fallback;
  }
};

const setLocal = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage`, error);
  }
};

export const storage = {
  // Profile
  getProfile: () => getLocal<UserProfile | null>(STORAGE_KEYS.PROFILE, null),
  setProfile: (profile: UserProfile) => setLocal(STORAGE_KEYS.PROFILE, profile),
  isProfileComplete: () => {
    const p = storage.getProfile();
    return !!(p && p.name && p.phone && p.village && p.landmark && p.pincode);
  },

  // Cart
  getCart: () => getLocal<CartItem[]>(STORAGE_KEYS.CART, []),
  setCart: (cart: CartItem[]) => setLocal(STORAGE_KEYS.CART, cart),
  clearCart: () => setLocal(STORAGE_KEYS.CART, []),

  // Orders
  getOrders: () => getLocal<Order[]>(STORAGE_KEYS.ORDERS, []),
  addOrder: (order: Order) => {
    const orders = storage.getOrders();
    setLocal(STORAGE_KEYS.ORDERS, [order, ...orders]);
  },

  // Rides
  getRides: () => getLocal<RideBooking[]>(STORAGE_KEYS.RIDES, []),
  addRide: (ride: RideBooking) => {
    const rides = storage.getRides();
    setLocal(STORAGE_KEYS.RIDES, [ride, ...rides]);
  },

  // Packages
  getPackages: () => getLocal<PackageDelivery[]>(STORAGE_KEYS.PACKAGES, []),
  addPackage: (pkg: PackageDelivery) => {
    const packages = storage.getPackages();
    setLocal(STORAGE_KEYS.PACKAGES, [pkg, ...packages]);
  },
};
