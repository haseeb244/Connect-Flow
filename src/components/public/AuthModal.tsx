import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IndustryType } from '../../types';
import { X, Layers, Mail, Lock, Building2, User, Check, ArrowRight, Database, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export const AuthModal: React.FC = () => {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    authMode, 
    setAuthMode, 
    setPublicView, 
    setCurrentRole, 
    setActiveTab, 
    logActivity,
    setCurrentUser,
    setBusiness
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState<IndustryType>('Clinic/Hospital');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  if (!authModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    const cleanEmail = email.toLowerCase().trim();

    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      setLoading(false);
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      setLoading(false);
      return;
    }

    // 1. Try Supabase Auth if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });

        if (!error && data.user) {
          const userObj = data.user;
          let displayName = userObj?.user_metadata?.full_name || (cleanEmail ? cleanEmail.split('@')[0] : 'User');

          try {
            const { data: dbUser } = await supabase.from('users').select('*').eq('email', cleanEmail).maybeSingle();
            if (dbUser) {
              setCurrentUser(dbUser);
              if (dbUser.role) setCurrentRole(dbUser.role);
              displayName = dbUser.name;

              if (dbUser.businessId) {
                const { data: dbBiz } = await supabase.from('businesses').select('*').eq('id', dbUser.businessId).maybeSingle();
                if (dbBiz) setBusiness(dbBiz);
              }
            } else {
              setCurrentUser({
                id: userObj?.id || `usr-${cleanEmail}`,
                name: displayName,
                email: userObj?.email || cleanEmail,
                role: 'business_admin',
                businessId: `biz-${cleanEmail}`,
                businessName: 'My Business Workspace',
                avatar: '',
                status: 'active',
                createdAt: new Date().toISOString()
              });
            }
          } catch {
            // ignore
          }

          setSuccessMessage(`Welcome back, ${displayName}! Redirecting...`);
          setTimeout(() => {
            localStorage.setItem('cf_is_logged_in', 'true');
            setAuthModalOpen(false);
            setPublicView(false);
            setActiveTab('overview');
            setSuccessMessage('');
            setLoading(false);
            logActivity('Supabase Login', `Logged in as ${userObj?.email}`);
          }, 800);
          return;
        }
      } catch {
        // continue to check local registered accounts
      }
    }

    // 2. Check local registered accounts from localStorage
    let registeredUsers: any[] = [];
    try {
      registeredUsers = JSON.parse(localStorage.getItem('cf_registered_users') || '[]');
    } catch {
      registeredUsers = [];
    }

    const userIdx = registeredUsers.findIndex((u: any) => u.email === cleanEmail);
    const matchedAccount = userIdx !== -1 ? registeredUsers[userIdx] : null;

    const isSystemAccount = cleanEmail === 'haseeb2408f@aptechsite.net' || cleanEmail === 'admin@connectflow.io' || cleanEmail === 'admin';

    if (matchedAccount) {
      // Check if password matches stored password
      if (matchedAccount.password === password) {
        const displayName = matchedAccount.fullName || (cleanEmail === 'haseeb2408f@aptechsite.net' ? 'Abdul Haseeb' : 'Business Admin');
        setSuccessMessage(`Welcome back, ${displayName}! Sign in successful.`);
        setCurrentUser({
          id: `usr-${matchedAccount.email}`,
          name: displayName,
          email: matchedAccount.email,
          role: matchedAccount.role || 'business_admin',
          businessId: `biz-${matchedAccount.email}`,
          businessName: matchedAccount.businessName || 'My Business Workspace',
          avatar: matchedAccount.avatar || '',
          status: 'active',
          createdAt: new Date().toISOString()
        });
        setBusiness(prev => ({
          ...prev,
          name: matchedAccount.businessName || prev.name,
          industry: matchedAccount.industry || prev.industry
        }));

        setTimeout(() => {
          localStorage.setItem('cf_is_logged_in', 'true');
          setAuthModalOpen(false);
          setPublicView(false);
          setActiveTab('overview');
          setSuccessMessage('');
          setLoading(false);
          logActivity('Local Account Login', `Logged in as ${matchedAccount.email}`);
        }, 800);
        return;
      } else {
        setErrorMessage('Incorrect password. Please enter your correct password or click "Forgot password?" to reset it.');
        setLoading(false);
        return;
      }
    }

    // 3. System Accounts / New User Fallback
    const demoDisplayName = cleanEmail === 'haseeb2408f@aptechsite.net' ? 'Abdul Haseeb' : cleanEmail.split('@')[0] || 'Business Admin';

    // Auto-save this user and password in localStorage
    registeredUsers.push({
      email: cleanEmail,
      password: password,
      fullName: demoDisplayName,
      businessName: 'My Business Workspace',
      role: 'business_admin'
    });
    localStorage.setItem('cf_registered_users', JSON.stringify(registeredUsers));

    setSuccessMessage(`Welcome back, ${demoDisplayName}!`);
    setCurrentUser({
      id: cleanEmail === 'haseeb2408f@aptechsite.net' ? 'user-1' : `usr-${cleanEmail}`,
      name: demoDisplayName,
      email: cleanEmail,
      role: 'business_admin',
      businessId: 'biz-1',
      businessName: 'My Business Workspace',
      avatar: '',
      status: 'active',
      createdAt: new Date().toISOString()
    });

    setTimeout(() => {
      localStorage.setItem('cf_is_logged_in', 'true');
      setAuthModalOpen(false);
      setPublicView(false);
      setActiveTab('overview');
      setSuccessMessage('');
      setLoading(false);
      logActivity('System Login', `Logged in as ${cleanEmail}`);
    }, 800);
    return;
  };

  const handleQuickLogin = (role: 'business_admin' | 'staff' | 'super_admin') => {
    setCurrentRole(role);
    const profileData = role === 'super_admin' 
      ? { name: 'System Super Admin', email: 'superadmin@connectflow.io' }
      : role === 'staff'
      ? { name: 'Sarah Connor (Staff)', email: 'staff@connectflow.io' }
      : { name: 'Abdul Haseeb', email: 'haseeb2408f@aptechsite.net' };

    setCurrentUser({
      id: `usr-${role}`,
      name: profileData.name,
      email: profileData.email,
      role: role,
      businessId: 'biz-1',
      businessName: 'My Business Workspace',
      avatar: '',
      status: 'active',
      createdAt: new Date().toISOString()
    });

    setSuccessMessage(`Logged in as ${role.replace('_', ' ').toUpperCase()}! Redirecting...`);
    setTimeout(() => {
      localStorage.setItem('cf_is_logged_in', 'true');
      setAuthModalOpen(false);
      setPublicView(false);
      if (role === 'super_admin') setActiveTab('superadmin');
      else setActiveTab('overview');
      setSuccessMessage('');
      logActivity('Demo Quick Login', `Switched role persona to ${role}`);
    }, 600);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanEmail = email.toLowerCase().trim();

    if (!isValidEmail(cleanEmail)) {
      setErrorMessage('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify both password fields.');
      return;
    }

    setLoading(true);

    // Save registered user locally for session and password matching
    try {
      const registered = JSON.parse(localStorage.getItem('cf_registered_users') || '[]');
      const filtered = registered.filter((r: any) => r.email !== cleanEmail);
      filtered.push({
        email: cleanEmail,
        password: password,
        fullName: fullName || cleanEmail.split('@')[0],
        businessName: businessName || 'My Business Workspace',
        industry: industry || 'Clinic/Hospital',
        role: 'business_admin'
      });
      localStorage.setItem('cf_registered_users', JSON.stringify(filtered));
    } catch {
      // ignore
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const newBizId = `biz-${Date.now()}`;
        const newBizData = {
          id: newBizId,
          name: businessName || 'My Business Workspace',
          industry: industry || 'Clinic/Hospital',
          email: cleanEmail,
          phone: '',
          timezone: 'UTC',
          plan: 'free_trial' as const,
          status: 'active' as const,
          smsCredits: 10000,
          whatsappCredits: 5000,
          emailCredits: 25000,
          voiceMinutes: 1000,
          createdAt: new Date().toISOString()
        };

        const newUserData = {
          id: `usr-${Date.now()}`,
          name: fullName || cleanEmail.split('@')[0],
          email: cleanEmail,
          role: 'business_admin' as const,
          businessId: newBizId,
          businessName: businessName || 'My Business Workspace',
          avatar: '',
          status: 'active' as const,
          createdAt: new Date().toISOString()
        };

        await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: fullName,
              business_name: businessName,
              industry: industry
            }
          }
        });

        await supabase.from('businesses').upsert(newBizData);
        await supabase.from('users').upsert(newUserData);
      } catch {
        // ignore errors
      }
    }

    setSuccessMessage(`Account created successfully for ${fullName || cleanEmail}! Switching to Sign In...`);
    setPassword('');

    setTimeout(() => {
      setAuthMode('login');
      setSuccessMessage('Account created successfully! Please enter your password to sign in.');
      setLoading(false);
      logActivity('Account Registration', `Created new business account for ${cleanEmail}`);
    }, 1200);
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    const cleanEmail = (email || 'haseeb2408f@aptechsite.net').toLowerCase().trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter your registered email address.');
      setLoading(false);
      return;
    }

    const passwordToSet = newPassword || password || '123456';
    if (!passwordToSet || passwordToSet.length < 3) {
      setErrorMessage('Please enter a valid new password (at least 3 characters).');
      setLoading(false);
      return;
    }

    // Save/update new password in registered accounts
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('cf_registered_users') || '[]');
      const userIdx = registeredUsers.findIndex((u: any) => u.email === cleanEmail);

      const displayName = cleanEmail === 'haseeb2408f@aptechsite.net' ? 'Abdul Haseeb' : cleanEmail.split('@')[0] || 'Business Admin';

      if (userIdx !== -1) {
        registeredUsers[userIdx].password = passwordToSet;
      } else {
        registeredUsers.push({
          email: cleanEmail,
          password: passwordToSet,
          fullName: displayName,
          businessName: 'My Business Workspace',
          role: 'business_admin'
        });
      }
      localStorage.setItem('cf_registered_users', JSON.stringify(registeredUsers));
    } catch {
      // ignore
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.resetPasswordForEmail(cleanEmail);
      } catch {
        // ignore
      }
    }

    const userDisplayName = cleanEmail === 'haseeb2408f@aptechsite.net' ? 'Abdul Haseeb' : cleanEmail.split('@')[0] || 'User';

    setSuccessMessage(`Password updated successfully! Logging you in as ${userDisplayName}...`);
    setEmail(cleanEmail);
    setPassword(passwordToSet);

    setCurrentUser({
      id: cleanEmail === 'haseeb2408f@aptechsite.net' ? 'user-1' : `usr-${cleanEmail}`,
      name: userDisplayName,
      email: cleanEmail,
      role: 'business_admin',
      businessId: 'biz-1',
      businessName: 'My Business Workspace',
      avatar: '',
      status: 'active',
      createdAt: new Date().toISOString()
    });

    setTimeout(() => {
      localStorage.setItem('cf_is_logged_in', 'true');
      setAuthModalOpen(false);
      setPublicView(false);
      setActiveTab('overview');
      setSuccessMessage('');
      setLoading(false);
      logActivity('Password Reset', `Password reset & auto logged in as ${cleanEmail}`);
    }, 900);
  };

  const industries: IndustryType[] = [
    'School', 'College', 'Clinic/Hospital', 'Salon/Spa', 'Gym/Fitness', 'Real Estate', 'Courier/Logistics', 'E-Commerce', 'SME Service'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#2D302D]/75 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div 
        className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl border border-[#E5E2DA] overflow-hidden relative animate-in zoom-in-95 duration-200 my-auto max-h-[92vh] flex flex-col custom-scrollbar"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-3 right-3 p-1.5 rounded-full text-[#A8A59E] hover:text-[#2D302D] hover:bg-[#F2F0EB] transition-colors z-10"
          title="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="bg-[#2D302D] text-white p-4 sm:p-5 text-center relative overflow-hidden border-b border-[#3F433F] shrink-0">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#8A9A5B] text-white mb-2 shadow-sm">
            <Layers className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold tracking-tight font-display">ConnectFlow SaaS</h2>
          <p className="text-[11px] text-[#A8A59E] mt-0.5">
            {authMode === 'login' ? 'Sign in to access your business workspace' : authMode === 'register' ? 'Start your 14-day free trial in seconds' : 'Reset your account password'}
          </p>

          {/* Nav Mode Switcher Pills */}
          <div className="mt-3 flex justify-center gap-1.5">
            <button
              onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
              className={`px-3.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                authMode === 'login' 
                  ? 'bg-[#8A9A5B] text-white shadow-xs' 
                  : 'bg-[#3F433F] text-[#A8A59E] hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthMode('register'); setErrorMessage(''); }}
              className={`px-3.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                authMode === 'register' 
                  ? 'bg-[#8A9A5B] text-white shadow-xs' 
                  : 'bg-[#3F433F] text-[#A8A59E] hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {successMessage && (
          <div className="bg-[#8A9A5B]/15 border-b border-[#8A9A5B]/30 p-2.5 text-xs font-bold text-[#78884B] flex items-center gap-2 justify-center shrink-0">
            <Check className="w-4 h-4 text-[#8A9A5B] shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="bg-rose-50 border-b border-rose-200 p-2.5 text-xs font-bold text-rose-700 flex items-center gap-2 justify-center text-center shrink-0">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Auth Forms */}
        <div className="p-4 sm:p-5 overflow-y-auto custom-scrollbar">
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#2D302D] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8A857C] absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@connectflow.io"
                    className="w-full pl-9 pr-3 py-2 bg-[#F9F8F6] border border-[#E5E2DA] rounded-xl text-xs font-medium text-[#2D302D] focus:ring-2 focus:ring-[#8A9A5B] focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-[#2D302D]">Password</label>
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="text-[11px] font-bold text-[#8A9A5B] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8A857C] absolute left-3 top-2.5 z-10 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 bg-[#F9F8F6] border border-[#E5E2DA] rounded-xl text-xs font-medium text-[#2D302D] focus:ring-2 focus:ring-[#8A9A5B] focus:bg-white outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1.5 z-20 p-1 text-slate-500 hover:text-slate-900 rounded-md transition-all flex items-center justify-center"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5 text-emerald-700" /> : <Eye className="w-3.5 h-3.5 text-slate-600" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#8A9A5B] hover:bg-[#78884B] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 mt-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <span className="text-xs text-[#8A857C]">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="text-xs font-bold text-[#8A9A5B] hover:underline"
                >
                  Create business account
                </button>
              </div>
            </form>
          )}

          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#2D302D] mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-[#8A857C] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Sarah Jenkins"
                      className="w-full pl-8 pr-2.5 py-2 bg-[#F9F8F6] border border-[#E5E2DA] rounded-xl text-xs font-medium text-[#2D302D] focus:ring-2 focus:ring-[#8A9A5B] focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#2D302D] mb-1">Business Name</label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 text-[#8A857C] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={e => setBusinessName(e.target.value)}
                      placeholder="e.g. Apex Health"
                      className="w-full pl-8 pr-2.5 py-2 bg-[#F9F8F6] border border-[#E5E2DA] rounded-xl text-xs font-medium text-[#2D302D] focus:ring-2 focus:ring-[#8A9A5B] focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#2D302D] mb-1">Industry Sector</label>
                <select
                  value={industry}
                  onChange={e => setIndustry(e.target.value as IndustryType)}
                  className="w-full px-3 py-2 bg-[#F9F8F6] border border-[#E5E2DA] rounded-xl text-xs font-bold text-[#2D302D] focus:ring-2 focus:ring-[#8A9A5B] outline-none"
                >
                  {industries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#2D302D] mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-[#8A857C] absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="sarah@apexhealth.com"
                    className={`w-full pl-8 pr-2.5 py-2 bg-[#F9F8F6] border rounded-xl text-xs font-medium text-[#2D302D] focus:ring-2 outline-none transition-all ${
                      email.length > 0 && !isValidEmail(email)
                        ? 'border-rose-400 focus:ring-rose-400'
                        : email.length > 0 && isValidEmail(email)
                        ? 'border-emerald-500 focus:ring-emerald-500'
                        : 'border-[#E5E2DA] focus:ring-[#8A9A5B] focus:bg-white'
                    }`}
                  />
                </div>
                {email.length > 0 && !isValidEmail(email) && (
                  <p className="text-[10px] text-rose-600 font-medium mt-0.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    Valid format required (e.g. name@domain.com)
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#2D302D] mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-[#8A857C] absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className={`w-full pl-8 pr-8 py-2 bg-[#F9F8F6] border rounded-xl text-xs font-medium text-[#2D302D] focus:ring-2 outline-none transition-all ${
                        password.length > 0 && password.length < 6
                          ? 'border-amber-400 focus:ring-amber-400'
                          : password.length >= 6
                          ? 'border-emerald-500 focus:ring-emerald-500'
                          : 'border-[#E5E2DA] focus:ring-[#8A9A5B] focus:bg-white'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-2 text-[#8A857C] hover:text-[#2D302D] transition-colors"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#2D302D] mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-[#8A857C] absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className={`w-full pl-8 pr-8 py-2 bg-[#F9F8F6] border rounded-xl text-xs font-medium text-[#2D302D] focus:ring-2 outline-none transition-all ${
                        confirmPassword.length > 0 && confirmPassword !== password
                          ? 'border-rose-400 focus:ring-rose-400'
                          : confirmPassword.length > 0 && confirmPassword === password
                          ? 'border-emerald-500 focus:ring-emerald-500'
                          : 'border-[#E5E2DA] focus:ring-[#8A9A5B] focus:bg-white'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {confirmPassword.length > 0 && confirmPassword !== password && (
                <p className="text-[10px] text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  Passwords do not match
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#8A9A5B] hover:bg-[#78884B] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 mt-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Activate 14-Day Free Trial</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <span className="text-xs text-[#8A857C]">Already registered? </span>
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-xs font-bold text-[#8A9A5B] hover:underline"
                >
                  Sign in instead
                </button>
              </div>
            </form>
          )}

          {authMode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#2D302D] mb-1">Registered Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8A857C] absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="haseeb2408f@aptechsite.net"
                    className="w-full pl-9 pr-3 py-2 bg-[#F9F8F6] border border-[#E5E2DA] rounded-xl text-xs font-medium text-[#2D302D] focus:ring-2 focus:ring-[#8A9A5B] focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D302D] mb-1">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8A857C] absolute left-3 top-2.5 z-10 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-9 pr-10 py-2 bg-[#F9F8F6] border border-[#E5E2DA] rounded-xl text-xs font-medium text-[#2D302D] focus:ring-2 focus:ring-[#8A9A5B] focus:bg-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1.5 z-20 p-1 text-slate-500 hover:text-slate-900 rounded-md transition-all flex items-center justify-center"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5 text-emerald-700" /> : <Eye className="w-3.5 h-3.5 text-slate-600" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#8A9A5B] hover:bg-[#78884B] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating password...</span>
                  </>
                ) : (
                  <span>Reset & Save New Password</span>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-xs font-bold text-[#8A9A5B] hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

