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

export const INITIAL_CONTACT_GROUPS: ContactGroup[] = [];

export const INITIAL_CONTACTS: Contact[] = [];

export const INITIAL_TEMPLATES: MessageTemplate[] = [];

export const INITIAL_VOICE_RECORDINGS: VoiceRecording[] = [];

export const INITIAL_CAMPAIGNS: Campaign[] = [];

export const INITIAL_MESSAGE_LOGS: MessageLog[] = [];

export const INITIAL_VOICE_LOGS: VoiceCallLog[] = [];

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
