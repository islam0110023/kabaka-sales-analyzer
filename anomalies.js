// Audit Alerts & Observation Engine for Sindbad Sales
// Detects:
// 1. Price discrepancies for same item code with 0.00% discount + lost variance calculation
// 2. Duplicate item entries in multiple rows within the same invoice
// 3. Items / lines with profit margin less than 20%
// 4. Invoices recorded during Day 1 dawn (belonging to previous shift)

export class AnomalyDetector {
    static detectAll(activeItems, cutoffHour, dates, activeTab = '', allItems = []) {
        const fullList = (allItems && allItems.length > 0) ? allItems : activeItems;
        let prevShift = [];
        if (activeTab === 'day2_dawn') {
            prevShift = [];
        } else if (activeTab === 'day1_excluded') {
            prevShift = this.detectPreviousShiftInvoices(activeItems, cutoffHour, dates);
        } else {
            prevShift = this.detectPreviousShiftInvoices(fullList, cutoffHour, dates);
        }

        return {
            priceDiscrepancies: this.detectPriceDiscrepancies(activeItems),
            duplicateItemsInInvoice: this.detectDuplicateItemsInInvoice(activeItems),
            lowMarginItems: this.detectLowMarginItems(activeItems),
            previousShiftInvoices: prevShift
        };
    }

    /**
     * 1. Price discrepancies for same item code with 0.00% discount + lost variance calculation
     */
    static detectPriceDiscrepancies(items) {
        const itemMap = new Map();

        items.forEach(item => {
            const isZeroDiscount = item.discount === 0 || 
                item.rawDiscount === '0.00%' || 
                item.rawDiscount === '0%' || 
                !item.rawDiscount;

            if (!isZeroDiscount) return;

            const code = item.itemCode || item.itemName;
            if (!itemMap.has(code)) {
                itemMap.set(code, {
                    code: item.itemCode,
                    name: item.itemName,
                    occurrences: []
                });
            }

            itemMap.get(code).occurrences.push({
                invoiceNo: item.invoiceNo,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                date: item.date,
                time: item.time,
                cashier: item.cashier
            });
        });

        const discrepancies = [];

        itemMap.forEach(entry => {
            const prices = [...new Set(entry.occurrences.map(o => o.unitPrice))];
            if (prices.length > 1) {
                const minPrice = Math.min(...prices);
                const maxPrice = Math.max(...prices);
                const priceDiff = maxPrice - minPrice;

                // Calculate lost variance: if all units sold below maxPrice were sold at maxPrice
                let totalLostVariance = 0;
                entry.occurrences.forEach(o => {
                    if (o.unitPrice < maxPrice) {
                        totalLostVariance += (maxPrice - o.unitPrice) * o.quantity;
                    }
                });

                discrepancies.push({
                    code: entry.code,
                    name: entry.name,
                    distinctPrices: prices.sort((a, b) => b - a),
                    minPrice,
                    maxPrice,
                    priceDiff,
                    lostVariance: Math.round(totalLostVariance * 100) / 100,
                    totalCount: entry.occurrences.length,
                    occurrences: entry.occurrences
                });
            }
        });

        discrepancies.sort((a, b) => b.lostVariance - a.lostVariance);
        return discrepancies;
    }

    /**
     * 2. Same item repeated across multiple rows in the same invoice
     */
    static detectDuplicateItemsInInvoice(items) {
        const invoiceMap = new Map();

        items.forEach(item => {
            const invKey = item.invoiceNo;
            if (!invoiceMap.has(invKey)) {
                invoiceMap.set(invKey, {
                    invoiceNo: item.invoiceNo,
                    date: item.date,
                    time: item.time,
                    cashier: item.cashier,
                    payment: item.payment,
                    itemsMap: new Map()
                });
            }

            const inv = invoiceMap.get(invKey);
            const itemKey = item.itemCode || item.itemName;

            if (!inv.itemsMap.has(itemKey)) {
                inv.itemsMap.set(itemKey, []);
            }
            inv.itemsMap.get(itemKey).push(item);
        });

        const duplicates = [];

        invoiceMap.forEach(inv => {
            inv.itemsMap.forEach((lineItems, itemKey) => {
                if (lineItems.length > 1) {
                    const totalQty = lineItems.reduce((acc, cur) => acc + cur.quantity, 0);
                    const totalNet = lineItems.reduce((acc, cur) => acc + cur.net, 0);

                    duplicates.push({
                        invoiceNo: inv.invoiceNo,
                        date: inv.date,
                        time: inv.time,
                        cashier: inv.cashier,
                        payment: inv.payment,
                        itemCode: lineItems[0].itemCode,
                        itemName: lineItems[0].itemName,
                        rowCount: lineItems.length,
                        totalQty,
                        totalNet,
                        rows: lineItems
                    });
                }
            });
        });

        return duplicates;
    }

    /**
     * 3. Items with profit margin less than 20%
     */
    static detectLowMarginItems(items) {
        const itemAgg = new Map();

        items.forEach(item => {
            const key = item.itemCode || item.itemName;
            if (!itemAgg.has(key)) {
                itemAgg.set(key, {
                    code: item.itemCode,
                    name: item.itemName,
                    totalSales: 0,
                    totalCost: 0,
                    totalProfit: 0,
                    totalQty: 0,
                    lowMarginRows: []
                });
            }

            const entry = itemAgg.get(key);
            entry.totalSales += item.net || 0;
            entry.totalCost += item.cost || 0;
            entry.totalProfit += item.profit || 0;
            entry.totalQty += item.quantity || 0;

            if (item.profitMargin < 20) {
                entry.lowMarginRows.push(item);
            }
        });

        const lowMarginItems = [];

        itemAgg.forEach(entry => {
            const overallMargin = entry.totalSales > 0 ? ((entry.totalProfit / entry.totalSales) * 100) : 0;
            if (overallMargin < 20 || entry.lowMarginRows.length > 0) {
                lowMarginItems.push({
                    code: entry.code,
                    name: entry.name,
                    overallMargin: Math.round(overallMargin * 10) / 10,
                    totalSales: Math.round(entry.totalSales * 100) / 100,
                    totalCost: Math.round(entry.totalCost * 100) / 100,
                    totalProfit: Math.round(entry.totalProfit * 100) / 100,
                    totalQty: entry.totalQty,
                    lowMarginRowCount: entry.lowMarginRows.length,
                    rows: entry.lowMarginRows
                });
            }
        });

        lowMarginItems.sort((a, b) => a.overallMargin - b.overallMargin);
        return lowMarginItems;
    }

    /**
     * 4. Invoices recorded at dawn of Day 1 (< cutoffHour) belonging to previous shift
     */
    static detectPreviousShiftInvoices(items, cutoffHour, dates) {
        const { day1 } = dates;
        if (!day1) return [];

        const invoicesMap = new Map();

        items.forEach(item => {
            if (item.date === day1 && item.hour < cutoffHour) {
                if (!invoicesMap.has(item.invoiceNo)) {
                    invoicesMap.set(item.invoiceNo, {
                        invoiceNo: item.invoiceNo,
                        date: item.date,
                        time: item.time,
                        hour: item.hour,
                        cashier: item.cashier,
                        payment: item.payment,
                        totalNet: 0,
                        totalCost: 0,
                        totalProfit: 0,
                        itemCount: 0,
                        items: []
                    });
                }

                const inv = invoicesMap.get(item.invoiceNo);
                inv.totalNet += item.net || 0;
                inv.totalCost += item.cost || 0;
                inv.totalProfit += item.profit || 0;
                inv.itemCount += item.quantity || 0;
                inv.items.push(item);
            }
        });

        const list = Array.from(invoicesMap.values()).map(inv => ({
            ...inv,
            totalNet: Math.round(inv.totalNet * 100) / 100,
            totalCost: Math.round(inv.totalCost * 100) / 100,
            totalProfit: Math.round(inv.totalProfit * 100) / 100
        }));

        list.sort((a, b) => a.time.localeCompare(b.time));
        return list;
    }
}
