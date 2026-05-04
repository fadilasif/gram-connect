import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../lib/storage';
import type { RideBooking } from '../lib/storage';
import { generateRideSMS } from '../lib/sms';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { Bike, CarFront } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTranslation } from '../lib/i18n';

export const Ride = () => {
  const navigate = useNavigate();
  const { t, lang } = useTranslation();
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [vehicle, setVehicle] = useState<'scooter' | 'rickshaw'>('scooter');
  const [distance, setDistance] = useState('');
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    setProfileExists(storage.isProfileComplete());
  }, []);

  const distanceNum = parseFloat(distance) || 0;
  
  let fare = 0;
  if (distanceNum > 0) {
    if (vehicle === 'scooter') {
      fare = 30 + Math.max(0, distanceNum - 1) * 15;
    } else {
      fare = 40 + Math.max(0, distanceNum - 1) * 25;
    }
  }

  const handleBook = () => {
    if (!profileExists) {
      alert(t.completeProfileFirst);
      navigate('/profile');
      return;
    }

    if (!pickup || !drop || distanceNum <= 0) return;

    const newRide: RideBooking = {
      id: Math.random().toString(36).substr(2, 9),
      pickup,
      drop,
      vehicle,
      distance: distanceNum,
      fare,
      status: 'requested',
      timestamp: Date.now()
    };

    storage.addRide(newRide);
    generateRideSMS(newRide, lang);
    
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const isFormValid = pickup.trim() !== '' && drop.trim() !== '' && distanceNum > 0;

  return (
    <div className="p-4 pb-24 pt-8">
      <h1 className="text-2xl font-bold mb-6 text-primary">{t.bookRide}</h1>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t.pickupLocation}</label>
            <Input 
              placeholder="e.g. Main Bus Stand"
              value={pickup}
              onChange={e => setPickup(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t.dropLocation}</label>
            <Input 
              placeholder="e.g. Village Chowk"
              value={drop}
              onChange={e => setDrop(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t.selectVehicle}</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className={cn(
                  "flex flex-col items-center justify-center p-4 border rounded-xl transition-colors",
                  vehicle === 'scooter' ? "border-primary bg-primary/10 text-primary" : "hover:bg-gray-50 text-gray-500"
                )}
                onClick={() => setVehicle('scooter')}
              >
                <Bike className="w-8 h-8 mb-2" />
                <span className="font-medium">{t.scooter}</span>
                <span className="text-xs mt-1">₹30 base</span>
              </button>
              <button
                type="button"
                className={cn(
                  "flex flex-col items-center justify-center p-4 border rounded-xl transition-colors",
                  vehicle === 'rickshaw' ? "border-primary bg-primary/10 text-primary" : "hover:bg-gray-50 text-gray-500"
                )}
                onClick={() => setVehicle('rickshaw')}
              >
                <CarFront className="w-8 h-8 mb-2" />
                <span className="font-medium">{t.rickshaw}</span>
                <span className="text-xs mt-1">₹40 base</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t.estimatedDistance}</label>
            <Input 
              type="number"
              placeholder="e.g. 5"
              value={distance}
              onChange={e => setDistance(e.target.value)}
              min="0.1"
              step="0.1"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4 bg-gray-50 border-none">
        <CardContent className="p-4 flex justify-between items-center text-lg font-bold">
          <span>{t.estimatedFare}</span>
          <span className="text-primary text-2xl">₹{Math.ceil(fare)}</span>
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
        onClick={handleBook}
      >
        {t.bookRideSMS}
      </Button>
    </div>
  );
};
