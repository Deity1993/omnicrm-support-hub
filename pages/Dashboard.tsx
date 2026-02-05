
import React from 'react';
import { Customer, Ticket, TicketStatus } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  Users, 
  Ticket as TicketIcon, 
  AlertCircle, 
  CheckCircle2,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';

interface DashboardProps {
  customers: Customer[];
  tickets: Ticket[];
}

const Dashboard: React.FC<DashboardProps> = ({ customers, tickets }) => {
  const openTickets = tickets.filter(t => t.status === TicketStatus.OPEN).length;
  const resolvedTickets = tickets.filter(t => t.status === TicketStatus.RESOLVED).length;
  
  const statusData = [
    { name: 'Offen', value: tickets.filter(t => t.status === TicketStatus.OPEN).length, color: '#ef4444' },
    { name: 'In Arbeit', value: tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length, color: '#f59e0b' },
    { name: 'Gelöst', value: tickets.filter(t => t.status === TicketStatus.RESOLVED).length, color: '#10b981' },
    { name: 'Geschlossen', value: tickets.filter(t => t.status === TicketStatus.CLOSED).length, color: '#64748b' },
  ];

  const stats = [
    { label: 'Gesamt Kunden', value: customers.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Aktive Tickets', value: tickets.filter(t => t.status !== TicketStatus.CLOSED).length, icon: TicketIcon, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Dringende Fälle', value: tickets.filter(t => t.priority === 'Dringend').length, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Gelöste Tickets', value: resolvedTickets, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Übersicht</h2>
          <p className="text-slate-500 mt-1">Willkommen zurück! Hier ist der aktuelle Status Ihres Unternehmens.</p>
        </div>
        <div className="flex gap-2 text-sm font-medium bg-white p-1 rounded-lg border shadow-sm">
          <button className="px-3 py-1 bg-slate-100 rounded-md">7 Tage</button>
          <button className="px-3 py-1">30 Tage</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
                <ArrowUpRight size={14} className="mr-1" />
                +12%
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold">Ticket Aufkommen</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                Tickets
              </div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border shadow-sm">
          <h3 className="text-xl font-bold mb-8">Status Verteilung</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
            {statusData.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></span>
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
