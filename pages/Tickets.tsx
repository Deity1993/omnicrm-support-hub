
import React, { useState } from 'react';
import { Ticket, Customer, TicketStatus, TicketPriority } from '../types';
import { 
  Clock, 
  User, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Filter,
  Edit2,
  Trash2
} from 'lucide-react';

interface TicketsProps {
  tickets: Ticket[];
  customers: Customer[];
  onUpdateStatus: (id: string, status: TicketStatus) => void;
  onUpdate: (ticket: Ticket) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const Tickets: React.FC<TicketsProps> = ({ tickets, customers, onUpdateStatus, onUpdate, onDelete }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

  const getCustomerName = (id: string) => customers.find(c => c.id === id)?.name || 'Unbekannt';

  const getPriorityStyles = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.URGENT: return 'bg-red-500 text-white';
      case TicketPriority.HIGH: return 'bg-orange-500 text-white';
      case TicketPriority.MEDIUM: return 'bg-amber-500 text-white';
      case TicketPriority.LOW: return 'bg-slate-500 text-white';
    }
  };

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN: return <AlertCircle className="text-blue-500" size={18} />;
      case TicketStatus.IN_PROGRESS: return <Clock className="text-amber-500" size={18} />;
      case TicketStatus.RESOLVED: return <CheckCircle2 className="text-emerald-500" size={18} />;
      case TicketStatus.CLOSED: return <CheckCircle2 className="text-slate-400" size={18} />;
    }
  };

  const handleEdit = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setShowEditModal(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTicket) {
      await onUpdate(editingTicket);
      setShowEditModal(false);
      setEditingTicket(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Sind Sie sicher, dass Sie dieses Ticket löschen möchten?')) {
      await onDelete(id);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Support Tickets</h2>
          <p className="text-slate-500">Überwachen und lösen Sie Kundenanfragen effizient.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border p-2.5 rounded-xl hover:bg-slate-50 transition-all text-slate-600 shadow-sm">
            <Filter size={20} />
          </button>
          <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
            Neues Ticket
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tickets.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <MessageSquare className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-xl font-bold text-slate-600">Keine aktiven Tickets</h3>
            <p className="text-slate-400">Alle Anfragen wurden bearbeitet. Gute Arbeit!</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id} className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-start gap-6 group">
              <div className="mt-1">
                {getStatusIcon(ticket.status)}
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold group-hover:text-blue-600 transition-colors">#{ticket.id} - {ticket.title}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><User size={14} /> {getCustomerName(ticket.customerId)}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {ticket.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getPriorityStyles(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <button 
                      onClick={() => handleEdit(ticket)}
                      className="p-1 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(ticket.id)}
                      className="p-1 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                  {ticket.description}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex -space-x-2">
                    {[1, 2].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold">JD</div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    {ticket.status !== TicketStatus.RESOLVED && (
                      <button 
                        onClick={() => onUpdateStatus(ticket.id, TicketStatus.RESOLVED)}
                        className="text-xs font-bold text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-all"
                      >
                        Als gelöst markieren
                      </button>
                    )}
                    {ticket.status === TicketStatus.OPEN && (
                      <button 
                        onClick={() => onUpdateStatus(ticket.id, TicketStatus.IN_PROGRESS)}
                        className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all"
                      >
                        In Bearbeitung setzen
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showEditModal && editingTicket && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border animate-in zoom-in duration-200">
            <form onSubmit={handleUpdateSubmit} className="p-8 space-y-6">
              <h3 className="text-2xl font-bold">Ticket bearbeiten</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Titel</label>
                  <input required className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" value={editingTicket.title} onChange={e => setEditingTicket({...editingTicket, title: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Beschreibung</label>
                  <textarea required className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none h-24" value={editingTicket.description} onChange={e => setEditingTicket({...editingTicket, description: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold">Status</label>
                    <select className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" value={editingTicket.status} onChange={e => setEditingTicket({...editingTicket, status: e.target.value as TicketStatus})}>
                      <option value={TicketStatus.OPEN}>Offen</option>
                      <option value={TicketStatus.IN_PROGRESS}>In Bearbeitung</option>
                      <option value={TicketStatus.RESOLVED}>Gelöst</option>
                      <option value={TicketStatus.CLOSED}>Geschlossen</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold">Priorität</label>
                    <select className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" value={editingTicket.priority} onChange={e => setEditingTicket({...editingTicket, priority: e.target.value as TicketPriority})}>
                      <option value={TicketPriority.LOW}>Niedrig</option>
                      <option value={TicketPriority.MEDIUM}>Mittel</option>
                      <option value={TicketPriority.HIGH}>Hoch</option>
                      <option value={TicketPriority.URGENT}>Dringend</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Zugewiesen an</label>
                  <input className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" value={editingTicket.assignedTo} onChange={e => setEditingTicket({...editingTicket, assignedTo: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-6 py-2.5 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-all">Abbrechen</button>
                <button type="submit" className="px-6 py-2.5 font-bold bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all">Speichern</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;
