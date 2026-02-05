
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

const INITIAL_CUSTOMERS: Customer[] = [
  { id: '1', name: 'Max Mustermann', company: 'Muster AG', email: 'max@muster.de', phone: '0123-45678', status: CustomerStatus.ACTIVE, createdAt: '2023-10-01' },
  { id: '2', name: 'Erika Schmidt', company: 'Schmidt & Partner', email: 'erika@schmidt.de', phone: '0987-65432', status: CustomerStatus.LEAD, createdAt: '2023-11-15' },
];

const INITIAL_TICKETS: Ticket[] = [
  { id: 't1', customerId: '1', title: 'Login-Probleme', description: 'Kunde kann sich nicht anmelden', status: TicketStatus.OPEN, priority: TicketPriority.HIGH, createdAt: '2024-01-20' },
  { id: 't2', customerId: '2', title: 'Preisanfrage', description: 'Interesse an neuem Software-Modul', status: TicketStatus.IN_PROGRESS, priority: TicketPriority.MEDIUM, createdAt: '2024-01-22' },
];

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
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('omnicrm_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem('omnicrm_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });
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
    localStorage.setItem('omnicrm_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('omnicrm_tickets', JSON.stringify(tickets));
  }, [tickets]);

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

  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCustomers([...customers, newCustomer]);
  };

  const addTicket = (ticket: Omit<Ticket, 'id' | 'createdAt'>) => {
    const newTicket: Ticket = {
      ...ticket,
      id: `t-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTickets([newTicket, ...tickets]);
  };

  const updateTicketStatus = (id: string, status: TicketStatus) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status } : t));
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
