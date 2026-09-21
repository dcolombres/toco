/**
 * Panel emulado (sin Node). Persistencia en localStorage.
 * Se usa en GitHub Pages o cuando /api no responde.
 * Cuando el backend esté listo, app.js prioriza la API real.
 */
(function (global) {
    const KEY = 'toco_panel_demo_v1';

    function now() {
        return new Date().toISOString();
    }

    function seed() {
        return {
            users: [
                { id: 1, name: 'Admin Demo', email: 'admin@demo.toco', password: 'demo', role: 'admin', stock: 0 },
                { id: 2, name: 'Toker Demo', email: 'toker@demo.toco', password: 'demo', role: 'reseller', stock: 23, referredBy: '' }
            ],
            sales: [
                { id: 1, userId: 2, commerce: 'Kiosco Centro', quantity: 3, price: 5000, profit: 7500, debt: 7500, timestamp: now() },
                { id: 2, userId: 2, commerce: 'Librería Norte', quantity: 2, price: 5000, profit: 5000, debt: 5000, timestamp: now() }
            ],
            requests: [
                { id: 1, userId: 2, quantity: 10, status: 'Pendiente', timestamp: now() }
            ],
            clients: [
                { id: 1, userId: 2, name: 'Kiosco Centro', zone: 'Centro', totalSales: 3 },
                { id: 2, userId: 2, name: 'Librería Norte', zone: 'Norte', totalSales: 2 }
            ],
            payments: [],
            costs: [
                { id: 1, name: 'Listones de madera', type: 'fijo', amount: 0 },
                { id: 2, name: 'Packaging', type: 'variable', amount: 0 }
            ],
            masterStock: 5000,
            settings: {
                factory_cost: '2500',
                reseller_cost: '2500',
                suggested_price: '5000'
            },
            nextIds: { users: 3, sales: 3, requests: 2, clients: 3, payments: 1, costs: 3 }
        };
    }

    function load() {
        try {
            const raw = localStorage.getItem(KEY);
            if (raw) return JSON.parse(raw);
        } catch (_) { /* ignore */ }
        const db = seed();
        save(db);
        return db;
    }

    function save(db) {
        localStorage.setItem(KEY, JSON.stringify(db));
    }

    function nextId(db, kind) {
        const id = db.nextIds[kind] || 1;
        db.nextIds[kind] = id + 1;
        return id;
    }

    function publicUser(u) {
        if (!u) return null;
        const { password, ...rest } = u;
        return rest;
    }

    const PanelDemo = {
        isActive: false,

        activate() {
            this.isActive = true;
            document.documentElement.dataset.tocoDemo = '1';
            return this;
        },

        reset() {
            localStorage.removeItem(KEY);
            return seed();
        },

        login(email, password) {
            const db = load();
            const user = db.users.find(
                (u) => u.email.toLowerCase() === String(email).toLowerCase() && u.password === password
            );
            if (!user) throw new Error('Credenciales inválidas (modo demo)');
            return publicUser(user);
        },

        getSettings() {
            return { ...load().settings };
        },

        updateSettings(settings) {
            const db = load();
            db.settings = { ...db.settings, ...settings };
            save(db);
            return { success: true };
        },

        getResellerData(userId) {
            const db = load();
            const user = db.users.find((u) => u.id === Number(userId));
            return {
                stock: user ? user.stock : 0,
                sales: db.sales.filter((s) => s.userId === Number(userId)).sort((a, b) => b.id - a.id),
                clients: db.clients.filter((c) => c.userId === Number(userId)),
                requests: db.requests.filter((r) => r.userId === Number(userId)).sort((a, b) => b.id - a.id),
                payments: db.payments.filter((p) => p.userId === Number(userId)).sort((a, b) => b.id - a.id)
            };
        },

        getAdminBundle() {
            const db = load();
            return {
                resellers: db.users.filter((u) => u.role === 'reseller').map(publicUser),
                requests: [...db.requests].sort((a, b) => b.id - a.id),
                sales: [...db.sales].sort((a, b) => b.id - a.id),
                costs: [...db.costs],
                payments: [...db.payments].sort((a, b) => b.id - a.id),
                settings: { ...db.settings }
            };
        },

        registerSale(payload) {
            const db = load();
            const user = db.users.find((u) => u.id === Number(payload.userId));
            if (!user) throw new Error('Usuario no encontrado');
            if (user.stock < payload.quantity) throw new Error('Stock insuficiente');
            user.stock -= payload.quantity;
            const sale = {
                id: nextId(db, 'sales'),
                userId: user.id,
                commerce: payload.commerce,
                quantity: payload.quantity,
                price: payload.price,
                profit: payload.profit,
                debt: payload.debt,
                timestamp: now()
            };
            db.sales.push(sale);
            let client = db.clients.find(
                (c) => c.userId === user.id && c.name.toLowerCase() === String(payload.commerce).toLowerCase()
            );
            if (client) client.totalSales += payload.quantity;
            else {
                db.clients.push({
                    id: nextId(db, 'clients'),
                    userId: user.id,
                    name: payload.commerce,
                    zone: '',
                    totalSales: payload.quantity
                });
            }
            save(db);
            return { success: true, sale };
        },

        submitStockRequest(userId, quantity) {
            const db = load();
            const req = {
                id: nextId(db, 'requests'),
                userId: Number(userId),
                quantity: Number(quantity),
                status: 'Pendiente',
                timestamp: now()
            };
            db.requests.push(req);
            save(db);
            return { success: true, request: req };
        },

        addReseller(userData) {
            const db = load();
            if (db.users.some((u) => u.email.toLowerCase() === String(userData.email).toLowerCase())) {
                throw new Error('Email ya existe');
            }
            const user = {
                id: nextId(db, 'users'),
                name: userData.name,
                email: userData.email,
                password: userData.password || 'demo',
                role: 'reseller',
                stock: Number(userData.initialStock || 0),
                referredBy: userData.referredBy || ''
            };
            db.users.push(user);
            save(db);
            return { success: true, id: user.id };
        },

        updateReseller(id, userData) {
            const db = load();
            const user = db.users.find((u) => u.id === Number(id));
            if (!user) throw new Error('No encontrado');
            user.name = userData.name ?? user.name;
            user.email = userData.email ?? user.email;
            if (userData.password && String(userData.password).trim()) user.password = userData.password;
            if (userData.referredBy !== undefined) user.referredBy = userData.referredBy;
            save(db);
            return { success: true };
        },

        deleteReseller(id) {
            const db = load();
            db.users = db.users.filter((u) => !(u.id === Number(id) && u.role === 'reseller'));
            save(db);
            return { success: true };
        },

        getMasterStock() {
            return { quantity: load().masterStock };
        },

        updateMasterStock(amount, action) {
            const db = load();
            const n = Number(amount) || 0;
            if (action === 'set') db.masterStock = n;
            else db.masterStock += n;
            if (db.masterStock < 0) db.masterStock = 0;
            save(db);
            return { success: true, quantity: db.masterStock };
        },

        approveRequest(requestId, userId, quantity) {
            const db = load();
            if (requestId) {
                const req = db.requests.find((r) => r.id === Number(requestId));
                if (req) {
                    req.status = 'Aprobado';
                    userId = req.userId;
                    quantity = req.quantity;
                }
            }
            const user = db.users.find((u) => u.id === Number(userId));
            const qty = Number(quantity) || 0;
            if (user) {
                if (db.masterStock < qty) throw new Error('Stock fábrica insuficiente');
                user.stock += qty;
                db.masterStock -= qty;
            }
            save(db);
            return { success: true };
        },

        rejectRequest(requestId) {
            const db = load();
            const req = db.requests.find((r) => r.id === Number(requestId));
            if (req) req.status = 'Rechazado';
            save(db);
            return { success: true };
        },

        addCost(data) {
            const db = load();
            const cost = {
                id: nextId(db, 'costs'),
                name: data.name,
                type: data.type || 'fijo',
                amount: Number(data.amount) || 0
            };
            db.costs.push(cost);
            save(db);
            return { success: true, id: cost.id };
        },

        updateCost(id, data) {
            const db = load();
            const cost = db.costs.find((c) => c.id === Number(id));
            if (!cost) throw new Error('No encontrado');
            if (data.name !== undefined) cost.name = data.name;
            if (data.amount !== undefined) cost.amount = Number(data.amount);
            if (data.type !== undefined) cost.type = data.type;
            save(db);
            return { success: true };
        },

        deleteCost(id) {
            const db = load();
            db.costs = db.costs.filter((c) => c.id !== Number(id));
            save(db);
            return { success: true };
        },

        addClient(data) {
            const db = load();
            const client = {
                id: nextId(db, 'clients'),
                userId: Number(data.userId),
                name: data.name,
                zone: data.zone || '',
                totalSales: Number(data.totalSales) || 0
            };
            db.clients.push(client);
            save(db);
            return { success: true, id: client.id };
        },

        updateClient(id, data) {
            const db = load();
            const client = db.clients.find((c) => c.id === Number(id));
            if (!client) throw new Error('No encontrado');
            if (data.name !== undefined) client.name = data.name;
            if (data.zone !== undefined) client.zone = data.zone;
            save(db);
            return { success: true };
        },

        deleteClient(id) {
            const db = load();
            db.clients = db.clients.filter((c) => c.id !== Number(id));
            save(db);
            return { success: true };
        },

        submitPayment(data) {
            const db = load();
            const payment = {
                id: nextId(db, 'payments'),
                userId: Number(data.userId),
                amount: Number(data.amount),
                status: 'Pendiente',
                reference: data.reference || '',
                timestamp: now()
            };
            db.payments.push(payment);
            save(db);
            return { success: true, id: payment.id };
        },

        approvePayment(paymentId, status) {
            const db = load();
            const payment = db.payments.find((p) => p.id === Number(paymentId));
            if (payment) payment.status = status || 'Aprobado';
            save(db);
            return { success: true };
        },

        credentialsHint() {
            return {
                admin: { email: 'admin@demo.toco', password: 'demo' },
                toker: { email: 'toker@demo.toco', password: 'demo' }
            };
        }
    };

    global.PanelDemo = PanelDemo;
})(typeof window !== 'undefined' ? window : globalThis);
