import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../lib/storage';
import type { GroceryItem, CartItem } from '../lib/storage';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { 
  Store, Plus, Minus, ShoppingCart, 
  Bike, Package, ArrowRight, Percent, Sparkles, 
  Truck 
} from 'lucide-react';
import { useTranslation } from '../lib/i18n';

const GROCERY_ITEMS: GroceryItem[] = [
  // 🌾 Groceries
  { id: "g1", name: "Rice", nameHindi: "चावल", price: 60, unit: "kg", category: "groceries" },
  { id: "g2", name: "Wheat Flour", nameHindi: "आटा", price: 45, unit: "kg", category: "groceries" },
  { id: "g3", name: "Sugar", nameHindi: "चीनी", price: 45, unit: "kg", category: "groceries" },
  { id: "g4", name: "Salt", nameHindi: "नमक", price: 20, unit: "kg", category: "groceries" },
  { id: "g5", name: "Dal (Arhar)", nameHindi: "अरहर दाल", price: 140, unit: "kg", category: "groceries" },
  { id: "g6", name: "Dal (Moong)", nameHindi: "मूंग दाल", price: 120, unit: "kg", category: "groceries" },
  { id: "g7", name: "Cooking Oil", nameHindi: "तेल", price: 180, unit: "litre", category: "groceries" },
  { id: "g8", name: "Mustard Oil", nameHindi: "सरसों तेल", price: 200, unit: "litre", category: "groceries" },

  // 🥬 Vegetables
  { id: "v1", name: "Potato", nameHindi: "आलू", price: 30, unit: "kg", category: "vegetables" },
  { id: "v2", name: "Onion", nameHindi: "प्याज", price: 35, unit: "kg", category: "vegetables" },
  { id: "v3", name: "Tomato", nameHindi: "टमाटर", price: 40, unit: "kg", category: "vegetables" },
  { id: "v4", name: "Green Chilli", nameHindi: "हरी मिर्च", price: 60, unit: "kg", category: "vegetables" },
  { id: "v5", name: "Ginger", nameHindi: "अदरक", price: 120, unit: "kg", category: "vegetables" },
  { id: "v6", name: "Garlic", nameHindi: "लहसुन", price: 200, unit: "kg", category: "vegetables" },

  // 🥛 Dairy
  { id: "d1", name: "Milk", nameHindi: "दूध", price: 60, unit: "litre", category: "dairy" },
  { id: "d2", name: "Curd", nameHindi: "दही", price: 50, unit: "kg", category: "dairy" },
  { id: "d3", name: "Butter", nameHindi: "मक्खन", price: 55, unit: "100g", category: "dairy" },
  { id: "d4", name: "Paneer", nameHindi: "पनीर", price: 80, unit: "200g", category: "dairy" },

  // 🧴 Daily Needs
  { id: "dn1", name: "Soap", nameHindi: "साबुन", price: 40, unit: "piece", category: "daily" },
  { id: "dn2", name: "Detergent", nameHindi: "डिटर्जेंट", price: 45, unit: "500g", category: "daily" },
  { id: "dn3", name: "Toothpaste", nameHindi: "टूथपेस्ट", price: 60, unit: "tube", category: "daily" },
  { id: "dn4", name: "Matchbox", nameHindi: "माचिस", price: 5, unit: "pack", category: "daily" },
  { id: "dn5", name: "Candles", nameHindi: "मोमबत्ती", price: 30, unit: "pack", category: "daily" },

  // 🍪 Snacks
  { id: "s1", name: "Biscuits", nameHindi: "बिस्किट", price: 20, unit: "pack", category: "snacks" },
  { id: "s2", name: "Namkeen", nameHindi: "नमकीन", price: 30, unit: "pack", category: "snacks" },
  { id: "s3", name: "Chips", nameHindi: "चिप्स", price: 20, unit: "pack", category: "snacks" },
  { id: "s4", name: "Rusk", nameHindi: "रस्क", price: 35, unit: "pack", category: "snacks" },

  // ☕ Beverages
  { id: "b1", name: "Tea", nameHindi: "चाय पत्ती", price: 180, unit: "250g", category: "beverages" },
  { id: "b2", name: "Coffee", nameHindi: "कॉफी", price: 150, unit: "100g", category: "beverages" },
  { id: "b3", name: "Rooh Afza", nameHindi: "रूह अफ़ज़ा", price: 150, unit: "bottle", category: "beverages" }
];

const CATEGORY_NAMES: Record<string, { en: string; hi: string; icon: string }> = {
  groceries: { en: "Groceries", hi: "किराना", icon: "🌾" },
  vegetables: { en: "Vegetables", hi: "सब्जियां", icon: "🥬" },
  dairy: { en: "Dairy", hi: "डेयरी", icon: "🥛" },
  daily: { en: "Daily Needs", hi: "रोजमर्रा की जरूरतें", icon: "🧴" },
  snacks: { en: "Snacks", hi: "स्नैक्स", icon: "🍪" },
  beverages: { en: "Beverages", hi: "पेय पदार्थ", icon: "☕" }
};

export const Home = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>(() => storage.getCart());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { t, lang } = useTranslation();
  
  const isHi = lang === 'hi';
  const profile = storage.getProfile();

  const updateCart = (item: GroceryItem, delta: number) => {
    let newCart = [...cart];
    const existing = newCart.find(c => c.id === item.id);
    
    if (existing) {
      existing.quantity += delta;
      if (existing.quantity <= 0) {
        newCart = newCart.filter(c => c.id !== item.id);
      }
    } else if (delta > 0) {
      newCart.push({ ...item, quantity: 1, name: item.name, nameHindi: item.nameHindi });
    }
    
    setCart(newCart);
    storage.setCart(newCart);
  };

  const getQty = (id: string) => cart.find(c => c.id === id)?.quantity || 0;

  // Group items by category
  const groupedItems = GROCERY_ITEMS.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, GroceryItem[]>);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="p-4 pb-28 bg-gradient-to-b from-green-50/70 via-gray-50 to-white min-h-screen">
      {/* Premium Header */}
      <div className="flex items-center justify-between mb-6 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-inner">
            <img src="/logov2.png" alt="Gram Connect" className="w-6 h-6 object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-black text-primary tracking-tight">{t.gramMart}</h1>
            <p className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase">
              {isHi ? "सब कुछ। हर समय। कनेक्टेड।" : "Everything. Everytime. Connected."}
            </p>
          </div>
        </div>
        <Button size="icon" variant="outline" onClick={() => navigate('/cart')} className="relative h-12 w-12 rounded-2xl shadow-sm hover:bg-gray-50 border-gray-200">
          <ShoppingCart className="w-5 h-5 text-gray-700" />
          {cart.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-4 ring-white animate-pulse">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </Button>
      </div>

      {/* Greeting Banner */}
      <div className="mb-6 rounded-3xl bg-gradient-to-br from-primary to-emerald-800 p-6 text-white shadow-xl shadow-primary/15 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
          <Store className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-[11px] font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {isHi ? "ऑफ़लाइन तैयार ✓" : "Offline Active ✓"}
          </span>
          <h2 className="text-2xl font-bold mb-1">
            {isHi ? `नमस्ते, ${profile?.name || 'यूज़र'}` : `Namaste, ${profile?.name || 'User'}`} 👋
          </h2>
          <p className="text-white/80 text-sm font-medium">
            {isHi ? "आज आप कौन सी सेवा का उपयोग करना चाहेंगे?" : "Which service would you like to use today?"}
          </p>
        </div>
      </div>

      {/* Core Services Hub */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">
          {isHi ? "मुख्य सेवाएं" : "Core Services"}
        </h3>
        <div className="grid grid-cols-1 gap-4">
          
          {/* Grocery Card */}
          <Card 
            className="group overflow-hidden rounded-3xl border border-gray-100 shadow-md shadow-gray-200/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
            onClick={() => scrollToSection('grocery-catalog-section')}
          >
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-110">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">
                    {isHi ? "किराना दुकान" : "Groceries Hub"}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {isHi ? "ऑफ़लाइन राशन मंगाएं (SMS)" : "Order daily needs & essentials offline"}
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          {/* Ride Card */}
          <Card 
            className="group overflow-hidden rounded-3xl border border-gray-100 shadow-md shadow-gray-200/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/ride')}
          >
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 transition-transform group-hover:scale-110">
                  <Bike className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">
                    {isHi ? "स्थानीय राइड बुकिंग" : "On-Demand Rides"}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {isHi ? "स्कूटर या रिक्शा बुक करें" : "Book scooters or rickshaws instantly"}
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          {/* Package Card */}
          <Card 
            className="group overflow-hidden rounded-3xl border border-gray-100 shadow-md shadow-gray-200/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/package')}
          >
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">
                    {isHi ? "कूरियर सेवा" : "Courier & Packages"}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {isHi ? "सामान भेजें (कैश/प्रीपेड)" : "Deliver packages with dynamic weights"}
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Offers & Spotlights Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 ml-1">
          <Percent className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {isHi ? "विशेष ऑफर्स और विशेषताएं" : "Special Offers & Features"}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Grocery Deal */}
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-5 relative overflow-hidden">
            <div className="absolute top-3 right-3 text-emerald-200">
              <Percent className="w-10 h-10" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded">
              {isHi ? "राशन महासेल" : "Grocery Sale"}
            </span>
            <h4 className="font-bold text-gray-900 mt-2 text-base">
              {isHi ? "सरसों तेल @ ₹180/लीटर" : "Mustard Oil @ ₹180/litre"}
            </h4>
            <p className="text-xs text-gray-600 mt-1">
              {isHi ? "किराना ऑर्डर पर ₹20 की सीधी बचत!" : "Directly save ₹20 on premium essential oils."}
            </p>
          </div>

          {/* Ride Offer */}
          <div className="rounded-3xl border border-amber-100 bg-amber-50/40 p-5 relative overflow-hidden">
            <div className="absolute top-3 right-3 text-amber-200">
              <Truck className="w-10 h-10" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/50 px-2 py-0.5 rounded">
              {isHi ? "लोकल राइड्स" : "Local Rides"}
            </span>
            <h4 className="font-bold text-gray-900 mt-2 text-base">
              {isHi ? "स्कूटर मात्र ₹30 बेस" : "Scooter Rides at ₹30 Base"}
            </h4>
            <p className="text-xs text-gray-600 mt-1">
              {isHi ? "बिना इंटरनेट, तुरंत SMS बुकिंग सेवा" : "Book fully offline via standard SMS."}
            </p>
          </div>

          {/* Courier Feature */}
          <div className="rounded-3xl border border-blue-100 bg-blue-50/40 p-5 relative overflow-hidden col-span-1 md:col-span-2">
            <div className="absolute top-3 right-3 text-blue-200">
              <Package className="w-10 h-10" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/50 px-2 py-0.5 rounded">
              {isHi ? "वजन इनपुट अपडेट" : "Weight Feature"}
            </span>
            <h4 className="font-bold text-gray-900 mt-2 text-base">
              {isHi ? "सटीक कूरियर वजन चार्ज" : "Dynamic Weight Tracking"}
            </h4>
            <p className="text-xs text-gray-600 mt-1">
              {isHi ? "अब पैकेज का सटीक वजन जोड़ें और कूरियर भेजें!" : "Add exact parcel weights when dispatching packages."}
            </p>
          </div>

        </div>
      </div>

      {/* Fresh Groceries Section */}
      <div id="grocery-catalog-section" className="pt-2 border-t border-gray-100 scroll-mt-6">
        <div className="flex items-center justify-between mb-4 ml-1">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-gray-800">
              {isHi ? "किराना कैटलॉग" : "Fresh Groceries"}
            </h3>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide pt-1 -mx-4 px-4 mb-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex-shrink-0 flex flex-col items-center justify-center w-[84px] h-[84px] rounded-3xl transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                : 'bg-white text-gray-600 border border-gray-100 shadow-sm hover:border-gray-200'
            }`}
          >
            <Store className={`w-6 h-6 mb-1.5 ${selectedCategory === 'all' ? 'text-white' : 'text-primary'}`} />
            <span className="text-[10px] font-bold tracking-tight">{t.all}</span>
          </button>
          {Object.entries(CATEGORY_NAMES).map(([id, category]) => (
            <button
              key={id}
              onClick={() => setSelectedCategory(id)}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-[84px] h-[84px] rounded-3xl transition-all duration-300 ${
                selectedCategory === id
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                  : 'bg-white text-gray-600 border border-gray-100 shadow-sm hover:border-gray-200'
              }`}
            >
              <span className="text-2xl mb-1">{category.icon}</span>
              <span className="text-[10px] font-bold tracking-tight truncate max-w-[70px]">
                {isHi ? category.hi : category.en}
              </span>
            </button>
          ))}
        </div>

        {/* Grocery Listings */}
        <div className="space-y-6">
          {Object.entries(groupedItems)
            .filter(([category]) => selectedCategory === 'all' || category === selectedCategory)
            .map(([category, items]) => (
            <div key={category} className="animate-in fade-in duration-300">
              <h4 className="font-bold text-sm uppercase tracking-wider mb-3 ml-1 flex items-center gap-1.5 text-gray-500">
                <span className="text-base">{CATEGORY_NAMES[category].icon}</span>
                {isHi ? CATEGORY_NAMES[category].hi : CATEGORY_NAMES[category].en}
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {items.map(item => (
                  <Card key={item.id} className="overflow-hidden border border-gray-100 hover:border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-gray-800 text-base">{isHi ? item.nameHindi : item.name}</h5>
                        <p className="text-xs text-gray-500 mt-0.5 font-medium">{item.unit} • <span className="text-primary font-bold">₹{item.price}</span></p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getQty(item.id) > 0 ? (
                          <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 p-1">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 rounded-full text-gray-600 hover:bg-white hover:text-primary hover:shadow-sm"
                              onClick={() => updateCart(item, -1)}
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </Button>
                            <span className="w-6 text-center font-bold text-gray-800 text-sm">{getQty(item.id)}</span>
                            <Button 
                              size="icon" 
                              className="h-8 w-8 rounded-full"
                              onClick={() => updateCart(item, 1)}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline" 
                            className="border-primary/30 text-primary hover:bg-primary/5 rounded-full font-bold text-xs h-9 px-4 transition-all"
                            onClick={() => updateCart(item, 1)}
                          >
                            {t.add}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
