import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, User } from '../../types';
import { UserAvatar } from '../common/UserAvatar';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Trash2, 
  X, 
  Mail, 
  Activity, 
  CheckCircle, 
  UserCheck, 
  AlertCircle, 
  Phone, 
  Send, 
  Power,
  ShieldAlert,
  Search
} from 'lucide-react';

export const StaffTab: React.FC = () => {
  const { users, addStaffUser, toggleUserStatus, deleteUser, activityLogs, addNotification, business } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'staff'>('all');

  // New staff form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('staff');
  const [sendEmailInvite, setSendEmailInvite] = useState(true);

  const [notificationMsg, setNotificationMsg] = useState('');

  // Count admins & staff
  const adminsCount = users.filter(u => u.role === 'business_admin' || u.role === 'super_admin').length;
  const staffCount = users.filter(u => u.role === 'staff').length;

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    // Validate Gmail / Email
    const cleanEmail = email.trim().toLowerCase();
    
    await addStaffUser({
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      role: role,
      businessId: business.id || 'biz-1',
      businessName: business.name || 'My Business Workspace',
      status: 'active',
      avatar: '',
      createdAt: new Date().toISOString().split('T')[0],
    });

    if (sendEmailInvite) {
      addNotification({
        title: 'Staff Invitation Email Sent',
        message: `An invitation email was dispatched to ${cleanEmail} for access as ${role === 'staff' ? 'Staff Member' : 'Business Admin'}.`,
        type: 'success',
        timestamp: 'Just now',
        linkTab: 'staff',
      });
    }

    setNotificationMsg(`Added ${name} (${cleanEmail}) as ${role === 'staff' ? 'Staff' : 'Admin'}${sendEmailInvite ? ' & sent email invitation' : ''}.`);
    setTimeout(() => setNotificationMsg(''), 4000);

    setName('');
    setEmail('');
    setPhone('');
    setRole('staff');
    setModalOpen(false);
  };

  const handleResendInvite = (staffEmail: string, staffName: string) => {
    addNotification({
      title: 'Gmail Login Invite Resent',
      message: `Login & magic access link resent to ${staffEmail}.`,
      type: 'info',
      timestamp: 'Just now',
      linkTab: 'staff',
    });
    setNotificationMsg(`Resent invitation email to ${staffName} (${staffEmail})`);
    setTimeout(() => setNotificationMsg(''), 4000);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterRole === 'admin') return matchesSearch && (u.role === 'business_admin' || u.role === 'super_admin');
    if (filterRole === 'staff') return matchesSearch && u.role === 'staff';
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E2DA]">
        <div>
          <h2 className="text-2xl font-extrabold text-[#2D302D] tracking-tight">Team Accounts & Staff Roles</h2>
          <p className="text-xs text-[#8A857C] mt-0.5">
            Manage your organization's Admin and Staff member access with Gmail/email login capabilities.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-[#8A9A5B] hover:bg-[#78884B] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-2xs cursor-pointer active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Success Banner */}
      {notificationMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-medium flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#E5E2DA] shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#8A9A5B]/10 text-[#8A9A5B] flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#8A857C]">Total Team Accounts</p>
            <p className="text-xl font-extrabold text-[#2D302D]">{users.length}</p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5E2DA] shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#8A857C]">Business Admin Role</p>
            <p className="text-xl font-extrabold text-[#2D302D]">{adminsCount}</p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5E2DA] shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#8A857C]">Staff Member Role</p>
            <p className="text-xl font-extrabold text-[#2D302D]">{staffCount}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Users Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E2DA] shadow-2xs overflow-hidden flex flex-col">
          {/* Table Toolbar */}
          <div className="p-4 border-b border-[#F2F0EB] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search staff by name or Gmail..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-[#E5E2DA] focus:border-[#8A9A5B] rounded-xl text-xs outline-none bg-[#F9F8F6]/50"
              />
              <Search className="w-3.5 h-3.5 text-[#8A857C] absolute left-2.5 top-2.5" />
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <button
                onClick={() => setFilterRole('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  filterRole === 'all' ? 'bg-[#2D302D] text-white' : 'bg-[#F2F0EB] text-[#2D302D] hover:bg-[#E5E2DA]'
                }`}
              >
                All ({users.length})
              </button>
              <button
                onClick={() => setFilterRole('admin')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  filterRole === 'admin' ? 'bg-[#2D302D] text-white' : 'bg-[#F2F0EB] text-[#2D302D] hover:bg-[#E5E2DA]'
                }`}
              >
                Admins ({adminsCount})
              </button>
              <button
                onClick={() => setFilterRole('staff')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  filterRole === 'staff' ? 'bg-[#2D302D] text-white' : 'bg-[#F2F0EB] text-[#2D302D] hover:bg-[#E5E2DA]'
                }`}
              >
                Staff ({staffCount})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F9F8F6] border-b border-[#E5E2DA] text-[#8A857C] font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Gmail / Email</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F0EB]">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#8A857C]">
                      No team members found. Click "Add Staff Member" to invite staff.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(u => {
                    const isAdmin = u.role === 'business_admin' || u.role === 'super_admin';
                    const isCurrent = u.id === users[0]?.id;

                    return (
                      <tr key={u.id} className="hover:bg-[#F9F8F6]/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <UserAvatar name={u.name} avatar={u.avatar} size="md" />
                            <div>
                              <p className="font-bold text-[#2D302D] flex items-center gap-1.5">
                                <span>{u.name}</span>
                                {isCurrent && (
                                  <span className="px-1.5 py-0.2 bg-[#8A9A5B]/15 text-[#8A9A5B] text-[9px] font-bold rounded">You</span>
                                )}
                              </p>
                              {u.phone && <p className="text-[10px] text-[#8A857C]">{u.phone}</p>}
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          {isAdmin ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                              <ShieldCheck className="w-3 h-3 text-amber-600" />
                              <span>Admin</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg bg-sky-50 text-sky-800 border border-sky-200">
                              <UserCheck className="w-3 h-3 text-sky-600" />
                              <span>Staff</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 font-mono text-[#2D302D] text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-[#8A857C] shrink-0" />
                            <span className="truncate max-w-[180px]">{u.email}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                            u.status === 'active' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {u.status || 'active'}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Resend Gmail Invite */}
                            <button
                              onClick={() => handleResendInvite(u.email, u.name)}
                              title="Resend Gmail Invite / Magic Link"
                              className="p-1.5 text-[#8A857C] hover:text-[#8A9A5B] hover:bg-[#F2F0EB] rounded-lg transition-colors cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>

                            {/* Toggle Status (Active/Inactive) */}
                            {!isCurrent && (
                              <button
                                onClick={() => toggleUserStatus(u.id)}
                                title={u.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  u.status === 'active'
                                    ? 'text-[#8A857C] hover:text-amber-700 hover:bg-amber-50'
                                    : 'text-emerald-600 hover:bg-emerald-50'
                                }`}
                              >
                                <Power className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Delete User */}
                            {!isCurrent && (
                              <button
                                onClick={() => {
                                  if (confirm(`Remove ${u.name} (${u.email}) from team accounts?`)) {
                                    deleteUser(u.id);
                                  }
                                }}
                                title="Remove Team Member"
                                className="p-1.5 text-[#8A857C] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
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

        {/* Security Audit Log Stream */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E2DA] shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F2F0EB]">
            <Activity className="w-4 h-4 text-[#8A9A5B]" />
            <h3 className="text-sm font-bold text-[#2D302D]">Security Audit Stream</h3>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {activityLogs.length === 0 ? (
              <p className="text-xs text-[#8A857C] py-4 text-center">No security logs recorded yet.</p>
            ) : (
              activityLogs.slice(0, 12).map(log => (
                <div key={log.id} className="p-2.5 bg-[#F9F8F6] rounded-xl border border-[#F2F0EB] text-xs space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold text-[#8A857C]">
                    <span className="truncate max-w-[130px]">{log.userEmail || log.userName || 'System'}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="font-bold text-[#2D302D]">{log.action}</p>
                  <p className="text-[11px] text-[#8A857C]">{log.details}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#2D302D]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E5E2DA] overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-[#2D302D] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#8A9A5B]" />
                <h3 className="text-sm font-bold">Add Staff Member Account</h3>
              </div>
              <button 
                onClick={() => setModalOpen(false)} 
                className="text-[#8A857C] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="p-6 space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#2D302D] mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3.5 py-2 border border-[#E5E2DA] focus:border-[#8A9A5B] rounded-xl text-xs outline-none bg-[#F9F8F6]/50 focus:bg-white"
                />
              </div>

              {/* Gmail / Email Address */}
              <div>
                <label className="block text-xs font-bold text-[#2D302D] mb-1">
                  Gmail / Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="sarah.jenkins@gmail.com"
                    className="w-full pl-9 pr-3.5 py-2 border border-[#E5E2DA] focus:border-[#8A9A5B] rounded-xl text-xs outline-none bg-[#F9F8F6]/50 focus:bg-white"
                  />
                  <Mail className="w-4 h-4 text-[#8A857C] absolute left-3 top-2.5" />
                </div>
                <p className="text-[10px] text-[#8A857C] mt-1">
                  Staff member will log in using this Gmail/email address.
                </p>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-[#2D302D] mb-1">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 555-0199"
                    className="w-full pl-9 pr-3.5 py-2 border border-[#E5E2DA] focus:border-[#8A9A5B] rounded-xl text-xs font-mono outline-none bg-[#F9F8F6]/50 focus:bg-white"
                  />
                  <Phone className="w-4 h-4 text-[#8A857C] absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Access Role */}
              <div>
                <label className="block text-xs font-bold text-[#2D302D] mb-1">
                  Access Role
                </label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2 border border-[#E5E2DA] focus:border-[#8A9A5B] rounded-xl text-xs outline-none bg-white font-bold text-[#2D302D]"
                >
                  <option value="staff">Staff Member (Broadcast messages, view directory, trigger campaigns)</option>
                  <option value="business_admin">Business Admin (Full workspace controls, billing & team management)</option>
                </select>
              </div>

              {/* Checkbox send email invite */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sendEmailInvite}
                    onChange={e => setSendEmailInvite(e.target.checked)}
                    className="w-4 h-4 rounded text-[#8A9A5B] focus:ring-[#8A9A5B]"
                  />
                  <span className="text-xs font-medium text-[#2D302D]">
                    Send Gmail / Email invitation link to staff member
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-[#F2F0EB]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#E5E2DA] text-[#2D302D] rounded-xl text-xs font-bold hover:bg-[#F2F0EB] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#8A9A5B] hover:bg-[#78884B] text-white rounded-xl text-xs font-bold shadow-2xs transition-all active:scale-95"
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

