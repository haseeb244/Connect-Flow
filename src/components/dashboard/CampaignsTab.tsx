import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CampaignStatus } from '../../types';
import { 
  Send, 
  Plus, 
  Play, 
  Pause, 
  RotateCcw, 
  Square, 
  Clock, 
  CheckCircle2, 
  AlertOctagon, 
  MessageSquare, 
  Mail, 
  PhoneCall, 
  Users, 
  MoreVertical 
} from 'lucide-react';

interface CampaignsTabProps {
  onOpenCampaignWizard: () => void;
}

export const CampaignsTab: React.FC<CampaignsTabProps> = ({ onOpenCampaignWizard }) => {
  const { campaigns, updateCampaignStatus, runCampaignSimulation } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = (campaigns || []).filter(c => statusFilter === 'all' || c.status === statusFilter);

  const getChannelBadge = (ch: string) => {
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
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Broadcast Campaign Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor, start, pause, or resume automated SMS, WhatsApp, Email, and Voice Call broadcasts.
          </p>
        </div>

        <button
          onClick={onOpenCampaignWizard}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold text-slate-600 overflow-x-auto">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${statusFilter === 'all' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100'}`}
        >
          All ({(campaigns || []).length})
        </button>
        <button
          onClick={() => setStatusFilter('scheduled')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${statusFilter === 'scheduled' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100'}`}
        >
          Scheduled ({(campaigns || []).filter(c => c.status === 'scheduled').length})
        </button>
        <button
          onClick={() => setStatusFilter('running')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${statusFilter === 'running' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100'}`}
        >
          Running ({(campaigns || []).filter(c => c.status === 'running').length})
        </button>
        <button
          onClick={() => setStatusFilter('completed')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${statusFilter === 'completed' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100'}`}
        >
          Completed ({(campaigns || []).filter(c => c.status === 'completed').length})
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
            <Send className="w-10 h-10 mx-auto opacity-30 mb-2" />
            <p className="font-semibold text-slate-700 text-sm">No campaigns match your filter</p>
            <p className="text-xs">Create a new campaign to schedule broadcasts.</p>
          </div>
        ) : (
          filtered.map(cmp => {
            const progressPct = cmp.totalRecipients > 0 
              ? Math.min(100, Math.round(((cmp.sentCount) / cmp.totalRecipients) * 100))
              : 0;

            return (
              <div 
                key={cmp.id}
                className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-indigo-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    {getChannelBadge(cmp.channel)}
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                      cmp.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                      cmp.status === 'running' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                      cmp.status === 'scheduled' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {cmp.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{cmp.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Audience: <strong>{cmp.groupName}</strong> ({cmp.audienceCount} contacts)</span>
                  </p>

                  <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs font-mono text-slate-600 line-clamp-2">
                    "{cmp.content}"
                  </div>

                  {/* Progress Meter */}
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                      <span>Broadcast Progress ({progressPct}%)</span>
                      <span>{cmp.sentCount} / {cmp.audienceCount} sent</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${progressPct}%` }}></div>
                    </div>
                  </div>

                  {/* Delivery Stats Row */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-center text-[11px]">
                    <div className="bg-slate-50 p-1.5 rounded">
                      <p className="text-slate-400 font-medium">Recipients</p>
                      <p className="font-extrabold text-slate-800">{cmp.totalRecipients}</p>
                    </div>
                    <div className="bg-emerald-50 p-1.5 rounded">
                      <p className="text-emerald-700 font-medium">Delivered</p>
                      <p className="font-extrabold text-emerald-800">{cmp.deliveredCount}</p>
                    </div>
                    <div className="bg-red-50 p-1.5 rounded">
                      <p className="text-red-700 font-medium">Failed</p>
                      <p className="font-extrabold text-red-800">{cmp.failedCount}</p>
                    </div>
                  </div>
                </div>

                {/* Control Action Buttons */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{cmp.scheduleDate} at {cmp.scheduleTime}</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    {cmp.status === 'scheduled' && (
                      <button
                        onClick={() => runCampaignSimulation(cmp.id)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Run Test Broadcast</span>
                      </button>
                    )}

                    {cmp.status === 'running' && (
                      <button
                        onClick={() => updateCampaignStatus(cmp.id, 'paused')}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pause</span>
                      </button>
                    )}

                    {cmp.status === 'paused' && (
                      <button
                        onClick={() => runCampaignSimulation(cmp.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Resume</span>
                      </button>
                    )}

                    {cmp.status !== 'completed' && (
                      <button
                        onClick={() => updateCampaignStatus(cmp.id, 'stopped')}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Stop Campaign"
                      >
                        <Square className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
