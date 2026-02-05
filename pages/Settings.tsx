
import React, { useState } from 'react';
import { Save, Bell, Shield, Palette, Database } from 'lucide-react';

const SettingsView: React.FC = () => {
  const [config, setConfig] = useState({
    companyName: 'Muster IT Solutions',
    supportEmail: 'support@muster-it.de',
    autoArchive: true,
    aiLevel: 'premium'
  });

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">System Einstellungen</h2>
        <p className="text-slate-500">Konfigurieren Sie Ihr OmniCRM nach Ihren Bedürfnissen.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <nav className="space-y-1">
            <button className="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-bold flex items-center gap-2">
              <Database size={18} /> Allgemein
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-slate-100 text-slate-600 rounded-lg font-medium flex items-center gap-2">
              <Bell size={18} /> Benachrichtigungen
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-slate-100 text-slate-600 rounded-lg font-medium flex items-center gap-2">
              <Shield size={18} /> Sicherheit
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-slate-100 text-slate-600 rounded-lg font-medium flex items-center gap-2">
              <Palette size={18} /> Branding
            </button>
          </nav>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold border-b pb-4">Unternehmensprofil</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Unternehmensname</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-slate-50 border rounded-xl" 
                    value={config.companyName}
                    onChange={e => setConfig({...config, companyName: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Support E-Mail Adresse</label>
                  <input 
                    type="email" 
                    className="w-full p-3 bg-slate-50 border rounded-xl" 
                    value={config.supportEmail}
                    onChange={e => setConfig({...config, supportEmail: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold border-b pb-4">Automatisierung</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">KI-Analysen aktivieren</p>
                  <p className="text-sm text-slate-500">E-Mails automatisch durch Gemini API analysieren lassen.</p>
                </div>
                <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Auto-Archivierung</p>
                  <p className="text-sm text-slate-500">Gelöste Tickets nach 30 Tagen archivieren.</p>
                </div>
                <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                <Save size={20} /> Änderungen speichern
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
