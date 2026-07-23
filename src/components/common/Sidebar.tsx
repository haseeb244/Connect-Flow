import React from 'react';
import { useApp, DashboardTab } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  FileText, 
  Send, 
  PhoneCall, 
  MessageSquare, 
  Workflow, 
  BarChart3, 
  CreditCard, 
  UserCheck, 
  Settings, 
  ShieldAlert,
  Zap,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    currentRole, 
    contacts, 
    campaigns, 
    automationRules,
    business,
    setPublicView
  } = useApp();

  const activeCampaignsCount = campaigns.filter(c => c.status === 'scheduled' || c.status === 'running').length;
  const activeRulesCount = automationRules.filter(r => r.isActive).length;

  const mainNavItems = [
    { id: 'overview' as DashboardTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'contacts' as DashboardTab, label: 'Contacts & Groups', icon: Users, badge: contacts.length },
    { id: 'templates' as DashboardTab, label: 'Message Templates', icon: FileText },
    { id: 'campaigns' as DashboardTab, label: 'Campaigns', icon: Send, badge: activeCampaignsCount > 0 ? `${activeCampaignsCount} Active` : undefined, badgeColor: 'bg-indigo-100 text-indigo-700' },
    { id: 'voice_calls' as DashboardTab, label: 'Voice Calling', icon: PhoneCall },
    { id: 'messaging' as DashboardTab, label: 'Message Logs', icon: MessageSquare },
    { id: 'automation' as DashboardTab, label: 'Automation Rules', icon: Workflow, badge: `${activeRulesCount} Rules`, badgeColor: 'bg-emerald-100 text-emerald-700' },
    { id: 'reports' as DashboardTab, label: 'Reports & Analytics', icon: BarChart3 },
  ];

  const secondaryNavItems = [
    { id: 'subscription' as DashboardTab, label: 'Subscription & Billing', icon: CreditCard },
    { id: 'staff' as DashboardTab, label: 'Team & Staff', icon: UserCheck },
    { id: 'settings' as DashboardTab, label: 'Settings & Gateways', icon: Settings },
  ];

  if (currentRole === 'super_admin') {
    secondaryNavItems.unshift({
      id: 'superadmin' as DashboardTab,
      label: 'Super Admin Portal',
      icon: ShieldAlert,
    });
  }

  return (
    <aside className="w-64 bg-[#2D302D] text-[#EBE9E4] flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-[#3F433F] hidden md:flex select-none">
      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
        <div>
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#A8A59E] mb-2">
            Main Workspace
          </p>
          <nav className="space-y-1">
            {mainNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setPublicView(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-[#3F433F] text-white shadow-xs' 
                      : 'text-[#EBE9E4] hover:bg-[#3F433F]/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#8A9A5B]' : 'text-[#A8A59E]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive ? 'bg-[#8A9A5B] text-white' : item.badgeColor || 'bg-[#3F433F] text-[#A8A59E]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#A8A59E] mb-2">
            Administration
          </p>
          <nav className="space-y-1">
            {secondaryNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setPublicView(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-[#3F433F] text-white shadow-xs' 
                      : 'text-[#EBE9E4] hover:bg-[#3F433F]/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#8A9A5B]' : 'text-[#A8A59E]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Credit Meters & Usage Footer */}
      <div className="p-3 border-t border-[#3F433F] bg-[#222522]">
        <div className="p-3.5 bg-[#3F433F] rounded-2xl border border-[#4A4E4A] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#8A9A5B]" />
              <span>Gateway Credits</span>
            </span>
            <span className="text-[10px] font-semibold text-[#8A9A5B] bg-[#2D302D] px-2 py-0.5 rounded-md border border-[#4A4E4A]">
              {business.plan.toUpperCase()}
            </span>
          </div>

          {/* SMS Meter */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-[#A8A59E]">
              <span>SMS Balance:</span>
              <span className="font-bold text-white">{business.smsCredits.toLocaleString()}</span>
            </div>
            <div className="w-full bg-[#2D302D] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#8A9A5B] h-full rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>

          {/* WhatsApp Meter */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-[#A8A59E]">
              <span>WhatsApp Credits:</span>
              <span className="font-bold text-white">{business.whatsappCredits.toLocaleString()}</span>
            </div>
            <div className="w-full bg-[#2D302D] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#8A9A5B] h-full rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>

          {/* Voice Minutes Meter */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-[#A8A59E]">
              <span>Voice Minutes:</span>
              <span className="font-bold text-white">{business.voiceMinutes.toLocaleString()} mins</span>
            </div>
            <div className="w-full bg-[#2D302D] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#8A9A5B] h-full rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>

          <button
            onClick={() => { setActiveTab('subscription'); setPublicView(false); }}
            className="w-full py-2 px-3 bg-[#8A9A5B] hover:bg-[#78884B] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Recharge & Upgrade</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
