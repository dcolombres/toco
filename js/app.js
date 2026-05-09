/**
 * @file app.js
 * @description Lógica central del Front-End sincronizada con el servidor SQLite.
 */

const TOCO_CONFIG = {
    COST_PER_UNIT: 2500,
    PRICE_PER_UNIT: 5000,
    API_BASE: '/api'
};

const State = {
    currentUser: JSON.parse(localStorage.getItem('toco_user')) || null,
    data: { stock: 0, earnings: 0, debt: 0, sales: [], clients: [], requests: [], resellers: [] },

    async loadResellerData() {
        if (!this.currentUser || this.currentUser.role !== 'reseller') return;
        try {
            const resp = await fetch(`${TOCO_CONFIG.API_BASE}/reseller/data/${this.currentUser.id}`);
            const remote = await resp.json();
            this.data.stock = remote.stock || 0;
            this.data.sales = remote.sales || [];
            this.data.clients = remote.clients || [];
            this.data.requests = remote.requests || [];
            this.data.earnings = this.data.sales.reduce((acc, s) => acc + s.profit, 0);
            this.data.debt = this.data.sales.reduce((acc, s) => acc + s.debt, 0);
        } catch (err) { console.error('Error loadResellerData:', err); }
    },

    async loadAdminData() {
        if (!this.currentUser || this.currentUser.role !== 'admin') return;
        try {
            const [resResp, reqResp, salesResp, costsResp] = await Promise.all([
                fetch(`${TOCO_CONFIG.API_BASE}/admin/resellers`),
                fetch(`${TOCO_CONFIG.API_BASE}/admin/requests`),
                fetch(`${TOCO_CONFIG.API_BASE}/admin/sales`),
                fetch(`${TOCO_CONFIG.API_BASE}/admin/costs`)
            ]);
            this.data.resellers = await resResp.json();
            this.data.requests = await reqResp.json();
            this.data.sales = await salesResp.json();
            this.data.costs = await costsResp.json();
        } catch (err) { console.error('Error loadAdminData:', err); }
    },

    getGlobalStats() {
        const resellers = this.data.resellers || [];
        const sales = this.data.sales || [];
        const costs = this.data.costs || [];
        
        const totalSales = sales.reduce((acc, s) => acc + s.quantity, 0);
        const ecosystemRevenue = sales.reduce((acc, s) => acc + s.profit, 0);
        const globalDebtToFactory = sales.reduce((acc, s) => acc + s.debt, 0);
        
        const costPerUnit = costs.filter(c => c.type !== 'unico').reduce((acc, c) => acc + c.amount, 0);
        const uniqueCost = costs.filter(c => c.type === 'unico').reduce((acc, c) => acc + c.amount, 0);
        const globalProductionCost = (totalSales * costPerUnit) + uniqueCost;
        const factoryNetProfit = globalDebtToFactory - globalProductionCost;

        return {
            totalResellers: resellers.length,
            totalGlobalSales: totalSales,
            ecosystemRevenue: ecosystemRevenue,
            globalDebtToFactory: globalDebtToFactory,
            globalProductionCost: globalProductionCost,
            factoryNetProfit: factoryNetProfit,
            costPerUnit: costPerUnit,
            uniqueCost: uniqueCost
        };
    },

    async submitStockRequest(quantity) {
        if (!this.currentUser) return;
        await API.submitStockRequest(this.currentUser.id, quantity);
        this.data.requests.unshift({
            userId: this.currentUser.id,
            quantity: quantity,
            status: 'Pendiente',
            timestamp: new Date().toISOString()
        });
    },

    isAdmin() { return this.currentUser && this.currentUser.role === 'admin'; },
    getCurrentReseller() { return this.currentUser && this.currentUser.role === 'reseller' ? { ...this.currentUser, ...this.data } : null; },
    async registerSale(saleData) {
        if (!this.currentUser) throw new Error("No autenticado");
        const payload = {
            userId: this.currentUser.id,
            commerce: saleData.commerce,
            quantity: saleData.quantity,
            price: saleData.price,
            profit: (saleData.price - TOCO_CONFIG.COST_PER_UNIT) * saleData.quantity,
            debt: TOCO_CONFIG.COST_PER_UNIT * saleData.quantity
        };
        const resp = await fetch(`${TOCO_CONFIG.API_BASE}/sales`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        if (!resp.ok) throw new Error("Error al registrar venta");
        return await resp.json();
    },
    isLoggedIn() { return this.currentUser !== null; },
    logout() { localStorage.removeItem('toco_user'); window.location.href = 'login.html'; }
};

const API = {
    async submitStockRequest(userId, quantity) {
        const resp = await fetch(`${TOCO_CONFIG.API_BASE}/requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, quantity })
        });
        return await resp.json();
    },

    async login(email, password) {
        const resp = await fetch(`${TOCO_CONFIG.API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!resp.ok) throw new Error('Credenciales inválidas');
        const user = await resp.json();
        localStorage.setItem('toco_user', JSON.stringify(user));
        State.currentUser = user;
        return user;
    },

    async addReseller(userData) {
        const resp = await fetch(`${TOCO_CONFIG.API_BASE}/admin/resellers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return await resp.json();
    },

    async updateReseller(id, userData) {
        const resp = await fetch(`${TOCO_CONFIG.API_BASE}/admin/resellers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return await resp.json();
    },

    async deleteReseller(id) {
        return await fetch(`${TOCO_CONFIG.API_BASE}/admin/resellers/${id}`, { method: 'DELETE' }).then(r => r.json());
    },

    async getMasterStock() {
        return await fetch(`${TOCO_CONFIG.API_BASE}/admin/master-stock`).then(r => r.json());
    },

    async updateMasterStock(amount, action = 'add') {
        return await fetch(`${TOCO_CONFIG.API_BASE}/admin/master-stock`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, action })
        }).then(r => r.json());
    },

    async approveRequest(requestId, userId, quantity) {
        const resp = await fetch(`${TOCO_CONFIG.API_BASE}/admin/approve-request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requestId, userId, quantity })
        });
        return await resp.json();
    },

    async rejectRequest(requestId) {
        const resp = await fetch(`${TOCO_CONFIG.API_BASE}/admin/reject-request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requestId })
        });
        return await resp.json();
    },

    async addCost(data) {
        const resp = await fetch(`${TOCO_CONFIG.API_BASE}/admin/costs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await resp.json();
    },

    async updateCost(id, data) {
        const resp = await fetch(`${TOCO_CONFIG.API_BASE}/admin/costs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await resp.json();
    },

    async deleteCost(id) {
        return await fetch(`${TOCO_CONFIG.API_BASE}/admin/costs/${id}`, { method: 'DELETE' }).then(r => r.json());
    },

    async addClient(data) {
        data.userId = State.currentUser.id;
        const resp = await fetch(`${TOCO_CONFIG.API_BASE}/clients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await resp.json();
    },

    async updateClient(id, data) {
        const resp = await fetch(`${TOCO_CONFIG.API_BASE}/clients/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await resp.json();
    },

    async deleteClient(id) {
        return await fetch(`${TOCO_CONFIG.API_BASE}/clients/${id}`, { method: 'DELETE' }).then(r => r.json());
    }
};

const UI = {
    formatCurrency(amount) { return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount); },
    formatDate(dateStr) { return new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }); },

    async updateDashboard() {
        await State.loadResellerData();
        const stockEl = document.getElementById('stock-count');
        if (stockEl) stockEl.textContent = `${State.data.stock} unidades`;
        
        const earnEl = document.getElementById('total-earnings');
        if (earnEl) earnEl.textContent = this.formatCurrency(State.data.earnings);
        
        const debtEl = document.getElementById('total-debt');
        if (debtEl) debtEl.textContent = this.formatCurrency(State.data.debt);
        
        const debtInfo = document.getElementById('debt-count');
        if (debtInfo) debtInfo.textContent = `Tenés ${State.data.debt > 0 ? this.formatCurrency(State.data.debt) + ' por pagar a la fábrica.' : 'las cuentas al día.'}`;

        const salesContainer = document.getElementById('recent-sales');
        if (salesContainer) {
            salesContainer.innerHTML = '';
            const recent = State.data.sales.slice(0, 3);
            if (recent.length === 0) salesContainer.innerHTML = '<div class="p-8 text-center text-text-sec text-sm italic">Aún no registraste ventas</div>';
            recent.forEach(s => {
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
        if (reseller.sales.length === 0) list.innerHTML = '<div class="text-center py-20 text-text-sec italic">No hay ventas registradas todavía.</div>';
        
        reseller.sales.forEach(s => {
            const item = document.createElement('div');
            item.className = 'bg-white p-4 rounded-xl shadow-sm border border-gray-50 mb-3 flex flex-wrap justify-between items-center';
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
            reseller.clients.slice(0, 5).forEach(c => {
                const item = document.createElement('div');
                item.className = 'flex justify-between items-center bg-surface p-2 rounded-lg mb-2';
                item.innerHTML = `<span class="text-[11px] font-bold">${c.name}</span> <span class="text-[10px] bg-primary/10 text-primary px-2 rounded-full">${c.totalSales} u.</span>`;
                list.appendChild(item);
            });
        }
    }
};
