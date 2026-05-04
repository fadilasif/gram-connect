import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Cart } from './pages/Cart';
import { Ride } from './pages/Ride';
import { Package } from './pages/Package';
import { Profile } from './pages/Profile';

import { Onboarding } from './components/Onboarding';
import { SplashScreen } from './components/SplashScreen';
import { storage } from './lib/storage';
import { useState, useEffect } from 'react';

function App() {
  const [isReady, setIsReady] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setIsProfileComplete(storage.isProfileComplete());
    setIsReady(true);
  }, []);

  if (!isReady) return null;

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!isProfileComplete) {
    return <Onboarding onComplete={() => setIsProfileComplete(true)} />;
  }

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/ride" element={<Ride />} />
          <Route path="/package" element={<Package />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
