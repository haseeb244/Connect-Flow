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

  const totalContacts = (contacts || []).length;
  const totalMessagesSent = (messageLogs || []).filter(m => m.status === 'delivered' || m.status === 'sent' || m.status === 'read').length;
  const totalCallsMade = (voiceLogs || []).length;
  const scheduledCampaigns = (campaigns || []).filter(c => c.status === 'scheduled' || c.status === 'running').length;

  const recentActivity = (messageLogs || []).slice(0, 5);

  const smsCount = (messageLogs || []).filter(m => m.channel === 'sms').length;
  const waCount = (messageLogs || []).filter(m => m.channel === 'whatsapp').length;
  const emailCount = (messageLogs || []).filter(m => m.channel === 'email').length;
  const voiceCount = (voiceLogs || []).length;

  const chartData = [
    { day: 'Mon', SMS: smsCount, WhatsApp: waCount, Email: emailCount, Voice: voiceCount },
    { day: 'Tue', SMS: Math.floor(smsCount * 0.8), WhatsApp: Math.floor(waCount * 0.8), Email: Math.floor(emailCount * 0.8), Voice: Math.floor(voiceCount * 0.8) },
    { day: 'Wed', SMS: Math.floor(smsCount * 0.9), WhatsApp: Math.floor(waCount * 0.9), Email: Math.floor(emailCount * 0.9), Voice: Math.floor(voiceCount * 0.9) },
    { day: 'Thu', SMS: Math.floor(smsCount * 1.1), WhatsApp: Math.floor(waCount * 1.1), Email: Math.floor(emailCount * 1.1), Voice: Math.floor(voiceCount * 1.1) },
    { day: 'Fri', SMS: Math.floor(smsCount * 1.2), WhatsApp: Math.floor(waCount * 1.2), Email: Math.floor(emailCount * 1.2), Voice: Math.floor(voiceCount * 1.2) },
    { day: 'Sat', SMS: Math.floor(smsCount * 0.5), WhatsApp: Math.floor(waCount * 0.5), Email: Math.floor(emailCount * 0.5), Voice: Math.floor(voiceCount * 0.5) },
    { day: 'Sun', SMS: Math.floor(smsCount * 0.3), WhatsApp: Math.floor(waCount * 0.3), Email: Math.floor(emailCount * 0.3), Voice: Math.floor(voiceCount * 0.3) },
  ];

  const channelBreakdown = [
    { name: 'SMS', count: smsCount, color: '#3525cd' },
    { name: 'WhatsApp', count: waCount, color: '#006c49' },
    { name: 'Email', count: emailCount, color: '#4b4dd8' },
    { name: 'Voice', count: voiceCount, color: '#ba1a1a' },
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

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('voice')}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Voice Call Simulator 📞</span>
          </button>
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

      {/* Quick Start Guide Banner - Extreme Simplicity */}
      <div className="bg-gradient-to-r from-[#2D302D] to-[#3F433F] text-white p-5 rounded-3xl shadow-sm border border-[#4A4E4A] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8A9A5B]/20 text-[#8A9A5B] border border-[#8A9A5B]/30 text-[11px] font-bold mb-2">
              <Zap className="w-3.5 h-3.5 text-[#8A9A5B]" />
              <span>Quick Start Guide — 3 Easy Steps</span>
            </div>
            <h3 className="text-lg font-bold font-display text-white">How to Test & Use ConnectFlow</h3>
            <p className="text-xs text-[#A8A59E] mt-0.5">
              Follow these 3 simple steps to test voice calls, messages, and broadcast automation.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('voice')}
            className="px-5 py-2.5 bg-[#8A9A5B] hover:bg-[#78884B] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shrink-0 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Open Call Simulator 📞</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#4A4E4A]">
          <div 
            onClick={() => setActiveTab('contacts')}
            className="bg-[#222522]/80 hover:bg-[#222522] p-3.5 rounded-2xl border border-[#4A4E4A] cursor-pointer transition-all"
          >
            <div className="flex items-center gap-2 text-[#8A9A5B] text-xs font-bold mb-1">
              <span className="w-5 h-5 rounded-full bg-[#8A9A5B] text-white flex items-center justify-center text-[11px]">1</span>
              <span>Contacts List (Review Test Contacts)</span>
            </div>
            <p className="text-[11px] text-[#A8A59E] leading-relaxed">
              Check existing test numbers (e.g. 03460895203) in the Contacts tab or add your own custom test contacts.
            </p>
          </div>

          <div 
            onClick={() => setActiveTab('voice')}
            className="bg-[#222522]/80 hover:bg-[#222522] p-3.5 rounded-2xl border border-[#4A4E4A] cursor-pointer transition-all"
          >
            <div className="flex items-center gap-2 text-[#8A9A5B] text-xs font-bold mb-1">
              <span className="w-5 h-5 rounded-full bg-[#8A9A5B] text-white flex items-center justify-center text-[11px]">2</span>
              <span>AI Voice Call Test 📞</span>
            </div>
            <p className="text-[11px] text-[#A8A59E] leading-relaxed">
              Go to Voice Calling &rarr; Select contact &rarr; Click green "Dial Number Now" button &rarr; Press 1, 2, or 3 on keypad.
            </p>
          </div>

          <div 
            onClick={onOpenCampaignWizard}
            className="bg-[#222522]/80 hover:bg-[#222522] p-3.5 rounded-2xl border border-[#4A4E4A] cursor-pointer transition-all"
          >
            <div className="flex items-center gap-2 text-[#8A9A5B] text-xs font-bold mb-1">
              <span className="w-5 h-5 rounded-full bg-[#8A9A5B] text-white flex items-center justify-center text-[11px]">3</span>
              <span>Send Campaign Broadcast 💬</span>
            </div>
            <p className="text-[11px] text-[#A8A59E] leading-relaxed">
              Click "Create Campaign" to launch instant WhatsApp, SMS, Email, or Automated Voice Call broadcasts.
            </p>
          </div>
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
            <p className="text-3xl font-bold text-[#2D302D] mt-1">{totalMessagesSent.toLocaleString()}</p>
          </div>
        </div>

        {/* Calls Made */}
        <div 
          onClick={() => setActiveTab('voice')}
          className="bg-white border border-[#E5E2DA] rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:border-purple-500 cursor-pointer transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <PhoneCall className="w-5 h-5" />
            </span>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200/60 px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
              Click to Open 📞
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-[#8A857C]">Calls Executed</p>
            <p className="text-3xl font-bold text-[#2D302D] mt-1">{totalCallsMade.toLocaleString()}</p>
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
            {(campaigns || []).slice(0, 3).map(cmp => (
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
