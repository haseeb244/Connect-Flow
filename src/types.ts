/**
 * ConnectFlow - Type Definitions
 */

export type UserRole = 'super_admin' | 'business_admin' | 'staff';

export type IndustryType = 
  | 'School' 
  | 'College' 
  | 'Clinic/Hospital' 
  | 'Salon/Spa' 
  | 'Gym/Fitness' 
  | 'Real Estate' 
  | 'Courier/Logistics' 
  | 'E-Commerce' 
  | 'SME Service';

export type ChannelType = 'sms' | 'whatsapp' | 'email' | 'voice';

export type CampaignStatus = 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'failed' | 'stopped';

export type CallStatus = 'completed' | 'no_answer' | 'busy' | 'failed' | 'in_progress';

export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'read';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  businessId: string;
  businessName: string;
  avatar?: string;
  status: 'active' | 'inactive';
  phone?: string;
  createdAt: string;
}

export interface Business {
  id: string;
  name: string;
  industry: IndustryType;
  email: string;
  phone: string;
  timezone: string;
  address?: string;
  plan: 'free_trial' | 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'suspended';
  smsCredits: number;
  whatsappCredits: number;
  emailCredits: number;
  voiceMinutes: number;
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  groupIds: string[];
  tags: string[];
  customFields: Record<string, string>; // e.g. { feeDue: "$250", appointmentDate: "2026-08-01", orderNo: "ORD-9482" }
  status: 'active' | 'unsubscribed' | 'blacklisted';
  createdAt: string;
  lastContactedAt?: string;
}

export interface ContactGroup {
  id: string;
  name: string;
  description: string;
  color: string;
  contactCount?: number;
  createdAt: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  category: 'Fee Reminder' | 'Appointment' | 'Payment' | 'Promotional' | 'Event' | 'Alert';
  channel: ChannelType;
  subject?: string;
  content: string; // contains {{name}}, {{date}}, {{amount}}, {{service}}, etc.
  variables: string[];
  createdAt: string;
}

export interface VoiceRecording {
  id: string;
  title: string;
  durationSeconds: number;
  audioUrl?: string; // sample or synth audio
  fileSize: string;
  category: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  channel: ChannelType;
  groupId: string;
  groupName: string;
  audienceCount: number;
  templateId?: string;
  content: string;
  subject?: string;
  voiceRecordingId?: string;
  voiceRecordingTitle?: string;
  scheduleDate: string;
  scheduleTime: string;
  status: CampaignStatus;
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  createdAt: string;
}

export interface MessageLog {
  id: string;
  recipientName: string;
  recipientPhoneOrEmail: string;
  channel: ChannelType;
  content: string;
  status: MessageStatus;
  timestamp: string;
  campaignName?: string;
  errorReason?: string;
}

export interface VoiceCallLog {
  id: string;
  recipientName: string;
  phone: string;
  recordingTitle: string;
  duration: string;
  status: CallStatus;
  retryCount: number;
  timestamp: string;
  campaignName?: string;
}

export type AutomationTrigger = 
  | 'appointment_reminder'
  | 'fee_reminder'
  | 'payment_reminder'
  | 'membership_expiry'
  | 'birthday_wish'
  | 'anniversary_wish'
  | 'event_reminder'
  | 'order_confirmation'
  | 'order_delivered'
  | 'warranty_reminder';

export interface AutomationRule {
  id: string;
  title: string;
  triggerType: AutomationTrigger;
  channel: ChannelType;
  templateContent: string;
  offsetValue: number; // e.g., 1 day before, 2 hours after
  offsetUnit: 'hours' | 'days';
  isActive: boolean;
  executionCount: number;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
  linkTab?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  smsQuota: number;
  whatsappQuota: number;
  emailQuota: number;
  voiceMinutes: number;
  features: string[];
  isPopular?: boolean;
}

export interface PaymentInvoice {
  id: string;
  date: string;
  amount: number;
  planName: string;
  status: 'paid' | 'pending' | 'failed';
  downloadUrl?: string;
}

export interface ActivityLog {
  id: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  timestamp: string;
  ip: string;
}

export interface GatewaySettings {
  smsProvider: 'twilio' | 'infobip' | 'local_gateway';
  smsApiKey: string;
  whatsappConnected: boolean;
  whatsappNumber: string;
  smtpServer: string;
  smtpPort: number;
  smtpUser: string;
  voiceGatewayConnected: boolean;
  voiceCallerId: string;
}
