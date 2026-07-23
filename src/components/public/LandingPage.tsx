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

  const industries = [
    { name: 'Schools & Colleges', icon: School, desc: 'Fee reminders, exam schedules, emergency attendance alerts' },
    { name: 'Hospitals & Clinics', icon: Activity, desc: 'Appointment confirmations, lab test ready alerts, prescription reminders' },
    { name: 'Salons & Spas', icon: Scissors, desc: 'Booking confirmations, service follow-ups, birthday discounts' },
    { name: 'Gyms & Fitness', icon: Dumbbell, desc: 'Membership expiry notices, renewal links, class updates' },
    { name: 'Real Estate', icon: Home, desc: 'Property tour alerts, new listing broadcasts, buyer follow-ups' },
    { name: 'Courier & Logistics', icon: Truck, desc: 'Delivery status updates, driver dispatch alerts, ETA notices' },
  ];

  return (
    <div id="home" className="min-h-screen bg-[#F9F8F6] text-[#2D302D] font-sans selection:bg-[#8A9A5B] selection:text-white">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E5E2DA] px-4 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-2xl bg-[#8A9A5B] text-white flex items-center justify-center font-bold shadow-xs">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#2D302D]">ConnectFlow</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-bold text-[#8A857C]">
          <a href="#home" className="hover:text-[#8A9A5B] transition-colors">Home</a>
          <a href="#features" className="hover:text-[#8A9A5B] transition-colors">Features</a>
          <a href="#solutions" className="hover:text-[#8A9A5B] transition-colors">Solutions</a>
          <a href="#pricing" className="hover:text-[#8A9A5B] transition-colors">Pricing</a>
          <a href="#about" className="hover:text-[#8A9A5B] transition-colors">About Us</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openLogin}
            className="px-4 py-2 text-xs font-bold text-[#2D302D] hover:text-[#8A9A5B] transition-colors border border-[#E5E2DA] rounded-xl hover:bg-[#F2F0EB]"
          >
            Sign In
          </button>
          <button
            onClick={openRegister}
            className="px-4 py-2 bg-[#8A9A5B] hover:bg-[#78884B] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 lg:px-8 py-16 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F2F0EB] border border-[#E5E2DA] text-[#8A9A5B] text-xs font-bold mb-6">
          <Zap className="w-3.5 h-3.5 text-[#8A9A5B] fill-current" />
          <span>Rule-Based Communication Automation Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#2D302D] max-w-4xl mx-auto leading-tight">
          Automate Your Business Communication
        </h1>

        <p className="mt-4 text-base sm:text-lg text-[#8A857C] max-w-2xl mx-auto leading-relaxed font-normal">
          Streamline customer messaging across SMS, WhatsApp, Email, and Pre-recorded Voice Calls. 
          No complex coding. One platform, infinite workflows.
        </p>

        {/* Workflow Diagram Banner */}
        <div className="mt-10 max-w-4xl mx-auto bg-white rounded-3xl border border-[#E5E2DA] shadow-xl overflow-hidden p-6 relative">
          <div className="bg-[#2D302D] rounded-2xl p-6 text-left text-white space-y-6">
            <div className="flex items-center justify-between border-b border-[#3F433F] pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-[#8A9A5B] inline-block"></span>
                <span className="ml-2 text-xs font-mono text-[#A8A59E]">connectflow-workflow-engine.v2</span>
              </div>
              <span className="px-2.5 py-0.5 bg-[#8A9A5B]/20 text-[#8A9A5B] text-[10px] font-mono rounded-md border border-[#8A9A5B]/30">
                STATUS: ACTIVE
              </span>
            </div>

            {/* Simulated Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-3.5 bg-[#3F433F] rounded-xl border border-[#4A4E4A]">
                <span className="text-[10px] uppercase font-mono text-[#8A9A5B] font-bold block mb-1">TRIGGER EVENT</span>
                <p className="text-xs font-bold text-white">Fee Due / Appointment</p>
                <p className="text-[11px] text-[#A8A59E] mt-0.5">24 Hours Before Date</p>
              </div>

              <div className="p-3.5 bg-[#3F433F] rounded-xl border border-[#4A4E4A]">
                <span className="text-[10px] uppercase font-mono text-amber-300 font-bold block mb-1">CHANNEL SELECT</span>
                <p className="text-xs font-bold text-white">SMS & WhatsApp</p>
                <p className="text-[11px] text-[#A8A59E] mt-0.5">Custom Template Variables</p>
              </div>

              <div className="p-3.5 bg-[#3F433F] rounded-xl border border-[#4A4E4A]">
                <span className="text-[10px] uppercase font-mono text-purple-300 font-bold block mb-1">VOICE FALLBACK</span>
                <p className="text-xs font-bold text-white">Interactive Call</p>
                <p className="text-[11px] text-[#A8A59E] mt-0.5">Press 1 to Confirm</p>
              </div>

              <div className="p-3.5 bg-[#3F433F] rounded-xl border border-[#4A4E4A]">
                <span className="text-[10px] uppercase font-mono text-[#8A9A5B] font-bold block mb-1">REAL-TIME REPORT</span>
                <p className="text-xs font-bold text-white">Delivery Logged</p>
                <p className="text-[11px] text-[#A8A59E] mt-0.5">99.4% Delivery Success</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={openRegister}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#8A9A5B] hover:bg-[#78884B] text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={openLogin}
            className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-[#F2F0EB] text-[#2D302D] border border-[#E5E2DA] rounded-2xl font-bold text-sm shadow-xs transition-colors"
          >
            Sign In to Account
          </button>
        </div>
        <p className="text-xs text-[#8A857C] mt-3">No credit card required • Instant gateway setup • Cancel anytime</p>
      </section>

      {/* Social Proof */}
      <section className="bg-[#F2F0EB] py-8 border-y border-[#E5E2DA]">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-[#8A857C] mb-4">
            Trusted by 500+ Schools, Clinics, Salons & SMEs
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-[#8A857C]">
            <div className="flex items-center gap-2 font-bold text-[#2D302D]">
              <School className="w-5 h-5 text-[#8A9A5B]" />
              <span>Apex Academy</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-[#2D302D]">
              <Activity className="w-5 h-5 text-[#8A9A5B]" />
              <span>Metro Health Clinic</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-[#2D302D]">
              <Scissors className="w-5 h-5 text-[#8A9A5B]" />
              <span>Luxe Hair & Spa</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-[#2D302D]">
              <Dumbbell className="w-5 h-5 text-[#8A9A5B]" />
              <span>FitPulse Gyms</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-[#2D302D]">
              <Home className="w-5 h-5 text-[#8A9A5B]" />
              <span>Prime Properties</span>
            </div>
          </div>
        </div>
      </section>

      {/* Omnichannel Features Section */}
      <section id="features" className="py-20 px-4 lg:px-8 max-w-6xl mx-auto scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#8A9A5B] mb-2">Omnichannel Automation</h2>
          <h3 className="text-3xl font-extrabold text-[#2D302D] tracking-tight">
            Four Power Channels in One Unified Suite
          </h3>
          <p className="text-[#8A857C] text-sm mt-3">
            Reach your customers on their preferred device with instant rule-based scheduling and delivery reports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-3xl border border-[#E5E2DA] shadow-xs hover:border-[#8A9A5B] transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#F2F0EB] text-[#8A9A5B] flex items-center justify-center font-bold mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#2D302D] mb-2">SMS Campaigns</h4>
              <p className="text-xs text-[#8A857C] leading-relaxed">
                High-deliverability text messaging for urgent alerts, fee reminders, and event notices.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F2F0EB] flex items-center justify-between text-xs font-bold text-[#8A9A5B]">
              <span>Dynamic Tags: &#123;&#123;name&#125;&#125;</span>
              <CheckCircle className="w-4 h-4 text-[#8A9A5B]" />
            </div>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-[#E5E2DA] shadow-xs hover:border-[#8A9A5B] transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#F2F0EB] text-[#8A9A5B] flex items-center justify-center font-bold mb-4">
                <Send className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#2D302D] mb-2">WhatsApp Business</h4>
              <p className="text-xs text-[#8A857C] leading-relaxed">
                Send rich media notices, appointment links, and order updates with interactive button replies.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F2F0EB] flex items-center justify-between text-xs font-bold text-[#8A9A5B]">
              <span>Read Receipts Logged</span>
              <CheckCircle className="w-4 h-4 text-[#8A9A5B]" />
            </div>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-[#E5E2DA] shadow-xs hover:border-[#8A9A5B] transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#F2F0EB] text-[#2D302D] flex items-center justify-center font-bold mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#2D302D] mb-2">Email Broadcasts</h4>
              <p className="text-xs text-[#8A857C] leading-relaxed">
                Send diagnostic lab reports, newsletters, invoices, and HTML bulletins with high open rates.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F2F0EB] flex items-center justify-between text-xs font-bold text-[#2D302D]">
              <span>SMTP Integration</span>
              <CheckCircle className="w-4 h-4 text-[#8A9A5B]" />
            </div>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-[#E5E2DA] shadow-xs hover:border-[#8A9A5B] transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#F2F0EB] text-[#8A9A5B] flex items-center justify-center font-bold mb-4">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#2D302D] mb-2">Voice Call Audio</h4>
              <p className="text-xs text-[#8A857C] leading-relaxed">
                Schedule pre-recorded voice audio call broadcasts for emergency notices and payment follow-ups.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F2F0EB] flex items-center justify-between text-xs font-bold text-[#8A9A5B]">
              <span>Auto-Retry Failed Calls</span>
              <CheckCircle className="w-4 h-4 text-[#8A9A5B]" />
            </div>
          </div>
        </div>
      </section>

      {/* Solutions by Industry */}
      <section id="solutions" className="py-20 px-4 lg:px-8 bg-[#2D302D] text-white scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#8A9A5B] mb-2">Tailored for Your Industry</h2>
            <h3 className="text-3xl font-extrabold tracking-tight">Built for Real Business Needs</h3>
            <p className="text-[#A8A59E] text-sm mt-3">
              Eliminate manual phone calls and staff follow-ups with automated triggers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((ind, i) => {
              const Icon = ind.icon;
              return (
                <div key={i} className="p-6 bg-[#3F433F] rounded-3xl border border-[#4A4E4A] hover:border-[#8A9A5B] transition-colors">
                  <div className="w-10 h-10 rounded-2xl bg-[#8A9A5B]/20 text-[#8A9A5B] flex items-center justify-center font-bold mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">{ind.name}</h4>
                  <p className="text-xs text-[#A8A59E] leading-relaxed">{ind.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 lg:px-8 max-w-6xl mx-auto scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#8A9A5B] mb-2">Transparent Pricing</h2>
          <h3 className="text-3xl font-extrabold text-[#2D302D] tracking-tight">
            Simple Plans for Businesses of Any Scale
          </h3>
          <p className="text-[#8A857C] text-sm mt-3">
            Includes gateway connection, campaign scheduler, rule automations, and reporting.
          </p>

          {/* Billing Toggle */}
          <div className="mt-6 inline-flex items-center gap-3 p-1.5 bg-[#F2F0EB] rounded-2xl text-xs font-bold border border-[#E5E2DA]">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-xl transition-all ${billingCycle === 'monthly' ? 'bg-white text-[#2D302D] shadow-xs' : 'text-[#8A857C]'}`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'bg-white text-[#8A9A5B] shadow-xs' : 'text-[#8A857C]'}`}
            >
              <span>Yearly (Save 20%)</span>
              <span className="px-1.5 py-0.5 bg-[#8A9A5B]/20 text-[#78884B] text-[10px] rounded font-extrabold">2 Months Free</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <div className="p-6 bg-white rounded-3xl border border-[#E5E2DA] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-[#8A857C]">Basic Plan</span>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#2D302D]">${billingCycle === 'monthly' ? '29' : '24'}</span>
                <span className="text-xs text-[#8A857C] font-semibold">/ month</span>
              </div>
              <p className="text-xs text-[#8A857C] mt-2">Perfect for single branch clinics, salons, or small businesses.</p>
              
              <ul className="mt-6 space-y-3 text-xs text-[#2D302D] font-medium border-t border-[#F2F0EB] pt-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#8A9A5B]" /> Up to 2,000 Contacts</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#8A9A5B]" /> 5,000 SMS Credits</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#8A9A5B]" /> 2,500 WhatsApp Messages</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#8A9A5B]" /> 300 Voice Call Minutes</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#8A9A5B]" /> Standard Campaign Scheduler</li>
              </ul>
            </div>

            <button
              onClick={openRegister}
              className="mt-8 w-full py-3 bg-[#F2F0EB] hover:bg-[#E5E2DA] text-[#2D302D] rounded-xl font-bold text-xs transition-colors"
            >
              Get Started with Basic
            </button>
          </div>

          {/* Pro Plan (Featured) */}
          <div className="p-6 bg-white rounded-3xl border-2 border-[#8A9A5B] shadow-xl flex flex-col justify-between relative">
            <span className="absolute -top-3.5 right-6 px-3 py-1 bg-[#8A9A5B] text-white rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
              Most Popular
            </span>
            <div>
              <span className="text-xs font-bold uppercase text-[#8A9A5B]">Professional Plan</span>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#2D302D]">${billingCycle === 'monthly' ? '99' : '79'}</span>
                <span className="text-xs text-[#8A857C] font-semibold">/ month</span>
              </div>
              <p className="text-xs text-[#8A857C] mt-2">For growing schools, hospitals, real estate agencies, & SMEs.</p>
              
              <ul className="mt-6 space-y-3 text-xs text-[#2D302D] font-medium border-t border-[#F2F0EB] pt-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#8A9A5B]" /> <strong>Unlimited Contacts & Groups</strong></li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#8A9A5B]" /> 25,000 SMS Credits</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#8A9A5B]" /> 15,000 WhatsApp Credits</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#8A9A5B]" /> 2,000 Voice Call Minutes</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#8A9A5B]" /> <strong>Rule-Based Automation Engine</strong></li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#8A9A5B]" /> Custom Voice Audio Uploads</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#8A9A5B]" /> Up to 10 Staff User Accounts</li>
              </ul>
            </div>

            <button
              onClick={openRegister}
              className="mt-8 w-full py-3 bg-[#8A9A5B] hover:bg-[#78884B] text-white rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              Start 14-Day Free Trial
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="p-6 bg-white rounded-3xl border border-[#E5E2DA] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-[#8A857C]">Enterprise Plan</span>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#2D302D]">${billingCycle === 'monthly' ? '249' : '199'}</span>
                <span className="text-xs text-[#8A857C] font-semibold">/ month</span>
              </div>
              <p className="text-xs text-[#8A857C] mt-2">For multi-branch institutions, universities, and high-volume operations.</p>
              
              <ul className="mt-6 space-y-3 text-xs text-[#2D302D] font-medium border-t border-[#F2F0EB] pt-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#8A9A5B]" /> 100,000+ SMS Credits</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#8A9A5B]" /> 75,000 WhatsApp Credits</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#8A9A5B]" /> 10,000 Voice Minutes</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#8A9A5B]" /> Dedicated Gateway & Custom Sender ID</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#8A9A5B]" /> Unlimited Staff Accounts</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#8A9A5B]" /> 24/7 Priority SLA Support</li>
              </ul>
            </div>

            <button
              onClick={openRegister}
              className="mt-8 w-full py-3 bg-[#F2F0EB] hover:bg-[#E5E2DA] text-[#2D302D] rounded-xl font-bold text-xs transition-colors"
            >
              Contact Enterprise Sales
            </button>
          </div>
        </div>
      </section>

      {/* About Us & Footer */}
      <footer id="about" className="bg-[#2D302D] text-[#A8A59E] py-16 border-t border-[#3F433F] text-xs scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-extrabold text-base mb-3">
              <Layers className="w-5 h-5 text-[#8A9A5B]" />
              <span>ConnectFlow</span>
            </div>
            <p className="text-[#A8A59E] leading-relaxed">
              Automated business communication SaaS platform for scheduled SMS, WhatsApp, Email, and Voice Call campaigns.
            </p>
          </div>

          <div>
            <h5 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Product Features</h5>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-white transition-colors">Campaign Scheduler</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Voice Audio Manager</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Rule Automation Engine</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Delivery Analytics & Reports</a></li>
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
            <p className="text-[#A8A59E] mb-2">Support: support@connectflow.io</p>
            <p className="text-[#A8A59E] mb-4">Phone: +1 (800) 555-FLOW</p>
            <button
              onClick={openLogin}
              className="px-4 py-2 bg-[#8A9A5B] hover:bg-[#78884B] text-white rounded-xl font-bold transition-colors"
            >
              Sign In to Account
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 border-t border-[#3F433F] mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#A8A59E]">
          <p>© 2026 ConnectFlow SaaS Inc. All rights reserved.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Security & SLA</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
