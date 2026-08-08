import { 
  User, 
  Business, 
  Contact, 
  ContactGroup, 
  MessageTemplate, 
  VoiceRecording, 
  Campaign, 
  MessageLog, 
  VoiceCallLog, 
  AutomationRule, 
  AutomatedVoiceRule,
  NotificationItem, 
  SubscriptionPlan, 
  PaymentInvoice, 
  ActivityLog, 
  GatewaySettings 
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Abdul Haseeb',
    email: 'haseeb2408f@aptechsite.net',
    role: 'business_admin',
    businessId: 'biz-1',
    businessName: 'My Business Workspace',
    avatar: '',
    status: 'active',
    phone: '',
    createdAt: new Date().toISOString().split('T')[0],
  }
];

export const INITIAL_BUSINESS: Business = {
  id: 'biz-1',
  name: 'My Business Workspace',
  industry: 'SME Service',
  email: 'admin@connectflow.io',
  phone: '',
  timezone: 'UTC',
  address: '',
  plan: 'pro',
  status: 'active',
  smsCredits: 10000,
  whatsappCredits: 5000,
  emailCredits: 25000,
  voiceMinutes: 1000,
  contactCount: 24,
  createdAt: new Date().toISOString().split('T')[0],
};

export const INITIAL_ALL_BUSINESSES: Business[] = [
  INITIAL_BUSINESS,
  {
    id: 'biz-2',
    name: 'Apex Healthcare Clinics',
    industry: 'Clinic/Hospital',
    email: 'contact@apexhealth.org',
    phone: '+1 555-0192',
    timezone: 'US/Eastern',
    address: 'New York, NY',
    plan: 'Enterprise',
    status: 'active',
    smsCredits: 50000,
    whatsappCredits: 30000,
    emailCredits: 100000,
    voiceMinutes: 10000,
    contactCount: 14200,
    createdAt: '2025-11-12',
  },
  {
    id: 'biz-3',
    name: 'Urban Luxe Real Estate',
    industry: 'Real Estate',
    email: 'sales@urbanluxe.com',
    phone: '+1 555-0188',
    timezone: 'US/Pacific',
    address: 'Los Angeles, CA',
    plan: 'Pro Growth',
    status: 'active',
    smsCredits: 20000,
    whatsappCredits: 15000,
    emailCredits: 40000,
    voiceMinutes: 2500,
    contactCount: 4850,
    createdAt: '2026-01-08',
  },
  {
    id: 'biz-4',
    name: 'Global Tech Academy',
    industry: 'College',
    email: 'info@gtacademy.edu',
    phone: '+1 555-0143',
    timezone: 'UTC',
    address: 'Austin, TX',
    plan: 'Starter',
    status: 'active',
    smsCredits: 5000,
    whatsappCredits: 2000,
    emailCredits: 10000,
    voiceMinutes: 500,
    contactCount: 1200,
    createdAt: '2026-03-20',
  },
];

export const INITIAL_CONTACT_GROUPS: ContactGroup[] = [
  {
    id: 'group-1',
    name: 'VIP Clients',
    description: 'High priority customer list',
    color: '#8A9A5B',
    contactCount: 4,
    createdAt: '2026-07-01'
  },
  {
    id: 'group-2',
    name: 'Service Contacts',
    description: 'General inquiry and support list',
    color: '#3b82f6',
    contactCount: 2,
    createdAt: '2026-07-02'
  }
];

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'cnt-03460895203',
    name: 'Haseeb Client',
    phone: '03460895203',
    email: 'haseeb.client@example.com',
    groupIds: ['group-1'],
    tags: ['VIP', 'Active'],
    customFields: { feeDue: '$150', appointmentDate: '2026-08-05' },
    status: 'active',
    createdAt: '2026-07-15'
  },
  {
    id: 'cnt-03140368729',
    name: 'Tech Client',
    phone: '03140368729',
    email: 'tech.client@example.com',
    groupIds: ['group-1'],
    tags: ['Verified'],
    customFields: { feeDue: '$200', appointmentDate: '2026-08-06' },
    status: 'active',
    createdAt: '2026-07-16'
  },
  {
    id: 'cnt-03332027154',
    name: 'VIP Member',
    phone: '03332027154',
    email: 'vip.member@example.com',
    groupIds: ['group-1'],
    tags: ['Premium'],
    customFields: { feeDue: '$350', appointmentDate: '2026-08-07' },
    status: 'active',
    createdAt: '2026-07-17'
  },
  {
    id: 'cnt-03310003089',
    name: 'Service Client',
    phone: '03310003089',
    email: 'service.client@example.com',
    groupIds: ['group-2'],
    tags: ['Support'],
    customFields: { feeDue: '$0', appointmentDate: '2026-08-08' },
    status: 'active',
    createdAt: '2026-07-18'
  }
];

export const INITIAL_TEMPLATES: MessageTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Fee Payment Due Reminder (SMS)',
    channel: 'sms',
    category: 'Payment',
    content: 'Dear {{name}}, your fee balance of {{feeDue}} is due on {{appointmentDate}}. Please pay via https://pay.connectflow.io/due or reply 1 for callback.',
    variables: ['name', 'feeDue', 'appointmentDate'],
    createdAt: '2026-07-20'
  },
  {
    id: 'tpl-2',
    name: 'WhatsApp Fee Payment Due Alert',
    channel: 'whatsapp',
    category: 'Payment',
    content: 'Hello {{name}}! 💳 Your fee amount of {{feeDue}} is pending for {{appointmentDate}}. Click here to clear fees: https://pay.connectflow.io/due or reply YES to confirm payment.',
    variables: ['name', 'feeDue', 'appointmentDate'],
    createdAt: '2026-07-21'
  },
  {
    id: 'tpl-3',
    name: 'WhatsApp Appointment Confirmation',
    channel: 'whatsapp',
    category: 'Appointment',
    content: 'Hello {{name}}! 🏥 This is a reminder for your upcoming appointment on {{appointmentDate}}. Reply YES to confirm or NO to reschedule.',
    variables: ['name', 'appointmentDate'],
    createdAt: '2026-07-22'
  },
  {
    id: 'tpl-4',
    name: 'Email Special Client Offer & Update',
    channel: 'email',
    category: 'Promotional',
    subject: 'Exclusive VIP Business Update for {{name}}',
    content: 'Hi {{name}},\n\nThank you for choosing ConnectFlow. We have unlocked exclusive access to your account portal. Click below to view your current status:\n\nhttps://portal.connectflow.io/account\n\nBest regards,\nConnectFlow Team',
    variables: ['name'],
    createdAt: '2026-07-23'
  }
];

export const INITIAL_VOICE_RECORDINGS: VoiceRecording[] = [
  {
    id: 'rec-1',
    title: '24h Medical Appointment Confirmation IVR',
    category: 'Appointment Reminder',
    durationSeconds: 28,
    fileSize: '1.4 MB',
    aiPersona: 'Rachel (Warm Female AI)',
    isTts: true,
    scriptText: 'Hello {{name}}, this is ConnectFlow Health calling to confirm your appointment scheduled for {{date}}. Press 1 to confirm, Press 2 to speak with our front desk, or Press 3 to reschedule.',
    createdAt: '2026-07-28'
  },
  {
    id: 'rec-2',
    title: 'Monthly Fee Due & Overdue Collection Call',
    category: 'Fee Collection',
    durationSeconds: 35,
    fileSize: '1.8 MB',
    aiPersona: 'Marcus (Authoritative Male AI)',
    isTts: true,
    scriptText: 'Dear {{name}}, your account balance of {{amount}} is due. Please press 1 to receive an instant SMS payment link, or Press 2 to request a callback from accounts.',
    createdAt: '2026-07-25'
  },
  {
    id: 'rec-3',
    title: 'Urgent Campus Notice & Weather Alert',
    category: 'Emergency Broadcast',
    durationSeconds: 20,
    fileSize: '1.0 MB',
    aiPersona: 'Priya (Clear Bilingual AI)',
    isTts: false,
    scriptText: 'Important Notice: Campus operations will resume at 10:00 AM tomorrow. Please press 1 to acknowledge receipt of this broadcast.',
    createdAt: '2026-07-20'
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [];

export const INITIAL_MESSAGE_LOGS: MessageLog[] = [];

export const INITIAL_VOICE_LOGS: VoiceCallLog[] = [
  {
    id: 'vlog-101',
    recipientName: 'Dr. Sarah Connor',
    phone: '+1 (555) 234-8901',
    recordingTitle: '24h Medical Appointment Confirmation IVR',
    duration: '00:32',
    status: 'completed',
    dtmfPressed: '1 (Confirmed)',
    aiPersona: 'Rachel (Warm Female AI)',
    callType: 'automated_trigger',
    retryCount: 0,
    timestamp: '2026-07-31 09:15 AM',
    transcript: [
      { speaker: 'AI System', text: 'Hello Sarah, this is ConnectFlow Health calling to confirm your appointment.', time: '00:02' },
      { speaker: 'AI System', text: 'Press 1 to confirm your attendance or Press 2 to reschedule.', time: '00:08' },
      { speaker: 'Customer', text: '[DTMF Key 1 Pressed - Confirmed]', time: '00:15' },
      { speaker: 'AI System', text: 'Thank you! Your appointment has been locked in. See you soon.', time: '00:20' }
    ]
  },
  {
    id: 'vlog-102',
    recipientName: 'Michael Scott',
    phone: '+1 (555) 890-1234',
    recordingTitle: 'Monthly Fee Due & Overdue Collection Call',
    duration: '00:45',
    status: 'completed',
    dtmfPressed: '1 (SMS Link Sent)',
    aiPersona: 'Marcus (Authoritative Male AI)',
    callType: 'automated_trigger',
    retryCount: 0,
    timestamp: '2026-07-31 08:30 AM',
    transcript: [
      { speaker: 'AI System', text: 'Dear Michael, your monthly tuition fee of $250 is due today.', time: '00:03' },
      { speaker: 'AI System', text: 'Press 1 to receive a direct SMS payment link to your mobile phone.', time: '00:12' },
      { speaker: 'Customer', text: '[DTMF Key 1 Pressed]', time: '00:22' },
      { speaker: 'AI System', text: 'Payment link sent via SMS to +1 (555) 890-1234. Thank you.', time: '00:28' }
    ]
  },
  {
    id: 'vlog-103',
    recipientName: 'Jennifer Aniston',
    phone: '+1 (555) 345-6789',
    recordingTitle: '24h Medical Appointment Confirmation IVR',
    duration: '00:00',
    status: 'no_answer',
    dtmfPressed: 'None',
    aiPersona: 'Rachel (Warm Female AI)',
    callType: 'automated_trigger',
    retryCount: 1,
    timestamp: '2026-07-31 08:00 AM'
  },
  {
    id: 'vlog-104',
    recipientName: 'Robert Downey Jr.',
    phone: '+1 (555) 901-2345',
    recordingTitle: 'Urgent Campus Notice & Weather Alert',
    duration: '00:18',
    status: 'completed',
    dtmfPressed: '1 (Acknowledged)',
    aiPersona: 'Priya (Clear Bilingual AI)',
    callType: 'campaign',
    retryCount: 0,
    timestamp: '2026-07-30 04:15 PM'
  }
];

export const INITIAL_AUTOMATED_VOICE_RULES: AutomatedVoiceRule[] = [
  {
    id: 'vrule-1',
    name: 'Auto 24h Appointment Confirmation Call',
    triggerEvent: 'appointment_reminder',
    targetGroup: 'Upcoming Patients / Appointments',
    aiPersona: 'Rachel (Warm Female AI)',
    recordingTitle: '24h Medical Appointment Confirmation IVR',
    ttsScript: 'Hello {{name}}, this is ConnectFlow Health calling to confirm your appointment on {{date}}. Press 1 to confirm attendance or Press 2 to reschedule.',
    autoRetryCount: 3,
    retryIntervalMinutes: 15,
    isActive: true,
    totalCallsDispatched: 142,
    dtmfConfirmationRate: 88,
    createdAt: '2026-07-15'
  },
  {
    id: 'vrule-2',
    name: 'Fee Overdue Auto-Dialer & IVR Collector',
    triggerEvent: 'fee_reminder',
    targetGroup: 'Fee Pending Group',
    aiPersona: 'Marcus (Authoritative Male AI)',
    recordingTitle: 'Monthly Fee Due & Overdue Collection Call',
    ttsScript: 'Dear {{name}}, your account balance of {{amount}} is due. Press 1 to receive an instant payment link on SMS, or Press 2 to request a callback from accounts.',
    autoRetryCount: 2,
    retryIntervalMinutes: 30,
    isActive: true,
    totalCallsDispatched: 98,
    dtmfConfirmationRate: 74,
    createdAt: '2026-07-18'
  },
  {
    id: 'vrule-3',
    name: 'E-Commerce Delivery Confirmation Call',
    triggerEvent: 'order_delivery',
    targetGroup: 'Courier & Parcel Receivers',
    aiPersona: 'Priya (Clear Bilingual AI)',
    recordingTitle: 'Delivery Confirmation Call',
    ttsScript: 'Hello {{name}}, your order #{{orderNo}} is out for delivery today. Press 1 if you will be available to receive it, or Press 2 to leave with neighbor.',
    autoRetryCount: 2,
    retryIntervalMinutes: 20,
    isActive: false,
    totalCallsDispatched: 54,
    dtmfConfirmationRate: 91,
    createdAt: '2026-07-22'
  }
];

export const INITIAL_AUTOMATION_RULES: AutomationRule[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan-basic',
    name: 'Basic Plan',
    priceMonthly: 29,
    priceYearly: 290,
    smsQuota: 5000,
    whatsappQuota: 2500,
    emailQuota: 15000,
    voiceMinutes: 300,
    features: [
      'Single User Access',
      'Contact Management (Up to 2,000)',
      'Scheduled SMS & Email',
      'Basic Message Templates',
      'Standard Delivery Reports',
      'Email Support'
    ]
  },
  {
    id: 'plan-pro',
    name: 'Professional Plan',
    priceMonthly: 99,
    priceYearly: 990,
    smsQuota: 25000,
    whatsappQuota: 15000,
    emailQuota: 100000,
    voiceMinutes: 2000,
    isPopular: true,
    features: [
      'Up to 10 Staff Accounts',
      'Unlimited Contacts & Groups',
      'SMS, WhatsApp, Email & Voice Calls',
      'Rule-Based Automations & Reminders',
      'Custom Voice Call Audio Uploads',
      'CSV Batch Import & Export',
      'Advanced Analytics & PDF Reports',
      'Priority Support & Gateway API Config'
    ]
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise Plan',
    priceMonthly: 249,
    priceYearly: 2490,
    smsQuota: 100000,
    whatsappQuota: 75000,
    emailQuota: 500000,
    voiceMinutes: 10000,
    features: [
      'Unlimited Staff & Multi-Branch Support',
      'Dedicated Carrier Gateways & Custom Sender ID',
      'Highest Deliverability Speed Throttle',
      'Custom Rule Workflows & SLA Guarantee',
      'Dedicated Account Manager & 24/7 Phone Support',
      'Automated Database Sync & Webhooks'
    ]
  }
];

export const INITIAL_INVOICES: PaymentInvoice[] = [];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [];

export const INITIAL_GATEWAY_SETTINGS: GatewaySettings = {
  smsProvider: 'twilio',
  smsApiKey: '',
  whatsappConnected: false,
  whatsappNumber: '',
  smtpServer: '',
  smtpPort: 587,
  smtpUser: '',
  voiceGatewayConnected: false,
  voiceCallerId: '',
};
