// Shift Analysis & Partitioning Logic for Sindbad Sales Report
// Handles cutoff hour (01:00 to 11:00 AM, default 06:00 AM) and 5 distinct views

export const SHIFT_TABS = {
    ACTUAL_SHIFT: 'actual_shift',       // الشيفت الفعلي لليوم الأول (الافتراضي)
    ALL_REPORT: 'all_report',           // إجمالي التقرير بالكامل
    DAY1_ONLY: 'day1_only',             // تاريخ اليوم الأول فقط
    DAY2_DAWN: 'day2_dawn',             // سهرة فجر اليوم الثاني فقط
    DAY1_EXCLUDED: 'day1_excluded'      // فواتير فجر اليوم الأول المستبعدة
};

export class ShiftAnalyzer {
    /**
     * Determines Day 1 and Day 2 from dates present in items or metadata
     */
    static resolveDates(items, meta = {}) {
        const normalizeDateDisplay = (dStr) => {
            if (!dStr) return '';
            const parts = dStr.trim().split(/[-/.]/);
            if (parts.length === 3) {
                if (parts[0].length === 4) { // YYYY-MM-DD -> DD-MM-YYYY
                    return `${parts[2].padStart(2, '0')}-${parts[1].padStart(2, '0')}-${parts[0]}`;
                }
                return `${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}-${parts[2]}`;
            }
            return dStr;
        };

        let uniqueDates = [...new Set(items.map(i => i.date).filter(d => d && /^\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4}$/.test(d.trim())))];
        
        // Sort dates chronologically
        uniqueDates.sort((a, b) => {
            const parseDateObj = (dStr) => {
                const parts = dStr.split(/[-/.]/);
                if (parts.length === 3) {
                    if (parts[0].length === 4) { // YYYY-MM-DD
                        return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
                    }
                    // DD-MM-YYYY
                    return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
                }
                return new Date(dStr);
            };
            return parseDateObj(a) - parseDateObj(b);
        });

        const isMultiDay = uniqueDates.length > 2 || (meta.startDate && meta.endDate && meta.startDate !== meta.endDate);
        let day1 = uniqueDates[0] || meta.startDate || '';
        let day2 = isMultiDay 
            ? (uniqueDates[uniqueDates.length - 1] || meta.endDate || '') 
            : (uniqueDates[1] || meta.endDate || '');

        // If metadata has explicit dates, ensure compatibility
        if (meta.startDate && !day1) day1 = meta.startDate;
        if (meta.endDate && !day2 && meta.endDate !== day1) day2 = meta.endDate;

        // If day2 is not yet present and NOT multi-day (e.g. single day fetched), infer the next calendar day
        if (!isMultiDay && day1 && (!day2 || day2 === day1)) {
            const parts = day1.split(/[-/.]/);
            if (parts.length === 3) {
                const d1Obj = parts[0].length === 4
                    ? new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
                    : new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
                const d2Obj = new Date(d1Obj.getTime() + 24 * 60 * 60 * 1000);
                const dd = String(d2Obj.getDate()).padStart(2, '0');
                const mm = String(d2Obj.getMonth() + 1).padStart(2, '0');
                const yyyy = d2Obj.getFullYear();
                day2 = `${dd}-${mm}-${yyyy}`;
            }
        }

        day1 = normalizeDateDisplay(day1);
        day2 = normalizeDateDisplay(day2);

        return { day1, day2, allDates: uniqueDates, isMultiDay };
    }

    /**
     * Filter items according to the selected tab and cutoff hour
     * @param {Array} items - All invoice line items
     * @param {string} tab - Current selected tab
     * @param {number} cutoffHour - Cutoff hour integer (1 to 11, e.g. 6 for 06:00 AM)
     * @param {Object} dates - { day1, day2, isMultiDay, allDates }
     */
    static filterItems(items, tab, cutoffHour, dates) {
        const { day1, day2, isMultiDay } = dates;
        const isRangeMode = isMultiDay || (dates.allDates && dates.allDates.length > 2);

        const normDate = (d) => {
            if (!d) return '';
            const p = d.trim().split(/[-/.]/);
            if (p.length === 3) {
                if (p[0].length === 4) return `${p[2].padStart(2, '0')}-${p[1].padStart(2, '0')}-${p[0]}`;
                return `${p[0].padStart(2, '0')}-${p[1].padStart(2, '0')}-${p[2]}`;
            }
            return d;
        };

        const nDay1 = normDate(day1);
        const nDay2 = normDate(day2);

        return items.filter(item => {
            if (isRangeMode) {
                // In multi-day mode, both actual_shift and all_report mean the full period
                if (tab === SHIFT_TABS.ACTUAL_SHIFT || tab === SHIFT_TABS.ALL_REPORT) {
                    return true;
                }
            }

            const itemDate = normDate(item.date);
            const isDay1 = itemDate === nDay1;
            const isDay2 = nDay2 ? itemDate === nDay2 : false;
            const isBeforeCutoff = item.hour < cutoffHour;
            const isAfterOrAtCutoff = item.hour >= cutoffHour;

            switch (tab) {
                case SHIFT_TABS.ACTUAL_SHIFT:
                    // الشيفت الفعلي لليوم الأول:
                    if (isDay1 && isAfterOrAtCutoff) return true;
                    if (isDay2 && isBeforeCutoff) return true;
                    return false;

                case SHIFT_TABS.ALL_REPORT:
                    // إجمالي التقرير بالكامل
                    return true;

                case SHIFT_TABS.DAY1_ONLY:
                    // تاريخ اليوم الأول فقط (كامل اليوم 00:00 إلى 23:59)
                    return isDay1;

                case SHIFT_TABS.DAY2_DAWN:
                    // سهرة فجر اليوم الثاني فقط (فواتير اليوم الثاني قبل ساعة القطع)
                    return isDay2 && isBeforeCutoff;

                case SHIFT_TABS.DAY1_EXCLUDED:
                    // فواتير فجر اليوم الأول المستبعدة (فواتير اليوم الأول قبل ساعة القطع)
                    return isDay1 && isBeforeCutoff;

                default:
                    return true;
            }
        });
    }

    /**
     * Compute aggregated KPI statistics for a given set of filtered items
     */
    static computeKPIs(filteredItems, allItemsSummary = {}) {
        let grossSales = 0;
        let returnsTotal = 0;
        let salesQty = 0;
        let returnsQty = 0;
        let salesCost = 0;
        let returnsCost = 0;
        let salesProfit = 0;
        let returnsProfit = 0;
        let drawerSales = 0;
        let drawerReturns = 0;
        let bankSales = 0;
        let bankReturns = 0;

        const salesInvoices = new Set();
        const returnInvoices = new Set();
        let returnItemsCount = 0;

        filteredItems.forEach(item => {
            const q = Math.abs(item.quantity || 0);
            const tot = Math.abs(item.net || item.total || 0);
            const c = Math.abs(item.cost || 0);
            const p = Math.abs(item.profit || 0);

            if (item.isReturn) {
                returnItemsCount += 1;
                returnInvoices.add(item.invoiceNo);
                returnsTotal += tot;
                returnsQty += q;
                returnsCost += c;
                returnsProfit += p;

                if (item.payment === 'البنك') {
                    bankReturns += tot;
                } else {
                    drawerReturns += tot;
                }
            } else {
                salesInvoices.add(item.invoiceNo);
                grossSales += tot;
                salesQty += q;
                salesCost += c;
                salesProfit += p;

                if (item.payment === 'البنك') {
                    bankSales += tot;
                } else {
                    drawerSales += tot;
                }
            }
        });

        // Net figures (الصافي الفعلي بعد خصم المرتجعات)
        const netSales = Math.round((grossSales - returnsTotal) * 100) / 100;
        const netDrawer = Math.round((drawerSales - drawerReturns) * 100) / 100;
        const netBank = Math.round((bankSales - bankReturns) * 100) / 100;
        const netCost = Math.round((salesCost - returnsCost) * 100) / 100;
        const netProfit = Math.round((salesProfit - returnsProfit) * 100) / 100;
        const netQty = Math.max(0, Math.round((salesQty - returnsQty) * 100) / 100);

        // فلوس الخير: عدد الأصناف المباعة الصافية × 5 جنيه
        const charityAmount = Math.round((netQty * 5) * 100) / 100;

        const profitMargin = netSales > 0 ? ((netProfit / netSales) * 100) : 0;
        const avgBasket = salesInvoices.size > 0 ? (grossSales / salesInvoices.size) : 0;
        const totalUniqueInvoices = new Set(filteredItems.map(i => i.invoiceNo)).size;

        return {
            invoiceCount: totalUniqueInvoices,
            salesInvoiceCount: salesInvoices.size,
            returnInvoiceCount: returnInvoices.size,
            returnItemsCount,
            grossSales: Math.round(grossSales * 100) / 100,
            returnsTotal: Math.round(returnsTotal * 100) / 100,
            netSales,
            salesQty: Math.round(salesQty * 100) / 100,
            returnsQty: Math.round(returnsQty * 100) / 100,
            totalQty: netQty,
            charityAmount,
            totalCost: netCost,
            netProfit,
            profitMargin: Math.round(profitMargin * 10) / 10,
            avgBasket: Math.round(avgBasket * 100) / 100,
            drawerSales: netDrawer,
            grossDrawer: Math.round(drawerSales * 100) / 100,
            drawerReturns: Math.round(drawerReturns * 100) / 100,
            bankSales: netBank,
            grossBank: Math.round(bankSales * 100) / 100,
            bankReturns: Math.round(bankReturns * 100) / 100,
            tax: allItemsSummary.tax || 0
        };
    }

    /**
     * Aggregate data by Item for the items breakdown table
     */
    static aggregateByItem(filteredItems, totalShiftSales, totalShiftProfit) {
        const map = new Map();

        filteredItems.forEach(item => {
            const key = item.itemCode || item.itemName;
            if (!map.has(key)) {
                map.set(key, {
                    code: item.itemCode,
                    name: item.itemName,
                    orderCount: 0,
                    totalQty: 0,
                    totalSales: 0,
                    totalCost: 0,
                    totalProfit: 0,
                    prices: new Set(),
                    invoices: new Set()
                });
            }

            const entry = map.get(key);
            const q = Math.abs(item.quantity || 0);
            const tot = Math.abs(item.net || item.total || 0);
            const c = Math.abs(item.cost || 0);
            const p = Math.abs(item.profit || 0);

            if (item.isReturn) {
                entry.returnCount = (entry.returnCount || 0) + 1;
                entry.returnedQty = (entry.returnedQty || 0) + q;
                entry.totalQty -= q;
                entry.totalSales -= tot;
                entry.totalCost -= c;
                entry.totalProfit -= p;
            } else {
                entry.orderCount += 1;
                entry.soldQty = (entry.soldQty || 0) + q;
                entry.totalQty += q;
                entry.totalSales += tot;
                entry.totalCost += c;
                entry.totalProfit += p;
            }
            entry.prices.add(item.unitPrice);
            entry.invoices.add(item.invoiceNo);
        });

        const result = Array.from(map.values()).map(entry => {
            const margin = entry.totalSales > 0 ? ((entry.totalProfit / entry.totalSales) * 100) : 0;
            const salesShare = totalShiftSales > 0 ? ((entry.totalSales / totalShiftSales) * 100) : 0;
            const profitShare = totalShiftProfit > 0 ? ((entry.totalProfit / totalShiftProfit) * 100) : 0;

            return {
                code: entry.code,
                name: entry.name,
                orderCount: entry.orderCount,
                returnCount: entry.returnCount || 0,
                invoicesCount: entry.invoices.size,
                totalQty: Math.round(entry.totalQty * 100) / 100,
                charityAmount: Math.round((Math.max(0, entry.totalQty) * 5) * 100) / 100,
                totalSales: Math.round(entry.totalSales * 100) / 100,
                totalCost: Math.round(entry.totalCost * 100) / 100,
                totalProfit: Math.round(entry.totalProfit * 100) / 100,
                profitMargin: Math.round(margin * 10) / 10,
                salesShare: Math.round(salesShare * 10) / 10,
                profitShare: Math.round(profitShare * 10) / 10,
                priceCount: entry.prices.size
            };
        });

        // Default sort descending by totalSales
        result.sort((a, b) => b.totalSales - a.totalSales);
        return result;
    }

    /**
     * Aggregate data by Hour for hourly charts
     */
    static aggregateByHour(filteredItems) {
        const hours = Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            label: `${String(i).padStart(2, '0')}:00`,
            sales: 0,
            profit: 0,
            invoices: new Set(),
            qty: 0
        }));

        filteredItems.forEach(item => {
            const h = item.hour >= 0 && item.hour <= 23 ? item.hour : 0;
            const q = Math.abs(item.quantity || 0);
            const tot = Math.abs(item.net || item.total || 0);
            const p = Math.abs(item.profit || 0);

            if (item.isReturn) {
                hours[h].sales -= tot;
                hours[h].profit -= p;
                hours[h].qty -= q;
            } else {
                hours[h].sales += tot;
                hours[h].profit += p;
                hours[h].qty += q;
            }
            hours[h].invoices.add(item.invoiceNo);
        });

        return hours.map(h => ({
            hour: h.hour,
            label: h.label,
            sales: Math.round(h.sales * 100) / 100,
            profit: Math.round(h.profit * 100) / 100,
            qty: Math.round(h.qty * 100) / 100,
            invoiceCount: h.invoices.size
        }));
    }
}
