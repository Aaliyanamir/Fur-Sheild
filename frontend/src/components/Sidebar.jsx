import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { 
  Heart, 
  Calendar, 
  FileText, 
  ShoppingBag, 
  ShieldAlert, 
  Stethoscope, 
  Clock, 
  Home, 
  Award,
  Users,
  Bell,
  Settings,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ onOpenProfileModal }) => {
  const { role, user } = useAuth();
  const location = useLocation();

  const navItemsByRole = {
    owner: [
      { name: 'Overview', path: '/owner-dashboard', icon: Home },
      { name: 'My Pets', path: '/owner-dashboard?tab=pets', icon: Heart },
      { name: 'Health Timeline', path: '/owner-dashboard?tab=timeline', icon: Calendar },
      { name: 'Vet Certificates', path: '/owner-dashboard?tab=certificates', icon: FileText },
      { name: 'Reminders & Alerts', path: '/owner-dashboard?tab=reminders', icon: Bell },
      { name: 'Pet Care Shop', path: '/shop', icon: ShoppingBag },
    ],
    vet: [
      { name: 'Overview', path: '/vet-dashboard', icon: Home },
      { name: 'Appointments Schedule', path: '/vet-dashboard?tab=appointments', icon: Clock },
      { name: 'Patient Medical Records', path: '/vet-dashboard?tab=records', icon: Stethoscope },
      { name: 'Log Diagnosis / Treatment', path: '/vet-dashboard?tab=logger', icon: FileText },
    ],
    shelter: [
      { name: 'Overview', path: '/shelter-dashboard', icon: Home },
      { name: 'Adoptable Pets Inventory', path: '/shelter-dashboard?tab=inventory', icon: Heart },
      { name: 'Adoption Applications', path: '/shelter-dashboard?tab=applications', icon: Users },
    ]
  };

  const currentNavItems = navItemsByRole[role] || navItemsByRole.owner;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-5rem)] flex flex-col justify-between p-4 shadow-card font-sans">
      <div className="space-y-6">
        {/* Interactive User Info Card in Sidebar */}
        <button
          onClick={onOpenProfileModal}
          className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 flex items-center space-x-3 text-left transition-all group"
          title="Click to edit user profile"
        >
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
            alt="User Avatar"
            className="w-10 h-10 rounded-xl object-cover border-2 border-slate-300 group-hover:border-slate-900 transition-colors"
          />
          <div className="overflow-hidden flex-1">
            <h4 className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Alex Johnson'}</h4>
            <span className="inline-block px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-slate-900 text-white tracking-wider">
              {role}
            </span>
          </div>
          <Settings className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
        </button>

        {/* Dynamic Navigation Menu */}
        <div>
          <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-3 px-3">
            {role.toUpperCase()} MENU
          </h3>
          <nav className="space-y-1">
            {currentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname + location.search === item.path || (item.path === '/owner-dashboard' && location.pathname === '/owner-dashboard' && !location.search);

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer link in Sidebar */}
      <div className="pt-4 border-t border-slate-100 space-y-1">
        <button
          onClick={onOpenProfileModal}
          className="w-full flex items-center space-x-3 px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <User className="w-4 h-4 text-slate-400" />
          <span>Account Settings</span>
        </button>
        <Link
          to="/shop"
          className="flex items-center space-x-3 px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <ShoppingBag className="w-4 h-4 text-slate-400" />
          <span>Pet Marketplace</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
