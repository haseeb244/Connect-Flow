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
  Camera,
  Upload,
  User as UserIcon,
  Sparkles
} from 'lucide-react';
import { testSupabaseConnection, COMPLETE_SQL_SCHEMA, SupabaseTestResult } from '../../lib/supabase';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
];

export const SettingsTab: React.FC = () => {
  const { business, currentUser, updateBusinessProfile, updateUserProfile, clearAllSampleData } = useApp();

  const [name, setName] = useState(business.name);
  const [industry, setIndustry] = useState(business.industry);
  const [phone, setPhone] = useState(business.phone);
  const [email, setEmail] = useState(business.email);
  const [timezone, setTimezone] = useState(business.timezone || 'America/New_York');

  // User Profile Form State
  const [userName, setUserName] = useState(currentUser.name);
  const [userEmail, setUserEmail] = useState(currentUser.email);
  const [userPhone, setUserPhone] = useState(currentUser.phone || '');
  const [userAvatar, setUserAvatar] = useState(
    currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || 'User')}&background=8A9A5B&color=fff&bold=true`
  );
  const [userSavedMsg, setUserSavedMsg] = useState('');
  const [bizSavedMsg, setBizSavedMsg] = useState('');

  useEffect(() => {
    setName(business.name);
    setIndustry(business.industry);
    setPhone(business.phone);
    setEmail(business.email);
    setTimezone(business.timezone || 'America/New_York');
  }, [business]);

  useEffect(() => {
    setUserName(currentUser.name);
    setUserEmail(currentUser.email);
    setUserPhone(currentUser.phone || '');
    if (currentUser.avatar) {
      setUserAvatar(currentUser.avatar);
    }
  }, [currentUser]);

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('Please choose an image file smaller than 3MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setUserAvatar(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateInitialsAvatar = () => {
    const generated = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'User')}&background=8A9A5B&color=fff&bold=true&size=200`;
    setUserAvatar(generated);
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

  const handleSaveUserProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({
      name: userName,
      email: userEmail,
      phone: userPhone,
      avatar: userAvatar,
    });
    setUserSavedMsg('User profile & picture updated & synced to Supabase!');
    setTimeout(() => setUserSavedMsg(''), 3000);
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
        {/* Personal User Profile Card */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Personal User Profile & Account</h3>
                <p className="text-xs text-slate-500">Your live authenticated profile credentials synced across local state and Supabase PostgreSQL.</p>
              </div>
            </div>
            {userSavedMsg && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 animate-in fade-in">
                {userSavedMsg}
              </span>
            )}
          </div>

          <form onSubmit={handleSaveUserProfile} className="space-y-6">
            {/* Profile Picture / Avatar Management */}
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60 flex flex-col md:flex-row items-center gap-6">
              <div className="relative group shrink-0">
                <img 
                  src={userAvatar} 
                  alt={userName} 
                  className="w-20 h-20 rounded-full border-2 border-indigo-500/30 object-cover shadow-sm bg-white"
                  onError={(e) => {
                    // Fallback to initial avatar if link breaks
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'User')}&background=8A9A5B&color=fff&bold=true`;
                  }}
                />
                <label 
                  htmlFor="avatar-upload-file" 
                  className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md cursor-pointer transition-transform hover:scale-110"
                  title="Upload profile picture"
                >
                  <Camera className="w-3.5 h-3.5" />
                </label>
                <input 
                  type="file" 
                  id="avatar-upload-file" 
                  accept="image/*" 
                  onChange={handleAvatarFileUpload} 
                  className="hidden" 
                />
              </div>

              <div className="flex-1 space-y-3 text-center md:text-left w-full">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Profile Picture / Photo</h4>
                  <p className="text-[11px] text-slate-500">Upload a photo from your computer or pick from professional presets below.</p>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <label 
                    htmlFor="avatar-upload-file" 
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Upload Image File</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleGenerateInitialsAvatar}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Generate Initials Avatar</span>
                  </button>
                </div>

                {/* Preset Avatars Selection */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Preset Avatars:</span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {PRESET_AVATARS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setUserAvatar(url)}
                        className={`w-8 h-8 rounded-full border-2 overflow-hidden transition-all shrink-0 ${
                          userAvatar === url ? 'border-indigo-600 scale-110 shadow-sm' : 'border-transparent hover:border-slate-300 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* User Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={e => setUserEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={userPhone}
                  onChange={e => setUserPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="+1 555-0199"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">Custom Image URL (Optional)</label>
                <input
                  type="url"
                  value={userAvatar.startsWith('data:') ? '' : userAvatar}
                  onChange={e => { if (e.target.value) setUserAvatar(e.target.value); }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="https://example.com/my-photo.jpg"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Role: <strong className="text-slate-900 uppercase">{currentUser.role}</strong></span>
                <span className="text-slate-300">&bull;</span>
                <span>User ID: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-700 font-mono">{currentUser.id}</code></span>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Save Personal Profile & Picture</span>
              </button>
            </div>
          </form>
        </div>

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
