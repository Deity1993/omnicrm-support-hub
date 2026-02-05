
import React, { useState } from 'react';
import { parseEmailToTicket } from '../services/geminiService';
import { Customer, CustomerStatus, Ticket, TicketStatus, TicketPriority } from '../types';
import { Sparkles, Mail, Send, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

interface EmailImportProps {
  onAddTicket: (ticket: Omit<Ticket, 'id' | 'createdAt'>) => void;
  onAddCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  customers: Customer[];
}

const EmailImport: React.FC<EmailImportProps> = ({ onAddTicket, onAddCustomer, customers }) => {
  const [emailText, setEmailText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedResult, setParsedResult] = useState<any>(null);
  const [step, setStep] = useState<'input' | 'review'>('input');

  const handleProcess = async () => {
    if (!emailText.trim()) return;
    setIsProcessing(true);
    const result = await parseEmailToTicket(emailText);
    setParsedResult(result);
    setIsProcessing(false);
    setStep('review');
  };

  const handleConfirm = () => {
    // 1. Check if customer exists
    let customer = customers.find(c => c.email.toLowerCase() === (parsedResult.customerEmail || '').toLowerCase());
    
    let customerId = '';
    if (!customer && parsedResult.customerEmail) {
      // Create new customer if not found
      const newCustomer = {
        name: parsedResult.customerName || 'Unbekannter Absender',
        email: parsedResult.customerEmail,
        company: 'Unbekannt (Auto-Import)',
        phone: '',
        status: CustomerStatus.LEAD
      };
      // We simulate adding the customer here and getting an ID
      // In a real app, the parent would return the new ID
      const tempId = `new-${Date.now()}`;
      onAddCustomer(newCustomer);
      customerId = tempId; 
    } else if (customer) {
      customerId = customer.id;
    } else {
      customerId = '1'; // Fallback to first customer for demo
    }

    onAddTicket({
      customerId: customerId,
      title: parsedResult.title,
      description: parsedResult.description,
      status: TicketStatus.OPEN,
      priority: parsedResult.priority || TicketPriority.MEDIUM
    });

    setStep('input');
    setEmailText('');
    setParsedResult(null);
    alert('Ticket erfolgreich aus E-Mail erstellt!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-100">
          <Sparkles size={16} />
          KI-Powered Support
        </div>
        <h2 className="text-4xl font-black tracking-tight text-slate-900">Intelligenter E-Mail Import</h2>
        <p className="text-slate-500 max-w-lg mx-auto">Kopieren Sie den Inhalt einer Support-E-Mail hierher. Unsere KI extrahiert automatisch Kunden und Probleme.</p>
      </header>

      {step === 'input' ? (
        <div className="bg-white p-8 rounded-3xl border shadow-xl space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-bold flex items-center gap-2">
              <Mail size={18} className="text-blue-500" />
              E-Mail Inhalt einfügen
            </label>
            <textarea 
              className="w-full h-64 p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all resize-none font-mono text-sm"
              placeholder="Sehr geehrte Damen und Herren, ich habe ein Problem mit..."
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
            />
          </div>
          <button 
            disabled={isProcessing || !emailText.trim()}
            onClick={handleProcess}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-500/30 transition-all active:scale-[0.98]"
          >
            {isProcessing ? (
              <><Loader2 className="animate-spin" /> Verarbeite mit Gemini AI...</>
            ) : (
              <><Sparkles /> In Ticket umwandeln</>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6 animate-in zoom-in-95 duration-300">
          <div className="bg-white p-8 rounded-3xl border shadow-xl space-y-8">
            <div className="flex justify-between items-center border-b pb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <CheckCircle className="text-emerald-500" />
                Vorschau des extrahierten Tickets
              </h3>
              <button 
                onClick={() => setStep('input')}
                className="text-slate-400 hover:text-slate-900 font-medium"
              >
                Abbrechen
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-400">Extrahiertes Problem</label>
                  <p className="text-xl font-bold">{parsedResult.title}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-400">Beschreibung</label>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">{parsedResult.description}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-400">Erkannter Absender</label>
                  <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl">
                    <p className="font-bold">{parsedResult.customerName || 'Nicht erkannt'}</p>
                    <p className="text-slate-500 text-sm">{parsedResult.customerEmail || 'E-Mail nicht gefunden'}</p>
                    {!parsedResult.customerEmail && (
                      <div className="mt-2 text-xs text-amber-600 flex items-center gap-1 font-medium bg-amber-50 p-2 rounded-lg">
                        <AlertTriangle size={14} /> Manuelle Zuweisung erforderlich
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-400">Dringlichkeit (AI-Vorschlag)</label>
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-2 bg-amber-100 text-amber-700 font-black rounded-xl border border-amber-200 uppercase tracking-widest text-xs">
                      {parsedResult.priority}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t flex gap-4">
              <button 
                onClick={handleConfirm}
                className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98]"
              >
                <Send size={20} /> Ticket jetzt erstellen
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-100/50 p-6 rounded-2xl space-y-2">
          <h4 className="font-bold">Automatisierung</h4>
          <p className="text-xs text-slate-500">Gemini analysiert den Sentiment-Wert und die Dringlichkeit automatisch.</p>
        </div>
        <div className="bg-slate-100/50 p-6 rounded-2xl space-y-2">
          <h4 className="font-bold">Kunden-Abgleich</h4>
          <p className="text-xs text-slate-500">Wenn die E-Mail bekannt ist, wird das Ticket sofort verknüpft.</p>
        </div>
        <div className="bg-slate-100/50 p-6 rounded-2xl space-y-2">
          <h4 className="font-bold">Smart Tags</h4>
          <p className="text-xs text-slate-500">Themen wie "Rechnung", "Login" oder "Bug" werden erkannt.</p>
        </div>
      </div>
    </div>
  );
};

export default EmailImport;
