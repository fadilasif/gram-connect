import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../lib/storage';
import type { GroceryItem, CartItem } from '../lib/storage';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Store, Plus, Minus, ShoppingCart } from 'lucide-react';
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { t, lang } = useTranslation();

  useEffect(() => {
    setCart(storage.getCart());
  }, []);

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

  return (
    <div className="p-4 pb-24">
      <div className="flex items-center justify-between mb-6 pt-4">
        <div className="flex items-center gap-2">
          <img src="/logov2.png" alt="Gram Connect" className="w-8 h-8 object-contain" />
          <h1 className="text-2xl font-bold text-primary">{t.gramMart}</h1>
        </div>
        <Button size="icon" variant="outline" onClick={() => navigate('/cart')} className="relative">
          <ShoppingCart className="w-5 h-5" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </Button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide pt-2 -mx-4 px-4 mb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`flex-shrink-0 flex flex-col items-center justify-center w-[84px] h-[84px] rounded-2xl transition-colors ${
            selectedCategory === 'all'
              ? 'bg-primary text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-100 shadow-sm'
          }`}
        >
          <Store className={`w-8 h-8 mb-2 ${selectedCategory === 'all' ? 'text-white' : 'text-primary'}`} />
          <span className="text-xs font-medium">{t.all}</span>
        </button>
        {Object.entries(CATEGORY_NAMES).map(([id, category]) => (
          <button
            key={id}
            onClick={() => setSelectedCategory(id)}
            className={`flex-shrink-0 flex flex-col items-center justify-center w-[84px] h-[84px] rounded-2xl transition-colors ${
              selectedCategory === id
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-100 shadow-sm'
            }`}
          >
            <span className="text-3xl mb-1">{category.icon}</span>
            <span className="text-xs font-medium">{lang === 'hi' ? category.hi : category.en}</span>
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {Object.entries(groupedItems)
          .filter(([category]) => selectedCategory === 'all' || category === selectedCategory)
          .map(([category, items]) => (
          <div key={category}>
            <h2 className="font-bold text-lg mb-3 flex items-center gap-2 text-gray-800">
              <span>{CATEGORY_NAMES[category].icon}</span>
              {lang === 'hi' ? CATEGORY_NAMES[category].hi : CATEGORY_NAMES[category].en}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {items.map(item => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{lang === 'hi' ? item.nameHindi : item.name}</h3>
                      <p className="text-sm text-gray-500">{item.unit} • ₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {getQty(item.id) > 0 ? (
                        <>
                          <Button 
                            size="icon" 
                            variant="outline" 
                            className="h-10 w-10 rounded-full border-primary text-primary"
                            onClick={() => updateCart(item, -1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-4 text-center font-semibold">{getQty(item.id)}</span>
                          <Button 
                            size="icon" 
                            className="h-10 w-10 rounded-full"
                            onClick={() => updateCart(item, 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="outline" 
                          className="border-primary text-primary hover:bg-primary/10"
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
  );
};
