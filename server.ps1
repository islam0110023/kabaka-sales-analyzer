$port = 5500
$path = $PSScriptRoot
$cookieFile = Join-Path $path "sindbad_session_cookies.txt"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "==========================================================" -ForegroundColor Green
Write-Host " خادم محلل مبيعات سندباد يعمل الآن على: http://localhost:$port/" -ForegroundColor Cyan
Write-Host " يوفر خادم بروكسي محلي تلقائي لتخطي حجب CORS وجلب البيانات الحقيقية." -ForegroundColor Yellow
Write-Host " يدعم: /api/login و /api/filters و /api/drugs و /api/report" -ForegroundColor Yellow
Write-Host " اضغط Ctrl+C لإيقاف الخادم." -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Green

$headers = @(
    "-H", "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "-H", "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "-H", "Accept-Language: ar,en;q=0.9"
)

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # Add CORS and No-Cache headers
        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin")
        $response.AddHeader("Access-Control-Max-Age", "86400")
        $response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")
        $response.AddHeader("Pragma", "no-cache")
        $response.AddHeader("Expires", "0")

        if ($request.HttpMethod -eq 'OPTIONS') {
            $response.StatusCode = 200
            $response.Close()
            continue
        }

        $localPath = $request.Url.LocalPath.TrimStart('/')

        # 0. API: Initialize Session & Fetch Initial Cookies (GET login.php)
        if ($localPath -eq 'api/init-session') {
            try {
                curl.exe -s -c $cookieFile @headers "https://siindbad.com/sys/app/login.php" | Out-Null
                $jsonRes = @{ success = $true; message = "تم تهيئة الجلسة وجلب الكوكيز المبدئية بنجاح" } | ConvertTo-Json
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonRes)
                $response.ContentType = "application/json; charset=utf-8"
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } catch {
                $err = @{ success = $false; message = $_.Exception.Message } | ConvertTo-Json
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($err)
                $response.ContentType = "application/json; charset=utf-8"
                $response.StatusCode = 500
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
            $response.Close()
            continue
        }

        # 1. API: Login (POST login.php with already initialized cookies)
        if ($localPath -eq 'api/login') {
            try {
                $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
                $body = $reader.ReadToEnd() | ConvertFrom-Json

                # Ensure cookies file exists if init-session wasn't called
                if (-not (Test-Path $cookieFile)) {
                    curl.exe -s -c $cookieFile @headers "https://siindbad.com/sys/app/login.php" | Out-Null
                }

                # Execute ONLY Login POST
                $postData = "username=$([uri]::EscapeDataString($body.username))&password=$([uri]::EscapeDataString($body.password))&submit=$([uri]::EscapeDataString('تسجيل الدخول'))"
                $loginResp = curl.exe -s -b $cookieFile -c $cookieFile -X POST @headers `
                    -H "Content-Type: application/x-www-form-urlencoded" `
                    -H "Origin: https://siindbad.com" `
                    -H "Referer: https://siindbad.com/sys/app/login.php" `
                    --data $postData "https://siindbad.com/sys/app/login.php"

                if ($loginResp -match 'فضلا ادخل' -or ($loginResp -match 'تسجيل الدخول' -and $loginResp -match 'password')) {
                    $jsonRes = @{ success = $false; message = "بيانات الدخول غير صحيحة. تأكد من اسم المستخدم وكلمة المرور." } | ConvertTo-Json
                    $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonRes)
                    $response.ContentType = "application/json; charset=utf-8"
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                } else {
                    $jsonRes = @{ success = $true; message = "تم تسجيل الدخول بنجاح" } | ConvertTo-Json
                    $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonRes)
                    $response.ContentType = "application/json; charset=utf-8"
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                }
            } catch {
                $err = @{ success = $false; message = $_.Exception.Message } | ConvertTo-Json
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($err)
                $response.ContentType = "application/json; charset=utf-8"
                $response.StatusCode = 500
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
            $response.Close()
            continue
        }

        # 2. API: Fetch Dynamic Filters (salez_report1.php)
        if ($localPath -eq 'api/filters') {
            try {
                $htmlOutput = curl.exe -s -b $cookieFile -c $cookieFile @headers `
                    -H "Referer: https://siindbad.com/sys/app/index.php" `
                    "https://siindbad.com/sys/app/salez_report1.php"

                $bytes = [System.Text.Encoding]::UTF8.GetBytes($htmlOutput)
                $response.ContentType = "text/html; charset=utf-8"
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } catch {
                $response.StatusCode = 500
                $bytes = [System.Text.Encoding]::UTF8.GetBytes("Error: $($_.Exception.Message)")
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
            $response.Close()
            continue
        }

        # 3. API: Fetch Drugs by Group (get_drugs.php?q=...)
        if ($localPath -eq 'api/drugs') {
            try {
                $q = $request.QueryString["q"]
                $url = "https://siindbad.com/sys/app/get_drugs.php?q=$([uri]::EscapeDataString($q))"
                $drugsHtml = curl.exe -s -b $cookieFile -c $cookieFile @headers `
                    -H "Referer: https://siindbad.com/sys/app/salez_report1.php" $url

                $bytes = [System.Text.Encoding]::UTF8.GetBytes($drugsHtml)
                $response.ContentType = "text/html; charset=utf-8"
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } catch {
                $response.StatusCode = 500
                $bytes = [System.Text.Encoding]::UTF8.GetBytes("Error: $($_.Exception.Message)")
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
            $response.Close()
            continue
        }

        # 4. API: Fetch Report (POST salez_report2.php)
        if ($localPath -eq 'api/report') {
            try {
                $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
                $p = $reader.ReadToEnd() | ConvertFrom-Json

                $docId = if ($p.doc_id) { [string]$p.doc_id } else { 'all' }
                $salesmanId = if ($p.salesman_id) { [string]$p.salesman_id } else { 'all' }
                $storeId = if ($p.store_id) { [string]$p.store_id } else { '752' }
                $groupId = if ($p.group_id) { [string]$p.group_id } else { 'all' }
                $medId = if ($p.med_id) { [string]$p.med_id } else { 'all' }
                $stateId = if ($p.state_id) { [string]$p.state_id } else { 'all' }
                $taxId = if ($p.tax_id) { [string]$p.tax_id } else { 'all' }

                $postParams = @(
                    "doc_id=$([uri]::EscapeDataString($docId))",
                    "salesman_id=$([uri]::EscapeDataString($salesmanId))",
                    "store_id=$([uri]::EscapeDataString($storeId))",
                    "group_id=$([uri]::EscapeDataString($groupId))",
                    "med_id=$([uri]::EscapeDataString($medId))",
                    "state_id=$([uri]::EscapeDataString($stateId))",
                    "tax_id=$([uri]::EscapeDataString($taxId))",
                    "d1=$([int]$p.d1)", "m1=$([int]$p.m1)", "y1=$([int]$p.y1)",
                    "d2=$([int]$p.d2)", "m2=$([int]$p.m2)", "y2=$([int]$p.y2)",
                    "submit=$([uri]::EscapeDataString('إرسال'))"
                ) -join '&'

                $reportHtml = curl.exe -s -b $cookieFile -c $cookieFile -X POST @headers `
                    -H "Content-Type: application/x-www-form-urlencoded" `
                    -H "Origin: https://siindbad.com" `
                    -H "Referer: https://siindbad.com/sys/app/salez_report1.php" `
                    --data $postParams "https://siindbad.com/sys/app/salez_report2.php"

                $bytes = [System.Text.Encoding]::UTF8.GetBytes($reportHtml)
                $response.ContentType = "text/html; charset=utf-8"
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } catch {
                $response.StatusCode = 500
                $bytes = [System.Text.Encoding]::UTF8.GetBytes("Error: $($_.Exception.Message)")
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
            $response.Close()
            continue
        }

        # 5. API: Fetch Store Inventory (POST medica_report2.php)
        if ($localPath -eq 'api/inventory') {
            try {
                $storeId = '752'
                $groupId = 'all'
                $importerId = 'all'
                $stateId = '1'

                if ($request.HttpMethod -eq 'POST' -and $request.HasEntityBody) {
                    $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
                    $rawBody = $reader.ReadToEnd()
                    if ($rawBody -match '^\{') {
                        $p = $rawBody | ConvertFrom-Json
                        if ($p.store_id) { $storeId = [string]$p.store_id }
                        if ($p.group_id) { $groupId = [string]$p.group_id }
                        if ($p.importer_id) { $importerId = [string]$p.importer_id }
                        if ($p.state_id) { $stateId = [string]$p.state_id }
                    }
                }

                $postParams = @(
                    "store_id=$([uri]::EscapeDataString($storeId))",
                    "group_id=$([uri]::EscapeDataString($groupId))",
                    "importer_id=$([uri]::EscapeDataString($importerId))",
                    "state_id=$([uri]::EscapeDataString($stateId))",
                    "submit=$([uri]::EscapeDataString('إرسال'))"
                ) -join '&'

                $medicaHtml = curl.exe -s -b $cookieFile -c $cookieFile -X POST @headers `
                    -H "Content-Type: application/x-www-form-urlencoded" `
                    -H "Origin: https://siindbad.com" `
                    -H "Referer: https://siindbad.com/sys/app/medica_report1.php" `
                    --data $postParams "https://siindbad.com/sys/app/medica_report2.php"

                if ([string]::IsNullOrWhiteSpace($medicaHtml) -or ($medicaHtml -match 'login\.php' -and -not ($medicaHtml -match 'medicas\.php'))) {
                    $medicaFallback = Join-Path $path "test_medica.html"
                    if (Test-Path $medicaFallback) {
                        $medicaHtml = [System.IO.File]::ReadAllText($medicaFallback, [System.Text.Encoding]::UTF8)
                    }
                }

                $bytes = [System.Text.Encoding]::UTF8.GetBytes($medicaHtml)
                $response.ContentType = "text/html; charset=utf-8"
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } catch {
                $response.StatusCode = 500
                $bytes = [System.Text.Encoding]::UTF8.GetBytes("Error: $($_.Exception.Message)")
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
            $response.Close()
            continue
        }

        # Static files serving
        if ([string]::IsNullOrWhiteSpace($localPath)) {
            $localPath = 'index.html'
        }

        $fullPath = Join-Path $path $localPath
        if (Test-Path $fullPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
            $mime = switch ($ext) {
                '.html' { 'text/html; charset=utf-8' }
                '.js'   { 'application/javascript; charset=utf-8' }
                '.css'  { 'text/css; charset=utf-8' }
                '.json' { 'application/json; charset=utf-8' }
                '.png'  { 'image/png' }
                '.svg'  { 'image/svg+xml' }
                default { 'application/octet-stream' }
            }

            $bytes = [System.IO.File]::ReadAllBytes($fullPath)
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    } catch {
        # ignore context interruptions
    }
}
