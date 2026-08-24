import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

export default function Topbar({ onOpenSidebar }) {
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-white border-b border-slate-200 shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onOpenSidebar}
          className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
        
        {/* Global Search */}
        <div className="hidden md:flex relative max-w-md w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Search records, pets, or vets..." 
            className="pl-9 h-9 bg-slate-50 border-transparent focus:bg-white focus:border-forest-500 focus:ring-forest-500 transition-all rounded-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="w-9 h-9 p-0 rounded-full relative">
          <Bell size={18} className="text-slate-600" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 border-2 border-white"></span>
        </Button>
      </div>
    </header>
  );
}
