import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { LandingPage } from './components/public/LandingPage';
import { AuthModal } from './components/public/AuthModal';

import { OverviewTab } from './components/dashboard/OverviewTab';
import { ContactsTab } from './components/dashboard/ContactsTab';
import { CampaignsTab } from './components/dashboard/CampaignsTab';
import { CampaignWizardModal } from './components/dashboard/CampaignWizardModal';
import { VoiceCallsTab } from './components/dashboard/VoiceCallsTab';
import { MessagingTab } from './components/dashboard/MessagingTab';
import { TemplatesTab } from './components/dashboard/TemplatesTab';
import { AutomationTab } from './components/dashboard/AutomationTab';
import { ReportsTab } from './components/dashboard/ReportsTab';
import { SubscriptionTab } from './components/dashboard/SubscriptionTab';
import { SettingsTab } from './components/dashboard/SettingsTab';
import { StaffTab } from './components/dashboard/StaffTab';
import { SuperAdminTab } from './components/dashboard/SuperAdminTab';

import { Bell, Zap, X } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { 
    publicView, 
    activeTab, 
    activeNotificationToast, 
    dismissToast,
    authModalOpen,
    setAuthModalOpen
  } = useApp();

  const [campaignWizardOpen, setCampaignWizardOpen] = useState(false);

  if (publicView) {
    return (
      <div className="min-h-screen bg-[#2D302D] text-[#EBE9E4] font-sans selection:bg-[#8A9A5B] selection:text-white">
        <LandingPage onOpenAuth={(mode) => setAuthModalOpen(true)} />
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab onOpenCampaignWizard={() => setCampaignWizardOpen(true)} />;
      case 'contacts':
        return <ContactsTab />;
      case 'campaigns':
        return <CampaignsTab onOpenCampaignWizard={() => setCampaignWizardOpen(true)} />;
      case 'voice':
        return <VoiceCallsTab />;
      case 'messaging':
        return <MessagingTab />;
      case 'templates':
        return <TemplatesTab />;
      case 'automation':
        return <AutomationTab />;
      case 'reports':
        return <ReportsTab />;
      case 'subscription':
        return <SubscriptionTab />;
      case 'settings':
        return <SettingsTab />;
      case 'staff':
        return <StaffTab />;
      case 'superadmin':
        return <SuperAdminTab />;
      default:
        return <OverviewTab onOpenCampaignWizard={() => setCampaignWizardOpen(true)} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F9F8F6] text-[#2D302D] font-sans overflow-hidden antialiased selection:bg-[#8A9A5B] selection:text-white">
      {/* Toast Alert Banner for Live Broadcast Simulations */}
      {activeNotificationToast && (
        <div className="fixed top-4 right-4 z-50 max-w-sm bg-[#2D302D] text-white p-4 rounded-xl shadow-2xl border border-[#8A9A5B]/50 flex items-start justify-between gap-3 animate-in slide-in-from-top-3 duration-200">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-[#8A9A5B] rounded-lg text-white mt-0.5">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#8A9A5B] uppercase tracking-wider">Simulation Fired</p>
              <p className="text-xs font-medium text-slate-100 mt-0.5">{activeNotificationToast}</p>
            </div>
          </div>
          <button 
            onClick={dismissToast}
            className="text-slate-400 hover:text-white p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Desktop Sidebar (Flush Left Edge) */}
      <Sidebar />

      {/* Main App Workspace Panel */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <Header 
          onOpenNotifications={() => {}} 
          onOpenCampaignWizard={() => setCampaignWizardOpen(true)} 
        />

        {/* Dashboard Active View Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          {renderActiveTab()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />

      {/* Notification Drawer */}
      <NotificationDrawer />

      {/* Campaign Multi-step Wizard Modal */}
      <CampaignWizardModal 
        isOpen={campaignWizardOpen} 
        onClose={() => setCampaignWizardOpen(false)} 
      />

      {/* Onboarding Auth Modal */}
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
