import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AIChatWidget from '../components/AIChatWidget';
import EmergencySOS from '../components/EmergencySOS';
import UserProfileModal from '../components/UserProfileModal';
import NotificationsModal from '../components/NotificationsModal';
import RoleSwitcher from '../components/RoleSwitcher';
import { useAuth } from '../context/AuthContext';
import { Shield, Bell, LogOut, Menu, X, ArrowLeft, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = () => {
  const { user, role, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-soft flex flex-col font-sans">
      {/* Top Header Bar for Dashboards */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Mobile Sidebar Toggle Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 focus:outline-none"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-brand-dark text-white p-2.5 rounded-2xl shadow-sm">
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold text-slate-900 hidden sm:inline tracking-tight">
                Fur<span className="text-brand-dark">Shield</span>
              </span>
            </Link>

            <span className="h-6 w-px bg-slate-200 hidden sm:inline" />

            {/* Current Active Role Badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:inline">Portal:</span>
              <span className="px-3 py-1 text-xs font-extrabold rounded-full bg-brand-light text-brand-dark uppercase tracking-wider border border-brand-sage">
                {role === 'owner' ? 'Pet Owner' : role === 'vet' ? 'Veterinarian' : 'Shelter'}
              </span>
            </div>
          </div>

          {/* Right Header Actions & Custom Role Switcher */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <RoleSwitcher />
            </div>

            {/* Notifications Bell Trigger */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
              title="View Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
            </button>

            {/* User Settings Trigger */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title="Account Settings"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Back to Public Home Link */}
            <Link
              to="/"
              className="hidden md:flex items-center gap-1.5 text-xs font-extrabold text-slate-700 hover:text-brand-dark bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Public Site
            </Link>

            {/* Logout */}
            <button
              onClick={logout}
              className="text-slate-400 hover:text-red-600 p-2.5 rounded-xl transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body with Responsive Sidebar & Content Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar onOpenProfileModal={() => setIsProfileModalOpen(true)} />
        </div>

        {/* Mobile Drawer Overlay Sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="p-4 flex justify-between items-center border-b border-slate-200">
                <span className="font-extrabold text-slate-900">Dashboard Menu</span>
                <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-md text-slate-500">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <Sidebar onOpenProfileModal={() => setIsProfileModalOpen(true)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* FLOATING WIDGETS & MODALS */}
      <EmergencySOS />
      <AIChatWidget />
      <UserProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      <NotificationsModal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </div>
  );
};

export default DashboardLayout;
