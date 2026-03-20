class StorageManager {
    constructor() {
        this.keys = {
            CLIENTS: 'presto_clients',
            LOANS: 'presto_loans',
            INSTALLMENTS: 'presto_installments',
            CONFIG: 'presto_config',
            EXPENSES: 'presto_expenses'
        };
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.keys.CLIENTS)) localStorage.setItem(this.keys.CLIENTS, JSON.stringify([]));
        if (!localStorage.getItem(this.keys.LOANS)) localStorage.setItem(this.keys.LOANS, JSON.stringify([]));
        if (!localStorage.getItem(this.keys.INSTALLMENTS)) localStorage.setItem(this.keys.INSTALLMENTS, JSON.stringify([]));
        if (!localStorage.getItem(this.keys.EXPENSES)) localStorage.setItem(this.keys.EXPENSES, JSON.stringify([]));
        if (!localStorage.getItem(this.keys.CONFIG)) localStorage.setItem(this.keys.CONFIG, JSON.stringify({
            currency: '$',
            defaultInterest: 20,
            reminders: true
        }));
    }

    // Generic CRUD
    getData(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }

    saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
        window.dispatchEvent(new Event('storage-updated'));
    }

    // Clients
    getClients() { return this.getData(this.keys.CLIENTS); }
    saveClient(client) {
        const clients = this.getClients();
        if (client.id && clients.find(c => c.id === client.id)) {
            const index = clients.findIndex(c => c.id === client.id);
            clients[index] = { ...clients[index], ...client, updatedAt: new Date().toISOString() };
        } else {
            client.id = client.id || Date.now().toString();
            client.createdAt = new Date().toISOString();
            clients.push(client);
        }
        this.saveData(this.keys.CLIENTS, clients);
        return client;
    }
    deleteClient(id) {
        const clients = this.getClients().filter(c => c.id !== id);
        this.saveData(this.keys.CLIENTS, clients);

        const loans = this.getLoans();
        const clientLoans = loans.filter(l => l.clientId === id);
        const clientLoanIds = clientLoans.map(l => l.id);

        this.saveData(this.keys.LOANS, loans.filter(l => l.clientId !== id));
        this.saveData(this.keys.INSTALLMENTS, this.getInstallments().filter(i => !clientLoanIds.includes(i.loanId)));
    }

    // Loans
    getLoans() { return this.getData(this.keys.LOANS); }
    saveLoan(loan) {
        const loans = this.getLoans();
        loan.id = loan.id || Date.now().toString();
        loan.createdAt = loan.createdAt || new Date().toISOString();
        loans.push(loan);
        this.saveData(this.keys.LOANS, loans);
        return loan;
    }
    deleteLoan(id) {
        const loans = this.getLoans().filter(l => l.id !== id);
        this.saveData(this.keys.LOANS, loans);
        const installments = this.getInstallments().filter(i => i.loanId !== id);
        this.saveData(this.keys.INSTALLMENTS, installments);
    }

    // Installments
    getInstallments() { return this.getData(this.keys.INSTALLMENTS); }
    saveInstallments(newInstallments) {
        const installments = this.getInstallments();
        const updated = [...installments, ...newInstallments];
        this.saveData(this.keys.INSTALLMENTS, updated);
    }
    updateInstallment(updatedInstallment) {
        const installments = this.getInstallments();
        const index = installments.findIndex(i => i.id === updatedInstallment.id);
        if (index !== -1) {
            installments[index] = { ...installments[index], ...updatedInstallment };
            this.saveData(this.keys.INSTALLMENTS, installments);
        }
    }

    // Expenses
    getExpenses() { return this.getData(this.keys.EXPENSES); }
    saveExpense(expense) {
        const expenses = this.getExpenses();
        if (expense.id && expenses.find(e => e.id === expense.id)) {
            const index = expenses.findIndex(e => e.id === expense.id);
            expenses[index] = { ...expenses[index], ...expense, updatedAt: new Date().toISOString() };
        } else {
            expense.id = expense.id || Date.now().toString();
            expense.createdAt = new Date().toISOString();
            expenses.push(expense);
        }
        this.saveData(this.keys.EXPENSES, expenses);
        return expense;
    }
    deleteExpense(id) {
        const expenses = this.getExpenses().filter(e => e.id !== id);
        this.saveData(this.keys.EXPENSES, expenses);
    }

    // Configuration
    getConfig() { return JSON.parse(localStorage.getItem(this.keys.CONFIG)); }
    saveConfig(config) { localStorage.setItem(this.keys.CONFIG, JSON.stringify(config)); }

    // Backup & Restore
    exportData() {
        const data = {
            clients: this.getClients(),
            loans: this.getLoans(),
            installments: this.getInstallments(),
            expenses: this.getExpenses(),
            config: this.getConfig()
        };
        return JSON.stringify(data);
    }

    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (data.clients) this.saveData(this.keys.CLIENTS, data.clients);
            if (data.loans) this.saveData(this.keys.LOANS, data.loans);
            if (data.installments) this.saveData(this.keys.INSTALLMENTS, data.installments);
            if (data.expenses) this.saveData(this.keys.EXPENSES, data.expenses);
            if (data.config) this.saveConfig(data.config);
            return true;
        } catch (e) {
            console.error("Failed to import data", e);
            return false;
        }
    }
}

const storage = new StorageManager();
// Exported to global scope for non-module compatibility
window.storage = storage;
