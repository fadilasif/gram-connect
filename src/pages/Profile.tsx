import { useState, useEffect } from 'react';

import { storage } from '../lib/storage';
import type { UserProfile } from '../lib/storage';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { UserCheck, Globe } from 'lucide-react';
import { useTranslation } from '../lib/i18n';

export const Profile = () => {
  const { t, lang } = useTranslation();
  const [profile, setProfile] = useState<UserProfile>({ 
    name: '', phone: '', village: '', landmark: '', pincode: '', language: lang
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = storage.getProfile();
    if (existing) {
      setProfile({
        ...existing,
        language: existing.language || 'en'
      });
      setSaved(true);
    }
  }, []);

  const isValid = profile.name.trim() !== '' && 
                  profile.phone.trim().length >= 10 && 
                  profile.village.trim() !== '' && 
                  profile.landmark.trim() !== '' && 
                  profile.pincode.trim() !== '';

  const handleSave = () => {
    if (!isValid) return;
    storage.setProfile(profile);
    setSaved(true);
  };

  return (
    <div className="p-4 pt-8 pb-24">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-primary" />
            {t.profile}
          </CardTitle>
          <p className="text-sm text-gray-500">
            {t.completeProfileFirst}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="pb-2 border-b border-gray-100 mb-2">
            <label className="block text-sm font-medium mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4" /> 
              {profile.language === 'hi' ? 'भाषा चुनें / Language' : 'Language / भाषा चुनें'}
            </label>
            <div className="flex gap-3">
              <Button 
                variant={profile.language === 'en' ? 'default' : 'outline'}
                className={`flex-1 h-12 transition-all ${profile.language === 'en' ? 'shadow-md shadow-primary/20 scale-[1.02]' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => {
                  const newProfile = {...profile, language: 'en'};
                  setProfile(newProfile);
                  storage.setProfile(newProfile);
                  window.location.reload();
                }}
              >
                🇬🇧 English
              </Button>
              <Button 
                variant={profile.language === 'hi' ? 'default' : 'outline'}
                className={`flex-1 h-12 transition-all ${profile.language === 'hi' ? 'shadow-md shadow-primary/20 scale-[1.02]' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => {
                  const newProfile = {...profile, language: 'hi' as const};
                  setProfile(newProfile);
                  storage.setProfile(newProfile);
                  window.location.reload();
                }}
              >
                🇮🇳 हिंदी
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t.name}</label>
            <Input
              placeholder={t.namePlaceholder}
              value={profile.name}
              onChange={(e) => {
                setProfile({ ...profile, name: e.target.value });
                setSaved(false);
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t.phone}</label>
            <Input
              type="tel"
              placeholder={t.phonePlaceholder}
              value={profile.phone}
              onChange={(e) => {
                setProfile({ ...profile, phone: e.target.value });
                setSaved(false);
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t.village}</label>
            <Input
              placeholder={t.villagePlaceholder}
              value={profile.village}
              onChange={(e) => {
                setProfile({ ...profile, village: e.target.value });
                setSaved(false);
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t.landmark}</label>
            <Input
              placeholder={t.landmarkPlaceholder}
              value={profile.landmark}
              onChange={(e) => {
                setProfile({ ...profile, landmark: e.target.value });
                setSaved(false);
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t.pincode}</label>
            <Input
              type="tel"
              placeholder={t.pincodePlaceholder}
              value={profile.pincode}
              onChange={(e) => {
                setProfile({ ...profile, pincode: e.target.value });
                setSaved(false);
              }}
            />
          </div>
          
          <Button 
            className="w-full mt-4" 
            size="lg" 
            onClick={handleSave}
            disabled={!isValid || saved}
          >
            {saved ? t.profileSaved : t.saveProfile}
          </Button>
          

        </CardContent>
      </Card>
    </div>
  );
};
