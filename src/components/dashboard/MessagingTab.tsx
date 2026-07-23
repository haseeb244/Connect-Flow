import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChannelType } from '../../types';
import { 
  MessageSquare, 
  Send, 
  Mail, 
  PhoneCall, 
  Search, 
  Filter, 
  Plus, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Clock 
} from 'lucide-react';

export const MessagingTab: React.FC = () => {
  const { messageLogs, contacts, sendDirectMessage } = useApp();

  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [composerOpen, setComposerOpen] = useState(false);

  // Direct Message Composer State
  const [recipientContactId, setRecipientContactId] = useState('');
  const [customRecipient, setCustomRecipient] = useState('');
  const [directChannel, setDirectChannel] = useState<ChannelType>('sms');
  const [directContent, setDirectContent] = useState('');

  const filteredLogs = (messageLogs || []).filter(log => {
    const matchesChannel = channelFilter === 'all' || log.channel === channelFilter;
    const matchesSearch = (log.recipientName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (log.recipientPhoneOrEmail || '').includes(searchQuery) ||
                          (log.content || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChannel && matchesSearch;
  });

  const handleSendDirect = (e: React.FormEvent) => {
    e.preventDefault();
    let name = 'Direct Recipient';
    let phoneOrEmail = customRecipient;

    if (recipientContactId) {
      const cnt = contacts.find(c => c.id === recipientContactId);
      if (cnt) {
        name = cnt.name;
        phoneOrEmail = directChannel === 'email' ? cnt.email : cnt.phone;
      }
    }

    if (!phoneOrEmail || !directContent) {
      alert('Please select a recipient and enter message content.');
      return;
    }

    sendDirectMessage(name, phoneOrEmail, directChannel, directContent);
    setDirectContent('');
    setComposerOpen(false);
  };

  const getChannelBadge = (ch: ChannelType) => {
    switch (ch) {
      case 'sms': return <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full uppercase">SMS</span>;
      case 'whatsapp': return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase">WhatsApp</span>;
      case 'email': return <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-full uppercase">Email</span>;
      default: return <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full uppercase">Voice Call</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Messaging History & Direct Inbox</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit individual customer messages, delivery logs, and send direct one-on-one notifications.
          </p>
        </div>

        <button
          onClick={() => setComposerOpen(true)}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Send Direct Message</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search recipient name, phone, email, or content..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <button
            onClick={() => setChannelFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${channelFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            All Channels
          </button>
          <button
            onClick={() => setChannelFilter('sms')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${channelFilter === 'sms' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            SMS
          </button>
          <button
            onClick={() => setChannelFilter('whatsapp')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${channelFilter === 'whatsapp' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            WhatsApp
          </button>
          <button
            onClick={() => setChannelFilter('email')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${channelFilter === 'email' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Email
          </button>
        </div>
      </div>

      {/* Message Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Address / Phone</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Message Content Preview</th>
                <th className="py-3 px-4">Campaign Context</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <MessageSquare className="w-8 h-8 mx-auto opacity-30 mb-2" />
                    <p className="font-semibold text-slate-600">No message logs found</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{log.recipientName}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">{log.recipientPhoneOrEmail}</td>
                    <td className="py-3 px-4">{getChannelBadge(log.channel)}</td>
                    <td className="py-3 px-4 text-slate-800 max-w-xs truncate">
                      "{log.content}"
                    </td>
                    <td className="py-3 px-4 text-slate-500 italic text-[11px]">
                      {log.campaignName || 'Direct Message'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                        log.status === 'delivered' || log.status === 'read' || log.status === 'sent'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">{log.timestamp}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Direct Composer Modal */}
      {composerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-400" />
                <span>Send Direct 1-on-1 Message</span>
              </h3>
              <button onClick={() => setComposerOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendDirect} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Contact</label>
                <select
                  value={recipientContactId}
                  onChange={e => {
                    setRecipientContactId(e.target.value);
                    if (e.target.value) setCustomRecipient('');
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none bg-white font-bold"
                >
                  <option value="">-- Choose from Directory --</option>
                  {(contacts || []).map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                  ))}
                </select>
              </div>

              {!recipientContactId && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Or Enter Manual Phone / Email</label>
                  <input
                    type="text"
                    value={customRecipient}
                    onChange={e => setCustomRecipient(e.target.value)}
                    placeholder="+1 (555) 000-0000 or email@domain.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Channel</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDirectChannel('sms')}
                    className={`p-2 border rounded-lg text-xs font-bold transition-colors ${directChannel === 'sms' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200'}`}
                  >
                    SMS
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirectChannel('whatsapp')}
                    className={`p-2 border rounded-lg text-xs font-bold transition-colors ${directChannel === 'whatsapp' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-200'}`}
                  >
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirectChannel('email')}
                    className={`p-2 border rounded-lg text-xs font-bold transition-colors ${directChannel === 'email' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-slate-200'}`}
                  >
                    Email
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message Content</label>
                <textarea
                  rows={3}
                  required
                  value={directContent}
                  onChange={e => setDirectContent(e.target.value)}
                  placeholder="Type your direct message..."
                  className="w-full p-3 border border-slate-300 rounded-xl text-xs outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setComposerOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Deliver Message Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
