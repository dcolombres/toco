/**
 * @file app.js
 * @description Front-end del panel. Usa API real si /api responde; si no, modo demo (GH Pages).
 */

const TOCO_CONFIG = {
    API_BASE: (window.TOCO_PUBLIC_CONFIG && window.TOCO_PUBLIC_CONFIG.apiBase) || '/api'
};

const Mode = {
    /** null = aún no detectado; true = demo; false = API real */
    demo: null,

    async resolve() {
        if (this.demo !== null) return this.demo;

        const cfg = window.TOCO_PUBLIC_CONFIG || {};
        if (cfg.demoMode === true) {
            this.demo = true;
        } else if (cfg.demoMode === false) {
            this.demo = false;
        } else if (/github\.io$/i.test(location.hostname) || location.protocol === 'file:') {
            this.demo = true;
        } else {
            try {
                const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
                const timer = ctrl ? setTimeout(() => ctrl.abort(), 1500) : null;
                const resp = await fetch(`${TOCO_CONFIG.API_BASE}/health`, {
                    signal: ctrl ? ctrl.signal : undefined,
                    cache: 'no-store'
                });
                if (timer) clearTimeout(timer);
                this.demo = !resp.ok;
            } catch (_) {
                this.demo = true;
            }
        }

        if (this.demo && window.PanelDemo) PanelDemo.activate();
        this.renderBanner();
        return this.demo;
    },

    async isDemo() {
        return await this.resolve();
    },

    renderBanner() {
        if (!this.demo) return;
        if (document.getElementById('toco-demo-banner')) return;
        const el = document.createElement('div');
        el.id = 'toco-demo-banner';
        el.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 z-[200] bg-text-main text-white text-[11px] font-bold tracking-wide uppercase px-4 py-2 rounded-full shadow-lg opacity-90 pointer-events-none';
        el.textContent = 'Panel en modo demo';
        document.body.appendChild(el);
    }
};

const NOTIF_KEY = 'toco_notifications';

const State = {
    currentUser: JSON.parse(localStorage.getItem('toco_user')) || null,
    data: {
        stock: 0,
        earnings: 0,
        debt: 0,
        sales: [],
        clients: [],
        requests: [],
        resellers: [],
        settings: {},
        payments: [],
        costs: [],
        notifications: JSON.parse(localStorage.getItem(NOTIF_KEY) || '[]')
    },

    save() {
        localStorage.setItem(NOTIF_KEY, JSON.stringify(this.data.notifications || []));
    },

    async loadSettings() {
        await Mode.resolve();
        try {
            if (Mode.demo) {
                this.data.settings = PanelDemo.getSettings();
            } else {
                const resp = await fetch(`${TOCO_CONFIG.API_BASE}/settings`);
                this.data.settings = await resp.json();
            }
        } catch (err) {
            console.error('Error loadSettings:', err);
            if (!Mode.demo && window.PanelDemo) {
                Mode.demo = true;
                PanelDemo.activate();
                this.data.settings = PanelDemo.getSettings();
            }
        }
    },

    async loadResellerData() {
        if (!this.currentUser || this.currentUser.role !== 'reseller') return;
        try {
            await this.loadSettings();
            let remote;
            if (Mode.demo) {
                remote = PanelDemo.getResellerData(this.currentUser.id);
            } else {
                const resp = await fetch(`${TOCO_CONFIG.API_BASE}/reseller/data/${this.currentUser.id}`);
                remote = await resp.json();
            }
            this.data.stock = remote.stock || 0;
            this.data.sales = remote.sales || [];
            this.data.clients = remote.clients || [];
            this.data.requests = remote.requests || [];
            this.data.payments = remote.payments || [];
            this.data.earnings = this.data.sales.reduce((acc, s) => acc + s.profit, 0);

            const totalDebt = this.data.sales.reduce((acc, s) => acc + s.debt, 0);
            const totalPaid = this.data.payments
                .filter((p) => p.status === 'Aprobado')
                .reduce((acc, p) => acc + p.amount, 0);
            this.data.debt = totalDebt - totalPaid;
        } catch (err) {
            console.error('Error loadResellerData:', err);
        }
    },

    async loadAdminData() {
        if (!this.currentUser || this.currentUser.role !== 'admin') return;
        try {
            await Mode.resolve();
            if (Mode.demo) {
                const bundle = PanelDemo.getAdminBundle();
                this.data.resellers = bundle.resellers;
                this.data.requests = bundle.requests;
                this.data.sales = bundle.sales;
                this.data.costs = bundle.costs;
                this.data.payments = bundle.payments;
                this.data.settings = bundle.settings;
                return;
            }
            const [resResp, reqResp, salesResp, costsResp, settings, payResp] = await Promise.all([
                fetch(`${TOCO_CONFIG.API_BASE}/admin/resellers`),
                fetch(`${TOCO_CONFIG.API_BASE}/admin/requests`),
                fetch(`${TOCO_CONFIG.API_BASE}/admin/sales`),
                fetch(`${TOCO_CONFIG.API_BASE}/admin/costs`),
                fetch(`${TOCO_CONFIG.API_BASE}/settings`).then((r) => r.json()),
                fetch(`${TOCO_CONFIG.API_BASE}/admin/payments`)
            ]);
            this.data.resellers = await resResp.json();
            this.data.requests = await reqResp.json();
            this.data.sales = await salesResp.json();
            this.data.costs = await costsResp.json();
            this.data.payments = await payResp.json();
            this.data.settings = settings;
        } catch (err) {
            console.error('Error loadAdminData:', err);
        }
    },

    getGlobalStats() {
        const resellers = this.data.resellers || [];
        const sales = this.data.sales || [];
        const costs = this.data.costs || [];
        const settings = this.data.settings || {};
        const payments = this.data.payments || [];

        const totalSales = sales.reduce((acc, s) => acc + s.quantity, 0);
        const ecosystemRevenue = sales.reduce((acc, s) => acc + s.profit, 0);
        const totalGrossDebt = sales.reduce((acc, s) => acc + s.debt, 0);
        const totalPaid = payments.filter((p) => p.status === 'Aprobado').reduce((acc, p) => acc + p.amount, 0);
        const pendingDebt = totalGrossDebt - totalPaid;
        const factoryCostPerUnit = Number(settings.factory_cost || 0);
        const extraCosts = costs.filter((c) => c.type === 'variable').reduce((acc, c) => acc + c.amount, 0);
        const uniqueCost = costs.filter((c) => c.type === 'unico').reduce((acc, c) => acc + c.amount, 0);
        const totalUnitCost = factoryCostPerUnit + extraCosts;
        const globalProductionCost = totalSales * totalUnitCost + uniqueCost;
        const factoryNetProfit = totalGrossDebt - globalProductionCost;

        return {
            totalResellers: resellers.length,
            totalGlobalSales: totalSales,
            ecosystemRevenue,
            globalDebtToFactory: pendingDebt,
            globalProductionCost,
            factoryNetProfit,
            factoryCostPerUnit: totalUnitCost,
            resellerCostPerUnit: Number(settings.reseller_cost || 0),
            uniqueCost
        };
    },

    async submitStockRequest(quantity) {
        if (!this.currentUser) return;
        await API.submitStockRequest(this.currentUser.id, quantity);
        await this.loadResellerData();
    },

    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    },

    getCurrentReseller() {
        return this.currentUser && this.currentUser.role === 'reseller'
            ? { ...this.currentUser, ...this.data }
            : null;
    },

    async registerSale(saleData) {
        if (!this.currentUser) throw new Error('No autenticado');
        if (!this.data.settings.reseller_cost) await this.loadSettings();

        const resellerCost = Number(this.data.settings.reseller_cost || 2500);
        const payload = {
            userId: this.currentUser.id,
            commerce: saleData.commerce,
            quantity: saleData.quantity,
            price: saleData.price,
            profit: (saleData.price - resellerCost) * saleData.quantity,
            debt: resellerCost * saleData.quantity
        };

        await Mode.resolve();
        if (Mode.demo) return PanelDemo.registerSale(payload);

        const resp = await fetch(`${TOCO_CONFIG.API_BASE}/sales`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!resp.ok) throw new Error('Error al registrar venta');
        return await resp.json();
    },

    isLoggedIn() {
        return this.currentUser !== null;
    },

    logout() {
        localStorage.removeItem('toco_user');
        window.location.href = 'login.html';
    }
};

const API = {
    async updateSettings(settings) {
        await Mode.resolve();
        if (Mode.demo) return PanelDemo.updateSettings(settings);
        const resp = await fetch(`${TOCO_CONFIG.API_BASE}/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });
        return await resp.json();
    },

    async submitStockRequest(userId, quantity) {
        await Mode.resolve();
        if (Mode.demo) return PanelDemo.submitStockRequest(userId, quantity);
        const resp = await fetch(`${TOCO_CONFIG.API_BASE}/requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, quantity })
        });
        return await resp.json();
    },

    async login(email, password) {
        await Mode.resolve();
        let user;
        if (Mode.demo) {
            user = PanelDemo.login(email, password);
        } else {
            const resp = await fetch(`${TOCO_CONFIG.API_BASE}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (!resp.ok) throw new Error('Credenciales inválidas');
            user = await resp.json();
        }
        localStorage.setItem('toco_user', JSON.stringify(user));
        State.currentUser = user;
        return user;
    },

    async addReseller(userData) {
        await Mode.resolve();
        if (Mode.demo) return PanelDemo.addReseller(userData);
        const resp = await fetch(`${TOCO_CONFIG.API_BASE}/admin/resellers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return await resp.json();
    },

    async updateReseller(id, userData) {
        await Mode.resolve();
        if (Mode.demo) return PanelDemo.updateReseller(id, userData);
        const resp = await fetch(`${TOCO_CONFIG.API_BASE}/admin/resellers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return await resp.json();
    },

    async deleteReseller(id) {
        await Mode.resolve();
        if (Mode.demo) return PanelDemo.deleteReseller(id);
        return await fetch(`${TOCO_CONFIG.API_BASE}/admin/resellers/${id}`, { method: 'DELETE' }).then((r) =>
            r.json()
        );
    },

    async getMasterStock() {
        await Mode.resolve();
        if (Mode.demo) return PanelDemo.getMasterStock();
        return await fetch(`${TOCO_CONFIG.API_BASE}/admin/master-stock`).then((r) => r.json());
    },

    async updateMasterStock(amount, action = 'add') {
        await Mode.resolve();
        if (Mode.demo) return PanelDemo.updateMasterStock(amount, action);
        return await fetch(`${TOCO_CONFIG.API_BASE}/admin/master-stock`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, action })
        }).then((r) => r.json());
    },

    async approveRequest(requestId, userId, quantity) {
        await Mode.resolve();
        if (Mode.demo) return PanelDemo.approveRequest(requestId, userId, quantity);
        const resp = await fetch(`${TOCO_CONFIG.API_BASE}/admin/approve-request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requestId, userId, quantity })
        });
        return await resp.json();
    },

    async rejectRequest(requestId) {
        await Mode.resolve();
        if (Mode.demo) return PanelDemo.rejectRequest(requestId);
        const resp = await fetch(`${TOCO_CONFIG.API_BASE}/admin/reject-request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requestId })
        });
        return await resp.json();
    },

    async addCost(data) {
        await Mode.resolve();
        if (Mode.demo) return PanelDemo.addCost(data);
        const resp = await fetch(`${TOCO_CONFIG.API_BASE}/admin/costs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await resp.json();
    },

    async updateCost(id, data) {
        await Mode.resolve();
        if (Mode.demo) return PanelDemo.updateCost(id, data);
        const resp = await fetch(`${TOCO_CONFIG.API_BASE}/admin/costs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await resp.json();
    },

    async deleteCost(id) {
        await Mode.resolve();
        if (Mode.demo) return PanelDemo.deleteCost(id);
        return await fetch(`${TOCO_CONFIG.API_BASE}/admin/costs/${id}`, { method: 'DELETE' }).then((r) =>
            r.json()
        );
    },

    async addClient(data) {
        data.userId = State.currentUser.id;
        await Mode.resolve();
        if (Mode.demo) return PanelDemo.addClient(data);
        const resp = await fetch(`${TOCO_CONFIG.API_BASE}/clients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await resp.json();
    },

    async updateClient(id, data) {
        await Mode.resolve();
        if (Mode.demo) return PanelDemo.updateClient(id, data);
        const resp = await fetch(`${TOCO_CONFIG.API_BASE}/clients/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await resp.json();
    },

    async deleteClient(id) {
        await Mode.resolve();
        if (Mode.demo) return PanelDemo.deleteClient(id);
        return await fetch(`${TOCO_CONFIG.API_BASE}/clients/${id}`, { method: 'DELETE' }).then((r) => r.json());
    },

    async submitPayment(data) {
        await Mode.resolve();
        if (Mode.demo) return PanelDemo.submitPayment(data);
        const resp = await fetch(`${TOCO_CONFIG.API_BASE}/payments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await resp.json();
    },

    async approvePayment(paymentId, status) {
        await Mode.resolve();
        if (Mode.demo) return PanelDemo.approvePayment(paymentId, status);
        const resp = await fetch(`${TOCO_CONFIG.API_BASE}/admin/approve-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId, status })
        });
        return await resp.json();
    }
};

const UI = {
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
    },
    formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    async updateDashboard() {
        await State.loadResellerData();
        const stockEl = document.getElementById('stock-count');
        if (stockEl) stockEl.textContent = `${State.data.stock} unidades`;

        const earnEl = document.getElementById('total-earnings');
        if (earnEl) earnEl.textContent = this.formatCurrency(State.data.earnings);

        const debtEl = document.getElementById('total-debt');
        if (debtEl) debtEl.textContent = this.formatCurrency(State.data.debt);

        const debtInfo = document.getElementById('debt-count');
        if (debtInfo) {
            debtInfo.textContent =
                State.data.debt > 0
                    ? `Tenés ${this.formatCurrency(State.data.debt)} por pagar a la fábrica.`
                    : 'las cuentas al día.';
        }

        const salesContainer = document.getElementById('recent-sales');
        if (salesContainer) {
            salesContainer.innerHTML = '';
            const recent = State.data.sales.slice(0, 3);
            if (recent.length === 0) {
                salesContainer.innerHTML =
                    '<div class="p-8 text-center text-text-sec text-sm italic">Aún no registraste ventas</div>';
            }
            recent.forEach((s) => {
                const item = document.createElement('div');
                item.className = 'p-4 border-b border-gray-50 flex justify-between items-center';
                item.innerHTML = `<div><p class="font-bold text-text-main text-sm">${s.quantity} TOCOs a ${s.commerce}</p><p class="text-[10px] text-text-sec">${this.formatDate(s.timestamp)}</p></div><div class="text-right"><p class="text-sm font-bold text-secondary">+${this.formatCurrency(s.profit)}</p></div>`;
                salesContainer.appendChild(item);
            });
        }
    },

    async updateHistory() {
        await State.loadResellerData();
        const reseller = State.getCurrentReseller();
        if (!reseller) return;

        const uTot = document.getElementById('hist-total-units');
        if (uTot) uTot.textContent = reseller.sales.reduce((acc, s) => acc + s.quantity, 0);
        const pTot = document.getElementById('hist-total-profit');
        if (pTot) pTot.textContent = this.formatCurrency(reseller.earnings || 0);
        const dTot = document.getElementById('hist-total-debt');
        if (dTot) dTot.textContent = this.formatCurrency(reseller.debt || 0);

        const list = document.getElementById('history-list');
        if (!list) return;
        list.innerHTML = '';
        if (reseller.sales.length === 0) {
            list.innerHTML =
                '<div class="text-center py-20 text-text-sec italic">No hay ventas registradas todavía.</div>';
        }

        reseller.sales.forEach((s) => {
            const item = document.createElement('div');
            item.className =
                'bg-white p-4 rounded-xl shadow-sm border border-gray-50 mb-3 flex flex-wrap justify-between items-center';
            item.innerHTML = `
                <div>
                    <h3 class="font-bold text-text-main">${s.quantity} TOCOs a ${s.commerce}</h3>
                    <p class="text-xs text-text-sec">${this.formatDate(s.timestamp)}</p>
                </div>
                <div class="text-right">
                    <p class="font-bold text-secondary">+${this.formatCurrency(s.profit)}</p>
                    <p class="text-[10px] text-error uppercase">Deuda: -${this.formatCurrency(s.debt)}</p>
                </div>
            `;
            list.appendChild(item);
        });
    },

    async initResellerStats() {
        await State.loadResellerData();
        const reseller = State.getCurrentReseller();
        if (!reseller) return;

        const totalUnits = reseller.sales.reduce((acc, s) => acc + s.quantity, 0);
        const avgSale = reseller.sales.length ? (totalUnits / reseller.sales.length).toFixed(1) : 0;

        const statUnits = document.getElementById('stat-total-units');
        if (statUnits) statUnits.textContent = totalUnits;
        const statClients = document.getElementById('stat-total-clients');
        if (statClients) statClients.textContent = reseller.clients.length;
        const statAvg = document.getElementById('stat-avg-sale');
        if (statAvg) statAvg.textContent = `${avgSale} u.`;

        const list = document.getElementById('clients-list');
        if (list) {
            list.innerHTML = '';
            if (reseller.clients.length === 0) {
                list.innerHTML = '<p class="text-xs text-text-sec">Sin comercios</p>';
            }
            reseller.clients.slice(0, 5).forEach((c) => {
                const item = document.createElement('div');
                item.className = 'flex justify-between items-center bg-surface p-2 rounded-lg mb-2';
                item.innerHTML = `<span class="text-[11px] font-bold">${c.name}</span> <span class="text-[10px] bg-primary/10 text-primary px-2 rounded-full">${c.totalSales} u.</span>`;
                list.appendChild(item);
            });
        }
    }
};

// Detectar modo al cargar
Mode.resolve();
