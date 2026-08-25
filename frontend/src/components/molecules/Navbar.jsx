import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, HeartHandshake, ShoppingBag, Bell, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Navbar() {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Veterinarian', path: '/vet', icon: Stethoscope },
    { name: 'Shelter', path: '/shelter', icon: HeartHandshake },
    { name: 'Shop', path: '/shop', icon: ShoppingBag },
  ];

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <header className="w-full max-w-5xl bg-white/80 backdrop-blur-xl border border-camel-100 rounded-full shadow-floating flex items-center justify-between px-6 py-3 pointer-events-auto transition-all">
        
        {/* Custom Typographic Logo */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-camel-500 flex items-center justify-center shadow-soft">
            <HeartHandshake size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl text-espresso-900 tracking-tight">
            FurShield<span className="text-camel-500">.</span>
          </span>
        </div>

        {/* Floating Center Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => cn(
                  "group relative flex items-center gap-2 py-1 text-sm font-medium transition-colors duration-300",
                  isActive ? "text-camel-600" : "text-espresso-500 hover:text-camel-500"
                )}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={16} className={cn("transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
                    <span>{item.name}</span>
                    {/* Animated Underline Effect */}
                    <span className={cn(
                      "absolute -bottom-2 left-0 h-[2px] bg-camel-500 transition-all duration-300 rounded-full",
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    )} />
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Actions & Profile */}
        <div className="flex items-center gap-2">
          <button className="p-2 text-espresso-500 hover:text-camel-600 transition-colors rounded-full hover:bg-camel-50">
            <Search size={18} />
          </button>
          <button className="relative p-2 text-espresso-500 hover:text-camel-600 transition-colors rounded-full hover:bg-camel-50">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-500 border-2 border-white"></span>
          </button>
          <div className="w-10 h-10 rounded-full bg-camel-100 border border-camel-200 flex items-center justify-center ml-2 cursor-pointer shadow-sm hover:shadow-soft transition-all hover:scale-105">
            <span className="text-sm font-bold text-camel-800">RH</span>
          </div>
        </div>
      </header>
    </div>
  );
}
