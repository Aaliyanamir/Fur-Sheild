import React, { useState, useEffect, useContext } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, Stethoscope, HeartHandshake, ShoppingBag, Bell, Search, PawPrint, Menu, X, User, Settings, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Veterinarian', path: '/vet', icon: Stethoscope },
    { name: 'Shelter', path: '/shelter', icon: HeartHandshake },
    { name: 'Shop', path: '/shop', icon: ShoppingBag },
  ];

  return (
    <>
      <div className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        
        {/* Main Pristine Container - Responsive Pill */}
        <header className="relative w-full max-w-5xl h-[64px] md:h-[72px] bg-white rounded-[32px] md:rounded-[40px] shadow-[0_8px_30px_rgb(90,56,37,0.06)] border border-camel-100 flex items-center justify-between pointer-events-auto transition-all duration-300">
          
          {/* RIGHT ZONE SWOOP BACKGROUND */}
          <div className="absolute inset-0 rounded-[32px] md:rounded-[40px] overflow-hidden pointer-events-none z-0">
            <div className="absolute top-0 right-0 h-full w-[220px] md:w-[360px] transition-all duration-300">
              <svg viewBox="0 0 360 72" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="camelSwoop" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#F9F6F0" stopOpacity="1" />
                    <stop offset="100%" stopColor="#E4D1B9" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                <path 
                  d="M0,72 C120,72 160,0 260,0 L360,0 L360,72 Z" 
                  fill="url(#camelSwoop)" 
                />
              </svg>
            </div>
          </div>

          {/* Foreground Content */}
          <div className="relative z-10 flex items-center justify-between w-full h-full px-2">
            
            {/* Left: Logo (Prevent shrink on tablet) */}
            <Link to="/" className="flex items-center gap-2 md:gap-3 pl-3 md:pl-4 md:pr-4 lg:pr-8 shrink-0 hover:opacity-80 transition-opacity">
              <div className="relative w-9 h-9 md:w-11 md:h-11 flex items-center justify-center transition-all duration-300">
                <div className="absolute inset-0 bg-camel-200 rounded-full mix-blend-multiply filter blur-[3px] opacity-80 scale-110 rotate-12"></div>
                <div className="absolute inset-1 bg-camel-300 rounded-full mix-blend-multiply filter blur-[4px] opacity-60 -rotate-12"></div>
                <div className="absolute -inset-0.5 bg-camel-100 rounded-full mix-blend-multiply filter blur-[2px] opacity-70 rotate-45 scale-105"></div>
                
                <PawPrint size={20} className="relative z-10 text-espresso-900 md:w-[22px] md:h-[22px]" fill="currentColor" />
              </div>
              
              <div className="flex flex-col justify-center">
                <span 
                  className="text-[24px] md:text-[26px] lg:text-[28px] text-espresso-900 leading-[0.9] tracking-tight transition-all duration-300"
                  style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 700 }}
                >
                  FurShield
                </span>
                {/* Hide tagline on tablet to save horizontal space */}
                <span className="hidden lg:block text-[10px] text-espresso-500 font-medium mt-0.5 tracking-wide">
                  For tails that tell stories.
                </span>
              </div>
            </Link>

            {/* Desktop Center: Navigation */}
            <nav className="hidden md:flex items-center gap-1 md:gap-2 lg:gap-6 h-full pt-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className="relative group h-full flex items-center justify-center px-1 lg:px-2"
                  >
                    {({ isActive }) => (
                      <div className="flex flex-col items-center justify-center gap-[3px]">
                        <Icon 
                          size={21} 
                          strokeWidth={1.5} 
                          className={cn(
                            "transition-colors duration-300",
                            isActive ? "text-camel-900" : "text-espresso-400 group-hover:text-camel-600"
                          )}
                        />
                        <div className="relative px-2 lg:px-3 py-0.5 flex items-center justify-center">
                          {isActive && (
                            <svg className="absolute inset-0 w-full h-full text-camel-200 scale-x-[1.25] scale-y-[1.1] -z-10 drop-shadow-sm opacity-90" preserveAspectRatio="none" viewBox="0 0 100 30">
                              <path d="M 3,6 C 20,2 40,7 60,3 S 80,8 97,5 C 98,12 95,20 96,25 C 80,28 60,23 40,27 S 20,22 4,24 C 2,18 5,10 3,6 Z" fill="currentColor" />
                            </svg>
                          )}
                          {!isActive && (
                            <svg className="absolute inset-0 w-full h-full text-camel-100 scale-x-[1.25] scale-y-[1.1] -z-10 opacity-0 group-hover:opacity-60 transition-opacity duration-300" preserveAspectRatio="none" viewBox="0 0 100 30">
                              <path d="M 3,6 C 20,2 40,7 60,3 S 80,8 97,5 C 98,12 95,20 96,25 C 80,28 60,23 40,27 S 20,22 4,24 C 2,18 5,10 3,6 Z" fill="currentColor" />
                            </svg>
                          )}
                          <span className={cn(
                            "relative z-10 text-[12px] lg:text-[13px] tracking-wide transition-colors duration-300",
                            isActive ? "text-camel-900 font-bold" : "text-espresso-600 font-semibold group-hover:text-camel-800"
                          )}>
                            {item.name}
                          </span>
                        </div>
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Desktop Right: Actions */}
            <div className="hidden md:flex items-center gap-1 lg:gap-3 pr-2 pl-2 lg:pl-8 h-full shrink-0">
              <button className="p-1.5 lg:p-2 text-espresso-500 hover:text-camel-700 transition-colors rounded-full hover:bg-white/50">
                <Search size={18} strokeWidth={2.5} />
              </button>
              
              <button className="relative p-1.5 lg:p-2 text-espresso-500 hover:text-camel-700 transition-colors rounded-full hover:bg-white/50">
                <Bell size={18} strokeWidth={2.5} />
                <span className="absolute top-1 lg:top-1.5 right-1.5 lg:right-2 w-2 h-2 rounded-full bg-accent-500 border-2 border-[#f6e9de]"></span>
              </button>
              
              {user ? (
              <div className="group relative ml-1 lg:ml-2">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-camel-100 border border-camel-200 flex items-center justify-center cursor-pointer hover:shadow-md transition-all">
                  <span className="text-[10px] lg:text-xs font-bold text-camel-900">
                    {user.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                
                {/* Enhanced Desktop Dropdown Menu */}
                <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-3xl shadow-[0_20px_60px_rgba(90,56,37,0.12)] border border-camel-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col overflow-hidden z-50 origin-top-right transform scale-95 group-hover:scale-100">
                  
                  {/* User Info Header */}
                  <div className="p-5 bg-bg-secondary border-b border-camel-100">
                    <p className="font-display font-black text-espresso-900 truncate text-lg mb-0.5">{user.name}</p>
                    <p className="text-xs font-bold text-espresso-400 truncate mb-3">{user.email}</p>
                    <span className="inline-block px-2.5 py-1 bg-camel-200 text-camel-900 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                      {user.role}
                    </span>
                  </div>
                  
                  {/* Links */}
                  <div className="flex flex-col p-2">
                    <Link to="/profile" className="px-4 py-2.5 text-sm font-bold text-espresso-700 hover:bg-camel-50 hover:text-camel-900 rounded-2xl transition-colors flex items-center gap-3">
                      <User size={18} /> Edit Profile
                    </Link>
                    <Link to="/settings" className="px-4 py-2.5 text-sm font-bold text-espresso-700 hover:bg-camel-50 hover:text-camel-900 rounded-2xl transition-colors flex items-center gap-3">
                      <Settings size={18} /> Settings
                    </Link>
                    {user.role === 'OWNER' && (
                      <Link to="/orders" className="px-4 py-2.5 text-sm font-bold text-espresso-700 hover:bg-camel-50 hover:text-camel-900 rounded-2xl transition-colors flex items-center gap-3">
                        <ShoppingBag size={18} /> My Orders
                      </Link>
                    )}
                  </div>
                  
                  {/* Logout Button */}
                  <div className="p-2 border-t border-camel-100 bg-[#FAF8F5]">
                    <button 
                      onClick={logout || (() => {
                        localStorage.removeItem('user');
                        sessionStorage.removeItem('user');
                        window.location.href = '/login';
                      })}
                      className="w-full px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-100 hover:text-red-700 rounded-2xl transition-colors flex items-center gap-3"
                    >
                      <LogOut size={18} /> Log Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="ml-2 px-5 py-2.5 bg-camel-800 hover:bg-camel-900 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-sm transition-all flex items-center gap-2">
                <User size={14} /> Sign In
              </Link>
            )}

            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center pr-3 shrink-0">
               <button 
                 onClick={() => setIsMobileMenuOpen(true)}
                 className="p-2 text-camel-800 hover:bg-white/50 rounded-full transition-colors"
                 aria-label="Open menu"
               >
                 <Menu size={24} />
               </button>
            </div>

          </div>
        </header>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-espresso-900/40 backdrop-blur-sm z-[60] md:hidden"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-bg-primary shadow-2xl z-[70] flex flex-col border-l border-camel-200 md:hidden"
            >
              <div className="p-6 flex items-center justify-between border-b border-camel-200/50">
                <span 
                  className="text-[26px] text-espresso-900 leading-[0.9]"
                  style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 700 }}
                >
                  FurShield
                </span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-espresso-500 hover:text-camel-800 bg-camel-100/50 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) => cn(
                        "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300",
                        isActive 
                          ? "bg-camel-200 text-camel-900 font-bold shadow-sm" 
                          : "text-espresso-600 hover:bg-camel-100/50 hover:text-camel-800 font-medium"
                      )}
                    >
                      <Icon size={20} strokeWidth={2} />
                      <span className="text-[15px] tracking-wide">{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>

              <div className="p-6 border-t border-camel-200/50 flex flex-col gap-4">
                 
                 {user ? (
                 <>
                   {/* Mobile User Profile Header */}
                   <div className="flex items-center gap-4 mb-2">
                     <div className="w-12 h-12 rounded-full bg-camel-100 flex items-center justify-center text-camel-900 font-black text-sm shadow-sm border border-camel-200">
                       {user.name.substring(0, 2).toUpperCase()}
                     </div>
                     <div className="flex-1 overflow-hidden">
                       <p className="font-display font-black text-espresso-900 truncate text-base">{user.name}</p>
                       <p className="text-[11px] font-bold text-espresso-400 truncate">{user.email}</p>
                     </div>
                   </div>

                   {/* Mobile User Links */}
                   <div className="grid grid-cols-2 gap-2">
                      <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 justify-center p-3 bg-white border border-camel-100 rounded-2xl text-xs font-bold text-espresso-700 shadow-sm hover:bg-camel-50">
                        <User size={16}/> Profile
                      </Link>
                      <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 justify-center p-3 bg-white border border-camel-100 rounded-2xl text-xs font-bold text-espresso-700 shadow-sm hover:bg-camel-50">
                        <Settings size={16}/> Settings
                      </Link>
                   </div>

                   {/* Mobile Actions */}
                   <div className="flex items-center justify-between mt-2">
                     <div className="flex items-center gap-2">
                       <button className="p-3 bg-white text-espresso-600 hover:text-camel-800 hover:bg-camel-50 transition-colors rounded-xl shadow-sm border border-camel-100">
                         <Search size={18} />
                       </button>
                       <button className="p-3 bg-white text-espresso-600 hover:text-camel-800 hover:bg-camel-50 transition-colors rounded-xl shadow-sm border border-camel-100 relative">
                         <Bell size={18} />
                         <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-accent-500 border border-white"></span>
                       </button>
                     </div>
                     
                     <button 
                        onClick={logout || (() => {
                          localStorage.removeItem('user');
                          sessionStorage.removeItem('user');
                          window.location.href = '/login';
                        })}
                        className="p-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors shadow-sm flex items-center justify-center"
                        aria-label="Logout"
                     >
                       <LogOut size={18} />
                     </button>
                   </div>
                 </>
               ) : (
                 <Link 
                   to="/login" 
                   onClick={() => setIsMobileMenuOpen(false)}
                   className="w-full mt-2 p-4 bg-camel-800 text-white rounded-2xl font-bold text-sm text-center flex items-center justify-center gap-2 shadow-md hover:bg-camel-900 transition-colors"
                 >
                   <User size={18} /> Sign In / Join
                 </Link>
               )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}






