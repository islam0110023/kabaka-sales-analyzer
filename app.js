// Main Application Controller for Sindbad Sales Analyzer
import { StorageManager, defaultSettings } from './storage.js';
import { SindbadParser } from './parser.js';
import { ShiftAnalyzer, SHIFT_TABS } from './shift.js';
import { AnomalyDetector } from './anomalies.js';
import { NetworkManager } from './network.js';
import { ExportManager } from './export.js';
import { ChartRenderer } from './charts.js';
import { sampleSindbadHTML } from './sample-data.js';

class App {
    constructor() {
        this.settings = StorageManager.load();
        this.parsedData = null;
        this.rawHtml = '';
        this.activeTab = SHIFT_TABS.ACTUAL_SHIFT;
        this.cutoffHour = this.settings.cutoffHour || 6;
        this.topItemsMetric = 'sales';

        // Filters and pagination
        this.itemsSearch = '';
        this.itemsSortCol = 'totalSales';
        this.itemsSortAsc = false;
        this.itemsPage = 1;
        this.itemsPerPage = 15;

        this.invoicesSearch = '';
        this.invoicesPaymentFilter = 'all';
        this.invoicesCashierFilter = 'all';
        this.invoicesPage = 1;
        this.invoicesPerPage = 20;

        // Managers
        this.charts = new ChartRenderer();
        this.network = new NetworkManager({
            onStatus: (st) => this.updateFetchStatus(st),
            onError: (err) => this.showFetchError(err),
            onCorsBlocked: (info) => this.showCorsModal(info)
        });

        this.init();
    }

    init() {
        this.bindEvents();
        this.applySettingsToUI();

        // Check if opened via file:// protocol
        if (window.location.protocol === 'file:') {
            const banner = document.getElementById('file-protocol-banner');
            if (banner) banner.classList.remove('hidden');
        }

        // Auto-execute initial GET login.php on page load to prime cookies
        this.runPageLoadSessionInit();
        
        // Auto-load sample report on first launch if empty
        if (this.settings.autoAnalyzeOnLoad && !this.rawHtml) {
            this.loadHTMLContent(sampleSindbadHTML, 'تقرير تجريبي مسبق التحميل');
        }
    }

    async runPageLoadSessionInit() {
        const dot = document.getElementById('session-init-dot');
        const status = document.getElementById('session-init-status');
        const tag = document.getElementById('session-init-tag');

        try {
            await this.network.initSessionCookies();
            if (dot) dot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-500';
            if (status) {
                status.textContent = 'تم تهيئة الجلسة واستقبال الكوكيز المبدئية بنجاح (الجلسة جاهزة) ✓';
                status.className = 'text-emerald-700 font-bold';
            }
            if (tag) {
                tag.className = 'font-mono text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold';
                tag.textContent = 'Active Session';
            }
        } catch (err) {
            if (dot) dot.className = 'w-2.5 h-2.5 rounded-full bg-slate-400';
            if (status) {
                status.textContent = 'جاهز للدخول المباشر أو عبر البروكسي';
                status.className = 'text-slate-600';
            }
        }
    }

    bindEvents() {
        // Tab switching
        document.querySelectorAll('[data-shift-tab]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.shiftTab;
                this.setActiveTab(tab);
            });
        });

        // Cutoff hour selector
        const cutoffSelect = document.getElementById('cutoff-hour-select');
        if (cutoffSelect) {
            cutoffSelect.value = String(this.cutoffHour);
            cutoffSelect.addEventListener('change', (e) => {
                this.cutoffHour = parseInt(e.target.value, 10);
                this.settings.cutoffHour = this.cutoffHour;
                StorageManager.save(this.settings);
                this.renderAll();
            });
        }

        // Demo data button
        const demoBtn = document.getElementById('btn-load-demo');
        if (demoBtn) {
            demoBtn.addEventListener('click', () => {
                this.loadHTMLContent(sampleSindbadHTML, 'تقرير تجريبي لسندباد');
                this.showToast('تم تحميل بيانات التقرير التجريبي بنجاح!', 'success');
            });
        }

        // Paste HTML Modal / Box
        const pasteBtn = document.getElementById('btn-paste-html');
        const pasteSubmitBtn = document.getElementById('btn-submit-paste');
        const pasteTextarea = document.getElementById('textarea-paste-html');
        if (pasteSubmitBtn && pasteTextarea) {
            pasteSubmitBtn.addEventListener('click', () => {
                const content = pasteTextarea.value.trim();
                if (!content) {
                    this.showToast('يرجى لصق كود HTML أولاً', 'error');
                    return;
                }
                this.loadHTMLContent(content, 'كود ملصق يدوياً');
                pasteTextarea.value = '';
                this.closeModal('modal-paste');
                this.showToast('تم تحليل كود التقرير بنجاح!', 'success');
            });
        }

        // File upload input & drop zone
        const fileInput = document.getElementById('file-upload-input');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.readFile(file);
                }
            });
        }

        const dropZone = document.getElementById('drop-zone');
        if (dropZone) {
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('border-primary-500', 'bg-primary-50', 'dark:bg-primary-900/20');
            });
            dropZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                dropZone.classList.remove('border-primary-500', 'bg-primary-50', 'dark:bg-primary-900/20');
            });
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('border-primary-500', 'bg-primary-50', 'dark:bg-primary-900/20');
                if (e.dataTransfer.files.length > 0) {
                    this.readFile(e.dataTransfer.files[0]);
                }
            });
        }

        // Fetch request form
        const fetchForm = document.getElementById('form-fetch-report');
        if (fetchForm) {
            fetchForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleFetchSubmit();
            });
        }

        // Settings Form & Clear sensitive data
        const settingsForm = document.getElementById('form-settings');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveSettingsFromUI();
                this.closeModal('modal-settings');
                this.showToast('تم حفظ الإعدادات بنجاح', 'success');
            });
        }

        const wipeCredsBtn = document.getElementById('btn-wipe-credentials');
        if (wipeCredsBtn) {
            wipeCredsBtn.addEventListener('click', () => {
                StorageManager.clearCredentials();
                this.settings.username = '';
                this.settings.password = '';
                this.settings.rememberCredentials = false;
                this.applySettingsToUI();
                this.showToast('تم مسح بيانات الدخول الحساسة فوراً من المتصفح', 'info');
            });
        }

        const wipeAllBtn = document.getElementById('btn-wipe-all');
        if (wipeAllBtn) {
            wipeAllBtn.addEventListener('click', () => {
                if (confirm('هل أنت متأكد من مسح جميع الإعدادات والبيانات المحفوظة محلياً؟')) {
                    StorageManager.wipeAll();
                    this.settings = { ...defaultSettings };
                    this.applySettingsToUI();
                    this.showToast('تمت إعادة ضبط جميع الإعدادات', 'info');
                }
            });
        }

        // Metric toggle for top items chart
        const btnMetricSales = document.getElementById('btn-chart-metric-sales');
        const btnMetricProfit = document.getElementById('btn-chart-metric-profit');
        if (btnMetricSales && btnMetricProfit) {
            btnMetricSales.addEventListener('click', () => {
                this.topItemsMetric = 'sales';
                btnMetricSales.classList.add('bg-blue-600', 'text-white');
                btnMetricSales.classList.remove('bg-gray-100', 'text-gray-700', 'dark:bg-gray-700', 'dark:text-gray-200');
                btnMetricProfit.classList.remove('bg-blue-600', 'text-white');
                btnMetricProfit.classList.add('bg-gray-100', 'text-gray-700', 'dark:bg-gray-700', 'dark:text-gray-200');
                this.renderCharts();
            });
            btnMetricProfit.addEventListener('click', () => {
                this.topItemsMetric = 'profit';
                btnMetricProfit.classList.add('bg-blue-600', 'text-white');
                btnMetricProfit.classList.remove('bg-gray-100', 'text-gray-700', 'dark:bg-gray-700', 'dark:text-gray-200');
                btnMetricSales.classList.remove('bg-blue-600', 'text-white');
                btnMetricSales.classList.add('bg-gray-100', 'text-gray-700', 'dark:bg-gray-700', 'dark:text-gray-200');
                this.renderCharts();
            });
        }

        // Items search & table sorting
        const itemsSearchInput = document.getElementById('input-items-search');
        if (itemsSearchInput) {
            itemsSearchInput.addEventListener('input', (e) => {
                this.itemsSearch = e.target.value.trim().toLowerCase();
                this.itemsPage = 1;
                this.renderItemsTable();
            });
        }

        // Invoices search and filters
        const invSearchInput = document.getElementById('input-invoices-search');
        if (invSearchInput) {
            invSearchInput.addEventListener('input', (e) => {
                this.invoicesSearch = e.target.value.trim().toLowerCase();
                this.invoicesPage = 1;
                this.renderInvoicesTable();
            });
        }

        const invPaymentSelect = document.getElementById('select-invoices-payment');
        if (invPaymentSelect) {
            invPaymentSelect.addEventListener('change', (e) => {
                this.invoicesPaymentFilter = e.target.value;
                this.invoicesPage = 1;
                this.renderInvoicesTable();
            });
        }

        const invMovementSelect = document.getElementById('select-invoices-movement');
        if (invMovementSelect) {
            invMovementSelect.addEventListener('change', (e) => {
                this.invoicesMovementFilter = e.target.value;
                this.invoicesPage = 1;
                this.renderInvoicesTable();
            });
        }

        const invCashierSelect = document.getElementById('select-invoices-cashier');
        if (invCashierSelect) {
            invCashierSelect.addEventListener('change', (e) => {
                this.invoicesCashierFilter = e.target.value;
                this.invoicesPage = 1;
                this.renderInvoicesTable();
            });
        }

        // Export Actions
        const expCsvItems = document.getElementById('btn-export-csv-items');
        if (expCsvItems) {
            expCsvItems.addEventListener('click', () => {
                if (!this.currentViewData) return;
                ExportManager.exportItemsToCSV(this.currentViewData.itemsAggregated);
                this.showToast('تم تصدير ملخص الأصناف بصيغة CSV (UTF-8)', 'success');
            });
        }

        const expCsvInvoices = document.getElementById('btn-export-csv-invoices');
        if (expCsvInvoices) {
            expCsvInvoices.addEventListener('click', () => {
                if (!this.currentViewData) return;
                ExportManager.exportInvoicesToCSV(this.currentViewData.filteredItems);
                this.showToast('تم تصدير الفواتير التفصيلية بصيغة CSV (UTF-8)', 'success');
            });
        }

        const expExcel = document.getElementById('btn-export-excel');
        if (expExcel) {
            expExcel.addEventListener('click', () => {
                if (!this.currentViewData) return;
                ExportManager.exportToExcel(this.currentViewData);
                this.showToast('تم تصدير ملف إكسل الكامل بجميع الصفحات بنجاح!', 'success');
            });
        }

        const printBtn = document.getElementById('btn-print-report');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                ExportManager.printReport();
            });
        }

        // Modal triggers
        document.querySelectorAll('[data-open-modal]').forEach(el => {
            el.addEventListener('click', (e) => {
                const target = el.dataset.openModal;
                this.openModal(target);
            });
        });

        document.querySelectorAll('[data-close-modal]').forEach(el => {
            el.addEventListener('click', (e) => {
                const target = el.dataset.closeModal;
                this.closeModal(target);
            });
        });
    }

    readFile(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            this.loadHTMLContent(content, file.name);
            this.showToast(`تم تحميل الملف "${file.name}" بنجاح!`, 'success');
        };
        reader.onerror = () => {
            this.showToast('فشل قراءة الملف المرفوع', 'error');
        };
        reader.readAsText(file);
    }

    loadHTMLContent(htmlText, sourceLabel = '') {
        try {
            this.rawHtml = htmlText;
            this.parsedData = SindbadParser.parse(htmlText);

            // Display metadata
            const branchEl = document.getElementById('meta-branch');
            const datesEl = document.getElementById('meta-dates');
            const sourceEl = document.getElementById('meta-source');
            if (branchEl) branchEl.textContent = this.parsedData.meta.branch || 'KABAKA';
            if (datesEl) {
                const start = this.parsedData.meta.startDate || '—';
                const end = this.parsedData.meta.endDate || '—';
                datesEl.textContent = `${start} إلى ${end}`;
            }
            if (sourceEl) sourceEl.textContent = sourceLabel || 'تقرير محلي';

            // Populate Cashiers dropdown
            const cashiers = [...new Set(this.parsedData.items.map(i => i.cashier).filter(Boolean))];
            const cashierSelect = document.getElementById('select-invoices-cashier');
            if (cashierSelect) {
                cashierSelect.innerHTML = '<option value="all">جميع الكاشير</option>' +
                    cashiers.map(c => `<option value="${c}">${c}</option>`).join('');
            }

            this.renderAll();
        } catch (err) {
            console.error('Parsing error:', err);
            this.showToast(err.message || 'حدث خطأ أثناء تحليل كود HTML', 'error');
        }
    }

    setActiveTab(tab) {
        this.activeTab = tab;
        document.querySelectorAll('[data-shift-tab]').forEach(btn => {
            if (btn.dataset.shiftTab === tab) {
                btn.classList.add('bg-blue-600', 'text-white', 'shadow-sm');
                btn.classList.remove('text-gray-600', 'hover:bg-gray-100', 'dark:text-gray-300', 'dark:hover:bg-gray-800');
            } else {
                btn.classList.remove('bg-blue-600', 'text-white', 'shadow-sm');
                btn.classList.add('text-gray-600', 'hover:bg-gray-100', 'dark:text-gray-300', 'dark:hover:bg-gray-800');
            }
        });

        // Reset page numbers
        this.itemsPage = 1;
        this.invoicesPage = 1;

        this.renderAll();
    }

    computeCurrentView() {
        if (!this.parsedData) return null;

        const dates = ShiftAnalyzer.resolveDates(this.parsedData.items, this.parsedData.meta);
        const filteredItems = ShiftAnalyzer.filterItems(
            this.parsedData.items, 
            this.activeTab, 
            this.cutoffHour, 
            dates
        );

        const kpis = ShiftAnalyzer.computeKPIs(filteredItems, this.parsedData.summary);
        const itemsAggregated = ShiftAnalyzer.aggregateByItem(filteredItems, kpis.netSales, kpis.netProfit);
        const hourlyData = ShiftAnalyzer.aggregateByHour(filteredItems);
        const anomalies = AnomalyDetector.detectAll(this.parsedData.items, this.cutoffHour, dates);

        const tabNames = {
            [SHIFT_TABS.ACTUAL_SHIFT]: 'الشيفت الفعلي لليوم الأول',
            [SHIFT_TABS.ALL_REPORT]: 'إجمالي التقرير بالكامل',
            [SHIFT_TABS.DAY1_ONLY]: 'تاريخ اليوم الأول فقط',
            [SHIFT_TABS.DAY2_DAWN]: 'سهرة فجر اليوم الثاني فقط',
            [SHIFT_TABS.DAY1_EXCLUDED]: 'فواتير فجر اليوم الأول المستبعدة'
        };

        return {
            tab: this.activeTab,
            activeTabName: tabNames[this.activeTab] || this.activeTab,
            cutoffHour: this.cutoffHour,
            dates,
            meta: this.parsedData.meta,
            summary: this.parsedData.summary,
            filteredItems,
            kpis,
            itemsAggregated,
            hourlyData,
            anomalies
        };
    }

    renderAll() {
        this.currentViewData = this.computeCurrentView();
        if (!this.currentViewData) return;

        this.renderKPIs();
        this.renderCharts();
        this.renderAnomalies();
        this.renderItemsTable();
        this.renderInvoicesTable();
        this.updateTabCounts();
    }

    updateTabCounts() {
        if (!this.parsedData) return;
        const dates = ShiftAnalyzer.resolveDates(this.parsedData.items, this.parsedData.meta);

        const tabs = [
            SHIFT_TABS.ACTUAL_SHIFT,
            SHIFT_TABS.ALL_REPORT,
            SHIFT_TABS.DAY1_ONLY,
            SHIFT_TABS.DAY2_DAWN,
            SHIFT_TABS.DAY1_EXCLUDED
        ];

        tabs.forEach(tab => {
            const count = ShiftAnalyzer.filterItems(this.parsedData.items, tab, this.cutoffHour, dates).length;
            const badge = document.getElementById(`badge-count-${tab}`);
            if (badge) badge.textContent = count;
        });

        const charityBannerEl = document.getElementById('shift-banner-charity');
        if (charityBannerEl) {
            const actualItems = ShiftAnalyzer.filterItems(this.parsedData.items, SHIFT_TABS.ACTUAL_SHIFT, this.cutoffHour, dates);
            const actualKPIs = ShiftAnalyzer.computeKPIs(actualItems);
            charityBannerEl.textContent = `${actualKPIs.charityAmount.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م`;
        }

        const returnsBannerEl = document.getElementById('shift-banner-returns');
        if (returnsBannerEl) {
            const actualItems = ShiftAnalyzer.filterItems(this.parsedData.items, SHIFT_TABS.ACTUAL_SHIFT, this.cutoffHour, dates);
            const actualKPIs = ShiftAnalyzer.computeKPIs(actualItems);
            returnsBannerEl.textContent = `${actualKPIs.returnsTotal.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م (${actualKPIs.returnsQty} ق)`;
        }
    }

    renderKPIs() {
        const kpi = this.currentViewData.kpis;
        const fmt = (num) => num ? num.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';

        this.setElText('kpi-sales', fmt(kpi.netSales));
        this.setElText('kpi-gross-sales', fmt(kpi.grossSales));
        this.setElText('kpi-returns-total', fmt(kpi.returnsTotal));
        this.setElText('kpi-returns-qty', kpi.returnsQty);
        this.setElText('kpi-drawer', fmt(kpi.drawerSales));
        this.setElText('kpi-bank', fmt(kpi.bankSales));
        this.setElText('kpi-cost', fmt(kpi.totalCost));
        this.setElText('kpi-profit', fmt(kpi.netProfit));
        this.setElText('kpi-margin', `${kpi.profitMargin}%`);
        this.setElText('kpi-invoices', kpi.invoiceCount);
        this.setElText('kpi-qty', kpi.totalQty);
        this.setElText('kpi-charity', fmt(kpi.charityAmount));
        this.setElText('kpi-avg-basket', fmt(kpi.avgBasket));

        // Margin color indicator
        const marginEl = document.getElementById('kpi-margin');
        if (marginEl) {
            if (kpi.profitMargin >= 30) {
                marginEl.className = 'text-2xl font-bold text-emerald-600 dark:text-emerald-400';
            } else if (kpi.profitMargin >= 20) {
                marginEl.className = 'text-2xl font-bold text-blue-600 dark:text-blue-400';
            } else {
                marginEl.className = 'text-2xl font-bold text-amber-600 dark:text-amber-400';
            }
        }
    }

    renderCharts() {
        if (!this.currentViewData) return;
        this.charts.renderHourly('chart-hourly', this.currentViewData.hourlyData);
        this.charts.renderTopItems('chart-top-items', this.currentViewData.itemsAggregated, this.topItemsMetric);
        this.charts.renderPaymentBreakdown('chart-payment-breakdown', this.currentViewData.kpis);
    }

    renderAnomalies() {
        const anom = this.currentViewData.anomalies;

        // Badge counts
        this.setElText('badge-anom-prices', anom.priceDiscrepancies.length);
        this.setElText('badge-anom-duplicates', anom.duplicateItemsInInvoice.length);
        this.setElText('badge-anom-lowmargin', anom.lowMarginItems.length);
        this.setElText('badge-anom-prevshift', anom.previousShiftInvoices.length);

        // 1. Price Discrepancies Container
        const pricesContainer = document.getElementById('container-anom-prices');
        if (pricesContainer) {
            if (anom.priceDiscrepancies.length === 0) {
                pricesContainer.innerHTML = '<p class="text-emerald-600 text-sm py-3 text-center">✓ ممتاز! لا توجد أي فروق أسعار غير مبررة لنفس كود الصنف.</p>';
            } else {
                pricesContainer.innerHTML = anom.priceDiscrepancies.map(p => `
                    <div class="border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 rounded-lg p-3 text-xs">
                        <div class="flex items-center justify-between mb-1">
                            <span class="font-bold text-gray-800 dark:text-gray-100">${p.name} <code class="text-xs bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded">${p.code}</code></span>
                            <span class="text-amber-700 dark:text-amber-300 font-bold">فرق السعر: ${p.priceDiff.toFixed(2)}</span>
                        </div>
                        <div class="text-gray-600 dark:text-gray-400 mb-2">
                            الأسعار المسجلة بدون خصم: <strong>${p.distinctPrices.map(pr => pr.toFixed(2)).join(' | ')}</strong>
                        </div>
                        <div class="max-h-24 overflow-y-auto space-y-1 bg-white dark:bg-gray-800 p-2 rounded border border-gray-100 dark:border-gray-700">
                            ${p.occurrences.map(o => `
                                <div class="flex justify-between text-[11px] text-gray-500">
                                    <span>فاتورة: ${o.invoiceNo} (${o.time})</span>
                                    <span>السعر: <strong>${o.unitPrice.toFixed(2)}</strong> (كاشير: ${o.cashier})</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('');
            }
        }

        // 2. Duplicate Items in Same Invoice
        const dupesContainer = document.getElementById('container-anom-duplicates');
        if (dupesContainer) {
            if (anom.duplicateItemsInInvoice.length === 0) {
                dupesContainer.innerHTML = '<p class="text-emerald-600 text-sm py-3 text-center">✓ لا يوجد تكرار لنفس الصنف داخل نفس الفاتورة.</p>';
            } else {
                dupesContainer.innerHTML = anom.duplicateItemsInInvoice.map(d => `
                    <div class="border border-indigo-200 bg-indigo-50 dark:bg-indigo-950/20 dark:border-indigo-900 rounded-lg p-3 text-xs">
                        <div class="flex justify-between items-center mb-1">
                            <span class="font-bold text-gray-800 dark:text-gray-100">فاتورة: ${d.invoiceNo}</span>
                            <span class="text-indigo-700 dark:text-indigo-300 font-bold">${d.rowCount} أسطر لنفس الصنف</span>
                        </div>
                        <div class="text-gray-600 dark:text-gray-400 mb-1">
                            الصنف: <strong>${d.itemName}</strong> (${d.itemCode}) | إجمالي الكمية: <strong>${d.totalQty}</strong> | الوقت: ${d.time}
                        </div>
                        <div class="text-[11px] text-gray-500">
                            الكاشير: ${d.cashier} | طريقة الدفع: ${d.payment}
                        </div>
                    </div>
                `).join('');
            }
        }

        // 3. Low Margin Items (< 20%)
        const lowMarginContainer = document.getElementById('container-anom-lowmargin');
        if (lowMarginContainer) {
            if (anom.lowMarginItems.length === 0) {
                lowMarginContainer.innerHTML = '<p class="text-emerald-600 text-sm py-3 text-center">✓ جميع الأصناف تحقق هامش ربح أعلى من 20%.</p>';
            } else {
                lowMarginContainer.innerHTML = anom.lowMarginItems.map(m => `
                    <div class="border border-rose-200 bg-rose-50 dark:bg-rose-950/20 dark:border-rose-900 rounded-lg p-3 text-xs">
                        <div class="flex justify-between items-center mb-1">
                            <span class="font-bold text-gray-800 dark:text-gray-100">${m.name} <code class="text-xs bg-rose-100 dark:bg-rose-900/40 px-1 py-0.5 rounded">${m.code}</code></span>
                            <span class="text-rose-700 dark:text-rose-300 font-bold">الهامش: ${m.overallMargin}%</span>
                        </div>
                        <div class="grid grid-cols-3 gap-2 text-gray-600 dark:text-gray-400 mt-2 bg-white dark:bg-gray-800 p-2 rounded">
                            <div>المبيعات: <strong>${m.totalSales.toFixed(2)}</strong></div>
                            <div>التكلفة: <strong>${m.totalCost.toFixed(2)}</strong></div>
                            <div>الربح: <strong class="text-rose-600">${m.totalProfit.toFixed(2)}</strong></div>
                        </div>
                    </div>
                `).join('');
            }
        }

        // 4. Previous Shift Dawn Invoices
        const prevShiftContainer = document.getElementById('container-anom-prevshift');
        if (prevShiftContainer) {
            if (anom.previousShiftInvoices.length === 0) {
                prevShiftContainer.innerHTML = '<p class="text-gray-500 text-sm py-3 text-center">لا توجد فواتير مسجلة في فجر اليوم الأول قبل ساعة انتهاء الوردية.</p>';
            } else {
                prevShiftContainer.innerHTML = `
                    <div class="mb-2 p-2 bg-slate-100 dark:bg-slate-800 rounded text-xs text-gray-600 dark:text-gray-300">
                        تم رصد <strong>${anom.previousShiftInvoices.length}</strong> فاتورة تم تسجيلها في فجر اليوم الأول قبل الساعة <strong>${String(this.cutoffHour).padStart(2, '0')}:00</strong> صباحاً. تنتمي هذه الفواتير طبيعياً إلى سهرة الليلة السابقة، وقد تم استبعادها تلقائياً من شيفت اليوم الفعلي.
                    </div>
                    <div class="max-h-60 overflow-y-auto space-y-1.5">
                        ${anom.previousShiftInvoices.map(s => `
                            <div class="border border-slate-200 dark:border-slate-700 p-2 rounded text-xs flex justify-between items-center bg-white dark:bg-gray-800">
                                <div>
                                    <span class="font-bold text-gray-800 dark:text-gray-100">${s.invoiceNo}</span>
                                    <span class="text-gray-500 text-[11px] mr-2">(${s.time}) - كاشير: ${s.cashier}</span>
                                </div>
                                <div class="text-left font-semibold">
                                    <span class="text-blue-600 dark:text-blue-400">${s.totalNet.toFixed(2)}</span>
                                    <span class="text-[10px] text-gray-400 mr-1">(${s.payment})</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        }
    }

    renderItemsTable() {
        const tbody = document.getElementById('tbody-items');
        if (!tbody || !this.currentViewData) return;

        let items = [...this.currentViewData.itemsAggregated];

        // Search filtering
        if (this.itemsSearch) {
            items = items.filter(i => 
                i.name.toLowerCase().includes(this.itemsSearch) ||
                i.code.toLowerCase().includes(this.itemsSearch)
            );
        }

        // Sorting
        items.sort((a, b) => {
            let valA = a[this.itemsSortCol];
            let valB = b[this.itemsSortCol];
            if (typeof valA === 'string') {
                return this.itemsSortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            return this.itemsSortAsc ? valA - valB : valB - valA;
        });

        const totalItems = items.length;
        const totalPages = Math.ceil(totalItems / this.itemsPerPage) || 1;
        this.itemsPage = Math.min(this.itemsPage, totalPages);

        const startIdx = (this.itemsPage - 1) * this.itemsPerPage;
        const pageItems = items.slice(startIdx, startIdx + this.itemsPerPage);

        this.setElText('items-count-display', `${totalItems} صنف`);
        this.setElText('items-page-info', `الصفحة ${this.itemsPage} من ${totalPages}`);

        if (pageItems.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" class="text-center py-6 text-gray-500">لا توجد أصناف مطابقة لبحثك</td></tr>';
            return;
        }

        tbody.innerHTML = pageItems.map(item => `
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition border-b border-gray-100 dark:border-gray-800 text-xs">
                <td class="px-3 py-2 font-mono text-gray-500">${item.code}</td>
                <td class="px-3 py-2 font-medium text-gray-900 dark:text-gray-100">${item.name}</td>
                <td class="px-3 py-2 text-center">${item.orderCount}</td>
                <td class="px-3 py-2 text-center font-semibold">${item.totalQty}</td>
                <td class="px-3 py-2 text-center font-bold text-emerald-700 bg-emerald-50/50">${(item.charityAmount || (item.totalQty * 5)).toFixed(2)}</td>
                <td class="px-3 py-2 text-left font-bold text-blue-600 dark:text-blue-400">${item.totalSales.toFixed(2)}</td>
                <td class="px-3 py-2 text-left text-gray-600 dark:text-gray-400">${item.totalCost.toFixed(2)}</td>
                <td class="px-3 py-2 text-left font-bold text-emerald-600 dark:text-emerald-400">${item.totalProfit.toFixed(2)}</td>
                <td class="px-3 py-2 text-center font-bold ${item.profitMargin < 20 ? 'text-rose-600' : 'text-gray-700 dark:text-gray-300'}">
                    ${item.profitMargin.toFixed(1)}%
                </td>
                <td class="px-3 py-2 text-center text-gray-500">${item.salesShare.toFixed(1)}%</td>
                <td class="px-3 py-2 text-center text-gray-500">${item.profitShare.toFixed(1)}%</td>
            </tr>
        `).join('');

        // Pagination buttons
        const prevBtn = document.getElementById('btn-items-prev');
        const nextBtn = document.getElementById('btn-items-next');
        if (prevBtn) {
            prevBtn.disabled = this.itemsPage <= 1;
            prevBtn.onclick = () => {
                if (this.itemsPage > 1) {
                    this.itemsPage--;
                    this.renderItemsTable();
                }
            };
        }
        if (nextBtn) {
            nextBtn.disabled = this.itemsPage >= totalPages;
            nextBtn.onclick = () => {
                if (this.itemsPage < totalPages) {
                    this.itemsPage++;
                    this.renderItemsTable();
                }
            };
        }
    }

    renderInvoicesTable() {
        const tbody = document.getElementById('tbody-invoices');
        if (!tbody || !this.currentViewData) return;

        let rows = [...this.currentViewData.filteredItems];

        // Search filter
        if (this.invoicesSearch) {
            rows = rows.filter(r => 
                r.invoiceNo.toLowerCase().includes(this.invoicesSearch) ||
                r.itemName.toLowerCase().includes(this.invoicesSearch) ||
                r.itemCode.toLowerCase().includes(this.invoicesSearch) ||
                r.cashier.toLowerCase().includes(this.invoicesSearch)
            );
        }

        // Payment filter
        if (this.invoicesPaymentFilter !== 'all') {
            rows = rows.filter(r => r.payment === this.invoicesPaymentFilter);
        }

        // Movement filter (returns / sales)
        if (this.invoicesMovementFilter === 'returns') {
            rows = rows.filter(r => r.isReturn);
        } else if (this.invoicesMovementFilter === 'sales') {
            rows = rows.filter(r => !r.isReturn);
        }

        // Cashier filter
        if (this.invoicesCashierFilter !== 'all') {
            rows = rows.filter(r => r.cashier === this.invoicesCashierFilter);
        }

        const totalRows = rows.length;
        const totalPages = Math.ceil(totalRows / this.invoicesPerPage) || 1;
        this.invoicesPage = Math.min(this.invoicesPage, totalPages);

        const startIdx = (this.invoicesPage - 1) * this.invoicesPerPage;
        const pageRows = rows.slice(startIdx, startIdx + this.invoicesPerPage);

        this.setElText('invoices-count-display', `${totalRows} سطر فاتورة`);
        this.setElText('invoices-page-info', `الصفحة ${this.invoicesPage} من ${totalPages}`);

        if (pageRows.length === 0) {
            tbody.innerHTML = '<tr><td colspan="12" class="text-center py-6 text-gray-500">لا توجد سطور فواتير مطابقة لبحثك</td></tr>';
            return;
        }

        tbody.innerHTML = pageRows.map(row => {
            const isRet = row.isReturn;
            return `
            <tr class="${isRet ? 'bg-rose-50/70 hover:bg-rose-100/70 text-rose-950 font-medium' : 'hover:bg-gray-50 dark:hover:bg-gray-800/60 text-gray-800 dark:text-gray-200'} transition border-b border-gray-100 dark:border-gray-800 text-xs">
                <td class="px-2 py-2 text-center text-gray-400 font-mono">${row.seq}</td>
                <td class="px-2.5 py-2 font-mono font-bold ${isRet ? 'text-rose-700' : 'text-blue-700'}">${row.invoiceNo}</td>
                <td class="px-2.5 py-2 text-gray-500">${row.date}</td>
                <td class="px-2.5 py-2 font-mono text-gray-600 dark:text-gray-300">${row.time}</td>
                <td class="px-2.5 py-2 font-medium ${isRet ? 'text-rose-950 font-bold' : 'text-gray-900 dark:text-gray-100'}">${row.itemName}</td>
                <td class="px-2 py-2 text-center font-bold ${isRet ? 'text-rose-600 font-mono' : 'font-semibold'}">${isRet ? '-' : ''}${row.quantity}</td>
                <td class="px-2 py-2 text-left">${row.unitPrice.toFixed(2)}</td>
                <td class="px-2 py-2 text-center text-gray-500">${row.rawDiscount || '0.00%'}</td>
                <td class="px-2 py-2 text-left font-bold ${isRet ? 'text-rose-600 font-mono' : 'text-blue-600 dark:text-blue-400'}">${isRet ? '-' : ''}${row.total.toFixed(2)}</td>
                <td class="px-2 py-2 text-left font-bold ${isRet ? 'text-rose-600 font-mono' : 'text-emerald-600 dark:text-emerald-400'}">${isRet ? '-' : ''}${row.profit.toFixed(2)}</td>
                <td class="px-2 py-2 text-gray-600 dark:text-gray-400">${row.cashier}</td>
                <td class="px-2 py-2 text-center">
                    <span class="px-1.5 py-0.5 rounded text-[11px] font-semibold ${row.payment === 'البنك' ? 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'}">
                        ${row.payment}
                    </span>
                </td>
            </tr>
            `;
        }).join('');

        // Pagination buttons
        const prevBtn = document.getElementById('btn-invoices-prev');
        const nextBtn = document.getElementById('btn-invoices-next');
        if (prevBtn) {
            prevBtn.disabled = this.invoicesPage <= 1;
            prevBtn.onclick = () => {
                if (this.invoicesPage > 1) {
                    this.invoicesPage--;
                    this.renderInvoicesTable();
                }
            };
        }
        if (nextBtn) {
            nextBtn.disabled = this.invoicesPage >= totalPages;
            nextBtn.onclick = () => {
                if (this.invoicesPage < totalPages) {
                    this.invoicesPage++;
                    this.renderInvoicesTable();
                }
            };
        }
    }

    async handleFetchSubmit() {
        const loginUrl = document.getElementById('fetch-login-url')?.value.trim() || defaultSettings.loginUrl;
        const reportUrl = document.getElementById('fetch-report-url')?.value.trim() || defaultSettings.reportUrl;
        const username = document.getElementById('fetch-username')?.value.trim();
        const password = document.getElementById('fetch-password')?.value;
        const submitVal = defaultSettings.submitValue;
        const startDate = document.getElementById('fetch-start-date')?.value.trim();
        const endDate = document.getElementById('fetch-end-date')?.value.trim();
        const corsProxy = document.getElementById('fetch-cors-proxy')?.value.trim();
        const remember = document.getElementById('fetch-remember-creds')?.checked;

        if (!username || !password) {
            this.showToast('يرجى إدخال اسم المستخدم وكلمة المرور لتسجيل الدخول في سندباد', 'error');
            return;
        }

        if (remember) {
            this.settings.username = username;
            this.settings.password = password;
            this.settings.rememberCredentials = true;
        } else {
            this.settings.username = '';
            this.settings.password = '';
            this.settings.rememberCredentials = false;
        }
        this.settings.loginUrl = loginUrl;
        this.settings.reportUrl = reportUrl;
        this.settings.startDate = startDate;
        this.settings.endDate = endDate;
        StorageManager.save(this.settings);

        const statusBox = document.getElementById('fetch-status-container');
        if (statusBox) statusBox.classList.remove('hidden');

        try {
            let htmlText = '';
            
            // Check if running on local server with proxy endpoint available
            const isLocalServer = window.location.protocol.startsWith('http') && window.location.host.includes('localhost');
            if (isLocalServer && !corsProxy) {
                this.updateFetchStatus({ step: 1, message: 'الاتصال بمنصة سندباد عبر البروكسي المحلي لتخطي قيود CORS...' });
                const localResp = await fetch('/api/fetch-sindbad', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password, startDate, endDate })
                });

                if (localResp.ok) {
                    htmlText = await localResp.text();
                } else {
                    throw new Error('فشل البروكسي المحلي، جاري المحاولة المباشرة...');
                }
            } else {
                htmlText = await this.network.fetchSindbadReport({
                    loginUrl,
                    reportUrl,
                    username,
                    password,
                    submitValue: submitVal,
                    startDate,
                    endDate,
                    corsProxy
                });
            }

            this.closeModal('modal-fetch');
            this.loadHTMLContent(htmlText, `تقرير حقيقي من سندباد (${startDate || ''} إلى ${endDate || ''})`);
            this.showToast('تم جلب وتحليل التقرير الفعلي من منصة سندباد بنجاح!', 'success');
        } catch (err) {
            console.error('Fetch error:', err);
        }
    }

    updateFetchStatus(statusObj) {
        const msgEl = document.getElementById('fetch-status-message');
        const barEl = document.getElementById('fetch-status-progress');
        if (msgEl) msgEl.textContent = statusObj.message;
        if (barEl) {
            const pct = (statusObj.step / 3) * 100;
            barEl.style.width = `${Math.min(pct, 100)}%`;
        }
    }

    showFetchError(err) {
        const msgEl = document.getElementById('fetch-status-message');
        if (msgEl) {
            msgEl.textContent = `خطأ: ${err.message || 'فشل الطلب'}`;
            msgEl.className = 'text-xs text-rose-600 font-semibold mt-2';
        }
    }

    showCorsModal(corsInfo) {
        const modal = document.getElementById('modal-cors');
        const adviceEl = document.getElementById('cors-advice-text');
        if (adviceEl) adviceEl.textContent = corsInfo.advice;
        if (modal) modal.classList.remove('hidden');

        // Close fetch modal and highlight manual input options
        this.closeModal('modal-fetch');
    }

    applySettingsToUI() {
        this.setInputValue('fetch-login-url', this.settings.loginUrl);
        this.setInputValue('fetch-report-url', this.settings.reportUrl);
        this.setInputValue('fetch-username', this.settings.username);
        this.setInputValue('fetch-password', this.settings.password);
        this.setInputValue('fetch-start-date', this.settings.startDate);
        this.setInputValue('fetch-end-date', this.settings.endDate);
        
        const remCb = document.getElementById('fetch-remember-creds');
        if (remCb) remCb.checked = !!this.settings.rememberCredentials;

        const cutoffSelect = document.getElementById('cutoff-hour-select');
        if (cutoffSelect) cutoffSelect.value = String(this.cutoffHour);
    }

    saveSettingsFromUI() {
        this.settings.cutoffHour = parseInt(document.getElementById('setting-cutoff-hour')?.value || '6', 10);
        this.cutoffHour = this.settings.cutoffHour;
        StorageManager.save(this.settings);
        this.renderAll();
    }

    openModal(id) {
        const m = document.getElementById(id);
        if (m) m.classList.remove('hidden');
    }

    closeModal(id) {
        const m = document.getElementById(id);
        if (m) m.classList.add('hidden');
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('app-toast');
        const msgEl = document.getElementById('toast-message');
        if (!toast || !msgEl) return;

        msgEl.textContent = message;
        toast.className = 'fixed bottom-5 left-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl text-sm transition-all transform duration-300';

        if (type === 'success') {
            toast.classList.add('bg-emerald-600', 'text-white');
        } else if (type === 'error') {
            toast.classList.add('bg-rose-600', 'text-white');
        } else {
            toast.classList.add('bg-gray-900', 'text-white');
        }

        toast.classList.remove('translate-y-20', 'opacity-0', 'hidden');

        setTimeout(() => {
            toast.classList.add('translate-y-20', 'opacity-0');
            setTimeout(() => toast.classList.add('hidden'), 300);
        }, 4000);
    }

    setElText(id, val) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    setInputValue(id, val) {
        const el = document.getElementById(id);
        if (el) el.value = val || '';
    }
}

// Bootstrap app on window load
window.addEventListener('DOMContentLoaded', () => {
    window.sindbadApp = new App();
});
