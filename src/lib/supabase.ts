import { createClient } from '@supabase/supabase-js';

const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-supabase-project')
);

// Create Supabase client instance (or null fallback)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const COMPLETE_SQL_SCHEMA = `-- ConnectFlow Complete PostgreSQL / Supabase Schema Definition
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT DEFAULT 'business_admin',
    "businessId" TEXT,
    "businessName" TEXT,
    avatar TEXT,
    status TEXT DEFAULT 'active',
    phone TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.businesses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    industry TEXT DEFAULT 'SME Service',
    email TEXT,
    phone TEXT,
    timezone TEXT DEFAULT 'UTC',
    address TEXT,
    plan TEXT DEFAULT 'free_trial',
    status TEXT DEFAULT 'active',
    "smsCredits" INT DEFAULT 10000,
    "whatsappCredits" INT DEFAULT 5000,
    "emailCredits" INT DEFAULT 25000,
    "voiceMinutes" INT DEFAULT 1000,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contacts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    "groupIds" TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    "customFields" JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'active',
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "lastContactedAt" TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.contact_groups (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#8A9A5B',
    "contactCount" INT DEFAULT 0,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'Fee Reminder',
    channel TEXT DEFAULT 'sms',
    subject TEXT,
    content TEXT NOT NULL,
    variables TEXT[] DEFAULT '{}',
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.voice_recordings (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    "durationSeconds" INT DEFAULT 0,
    "audioUrl" TEXT,
    "fileSize" TEXT DEFAULT '1.2 MB',
    category TEXT DEFAULT 'Announcement',
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.campaigns (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    channel TEXT NOT NULL,
    "groupId" TEXT,
    "groupName" TEXT,
    "audienceCount" INT DEFAULT 0,
    "templateId" TEXT,
    content TEXT NOT NULL,
    subject TEXT,
    "voiceRecordingId" TEXT,
    "voiceRecordingTitle" TEXT,
    "scheduleDate" TEXT,
    "scheduleTime" TEXT,
    status TEXT DEFAULT 'draft',
    "totalRecipients" INT DEFAULT 0,
    "sentCount" INT DEFAULT 0,
    "deliveredCount" INT DEFAULT 0,
    "failedCount" INT DEFAULT 0,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.message_logs (
    id TEXT PRIMARY KEY,
    "recipientName" TEXT,
    "recipientPhoneOrEmail" TEXT,
    channel TEXT NOT NULL,
    content TEXT,
    status TEXT DEFAULT 'sent',
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    "campaignName" TEXT,
    "errorReason" TEXT
);

CREATE TABLE IF NOT EXISTS public.voice_logs (
    id TEXT PRIMARY KEY,
    "recipientName" TEXT,
    phone TEXT,
    "recordingTitle" TEXT,
    duration TEXT DEFAULT '00:00',
    status TEXT DEFAULT 'completed',
    "retryCount" INT DEFAULT 0,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    "campaignName" TEXT
);

CREATE TABLE IF NOT EXISTS public.automation_rules (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    "triggerType" TEXT NOT NULL,
    channel TEXT NOT NULL,
    "templateContent" TEXT NOT NULL,
    "offsetValue" INT DEFAULT 1,
    "offsetUnit" TEXT DEFAULT 'days',
    "isActive" BOOLEAN DEFAULT true,
    "executionCount" INT DEFAULT 0,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    message TEXT,
    type TEXT DEFAULT 'info',
    read BOOLEAN DEFAULT false,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    "linkTab" TEXT
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
    id TEXT PRIMARY KEY,
    "userName" TEXT,
    "userRole" TEXT,
    action TEXT NOT NULL,
    details TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    ip TEXT
);

CREATE TABLE IF NOT EXISTS public.gateway_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    "smsProvider" TEXT DEFAULT 'twilio',
    "smsApiKey" TEXT,
    "whatsappConnected" BOOLEAN DEFAULT false,
    "whatsappNumber" TEXT,
    "smtpServer" TEXT,
    "smtpPort" INT DEFAULT 587,
    "smtpUser" TEXT,
    "voiceGatewayConnected" BOOLEAN DEFAULT false,
    "voiceCallerId" TEXT
);

-- RLS & Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gateway_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon businesses" ON public.businesses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon contacts" ON public.contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon contact_groups" ON public.contact_groups FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon templates" ON public.templates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon voice_recordings" ON public.voice_recordings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon campaigns" ON public.campaigns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon message_logs" ON public.message_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon voice_logs" ON public.voice_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon automation_rules" ON public.automation_rules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon activity_logs" ON public.activity_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon gateway_settings" ON public.gateway_settings FOR ALL USING (true) WITH CHECK (true);
`;

export interface SupabaseTestResult {
  configured: boolean;
  connected: boolean;
  url: string;
  latencyMs?: number;
  message: string;
  tablesStatus?: { name: string; exists: boolean; count?: number }[];
}

export async function testSupabaseConnection(): Promise<SupabaseTestResult> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      configured: false,
      connected: false,
      url: supabaseUrl || 'Not configured in environment variables',
      message: 'Supabase credentials (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are missing or set to defaults.'
    };
  }

  const startTime = Date.now();
  try {
    const tablesToCheck = [
      'users', 
      'businesses', 
      'contacts', 
      'contact_groups', 
      'templates', 
      'voice_recordings', 
      'campaigns', 
      'message_logs', 
      'voice_logs', 
      'automation_rules',
      'notifications',
      'activity_logs',
      'gateway_settings'
    ];
    const tablesStatus: { name: string; exists: boolean; count?: number }[] = [];

    for (const table of tablesToCheck) {
      const { data, error } = await supabase.from(table).select('id', { count: 'exact', head: true });
      if (!error) {
        tablesStatus.push({ name: table, exists: true, count: data ? data.length : 0 });
      } else {
        tablesStatus.push({ name: table, exists: false });
      }
    }

    const latencyMs = Date.now() - startTime;
    return {
      configured: true,
      connected: true,
      url: supabaseUrl,
      latencyMs,
      message: `Successfully connected to Supabase PostgreSQL database in ${latencyMs}ms!`,
      tablesStatus
    };
  } catch (err: any) {
    return {
      configured: true,
      connected: false,
      url: supabaseUrl,
      message: err?.message || 'Failed to reach Supabase API host.'
    };
  }
}
