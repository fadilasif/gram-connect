import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../lib/storage';
import type { CartItem, Order } from '../lib/storage';
import { generateGrocerySMS } from '../lib/sms';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { ArrowLeft, Trash2, ShoppingCart } from 'lucide-react';
import { useTranslation } from '../lib/i18n';

const DELIVERY_FEE = 30;

export const Cart = () => {
  const navigate = useNavigate();
  const { t, lang } = useTranslation();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    setCart(storage.getCart());
    setProfileExists(storage.isProfileComplete());
  }, []);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + (cart.length > 0 ? DELIVERY_FEE : 0);

  const handleCheckout = () => {
    if (!profileExists) {
      alert(t.completeProfileFirst);
      navigate('/profile');
      return;
    }

    if (cart.length === 0) return;

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      items: cart,
      subtotal,
      deliveryFee: DELIVERY_FEE,
      total,
      status: 'requested',
      timestamp: Date.now()
    };

    storage.addOrder(newOrder);
    storage.clearCart();
    setCart([]);
    generateGrocerySMS(cart, subtotal, DELIVERY_FEE, total, lang);
    
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const clearCart = () => {
    storage.clearCart();
    setCart([]);
  };

  if (cart.length === 0) {
    return (
      <div className="p-4 pt-8 flex flex-col items-center justify-center min-h-[60vh]">
        <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold mb-2">{t.emptyCart}</h2>
        <Button onClick={() => navigate('/')} className="mt-4">
          {t.startShopping}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
      <div className="flex items-center gap-3 mb-6 pt-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-bold">{t.reviewCart}</h1>
        <Button variant="ghost" size="icon" className="ml-auto text-destructive" onClick={clearCart}>
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-4 mb-6">
        {cart.map(item => (
          <Card key={item.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{lang === 'hi' ? item.nameHindi : item.name}</h3>
                <p className="text-sm text-gray-500">{item.quantity} x ₹{item.price}</p>
              </div>
              <div className="font-bold">
                ₹{item.price * item.quantity}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gray-50 border-none">
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>{t.subtotal}</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>{t.deliveryFee}</span>
            <span>₹{DELIVERY_FEE}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>{t.total}</span>
            <span>₹{total}</span>
          </div>
        </CardContent>
      </Card>

      {!profileExists && (
        <div className="mt-6 p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm mb-4">
          {t.completeProfileFirst}
        </div>
      )}

      <Button 
        className="w-full mt-6" 
        size="lg" 
        onClick={handleCheckout}
      >
        {t.checkout}
      </Button>
    </div>
  );
};
