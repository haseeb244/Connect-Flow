import React from 'react';
import { useApp, DashboardTab } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Users, 
  Send, 
  MessageSquare, 
  BarChart3,
  Settings 
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setPublicView } = useApp();

  const navItems: { id: DashboardTab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'campaigns', label: 'Campaigns', icon: Send },
    { id: 'messaging', label: 'Messages', icon: MessageSquare },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 h-16 z-40 md:hidden flex justify-around items-center px-1 shadow-lg">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setPublicView(false);
            }}
            className={`flex flex-col items-center justify-center w-full h-full pt-1 transition-all ${
              isActive 
                ? 'text-blue-600 font-bold border-t-2 border-blue-600 bg-blue-50/50' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

