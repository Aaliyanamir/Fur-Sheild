import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../molecules/Navbar';
import Footer from '../molecules/Footer';
import ChatAssistant from './ChatAssistant';

export default function GlobalLayout() {
  const location = useLocation();
  const isShelter = location.pathname === '/shelter';
  const maxWidthClass = isShelter ? 'max-w-[1600px]' : 'max-w-7xl';

  return (
    <div className="min-h-screen bg-bg-primary font-sans text-espresso-800 flex flex-col">
      <Navbar />
      
      {/* Main Content Area - Dynamic width for Kanban board */}
      <main className={`flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 ${maxWidthClass}`}>
        <Outlet />
      </main>
      <Footer />
      <ChatAssistant />
    </div>
  );
}


