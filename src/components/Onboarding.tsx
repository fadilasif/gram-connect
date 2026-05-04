import { useState } from 'react';
import { storage } from '../lib/storage';
import type { UserProfile } from '../lib/storage';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { User, Phone, Home, MapPin, Hash, Globe } from 'lucide-react';
import { t } from '../lib/i18n';

export const Onboarding = ({ onComplete }: { onComplete: () => void }) => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    phone: '',
    village: '',
    landmark: '',
    pincode: '',
    language: 'en'
  });

  const lang = profile.language || 'en';
  const text = t[lang];

  const isValid = profile.name.trim() !== '' && 
                  profile.phone.trim().length >= 10 && 
                  profile.village.trim() !== '' && 
                  profile.landmark.trim() !== '' && 
                  profile.pincode.trim() !== '' &&
                  profile.language !== undefined;

  const handleSave = () => {
    if (isValid) {
      storage.setProfile(profile);
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-green-50 via-white to-green-50 overflow-y-auto">
      <div className="max-w-md mx-auto p-6 min-h-screen flex flex-col justify-center py-12">
        <div className="text-center mb-8">
          <div className="mx-auto w-24 h-24 mb-6 flex items-center justify-center">
            <img src="/logo.png" alt="Gram Connect" className="w-full h-full object-contain drop-shadow-sm" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">{text.welcome}</h1>
          <p className="text-gray-500 text-sm font-medium">{text.subtitle}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-green-900/5 p-6 space-y-6 border border-green-100">
          
          <div className="space-y-4">
            <div className="relative pb-2 border-b border-gray-100 mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ml-1 flex items-center gap-2">
                <Globe className="w-4 h-4" /> 
                Select Language / भाषा चुनें
              </label>
              <div className="flex gap-3">
                <Button 
                  variant={profile.language === 'en' ? 'default' : 'outline'}
                  className={`flex-1 h-12 rounded-xl transition-all ${profile.language === 'en' ? 'shadow-md shadow-primary/20 scale-[1.02]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => setProfile({...profile, language: 'en'})}
                >
                  🇬🇧 English
                </Button>
                <Button 
                  variant={profile.language === 'hi' ? 'default' : 'outline'}
                  className={`flex-1 h-12 rounded-xl transition-all ${profile.language === 'hi' ? 'shadow-md shadow-primary/20 scale-[1.02]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => setProfile({...profile, language: 'hi'})}
                >
                  🇮🇳 हिंदी
                </Button>
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">{text.name}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <Input 
                  className="pl-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors h-14 rounded-xl text-base"
                  placeholder={text.namePlaceholder} 
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">{text.phone}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Phone className="w-5 h-5" />
                </div>
                <Input 
                  className="pl-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors h-14 rounded-xl text-base"
                  type="tel" 
                  placeholder={text.phonePlaceholder} 
                  value={profile.phone}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">{text.village}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Home className="w-5 h-5" />
                </div>
                <Input 
                  className="pl-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors h-14 rounded-xl text-base"
                  placeholder={text.villagePlaceholder} 
                  value={profile.village}
                  onChange={e => setProfile({ ...profile, village: e.target.value })}
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">{text.landmark}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <Input 
                  className="pl-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors h-14 rounded-xl text-base"
                  placeholder={text.landmarkPlaceholder} 
                  value={profile.landmark}
                  onChange={e => setProfile({ ...profile, landmark: e.target.value })}
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">{text.pincode}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Hash className="w-5 h-5" />
                </div>
                <Input 
                  className="pl-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors h-14 rounded-xl text-base"
                  type="tel" 
                  placeholder={text.pincodePlaceholder} 
                  value={profile.pincode}
                  onChange={e => setProfile({ ...profile, pincode: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button 
              className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 disabled:hover:scale-100 disabled:shadow-none" 
              size="lg" 
              disabled={!isValid} 
              onClick={handleSave}
            >
              {text.start}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
