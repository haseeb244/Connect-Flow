import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AutomationRule, AutomationTrigger } from '../../types';
import { 
  Zap, 
  Plus, 
  Play, 
  Check, 
  X, 
  Sliders, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  MessageSquare, 
  Send, 
  Mail, 
  PhoneCall, 
  ToggleLeft, 
  ToggleRight 
} from 'lucide-react';

export const AutomationTab: React.FC = () => {
  const { automationRules, toggleRule, triggerRuleSimulation, addRule } = useApp();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  
  // Create Rule Form
  const [name, setName] = useState('');
  const [triggerType, setTriggerType] = useState<AutomationTrigger>('appointment_reminder');
  const [channel, setChannel] = useState<'sms' | 'whatsapp' | 'email' | 'voice'>('whatsapp');
  const [offsetValue, setOffsetValue] = useState(1);

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addRule({
      title: name,
      triggerType,
      channel,
      templateContent: 'Dear {{name}}, this is an automated rule notification regarding {{feeDue}}.',
      offsetValue,
      offsetUnit: 'days',
      isActive: true,
      executionCount: 0,
    });

    setName('');
    setCreateModalOpen(false);
  };

  const getTriggerLabel = (evt: string) => {
    switch (evt) {
      case 'appointment_reminder': return 'Appointment Reminder (1 day prior)';
      case 'fee_reminder': return 'Outstanding Fee Due Alert';
      case 'payment_reminder': return 'Payment Confirmation Receipt';
      case 'birthday_wish': return 'Customer Birthday Wish';
      case 'order_delivered': return 'E-Commerce Order Delivered';
      case 'warranty_reminder': return 'Warranty Expiry Alert';
      default: return evt;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Rule-Based Automation Engine</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            100% deterministic, rule-based workflows. Automatically send calls & messages based on customer dates and events.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Create Automation Rule</span>
        </button>
      </div>

      {/* Info Banner */}
      <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 text-white rounded-xl">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-indigo-950">Deterministic Execution Guarantee</p>
            <p className="text-[11px] text-indigo-800">No probabilistic AI models used. Rules fire based on precise system clock triggers and database timestamps.</p>
          </div>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(automationRules || []).map(rule => (
          <div 
            key={rule.id}
            className={`p-5 rounded-xl border transition-all shadow-2xs flex flex-col justify-between ${
              rule.isActive ? 'bg-white border-slate-200/80' : 'bg-slate-50/70 border-slate-200 opacity-75'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded-full uppercase">
                  {rule.channel}
                </span>

                <button
                  onClick={() => toggleRule(rule.id)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  <span>{rule.isActive ? 'ACTIVE' : 'PAUSED'}</span>
                  {rule.isActive ? (
                    <ToggleRight className="w-6 h-6 text-indigo-600" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-slate-400" />
                  )}
                </button>
              </div>

              <h3 className="text-sm font-extrabold text-slate-900">{rule.title}</h3>
              <p className="text-xs text-slate-500 mt-1">
                Trigger Event: <strong className="text-slate-800">{getTriggerLabel(rule.triggerType)}</strong>
              </p>

              <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs font-mono text-slate-600">
                "{rule.templateContent}"
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-semibold">
                Fired <strong>{rule.executionCount}</strong> times
              </span>

              <button
                onClick={() => triggerRuleSimulation(rule.id)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                title="Test trigger simulation now"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test Trigger</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Rule Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                <span>Create Rule-Based Automation</span>
              </h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. 24h Prior Fee Reminder SMS"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Trigger Condition Event</label>
                <select
                  value={triggerType}
                  onChange={e => setTriggerType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none bg-white font-bold"
                >
                  <option value="appointment_reminder">Appointment Reminder (appointmentDate)</option>
                  <option value="fee_reminder">Outstanding Fee Due (feeDue)</option>
                  <option value="payment_reminder">Payment Receipt Confirmation</option>
                  <option value="birthday_wish">Customer Birthday</option>
                  <option value="order_delivered">E-Commerce Order Delivered</option>
                  <option value="warranty_reminder">Warranty Expiry Alert</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Channel Gateway</label>
                <select
                  value={channel}
                  onChange={e => setChannel(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none bg-white font-bold"
                >
                  <option value="sms">SMS Text</option>
                  <option value="whatsapp">WhatsApp Business</option>
                  <option value="email">Email</option>
                  <option value="voice">Voice Call</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Firing Timing Offset (Days before/after event)</label>
                <input
                  type="number"
                  required
                  min={0}
                  max={30}
                  value={offsetValue}
                  onChange={e => setOffsetValue(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Save & Activate Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
