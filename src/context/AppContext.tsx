import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  User, 
  Business, 
  Contact, 
  ContactGroup, 
  MessageTemplate, 
  VoiceRecording, 
  Campaign, 
  CampaignStatus,
  MessageLog, 
  VoiceCallLog, 
  AutomationRule, 
  NotificationItem, 
  PaymentInvoice, 
  ActivityLog, 
  GatewaySettings 
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_BUSINESS, 
  INITIAL_CONTACTS, 
  INITIAL_CONTACT_GROUPS, 
  INITIAL_TEMPLATES, 
  INITIAL_VOICE_RECORDINGS, 
  INITIAL_CAMPAIGNS, 
  INITIAL_MESSAGE_LOGS, 
  INITIAL_VOICE_LOGS, 
  INITIAL_AUTOMATION_RULES, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_INVOICES, 
  INITIAL_ACTIVITY_LOGS, 
  INITIAL_GATEWAY_SETTINGS 
} from '../data/initialData';

export type DashboardTab = 
  | 'overview' 
  | 'contacts' 
  | 'groups' 
  | 'templates' 
  | 'campaigns' 
  | 'voice_calls' 
  | 'messaging' 
  | 'automation' 
  | 'reports' 
  | 'subscription' 
  | 'settings' 
  | 'staff' 
  | 'superadmin';

interface AppContextType {
  // Navigation & Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  publicView: boolean;
  setPublicView: (isPublic: boolean) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'register' | 'forgot';
  setAuthMode: (mode: 'login' | 'register' | 'forgot') => void;

  // Data
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  business: Business;
  setBusiness: React.Dispatch<React.SetStateAction<Business>>;
  contacts: Contact[];
  groups: ContactGroup[];
  templates: MessageTemplate[];
  voiceRecordings: VoiceRecording[];
  campaigns: Campaign[];
  messageLogs: MessageLog[];
  voiceLogs: VoiceCallLog[];
  automationRules: AutomationRule[];
  notifications: NotificationItem[];
  users: User[];
  invoices: PaymentInvoice[];
  activityLogs: ActivityLog[];
  gatewaySettings: GatewaySettings;
  setGatewaySettings: React.Dispatch<React.SetStateAction<GatewaySettings>>;

  // Actions - Contacts
  addContact: (contact: Omit<Contact, 'id' | 'createdAt'>) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  importContacts: (newContacts: Omit<Contact, 'id' | 'createdAt'>[]) => void;

  // Actions - Groups
  addGroup: (group: Omit<ContactGroup, 'id' | 'createdAt'>) => void;
  updateGroup: (id: string, group: Partial<ContactGroup>) => void;
  deleteGroup: (id: string) => void;

  // Actions - Templates
  addTemplate: (template: Omit<MessageTemplate, 'id' | 'createdAt'>) => void;
  deleteTemplate: (id: string) => void;

  // Actions - Voice Recordings
  addVoiceRecording: (recording: Omit<VoiceRecording, 'id' | 'createdAt'>) => void;
  deleteVoiceRecording: (id: string) => void;

  // Actions - Campaigns
  addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'sentCount' | 'deliveredCount' | 'failedCount'>) => void;
  updateCampaignStatus: (id: string, status: CampaignStatus) => void;
  runCampaignSimulation: (id: string) => void;

  // Actions - Voice Calls
  retryVoiceCall: (callId: string) => void;

  // Actions - Automations
  toggleAutomationRule: (id: string) => void;
  addAutomationRule: (rule: Omit<AutomationRule, 'id' | 'createdAt' | 'executionCount'>) => void;
  deleteAutomationRule: (id: string) => void;
  triggerRuleSimulation: (ruleId: string) => void;

  // Actions - Staff
  addStaffUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  toggleUserStatus: (id: string) => void;

  // Actions - Notifications
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'read'>) => void;

  // Direct Message Composer Simulator
  sendDirectMessage: (recipientName: string, recipientPhoneOrEmail: string, channel: 'sms' | 'whatsapp' | 'email' | 'voice', content: string) => void;

  // Utility
  logActivity: (action: string, details: string) => void;
  exportToCSV: (filename: string, rows: Record<string, any>[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states with localStorage persistence if available
  const [currentRole, setCurrentRole] = useState<UserRole>('business_admin');
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [publicView, setPublicView] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('cf_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => users[0]);

  const [business, setBusiness] = useState<Business>(() => {
    const saved = localStorage.getItem('cf_business');
    return saved ? JSON.parse(saved) : INITIAL_BUSINESS;
  });

  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('cf_contacts');
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });

  const [groups, setGroups] = useState<ContactGroup[]>(() => {
    const saved = localStorage.getItem('cf_groups');
    return saved ? JSON.parse(saved) : INITIAL_CONTACT_GROUPS;
  });

  const [templates, setTemplates] = useState<MessageTemplate[]>(() => {
    const saved = localStorage.getItem('cf_templates');
    return saved ? JSON.parse(saved) : INITIAL_TEMPLATES;
  });

  const [voiceRecordings, setVoiceRecordings] = useState<VoiceRecording[]>(() => {
    const saved = localStorage.getItem('cf_voiceRecordings');
    return saved ? JSON.parse(saved) : INITIAL_VOICE_RECORDINGS;
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('cf_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [messageLogs, setMessageLogs] = useState<MessageLog[]>(() => {
    const saved = localStorage.getItem('cf_messageLogs');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGE_LOGS;
  });

  const [voiceLogs, setVoiceLogs] = useState<VoiceCallLog[]>(() => {
    const saved = localStorage.getItem('cf_voiceLogs');
    return saved ? JSON.parse(saved) : INITIAL_VOICE_LOGS;
  });

  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(() => {
    const saved = localStorage.getItem('cf_automationRules');
    return saved ? JSON.parse(saved) : INITIAL_AUTOMATION_RULES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('cf_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [invoices] = useState<PaymentInvoice[]>(INITIAL_INVOICES);
  
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('cf_activityLogs');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  const [gatewaySettings, setGatewaySettings] = useState<GatewaySettings>(() => {
    const saved = localStorage.getItem('cf_gatewaySettings');
    return saved ? JSON.parse(saved) : INITIAL_GATEWAY_SETTINGS;
  });

  // Keep local storage in sync
  useEffect(() => {
    localStorage.setItem('cf_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('cf_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('cf_templates', JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem('cf_voiceRecordings', JSON.stringify(voiceRecordings));
  }, [voiceRecordings]);

  useEffect(() => {
    localStorage.setItem('cf_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('cf_messageLogs', JSON.stringify(messageLogs));
  }, [messageLogs]);

  useEffect(() => {
    localStorage.setItem('cf_voiceLogs', JSON.stringify(voiceLogs));
  }, [voiceLogs]);

  useEffect(() => {
    localStorage.setItem('cf_automationRules', JSON.stringify(automationRules));
  }, [automationRules]);

  useEffect(() => {
    localStorage.setItem('cf_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('cf_activityLogs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem('cf_gatewaySettings', JSON.stringify(gatewaySettings));
  }, [gatewaySettings]);

  // Log activity helper
  const logActivity = (action: string, details: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      userName: currentUser.name,
      userRole: currentRole,
      action,
      details,
      timestamp: new Date().toLocaleString(),
      ip: '192.168.1.100',
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Add Notification helper
  const addNotification = (notif: Omit<NotificationItem, 'id' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Contact Actions
  const addContact = (contactData: Omit<Contact, 'id' | 'createdAt'>) => {
    const newContact: Contact = {
      ...contactData,
      id: `cnt-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setContacts(prev => [newContact, ...prev]);
    
    // Update group counts
    contactData.groupIds.forEach(gId => {
      setGroups(prevGroups => prevGroups.map(g => g.id === gId ? { ...g, contactCount: (g.contactCount || 0) + 1 } : g));
    });

    logActivity('Contact Added', `Added contact ${newContact.name} (${newContact.phone})`);
    addNotification({
      title: 'New Contact Added',
      message: `${newContact.name} was successfully added to your contact directory.`,
      type: 'info',
      timestamp: 'Just now',
      linkTab: 'contacts',
    });
  };

  const updateContact = (id: string, updatedData: Partial<Contact>) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
    logActivity('Contact Updated', `Updated details for contact ID: ${id}`);
  };

  const deleteContact = (id: string) => {
    const target = contacts.find(c => c.id === id);
    setContacts(prev => prev.filter(c => c.id !== id));
    if (target) {
      logActivity('Contact Deleted', `Deleted contact ${target.name}`);
    }
  };

  const importContacts = (newContactsData: Omit<Contact, 'id' | 'createdAt'>[]) => {
    const createdList: Contact[] = newContactsData.map((c, idx) => ({
      ...c,
      id: `cnt-${Date.now()}-${idx}`,
      createdAt: new Date().toISOString().split('T')[0],
    }));
    setContacts(prev => [...createdList, ...prev]);
    logActivity('CSV Contacts Imported', `Imported ${createdList.length} contacts from CSV.`);
    addNotification({
      title: 'CSV Import Completed',
      message: `Successfully imported ${createdList.length} contacts into your workspace.`,
      type: 'success',
      timestamp: 'Just now',
      linkTab: 'contacts',
    });
  };

  // Group Actions
  const addGroup = (groupData: Omit<ContactGroup, 'id' | 'createdAt'>) => {
    const newGroup: ContactGroup = {
      ...groupData,
      id: `group-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      contactCount: groupData.contactCount || 0,
    };
    setGroups(prev => [...prev, newGroup]);
    logActivity('Group Created', `Created audience group: ${newGroup.name}`);
  };

  const updateGroup = (id: string, groupData: Partial<ContactGroup>) => {
    setGroups(prev => prev.map(g => g.id === id ? { ...g, ...groupData } : g));
  };

  const deleteGroup = (id: string) => {
    setGroups(prev => prev.filter(g => g.id !== id));
    logActivity('Group Deleted', `Deleted contact group ID: ${id}`);
  };

  // Template Actions
  const addTemplate = (templateData: Omit<MessageTemplate, 'id' | 'createdAt'>) => {
    const newTpl: MessageTemplate = {
      ...templateData,
      id: `tpl-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTemplates(prev => [newTpl, ...prev]);
    logActivity('Template Created', `Created template: ${newTpl.name}`);
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  // Voice Recording Actions
  const addVoiceRecording = (recData: Omit<VoiceRecording, 'id' | 'createdAt'>) => {
    const newRec: VoiceRecording = {
      ...recData,
      id: `rec-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setVoiceRecordings(prev => [newRec, ...prev]);
    logActivity('Voice Recording Uploaded', `Uploaded recording: ${newRec.title}`);
  };

  const deleteVoiceRecording = (id: string) => {
    setVoiceRecordings(prev => prev.filter(r => r.id !== id));
  };

  // Campaign Actions
  const addCampaign = (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'sentCount' | 'deliveredCount' | 'failedCount'>) => {
    const newCampaign: Campaign = {
      ...campaignData,
      id: `cmp-${Date.now()}`,
      sentCount: 0,
      deliveredCount: 0,
      failedCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCampaigns(prev => [newCampaign, ...prev]);
    logActivity('Campaign Created', `Created ${newCampaign.channel.toUpperCase()} campaign "${newCampaign.name}" for group "${newCampaign.groupName}"`);
    addNotification({
      title: 'Campaign Scheduled',
      message: `Campaign "${newCampaign.name}" has been scheduled for ${newCampaign.scheduleDate} at ${newCampaign.scheduleTime}.`,
      type: 'info',
      timestamp: 'Just now',
      linkTab: 'campaigns',
    });
  };

  const updateCampaignStatus = (id: string, status: CampaignStatus) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    logActivity('Campaign Status Change', `Campaign ID ${id} set to ${status.toUpperCase()}`);
  };

  // Campaign Execution Simulator (Sends messages or calls, updates statistics dynamically!)
  const runCampaignSimulation = (id: string) => {
    const targetCmp = campaigns.find(c => c.id === id);
    if (!targetCmp) return;

    // Set campaign status to running
    updateCampaignStatus(id, 'running');

    // Filter contacts in this group
    const audience = targetCmp.groupId === 'all' 
      ? contacts 
      : contacts.filter(c => c.groupIds.includes(targetCmp.groupId));

    const recipientCount = audience.length > 0 ? audience.length : targetCmp.audienceCount;

    // Simulate batch execution
    setTimeout(() => {
      const delivered = Math.max(1, Math.floor(recipientCount * 0.94));
      const failed = recipientCount - delivered;

      setCampaigns(prev => prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            status: 'completed',
            sentCount: recipientCount,
            deliveredCount: delivered,
            failedCount: failed,
          };
        }
        return c;
      }));

      // Generate new logs
      const sampleLogs: MessageLog[] = (audience.length > 0 ? audience : contacts.slice(0, 5)).map((cnt, i) => ({
        id: `msg-${Date.now()}-${i}`,
        recipientName: cnt.name,
        recipientPhoneOrEmail: targetCmp.channel === 'email' ? cnt.email : cnt.phone,
        channel: targetCmp.channel,
        content: targetCmp.content.replace('{{name}}', cnt.name).replace('{{doctor}}', cnt.customFields.doctor || 'Our Specialist'),
        status: i % 15 === 0 ? 'failed' : 'delivered',
        timestamp: new Date().toLocaleString(),
        campaignName: targetCmp.name,
        errorReason: i % 15 === 0 ? 'Invalid Carrier Endpoint' : undefined,
      }));

      setMessageLogs(prev => [...sampleLogs, ...prev]);

      // Deduct credits
      setBusiness(prev => {
        if (targetCmp.channel === 'sms') return { ...prev, smsCredits: Math.max(0, prev.smsCredits - recipientCount) };
        if (targetCmp.channel === 'whatsapp') return { ...prev, whatsappCredits: Math.max(0, prev.whatsappCredits - recipientCount) };
        if (targetCmp.channel === 'email') return { ...prev, emailCredits: Math.max(0, prev.emailCredits - recipientCount) };
        if (targetCmp.channel === 'voice') return { ...prev, voiceMinutes: Math.max(0, prev.voiceMinutes - Math.ceil(recipientCount * 0.5)) };
        return prev;
      });

      addNotification({
        title: 'Campaign Completed',
        message: `Campaign "${targetCmp.name}" finished sending to ${recipientCount} recipients (${delivered} delivered, ${failed} failed).`,
        type: 'success',
        timestamp: 'Just now',
        linkTab: 'campaigns',
      });

      logActivity('Campaign Simulation Executed', `Finished campaign "${targetCmp.name}" with ${delivered} successful deliveries.`);
    }, 1500);
  };

  // Voice Call Retry
  const retryVoiceCall = (callId: string) => {
    setVoiceLogs(prev => prev.map(call => {
      if (call.id === callId) {
        return {
          ...call,
          status: 'completed',
          duration: '00:28',
          retryCount: call.retryCount + 1,
          timestamp: new Date().toLocaleString(),
        };
      }
      return call;
    }));
    logActivity('Voice Call Retried', `Retried call ID: ${callId} successfully.`);
    addNotification({
      title: 'Voice Call Retry Successful',
      message: `Retried call successfully connected and completed.`,
      type: 'success',
      timestamp: 'Just now',
      linkTab: 'voice_calls',
    });
  };

  // Automation Rules Actions
  const toggleAutomationRule = (id: string) => {
    setAutomationRules(prev => prev.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
    logActivity('Automation Rule Toggled', `Toggled rule ID ${id}`);
  };

  const addAutomationRule = (ruleData: Omit<AutomationRule, 'id' | 'createdAt' | 'executionCount'>) => {
    const newRule: AutomationRule = {
      ...ruleData,
      id: `rule-${Date.now()}`,
      executionCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAutomationRules(prev => [newRule, ...prev]);
    logActivity('Automation Rule Created', `Created rule: "${newRule.title}"`);
  };

  const deleteAutomationRule = (id: string) => {
    setAutomationRules(prev => prev.filter(r => r.id !== id));
  };

  const triggerRuleSimulation = (ruleId: string) => {
    const rule = automationRules.find(r => r.id === ruleId);
    if (!rule) return;

    setAutomationRules(prev => prev.map(r => r.id === ruleId ? { ...r, executionCount: r.executionCount + 1 } : r));

    const randomContact = contacts[Math.floor(Math.random() * contacts.length)] || contacts[0];

    const newLog: MessageLog = {
      id: `msg-auto-${Date.now()}`,
      recipientName: randomContact.name,
      recipientPhoneOrEmail: rule.channel === 'email' ? randomContact.email : randomContact.phone,
      channel: rule.channel,
      content: rule.templateContent.replace('{{name}}', randomContact.name),
      status: 'delivered',
      timestamp: new Date().toLocaleString(),
      campaignName: `Auto-Trigger: ${rule.title}`,
    };

    setMessageLogs(prev => [newLog, ...prev]);

    addNotification({
      title: 'Automation Rule Fired',
      message: `Rule "${rule.title}" triggered automated ${rule.channel.toUpperCase()} message to ${randomContact.name}.`,
      type: 'info',
      timestamp: 'Just now',
      linkTab: 'messaging',
    });

    logActivity('Automation Rule Fired', `Rule "${rule.title}" sent ${rule.channel} message to ${randomContact.name}`);
  };

  // Staff Actions
  const addStaffUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers(prev => [...prev, newUser]);
    logActivity('Staff Account Added', `Added team member ${newUser.name} (${newUser.email})`);
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  };

  // Direct Message Sending Simulator
  const sendDirectMessage = (recipientName: string, recipientPhoneOrEmail: string, channel: 'sms' | 'whatsapp' | 'email' | 'voice', content: string) => {
    const newMsg: MessageLog = {
      id: `msg-direct-${Date.now()}`,
      recipientName,
      recipientPhoneOrEmail,
      channel,
      content,
      status: 'delivered',
      timestamp: new Date().toLocaleString(),
      campaignName: 'Direct One-on-One Message',
    };
    setMessageLogs(prev => [newMsg, ...prev]);
    logActivity('Direct Message Sent', `Sent ${channel.toUpperCase()} to ${recipientName}`);
    addNotification({
      title: 'Message Sent',
      message: `${channel.toUpperCase()} message successfully delivered to ${recipientName}.`,
      type: 'success',
      timestamp: 'Just now',
      linkTab: 'messaging',
    });
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Export CSV Helper
  const exportToCSV = (filename: string, rows: Record<string, any>[]) => {
    if (!rows || !rows.length) return;
    const keys = Object.keys(rows[0]);
    const csvContent = [
      keys.join(','),
      ...rows.map(row => keys.map(k => `"${(row[k] ?? '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeTab,
        setActiveTab,
        publicView,
        setPublicView,
        authModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
        currentUser,
        setCurrentUser,
        business,
        setBusiness,
        contacts,
        groups,
        templates,
        voiceRecordings,
        campaigns,
        messageLogs,
        voiceLogs,
        automationRules,
        notifications,
        users,
        invoices,
        activityLogs,
        gatewaySettings,
        setGatewaySettings,
        addContact,
        updateContact,
        deleteContact,
        importContacts,
        addGroup,
        updateGroup,
        deleteGroup,
        addTemplate,
        deleteTemplate,
        addVoiceRecording,
        deleteVoiceRecording,
        addCampaign,
        updateCampaignStatus,
        runCampaignSimulation,
        retryVoiceCall,
        toggleAutomationRule,
        addAutomationRule,
        deleteAutomationRule,
        triggerRuleSimulation,
        addStaffUser,
        toggleUserStatus,
        markNotificationRead,
        clearAllNotifications,
        addNotification,
        sendDirectMessage,
        logActivity,
        exportToCSV,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
