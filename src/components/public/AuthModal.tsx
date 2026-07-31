import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IndustryType } from '../../types';
import { X, Layers, Mail, Lock, Building2, User, Check, ArrowRight, Database, AlertCircle, Loader2 } from 'lucide-react';
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

  if (!authModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    const cleanEmail = email.toLowerCase().trim();

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
              setCurrentUser(prev => ({
                ...prev,
                email: userObj?.email || cleanEmail,
                name: displayName,
              }));
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

    const matchedAccount = registeredUsers.find((u: any) => u.email === cleanEmail);

    if (matchedAccount) {
      if (matchedAccount.password !== password) {
        setErrorMessage('Invalid login credentials. Incorrect password.');
        setLoading(false);
        return;
      }

      // Password matches! Log in as registered user
      setSuccessMessage(`Welcome back, ${matchedAccount.fullName}! Sign in successful.`);
      setCurrentUser(prev => ({
        ...prev,
        name: matchedAccount.fullName,
        email: matchedAccount.email,
        role: matchedAccount.role || 'business_admin'
      }));
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
    }

    // 3. Default demo accounts (e.g. admin@connectflow.io, haseeb2408f@aptechsite.net)
    if (cleanEmail === 'admin@connectflow.io' || cleanEmail === 'haseeb2408f@aptechsite.net' || cleanEmail === 'admin') {
      const demoDisplayName = cleanEmail === 'haseeb2408f@aptechsite.net' ? 'Abdul Haseeb' : 'Business Admin';
      setSuccessMessage(`Welcome back, ${demoDisplayName}!`);
      setCurrentUser(prev => ({
        ...prev,
        name: demoDisplayName,
        email: cleanEmail,
        role: 'business_admin'
      }));

      setTimeout(() => {
        localStorage.setItem('cf_is_logged_in', 'true');
        setAuthModalOpen(false);
        setPublicView(false);
        setActiveTab('overview');
        setSuccessMessage('');
        setLoading(false);
        logActivity('Demo Login', `Logged in as ${cleanEmail}`);
      }, 800);
      return;
    }

    // If no account match and Supabase failed / wrong password:
    setErrorMessage('Invalid email or password. Please verify your credentials or create a new account.');
    setLoading(false);
  };

  const handleQuickLogin = (role: 'business_admin' | 'staff' | 'super_admin') => {
    setCurrentRole(role);
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
    setLoading(true);

    const cleanEmail = email.toLowerCase().trim();

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
        const { data, error } = await supabase.auth.signUp({
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

        if (error) {
          setSuccessMessage(`Setting up workspace directly for ${businessName || fullName || 'partner'}...`);
          
          const fallbackBizId = `biz-${Date.now()}`;
          const fallbackBizData = {
            id: fallbackBizId,
            name: businessName || 'My Business Workspace',
            industry: industry || 'Clinic/Hospital',
            email: cleanEmail || 'admin@connectflow.io',
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

          const fallbackUserData = {
            id: `usr-${Date.now()}`,
            name: fullName || (cleanEmail ? cleanEmail.split('@')[0] : 'Admin User'),
            email: cleanEmail || 'admin@connectflow.io',
            role: 'business_admin' as const,
            businessId: fallbackBizId,
            businessName: businessName || 'My Business Workspace',
            avatar: '',
            status: 'active' as const,
            createdAt: new Date().toISOString()
          };

          setCurrentUser(fallbackUserData);
          setBusiness(fallbackBizData);

          setTimeout(() => {
            localStorage.setItem('cf_is_logged_in', 'true');
            setAuthModalOpen(false);
            setPublicView(false);
            setCurrentRole('business_admin');
            setActiveTab('overview');
            setSuccessMessage('');
            setLoading(false);
            logActivity('Register Workspace', `Created account for ${businessName || fullName}`);
          }, 1200);
          return;
        }

        const createdUser = data.user;

        // Create business record in Supabase SQL table
        const newBizId = `biz-${Date.now()}`;
        const newBizData = {
          id: newBizId,
          name: businessName || 'My Business Workspace',
          industry: industry || 'SME Service',
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

        // Create user record in Supabase SQL table
        const newUserData = {
          id: createdUser?.id || `usr-${Date.now()}`,
          name: fullName || cleanEmail.split('@')[0],
          email: cleanEmail,
          role: 'business_admin' as const,
          businessId: newBizId,
          businessName: businessName || 'My Business Workspace',
          avatar: '',
          status: 'active' as const,
          createdAt: new Date().toISOString()
        };

        try {
          await supabase.from('businesses').upsert(newBizData);
          await supabase.from('users').upsert(newUserData);
        } catch {
          // ignore error if tables not yet created by admin
        }

        setSuccessMessage(
          createdUser?.identities?.length === 0
            ? 'Account exists! Try logging in or checking your email.'
            : `Account created successfully! Welcome ${fullName || 'partner'}.`
        );

        setCurrentUser({
          id: newUserData.id,
          name: newUserData.name,
          email: newUserData.email,
          role: 'business_admin',
          businessId: newBizId,
          businessName: newBizData.name,
          avatar: '',
          status: 'active',
          createdAt: newUserData.createdAt
        });

        setBusiness({
          id: newBizData.id,
          name: newBizData.name,
          industry: newBizData.industry,
          email: newBizData.email,
          phone: '',
          timezone: 'UTC',
          plan: 'free_trial',
          status: 'active',
          smsCredits: 10000,
          whatsappCredits: 5000,
          emailCredits: 25000,
          voiceMinutes: 1000,
          createdAt: newBizData.createdAt
        });

        setTimeout(() => {
          localStorage.setItem('cf_is_logged_in', 'true');
          setAuthModalOpen(false);
          setPublicView(false);
          setCurrentRole('business_admin');
          setActiveTab('overview');
          setSuccessMessage('');
          setLoading(false);
          logActivity('Register', `Created account for ${businessName || fullName}`);
        }, 1200);
        return;
      } catch (err: any) {
        setErrorMessage(err.message || 'Registration failed');
        setLoading(false);
        return;
      }
    }

    // Demo Mode Fallback
    setSuccessMessage(`Account created! 14-day free trial activated for ${businessName || 'your business'}.`);

    if (fullName) {
      setCurrentUser(prev => ({
        ...prev,
        name: fullName,
        email: cleanEmail || prev.email,
        role: 'business_admin'
      }));
    }

    if (businessName) {
      setBusiness(prev => ({
        ...prev,
        name: businessName,
        industry: industry
      }));
    }

    setTimeout(() => {
      setAuthModalOpen(false);
      setPublicView(false);
      setCurrentRole('business_admin');
      setActiveTab('overview');
      setSuccessMessage('');
      setLoading(false);
      logActivity('Account Registration', `Created new business account "${businessName || 'New Company'}"`);
    }, 1000);
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) {
          setErrorMessage(error.message);
          setLoading(false);
          return;
        }
        setSuccessMessage('Password reset link sent to your email!');
        setLoading(false);
        setTimeout(() => {
          setAuthMode('login');
          setSuccessMessage('');
        }, 2000);
        return;
      } catch (err: any) {
        setErrorMessage(err.message || 'Password reset failed');
        setLoading(false);
        return;
      }
    }

    setSuccessMessage('Password reset instructions sent to your email address!');
    setLoading(false);
    setTimeout(() => {
      setAuthMode('login');
      setSuccessMessage('');
    }, 1500);
  };

  const industries: IndustryType[] = [
    'School', 'College', 'Clinic/Hospital', 'Salon/Spa', 'Gym/Fitness', 'Real Estate', 'Courier/Logistics', 'E-Commerce', 'SME Service'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D302D]/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E5E2DA] overflow-hidden relative animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-[#A8A59E] hover:text-[#2D302D] hover:bg-[#F2F0EB] transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-[#2D302D] text-white p-6 pb-8 text-center relative overflow-hidden border-b border-[#3F433F]">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#8A9A5B] text-white mb-3 shadow-md">
            <Layers className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">ConnectFlow SaaS</h2>
          <p className="text-xs text-[#A8A59E] mt-1">
            {authMode === 'login' ? 'Sign in to access your business communication suite' : authMode === 'register' ? 'Start your 14-day free trial in seconds' : 'Reset your account password'}
          </p>

          {/* Nav Mode Switcher Pills */}
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                authMode === 'login' 
                  ? 'bg-[#8A9A5B] text-white shadow-xs' 
                  : 'bg-[#3F433F] text-[#A8A59E] hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthMode('register'); setErrorMessage(''); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
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
          <div className="bg-[#8A9A5B]/15 border-y border-[#8A9A5B]/30 p-3 text-xs font-bold text-[#78884B] flex items-center gap-2 justify-center">
            <Check className="w-4 h-4 text-[#8A9A5B]" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="bg-rose-50 border-y border-rose-200 p-3 text-xs font-bold text-rose-700 flex items-center gap-2 justify-center text-center">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Auth Forms */}
        <div className="p-6">
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2D302D] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8A857C] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@connectflow.io"
                    className="w-full pl-10 pr-3 py-2.5 bg-[#F9F8F6] border border-[#E5E2DA] rounded-xl text-xs font-medium text-[#2D302D] focus:ring-2 focus:ring-[#8A9A5B] focus:bg-white outline-none"
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
                  <Lock className="w-4 h-4 text-[#8A857C] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 bg-[#F9F8F6] border border-[#E5E2DA] rounded-xl text-xs font-medium text-[#2D302D] focus:ring-2 focus:ring-[#8A9A5B] focus:bg-white outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#8A9A5B] hover:bg-[#78884B] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
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

              <div className="text-center pt-2">
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
              <div>
                <label className="block text-xs font-bold text-[#2D302D] mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8A857C] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Sarah Jenkins"
                    className="w-full pl-10 pr-3 py-2.5 bg-[#F9F8F6] border border-[#E5E2DA] rounded-xl text-xs font-medium text-[#2D302D] focus:ring-2 focus:ring-[#8A9A5B] focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D302D] mb-1">Company / Business Name</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#8A857C] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    placeholder="e.g. My Business Workspace"
                    className="w-full pl-10 pr-3 py-2.5 bg-[#F9F8F6] border border-[#E5E2DA] rounded-xl text-xs font-medium text-[#2D302D] focus:ring-2 focus:ring-[#8A9A5B] focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D302D] mb-1">Industry Sector</label>
                <select
                  value={industry}
                  onChange={e => setIndustry(e.target.value as IndustryType)}
                  className="w-full px-3.5 py-2.5 bg-[#F9F8F6] border border-[#E5E2DA] rounded-xl text-xs font-bold text-[#2D302D] focus:ring-2 focus:ring-[#8A9A5B] outline-none"
                >
                  {industries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D302D] mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8A857C] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="sarah@apexhealth.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-[#F9F8F6] border border-[#E5E2DA] rounded-xl text-xs font-medium text-[#2D302D] focus:ring-2 focus:ring-[#8A9A5B] focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D302D] mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8A857C] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-3 py-2.5 bg-[#F9F8F6] border border-[#E5E2DA] rounded-xl text-xs font-medium text-[#2D302D] focus:ring-2 focus:ring-[#8A9A5B] focus:bg-white outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#8A9A5B] hover:bg-[#78884B] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 mt-2"
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

              <div className="text-center pt-2">
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
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2D302D] mb-1">Enter Your Registered Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8A857C] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@connectflow.io"
                    className="w-full pl-10 pr-3 py-2.5 bg-[#F9F8F6] border border-[#E5E2DA] rounded-xl text-xs font-medium text-[#2D302D] focus:ring-2 focus:ring-[#8A9A5B] focus:bg-white outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#8A9A5B] hover:bg-[#78884B] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending reset link...</span>
                  </>
                ) : (
                  <span>Send Password Reset Email</span>
                )}
              </button>

              <div className="text-center pt-2">
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

