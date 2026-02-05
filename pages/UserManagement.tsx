import React, { useMemo, useState } from 'react';
import { User, SupportSettings, UserStatus } from '../types';
import { Plus, User as UserIcon, ShieldCheck, LifeBuoy, Save, LockKeyhole, Trash2 } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  onAddUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  supportSettings: SupportSettings;
  onSaveSupportSettings: (settings: SupportSettings) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  supportSettings,
  onSaveSupportSettings
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'support'>('users');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    username: '',
    password: '',
    name: '',
    role: 'Support Agent',
    status: 'Aktiv' as UserStatus
  });

  const [supportForm, setSupportForm] = useState<SupportSettings>(supportSettings);

  const canDelete = useMemo(() => users.length > 1, [users.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddUser(form);
    setShowAddModal(false);
    setForm({ username: '', password: '', name: '', role: 'Support Agent', status: 'Aktiv' });
  };

  const handleStatusToggle = (user: User) => {
    const nextStatus: UserStatus = user.status === 'Aktiv' ? 'Gesperrt' : 'Aktiv';
    onUpdateUser({ ...user, status: nextStatus });
  };

  const handleSupportSave = () => {
    onSaveSupportSettings(supportForm);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-slate-500">Benutzer verwalten und Support-Konfiguration pflegen.</p>
        </div>
        {activeTab === 'users' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Plus size={18} /> Neuer Benutzer
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border shadow-sm">
        <div className="flex gap-2 p-3 border-b">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 ${
              activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UserIcon size={18} /> Benutzer
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 ${
              activeTab === 'support' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LifeBuoy size={18} /> Support
          </button>
        </div>

        {activeTab === 'users' ? (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">Benutzer</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">Rolle</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">Status</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">Erstellt</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-600 text-right">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{user.name}</div>
                            <div className="text-xs text-slate-500">@{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{user.role}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          user.status === 'Aktiv' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">{user.createdAt}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleStatusToggle(user)}
                            className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-1"
                          >
                            <LockKeyhole size={14} /> {user.status === 'Aktiv' ? 'Sperren' : 'Aktivieren'}
                          </button>
                          <button
                            disabled={!canDelete}
                            onClick={() => onDeleteUser(user.id)}
                            className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 text-red-600 flex items-center gap-1 disabled:opacity-50"
                          >
                            <Trash2 size={14} /> Entfernen
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="bg-slate-50 border rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-slate-700 font-bold">
                <ShieldCheck size={18} /> Support Einstellungen
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Support E-Mail</label>
                  <input
                    type="email"
                    className="w-full p-3 bg-white border rounded-xl"
                    value={supportForm.supportEmail}
                    onChange={(e) => setSupportForm({ ...supportForm, supportEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Support Telefon</label>
                  <input
                    type="tel"
                    className="w-full p-3 bg-white border rounded-xl"
                    value={supportForm.supportPhone}
                    onChange={(e) => setSupportForm({ ...supportForm, supportPhone: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">SLA (Stunden)</label>
                  <input
                    type="number"
                    min={1}
                    className="w-full p-3 bg-white border rounded-xl"
                    value={supportForm.slaHours}
                    onChange={(e) => setSupportForm({ ...supportForm, slaHours: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Geschäftszeiten</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-white border rounded-xl"
                    placeholder="Mo-Fr 09:00-18:00"
                    value={supportForm.businessHours}
                    onChange={(e) => setSupportForm({ ...supportForm, businessHours: e.target.value })}
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-semibold">Eskalationskontakt</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-white border rounded-xl"
                    placeholder="Name, Rolle oder Kontakt"
                    value={supportForm.escalationContact}
                    onChange={(e) => setSupportForm({ ...supportForm, escalationContact: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSupportSave}
                  className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
                >
                  <Save size={18} /> Support speichern
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border animate-in zoom-in duration-200">
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <h3 className="text-2xl font-bold">Neuen Benutzer anlegen</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Name</label>
                  <input
                    required
                    className="w-full p-3 bg-slate-50 border rounded-xl"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Benutzername</label>
                  <input
                    required
                    className="w-full p-3 bg-slate-50 border rounded-xl"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Passwort</label>
                  <input
                    type="password"
                    required
                    className="w-full p-3 bg-slate-50 border rounded-xl"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold">Rolle</label>
                    <input
                      className="w-full p-3 bg-slate-50 border rounded-xl"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold">Status</label>
                    <select
                      className="w-full p-3 bg-slate-50 border rounded-xl"
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as UserStatus })}
                    >
                      <option value="Aktiv">Aktiv</option>
                      <option value="Gesperrt">Gesperrt</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2.5 font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 font-bold bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95"
                >
                  Erstellen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
