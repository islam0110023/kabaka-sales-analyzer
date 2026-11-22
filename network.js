// Network Manager for Sindbad Multi-Endpoint Flow
// Implements:
// 1. Initial Cookie (GET login.php)
// 2. Login (POST login.php)
// 3. Dynamic Filters (GET salez_report1.php)
// 4. Drugs by Group (GET get_drugs.php?q=...)
// 5. Fetch Report (POST salez_report2.php)
// Handles session cookies, CORS proxy support, local proxy fallback, and auto re-login.

export class NetworkManager {
    constructor(callbacks = {}) {
        this.onStatus = callbacks.onStatus || (() => {});
        this.onError = callbacks.onError || (() => {});
        this.onCorsBlocked = callbacks.onCorsBlocked || (() => {});
        this.corsProxy = '';
        this.lastCredentials = null;
        this.retryCount = 0;
    }

    setCorsProxy(proxy) {
        this.corsProxy = proxy ? proxy.trim() : '';
    }

    formatUrl(targetUrl) {
        if (!this.corsProxy) return targetUrl;
        if (this.corsProxy.endsWith('?') || this.corsProxy.endsWith('=')) {
            return `${this.corsProxy}${encodeURIComponent(targetUrl)}`;
        }
        return `${this.corsProxy}/${targetUrl}`;
    }

    /**
     * Get the base URL for the local PowerShell proxy server.
     * If the app is opened via file:// or non-localhost, target http://localhost:5500.
     */
    getProxyBaseUrl() {
        if (window.location.protocol.startsWith('http')) {
            return '';
        }
        return 'http://localhost:5500';
    }

    /**
     * Check if local PowerShell proxy server is alive (http://localhost:5500)
     */
    async isLocalProxyAvailable() {
        if (this._localProxyChecked && this._localProxyAvailable !== undefined) {
            return this._localProxyAvailable;
        }
        try {
            const baseUrl = this.getProxyBaseUrl();
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2500);
            const resp = await fetch(`${baseUrl}/api/init-session`, {
                method: 'GET',
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            this._localProxyAvailable = resp.ok;
            this._localProxyChecked = true;
            if (resp.ok) {
                this.isSessionInitialized = true;
            }
            return this._localProxyAvailable;
        } catch (e) {
            this._localProxyAvailable = false;
            this._localProxyChecked = true;
            return false;
        }
    }

    /**
     * Step 1: Initialize Session & Fetch Initial Cookies (GET login.php)
     * Executes immediately upon page load as requested!
     */
    async initSessionCookies() {
        if (await this.isLocalProxyAvailable()) {
            this.onStatus({ step: 1, message: 'تهيئة الجلسة وجلب الكوكيز المبدئية من سندباد عبر السيرفر المحلي...' });
            this.isSessionInitialized = true;
            return { success: true, method: 'local_proxy' };
        }

        try {
            this.onStatus({ step: 1, message: 'تهيئة الجلسة واستقبال الكوكيز المبدئية (GET login.php)...' });
            const loginUrl = this.formatUrl('https://siindbad.com/sys/app/login.php');
            await fetch(loginUrl, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' }
            });

            this.isSessionInitialized = true;
            return { success: true, method: 'direct' };
        } catch (err) {
            console.warn('Direct initSessionCookies error:', err);
            this.isSessionInitialized = false;
            throw err;
        }
    }

    /**
     * Step 2: Login with POST ONLY (POST login.php)
     * Executes when the user clicks the login button using the initialized session/cookies!
     */
    async login(username, password) {
        this.lastCredentials = { username, password };
        this.retryCount = 0;

        // Ensure session cookies are initialized if not already done on page load
        if (!this.isSessionInitialized) {
            try {
                await this.initSessionCookies();
            } catch (e) {
                console.warn('Auto-init fallback before login POST:', e);
            }
        }

        // Try local proxy if running or available on localhost:5500
        if (await this.isLocalProxyAvailable()) {
            this.onStatus({ step: 2, message: 'إرسال طلب تسجيل الدخول (POST login.php) بالسيرفر المحلي...' });
            try {
                const baseUrl = this.getProxyBaseUrl();
                const resp = await fetch(`${baseUrl}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (resp.ok) {
                    const data = await resp.json();
                    if (data.success) {
                        return { success: true, method: 'local_proxy' };
                    } else {
                        throw new Error(data.message || 'فشل تسجيل الدخول في سندباد');
                    }
                }
            } catch (err) {
                console.warn('Local proxy login failed, falling back to direct/CORS:', err);
                if (err.message && err.message.includes('بيانات الدخول')) throw err;
            }
        }

        // Direct POST request with credentials: 'include'
        try {
            this.onStatus({ step: 2, message: 'إرسال بيانات الدخول فقط (POST login.php)...' });
            const loginUrl = this.formatUrl('https://siindbad.com/sys/app/login.php');

            const postBody = new URLSearchParams();
            postBody.append('username', username);
            postBody.append('password', password);
            postBody.append('submit', 'تسجيل الدخول');

            const postResp = await fetch(loginUrl, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                },
                body: postBody.toString()
            });

            const html = await postResp.text();
            if (html.includes('فضلا ادخل') || (html.includes('تسجيل الدخول') && html.includes('password'))) {
                throw new Error('بيانات الدخول غير صحيحة. يرجى التأكد من البريد/الهاتف وكلمة المرور.');
            }

            return { success: true, method: 'direct' };

        } catch (err) {
            this._handleCorsOrNetworkError(err, 'فشل تسجيل الدخول بسبب قيود أمان المتصفح (CORS) أو انقطاع الاتصال.');
            throw err;
        }
    }

    static isSessionExpiredHtml(html) {
        if (!html || typeof html !== 'string') return true;
        const trimmed = html.trim();
        if (trimmed.length === 0) return true;

        // If it clearly contains valid Sindbad filters or sales report data, it is NOT expired!
        if (trimmed.includes("store_id") || trimmed.includes("doc_id") || trimmed.includes("salesman_id") || trimmed.includes("group_id")) {
            return false;
        }
        if (trimmed.includes('<table') && (trimmed.includes('المبيعات') || trimmed.includes('salez_report') || trimmed.includes('الفاتورة') || trimmed.includes('ess'))) {
            return false;
        }

        const lower = trimmed.toLowerCase();
        if (lower.includes('class="login-form"') || lower.includes("class='login-form'")) return true;
        if (lower.includes('action="login.php"') || lower.includes("action='login.php'")) return true;
        if ((lower.includes('type="password"') || lower.includes("type='password'")) && lower.includes('username')) return true;
        if (lower.includes('window.location') && (lower.includes('login.php') || lower.includes('index.php'))) return true;
        if (trimmed.includes('انتهت الجلسة') || trimmed.includes('Session Expired') || trimmed.includes('session_expired')) return true;
        if (trimmed.length < 150 && !lower.includes('<table') && (lower.includes('found') || lower.includes('redirect') || lower.includes('moved'))) return true;

        return false;
    }

    /**
     * Step 3: Fetch Dynamic Filter Options (GET salez_report1.php)
     */
    async fetchFiltersHTML() {
        if (await this.isLocalProxyAvailable()) {
            try {
                this.onStatus({ step: 3, message: 'جلب قوائم الفلاتر من منصة سندباد...' });
                const baseUrl = this.getProxyBaseUrl();
                const resp = await fetch(`${baseUrl}/api/filters`);
                if (resp.status === 401 || resp.status === 403) {
                    const err = new Error('انتهت صلاحية جلسة تسجيل الدخول في سندباد (الكوكي غير صالح أو منتهي). يرجى تسجيل الدخول مجدداً لتجديد الكوكي.');
                    err.isSessionExpired = true;
                    throw err;
                }
                if (resp.ok) {
                    const text = await resp.text();
                    if (NetworkManager.isSessionExpiredHtml(text)) {
                        const err = new Error('انتهت صلاحية جلسة تسجيل الدخول في سندباد (الكوكي غير صالح أو منتهي). يرجى تسجيل الدخول مجدداً لتجديد الكوكي.');
                        err.isSessionExpired = true;
                        throw err;
                    }
                    return text;
                }
            } catch (e) {
                if (e.isSessionExpired) throw e;
                console.warn('Local proxy filters fetch failed:', e);
            }
        }

        const url = this.formatUrl('https://siindbad.com/sys/app/salez_report1.php');
        try {
            this.onStatus({ step: 3, message: 'جلب قوائم الفلاتر من منصة سندباد (salez_report1.php)...' });
            const resp = await fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' }
            });

            if (resp.status === 401 || resp.status === 403) {
                const err = new Error('انتهت جلسة تسجيل الدخول في سندباد. يرجى تسجيل الدخول مجدداً لتجديد الكوكي.');
                err.isSessionExpired = true;
                throw err;
            }

            const html = await resp.text();
            if (NetworkManager.isSessionExpiredHtml(html)) {
                // Session expired
                if (this.lastCredentials && this.retryCount === 0) {
                    this.retryCount++;
                    this.onStatus({ step: 1, message: 'انتهت الجلسة، جارٍ إعادة تسجيل الدخول تلقائياً...' });
                    await this.login(this.lastCredentials.username, this.lastCredentials.password);
                    return await this.fetchFiltersHTML();
                }
                const err = new Error('انتهت جلسة تسجيل الدخول في سندباد (الكوكي منتهي). يرجى تسجيل الدخول مجدداً لتجديد الكوكي.');
                err.isSessionExpired = true;
                throw err;
            }

            return html;
        } catch (err) {
            if (err.isSessionExpired) throw err;
            this._handleCorsOrNetworkError(err, 'فشل جلب قوائم الفلاتر من سندباد.');
            throw err;
        }
    }

    /**
     * Step 4: Fetch Drugs by Group (GET get_drugs.php?q=...)
     */
    async fetchDrugsByGroup(groupId) {
        if (!groupId || groupId === 'all') return [];

        if (await this.isLocalProxyAvailable()) {
            try {
                const baseUrl = this.getProxyBaseUrl();
                const resp = await fetch(`${baseUrl}/api/drugs?q=${encodeURIComponent(groupId)}`);
                if (resp.ok) {
                    return await resp.text();
                }
            } catch (e) {
                console.warn('Local proxy drugs fetch failed:', e);
            }
        }

        const url = this.formatUrl(`https://siindbad.com/sys/app/get_drugs.php?q=${encodeURIComponent(groupId)}`);
        try {
            const resp = await fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' }
            });
            return await resp.text();
        } catch (err) {
            console.error('Failed to fetch drugs by group:', err);
            return '';
        }
    }

    /**
     * Step 5: Fetch Report (POST salez_report2.php)
     */
    async fetchReportHTML(params) {
        if (await this.isLocalProxyAvailable()) {
            try {
                this.onStatus({ step: 4, message: 'إرسال طلب التقرير واستقبال بيانات المبيعات...' });
                const baseUrl = this.getProxyBaseUrl();
                const resp = await fetch(`${baseUrl}/api/report`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(params)
                });
                if (resp.status === 401 || resp.status === 403) {
                    const err = new Error('انتهت صلاحية جلسة تسجيل الدخول في سندباد (الكوكي غير صالح أو منتهي). يرجى تسجيل الدخول مجدداً لتجديد الكوكي.');
                    err.isSessionExpired = true;
                    throw err;
                }
                if (resp.ok) {
                    const text = await resp.text();
                    if (NetworkManager.isSessionExpiredHtml(text)) {
                        const err = new Error('انتهت صلاحية جلسة تسجيل الدخول في سندباد (الكوكي غير صالح أو منتهي). يرجى تسجيل الدخول مجدداً لتجديد الكوكي.');
                        err.isSessionExpired = true;
                        throw err;
                    }
                    return text;
                }
            } catch (e) {
                if (e.isSessionExpired) throw e;
                console.warn('Local proxy report fetch failed:', e);
            }
        }

        const url = this.formatUrl('https://siindbad.com/sys/app/salez_report2.php');
        const postBody = new URLSearchParams();
        postBody.append('doc_id', params.doc_id || 'all');
        postBody.append('salesman_id', params.salesman_id || 'all');
        postBody.append('store_id', params.store_id || '752');
        postBody.append('group_id', params.group_id || 'all');
        postBody.append('med_id', params.med_id || 'all');
        postBody.append('state_id', params.state_id || 'all');
        postBody.append('tax_id', params.tax_id || 'all');
        postBody.append('d1', String(params.d1));
        postBody.append('m1', String(params.m1));
        postBody.append('y1', String(params.y1));
        postBody.append('d2', String(params.d2));
        postBody.append('m2', String(params.m2));
        postBody.append('y2', String(params.y2));
        postBody.append('submit', 'إرسال');

        try {
            this.onStatus({ step: 4, message: 'إرسال طلب التقرير إلى salez_report2.php...' });
            const resp = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                },
                body: postBody.toString()
            });

            if (resp.status === 401 || resp.status === 403) {
                const err = new Error('انتهت جلسة تسجيل الدخول في سندباد. يرجى تسجيل الدخول مجدداً لتجديد الكوكي.');
                err.isSessionExpired = true;
                throw err;
            }

            const html = await resp.text();
            if (NetworkManager.isSessionExpiredHtml(html)) {
                if (this.lastCredentials && this.retryCount === 0) {
                    this.retryCount++;
                    this.onStatus({ step: 1, message: 'انتهت الجلسة، جارٍ إعادة تسجيل الدخول تلقائياً...' });
                    await this.login(this.lastCredentials.username, this.lastCredentials.password);
                    return await this.fetchReportHTML(params);
                }
                const err = new Error('انتهت جلسة تسجيل الدخول في سندباد (الكوكي منتهي). يرجى تسجيل الدخول مجدداً لتجديد الكوكي.');
                err.isSessionExpired = true;
                throw err;
            }

            return html;

        } catch (err) {
            if (err.isSessionExpired) throw err;
            this._handleCorsOrNetworkError(err, 'فشل جلب صفحة التقرير من سندباد.');
            throw err;
        }
    }

    /**
     * Parse HTML returned from salez_report1.php into options objects
     */
    static parseFiltersHTML(htmlText) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        const extractOptions = (selector, fallbackDefault = 'all') => {
            const select = doc.querySelector(selector);
            if (!select) return { options: [{ value: 'all', text: 'الكل' }], selectedValue: fallbackDefault };

            const options = Array.from(select.querySelectorAll('option')).map(opt => ({
                value: opt.value.trim(),
                text: opt.textContent.trim(),
                selected: opt.hasAttribute('selected')
            }));

            const selectedOpt = options.find(o => o.selected) || options[0];
            return {
                options,
                selectedValue: selectedOpt ? selectedOpt.value : fallbackDefault
            };
        };

        const storeData = extractOptions('select[name="store_id"]', '752');
        const docData = extractOptions('select[name="doc_id"]', 'all');
        const salesmanData = extractOptions('select[name="salesman_id"]', 'all');
        const groupData = extractOptions('select[name="group_id"]', 'all');
        const medData = extractOptions('select[name="med_id"]', 'all');
        const stateData = extractOptions('select[name="state_id"]', 'all');
        const taxData = extractOptions('select[name="tax_id"]', 'all');

        return {
            stores: storeData.options,
            selectedStore: storeData.selectedValue,
            docs: docData.options,
            selectedDoc: docData.selectedValue,
            salesmen: salesmanData.options,
            selectedSalesman: salesmanData.selectedValue,
            groups: groupData.options,
            selectedGroup: groupData.selectedValue,
            meds: medData.options,
            selectedMed: medData.selectedValue,
            states: stateData.options,
            selectedState: stateData.selectedValue,
            taxes: taxData.options,
            selectedTax: taxData.selectedValue
        };
    }

    /**
     * Parse HTML from get_drugs.php?q=... into list of item options
     */
    static parseDrugsHTML(htmlText) {
        if (!htmlText) return [{ value: 'all', text: 'كل الأصناف' }];
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        const options = Array.from(doc.querySelectorAll('option')).map(opt => ({
            value: opt.value.trim(),
            text: opt.textContent.trim()
        }));

        if (options.length === 0) {
            return [{ value: 'all', text: 'كل الأصناف' }];
        }
        return options;
    }

    _handleCorsOrNetworkError(err, contextMsg) {
        const isCors = (
            err.name === 'TypeError' && 
            (err.message.includes('fetch') || err.message.includes('NetworkError') || err.message === 'Failed to fetch')
        );

        let advice = 'حدث خطأ في الاتصال بالشبكة أو تعذر الوصول إلى منصة سندباد.';
        if (window.location.protocol === 'file:') {
            advice = 'أنت تفتح الصفحة كملف محلي (file://) مما يجعل المتصفح يمنع الاتصال المباشر بمنصة سندباد (CORS). يرجى فتح التطبيق في المتصفح على الرابط: http://localhost:5500 حيث يعمل السيرفر المحلي ويتخطى جميع قيود الأمان تلقائياً.';
        } else if (isCors) {
            advice = 'قيود أمان المتصفح (CORS Policy) تمنع طلب صفحات خارجية مباشرة من الواجهة الأمامية بدون تصريح من سيرفر سندباد. تأكد من تشغيل server.ps1 ثم افتح http://localhost:5500 أو استخدم خادم بروكسي أو ارفع ملف التقرير مباشرة.';
        }

        this.onCorsBlocked({
            isCors,
            originalError: err,
            contextMsg,
            advice
        });
    }
}
