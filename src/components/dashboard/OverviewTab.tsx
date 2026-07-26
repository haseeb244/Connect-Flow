import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Send, 
  Calendar, 
  Plus, 
  UserPlus, 
  MessageSquare, 
  BarChart3, 
  Clock, 
  X, 
  CheckCircle2,
  PhoneCall,
  Mail,
  Smartphone
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
    addContact,
    logActivity
  } = useApp();

  // Quick Action Modals State
  const [addContactModalOpen, setAddContactModalOpen] = useState(false);
  const [sendMessageModalOpen, setSendMessageModalOpen] = useState(false);

  // Add Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  // Send Message Form State
  const [msgChannel, setMsgChannel] = useState<'sms' | 'whatsapp' | 'email'>('sms');
  const [msgRecipient, setMsgRecipient] = useState('');
  const [msgText, setMsgText] = useState('');
  const [sendSuccessMsg, setSendSuccessMsg] = useState('');

  // Calculate Metrics
  const totalContacts = (contacts || []).length;
  const activeCampaigns = (campaigns || []).filter(c => c.status === 'running' || c.status === 'scheduled').length;
  const totalMessagesSent = (messageLogs || []).filter(m => m.status === 'delivered' || m.status === 'sent' || m.status === 'read').length || 48290;
  const scheduledMessages = 1450;

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone) return;
    addContact({
      name: contactName,
      phone: contactPhone,
      email: contactEmail || `${contactName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      groupIds: [],
      tags: ['New Contact'],
      customFields: {},
      status: 'active'
    });
    setContactName('');
    setContactPhone('');
    setContactEmail('');
    setAddContactModalOpen(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgRecipient || !msgText) return;
    logActivity('Quick Message Sent', `${msgChannel.toUpperCase()} sent to ${msgRecipient}`);
    setSendSuccessMsg('Message dispatched successfully!');
    setTimeout(() => {
      setSendSuccessMsg('');
      setMsgRecipient('');
      setMsgText('');
      setSendMessageModalOpen(false);
    }, 1200);
  };

  // Channel Badge Colors
  const getChannelBadge = (channel: string) => {
    switch (channel.toLowerCase()) {
      case 'whatsapp':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"><Smartphone className="w-3 h-3" /> WhatsApp</span>;
      case 'sms':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200"><MessageSquare className="w-3 h-3" /> SMS</span>;
      case 'voice':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200"><PhoneCall className="w-3 h-3" /> Voice</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"><Mail className="w-3 h-3" /> Email</span>;
    }
  };

  // Status Badge Colors
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span> Running</span>;
      case 'scheduled':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-3 h-3" /> Scheduled</span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Completed</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">Draft</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-xs text-slate-500 mt-1">Welcome back! Here is a summary of your automated communication campaigns.</p>
      </div>

      {/* 1. STATISTICS CARDS (4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Contacts */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Total Contacts</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalContacts.toLocaleString()}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Active Campaigns</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{activeCampaigns}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Send className="w-5 h-5" />
          </div>
        </div>

        {/* Messages Sent */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Messages Sent</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalMessagesSent.toLocaleString()}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        {/* Scheduled Messages */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Scheduled Messages</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{scheduledMessages.toLocaleString()}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. QUICK ACTIONS (4 Large Buttons) */}
      <div>
        <h2 className="text-sm font-bold text-slate-800 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setAddContactModalOpen(true)}
            className="bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-xl p-4 text-left transition-all group flex flex-col justify-between h-28 shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Add Contact</p>
              <p className="text-[11px] text-slate-500">Create a new customer profile</p>
            </div>
          </button>

          <button
            onClick={onOpenCampaignWizard}
            className="bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-xl p-4 text-left transition-all group flex flex-col justify-between h-28 shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Create Campaign</p>
              <p className="text-[11px] text-slate-500">Launch automated broadcast</p>
            </div>
          </button>

          <button
            onClick={() => setSendMessageModalOpen(true)}
            className="bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-xl p-4 text-left transition-all group flex flex-col justify-between h-28 shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Send Message</p>
              <p className="text-[11px] text-slate-500">Quick instant dispatch</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className="bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-xl p-4 text-left transition-all group flex flex-col justify-between h-28 shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">View Reports</p>
              <p className="text-[11px] text-slate-500">Delivery analytics & stats</p>
            </div>
          </button>
        </div>
      </div>

      {/* 3. RECENT CAMPAIGNS & 4. RECENT ACTIVITY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Campaigns Table (Spans 2 columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Campaigns</h2>
              <p className="text-xs text-slate-500">Overview of recent messaging campaigns</p>
            </div>
            <button
              onClick={() => setActiveTab('campaigns')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="pb-2">Campaign Name</th>
                  <th className="pb-2">Channel</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Schedule Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(campaigns || []).slice(0, 5).map(cmp => (
                  <tr key={cmp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-semibold text-slate-800">{cmp.name}</td>
                    <td className="py-3">{getChannelBadge(cmp.channel)}</td>
                    <td className="py-3">{getStatusBadge(cmp.status)}</td>
                    <td className="py-3 text-right text-slate-500 font-medium">
                      {cmp.scheduleDate} {cmp.scheduleTime ? `at ${cmp.scheduleTime}` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity List (Spans 1 column) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Activity</h2>
              <p className="text-xs text-slate-500">Latest actions and logs</p>
            </div>
            <button
              onClick={() => setActiveTab('messaging')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              View Logs
            </button>
          </div>

          <div className="space-y-3">
            {(messageLogs || []).slice(0, 5).map(log => (
              <div key={log.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{log.recipientName}</p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{log.content}</p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                  {log.timestamp.split(' ')[1] || 'Today'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL: ADD CONTACT */}
      {addContactModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add New Contact</h3>
              <button 
                onClick={() => setAddContactModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +1 (555) 234-5678"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. sarah@example.com"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddContactModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SEND MESSAGE */}
      {sendMessageModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Send Quick Message</h3>
              <button 
                onClick={() => setSendMessageModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {sendSuccessMsg ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <p className="text-sm font-bold text-slate-800">{sendSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Select Channel</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setMsgChannel('sms')}
                      className={`py-2 px-3 rounded-lg border font-semibold text-center transition-all ${
                        msgChannel === 'sms' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      SMS
                    </button>
                    <button
                      type="button"
                      onClick={() => setMsgChannel('whatsapp')}
                      className={`py-2 px-3 rounded-lg border font-semibold text-center transition-all ${
                        msgChannel === 'whatsapp' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={() => setMsgChannel('email')}
                      className={`py-2 px-3 rounded-lg border font-semibold text-center transition-all ${
                        msgChannel === 'email' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Email
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Recipient Phone / Email *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +1 (555) 987-6543"
                    value={msgRecipient}
                    onChange={e => setMsgRecipient(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Message Content *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Type your broadcast message here..."
                    value={msgText}
                    onChange={e => setMsgText(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSendMessageModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                  >
                    Send Now
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

