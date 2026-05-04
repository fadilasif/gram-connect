import { useEffect } from 'react';


export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500); // Show splash screen for 2.5 seconds
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-white z-[100] flex items-center justify-center min-h-screen">
      <div className="animate-fade-in px-4 text-center max-w-md w-full flex justify-center">
        <img 
          src="/logo.png" 
          alt="Gram Connect Logo" 
          className="w-full h-auto object-contain drop-shadow-md" 
        />
      </div>
    </div>
  );
};
