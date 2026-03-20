// app.js - Non-module version using global scope
class App {
    constructor() {
        this.contentArea = document.getElementById('app-content');
        this.modalContainer = document.getElementById('modal-container');
        this.modalContent = document.getElementById('modal-content');
        this.currentView = 'dashboard';
        this.audioCtx = null; // For sound notifications

        window.addEventListener('hashchange', () => this.handleRouting());
        window.addEventListener('storage-updated', () => this.refreshView());
        document.getElementById('modal-overlay').addEventListener('click', () => this.hideModal());

        this.init();
    }

    init() {
        if (storage.getClients().length === 0) {
            this.seedData();
        }
        this.handleRouting();
    }

    seedData() {
        // Esta función se deja vacía intencionalmente para que la aplicación
        // inicie sin datos de demostración.
    }

    handleRouting() {
        const hash = window.location.hash.replace('#', '');
        const parts = hash.split('/');
        this.currentView = parts[0] || 'dashboard';
        const param = parts[1] || null;

        this.renderView(this.currentView, param);
        this.updateNav();
    }

    refreshView() {
        this.handleRouting();
    }

    renderView(view, param) {
        let html = '';
        switch (view) {
            case 'dashboard': {
                const loans = storage.getLoans();
                const installments = storage.getInstallments();
                const kpis = LoanLogic.getGlobalKPIs(loans, installments);
                const notifCount = installments.filter(i => i.status !== 'paid' && i.dueDate <= new Date().toISOString().split('T')[0]).length;

                // Vibrate or sound if overdue items exist
                if (kpis.overdueCount > 0) {
                    // 1. Vibrate (if supported on device)
                    if ('vibrate' in navigator) {
                        navigator.vibrate([150, 50, 150]); // Vibrate pattern: short, pause, short
                    }
                    // 2. Play a subtle sound
                    this.playNotificationSound();
                }

                html = Views.dashboard(kpis, notifCount);
                break;
            }
            case 'clients': {
                html = Views.clientList(storage.getClients());
                break;
            }
            case 'clientProfile': {
                const client = storage.getClients().find(c => c.id === param);
                const loans = storage.getLoans().filter(l => l.clientId === param);
                html = Views.clientProfile(client, loans);
                break;
            }
            case 'loans': {
                // Ahora pasamos todos los datos para el Reporte Financiero
                html = Views.financialReport({
                    loans: storage.getLoans(),
                    clients: storage.getClients(),
                    installments: storage.getInstallments()
                });
                break;
            }
            case 'agenda': {
                const allInst = storage.getInstallments();
                const loansRef = storage.getLoans();
                const clientsRef = storage.getClients();

                const today = new Date().toISOString().split('T')[0];
                const agendaItems = {
                    today: [],
                    overdue: [],
                    upcoming: []
                };

                // Ordenar por fecha (ascendente)
                allInst.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

                allInst.forEach(inst => {
                    if (inst.status === 'paid') return;

                    const loan = loansRef.find(l => l.id === inst.loanId);
                    if (!loan) return;
                    const client = clientsRef.find(c => c.id === loan.clientId);
                    const item = { ...inst, clientName: client ? client.name : 'Desconocido' };

                    if (inst.dueDate === today) {
                        agendaItems.today.push(item);
                    } else if (inst.dueDate < today) {
                        agendaItems.overdue.push(item);
                    } else {
                        agendaItems.upcoming.push(item);
                    }
                });
                html = Views.agenda(agendaItems);
                break;
            }
            case 'reports': {
                const loans = storage.getLoans();
                const installments = storage.getInstallments();
                const clients = storage.getClients();

                // CORRECCIÓN: Saldo pendiente = Total Esperado (Capital+Interés) - Total Cobrado
                const totalExpected = installments.reduce((s, i) => s + i.amount, 0);
                const totalCollected = installments.reduce((s, i) => s + i.paidAmount, 0);
                const capitalInStreet = totalExpected - totalCollected;

                const totalInterest = loans.reduce((s, l) => s + (l.amount * (l.interestRate / 100)), 0);
                const recentPayments = installments
                    .filter(i => i.paidAmount > 0)
                    .sort((a, b) => new Date(b.paidDate) - new Date(a.paidDate))
                    .slice(0, 10)
                    .map(i => {
                        const l = loans.find(ln => ln.id === i.loanId);
                        return {
                            clientName: clients.find(c => c.id === l.clientId)?.name || 'Desconocido',
                            amount: i.paidAmount,
                            date: i.paidDate?.split('T')[0]
                        };
                    });

                html = Views.reports({ capitalInStreet, totalInterest, recentPayments });
                break;
            }
            case 'expenses': {
                const period = param || 'todos';
                const expenses = storage.getExpenses();
                const filtered = this.getFilteredExpenses(expenses, period);
                html = Views.expenses(filtered, period);
                break;
            }
            case 'settings': {
                html = Views.settings(storage.getConfig());
                break;
            }
            default:
                html = '<div class="p-10 text-center">Vista no encontrada</div>';
        }
        this.contentArea.innerHTML = html;
        this.attachViewEvents();
    }

    updateNav() {
        document.querySelectorAll('.nav-link').forEach(link => {
            const view = link.getAttribute('data-view');
            const isSelected = this.currentView === view;
            link.classList.toggle('text-primary', isSelected);
            link.classList.toggle('text-slate-400', !isSelected);
            const icon = link.querySelector('.material-symbols-outlined');
            if (icon) icon.classList.toggle('fill-1', isSelected);
        });
    }

    // Feature Methods
    confirmClientDeletion(id) {
        this.showModal('notification', {
            icon: 'warning',
            iconClass: 'text-red-500',
            title: '¿Eliminar Cliente?',
            message: 'Esta acción no se puede deshacer. Se borrarán todos los préstamos y pagos asociados.',
            actions: [
                { text: 'Confirmar Eliminación', class: 'bg-red-600 text-white', onClick: `app.performClientDeletion('${id}')` },
                { text: 'Cancelar', class: 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200', onClick: 'app.hideModal()' }
            ]
        });
    }

    performClientDeletion(id) {
        storage.deleteClient(id);
        this.navigate('clients');
        // Reutilizamos el modal abierto para mostrar el mensaje de éxito
        const successConfig = {
            icon: 'check_circle',
            iconClass: 'text-emerald-500',
            title: 'Cliente Eliminado',
            message: 'El cliente y todos sus datos han sido eliminados con éxito.',
            actions: [
                { text: 'Aceptar', class: 'bg-primary text-white', onClick: 'app.hideModal()' }
            ]
        };
        this.modalContent.innerHTML = Views.modals.notification(successConfig);
    }

    confirmDeleteAllClients() {
        this.showModal('notification', {
            icon: 'warning',
            iconClass: 'text-red-500',
            title: '¿Eliminar TODO?',
            message: 'Esta acción borrará TODOS los clientes, préstamos y pagos registrados. No se puede deshacer.',
            actions: [
                { text: 'Sí, Eliminar Todo', class: 'bg-red-600 text-white', onClick: 'app.performDeleteAllClients()' },
                { text: 'Cancelar', class: 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200', onClick: 'app.hideModal()' }
            ]
        });
    }

    performDeleteAllClients() {
        const clients = storage.getClients();
        clients.forEach(c => storage.deleteClient(c.id));
        this.refreshView();
        this.modalContent.innerHTML = Views.modals.notification({ icon: 'delete_forever', iconClass: 'text-slate-500', title: 'Datos Eliminados', message: 'Se han eliminado todos los clientes del sistema.', actions: [{ text: 'Aceptar', class: 'bg-primary text-white', onClick: 'app.hideModal()' }] });
    }

    exportData() {
        const data = storage.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `presto_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    }

    // Expense Methods
    filterExpenses(period) {
        this.navigate('expenses', period);
    }

    getFilteredExpenses(expenses, period) {
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        return expenses.filter(e => {
            const expDate = new Date(e.date);
            switch (period) {
                case 'hoy':
                    return e.date === today;
                case 'semana':
                    const weekAgo = new Date(now);
                    weekAgo.setDate(now.getDate() - 7);
                    return expDate >= weekAgo;
                case 'quincena':
                    const fortnightAgo = new Date(now);
                    fortnightAgo.setDate(now.getDate() - 15);
                    return expDate >= fortnightAgo;
                case 'mes':
                    const monthAgo = new Date(now);
                    monthAgo.setMonth(now.getMonth() - 1);
                    return expDate >= monthAgo;
                default:
                    return true;
            }
        });
    }

    deleteExpense(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este gasto?')) {
            storage.deleteExpense(id);
            this.hideModal();
            this.refreshView();
        }
    }

    exportExpensesPDF() {
        const hash = window.location.hash.replace('#', '');
        const period = hash.split('/')[1] || 'todos';
        const expenses = storage.getExpenses();
        const filtered = this.getFilteredExpenses(expenses, period);

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Header
        doc.setFillColor(26, 26, 127); // Primary
        doc.rect(0, 0, pageWidth, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('REPORTE DE GASTOS', pageWidth / 2, 25, { align: 'center' });

        doc.setFontSize(10);
        doc.text(`Periodo: ${period.toUpperCase()} | Fecha de Generación: ${new Date().toLocaleDateString()}`, pageWidth / 2, 35, { align: 'center' });

        // Total
        const total = filtered.reduce((sum, e) => sum + parseFloat(e.amount), 0);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text(`Total de Gastos: $${total.toLocaleString()}`, 14, 55);

        // Table
        const rows = filtered.map(e => [e.date, e.category, e.description, `$${parseFloat(e.amount).toLocaleString()}`]);
        doc.autoTable({
            startY: 65,
            head: [['Fecha', 'Categoría', 'Descripción', 'Monto']],
            body: rows,
            theme: 'striped',
            headStyles: { fillColor: [26, 26, 127] }
        });

        const todayStr = new Date().toISOString().split('T')[0];
        doc.save(`Reporte_Gastos_${period}_${todayStr}.pdf`);
    }

    confirmLoanDeletion(id) {
        this.showModal('notification', {
            icon: 'warning',
            iconClass: 'text-red-500',
            title: '¿Eliminar Préstamo?',
            message: 'Esta acción borrará este préstamo y todas sus cuotas relacionadas de forma permanente.',
            actions: [
                { text: 'Confirmar Eliminación', class: 'bg-red-600 text-white', onClick: `app.performLoanDeletion('${id}')` },
                { text: 'Cancelar', class: 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200', onClick: 'app.hideModal()' }
            ]
        });
    }

    performLoanDeletion(id) {
        storage.deleteLoan(id);
        this.refreshView();
        this.showModal('notification', {
            icon: 'check_circle',
            iconClass: 'text-emerald-500',
            title: 'Préstamo Eliminado',
            message: 'El préstamo ha sido removido del historial con éxito.',
            actions: [
                { text: 'Aceptar', class: 'bg-primary text-white', onClick: 'app.hideModal()' }
            ]
        });
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            if (storage.importData(e.target.result)) {
                alert('Datos restaurados correctamente');
                this.refreshView();
            } else {
                alert('Error al restaurar los datos');
            }
        };
        reader.readAsText(file);
    }

    attachViewEvents() {
        // Search and Filter functionality for client list
        const searchInput = document.getElementById('client-search');
        const filterButtons = document.querySelectorAll('.client-filter-btn');
        let currentStatusFilter = 'todos';

        const applyFilters = () => {
            const term = searchInput ? searchInput.value.toLowerCase() : '';
            const clientCards = document.querySelectorAll('.client-card');

            clientCards.forEach(card => {
                const name = card.getAttribute('data-name').toLowerCase();
                const docId = card.getAttribute('data-id').toLowerCase();
                const status = card.getAttribute('data-status');

                const matchesSearch = name.includes(term) || docId.includes(term);
                const matchesFilter = currentStatusFilter === 'todos' || status === currentStatusFilter;

                card.classList.toggle('hidden', !(matchesSearch && matchesFilter));
            });
        };

        if (searchInput) {
            searchInput.addEventListener('input', applyFilters);
        }

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                currentStatusFilter = btn.getAttribute('data-filter');

                // Update UI of buttons
                filterButtons.forEach(b => {
                    b.classList.remove('bg-primary', 'text-white');
                    b.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');
                });
                btn.classList.add('bg-primary', 'text-white');
                btn.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');

                applyFilters();
            });
        });

        // Profile Tab Logic
        const profileTabs = document.querySelectorAll('.profile-tab');
        const tabPanels = document.querySelectorAll('.tab-panel');

        profileTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');

                // Update active tab button style
                profileTabs.forEach(t => {
                    t.classList.remove('border-primary', 'text-primary');
                    t.classList.add('border-transparent', 'text-slate-500');
                });
                tab.classList.add('border-primary', 'text-primary');
                tab.classList.remove('border-transparent', 'text-slate-500');

                // Switch visible panel
                tabPanels.forEach(panel => {
                    panel.classList.toggle('hidden', panel.id !== `tab-${targetTab}`);
                });
            });
        });

        // Eventos para los Filtros de Agenda
        const agendaTabs = document.querySelectorAll('.agenda-tab');
        if (agendaTabs.length > 0) {
            agendaTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const target = tab.getAttribute('data-target');

                    // Actualizar estilos de las pestañas
                    agendaTabs.forEach(t => {
                        t.classList.remove('bg-primary', 'text-white', 'shadow-md');
                        t.classList.add('text-slate-500', 'hover:bg-slate-100', 'dark:hover:bg-slate-800');
                    });
                    tab.classList.add('bg-primary', 'text-white', 'shadow-md');
                    tab.classList.remove('text-slate-500', 'hover:bg-slate-100', 'dark:hover:bg-slate-800');

                    // Mostrar/Ocultar secciones
                    document.querySelectorAll('.agenda-section').forEach(sec => {
                        sec.classList.add('hidden');
                    });
                    document.getElementById(`agenda-${target}`).classList.remove('hidden');
                });
            });
        }

        // Eventos para Tabs del Reporte Financiero
        const reportTabs = document.querySelectorAll('.report-tab');
        if (reportTabs.length > 0) {
            reportTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const target = tab.getAttribute('data-tab');

                    // Actualizar estilos
                    reportTabs.forEach(t => t.classList.remove('bg-primary', 'text-white'));
                    reportTabs.forEach(t => t.classList.add('bg-slate-100', 'text-slate-500'));
                    tab.classList.remove('bg-slate-100', 'text-slate-500');
                    tab.classList.add('bg-primary', 'text-white');

                    // Mostrar sección
                    document.querySelectorAll('.report-section').forEach(s => s.classList.add('hidden'));
                    document.getElementById(`report-${target}`).classList.remove('hidden');
                });
            });
        }
    }

    showModal(type, dataId = null) {
        let html = '';
        switch (type) {
            case 'newClient':
                html = Views.modals.newClient();
                break;
            case 'editClient':
                const clientToEdit = storage.getClients().find(c => c.id === dataId);
                html = Views.modals.editClient(clientToEdit);
                break;
            case 'newLoan':
                const config = storage.getConfig();
                html = Views.modals.newLoan(storage.getClients(), dataId, config.defaultInterest);
                break;
            case 'payInstallment':
                const installment = storage.getInstallments().find(i => i.id === dataId);
                html = Views.modals.payInstallment(installment);
                break;
            case 'loanDetails':
                const loanDetails = storage.getLoans().find(l => l.id === dataId);
                const instDetails = storage.getInstallments().filter(i => i.loanId === dataId);
                html = Views.modals.loanDetails(loanDetails, instDetails);
                break;
            case 'viewDocument':
                // Find the document across all clients
                let foundDoc = null;
                storage.getClients().some(c => {
                    if (c.documents) {
                        foundDoc = c.documents.find(d => d.id === dataId);
                        return foundDoc;
                    }
                });
                html = Views.modals.viewDocument(foundDoc);
                break;
            case 'notification':
                // dataId es el objeto de configuración en este caso
                html = Views.modals.notification(dataId);
                break;
            case 'notifications':
                const loansRef = storage.getLoans();
                const instRef = storage.getInstallments();
                const clientsRef = storage.getClients();
                const todayDate = new Date().toISOString().split('T')[0];

                const overdueItems = instRef.filter(i => i.status !== 'paid' && i.dueDate < todayDate).map(i => {
                    const l = loansRef.find(l => l.id === i.loanId);
                    const c = clientsRef.find(c => c.id === l.clientId);
                    return { ...i, clientName: c ? c.name : 'Desconocido' };
                });

                const todayItems = instRef.filter(i => i.status !== 'paid' && i.dueDate === todayDate).map(i => {
                    const l = loansRef.find(l => l.id === i.loanId);
                    const c = clientsRef.find(c => c.id === l.clientId);
                    return { ...i, clientName: c ? c.name : 'Desconocido' };
                });
                html = Views.modals.notifications(overdueItems, todayItems);
                break;
            case 'newExpense':
                html = Views.modals.newExpense();
                break;
            case 'expenseDetails':
                const expense = storage.getExpenses().find(e => e.id === dataId);
                html = Views.modals.expenseDetails(expense);
                break;
        }

        this.modalContent.innerHTML = html;
        this.modalContainer.classList.remove('hidden');
        setTimeout(() => {
            this.modalContent.classList.remove('translate-y-full');
        }, 10);

        // Auto Cierre para Notificaciones (4 segundos)
        if (type === 'notification' && dataId && dataId.autoClose) {
            setTimeout(() => {
                this.hideModal();
            }, 4000);
        }

        this.attachModalEvents(type);
    }

    hideModal() {
        this.modalContent.classList.add('translate-y-full');
        setTimeout(() => {
            this.modalContainer.classList.add('hidden');
        }, 400);
    }

    attachModalEvents(type) {
        const form = this.modalContent.querySelector('form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            if (type === 'newClient' || type === 'editClient') {
                storage.saveClient(data);
                this.hideModal();
                this.showModal('notification', {
                    icon: 'check_circle',
                    iconClass: 'text-emerald-500',
                    title: type === 'editClient' ? 'Cliente Actualizado' : 'Cliente Guardado',
                    message: 'La información del cliente se ha guardado correctamente.',
                    actions: [],
                    autoClose: true
                });
            } else if (type === 'newExpense') {
                const expense = {
                    ...data,
                    amount: parseFloat(data.amount)
                };
                storage.saveExpense(expense);
                this.hideModal();
                this.refreshView();
                this.showModal('notification', {
                    icon: 'check_circle',
                    iconClass: 'text-emerald-500',
                    title: 'Gasto Registrado',
                    message: 'El gasto se ha guardado correctamente.',
                    actions: [],
                    autoClose: true
                });
            } else if (type === 'newLoan') {
                const loan = {
                    ...data,
                    amount: parseFloat(data.amount),
                    interestRate: parseFloat(data.interestRate),
                    installmentsCount: parseInt(data.installmentsCount),
                    status: 'active'
                };
                const savedLoan = storage.saveLoan(loan);
                const installments = LoanLogic.generateInstallments({
                    loanId: savedLoan.id,
                    ...loan
                });
                storage.saveInstallments(installments);

                // Generate PDF Receipt
                const client = storage.getClients().find(c => c.id === savedLoan.clientId);
                const pdfData = PDFGenerator.generateLoanReceipt(savedLoan, client, installments);

                // Save Document to Client Profile
                const newDoc = {
                    id: `doc-${Date.now()}`,
                    name: `Recibo Préstamo - ${savedLoan.startDate}`,
                    date: new Date().toISOString(),
                    type: 'pdf',
                    data: pdfData
                };

                if (!client.documents) client.documents = [];
                client.documents.push(newDoc);
                storage.saveClient(client);

                this.hideModal();
                this.showModal('notification', {
                    icon: 'check_circle',
                    iconClass: 'text-emerald-500',
                    title: 'Préstamo Creado',
                    message: 'El préstamo ha sido desembolsado y el recibo generado.',
                    actions: [
                        { text: 'Ver Recibo', class: 'bg-primary text-white', onClick: `app.showModal('viewDocument', '${newDoc.id}')` },
                        { text: 'Cerrar', class: 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200', onClick: 'app.hideModal()' }
                    ]
                });
            } else if (type === 'payInstallment') {
                const installment = storage.getInstallments().find(i => i.id === data.installmentId);
                const enteredAmount = parseFloat(data.amount);

                // Validación básica
                if (isNaN(enteredAmount) || enteredAmount <= 0) {
                    alert('Por favor ingrese un monto válido mayor a 0.');
                    return;
                }

                const updated = LoanLogic.processPayment(installment, enteredAmount);
                storage.updateInstallment(updated);

                // El monto real que se registró (puede ser menor si se superó el saldo)
                const realPaidAmount = updated.paidAmount - installment.paidAmount;

                // Generate Payment Receipt PDF
                const loan = storage.getLoans().find(l => l.id === installment.loanId);
                const client = storage.getClients().find(c => c.id === loan.clientId);
                const allInstallments = storage.getInstallments().filter(i => i.loanId === loan.id);
                const remainingCount = allInstallments.filter(i => i.status !== 'paid').length;

                // Pasamos un objeto con el monto REAL pagado para el recibo
                const receiptData = {
                    ...updated,
                    amount: realPaidAmount  // el recibo muestra lo que realmente se abonó
                };

                const pdfData = PDFGenerator.generatePaymentReceipt(receiptData, client, loan, remainingCount);

                const newDoc = {
                    id: `doc-pay-${Date.now()}`,
                    name: `Abono Cuota ${installment.number} - $${realPaidAmount.toLocaleString()}`,
                    date: new Date().toISOString(),
                    type: 'image',
                    data: pdfData
                };

                if (!client.documents) client.documents = [];
                client.documents.unshift(newDoc); // Add to top of list
                storage.saveClient(client);

                this.hideModal();
                this.showModal('notification', {
                    icon: 'check_circle',
                    iconClass: 'text-emerald-500',
                    title: 'Abono Registrado',
                    message: `Se registró un abono de $${realPaidAmount.toLocaleString()} correctamente.`,
                    actions: [],
                    autoClose: true
                });
            }
        });
    }

    navigate(view, id = null) {
        window.location.hash = view + (id ? `/${id}` : '');
    }

    // Funciones del Reporte Financiero
    applyReportFilters() {
        const start = document.getElementById('report-start').value;
        const end = document.getElementById('report-end').value;

        const loans = storage.getLoans();
        const installments = storage.getInstallments();

        // Filtro simple para re-renderizar la vista
        let filteredLoans = loans;
        let filteredInst = installments;

        if (start && end) {
            filteredLoans = loans.filter(l => l.startDate >= start && l.startDate <= end);
            filteredInst = installments.filter(i => (!i.paidDate || (i.paidDate.split('T')[0] >= start && i.paidDate.split('T')[0] <= end)));
        }

        const html = Views.financialReport({
            loans: filteredLoans,
            clients: storage.getClients(),
            installments: filteredInst,
            startDate: start,
            endDate: end
        });
        this.contentArea.innerHTML = html;
        this.attachViewEvents();
    }

    downloadReport() {
        const start = document.getElementById('report-start').value;
        const end = document.getElementById('report-end').value;
        PDFGenerator.generateFinancialReport(storage.getLoans(), storage.getClients(), storage.getInstallments(), start, end);
    }

    saveSettings() {
        const interest = parseFloat(document.getElementById('default-interest').value);
        const currency = document.getElementById('currency').value;

        if (isNaN(interest)) {
            alert('Por favor ingrese un interés válido');
            return;
        }

        const config = storage.getConfig();
        config.defaultInterest = interest;
        config.currency = currency;
        storage.saveConfig(config);

        this.showModal('notification', {
            icon: 'tune',
            iconClass: 'text-primary',
            title: 'Configuración Guardada',
            message: 'Los ajustes se han actualizado correctamente.',
            actions: [],
            autoClose: true
        });
    }

    playNotificationSound() {
        if (!this.audioCtx) {
            try {
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.error("Web Audio API is not supported.");
                return;
            }
        }

        // Resume context if it's suspended (autoplay policy)
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }

        const oscillator = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, this.audioCtx.currentTime + 0.01); // Fade in
        oscillator.frequency.value = 900; // A sharp, high-pitched tone
        oscillator.type = 'sine';
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.00001, this.audioCtx.currentTime + 0.2); // Fade out
        oscillator.stop(this.audioCtx.currentTime + 0.2);
    }
}

// Global instance for inline event handlers
window.app = new App();
