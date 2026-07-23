import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CreditCard, 
  Check, 
  Zap, 
  Download, 
  TrendingUp, 
  Sparkles, 
  X, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';

export const SubscriptionTab: React.FC = () => {
  const { business, invoices, upgradePlan } = useApp();
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const plans = [
    {
      id: 'Starter',
      name: 'Starter Plan',
      price: '$29',
      period: 'per month',
      smsLimit: 5000,
      waLimit: 2000,
      emailLimit: 25000,
      voiceLimit: 500,
      features: ['Up to 2,000 Contacts', 'Standard Rule Engine', 'SMS & WhatsApp Gateway', 'Email Support']
    },
    {
      id: 'Pro Growth',
      name: 'Pro Growth Plan',
      price: '$99',
      period: 'per month',
      smsLimit: 25000,
      waLimit: 15000,
      emailLimit: 100000,
      voiceLimit: 2500,
      popular: true,
      features: ['Up to 25,000 Contacts', 'Custom Rule Automation', 'Voice Call Broadcasts', 'Priority Auto-Retry', 'Multi-staff logins']
    },
    {
      id: 'Enterprise',
      name: 'Enterprise Plan',
      price: '$249',
      period: 'per month',
      smsLimit: 100000,
      waLimit: 50000,
      emailLimit: 500000,
      voiceLimit: 10000,
      features: ['Unlimited Contacts', 'Dedicated Gateway Routes', 'Custom Webhooks', 'Dedicated Account Manager', 'SLA 99.9% Guarantee']
    },
  ];

  const currentPlan = plans.find(p => p.id === business.plan) || plans[1];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Subscription & Credit Metering</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage SaaS tier plan, refill broadcast quotas, and view billing statements.
          </p>
        </div>

        <button
          onClick={() => setUpgradeModalOpen(true)}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Zap className="w-4 h-4" />
          <span>Change / Upgrade Plan</span>
        </button>
      </div>

      {/* Credit Quota Meters */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-full">
              Current Tier: {business.plan}
            </span>
            <p className="text-sm font-extrabold text-slate-900 mt-2">Active Channel Credit Quotas</p>
          </div>
          <p className="text-xs font-bold text-slate-500">Renews on Aug 1, 2026</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* SMS Meter */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700">SMS Credits</span>
              <span className="text-indigo-700">12,450 / {currentPlan.smsLimit.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${(12450 / currentPlan.smsLimit) * 100}%` }}></div>
            </div>
          </div>

          {/* WhatsApp Meter */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700">WhatsApp Credits</span>
              <span className="text-emerald-700">8,900 / {currentPlan.waLimit.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${(8900 / currentPlan.waLimit) * 100}%` }}></div>
            </div>
          </div>

          {/* Email Meter */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700">Email Credits</span>
              <span className="text-purple-700">45,000 / {currentPlan.emailLimit.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: `${(45000 / currentPlan.emailLimit) * 100}%` }}></div>
            </div>
          </div>

          {/* Voice Call Meter */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700">Voice Seconds</span>
              <span className="text-amber-700">1,230 / {currentPlan.voiceLimit.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-600 h-full rounded-full" style={{ width: `${(1230 / currentPlan.voiceLimit) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(p => {
          const isCurrent = p.id === business.plan;
          return (
            <div 
              key={p.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                isCurrent 
                  ? 'bg-white border-2 border-indigo-600 shadow-md ring-2 ring-indigo-100' 
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-base font-extrabold text-slate-900">{p.name}</h3>
                  {isCurrent && (
                    <span className="px-2.5 py-0.5 bg-indigo-600 text-white text-[10px] font-extrabold rounded-full uppercase">
                      Active
                    </span>
                  )}
                  {p.popular && !isCurrent && (
                    <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-extrabold rounded-full uppercase">
                      Popular
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1 mt-3">
                  <span className="text-3xl font-black text-slate-900">{p.price}</span>
                  <span className="text-xs text-slate-500 font-semibold">{p.period}</span>
                </div>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-700 font-medium">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    upgradePlan(p.id);
                    setUpgradeModalOpen(false);
                  }}
                  disabled={isCurrent}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isCurrent 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                  }`}
                >
                  {isCurrent ? 'Current Plan' : `Upgrade to ${p.name}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Billing Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900">Billing History & Invoices</h3>
          <span className="text-xs text-slate-500 font-semibold">Automatic PDF Receipt Generation</span>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Invoice ID</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Plan Tier</th>
              <th className="py-3 px-4">Amount Paid</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Invoice PDF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {invoices.map(inv => (
              <tr key={inv.id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-mono font-bold text-slate-900">{inv.id}</td>
                <td className="py-3 px-4 text-slate-600">{inv.date}</td>
                <td className="py-3 px-4 font-semibold text-slate-800">{inv.plan}</td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">{inv.amount}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 uppercase">
                    {inv.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button 
                    onClick={() => alert(`Downloading receipt PDF for invoice ${inv.id}`)}
                    className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 ml-auto"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
