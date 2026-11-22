# Sindbad Direct Report Fetcher
param(
    [string]$Username = "",
    [string]$Password = "",
    [string]$StartDate = "",
    [string]$EndDate = "",
    [string]$Cookie = ""
)

$cookieFile = Join-Path $PSScriptRoot "sindbad_cookies.txt"
$outputHtml = Join-Path $PSScriptRoot "live_report.html"

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host " جالب تقارير سندباد المباشر من الـ Endpoint الرسمي " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

if ([string]::IsNullOrWhiteSpace($Cookie)) {
    if ([string]::IsNullOrWhiteSpace($Username)) {
        $Username = Read-Host "أدخل البريد الإلكتروني أو رقم الهاتف لمنصة سندباد"
    }
    if ([string]::IsNullOrWhiteSpace($Password)) {
        $Password = Read-Host "أدخل كلمة المرور" -AsSecureString
        $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($Password)
        $Password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    }
}

if ([string]::IsNullOrWhiteSpace($StartDate)) {
    $StartDate = Read-Host "أدخل تاريخ البداية (مثال 01-11-2026) [اضغط Enter لليوم]"
    if ([string]::IsNullOrWhiteSpace($StartDate)) {
        $StartDate = (Get-Date).ToString("dd-MM-yyyy")
    }
}

if ([string]::IsNullOrWhiteSpace($EndDate)) {
    $EndDate = Read-Host "أدخل تاريخ النهاية (مثال 02-11-2026) [اضغط Enter لليوم]"
    if ([string]::IsNullOrWhiteSpace($EndDate)) {
        $EndDate = (Get-Date).ToString("dd-MM-yyyy")
    }
}

$headers = @(
    "-H", "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "-H", "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "-H", "Accept-Language: ar,en;q=0.9"
)

if (-not [string]::IsNullOrWhiteSpace($Cookie)) {
    Write-Host "`n[1/2] استخدام جلسة الكوكيز المزودة..." -ForegroundColor Yellow
    # Save cookie to file
    "siindbad.com`tFALSE`t/`tTRUE`t0`tPHPSESSID`t$Cookie" | Out-File -FilePath $cookieFile -Encoding ascii
} else {
    Write-Host "`n[1/3] تهيئة الجلسة واستقبال الكوكيز المبدئية من https://siindbad.com/sys/app/login.php..." -ForegroundColor Yellow
    curl.exe -s -c $cookieFile @headers "https://siindbad.com/sys/app/login.php" | Out-Null

    Write-Host "[2/3] تسجيل الدخول بحساب $Username..." -ForegroundColor Yellow
    $loginData = "username=$([uri]::EscapeDataString($Username))&password=$([uri]::EscapeDataString($Password))&submit=$([uri]::EscapeDataString('تسجيل الدخول'))"
    
    $loginResp = curl.exe -s -b $cookieFile -c $cookieFile -X POST @headers `
        -H "Content-Type: application/x-www-form-urlencoded" `
        -H "Origin: https://siindbad.com" `
        -H "Referer: https://siindbad.com/sys/app/login.php" `
        --data $loginData `
        "https://siindbad.com/sys/app/login.php"

    if ($loginResp -match 'فضلا ادخل' -or ($loginResp -match 'تسجيل الدخول' -and $loginResp -match 'password')) {
        Write-Host "تنبيه: يبدو أن بيانات الدخول غير صحيحة أو تم رفض تسجيل الدخول." -ForegroundColor Red
    } else {
        Write-Host "تم تسجيل الدخول بنجاح!" -ForegroundColor Green
    }
}

Write-Host "[3/3] جلب تقرير المبيعات للفترة من $StartDate إلى $EndDate..." -ForegroundColor Yellow

$reportUrl = "https://siindbad.com/sys/app/rep_sales_det.php?date_from=$StartDate&date_to=$EndDate"

curl.exe -s -b $cookieFile -c $cookieFile @headers `
    -H "Referer: https://siindbad.com/sys/app/index.php" `
    $reportUrl -o $outputHtml

if (Test-Path $outputHtml) {
    $size = (Get-Item $outputHtml).Length
    Write-Host "`nتم حفظ التقرير الحقيقي بنجاح في: $outputHtml ($size بايت)" -ForegroundColor Green
    Write-Host "جارٍ تحديث تطبيق الويب لعرض البيانات الحقيقية فوراً..." -ForegroundColor Cyan

    # Inject into app by writing to a local real report file
    $content = Get-Content -Raw -Path $outputHtml -Encoding utf8
    $escaped = $content.Replace('\', '\\').Replace('`', '\`').Replace('$', '\$')
    
    $jsInject = @"
// Automatically loaded real report
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.sindbadApp) {
            window.sindbadApp.loadHTMLContent(``$escaped``, 'تقرير حقيقي من سندباد ($StartDate إلى $EndDate)');
            window.sindbadApp.showToast('تم تحميل بيانات التقرير الحقيقي بنجاح!', 'success');
        }
    }, 300);
});
"@
    Set-Content -Path (Join-Path $PSScriptRoot "live-data.js") -Value $jsInject -Encoding utf8
    Write-Host "تم ربط البيانات الحقيقية بالتطبيق بنجاح! افتح index.html للمعاينة." -ForegroundColor Green
} else {
    Write-Host "فشل جلب ملف التقرير." -ForegroundColor Red
}
