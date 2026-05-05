const storage = {
  getProfile: () => {
    return { name: 'Fadil', language: 'hi' };
  }
};
const useTranslation = () => {
  const profile = storage.getProfile();
  const lang = profile?.language || 'en';
  return { lang };
};
console.log(useTranslation().lang);
