import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Key, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Globe, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Server 
} from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const { business, updateBusinessProfile } = useApp();

  const [name, setName] = useState(business.name);
  const [industry, setIndustry] = useState(business.industry);
  const [phone, setPhone] = useState(business.phone);
  const [email, setEmail] = useState(business.email);
  const [timezone, setTimezone] = useState(business.timezone || 'America/New_York');

  const [testingGateway, setTestingGateway] = useState<string | null>(null);
  const [testedGateways, setTestedGateways] = useState<Record<string, boolean>>({
    twilio: true,
    whatsapp: true,
    smtp: true,
    voice: true,
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessProfile({
      name,
      industry,
      phone,
      email,
      timezone,
    });
    alert('Business profile updated successfully!');
  };

  const runGatewayDiagnostic = (gatewayKey: string) => {
    setTestingGateway(gatewayKey);
    setTimeout(() => {
      setTestedGateways(prev => ({ ...prev, [gatewayKey]: true }));
      setTestingGateway(null);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Business Profile & Gateway Settings</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure business identity, default timezones, and carrier API connections (Twilio, Meta WhatsApp, SMTP).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Business Profile Details Form */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Business Identity Details</h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Business Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Industry Sector</label>
                <select
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold outline-none bg-white"
                >
                  <option value="Clinic & Healthcare">Clinic & Healthcare</option>
                  <option value="Schools & Colleges">Schools & Colleges</option>
                  <option value="Gym & Fitness">Gym & Fitness</option>
                  <option value="Salon & Spa">Salon & Spa</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="E-Commerce & Courier">E-Commerce & Courier</option>
                  <option value="SME / General Business">SME / General Business</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Broadcast Schedule Timezone</label>
              <select
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold outline-none bg-white"
              >
                <option value="America/New_York">Eastern Time (US & Canada)</option>
                <option value="America/Chicago">Central Time (US & Canada)</option>
                <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                <option value="Europe/London">London (GMT / UTC+0)</option>
                <option value="Asia/Karachi">Asia/Karachi (UTC+5)</option>
                <option value="Asia/Kolkata">Asia/Kolkata (UTC+5:30)</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                Save Business Profile
              </button>
            </div>
          </form>
        </div>

        {/* Carrier API Gateways Panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Server className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Carrier API Gateways</h3>
          </div>

          <div className="space-y-3">
            {/* Twilio SMS */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Twilio SMS Gateway</p>
                <p className="text-[10px] text-slate-500">API Key: AC891...3a02</p>
              </div>

              <button
                onClick={() => runGatewayDiagnostic('twilio')}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded text-[11px] font-bold flex items-center gap-1"
              >
                {testingGateway === 'twilio' ? (
                  <RefreshCw className="w-3 h-3 animate-spin text-indigo-600" />
                ) : (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                )}
                <span>{testingGateway === 'twilio' ? 'Ping...' : 'Connected'}</span>
              </button>
            </div>

            {/* Meta WhatsApp */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">WhatsApp Business Cloud API</p>
                <p className="text-[10px] text-slate-500">WABA ID: 9021...4419</p>
              </div>

              <button
                onClick={() => runGatewayDiagnostic('whatsapp')}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded text-[11px] font-bold flex items-center gap-1"
              >
                {testingGateway === 'whatsapp' ? (
                  <RefreshCw className="w-3 h-3 animate-spin text-indigo-600" />
                ) : (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                )}
                <span>{testingGateway === 'whatsapp' ? 'Ping...' : 'Connected'}</span>
              </button>
            </div>

            {/* SMTP Server */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">SMTP Relay Server</p>
                <p className="text-[10px] text-slate-500">Host: smtp.sendgrid.net:587</p>
              </div>

              <button
                onClick={() => runGatewayDiagnostic('smtp')}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded text-[11px] font-bold flex items-center gap-1"
              >
                {testingGateway === 'smtp' ? (
                  <RefreshCw className="w-3 h-3 animate-spin text-indigo-600" />
                ) : (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                )}
                <span>{testingGateway === 'smtp' ? 'Ping...' : 'Connected'}</span>
              </button>
            </div>

            {/* Voice IVR Gateway */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Voice SIP Trunk</p>
                <p className="text-[10px] text-slate-500">Trunk: sip.connectflow.voip</p>
              </div>

              <button
                onClick={() => runGatewayDiagnostic('voice')}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded text-[11px] font-bold flex items-center gap-1"
              >
                {testingGateway === 'voice' ? (
                  <RefreshCw className="w-3 h-3 animate-spin text-indigo-600" />
                ) : (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                )}
                <span>{testingGateway === 'voice' ? 'Ping...' : 'Connected'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
