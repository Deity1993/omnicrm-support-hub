
import React, { useState } from 'react';
import { Customer, CustomerStatus } from '../types';
import { Search, UserPlus, MoreHorizontal, Mail, Phone, Building2 } from 'lucide-react';

interface CustomersProps {
  customers: Customer[];
  onAdd: (customer: Omit<Customer, 'id' | 'createdAt'>) => Promise<void> | void;
}

const Customers: React.FC<CustomersProps> = ({ customers, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '', company: '', email: '', phone: '', status: CustomerStatus.ACTIVE
  });

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAdd(newCustomer);
    setShowAddModal(false);
    setNewCustomer({ name: '', company: '', email: '', phone: '', status: CustomerStatus.ACTIVE });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kundenstamm</h2>
          <p className="text-slate-500">Verwalten Sie Ihre Kontakte und Unternehmensprofile.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <UserPlus size={20} />
          Neuer Kunde
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Suchen nach Name, Firma oder E-Mail..." 
            className="w-full pl-10 pr-4 py-2 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Kunde</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Firma</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Erstellt am</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{customer.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Mail size={12} /> {customer.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Building2 size={16} />
                    {customer.company}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    customer.status === CustomerStatus.ACTIVE ? 'bg-emerald-50 text-emerald-700' :
                    customer.status === CustomerStatus.LEAD ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {customer.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {customer.createdAt}
                </td>
                <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border animate-in zoom-in duration-200">
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <h3 className="text-2xl font-bold">Neuen Kunden anlegen</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Name</label>
                  <input required className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Firma</label>
                  <input required className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" value={newCustomer.company} onChange={e => setNewCustomer({...newCustomer, company: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold">E-Mail</label>
                    <input type="email" required className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold">Telefon</label>
                    <input className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Status</label>
                  <select className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" value={newCustomer.status} onChange={e => setNewCustomer({...newCustomer, status: e.target.value as CustomerStatus})}>
                    <option value={CustomerStatus.ACTIVE}>Aktiv</option>
                    <option value={CustomerStatus.LEAD}>Lead</option>
                    <option value={CustomerStatus.INACTIVE}>Inaktiv</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-2.5 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-all">Abbrechen</button>
                <button type="submit" className="px-6 py-2.5 font-bold bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all">Erstellen</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
