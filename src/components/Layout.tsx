import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="max-w-lg mx-auto bg-white min-h-screen shadow-sm relative">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};
