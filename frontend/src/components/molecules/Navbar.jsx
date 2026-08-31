import React, { useState, useEffect, useContext } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { BookOpen, LayoutDashboard, Stethoscope, HeartHandshake, ShoppingBag, Bell, Search, PawPrint, Menu, X, User, Settings, LogOut, Calendar, ClipboardList, Activity, Home } from 'lucide-react';
import { cn } from '../../lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import notificationService from '../../services/notification.service';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, location.pathname]);

  const handleSearch = (e) => {
      e.preventDefault();
      const q = searchQuery.trim();
      if (!q) return;
      const lower = q.toLowerCase();
      if (/\b(adopt|dog|cat|bird|puppy|kitten|rescue|shelter)\b/.test(lower)) {
        navigate(`/adopt?search=${encodeURIComponent(q)}`);
      } else if (/\b(article|care|guide|train|groom)\b/.test(lower)) {
        navigate('/care-hub');
      } else if (/\b(vet|clinic|doctor|appointment)\b/.test(lower)) {
        navigate('/book-vet');
      } else {
        navigate(`/shop?search=${encodeURIComponent(q)}`);
      }
      setIsSearchOpen(false);
      setSearchQuery('');
    };

    const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      if (res.success) setNotifications(res.data);
    } catch (e) { console.error(e); }
  };

  const handleNotifClick = async (notif) => {
    if (!notif.isRead) {
      await notificationService.markAsRead(notif._id);
      setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
    }
    setIsNotifOpen(false);
    navigate(notif.actionUrl);
  };

  const markAllRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const getNavItems = (user) => {
    if (!user) {
      return [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Adopt', path: '/adopt', icon: HeartHandshake },
        { name: 'Shop', path: '/shop', icon: ShoppingBag },
        { name: 'Care Hub', path: '/care-hub', icon: BookOpen },
        { name: 'Find a Vet', path: '/book-vet', icon: Stethoscope },
      ];
    }
    
    switch (user.role) {
      case 'USER':
        return [
          { name: 'Home', path: '/', icon: Home },
          { name: 'Adopt', path: '/adopt', icon: HeartHandshake },
          { name: 'Shop', path: '/shop', icon: ShoppingBag },
          { name: 'Care Hub', path: '/care-hub', icon: BookOpen },
          { name: 'Find a Vet', path: '/book-vet', icon: Stethoscope },
        ];
      case 'OWNER':
        return [
          { name: 'Home', path: '/', icon: Home },
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'My Pets', path: '/my-pets', icon: PawPrint },
          { name: 'Adopt', path: '/adopt', icon: HeartHandshake },
          { name: 'Shop', path: '/shop', icon: ShoppingBag },
        ];
      case 'VET':
        return [
          { name: 'Home', path: '/', icon: Home },
          { name: 'Clinical Queue', path: '/vet', icon: Stethoscope },
          { name: 'Appointments', path: '/appointments', icon: Calendar },
          { name: 'Shop', path: '/shop', icon: ShoppingBag },
        ];
      case 'SUPER_ADMIN':
      case 'SYSTEM_ADMIN':
        return [
          { name: 'Home', path: '/', icon: Home },
          { name: 'Admin Hub', path: '/admin', icon: LayoutDashboard },
          { name: 'Shop', path: '/shop', icon: ShoppingBag },
          { name: 'Adopt', path: '/adopt', icon: HeartHandshake },
        ];
      case 'SHELTER_ADMIN':
        return [
          { name: 'Home', path: '/', icon: Home },
          { name: 'Shelter Portal', path: '/shelter', icon: HeartHandshake },
          { name: 'Rescue Pipeline', path: '/pipeline', icon: ClipboardList },
          { name: 'Shop', path: '/shop', icon: ShoppingBag },
        ];
      default:
        return [
          { name: 'Home', path: '/', icon: Home },
          { name: 'Adopt', path: '/adopt', icon: HeartHandshake },
          { name: 'Shop', path: '/shop', icon: ShoppingBag },
        ];
    }
  };

  const navItems = getNavItems(user);

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
            <nav className="hidden md:flex items-center gap-1 md:gap-2 lg:gap-4 h-full pt-1">
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
                            "relative z-10 text-[12px] lg:text-[13px] tracking-wide transition-colors duration-300 whitespace-nowrap",
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
            <div className="hidden md:flex items-center gap-1 lg:gap-2 pr-2 pl-2 lg:pl-6 h-full shrink-0">
              <button onClick={() => setIsSearchOpen(true)} className="p-1.5 lg:p-2 text-espresso-500 hover:text-camel-700 transition-colors rounded-full hover:bg-white/50">
                <Search size={18} strokeWidth={2.5} />
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-1.5 lg:p-2 text-espresso-500 hover:text-camel-700 transition-colors rounded-full hover:bg-white/50"
                aria-label="Open cart"
              >
                <ShoppingBag size={18} strokeWidth={2.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-camel-700 text-white text-[9px] font-black flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              
              
                {user && (
                <div className="relative">
                  <button 
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="relative p-1.5 lg:p-2 text-espresso-500 hover:text-camel-700 transition-colors rounded-full hover:bg-white/50"
                  >
                    <Bell size={18} strokeWidth={2.5} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 lg:top-1.5 right-1.5 lg:right-2 w-2 h-2 rounded-full bg-red-500 border border-white"></span>
                    )}
                  </button>

                  <AnimatePresence>
                    {isNotifOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-[0_20px_60px_rgba(90,56,37,0.15)] border border-camel-100 z-50 overflow-hidden flex flex-col max-h-[28rem]"
                        >
                          <div className="p-4 border-b border-camel-100 flex justify-between items-center bg-[#FAF8F5]">
                            <h3 className="font-black text-espresso-900 text-sm uppercase tracking-widest">Notifications</h3>
                            {unreadCount > 0 && (
                              <button onClick={markAllRead} className="text-[10px] font-bold text-camel-600 hover:text-camel-800 uppercase">Mark All Read</button>
                            )}
                          </div>
                          
                          <div className="overflow-y-auto flex-1 p-2 space-y-1">
                            {notifications.length === 0 ? (
                              <div className="p-6 text-center text-xs font-medium text-camel-600">
                                No new notifications.
                              </div>
                            ) : (
                              notifications.map(notif => (
                                <div 
                                  key={notif._id} 
                                  onClick={() => handleNotifClick(notif)}
                                  className={`cursor-pointer p-3 rounded-2xl flex items-start gap-3 transition-colors ${notif.isRead ? 'hover:bg-camel-50' : 'bg-camel-50/50 hover:bg-camel-100'}`}
                                >
                                  <div className={`mt-0.5 p-2 rounded-full shrink-0 ${notif.isRead ? 'bg-camel-100 text-camel-600' : 'bg-camel-200 text-camel-800'}`}>
                                    {notif.type === 'APPOINTMENT' && <Calendar size={14} />}
                                    {notif.type === 'ORDER' && <ShoppingBag size={14} />}
                                    {notif.type === 'VACCINE' && <Activity size={14} />}
                                    {notif.type === 'SYSTEM' && <Bell size={14} />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-xs mb-0.5 truncate ${notif.isRead ? 'font-bold text-espresso-700' : 'font-black text-espresso-900'}`}>{notif.title}</p>
                                    <p className="text-[11px] text-espresso-500 leading-tight line-clamp-2">{notif.message}</p>
                                    <span className="text-[9px] font-bold text-camel-500 mt-1 block">
                                      {new Date(notif.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  {!notif.isRead && <div className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-2"></div>}
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
                )}

              
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

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[300] flex items-start justify-center pt-24 px-4 pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="absolute inset-0 bg-espresso-900/60 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="relative z-10 w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-camel-100"
            >
              <form onSubmit={handleSearch} className="flex items-center p-4">
                <Search className="text-camel-400 ml-4 shrink-0" size={24} />
                <input 
                  autoFocus
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, pets, or care articles..." 
                  className="w-full bg-transparent border-none outline-none px-6 py-4 text-xl font-medium text-espresso-900 placeholder:text-camel-300"
                />
                <button 
                  type="button" 
                  onClick={() => setIsSearchOpen(false)} 
                  className="p-3 text-espresso-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 mr-2 shrink-0 cursor-pointer"
                  aria-label="Close search"
                >
                  <X size={24} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
                       <button onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }} className="p-3 bg-white text-espresso-600 hover:text-camel-800 hover:bg-camel-50 transition-colors rounded-xl shadow-sm border border-camel-100">
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
                  <div className="flex flex-col gap-3 mt-2">
                    <button 
                      onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }}
                      className="w-full p-3.5 bg-white border border-camel-200 text-espresso-700 rounded-2xl font-bold text-sm text-center flex items-center justify-center gap-2 shadow-sm hover:bg-camel-50 transition-colors"
                    >
                      <Search size={18} /> Search Platform
                    </button>
                    <Link 
                      to="/login" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full p-4 bg-camel-800 text-white rounded-2xl font-bold text-sm text-center flex items-center justify-center gap-2 shadow-md hover:bg-camel-900 transition-colors"
                    >
                      <User size={18} /> Sign In / Join
                    </Link>
                  </div>
               )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
