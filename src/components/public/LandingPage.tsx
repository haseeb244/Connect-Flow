import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MessageSquare, 
  Send, 
  PhoneCall, 
  Mail, 
  Clock, 
  CheckCircle, 
  ShieldCheck, 
  Zap, 
  Building2, 
  School, 
  Activity, 
  Scissors, 
  Dumbbell, 
  Home, 
  Truck, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  ChevronRight, 
  Layers, 
  Check, 
  HelpCircle,
  Users
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setAuthModalOpen, setAuthMode, setPublicView, setActiveTab } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const openRegister = () => {
    setAuthMode('register');
    setAuthModalOpen(true);
  };

  const openLogin = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const directDemo = () => {
    setPublicView(false);
    setActiveTab('overview');
  };

  const industries = [
    { name: 'Schools & Colleges', icon: School, desc: 'Fee reminders, exam schedules, emergency attendance alerts' },
    { name: 'Hospitals & Clinics', icon: Activity, desc: 'Appointment confirmations, lab test ready alerts, prescription reminders' },
    { name: 'Salons & Spas', icon: Scissors, desc: 'Booking confirmations, service follow-ups, birthday discounts' },
    { name: 'Gyms & Fitness', icon: Dumbbell, desc: 'Membership expiry notices, renewal links, class updates' },
    { name: 'Real Estate', icon: Home, desc: 'Property tour alerts, new listing broadcasts, buyer follow-ups' },
    { name: 'Courier & Logistics', icon: Truck, desc: 'Delivery status updates, driver dispatch alerts, ETA notices' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">ConnectFlow</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#solutions" className="hover:text-indigo-600 transition-colors">Solutions</a>
          <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
          <a href="#about" className="hover:text-indigo-600 transition-colors">About Us</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={directDemo}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all"
          >
            <span>Launch Live App</span>
            <ChevronRight className="w-3.5 h-3.5 text-indigo-600" />
          </button>
          <button
            onClick={openLogin}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={openRegister}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
          >
            Start Free Trial
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 lg:px-8 py-16 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold mb-6">
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Rule-Based Communication Automation Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
          Automate Your Business Communication
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Streamline customer messaging across SMS, WhatsApp, Email, and Pre-recorded Voice Calls. 
          No complex coding. One platform, infinite workflows.
        </p>

        {/* Workflow Diagram Banner */}
        <div className="mt-10 max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-6 relative">
          <div className="bg-slate-900 rounded-xl p-6 text-left text-white space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                <span className="ml-2 text-xs font-mono text-slate-400">connectflow-workflow-engine.v2</span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 text-[10px] font-mono rounded border border-emerald-800">
                STATUS: ACTIVE
              </span>
            </div>

            {/* Simulated Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                <span className="text-[10px] uppercase font-mono text-indigo-400 font-bold block mb-1">TRIGGER EVENT</span>
                <p className="text-xs font-bold text-white">Fee Due / Appointment</p>
                <p className="text-[11px] text-slate-400 mt-0.5">24 Hours Before Date</p>
              </div>

              <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                <span className="text-[10px] uppercase font-mono text-amber-400 font-bold block mb-1">CHANNEL SELECT</span>
                <p className="text-xs font-bold text-white">SMS & WhatsApp</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Custom Template Variables</p>
              </div>

              <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                <span className="text-[10px] uppercase font-mono text-purple-400 font-bold block mb-1">VOICE FALLBACK</span>
                <p className="text-xs font-bold text-white">Interactive Call</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Press 1 to Confirm</p>
              </div>

              <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold block mb-1">REAL-TIME REPORT</span>
                <p className="text-xs font-bold text-white">Delivery Logged</p>
                <p className="text-[11px] text-slate-400 mt-0.5">99.4% Delivery Success</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={openRegister}
            className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
          >
            <span>Start 14-Day Free Trial</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={directDemo}
            className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl font-bold text-sm shadow-xs transition-colors"
          >
            Explore Dashboard Directly
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-3">No credit card required • Instant gateway setup • Cancel anytime</p>
      </section>

      {/* Social Proof */}
      <section className="bg-slate-100 py-8 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            Trusted by 500+ Schools, Clinics, Salons & SMEs
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400 opacity-80">
            <div className="flex items-center gap-2 font-bold text-slate-700">
              <School className="w-5 h-5 text-indigo-600" />
              <span>Apex Academy</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-700">
              <Activity className="w-5 h-5 text-indigo-600" />
              <span>Metro Health Clinic</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-700">
              <Scissors className="w-5 h-5 text-indigo-600" />
              <span>Luxe Hair & Spa</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-700">
              <Dumbbell className="w-5 h-5 text-indigo-600" />
              <span>FitPulse Gyms</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-700">
              <Home className="w-5 h-5 text-indigo-600" />
              <span>Prime Properties</span>
            </div>
          </div>
        </div>
      </section>

      {/* Omnichannel Features Section */}
      <section id="features" className="py-20 px-4 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Omnichannel Automation</h2>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Four Power Channels in One Unified Suite
          </h3>
          <p className="text-slate-600 text-sm mt-3">
            Reach your customers on their preferred device with instant rule-based scheduling and delivery reports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">SMS Campaigns</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                High-deliverability text messaging for urgent alerts, fee reminders, and event notices.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
              <span>Dynamic Tags: &#123;&#123;name&#125;&#125;</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
                <Send className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">WhatsApp Business</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Send rich media notices, appointment links, and order updates with interactive button replies.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
              <span>Read Receipts Logged</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Email Broadcasts</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Send diagnostic lab reports, newsletters, invoices, and HTML bulletins with high open rates.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600">
              <span>SMTP Integration</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Voice Call Audio</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Schedule pre-recorded voice audio call broadcasts for emergency notices and payment follow-ups.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
              <span>Auto-Retry Failed Calls</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Solutions by Industry */}
      <section id="solutions" className="py-20 px-4 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Tailored for Your Industry</h2>
            <h3 className="text-3xl font-extrabold tracking-tight">Built for Real Business Needs</h3>
            <p className="text-slate-400 text-sm mt-3">
              Eliminate manual phone calls and staff follow-ups with automated triggers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((ind, i) => {
              const Icon = ind.icon;
              return (
                <div key={i} className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700/80 hover:border-indigo-500/80 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">{ind.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{ind.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Transparent Pricing</h2>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Simple Plans for Businesses of Any Scale
          </h3>
          <p className="text-slate-600 text-sm mt-3">
            Includes gateway connection, campaign scheduler, rule automations, and reporting.
          </p>

          {/* Billing Toggle */}
          <div className="mt-6 inline-flex items-center gap-3 p-1.5 bg-slate-200/80 rounded-xl text-xs font-bold">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg transition-all ${billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'}`}
            >
              <span>Yearly (Save 20%)</span>
              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded font-extrabold">2 Months Free</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-slate-500">Basic Plan</span>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">${billingCycle === 'monthly' ? '29' : '24'}</span>
                <span className="text-xs text-slate-500 font-semibold">/ month</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Perfect for single branch clinics, salons, or small businesses.</p>
              
              <ul className="mt-6 space-y-3 text-xs text-slate-700 font-medium border-t border-slate-100 pt-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Up to 2,000 Contacts</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 5,000 SMS Credits</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 2,500 WhatsApp Messages</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 300 Voice Call Minutes</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Standard Campaign Scheduler</li>
              </ul>
            </div>

            <button
              onClick={openRegister}
              className="mt-8 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors"
            >
              Get Started with Basic
            </button>
          </div>

          {/* Pro Plan (Featured) */}
          <div className="p-6 bg-white rounded-2xl border-2 border-indigo-600 shadow-xl flex flex-col justify-between relative">
            <span className="absolute -top-3.5 right-6 px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
              Most Popular
            </span>
            <div>
              <span className="text-xs font-bold uppercase text-indigo-600">Professional Plan</span>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">${billingCycle === 'monthly' ? '99' : '79'}</span>
                <span className="text-xs text-slate-500 font-semibold">/ month</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">For growing schools, hospitals, real estate agencies, & SMEs.</p>
              
              <ul className="mt-6 space-y-3 text-xs text-slate-700 font-medium border-t border-slate-100 pt-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> <strong>Unlimited Contacts & Groups</strong></li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 25,000 SMS Credits</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 15,000 WhatsApp Credits</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 2,000 Voice Call Minutes</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> <strong>Rule-Based Automation Engine</strong></li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Custom Voice Audio Uploads</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Up to 10 Staff User Accounts</li>
              </ul>
            </div>

            <button
              onClick={openRegister}
              className="mt-8 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              Start 14-Day Free Trial
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-slate-500">Enterprise Plan</span>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">${billingCycle === 'monthly' ? '249' : '199'}</span>
                <span className="text-xs text-slate-500 font-semibold">/ month</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">For multi-branch institutions, universities, and high-volume operations.</p>
              
              <ul className="mt-6 space-y-3 text-xs text-slate-700 font-medium border-t border-slate-100 pt-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 100,000+ SMS Credits</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 75,000 WhatsApp Credits</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 10,000 Voice Minutes</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Dedicated Gateway & Custom Sender ID</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Unlimited Staff Accounts</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 24/7 Priority SLA Support</li>
              </ul>
            </div>

            <button
              onClick={openRegister}
              className="mt-8 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors"
            >
              Contact Enterprise Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-extrabold text-base mb-3">
              <Layers className="w-5 h-5 text-indigo-500" />
              <span>ConnectFlow</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Automated business communication SaaS platform for scheduled SMS, WhatsApp, Email, and Voice Call campaigns.
            </p>
          </div>

          <div>
            <h5 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Product Features</h5>
            <ul className="space-y-2">
              <li><button onClick={directDemo} className="hover:text-white transition-colors">Campaign Scheduler</button></li>
              <li><button onClick={directDemo} className="hover:text-white transition-colors">Voice Audio Manager</button></li>
              <li><button onClick={directDemo} className="hover:text-white transition-colors">Rule Automation Engine</button></li>
              <li><button onClick={directDemo} className="hover:text-white transition-colors">Delivery Analytics & Reports</button></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Industries</h5>
            <ul className="space-y-2">
              <li>Schools & Universities</li>
              <li>Clinics & Hospitals</li>
              <li>Salons & Fitness Gyms</li>
              <li>Real Estate & Logistics</li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Contact & Support</h5>
            <p className="text-slate-400 mb-2">Support: support@connectflow.io</p>
            <p className="text-slate-400 mb-4">Phone: +1 (800) 555-FLOW</p>
            <button
              onClick={directDemo}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-colors"
            >
              Access Dashboard
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <p>© 2026 ConnectFlow SaaS Inc. All rights reserved.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Security & SLA</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
