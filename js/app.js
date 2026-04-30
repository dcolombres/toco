/**
 * @file app.js
 * @description Lógica central del Front-End sincronizada con el servidor SQLite.
 */

const TOCO_CONFIG = {
    COST_PER_UNIT: 1000,
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
            const [resResp, reqResp] = await Promise.all([
                fetch(`${TOCO_CONFIG.API_BASE}/admin/resellers`),
                fetch(`${TOCO_CONFIG.API_BASE}/admin/requests`)
            ]);
            this.data.resellers = await resResp.json();
            this.data.requests = await reqResp.json();
        } catch (err) { console.error('Error loadAdminData:', err); }
    },

    getGlobalStats() {
        const resellers = this.data.resellers || [];
        const requests = this.data.requests || [];
        const totalSales = requests.filter(r => r.status === 'Aprobado').reduce((acc, r) => acc + r.quantity, 0);
        return {
            totalResellers: resellers.length,
            totalGlobalSales: totalSales,
            totalGlobalRevenue: totalSales * TOCO_CONFIG.PRICE_PER_UNIT,
            totalGlobalDebt: totalSales * TOCO_CONFIG.COST_PER_UNIT
        };
    },

    isAdmin() { return this.currentUser && this.currentUser.role === 'admin'; },
    isLoggedIn() { return this.currentUser !== null; },
    logout() { localStorage.removeItem('toco_user'); window.location.href = 'login.html'; }
};

const API = {
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

    async updateMasterStock(amount) {
        return await fetch(`${TOCO_CONFIG.API_BASE}/admin/master-stock`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount })
        }).then(r => r.json());
    },

    async approveRequest(requestId, userId, quantity) {
        const resp = await fetch(`${TOCO_CONFIG.API_BASE}/admin/approve-request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requestId, userId, quantity })
        });
        return await resp.json();
    }
};

const UI = {
    formatCurrency(amount) { return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount); },
    formatDate(dateStr) { return new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }); }
};
