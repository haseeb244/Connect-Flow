import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Filter 
} from 'lucide-react';

export const ReportsTab: React.FC = () => {
  const { messageLogs, voiceLogs, exportToCSV } = useApp();
  const [timeRange, setTimeRange] = useState('30days');

  const smsDelivered = (messageLogs || []).filter(m => m.channel === 'sms' && m.status !== 'failed').length;
  const smsFailed = (messageLogs || []).filter(m => m.channel === 'sms' && m.status === 'failed').length;
  const waDelivered = (messageLogs || []).filter(m => m.channel === 'whatsapp' && m.status !== 'failed').length;
  const waFailed = (messageLogs || []).filter(m => m.channel === 'whatsapp' && m.status === 'failed').length;
  const emailDelivered = (messageLogs || []).filter(m => m.channel === 'email' && m.status !== 'failed').length;
  const emailFailed = (messageLogs || []).filter(m => m.channel === 'email' && m.status === 'failed').length;
  const voiceCompleted = (voiceLogs || []).filter(v => v.status === 'completed').length;
  const voiceFailed = (voiceLogs || []).filter(v => v.status === 'failed' || v.status === 'no_answer' || v.status === 'busy').length;

  const totalDelivered = smsDelivered + waDelivered + emailDelivered + voiceCompleted;
  const totalFailed = smsFailed + waFailed + emailFailed + voiceFailed;
  const totalAttempted = totalDelivered + totalFailed;
  const overallSuccessRate = totalAttempted > 0 ? ((totalDelivered / totalAttempted) * 100).toFixed(1) : '100.0';

  const channelVolumeData = [
    { channel: 'SMS', delivered: smsDelivered, failed: smsFailed },
    { channel: 'WhatsApp', delivered: waDelivered, failed: waFailed },
    { channel: 'Email', delivered: emailDelivered, failed: emailFailed },
    { channel: 'Voice Call', delivered: voiceCompleted, failed: voiceFailed },
  ];

  const pieData = [
    { name: 'Delivered', value: totalDelivered, color: '#8A9A5B' },
    { name: 'Read / Engaged', value: (messageLogs || []).filter(m => m.status === 'read').length, color: '#2D302D' },
    { name: 'Failed / Bounced', value: totalFailed, color: '#ba1a1a' },
  ];

  const handleExportPDF = () => {
    alert('Simulated Report PDF Generated & Saved: ConnectFlow_Analytics_Q3.pdf');
  };

  const handleExportExcel = () => {
    const reportRows = channelVolumeData.map(c => ({
      Channel: c.channel,
      Delivered: c.delivered,
      Failed: c.failed,
      SuccessRate: `${((c.delivered / (c.delivered + c.failed)) * 100).toFixed(1)}%`
    }));
    exportToCSV('ConnectFlow_Delivery_Report', reportRows);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Delivery Analytics & Audit Reports</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Detailed breakdown of delivery success rates, carrier latency, and exportable audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none shadow-2xs"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="ytd">Year to Date</option>
          </select>

          <button
            onClick={handleExportPDF}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Overall Success Rate</span>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">{overallSuccessRate}%</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Live delivery status</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Average Gateway Latency</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">1.2 Seconds</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Optimal delivery speed</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Auto-Retry Success</span>
          <p className="text-2xl font-extrabold text-indigo-700 mt-1">84.5%</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Recovered failed calls & SMS</p>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Volume Comparison */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Volume by Channel Gateway</h3>
          <p className="text-xs text-slate-500 mb-4">Delivered vs Failed dispatch counts</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelVolumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="channel" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="delivered" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="failed" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engagement Pie Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Delivery & Engagement Breakdown</h3>
          <p className="text-xs text-slate-500 mb-4">Ratio of reads, deliveries, and bounce rates</p>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-4 text-xs font-semibold text-slate-700 mt-2">
            {pieData.map((p, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }}></span>
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
