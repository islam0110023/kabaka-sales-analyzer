// Vercel Serverless Function Proxy for Sindbad POS / ERP
// Handles CORS-free communication with https://siindbad.com/sys/app/

let sessionCookie = '';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cookie');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const urlPath = req.url || '';
    const clientCookie = req.headers['cookie'] || req.headers['x-sindbad-cookie'] || sessionCookie;

    const baseHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ar,en;q=0.9'
    };

    try {
        // 1. Health / Init
        if (urlPath.includes('/api/health') || urlPath.includes('/api/init-session')) {
            const initResp = await fetch('https://siindbad.com/sys/app/login.php', {
                method: 'GET',
                headers: baseHeaders
            });
            const rawCookies = initResp.headers.get('set-cookie');
            if (rawCookies) {
                sessionCookie = rawCookies.split(';')[0];
                res.setHeader('Set-Cookie', sessionCookie + '; Path=/; SameSite=Lax');
            }
            return res.status(200).json({
                status: 'ok',
                initialized: true,
                proxy: 'vercel_serverless',
                cookie: sessionCookie
            });
        }

        // 2. Login
        if (urlPath.includes('/api/login')) {
            let body = req.body;
            if (typeof body === 'string') {
                try { body = JSON.parse(body); } catch (_) {}
            }
            body = body || {};

            if (!sessionCookie) {
                const initResp = await fetch('https://siindbad.com/sys/app/login.php', { headers: baseHeaders });
                const sc = initResp.headers.get('set-cookie');
                if (sc) sessionCookie = sc.split(';')[0];
            }

            const postData = new URLSearchParams();
            postData.append('username', body.username || '');
            postData.append('password', body.password || '');
            postData.append('submit', 'تسجيل الدخول');

            const loginResp = await fetch('https://siindbad.com/sys/app/login.php', {
                method: 'POST',
                headers: {
                    ...baseHeaders,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Origin': 'https://siindbad.com',
                    'Referer': 'https://siindbad.com/sys/app/login.php',
                    'Cookie': clientCookie || sessionCookie
                },
                body: postData.toString()
            });

            const newCookie = loginResp.headers.get('set-cookie');
            if (newCookie) {
                sessionCookie = newCookie.split(';')[0];
                res.setHeader('Set-Cookie', sessionCookie + '; Path=/; SameSite=Lax');
            }

            const loginText = await loginResp.text();
            if (loginText.includes('فضلا ادخل') || (loginText.includes('تسجيل الدخول') && loginText.includes('password'))) {
                return res.status(200).json({
                    success: false,
                    message: 'بيانات الدخول غير صحيحة. تأكد من اسم المستخدم وكلمة المرور.'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'تم تسجيل الدخول بنجاح',
                cookie: sessionCookie
            });
        }

        // 3. Filters
        if (urlPath.includes('/api/filters')) {
            const resp = await fetch('https://siindbad.com/sys/app/salez_report1.php', {
                method: 'GET',
                headers: {
                    ...baseHeaders,
                    'Referer': 'https://siindbad.com/sys/app/index.php',
                    'Cookie': clientCookie || sessionCookie
                }
            });
            const html = await resp.text();
            if (!html || html.trim().length === 0 || html.includes('login.php') || html.includes('type="password"') || (html.includes('تسجيل الدخول') && html.includes('password'))) {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                return res.status(401).json({
                    error: 'session_expired',
                    isSessionExpired: true,
                    message: 'انتهت صلاحية جلسة تسجيل الدخول في سندباد (الكوكي غير صالح أو منتهي). يرجى تسجيل الدخول مجدداً.'
                });
            }
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.status(200).send(html);
        }

        // 4. Drugs
        if (urlPath.includes('/api/drugs')) {
            const parsedUrl = new URL(urlPath, 'http://localhost');
            const q = parsedUrl.searchParams.get('q') || 'all';
            const resp = await fetch(`https://siindbad.com/sys/app/get_drugs.php?q=${encodeURIComponent(q)}`, {
                method: 'GET',
                headers: {
                    ...baseHeaders,
                    'Referer': 'https://siindbad.com/sys/app/salez_report1.php',
                    'Cookie': clientCookie || sessionCookie
                }
            });
            const html = await resp.text();
            if (!html || html.trim().length === 0 || html.includes('login.php') || html.includes('type="password"') || (html.includes('تسجيل الدخول') && html.includes('password')) || (resp.url && resp.url.includes('login.php'))) {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                return res.status(401).json({
                    error: 'session_expired',
                    isSessionExpired: true,
                    message: 'انتهت صلاحية جلسة تسجيل الدخول في سندباد (الكوكي غير صالح أو منتهي). يرجى تسجيل الدخول مجدداً.'
                });
            }
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.status(200).send(html);
        }

        // 5. Report
        if (urlPath.includes('/api/report')) {
            let p = req.body;
            if (typeof p === 'string') {
                try { p = JSON.parse(p); } catch (_) {}
            }
            p = p || {};

            const postData = new URLSearchParams();
            postData.append('doc_id', p.doc_id || 'all');
            postData.append('salesman_id', p.salesman_id || 'all');
            postData.append('state_id', p.state_id || 'all');
            postData.append('tax_id', p.tax_id || 'all');
            postData.append('store_id', p.store_id || '752');
            postData.append('group_id', p.group_id || 'all');
            postData.append('med_id', p.med_id || 'all');
            postData.append('d1', String(p.d1 || '1'));
            postData.append('d2', String(p.d2 || '30'));
            postData.append('m1', String(p.m1 || '11'));
            postData.append('m2', String(p.m2 || '11'));
            postData.append('y1', String(p.y1 || '2026'));
            postData.append('y2', String(p.y2 || '2026'));
            postData.append('h1', String(p.h1 || '12'));
            postData.append('h2', String(p.h2 || '12'));
            postData.append('min1', String(p.min1 || '00'));
            postData.append('min2', String(p.min2 || '00'));
            postData.append('t1', p.t1 || 'AM');
            postData.append('t2', p.t2 || 'PM');
            postData.append('all_time', p.all_time || '1');
            postData.append('r1', p.r1 || '1');
            postData.append('submit', 'عرض التقرير');

            const resp = await fetch('https://siindbad.com/sys/app/salez_report2.php', {
                method: 'POST',
                headers: {
                    ...baseHeaders,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Referer': 'https://siindbad.com/sys/app/salez_report1.php',
                    'Cookie': clientCookie || sessionCookie
                },
                body: postData.toString()
            });

            const html = await resp.text();
            if (!html || html.trim().length === 0 || html.includes('login.php') || html.includes('type="password"') || (html.includes('تسجيل الدخول') && html.includes('password')) || (resp.url && resp.url.includes('login.php'))) {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                return res.status(401).json({
                    error: 'session_expired',
                    isSessionExpired: true,
                    message: 'انتهت صلاحية جلسة تسجيل الدخول في سندباد (الكوكي غير صالح أو منتهي). يرجى تسجيل الدخول مجدداً.'
                });
            }
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.status(200).send(html);
        }

        // 6. Inventory
        if (urlPath.includes('/api/inventory')) {
            let p = req.body;
            if (typeof p === 'string') {
                try { p = JSON.parse(p); } catch (_) {}
            }
            p = p || {};

            const postData = new URLSearchParams();
            postData.append('store_id', p.store_id || '752');
            postData.append('group_id', p.group_id || 'all');
            postData.append('importer_id', p.importer_id || 'all');
            postData.append('state_id', p.state_id || '1');
            postData.append('submit', 'عرض التقرير');

            const resp = await fetch('https://siindbad.com/sys/app/medica_report2.php', {
                method: 'POST',
                headers: {
                    ...baseHeaders,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Referer': 'https://siindbad.com/sys/app/medica_report1.php',
                    'Cookie': clientCookie || sessionCookie
                },
                body: postData.toString()
            });

            const html = await resp.text();
            if (!html || html.trim().length === 0 || html.includes('login.php') || html.includes('type="password"') || (html.includes('تسجيل الدخول') && html.includes('password')) || (resp.url && resp.url.includes('login.php'))) {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                return res.status(401).json({
                    error: 'session_expired',
                    isSessionExpired: true,
                    message: 'انتهت صلاحية جلسة تسجيل الدخول في سندباد (الكوكي غير صالح أو منتهي). يرجى تسجيل الدخول مجدداً.'
                });
            }
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.status(200).send(html);
        }

        return res.status(404).json({ error: 'Endpoint not found' });
    } catch (err) {
        return res.status(500).json({ error: err.message || 'Internal server error' });
    }
}
