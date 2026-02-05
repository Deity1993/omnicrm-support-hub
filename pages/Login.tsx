import React, { useState } from 'react';
import { Lock, User as UserIcon, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string, password: string) => void;
  error?: string | null;
}

const Login: React.FC<LoginProps> = ({ onLogin, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username.trim(), password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl border shadow-xl p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">OmniCRM Login</h1>
            <p className="text-slate-500 text-sm">Bitte anmelden, um fortzufahren.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold">Benutzername</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold">Passwort</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98]"
          >
            Anmelden
          </button>
        </form>

        <div className="text-xs text-slate-500 bg-slate-50 border rounded-xl p-3">
          Standard-Login (bitte nach dem ersten Login ändern): <span className="font-semibold">admin / admin123</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
