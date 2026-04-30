/**
 * @file server.js
 * @description Servidor optimizado para WNPower / cPanel.
 * Gestiona la API REST y la persistencia de datos mediante SQLite.
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// --- BASE DE DATOS ---
const dbPath = path.join(__dirname, 'toco.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Error DB:', err);
    else console.log('✓ DB conectada en:', dbPath);
});

// Inicialización de Tablas
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE, password TEXT, role TEXT DEFAULT 'reseller', stock INTEGER DEFAULT 0)`);
    db.run(`CREATE TABLE IF NOT EXISTS sales (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, commerce TEXT, quantity INTEGER, price INTEGER, profit INTEGER, debt INTEGER, timestamp DATETIME DEFAULT (datetime('now','localtime')))`);
    db.run(`CREATE TABLE IF NOT EXISTS requests (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, quantity INTEGER, status TEXT DEFAULT 'Pendiente', timestamp DATETIME DEFAULT (datetime('now','localtime')))`);
    db.run(`CREATE TABLE IF NOT EXISTS clients (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, name TEXT, zone TEXT, totalSales INTEGER DEFAULT 0)`);
    db.run(`CREATE TABLE IF NOT EXISTS master_stock (id INTEGER PRIMARY KEY CHECK (id = 1), quantity INTEGER DEFAULT 5000)`);
    db.run(`INSERT OR IGNORE INTO master_stock (id, quantity) VALUES (1, 5000)`);
    db.run(`INSERT OR IGNORE INTO users (name, email, password, role) VALUES ('Admin Master', 'admin@toco.com', 'admin123', 'admin')`);
});

// --- API ENDPOINTS ---

// Heartbeat
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
        res.json(user);
    });
});

// Reseller Data
app.get('/api/reseller/data/:userId', (req, res) => {
    const userId = req.params.userId;
    db.get('SELECT stock FROM users WHERE id = ?', [userId], (err, user) => {
        if (!user) return res.status(404).json({ error: 'No user' });
        db.all('SELECT * FROM sales WHERE userId = ? ORDER BY timestamp DESC', [userId], (err, sales) => {
            db.all('SELECT * FROM clients WHERE userId = ?', [userId], (err, clients) => {
                db.all('SELECT * FROM requests WHERE userId = ? ORDER BY timestamp DESC', [userId], (err, requests) => {
                    res.json({ stock: user.stock, sales: sales || [], clients: clients || [], requests: requests || [] });
                });
            });
        });
    });
});

// Sales
app.post('/api/sales', (req, res) => {
    const { userId, commerce, quantity, price, profit, debt } = req.body;
    db.serialize(() => {
        db.run('INSERT INTO sales (userId, commerce, quantity, price, profit, debt) VALUES (?, ?, ?, ?, ?, ?)', [userId, commerce, quantity, price, profit, debt]);
        db.run('UPDATE users SET stock = stock - ? WHERE id = ?', [quantity, userId]);
        db.run('UPDATE clients SET totalSales = totalSales + ? WHERE userId = ? AND name = ?', [quantity, userId, commerce], () => res.json({ success: true }));
    });
});

// Requests
app.post('/api/requests', (req, res) => {
    const { userId, quantity } = req.body;
    db.run('INSERT INTO requests (userId, quantity) VALUES (?, ?)', [userId, quantity], () => res.json({ success: true }));
});

// --- ADMIN ENDPOINTS ---

app.get('/api/admin/resellers', (req, res) => {
    db.all('SELECT id, name, email, stock FROM users WHERE role = "reseller"', [], (err, rows) => res.json(rows || []));
});

app.post('/api/admin/resellers', (req, res) => {
    const { name, email, password } = req.body;
    db.run('INSERT INTO users (name, email, password, role, stock) VALUES (?, ?, ?, "reseller", 0)', [name, email, password || 'toco123'], function(err) {
        if (err) return res.status(500).json({ error: 'Email ya existe' });
        res.json({ id: this.lastID, success: true });
    });
});

app.put('/api/admin/resellers/:id', (req, res) => {
    const { name, email, password } = req.body;
    db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, req.params.id], () => res.json({ success: true }));
});

app.delete('/api/admin/resellers/:id', (req, res) => {
    const id = req.params.id;
    db.serialize(() => {
        db.run('DELETE FROM sales WHERE userId = ?', [id]);
        db.run('DELETE FROM requests WHERE userId = ?', [id]);
        db.run('DELETE FROM clients WHERE userId = ?', [id]);
        db.run('DELETE FROM users WHERE id = ?', [id], () => res.json({ success: true }));
    });
});

app.get('/api/admin/requests', (req, res) => {
    db.all(`SELECT r.*, u.name as resellerName FROM requests r JOIN users u ON r.userId = u.id ORDER BY r.timestamp DESC`, [], (err, rows) => res.json(rows || []));
});

app.post('/api/admin/approve-request', (req, res) => {
    const { requestId, userId, quantity } = req.body;
    db.serialize(() => {
        if (requestId) db.run('UPDATE requests SET status = "Aprobado" WHERE id = ?', [requestId]);
        db.run('UPDATE users SET stock = stock + ? WHERE id = ?', [quantity, userId]);
        db.run('UPDATE master_stock SET quantity = quantity - ? WHERE id = 1', [quantity], () => res.json({ success: true }));
    });
});

app.get('/api/admin/master-stock', (req, res) => {
    db.get('SELECT quantity FROM master_stock WHERE id = 1', [], (err, row) => res.json(row));
});

app.post('/api/admin/master-stock', (req, res) => {
    const { amount } = req.body;
    db.run('UPDATE master_stock SET quantity = quantity + ? WHERE id = 1', [amount], () => res.json({ success: true }));
});

// SERVIR ARCHIVOS ESTÁTICOS (DESPUÉS DE LAS RUTAS API)
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use(express.static(__dirname));

app.listen(PORT, () => console.log(`Server en http://localhost:${PORT}`));
