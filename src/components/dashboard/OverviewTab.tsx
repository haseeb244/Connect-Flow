import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Send, 
  PhoneCall, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Zap, 
  Plus, 
  FileSpreadsheet, 
  Play,
  MessageSquare
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell 
} from 'recharts';

interface OverviewTabProps {
  onOpenCampaignWizard: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onOpenCampaignWizard }) => {
  const { 
    contacts, 
    campaigns, 
    messageLogs, 
    voiceLogs, 
    setActiveTab, 
    runCampaignSimulation,
    business 
  } = useApp();

  const totalContacts = contacts.length;
  const totalMessagesSent = messageLogs.filter(m => m.status === 'delivered' || m.status === 'sent' || m.status === 'read').length;
  const totalCallsMade = voiceLogs.length;
  const scheduledCampaigns = campaigns.filter(c => c.status === 'scheduled' || c.status === 'running').length;

  const recentActivity = messageLogs.slice(0, 5);

  const chartData = [
    { day: 'Mon', SMS: 1200, WhatsApp: 850, Email: 2100, Voice: 120 },
    { day: 'Tue', SMS: 1900, WhatsApp: 1200, Email: 2800, Voice: 210 },
    { day: 'Wed', SMS: 1400, WhatsApp: 980, Email: 1900, Voice: 180 },
    { day: 'Thu', SMS: 2400, WhatsApp: 1600, Email: 3200, Voice: 290 },
    { day: 'Fri', SMS: 2100, WhatsApp: 1450, Email: 2900, Voice: 240 },
    { day: 'Sat', SMS: 800, WhatsApp: 600, Email: 1100, Voice: 80 },
    { day: 'Sun', SMS: 650, WhatsApp: 450, Email: 900, Voice: 50 },
  ];

  const channelBreakdown = [
    { name: 'SMS', count: 12450, color: '#3525cd' },
    { name: 'WhatsApp', count: 8900, color: '#006c49' },
    { name: 'Email', count: 45000, color: '#4b4dd8' },
    { name: 'Voice', count: 1200, color: '#ba1a1a' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E2DA]">
        <div>
          <h2 className="text-2xl font-bold text-[#2D302D] tracking-tight">Overview Dashboard</h2>
          <p className="text-xs text-[#8A857C] mt-0.5">
            Real-time campaign performance and channel metrics for <strong className="text-[#2D302D]">{business.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('contacts')}
            className="px-4 py-2 bg-white border border-[#E5E2DA] hover:bg-[#F9F8F6] text-[#2D302D] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#8A857C]" />
            <span>Manage Contacts</span>
          </button>
          <button
            onClick={onOpenCampaignWizard}
            className="px-4 py-2 bg-[#8A9A5B] hover:bg-[#78884B] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* Stats Bento Grid (matching Natural Tones styled design) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Contacts */}
        <div className="bg-white border border-[#E5E2DA] rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:border-[#8A9A5B] transition-colors">
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-xl bg-[#F2F0EB] text-[#8A9A5B]">
              <Users className="w-5 h-5" />
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-[#8A857C]">Total Contacts</p>
            <p className="text-3xl font-bold text-[#2D302D] mt-1">{totalContacts.toLocaleString()}</p>
          </div>
        </div>

        {/* Messages Sent */}
        <div className="bg-white border border-[#E5E2DA] rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:border-[#8A9A5B] transition-colors">
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-xl bg-[#F2F0EB] text-[#8A9A5B]">
              <Send className="w-5 h-5" />
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +5%
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-[#8A857C]">Messages Delivered</p>
            <p className="text-3xl font-bold text-[#2D302D] mt-1">8,540</p>
          </div>
        </div>

        {/* Calls Made */}
        <div className="bg-white border border-[#E5E2DA] rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:border-[#8A9A5B] transition-colors">
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-xl bg-[#F2F0EB] text-[#2D302D]">
              <PhoneCall className="w-5 h-5" />
            </span>
            <span className="text-[11px] font-bold text-[#8A857C] bg-[#F2F0EB] border border-[#E5E2DA] px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingDown className="w-3 h-3" /> -2%
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-[#8A857C]">Calls Executed</p>
            <p className="text-3xl font-bold text-[#2D302D] mt-1">1,230</p>
          </div>
        </div>

        {/* Scheduled Campaigns */}
        <div className="bg-white border border-[#E5E2DA] rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:border-[#8A9A5B] transition-colors">
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-xl bg-[#F2F0EB] text-[#8A9A5B]">
              <Calendar className="w-5 h-5" />
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +18%
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-[#8A857C]">Scheduled Workflows</p>
            <p className="text-3xl font-bold text-[#2D302D] mt-1">{scheduledCampaigns}</p>
          </div>
        </div>
      </div>

      {/* Analytics Charts & Live Action Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Delivery Volume Graph */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#E5E2DA] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#2D302D]">Weekly Broadcast Volume</h3>
              <p className="text-[11px] text-[#8A857C]">Messages and voice calls dispatched per day</p>
            </div>
            <span className="text-[11px] font-bold text-[#8A9A5B] bg-[#F2F0EB] border border-[#E5E2DA] px-3 py-1 rounded-full">
              7-Day Activity
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEmail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8A9A5B" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8A9A5B" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSms" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2D302D" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2D302D" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E2DA" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#8A857C' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#8A857C' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#2D302D', borderColor: '#3F433F', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="Email" stroke="#8A9A5B" fillOpacity={1} fill="url(#colorEmail)" strokeWidth={2} />
                <Area type="monotone" dataKey="SMS" stroke="#2D302D" fillOpacity={1} fill="url(#colorSms)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Quota Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E2DA] shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#2D302D]">Channel Distribution</h3>
            <p className="text-[11px] text-[#8A857C] mb-4">Quota usage across active gateways</p>

            <div className="space-y-3.5">
              {channelBreakdown.map((ch, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#2D302D]">{ch.name}</span>
                    <span className="text-[#2D302D] font-bold">{ch.count.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-[#F2F0EB] h-2.5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, (ch.count / 50000) * 100)}%`, backgroundColor: idx % 2 === 0 ? '#8A9A5B' : '#2D302D' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#F2F0EB]">
            <button
              onClick={() => setActiveTab('subscription')}
              className="w-full py-2.5 bg-[#F2F0EB] hover:bg-[#E5E2DA] text-[#2D302D] rounded-xl text-xs font-bold transition-colors text-center"
            >
              View Quotas & Upgrade Plan
            </button>
          </div>
        </div>
      </div>

      {/* Active Campaigns & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Campaign Status Manager */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E2DA] shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#2D302D]">Campaign Execution Queue</h3>
              <p className="text-[11px] text-[#8A857C]">Scheduled and running broadcast workflows</p>
            </div>
            <button
              onClick={() => setActiveTab('campaigns')}
              className="text-xs font-bold text-[#8A9A5B] hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {campaigns.slice(0, 3).map(cmp => (
              <div 
                key={cmp.id}
                className="p-4 bg-[#F9F8F6] rounded-2xl border border-[#E5E2DA] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 bg-[#8A9A5B] text-white`}>
                    {cmp.channel.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#2D302D] truncate">{cmp.name}</p>
                    <p className="text-[11px] text-[#8A857C] truncate">
                      Group: {cmp.groupName} • {cmp.audienceCount} contacts
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                    cmp.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                    cmp.status === 'running' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                    cmp.status === 'scheduled' ? 'bg-amber-100 text-amber-800' : 'bg-[#E5E2DA] text-[#2D302D]'
                  }`}>
                    {cmp.status}
                  </span>

                  {cmp.status === 'scheduled' && (
                    <button
                      onClick={() => runCampaignSimulation(cmp.id)}
                      className="px-3 py-1 bg-[#8A9A5B] hover:bg-[#78884B] text-white rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 shadow-xs"
                      title="Run live test broadcast now"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Run Now</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Message & Voice Stream */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E2DA] shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#2D302D]">Recent Activity Stream</h3>
              <p className="text-[11px] text-[#8A857C]">Live delivery logs across all channels</p>
            </div>
            <button
              onClick={() => setActiveTab('messaging')}
              className="text-xs font-bold text-[#8A9A5B] hover:underline flex items-center gap-0.5"
            >
              <span>Full Logs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentActivity.map(act => (
              <div 
                key={act.id} 
                className="p-3.5 rounded-2xl border border-[#E5E2DA] bg-[#F9F8F6] hover:bg-[#F2F0EB] transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#E5E2DA] flex items-center justify-center text-[#2D302D] font-bold text-xs shrink-0">
                    <MessageSquare className="w-4 h-4 text-[#8A9A5B]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#2D302D] truncate">{act.recipientName}</p>
                    <p className="text-[11px] text-[#8A857C] truncate">{act.content}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                    act.status === 'delivered' || act.status === 'read' || act.status === 'sent'
                      ? 'bg-[#8A9A5B]/20 text-[#78884B]' 
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {act.status.toUpperCase()}
                  </span>
                  <p className="text-[10px] text-[#8A857C] mt-0.5">{act.timestamp.split(' ')[1] || 'Today'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
