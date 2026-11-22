// Export Engine for Sindbad Sales Analyzer
// Handles CSV export with UTF-8 BOM (so Arabic shows without corrupted characters in Excel),
// Multi-sheet Excel workbook export via SheetJS, and browser printing.

export class ExportManager {
    /**
     * Download text/CSV content with UTF-8 BOM
     */
    static downloadCSV(filename, csvContent) {
        // \uFEFF ensures Excel interprets UTF-8 properly for Arabic text
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /**
     * Export aggregated items table to CSV
     */
    static exportItemsToCSV(items, filename = 'sindbad_items_summary.csv') {
        const headers = [
            'كود الصنف',
            'اسم الصنف',
            'عدد الطلبات',
            'إجمالي الكمية',
            'إجمالي المبيعات (صافي)',
            'إجمالي التكلفة',
            'صافي الربح',
            'هامش الربح %',
            'نسبة المساهمة بالمبيعات %',
            'نسبة المساهمة بالربح %'
        ];

        const rows = items.map(item => [
            `"${item.code || ''}"`,
            `"${(item.name || '').replace(/"/g, '""')}"`,
            item.orderCount,
            item.totalQty,
            item.totalSales.toFixed(2),
            item.totalCost.toFixed(2),
            item.totalProfit.toFixed(2),
            `${item.profitMargin.toFixed(1)}%`,
            `${item.salesShare.toFixed(1)}%`,
            `${item.profitShare.toFixed(1)}%`
        ]);

        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
        this.downloadCSV(filename, csv);
    }

    /**
     * Export detailed invoices to CSV
     */
    static exportInvoicesToCSV(items, filename = 'sindbad_invoices_detail.csv') {
        const headers = [
            'م',
            'رقم الفاتورة',
            'التاريخ',
            'الوقت (24س)',
            'كود الصنف',
            'اسم الصنف',
            'الكمية',
            'سعر الوحدة',
            'الإجمالي',
            'الخصم%',
            'الصافي',
            'التكلفة',
            'الربح',
            'هامش الربح %',
            'الكاشير',
            'طريقة الدفع'
        ];

        const rows = items.map(item => [
            item.seq,
            `"${item.invoiceNo}"`,
            `"${item.date}"`,
            `"${item.time}"`,
            `"${item.itemCode}"`,
            `"${(item.itemName || '').replace(/"/g, '""')}"`,
            item.quantity,
            item.unitPrice.toFixed(2),
            item.total.toFixed(2),
            `"${item.rawDiscount || '0.00%'}"`,
            item.net.toFixed(2),
            item.cost.toFixed(2),
            item.profit.toFixed(2),
            `${item.profitMargin.toFixed(1)}%`,
            `"${(item.cashier || '').replace(/"/g, '""')}"`,
            `"${item.payment}"`
        ]);

        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
        this.downloadCSV(filename, csv);
    }

    /**
     * Export comprehensive multi-sheet Excel file via SheetJS (XLSX)
     */
    static exportToExcel(reportData, filename = 'sindbad_sales_analysis.xlsx') {
        if (typeof XLSX === 'undefined') {
            console.warn('XLSX library not loaded. Falling back to CSV export.');
            this.exportItemsToCSV(reportData.itemsAggregated);
            return;
        }

        const wb = XLSX.utils.book_new();

        // Sheet 1: KPIs & Summary
        const kpi = reportData.kpis;
        const meta = reportData.meta;
        const summaryData = [
            ['تقرير مبيعات KABAKA - ملخص الوردية'],
            ['اسم المنشأة / الفرع', meta.branch || 'KABAKA'],
            ['الفترة', `${meta.startDate || ''} إلى ${meta.endDate || ''}`],
            ['نوع العرض المفلتر', reportData.activeTabName],
            ['ساعة انتهاء الشيفت فجراً', `${String(reportData.cutoffHour).padStart(2, '0')}:00`],
            [],
            ['المؤشر', 'القيمة'],
            ['إجمالي المبيعات (قبل المرتجعات)', kpi.grossSales],
            ['إجمالي المرتجعات', kpi.returnsTotal],
            ['صافي المبيعات (بعد المرتجعات)', kpi.netSales],
            ['الدرج (صافي نقدية الكاش)', kpi.drawerSales],
            ['البنك (صافي شبكة/بطاقة)', kpi.bankSales],
            ['إجمالي التكلفة', kpi.totalCost],
            ['صافي الربح', kpi.netProfit],
            ['هامش الربح %', `${kpi.profitMargin}%`],
            ['عدد الفواتير', kpi.invoiceCount],
            ['القطع المباعة (قبل المرتجع)', kpi.salesQty],
            ['القطع المرتجعة', kpi.returnsQty],
            ['صافي القطع المباعة', kpi.totalQty],
            ['فلوس الخير (صافي القطع × 5 ج.م)', kpi.charityAmount],
            ['متوسط قيمة الفاتورة', kpi.avgBasket]
        ];
        const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, wsSummary, 'الملخص العام');

        // Sheet 2: Items Summary
        const itemsRows = [
            ['كود الصنف', 'اسم الصنف', 'عدد الطلبات', 'إجمالي الكمية', 'فلوس الخير (5 ج)', 'المبيعات', 'التكلفة', 'الربح', 'هامش الربح %', 'مساهمة المبيعات %', 'مساهمة الربح %'],
            ...reportData.itemsAggregated.map(i => [
                i.code, i.name, i.orderCount, i.totalQty, i.charityAmount, i.totalSales, i.totalCost, i.totalProfit, i.profitMargin, i.salesShare, i.profitShare
            ])
        ];
        const wsItems = XLSX.utils.aoa_to_sheet(itemsRows);
        XLSX.utils.book_append_sheet(wb, wsItems, 'ملخص الأصناف');

        // Sheet 3: Invoices Detail
        const invRows = [
            ['م', 'رقم الفاتورة', 'التاريخ', 'الوقت', 'كود الصنف', 'اسم الصنف', 'الكمية', 'سعر الوحدة', 'الإجمالي', 'الخصم%', 'الصافي', 'التكلفة', 'الربح', 'الكاشير', 'طريقة الدفع'],
            ...reportData.filteredItems.map(i => [
                i.seq, i.invoiceNo, i.date, i.time, i.itemCode, i.itemName, i.quantity, i.unitPrice, i.total, i.rawDiscount || '0.00%', i.net, i.cost, i.profit, i.cashier, i.payment
            ])
        ];
        const wsInvoices = XLSX.utils.aoa_to_sheet(invRows);
        XLSX.utils.book_append_sheet(wb, wsInvoices, 'تفاصيل الفواتير');

        // Sheet 4: Observations & Anomalies
        const anom = reportData.anomalies;
        const anomRows = [
            ['كشف الملاحظات والفروقات'],
            [],
            ['1. فروق الأسعار لنفس كود الصنف (بدون خصم)'],
            ['كود الصنف', 'اسم الصنف', 'الأسعار المسجلة', 'فرق السعر', 'أدنى سعر', 'أعلى سعر', 'عدد التكرار'],
            ...anom.priceDiscrepancies.map(p => [
                p.code, p.name, p.distinctPrices.join(', '), p.priceDiff, p.minPrice, p.maxPrice, p.totalCount
            ]),
            [],
            ['2. تكرار نفس الصنف في نفس الفاتورة'],
            ['رقم الفاتورة', 'الوقت', 'الكاشير', 'كود الصنف', 'اسم الصنف', 'عدد السطور', 'إجمالي الكمية'],
            ...anom.duplicateItemsInInvoice.map(d => [
                d.invoiceNo, d.time, d.cashier, d.itemCode, d.itemName, d.rowCount, d.totalQty
            ]),
            [],
            ['3. أصناف ذات هامش ربح أقل من 20%'],
            ['كود الصنف', 'اسم الصنف', 'هامش الربح %', 'إجمالي المبيعات', 'إجمالي التكلفة', 'صافي الربح'],
            ...anom.lowMarginItems.map(m => [
                m.code, m.name, `${m.overallMargin}%`, m.totalSales, m.totalCost, m.totalProfit
            ]),
            [],
            ['4. فواتير فجر اليوم الأول (الوردية السابقة المستبعدة)'],
            ['رقم الفاتورة', 'الوقت', 'الكاشير', 'طريقة الدفع', 'المبيعات', 'الربح'],
            ...anom.previousShiftInvoices.map(s => [
                s.invoiceNo, s.time, s.cashier, s.payment, s.totalNet, s.totalProfit
            ])
        ];
        const wsAnom = XLSX.utils.aoa_to_sheet(anomRows);
        XLSX.utils.book_append_sheet(wb, wsAnom, 'كشف الملاحظات');

        // Write and download
        XLSX.writeFile(wb, filename);
    }

    /**
     * Trigger browser print for the current report view
     */
    static printReport() {
        window.print();
    }
}
