
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Tickets from './pages/Tickets';
import EmailImport from './pages/EmailImport';
import SettingsView from './pages/Settings';
import Login from './pages/Login';
import UserManagement from './pages/UserManagement';
import { Customer, Ticket, CustomerStatus, TicketStatus, TicketPriority, User, SupportSettings } from './types';

const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    username: 'admin',
    password: 'admin123',
    name: 'Admin',
    role: 'Administrator',
    status: 'Aktiv',
    createdAt: '2024-01-01'
  }
];

const DEFAULT_SUPPORT_SETTINGS: SupportSettings = {
  supportEmail: 'support@omnicrm.de',
  supportPhone: '+49 30 1234567',
  slaHours: 24,
  businessHours: 'Mo-Fr 09:00-18:00',
  escalationContact: 'Leitung Support'
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('omnicrm_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  const [supportSettings, setSupportSettings] = useState<SupportSettings>(() => {
    const saved = localStorage.getItem('omnicrm_support_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SUPPORT_SETTINGS;
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('omnicrm_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [customersRes, ticketsRes] = await Promise.all([
          fetch('/api/customers'),
          fetch('/api/tickets')
        ]);
        if (customersRes.ok) {
          const data = await customersRes.json();
          setCustomers(data);
        } else {
          setCustomers([]);
        }
        if (ticketsRes.ok) {
          const data = await ticketsRes.json();
          setTickets(data);
        } else {
          setTickets([]);
        }
      } catch {
        setCustomers([]);
        setTickets([]);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem('omnicrm_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('omnicrm_support_settings', JSON.stringify(supportSettings));
  }, [supportSettings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('omnicrm_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('omnicrm_session');
    }
  }, [currentUser]);

  const addCustomer = async (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer)
    });
    if (response.ok) {
      const newCustomer = await response.json();
      setCustomers(prev => [newCustomer, ...prev]);
      return;
    }
  };

  const addTicket = async (ticket: Omit<Ticket, 'id' | 'createdAt'>) => {
    const response = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket)
    });
    if (response.ok) {
      const newTicket = await response.json();
      setTickets(prev => [newTicket, ...prev]);
      return;
    }
  };

  const updateTicketStatus = async (id: string, status: TicketStatus) => {
    const response = await fetch(`/api/tickets/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (response.ok) {
      const updated = await response.json();
      setTickets(prev => prev.map(t => (t.id === id ? updated : t)));
    }
  };

  const handleLogin = (username: string, password: string) => {
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user || user.password !== password) {
      setLoginError('Benutzername oder Passwort ist falsch.');
      return;
    }
    if (user.status !== 'Aktiv') {
      setLoginError('Dieser Benutzer ist gesperrt.');
      return;
    }
    setLoginError(null);
    setCurrentUser({ ...user, lastLogin: new Date().toISOString().split('T')[0] });
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...user,
      id: `u-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (user: User) => {
    setUsers(prev => prev.map(u => (u.id === user.id ? user : u)));
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard customers={customers} tickets={tickets} />;
      case 'customers':
        return <Customers customers={customers} onAdd={addCustomer} />;
      case 'tickets':
        return <Tickets tickets={tickets} customers={customers} onUpdateStatus={updateTicketStatus} />;
      case 'email-import':
        return <EmailImport onAddTicket={addTicket} customers={customers} onAddCustomer={addCustomer} />;
      case 'user-management':
        return (
          <UserManagement
            users={users}
            onAddUser={addUser}
            onUpdateUser={updateUser}
            onDeleteUser={deleteUser}
            supportSettings={supportSettings}
            onSaveSupportSettings={setSupportSettings}
          />
        );
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard customers={customers} tickets={tickets} />;
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} error={loginError} />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} currentUser={currentUser} onLogout={handleLogout} />
      <main className="flex-1 ml-64 p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
