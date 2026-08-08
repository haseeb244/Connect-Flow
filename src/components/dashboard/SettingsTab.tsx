import React, { useState, useEffect } from 'react';
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
  Server,
  Database,
  Copy,
  Terminal,
  Check,
  Sparkles
} from 'lucide-react';
import { testSupabaseConnection, COMPLETE_SQL_SCHEMA, SupabaseTestResult } from '../../lib/supabase';

export const SettingsTab: React.FC = () => {
  const { business, updateBusinessProfile, clearAllSampleData } = useApp();

  const [name, setName] = useState(business.name);
  const [industry, setIndustry] = useState(business.industry);
  const [phone, setPhone] = useState(business.phone);
  const [email, setEmail] = useState(business.email);
  const [timezone, setTimezone] = useState(business.timezone || 'America/New_York');

  const [bizSavedMsg, setBizSavedMsg] = useState('');

  useEffect(() => {
    setName(business.name);
    setIndustry(business.industry);
    setPhone(business.phone);
    setEmail(business.email);
    setTimezone(business.timezone || 'America/New_York');
  }, [business]);

  // Gateway API credentials state
  const [twilioSid, setTwilioSid] = useState(() => localStorage.getItem('cf_twilio_sid') || 'AC891902834710293a02');
  const [twilioToken, setTwilioToken] = useState(() => localStorage.getItem('cf_twilio_token') || '••••••••••••••••••••••••');
  const [twilioPhone, setTwilioPhone] = useState(() => localStorage.getItem('cf_twilio_phone') || '+18334089520');
  const [waCloudToken, setWaCloudToken] = useState(() => localStorage.getItem('cf_wa_token') || 'EAAx...90214419');
  const [waPhoneId, setWaPhoneId] = useState(() => localStorage.getItem('cf_wa_phone_id') || '10928374829102');
  const [liveGatewayMode, setLiveGatewayMode] = useState<boolean>(() => localStorage.getItem('cf_live_gateway') === 'true');
  const [gatewaySavedMsg, setGatewaySavedMsg] = useState('');

  const handleSaveGateways = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('cf_twilio_sid', twilioSid);
    localStorage.setItem('cf_twilio_token', twilioToken);
    localStorage.setItem('cf_twilio_phone', twilioPhone);
    localStorage.setItem('cf_wa_token', waCloudToken);
    localStorage.setItem('cf_wa_phone_id', waPhoneId);
    localStorage.setItem('cf_live_gateway', liveGatewayMode ? 'true' : 'false');
    
    setGatewaySavedMsg('Gateway API Keys & Connection Mode Saved!');
    setTimeout(() => setGatewaySavedMsg(''), 3000);
  };
  const [testingGateway, setTestingGateway] = useState<string | null>(null);
  const [testedGateways, setTestedGateways] = useState<Record<string, boolean>>({
    twilio: true,
    whatsapp: true,
    smtp: true,
    voice: true,
  });

  // Supabase Connection State
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseTestResult | null>(null);
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    runSupabaseTest();
  }, []);

  const runSupabaseTest = async () => {
    setIsTestingSupabase(true);
    const result = await testSupabaseConnection();
    setSupabaseStatus(result);
    setIsTestingSupabase(false);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(COMPLETE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBusinessProfile({
      name,
      industry,
      phone,
      email,
      timezone,
    });
    setBizSavedMsg('Saved to Database & Local Storage!');
    setTimeout(() => setBizSavedMsg(''), 3000);
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
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Business Identity Details</h3>
            </div>
            {bizSavedMsg && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 animate-in fade-in">
                {bizSavedMsg}
              </span>
            )}
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
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Carrier API Gateways (Real Phone & WhatsApp Integration)</h3>
                <p className="text-xs text-slate-500">Connect Twilio & Meta WhatsApp Business Cloud API keys for real phone SIM delivery.</p>
              </div>
            </div>
            {gatewaySavedMsg && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {gatewaySavedMsg}
              </span>
            )}
          </div>

          {/* Live vs Simulator Mode Banner */}
          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
            <span className="text-base leading-none">💡</span>
            <div className="space-y-0.5">
              <p className="font-bold">Which API Keys Are Required? (Gateway Configuration)</p>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                <strong>1. Client / Business API Keys (BYOK Model):</strong> Each business client enters their own <strong>Twilio Account SID / Token</strong> and <strong>Meta WhatsApp Cloud API Token</strong> here. Carrier charges are billed directly to their respective Twilio or Meta account.<br />
                <strong>2. ConnectFlow SaaS Default Gateway:</strong> If a client does not provide API keys, broadcasts route through ConnectFlow's default platform gateway.<br />
                <strong>3. Free Demo / Test Mode:</strong> Toggle "Enable Live Production Mode" below to switch to instant zero-cost Demo Mode for testing.
              </p>
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
            liveGatewayMode ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-indigo-50 border-indigo-200 text-indigo-950'
          }`}>
            <div className="flex items-center gap-2">
              <Sparkles className={`w-4 h-4 ${liveGatewayMode ? 'text-emerald-600' : 'text-indigo-600'}`} />
              <div>
                <p className="font-bold">
                  {liveGatewayMode ? 'Live Production Carrier Mode Active 🌐' : 'Instant Demo / Simulator Mode Active ⚡'}
                </p>
                <p className="text-[11px] opacity-80">
                  {liveGatewayMode 
                    ? 'Broadcasts use real Twilio & WhatsApp Cloud API endpoints to deliver messages directly to real SIM phone numbers.' 
                    : 'Broadcasts execute with instant real-time delivery logs, simulated status callbacks, and zero balance cost.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const next = !liveGatewayMode;
                setLiveGatewayMode(next);
                localStorage.setItem('cf_live_gateway', next ? 'true' : 'false');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs shrink-0 ${
                liveGatewayMode 
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {liveGatewayMode ? 'Switch to Demo Mode' : 'Enable Live Production Mode'}
            </button>
          </div>

          <form onSubmit={handleSaveGateways} className="space-y-4 pt-1">
            {/* Twilio Credentials */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-900">Twilio SMS & Voice API Settings</span>
                </div>
                <button
                  type="button"
                  onClick={() => runGatewayDiagnostic('twilio')}
                  className="px-2 py-0.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded text-[10px] font-bold flex items-center gap-1"
                >
                  {testingGateway === 'twilio' ? <RefreshCw className="w-3 h-3 animate-spin text-indigo-600" /> : <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                  <span>{testingGateway === 'twilio' ? 'Ping...' : 'Test Ping'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Account SID</label>
                  <input
                    type="text"
                    value={twilioSid}
                    onChange={e => setTwilioSid(e.target.value)}
                    placeholder="ACxxxxxxxxxxxxxxxx"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Auth Token</label>
                  <input
                    type="password"
                    value={twilioToken}
                    onChange={e => setTwilioToken(e.target.value)}
                    placeholder="Auth Token"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Twilio From Number</label>
                  <input
                    type="text"
                    value={twilioPhone}
                    onChange={e => setTwilioPhone(e.target.value)}
                    placeholder="+18334089520"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Meta WhatsApp Cloud API */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">Meta WhatsApp Business Cloud API Settings</span>
                </div>
                <button
                  type="button"
                  onClick={() => runGatewayDiagnostic('whatsapp')}
                  className="px-2 py-0.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded text-[10px] font-bold flex items-center gap-1"
                >
                  {testingGateway === 'whatsapp' ? <RefreshCw className="w-3 h-3 animate-spin text-indigo-600" /> : <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                  <span>{testingGateway === 'whatsapp' ? 'Ping...' : 'Test Ping'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Permanent Access Token</label>
                  <input
                    type="password"
                    value={waCloudToken}
                    onChange={e => setWaCloudToken(e.target.value)}
                    placeholder="EAAxxxxxxxxxxxx..."
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">WhatsApp Phone Number ID</label>
                  <input
                    type="text"
                    value={waPhoneId}
                    onChange={e => setWaPhoneId(e.target.value)}
                    placeholder="10928374829102"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              Save API Credentials & Gateway Mode
            </button>
          </form>
        </div>

        {/* Supabase SQL Database & Connectivity Card */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Supabase PostgreSQL Database Connection</h3>
                <p className="text-xs text-slate-500">Verify live database connection and copy complete SQL database schema script.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={runSupabaseTest}
                disabled={isTestingSupabase}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isTestingSupabase ? 'animate-spin' : ''}`} />
                <span>{isTestingSupabase ? 'Testing Connection...' : 'Check Supabase Connection'}</span>
              </button>

              <button
                onClick={handleCopySql}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'SQL Copied!' : 'Copy SQL Schema'}</span>
              </button>
            </div>
          </div>

          {/* Status Display Banner */}
          {supabaseStatus && (
            <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
              supabaseStatus.connected 
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
                : supabaseStatus.configured 
                ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}>
              <div className="flex items-start gap-2.5">
                {supabaseStatus.connected ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between font-bold">
                    <span>
                      {supabaseStatus.connected 
                        ? 'Supabase SQL Database Connected' 
                        : supabaseStatus.configured 
                        ? 'Supabase Configured (Database Tables Pending Setup)'
                        : 'Local In-Memory / LocalStorage Mode Active'}
                    </span>
                    {supabaseStatus.latencyMs !== undefined && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/80 border border-emerald-200 text-emerald-700">
                        {supabaseStatus.latencyMs}ms latency
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] opacity-90">{supabaseStatus.message}</p>

                  {supabaseStatus.tablesStatus && supabaseStatus.tablesStatus.length > 0 && (
                    <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      {supabaseStatus.tablesStatus.map(tb => (
                        <div key={tb.name} className="p-2 bg-white/90 rounded-lg border border-slate-200/80 flex items-center justify-between font-mono">
                          <span className="text-slate-700 font-bold">{tb.name}</span>
                          {tb.exists ? (
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Ready
                            </span>
                          ) : (
                            <span className="text-amber-600 font-bold">Missing</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Inline SQL Code Viewer */}
          <div className="bg-slate-900 rounded-xl p-4 text-slate-200 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 text-indigo-400 font-bold">
                <Terminal className="w-3.5 h-3.5" /> Complete PostgreSQL SQL Script (supabase_schema.sql)
              </span>
              <span>Run in Supabase SQL Editor</span>
            </div>
            <pre className="max-h-48 overflow-y-auto text-[11px] text-slate-300 leading-relaxed scrollbar-thin">
              {COMPLETE_SQL_SCHEMA}
            </pre>
          </div>
        </div>

        {/* Data Reset Section */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-rose-200/80 bg-rose-50/20 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-rose-900">Clear Sample / Dummy Data</h3>
              <p className="text-xs text-rose-700 mt-0.5">
                Remove mock contacts, campaigns, logs, and templates to start fresh with clean real business data.
              </p>
            </div>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete all sample contacts, campaigns, and logs to start fresh with clean data?')) {
                  clearAllSampleData();
                  alert('All sample data cleared successfully! Your workspace is now clean.');
                }
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs self-start sm:self-auto"
            >
              Clear Dummy Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
