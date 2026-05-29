import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../lib/storage';
import type { PackageDelivery } from '../lib/storage';
import { generatePackageSMS } from '../lib/sms';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { PackageOpen, CreditCard, Banknote } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTranslation } from '../lib/i18n';

export const Package = () => {
  const navigate = useNavigate();
  const { t, lang } = useTranslation();
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [packageType, setPackageType] = useState('');
  const [weight, setWeight] = useState('');
  const [payment, setPayment] = useState<'COD' | 'prepaid'>('prepaid');
  const [codAmount, setCodAmount] = useState('');
  const [profileExists] = useState(() => storage.isProfileComplete());

  const handleSend = () => {
    if (!profileExists) {
      alert(t.completeProfileFirst);
      navigate('/profile');
      return;
    }

    const codAmountNum = parseFloat(codAmount);

    const newPackage: PackageDelivery = {
      id: Math.random().toString(36).substr(2, 9),
      pickup,
      drop,
      receiverName,
      receiverPhone,
      packageType,
      weight,
      payment,
      codAmount: payment === 'COD' && !isNaN(codAmountNum) ? codAmountNum : undefined,
      status: 'requested',
      timestamp: Date.now()
    };

    storage.addPackage(newPackage);
    generatePackageSMS(newPackage, lang);
    
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const isFormValid = pickup.trim() !== '' && 
                      drop.trim() !== '' && 
                      receiverName.trim() !== '' && 
                      receiverPhone.trim().length >= 10 &&
                      packageType.trim() !== '' &&
                      weight.trim() !== '' &&
                      (payment === 'prepaid' || (payment === 'COD' && parseFloat(codAmount) > 0));

  return (
    <div className="p-4 pb-24 pt-8">
      <h1 className="text-2xl font-bold mb-6 text-primary flex items-center gap-2">
        <PackageOpen className="w-6 h-6" />
        {t.sendPackage}
      </h1>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t.pickupLocation}</label>
            <Input 
              placeholder="e.g. My Shop"
              value={pickup}
              onChange={e => setPickup(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t.dropLocation}</label>
            <Input 
              placeholder="e.g. Market Square"
              value={drop}
              onChange={e => setDrop(e.target.value)}
            />
          </div>

          <div className="pt-2 border-t">
            <label className="block text-sm font-medium mb-1">{t.receiverName}</label>
            <Input 
              placeholder="e.g. Suresh"
              value={receiverName}
              onChange={e => setReceiverName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t.receiverPhone}</label>
            <Input 
              type="tel"
              placeholder="10-digit number"
              value={receiverPhone}
              onChange={e => setReceiverPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t.packageContents}</label>
            <Input 
              placeholder="e.g. Documents, Clothes"
              value={packageType}
              onChange={e => setPackageType(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t.weight}</label>
            <Input 
              placeholder={t.weightPlaceholder}
              value={weight}
              onChange={e => setWeight(e.target.value)}
            />
          </div>

          <div className="pt-2 border-t">
            <label className="block text-sm font-medium mb-2">{t.paymentType}</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className={cn(
                  "flex items-center justify-center gap-2 p-3 border rounded-xl transition-colors",
                  payment === 'prepaid' ? "border-primary bg-primary/10 text-primary" : "hover:bg-gray-50 text-gray-500"
                )}
                onClick={() => setPayment('prepaid')}
              >
                <CreditCard className="w-5 h-5" />
                <span className="font-medium">{t.prepaid}</span>
              </button>
              <button
                type="button"
                className={cn(
                  "flex items-center justify-center gap-2 p-3 border rounded-xl transition-colors",
                  payment === 'COD' ? "border-primary bg-primary/10 text-primary" : "hover:bg-gray-50 text-gray-500"
                )}
                onClick={() => setPayment('COD')}
              >
                <Banknote className="w-5 h-5" />
                <span className="font-medium">{t.cod}</span>
              </button>
            </div>
          </div>

          {payment === 'COD' && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <label className="block text-sm font-medium mb-1">{t.codAmount}</label>
              <Input 
                type="number"
                placeholder="e.g. 500"
                value={codAmount}
                onChange={e => setCodAmount(e.target.value)}
                min="1"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {!profileExists && (
        <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
          {t.completeProfileFirst}
        </div>
      )}

      <Button 
        className="w-full mt-6" 
        size="lg" 
        disabled={!isFormValid}
        onClick={handleSend}
      >
        {t.sendPackageSMS}
      </Button>
    </div>
  );
};
