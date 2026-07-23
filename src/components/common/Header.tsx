import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Search, 
  Building2, 
  LogOut, 
  ChevronDown,
  Layers
} from 'lucide-react';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenCampaignWizard: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications }) => {
  const { 
    setActiveTab, 
    setPublicView, 
    currentUser, 
    notifications,
    business,
    setAuthModalOpen,
    setAuthMode
  } = useApp();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = (notifications || []).filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 lg:px-8 h-16 flex items-center justify-between shadow-xs">
      {/* Company Logo (Mobile / Tablet brand fallback or header brand) */}
      <div className="flex items-center gap-4 lg:gap-6">
        <div 
          onClick={() => { setPublicView(false); setActiveTab('overview'); }}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs md:hidden">
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 md:hidden">
            ConnectFlow
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs sm:max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts, campaigns, messages..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-100/80 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right Action Bar */}
      <div className="flex items-center gap-3">
        {/* Notification Icon */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4 text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 pl-2 pr-1.5 py-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-8 h-8 rounded-full border border-slate-200 object-cover"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-900 leading-none">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 leading-none mt-1">{business.name}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-lg py-1.5 z-50 text-left"
              onMouseLeave={() => setProfileDropdownOpen(false)}
            >
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
              </div>
              <button
                onClick={() => { setActiveTab('settings'); setProfileDropdownOpen(false); setPublicView(false); }}
                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Account Settings</span>
              </button>
              <div className="border-t border-slate-100 my-1"></div>
              <button
                onClick={() => {
                  localStorage.removeItem('cf_is_logged_in');
                  setPublicView(true);
                  setAuthMode('login');
                  setAuthModalOpen(false);
                  setProfileDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5 text-red-500" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

