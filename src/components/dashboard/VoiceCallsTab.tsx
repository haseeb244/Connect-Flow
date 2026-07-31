import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  PhoneCall, 
  PhoneOutgoing,
  PhoneOff,
  Upload, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Plus, 
  Volume2, 
  X, 
  FileAudio,
  Radio,
  Bot,
  Sparkles,
  Zap,
  Sliders,
  Send,
  RefreshCw,
  Search,
  Filter,
  Check,
  AlertCircle,
  FileText,
  Users,
  Calendar,
  Layers,
  Activity,
  ChevronRight,
  Mic,
  MessageSquare
} from 'lucide-react';
import { AutomatedVoiceRule, VoiceCallLog, VoiceRecording } from '../../types';

export const VoiceCallsTab: React.FC = () => {
  const { 
    voiceRecordings, 
    voiceLogs, 
    automatedVoiceRules,
    contacts,
    groups,
    business,
    addVoiceRecording, 
    deleteVoiceRecording, 
    retryVoiceCall,
    addVoiceCallLog,
    addAutomatedVoiceRule,
    toggleAutomatedVoiceRule,
    deleteAutomatedVoiceRule,
    dispatchAutoDialerCampaign
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'logs' | 'rules' | 'library' | 'autodialer'>('logs');
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Search & Filters for Logs
  const [logSearch, setLogSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLogForTranscript, setSelectedLogForTranscript] = useState<VoiceCallLog | null>(null);

  // Modals state
  const [liveSimulatorOpen, setLiveSimulatorOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [ttsModalOpen, setTtsModalOpen] = useState(false);
  const [ruleModalOpen, setRuleModalOpen] = useState(false);

  // --- Live Call Simulator State ---
  const [simRecipientName, setSimRecipientName] = useState('Dr. Sarah Connor');
  const [simPhone, setSimPhone] = useState('+1 (555) 234-8901');
  const [simPersona, setSimPersona] = useState('Rachel (Warm Female AI)');
  const [simScriptId, setSimScriptId] = useState(voiceRecordings[0]?.id || 'rec-1');
  const [callState, setCallState] = useState<'idle' | 'ringing' | 'connected' | 'ended'>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [simTranscript, setSimTranscript] = useState<{ speaker: 'AI System' | 'Customer'; text: string; time: string }[]>([]);
  const [dtmfOutcome, setDtmfOutcome] = useState<string | null>(null);

  // --- TTS Synthesizer Form State ---
  const [ttsTitle, setTtsTitle] = useState('');
  const [ttsCategory, setTtsCategory] = useState('Appointment Reminder');
  const [ttsPersona, setTtsPersona] = useState('Rachel (Warm Female AI)');
  const [ttsScript, setTtsScript] = useState(
    'Hello {{name}}, this is ConnectFlow calling to confirm your appointment on {{date}}. Please press 1 to confirm or press 2 to speak with an agent.'
  );
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesizedSuccess, setSynthesizedSuccess] = useState(false);

  // --- Audio Upload Modal State ---
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Appointment Reminder');
  const [uploadDuration, setUploadDuration] = useState(25);

  // --- New Voice Rule Form State ---
  const [ruleName, setRuleName] = useState('');
  const [ruleTrigger, setRuleTrigger] = useState<'appointment_reminder' | 'fee_reminder' | 'order_delivery' | 'emergency_alert'>('appointment_reminder');
  const [ruleGroup, setRuleGroup] = useState('Upcoming Patients / Appointments');
  const [rulePersona, setRulePersona] = useState('Rachel (Warm Female AI)');
  const [ruleScript, setRuleScript] = useState('Hello {{name}}, your payment of {{amount}} is due on {{date}}. Press 1 to confirm receipt.');
  const [ruleRetries, setRuleRetries] = useState(3);
  const [ruleInterval, setRuleInterval] = useState(15);

  // --- Auto-Dialer Batch Dispatch State ---
  const [selectedGroupForDispatch, setSelectedGroupForDispatch] = useState<string>(groups[0]?.name || 'Fee Pending Group');
  const [selectedRecForDispatch, setSelectedRecForDispatch] = useState<string>(voiceRecordings[0]?.title || '24h Medical Appointment Confirmation IVR');
  const [selectedPersonaForDispatch, setSelectedPersonaForDispatch] = useState<string>('Rachel (Warm Female AI)');
  const [isDispatchingBatch, setIsDispatchingBatch] = useState(false);

  // Timer for Call Simulator
  useEffect(() => {
    let timer: any;
    if (callState === 'connected') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callState]);

  // Handle Starting Live Call Simulation
  const handleStartSimulation = () => {
    setCallState('ringing');
    setSimTranscript([]);
    setDtmfOutcome(null);

    const selectedRec = voiceRecordings.find(r => r.id === simScriptId) || voiceRecordings[0];
    const scriptBody = selectedRec?.scriptText || 'Hello {{name}}, this is ConnectFlow Voice AI calling. Press 1 to confirm attendance, Press 2 to transfer call.';

    setTimeout(() => {
      setCallState('connected');
      setSimTranscript([
        {
          speaker: 'AI System',
          text: scriptBody.replace('{{name}}', simRecipientName).replace('{{date}}', 'Tomorrow at 10:00 AM').replace('{{amount}}', '$250'),
          time: '00:02'
        }
      ]);
    }, 2500);
  };

  // Handle Pressing Keypad Button in Live Simulation
  const handlePressDtmfKey = (key: string) => {
    if (callState !== 'connected' || dtmfOutcome) return;

    let responseText = '';
    let outcomeLabel = '';

    if (key === '1') {
      outcomeLabel = '1 (Confirmed)';
      responseText = 'Thank you! Your response [Key 1: Confirmed] has been logged in our system. Goodbye!';
    } else if (key === '2') {
      outcomeLabel = '2 (Transfer to Agent)';
      responseText = 'Transferring your call to a live customer service agent... Please stay on the line.';
    } else if (key === '3') {
      outcomeLabel = '3 (Reschedule Request)';
      responseText = 'Your reschedule request has been submitted. Our team will contact you shortly.';
    } else {
      outcomeLabel = `${key} (Key Pressed)`;
      responseText = `Key ${key} acknowledged. Thank you!`;
    }

    setDtmfOutcome(outcomeLabel);
    setSimTranscript(prev => [
      ...prev,
      { speaker: 'Customer', text: `[DTMF Key ${key} Pressed]`, time: `00:${callDuration < 10 ? '0' + callDuration : callDuration}` },
      { speaker: 'AI System', text: responseText, time: `00:${callDuration + 2 < 10 ? '0' + (callDuration + 2) : callDuration + 2}` }
    ]);

    // Automatically end call after response
    setTimeout(() => {
      handleEndSimulation(outcomeLabel, responseText);
    }, 3500);
  };

  // Handle Ending Live Call Simulation
  const handleEndSimulation = (finalOutcome?: string, finalAiResponse?: string) => {
    setCallState('ended');
    const outcome = finalOutcome || dtmfOutcome || 'No Key Pressed';

    const selectedRec = voiceRecordings.find(r => r.id === simScriptId) || voiceRecordings[0];

    const currentTranscript = simTranscript.length > 0 ? simTranscript : [
      { speaker: 'AI System', text: selectedRec?.scriptText || 'Automated IVR Notice', time: '00:02' }
    ];

    if (finalAiResponse) {
      currentTranscript.push({
        speaker: 'AI System',
        text: finalAiResponse,
        time: `00:${callDuration}`
      });
    }

    // Add to Call Logs
    addVoiceCallLog({
      recipientName: simRecipientName,
      phone: simPhone,
      recordingTitle: selectedRec?.title || 'Interactive AI Call Test',
      duration: `00:${callDuration < 10 ? '0' + callDuration : callDuration}`,
      status: 'completed',
      dtmfPressed: outcome,
      aiPersona: simPersona,
      callType: 'instant_dial',
      transcript: currentTranscript
    });
  };

  // Handle Voice Audio Upload Submit
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle) return;
    addVoiceRecording({
      title: uploadTitle,
      durationSeconds: uploadDuration,
      fileSize: `${(uploadDuration * 0.05).toFixed(1)} MB`,
      category: uploadCategory,
      aiPersona: 'Uploaded Studio Audio',
      isTts: false,
      scriptText: 'Uploaded custom WAV/MP3 audio file recording.'
    });
    setUploadTitle('');
    setUploadModalOpen(false);
  };

  // Handle TTS Generation Submit
  const handleTtsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ttsTitle || !ttsScript) return;

    setIsSynthesizing(true);

    setTimeout(() => {
      setIsSynthesizing(false);
      setSynthesizedSuccess(true);

      const estimatedSeconds = Math.max(10, Math.ceil(ttsScript.length / 12));

      addVoiceRecording({
        title: ttsTitle,
        category: ttsCategory,
        durationSeconds: estimatedSeconds,
        fileSize: `${(estimatedSeconds * 0.04).toFixed(1)} MB`,
        aiPersona: ttsPersona,
        isTts: true,
        scriptText: ttsScript
      });

      setTimeout(() => {
        setSynthesizedSuccess(false);
        setTtsModalOpen(false);
        setTtsTitle('');
      }, 1000);
    }, 1200);
  };

  // Handle Adding Automated Voice Rule
  const handleAddRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName || !ruleScript) return;

    const recordingTitle = `${ruleName} (TTS Prompt)`;

    addAutomatedVoiceRule({
      name: ruleName,
      triggerEvent: ruleTrigger,
      targetGroup: ruleGroup,
      aiPersona: rulePersona,
      recordingTitle,
      ttsScript: ruleScript,
      autoRetryCount: ruleRetries,
      retryIntervalMinutes: ruleInterval,
      isActive: true
    });

    setRuleName('');
    setRuleModalOpen(false);
  };

  // Handle Batch Auto-Dialer Dispatch
  const handleDispatchBatch = () => {
    setIsDispatchingBatch(true);
    setTimeout(() => {
      dispatchAutoDialerCampaign(selectedGroupForDispatch, selectedRecForDispatch, selectedPersonaForDispatch);
      setIsDispatchingBatch(false);
    }, 1500);
  };

  // Filter Call Logs
  const filteredLogs = voiceLogs.filter(call => {
    const matchesSearch = 
      call.recipientName.toLowerCase().includes(logSearch.toLowerCase()) ||
      call.phone.includes(logSearch) ||
      call.recordingTitle.toLowerCase().includes(logSearch.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && call.status === statusFilter;
  });

  const togglePlay = (id: string) => {
    if (playingId === id) setPlayingId(null);
    else setPlayingId(id);
  };

  // Summary Metrics
  const totalCalls = voiceLogs.length;
  const completedCalls = voiceLogs.filter(c => c.status === 'completed').length;
  const ivrSuccessRate = totalCalls > 0 ? Math.round((completedCalls / totalCalls) * 100) : 0;
  const activeRulesCount = automatedVoiceRules.filter(r => r.isActive).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                Automated AI Voice Calling System
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                  IVR & Auto-Dialer Engine
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Dispatch automated IVR calls, configure trigger-based voice rules, generate AI Speech prompts, and track real-time DTMF keypad responses.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setSimRecipientName(contacts[0]?.name || 'Dr. Sarah Connor');
              setSimPhone(contacts[0]?.phone || '+1 (555) 234-8901');
              setCallState('idle');
              setLiveSimulatorOpen(true);
            }}
            className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-purple-600/20 active:scale-95"
          >
            <PhoneOutgoing className="w-4 h-4" />
            <span>Launch Live Call Simulator</span>
          </button>

          <button
            onClick={() => setTtsModalOpen(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI Text-to-Speech Studio</span>
          </button>

          <button
            onClick={() => setRuleModalOpen(true)}
            className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>New Auto Call Rule</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Calls Made</p>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">{totalCalls}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">IVR Connect Rate</p>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">{ivrSuccessRate}%</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Auto Rules</p>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">{activeRulesCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Voice Balance</p>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">{business.voiceMinutes} Min</p>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveSubTab('logs')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeSubTab === 'logs'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call History & Transcripts ({voiceLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('rules')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeSubTab === 'rules'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bot className="w-4 h-4 text-purple-600" />
            <span>Automated Voice Rules ({automatedVoiceRules.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('library')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeSubTab === 'library'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileAudio className="w-4 h-4 text-indigo-500" />
            <span>AI Voice & Speech Library ({voiceRecordings.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('autodialer')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeSubTab === 'autodialer'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Radio className="w-4 h-4 text-rose-500" />
            <span>Batch Auto-Dialer Dispatcher</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: CALL LOGS & TRANSCRIPTS */}
      {activeSubTab === 'logs' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={logSearch}
                onChange={e => setLogSearch(e.target.value)}
                placeholder="Search recipient name, phone, or prompt title..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter Status:
              </span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none"
              >
                <option value="all">All Call Statuses</option>
                <option value="completed">Completed Calls</option>
                <option value="no_answer">No Answer</option>
                <option value="busy">Busy Line</option>
                <option value="failed">Delivery Failed</option>
              </select>
            </div>
          </div>

          {/* Call Logs Table */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Live Voice Call Delivery Logs</h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">Auto-retry active for failed calls</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Recipient</th>
                    <th className="py-3 px-4">Phone Number</th>
                    <th className="py-3 px-4">AI Voice & Prompt</th>
                    <th className="py-3 px-4">DTMF Key Outcome</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No voice call records found matching your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map(call => (
                      <tr key={call.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{call.recipientName}</div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold">
                            {call.callType ? call.callType.replace('_', ' ') : 'IVR Call'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700">{call.phone}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{call.recordingTitle}</div>
                          <div className="text-[10px] text-purple-600 font-bold">{call.aiPersona || 'AI Voice Agent'}</div>
                        </td>
                        <td className="py-3 px-4">
                          {call.dtmfPressed ? (
                            <span className="px-2.5 py-1 bg-purple-100 text-purple-900 border border-purple-200 rounded-md text-[11px] font-bold">
                              Key {call.dtmfPressed}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px] italic">No DTMF Input</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">{call.duration}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                            call.status === 'completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                            call.status === 'no_answer' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            call.status === 'busy' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {call.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-[11px]">{call.timestamp}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {call.transcript && call.transcript.length > 0 && (
                              <button
                                onClick={() => setSelectedLogForTranscript(call)}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-bold transition-colors flex items-center gap-1"
                                title="View Call Transcript"
                              >
                                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Transcript</span>
                              </button>
                            )}

                            {(call.status === 'no_answer' || call.status === 'busy' || call.status === 'failed') ? (
                              <button
                                onClick={() => retryVoiceCall(call.id)}
                                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[11px] font-bold transition-colors flex items-center gap-1 shadow-2xs"
                                title="Retry call now"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Retry ({call.retryCount})</span>
                              </button>
                            ) : (
                              <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: AUTOMATED VOICE RULES */}
      {activeSubTab === 'rules' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-purple-50 p-4 rounded-xl border border-purple-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-600 text-white rounded-lg">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-purple-950 uppercase tracking-wider">Automated AI Calling Workflows</h3>
                <p className="text-xs text-purple-800 mt-0.5">
                  Configure trigger rules to automatically dial contacts upon event occurrences (e.g. 24h before appointment, fee overdue by 3 days).
                </p>
              </div>
            </div>

            <button
              onClick={() => setRuleModalOpen(true)}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Voice Rule</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {automatedVoiceRules.map(rule => (
              <div 
                key={rule.id} 
                className={`bg-white p-5 rounded-2xl border transition-all shadow-2xs flex flex-col justify-between ${
                  rule.isActive ? 'border-slate-200/90' : 'border-slate-200 opacity-60 bg-slate-50/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      rule.triggerEvent === 'appointment_reminder' ? 'bg-indigo-100 text-indigo-800' :
                      rule.triggerEvent === 'fee_reminder' ? 'bg-amber-100 text-amber-800' :
                      rule.triggerEvent === 'order_delivery' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {rule.triggerEvent.replace('_', ' ')}
                    </span>

                    <button
                      onClick={() => toggleAutomatedVoiceRule(rule.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        rule.isActive ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          rule.isActive ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-900 leading-snug">{rule.name}</h4>
                  
                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-semibold">Target Audience:</span>
                      <span className="font-bold text-slate-800">{rule.targetGroup}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-semibold">AI Voice Persona:</span>
                      <span className="font-bold text-purple-700">{rule.aiPersona}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-semibold">Auto Retry Policy:</span>
                      <span className="font-mono text-slate-700">{rule.autoRetryCount}x every {rule.retryIntervalMinutes}m</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-[11px] text-slate-700 italic font-mono leading-relaxed">
                    "{rule.ttsScript}"
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <div className="text-slate-500">
                    Dispatched: <strong className="text-slate-900">{rule.totalCallsDispatched} calls</strong>
                  </div>
                  <button
                    onClick={() => deleteAutomatedVoiceRule(rule.id)}
                    className="text-slate-400 hover:text-red-600 p-1"
                    title="Delete rule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: AI SPEECH & AUDIO LIBRARY */}
      {activeSubTab === 'library' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900">Audio Prompts & TTS Speech Library</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTtsModalOpen(true)}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Text-to-Speech Studio</span>
              </button>
              <button
                onClick={() => setUploadModalOpen(true)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Audio File</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {voiceRecordings.map(rec => {
              const isPlaying = playingId === rec.id;
              return (
                <div key={rec.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 rounded-full text-[10px] font-bold uppercase">
                        {rec.category}
                      </span>
                      {rec.isTts && (
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[10px] font-bold flex items-center gap-1">
                          <Bot className="w-3 h-3" /> AI TTS
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-900 leading-snug">{rec.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Persona: <strong>{rec.aiPersona || 'Studio Voice'}</strong> • Duration: {rec.durationSeconds}s
                    </p>

                    {rec.scriptText && (
                      <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200/60 rounded-lg text-[11px] text-slate-600 font-mono">
                        {rec.scriptText}
                      </div>
                    )}

                    {/* Simulated Waveform Visualization */}
                    <div className="mt-4 p-3 bg-slate-900 rounded-xl flex items-center gap-3">
                      <button
                        onClick={() => togglePlay(rec.id)}
                        className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shrink-0 transition-colors shadow-xs"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                      </button>

                      <div className="flex-1 flex items-center gap-1 h-6">
                        {[12, 24, 18, 30, 10, 28, 32, 16, 22, 28, 14, 20, 26, 12, 18].map((h, idx) => (
                          <div
                            key={idx}
                            className={`flex-1 rounded-full transition-all ${
                              isPlaying ? 'bg-indigo-400 animate-pulse' : 'bg-slate-600'
                            }`}
                            style={{ height: `${h}px` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Uploaded: {rec.createdAt}</span>
                    <button
                      onClick={() => deleteVoiceRecording(rec.id)}
                      className="text-slate-400 hover:text-red-600 p-1"
                      title="Delete recording"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: BATCH AUTO-DIALER DISPATCHER */}
      {activeSubTab === 'autodialer' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Mass Auto-Dialer Dispatch Engine</h3>
              <p className="text-xs text-slate-500">
                Instantly trigger parallel automated IVR calls to entire contact groups with live delivery status.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Audience Group</label>
              <select
                value={selectedGroupForDispatch}
                onChange={e => setSelectedGroupForDispatch(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
              >
                {groups.map(g => (
                  <option key={g.id} value={g.name}>{g.name} ({g.contactCount || 10} Contacts)</option>
                ))}
                <option value="All Contacts">All Active Contacts ({contacts.length} total)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Voice Audio Prompt</label>
              <select
                value={selectedRecForDispatch}
                onChange={e => setSelectedRecForDispatch(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
              >
                {voiceRecordings.map(r => (
                  <option key={r.id} value={r.title}>{r.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">AI Voice Persona</label>
              <select
                value={selectedPersonaForDispatch}
                onChange={e => setSelectedPersonaForDispatch(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
              >
                <option value="Rachel (Warm Female AI)">Rachel (Warm Female AI)</option>
                <option value="Marcus (Authoritative Male AI)">Marcus (Authoritative Male AI)</option>
                <option value="Priya (Clear Bilingual AI)">Priya (Clear Bilingual AI)</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>Pacing Rate: 10 Parallel Lines / Second</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Auto-retry policy will automatically re-dial busy numbers up to 3 times.
              </p>
            </div>

            <button
              onClick={handleDispatchBatch}
              disabled={isDispatchingBatch}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 active:scale-95 shrink-0"
            >
              {isDispatchingBatch ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Dispatching Auto-Dialer Batch...</span>
                </>
              ) : (
                <>
                  <Radio className="w-4 h-4" />
                  <span>Launch Batch Calling Campaign</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL 1: LIVE CALL SIMULATOR MODAL --- */}
      {liveSimulatorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${callState === 'connected' ? 'bg-emerald-400' : 'bg-purple-400'} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${callState === 'connected' ? 'bg-emerald-500' : 'bg-purple-500'}`}></span>
                </span>
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  {callState === 'idle' ? 'Ready to Dial' : callState === 'ringing' ? 'Initiating Outbound Connection...' : callState === 'connected' ? 'Call Active & Streaming' : 'Call Completed & Logged'}
                </span>
              </div>
              <button onClick={() => setLiveSimulatorOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Call Stage Body */}
            <div className="p-6 text-center space-y-6">
              {/* Recipient Identity Avatar */}
              <div>
                <div className="w-20 h-20 mx-auto rounded-full bg-indigo-600/20 border-2 border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-3 shadow-inner">
                  <PhoneCall className={`w-8 h-8 ${callState === 'connected' ? 'animate-bounce text-emerald-400' : callState === 'ringing' ? 'animate-pulse text-amber-400' : ''}`} />
                </div>
                <h3 className="text-lg font-extrabold text-white">{simRecipientName}</h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">{simPhone}</p>
                <p className="text-[11px] text-purple-400 font-semibold mt-1">Persona: {simPersona}</p>
              </div>

              {callState === 'idle' && (
                <div className="space-y-4 text-left bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Select Contact to Call</label>
                    <select
                      value={simRecipientName}
                      onChange={e => {
                        const target = contacts.find(c => c.name === e.target.value);
                        setSimRecipientName(e.target.value);
                        if (target) setSimPhone(target.phone);
                      }}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none"
                    >
                      {contacts.map(c => (
                        <option key={c.id} value={c.name}>{c.name} ({c.phone})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Select Audio Voice Script</label>
                    <select
                      value={simScriptId}
                      onChange={e => setSimScriptId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none"
                    >
                      {voiceRecordings.map(r => (
                        <option key={r.id} value={r.id}>{r.title}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleStartSimulation}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95"
                  >
                    <PhoneOutgoing className="w-4 h-4" />
                    <span>Dial Number Now</span>
                  </button>
                </div>
              )}

              {callState === 'ringing' && (
                <div className="py-6 space-y-3">
                  <div className="flex items-center justify-center gap-1.5 h-8">
                    <div className="w-2 h-8 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-8 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-8 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">Ringing line... Awaiting automated IVR pickup...</p>
                </div>
              )}

              {callState === 'connected' && (
                <div className="space-y-4">
                  {/* Duration Timer & Audio Equalizer */}
                  <div className="flex items-center justify-center gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      00:{callDuration < 10 ? '0' + callDuration : callDuration}
                    </span>
                    <div className="flex items-center gap-1 h-4">
                      {[10, 20, 14, 28, 16, 22, 12, 24].map((h, i) => (
                        <div key={i} className="w-1 bg-emerald-400 rounded-full animate-pulse" style={{ height: `${h}px` }}></div>
                      ))}
                    </div>
                  </div>

                  {/* Realtime Dialogue Box */}
                  <div className="bg-slate-950 p-4 rounded-2xl text-left max-h-40 overflow-y-auto space-y-2 border border-slate-800">
                    {simTranscript.map((t, i) => (
                      <div key={i} className="text-xs">
                        <span className={`font-bold ${t.speaker === 'AI System' ? 'text-purple-400' : 'text-emerald-400'}`}>
                          [{t.time}] {t.speaker}:
                        </span>{' '}
                        <span className="text-slate-300">{t.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Interactive Keypad */}
                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60">
                    <p className="text-xs font-bold text-slate-300 mb-3">Press DTMF Key on Touchpad:</p>
                    <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(key => (
                        <button
                          key={key}
                          onClick={() => handlePressDtmfKey(key)}
                          className="py-2.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-sm font-bold transition-all border border-slate-700 active:scale-90"
                        >
                          {key}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleEndSimulation()}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>Hang Up Call</span>
                  </button>
                </div>
              )}

              {callState === 'ended' && (
                <div className="py-4 space-y-4">
                  <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-left">
                    <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Call Successfully Completed & Saved
                    </p>
                    <p className="text-xs text-slate-300 mt-1">
                      DTMF Response Outcome: <strong className="text-purple-300">{dtmfOutcome || '1 (Confirmed)'}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => setLiveSimulatorOpen(false)}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
                  >
                    Close Simulator & View Logs
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: TEXT-TO-SPEECH (TTS) STUDIO MODAL --- */}
      {ttsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>AI Text-to-Speech (TTS) Studio</span>
              </h3>
              <button onClick={() => setTtsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTtsSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Prompt Title</label>
                <input
                  type="text"
                  required
                  value={ttsTitle}
                  onChange={e => setTtsTitle(e.target.value)}
                  placeholder="e.g. Appointment Confirmation Voice Notice"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={ttsCategory}
                    onChange={e => setTtsCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold outline-none bg-white"
                  >
                    <option value="Appointment Reminder">Appointment Reminder</option>
                    <option value="Fee Collection">Fee Collection</option>
                    <option value="General Alert">General Alert</option>
                    <option value="Emergency Broadcast">Emergency Broadcast</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">AI Voice Persona</label>
                  <select
                    value={ttsPersona}
                    onChange={e => setTtsPersona(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold outline-none bg-white"
                  >
                    <option value="Rachel (Warm Female AI)">Rachel (Warm Female AI)</option>
                    <option value="Marcus (Authoritative Male AI)">Marcus (Authoritative Male AI)</option>
                    <option value="Priya (Clear Bilingual AI)">Priya (Clear Bilingual AI)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Script Message Body (Dynamic Variables Supported)
                </label>
                <textarea
                  rows={4}
                  required
                  value={ttsScript}
                  onChange={e => setTtsScript(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl text-xs font-mono outline-none focus:ring-2 focus:ring-purple-600"
                ></textarea>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <span className="text-[10px] text-slate-400 font-bold">Tags:</span>
                  {['{{name}}', '{{amount}}', '{{date}}', '{{service}}'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setTtsScript(prev => prev + ' ' + tag)}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-purple-100 text-purple-700 rounded text-[10px] font-mono font-bold"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setTtsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSynthesizing}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold shadow-sm flex items-center gap-1.5"
                >
                  {isSynthesizing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Synthesizing Voice...</span>
                    </>
                  ) : synthesizedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Synthesized!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Synthesize & Save Prompt</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: NEW AUTOMATED VOICE RULE MODAL --- */}
      {ruleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-purple-950 text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-400" />
                <span>Configure Automated Voice Rule</span>
              </h3>
              <button onClick={() => setRuleModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRuleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rule Title</label>
                <input
                  type="text"
                  required
                  value={ruleName}
                  onChange={e => setRuleName(e.target.value)}
                  placeholder="e.g. 24h Patient Appointment Auto-Dialer"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Trigger Event</label>
                  <select
                    value={ruleTrigger}
                    onChange={e => setRuleTrigger(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold outline-none bg-white"
                  >
                    <option value="appointment_reminder">24h Before Appointment</option>
                    <option value="fee_reminder">Fee Due / Overdue</option>
                    <option value="order_delivery">Order Delivered</option>
                    <option value="emergency_alert">Emergency Alert Broadcast</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience Group</label>
                  <select
                    value={ruleGroup}
                    onChange={e => setRuleGroup(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold outline-none bg-white"
                  >
                    {groups.map(g => (
                      <option key={g.id} value={g.name}>{g.name}</option>
                    ))}
                    <option value="Upcoming Patients / Appointments">Upcoming Patients / Appointments</option>
                    <option value="Fee Pending Group">Fee Pending Group</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">AI Voice Persona</label>
                <select
                  value={rulePersona}
                  onChange={e => setRulePersona(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold outline-none bg-white"
                >
                  <option value="Rachel (Warm Female AI)">Rachel (Warm Female AI)</option>
                  <option value="Marcus (Authoritative Male AI)">Marcus (Authoritative Male AI)</option>
                  <option value="Priya (Clear Bilingual AI)">Priya (Clear Bilingual AI)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Voice Script</label>
                <textarea
                  rows={3}
                  required
                  value={ruleScript}
                  onChange={e => setRuleScript(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl text-xs font-mono outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Auto Retries</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={ruleRetries}
                    onChange={e => setRuleRetries(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Retry Interval (Minutes)</label>
                  <input
                    type="number"
                    min={5}
                    max={60}
                    value={ruleInterval}
                    onChange={e => setRuleInterval(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRuleModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold shadow-sm"
                >
                  Save & Enable Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 4: UPLOAD AUDIO FILE MODAL --- */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <FileAudio className="w-4 h-4 text-purple-400" />
                <span>Upload Audio Prompt File</span>
              </h3>
              <button onClick={() => setUploadModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Recording Title</label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={e => setUploadTitle(e.target.value)}
                  placeholder="e.g. Pre-recorded Audio Notice"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={uploadCategory}
                  onChange={e => setUploadCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs outline-none bg-white font-semibold"
                >
                  <option value="Appointment Reminder">Appointment Reminder</option>
                  <option value="Fee Collection">Fee Collection</option>
                  <option value="General Alert">General Alert</option>
                  <option value="Emergency Broadcast">Emergency Broadcast</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Audio Duration (Seconds)</label>
                <input
                  type="number"
                  required
                  min={5}
                  max={120}
                  value={uploadDuration}
                  onChange={e => setUploadDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs outline-none font-mono"
                />
              </div>

              <div className="p-6 border-2 border-dashed border-purple-300 rounded-xl bg-purple-50/50 text-center">
                <Upload className="w-8 h-8 text-purple-600 mx-auto mb-1" />
                <p className="text-xs font-bold text-slate-800">Select MP3 or WAV audio file</p>
                <p className="text-[10px] text-slate-500">Maximum file size: 10MB</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Save Audio File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 5: TRANSCRIPT INSPECTOR MODAL --- */}
      {selectedLogForTranscript && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>Call Dialogue Transcript</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {selectedLogForTranscript.recipientName} ({selectedLogForTranscript.phone})
                </p>
              </div>
              <button onClick={() => setSelectedLogForTranscript(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 font-bold">DTMF Outcome:</span>{' '}
                  <span className="font-bold text-purple-700">{selectedLogForTranscript.dtmfPressed || 'None'}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">Duration:</span>{' '}
                  <span className="font-mono text-slate-800">{selectedLogForTranscript.duration}</span>
                </div>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {selectedLogForTranscript.transcript?.map((line, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-xl text-xs ${
                      line.speaker === 'AI System'
                        ? 'bg-purple-50 border border-purple-200/80 text-purple-950 ml-0 mr-6'
                        : 'bg-emerald-50 border border-emerald-200/80 text-emerald-950 ml-6 mr-0'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 font-bold text-[10px] uppercase">
                      <span>{line.speaker}</span>
                      <span className="text-slate-400 font-mono">{line.time}</span>
                    </div>
                    <p className="font-medium leading-relaxed">{line.text}</p>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 text-right">
                <button
                  onClick={() => setSelectedLogForTranscript(null)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                >
                  Close Transcript
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
