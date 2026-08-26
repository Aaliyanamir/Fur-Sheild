import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../molecules/Navbar';
import Footer from '../molecules/Footer';

export default function GlobalLayout() {
  return (
    <div className="min-h-screen bg-bg-primary font-sans text-espresso-800 flex flex-col">
      <Navbar />
      
      {/* Main Content Area - Added pt-28 to clear the floating navbar */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

