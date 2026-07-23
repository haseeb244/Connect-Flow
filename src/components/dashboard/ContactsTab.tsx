import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Contact, ContactGroup } from '../../types';
import { 
  Users, 
  Search, 
  Plus, 
  Upload, 
  Download, 
  Trash2, 
  Edit, 
  X, 
  FolderPlus, 
  Tag, 
  Check, 
  FileSpreadsheet,
  Phone,
  Mail,
  Filter,
  Layers
} from 'lucide-react';

export const ContactsTab: React.FC = () => {
  const { 
    contacts, 
    groups, 
    addContact, 
    updateContact, 
    deleteContact, 
    importContacts, 
    addGroup, 
    deleteGroup, 
    exportToCSV 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'contacts' | 'groups'>('contacts');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('all');
  
  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // New Contact Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState('');
  const [feeDue, setFeeDue] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');

  // New Group Form State
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [groupColor, setGroupColor] = useState('#3b82f6');

  // Filtered Contacts List
  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.phone.includes(searchQuery) || 
                          c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroupFilter === 'all' || c.groupIds.includes(selectedGroupFilter);
    return matchesSearch && matchesGroup;
  });

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const customFields: Record<string, string> = {};
    if (feeDue) customFields.feeDue = feeDue;
    if (appointmentDate) customFields.appointmentDate = appointmentDate;

    if (editingContact) {
      updateContact(editingContact.id, {
        name,
        phone,
        email,
        groupIds: selectedGroups,
        tags: tagsArray,
        customFields,
      });
    } else {
      addContact({
        name,
        phone,
        email,
        groupIds: selectedGroups,
        tags: tagsArray.length > 0 ? tagsArray : ['General'],
        customFields,
        status: 'active',
      });
    }

    // Reset Form
    setName('');
    setPhone('');
    setEmail('');
    setSelectedGroups([]);
    setTagsInput('');
    setFeeDue('');
    setAppointmentDate('');
    setEditingContact(null);
    setAddModalOpen(false);
  };

  const handleOpenEdit = (contact: Contact) => {
    setEditingContact(contact);
    setName(contact.name);
    setPhone(contact.phone);
    setEmail(contact.email);
    setSelectedGroups(contact.groupIds);
    setTagsInput(contact.tags.join(', '));
    setFeeDue(contact.customFields.feeDue || '');
    setAppointmentDate(contact.customFields.appointmentDate || '');
    setAddModalOpen(true);
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName) return;
    addGroup({
      name: groupName,
      description: groupDesc || 'Custom audience segment',
      color: groupColor,
      contactCount: 0,
    });
    setGroupName('');
    setGroupDesc('');
    setGroupModalOpen(false);
  };

  // Simulate CSV Drag & Drop Upload
  const handleCSVImportSimulated = () => {
    const sampleImportList = [
      {
        name: 'Jordan Belfort',
        phone: '+1 (555) 991-8822',
        email: 'jordan.b@stratton.com',
        groupIds: [groups[0]?.id || 'group-1'],
        tags: ['New Lead', 'High Priority'],
        customFields: { feeDue: '$450.00', appointmentDate: '2026-08-05' },
        status: 'active' as const,
      },
      {
        name: 'Rachel Green',
        phone: '+1 (555) 441-2099',
        email: 'rachel.g@ralphlauren.com',
        groupIds: [groups[1]?.id || 'group-2'],
        tags: ['VIP Client', 'Fashion'],
        customFields: { feeDue: '$0.00', appointmentDate: '2026-08-01' },
        status: 'active' as const,
      },
      {
        name: 'Chandler Bing',
        phone: '+1 (555) 302-9182',
        email: 'chandler.b@transpondster.com',
        groupIds: [groups[0]?.id || 'group-1'],
        tags: ['Accounting'],
        customFields: { feeDue: '$120.00', appointmentDate: '2026-08-03' },
        status: 'active' as const,
      }
    ];

    importContacts(sampleImportList);
    setImportModalOpen(false);
  };

  const handleExportCSV = () => {
    const rows = filteredContacts.map(c => ({
      ID: c.id,
      Name: c.name,
      Phone: c.phone,
      Email: c.email,
      Tags: c.tags.join('; '),
      FeeDue: c.customFields.feeDue || '$0.00',
      AppointmentDate: c.customFields.appointmentDate || 'N/A',
      Status: c.status,
    }));
    exportToCSV('ConnectFlow_Contacts_Export', rows);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Sub-tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Contact Directory & Audience Groups</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage phone numbers, emails, group segments, and custom field tokens.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub Tab Switcher */}
          <div className="p-1 bg-slate-200/80 rounded-lg flex text-xs font-bold">
            <button
              onClick={() => setActiveSubTab('contacts')}
              className={`px-3 py-1.5 rounded-md transition-all ${activeSubTab === 'contacts' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
            >
              Contacts ({contacts.length})
            </button>
            <button
              onClick={() => setActiveSubTab('groups')}
              className={`px-3 py-1.5 rounded-md transition-all ${activeSubTab === 'groups' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
            >
              Groups ({groups.length})
            </button>
          </div>

          <button
            onClick={() => setImportModalOpen(true)}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Import CSV</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={() => { setEditingContact(null); setAddModalOpen(true); }}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'contacts' ? (
        <>
          {/* Search & Filter Bar */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by name, phone, or email..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-600 focus:bg-white outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-semibold text-slate-500">Filter Group:</span>
              <select
                value={selectedGroupFilter}
                onChange={e => setSelectedGroupFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="all">All Groups ({contacts.length})</option>
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Contacts Directory Table */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Contact Name</th>
                    <th className="py-3 px-4">Phone Number</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Group Segment</th>
                    <th className="py-3 px-4">Fee Due / Field</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredContacts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <Users className="w-8 h-8 mx-auto opacity-30 mb-2" />
                        <p className="font-semibold text-slate-600">No contacts found</p>
                        <p className="text-[11px]">Try searching with a different term or import a CSV list.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredContacts.map(contact => {
                      const assignedGroups = groups.filter(g => contact.groupIds.includes(g.id));
                      return (
                        <tr key={contact.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {contact.name}
                            <div className="flex gap-1 mt-0.5">
                              {contact.tags.map((tag, idx) => (
                                <span key={idx} className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-700">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              {contact.phone}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {contact.email}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {assignedGroups.map(g => (
                                <span 
                                  key={g.id} 
                                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                                  style={{ backgroundColor: g.color }}
                                >
                                  {g.name}
                                </span>
                              ))}
                              {assignedGroups.length === 0 && <span className="text-slate-400">Unassigned</span>}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-800">
                            {contact.customFields.feeDue ? (
                              <span className="text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-200/60">
                                {contact.customFields.feeDue}
                              </span>
                            ) : (
                              <span className="text-slate-400">$0.00</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 uppercase">
                              {contact.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleOpenEdit(contact)}
                                className="p-1 rounded hover:bg-slate-200/60 text-slate-600 hover:text-indigo-600"
                                title="Edit Contact"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteContact(contact.id)}
                                className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600"
                                title="Delete Contact"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Groups Sub tab */
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200/80">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Audience Group Segments</h3>
              <p className="text-xs text-slate-500">Categorize contacts for targeted SMS, WhatsApp, and Voice broadcasts.</p>
            </div>
            <button
              onClick={() => setGroupModalOpen(true)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Create New Group</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map(group => {
              const count = contacts.filter(c => c.groupIds.includes(group.id)).length;
              return (
                <div key={group.id} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span 
                        className="px-2.5 py-1 rounded-full text-white text-xs font-bold"
                        style={{ backgroundColor: group.color }}
                      >
                        {group.name}
                      </span>
                      <button
                        onClick={() => deleteGroup(group.id)}
                        className="text-slate-400 hover:text-red-600 p-1"
                        title="Delete Group"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">{group.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Audience Reach:</span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-indigo-700">{count} contacts</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add/Edit Contact Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold">
                {editingContact ? 'Edit Contact Details' : 'Add New Contact'}
              </h3>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Eleanor Vance"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 392-1029"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="eleanor@example.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assign Contact Groups</label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 border border-slate-200 rounded-lg bg-slate-50">
                  {groups.map(g => (
                    <label key={g.id} className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedGroups.includes(g.id)}
                        onChange={e => {
                          if (e.target.checked) setSelectedGroups([...selectedGroups, g.id]);
                          else setSelectedGroups(selectedGroups.filter(id => id !== g.id));
                        }}
                        className="rounded border-slate-300 text-indigo-600"
                      />
                      <span>{g.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Custom Variable: Fee Due</label>
                  <input
                    type="text"
                    value={feeDue}
                    onChange={e => setFeeDue(e.target.value)}
                    placeholder="$180.00"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Custom Variable: Appointment</label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={e => setAppointmentDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  placeholder="Urgent, Dental, VIP"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  {editingContact ? 'Save Changes' : 'Create Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-400" />
                <span>Import Contacts via CSV</span>
              </h3>
              <button onClick={() => setImportModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 text-center space-y-4">
              <div className="p-8 border-2 border-dashed border-indigo-300 rounded-2xl bg-indigo-50/50 hover:bg-indigo-50 transition-colors cursor-pointer">
                <FileSpreadsheet className="w-12 h-12 text-indigo-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800">Drag and drop your CSV file here</p>
                <p className="text-[11px] text-slate-500 mt-1">Supports columns: Name, Phone, Email, FeeDue, Date</p>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl text-left text-xs font-medium text-slate-700 space-y-1">
                <p className="font-bold text-slate-900">Sample Rows Preview:</p>
                <p className="font-mono text-[10px] text-slate-600">Jordan Belfort, +1 555-991-8822, $450.00</p>
                <p className="font-mono text-[10px] text-slate-600">Rachel Green, +1 555-441-2099, $0.00</p>
              </div>

              <div className="flex justify-between gap-3 pt-2">
                <button
                  onClick={() => setImportModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCSVImportSimulated}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Confirm & Parse 3 Contacts
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Group Modal */}
      {groupModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold">Create Audience Group Segment</h3>
              <button onClick={() => setGroupModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Group Name</label>
                <input
                  type="text"
                  required
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  placeholder="e.g. Class 10-A Outstanding Fee"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  value={groupDesc}
                  onChange={e => setGroupDesc(e.target.value)}
                  rows={2}
                  placeholder="Target audience details..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Color Badge</label>
                <input
                  type="color"
                  value={groupColor}
                  onChange={e => setGroupColor(e.target.value)}
                  className="w-full h-9 p-1 border border-slate-300 rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGroupModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Create Segment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
