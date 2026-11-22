// Realistic sample data for Sindbad reports matching salez_report1.php and salez_report2.php

export const sampleFilterHTML = `
<form name="form1" method="post" action="salez_report2.php">
    <select name="store_id">
        <option value="all">كل الفروع</option>
        <option value="752" selected="selected">فرع KABAKA (752)</option>
    </select>

    <select name="doc_id">
        <option value="all" selected="selected">كل المستخدمين</option>
        <option value="101">كاشير الوردية</option>
    </select>

    <select name="salesman_id">
        <option value="all" selected="selected">كل البائعين</option>
    </select>

    <select name="group_id">
        <option value="all" selected="selected">كل المجموعات</option>
        <option value="10">ترنجات شتوية (ننجا)</option>
        <option value="20">بنطلونات جينز وباجي</option>
        <option value="30">تيشرتات وياقة فرو وهوديز</option>
        <option value="40">بدل شتوي وتيم 3</option>
        <option value="50">شراويل ميلتون</option>
    </select>

    <select name="med_id">
        <option value="all" selected="selected">كل الأصناف</option>
    </select>

    <select name="state_id">
        <option value="all" selected="selected">الكل</option>
        <option value="1">المبيعات</option>
        <option value="2">مرتجعات المبيعات</option>
    </select>

    <select name="tax_id">
        <option value="all" selected="selected">الكل</option>
        <option value="1">الضريبة الأساسية</option>
        <option value="2">الضريبة الصفرية</option>
    </select>
</form>
`;

export const sampleGroupDrugs = {
    "10": [
        { id: "all", name: "كل أصناف الترنجات" },
        { id: "634", name: "ترينج شتوي ننجا 4" },
        { id: "600", name: "ترنج شتوي ننجا هودي" }
    ],
    "20": [
        { id: "all", name: "كل أصناف البنطلونات والجينز" },
        { id: "669", name: "بنطلون ج س VERSUS" },
        { id: "665", name: "بنطلون وايد ليج كاب" },
        { id: "641", name: "بنطلون ج س جناح" }
    ],
    "30": [
        { id: "all", name: "كل التيشرتات والياقة فرو" },
        { id: "666", name: "تيشرت ياقه فرو" },
        { id: "661", name: "تيشرت شتوي فالنتينو موس" },
        { id: "620", name: "تيشرت شتوي VENERI" },
        { id: "604", name: "تيشرت شتوي كاتش نجمه" }
    ],
    "40": [
        { id: "all", name: "كل البدل والتيم 3" },
        { id: "624", name: "بدله شتوي تيم 3 دبور" }
    ],
    "50": [
        { id: "all", name: "كل الشراويل الميلتون" },
        { id: "650", name: "شروال ميلتون SH03" }
    ]
};

export const sampleSindbadHTML = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="utf-8">
    <title>تقرير مبيعات تفصيلي - KABAKA</title>
</head>
<body>
<div id="report-container">
    <div class="report-header" style="text-align: center; margin-bottom: 20px;">
        <h2>تقرير مبيعات تفصيلي</h2>
        <h3>الفرع : KABAKA (752)</h3>
        <p>الفترة من : <strong>21-11-2026 :: 22-11-2026</strong></p>
        <p>تاريخ الاستخراج : 22-11-2026 10:15:00 AM</p>
    </div>

    <!-- جدول المبيعات بـ 15 عمود كما يرجع من salez_report2.php -->
    <table border="1" cellpadding="5" cellspacing="0" id="sales-table" style="width:100%; text-align:center; border-collapse: collapse;">
        <thead>
            <tr bgcolor="#e2e8f0" style="font-weight: bold;">
                <th>#</th>
                <th>التاريخ</th>
                <th>الوقت</th>
                <th>الفاتورة</th>
                <th>الحركة</th>
                <th>الصنف</th>
                <th>الكود</th>
                <th>الكمية</th>
                <th>الوحدة</th>
                <th>السعر</th>
                <th>الخصم%</th>
                <th>الاجمالى</th>
                <th>التكلفة</th>
                <th>الربح</th>
                <th>الضريبة</th>
            </tr>
        </thead>
        <tbody>
            <!-- فواتير فجر اليوم الأول (21-11-2026 قبل 06:00 AM) - تابعة لسهرة الليلة السابقة -->
            <tr>
                <td>1</td>
                <td>21-11-2026</td>
                <td>01:19:01 AM</td>
                <td><a href="doc.php?id=1001">INV-1001</a></td>
                <td>مبيعات</td>
                <td>برجر لحم كلاسيك دبل</td>
                <td>ITEM-101</td>
                <td>2</td>
                <td>قطعة</td>
                <td>120.00</td>
                <td>0.00%</td>
                <td>240.00</td>
                <td>160.00</td>
                <td>80.00</td>
                <td>0.00</td>
            </tr>
            <tr>
                <td>2</td>
                <td>21-11-2026</td>
                <td>01:19:01 AM</td>
                <td><a href="doc.php?id=1001">INV-1001</a></td>
                <td>مبيعات</td>
                <td>بطاطس مقلية متبلة</td>
                <td>ITEM-102</td>
                <td>2</td>
                <td>وجبة</td>
                <td>40.00</td>
                <td>0.00%</td>
                <td>80.00</td>
                <td>25.00</td>
                <td>55.00</td>
                <td>0.00</td>
            </tr>
            <tr>
                <td>3</td>
                <td>21-11-2026</td>
                <td>03:45:12 AM</td>
                <td><a href="doc.php?id=1002">INV-1002</a></td>
                <td>مبيعات</td>
                <td>بيتزا باربيكيو تشيكن كينج</td>
                <td>ITEM-103</td>
                <td>1</td>
                <td>حبة</td>
                <td>180.00</td>
                <td>0.00%</td>
                <td>180.00</td>
                <td>110.00</td>
                <td>70.00</td>
                <td>0.00</td>
            </tr>
            <tr>
                <td>4</td>
                <td>21-11-2026</td>
                <td>05:10:44 AM</td>
                <td><a href="doc.php?id=1003">INV-1003</a></td>
                <td>مبيعات</td>
                <td>مشروب غازي كانز</td>
                <td>ITEM-104</td>
                <td>3</td>
                <td>علبة</td>
                <td>25.00</td>
                <td>0.00%</td>
                <td>75.00</td>
                <td>15.00</td>
                <td>60.00</td>
                <td>0.00</td>
            </tr>

            <!-- فواتير شيفت اليوم الأول (بعد 06:00 AM في 21-11-2026) -->
            <tr>
                <td>5</td>
                <td>21-11-2026</td>
                <td>08:15:30 AM</td>
                <td><a href="doc.php?id=1004">INV-1004</a></td>
                <td>مبيعات</td>
                <td>ساندوتش فلافل سوبر</td>
                <td>ITEM-105</td>
                <td>4</td>
                <td>قطعة</td>
                <td>30.00</td>
                <td>0.00%</td>
                <td>120.00</td>
                <td>18.00</td>
                <td>102.00</td>
                <td>0.00</td>
            </tr>
            <tr>
                <td>6</td>
                <td>21-11-2026</td>
                <td>09:40:15 AM</td>
                <td><a href="doc.php?id=1005">INV-1005</a></td>
                <td>مبيعات</td>
                <td>شاي كرك بالحليب</td>
                <td>ITEM-106</td>
                <td>2</td>
                <td>كوب</td>
                <td>20.00</td>
                <td>0.00%</td>
                <td>40.00</td>
                <td>8.00</td>
                <td>32.00</td>
                <td>0.00</td>
            </tr>
            <tr>
                <td>7</td>
                <td>21-11-2026</td>
                <td>13:49:05 PM</td>
                <td><a href="doc.php?id=1006">INV-1006</a></td>
                <td>مبيعات</td>
                <td>برجر لحم كلاسيك دبل</td>
                <td>ITEM-101</td>
                <td>3</td>
                <td>قطعة</td>
                <td>120.00</td>
                <td>0.00%</td>
                <td>360.00</td>
                <td>240.00</td>
                <td>120.00</td>
                <td>0.00</td>
            </tr>
            <!-- حالة ملاحظة: تكرار نفس الصنف في نفس الفاتورة INV-1006 -->
            <tr>
                <td>8</td>
                <td>21-11-2026</td>
                <td>13:49:05 PM</td>
                <td><a href="doc.php?id=1006">INV-1006</a></td>
                <td>مبيعات</td>
                <td>برجر لحم كلاسيك دبل</td>
                <td>ITEM-101</td>
                <td>1</td>
                <td>قطعة</td>
                <td>120.00</td>
                <td>0.00%</td>
                <td>120.00</td>
                <td>80.00</td>
                <td>40.00</td>
                <td>0.00</td>
            </tr>
            <!-- حالة ملاحظة: فرق سعر لنفس الصنف بدون خصم (بيع بـ 100 بدل 120 والخصم 0%) -->
            <tr>
                <td>9</td>
                <td>21-11-2026</td>
                <td>15:22:10 PM</td>
                <td><a href="doc.php?id=1007">INV-1007</a></td>
                <td>مبيعات</td>
                <td>برجر لحم كلاسيك دبل</td>
                <td>ITEM-101</td>
                <td>1</td>
                <td>قطعة</td>
                <td>100.00</td>
                <td>0.00%</td>
                <td>100.00</td>
                <td>80.00</td>
                <td>20.00</td>
                <td>0.00</td>
            </tr>
            <!-- حالة ملاحظة: هامش ربح منخفض أقل من 20% (تكلفة 780 من بيع 900، ربح 120 أي 13.3%) -->
            <tr>
                <td>10</td>
                <td>21-11-2026</td>
                <td>17:05:00 PM</td>
                <td><a href="doc.php?id=1008">INV-1008</a></td>
                <td>مبيعات</td>
                <td>ستيك ريب آي أنجوس فاخر</td>
                <td>ITEM-107</td>
                <td>2</td>
                <td>طبق</td>
                <td>450.00</td>
                <td>0.00%</td>
                <td>900.00</td>
                <td>780.00</td>
                <td>120.00</td>
                <td>0.00</td>
            </tr>
            <tr>
                <td>11</td>
                <td>21-11-2026</td>
                <td>18:30:22 PM</td>
                <td><a href="doc.php?id=1009">INV-1009</a></td>
                <td>مبيعات</td>
                <td>بيتزا باربيكيو تشيكن كينج</td>
                <td>ITEM-103</td>
                <td>2</td>
                <td>حبة</td>
                <td>180.00</td>
                <td>10.00%</td>
                <td>324.00</td>
                <td>220.00</td>
                <td>104.00</td>
                <td>0.00</td>
            </tr>
            <tr>
                <td>12</td>
                <td>21-11-2026</td>
                <td>21:15:45 PM</td>
                <td><a href="doc.php?id=1010">INV-1010</a></td>
                <td>مبيعات</td>
                <td>وجبة عائلية دجاج كرسبي</td>
                <td>ITEM-108</td>
                <td>3</td>
                <td>وجبة</td>
                <td>280.00</td>
                <td>0.00%</td>
                <td>840.00</td>
                <td>510.00</td>
                <td>330.00</td>
                <td>0.00</td>
            </tr>
            <tr>
                <td>13</td>
                <td>21-11-2026</td>
                <td>23:45:00 PM</td>
                <td><a href="doc.php?id=1011">INV-1011</a></td>
                <td>مرتجع مبيعات</td>
                <td>بطاطس مقلية متبلة</td>
                <td>ITEM-102</td>
                <td>1</td>
                <td>وجبة</td>
                <td>40.00</td>
                <td>0.00%</td>
                <td>40.00</td>
                <td>12.50</td>
                <td>27.50</td>
                <td>0.00</td>
            </tr>

            <!-- فواتير سهرة فجر اليوم الثاني (22-11-2026 قبل 06:00 AM) - تابعة لنفس شيفت اليوم الأول -->
            <tr>
                <td>14</td>
                <td>22-11-2026</td>
                <td>00:20:13 AM</td>
                <td><a href="doc.php?id=1012">INV-1012</a></td>
                <td>مبيعات</td>
                <td>برجر لحم كلاسيك دبل</td>
                <td>ITEM-101</td>
                <td>2</td>
                <td>قطعة</td>
                <td>120.00</td>
                <td>0.00%</td>
                <td>240.00</td>
                <td>160.00</td>
                <td>80.00</td>
                <td>0.00</td>
            </tr>
            <tr>
                <td>15</td>
                <td>22-11-2026</td>
                <td>02:15:33 AM</td>
                <td><a href="doc.php?id=1013">INV-1013</a></td>
                <td>مبيعات</td>
                <td>شوكولاتة لافا كيك</td>
                <td>ITEM-109</td>
                <td>3</td>
                <td>قطعة</td>
                <td>65.00</td>
                <td>0.00%</td>
                <td>195.00</td>
                <td>50.00</td>
                <td>145.00</td>
                <td>0.00</td>
            </tr>
            <tr>
                <td>16</td>
                <td>22-11-2026</td>
                <td>04:50:11 AM</td>
                <td><a href="doc.php?id=1014">INV-1014</a></td>
                <td>مبيعات</td>
                <td>مشروب غازي كانز</td>
                <td>ITEM-104</td>
                <td>4</td>
                <td>علبة</td>
                <td>25.00</td>
                <td>0.00%</td>
                <td>100.00</td>
                <td>20.00</td>
                <td>80.00</td>
                <td>0.00</td>
            </tr>

            <!-- صف الإجمالي Total -->
            <tr bgcolor="#cbd5e1" style="font-weight: bold;">
                <td colspan="7">Total</td>
                <td>35</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>4,038.00</td>
                <td>2,525.50</td>
                <td>1,512.50</td>
                <td>0.00</td>
            </tr>
        </tbody>
    </table>

    <!-- ملخص الإغلاق بـ :: بعد صف Total -->
    <div class="report-summary" style="margin-top: 25px; padding: 15px; border: 1px solid #94a3b8; background-color: #f8fafc;">
        <table border="1" cellpadding="6" style="border-collapse:collapse; width: 80%; margin: 0 auto; text-align: center;">
            <tr>
                <td bgcolor="#e2e8f0"><strong>الاجمالى ::</strong></td>
                <td>4,038.00</td>
                <td bgcolor="#e2e8f0"><strong>الضريبة ::</strong></td>
                <td>0.00</td>
            </tr>
            <tr>
                <td bgcolor="#e2e8f0"><strong>إجمالى بسعر التكلفة ::</strong></td>
                <td>2,525.50</td>
                <td bgcolor="#e2e8f0"><strong>الربح ::</strong></td>
                <td>1,512.50</td>
            </tr>
            <tr>
                <td bgcolor="#e2e8f0"><strong>الدرج ::</strong></td>
                <td>1,979.00</td>
                <td bgcolor="#e2e8f0"><strong>البنك ::</strong></td>
                <td>2,059.00</td>
            </tr>
        </table>
    </div>
</div>
</body>
</html>
`;
