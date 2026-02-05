import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'omnicrm.db');

const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    status TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS tickets (
    id TEXT PRIMARY KEY,
    customerId TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL,
    priority TEXT NOT NULL,
    assignedTo TEXT,
    createdAt TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_tickets_customer ON tickets(customerId);
`);

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/customers', (_req, res) => {
  const rows = db.prepare('SELECT * FROM customers ORDER BY createdAt DESC').all();
  res.json(rows);
});

app.post('/api/customers', (req, res) => {
  const { name, company, email, phone, status, createdAt } = req.body || {};
  if (!name || !company || !email) {
    return res.status(400).json({ error: 'name, company, email required' });
  }
  const id = `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const created = createdAt || new Date().toISOString().split('T')[0];
  const safePhone = phone || '';
  const safeStatus = status || 'Aktiv';

  db.prepare(
    `INSERT INTO customers (id, name, company, email, phone, status, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, name, company, email, safePhone, safeStatus, created);

  const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
  res.status(201).json(customer);
});

app.get('/api/tickets', (_req, res) => {
  const rows = db.prepare('SELECT * FROM tickets ORDER BY createdAt DESC').all();
  res.json(rows);
});

app.post('/api/tickets', (req, res) => {
  const { customerId, title, description, status, priority, assignedTo, createdAt } = req.body || {};
  if (!customerId || !title || !description) {
    return res.status(400).json({ error: 'customerId, title, description required' });
  }
  const id = `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const created = createdAt || new Date().toISOString().split('T')[0];
  const safeStatus = status || 'Offen';
  const safePriority = priority || 'Mittel';

  db.prepare(
    `INSERT INTO tickets (id, customerId, title, description, status, priority, assignedTo, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, customerId, title, description, safeStatus, safePriority, assignedTo || null, created);

  const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
  res.status(201).json(ticket);
});

app.patch('/api/tickets/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  if (!status) {
    return res.status(400).json({ error: 'status required' });
  }
  const result = db.prepare('UPDATE tickets SET status = ? WHERE id = ?').run(status, id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'ticket not found' });
  }
  const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
  res.json(ticket);
});

app.patch('/api/customers/:id', (req, res) => {
  const { id } = req.params;
  const { name, company, email, phone, status } = req.body || {};
  if (!name || !company || !email) {
    return res.status(400).json({ error: 'name, company, email required' });
  }
  const result = db.prepare(
    `UPDATE customers SET name = ?, company = ?, email = ?, phone = ?, status = ? WHERE id = ?`
  ).run(name, company, email, phone || '', status || 'Aktiv', id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'customer not found' });
  }
  const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
  res.json(customer);
});

app.patch('/api/tickets/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, assignedTo } = req.body || {};
  if (!title || !description) {
    return res.status(400).json({ error: 'title, description required' });
  }
  const result = db.prepare(
    `UPDATE tickets SET title = ?, description = ?, status = ?, priority = ?, assignedTo = ? WHERE id = ?`
  ).run(title, description, status || 'Offen', priority || 'Mittel', assignedTo || null, id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'ticket not found' });
  }
  const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
  res.json(ticket);
});

app.delete('/api/customers/:id', (req, res) => {
  const { id } = req.params;
  const result = db.prepare('DELETE FROM customers WHERE id = ?').run(id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'customer not found' });
  }
  res.json({ deleted: id });
});

app.delete('/api/tickets/:id', (req, res) => {
  const { id } = req.params;
  const result = db.prepare('DELETE FROM tickets WHERE id = ?').run(id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'ticket not found' });
  }
  res.json({ deleted: id });
});

app.listen(PORT, () => {
  console.log(`OmniCRM API running on ${PORT}`);
});
