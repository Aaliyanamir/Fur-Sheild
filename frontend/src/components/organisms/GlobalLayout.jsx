import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../molecules/Navbar';
import Footer from '../molecules/Footer';
import ChatAssistant from './ChatAssistant';
import CartDrawer from './CartDrawer';
import EmergencySOS from './EmergencySOS';
import ScrollToTop from '../ScrollToTop';

export default function GlobalLayout() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isShelter = location.pathname === '/shelter';
  const maxWidthClass = isLandingPage 
    ? 'w-full max-w-full p-0' 
    : (isShelter ? 'max-w-[1600px] px-4 sm:px-6 lg:px-8 pt-28 pb-12' : 'max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-12');

  return (
    <div className="min-h-screen bg-bg-primary font-sans text-espresso-800 flex flex-col">
      <ScrollToTop />
      <Navbar />
      
      {/* Main Content Area */}
      <main className={`flex-1 w-full mx-auto ${maxWidthClass}`}>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <EmergencySOS />
      <ChatAssistant />
    </div>
  );
}
