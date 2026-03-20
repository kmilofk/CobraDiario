// views.js - Non-module version using global scope
const Views = {
    dashboard: (kpis, notificationCount = 0) => `
        <header class="flex items-center bg-white dark:bg-slate-900/50 p-4 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
            <div class="flex size-10 shrink-0 items-center mr-3">
                <div class="bg-primary/10 flex items-center justify-center rounded-full size-10 border border-primary/20">
                    <span class="material-symbols-outlined text-primary">person</span>
                </div>
            </div>
            <div class="flex flex-col flex-1">
                <span class="text-slate-500 dark:text-slate-400 text-xs font-medium">Bienvenido de nuevo,</span>
                <h2 class="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">Alex</h2>
            </div>
            <div class="flex items-center justify-end">
                <button onclick="app.showModal('notifications')" class="relative flex items-center justify-center p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors">
                    <span class="material-symbols-outlined">notifications</span>
                    ${notificationCount > 0 ? `<span class="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>` : ''}
                </button>
            </div>
        </header>

        <div class="grid grid-cols-2 gap-3 p-4">
            <div class="flex flex-col gap-1 rounded-xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div class="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                    <span class="material-symbols-outlined text-sm">account_balance_wallet</span>
                    <p class="text-xs font-semibold uppercase tracking-wider">Total Prestado</p>
                </div>
                <p class="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight">$${kpis.totalLoaned.toLocaleString()}</p>
            </div>
            <div class="flex flex-col gap-1 rounded-xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div class="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                    <span class="material-symbols-outlined text-sm">payments</span>
                    <p class="text-xs font-semibold uppercase tracking-wider">Recuperado</p>
                </div>
                <p class="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight">$${kpis.totalRecovered.toLocaleString()}</p>
            </div>
            <div class="flex flex-col gap-1 rounded-xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div class="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                    <span class="material-symbols-outlined text-sm">pending_actions</span>
                    <p class="text-xs font-semibold uppercase tracking-wider">Pendiente</p>
                </div>
                <p class="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight">$${kpis.pendingValue.toLocaleString()}</p>
                <div class="flex items-center gap-1 mt-1">
                    <span class="material-symbols-outlined text-red-500 text-sm">warning</span>
                    <p class="text-red-500 text-xs font-bold">${kpis.overdueCount} vencidos</p>
                </div>
            </div>
            <div class="flex flex-col gap-1 rounded-xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div class="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
                    <span class="material-symbols-outlined text-sm">group</span>
                    <p class="text-xs font-semibold uppercase tracking-wider">Activos</p>
                </div>
                <p class="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight">${kpis.activeLoans}</p>
            </div>
        </div>

        <div class="px-4 mb-6">
            <div class="bg-primary p-4 rounded-xl shadow-lg shadow-primary/20 text-white flex justify-between items-center overflow-hidden relative">
                <div class="relative z-10">
                    <h4 class="text-primary-100/80 text-xs font-bold uppercase tracking-widest">Cobros Efectivos</h4>
                    <p class="text-2xl font-bold mt-1">${kpis.recoveryRate.toFixed(1)}%</p>
                    <p class="text-xs text-white/70">Tasa de recuperación</p>
                </div>
                <div class="relative z-10 bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <span class="material-symbols-outlined text-3xl">insights</span>
                </div>
                <div class="absolute -right-4 -bottom-4 size-24 bg-white/10 rounded-full blur-2xl"></div>
            </div>
        </div>

        <section class="px-4">
            <h3 class="text-slate-900 dark:text-slate-100 text-sm font-extrabold uppercase tracking-widest mb-4 flex items-center gap-2">
                Accesos Rápidos
            </h3>
            <div class="grid grid-cols-1 gap-3">
                <button onclick="app.showModal('newClient')" class="flex items-center gap-4 w-full bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors group">
                    <div class="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <span class="material-symbols-outlined">person_add</span>
                    </div>
                    <div class="flex flex-col items-start">
                        <span class="text-slate-900 dark:text-slate-100 font-bold">Nuevo Cliente</span>
                        <span class="text-slate-500 text-xs">Registrar datos y documentos</span>
                    </div>
                    <span class="material-symbols-outlined ml-auto text-slate-300">chevron_right</span>
                </button>
                <button onclick="app.showModal('newLoan')" class="flex items-center gap-4 w-full bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors group">
                    <div class="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <span class="material-symbols-outlined">request_quote</span>
                    </div>
                    <div class="flex flex-col items-start">
                        <span class="text-slate-900 dark:text-slate-100 font-bold">Nuevo Préstamo</span>
                        <span class="text-slate-500 text-xs">Calcular cuotas y desembolsar</span>
                    </div>
                    <span class="material-symbols-outlined ml-auto text-slate-300">chevron_right</span>
                </button>
            </div>
        </section>
    `,

    clientProfile: (client, loans) => {
        const installments = storage.getInstallments();
        const today = new Date().toISOString().split('T')[0];

        // Calculate status and balance
        const activeLoans = loans.filter(l => l.status === 'active');
        let status = 'finalizado';
        let statusClass = 'bg-slate-400';
        let balance = 0;

        if (activeLoans.length > 0) {
            const clientInst = installments.filter(i => loans.some(l => l.id === i.loanId));
            const overdue = clientInst.some(i => i.status !== 'paid' && i.dueDate < today);
            status = overdue ? 'moroso' : 'activo';
            statusClass = overdue ? 'bg-rose-500' : 'bg-emerald-500';
            balance = clientInst.reduce((s, i) => s + (i.amount - i.paidAmount), 0);
        }

        const recentPayments = installments
            .filter(i => loans.some(l => l.id === i.loanId) && i.paidAmount > 0)
            .sort((a, b) => new Date(b.paidDate) - new Date(a.paidDate))
            .slice(0, 10);

        return `
        <header class="sticky top-0 z-[60] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
            <button onclick="app.navigate('clients')" class="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <span class="material-symbols-outlined">arrow_back</span>
            </button>
            <h2 class="text-slate-900 dark:text-slate-100 text-lg font-bold">Perfil del Cliente</h2>
            <button onclick="app.confirmClientDeletion('${client.id}')" class="p-2 -mr-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors">
                <span class="material-symbols-outlined">delete</span>
            </button>
        </header>

        <div class="flex flex-col bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-6 items-center">
            <div class="relative mb-4">
                <div class="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border-4 border-primary/5">
                    ${client.name.charAt(0)}
                </div>
                <div class="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${statusClass}"></div>
            </div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 text-center">${client.name}</h2>
            <div class="flex items-center gap-2 mt-1">
                <span class="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Estado: ${status}</span>
                <span class="text-slate-500 text-xs font-medium">ID: #${client.documentId || client.id.slice(-5)}</span>
            </div>
            <div class="flex w-full gap-3 mt-6">
                <button onclick="app.showModal('newLoan', '${client.id}')" class="flex-1 bg-primary text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    <span class="material-symbols-outlined text-sm">add</span> Nuevo Préstamo
                </button>
                <button onclick="window.location.href='tel:${client.phone}'" class="flex-1 border border-primary text-primary font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-primary/5 transition-all">
                    <span class="material-symbols-outlined text-sm">phone</span> Llamar
                </button>
            </div>
        </div>

        <div class="sticky top-[53px] z-[50] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
            <div class="flex px-4" id="profile-tabs">
                <button data-tab="info" class="profile-tab flex-none px-4 py-4 text-sm font-bold border-b-[3px] border-primary text-primary">Información</button>
                <button data-tab="history" class="profile-tab flex-none px-4 py-4 text-sm font-bold border-b-[3px] border-transparent text-slate-500">Historial</button>
                <button data-tab="payments" class="profile-tab flex-none px-4 py-4 text-sm font-bold border-b-[3px] border-transparent text-slate-500">Pagos</button>
                <button data-tab="docs" class="profile-tab flex-none px-4 py-4 text-sm font-bold border-b-[3px] border-transparent text-slate-500">Documentos</button>
            </div>
        </div>

        <div class="p-4 space-y-8 pb-24" id="profile-content">
            <!-- TAB: Información -->
            <section id="tab-info" class="tab-panel">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">Información Personal</h3>
                    <button onclick="app.showModal('editClient', '${client.id}')" class="text-primary text-xs font-bold px-3 py-1 bg-primary/10 rounded-lg hover:bg-primary hover:text-white transition-colors">Editar</button>
                </div>
                <div class="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 text-left">
                    <div class="flex items-start gap-4">
                        <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                            <span class="material-symbols-outlined">phone</span>
                        </div>
                        <div>
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Teléfono</p>
                            <p class="text-sm font-semibold">${client.phone}</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-4 border-t border-slate-50 dark:border-slate-800 pt-4">
                        <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                            <span class="material-symbols-outlined">mail</span>
                        </div>
                        <div>
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email</p>
                            <p class="text-sm font-semibold">${client.email || 'No registrado'}</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-4 border-t border-slate-50 dark:border-slate-800 pt-4">
                        <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                            <span class="material-symbols-outlined">location_on</span>
                        </div>
                        <div>
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dirección</p>
                            <p class="text-sm font-semibold">${client.address || 'No registrada'}</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- TAB: Historial -->
            <section id="tab-history" class="tab-panel hidden">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">Historial de Préstamos</h3>
                </div>
                <div class="space-y-4">
                    ${loans.length === 0 ? '<p class="text-center text-slate-400 py-10 text-sm italic">Sin préstamos registrados.</p>' : ''}
                    ${loans.sort((a, b) => new Date(b.startDate) - new Date(a.startDate)).map(loan => {
            const lInst = installments.filter(i => i.loanId === loan.id);
            const totalToPay = lInst.reduce((sum, i) => sum + i.amount, 0);
            const totalPaid = lInst.reduce((sum, i) => sum + i.paidAmount, 0);
            const remaining = totalToPay - totalPaid;
            const paidInst = lInst.filter(i => i.status === 'paid').length;
            const progress = lInst.length > 0 ? (totalPaid / totalToPay) * 100 : 0;
            const isPaid = loan.status === 'paid' || progress >= 99.9;

            return `
                        <div class="relative group bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm ${!isPaid ? 'border-l-4 border-l-primary' : 'border-l-4 border-l-emerald-500'}">
                            <div onclick="app.showModal('loanDetails', '${loan.id}')" class="cursor-pointer">
                                <div class="flex justify-between items-start mb-4">
                                    <div>
                                        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">${!isPaid ? 'En Curso' : 'Finalizado'}</p>
                                        <p class="text-2xl font-bold">$${loan.amount.toLocaleString()}</p>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <span class="px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${!isPaid ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}">
                                            ${!isPaid ? 'Activo' : 'Pagado'}
                                        </span>
                                        ${isPaid ? `
                                            <button onclick="event.stopPropagation(); app.confirmLoanDeletion('${loan.id}')" class="p-2 text-slate-400 hover:text-rose-500 transition-colors" title="Eliminar Préstamo">
                                                <span class="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        ` : ''}
                                    </div>
                                </div>
                                <div class="grid grid-cols-2 gap-4 pb-4 border-b border-slate-50 dark:border-slate-800">
                                    <div>
                                        <p class="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Fecha Inicio</p>
                                        <p class="text-xs font-semibold">${loan.startDate}</p>
                                    </div>
                                    <div>
                                        <p class="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Saldo Pendiente</p>
                                        <p class="text-xs font-bold ${remaining > 0 ? 'text-rose-500' : 'text-emerald-500'}">$${remaining.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div class="mt-4">
                                    <div class="flex justify-between text-[11px] font-bold mb-1.5">
                                        <span class="text-slate-400 uppercase tracking-tighter">Progreso: ${paidInst}/${lInst.length} Cuotas</span>
                                        <span class="${!isPaid ? 'text-primary' : 'text-emerald-500'}">${progress.toFixed(0)}%</span>
                                    </div>
                                    <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div class="${!isPaid ? 'bg-primary' : 'bg-emerald-500'} h-full transition-all duration-700" style="width: ${progress}%"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;
        }).join('')}
                </div>
            </section>

            <!-- TAB: Pagos -->
            <section id="tab-payments" class="tab-panel hidden">
                <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Últimos Pagos Realizados</h3>
                <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    ${recentPayments.length === 0 ? '<p class="text-center text-slate-400 py-10 text-sm italic">Sin pagos registrados.</p>' : ''}
                    ${recentPayments.map(p => {
            const loan = loans.find(l => l.id === p.loanId);
            const payDateStr = p.paidDate ? p.paidDate.split('T')[0] : '—';
            const isPartial = p.status === 'partially_paid';
            return `
                        <div class="flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-800 last:border-0 text-left">
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-2xl ${isPartial ? 'bg-amber-50 dark:bg-amber-900/10 text-amber-600' : 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600'} flex items-center justify-center">
                                    <span class="material-symbols-outlined">payments</span>
                                </div>
                                <div>
                                    <p class="text-sm font-bold">${isPartial ? 'Abono Parcial' : 'Pago de Cuota'} #${p.number}</p>
                                    <p class="text-[10px] text-slate-400 font-medium">${payDateStr} • ${loan ? 'Cuota $' + p.amount.toLocaleString() : 'Préstamo'}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="font-bold ${isPartial ? 'text-amber-600' : 'text-emerald-600'}">+$${p.paidAmount.toLocaleString()}</p>
                                <p class="text-[10px] text-slate-400 uppercase font-bold">${isPartial ? 'Parcial' : 'Recibido'}</p>
                            </div>
                        </div>
                    `}).join('')}
                </div>
            </section>

            <!-- TAB: Documentos -->
            <section id="tab-docs" class="tab-panel hidden">
                ${(client.documents && client.documents.length > 0) ? `
                    <div class="space-y-3">
                        ${client.documents.map(doc => `
                            <div class="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-12 rounded-xl ${doc.type === 'image' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-500' : 'bg-red-50 dark:bg-red-900/20 text-red-500'} flex items-center justify-center">
                                        <span class="material-symbols-outlined">${doc.type === 'image' ? 'image' : 'picture_as_pdf'}</span>
                                    </div>
                                    <div>
                                        <p class="text-sm font-bold text-slate-900 dark:text-slate-100">${doc.name}</p>
                                        <p class="text-[10px] text-slate-500 font-medium">${new Date(doc.date).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div class="flex gap-2">
                                    <button onclick="app.showModal('viewDocument', '${doc.id}')" class="flex items-center justify-center w-8 h-8 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 transition-colors" title="Ver documento">
                                        <span class="material-symbols-outlined text-sm">visibility</span>
                                    </button>
                                    <a href="${doc.data}" download="${doc.name}.${doc.type === 'image' ? 'png' : 'pdf'}" class="flex items-center justify-center w-8 h-8 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 transition-colors" title="Descargar">
                                        <span class="material-symbols-outlined text-sm">download</span>
                                    </a>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="flex flex-col items-center justify-center py-12 text-center">
                        <div class="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 mb-4">
                            <span class="material-symbols-outlined text-4xl">folder_off</span>
                        </div>
                        <h4 class="font-bold text-slate-400">Sin documentos</h4>
                        <p class="text-xs text-slate-400 mt-1 max-w-[200px]">Carga contratos, identificaciones o comprobantes para este cliente.</p>
                    </div>
                `}
            </section>
        </div>
        `;
    },

    financialReport: (data) => {
        // Preparar Datos
        const { loans, clients, installments, startDate, endDate } = data;
        const paidInstallments = installments.filter(i => i.status === 'paid' && i.paidAmount > 0);

        // Totales
        const totalLoaned = loans.reduce((s, l) => s + l.amount, 0);
        const totalCollected = paidInstallments.reduce((s, i) => s + i.paidAmount, 0);
        const totalInterest = loans.reduce((s, l) => s + (l.amount * (l.interestRate / 100)), 0);

        return `
        <header class="sticky top-0 z-10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-4">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-3xl">analytics</span>
                    <h1 class="text-xl font-bold tracking-tight">Reporte Financiero</h1>
                </div>
            </div>
            
            <!-- Filtros de Fecha -->
            <div class="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 mb-4 shadow-sm">
                <div class="flex gap-2 mb-2">
                    <div class="flex-1">
                        <label class="text-[10px] text-slate-400 font-bold uppercase">Desde</label>
                        <input type="date" id="report-start" value="${startDate || ''}" class="w-full text-xs p-1 bg-transparent border-b border-slate-200">
                    </div>
                    <div class="flex-1">
                        <label class="text-[10px] text-slate-400 font-bold uppercase">Hasta</label>
                        <input type="date" id="report-end" value="${endDate || ''}" class="w-full text-xs p-1 bg-transparent border-b border-slate-200">
                    </div>
                </div>
                <div class="flex gap-2">
                    <button onclick="app.applyReportFilters()" class="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 text-xs font-bold py-2 rounded-lg">Filtrar</button>
                    <button onclick="app.downloadReport()" class="flex-1 bg-emerald-600 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1">
                        <span class="material-symbols-outlined text-sm">download</span> PDF
                    </button>
                </div>
            </div>

            <!-- Tabs de Navegación -->
            <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                <button data-tab="summary" class="report-tab px-4 py-1.5 rounded-full bg-primary text-white text-xs font-bold whitespace-nowrap transition-colors">Resumen</button>
                <button data-tab="loans" class="report-tab px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold whitespace-nowrap transition-colors">Detalles</button>
                <button data-tab="movements" class="report-tab px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold whitespace-nowrap transition-colors">Movimientos</button>
            </div>
        </header>

        <div class="p-4 space-y-3 pb-24">
            
            <!-- TAB: RESUMEN -->
            <div id="report-summary" class="report-section space-y-3">
                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                        <p class="text-[10px] text-slate-400 uppercase font-bold">Total Prestado</p>
                        <p class="text-xl font-bold text-primary">$${totalLoaned.toLocaleString()}</p>
                    </div>
                    <div class="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                        <p class="text-[10px] text-slate-400 uppercase font-bold">Total Cobrado</p>
                        <p class="text-xl font-bold text-emerald-600">$${totalCollected.toLocaleString()}</p>
                    </div>
                    <div class="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                        <p class="text-[10px] text-slate-400 uppercase font-bold">Interés Proyectado</p>
                        <p class="text-lg font-bold text-slate-700 dark:text-slate-300">$${totalInterest.toLocaleString()}</p>
                    </div>
                    <div class="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                        <p class="text-[10px] text-slate-400 uppercase font-bold">Préstamos</p>
                        <p class="text-lg font-bold text-slate-700 dark:text-slate-300">${loans.length} registros</p>
                    </div>
                </div>
            </div>

            <!-- TAB: DETALLES (Prestamos) -->
            <div id="report-loans" class="report-section hidden space-y-3">
                ${loans.length === 0 ? '<p class="text-center text-slate-500 py-10">No hay datos para mostrar.</p>' : ''}
                ${loans.map(loan => {
            const client = clients.find(c => c.id === loan.clientId);
            return `
                    <div class="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex justify-between items-center">
                        <div>
                            <h3 class="font-bold text-slate-900 dark:text-slate-100 text-sm">${client ? client.name : 'Desconocido'}</h3>
                            <p class="text-xs text-primary font-bold">$${loan.amount.toLocaleString()}</p>
                            <p class="text-[10px] text-slate-400 uppercase">${loan.startDate} • ${loan.frequency}</p>
                        </div>
                        <span class="px-2 py-0.5 rounded-full ${loan.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'} text-[10px] font-bold uppercase">${loan.status}</span>
                    </div>
                    `;
        }).join('')}
            </div>

            <!-- TAB: MOVIMIENTOS (Pagos) -->
            <div id="report-movements" class="report-section hidden space-y-3">
                ${paidInstallments.length === 0 ? '<p class="text-center text-slate-500 py-10">No hay movimientos registrados.</p>' : ''}
                ${paidInstallments.map(p => {
            const loan = loans.find(l => l.id === p.loanId);
            const client = clients.find(c => c.id === (loan ? loan.clientId : ''));
            return `
                    <div class="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div>
                            <p class="text-sm font-bold">${client ? client.name : 'Desconocido'}</p>
                            <p class="text-[10px] text-slate-500">${p.paidDate.split('T')[0]} • Cuota ${p.number}</p>
                        </div>
                        <p class="text-sm font-bold text-emerald-600">+$${p.paidAmount.toLocaleString()}</p>
                    </div>
                    `;
        }).join('')}
            </div>

        </div>
    `;
    },

    reports: (data) => `
        <header class="sticky top-0 z-10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-4">
            <h1 class="text-xl font-bold tracking-tight">Reportes</h1>
        </header>
        <div class="p-4 space-y-6">
            <div class="grid grid-cols-1 gap-4">
                <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <p class="text-xs font-bold text-slate-500 uppercase mb-1">Capital en Calle</p>
                    <p class="text-3xl font-bold text-primary">$${data.capitalInStreet.toLocaleString()}</p>
                </div>
                <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <p class="text-xs font-bold text-slate-500 uppercase mb-1">Intereses Generados (Esperados)</p>
                    <p class="text-2xl font-bold text-emerald-600">$${data.totalInterest.toLocaleString()}</p>
                </div>
            </div>
            <div class="space-y-3">
                <h3 class="font-bold text-slate-900 dark:text-slate-100 uppercase text-xs tracking-wider">Últimos Pagos Recibidos</h3>
                ${data.recentPayments.length === 0 ? '<p class="text-sm text-slate-400 italic">No hay pagos registrados.</p>' : ''}
                ${data.recentPayments.map(p => `
                    <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <div>
                            <p class="text-sm font-bold">${p.clientName}</p>
                            <p class="text-[10px] text-slate-500">${p.date}</p>
                        </div>
                        <p class="text-sm font-bold text-emerald-600">+$${p.amount.toLocaleString()}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `,

    settings: (config) => `
        <header class="sticky top-0 z-10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-4">
            <h1 class="text-xl font-bold tracking-tight">Configuración</h1>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Administra las opciones del sistema</p>
        </header>
        
        <div class="p-4 space-y-6 pb-24">
            <!-- Sección 1: Configuración General -->
            <section>
                <h2 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-1">
                    Configuración General
                </h2>
                <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <!-- Interés por Defecto -->
                    <div class="p-4 border-b border-slate-100 dark:border-slate-800">
                        <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            <span class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-sm text-primary">percent</span>
                                Interés por Defecto (%)
                            </span>
                        </label>
                        <input type="number" id="default-interest" value="${config.defaultInterest}" 
                            class="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary font-bold text-lg"/>
                        <p class="text-[10px] text-slate-400 mt-1.5 ml-1">Se aplicará automáticamente en nuevos préstamos</p>
                    </div>
                    
                    <!-- Símbolo de Moneda -->
                    <div class="p-4">
                        <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            <span class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-sm text-primary">attach_money</span>
                                Símbolo de Moneda
                            </span>
                        </label>
                        <input type="text" id="currency" value="${config.currency}" 
                            class="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary font-bold text-lg"/>
                        <p class="text-[10px] text-slate-400 mt-1.5 ml-1">Símbolo que se mostrará en los montos</p>
                    </div>
                    
                    <!-- Botón Guardar -->
                    <div class="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                        <button onclick="app.saveSettings()" 
                            class="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]">
                            <span class="material-symbols-outlined">save</span>
                            Guardar Configuración
                        </button>
                    </div>
                </div>
            </section>

            <!-- Sección 2: Gestión de Datos -->
            <section>
                <h2 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-1">
                    Gestión de Datos
                </h2>
                <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden space-y-1">
                    <!-- Respaldar Datos -->
                    <button onclick="app.exportData()" 
                        class="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group text-left">
                        <div class="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                            <span class="material-symbols-outlined text-2xl">download</span>
                        </div>
                        <div class="flex-1">
                            <p class="font-semibold text-slate-900 dark:text-slate-100">Respaldar Datos</p>
                            <p class="text-xs text-slate-500 dark:text-slate-400">Exportar toda la información (JSON)</p>
                        </div>
                        <span class="material-symbols-outlined text-slate-400">chevron_right</span>
                    </button>
                    
                    <div class="h-px bg-slate-100 dark:bg-slate-800 mx-4"></div>
                    
                    <!-- Restaurar Datos -->
                    <button onclick="document.getElementById('import-file').click()" 
                        class="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group text-left">
                        <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            <span class="material-symbols-outlined text-2xl">upload</span>
                        </div>
                        <div class="flex-1">
                            <p class="font-semibold text-slate-900 dark:text-slate-100">Restaurar Datos</p>
                            <p class="text-xs text-slate-500 dark:text-slate-400">Importar copia de seguridad</p>
                        </div>
                        <span class="material-symbols-outlined text-slate-400">chevron_right</span>
                    </button>
                    <input type="file" id="import-file" class="hidden" onchange="app.importData(event)" accept=".json"/>
                    
                    <div class="h-px bg-slate-100 dark:bg-slate-800 mx-4"></div>
                    
                    <!-- Eliminar Todos los Datos -->
                    <button onclick="app.confirmDeleteAllClients()" 
                        class="w-full flex items-center gap-4 p-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group text-left">
                        <div class="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                            <span class="material-symbols-outlined text-2xl">delete_forever</span>
                        </div>
                        <div class="flex-1">
                            <p class="font-semibold text-red-600 dark:text-red-400">Eliminar Todos los Datos</p>
                            <p class="text-xs text-red-500/80 dark:text-red-400/70">Acción irreversible, elimina todo</p>
                        </div>
                        <span class="material-symbols-outlined text-slate-400">chevron_right</span>
                    </button>
                </div>
                <p class="text-[10px] text-slate-400 text-center mt-3 px-4 leading-relaxed">
                    <span class="material-symbols-outlined text-xs inline-block align-middle mr-1">info</span>
                    Crea copias de seguridad periódicas para evitar la pérdida de información
                </p>
            </section>

            <!-- Sección 3: Seguridad -->
            <section>
                <h2 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-1">
                    Seguridad
                </h2>
                <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <button onclick="Auth.logout()" 
                        class="w-full flex items-center gap-4 p-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group text-left">
                        <div class="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                            <span class="material-symbols-outlined text-2xl">logout</span>
                        </div>
                        <div class="flex-1">
                            <p class="font-semibold text-red-600 dark:text-red-400">Cerrar Sesión</p>
                            <p class="text-xs text-slate-500 dark:text-slate-400">Volver a la pantalla de inicio de sesión</p>
                        </div>
                        <span class="material-symbols-outlined text-slate-400">chevron_right</span>
                    </button>
                </div>
            </section>

            <!-- Footer -->
            <div class="pt-4 pb-8 flex flex-col items-center">
                <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                    <span class="material-symbols-outlined text-3xl text-primary">account_balance</span>
                </div>
                <p class="text-sm font-bold text-slate-700 dark:text-slate-300">PrestoManage</p>
                <p class="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Versión 1.2</p>
                <p class="text-[9px] text-slate-300 dark:text-slate-600 mt-2">© 2024 Todos los derechos reservados</p>
            </div>
        </div>
    `,

    clientList: (clients) => {
        const loans = storage.getLoans();
        const installments = storage.getInstallments();
        const today = new Date().toISOString().split('T')[0];

        const clientsWithStatus = clients.map(c => {
            const clientLoans = loans.filter(l => l.clientId === c.id);
            const activeLoans = clientLoans.filter(l => l.status === 'active');

            let status = 'finalizado';
            let statusClass = 'bg-slate-400';
            let balance = 0;

            if (activeLoans.length > 0) {
                const clientInst = installments.filter(i => clientLoans.some(l => l.id === i.loanId));
                const overdue = clientInst.some(i => i.status !== 'paid' && i.dueDate < today);

                status = overdue ? 'moroso' : 'activo';
                statusClass = overdue ? 'bg-rose-500' : 'bg-emerald-500';
                balance = clientInst.reduce((s, i) => s + (i.amount - i.paidAmount), 0);
            }

            return { ...c, status, statusClass, balance };
        });

        return `
        <header class="sticky top-0 z-10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-4">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-3xl">account_balance_wallet</span>
                    <h1 class="text-xl font-bold tracking-tight">Clientes</h1>
                </div>
            </div>
            <div class="relative mb-4">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input id="client-search" class="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/50 text-sm" placeholder="Buscar por nombre o ID..." type="text"/>
            </div>
            <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                <button data-filter="todos" class="client-filter-btn flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-white text-xs font-semibold whitespace-nowrap">
                    Todos
                </button>
                <button data-filter="activo" class="client-filter-btn flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold whitespace-nowrap border border-slate-200 dark:border-slate-700">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Activos
                </button>
                <button data-filter="moroso" class="client-filter-btn flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold whitespace-nowrap border border-slate-200 dark:border-slate-700">
                    <span class="w-2 h-2 rounded-full bg-rose-500"></span> Morosos
                </button>
                <button data-filter="finalizado" class="client-filter-btn flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold whitespace-nowrap border border-slate-200 dark:border-slate-700">
                    <span class="w-2 h-2 rounded-full bg-slate-400"></span> Finalizados
                </button>
            </div>
        </header>
        <div class="px-4 space-y-3 py-4 pb-24">
            ${clientsWithStatus.length === 0 ? '<p class="text-center text-slate-500 py-10">No hay clientes registrados.</p>' : ''}
            ${clientsWithStatus.map(client => `
                <div onclick="app.navigate('clientProfile', '${client.id}')"
                     class="client-card flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm active:scale-95 transition-transform"
                     data-name="${client.name}" data-id="${client.documentId || ''}" data-status="${client.status}">
                    <div class="flex items-center gap-3 text-left">
                        <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            ${client.name.charAt(0)}
                        </div>
                        <div>
                            <h3 class="font-semibold text-slate-900 dark:text-slate-100">${client.name}</h3>
                            <div class="flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full ${client.statusClass}"></span>
                                <span class="text-[10px] text-slate-500 uppercase font-medium capitalize">${client.status}</span>
                            </div>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-sm font-bold text-slate-900 dark:text-slate-100">$${client.balance.toLocaleString()}</p>
                        <p class="text-[10px] text-slate-400 uppercase tracking-wider">Balance</p>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <!-- Floating Action Button -->
        <button onclick="app.showModal('newClient')" 
                class="fixed bottom-24 right-6 w-16 h-16 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg shadow-primary/40 flex items-center justify-center z-40 transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-xl">
            <span class="material-symbols-outlined text-3xl">add</span>
        </button>
    `
    },

    expenses: (expenses, period = 'todos') => {
        const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
        const today = new Date().toISOString().split('T')[0];

        return `
        <header class="sticky top-0 z-10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-4">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-3xl">payments</span>
                    <h1 class="text-xl font-bold tracking-tight">Gestión de Gastos</h1>
                </div>
            </div>
            
            <!-- Dashboard Card -->
            <div class="bg-primary p-5 rounded-2xl shadow-lg shadow-primary/20 text-white relative overflow-hidden mb-6">
                <div class="relative z-10">
                    <div class="flex items-center gap-2 opacity-80 mb-1">
                        <span class="material-symbols-outlined text-sm">account_balance_wallet</span>
                        <p class="text-[10px] font-bold uppercase tracking-widest">Total Gastos (${period})</p>
                    </div>
                    <p class="text-3xl font-extrabold">$${total.toLocaleString()}</p>
                    <p class="text-[10px] mt-2 bg-white/20 inline-block px-2 py-0.5 rounded-full backdrop-blur-sm">Periodo: ${period.charAt(0).toUpperCase() + period.slice(1)}</p>
                </div>
                <span class="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl opacity-10 rotate-12">trending_down</span>
            </div>

            <!-- Filtros Rápidos -->
            <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-4">
                ${['todos', 'hoy', 'semana', 'quincena', 'mes'].map(p => `
                    <button onclick="app.filterExpenses('${p}')" class="px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${period === p ? 'bg-primary text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}">
                        ${p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                `).join('')}
            </div>

            <!-- Acciones -->
            <div class="flex gap-2">
                <button onclick="app.showModal('newExpense')" class="flex-1 bg-primary text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                    <span class="material-symbols-outlined text-sm">add</span> Agregar Gasto
                </button>
                <button onclick="app.exportExpensesPDF()" class="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold px-4 py-3 rounded-xl flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined text-sm">picture_as_pdf</span> Reporte
                </button>
            </div>
        </header>

        <div class="px-4 space-y-3 py-4 pb-24">
            <h3 class="font-bold text-slate-900 dark:text-slate-100 uppercase text-[10px] tracking-widest mb-2">Lista de Gastos</h3>
            ${expenses.length === 0 ? `
                <div class="flex flex-col items-center justify-center py-12 text-center opacity-40">
                    <span class="material-symbols-outlined text-5xl mb-2">receipt_long</span>
                    <p class="text-sm font-bold text-slate-500">Sin gastos registrados</p>
                    <p class="text-xs text-slate-400">Tus gastos aparecerán aquí.</p>
                </div>
            ` : ''}
            ${expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).map(expense => `
                <div onclick="app.showModal('expenseDetails', '${expense.id}')" class="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm active:scale-95 transition-transform">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-500 flex items-center justify-center">
                            <span class="material-symbols-outlined text-xl">${getCategoryIcon(expense.category)}</span>
                        </div>
                        <div class="text-left">
                            <p class="text-sm font-bold text-slate-900 dark:text-slate-100">${expense.description}</p>
                            <p class="text-[10px] text-slate-500 font-medium">${expense.date} • ${expense.category}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-sm font-bold text-rose-600">-$${parseFloat(expense.amount).toLocaleString()}</p>
                    </div>
                </div>
            `).join('')}
        </div>
        `;
    },

    agenda: (agendaItems) => `
        <header class="flex items-center p-4 pb-2 justify-between sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10 border-b border-slate-100 dark:border-slate-800">
            <div class="text-primary flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <span class="material-symbols-outlined text-2xl">calendar_month</span>
            </div>
            <h1 class="text-xl font-bold leading-tight tracking-tight flex-1 ml-3">Agenda de Cobros</h1>
        </header>
        
        <div class="px-4 py-4 sticky top-[73px] z-10 bg-background-light dark:bg-background-dark pb-2">
             <div class="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-xl">
                <button data-target="today" class="agenda-tab flex-1 py-2 rounded-lg text-xs font-bold transition-all bg-primary text-white shadow-md">
                    Hoy (${agendaItems.today.length})
                </button>
                <button data-target="overdue" class="agenda-tab flex-1 py-2 rounded-lg text-xs font-bold transition-all text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700">
                    Vencidos (${agendaItems.overdue.length})
                </button>
                <button data-target="upcoming" class="agenda-tab flex-1 py-2 rounded-lg text-xs font-bold transition-all text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700">
                    Próximos
                </button>
            </div>
        </div>

        <div class="flex-1 px-4 py-4 space-y-4">
            <!-- SECCIÓN: HOY -->
            <div id="agenda-today" class="agenda-section space-y-4">
                 <div class="flex flex-col gap-2 rounded-xl p-6 bg-primary text-white shadow-lg shadow-primary/20 mb-4">
                    <p class="text-primary-100 text-sm font-medium opacity-90">Total Esperado Hoy</p>
                    <div class="flex items-baseline gap-2">
                        <p class="text-3xl font-bold tracking-tight">$${agendaItems.today.reduce((s, i) => s + i.amount, 0).toLocaleString()}</p>
                    </div>
                </div>
                
                ${agendaItems.today.length === 0 ? '<div class="text-center py-10"><p class="text-sm text-slate-400 italic">Todo al día. No hay cobros para hoy.</p></div>' : ''}
                ${agendaItems.today.map(item => `
                    <div class="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-bold truncate text-slate-900 dark:text-slate-100">${item.clientName}</p>
                            <p class="text-xs text-slate-500 font-medium">Cuota ${item.number} • $${item.amount.toLocaleString()}</p>
                        </div>
                        <button onclick="app.showModal('payInstallment', '${item.id}')" class="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-sm hover:bg-primary/90">Cobrar</button>
                    </div>
                `).join('')}
            </div>

            <!-- SECCIÓN: VENCIDOS -->
            <div id="agenda-overdue" class="agenda-section hidden space-y-3">
                 <div class="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl p-4 mb-4 flex items-center gap-3">
                    <span class="material-symbols-outlined text-red-500">warning</span>
                    <div>
                        <p class="text-red-700 dark:text-red-400 text-sm font-bold">Cobros Vencidos</p>
                        <p class="text-red-600/70 dark:text-red-400/70 text-xs">Atención prioritaria requerida</p>
                    </div>
                 </div>

                 ${agendaItems.overdue.length === 0 ? '<div class="text-center py-10"><p class="text-sm text-slate-400 italic">Excelente. No hay pagos vencidos.</p></div>' : ''}
                 ${agendaItems.overdue.map(item => `
                    <div class="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border-l-4 border-l-red-500 border-y border-r border-slate-100 dark:border-slate-800 shadow-sm">
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-bold truncate text-slate-900 dark:text-slate-100">${item.clientName}</p>
                            <div class="flex items-center gap-2 mt-1">
                                <span class="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded font-bold">${item.dueDate}</span>
                                <span class="text-xs text-slate-500 font-bold">$${item.amount.toLocaleString()}</span>
                            </div>
                        </div>
                        <button onclick="app.showModal('payInstallment', '${item.id}')" class="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-red-600">Cobrar</button>
                    </div>
                 `).join('')}
            </div>

            <!-- SECCIÓN: PRÓXIMOS -->
            <div id="agenda-upcoming" class="agenda-section hidden space-y-3">
                ${agendaItems.upcoming.length === 0 ? '<div class="text-center py-10"><p class="text-sm text-slate-400 italic">No hay cobros próximos registrados.</p></div>' : ''}
                ${agendaItems.upcoming.slice(0, 20).map(item => `
                    <div class="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-bold truncate text-slate-900 dark:text-slate-100">${item.clientName}</p>
                            <p class="text-xs text-slate-500 font-medium">${item.dueDate} • $${item.amount.toLocaleString()}</p>
                        </div>
                        <div class="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                            Cuota ${item.number}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `,

    modals: {
        newClient: () => `
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-bold">Nuevo Cliente</h3>
                    <button onclick="app.hideModal()" class="text-slate-400"><span class="material-symbols-outlined">close</span></button>
                </div>
                <form id="client-form" class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre Completo</label>
                        <input name="name" required class="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary" type="text" placeholder="Ej: Juan Pérez"/>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Cédula / ID</label>
                            <input name="documentId" class="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary" type="text" placeholder="000-0000000-0"/>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Teléfono</label>
                            <input name="phone" required class="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary" type="tel" placeholder="0000-0000"/>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Correo Electrónico</label>
                        <input name="email" class="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary" type="email" placeholder="ejemplo@correo.com"/>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Dirección</label>
                        <input name="address" class="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary" type="text" placeholder="Calle, Número, Ciudad"/>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Notas</label>
                        <textarea name="notes" rows="3" class="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary resize-none" placeholder="Comentarios adicionales..."></textarea>
                    </div>
                    <div class="flex gap-3 pt-2">
                        <button type="button" onclick="app.hideModal()" class="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-4 rounded-xl transition-colors hover:bg-slate-300 dark:hover:bg-slate-600">Cancelar</button>
                        <button type="submit" class="flex-1 bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all">Guardar Cliente</button>
                    </div>
                </form>
            </div>
        `,
        editClient: (client) => `
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-bold">Editar Cliente</h3>
                    <button onclick="app.hideModal()" class="text-slate-400"><span class="material-symbols-outlined">close</span></button>
                </div>
                <form id="client-form" class="space-y-4">
                    <input type="hidden" name="id" value="${client.id}"/>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre Completo</label>
                        <input name="name" required value="${client.name}" class="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary" type="text"/>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Cédula / ID</label>
                            <input name="documentId" required value="${client.documentId || ''}" class="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary" type="text"/>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Teléfono</label>
                            <input name="phone" required value="${client.phone}" class="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary" type="tel"/>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Correo Electrónico</label>
                        <input name="email" value="${client.email || ''}" class="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary" type="email"/>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Dirección</label>
                        <input name="address" value="${client.address || ''}" class="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary" type="text"/>
                    </div>
                    <button type="submit" class="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 mt-4">Guardar Cambios</button>
                </form>
            </div>
        `,
        newLoan: (clients, preSelectedClientId = null, defaultInterest = 20) => `
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-bold">Nuevo Préstamo</h3>
                    <button onclick="app.hideModal()" class="text-slate-400"><span class="material-symbols-outlined">close</span></button>
                </div>
                <form id="loan-form" class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Seleccionar Cliente</label>
                        <select name="clientId" required class="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary">
                            <option value="">Seleccione un cliente</option>
                            ${clients.map(c => `<option value="${c.id}" ${c.id === preSelectedClientId ? 'selected' : ''}>${c.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Monto</label>
                            <input name="amount" required step="0.01" class="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary" type="number" placeholder="0.00"/>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Interés (%)</label>
                            <input name="interestRate" required value="${defaultInterest}" class="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary" type="number"/>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Cuotas</label>
                            <input name="installmentsCount" required value="12" class="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary" type="number"/>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Frecuencia</label>
                            <select name="frequency" class="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary">
                                <option value="diario">Diario</option>
                                <option value="semanal">Semanal</option>
                                <option value="quincenal">Quincenal</option>
                                <option value="mensual" selected>Mensual</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha de Inicio</label>
                        <input name="startDate" required value="${new Date().toISOString().split('T')[0]}" class="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary" type="date"/>
                    </div>
                    <button type="submit" class="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 mt-4">Desembolsar Préstamo</button>
                </form>
            </div>
        `,
        payInstallment: (installment) => {
            const alreadyPaid = installment.paidAmount || 0;
            const remaining = installment.amount - alreadyPaid;
            const isPartial = alreadyPaid > 0 && remaining > 0;
            return `
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-bold">Registrar Abono</h3>
                    <button onclick="app.hideModal()" class="text-slate-400"><span class="material-symbols-outlined">close</span></button>
                </div>

                <!-- Resumen de la cuota -->
                <div class="bg-slate-50 dark:bg-slate-800 rounded-xl mb-4 overflow-hidden">
                    <div class="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                        <span class="text-xs font-bold text-slate-500 uppercase">Cuota #${installment.number}</span>
                        ${isPartial ? '<span class="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full uppercase">Pago parcial</span>' : ''}
                    </div>
                    <div class="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-700">
                        <div class="p-3 text-center">
                            <p class="text-[10px] text-slate-400 uppercase font-bold mb-1">Total</p>
                            <p class="text-sm font-bold text-slate-700 dark:text-slate-300">$${installment.amount.toLocaleString()}</p>
                        </div>
                        <div class="p-3 text-center">
                            <p class="text-[10px] text-slate-400 uppercase font-bold mb-1">Pagado</p>
                            <p class="text-sm font-bold text-emerald-600">$${alreadyPaid.toLocaleString()}</p>
                        </div>
                        <div class="p-3 text-center">
                            <p class="text-[10px] text-slate-400 uppercase font-bold mb-1">Pendiente</p>
                            <p class="text-sm font-bold text-primary">$${remaining.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <form id="payment-form" class="space-y-4">
                    <input type="hidden" name="installmentId" value="${installment.id}"/>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Monto del Abono</label>
                        <input name="amount" required step="0.01" min="0.01" max="${remaining}"
                               value="${remaining}"
                               class="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-2xl font-bold text-center focus:ring-2 focus:ring-primary" type="number"/>
                        <p class="text-[10px] text-slate-400 mt-1 text-center">Puede abonar cualquier valor hasta $${remaining.toLocaleString()}</p>
                    </div>
                    <button type="submit" class="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-600/20 mt-4 flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined">payments</span> Confirmar Abono
                    </button>
                </form>
            </div>
        `},
        loanDetails: (loan, installments) => {
            const nextToPay = installments.find(i => i.status !== 'paid');
            return `
            <div class="p-6 h-[85vh] flex flex-col">
                <div class="flex justify-between items-center mb-6 shrink-0">
                    <h3 class="text-xl font-bold">Detalle del Préstamo</h3>
                    <button onclick="app.hideModal()" class="text-slate-400"><span class="material-symbols-outlined">close</span></button>
                </div>
                
                <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl mb-6 shrink-0 grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-[10px] text-slate-500 uppercase font-bold">Monto Total</p>
                        <p class="text-lg font-bold text-slate-900 dark:text-slate-100">$${loan.amount.toLocaleString()}</p>
                    </div>
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-[10px] text-slate-500 uppercase font-bold">Restante</p>
                            <p class="text-lg font-bold text-primary">$${installments.reduce((sum, i) => sum + (i.amount - i.paidAmount), 0).toLocaleString()}</p>
                        </div>
                        ${nextToPay ? `
                        <button onclick="app.showModal('payInstallment', '${nextToPay.id}')" class="flex items-center justify-center w-10 h-10 bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-500/30 hover:scale-105 transition-transform" title="Abonar">
                            <span class="material-symbols-outlined">payments</span>
                        </button>` : ''}
                    </div>
                </div>

                <div class="flex-1 overflow-y-auto pr-1 space-y-3">
                    ${installments.map(i => {
                const isPaid = i.status === 'paid';
                const isOverdue = !isPaid && i.dueDate < new Date().toISOString().split('T')[0];

                let statusConfig = { color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800', icon: 'schedule', text: 'Pendiente' };
                if (isPaid) statusConfig = { color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: 'check_circle', text: 'Pagado' };
                else if (isOverdue) statusConfig = { color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', icon: 'warning', text: 'Atrasado' };

                return `
                        <div class="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-full ${statusConfig.bg} ${statusConfig.color} flex items-center justify-center">
                                    <span class="material-symbols-outlined">${statusConfig.icon}</span>
                                </div>
                                <div>
                                    <p class="text-sm font-bold text-slate-900 dark:text-slate-100">Cuota ${i.number}</p>
                                    <p class="text-xs text-slate-500 font-medium">${i.dueDate}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="text-sm font-bold text-slate-900 dark:text-slate-100">$${i.amount.toLocaleString()}</p>
                                <p class="text-[10px] font-bold uppercase ${statusConfig.color}">${statusConfig.text}</p>
                            </div>
                        </div>
                        `;
            }).join('')}
                </div>
            </div>
        `;
        },
        viewDocument: (doc) => `
            <div class="h-[85vh] flex flex-col bg-white dark:bg-slate-900 rounded-t-2xl overflow-hidden">
                <div class="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800">
                    <h3 class="font-bold text-slate-900 dark:text-slate-100">${doc ? doc.name : 'Documento'}</h3>
                    <button onclick="app.hideModal()" class="text-slate-400"><span class="material-symbols-outlined">close</span></button>
                </div>
                <div class="flex-1 bg-slate-100 dark:bg-slate-950 p-2">
                    ${doc ? (doc.type === 'image'
                ? `<div class="w-full h-full overflow-auto flex justify-center"><img src="${doc.data}" class="max-w-full rounded-xl shadow-sm object-contain" /></div>`
                : `<object data="${doc.data}" type="application/pdf" class="w-full h-full rounded-xl"><p class="p-4 text-center text-sm text-slate-500">Tu dispositivo no puede mostrar este PDF aquí. <a href="${doc.data}" download="${doc.name}.pdf" class="text-primary font-bold">Descárgalo</a> para verlo.</p></object>`)
                : '<p class="text-center p-10">Documento no encontrado</p>'}
                </div>
            </div>
        `,
        notification: (config) => `
            <div class="p-8 text-center flex flex-col items-center">
                <div class="w-20 h-20 rounded-full ${config.iconClass.replace('text-', 'bg-').replace('500', '-100')} dark:${config.iconClass.replace('text-', 'bg-').replace('500', '-900/20')} flex items-center justify-center mb-5">
                    <span class="material-symbols-outlined text-5xl ${config.iconClass}">${config.icon}</span>
                </div>
                <h3 class="text-xl font-bold mb-2">${config.title}</h3>
                <p class="text-sm text-slate-500 mb-8 max-w-xs">${config.message}</p>
                <div class="w-full flex flex-col gap-2">
                    ${config.actions.map(action => `
                        <button onclick="${action.onClick}" class="w-full font-bold py-3 rounded-xl transition-all ${action.class}">${action.text}</button>
                    `).join('')}
                </div>
            </div>
        `,
        notifications: (overdue, today) => `
            <div class="p-6 h-[85vh] flex flex-col">
                <div class="flex justify-between items-center mb-6 shrink-0">
                    <h3 class="text-xl font-bold">Notificaciones</h3>
                    <button onclick="app.hideModal()" class="text-slate-400"><span class="material-symbols-outlined">close</span></button>
                </div>
                
                <div class="flex-1 overflow-y-auto space-y-6 pr-1">
                    <!-- Vencidos -->
                    ${overdue.length > 0 ? `
                        <div class="space-y-3">
                            <h4 class="text-xs font-bold text-red-500 uppercase tracking-wider flex items-center gap-2">
                                <span class="material-symbols-outlined text-sm">warning</span> Vencidos (${overdue.length})
                            </h4>
                            ${overdue.map(item => `
                                <div class="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
                                    <div>
                                        <p class="text-sm font-bold text-slate-900 dark:text-slate-100">${item.clientName}</p>
                                        <p class="text-xs text-red-600 font-medium">Vence: ${item.dueDate} • $${item.amount.toLocaleString()}</p>
                                    </div>
                                    <button onclick="app.showModal('payInstallment', '${item.id}')" class="px-3 py-1 bg-white dark:bg-slate-800 text-red-500 text-xs font-bold rounded-lg shadow-sm border border-red-100 dark:border-red-900/20 hover:bg-red-50">Cobrar</button>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    <!-- Para Hoy -->
                    ${today.length > 0 ? `
                        <div class="space-y-3">
                            <h4 class="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                                <span class="material-symbols-outlined text-sm">calendar_today</span> Para Hoy (${today.length})
                            </h4>
                            ${today.map(item => `
                                <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <div>
                                        <p class="text-sm font-bold text-slate-900 dark:text-slate-100">${item.clientName}</p>
                                        <p class="text-xs text-slate-500 font-medium">Cuota ${item.number} • $${item.amount.toLocaleString()}</p>
                                    </div>
                                    <button onclick="app.showModal('payInstallment', '${item.id}')" class="px-3 py-1 bg-white dark:bg-slate-900 text-primary text-xs font-bold rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50">Cobrar</button>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    ${overdue.length === 0 && today.length === 0 ? `
                        <div class="flex flex-col items-center justify-center py-20 text-center opacity-40">
                            <span class="material-symbols-outlined text-6xl text-slate-300 mb-4">notifications_off</span>
                            <p class="text-sm font-bold text-slate-500">No hay notificaciones</p>
                            <p class="text-xs text-slate-400">Estás al día con todos los cobros.</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `,
        newExpense: () => `
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-bold">Registrar Gasto</h3>
                    <button onclick="app.hideModal()" class="text-slate-400"><span class="material-symbols-outlined">close</span></button>
                </div>
                <form id="expense-form" class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Monto del Gasto</label>
                        <input name="amount" required step="0.01" class="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-2xl font-bold text-center focus:ring-2 focus:ring-primary" type="number" placeholder="0.00"/>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Categoría</label>
                        <select name="category" required class="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary">
                            <option value="comida">Comida</option>
                            <option value="transporte">Transporte</option>
                            <option value="compras">Compras</option>
                            <option value="servicios">Servicios</option>
                            <option value="otros" selected>Otros</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Descripción</label>
                        <input name="description" required class="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary" type="text" placeholder="Ej: Almuerzo ejecutivo"/>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha</label>
                            <input name="date" required value="${new Date().toISOString().split('T')[0]}" class="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary" type="date"/>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Método de Pago</label>
                            <select name="paymentMethod" class="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary">
                                <option value="efectivo" selected>Efectivo</option>
                                <option value="tarjeta">Tarjeta</option>
                                <option value="transferencia">Transferencia</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" class="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 mt-4">Guardar Gasto</button>
                </form>
            </div>
        `,
        expenseDetails: (expense) => `
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-bold">Detalle de Gasto</h3>
                    <button onclick="app.hideModal()" class="text-slate-400"><span class="material-symbols-outlined">close</span></button>
                </div>
                
                <div class="flex flex-col items-center mb-6">
                    <div class="w-20 h-20 rounded-2xl bg-rose-50 dark:bg-rose-900/10 text-rose-500 flex items-center justify-center mb-3">
                        <span class="material-symbols-outlined text-4xl">${getCategoryIcon(expense.category)}</span>
                    </div>
                    <p class="text-3xl font-extrabold text-slate-900 dark:text-slate-100">-$${parseFloat(expense.amount).toLocaleString()}</p>
                    <p class="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">${expense.category}</p>
                </div>

                <div class="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 space-y-4">
                    <div>
                        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Descripción</p>
                        <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">${expense.description}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Fecha</p>
                            <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">${expense.date}</p>
                        </div>
                        <div>
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Pago</p>
                            <p class="text-sm font-semibold text-slate-900 dark:text-slate-100 capitalize">${expense.paymentMethod || 'Efectivo'}</p>
                        </div>
                    </div>
                    <div>
                        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">ID del Gasto</p>
                        <p class="text-xs font-mono text-slate-500 mt-0.5">#${expense.id}</p>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3 mt-6">
                    <button onclick="app.hideModal()" class="w-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-3 rounded-xl transition-all">Cerrar</button>
                    <button onclick="app.deleteExpense('${expense.id}')" class="w-full bg-rose-50 dark:bg-rose-900/10 text-rose-600 font-bold py-3 rounded-xl border border-rose-100 dark:border-rose-900/20 transition-all">Eliminar</button>
                </div>
            </div>
        `
    }
};

// Global Helper for category icons
const getCategoryIcon = (category) => {
    const cat = category.toLowerCase();
    switch (cat) {
        case 'comida': return 'restaurant';
        case 'transporte': return 'directions_car';
        case 'compras': return 'shopping_bag';
        case 'servicios': return 'ev_station';
        case 'otros': return 'more_horiz';
        default: return 'receipt_long';
    }
};
