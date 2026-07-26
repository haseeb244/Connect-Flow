import React from 'react';
import { useApp, DashboardTab } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Users, 
  Send, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Zap,
  Sparkles,
  Layers
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    contacts, 
    campaigns, 
    business,
    setPublicView
  } = useApp();

  const activeCampaignsCount = (campaigns || []).filter(c => c.status === 'scheduled' || c.status === 'running').length;

  const mainNavItems = [
    { id: 'overview' as DashboardTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'contacts' as DashboardTab, label: 'Contacts', icon: Users, badge: (contacts || []).length > 0 ? (contacts || []).length : undefined },
    { id: 'campaigns' as DashboardTab, label: 'Campaigns', icon: Send, badge: activeCampaignsCount > 0 ? `${activeCampaignsCount}` : undefined, badgeColor: 'bg-blue-600 text-white' },
    { id: 'messaging' as DashboardTab, label: 'Messages', icon: MessageSquare },
    { id: 'reports' as DashboardTab, label: 'Reports', icon: BarChart3 },
    { id: 'settings' as DashboardTab, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white text-slate-700 flex flex-col shrink-0 h-screen border-r border-slate-200 hidden md:flex select-none z-30">
      {/* Top Sidebar Brand Logo */}
      <div 
        onClick={() => { setPublicView(false); setActiveTab('overview'); }}
        className="h-16 px-6 border-b border-slate-200 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
          <Layers className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-lg font-bold tracking-tight text-slate-900 block leading-none truncate">
            ConnectFlow
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 mt-1 block">
            Automated SaaS
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Navigation
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
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    isActive ? 'bg-blue-600 text-white' : item.badgeColor || 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Plan Status & Quotas Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>Credits & Quota</span>
            </span>
            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
              {business.plan.toUpperCase()}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>SMS / WhatsApp:</span>
              <span className="font-bold text-slate-800">{business.smsCredits.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: '70%' }}></div>
            </div>
          </div>

          <button
            onClick={() => { setActiveTab('settings'); setPublicView(false); }}
            className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Manage Subscription</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

