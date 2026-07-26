import React, { useState } from 'react';
import { useApp, DashboardTab } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  Share2, 
  Bell, 
  Plus, 
  User as UserIcon, 
  ShieldCheck, 
  Building2, 
  UserCheck, 
  Globe, 
  LayoutDashboard, 
  LogOut, 
  Check, 
  ChevronDown,
  Sparkles,
  Layers
} from 'lucide-react';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenCampaignWizard: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications, onOpenCampaignWizard }) => {
  const { 
    currentRole, 
    setCurrentRole, 
    activeTab, 
    setActiveTab, 
    publicView, 
    setPublicView, 
    currentUser, 
    notifications,
    business,
    setAuthModalOpen,
    setAuthMode
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const unreadCount = (notifications || []).filter(n => !n.read).length;

  const rolesList: { role: UserRole; label: string; desc: string; icon: any }[] = [
    { role: 'super_admin', label: 'Super Admin', desc: 'System-wide control & multi-tenant view', icon: ShieldCheck },
    { role: 'business_admin', label: 'Business Admin', desc: 'Full company communication & campaign management', icon: Building2 },
    { role: 'staff', label: 'Staff Member', desc: 'Manage contacts, execute campaigns, view logs', icon: UserCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E2DA] px-4 lg:px-8 h-20 flex items-center justify-between shadow-xs">
      {/* Brand Logo & View Toggle */}
      <div className="flex items-center gap-4 lg:gap-6">
        <div 
          onClick={() => { setPublicView(false); setActiveTab('overview'); }}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-[#8A9A5B] text-white flex items-center justify-center font-bold shadow-xs group-hover:bg-[#78884B] transition-colors">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-[#2D302D] transition-colors">
              ConnectFlow
            </span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#F2F0EB] text-[#2D302D] border border-[#E5E2DA] rounded-full">
              Automated SaaS
            </span>
          </div>
        </div>


      </div>

      {/* Center/Right Action Bar */}
      <div className="flex items-center gap-3">
        {/* Role Switcher Selector */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E5E2DA] bg-[#F9F8F6] hover:bg-[#F2F0EB] text-[#2D302D] text-xs font-semibold transition-all"
            title="Switch User Role Persona"
          >
            <span className="w-2 h-2 rounded-full bg-[#8A9A5B] animate-pulse"></span>
            <span className="hidden sm:inline text-[#8A857C] font-normal">Role:</span>
            <span className="text-[#8A9A5B] font-bold">
              {currentRole === 'super_admin' ? 'Super Admin' : currentRole === 'business_admin' ? 'Business Admin' : 'Staff'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#8A857C]" />
          </button>

          {roleDropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-[#E5E2DA] shadow-xl py-2 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-150"
              onMouseLeave={() => setRoleDropdownOpen(false)}
            >
              <div className="px-3.5 py-2 border-b border-[#F2F0EB]">
                <p className="text-[11px] font-bold text-[#8A857C] uppercase tracking-wider">Demo Role Simulator</p>
                <p className="text-xs text-[#6B6760]">Switch role to test different permissions</p>
              </div>
              {rolesList.map(item => {
                const Icon = item.icon;
                const isSelected = currentRole === item.role;
                return (
                  <button
                    key={item.role}
                    onClick={() => {
                      setCurrentRole(item.role);
                      setRoleDropdownOpen(false);
                      if (item.role === 'super_admin') setActiveTab('superadmin');
                      else if (activeTab === 'superadmin') setActiveTab('overview');
                    }}
                    className={`w-full text-left px-3.5 py-2.5 flex items-start gap-3 hover:bg-[#F9F8F6] transition-colors ${isSelected ? 'bg-[#F2F0EB]' : ''}`}
                  >
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-[#8A9A5B] text-white' : 'bg-[#F2F0EB] text-[#8A857C]'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isSelected ? 'text-[#2D302D]' : 'text-[#2D302D]'}`}>
                          {item.label}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#8A9A5B]" />}
                      </div>
                      <p className="text-[11px] text-[#8A857C] leading-tight mt-0.5">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Campaign Creation CTA */}
        {!publicView && (
          <button
            onClick={onOpenCampaignWizard}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8A9A5B] hover:bg-[#78884B] text-white text-xs font-bold shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Campaign</span>
          </button>
        )}

        {/* Notification Bell */}
        {!publicView && (
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-xl border border-[#E5E2DA] bg-white hover:bg-[#F9F8F6] text-[#2D302D] transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-[#8A857C]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#8A9A5B] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        )}

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-[#F2F0EB] transition-colors"
          >
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-9 h-9 rounded-full border border-[#E5E2DA] object-cover"
            />
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-[#2D302D] leading-none">{currentUser.name}</p>
              <p className="text-[10px] text-[#8A857C] leading-none mt-1">{business.name}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#8A857C] hidden lg:block" />
          </button>

          {profileDropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#E5E2DA] shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-left"
              onMouseLeave={() => setProfileDropdownOpen(false)}
            >
              <div className="px-3.5 py-2 border-b border-[#F2F0EB]">
                <p className="text-xs font-bold text-[#2D302D]">{currentUser.name}</p>
                <p className="text-[11px] text-[#8A857C]">{currentUser.email}</p>
                <span className="mt-1 inline-block px-2 py-0.5 bg-[#F2F0EB] text-[#2D302D] text-[10px] font-semibold rounded-md">
                  {business.industry}
                </span>
              </div>
              <button
                onClick={() => { setActiveTab('settings'); setProfileDropdownOpen(false); setPublicView(false); }}
                className="w-full text-left px-3.5 py-2 text-xs text-[#2D302D] hover:bg-[#F9F8F6] flex items-center gap-2"
              >
                <Building2 className="w-3.5 h-3.5 text-[#8A857C]" />
                <span>Company Profile & Settings</span>
              </button>
              <button
                onClick={() => { setActiveTab('subscription'); setProfileDropdownOpen(false); setPublicView(false); }}
                className="w-full text-left px-3.5 py-2 text-xs text-[#2D302D] hover:bg-[#F9F8F6] flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#8A857C]" />
                <span>Plan & Billing ({business.plan.toUpperCase()})</span>
              </button>
              <div className="border-t border-[#F2F0EB] my-1"></div>
              <button
                onClick={() => {
                  localStorage.removeItem('cf_is_logged_in');
                  setPublicView(true);
                  setAuthMode('login');
                  setAuthModalOpen(false);
                  setProfileDropdownOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span>Sign Out / Lock Session</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
