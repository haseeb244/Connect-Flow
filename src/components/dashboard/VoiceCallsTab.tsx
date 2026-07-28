import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  PhoneCall, 
  Upload, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  PhoneOff, 
  Clock, 
  Trash2, 
  Plus, 
  Volume2, 
  X, 
  FileAudio,
  Radio
} from 'lucide-react';

export const VoiceCallsTab: React.FC = () => {
  const { voiceRecordings, voiceLogs, addVoiceRecording, deleteVoiceRecording, retryVoiceCall } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'logs' | 'library'>('logs');
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Appointment Reminder');
  const [duration, setDuration] = useState(25);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    addVoiceRecording({
      title,
      durationSeconds: duration,
      fileSize: `${(duration * 0.05).toFixed(1)} MB`,
      category,
    });
    setTitle('');
    setUploadModalOpen(false);
  };

  const togglePlay = (id: string) => {
    if (playingId === id) setPlayingId(null);
    else setPlayingId(id);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Voice Call Broadcasts & Logs</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage pre-recorded voice audio prompts, automated IVR calls, and retry call delivery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1 bg-slate-200/80 rounded-lg flex text-xs font-bold">
            <button
              onClick={() => setActiveSubTab('logs')}
              className={`px-3 py-1.5 rounded-md transition-all ${activeSubTab === 'logs' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
            >
              Call History ({voiceLogs.length})
            </button>
            <button
              onClick={() => setActiveSubTab('library')}
              className={`px-3 py-1.5 rounded-md transition-all ${activeSubTab === 'library' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
            >
              Audio Library ({voiceRecordings.length})
            </button>
          </div>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Voice Audio</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'logs' ? (
        /* Call Logs Table */
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-900">Voice Call Delivery Logs</h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">Auto-retry for failed / busy calls active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Phone Number</th>
                  <th className="py-3 px-4">Audio Prompt Title</th>
                  <th className="py-3 px-4">Call Duration</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {voiceLogs.map(call => (
                  <tr key={call.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{call.recipientName}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">{call.phone}</td>
                    <td className="py-3 px-4 text-slate-800">{call.recordingTitle}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{call.duration}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                        call.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                        call.status === 'no_answer' ? 'bg-amber-100 text-amber-800' :
                        call.status === 'busy' ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {call.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">{call.timestamp}</td>
                    <td className="py-3 px-4 text-right">
                      {(call.status === 'no_answer' || call.status === 'busy' || call.status === 'failed') ? (
                        <button
                          onClick={() => retryVoiceCall(call.id)}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[11px] font-bold transition-colors flex items-center gap-1 ml-auto"
                          title="Retry calling now"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Retry Call ({call.retryCount})</span>
                        </button>
                      ) : (
                        <span className="text-emerald-600 font-bold text-[11px] flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Voice Audio Library Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {voiceRecordings.map(rec => {
            const isPlaying = playingId === rec.id;
            return (
              <div key={rec.id} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 rounded-full text-[10px] font-bold uppercase">
                      {rec.category}
                    </span>
                    <button
                      onClick={() => deleteVoiceRecording(rec.id)}
                      className="text-slate-400 hover:text-red-600 p-1"
                      title="Delete recording"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-900 leading-snug">{rec.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Duration: <strong>{rec.durationSeconds}s</strong> • Size: {rec.fileSize}
                  </p>

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

                <div className="mt-4 pt-3 border-t border-slate-100 text-right">
                  <span className="text-[10px] text-slate-400">Uploaded on {rec.createdAt}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Voice Recording Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <FileAudio className="w-4 h-4 text-purple-400" />
                <span>Upload Voice Audio Prompt</span>
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
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Appointment Reminder Voice Notice"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none bg-white font-semibold"
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
                  value={duration}
                  onChange={e => setDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none font-mono"
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
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Save Audio File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
