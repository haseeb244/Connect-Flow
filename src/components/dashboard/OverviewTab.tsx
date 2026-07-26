import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Send, 
  Calendar, 
  Zap, 
  Plus, 
  UserPlus, 
  MessageSquare, 
  BarChart3, 
  ArrowUpRight
} from 'lucide-react';

interface OverviewTabProps {
  onOpenCampaignWizard: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onOpenCampaignWizard }) => {
  const { 
    contacts, 
    campaigns, 
    messageLogs, 
    setActiveTab, 
    business 
  } = useApp();

  const totalContacts = (contacts || []).length;
  const activeCampaigns = (campaigns || []).filter(c => c.status === 'running' || c.status === 'active').length;
  const totalMessagesSent = (messageLogs || []).filter(m => m.status === 'delivered' || m.status === 'sent' || m.status === 'read').length;
  const scheduledCampaigns = (campaigns || []).filter(c => c.status === 'scheduled').length;

  const recentCampaigns = (campaigns || []).slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E2DA]">
        <div>
          <h2 className="text-2xl font-bold text-[#2D302D] tracking-tight">Overview Dashboard</h2>
          <p className="text-xs text-[#8A857C] mt-0.5">
            Real-time campaign performance and statistics for <strong className="text-[#2D302D]">{business.name}</strong>.
          </p>
        </div>
      </div>

      {/* Row 1: 4 Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Contacts */}
        <div className="bg-white border border-[#E5E2DA] rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:border-[#8A9A5B] transition-colors">
          <div>
            <span className="p-2.5 rounded-xl bg-[#F2F0EB] text-[#8A9A5B] inline-flex">
              <Users className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-[#8A857C]">Total Contacts</p>
            <p className="text-3xl font-bold text-[#2D302D] mt-1">{totalContacts.toLocaleString()}</p>
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="bg-white border border-[#E5E2DA] rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:border-[#8A9A5B] transition-colors">
          <div>
            <span className="p-2.5 rounded-xl bg-[#F2F0EB] text-[#8A9A5B] inline-flex">
              <Zap className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-[#8A857C]">Active Campaigns</p>
            <p className="text-3xl font-bold text-[#2D302D] mt-1">{activeCampaigns.toLocaleString()}</p>
          </div>
        </div>

        {/* Messages Sent */}
        <div className="bg-white border border-[#E5E2DA] rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:border-[#8A9A5B] transition-colors">
          <div>
            <span className="p-2.5 rounded-xl bg-[#F2F0EB] text-[#8A9A5B] inline-flex">
              <Send className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-[#8A857C]">Messages Sent</p>
            <p className="text-3xl font-bold text-[#2D302D] mt-1">{totalMessagesSent.toLocaleString()}</p>
          </div>
        </div>

        {/* Scheduled Campaigns */}
        <div className="bg-white border border-[#E5E2DA] rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:border-[#8A9A5B] transition-colors">
          <div>
            <span className="p-2.5 rounded-xl bg-[#F2F0EB] text-[#8A9A5B] inline-flex">
              <Calendar className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-[#8A857C]">Scheduled Campaigns</p>
            <p className="text-3xl font-bold text-[#2D302D] mt-1">{scheduledCampaigns.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Row 2: Quick Actions */}
      <div className="bg-white p-6 rounded-3xl border border-[#E5E2DA] shadow-xs">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-[#2D302D]">Quick Actions</h3>
          <p className="text-[11px] text-[#8A857C]">Fast shortcuts for daily campaign tasks</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('contacts')}
            className="p-3.5 bg-[#F9F8F6] hover:bg-[#F2F0EB] border border-[#E5E2DA] hover:border-[#8A9A5B] rounded-2xl transition-all flex items-center gap-3 text-left w-full group"
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E2DA] flex items-center justify-center text-[#8A9A5B] shrink-0 group-hover:border-[#8A9A5B] transition-colors">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#2D302D]">Add Contact</p>
              <p className="text-[11px] text-[#8A857C]">Import or manage target contact lists</p>
            </div>
          </button>

          <button
            onClick={onOpenCampaignWizard}
            className="p-3.5 bg-[#F9F8F6] hover:bg-[#F2F0EB] border border-[#E5E2DA] hover:border-[#8A9A5B] rounded-2xl transition-all flex items-center gap-3 text-left w-full group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#8A9A5B] text-white flex items-center justify-center shrink-0">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#2D302D]">Create Campaign</p>
              <p className="text-[11px] text-[#8A857C]">Launch scheduled multi-channel broadcasts</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('messaging')}
            className="p-3.5 bg-[#F9F8F6] hover:bg-[#F2F0EB] border border-[#E5E2DA] hover:border-[#8A9A5B] rounded-2xl transition-all flex items-center gap-3 text-left w-full group"
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E2DA] flex items-center justify-center text-[#8A9A5B] shrink-0 group-hover:border-[#8A9A5B] transition-colors">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#2D302D]">Send Message</p>
              <p className="text-[11px] text-[#8A857C]">Dispatch instant direct notifications</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className="p-3.5 bg-[#F9F8F6] hover:bg-[#F2F0EB] border border-[#E5E2DA] hover:border-[#8A9A5B] rounded-2xl transition-all flex items-center gap-3 text-left w-full group"
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E2DA] flex items-center justify-center text-[#8A9A5B] shrink-0 group-hover:border-[#8A9A5B] transition-colors">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#2D302D]">View Reports</p>
              <p className="text-[11px] text-[#8A857C]">Analyze delivery and engagement data</p>
            </div>
          </button>
        </div>
      </div>

      {/* Row 3: Recent Campaigns Table */}
      <div className="bg-white p-6 rounded-3xl border border-[#E5E2DA] shadow-xs">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#2D302D]">Recent Campaigns</h3>
            <p className="text-[11px] text-[#8A857C]">Overview of latest broadcast workflows</p>
          </div>
          <button
            onClick={() => setActiveTab('campaigns')}
            className="text-xs font-bold text-[#8A9A5B] hover:underline flex items-center gap-0.5"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E2DA] text-[11px] font-bold text-[#8A857C] uppercase tracking-wider">
                <th className="pb-3 pr-4">Campaign Name</th>
                <th className="pb-3 px-3">Channel</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 pl-3 text-right">Schedule Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F0EB]">
              {recentCampaigns.map(cmp => (
                <tr key={cmp.id} className="hover:bg-[#F9F8F6] transition-colors">
                  <td className="py-3.5 pr-4 min-w-[160px]">
                    <p className="text-xs font-bold text-[#2D302D] truncate">{cmp.name}</p>
                    <p className="text-[11px] text-[#8A857C] truncate">{cmp.groupName}</p>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#8A9A5B] text-white font-bold text-[10px] uppercase">
                      {cmp.channel}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                      cmp.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                      cmp.status === 'running' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                      cmp.status === 'scheduled' ? 'bg-amber-100 text-amber-800' : 'bg-[#E5E2DA] text-[#2D302D]'
                    }`}>
                      {cmp.status}
                    </span>
                  </td>
                  <td className="py-3.5 pl-3 text-right whitespace-nowrap text-xs text-[#2D302D] font-medium">
                    {cmp.scheduleDate} {cmp.scheduleTime ? `• ${cmp.scheduleTime}` : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
