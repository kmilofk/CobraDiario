class LoanLogic {
    /**
     * Generates a payment schedule for a loan.
     * @param {Object} loanParams { amount, interestRate, installmentsCount, frequency, startDate }
     * @returns {Array} List of installments
     */
    static generateInstallments(loanParams) {
        const { loanId, amount, interestRate, installmentsCount, frequency, startDate } = loanParams;
        const totalToPay = amount * (1 + (interestRate / 100));
        const installmentAmount = totalToPay / installmentsCount;
        const installments = [];

        let currentDate = new Date(startDate);

        for (let i = 1; i <= installmentsCount; i++) {
            // Calculate next date based on frequency
            if (i > 1) {
                switch (frequency) {
                    case 'diario': currentDate.setDate(currentDate.getDate() + 1); break;
                    case 'semanal': currentDate.setDate(currentDate.getDate() + 7); break;
                    case 'quincenal': currentDate.setDate(currentDate.getDate() + 15); break;
                    case 'mensual': currentDate.setMonth(currentDate.getMonth() + 1); break;
                }
            }

            installments.push({
                id: `${loanId}-${i}`,
                loanId: loanId,
                number: i,
                dueDate: currentDate.toISOString().split('T')[0],
                amount: installmentAmount,
                paidAmount: 0,
                status: 'pending' // pending, partially_paid, paid, overdue
            });
        }

        return installments;
    }

    static calculateLoanSummary(loan, installments) {
        const totalToPay = installments.reduce((sum, inst) => sum + inst.amount, 0);
        const totalPaid = installments.reduce((sum, inst) => sum + inst.paidAmount, 0);
        const remaining = totalToPay - totalPaid;
        const paidCount = installments.filter(i => i.status === 'paid').length;
        const progress = (totalPaid / totalToPay) * 100;

        return {
            totalToPay,
            totalPaid,
            remaining,
            paidCount,
            totalCount: installments.length,
            progress
        };
    }

    static getGlobalKPIs(loans, installments) {
        const totalLoaned = loans.reduce((sum, l) => sum + l.amount, 0);
        const totalRecovered = installments.reduce((sum, i) => sum + i.paidAmount, 0);
        const totalExpected = installments.reduce((sum, i) => sum + i.amount, 0);
        const pendingValue = totalExpected - totalRecovered;

        const today = new Date().toISOString().split('T')[0];
        const overdueCount = installments.filter(i => i.dueDate < today && i.status !== 'paid').length;
        const dueTodayCount = installments.filter(i => i.dueDate === today && i.status !== 'paid').length;

        return {
            totalLoaned,
            totalRecovered,
            pendingValue,
            activeLoans: loans.filter(l => l.status === 'active').length,
            overdueCount,
            dueTodayCount,
            recoveryRate: totalExpected > 0 ? (totalRecovered / totalExpected) * 100 : 0
        };
    }

    static processPayment(installment, amount) {
        // Work on a copy — never mutate the original in memory
        const updated = { ...installment };

        // How much is still owed on this installment
        const remaining = updated.amount - updated.paidAmount;

        // Cap the payment so paidAmount never exceeds the installment total
        const actualPayment = Math.min(amount, remaining);

        updated.paidAmount = updated.paidAmount + actualPayment;
        // Always record a payment date (even for partial payments)
        updated.paidDate = new Date().toISOString();

        if (updated.paidAmount >= updated.amount) {
            updated.status = 'paid';
        } else if (updated.paidAmount > 0) {
            updated.status = 'partially_paid';
        }
        return updated;
    }
}

class PDFGenerator {
    static generateLoanReceipt(loan, client, installments) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Colors
        const primary = "#1a1a7f";
        const secondary = "#64748b";

        // Header
        doc.setFillColor(primary);
        doc.rect(0, 0, pageWidth, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('inter', 'bold');
        doc.text('RECIBO DE PRÉSTAMO', pageWidth / 2, 25, { align: 'center' });

        // Company Logo/Name Placeholder (Simplified)
        doc.setFontSize(10);
        doc.text('PRESTOMANAGE - SISTEMA DE GESTIÓN', pageWidth - 10, 35, { align: 'right' });

        // Section: Client Info
        doc.setTextColor(primary);
        doc.setFontSize(14);
        doc.text('INFORMACIÓN DEL CLIENTE', 15, 55);

        doc.setDrawColor(primary);
        doc.setLineWidth(0.5);
        doc.line(15, 57, 70, 57);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont('inter', 'normal');
        doc.text(`Nombre: ${client.name}`, 15, 65);
        doc.text(`ID/Cédula: ${client.documentId || 'N/A'}`, 15, 71);
        doc.text(`Teléfono: ${client.phone}`, 15, 77);
        doc.text(`Email: ${client.email || 'N/A'}`, 15, 83);
        doc.text(`Dirección: ${client.address || 'N/A'}`, 15, 89);

        // Section: Loan Summary
        doc.setTextColor(primary);
        doc.setFontSize(14);
        doc.text('DETALLES DEL CRÉDITO', 110, 55);
        doc.line(110, 57, 165, 57);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        const totalToPay = installments.reduce((sum, i) => sum + i.amount, 0);
        doc.text(`Monto Prestado: $${loan.amount.toLocaleString()}`, 110, 65);
        doc.text(`Interés: ${loan.interestRate}%`, 110, 71);
        doc.text(`Total a Pagar: $${totalToPay.toLocaleString()}`, 110, 77);
        doc.text(`Cuotas: ${loan.installmentsCount} (${loan.frequency})`, 110, 83);
        doc.text(`Fecha de Inicio: ${loan.startDate}`, 110, 89);

        // Section: Installment Table
        doc.setTextColor(primary);
        doc.setFontSize(14);
        doc.text('CALENDARIO DE PAGOS', 15, 105);
        doc.line(15, 107, 70, 107);

        const tableData = installments.map(i => [
            i.number,
            i.dueDate,
            `$${i.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            'Pendiente'
        ]);

        doc.autoTable({
            startY: 112,
            head: [['#', 'Fecha de Vencimiento', 'Monto de Cuota', 'Estado']],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: primary, textColor: 255 },
            alternateRowStyles: { fillColor: [245, 245, 250] },
            margin: { left: 15, right: 15 }
        });

        // Footer: Signatures
        const finalY = doc.lastAutoTable.finalY + 20;
        doc.setFontSize(8);
        doc.setTextColor(secondary);
        doc.text(`Generado el: ${new Date().toLocaleString()}`, pageWidth / 2, finalY, { align: 'center' });

        return doc.output('datauristring');
    }

    static generatePaymentReceipt(paymentData, client, loan, remainingInstallments) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Configuración de Alta Resolución
        const width = 800;
        const height = 1100;
        canvas.width = width;
        canvas.height = height;

        // Fondos
        ctx.fillStyle = '#f8fafc'; // Slate 50 background
        ctx.fillRect(0, 0, width, height);

        // Tarjeta del Recibo (Sombra y Fondo Blanco)
        const cardX = 50;
        const cardY = 50;
        const cardW = width - 100;
        const cardH = height - 100;

        ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cardX, cardY, cardW, cardH);
        ctx.shadowBlur = 0;

        // Encabezado Azul
        ctx.fillStyle = '#1a1a7f'; // Primary
        ctx.fillRect(cardX, cardY, cardW, 140);

        // Texto Encabezado
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('COMPROBANTE DE PAGO', width / 2, 115);

        ctx.font = '18px sans-serif';
        ctx.globalAlpha = 0.8;
        ctx.fillText('PRESTOMANAGE - SISTEMA DE GESTIÓN', width / 2, 150);
        ctx.globalAlpha = 1.0;

        // Detalles
        const startY = 260; // Subimos el contenido
        const lineHeight = 60;
        const labelX = cardX + 60;
        const valueX = cardX + cardW - 60;

        const drawRow = (label, value, y) => {
            ctx.textAlign = 'left';
            ctx.fillStyle = '#94a3b8'; // Slate 400
            ctx.font = 'bold 20px sans-serif';
            ctx.fillText(label.toUpperCase(), labelX, y);

            ctx.textAlign = 'right';
            ctx.fillStyle = '#1e293b'; // Slate 800
            ctx.font = 'bold 24px sans-serif';
            ctx.fillText(value, valueX, y);

            // Línea separadora
            ctx.beginPath();
            ctx.moveTo(labelX, y + 25);
            ctx.lineTo(valueX, y + 25);
            ctx.strokeStyle = '#f1f5f9';
            ctx.lineWidth = 2;
            ctx.stroke();
        };

        drawRow('Cliente', client.name, startY);
        drawRow('Fecha', new Date().toLocaleDateString(), startY + lineHeight);
        drawRow('Hora', new Date().toLocaleTimeString(), startY + (lineHeight * 2));
        drawRow('Concepto', `Cuota #${paymentData.number}`, startY + (lineHeight * 3));
        drawRow('Referencia', loan.id.slice(-8).toUpperCase(), startY + (lineHeight * 4));

        // SECCIÓN TOTAL PAGADO (Al final)
        const totalSectionY = startY + (lineHeight * 5) + 40;

        // Fondo suave para el total
        ctx.fillStyle = '#f0fdf4'; // Green 50
        ctx.fillRect(cardX + 20, totalSectionY, cardW - 40, 160);

        ctx.textAlign = 'center';

        // Etiqueta
        ctx.fillStyle = '#059669'; // Emerald 600
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('TOTAL PAGADO', width / 2, totalSectionY + 50);

        // Monto Grande
        ctx.fillStyle = '#1a1a7f'; // Dark Blue
        ctx.font = 'bold 80px sans-serif';
        ctx.fillText(`$${paymentData.amount.toLocaleString()}`, width / 2, totalSectionY + 120);

        // Pie de página (Restante)
        const footerY = totalSectionY + 200;
        ctx.fillStyle = '#f8fafc';
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(`Saldo pendiente: Restan ${remainingInstallments} cuotas por pagar`, width / 2, footerY);

        // Marca de agua / Generado
        ctx.font = 'italic 16px sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(`Generado digitalmente el ${new Date().toLocaleString()}`, width / 2, height - 70);

        return canvas.toDataURL('image/png');
    }

    static generateFinancialReport(loans, clients, installments, startDate, endDate) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Filter Data
        let filteredLoans = loans;
        let filteredInst = installments.filter(i => i.status === 'paid' && i.paidAmount > 0);

        if (startDate && endDate) {
            filteredLoans = loans.filter(l => l.startDate >= startDate && l.startDate <= endDate);
            filteredInst = filteredInst.filter(i => i.paidDate && i.paidDate.split('T')[0] >= startDate && i.paidDate.split('T')[0] <= endDate);
        }

        // Header
        doc.setFillColor(26, 26, 127); // Primary
        doc.rect(0, 0, pageWidth, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('REPORTE FINANCIERO', pageWidth / 2, 25, { align: 'center' });

        doc.setFontSize(10);
        const dateRange = (startDate && endDate) ? `Desde: ${startDate}  Hasta: ${endDate}` : 'Reporte Histórico Completo';
        doc.text(dateRange, pageWidth / 2, 35, { align: 'center' });

        // KPIs Summary
        const totalLoaned = filteredLoans.reduce((s, l) => s + l.amount, 0);
        const totalCollected = filteredInst.reduce((s, i) => s + i.paidAmount, 0);
        const activeLoans = filteredLoans.filter(l => l.status === 'active').length;

        let y = 55;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text(`Total Prestado: $${totalLoaned.toLocaleString()}`, 14, y);
        doc.text(`Total Cobrado: $${totalCollected.toLocaleString()}`, 14, y + 7);
        doc.text(`Préstamos Activos (en rango): ${activeLoans}`, 14, y + 14);

        // Table: Loans
        y += 25;
        doc.setFontSize(14);
        doc.setTextColor(26, 26, 127);
        doc.text('Detalle de Préstamos', 14, y);

        const loanRows = filteredLoans.map(l => {
            const client = clients.find(c => c.id === l.clientId);
            return [l.startDate, client ? client.name : 'N/A', `$${l.amount.toLocaleString()}`, l.frequency, l.status];
        });

        doc.autoTable({
            startY: y + 5,
            head: [['Fecha', 'Cliente', 'Monto', 'Frecuencia', 'Estado']],
            body: loanRows,
            theme: 'striped',
            headStyles: { fillColor: [26, 26, 127] }
        });

        // Table: Movements
        const finalY = doc.lastAutoTable.finalY + 15;
        doc.text('Movimientos (Cobros)', 14, finalY);

        const moveRows = filteredInst.map(i => {
            const loan = loans.find(l => l.id === i.loanId);
            const client = clients.find(c => c.id === (loan ? loan.clientId : ''));
            return [i.paidDate.split('T')[0], client ? client.name : 'N/A', `Cuota ${i.number}`, `$${i.paidAmount.toLocaleString()}`];
        });

        doc.autoTable({
            startY: finalY + 5,
            head: [['Fecha', 'Cliente', 'Concepto', 'Ingreso']],
            body: moveRows,
            theme: 'striped',
            headStyles: { fillColor: [5, 150, 105] } // Emerald
        });

        doc.save(`Reporte_Financiero_${new Date().toISOString().split('T')[0]}.pdf`);
    }
}

// Exported to global scope for non-module compatibility
window.LoanLogic = LoanLogic;
window.PDFGenerator = PDFGenerator;
