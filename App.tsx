
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Tickets from './pages/Tickets';
import EmailImport from './pages/EmailImport';
import SettingsView from './pages/Settings';
import { Customer, Ticket, CustomerStatus, TicketStatus, TicketPriority } from './types';

const INITIAL_CUSTOMERS: Customer[] = [
  { id: '1', name: 'Max Mustermann', company: 'Muster AG', email: 'max@muster.de', phone: '0123-45678', status: CustomerStatus.ACTIVE, createdAt: '2023-10-01' },
  { id: '2', name: 'Erika Schmidt', company: 'Schmidt & Partner', email: 'erika@schmidt.de', phone: '0987-65432', status: CustomerStatus.LEAD, createdAt: '2023-11-15' },
];

const INITIAL_TICKETS: Ticket[] = [
  { id: 't1', customerId: '1', title: 'Login-Probleme', description: 'Kunde kann sich nicht anmelden', status: TicketStatus.OPEN, priority: TicketPriority.HIGH, createdAt: '2024-01-20' },
  { id: 't2', customerId: '2', title: 'Preisanfrage', description: 'Interesse an neuem Software-Modul', status: TicketStatus.IN_PROGRESS, priority: TicketPriority.MEDIUM, createdAt: '2024-01-22' },
];

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

  useEffect(() => {
    localStorage.setItem('omnicrm_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('omnicrm_tickets', JSON.stringify(tickets));
  }, [tickets]);

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
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard customers={customers} tickets={tickets} />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <main className="flex-1 ml-64 p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
