import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChannelType } from '../../types';
import { 
  X, 
  Send, 
  MessageSquare, 
  Mail, 
  PhoneCall, 
  Users, 
  Edit3, 
  Calendar, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  FileText,
  Volume2
} from 'lucide-react';

interface CampaignWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CampaignWizardModal: React.FC<CampaignWizardModalProps> = ({ isOpen, onClose }) => {
  const { groups, templates, voiceRecordings, addCampaign, contacts } = useApp();

  const [step, setStep] = useState<number>(1);

  // Wizard Form State
  const [campaignName, setCampaignName] = useState('');
  const [channel, setChannel] = useState<ChannelType>('sms');
  const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id || 'all');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('');
  const [scheduleDate, setScheduleDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [scheduleTime, setScheduleTime] = useState('10:00');

  if (!isOpen) return null;

  const targetGroup = (groups || []).find(g => g.id === selectedGroupId);
  const targetAudienceCount = selectedGroupId === 'all' 
    ? (contacts || []).length 
    : (contacts || []).filter(c => (c.groupIds || []).includes(selectedGroupId)).length || targetGroup?.contactCount || 100;

  const handleSelectTemplate = (tplId: string) => {
    const tpl = templates.find(t => t.id === tplId);
    if (tpl) {
      setSelectedTemplateId(tpl.id);
      setContent(tpl.content);
      if (tpl.subject) setSubject(tpl.subject);
    }
  };

  const handleInsertVariable = (variableToken: string) => {
    setContent(prev => `${prev} {{${variableToken}}}`);
  };

  const handleSubmitCampaign = () => {
    if (!campaignName) {
      alert('Please enter a campaign name');
      return;
    }

    addCampaign({
      name: campaignName,
      channel,
      groupId: selectedGroupId,
      groupName: targetGroup ? targetGroup.name : 'All Contacts',
      audienceCount: targetAudienceCount,
      templateId: selectedTemplateId || undefined,
      content,
      subject: channel === 'email' ? subject : undefined,
      voiceRecordingId: channel === 'voice' ? selectedVoiceId : undefined,
      voiceRecordingTitle: channel === 'voice' ? voiceRecordings.find(v => v.id === selectedVoiceId)?.title : undefined,
      scheduleDate,
      scheduleTime,
      status: 'scheduled',
      totalRecipients: targetAudienceCount,
    });

    // Reset
    setStep(1);
    setCampaignName('');
    setContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg">
              <Send className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Campaign Creator Wizard</h3>
              <p className="text-[11px] text-slate-400">Step {step} of 4</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step Stepper Indicator Bar */}
        <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-600">
          <div className={`flex items-center gap-2 ${step === 1 ? 'text-indigo-600 font-extrabold' : ''}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>1</span>
            <span className="hidden sm:inline">Channel</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-300"></div>

          <div className={`flex items-center gap-2 ${step === 2 ? 'text-indigo-600 font-extrabold' : ''}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>2</span>
            <span className="hidden sm:inline">Audience</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-300"></div>

          <div className={`flex items-center gap-2 ${step === 3 ? 'text-indigo-600 font-extrabold' : ''}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>3</span>
            <span className="hidden sm:inline">Content</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-300"></div>

          <div className={`flex items-center gap-2 ${step === 4 ? 'text-indigo-600 font-extrabold' : ''}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step === 4 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>4</span>
            <span className="hidden sm:inline">Schedule</span>
          </div>
        </div>

        {/* Step Body Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-5">
          {/* STEP 1: CHANNEL */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={campaignName}
                  onChange={e => setCampaignName(e.target.value)}
                  placeholder="e.g. Q3 Outstanding Fee Due Reminder"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">Select Communication Channel</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setChannel('sms')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                      channel === 'sms' 
                        ? 'border-indigo-600 bg-indigo-50/60 text-indigo-700 shadow-xs' 
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <MessageSquare className="w-6 h-6" />
                    <span className="text-xs font-bold">SMS Text</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('whatsapp')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                      channel === 'whatsapp' 
                        ? 'border-emerald-600 bg-emerald-50/60 text-emerald-700 shadow-xs' 
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Send className="w-6 h-6" />
                    <span className="text-xs font-bold">WhatsApp Business</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('email')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                      channel === 'email' 
                        ? 'border-purple-600 bg-purple-50/60 text-purple-700 shadow-xs' 
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Mail className="w-6 h-6" />
                    <span className="text-xs font-bold">Email Message</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('voice')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                      channel === 'voice' 
                        ? 'border-amber-600 bg-amber-50/60 text-amber-700 shadow-xs' 
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <PhoneCall className="w-6 h-6" />
                    <span className="text-xs font-bold">Voice Call Broadcast</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: AUDIENCE */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">Select Target Audience Segment</label>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  <div
                    onClick={() => setSelectedGroupId('all')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedGroupId === 'all' ? 'border-indigo-600 bg-indigo-50/60 font-bold' : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">All Registered Contacts</p>
                        <p className="text-[11px] text-slate-500">Broad broadcast across complete database</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-slate-200 text-slate-800 text-xs font-extrabold rounded-full">
                      {(contacts || []).length} Contacts
                    </span>
                  </div>

                  {(groups || []).map(group => {
                    const count = (contacts || []).filter(c => (c.groupIds || []).includes(group.id)).length || group.contactCount;
                    return (
                      <div
                        key={group.id}
                        onClick={() => setSelectedGroupId(group.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          selectedGroupId === group.id ? 'border-indigo-600 bg-indigo-50/60 font-bold' : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <span className="px-2.5 py-0.5 text-white text-xs font-bold rounded-full" style={{ backgroundColor: group.color }}>
                            {group.name}
                          </span>
                          <p className="text-[11px] text-slate-500 mt-1">{group.description}</p>
                        </div>
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-full">
                          {count} Contacts
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CONTENT & TEMPLATES */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Load Template Quick Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Load Pre-made Template (Optional)</label>
                <select
                  value={selectedTemplateId}
                  onChange={e => handleSelectTemplate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 outline-none"
                >
                  <option value="">-- Choose a template --</option>
                  {(templates || []).filter(t => t.channel === channel || channel === 'sms').map(tpl => (
                    <option key={tpl.id} value={tpl.id}>[{tpl.category}] {tpl.name}</option>
                  ))}
                </select>
              </div>

              {channel === 'email' && (
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Email Subject Line</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="e.g. Important Notice Regarding Your Appointment"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none font-semibold"
                  />
                </div>
              )}

              {channel === 'voice' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Select Pre-recorded Voice Audio File</label>
                  <select
                    value={selectedVoiceId}
                    onChange={e => setSelectedVoiceId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none bg-white font-bold"
                  >
                    <option value="">-- Choose Voice Recording --</option>
                    {voiceRecordings.map(v => (
                      <option key={v.id} value={v.id}>{v.title} ({v.durationSeconds}s)</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-800">Message Content</label>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-700">
                      <span>Tokens:</span>
                      {['name', 'feeDue', 'doctor', 'date'].map(tok => (
                        <button
                          key={tok}
                          type="button"
                          onClick={() => handleInsertVariable(tok)}
                          className="px-1.5 py-0.5 bg-indigo-100 hover:bg-indigo-200 rounded text-[10px]"
                        >
                          +&#123;&#123;{tok}&#125;&#125;
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    rows={4}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Dear {{name}}, this is a reminder from Apex Health..."
                    className="w-full p-3 border border-slate-300 rounded-xl text-xs font-mono outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              )}

              {/* Live Device Preview Box */}
              <div className="p-3 bg-slate-900 rounded-xl text-white space-y-1">
                <span className="text-[10px] uppercase font-mono text-indigo-400 font-bold block">Live Recipient Mobile Preview</span>
                <p className="text-xs font-mono text-slate-300 leading-relaxed bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                  {content ? content.replace('{{name}}', 'Eleanor Vance').replace('{{feeDue}}', '$180.00').replace('{{doctor}}', 'Dr. Lawson') : 'Your message text will render here...'}
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: SCHEDULE & REVIEW */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Campaign Summary Review</h4>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
                  <div><strong>Title:</strong> {campaignName || 'Untitled'}</div>
                  <div><strong>Channel:</strong> {channel.toUpperCase()}</div>
                  <div><strong>Audience:</strong> {targetGroup ? targetGroup.name : 'All Contacts'}</div>
                  <div><strong>Recipients:</strong> {targetAudienceCount}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Schedule Date</label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={e => setScheduleDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Schedule Time</label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={e => setScheduleTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Actions */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center shrink-0">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-40 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !campaignName) {
                  alert('Please enter a campaign name');
                  return;
                }
                setStep(step + 1);
              }}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitCampaign}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-extrabold shadow-md flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Launch & Schedule Campaign</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
