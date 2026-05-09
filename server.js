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
    db.run(`CREATE TABLE IF NOT EXISTS costs (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, type TEXT, amount REAL)`);
    
    // Nueva tabla para Comunidad TOCO
    db.run(`CREATE TABLE IF NOT EXISTS community_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        imageUrl TEXT, 
        userName TEXT, 
        description TEXT, 
        rating REAL DEFAULT 0, 
        voteCount INTEGER DEFAULT 0,
        isOriginal INTEGER DEFAULT 0,
        isAesthetic INTEGER DEFAULT 0,
        timestamp DATETIME DEFAULT (datetime('now','localtime'))
    )`);

    // Nueva tabla para Votos
    db.run(`CREATE TABLE IF NOT EXISTS community_votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        postId INTEGER,
        rating INTEGER,
        userId TEXT,
        timestamp DATETIME DEFAULT (datetime('now','localtime')),
        FOREIGN KEY(postId) REFERENCES community_posts(id)
    )`);

    db.run(`INSERT OR IGNORE INTO costs (id, name, type, amount) VALUES (1, 'Listones de madera', 'fijo', 0)`);
    db.run(`INSERT OR IGNORE INTO costs (id, name, type, amount) VALUES (2, 'Aceite de Linaza', 'fijo', 0)`);
    db.run(`INSERT OR IGNORE INTO costs (id, name, type, amount) VALUES (3, 'Packaging', 'fijo', 0)`);
    db.run(`INSERT OR IGNORE INTO costs (id, name, type, amount) VALUES (4, 'Inversión Inicial', 'unico', 0)`);
    db.run(`INSERT OR IGNORE INTO master_stock (id, quantity) VALUES (1, 5000)`);
    db.run(`INSERT OR IGNORE INTO users (name, email, password, role) VALUES ('Admin Master', 'admin@toco.com', 'admin123', 'admin')`);

    // Datos de ejemplo para la comunidad (solo si la tabla está vacía)
    db.get("SELECT COUNT(*) as count FROM community_posts", (err, row) => {
        if (row && row.count === 0) {
            const samplePosts = [
                ['https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=800', 'Santi', 'Mi TOCO como soporte de incienso en el estudio.', 4.8, 12, 0, 1],
                ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800', 'Martina', 'Lo uso para que no se me vuelen los bocetos.', 4.5, 8, 1, 0],
                ['https://images.unsplash.com/photo-1544413647-b510493028e1?auto=format&fit=crop&q=80&w=800', 'Lucas', 'Compañero de mates y oficina.', 4.9, 25, 0, 0],
                ['https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&q=80&w=800', 'Elena', 'Intervención artística en mi TOCO.', 5.0, 15, 1, 1]
            ];
            samplePosts.forEach(post => {
                db.run(`INSERT INTO community_posts (imageUrl, userName, description, rating, voteCount, isOriginal, isAesthetic) VALUES (?, ?, ?, ?, ?, ?, ?)`, post);
            });
        }
    });
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

// Toker Data
app.get('/api/reseller/data/:userId', (req, res) => {
    const userId = req.params.userId;
    db.get('SELECT stock FROM users WHERE id = ?', [userId], (err, user) => {
        if (!user) return res.status(404).json({ error: 'Toker no encontrado' });
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

// Clients
app.post('/api/clients', (req, res) => {
    const { userId, name, zone } = req.body;
    db.run('INSERT INTO clients (userId, name, zone) VALUES (?, ?, ?)', [userId, name, zone], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, success: true });
    });
});
app.put('/api/clients/:id', (req, res) => {
    const { name, zone } = req.body;
    db.run('UPDATE clients SET name = ?, zone = ? WHERE id = ?', [name, zone, req.params.id], () => res.json({ success: true }));
});
app.delete('/api/clients/:id', (req, res) => {
    db.run('DELETE FROM clients WHERE id = ?', [req.params.id], () => res.json({ success: true }));
});

// --- ADMIN ENDPOINTS ---

app.get('/api/admin/resellers', (req, res) => {
    db.all('SELECT id, name, email, stock, referredBy FROM users WHERE role = "reseller"', [], (err, rows) => res.json(rows || []));
});

app.get('/api/admin/sales', (req, res) => {
    db.all(`SELECT s.*, u.name as resellerName FROM sales s LEFT JOIN users u ON s.userId = u.id ORDER BY s.timestamp DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows || []);
    });
});

app.get('/api/admin/requests', (req, res) => {
    db.all(`SELECT r.*, u.name as resellerName FROM requests r LEFT JOIN users u ON r.userId = u.id ORDER BY r.timestamp DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows || []);
    });
});

app.post('/api/admin/resellers', (req, res) => {
    const { name, email, password, initialStock = 0 } = req.body;
    db.serialize(() => {
        db.run('INSERT INTO users (name, email, password, role, stock) VALUES (?, ?, ?, "reseller", ?)', [name, email, password || 'toco123', initialStock], function(err) {
            if (err) return res.status(500).json({ error: 'Email ya existe' });
            const newUserId = this.lastID;
            if (initialStock > 0) {
                db.run('UPDATE master_stock SET quantity = quantity - ? WHERE id = 1', [initialStock], () => {
                    res.json({ id: newUserId, success: true });
                });
            } else {
                res.json({ id: newUserId, success: true });
            }
        });
    });
});

app.put('/api/admin/resellers/:id', (req, res) => {
    const { name, email, password } = req.body;
    if (password && password.trim() !== '') {
        db.run('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, password, req.params.id], () => res.json({ success: true }));
    } else {
        db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, req.params.id], () => res.json({ success: true }));
    }
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

app.post('/api/admin/approve-request', (req, res) => {
    const { requestId, userId, quantity } = req.body;
    db.serialize(() => {
        if (requestId) db.run('UPDATE requests SET status = "Entregado" WHERE id = ?', [requestId]);
        db.run('UPDATE users SET stock = stock + ? WHERE id = ?', [quantity, userId]);
        db.run('UPDATE master_stock SET quantity = quantity - ? WHERE id = 1', [quantity], () => res.json({ success: true }));
    });
});

app.post('/api/admin/reject-request', (req, res) => {
    const { requestId } = req.body;
    db.run('UPDATE requests SET status = "Rechazado" WHERE id = ?', [requestId], () => res.json({ success: true }));
});

app.get('/api/admin/costs', (req, res) => {
    db.all('SELECT * FROM costs', [], (err, rows) => res.json(rows || []));
});
app.post('/api/admin/costs', (req, res) => {
    const { name, type = 'variable', amount = 0 } = req.body;
    db.run('INSERT INTO costs (name, type, amount) VALUES (?, ?, ?)', [name, type, amount], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, success: true });
    });
});
app.put('/api/admin/costs/:id', (req, res) => {
    const { name, amount } = req.body;
    db.run('UPDATE costs SET name = ?, amount = ? WHERE id = ?', [name, amount, req.params.id], () => res.json({ success: true }));
});
app.delete('/api/admin/costs/:id', (req, res) => {
    db.run('DELETE FROM costs WHERE id = ?', [req.params.id], () => res.json({ success: true }));
});

app.get('/api/admin/master-stock', (req, res) => {
    db.get('SELECT quantity FROM master_stock WHERE id = 1', [], (err, row) => res.json(row));
});

app.post('/api/admin/master-stock', (req, res) => {
    const { amount, action = 'add' } = req.body;
    if (action === 'set') {
        db.run('UPDATE master_stock SET quantity = ? WHERE id = 1', [amount], () => res.json({ success: true }));
    } else {
        db.run('UPDATE master_stock SET quantity = quantity + ? WHERE id = 1', [amount], () => res.json({ success: true }));
    }
});

// --- COMMUNITY ENDPOINTS ---

app.get('/api/community', (req, res) => {
    db.all('SELECT * FROM community_posts ORDER BY timestamp DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows || []);
    });
});

app.post('/api/community/vote', (req, res) => {
    const { postId, rating, userId } = req.body;
    if (rating < 0 || rating > 5) return res.status(400).json({ error: 'Rating debe ser entre 0 y 5' });

    db.serialize(() => {
        db.run('INSERT INTO community_votes (postId, rating, userId) VALUES (?, ?, ?)', [postId, rating, userId], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            db.get('SELECT AVG(rating) as avgRating, COUNT(*) as count FROM community_votes WHERE postId = ?', [postId], (err, row) => {
                if (err) return res.status(500).json({ error: err.message });
                db.run('UPDATE community_posts SET rating = ?, voteCount = ? WHERE id = ?', [row.avgRating, row.count, postId], () => {
                    res.json({ success: true, newRating: row.avgRating, newCount: row.count });
                });
            });
        });
    });
});

app.post('/api/community/post', (req, res) => {
    const { imageUrl, userName, description, isOriginal = 0, isAesthetic = 0 } = req.body;
    db.run('INSERT INTO community_posts (imageUrl, userName, description, isOriginal, isAesthetic) VALUES (?, ?, ?, ?, ?)', 
        [imageUrl, userName, description, isOriginal, isAesthetic], 
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, id: this.lastID });
        }
    );
});

app.delete('/api/community/post/:id', (req, res) => {
    const id = req.params.id;
    db.serialize(() => {
        db.run('DELETE FROM community_votes WHERE postId = ?', [id]);
        db.run('DELETE FROM community_posts WHERE id = ?', [id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
    });
});

// SERVIR ARCHIVOS ESTÁTICOS
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use(express.static(__dirname));

app.listen(PORT, () => console.log(`Server en http://localhost:${PORT}`));
