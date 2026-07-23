import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  ShieldAlert, 
  DollarSign, 
  Send, 
  Search, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  TrendingUp 
} from 'lucide-react';

export const SuperAdminTab: React.FC = () => {
  const { allBusinesses, switchBusiness, business: activeBusiness } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBusinesses = allBusinesses.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalMRR = allBusinesses.reduce((acc, b) => {
    if (b.plan === 'Pro Growth') return acc + 99;
    if (b.plan === 'Enterprise') return acc + 249;
    return acc + 29;
  }, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Super Admin Top Banner */}
      <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-base font-extrabold flex items-center gap-2">
              <span>Platform Super Admin Portal</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] rounded-full uppercase">Global Control</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-tenant management across all registered SaaS client accounts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>All Gateways Operational</span>
          </span>
        </div>
      </div>

      {/* Global SaaS Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Active Tenant Businesses</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{allBusinesses.length}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Monthly Recurring Revenue</span>
          <p className="text-2xl font-extrabold text-indigo-700 mt-1">${totalMRR.toLocaleString()}/mo</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Monthly Dispatched Calls & SMS</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">1,840,200</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Global Carrier Uptime</span>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">99.98%</p>
        </div>
      </div>

      {/* Tenant Directory Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Tenant Client Accounts</h3>
            <p className="text-xs text-slate-500">Switch context to inspect or configure any tenant account</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tenant business..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Business Name</th>
                <th className="py-3 px-4">Industry Sector</th>
                <th className="py-3 px-4">SaaS Tier Plan</th>
                <th className="py-3 px-4">Total Contacts</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Context Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredBusinesses.map(b => {
                const isActiveTenant = activeBusiness.id === b.id;
                return (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span>{b.name}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{b.industry}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                        b.plan === 'Enterprise' ? 'bg-amber-100 text-amber-800' :
                        b.plan === 'Pro Growth' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {b.plan}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {b.contactCount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 uppercase">
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isActiveTenant ? (
                        <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200/60">
                          Current Active Tenant
                        </span>
                      ) : (
                        <button
                          onClick={() => switchBusiness(b.id)}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-bold transition-colors shadow-2xs"
                        >
                          Switch Context
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
