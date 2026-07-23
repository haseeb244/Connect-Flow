import React, { useState } from 'react';
import { useApp, DashboardTab } from '../../context/AppContext';
import { 
  Home, 
  Users, 
  Send, 
  BarChart3, 
  Menu, 
  X, 
  FileText, 
  PhoneCall, 
  MessageSquare, 
  Workflow, 
  CreditCard, 
  UserCheck, 
  Settings, 
  ShieldAlert 
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentRole, setPublicView } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const mainTabs: { id: DashboardTab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Home', icon: Home },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'campaigns', label: 'Campaigns', icon: Send },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  const secondaryTabs: { id: DashboardTab; label: string; icon: any }[] = [
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'voice_calls', label: 'Voice Calls', icon: PhoneCall },
    { id: 'messaging', label: 'Message Logs', icon: MessageSquare },
    { id: 'automation', label: 'Automations', icon: Workflow },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'staff', label: 'Team', icon: UserCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (currentRole === 'super_admin') {
    secondaryTabs.unshift({ id: 'superadmin', label: 'Super Admin', icon: ShieldAlert });
  }

  return (
    <>
      {/* Drawer Overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-[#2D302D]/60 backdrop-blur-xs z-50 md:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <div 
            className="fixed bottom-16 left-0 right-0 bg-white rounded-t-3xl p-5 border-t border-[#E5E2DA] shadow-2xl max-h-[70vh] overflow-y-auto animate-in slide-in-from-bottom duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F2F0EB]">
              <span className="text-xs font-bold uppercase text-[#8A857C] tracking-wider">All App Navigation</span>
              <button 
                onClick={() => setMenuOpen(false)}
                className="p-1 rounded-full text-[#8A857C] hover:bg-[#F2F0EB]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {secondaryTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setPublicView(false);
                      setMenuOpen(false);
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold text-left transition-colors ${
                      isActive 
                        ? 'bg-[#F2F0EB] border-[#8A9A5B] text-[#2D302D]' 
                        : 'bg-[#F9F8F6] border-[#E5E2DA] text-[#2D302D] hover:bg-[#F2F0EB]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#8A9A5B]' : 'text-[#8A857C]'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Bar */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-[#E5E2DA] h-16 z-40 md:hidden flex justify-around items-center px-1 shadow-lg">
        {mainTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setPublicView(false);
                setMenuOpen(false);
              }}
              className={`flex flex-col items-center justify-center w-full h-full pt-1 transition-all ${
                isActive 
                  ? 'text-[#8A9A5B] border-t-2 border-[#8A9A5B] bg-[#F2F0EB]/60 font-bold' 
                  : 'text-[#8A857C] hover:text-[#2D302D]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`flex flex-col items-center justify-center w-full h-full pt-1 transition-all ${
            menuOpen ? 'text-[#8A9A5B] font-bold' : 'text-[#8A857C]'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">More</span>
        </button>
      </nav>
    </>
  );
};
