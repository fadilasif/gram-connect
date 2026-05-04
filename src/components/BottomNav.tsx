import { Store, Bike, Package, ShoppingCart, User } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { storage } from '../lib/storage';
import { useState, useEffect } from 'react';
import { useTranslation } from '../lib/i18n';

export const BottomNav = () => {
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // A simple interval to poll cart count since we are just using localStorage directly
    const interval = setInterval(() => {
      const cart = storage.getCart();
      setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const { t } = useTranslation();

  const navItems = [
    { name: t.home, path: '/', icon: Store },
    { name: t.ride, path: '/ride', icon: Bike },
    { name: t.package, path: '/package', icon: Package },
    { name: t.cart, path: '/cart', icon: ShoppingCart, badge: cartCount },
    { name: t.profile, path: '/profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={cn(
                "inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group",
                isActive ? "text-primary" : "text-gray-500"
              )}
            >
              <div className="relative">
                <Icon className={cn("w-6 h-6 mb-1", isActive && "fill-current")} />
                {item.badge ? (
                  <div className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2">
                    {item.badge}
                  </div>
                ) : null}
              </div>
              <span className="text-xs truncate max-w-full">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
