
export enum TicketStatus {
  OPEN = 'Offen',
  IN_PROGRESS = 'In Bearbeitung',
  RESOLVED = 'Gelöst',
  CLOSED = 'Geschlossen'
}

export enum TicketPriority {
  LOW = 'Niedrig',
  MEDIUM = 'Mittel',
  HIGH = 'Hoch',
  URGENT = 'Dringend'
}

export enum CustomerStatus {
  LEAD = 'Lead',
  ACTIVE = 'Aktiv',
  INACTIVE = 'Inaktiv'
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: CustomerStatus;
  createdAt: string;
}

export interface Ticket {
  id: string;
  customerId: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo?: string;
  createdAt: string;
}

export interface AppSettings {
  companyName: string;
  aiSummarizationEnabled: boolean;
  defaultTicketPriority: TicketPriority;
}
