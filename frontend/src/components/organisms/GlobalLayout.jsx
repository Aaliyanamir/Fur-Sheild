import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../molecules/Navbar';

export default function GlobalLayout() {
  return (
    <div className="min-h-screen bg-bg-primary font-sans text-slate-900 flex flex-col">
      <Navbar />
      
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
