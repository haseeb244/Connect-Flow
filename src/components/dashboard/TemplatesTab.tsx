import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageTemplate, ChannelType } from '../../types';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Copy, 
  X, 
  Sparkles, 
  Check, 
  MessageSquare, 
  Send, 
  Mail, 
  PhoneCall 
} from 'lucide-react';

export const TemplatesTab: React.FC = () => {
  const { templates, addTemplate, deleteTemplate } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Template Form
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MessageTemplate['category']>('Fee Reminder');
  const [channel, setChannel] = useState<ChannelType>('sms');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  const filtered = (templates || []).filter(t => selectedCategory === 'all' || t.category === selectedCategory);

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !content) return;

    // Auto extract variable tokens in content like {{token}}
    const matches = content.match(/\{\{([^}]+)\}\}/g) || [];
    const variables = Array.from(new Set(matches.map(m => m.replace(/[{}]/g, '').trim())));

    addTemplate({
      name,
      category,
      channel,
      subject: channel === 'email' ? subject : undefined,
      content,
      variables,
    });

    setName('');
    setContent('');
    setSubject('');
    setModalOpen(false);
  };

  const handleInsertToken = (token: string) => {
    setContent(prev => `${prev} {{${token}}}`);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Message Template Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create standardized text templates with dynamic variable tokens for SMS, WhatsApp, and Email broadcasts.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Template</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold text-slate-600">
        {['all', 'Fee Reminder', 'Appointment', 'Alert', 'Promotional'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${selectedCategory === cat ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            {cat === 'all' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(tpl => (
          <div key={tpl.id} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded-full text-[10px] uppercase">
                  {tpl.category}
                </span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded uppercase">
                  {tpl.channel}
                </span>
              </div>

              <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{tpl.name}</h3>

              {tpl.subject && (
                <p className="text-xs font-bold text-slate-700 mt-1">Subject: {tpl.subject}</p>
              )}

              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 font-mono text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {tpl.content}
              </div>

              {/* Variable Tokens */}
              <div className="mt-3 flex flex-wrap gap-1">
                {(tpl.variables || []).map((v, i) => (
                  <span key={i} className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 rounded">
                    &#123;&#123;{v}&#125;&#125;
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleCopyText(tpl.id, tpl.content)}
                className="text-xs font-bold text-slate-600 hover:text-indigo-600 flex items-center gap-1"
              >
                {copiedId === tpl.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>

              <button
                onClick={() => deleteTemplate(tpl.id)}
                className="text-slate-400 hover:text-red-600 p-1"
                title="Delete template"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Template Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Create Message Template</span>
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Template Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Appointment Confirmation WhatsApp"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none bg-white font-bold"
                  >
                    <option value="Fee Reminder">Fee Reminder</option>
                    <option value="Appointment">Appointment</option>
                    <option value="Alert">Alert</option>
                    <option value="Promotional">Promotional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Channel</label>
                  <select
                    value={channel}
                    onChange={e => setChannel(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none bg-white font-bold"
                  >
                    <option value="sms">SMS</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="email">Email</option>
                  </select>
                </div>
              </div>

              {channel === 'email' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Subject Line</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="Subject line..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none"
                  />
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700">Template Body</label>
                  <div className="flex gap-1 text-[10px] font-semibold text-indigo-700">
                    <span>Insert variable:</span>
                    {['name', 'feeDue', 'doctor', 'date'].map(tok => (
                      <button
                        key={tok}
                        type="button"
                        onClick={() => handleInsertToken(tok)}
                        className="px-1.5 py-0.5 bg-indigo-100 hover:bg-indigo-200 rounded"
                      >
                        +&#123;&#123;{tok}&#125;&#125;
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Dear {{name}}, your fee of {{feeDue}} is due on {{date}}."
                  className="w-full p-3 border border-slate-300 rounded-xl text-xs font-mono outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
