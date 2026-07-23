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

    const loginName = email ? email.split('@')[0] : 'Admin User';

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          setErrorMessage(error.message);
          setLoading(false);
          return;
        }

        const userObj = data.user;
        setSuccessMessage(`Welcome back, ${userObj?.user_metadata?.full_name || loginName}! Redirecting...`);

        setCurrentUser(prev => ({
          ...prev,
          email: userObj?.email || email,
          name: userObj?.user_metadata?.full_name || loginName.charAt(0).toUpperCase() + loginName.slice(1)
        }));

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
      } catch (err: any) {
        setErrorMessage(err.message || 'Supabase authentication failed');
        setLoading(false);
        return;
      }
    }

    // Demo Mode Fallback if Supabase keys not set yet
    setSuccessMessage(`Welcome back, ${loginName}! Redirecting to dashboard...`);
    if (email) {
      setCurrentUser(prev => ({
        ...prev,
        email: email,
        name: loginName.charAt(0).toUpperCase() + loginName.slice(1)
      }));
    }

    setTimeout(() => {
      localStorage.setItem('cf_is_logged_in', 'true');
      setAuthModalOpen(false);
      setPublicView(false);
      setActiveTab('overview');
      setSuccessMessage('');
      setLoading(false);
      logActivity('User Login', `Logged in as ${email || 'Admin'}`);
    }, 800);
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

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
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
          setErrorMessage(error.message);
          setLoading(false);
          return;
        }

        const createdUser = data.user;
        setSuccessMessage(
          createdUser?.identities?.length === 0
            ? 'Account exists! Try logging in or checking your email.'
            : `Account created via Supabase! Welcome ${fullName || 'partner'}.`
        );

        if (fullName) {
          setCurrentUser(prev => ({
            ...prev,
            name: fullName,
            email: email || prev.email,
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
          localStorage.setItem('cf_is_logged_in', 'true');
          setAuthModalOpen(false);
          setPublicView(false);
          setCurrentRole('business_admin');
          setActiveTab('overview');
          setSuccessMessage('');
          setLoading(false);
          logActivity('Supabase Register', `Created account for ${businessName || fullName}`);
        }, 1200);
        return;
      } catch (err: any) {
        setErrorMessage(err.message || 'Supabase registration failed');
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
        email: email || prev.email,
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
        setSuccessMessage('Supabase password reset link sent to your email!');
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

          {/* Supabase Status Pill */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-[#3F433F] text-[#EBE9E4] border border-[#4A4E4A]">
            <Database className={`w-3 h-3 ${isSupabaseConfigured ? 'text-[#8A9A5B]' : 'text-amber-400'}`} />
            <span>
              {isSupabaseConfigured ? 'Supabase Auth Connected' : 'Supabase Client Ready'}
            </span>
          </div>

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
          <div className="bg-rose-50 border-y border-rose-200 p-3 text-xs font-bold text-rose-700 flex items-center gap-2 justify-center">
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
                    <span>Signing in via Supabase...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick Persona Demo Buttons */}
              <div className="pt-3 border-t border-[#F2F0EB]">
                <p className="text-[10px] font-bold text-[#8A857C] uppercase tracking-wider text-center mb-2">
                  One-Click Demo Personas
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('business_admin')}
                    className="py-2 px-2 bg-[#F2F0EB] hover:bg-[#E5E2DA] text-[#2D302D] rounded-xl text-[10px] font-bold text-center transition-colors"
                  >
                    Business Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('staff')}
                    className="py-2 px-2 bg-[#F2F0EB] hover:bg-[#E5E2DA] text-[#2D302D] rounded-xl text-[10px] font-bold text-center transition-colors"
                  >
                    Staff User
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('super_admin')}
                    className="py-2 px-2 bg-[#2D302D] hover:bg-[#3F433F] text-white rounded-xl text-[10px] font-bold text-center transition-colors"
                  >
                    Super Admin
                  </button>
                </div>
              </div>

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
                    placeholder="Apex Health Clinic"
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
                    <span>Creating Supabase account...</span>
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

