
import React from 'react';
import { Ticket, Customer, TicketStatus, TicketPriority } from '../types';
import { 
  Clock, 
  User, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Filter
} from 'lucide-react';

interface TicketsProps {
  tickets: Ticket[];
  customers: Customer[];
  onUpdateStatus: (id: string, status: TicketStatus) => void;
}

const Tickets: React.FC<TicketsProps> = ({ tickets, customers, onUpdateStatus }) => {
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
                    <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                      <MoreVertical size={18} />
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
    </div>
  );
};

export default Tickets;
