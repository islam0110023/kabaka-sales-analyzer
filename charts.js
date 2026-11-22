// Interactive Charts Engine using Chart.js
// Visualizes:
// 1. Hourly Sales and Profit Distribution
// 2. Top Selling Items (by Sales & by Profit)
// 3. Payment Method Breakdown (Cash / Drawer vs Bank / POS)

export class ChartRenderer {
    constructor() {
        this.hourlyChart = null;
        this.topItemsChart = null;
        this.paymentChart = null;
    }

    /**
     * Destroy any existing charts to prevent canvas memory leaks & overlapping
     */
    destroyAll() {
        if (this.hourlyChart) {
            this.hourlyChart.destroy();
            this.hourlyChart = null;
        }
        if (this.topItemsChart) {
            this.topItemsChart.destroy();
            this.topItemsChart = null;
        }
        if (this.paymentChart) {
            this.paymentChart.destroy();
            this.paymentChart = null;
        }
    }

    /**
     * Render Hourly Sales & Profit Chart
     */
    renderHourly(canvasId, hourlyData) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        if (this.hourlyChart) {
            this.hourlyChart.destroy();
        }

        // Only show hours that have sales or show all 24 hours
        const labels = hourlyData.map(h => h.label);
        const salesData = hourlyData.map(h => h.sales);
        const profitData = hourlyData.map(h => h.profit);

        this.hourlyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'المبيعات (ر.س/ج.م)',
                        data: salesData,
                        backgroundColor: 'rgba(59, 130, 246, 0.75)', // Blue
                        borderColor: '#2563eb',
                        borderWidth: 1.5,
                        borderRadius: 6
                    },
                    {
                        label: 'صافي الربح',
                        data: profitData,
                        backgroundColor: 'rgba(16, 185, 129, 0.75)', // Green
                        borderColor: '#059669',
                        borderWidth: 1.5,
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                direction: 'rtl',
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: { family: 'Cairo', size: 12, weight: 'bold' }
                        }
                    },
                    tooltip: {
                        rtl: true,
                        textDirection: 'rtl',
                        bodyFont: { family: 'Cairo' },
                        titleFont: { family: 'Cairo', weight: 'bold' },
                        callbacks: {
                            label(context) {
                                return ` ${context.dataset.label}: ${context.raw.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { family: 'Cairo', size: 11 } }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: { family: 'Cairo', size: 11 },
                            callback(val) {
                                return val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val;
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Render Top 10 Items Chart (Horizontal Bar)
     */
    renderTopItems(canvasId, itemsAggregated, metric = 'sales') {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        if (this.topItemsChart) {
            this.topItemsChart.destroy();
        }

        // Sort by chosen metric and take top 10
        const sorted = [...itemsAggregated]
            .sort((a, b) => metric === 'profit' ? b.totalProfit - a.totalProfit : b.totalSales - a.totalSales)
            .slice(0, 10);

        const labels = sorted.map(i => i.name.length > 20 ? i.name.substring(0, 20) + '...' : i.name);
        const dataValues = sorted.map(i => metric === 'profit' ? i.totalProfit : i.totalSales);
        const labelText = metric === 'profit' ? 'صافي الربح' : 'إجمالي المبيعات';
        const barColor = metric === 'profit' ? 'rgba(16, 185, 129, 0.8)' : 'rgba(99, 102, 241, 0.8)';
        const borderColor = metric === 'profit' ? '#059669' : '#4f46e5';

        this.topItemsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        axis: 'y',
                        label: labelText,
                        data: dataValues,
                        backgroundColor: barColor,
                        borderColor: borderColor,
                        borderWidth: 1.5,
                        borderRadius: 6
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                direction: 'rtl',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        rtl: true,
                        textDirection: 'rtl',
                        bodyFont: { family: 'Cairo' },
                        titleFont: { family: 'Cairo', weight: 'bold' },
                        callbacks: {
                            title(items) {
                                const idx = items[0].dataIndex;
                                return sorted[idx].name;
                            },
                            label(context) {
                                return ` ${labelText}: ${context.raw.toLocaleString('ar-EG', { minimumFractionDigits: 2 })}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: { font: { family: 'Cairo', size: 11 } }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { font: { family: 'Cairo', size: 11 } }
                    }
                }
            }
        });
    }

    /**
     * Render Payment Methods Doughnut Chart (الدرج vs البنك)
     */
    renderPaymentBreakdown(canvasId, kpi) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        if (this.paymentChart) {
            this.paymentChart.destroy();
        }

        const drawer = kpi.drawerSales || 0;
        const bank = kpi.bankSales || 0;
        const total = drawer + bank;

        this.paymentChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['الدرج (نقداً)', 'البنك (شبكة/بطاقة)'],
                datasets: [
                    {
                        data: [drawer, bank],
                        backgroundColor: [
                            'rgba(245, 158, 11, 0.85)', // Amber / Cash
                            'rgba(14, 165, 233, 0.85)'  // Sky / Bank
                        ],
                        borderColor: ['#d97706', '#0284c7'],
                        borderWidth: 1.5,
                        hoverOffset: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                direction: 'rtl',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { family: 'Cairo', size: 12, weight: 'bold' },
                            padding: 14
                        }
                    },
                    tooltip: {
                        rtl: true,
                        textDirection: 'rtl',
                        bodyFont: { family: 'Cairo' },
                        callbacks: {
                            label(context) {
                                const val = context.raw;
                                const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                                return ` ${context.label}: ${val.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} (${pct}%)`;
                            }
                        }
                    }
                },
                cutout: '65%'
            }
        });
    }
}
