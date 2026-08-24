import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../molecules/Sidebar';
import Topbar from '../molecules/Topbar';

export default function GlobalLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-bg-secondary overflow-hidden font-sans text-slate-900">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Topbar onOpenSidebar={() => setIsSidebarOpen(true)} />

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="w-full max-w-7xl mx-auto pb-24">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
