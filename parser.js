// Sindbad Sales Report HTML Parser for salez_report2.php
// Accurately parses 15 columns, 24h AM/PM time normalizer, <a> invoice links, and "::" summary totals

export class SindbadParser {
    static parseNumber(str) {
        if (str === null || str === undefined) return 0;
        if (typeof str === 'number') return str;
        const cleaned = str.toString().replace(/[^\d.-]/g, '').trim();
        const num = parseFloat(cleaned);
        return isNaN(num) ? 0 : num;
    }

    /**
     * Parses Sindbad time format: 24h format followed by AM or PM
     * e.g., "13:49:05 PM", "00:20:13 AM", "01:19:01 AM"
     * Rule: Strip AM and PM, extract HH:mm:ss directly in 24h format (00 to 23).
     */
    static parseTime(timeStr) {
        if (!timeStr) return { raw: '', time24: '00:00:00', hour: 0, minute: 0, second: 0 };
        const raw = timeStr.trim();
        const stripped = raw.replace(/\s*(AM|PM|am|pm|ص|م)\s*/gi, '').trim();
        const match = stripped.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/);
        if (match) {
            const hour = parseInt(match[1], 10);
            const min = parseInt(match[2], 10);
            const sec = match[3] ? parseInt(match[3], 10) : 0;
            const hh = String(hour).padStart(2, '0');
            const mm = String(min).padStart(2, '0');
            const ss = String(sec).padStart(2, '0');
            return { raw, time24: `${hh}:${mm}:${ss}`, hour, minute: min, second: sec };
        }
        return { raw, time24: stripped || '00:00:00', hour: 0, minute: 0, second: 0 };
    }

    static parseDate(dateStr) {
        if (!dateStr) return '';
        const trimmed = dateStr.trim();
        const dmyMatch = trimmed.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
        if (dmyMatch) {
            const day = String(dmyMatch[1]).padStart(2, '0');
            const month = String(dmyMatch[2]).padStart(2, '0');
            const year = dmyMatch[3];
            return `${day}-${month}-${year}`;
        }
        const ymdMatch = trimmed.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
        if (ymdMatch) {
            const year = ymdMatch[1];
            const month = String(ymdMatch[2]).padStart(2, '0');
            const day = String(ymdMatch[3]).padStart(2, '0');
            return `${day}-${month}-${year}`;
        }
        return trimmed;
    }

    static parse(htmlText) {
        if (!htmlText || typeof htmlText !== 'string') {
            throw new Error('لم يتم تزويد نص HTML صالح للتحليل.');
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        const isLoginPage = !!(
            doc.querySelector('input[type="password"]') ||
            (htmlText.includes('تسجيل الدخول') && (htmlText.includes('password') || htmlText.includes('username')))
        );

        const meta = this.extractMetadata(doc, htmlText);
        const { table, headers } = this.findSalesTable(doc);
        if (!table) {
            throw new Error('لم يتم العثور على جدول مبيعات سندباد في الكود المقدم. يرجى التأكد من استخراج التقرير التفصيلي.');
        }

        const { items, summaryRow } = this.extractTableRows(table, headers);
        const summaryFooter = this.extractSummaryFooter(doc, summaryRow);

        const uniqueDates = [...new Set(items.map(i => i.date).filter(Boolean))];
        if (!meta.startDate && uniqueDates.length > 0) meta.startDate = uniqueDates[0];
        if (!meta.endDate && uniqueDates.length > 0) meta.endDate = uniqueDates[uniqueDates.length - 1];
        meta.uniqueDates = uniqueDates;

        return { isLoginPage, meta, headers, items, summaryRow, summary: summaryFooter };
    }

    static extractMetadata(doc, rawHtml) {
        const meta = { title: 'تقرير مبيعات تفصيلي', branch: '', startDate: '', endDate: '', extractedAt: '' };
        const bodyText = doc.body ? doc.body.textContent : rawHtml;

        const h2 = doc.querySelector('h2, .report-title, h1');
        if (h2 && h2.textContent.trim()) meta.title = h2.textContent.trim();

        const branchMatch = bodyText.match(/(?:الفرع|فرع|اسم المحل|المحل)\s*[:：]\s*([^\n\r<]+)/i);
        if (branchMatch) meta.branch = branchMatch[1].trim();

        // Check <td id="ess"> or logo title as in Sindbad reports
        if (!meta.branch) {
            const essTd = doc.querySelector('#ess, [id*="ess"]');
            if (essTd && essTd.textContent.trim()) {
                meta.branch = essTd.textContent.trim();
            }
        }
        if (!meta.branch) {
            const imgWithTitle = doc.querySelector('img[title]');
            if (imgWithTitle && imgWithTitle.getAttribute('title').trim()) {
                meta.branch = imgWithTitle.getAttribute('title').trim();
            }
        }
        if (!meta.branch) meta.branch = 'KABAKA';

        // Match period format: "DD-MM-YYYY :: DD-MM-YYYY" or "YYYY-MM-DD إلى YYYY-MM-DD"
        const rangeMatch = bodyText.match(/(\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4})\s*(?:::|إلى|الى|-)\s*(\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4})/);
        if (rangeMatch) {
            meta.startDate = this.parseDate(rangeMatch[1]);
            meta.endDate = this.parseDate(rangeMatch[2]);
        }

        const extractMatch = bodyText.match(/(?:تاريخ الاستخراج|استخراج في)\s*[:：]\s*([^\n\r<]+)/i);
        if (extractMatch) meta.extractedAt = extractMatch[1].trim();

        return meta;
    }

    static findSalesTable(doc) {
        const tables = Array.from(doc.querySelectorAll('table'));
        if (tables.length === 0) return { table: null, headers: [] };

        let bestTable = null;
        let bestScore = -1;
        let bestHeaders = [];

        for (const tbl of tables) {
            let score = 0;
            const text = tbl.textContent;
            if (text.includes('الفاتورة') || text.includes('رقم الفاتورة')) score += 5;
            if (text.includes('الصنف') || text.includes('اسم الصنف')) score += 5;
            if (text.includes('الكود') || text.includes('كود الصنف')) score += 4;
            if (text.includes('الكمية')) score += 3;
            if (text.includes('الربح')) score += 3;
            if (text.includes('التكلفة')) score += 3;
            if (text.includes('الوحدة')) score += 2;
            if (text.includes('الحركة')) score += 2;
            if (text.includes('السعر')) score += 2;
            if (text.includes('الضريبة')) score += 2;

            if (score > bestScore) {
                bestScore = score;
                bestTable = tbl;
            }
        }

        if (!bestTable) bestTable = tables[0];

        // Find header row with th or td containing headers
        const headerRow = bestTable.querySelector('thead tr') || 
            Array.from(bestTable.querySelectorAll('tr')).find(tr => 
                tr.querySelectorAll('th').length >= 8 || 
                (tr.textContent.includes('الصنف') && tr.textContent.includes('الفاتورة'))
            );

        if (headerRow) {
            const ths = Array.from(headerRow.querySelectorAll('th, td'));
            bestHeaders = ths.map((cell, idx) => ({ index: idx, name: cell.textContent.trim() }));
        }

        return { table: bestTable, headers: bestHeaders };
    }

    /**
     * Map the 15 columns of salez_report2.php:
     * # | التاريخ | الوقت | الفاتورة | الحركة | الصنف | الكود | الكمية | الوحدة | السعر | الخصم% | الاجمالى | التكلفة | الربح | الضريبة
     */
    static mapColumnKeys(headers) {
        const map = {
            seq: -1, date: -1, time: -1, invoiceNo: -1, movement: -1, itemName: -1,
            itemCode: -1, quantity: -1, unit: -1, unitPrice: -1, discount: -1,
            total: -1, cost: -1, profit: -1, tax: -1, cashier: -1, payment: -1
        };

        headers.forEach(h => {
            const n = h.name.replace(/\s+/g, ' ').trim();
            if (map.seq === -1 && (/^#$/i.test(n) || /^م$/i.test(n) || /^مسلسل$/i.test(n))) map.seq = h.index;
            else if (map.date === -1 && (n.includes('التاريخ') || n.includes('تاريخ'))) map.date = h.index;
            else if (map.time === -1 && (n.includes('الوقت') || n.includes('وقت'))) map.time = h.index;
            else if (map.invoiceNo === -1 && (n.includes('الفاتورة') || n.includes('رقم الفاتورة') || n.includes('الإيصال'))) map.invoiceNo = h.index;
            else if (map.movement === -1 && (n.includes('الحركة') || n.includes('نوع الحركة'))) map.movement = h.index;
            else if (map.itemName === -1 && (n.includes('الصنف') || n.includes('اسم الصنف') || n.includes('البيان'))) map.itemName = h.index;
            else if (map.itemCode === -1 && (n.includes('الكود') || n.includes('كود الصنف') || n.includes('الباركود'))) map.itemCode = h.index;
            else if (map.quantity === -1 && (n.includes('الكمية') || n.includes('كمية') || n.includes('العدد'))) map.quantity = h.index;
            else if (map.unit === -1 && (n.includes('الوحدة') || n.includes('وحدة'))) map.unit = h.index;
            else if (map.unitPrice === -1 && (n.includes('السعر') || n.includes('سعر الوحدة'))) map.unitPrice = h.index;
            else if (map.discount === -1 && (n.includes('الخصم') || n.includes('خصم%') || n.includes('الخصم%'))) map.discount = h.index;
            else if (map.total === -1 && (n.includes('الاجمالى') || n.includes('الإجمالي') || n.includes('الصافي') || n.includes('القيمة'))) map.total = h.index;
            else if (map.cost === -1 && (n.includes('التكلفة') || n.includes('سعر التكلفة'))) map.cost = h.index;
            else if (map.profit === -1 && (n.includes('الربح') || n.includes('صافي الربح'))) map.profit = h.index;
            else if (map.tax === -1 && (n.includes('الضريبة') || n.includes('ضريبة'))) map.tax = h.index;
            else if (map.cashier === -1 && (n.includes('الكاشير') || n.includes('المستخدم') || n.includes('البائع'))) map.cashier = h.index;
            else if (map.payment === -1 && (n.includes('طريقة الدفع') || n.includes('الدفع'))) map.payment = h.index;
        });

        // 15-column standard fallback if headers matched positionally
        if (headers.length >= 15) {
            if (map.seq === -1) map.seq = 0;
            if (map.date === -1) map.date = 1;
            if (map.time === -1) map.time = 2;
            if (map.invoiceNo === -1) map.invoiceNo = 3;
            if (map.movement === -1) map.movement = 4;
            if (map.itemName === -1) map.itemName = 5;
            if (map.itemCode === -1) map.itemCode = 6;
            if (map.quantity === -1) map.quantity = 7;
            if (map.unit === -1) map.unit = 8;
            if (map.unitPrice === -1) map.unitPrice = 9;
            if (map.discount === -1) map.discount = 10;
            if (map.total === -1) map.total = 11;
            if (map.cost === -1) map.cost = 12;
            if (map.profit === -1) map.profit = 13;
            if (map.tax === -1) map.tax = 14;
        }

        return map;
    }

    static extractTableRows(table, headers) {
        const colMap = this.mapColumnKeys(headers);
        const rows = Array.from(table.querySelectorAll('tr'));
        const items = [];
        let summaryRow = null;

        for (let rIdx = 0; rIdx < rows.length; rIdx++) {
            const tr = rows[rIdx];
            const cells = Array.from(tr.querySelectorAll('td, th'));
            if (cells.length < 5) continue;

            const rowText = tr.textContent.trim();
            // Stop at Total row
            const isTotalRow = (
                rowText.includes('Total') ||
                rowText.startsWith('الإجمالي') ||
                rowText.startsWith('الاجمالي') ||
                rowText.includes('المجموع')
            );

            if (isTotalRow) {
                summaryRow = { rawText: rowText, cells: cells.map(c => c.textContent.trim()) };
                break;
            }

            // Skip header rows unconditionally (whether they use <th> or <td>)
            if (rowText.includes('الصنف') && (rowText.includes('الفاتورة') || rowText.includes('التاريخ') || rowText.includes('السعر') || rowText.includes('الكود'))) {
                continue;
            }

            const getCellText = (idx) => (idx >= 0 && idx < cells.length) ? cells[idx].textContent.trim() : '';

            const rawDate = getCellText(colMap.date);
            // Skip if date cell is a header like "التاريخ" or empty
            if (!rawDate || rawDate.includes('التاريخ') || rawDate.includes('تاريخ')) {
                continue;
            }

            // Extract invoice # text from inside <a> tag if present
            let invoiceNo = '';
            if (colMap.invoiceNo >= 0 && colMap.invoiceNo < cells.length) {
                const aTag = cells[colMap.invoiceNo].querySelector('a');
                invoiceNo = aTag ? aTag.textContent.trim() : cells[colMap.invoiceNo].textContent.trim();
            }
            if (!invoiceNo || invoiceNo.includes('الفاتورة')) invoiceNo = `INV-${rIdx}`;
            const rawTime = getCellText(colMap.time);
            const timeObj = this.parseTime(rawTime);
            const dateStr = this.parseDate(rawDate);

            const movement = getCellText(colMap.movement) || 'مبيعات';
            const quantity = this.parseNumber(getCellText(colMap.quantity)) || 1;
            const unit = getCellText(colMap.unit) || 'قطعة';
            const unitPrice = this.parseNumber(getCellText(colMap.unitPrice));
            
            const rawDiscount = getCellText(colMap.discount);
            const discountNum = this.parseNumber(rawDiscount);

            const total = this.parseNumber(getCellText(colMap.total)) || (unitPrice * quantity);
            const cost = this.parseNumber(getCellText(colMap.cost));
            let profit = colMap.profit !== -1 ? this.parseNumber(getCellText(colMap.profit)) : (total - cost);
            const tax = this.parseNumber(getCellText(colMap.tax));

            const isReturn = (
                movement.includes('مرتجع') || 
                movement.includes('إرجاع') || 
                movement.includes('ارجاع') || 
                movement.includes('رد') || 
                movement.toLowerCase().includes('return') ||
                quantity < 0 ||
                total < 0
            );

            const cashier = getCellText(colMap.cashier) || 'غير محدد';
            let payment = getCellText(colMap.payment) || 'الدرج';
            if (payment.includes('بنك') || payment.includes('شبكة') || payment.includes('فيزا') || payment.toLowerCase().includes('bank')) {
                payment = 'البنك';
            } else {
                payment = 'الدرج';
            }

            const profitMargin = total > 0 ? ((profit / total) * 100) : 0;

            items.push({
                rowIndex: rIdx,
                seq: getCellText(colMap.seq) || String(items.length + 1),
                date: dateStr,
                rawDate,
                rawTime,
                time: timeObj.time24,
                hour: timeObj.hour,
                minute: timeObj.minute,
                second: timeObj.second,
                invoiceNo,
                movement,
                isReturn,
                itemName: getCellText(colMap.itemName) || 'صنف غير محدد',
                itemCode: getCellText(colMap.itemCode) || 'UNKNOWN',
                quantity: Math.abs(quantity),
                unit,
                unitPrice,
                rawDiscount,
                discount: discountNum,
                net: Math.abs(total),
                total: Math.abs(total),
                cost: Math.abs(cost),
                profit: Math.abs(profit),
                tax,
                profitMargin,
                cashier,
                payment
            });
        }

        return { items, summaryRow };
    }

    /**
     * Extract summary values containing "::" after the Total row
     * e.g. الاجمالى :: 4,038.00, الضريبة :: 0.00, إجمالى بسعر التكلفة :: 2,525.50, الربح :: 1,512.50, الدرج :: 1,979.00, البنك :: 2,059.00
     */
    static extractSummaryFooter(doc, summaryRow) {
        const summary = { drawer: 0, bank: 0, tax: 0, totalCost: 0, netProfit: 0, totalSales: 0 };
        const allText = doc.body ? doc.body.textContent : '';

        const extractColonValue = (keywords) => {
            for (const kw of keywords) {
                // Look for: "Keyword :: 1,234.56" or "Keyword : 1,234.56"
                const reg = new RegExp(`${kw}\\s*(?:::|:)\\s*([0-9,]+(?:\\.[0-9]+)?)`, 'i');
                const m = allText.match(reg);
                if (m && m[1]) {
                    const val = SindbadParser.parseNumber(m[1]);
                    if (val > 0) return val;
                }
            }
            return 0;
        };

        summary.totalSales = extractColonValue(['الاجمالى', 'الإجمالي', 'صافي المبيعات الكلي', 'صافي المبيعات']);
        summary.tax = extractColonValue(['الضريبة', 'الضريبة المضافة', 'ضريبة القيمة المضافة']);
        summary.totalCost = extractColonValue(['إجمالى بسعر التكلفة', 'إجمالي بسعر التكلفة', 'التكلفة']);
        summary.netProfit = extractColonValue(['الربح', 'الربح الصافي', 'صافي الربح']);
        summary.drawer = extractColonValue(['الدرج', 'نقداً', 'كاش']);
        summary.bank = extractColonValue(['البنك', 'شبكة', 'فيزا', 'مدى']);

        return summary;
    }
}
