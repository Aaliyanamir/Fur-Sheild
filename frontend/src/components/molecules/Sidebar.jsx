import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, HeartHandshake, ShoppingBag, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Sidebar({ isOpen, onClose }) {
  const navItems = [
    { name: 'Owner Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Vet Workstation', path: '/vet', icon: Stethoscope },
    { name: 'Shelter Hub', path: '/shelter', icon: HeartHandshake },
    { name: 'Pet Shop', path: '/shop', icon: ShoppingBag },
  ];

  const sidebarClasses = cn(
    "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col",
    isOpen ? "translate-x-0" : "-translate-x-full"
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside className={sidebarClasses}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 shrink-0">
          <span className="font-display font-bold text-xl text-slate-900 tracking-tight">
            FurShield<span className="text-forest-600">.</span>
          </span>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => { if(isOpen) onClose(); }}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-forest-50 text-forest-700" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon size={18} className="shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom User Area Placeholder */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold text-slate-600">RH</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-slate-900 truncate">Raza Hussain</p>
              <p className="text-xs text-slate-500 truncate">Pet Owner</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
