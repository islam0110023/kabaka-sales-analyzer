/**
 * Sindbad Sales & Shift Analyzer - Standalone Unified Bundle v2.0 Pro
 * Fully self-contained for local execution (file:/// and http://)
 * Covers: Login -> Filters (salez_report1.php) -> Drugs (get_drugs.php) -> Report (salez_report2.php)
 */

// ==========================================
// 1. SAMPLE DATA (FALLBACK & DEMO)
// ==========================================
const sampleFilterHTML = `
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

const sampleGroupDrugs = {
    "10": [
        { value: "all", text: "كل أصناف الترنجات" },
        { value: "634", text: "ترينج شتوي ننجا 4" },
        { value: "600", text: "ترنج شتوي ننجا هودي" }
    ],
    "20": [
        { value: "all", text: "كل أصناف البنطلونات والجينز" },
        { value: "669", text: "بنطلون ج س VERSUS" },
        { value: "665", text: "بنطلون وايد ليج كاب" },
        { value: "641", text: "بنطلون ج س جناح" }
    ],
    "30": [
        { value: "all", text: "كل التيشرتات والياقة فرو" },
        { value: "666", text: "تيشرت ياقه فرو" },
        { value: "661", text: "تيشرت شتوي فالنتينو موس" },
        { value: "620", text: "تيشرت شتوي VENERI" },
        { value: "604", text: "تيشرت شتوي كاتش نجمه" }
    ],
    "40": [
        { value: "all", text: "كل البدل والتيم 3" },
        { value: "624", text: "بدله شتوي تيم 3 دبور" }
    ],
    "50": [
        { value: "all", text: "كل الشراويل الميلتون" },
        { value: "650", text: "شروال ميلتون SH03" }
    ]
};

const sampleSindbadHTML = `

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link href="favicon.ico" rel="shortcut icon" type="image/vnd.microsoft.icon" />
<title>المبيعات</title>
<link href="css/gat.css" rel="stylesheet" type="text/css" />
<style type="text/css" >
#underheader
{
background-color:#ffffff;
height: 120px;
width: 100%;
padding-top:5px;
color:#F65C08;
font-weight:bold;
font-size:20px;
}

#popupContact
{
height: auto;
width:850px;
background:white;
border:4px solid #BF7812;
margin-top:50px;
padding:12px;
font-size:13px;

}
#popupContact a {
color:white;
text-decoration:none;
font-weight:bold;
}
#popupContact img
{
border:none;
margin-top:3px;
}
table
{
background-color:#08738E;
color:#FFF;
font-size:16px;
font-weight:bold;
border-collapse:collapse;
}
td{
	border:1px solid #9F9D9B;
	padding-right:5px;
    text-align:right;
    vertical-align:center;
    height: 40px;
    color:#BB440A ;

	}
	td h2
	{
	color:#385476;
	}
	td a
	{
     color:#1EC3F3;
     font-weight:bold;
     font-size:18px;
     text-decoration:none;	
	}


  #sp a
 {
     color:#146C7C;
     font-weight:bold;
     font-size:18px;
     text-decoration:none;

 }
  #sp 
 {
     color:#146C7C;
     font-weight:bold;
     font-size:18px;
     text-decoration:none;

 }
  #sp a:hover
 {
     color:#5CD5F8;
     font-weight:bold;
     font-size:18px;
     text-decoration:none;

 }
 body
 {
     background:#716F6B;
 }
 #es
 {
          color:#F2950F;
     font-weight:bold;
     font-size:18px;
     text-decoration:none;
 }
.sz a
{
text-decoration:none;
color:#446EA1 ;
font-weight:bold;
}


</style>
<script type="text/javascript" >
function d()
{
var s = confirm("هل تريد حقا حذف هذا العنصر : DO YOU WANT TO DELETE THIS ITEM");
if(s)
{
return true;
}
else
{
return false;
}
}
</script>
<link href="css/search2.css" rel="stylesheet" type="text/css" />
<script src="SpryAsset/SpryMenuBar.js" type="text/javascript"></script>
<script src="Scripts/swfobject_modified.js" type="text/javascript"></script>
<link href="SpryAsset/SpryMenuBarHorizontal.css" rel="stylesheet" type="text/css" />
<script src="functions.js"></script>
<script type="text/javascript">
function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}
function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}

var myVar;
function myFunction() 
{
myVar = setTimeout(showPage, 100);
}

function showPage() 
{
document.getElementById("loader").style.display = "none";
document.getElementById("myDiv").style.display = "block";
}
</script>
<style type='text/css' >
td
{
border:1px solid #D4D8DD ;
}
body{background-color:#ffffff;}
</style>


</head>
<body dir='rtl' onload='myFunction()'>
<div id='loader'></div>
<div id="underheader">

<img src='zz/icons/752_f47jcfb6ji.jpg' title='KABAKA' height='90' width='200'  style='float:left;'/></div>

<center><table width='1000' ><tr><td height='29' colspan='15' id='ess' ><center><font size='4' color='#28587D' >المبيعات</font></center></td></tr><tr><td height='40' colspan='15' id='ess' >
<center><font size='3' color='#28587D' >21-11-2026 :: 22-11-2026</font></center>
</td></tr><tr><td height='29' colspan='15' id='ess' ><center><font size='4' color='#28587D' >KABAKA</font></center></td></tr><tr bgcolor='#F0F1F2'>
<td height='29' style='border:1px solid #D4D8DD ; color:green;' ><center>#</center></td>
<td height='29' style='border:1px solid #D4D8DD ; color:green;' >التاريخ</td> 
<td height='29' style='border:1px solid #D4D8DD ; color:green;' >الوقت</td> 
<td height='29' style='border:1px solid #D4D8DD ; color:green;' >الفاتورة</td> 
<td height='29' style='border:1px solid #D4D8DD ; color:green;' >الحركة</td> 
<td height='29' style='border:1px solid #D4D8DD ; color:green;' >الصنف</td> 
<td height='29' style='border:1px solid #D4D8DD ; color:green;' >الكود</td>
<td height='29' style='border:1px solid #D4D8DD ; color:green;' >الكمية</td>      
<td height='29' style='border:1px solid #D4D8DD ; color:green;' >الوحدة</td>
<td height='29' style='border:1px solid #D4D8DD ; color:green;' >السعر</td>
<td height='29' style='border:1px solid #D4D8DD ; color:green;' >الخصم%</td>
<td height='29' style='border:1px solid #D4D8DD ; color:green;' >الاجمالى</td>
<td height='29' style='border:1px solid #D4D8DD ; color:green;' >التكلفة</td>
<td height='29' style='border:1px solid #D4D8DD ; color:green;' >الربح</td>
<td height='29' style='border:1px solid #D4D8DD ; color:green;' >الضريبة</td>
</tr><tr><td height='29' style='border:1px solid #D4D8DD ;' ><center>1</center></td><td height='29' style='border:1px solid #D4D8DD ;' >21-11-2026</td><td height='29' style='border:1px solid #D4D8DD ;' >01:41:39 AM</td><td height='29' style='border:1px solid #D4D8DD ;' ><a href='recc1.php?serial_no=272543' target='_blank' >S1989</a></td><td height='29' style='border:1px solid #D4D8DD ;' >المبيعات</td><td height='29' style='border:1px solid #D4D8DD ;' >ترينج شتوي ننجا 4</td><td height='29' style='border:1px solid #D4D8DD ;' >634</td><td height='29' style='border:1px solid #D4D8DD ;' >1.000</td><td height='29' style='border:1px solid #D4D8DD ;' >وحدة</td><td height='29' style='border:1px solid #D4D8DD ;' >750.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00%</td><td height='29' style='border:1px solid #D4D8DD ;' >750.00</td><td height='29' style='border:1px solid #D4D8DD ;' >550.00</td><td height='29' style='border:1px solid #D4D8DD ;' >200.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00</td></tr><tr><td height='29' style='border:1px solid #D4D8DD ;' ><center>2</center></td><td height='29' style='border:1px solid #D4D8DD ;' >21-11-2026</td><td height='29' style='border:1px solid #D4D8DD ;' >15:50:25 PM</td><td height='29' style='border:1px solid #D4D8DD ;' ><a href='recc1.php?serial_no=272617' target='_blank' >S1990</a></td><td height='29' style='border:1px solid #D4D8DD ;' >المبيعات</td><td height='29' style='border:1px solid #D4D8DD ;' >تيشرت شتوي فالنتينو موس</td><td height='29' style='border:1px solid #D4D8DD ;' >661</td><td height='29' style='border:1px solid #D4D8DD ;' >1.000</td><td height='29' style='border:1px solid #D4D8DD ;' >وحدة</td><td height='29' style='border:1px solid #D4D8DD ;' >900.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00%</td><td height='29' style='border:1px solid #D4D8DD ;' >900.00</td><td height='29' style='border:1px solid #D4D8DD ;' >670.00</td><td height='29' style='border:1px solid #D4D8DD ;' >230.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00</td></tr><tr><td height='29' style='border:1px solid #D4D8DD ;' ><center>3</center></td><td height='29' style='border:1px solid #D4D8DD ;' >21-11-2026</td><td height='29' style='border:1px solid #D4D8DD ;' >15:50:25 PM</td><td height='29' style='border:1px solid #D4D8DD ;' ><a href='recc1.php?serial_no=272617' target='_blank' >S1990</a></td><td height='29' style='border:1px solid #D4D8DD ;' >المبيعات</td><td height='29' style='border:1px solid #D4D8DD ;' >بنطلون وايد ليج كاب</td><td height='29' style='border:1px solid #D4D8DD ;' >665</td><td height='29' style='border:1px solid #D4D8DD ;' >1.000</td><td height='29' style='border:1px solid #D4D8DD ;' >وحدة</td><td height='29' style='border:1px solid #D4D8DD ;' >600.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00%</td><td height='29' style='border:1px solid #D4D8DD ;' >600.00</td><td height='29' style='border:1px solid #D4D8DD ;' >400.00</td><td height='29' style='border:1px solid #D4D8DD ;' >200.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00</td></tr><tr><td height='29' style='border:1px solid #D4D8DD ;' ><center>4</center></td><td height='29' style='border:1px solid #D4D8DD ;' >21-11-2026</td><td height='29' style='border:1px solid #D4D8DD ;' >17:42:46 PM</td><td height='29' style='border:1px solid #D4D8DD ;' ><a href='recc1.php?serial_no=272624' target='_blank' >S1991</a></td><td height='29' style='border:1px solid #D4D8DD ;' >المبيعات</td><td height='29' style='border:1px solid #D4D8DD ;' >ترينج شتوي ننجا 4</td><td height='29' style='border:1px solid #D4D8DD ;' >634</td><td height='29' style='border:1px solid #D4D8DD ;' >1.000</td><td height='29' style='border:1px solid #D4D8DD ;' >وحدة</td><td height='29' style='border:1px solid #D4D8DD ;' >750.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00%</td><td height='29' style='border:1px solid #D4D8DD ;' >750.00</td><td height='29' style='border:1px solid #D4D8DD ;' >550.00</td><td height='29' style='border:1px solid #D4D8DD ;' >200.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00</td></tr><tr><td height='29' style='border:1px solid #D4D8DD ;' ><center>5</center></td><td height='29' style='border:1px solid #D4D8DD ;' >21-11-2026</td><td height='29' style='border:1px solid #D4D8DD ;' >18:03:03 PM</td><td height='29' style='border:1px solid #D4D8DD ;' ><a href='recc1.php?serial_no=272625' target='_blank' >S1992</a></td><td height='29' style='border:1px solid #D4D8DD ;' >المبيعات</td><td height='29' style='border:1px solid #D4D8DD ;' >تيشرت ياقه فرو</td><td height='29' style='border:1px solid #D4D8DD ;' >666</td><td height='29' style='border:1px solid #D4D8DD ;' >1.000</td><td height='29' style='border:1px solid #D4D8DD ;' >وحدة</td><td height='29' style='border:1px solid #D4D8DD ;' >750.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00%</td><td height='29' style='border:1px solid #D4D8DD ;' >750.00</td><td height='29' style='border:1px solid #D4D8DD ;' >450.00</td><td height='29' style='border:1px solid #D4D8DD ;' >300.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00</td></tr><tr><td height='29' style='border:1px solid #D4D8DD ;' ><center>6</center></td><td height='29' style='border:1px solid #D4D8DD ;' >21-11-2026</td><td height='29' style='border:1px solid #D4D8DD ;' >19:45:52 PM</td><td height='29' style='border:1px solid #D4D8DD ;' ><a href='recc1.php?serial_no=272631' target='_blank' >S1993</a></td><td height='29' style='border:1px solid #D4D8DD ;' >المبيعات</td><td height='29' style='border:1px solid #D4D8DD ;' >بنطلون ج س VERSUS</td><td height='29' style='border:1px solid #D4D8DD ;' >669</td><td height='29' style='border:1px solid #D4D8DD ;' >1.000</td><td height='29' style='border:1px solid #D4D8DD ;' >وحدة</td><td height='29' style='border:1px solid #D4D8DD ;' >900.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00%</td><td height='29' style='border:1px solid #D4D8DD ;' >900.00</td><td height='29' style='border:1px solid #D4D8DD ;' >730.00</td><td height='29' style='border:1px solid #D4D8DD ;' >170.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00</td></tr><tr><td height='29' style='border:1px solid #D4D8DD ;' ><center>7</center></td><td height='29' style='border:1px solid #D4D8DD ;' >21-11-2026</td><td height='29' style='border:1px solid #D4D8DD ;' >20:12:52 PM</td><td height='29' style='border:1px solid #D4D8DD ;' ><a href='recc1.php?serial_no=272634' target='_blank' >S1994</a></td><td height='29' style='border:1px solid #D4D8DD ;' >المبيعات</td><td height='29' style='border:1px solid #D4D8DD ;' >تيشرت ياقه فرو</td><td height='29' style='border:1px solid #D4D8DD ;' >666</td><td height='29' style='border:1px solid #D4D8DD ;' >1.000</td><td height='29' style='border:1px solid #D4D8DD ;' >وحدة</td><td height='29' style='border:1px solid #D4D8DD ;' >750.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00%</td><td height='29' style='border:1px solid #D4D8DD ;' >750.00</td><td height='29' style='border:1px solid #D4D8DD ;' >450.00</td><td height='29' style='border:1px solid #D4D8DD ;' >300.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00</td></tr><tr><td height='29' style='border:1px solid #D4D8DD ;' ><center>8</center></td><td height='29' style='border:1px solid #D4D8DD ;' >21-11-2026</td><td height='29' style='border:1px solid #D4D8DD ;' >20:12:52 PM</td><td height='29' style='border:1px solid #D4D8DD ;' ><a href='recc1.php?serial_no=272634' target='_blank' >S1994</a></td><td height='29' style='border:1px solid #D4D8DD ;' >المبيعات</td><td height='29' style='border:1px solid #D4D8DD ;' >تيشرت شتوي VENERI</td><td height='29' style='border:1px solid #D4D8DD ;' >620</td><td height='29' style='border:1px solid #D4D8DD ;' >1.000</td><td height='29' style='border:1px solid #D4D8DD ;' >وحدة</td><td height='29' style='border:1px solid #D4D8DD ;' >750.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00%</td><td height='29' style='border:1px solid #D4D8DD ;' >750.00</td><td height='29' style='border:1px solid #D4D8DD ;' >525.00</td><td height='29' style='border:1px solid #D4D8DD ;' >225.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00</td></tr><tr><td height='29' style='border:1px solid #D4D8DD ;' ><center>9</center></td><td height='29' style='border:1px solid #D4D8DD ;' >21-11-2026</td><td height='29' style='border:1px solid #D4D8DD ;' >20:23:25 PM</td><td height='29' style='border:1px solid #D4D8DD ;' ><a href='recc1.php?serial_no=272635' target='_blank' >S1995</a></td><td height='29' style='border:1px solid #D4D8DD ;' >المبيعات</td><td height='29' style='border:1px solid #D4D8DD ;' >تيشرت ياقه فرو</td><td height='29' style='border:1px solid #D4D8DD ;' >666</td><td height='29' style='border:1px solid #D4D8DD ;' >1.000</td><td height='29' style='border:1px solid #D4D8DD ;' >وحدة</td><td height='29' style='border:1px solid #D4D8DD ;' >750.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00%</td><td height='29' style='border:1px solid #D4D8DD ;' >750.00</td><td height='29' style='border:1px solid #D4D8DD ;' >450.00</td><td height='29' style='border:1px solid #D4D8DD ;' >300.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00</td></tr><tr><td height='29' style='border:1px solid #D4D8DD ;' ><center>10</center></td><td height='29' style='border:1px solid #D4D8DD ;' >21-11-2026</td><td height='29' style='border:1px solid #D4D8DD ;' >21:21:00 PM</td><td height='29' style='border:1px solid #D4D8DD ;' ><a href='recc1.php?serial_no=272649' target='_blank' >S1996</a></td><td height='29' style='border:1px solid #D4D8DD ;' >المبيعات</td><td height='29' style='border:1px solid #D4D8DD ;' >بدله شتوي تيم 3 دبور</td><td height='29' style='border:1px solid #D4D8DD ;' >624</td><td height='29' style='border:1px solid #D4D8DD ;' >1.000</td><td height='29' style='border:1px solid #D4D8DD ;' >وحدة</td><td height='29' style='border:1px solid #D4D8DD ;' >1,600.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00%</td><td height='29' style='border:1px solid #D4D8DD ;' >1,600.00</td><td height='29' style='border:1px solid #D4D8DD ;' >1,150.00</td><td height='29' style='border:1px solid #D4D8DD ;' >450.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00</td></tr><tr><td height='29' style='border:1px solid #D4D8DD ;' ><center>11</center></td><td height='29' style='border:1px solid #D4D8DD ;' >21-11-2026</td><td height='29' style='border:1px solid #D4D8DD ;' >21:54:10 PM</td><td height='29' style='border:1px solid #D4D8DD ;' ><a href='recc1.php?serial_no=272654' target='_blank' >S1997</a></td><td height='29' style='border:1px solid #D4D8DD ;' >المبيعات</td><td height='29' style='border:1px solid #D4D8DD ;' >تيشرت ياقه فرو</td><td height='29' style='border:1px solid #D4D8DD ;' >666</td><td height='29' style='border:1px solid #D4D8DD ;' >1.000</td><td height='29' style='border:1px solid #D4D8DD ;' >وحدة</td><td height='29' style='border:1px solid #D4D8DD ;' >750.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00%</td><td height='29' style='border:1px solid #D4D8DD ;' >750.00</td><td height='29' style='border:1px solid #D4D8DD ;' >450.00</td><td height='29' style='border:1px solid #D4D8DD ;' >300.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00</td></tr><tr><td height='29' style='border:1px solid #D4D8DD ;' ><center>12</center></td><td height='29' style='border:1px solid #D4D8DD ;' >21-11-2026</td><td height='29' style='border:1px solid #D4D8DD ;' >22:24:52 PM</td><td height='29' style='border:1px solid #D4D8DD ;' ><a href='recc1.php?serial_no=272660' target='_blank' >S1998</a></td><td height='29' style='border:1px solid #D4D8DD ;' >المبيعات</td><td height='29' style='border:1px solid #D4D8DD ;' >تيشرت ياقه فرو</td><td height='29' style='border:1px solid #D4D8DD ;' >666</td><td height='29' style='border:1px solid #D4D8DD ;' >1.000</td><td height='29' style='border:1px solid #D4D8DD ;' >وحدة</td><td height='29' style='border:1px solid #D4D8DD ;' >750.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00%</td><td height='29' style='border:1px solid #D4D8DD ;' >750.00</td><td height='29' style='border:1px solid #D4D8DD ;' >450.00</td><td height='29' style='border:1px solid #D4D8DD ;' >300.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00</td></tr><tr><td height='29' style='border:1px solid #D4D8DD ;' ><center>13</center></td><td height='29' style='border:1px solid #D4D8DD ;' >21-11-2026</td><td height='29' style='border:1px solid #D4D8DD ;' >22:24:52 PM</td><td height='29' style='border:1px solid #D4D8DD ;' ><a href='recc1.php?serial_no=272660' target='_blank' >S1998</a></td><td height='29' style='border:1px solid #D4D8DD ;' >المبيعات</td><td height='29' style='border:1px solid #D4D8DD ;' >بنطلون ج س جناح</td><td height='29' style='border:1px solid #D4D8DD ;' >641</td><td height='29' style='border:1px solid #D4D8DD ;' >1.000</td><td height='29' style='border:1px solid #D4D8DD ;' >وحدة</td><td height='29' style='border:1px solid #D4D8DD ;' >950.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00%</td><td height='29' style='border:1px solid #D4D8DD ;' >950.00</td><td height='29' style='border:1px solid #D4D8DD ;' >680.00</td><td height='29' style='border:1px solid #D4D8DD ;' >270.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00</td></tr><tr><td height='29' style='border:1px solid #D4D8DD ;' ><center>14</center></td><td height='29' style='border:1px solid #D4D8DD ;' >21-11-2026</td><td height='29' style='border:1px solid #D4D8DD ;' >23:28:59 PM</td><td height='29' style='border:1px solid #D4D8DD ;' ><a href='recc1.php?serial_no=272678' target='_blank' >S1999</a></td><td height='29' style='border:1px solid #D4D8DD ;' >المبيعات</td><td height='29' style='border:1px solid #D4D8DD ;' >ترينج شتوي ننجا 4</td><td height='29' style='border:1px solid #D4D8DD ;' >634</td><td height='29' style='border:1px solid #D4D8DD ;' >1.000</td><td height='29' style='border:1px solid #D4D8DD ;' >وحدة</td><td height='29' style='border:1px solid #D4D8DD ;' >750.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00%</td><td height='29' style='border:1px solid #D4D8DD ;' >750.00</td><td height='29' style='border:1px solid #D4D8DD ;' >550.00</td><td height='29' style='border:1px solid #D4D8DD ;' >200.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00</td></tr><tr><td height='29' style='border:1px solid #D4D8DD ;' ><center>15</center></td><td height='29' style='border:1px solid #D4D8DD ;' >22-11-2026</td><td height='29' style='border:1px solid #D4D8DD ;' >00:19:47 AM</td><td height='29' style='border:1px solid #D4D8DD ;' ><a href='recc1.php?serial_no=272681' target='_blank' >S2000</a></td><td height='29' style='border:1px solid #D4D8DD ;' >المبيعات</td><td height='29' style='border:1px solid #D4D8DD ;' >تيشرت ياقه فرو</td><td height='29' style='border:1px solid #D4D8DD ;' >666</td><td height='29' style='border:1px solid #D4D8DD ;' >1.000</td><td height='29' style='border:1px solid #D4D8DD ;' >وحدة</td><td height='29' style='border:1px solid #D4D8DD ;' >750.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00%</td><td height='29' style='border:1px solid #D4D8DD ;' >750.00</td><td height='29' style='border:1px solid #D4D8DD ;' >450.00</td><td height='29' style='border:1px solid #D4D8DD ;' >300.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00</td></tr><tr><td height='29' style='border:1px solid #D4D8DD ;' ><center>16</center></td><td height='29' style='border:1px solid #D4D8DD ;' >22-11-2026</td><td height='29' style='border:1px solid #D4D8DD ;' >00:19:47 AM</td><td height='29' style='border:1px solid #D4D8DD ;' ><a href='recc1.php?serial_no=272681' target='_blank' >S2000</a></td><td height='29' style='border:1px solid #D4D8DD ;' >المبيعات</td><td height='29' style='border:1px solid #D4D8DD ;' >تيشرت ياقه فرو</td><td height='29' style='border:1px solid #D4D8DD ;' >666</td><td height='29' style='border:1px solid #D4D8DD ;' >1.000</td><td height='29' style='border:1px solid #D4D8DD ;' >وحدة</td><td height='29' style='border:1px solid #D4D8DD ;' >750.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00%</td><td height='29' style='border:1px solid #D4D8DD ;' >750.00</td><td height='29' style='border:1px solid #D4D8DD ;' >450.00</td><td height='29' style='border:1px solid #D4D8DD ;' >300.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00</td></tr><tr><td height='29' style='border:1px solid #D4D8DD ;' ><center>17</center></td><td height='29' style='border:1px solid #D4D8DD ;' >22-11-2026</td><td height='29' style='border:1px solid #D4D8DD ;' >00:41:23 AM</td><td height='29' style='border:1px solid #D4D8DD ;' ><a href='recc1.php?serial_no=272687' target='_blank' >S2001</a></td><td height='29' style='border:1px solid #D4D8DD ;' >المبيعات</td><td height='29' style='border:1px solid #D4D8DD ;' >تيشرت شتوي كاتش نجمه</td><td height='29' style='border:1px solid #D4D8DD ;' >604</td><td height='29' style='border:1px solid #D4D8DD ;' >1.000</td><td height='29' style='border:1px solid #D4D8DD ;' >وحدة</td><td height='29' style='border:1px solid #D4D8DD ;' >600.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00%</td><td height='29' style='border:1px solid #D4D8DD ;' >600.00</td><td height='29' style='border:1px solid #D4D8DD ;' >400.00</td><td height='29' style='border:1px solid #D4D8DD ;' >200.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00</td></tr><tr><td height='29' style='border:1px solid #D4D8DD ;' ><center>18</center></td><td height='29' style='border:1px solid #D4D8DD ;' >22-11-2026</td><td height='29' style='border:1px solid #D4D8DD ;' >00:57:44 AM</td><td height='29' style='border:1px solid #D4D8DD ;' ><a href='recc1.php?serial_no=272690' target='_blank' >S2002</a></td><td height='29' style='border:1px solid #D4D8DD ;' >المبيعات</td><td height='29' style='border:1px solid #D4D8DD ;' >ترينج شتوي ننجا 4</td><td height='29' style='border:1px solid #D4D8DD ;' >634</td><td height='29' style='border:1px solid #D4D8DD ;' >1.000</td><td height='29' style='border:1px solid #D4D8DD ;' >وحدة</td><td height='29' style='border:1px solid #D4D8DD ;' >750.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00%</td><td height='29' style='border:1px solid #D4D8DD ;' >750.00</td><td height='29' style='border:1px solid #D4D8DD ;' >550.00</td><td height='29' style='border:1px solid #D4D8DD ;' >200.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00</td></tr><tr><td height='29' style='border:1px solid #D4D8DD ;' ><center>19</center></td><td height='29' style='border:1px solid #D4D8DD ;' >22-11-2026</td><td height='29' style='border:1px solid #D4D8DD ;' >01:01:27 AM</td><td height='29' style='border:1px solid #D4D8DD ;' ><a href='recc1.php?serial_no=272692' target='_blank' >S2003</a></td><td height='29' style='border:1px solid #D4D8DD ;' >المبيعات</td><td height='29' style='border:1px solid #D4D8DD ;' >ترينج شتوي ننجا 4</td><td height='29' style='border:1px solid #D4D8DD ;' >634</td><td height='29' style='border:1px solid #D4D8DD ;' >1.000</td><td height='29' style='border:1px solid #D4D8DD ;' >وحدة</td><td height='29' style='border:1px solid #D4D8DD ;' >750.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00%</td><td height='29' style='border:1px solid #D4D8DD ;' >750.00</td><td height='29' style='border:1px solid #D4D8DD ;' >550.00</td><td height='29' style='border:1px solid #D4D8DD ;' >200.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00</td></tr><tr><td height='29' style='border:1px solid #D4D8DD ;' colspan='11' >Total</td><td height='29' style='border:1px solid #D4D8DD ;' >15,300.00</td><td height='29' style='border:1px solid #D4D8DD ;' >10,455.00</td><td height='29' style='border:1px solid #D4D8DD ;' >4,845.00</td><td height='29' style='border:1px solid #D4D8DD ;' >0.00</td></tr><tr><td height='29' colspan='15' style='border:1px solid #D4D8DD ;color:#28587D;' >
الاجمالى &nbsp;::&nbsp;15,300.00&nbsp;جنيه</td></tr><tr><td height='29' colspan='15' style='border:1px solid #D4D8DD ;color:#28587D;' >
الضريبة &nbsp;::&nbsp;0.00&nbsp;جنيه</td></tr><tr><td height='29' colspan='15' style='border:1px solid #D4D8DD ;color:#28587D;' >
الاجمالي شامل الضريبة &nbsp;::&nbsp;15,300.00&nbsp;جنيه</td></tr><tr><td height='29' colspan='15' style='border:1px solid #D4D8DD ;color:#28587D;' >
إجمالى بسعر التكلفة &nbsp;::&nbsp;10,455.00&nbsp;جنيه</td></tr><tr><td height='29' colspan='15' style='border:1px solid #D4D8DD ;color:#28587D;' >
الربح &nbsp;::&nbsp;4,845.00&nbsp;جنيه</td></tr><tr><td height='29' colspan='15' style='border:1px solid #D4D8DD ;color:#28587D;' >
الدرج &nbsp;::&nbsp;15,300.00&nbsp;جنيه</td></tr><tr><td height='29' colspan='15' style='border:1px solid #D4D8DD ;color:#28587D;' >
البنك &nbsp;::&nbsp;0.00&nbsp;جنيه</td></tr><tr><td height='29' colspan='15'  style='border:1px solid #D4D8DD ;'  ><center><a href='salez_report_ex.php?group_id=all&med_id=all&doc_id=all&d1=21&d2=22&m1=11&m2=11&y1=2026&y2=2026&state_id=all&tax_id=all&store_id=752&salesman_id=all'  ><b><font color='green' >Extract Excel File</font></b></a></center></td></tr></table><div id='kk' >
<span id="sp" ><center>
</center></span>
</div>
<div id="backgroundPopup"></div>
</center>
<script type="text/javascript">
var MenuBar1 = new Spry.Widget.MenuBar("MenuBar1", {imgDown:"SpryAsset/SpryMenuBarDownHover.gif", imgRight:"SpryAsset/SpryMenuBarRightHover.gif"});
swfobject.registerObject("FlashID");
</script>
</body>
</html>`;

// ==========================================
// 2. STORAGE MANAGER
// ==========================================
const STORAGE_KEY = 'sindbad_analyzer_settings_v2';
const defaultSettings = {
    username: '',
    rememberUsername: true,
    cutoffHour: 6,
    corsProxy: ''
};

const StorageManager = {
    load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return { ...defaultSettings };
            return { ...defaultSettings, ...JSON.parse(raw) };
        } catch (e) {
            return { ...defaultSettings };
        }
    },
    save(settings) {
        try {
            const current = this.load();
            const toSave = { ...current, ...settings };
            if (!toSave.rememberUsername) toSave.username = '';
            localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
            return true;
        } catch (e) {
            return false;
        }
    },
    clearUsername() {
        try {
            const settings = this.load();
            settings.username = '';
            settings.rememberUsername = false;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
            return true;
        } catch (e) {
            return false;
        }
    }
};

// ==========================================
// 3. SINDBAD HTML TABLE PARSER
// ==========================================
class SindbadParser {
    static parseNumber(str) {
        if (str === null || str === undefined) return 0;
        if (typeof str === 'number') return str;
        const cleaned = str.toString().replace(/[^\d.-]/g, '').trim();
        const num = parseFloat(cleaned);
        return isNaN(num) ? 0 : num;
    }

    /**
     * Parse Sindbad time format: 24h format followed by AM or PM
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
        if (!htmlText || typeof htmlText !== 'string' || htmlText.trim().length === 0) {
            const err = new Error('استجابة فارغة من خادم سندباد. يرجى التحقق من الجلسة وتسجيل الدخول.');
            err.isSessionExpired = true;
            throw err;
        }

        if (typeof NetworkManager !== 'undefined' && NetworkManager.isSessionExpiredHtml && NetworkManager.isSessionExpiredHtml(htmlText)) {
            const err = new Error('انتهت صلاحية جلسة تسجيل الدخول في سندباد (الكوكي غير صالح أو منتهي). يرجى تسجيل الدخول مجدداً لتجديد الكوكي.');
            err.isSessionExpired = true;
            throw err;
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        const isLoginPage = !!(
            doc.querySelector('input[type="password"]') ||
            (htmlText.includes('تسجيل الدخول') && (htmlText.includes('password') || htmlText.includes('username')))
        );
        if (isLoginPage) {
            const err = new Error('انتهت صلاحية جلسة تسجيل الدخول في سندباد (الكوكي منتهي). يرجى تسجيل الدخول مجدداً لتجديد الكوكي.');
            err.isSessionExpired = true;
            throw err;
        }

        const meta = this.extractMetadata(doc, htmlText);
        const { table, headers } = this.findSalesTable(doc);
        if (!table) {
            if (typeof NetworkManager !== 'undefined' && NetworkManager.isSessionExpiredHtml && (NetworkManager.isSessionExpiredHtml(htmlText) || !htmlText.includes('المبيعات'))) {
                const err = new Error('انتهت صلاحية جلسة تسجيل الدخول في سندباد (الكوكي غير صالح أو منتهي). يرجى تسجيل الدخول مجدداً لتجديد الكوكي.');
                err.isSessionExpired = true;
                throw err;
            }
            throw new Error('لم يتم العثور على جدول مبيعات سندباد في الكود المقدم. يرجى التأكد من استخراج تقرير المبيعات التفصيلي.');
        }

        const { items, summaryRow } = this.extractTableRows(table, headers);
        const summaryFooter = this.extractSummaryFooter(doc, summaryRow);

        const uniqueDates = [...new Set(items.map(i => i.date).filter(Boolean))];
        if (!meta.startDate && uniqueDates.length > 0) meta.startDate = uniqueDates[0];
        if (!meta.endDate && uniqueDates.length > 0) meta.endDate = uniqueDates[uniqueDates.length - 1];
        meta.uniqueDates = uniqueDates;

        return { isLoginPage: false, meta, headers, items, summaryRow, summary: summaryFooter };
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

        // 15-column default order from salez_report2.php:
        // # | التاريخ | الوقت | الفاتورة | الحركة | الصنف | الكود | الكمية | الوحدة | السعر | الخصم% | الاجمالى | التكلفة | الربح | الضريبة
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

            // Extract invoice number from inside <a> tag if present
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

// ==========================================
// 4. SHIFT ANALYZER & PARTITIONING
// ==========================================
const SHIFT_TABS = {
    ACTUAL_SHIFT: 'actual_shift',
    ALL_REPORT: 'all_report',
    DAY1_ONLY: 'day1_only',
    DAY2_DAWN: 'day2_dawn',
    DAY1_EXCLUDED: 'day1_excluded'
};

class ShiftAnalyzer {
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
                    // فواتير اليوم الأول بعد ساعة القطع + فواتير فجر اليوم الثاني قبل ساعة القطع
                    if (isDay1 && isAfterOrAtCutoff) return true;
                    if (isDay2 && isBeforeCutoff) return true;
                    return false;
                case SHIFT_TABS.ALL_REPORT:
                    return true;
                case SHIFT_TABS.DAY1_ONLY:
                    return isDay1;
                case SHIFT_TABS.DAY2_DAWN:
                    return isDay2 && isBeforeCutoff;
                case SHIFT_TABS.DAY1_EXCLUDED:
                    return isDay1 && isBeforeCutoff;
                default:
                    return true;
            }
        });
    }

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

    static aggregateByItem(filteredItems, totalShiftSales, totalShiftProfit) {
        const map = new Map();

        filteredItems.forEach(item => {
            const key = item.itemCode || item.itemName;
            if (!map.has(key)) {
                map.set(key, {
                    code: item.itemCode,
                    name: item.itemName,
                    orderCount: 0,
                    returnCount: 0,
                    soldQty: 0,
                    returnedQty: 0,
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

        result.sort((a, b) => b.totalSales - a.totalSales);
        return result;
    }

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

// ==========================================
// 5. ANOMALY DETECTOR & AUDIT ALERTS
// ==========================================
class AnomalyDetector {
    static detectAll(allItems, cutoffHour, dates) {
        return {
            priceDiscrepancies: this.detectPriceDiscrepancies(allItems),
            duplicateItemsInInvoice: this.detectDuplicateItemsInInvoice(allItems),
            lowMarginItems: this.detectLowMarginItems(allItems),
            previousShiftInvoices: this.detectPreviousShiftInvoices(allItems, cutoffHour, dates)
        };
    }

    /**
     * 1. Price discrepancies for same item code with 0% discount + lost variance calculation
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
                itemMap.set(code, { code: item.itemCode, name: item.itemName, occurrences: [] });
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
     * 4. Invoices recorded during Day 1 dawn (< cutoffHour)
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

// ==========================================
// 6. NETWORK MANAGER (MULTI-ENDPOINT FLOW)
// ==========================================
class NetworkManager {
    constructor(callbacks = {}) {
        this.onStatus = callbacks.onStatus || (() => {});
        this.onError = callbacks.onError || (() => {});
        this.onCorsBlocked = callbacks.onCorsBlocked || (() => {});
        this.corsProxy = '';
        this.lastCredentials = null;
        this.retryCount = 0;
        try {
            this.sessionCookie = localStorage.getItem('kabaka_sindbad_cookie') || '';
        } catch (_) {
            this.sessionCookie = '';
        }
    }

    getProxyHeaders(extraHeaders = {}) {
        const headers = { ...extraHeaders };
        if (this.sessionCookie) {
            headers['X-Sindbad-Cookie'] = this.sessionCookie;
        }
        return headers;
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

        // Try local proxy if running on localhost or via file://
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
                        if (data.cookie) {
                            this.sessionCookie = data.cookie;
                            try { localStorage.setItem('kabaka_sindbad_cookie', data.cookie); } catch (_) {}
                        }
                        return { success: true, method: 'local_proxy' };
                    } else {
                        throw new Error(data.message || 'فشل تسجيل الدخول في سندباد');
                    }
                }
            } catch (err) {
                console.warn('Local proxy login failed, attempting direct/CORS:', err);
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

    async fetchFiltersHTML() {
        if (await this.isLocalProxyAvailable()) {
            try {
                this.onStatus({ step: 3, message: 'جلب قوائم الفلاتر من منصة سندباد...' });
                const baseUrl = this.getProxyBaseUrl();
                const resp = await fetch(`${baseUrl}/api/filters`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: this.getProxyHeaders({
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                    })
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
                throw new Error(`استجاب خادم الفلاتر برمز خطأ (${resp.status})`);
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

    async fetchDrugsByGroup(groupId) {
        if (!groupId || groupId === 'all') return '';

        if (await this.isLocalProxyAvailable()) {
            try {
                const baseUrl = this.getProxyBaseUrl();
                const resp = await fetch(`${baseUrl}/api/drugs?q=${encodeURIComponent(groupId)}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: this.getProxyHeaders()
                });
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

    async fetchReportHTML(params) {
        if (await this.isLocalProxyAvailable()) {
            try {
                this.onStatus({ step: 4, message: 'إرسال طلب التقرير إلى salez_report2.php واستقبال المبيعات...' });
                const baseUrl = this.getProxyBaseUrl();
                const resp = await fetch(`${baseUrl}/api/report`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: this.getProxyHeaders({ 'Content-Type': 'application/json' }),
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
     * 6. Fetch Store Inventory / Items Report (POST medica_report2.php)
     */
    async fetchStoreInventory(params = {}) {
        const storeId = params.store_id || '752';
        const groupId = params.group_id || 'all';
        const importerId = params.importer_id || 'all';
        const stateId = params.state_id || '1';

        const useLocalProxy = await this.isLocalProxyAvailable();
        if (useLocalProxy) {
            try {
                const baseUrl = this.getProxyBaseUrl();
                this.onStatus({ step: 4, message: 'جلب أصناف ومخزون المحل عبر البروكسي المحلي...' });
                const resp = await fetch(`${baseUrl}/api/inventory`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: this.getProxyHeaders({ 'Content-Type': 'application/json' }),
                    body: JSON.stringify({
                        store_id: storeId,
                        group_id: groupId,
                        importer_id: importerId,
                        state_id: stateId
                    })
                });
                if (resp.ok) {
                    return await resp.text();
                }
            } catch (e) {
                console.warn('Local proxy inventory fetch failed, trying direct/CORS proxy:', e);
            }
        }

        // Direct or CORS Proxy
        const url = this.formatUrl('https://siindbad.com/sys/app/medica_report2.php');
        const postBody = new URLSearchParams();
        postBody.append('store_id', storeId);
        postBody.append('group_id', groupId);
        postBody.append('importer_id', importerId);
        postBody.append('state_id', stateId);
        postBody.append('submit', 'إرسال');

        try {
            this.onStatus({ step: 4, message: 'إرسال طلب مخزون الأصناف إلى medica_report2.php...' });
            const resp = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                },
                body: postBody.toString()
            });

            const html = await resp.text();
            if (html.includes('تسجيل الدخول') && html.includes('password')) {
                throw new Error('انتهت جلسة تسجيل الدخول. يرجى إعادة تسجيل الدخول.');
            }
            return html;
        } catch (err) {
            this._handleCorsOrNetworkError(err, 'فشل جلب أصناف ومخزون المحل من منصة سندباد.');
            throw err;
        }
    }

    static parseFiltersHTML(htmlText) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        const extractOptions = (selector, fallbackDefault = 'all') => {
            let select = doc.querySelector(selector);
            if (!select) {
                const cleanName = selector.replace(/[^a-zA-Z0-9_]/g, '');
                select = doc.querySelector(`select[id="${cleanName}"]`) || doc.querySelector(`select[name*="${cleanName}"]`);
            }
            if (!select) return { options: [{ value: 'all', text: 'الكل' }], selectedValue: fallbackDefault };

            const options = Array.from(select.querySelectorAll('option')).map(opt => ({
                value: opt.value.trim(),
                text: opt.textContent.trim(),
                selected: opt.hasAttribute('selected')
            })).filter(opt => opt.value !== '' || opt.text !== 'إختر');

            if (options.length === 0) {
                options.push({ value: 'all', text: 'الكل' });
            }

            const selectedOpt = options.find(o => o.selected) || options[0];
            let val = selectedOpt ? selectedOpt.value : fallbackDefault;
            if (!val || val === '') val = fallbackDefault;

            return {
                options,
                selectedValue: val
            };
        };

        const storeData = extractOptions('select[name="store_id"], #store_id', '752');
        const docData = extractOptions('select[name="doc_id"], #doc_id', 'all');
        const salesmanData = extractOptions('select[name="salesman_id"], #salesman_id', 'all');
        const groupData = extractOptions('select[name="group_id"], #group_id', 'all');
        const medData = extractOptions('select[name="med_id"], #med_id', 'all');
        const stateData = extractOptions('select[name="state_id"], #state_id', 'all');
        const taxData = extractOptions('select[name="tax_id"], #tax_id', 'all');

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

    static parseDrugsHTML(htmlText) {
        if (!htmlText) return [{ value: 'all', text: 'كل الأصناف' }];
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        const options = Array.from(doc.querySelectorAll('option')).map(opt => ({
            value: opt.value.trim(),
            text: opt.textContent.trim()
        }));

        if (options.length === 0) return [{ value: 'all', text: 'كل الأصناف' }];
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

// ==========================================
// 6.5 INVENTORY PARSER & DEMAND ANALYZER
// ==========================================
class InventoryParser {
    static parse(htmlText) {
        if (!htmlText || typeof htmlText !== 'string') {
            return { items: [], meta: { title: 'مخزون فرع KABAKA (752)', count: 0, totalSalesValue: 0, totalCostValue: 0 } };
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const rows = Array.from(doc.querySelectorAll('table tr'));

        const cleanText = (el) => el ? el.textContent.replace(/\u00a0/g, ' ').trim() : '';
        const parseNum = (str) => {
            if (!str) return 0;
            const cleaned = str.replace(/[^\d.-]/g, '');
            const val = parseFloat(cleaned);
            return isNaN(val) ? 0 : val;
        };

        const items = [];
        let totalSalesValue = 0;
        let totalCostValue = 0;

        for (const row of rows) {
            const cells = Array.from(row.querySelectorAll('td'));
            if (cells.length < 9) continue;

            const firstCellText = cleanText(cells[0]);
            const secondCellText = cleanText(cells[1]);
            if (firstCellText === '#' || secondCellText === 'الصنف' || firstCellText.includes('الاجمالى') || secondCellText.includes('الاجمالى') || firstCellText.includes('الأصناف')) {
                continue;
            }

            const seq = parseInt(firstCellText, 10);
            if (isNaN(seq)) continue;

            const nameLink = cells[1].querySelector('a');
            const name = nameLink ? cleanText(nameLink) : cleanText(cells[1]);
            let medId = '';
            if (nameLink && nameLink.getAttribute('href')) {
                const m = nameLink.getAttribute('href').match(/med_id=(\d+)/);
                if (m) medId = m[1];
            }

            const code = cleanText(cells[2]);
            const group = cleanText(cells[3]);
            const reorderLimit = parseNum(cleanText(cells[4]));
            const stock = parseNum(cleanText(cells[5]));
            const unit = cleanText(cells[6]);
            const price = parseNum(cleanText(cells[7]));
            const total = parseNum(cleanText(cells[8]));
            const cost = parseNum(cleanText(cells[9]));

            const rowBg = row.getAttribute('bgcolor') || '';
            const isSindbadShortageAlert = rowBg.toLowerCase().includes('f785af');

            totalSalesValue += total;
            totalCostValue += cost;

            items.push({
                seq,
                medId,
                name,
                code,
                group,
                reorderLimit,
                stock,
                unit,
                price,
                total,
                cost,
                unitCost: stock > 0 ? (cost / stock) : (cost > 0 ? cost : price * 0.6),
                isSindbadShortageAlert
            });
        }

        return {
            items,
            meta: {
                title: 'مخزون فرع KABAKA (752)',
                count: items.length,
                totalSalesValue,
                totalCostValue
            }
        };
    }
}

class InventoryDemandAnalyzer {
    static analyze(inventoryItems = [], salesItemsAggregated = []) {
        const salesByCode = new Map();
        const salesByName = new Map();

        const normalize = (s) => (s || '').trim().toLowerCase().replace(/\s+/g, ' ');

        (salesItemsAggregated || []).forEach(s => {
            const codeKey = (s.code || '').trim();
            if (codeKey) salesByCode.set(codeKey, s);
            const nameKey = normalize(s.name);
            if (nameKey) salesByName.set(nameKey, s);
        });

        const analyzed = inventoryItems.map(inv => {
            const soldRecord = salesByCode.get(inv.code.trim()) || salesByName.get(normalize(inv.name));
            const soldQty = soldRecord ? (Number(soldRecord.totalQty) || 0) : 0;
            const soldCount = soldRecord ? (Number(soldRecord.saleCount) || 0) : 0;
            const totalSales = soldRecord ? (Number(soldRecord.totalSales) || 0) : 0;
            const totalProfit = soldRecord ? (Number(soldRecord.totalProfit) || 0) : 0;

            const stock = Number(inv.stock) || 0;
            const limit = Number(inv.reorderLimit) || 0;

            let urgency = 'NORMAL';
            let urgencyLabel = 'رصيد كافي بالمحل';
            let urgencyBadge = 'bg-slate-100 text-slate-700';
            let needsReorder = false;

            if (soldQty > 0 && stock <= 1) {
                urgency = 'CRITICAL';
                urgencyLabel = '🔥 عاجل جداً: نفد/وشيك وعليه طلب!';
                urgencyBadge = 'bg-rose-600 text-white font-black animate-pulse';
                needsReorder = true;
            } else if (limit > 0 && stock <= limit && soldQty > 0) {
                urgency = 'CRITICAL';
                urgencyLabel = '🔥 حرج: تحت حد النواقص ومطلوب!';
                urgencyBadge = 'bg-rose-500 text-white font-bold';
                needsReorder = true;
            } else if (soldQty > 0 && stock <= 3) {
                urgency = 'HIGH';
                urgencyLabel = '⚡ مطلوب: مخزون منخفض وسحب سريع';
                urgencyBadge = 'bg-amber-500 text-white font-bold';
                needsReorder = true;
            } else if (limit > 0 && stock <= limit) {
                urgency = 'MEDIUM';
                urgencyLabel = '⚠️ تحت حد النواقص بالسيستم';
                urgencyBadge = 'bg-amber-100 text-amber-900 border border-amber-300 font-bold';
                needsReorder = true;
            } else if (soldQty > 0 && stock <= soldQty * 1.5) {
                urgency = 'HIGH';
                urgencyLabel = '⚡ يغطي يوماً واحداً فقط';
                urgencyBadge = 'bg-blue-100 text-blue-900 font-bold';
                needsReorder = true;
            }

            let suggestedQty = 0;
            if (needsReorder) {
                if (limit > 0 && stock < limit) {
                    suggestedQty = (limit - stock) + (soldQty > 0 ? soldQty * 2 : 0);
                } else if (stock <= 1) {
                    suggestedQty = Math.max(soldQty * 3, 5);
                } else if (stock <= 3) {
                    suggestedQty = Math.max(soldQty * 2, 3);
                } else {
                    suggestedQty = Math.max(soldQty * 2, 3);
                }
            }

            const estimatedCost = suggestedQty * (inv.unitCost || (inv.price * 0.6));

            return {
                ...inv,
                soldQty,
                soldCount,
                totalSales,
                totalProfit,
                urgency,
                urgencyLabel,
                urgencyBadge,
                needsReorder,
                suggestedQty,
                estimatedCost
            };
        });

        // Match sold items that were missing from inventory (Zero-stock items)
        const matchedCodes = new Set(inventoryItems.map(i => i.code.trim()));
        (salesItemsAggregated || []).forEach(s => {
            const codeKey = (s.code || '').trim();
            if (codeKey && !matchedCodes.has(codeKey)) {
                const soldQty = Number(s.totalQty) || 1;
                const price = Number(s.avgPrice) || (s.totalSales / soldQty);
                const unitCost = Number(s.avgCost) || (price * 0.6);
                const suggestedQty = Math.max(soldQty * 3, 5);
                analyzed.unshift({
                    seq: 0,
                    medId: '',
                    name: s.name,
                    code: s.code,
                    group: 'صنف مباع غير مدرج بالمخزون',
                    reorderLimit: 0,
                    stock: 0,
                    unit: 'وحدة',
                    price: price,
                    total: 0,
                    cost: 0,
                    unitCost: unitCost,
                    isSindbadShortageAlert: true,
                    soldQty,
                    soldCount: s.saleCount || 1,
                    totalSales: s.totalSales,
                    totalProfit: s.totalProfit,
                    urgency: 'CRITICAL',
                    urgencyLabel: '🔥 نفد تماماً (رصيد صفر) وعليه طلب!',
                    urgencyBadge: 'bg-rose-700 text-white font-black animate-pulse',
                    needsReorder: true,
                    suggestedQty,
                    estimatedCost: suggestedQty * unitCost
                });
            }
        });

        const urgentItems = analyzed.filter(i => i.urgency === 'CRITICAL' || (i.urgency === 'HIGH' && i.soldQty > 0));
        const shortageLimitItems = analyzed.filter(i => i.reorderLimit > 0 && i.stock <= i.reorderLimit);
        const totalSuggestedUnits = urgentItems.reduce((sum, i) => sum + i.suggestedQty, 0);
        const totalEstimatedRestockCost = urgentItems.reduce((sum, i) => sum + i.estimatedCost, 0);

        return {
            items: analyzed,
            urgentItems,
            shortageLimitItems,
            totalSuggestedUnits,
            totalEstimatedRestockCost
        };
    }
}

// ==========================================
// 6.6 RETAIL OPERATIONS RESEARCH & MULTI-CATEGORY PROCUREMENT ENGINE
// ==========================================
class PurchasePlanningEngine {
    static get DEFAULT_CAPITAL() {
        return 168000;
    }

    static get NINJA_BUDGET() {
        return 20000;
    }

    static get REMAINING_CAPITAL() {
        return 148000;
    }

    static safeNum(v, fallback = 0) {
        if (v === null || v === undefined) return fallback;
        const n = Number(v);
        return isNaN(n) || !isFinite(n) ? fallback : n;
    }

    static get CATEGORIES() {
        return {
            NINJA_TRACKSUIT: {
                key: 'NINJA_TRACKSUIT',
                name: 'ترينج شتوي ننجا 4 / 2 (سقف 20 ألف ج)',
                shortName: 'ترنج ننجا',
                icon: '🥷',
                packSize: 4, // السري 4 قطع (L, XL, 2XL, 3XL)
                packLabel: 'سِري 4 قطع (L إلى 3XL)',
                sizesLabel: 'L, XL, 2XL, 3XL',
                avgCost: 550, // تكلفة الفاتورة الحقيقية كود 634
                avgPrice: 750, // سعر بيع الوردية الحقيقي (وفي الجرد 1,300)
                isDedicatedNinja: true,
                fixedBudget: 20000,
                priorityRank: 1,
                keywords: ['ترينج شتوي ننجا', 'ترنج شتوي ننجا', 'ترنج ننجا', 'ترينج ننجا', 'ننجا'],
                modelsCited: 'ترينج شتوي ننجا 4 (كود 634)، ترينج شتوي ننجا 2 (كود 600)'
            },
            JEANS: {
                key: 'JEANS',
                name: 'بناطيل جينز واسترس وباجي ووايد ليج',
                shortName: 'جينز',
                icon: '👖',
                packSize: 5, // السري خماسي (30, 32, 34, 36, 38)
                packLabel: 'سِري 5 قطع (30 إلى 38)',
                sizesLabel: '30, 32, 34, 36, 38',
                avgCost: 650, // متوسط تكلفة الجينز بالمحل (400 - 730 ج)
                avgPrice: 1250, // متوسط بيع الجينز بالمحل (900 - 1450 ج)
                wednesdayDropPct: 1.0, // الأربعاء هو يوم الجينز الأساسي فرشة كاملة
                priorityRank: 1,
                keywords: ['جينز', 'جينس', 'ج س', 'وايد ليج', 'وايت ليج', 'jeans', 'denim', 'pant'],
                modelsCited: 'بنطلون ج س VERSUS، جناح، ديب، قنديل، نحله، وايد ليج كاب'
            },
            TSHIRTS_HOODIES: {
                key: 'TSHIRTS_HOODIES',
                name: 'تيشرتات شتوي وياقة فرو وسويت شيرت',
                shortName: 'تيشرت شتوي / ياقة فرو',
                icon: '👕',
                packSize: 4, // السري 4 قطع (M, L, XL, 2XL)
                packLabel: 'سِري 4 قطع (M إلى 2XL)',
                sizesLabel: 'M, L, XL, 2XL',
                avgCost: 500, // متوسط تكلفة التيشرت بالمحل (400 - 670 ج)
                avgPrice: 800, // متوسط البيع (750 - 900 ج)
                wednesdayDropPct: 0.75,
                priorityRank: 2,
                keywords: ['تيشرت', 'تشرت', 'فرو', 'ياقه فرو', 'سويت شيرت', 'هودي', 'بلوفر', 'فالنتينو', 'veneri', 'كاتش'],
                modelsCited: 'تيشرت ياقه فرو، تيشرت شتوي فالنتينو موس، VENERI، كاتش نجمه'
            },
            SUITS_TRACKSUITS: {
                key: 'SUITS_TRACKSUITS',
                name: 'بدل شتوي كاملة وأطقم تيم 3 وبراندات',
                shortName: 'بدل شتوي / أطقم كاملة',
                icon: '🧥',
                packSize: 3, // السري 3 أطقم كاملة
                packLabel: 'سِري 3 أطقم كاملة (L, XL, 2XL)',
                sizesLabel: 'L, XL, 2XL',
                avgCost: 1150, // تكلفة البدلة التيم 3 بالمحل (1100 - 1180 ج)
                avgPrice: 1850, // سعر بيع البدلة (1600 - 2100 ج)
                wednesdayDropPct: 0.50,
                priorityRank: 2,
                keywords: ['بدله', 'بدلة', 'تيم 3', 'team3', 'طقم كامل', 'ترنج شتوي lv', 'ترنج', 'ترينج'],
                modelsCited: 'بدله شتوي تيم 3 دبور، TEAM3 مضلع، ترنج شتوي LV قصات'
            },
            SWEATPANTS: {
                key: 'SWEATPANTS',
                name: 'شراويل ميلتون وسويت بانتس وجوكر',
                shortName: 'شروال ميلتون',
                icon: '🩳',
                packSize: 4, // السري 4 قطع
                packLabel: 'سِري 4 قطع (M إلى 2XL)',
                sizesLabel: 'M, L, XL, 2XL',
                avgCost: 410, // تكلفة شروال ميلتون SH03
                avgPrice: 600, // سعر بيع شروال ميلتون
                wednesdayDropPct: 0.50,
                priorityRank: 3,
                keywords: ['شروال', 'ميلتون', 'سويت بانتس', 'ترينج بانتس', 'sh03'],
                modelsCited: 'شروال ميلتون SH03'
            }
        };
    }

    static classifyItem(name = '', group = '') {
        const text = `${name || ''} ${group || ''}`.toLowerCase();
        if (text.includes('ننجا') || text.includes('ninja')) {
            return 'NINJA_TRACKSUIT';
        }
        if (['جينز', 'جينس', 'ج س', 'وايد ليج', 'وايت ليج', 'jeans', 'denim', 'pant'].some(kw => text.includes(kw))) {
            return 'JEANS';
        }
        if (['بدله', 'بدلة', 'تيم 3', 'team3', 'lv قصات', 'طقم كامل'].some(kw => text.includes(kw))) {
            return 'SUITS_TRACKSUITS';
        }
        if (['شروال', 'ميلتون', 'سويت بانتس', 'sh03', 'jogger'].some(kw => text.includes(kw))) {
            return 'SWEATPANTS';
        }
        if (['تيشرت', 'تشرت', 'قميص', 'فرو', 'ياقه', 'سويت شيرت', 'هودي', 'بلوفر', 'فالنتينو', 'veneri', 'كاتش', 'اندر شيرت'].some(kw => text.includes(kw))) {
            return 'TSHIRTS_HOODIES';
        }
        if (['ترنج', 'ترينج', 'طقم'].some(kw => text.includes(kw))) {
            return 'SUITS_TRACKSUITS';
        }
        return 'JEANS';
    }

    static getThursdayCycleRange(baseDateStr) {
        let base = baseDateStr ? new Date(baseDateStr) : new Date();
        if (isNaN(base.getTime())) base = new Date();

        const day = base.getDay();
        let diff = (day - 4 + 7) % 7;
        if (diff === 0) diff = 7;

        const start = new Date(base);
        start.setDate(base.getDate() - diff);
        start.setHours(0, 0, 0, 0);

        const end = new Date(base);
        end.setHours(23, 59, 59, 999);

        const cycleDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
        const fmt = (d) => `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;

        return {
            startDate: start,
            endDate: end,
            startDateStr: fmt(start),
            endDateStr: fmt(end),
            cycleDays,
            d1: start.getDate(),
            m1: start.getMonth() + 1,
            y1: start.getFullYear(),
            d2: end.getDate(),
            m2: end.getMonth() + 1,
            y2: end.getFullYear()
        };
    }

    static generatePlan({ salesItems = [], inventoryItems = [], cycleDays = 7, totalStoreCapital = 168000, availableCash = null }) {
        const safeNum = PurchasePlanningEngine.safeNum;
        const effectiveCapital = safeNum(totalStoreCapital, 168000) > 0 ? safeNum(totalStoreCapital, 168000) : 168000;
        const effectiveDays = Math.max(1, safeNum(cycleDays, 7));
        const catsSpec = this.CATEGORIES;

        const catStats = {};
        for (const [key, spec] of Object.entries(catsSpec)) {
            catStats[key] = {
                ...spec,
                soldQty: 0,
                salesRevenue: 0,
                salesCost: 0,
                salesProfit: 0,
                stockUnits: 0,
                stockCost: 0,
                stockValue: 0
            };
        }

        let totalSoldQty = 0;
        let totalSalesRevenue = 0;
        let totalSalesCost = 0;
        let totalSalesProfit = 0;
        const rawSoldItemsMap = new Map();

        if (Array.isArray(salesItems) && salesItems.length > 0) {
            salesItems.forEach(item => {
                const qty = safeNum(item.quantity || item.totalQty, 0);
                const net = safeNum(item.net || item.totalSales, 0);
                const cost = safeNum(item.cost || item.totalCost, 0);
                const profit = safeNum(item.profit || item.totalProfit, 0);

                totalSoldQty += qty;
                totalSalesRevenue += net;
                totalSalesCost += cost;
                totalSalesProfit += profit;

                const name = item.name || item.itemName || 'صنف غير محدد';
                const catKey = this.classifyItem(name, item.group);
                if (catStats[catKey]) {
                    catStats[catKey].soldQty += qty;
                    catStats[catKey].salesRevenue += net;
                    catStats[catKey].salesCost += cost;
                    catStats[catKey].salesProfit += profit;
                }

                const itemKey = `${item.code || ''}_${name.trim()}`;
                if (!rawSoldItemsMap.has(itemKey)) {
                    rawSoldItemsMap.set(itemKey, {
                        name,
                        code: item.code || '-',
                        group: item.group || (catStats[catKey] ? catStats[catKey].shortName : ''),
                        catKey,
                        soldQty: 0,
                        totalNet: 0,
                        totalCost: 0,
                        totalProfit: 0
                    });
                }
                const entry = rawSoldItemsMap.get(itemKey);
                entry.soldQty += qty;
                entry.totalNet += net;
                entry.totalCost += cost;
                entry.totalProfit += profit;
            });
        }

        // Inventory aggregation from medica_report2.php or fallback
        let totalStockUnits = 0;
        let totalStockCost = 0;
        let totalStockValue = 0;

        if (Array.isArray(inventoryItems) && inventoryItems.length > 0) {
            inventoryItems.forEach(inv => {
                const stock = safeNum(inv.stock, 0);
                const cost = safeNum(inv.cost, 0);
                const val = safeNum(inv.total, stock * safeNum(inv.price, 0));

                totalStockUnits += stock;
                totalStockCost += cost;
                totalStockValue += val;

                const catKey = this.classifyItem(inv.name, inv.group);
                if (catStats[catKey]) {
                    catStats[catKey].stockUnits += stock;
                    catStats[catKey].stockCost += cost;
                    catStats[catKey].stockValue += val;
                }
            });
        }

        // Store baseline defaults from KABAKA data if inventory not loaded yet
        if (totalStockCost === 0) {
            totalStockUnits = 295;
            totalStockCost = 149780;
            totalStockValue = 351400;

            catStats.NINJA_TRACKSUIT.stockUnits = 23;
            catStats.NINJA_TRACKSUIT.stockCost = 12500;
            catStats.NINJA_TRACKSUIT.stockValue = 29900;

            catStats.JEANS.stockUnits = 52;
            catStats.JEANS.stockCost = 33800;
            catStats.JEANS.stockValue = 65000;

            catStats.TSHIRTS_HOODIES.stockUnits = 74;
            catStats.TSHIRTS_HOODIES.stockCost = 37000;
            catStats.TSHIRTS_HOODIES.stockValue = 59200;

            catStats.SUITS_TRACKSUITS.stockUnits = 19;
            catStats.SUITS_TRACKSUITS.stockCost = 21850;
            catStats.SUITS_TRACKSUITS.stockValue = 35150;

            catStats.SWEATPANTS.stockUnits = 8;
            catStats.SWEATPANTS.stockCost = 3280;
            catStats.SWEATPANTS.stockValue = 4800;
        }

        // Baseline sales if not loaded yet
        if (totalSoldQty === 0) {
            totalSoldQty = 45;
            totalSalesRevenue = 41250;
            totalSalesCost = 25800;
            totalSalesProfit = 15450;

            catStats.JEANS.soldQty = 20;
            catStats.JEANS.salesRevenue = 24000;
            catStats.JEANS.salesCost = 13000;
            catStats.JEANS.salesProfit = 11000;

            catStats.TSHIRTS_HOODIES.soldQty = 12;
            catStats.TSHIRTS_HOODIES.salesRevenue = 9600;
            catStats.TSHIRTS_HOODIES.salesCost = 6000;
            catStats.TSHIRTS_HOODIES.salesProfit = 3600;

            catStats.NINJA_TRACKSUIT.soldQty = 6;
            catStats.NINJA_TRACKSUIT.salesRevenue = 4500;
            catStats.NINJA_TRACKSUIT.salesCost = 3300;
            catStats.NINJA_TRACKSUIT.salesProfit = 1200;

            catStats.SUITS_TRACKSUITS.soldQty = 3;
            catStats.SUITS_TRACKSUITS.salesRevenue = 5550;
            catStats.SUITS_TRACKSUITS.salesCost = 3450;
            catStats.SUITS_TRACKSUITS.salesProfit = 2100;

            catStats.SWEATPANTS.soldQty = 4;
            catStats.SWEATPANTS.salesRevenue = 2400;
            catStats.SWEATPANTS.salesCost = 1640;
            catStats.SWEATPANTS.salesProfit = 760;
        }

        // =========================================================================
        // 1. RECONCILIATION: TOTAL CAPITAL (168k) MINUS INVENTORY COST = CASH ON HAND
        // =========================================================================
        const ninjaStockCost = safeNum(catStats.NINJA_TRACKSUIT.stockCost, 12500);
        const ninjaStockUnits = safeNum(catStats.NINJA_TRACKSUIT.stockUnits, 23);
        const ninjaTotalCeiling = 20000;
        const ninjaRemainingCeiling = Math.max(0, ninjaTotalCeiling - ninjaStockCost); // 20,000 - 12,500 = 7,500 EGP
        const ninjaPackCost = 4 * 550; // 2,200 EGP per series of 4

        // Exact Ninja series to buy with the rest of the 20,000 EGP:
        const ninjaAllocatedSeries = Math.floor(ninjaRemainingCeiling / ninjaPackCost); // 3 series
        const ninjaAllocatedUnits = ninjaAllocatedSeries * 4; // 12 units
        const ninjaAllocatedCost = ninjaAllocatedUnits * 550; // 6,600 EGP
        const ninjaBuffer = ninjaRemainingCeiling - ninjaAllocatedCost; // 900 EGP buffer

        // Rest of the store:
        const restCapital = Math.max(0, effectiveCapital - ninjaTotalCeiling); // 168,000 - 20,000 = 148,000 EGP
        const restStockCost = Math.max(0, totalStockCost - ninjaStockCost); // 149,780 - 12,500 = 137,280 EGP
        const restCashAvailable = Math.max(0, restCapital - restStockCost); // 148,000 - 137,280 = 10,720 EGP

        // Total cash available to go down and buy (الفلوس اللي معايا دلوقتي):
        const autoAvailableCash = Math.max(0, effectiveCapital - totalStockCost); // 168,000 - 149,780 = 18,220 EGP
        const targetRestCash = (availableCash !== null && availableCash !== undefined) ? 
            Math.max(0, safeNum(availableCash, autoAvailableCash) - ninjaAllocatedCost) : restCashAvailable;

        // =========================================================================
        // 2. KNAPSACK ALLOCATION FOR REST OF STORE: DRIVEN BY ACTUAL SALES THIS WEEK
        // =========================================================================
        let remainingCashForRest = targetRestCash;
        const otherKeys = ['JEANS', 'TSHIRTS_HOODIES', 'SUITS_TRACKSUITS', 'SWEATPANTS'];
        const otherSoldTotal = otherKeys.reduce((sum, k) => sum + catStats[k].soldQty, 0);

        const demandWeights = {};
        const defaultWeights = { JEANS: 0.50, TSHIRTS_HOODIES: 0.25, SUITS_TRACKSUITS: 0.15, SWEATPANTS: 0.10 };

        otherKeys.forEach(k => {
            if (otherSoldTotal > 0 && catStats[k].soldQty > 0) {
                demandWeights[k] = catStats[k].soldQty / otherSoldTotal;
            } else {
                demandWeights[k] = defaultWeights[k];
            }
        });

        const seriesCost = {};
        otherKeys.forEach(k => {
            const st = catStats[k];
            seriesCost[k] = st.packSize * safeNum(st.avgCost, 500);
        });

        const allocatedSeries = {
            NINJA_TRACKSUIT: ninjaAllocatedSeries,
            JEANS: 0,
            TSHIRTS_HOODIES: 0,
            SUITS_TRACKSUITS: 0,
            SWEATPANTS: 0
        };

        // Seed: If cash allows, give at least 1 series to JEANS (Wednesday is Jeans Day)
        if (remainingCashForRest >= seriesCost.JEANS) {
            allocatedSeries.JEANS += 1;
            remainingCashForRest -= seriesCost.JEANS;
        }

        // Greedy Knapsack loop: iteratively allocate complete series
        let knapsackGuard = 0;
        while (knapsackGuard < 120) {
            knapsackGuard++;
            let bestCat = null;
            let lowestFulfillment = Infinity;

            for (const k of otherKeys) {
                if (remainingCashForRest >= seriesCost[k]) {
                    const currentCost = allocatedSeries[k] * seriesCost[k];
                    const targetCost = demandWeights[k] * targetRestCash;
                    const fulfillmentRatio = targetCost > 0 ? (currentCost / targetCost) : currentCost;

                    if (fulfillmentRatio < lowestFulfillment) {
                        lowestFulfillment = fulfillmentRatio;
                        bestCat = k;
                    }
                }
            }

            if (!bestCat) break;

            allocatedSeries[bestCat] += 1;
            remainingCashForRest -= seriesCost[bestCat];
        }

        const bufferCash = remainingCashForRest + ninjaBuffer;

        // 3. Build Category Results with Wednesday/Thursday Split
        const categoriesResult = [];
        let totalRecommendedSeries = 0;
        let totalRecommendedUnits = 0;
        let totalEstimatedCost = 0;
        let wednesdaySeriesTotal = 0;
        let wednesdayUnitsTotal = 0;
        let wednesdayCostTotal = 0;
        let thursdaySeriesTotal = 0;
        let thursdayUnitsTotal = 0;
        let thursdayCostTotal = 0;

        for (const [key, st] of Object.entries(catStats)) {
            const sold = safeNum(st.soldQty, 0);
            const dailyRate = Math.max(0.1, sold > 0 ? (sold / effectiveDays) : (st.stockUnits > 0 ? (st.stockUnits / 14) : 1));
            const daysOfSupply = st.stockUnits > 0 ? (st.stockUnits / Math.max(0.1, dailyRate)) : 0;

            const idealSeries = allocatedSeries[key] || 0;
            const totalUnits = idealSeries * st.packSize;
            const unitCost = key === 'NINJA_TRACKSUIT' ? 550 : safeNum(st.avgCost, 500);
            const categoryCost = totalUnits * unitCost;

            let wedSeries = 0;
            let thuSeries = 0;

            if (key === 'JEANS') {
                // 100% of Jeans drop on Wednesday
                wedSeries = idealSeries;
                thuSeries = 0;
            } else if (key === 'NINJA_TRACKSUIT') {
                wedSeries = Math.ceil(idealSeries * 0.65);
                thuSeries = idealSeries - wedSeries;
            } else if (key === 'TSHIRTS_HOODIES') {
                wedSeries = Math.ceil(idealSeries * 0.65);
                thuSeries = idealSeries - wedSeries;
            } else if (key === 'SUITS_TRACKSUITS') {
                wedSeries = Math.floor(idealSeries * 0.50);
                thuSeries = idealSeries - wedSeries;
            } else if (key === 'SWEATPANTS') {
                wedSeries = Math.ceil(idealSeries * 0.50);
                thuSeries = idealSeries - wedSeries;
            }

            const wedUnits = wedSeries * st.packSize;
            const thuUnits = thuSeries * st.packSize;
            const wedCost = wedUnits * unitCost;
            const thuCost = thuUnits * unitCost;

            totalRecommendedSeries += idealSeries;
            totalRecommendedUnits += totalUnits;
            totalEstimatedCost += categoryCost;
            wednesdaySeriesTotal += wedSeries;
            wednesdayUnitsTotal += wedUnits;
            wednesdayCostTotal += wedCost;
            thursdaySeriesTotal += thuSeries;
            thursdayUnitsTotal += thuUnits;
            thursdayCostTotal += thuCost;

            let priorityLabel = 'متوازنة';
            let priorityBadgeClass = 'bg-blue-100 text-blue-800';
            if (key === 'NINJA_TRACKSUIT') {
                priorityLabel = `تزويد باقي سقف الـ 20 ألف (${ninjaAllocatedSeries} سيريهات)`;
                priorityBadgeClass = 'bg-amber-200 text-amber-950 font-black';
            } else if (key === 'JEANS') {
                priorityLabel = 'أساسية (فرشة الأربعاء الكبرى)';
                priorityBadgeClass = 'bg-rose-100 text-rose-800 font-bold';
            } else if (key === 'TSHIRTS_HOODIES') {
                priorityLabel = 'سريعة الدوران';
                priorityBadgeClass = 'bg-amber-100 text-amber-800 font-bold';
            }

            const marginPct = Math.round(((st.avgPrice - unitCost) / Math.max(1, st.avgPrice)) * 100);
            const priorityIndex = key === 'NINJA_TRACKSUIT' ? 999 : ((dailyRate * (marginPct / 100)) / Math.max(0.8, daysOfSupply));

            categoriesResult.push({
                key,
                name: st.name,
                shortName: st.shortName,
                icon: st.icon,
                packSize: st.packSize,
                packLabel: st.packLabel,
                sizesLabel: st.sizesLabel,
                dailyRate: Math.round(dailyRate * 10) / 10,
                stockUnits: safeNum(st.stockUnits, 0),
                stockCost: safeNum(st.stockCost, 0),
                soldQty: sold,
                daysOfSupply: Math.round(daysOfSupply * 10) / 10,
                recommendedSeries: idealSeries,
                totalUnits,
                unitCost,
                avgPrice: st.avgPrice,
                categoryCost,
                wednesdaySeries: wedSeries,
                wednesdayUnits: wedUnits,
                wednesdayCost: wedCost,
                thursdaySeries: thuSeries,
                thursdayUnits: thuUnits,
                thursdayCost: thuCost,
                priorityLabel,
                priorityBadgeClass,
                priorityIndex,
                modelsCited: st.modelsCited || '',
                isDedicatedNinja: !!st.isDedicatedNinja,
                remainingNinjaBudget: key === 'NINJA_TRACKSUIT' ? ninjaRemainingCeiling : 0,
                ninjaBuffer: key === 'NINJA_TRACKSUIT' ? ninjaBuffer : 0
            });
        }

        categoriesResult.sort((a, b) => {
            if (a.isDedicatedNinja) return -1;
            if (b.isDedicatedNinja) return 1;
            return b.priorityIndex - a.priorityIndex;
        });

        // Detailed Top Sold Items
        const topSoldItems = [];
        if (rawSoldItemsMap.size > 0) {
            const sortedEntries = Array.from(rawSoldItemsMap.values()).sort((a, b) => b.soldQty - a.soldQty);
            sortedEntries.forEach(entry => {
                const catSpec = catsSpec[entry.catKey] || catsSpec.JEANS;
                const pSize = catSpec.packSize;
                const uCost = entry.totalCost > 0 && entry.soldQty > 0 ? Math.round(entry.totalCost / entry.soldQty) : catSpec.avgCost;
                const uPrice = entry.totalNet > 0 && entry.soldQty > 0 ? Math.round(entry.totalNet / entry.soldQty) : catSpec.avgPrice;
                const suggestedSeries = Math.max(1, Math.round(entry.soldQty / pSize));
                const suggestedUnits = suggestedSeries * pSize;
                const suggestedCost = suggestedUnits * uCost;

                topSoldItems.push({
                    name: entry.name,
                    code: entry.code,
                    group: entry.group,
                    catKey: entry.catKey,
                    soldQty: entry.soldQty,
                    unitCost: uCost,
                    unitPrice: uPrice,
                    packSize: pSize,
                    sizesLabel: catSpec.sizesLabel,
                    suggestedSeries,
                    suggestedUnits,
                    suggestedCost,
                    dropDay: entry.catKey === 'JEANS' ? 'الأربعاء (فرشة كاملة)' : (entry.catKey === 'SUITS_TRACKSUITS' ? 'الخميس (ويك إند)' : 'الأربعاء والخميس')
                });
            });
        }

        const expectedRevenue = categoriesResult.reduce((sum, c) => sum + (c.totalUnits * c.avgPrice), 0);
        const expectedProfit = expectedRevenue - totalEstimatedCost;
        const restPlannedCost = totalEstimatedCost - ninjaAllocatedCost;
        const restSeriesCount = totalRecommendedSeries - ninjaAllocatedSeries;

        const jeansCat = categoriesResult.find(c => c.key === 'JEANS') || categoriesResult[0];
        const jeansUnits = jeansCat.totalUnits || 0;
        const fitsDistribution = [
            {
                name: 'وايد ليج & باجي & كاب (Wide Leg / Baggy / Relaxed)',
                pct: 40,
                series: Math.ceil((jeansUnits * 0.40) / 5),
                units: Math.ceil((jeansUnits * 0.40) / 5) * 5,
                badge: 'التريند الأسرع سحباً بالمحل',
                badgeClass: 'bg-emerald-100 text-emerald-800',
                reason: 'مثل «بنطلون وايد ليج كاب» كود 665، سحب قوي ومطلوب جداً للشباب.'
            },
            {
                name: 'جينز استرس وبراندات (VERSUS / قنديل / ديب / نحله)',
                pct: 40,
                series: Math.ceil((jeansUnits * 0.40) / 5),
                units: Math.ceil((jeansUnits * 0.40) / 5) * 5,
                badge: 'العمود الفقري لأرباح المحل',
                badgeClass: 'bg-indigo-100 text-indigo-800',
                reason: 'الموديلات الأعلى سعراً وربحاً بالمحل (بيع 1250 - 1450 ج وتكلفة 550 - 730 ج).'
            },
            {
                name: 'سليم فيت & ستريت بيزك منتظم (Regular Slim / Straight)',
                pct: 20,
                series: Math.ceil((jeansUnits * 0.20) / 5),
                units: Math.ceil((jeansUnits * 0.20) / 5) * 5,
                badge: 'أمان ومقاسات كلاسيك',
                badgeClass: 'bg-blue-100 text-blue-800',
                reason: 'تغطية المقاسات الأكبر (36، 38) للزبائن الكلاسيك بدون أي ركود.'
            }
        ];

        const sizeCurve = [
            { size: '30', sharePct: 15, role: 'مقاس شبابي أولى', note: 'قطعة واحدة في السِري الخماسي (30 إلى 38)' },
            { size: '32', sharePct: 25, role: 'مقاس ذهبي سريع السحب', note: 'قطعة أساسية في السِري' },
            { size: '34', sharePct: 30, role: 'المقاس الأكثر طلباً بالمحل', note: 'قطعة القلب في السِري' },
            { size: '36', sharePct: 20, role: 'مقاس حيوي وسريع الدوران', note: 'قطعة أساسية في السِري' },
            { size: '38', sharePct: 10, role: 'مقاس خاص مكمل', note: 'قطعة واحدة في السِري' }
        ];

        // 5. Dynamic Verdict Text (طرح الجرد من رأس المال 168 ألف وتوزيع باقي العشرين)
        const verdictTitle = `معادلة رأس المال: كاش متاح في يدك ${autoAvailableCash.toLocaleString('ar-EG')} ج.م (طرح بضاعة الجرد ${totalStockCost.toLocaleString('ar-EG')} ج من رأس المال 168 ألف)`;
        const verdictBadge = 'مطابق لمعادلة رأس المال وباقي العشرين ✓';
        const verdictLogic = [
            `1. معادلة رأس المال والكاش التلقائية: رأس مال المحل (${effectiveCapital.toLocaleString('ar-EG')} ج.م) مطروحاً منه بضاعة المحل الحالية بالجرد (${totalStockCost.toLocaleString('ar-EG')} ج.م) = الكاش الفعلي المتاح في يدك للنزول والشراء وهو ${autoAvailableCash.toLocaleString('ar-EG')} ج.م دون أي تخمين.`,
            `2. بند ترنج شتوي ننجا (سقف 20,000 ج.م شامل الموجود بالمحل): رصيد الننجا الحالي بالجرد هو ${ninjaStockUnits} ترنج بقيمة تكلفة ${ninjaStockCost.toLocaleString('ar-EG')} ج.م (كود 634 وكود 600). باقي الـ 20 ألف المتبقية للشراء هي بالضبط ${ninjaRemainingCeiling.toLocaleString('ar-EG')} ج.م. القرار الصريح: تشتري بباقي العشرين ${ninjaAllocatedSeries} سيريهات كاملة (${ninjaAllocatedUnits} ترنج @ 550 ج بتكلفة ${ninjaAllocatedCost.toLocaleString('ar-EG')} ج.م) مع فائض نقدي ${ninjaBuffer.toLocaleString('ar-EG')} ج.م، ليصبح إجمالي الننجا بالمحل 35 قطعة بقيمة 19,100 ج.م بالتمام في حدود السقف.`,
            `3. باقي رأس مال المحل (148,000 ج.م لباقي شغل المحل): بضاعة باقي المحل الحالية بالجرد هي ${restStockCost.toLocaleString('ar-EG')} ج.م. إذن الكاش المتاح لباقي الشغل هو (${restCapital.toLocaleString('ar-EG')} - ${restStockCost.toLocaleString('ar-EG')}) = ${restCashAvailable.toLocaleString('ar-EG')} ج.م. تم توظيفها بالكامل في سيريهات مقفولة للأصناف التي بيعت فعلياً خلال الأسبوع (${totalSoldQty} قطعة مباعة):`,
            `   • يوم الأربعاء (فرشة الجينز الكبرى والأساسيات - ${wednesdayCostTotal.toLocaleString('ar-EG')} ج.م): نزول ${wednesdaySeriesTotal} سِري كامل، يشمل 100% من الجينز (${allocatedSeries.JEANS} سيريهات خماسية = ${jeansUnits} بنطلون مقاسات 30 إلى 38 مثل VERSUS وديب وجناح وقنديل ووايد ليج كاب) + سيريهات التيشرتات والترنجات.`,
            `   • يوم الخميس (استكمال وتوازن الويك إند - ${thursdayCostTotal.toLocaleString('ar-EG')} ج.م): نزول ${thursdaySeriesTotal} سِري تكميلي للبدل التيم 3 والتيشرتات والشراويل.`,
            `4. قاعدة السِري الكامل (ثري): جميع القرارات بسيريهات كاملة (الجينز 5 قطع من 30 لـ 38، التيشرت والشروال 4 قطع، والبدل 3 أطقم) دون أي كسر مقاسات لحماية سيولة المحل من الركود.`,
            `5. الفائض النقدي المتبقي بعد تقفيل السيريهات: ${bufferCash.toLocaleString('ar-EG')} ج.م تظل في الدرج ككاش حماية.`
        ];

        return {
            capital: {
                totalCapital: effectiveCapital,
                totalStockCost,
                restCapital,
                restStockCost,
                restCashAvailable,
                autoAvailableCash,
                availableCash: autoAvailableCash,
                totalPlannedCost: totalEstimatedCost,
                ninjaBudget: ninjaTotalCeiling,
                ninjaStockUnits,
                ninjaStockCost,
                ninjaRemainingCeiling,
                ninjaSeries: ninjaAllocatedSeries,
                ninjaUnits: ninjaAllocatedUnits,
                ninjaPurchaseCost: ninjaAllocatedCost,
                ninjaBuffer,
                restPlannedCost,
                bufferCash,
                ninjaPct: Math.round((ninjaTotalCeiling / effectiveCapital) * 100),
                stockPctOfCapital: Math.min(100, Math.round((totalStockCost / effectiveCapital) * 100)),
                plannedPctOfCapital: Math.min(100, Math.round((totalEstimatedCost / effectiveCapital) * 100))
            },
            cycle: {
                cycleDays: effectiveDays,
                totalSoldQty,
                totalSalesRevenue,
                totalSalesProfit,
                dailyRunRate: Math.round((totalSoldQty / effectiveDays) * 10) / 10
            },
            inventory: {
                totalStockUnits,
                totalStockCost,
                totalStockValue
            },
            categories: categoriesResult,
            topSoldItems,
            jeans: {
                category: jeansCat,
                fitsDistribution,
                sizeCurve
            },
            recommendation: {
                wednesdaySeries: wednesdaySeriesTotal,
                wednesdayUnits: wednesdayUnitsTotal,
                wednesdayCost: wednesdayCostTotal,
                thursdaySeries: thursdaySeriesTotal,
                thursdayUnits: thursdayUnitsTotal,
                thursdayCost: thursdayCostTotal,
                totalSeries: totalRecommendedSeries,
                totalUnits: totalRecommendedUnits,
                totalCost: totalEstimatedCost,
                restSeries: restSeriesCount,
                restCost: restPlannedCost,
                bufferCash,
                expectedRevenue,
                expectedProfit,
                verdict: {
                    type: 'BALANCED',
                    title: verdictTitle,
                    badge: verdictBadge,
                    logic: verdictLogic
                }
            }
        };
    }

    static solveKnapsackSimulation(budget = 35000, categories = []) {
        const safeNum = PurchasePlanningEngine.safeNum;
        const targetBudget = Math.max(5000, safeNum(budget, 35000));
        let remainingBudget = targetBudget;

        const simulated = categories.map(c => ({
            ...c,
            packSize: safeNum(c.packSize, 4),
            unitCost: safeNum(c.unitCost, 500),
            simSeries: 0,
            simUnits: 0,
            simCost: 0
        }));

        simulated.forEach(c => {
            const packCost = c.packSize * c.unitCost;
            if (c.priorityIndex > 1 && remainingBudget >= packCost) {
                c.simSeries += 1;
                c.simUnits += c.packSize;
                c.simCost += packCost;
                remainingBudget -= packCost;
            }
        });

        let iterations = 0;
        while (remainingBudget > 500 && iterations < 100) {
            iterations++;
            let allocated = false;
            for (const c of simulated) {
                const packCost = c.packSize * c.unitCost;
                if (remainingBudget >= packCost) {
                    c.simSeries += 1;
                    c.simUnits += c.packSize;
                    c.simCost += packCost;
                    remainingBudget -= packCost;
                    allocated = true;
                }
            }
            if (!allocated) break;
        }

        return simulated;
    }
}

// ==========================================
// 7. EXPORT MANAGER
// ==========================================
class ExportManager {
    static downloadCSV(filename, csvContent) {
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    static exportReorderToCSV(items, filename = 'طلب_شراء_نواقص_KABAKA.csv') {
        const headers = ['كود الصنف', 'اسم الصنف', 'المجموعة', 'الرصيد الحالي بالمحل', 'حد النواقص', 'المبيعات بالشيفت', 'درجة الأولوية', 'الكمية المقترح شراؤها', 'سعر البيع', 'التكلفة التقديرية للشراء'];
        const rows = items.map(item => [
            `"${item.code || ''}"`,
            `"${(item.name || '').replace(/"/g, '""')}"`,
            `"${(item.group || '').replace(/"/g, '""')}"`,
            item.stock,
            item.reorderLimit,
            item.soldQty,
            `"${item.urgencyLabel}"`,
            item.suggestedQty,
            item.price.toFixed(2),
            item.estimatedCost.toFixed(2)
        ]);
        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
        this.downloadCSV(filename, csvContent);
    }

    static exportItemsToCSV(items, filename = 'sindbad_items_summary.csv') {
        const headers = ['كود الصنف', 'اسم الصنف', 'عدد الطلبات', 'إجمالي الكمية', 'إجمالي المبيعات', 'إجمالي التكلفة', 'صافي الربح', 'هامش الربح %', 'نسبة المساهمة بالمبيعات %', 'نسبة المساهمة بالربح %'];
        const rows = items.map(item => [
            `"${item.code || ''}"`,
            `"${(item.name || '').replace(/"/g, '""')}"`,
            item.orderCount,
            item.totalQty,
            item.totalSales.toFixed(2),
            item.totalCost.toFixed(2),
            item.totalProfit.toFixed(2),
            `${item.profitMargin.toFixed(1)}%`,
            `${item.salesShare.toFixed(1)}%`,
            `${item.profitShare.toFixed(1)}%`
        ]);
        this.downloadCSV(filename, [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n'));
    }

    static exportInvoicesToCSV(items, filename = 'sindbad_invoices_detail.csv') {
        const headers = ['#', 'التاريخ', 'الوقت (24س)', 'الفاتورة', 'الحركة', 'اسم الصنف', 'الكود', 'الكمية', 'الوحدة', 'السعر', 'الخصم%', 'الاجمالى', 'التكلفة', 'الربح', 'الضريبة', 'الدفع'];
        const rows = items.map(item => [
            item.seq,
            `"${item.date}"`,
            `"${item.time}"`,
            `"${item.invoiceNo}"`,
            `"${item.movement || 'مبيعات'}"`,
            `"${(item.itemName || '').replace(/"/g, '""')}"`,
            `"${item.itemCode}"`,
            item.quantity,
            `"${item.unit || 'قطعة'}"`,
            item.unitPrice.toFixed(2),
            `"${item.rawDiscount || '0.00%'}"`,
            item.total.toFixed(2),
            item.cost.toFixed(2),
            item.profit.toFixed(2),
            item.tax.toFixed(2),
            `"${item.payment}"`
        ]);
        this.downloadCSV(filename, [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n'));
    }

    static exportToExcel(reportData, filename = 'sindbad_sales_analysis.xlsx') {
        if (typeof XLSX === 'undefined') {
            this.exportItemsToCSV(reportData.itemsAggregated);
            return;
        }

        const wb = XLSX.utils.book_new();
        const kpi = reportData.kpis;
        const meta = reportData.meta;

        const summaryData = [
            ['تقرير مبيعات KABAKA - ملخص الوردية'],
            ['اسم المنشأة / الفرع', meta.branch || 'KABAKA'],
            ['الفترة', `${meta.startDate || ''} إلى ${meta.endDate || ''}`],
            ['نوع العرض المفلتر', reportData.activeTabName],
            ['ساعة انتهاء الشيفت فجراً', `${String(reportData.cutoffHour).padStart(2, '0')}:00`],
            [],
            ['المؤشر', 'القيمة'],
            ['إجمالي المبيعات (قبل المرتجعات)', kpi.grossSales],
            ['إجمالي المرتجعات', kpi.returnsTotal],
            ['صافي المبيعات (بعد المرتجعات)', kpi.netSales],
            ['الدرج (صافي نقدية الكاش)', kpi.drawerSales],
            ['البنك (صافي شبكة/بطاقة)', kpi.bankSales],
            ['إجمالي التكلفة', kpi.totalCost],
            ['صافي الربح', kpi.netProfit],
            ['هامش الربح %', `${kpi.profitMargin}%`],
            ['عدد الفواتير', kpi.invoiceCount],
            ['القطع المباعة (قبل المرتجع)', kpi.salesQty],
            ['القطع المرتجعة', kpi.returnsQty],
            ['صافي القطع المباعة', kpi.totalQty],
            ['فلوس الخير (صافي القطع × 5 ج.م)', kpi.charityAmount],
            ['متوسط قيمة الفاتورة', kpi.avgBasket]
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summaryData), 'الملخص العام');

        const itemsRows = [
            ['كود الصنف', 'اسم الصنف', 'عدد الطلبات', 'إجمالي الكمية', 'فلوس الخير (5 ج)', 'المبيعات', 'التكلفة', 'الربح', 'هامش الربح %', 'مساهمة المبيعات %', 'مساهمة الربح %'],
            ...reportData.itemsAggregated.map(i => [
                i.code, i.name, i.orderCount, i.totalQty, i.charityAmount || (i.totalQty * 5), i.totalSales, i.totalCost, i.totalProfit, i.profitMargin, i.salesShare, i.profitShare
            ])
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(itemsRows), 'ملخص الأصناف');

        const invRows = [
            ['#', 'التاريخ', 'الوقت', 'الفاتورة', 'الحركة', 'اسم الصنف', 'الكود', 'الكمية', 'الوحدة', 'السعر', 'الخصم%', 'الاجمالى', 'التكلفة', 'الربح', 'الضريبة', 'الدفع'],
            ...reportData.filteredItems.map(i => [
                i.seq, i.date, i.time, i.invoiceNo, i.movement, i.itemName, i.itemCode, i.quantity, i.unit, i.unitPrice, i.rawDiscount || '0.00%', i.total, i.cost, i.profit, i.tax, i.payment
            ])
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(invRows), 'تفاصيل الفواتير');

        const anom = reportData.anomalies;
        const anomRows = [
            ['كشف الملاحظات والفروقات'],
            [],
            ['1. فروق الأسعار لنفس كود الصنف (بدون خصم)'],
            ['كود الصنف', 'اسم الصنف', 'الأسعار المسجلة', 'فرق السعر', 'أدنى سعر', 'أعلى سعر', 'إجمالي الفارق الضائع'],
            ...anom.priceDiscrepancies.map(p => [
                p.code, p.name, p.distinctPrices.join(', '), p.priceDiff, p.minPrice, p.maxPrice, p.lostVariance
            ]),
            [],
            ['2. تكرار نفس الصنف في نفس الفاتورة'],
            ['رقم الفاتورة', 'الوقت', 'الكاشير', 'كود الصنف', 'اسم الصنف', 'عدد السطور', 'إجمالي الكمية'],
            ...anom.duplicateItemsInInvoice.map(d => [
                d.invoiceNo, d.time, d.cashier, d.itemCode, d.itemName, d.rowCount, d.totalQty
            ]),
            [],
            ['3. أصناف ذات هامش ربح أقل من 20%'],
            ['كود الصنف', 'اسم الصنف', 'هامش الربح %', 'إجمالي المبيعات', 'إجمالي التكلفة', 'صافي الربح'],
            ...anom.lowMarginItems.map(m => [
                m.code, m.name, `${m.overallMargin}%`, m.totalSales, m.totalCost, m.totalProfit
            ]),
            [],
            ['4. فواتير فجر اليوم الأول (الوردية السابقة المستبعدة)'],
            ['رقم الفاتورة', 'الوقت', 'الكاشير', 'طريقة الدفع', 'المبيعات', 'الربح'],
            ...anom.previousShiftInvoices.map(s => [
                s.invoiceNo, s.time, s.cashier, s.payment, s.totalNet, s.totalProfit
            ])
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(anomRows), 'كشف الملاحظات');

        XLSX.writeFile(wb, filename);
    }
}

// ==========================================
// 8. CHART RENDERER
// ==========================================
class ChartRenderer {
    constructor() {
        this.hourlyChart = null;
        this.topItemsChart = null;
        this.paymentChart = null;
    }

    renderHourly(canvasId, hourlyData) {
        const ctx = document.getElementById(canvasId);
        if (!ctx || typeof Chart === 'undefined') return;
        if (this.hourlyChart) this.hourlyChart.destroy();

        const labels = hourlyData.map(h => h.label);
        const salesData = hourlyData.map(h => h.sales);
        const profitData = hourlyData.map(h => h.profit);

        this.hourlyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'المبيعات',
                        data: salesData,
                        backgroundColor: 'rgba(37, 99, 235, 0.75)',
                        borderColor: '#2563eb',
                        borderWidth: 1.5,
                        borderRadius: 6
                    },
                    {
                        label: 'صافي الربح',
                        data: profitData,
                        backgroundColor: 'rgba(16, 185, 129, 0.75)',
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
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { font: { family: 'Cairo', size: 12, weight: 'bold' } }
                    },
                    tooltip: {
                        rtl: true,
                        textDirection: 'rtl',
                        bodyFont: { family: 'Cairo' },
                        titleFont: { family: 'Cairo', weight: 'bold' }
                    }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { family: 'Cairo', size: 11 } } },
                    y: { beginAtZero: true, ticks: { font: { family: 'Cairo', size: 11 } } }
                }
            }
        });
    }

    renderTopItems(canvasId, itemsAggregated, metric = 'sales') {
        const ctx = document.getElementById(canvasId);
        if (!ctx || typeof Chart === 'undefined') return;
        if (this.topItemsChart) this.topItemsChart.destroy();

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
                datasets: [{
                    axis: 'y',
                    label: labelText,
                    data: dataValues,
                    backgroundColor: barColor,
                    borderColor: borderColor,
                    borderWidth: 1.5,
                    borderRadius: 6
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                direction: 'rtl',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        rtl: true,
                        textDirection: 'rtl',
                        bodyFont: { family: 'Cairo' },
                        titleFont: { family: 'Cairo', weight: 'bold' }
                    }
                },
                scales: {
                    x: { beginAtZero: true, ticks: { font: { family: 'Cairo', size: 11 } } },
                    y: { grid: { display: false }, ticks: { font: { family: 'Cairo', size: 11 } } }
                }
            }
        });
    }

    renderPaymentBreakdown(canvasId, kpi) {
        const ctx = document.getElementById(canvasId);
        if (!ctx || typeof Chart === 'undefined') return;
        if (this.paymentChart) this.paymentChart.destroy();

        const drawer = kpi.drawerSales || 0;
        const bank = kpi.bankSales || 0;
        const total = drawer + bank;

        this.paymentChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['الدرج (نقداً)', 'البنك (شبكة/بطاقة)'],
                datasets: [{
                    data: [drawer, bank],
                    backgroundColor: ['rgba(245, 158, 11, 0.85)', 'rgba(14, 165, 233, 0.85)'],
                    borderColor: ['#d97706', '#0284c7'],
                    borderWidth: 1.5,
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                direction: 'rtl',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { font: { family: 'Cairo', size: 12, weight: 'bold' }, padding: 14 }
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

// ==========================================
// 9. MAIN APP CONTROLLER (3-SCREEN ARCHITECTURE)
// ==========================================
class App {
    constructor() {
        this.settings = StorageManager.load();
        this.parsedData = null;
        this.rawHtml = '';
        this.activeTab = SHIFT_TABS.ACTUAL_SHIFT;
        this.cutoffHour = this.settings.cutoffHour || 6;
        this.topItemsMetric = 'sales';

        // Screens: 'login', 'filters', 'dashboard'
        this.currentScreen = 'login';
        this.filterDateMode = 'single'; // 'single' (shift) or 'range' (multi-day)
        this.lastFetchedDateMode = 'single';

        // Filters and pagination
        this.itemsSearch = '';
        this.itemsSortCol = 'totalSales';
        this.itemsSortAsc = false;
        this.itemsPage = 1;
        this.itemsPerPage = 15;

        this.invoicesSearch = '';
        this.invoicesPaymentFilter = 'all';
        this.invoicesMovementFilter = 'all';
        this.invoicesPage = 1;
        this.invoicesPerPage = 20;

        // Cash Drawer Reconciliation & Expenses Ledger
        this.actualCash = null;
        this.expenses = [];
        this.cashOnRegister = 0; // فلوس على الكاش
        this.voidWrongSales = []; // أصناف مسجلة بالخطأ
        this.lastReportParams = null; // معاملات آخر تقرير تم جلبه
        this.loadCashReconciliation();

        // Store Inventory & Smart Reorder State (medica_report2.php)
        this.inventoryData = null;
        this.rawInventoryHtml = '';
        this.reorderFilter = 'urgent'; // 'urgent', 'shortage_limit', 'all'
        this.reorderSearch = '';

        // Managers
        this.charts = new ChartRenderer();
        this.network = new NetworkManager({
            onStatus: (st) => this.updateNetworkStatus(st),
            onError: (err) => this.showToast(err.message || 'حدث خطأ في الاتصال', 'error'),
            onCorsBlocked: (info) => this.handleCorsBlock(info)
        });
        if (this.settings.corsProxy) {
            this.network.setCorsProxy(this.settings.corsProxy);
        }

        this.init();
    }

    init() {
        this.bindEvents();
        this.initDateShortcuts();
        this.applySettingsToUI();

        // Check if username was remembered
        if (this.settings.username) {
            const userInput = document.getElementById('login-username');
            const remCb = document.getElementById('login-remember');
            if (userInput) userInput.value = this.settings.username;
            if (remCb) remCb.checked = true;
        }

        // Show login screen by default unless state restored below
        // Check if opened via file:// protocol
        if (window.location.protocol === 'file:') {
            const banner = document.getElementById('file-protocol-banner');
            if (banner) banner.classList.remove('hidden');
        }

        // Auto-execute initial GET login.php on page load to prime cookies before user logs in
        this.runPageLoadSessionInit();

        // Load store inventory from cache or test_medica.html
        this.loadStoreInventoryFromCache();

        // Always reset to Login screen on page refresh/reload (F5) to guarantee a fresh, authenticated cookie session
        try {
            localStorage.removeItem('kabaka_is_logged_in');
            localStorage.removeItem('kabaka_active_screen');
            localStorage.removeItem('kabaka_current_report_html');
            localStorage.removeItem('kabaka_current_report_source');
        } catch (_) {}

        this.showScreen('login');
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

    handleSessionExpired(reasonMessage = 'انتهت صلاحية جلسة سندباد (الكوكي غير صالح أو منتهي). تم تحويلك لتسجيل الدخول لتجديد الكوكي.') {
        console.warn('Session expired or cookie invalid:', reasonMessage);
        try {
            localStorage.removeItem('kabaka_is_logged_in');
            localStorage.removeItem('kabaka_active_screen');
            localStorage.removeItem('kabaka_current_report_html');
            localStorage.removeItem('kabaka_current_report_source');
            localStorage.removeItem('kabaka_sindbad_cookie');
        } catch (_) {}

        this.rawHtml = '';
        this.parsedData = null;
        this.showScreen('login');
        this.showToast(reasonMessage, 'warning');

        // Show session expired alert on login card
        const alertBox = document.getElementById('login-session-expired-alert');
        const alertMsg = document.getElementById('login-session-expired-msg');
        if (alertBox) {
            alertBox.classList.remove('hidden');
            if (alertMsg && reasonMessage) alertMsg.textContent = reasonMessage;
        }

        const passInput = document.getElementById('login-password');
        if (passInput) {
            setTimeout(() => {
                passInput.focus();
                passInput.select?.();
            }, 100);
        }
    }

    showScreen(screenName) {
        this.currentScreen = screenName;
        try {
            localStorage.setItem('kabaka_active_screen', screenName);
        } catch (_) {}
        const screens = {
            login: document.getElementById('screen-login'),
            filters: document.getElementById('screen-filters'),
            dashboard: document.getElementById('screen-dashboard'),
            planning: document.getElementById('screen-purchase-planning')
        };

        const navFilters = document.getElementById('nav-btn-filters');
        const navRefresh = document.getElementById('nav-btn-refresh');
        const navFiltersMobile = document.getElementById('nav-btn-filters-mobile');
        const navRefreshMobile = document.getElementById('nav-btn-refresh-mobile');
        const mainNavTabs = document.getElementById('main-nav-tabs');

        Object.keys(screens).forEach(k => {
            if (screens[k]) {
                if (k === screenName) {
                    screens[k].classList.remove('hidden');
                } else {
                    screens[k].classList.add('hidden');
                }
            }
        });

        // Strictly control top navigation header visibility by active screen
        if (screenName === 'dashboard' || screenName === 'planning') {
            if (navFilters) navFilters.style.display = 'inline-flex';
            if (navRefresh) navRefresh.style.display = 'inline-flex';
            if (navFiltersMobile) navFiltersMobile.style.display = 'inline-flex';
            if (navRefreshMobile) navRefreshMobile.style.display = 'inline-flex';
            if (mainNavTabs) mainNavTabs.style.display = 'flex';
        } else if (screenName === 'filters') {
            if (navFilters) navFilters.style.display = 'none';
            if (navRefresh) navRefresh.style.display = 'inline-flex';
            if (navFiltersMobile) navFiltersMobile.style.display = 'none';
            if (navRefreshMobile) navRefreshMobile.style.display = 'inline-flex';
            if (mainNavTabs) mainNavTabs.style.display = 'none';
        } else {
            // Screen 1 (login) -> Hide dashboard tabs & controls completely
            if (navFilters) navFilters.style.display = 'none';
            if (navRefresh) navRefresh.style.display = 'none';
            if (navFiltersMobile) navFiltersMobile.style.display = 'none';
            if (navRefreshMobile) navRefreshMobile.style.display = 'none';
            if (mainNavTabs) mainNavTabs.style.display = 'none';
        }

        // Top main nav tabs active style
        const tabDash = document.getElementById('nav-tab-dashboard');
        const tabPlan = document.getElementById('nav-tab-planning');
        if (tabDash && tabPlan) {
            if (screenName === 'planning') {
                tabPlan.className = 'px-3.5 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1.5 bg-white text-indigo-700 shadow-xs';
                tabDash.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-emerald-700 transition flex items-center gap-1.5';
            } else if (screenName === 'dashboard') {
                tabDash.className = 'px-3.5 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1.5 bg-white text-emerald-800 shadow-xs';
                tabPlan.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-indigo-700 transition flex items-center gap-1.5';
            }
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    initDateShortcuts() {
        const shiftDateInput = document.getElementById('input-shift-date');
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;

        if (shiftDateInput) {
            shiftDateInput.value = todayStr;
        }
        this.setShiftDate(now);

        // Also initialize multi-day range inputs with last 7 days (today - 6 days to today)
        const weekAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
        this.setDateRange(weekAgo, now, false);
    }

    setFilterDateMode(mode) {
        this.filterDateMode = mode;
        const tabSingle = document.getElementById('tab-mode-single-shift');
        const tabRange = document.getElementById('tab-mode-date-range');
        const containerSingle = document.getElementById('container-mode-single-shift');
        const containerRange = document.getElementById('container-mode-date-range');

        const activeClasses = 'flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-black transition bg-blue-600 text-white shadow-xs';
        const inactiveClasses = 'flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition text-slate-600 hover:text-blue-700 hover:bg-blue-50';

        if (mode === 'range') {
            if (tabSingle) tabSingle.className = inactiveClasses;
            if (tabRange) tabRange.className = activeClasses;
            if (containerSingle) containerSingle.classList.add('hidden');
            if (containerRange) containerRange.classList.remove('hidden');

            // Apply range values to d1..d2 inputs
            const startInput = document.getElementById('input-range-start');
            const endInput = document.getElementById('input-range-end');
            if (startInput && endInput && startInput.value && endInput.value) {
                const [sy, sm, sd] = startInput.value.split('-').map(Number);
                const [ey, em, ed] = endInput.value.split('-').map(Number);
                const sDate = new Date(sy, sm - 1, sd);
                const eDate = new Date(ey, em - 1, ed);
                this.setDateRange(sDate, eDate, true);
            }
        } else {
            if (tabSingle) tabSingle.className = activeClasses;
            if (tabRange) tabRange.className = inactiveClasses;
            if (containerSingle) containerSingle.classList.remove('hidden');
            if (containerRange) containerRange.classList.add('hidden');

            // Apply single shift values to d1..d2 inputs
            const shiftDateInput = document.getElementById('input-shift-date');
            if (shiftDateInput && shiftDateInput.value) {
                const [sy, sm, sd] = shiftDateInput.value.split('-').map(Number);
                this.setShiftDate(new Date(sy, sm - 1, sd));
            }
        }
    }

    setDateRange(startObj, endObj, updateFormInputs = true) {
        if (startObj > endObj) {
            const temp = startObj;
            startObj = endObj;
            endObj = temp;
        }

        const formatIso = (d) => {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${y}-${m}-${day}`;
        };

        const formatDisplay = (d) => {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${day}-${m}-${y}`;
        };

        const startInput = document.getElementById('input-range-start');
        const endInput = document.getElementById('input-range-end');
        if (startInput) startInput.value = formatIso(startObj);
        if (endInput) endInput.value = formatIso(endObj);

        // Calculate days duration
        const diffTime = Math.abs(endObj.getTime() - startObj.getTime());
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;

        const badge = document.getElementById('range-days-count-badge');
        if (badge) {
            badge.textContent = diffDays === 1 ? 'يوم واحد' : (diffDays === 2 ? 'يومان' : `${diffDays} أيام مبيعات`);
        }

        const explText = document.getElementById('range-mode-explanation-text');
        if (explText) {
            explText.innerHTML = `
                سيتم طلب التقرير من سندباد للفترة الكاملة من <span class="font-bold text-indigo-700 font-mono">${formatDisplay(startObj)}</span> إلى <span class="font-bold text-indigo-700 font-mono">${formatDisplay(endObj)}</span> (${diffDays} يوم).
                <br>• سيتم احتساب كافة فواتير المبيعات الصادرة بين هذين التاريخين بدون استقطاع، لحساب إجمالي المبيعات، وتحديد الأصناف الأكثر مبيعاً ونواقص المخزون طوال الفترة.
            `;
        }

        if (updateFormInputs) {
            this.setDateValues({
                d1: startObj.getDate(),
                m1: startObj.getMonth() + 1,
                y1: startObj.getFullYear(),
                d2: endObj.getDate(),
                m2: endObj.getMonth() + 1,
                y2: endObj.getFullYear()
            });
        }
    }

    setShiftDate(dateObj) {
        const d1 = dateObj.getDate();
        const m1 = dateObj.getMonth() + 1;
        const y1 = dateObj.getFullYear();

        const nextDay = new Date(dateObj.getTime() + 24 * 60 * 60 * 1000);
        const d2 = nextDay.getDate();
        const m2 = nextDay.getMonth() + 1;
        const y2 = nextDay.getFullYear();

        this.setDateValues({ d1, m1, y1, d2, m2, y2 });

        const d1Str = `${String(d1).padStart(2, '0')}-${String(m1).padStart(2, '0')}-${y1}`;
        const d2Str = `${String(d2).padStart(2, '0')}-${String(m2).padStart(2, '0')}-${y2}`;

        const explText = document.getElementById('shift-mode-explanation-text');
        if (explText) {
            explText.innerHTML = `
                سيتم طلب التقرير من سندباد للفترة من <span class="font-bold text-blue-700 font-mono">${d1Str}</span> إلى <span class="font-bold text-blue-700 font-mono">${d2Str}</span> تلقائياً، بحيث:
                <br>• <strong>استبعاد فجر ${d1Str}:</strong> الفواتير المسجلة قبل 06:00 ص تُستبعد تلقائياً (لأنها تخص سهرة الليلة السابقة).
                <br>• <strong>احتساب وردية ${d1Str}:</strong> طوال اليوم بدءاً من 06:00 ص حتى 12:00 منتصف الليل.
                <br>• <strong>ضم سهرة ما بعد 12 بالليل:</strong> فواتير فجر ${d2Str} (من 00:00 إلى 06:00 ص) تُجلب وتُدمج ضمن نفس شيفت يوم ${d1Str}!
            `;
        }
    }

    setDateValues({ d1, m1, y1, d2, m2, y2 }) {
        this.setInputValue('input-d1', d1);
        this.setInputValue('input-m1', m1);
        this.setInputValue('input-y1', y1);
        this.setInputValue('input-d2', d2);
        this.setInputValue('input-m2', m2);
        this.setInputValue('input-y2', y2);
    }

    bindEvents() {
        // Password visibility toggle
        const togglePassBtn = document.getElementById('btn-toggle-password');
        const passInput = document.getElementById('login-password');
        if (togglePassBtn && passInput) {
            togglePassBtn.addEventListener('click', () => {
                const isPassword = passInput.type === 'password';
                passInput.type = isPassword ? 'text' : 'password';
            });
        }

        // 1. Screen 1: Login Form Submit
        const loginForm = document.getElementById('form-login');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleLoginSubmit();
            });
        }

        // Login Demo button
        const loginDemoBtn = document.getElementById('btn-login-demo');
        if (loginDemoBtn) {
            loginDemoBtn.addEventListener('click', () => {
                this.loadDemo();
            });
        }

        // Topbar Demo button
        const navDemoBtn = document.getElementById('nav-btn-demo');
        if (navDemoBtn) {
            navDemoBtn.addEventListener('click', () => {
                this.loadDemo();
            });
        }

        // Navigation buttons & Planning Tabs
        const tabDashBtn = document.getElementById('nav-tab-dashboard');
        if (tabDashBtn) {
            tabDashBtn.addEventListener('click', () => this.showScreen('dashboard'));
        }
        const tabPlanBtn = document.getElementById('nav-tab-planning');
        if (tabPlanBtn) {
            tabPlanBtn.addEventListener('click', () => {
                this.showScreen('planning');
                this.renderPurchasePlanning();
            });
        }
        const btnGotoPlan = document.getElementById('btn-goto-planning');
        if (btnGotoPlan) {
            btnGotoPlan.addEventListener('click', () => {
                this.showScreen('planning');
                this.renderPurchasePlanning();
            });
        }
        const btnBackDash = document.getElementById('btn-back-to-dashboard');
        if (btnBackDash) {
            btnBackDash.addEventListener('click', () => this.showScreen('dashboard'));
        }
        const btnFetchCycle = document.getElementById('btn-fetch-cycle-sindbad');
        if (btnFetchCycle) {
            btnFetchCycle.addEventListener('click', () => this.fetchThursdayCycleFromSindbad());
        }
        // Total Store Capital input (رأس مال المحل الكلي)
        const totalCapInput = document.getElementById('input-store-total-capital');
        if (totalCapInput) {
            totalCapInput.addEventListener('input', () => this.renderPurchasePlanning());
            totalCapInput.addEventListener('change', () => this.renderPurchasePlanning());
        }

        // Cash on hand input & presets (الفلوس اللي معايا دلوقتي)
        const cashInput = document.getElementById('input-plan-available-cash');
        if (cashInput) {
            cashInput.addEventListener('input', () => this.renderPurchasePlanning());
            cashInput.addEventListener('change', () => this.renderPurchasePlanning());
        }

        const presetButtons = document.querySelectorAll('.btn-cash-preset');
        presetButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cashVal = e.target.getAttribute('data-cash');
                if (cashVal && cashInput) {
                    cashInput.value = cashVal;
                    this.renderPurchasePlanning();
                }
            });
        });

        const btnPresetShiftCash = document.getElementById('btn-preset-shift-cash');
        if (btnPresetShiftCash) {
            btnPresetShiftCash.addEventListener('click', () => {
                const currentShiftNet = (this.currentViewData && this.currentViewData.financials) ? 
                    PurchasePlanningEngine.safeNum(this.currentViewData.financials.actualCashCalculated || this.currentViewData.financials.netSales, 15300) : 15300;
                if (cashInput) {
                    cashInput.value = Math.round(currentShiftNet);
                    this.renderPurchasePlanning();
                }
            });
        }

        const navFiltersBtn = document.getElementById('nav-btn-filters');
        if (navFiltersBtn) {
            navFiltersBtn.addEventListener('click', () => this.showScreen('filters'));
        }
        const navFiltersBtnMobile = document.getElementById('nav-btn-filters-mobile');
        if (navFiltersBtnMobile) {
            navFiltersBtnMobile.addEventListener('click', () => this.showScreen('filters'));
        }
        const backFiltersBar = document.getElementById('btn-back-filters-bar');
        if (backFiltersBar) {
            backFiltersBar.addEventListener('click', () => this.showScreen('filters'));
        }
        const backToLoginBtn = document.getElementById('btn-back-to-login');
        if (backToLoginBtn) {
            backToLoginBtn.addEventListener('click', () => {
                try {
                    localStorage.removeItem('kabaka_active_screen');
                    localStorage.removeItem('kabaka_is_logged_in');
                    localStorage.removeItem('kabaka_current_report_html');
                    localStorage.removeItem('kabaka_current_report_source');
                } catch (_) {}
                this.showScreen('login');
            });
        }

        // Smart Reload Buttons (Navbar Desktop & Mobile, Dashboard Toolbar)
        const navRefreshBtn = document.getElementById('nav-btn-refresh');
        if (navRefreshBtn) {
            navRefreshBtn.addEventListener('click', () => {
                this.handleSmartReload();
            });
        }
        const navRefreshBtnMobile = document.getElementById('nav-btn-refresh-mobile');
        if (navRefreshBtnMobile) {
            navRefreshBtnMobile.addEventListener('click', () => {
                this.handleSmartReload();
            });
        }
        const dashboardRefreshBtn = document.getElementById('btn-refresh-report');
        if (dashboardRefreshBtn) {
            dashboardRefreshBtn.addEventListener('click', () => {
                this.refreshReport();
            });
        }

        // 2. Screen 2: Shift Date Picker & Quick Buttons
        const shiftDateInput = document.getElementById('input-shift-date');
        if (shiftDateInput) {
            shiftDateInput.addEventListener('change', (e) => {
                const val = e.target.value;
                if (val) {
                    const parts = val.split('-');
                    const picked = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
                    this.setShiftDate(picked);
                }
            });
        }

        const btnQuickToday = document.getElementById('btn-quick-today-shift');
        if (btnQuickToday) {
            btnQuickToday.addEventListener('click', () => {
                const now = new Date();
                const yyyy = now.getFullYear();
                const mm = String(now.getMonth() + 1).padStart(2, '0');
                const dd = String(now.getDate()).padStart(2, '0');
                if (shiftDateInput) shiftDateInput.value = `${yyyy}-${mm}-${dd}`;
                this.setShiftDate(now);
                this.showToast(`تم اختيار شيفت اليوم (${dd}-${mm}-${yyyy}) + سهرة فجر الغد`, 'info');
            });
        }

        const btnQuickYest = document.getElementById('btn-quick-yesterday-shift');
        if (btnQuickYest) {
            btnQuickYest.addEventListener('click', () => {
                const now = new Date();
                const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                const yyyy = yesterday.getFullYear();
                const mm = String(yesterday.getMonth() + 1).padStart(2, '0');
                const dd = String(yesterday.getDate()).padStart(2, '0');
                if (shiftDateInput) shiftDateInput.value = `${yyyy}-${mm}-${dd}`;
                this.setShiftDate(yesterday);
                this.showToast(`تم اختيار شيفت أمس (${dd}-${mm}-${yyyy}) + سهرة فجر اليوم`, 'info');
            });
        }

        const btnToggleAdv = document.getElementById('btn-toggle-advanced-dates');
        const advContainer = document.getElementById('advanced-dates-container');
        if (btnToggleAdv && advContainer) {
            btnToggleAdv.addEventListener('click', () => {
                advContainer.classList.toggle('hidden');
            });
        }

        // Mode switch buttons (Single Shift vs Multi-Day Range)
        const tabSingleMode = document.getElementById('tab-mode-single-shift');
        const tabRangeMode = document.getElementById('tab-mode-date-range');
        if (tabSingleMode) {
            tabSingleMode.addEventListener('click', () => this.setFilterDateMode('single'));
        }
        if (tabRangeMode) {
            tabRangeMode.addEventListener('click', () => this.setFilterDateMode('range'));
        }

        // Multi-Day Range date inputs
        const rangeStartInput = document.getElementById('input-range-start');
        const rangeEndInput = document.getElementById('input-range-end');
        const handleRangeInputChange = () => {
            if (rangeStartInput && rangeEndInput && rangeStartInput.value && rangeEndInput.value) {
                const [sy, sm, sd] = rangeStartInput.value.split('-').map(Number);
                const [ey, em, ed] = rangeEndInput.value.split('-').map(Number);
                this.setDateRange(new Date(sy, sm - 1, sd), new Date(ey, em - 1, ed), true);
            }
        };
        if (rangeStartInput) rangeStartInput.addEventListener('change', handleRangeInputChange);
        if (rangeEndInput) rangeEndInput.addEventListener('change', handleRangeInputChange);

        // Multi-Day Range quick preset buttons
        const btnRangeLast7 = document.getElementById('btn-range-last-7');
        if (btnRangeLast7) {
            btnRangeLast7.addEventListener('click', () => {
                const now = new Date();
                const past = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
                this.setDateRange(past, now, true);
                this.showToast('تم اختيار نطاق آخر 7 أيام', 'info');
            });
        }

        const btnRangeThursdayCycle = document.getElementById('btn-range-thursday-cycle');
        if (btnRangeThursdayCycle) {
            btnRangeThursdayCycle.addEventListener('click', () => {
                const now = new Date();
                const dayOfWeek = now.getDay(); // 0=Sun..4=Thu..6=Sat
                let diffToThursday = (dayOfWeek - 4 + 7) % 7;
                const startThursday = new Date(now.getTime() - diffToThursday * 24 * 60 * 60 * 1000);
                const endWednesday = new Date(startThursday.getTime() + 6 * 24 * 60 * 60 * 1000);
                const endDate = endWednesday > now ? now : endWednesday;
                this.setDateRange(startThursday, endDate, true);
                this.showToast('تم تحديد دورة الأسبوع من الخميس', 'info');
            });
        }

        const btnRangeMonthToDate = document.getElementById('btn-range-month-to-date');
        if (btnRangeMonthToDate) {
            btnRangeMonthToDate.addEventListener('click', () => {
                const now = new Date();
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                this.setDateRange(startOfMonth, now, true);
                this.showToast('تم تحديد فترة الشهر الحالي حتى اليوم', 'info');
            });
        }

        const btnRangeLast30 = document.getElementById('btn-range-last-30');
        if (btnRangeLast30) {
            btnRangeLast30.addEventListener('click', () => {
                const now = new Date();
                const past = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
                this.setDateRange(past, now, true);
                this.showToast('تم تحديد فترة آخر 30 يوماً', 'info');
            });
        }

        // Group change -> dynamic get_drugs.php?q=...
        const groupSelect = document.getElementById('filter-group-id');
        if (groupSelect) {
            groupSelect.addEventListener('change', async (e) => {
                await this.handleGroupChange(e.target.value);
            });
        }

        // Report Filters Form Submit -> POST salez_report2.php
        const filtersForm = document.getElementById('form-report-filters');
        if (filtersForm) {
            filtersForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleFetchReportSubmit();
            });
        }

        // Refresh filters button
        const refreshFiltersBtn = document.getElementById('btn-refresh-filters');
        if (refreshFiltersBtn) {
            refreshFiltersBtn.addEventListener('click', async () => {
                await this.loadDynamicFilters();
            });
        }

        // 3. Screen 3: Shift Tabs
        document.querySelectorAll('[data-shift-tab]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.shiftTab;
                this.setActiveTab(tab);
            });
        });

        // Multi-Day Quick Period Jump Navigation
        const jumpDaily = document.getElementById('btn-jump-daily-analysis');
        if (jumpDaily) {
            jumpDaily.addEventListener('click', () => {
                document.getElementById('section-daily-analysis')?.scrollIntoView({ behavior: 'smooth' });
            });
        }
        const jumpItems = document.getElementById('btn-jump-items-table');
        if (jumpItems) {
            jumpItems.addEventListener('click', () => {
                document.getElementById('section-items-table')?.scrollIntoView({ behavior: 'smooth' });
            });
        }
        const jumpInvoices = document.getElementById('btn-jump-invoices-table');
        if (jumpInvoices) {
            jumpInvoices.addEventListener('click', () => {
                document.getElementById('section-invoices-table')?.scrollIntoView({ behavior: 'smooth' });
            });
        }

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

        // Cash Drawer Audit & Expenses Listeners
        const inputActualCash = document.getElementById('input-actual-cash');
        if (inputActualCash) {
            inputActualCash.addEventListener('input', (e) => {
                this.handleActualCashChange(e.target.value);
            });
        }

        const formAddExpense = document.getElementById('form-add-expense');
        if (formAddExpense) {
            formAddExpense.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddExpense();
            });
        }

        const btnResetRecon = document.getElementById('btn-reset-cash-reconciliation');
        if (btnResetRecon) {
            btnResetRecon.addEventListener('click', () => {
                if (confirm('هل تريد بالتأكيد تصفير جرد النقدية ومسح المصروفات المسجلة لهذا الشيفت؟')) {
                    this.resetCashReconciliation();
                }
            });
        }

        // Quick expense buttons delegation
        document.querySelectorAll('.btn-quick-expense').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const amount = e.currentTarget.dataset.amount;
                const note = e.currentTarget.dataset.note;
                if (amount) this.handleQuickExpense(amount, note);
            });
        });

        // Delete expense item delegation
        const expensesContainer = document.getElementById('container-expenses-list');
        if (expensesContainer) {
            expensesContainer.addEventListener('click', (e) => {
                const delBtn = e.target.closest('.btn-delete-expense');
                if (delBtn && delBtn.dataset.id) {
                    this.deleteExpense(delBtn.dataset.id);
                }
            });
        }

        // Shortage Smart Hints Actions (بص على الكاش وقولي في كام / صنف اتسجل غلط ومتبعش)
        const reconResultBox = document.getElementById('reconcile-result-box');
        if (reconResultBox) {
            reconResultBox.addEventListener('click', (e) => {
                if (e.target.closest('#btn-save-cash-on-register')) {
                    this.handleSaveCashOnRegister();
                } else if (e.target.closest('#btn-clear-cash-on-register')) {
                    this.handleClearCashOnRegister();
                } else if (e.target.closest('#btn-add-wrong-sale')) {
                    this.handleAddWrongSale();
                } else {
                    const delWrongBtn = e.target.closest('.btn-delete-wrong-sale');
                    if (delWrongBtn && delWrongBtn.dataset.id) {
                        this.deleteWrongSale(delWrongBtn.dataset.id);
                    }
                }
            });

            reconResultBox.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    if (e.target.id === 'input-cash-on-register') {
                        e.preventDefault();
                        this.handleSaveCashOnRegister();
                    } else if (e.target.id === 'input-wrong-item-amount' || e.target.id === 'input-wrong-item-name') {
                        e.preventDefault();
                        this.handleAddWrongSale();
                    }
                }
            });
        }

        // Store Inventory & Smart Reorder Listeners (medica_report2.php)
        const fetchInventoryBtn = document.getElementById('btn-fetch-inventory');
        if (fetchInventoryBtn) {
            fetchInventoryBtn.addEventListener('click', () => {
                this.loadStoreInventory();
            });
        }

        const expReorderExcelBtn = document.getElementById('btn-export-reorder-excel');
        if (expReorderExcelBtn) {
            expReorderExcelBtn.addEventListener('click', () => {
                this.exportReorderExcel();
            });
        }

        document.querySelectorAll('.btn-filter-reorder').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.currentTarget.dataset.filter;
                this.reorderFilter = filter;

                document.querySelectorAll('.btn-filter-reorder').forEach(b => {
                    b.className = b.dataset.filter === filter 
                        ? 'btn-filter-reorder px-3 py-1.5 rounded-lg font-bold transition bg-rose-600 text-white' 
                        : 'btn-filter-reorder px-3 py-1.5 rounded-lg font-bold transition bg-slate-100 text-slate-700 hover:bg-slate-200';
                });

                this.renderInventoryReorder();
            });
        });

        const reorderSearchInput = document.getElementById('input-reorder-search');
        if (reorderSearchInput) {
            reorderSearchInput.addEventListener('input', (e) => {
                this.reorderSearch = e.target.value.trim().toLowerCase();
                this.renderInventoryReorder();
            });
        }

        // Paste / File Upload Actions
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
                this.showScreen('dashboard');
                this.showToast('تم تحليل كود التقرير بنجاح!', 'success');
            });
        }

        const fileInput = document.getElementById('file-upload-input');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) this.readFile(file);
            });
        }

        const dropZone = document.getElementById('drop-zone');
        if (dropZone) {
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('border-blue-500', 'bg-blue-50/50');
            });
            dropZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                dropZone.classList.remove('border-blue-500', 'bg-blue-50/50');
            });
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('border-blue-500', 'bg-blue-50/50');
                if (e.dataTransfer.files.length > 0) {
                    this.readFile(e.dataTransfer.files[0]);
                }
            });
        }

        // Top items metric toggle (Sales vs Profit)
        const btnMetricSales = document.getElementById('btn-chart-metric-sales');
        const btnMetricProfit = document.getElementById('btn-chart-metric-profit');
        if (btnMetricSales && btnMetricProfit) {
            btnMetricSales.addEventListener('click', () => {
                this.topItemsMetric = 'sales';
                btnMetricSales.className = 'px-3 py-1 text-xs font-bold rounded-lg bg-blue-600 text-white transition';
                btnMetricProfit.className = 'px-3 py-1 text-xs font-bold rounded-lg text-slate-700 transition';
                this.renderCharts();
            });
            btnMetricProfit.addEventListener('click', () => {
                this.topItemsMetric = 'profit';
                btnMetricProfit.className = 'px-3 py-1 text-xs font-bold rounded-lg bg-blue-600 text-white transition';
                btnMetricSales.className = 'px-3 py-1 text-xs font-bold rounded-lg text-slate-700 transition';
                this.renderCharts();
            });
        }

        // Items search
        const itemsSearchInput = document.getElementById('input-items-search');
        if (itemsSearchInput) {
            itemsSearchInput.addEventListener('input', (e) => {
                this.itemsSearch = e.target.value.trim().toLowerCase();
                this.itemsPage = 1;
                this.renderItemsTable();
            });
        }

        // Invoices search and payment filter
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
            printBtn.addEventListener('click', () => window.print());
        }

        // Settings modal submit & wipe credentials
        const settingsForm = document.getElementById('form-app-settings');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.settings.cutoffHour = parseInt(document.getElementById('setting-cutoff-hour')?.value || '6', 10);
                this.cutoffHour = this.settings.cutoffHour;
                this.settings.corsProxy = document.getElementById('setting-cors-proxy')?.value.trim() || '';
                this.network.setCorsProxy(this.settings.corsProxy);
                StorageManager.save(this.settings);
                this.closeModal('modal-settings');
                this.showToast('تم حفظ الإعدادات بنجاح', 'success');
                if (this.parsedData) this.renderAll();
            });
        }

        const wipeCredsBtn = document.getElementById('btn-wipe-credentials');
        if (wipeCredsBtn) {
            wipeCredsBtn.addEventListener('click', () => {
                StorageManager.clearUsername();
                this.settings.username = '';
                this.setInputValue('login-username', '');
                this.showToast('تم مسح اسم المستخدم المحفوظ فوراً من المتصفح', 'info');
            });
        }

        const btnSaveQuickProxy = document.getElementById('btn-save-quick-proxy');
        if (btnSaveQuickProxy) {
            btnSaveQuickProxy.addEventListener('click', () => {
                const p = document.getElementById('input-quick-cors-proxy')?.value.trim();
                this.settings.corsProxy = p;
                this.network.setCorsProxy(p);
                StorageManager.save(this.settings);
                this.closeModal('modal-proxy-settings');
                this.showToast('تم حفظ إعدادات البروكسي', 'success');
            });
        }

        // Modal triggers
        document.querySelectorAll('[data-open-modal]').forEach(el => {
            el.addEventListener('click', () => this.openModal(el.dataset.openModal));
        });
        document.querySelectorAll('[data-close-modal]').forEach(el => {
            el.addEventListener('click', () => this.closeModal(el.dataset.closeModal));
        });
    }

    async handleLoginSubmit() {
        const username = document.getElementById('login-username')?.value.trim();
        const password = document.getElementById('login-password')?.value;
        const remember = document.getElementById('login-remember')?.checked;

        if (!username || !password) {
            this.showToast('يرجى إدخال اسم المستخدم وكلمة المرور', 'error');
            return;
        }

        if (remember) {
            this.settings.username = username;
            this.settings.rememberUsername = true;
        } else {
            this.settings.username = '';
            this.settings.rememberUsername = false;
        }
        StorageManager.save(this.settings);

        const progressBox = document.getElementById('login-progress-box');
        const submitBtn = document.getElementById('btn-login-submit');
        const alertBox = document.getElementById('login-session-expired-alert');
        if (alertBox) alertBox.classList.add('hidden');
        if (progressBox) progressBox.classList.remove('hidden');
        if (submitBtn) submitBtn.disabled = true;

        try {
            await this.network.login(username, password);
            this.isLoggedIn = true;
            try {
                localStorage.setItem('kabaka_is_logged_in', 'true');
            } catch (_) {}
            this.showToast('تم تسجيل الدخول بنجاح! جارٍ جلب قوائم الفلاتر...', 'success');
            
            // Move to Screen 2 & fetch dynamic filters
            await this.loadDynamicFilters();
            this.showScreen('filters');

        } catch (err) {
            console.error('Login error:', err);
            this.showToast(err.message || 'فشل تسجيل الدخول', 'error');
        } finally {
            if (progressBox) progressBox.classList.add('hidden');
            if (submitBtn) submitBtn.disabled = false;
        }
    }

    async loadDynamicFilters() {
        const refreshBtn = document.getElementById('btn-refresh-filters');
        let origBtnContent = '';
        if (refreshBtn) {
            origBtnContent = refreshBtn.innerHTML;
            refreshBtn.disabled = true;
            refreshBtn.innerHTML = `
                <span class="inline-flex items-center gap-1.5 text-blue-700">
                    <svg class="animate-spin -ml-1 mr-1 h-3.5 w-3.5 text-blue-600 inline" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>جارٍ التحديث...</span>
                </span>
            `;
        }

        try {
            const html = await this.network.fetchFiltersHTML();
            if (html) {
                const filters = NetworkManager.parseFiltersHTML(html);
                if (filters && filters.groups && filters.groups.length > 0) {
                    this.populateFilterDropdowns(filters);
                    try {
                        localStorage.setItem('kabaka_cached_real_filters', html);
                    } catch (_) {}
                    this.showToast('تم تحديث خيارات الفروع والمجموعات والمستخدمين بنجاح من سندباد ✓', 'success');
                    return;
                }
            }
            throw new Error('لم يتم استقبال بيانات الفلاتر من منصة سندباد.');
        } catch (err) {
            console.warn('Could not fetch dynamic filters:', err);
            if (err.isSessionExpired || (err.message && (err.message.includes('جلسة') || err.message.includes('الكوكي')))) {
                this.handleSessionExpired('انتهت جلسة تسجيل الدخول في سندباد (الكوكي منتهي). تم تحويلك لتسجيل الدخول لتجديد الكوكي.');
                return;
            }

            // 1. Check if we have cached real filters from previous successful fetch
            const cachedHtml = localStorage.getItem('kabaka_cached_real_filters');
            if (cachedHtml) {
                const cachedFilters = NetworkManager.parseFiltersHTML(cachedHtml);
                this.populateFilterDropdowns(cachedFilters);
                this.showToast('تعذر الاتصال المباشر بسندباد، تم تحميل القوائم الحقيقية المحفوظة للمحل مؤقتاً', 'warning');
                return;
            }

            // 2. If dropdowns already have options, DO NOT wipe them out with mock data!
            const groupSelect = document.getElementById('filter-group-id');
            if (groupSelect && groupSelect.options.length > 1) {
                this.showToast('تعذر تحديث القوائم من سندباد (' + (err.message || 'خطأ اتصال') + ')، تم الإبقاء على القوائم الحالية دون تغيير', 'warning');
                return;
            }

            // 3. Fallback only if completely blank
            this.showToast('فشل جلب القوائم من سندباد: ' + (err.message || 'خطأ اتصال'), 'error');
        } finally {
            if (refreshBtn) {
                refreshBtn.disabled = false;
                refreshBtn.innerHTML = origBtnContent || 'تحديث القوائم';
            }
        }
    }

    populateFilterDropdowns(filters) {
        const populate = (id, options, selectedVal) => {
            const el = document.getElementById(id);
            if (!el) return;
            const currentVal = el.value;
            const hasCurrentVal = options.some(opt => opt.value === currentVal);
            const activeVal = hasCurrentVal && currentVal !== 'all' ? currentVal : selectedVal;

            el.innerHTML = options.map(opt => `
                <option value="${opt.value}" ${opt.value === activeVal ? 'selected' : ''}>
                    ${opt.text}
                </option>
            `).join('');
        };

        populate('filter-store-id', filters.stores, filters.selectedStore || '752');
        populate('filter-doc-id', filters.docs, filters.selectedDoc || 'all');
        populate('filter-salesman-id', filters.salesmen, filters.selectedSalesman || 'all');
        populate('filter-group-id', filters.groups, filters.selectedGroup || 'all');
        populate('filter-med-id', filters.meds, filters.selectedMed || 'all');
        populate('filter-state-id', filters.states, filters.selectedState || 'all');
        populate('filter-tax-id', filters.taxes, filters.selectedTax || 'all');
    }

    async handleGroupChange(groupId) {
        const medSelect = document.getElementById('filter-med-id');
        const spinner = document.getElementById('med-loading-spinner');
        if (!medSelect) return;

        if (groupId === 'all') {
            medSelect.innerHTML = '<option value="all" selected>كل الأصناف (all)</option>';
            return;
        }

        if (spinner) spinner.classList.remove('hidden');

        try {
            const drugsHtml = await this.network.fetchDrugsByGroup(groupId);
            let options = [];
            if (drugsHtml) {
                options = NetworkManager.parseDrugsHTML(drugsHtml);
            } else if (sampleGroupDrugs[groupId]) {
                options = sampleGroupDrugs[groupId];
            } else {
                options = [{ value: 'all', text: 'كل الأصناف' }];
            }

            medSelect.innerHTML = options.map(o => `<option value="${o.value}">${o.text}</option>`).join('');
        } catch (e) {
            console.error('Error fetching group drugs:', e);
        } finally {
            if (spinner) spinner.classList.add('hidden');
        }
    }

    async handleFetchReportSubmit() {
        const p = {
            doc_id: document.getElementById('filter-doc-id')?.value || 'all',
            salesman_id: document.getElementById('filter-salesman-id')?.value || 'all',
            store_id: document.getElementById('filter-store-id')?.value || '752',
            group_id: document.getElementById('filter-group-id')?.value || 'all',
            med_id: document.getElementById('filter-med-id')?.value || 'all',
            state_id: document.getElementById('filter-state-id')?.value || 'all',
            tax_id: document.getElementById('filter-tax-id')?.value || 'all',
            d1: parseInt(document.getElementById('input-d1')?.value, 10),
            m1: parseInt(document.getElementById('input-m1')?.value, 10),
            y1: parseInt(document.getElementById('input-y1')?.value, 10),
            d2: parseInt(document.getElementById('input-d2')?.value, 10),
            m2: parseInt(document.getElementById('input-m2')?.value, 10),
            y2: parseInt(document.getElementById('input-y2')?.value, 10)
        };

        if (isNaN(p.d1) || isNaN(p.m1) || isNaN(p.y1) || isNaN(p.d2) || isNaN(p.m2) || isNaN(p.y2)) {
            this.showToast('يرجى إدخال تاريخ صحيح للبدء والانتهاء', 'error');
            return;
        }

        const progressBox = document.getElementById('fetch-report-progress-box');
        const submitBtn = document.getElementById('btn-fetch-report-submit');
        if (progressBox) progressBox.classList.remove('hidden');
        if (submitBtn) submitBtn.disabled = true;

        this.lastFetchedDateMode = this.filterDateMode;

        try {
            const html = await this.network.fetchReportHTML(p);
            this.lastReportParams = p;
            this.loadHTMLContent(html, `تقرير سندباد الرسمي (${p.d1}-${p.m1}-${p.y1} إلى ${p.d2}-${p.m2}-${p.y2})`);
            this.showScreen('dashboard');
            this.showToast('تم جلب وتحليل تقرير المبيعات بنجاح!', 'success');
            // Auto-sync inventory items (medica_report2.php)
            this.loadStoreInventory().catch(e => console.warn('Inventory sync error:', e));
        } catch (err) {
            console.error('Fetch report error:', err);
            if (err.isSessionExpired || (err.message && (err.message.includes('جلسة') || err.message.includes('الكوكي')))) {
                this.handleSessionExpired('فشل جلب التقرير لأن جلسة سندباد انتهت (الكوكي غير صالح). تم تحويلك لتسجيل الدخول لتجديد الكوكي.');
                return;
            }
            this.showToast(err.message || 'فشل جلب التقرير', 'error');
        } finally {
            if (progressBox) progressBox.classList.add('hidden');
            if (submitBtn) submitBtn.disabled = false;
        }
    }

    loadDemo() {
        this.loadHTMLContent(sampleSindbadHTML, 'تقرير تجريبي مطابق لـ salez_report2.php');
        this.populateFilterDropdowns(NetworkManager.parseFiltersHTML(sampleFilterHTML));
        this.showScreen('dashboard');
        this.showToast('تم تحميل بيانات التقرير التجريبي بنجاح!', 'success');
    }

    readFile(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            this.loadHTMLContent(content, file.name);
            this.closeModal('modal-paste');
            this.showScreen('dashboard');
            this.showToast(`تم تحميل الملف "${file.name}" بنجاح!`, 'success');
        };
        reader.onerror = () => this.showToast('فشل قراءة الملف المرفوع', 'error');
        reader.readAsText(file);
    }

    loadHTMLContent(htmlText, sourceLabel = '') {
        try {
            if (!htmlText || NetworkManager.isSessionExpiredHtml(htmlText)) {
                this.handleSessionExpired('انتهت صلاحية جلسة سندباد (الكوكي غير صالح أو منتهي). تم تحويلك لصفحة تسجيل الدخول لتجديد الكوكي...');
                return;
            }

            this.rawHtml = htmlText;
            this.parsedData = SindbadParser.parse(htmlText);

            try {
                localStorage.setItem('kabaka_current_report_html', htmlText);
                if (sourceLabel) localStorage.setItem('kabaka_current_report_source', sourceLabel);
            } catch (_) {}

            const branchEl = document.getElementById('meta-branch');
            const datesEl = document.getElementById('meta-dates');
            const sourceEl = document.getElementById('meta-source');
            if (branchEl) branchEl.textContent = this.parsedData.meta.branch || 'KABAKA';
            if (datesEl) {
                const start = this.parsedData.meta.startDate || '—';
                const end = this.parsedData.meta.endDate || '—';
                datesEl.textContent = `${start} إلى ${end}`;
            }
            if (sourceEl) sourceEl.textContent = sourceLabel || 'salez_report2.php';

            // Auto-select tab mode: If range was fetched or data has > 2 dates, show ALL_REPORT by default
            const resolvedDates = ShiftAnalyzer.resolveDates(this.parsedData.items, this.parsedData.meta);
            const isRange = this.lastFetchedDateMode === 'range' || (resolvedDates.allDates && resolvedDates.allDates.length > 2);
            this.activeTab = isRange ? SHIFT_TABS.ALL_REPORT : SHIFT_TABS.ACTUAL_SHIFT;
            document.querySelectorAll('[data-shift-tab]').forEach(btn => {
                if (btn.dataset.shiftTab === this.activeTab) {
                    btn.className = 'shrink-0 flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition bg-blue-600 text-white shadow-xs whitespace-nowrap';
                } else {
                    btn.className = 'shrink-0 flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition text-slate-700 hover:bg-slate-100 whitespace-nowrap';
                }
            });

            this.renderAll();
        } catch (err) {
            console.error('Parsing error:', err);
            if (err.isSessionExpired || (err.message && (err.message.includes('جلسة') || err.message.includes('الكوكي')))) {
                this.handleSessionExpired('انتهت صلاحية جلسة سندباد (الكوكي غير صالح أو منتهي). تم تحويلك لصفحة تسجيل الدخول لتجديد الكوكي...');
                return;
            }
            this.showToast(err.message || 'حدث خطأ أثناء تحليل التقرير', 'error');
        }
    }

    setActiveTab(tab) {
        this.activeTab = tab;
        document.querySelectorAll('[data-shift-tab]').forEach(btn => {
            if (btn.dataset.shiftTab === tab) {
                btn.className = 'shrink-0 flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition bg-blue-600 text-white shadow-xs whitespace-nowrap';
            } else {
                btn.className = 'shrink-0 flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition text-slate-700 hover:bg-slate-100 whitespace-nowrap';
            }
        });

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
        this.renderCashReconciliation();
        this.renderDailyAnalysis();
        this.renderCharts();
        this.renderAnomalies();
        this.renderItemsTable();
        this.renderInvoicesTable();
        this.renderInventoryReorder();
        this.renderPurchasePlanning();
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

        const counts = {};
        tabs.forEach(tab => {
            const count = ShiftAnalyzer.filterItems(this.parsedData.items, tab, this.cutoffHour, dates).length;
            counts[tab] = count;
            const badge = document.getElementById(`badge-count-${tab}`);
            if (badge) badge.textContent = count;
        });

        // Update Overview Banner at the top of the dashboard
        const badgeEl = document.getElementById('shift-banner-badge');
        const titleEl = document.getElementById('shift-banner-title');
        const descEl = document.getElementById('shift-banner-desc');
        const invEl = document.getElementById('shift-banner-invoices');
        const exclEl = document.getElementById('shift-banner-excluded');
        const dawnEl = document.getElementById('shift-banner-dawn');
        const charityBannerEl = document.getElementById('shift-banner-charity');
        const returnsBannerEl = document.getElementById('shift-banner-returns');

        const card1Label = document.getElementById('shift-banner-card1-label');
        const card2Label = document.getElementById('shift-banner-card2-label');
        const card3Label = document.getElementById('shift-banner-card3-label');
        const card4Label = document.getElementById('shift-banner-card4-label');
        const card5Label = document.getElementById('shift-banner-card5-label');

        const isRange = this.lastFetchedDateMode === 'range' || (dates.allDates && dates.allDates.length > 2) || dates.isMultiDay;
        const daysCount = dates.allDates && dates.allDates.length > 0 ? dates.allDates.length : 1;
        const cutoffStr = String(this.cutoffHour).padStart(2, '0') + ':00 ص';

        // Compute KPIs for actual shift items and all period items
        const actualItems = ShiftAnalyzer.filterItems(this.parsedData.items, SHIFT_TABS.ACTUAL_SHIFT, this.cutoffHour, dates);
        const actualKPIs = ShiftAnalyzer.computeKPIs(actualItems);

        const allItems = this.parsedData.items;
        const allKPIs = ShiftAnalyzer.computeKPIs(allItems);

        // Tab buttons and jump pills elements
        const tabActual = document.getElementById('btn-shift-actual_shift');
        const tabDay1 = document.getElementById('btn-shift-day1_only');
        const tabDawn = document.getElementById('btn-shift-day2_dawn');
        const tabExcl = document.getElementById('btn-shift-day1_excluded');
        const labelActual = document.getElementById('label-shift-actual');
        const labelAll = document.getElementById('label-shift-all');
        const jumpDaily = document.getElementById('btn-jump-daily-analysis');
        const jumpItems = document.getElementById('btn-jump-items-table');
        const jumpInvoices = document.getElementById('btn-jump-invoices-table');

        if (isRange) {
            // ================= MULTI-DAY RANGE MODE =================
            if (badgeEl) {
                badgeEl.textContent = `تقرير فترة مجمعة (${daysCount} يوم) ✓`;
                badgeEl.className = 'text-xs bg-indigo-500 text-white font-bold px-2.5 py-0.5 rounded-full shadow-xs transition-all';
            }
            if (titleEl) {
                titleEl.textContent = `تقرير مبيعات الفترة المجمعة من ${dates.day1} إلى ${dates.day2} (${daysCount} يوماً)`;
            }
            if (descEl) {
                descEl.innerHTML = `
                    تقرير مجمع لكافة المبيعات الصادرة بين <span class="font-bold underline text-white">${dates.day1}</span> و <span class="font-bold underline text-white">${dates.day2}</span>.
                    <span class="block mt-0.5 text-blue-200">إجمالي الأيام المسجلة: <strong>${daysCount}</strong> يوم | إجمالي الفواتير: <strong>${allKPIs.invoiceCount}</strong> فاتورة | متوسط المبيعات اليومية: <strong>${Math.round(allKPIs.netSales / daysCount).toLocaleString('ar-EG')} ج.م</strong>.</span>
                `;
            }

            if (card1Label) card1Label.textContent = 'إجمالي الفواتير';
            if (invEl) invEl.textContent = allKPIs.invoiceCount;

            if (card2Label) card2Label.textContent = 'إجمالي فلوس الخير';
            if (charityBannerEl) {
                charityBannerEl.textContent = `${allKPIs.charityAmount.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م`;
            }

            if (card3Label) card3Label.textContent = 'إجمالي المرتجعات';
            if (returnsBannerEl) {
                returnsBannerEl.textContent = `${allKPIs.returnsTotal.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م (${allKPIs.returnsQty} ق)`;
            }

            if (card4Label) card4Label.textContent = 'متوسط المبيعات / يوم';
            if (exclEl) {
                exclEl.textContent = `${Math.round(allKPIs.netSales / daysCount).toLocaleString('ar-EG')} ج.م`;
                exclEl.className = 'font-black text-sm text-amber-300 font-mono';
            }

            if (card5Label) card5Label.textContent = 'معدل الفواتير / يوم';
            if (dawnEl) {
                dawnEl.textContent = `${(allKPIs.invoiceCount / daysCount).toFixed(1)} ف/يوم`;
                dawnEl.className = 'font-black text-sm text-emerald-300 font-mono';
            }

            // Hide dawn crossover tabs in range mode
            if (tabActual) tabActual.classList.add('hidden');
            if (tabDay1) tabDay1.classList.add('hidden');
            if (tabDawn) tabDawn.classList.add('hidden');
            if (tabExcl) tabExcl.classList.add('hidden');

            if (labelAll) labelAll.textContent = `📊 إجمالي مبيعات الفترة بالكامل (${daysCount} يوم)`;
            if (jumpDaily) jumpDaily.classList.remove('hidden');
            if (jumpItems) jumpItems.classList.remove('hidden');
            if (jumpInvoices) jumpInvoices.classList.remove('hidden');

        } else {
            // ================= SINGLE SHIFT MODE =================
            if (badgeEl) {
                badgeEl.textContent = 'الشيفت الفعلي المكتمل ✓';
                badgeEl.className = 'text-xs bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full transition-all';
            }
            if (titleEl) {
                titleEl.textContent = `وردية يوم ${dates.day1} (ممتدة بعد 12 بالليل إلى فجر ${dates.day2})`;
            }
            if (descEl) {
                descEl.innerHTML = `
                    تشمل مبيعات وردية <span class="font-bold underline text-white">${dates.day1}</span> من الساعة <strong>${cutoffStr}</strong> حتى 12:00 منتصف الليل + سهرة فجر <span class="font-bold underline text-white">${dates.day2}</span> حتى <strong>${cutoffStr}</strong>.
                    <span class="block mt-0.5 text-blue-200">تم استبعاد <strong>${counts[SHIFT_TABS.DAY1_EXCLUDED] || 0}</strong> فاتورة تخص سهرة أمس تلقائياً.</span>
                `;
            }

            if (card1Label) card1Label.textContent = 'فواتير الشيفت';
            if (invEl) invEl.textContent = counts[SHIFT_TABS.ACTUAL_SHIFT] || 0;

            if (card2Label) card2Label.textContent = 'فلوس الخير';
            if (charityBannerEl) {
                charityBannerEl.textContent = `${actualKPIs.charityAmount.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م`;
            }

            if (card3Label) card3Label.textContent = 'المرتجعات';
            if (returnsBannerEl) {
                returnsBannerEl.textContent = `${actualKPIs.returnsTotal.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م (${actualKPIs.returnsQty} ق)`;
            }

            if (card4Label) card4Label.textContent = 'سهرة أمس';
            if (exclEl) {
                exclEl.textContent = counts[SHIFT_TABS.DAY1_EXCLUDED] || 0;
                exclEl.className = 'font-black text-sm text-rose-300 font-mono';
            }

            if (card5Label) card5Label.textContent = 'سهرة فجر 2';
            if (dawnEl) {
                dawnEl.textContent = counts[SHIFT_TABS.DAY2_DAWN] || 0;
                dawnEl.className = 'font-black text-sm text-emerald-300 font-mono';
            }

            // Restore shift tabs for single shift mode
            if (tabActual) tabActual.classList.remove('hidden');
            if (tabDay1) tabDay1.classList.remove('hidden');
            if (tabDawn) tabDawn.classList.remove('hidden');
            if (tabExcl) tabExcl.classList.remove('hidden');

            if (labelActual) labelActual.textContent = '⭐ الشيفت الفعلي (شامل بعد 12 بالليل)';
            if (labelAll) labelAll.textContent = 'إجمالي التقرير بالكامل (الخام)';
            if (jumpDaily) jumpDaily.classList.add('hidden');
            if (jumpItems) jumpItems.classList.add('hidden');
            if (jumpInvoices) jumpInvoices.classList.add('hidden');
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

        const marginEl = document.getElementById('kpi-margin');
        if (marginEl) {
            if (kpi.profitMargin >= 30) {
                marginEl.className = 'text-2xl font-bold text-emerald-600 font-mono';
            } else if (kpi.profitMargin >= 20) {
                marginEl.className = 'text-2xl font-bold text-blue-600 font-mono';
            } else {
                marginEl.className = 'text-2xl font-bold text-amber-600 font-mono';
            }
        }
    }

    loadCashReconciliation() {
        try {
            const raw = localStorage.getItem('kabaka_cash_drawer_recon');
            if (raw) {
                const data = JSON.parse(raw);
                if (data.actualCash !== undefined && data.actualCash !== null) this.actualCash = data.actualCash;
                if (Array.isArray(data.expenses)) this.expenses = data.expenses;
                if (data.cashOnRegister !== undefined) this.cashOnRegister = data.cashOnRegister;
                if (Array.isArray(data.voidWrongSales)) this.voidWrongSales = data.voidWrongSales;
            }
        } catch (e) {
            console.warn('Failed to load cash reconciliation from storage:', e);
        }
    }

    saveCashReconciliation() {
        try {
            localStorage.setItem('kabaka_cash_drawer_recon', JSON.stringify({
                actualCash: this.actualCash,
                expenses: this.expenses,
                cashOnRegister: this.cashOnRegister,
                voidWrongSales: this.voidWrongSales
            }));
        } catch (e) {
            console.warn('Failed to save cash reconciliation to storage:', e);
        }
    }

    handleActualCashChange(val) {
        this.actualCash = val === '' ? null : parseFloat(val);
        this.saveCashReconciliation();
        this.renderCashReconciliation();
    }

    handleSaveCashOnRegister() {
        const el = document.getElementById('input-cash-on-register');
        if (!el) return;
        const val = parseFloat(el.value);
        this.cashOnRegister = isNaN(val) || val < 0 ? 0 : val;
        this.saveCashReconciliation();
        this.renderCashReconciliation();
        if (this.cashOnRegister > 0) {
            this.showToast(`تم حفظ ${this.cashOnRegister} ج.م فلوس معلقة على الكاش`, 'success');
        } else {
            this.showToast('تم مسح فلوس الكاش المعلقة', 'info');
        }
    }

    handleClearCashOnRegister() {
        this.cashOnRegister = 0;
        this.saveCashReconciliation();
        this.renderCashReconciliation();
        this.showToast('تم مسح فلوس الكاش المعلقة', 'info');
    }

    handleAddWrongSale() {
        const amountEl = document.getElementById('input-wrong-item-amount');
        const nameEl = document.getElementById('input-wrong-item-name');
        if (!amountEl) return;
        const amount = parseFloat(amountEl.value);
        if (isNaN(amount) || amount <= 0) {
            this.showToast('يرجى كتابة قيمة الصنف أو الفاتورة المسجلة بالخطأ', 'error');
            return;
        }
        const name = nameEl?.value?.trim() || 'صنف مسجل بالخطأ على السيستم';
        if (!this.voidWrongSales) this.voidWrongSales = [];
        this.voidWrongSales.push({
            id: 'wrong_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            amount: amount,
            note: name,
            time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        });
        this.saveCashReconciliation();
        this.renderCashReconciliation();
        this.showToast(`تم تسجيل خصم صنف بالخطأ: ${name} (${amount} ج.م)`, 'info');
    }

    deleteWrongSale(id) {
        if (!this.voidWrongSales) return;
        this.voidWrongSales = this.voidWrongSales.filter(item => item.id !== id);
        this.saveCashReconciliation();
        this.renderCashReconciliation();
        this.showToast('تم حذف الصنف المسجل بالخطأ', 'info');
    }

    handleAddExpense() {
        const amountInput = document.getElementById('input-expense-amount');
        const noteInput = document.getElementById('input-expense-note');
        if (!amountInput) return;

        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount <= 0) {
            this.showToast('يرجى إدخال مبلغ صحيح للمصروف', 'error');
            return;
        }

        const note = noteInput?.value?.trim() || 'نثريات متنوعة';
        this.expenses.push({
            id: 'exp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            amount: amount,
            note: note,
            time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        });

        amountInput.value = '';
        if (noteInput) noteInput.value = '';
        this.saveCashReconciliation();
        this.renderCashReconciliation();
        this.showToast(`تمت إضافة مصروف: ${note} بمبلغ ${amount} ج.م`, 'info');
    }

    handleQuickExpense(amount, note) {
        this.expenses.push({
            id: 'exp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            amount: Number(amount),
            note: note,
            time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        });
        this.saveCashReconciliation();
        this.renderCashReconciliation();
        this.showToast(`تمت إضافة: ${note} (${amount} ج.م)`, 'info');
    }

    deleteExpense(id) {
        this.expenses = this.expenses.filter(e => e.id !== id);
        this.saveCashReconciliation();
        this.renderCashReconciliation();
        this.showToast('تم حذف بند المصروف بنجاح', 'info');
    }

    resetCashReconciliation() {
        this.actualCash = null;
        this.expenses = [];
        this.cashOnRegister = 0;
        this.voidWrongSales = [];
        this.saveCashReconciliation();
        const inputActual = document.getElementById('input-actual-cash');
        if (inputActual) inputActual.value = '';
        this.renderCashReconciliation();
        this.showToast('تم تصفير جرد النقدية والمصروفات والتسويات بنجاح', 'info');
    }

    async handleSmartReload() {
        const navRefresh = document.getElementById('nav-btn-refresh');
        const navRefreshMobile = document.getElementById('nav-btn-refresh-mobile');
        const spinIcons = [
            navRefresh?.querySelector('svg'),
            navRefreshMobile?.querySelector('svg')
        ];
        spinIcons.forEach(icon => icon?.classList.add('animate-spin'));
        if (navRefresh) navRefresh.disabled = true;
        if (navRefreshMobile) navRefreshMobile.disabled = true;

        try {
            if (this.currentScreen === 'filters') {
                this.showToast('جارٍ تحديث خيارات الفلاتر والمجموعات من سندباد...', 'info');
                await this.loadDynamicFilters();
            } else if (this.currentScreen === 'dashboard' || this.currentScreen === 'planning') {
                await this.refreshReport();
            } else if (this.currentScreen === 'login') {
                await this.runPageLoadSessionInit();
                this.showToast('تم فحص اتصال السيرفر وتحديث حالة الجلسة', 'info');
            } else {
                window.location.reload();
            }
        } catch (err) {
            console.error('Smart reload error:', err);
            if (err.isSessionExpired || (err.message && (err.message.includes('جلسة') || err.message.includes('الكوكي') || err.message.includes('401')))) {
                this.handleSessionExpired('انتهت جلسة تسجيل الدخول في سندباد (الكوكي غير صالح أو منتهي). تم تحويلك لتسجيل الدخول لتجديد الكوكي.');
            }
        } finally {
            spinIcons.forEach(icon => icon?.classList.remove('animate-spin'));
            if (navRefresh) navRefresh.disabled = false;
            if (navRefreshMobile) navRefreshMobile.disabled = false;
        }
    }

    async refreshReport() {
        const refreshBtns = [
            document.getElementById('btn-refresh-report'),
            document.getElementById('nav-btn-refresh'),
            document.getElementById('nav-btn-refresh-mobile')
        ];
        refreshBtns.forEach(btn => {
            if (btn) {
                const icon = btn.querySelector('svg');
                if (icon) icon.classList.add('animate-spin');
                btn.disabled = true;
            }
        });

        try {
            this.showToast('جاري إرسال طلب التحديث وجلب أحدث تقرير مبيعات ومخزون من سندباد...', 'info');

            // 1. Prepare parameters
            const d1El = document.getElementById('input-d1');
            const m1El = document.getElementById('input-m1');
            const y1El = document.getElementById('input-y1');
            const d2El = document.getElementById('input-d2');
            const m2El = document.getElementById('input-m2');
            const y2El = document.getElementById('input-y2');

            let d1 = d1El ? parseInt(d1El.value, 10) : NaN;
            let m1 = m1El ? parseInt(m1El.value, 10) : NaN;
            let y1 = y1El ? parseInt(y1El.value, 10) : NaN;
            let d2 = d2El ? parseInt(d2El.value, 10) : NaN;
            let m2 = m2El ? parseInt(m2El.value, 10) : NaN;
            let y2 = y2El ? parseInt(y2El.value, 10) : NaN;

            if (isNaN(d1) || isNaN(m1) || isNaN(y1) || isNaN(d2) || isNaN(m2) || isNaN(y2)) {
                if (this.lastReportParams && !isNaN(this.lastReportParams.d1)) {
                    d1 = this.lastReportParams.d1;
                    m1 = this.lastReportParams.m1;
                    y1 = this.lastReportParams.y1;
                    d2 = this.lastReportParams.d2;
                    m2 = this.lastReportParams.m2;
                    y2 = this.lastReportParams.y2;
                } else {
                    const now = new Date();
                    const tomorrow = new Date(now);
                    tomorrow.setDate(now.getDate() + 1);
                    d1 = now.getDate();
                    m1 = now.getMonth() + 1;
                    y1 = now.getFullYear();
                    d2 = tomorrow.getDate();
                    m2 = tomorrow.getMonth() + 1;
                    y2 = tomorrow.getFullYear();
                }
                if (d1El) d1El.value = d1;
                if (m1El) m1El.value = m1;
                if (y1El) y1El.value = y1;
                if (d2El) d2El.value = d2;
                if (m2El) m2El.value = m2;
                if (y2El) y2El.value = y2;
            }

            const params = {
                doc_id: document.getElementById('filter-doc-id')?.value || this.lastReportParams?.doc_id || 'all',
                salesman_id: document.getElementById('filter-salesman-id')?.value || this.lastReportParams?.salesman_id || 'all',
                store_id: document.getElementById('filter-store-id')?.value || this.lastReportParams?.store_id || '752',
                group_id: document.getElementById('filter-group-id')?.value || this.lastReportParams?.group_id || 'all',
                med_id: document.getElementById('filter-med-id')?.value || this.lastReportParams?.med_id || 'all',
                state_id: document.getElementById('filter-state-id')?.value || this.lastReportParams?.state_id || 'all',
                tax_id: document.getElementById('filter-tax-id')?.value || this.lastReportParams?.tax_id || 'all',
                d1, m1, y1, d2, m2, y2
            };

            this.lastReportParams = params;

            // Send actual network POST request to salez_report2.php
            const html = await this.network.fetchReportHTML(params);
            if (html) {
                this.loadHTMLContent(html, `تقرير سندباد الرسمي المحدّث (${d1}-${m1}-${y1} إلى ${d2}-${m2}-${y2})`);
            }

            // Also fetch/refresh store inventory in background/parallel (POST to medica_report2.php)
            try {
                await this.loadStoreInventory();
            } catch (invErr) {
                console.warn('Inventory refresh warning during report refresh:', invErr);
            }

            this.showToast('تم إرسال طلب التحديث وتحديث المبيعات والمخزون بنجاح من سندباد ✓', 'success');

        } catch (err) {
            console.error('Refresh error:', err);
            if (err.isSessionExpired || (err.message && (err.message.includes('جلسة') || err.message.includes('الكوكي') || err.message.includes('401')))) {
                this.handleSessionExpired('فشل تحديث التقرير لأن جلسة سندباد انتهت (الكوكي غير صالح أو منتهي). تم تحويلك لتسجيل الدخول لتجديد الكوكي.');
                return;
            }
            this.showToast('تعذر تحديث البيانات من سندباد (' + (err.message || 'خطأ اتصال') + ')', 'warning');
        } finally {
            refreshBtns.forEach(btn => {
                if (btn) {
                    const icon = btn.querySelector('svg');
                    if (icon) icon.classList.remove('animate-spin');
                    btn.disabled = false;
                }
            });
        }
    }

    renderCashReconciliation() {
        if (!this.currentViewData) return;
        const kpi = this.currentViewData.kpis;
        const expectedDrawer = kpi.drawerSales || 0;
        const fmt = (num) => (Number(num) || 0).toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        // 1. Update Expected Drawer
        const expEl = document.getElementById('recon-expected-drawer');
        if (expEl) expEl.textContent = `${fmt(expectedDrawer)} ج.م`;

        // 2. Keep actual input in sync if changed programmatically or on initial load
        const actualInput = document.getElementById('input-actual-cash');
        if (actualInput && this.actualCash !== null && actualInput.value === '') {
            actualInput.value = this.actualCash;
        }

        // 3. Render Expenses List
        const listContainer = document.getElementById('container-expenses-list');
        const badgeEl = document.getElementById('recon-expenses-badge');
        const totalExpensesEl = document.getElementById('recon-total-expenses');
        const sumExpenses = this.expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
        const cashOnRegister = Number(this.cashOnRegister) || 0;
        const sumWrongSales = (this.voidWrongSales || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

        if (badgeEl) badgeEl.textContent = `${this.expenses.length} بند`;
        if (totalExpensesEl) totalExpensesEl.textContent = `${fmt(sumExpenses)} ج.م`;

        if (listContainer) {
            if (this.expenses.length === 0) {
                listContainer.innerHTML = '<p class="text-slate-400 text-xs py-3 text-center">لم يتم تسجيل أي مصروفات حتى الآن.</p>';
            } else {
                listContainer.innerHTML = this.expenses.map(e => `
                    <div class="flex items-center justify-between py-1.5 px-2 bg-white rounded-lg border border-slate-200/80 hover:border-slate-300 text-xs">
                        <div class="flex items-center gap-2 min-w-0">
                            <span class="font-bold text-amber-900 font-mono text-sm">${fmt(e.amount)} ج.م</span>
                            <span class="text-slate-700 truncate font-medium">${e.note || 'مصروف'}</span>
                            <span class="text-[10px] text-slate-400 font-mono">${e.time || ''}</span>
                        </div>
                        <button type="button" class="btn-delete-expense text-slate-400 hover:text-rose-600 p-1 rounded transition" data-id="${e.id}" title="حذف هذا البند">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                `).join('');
            }
        }

        // 4. Evaluate Cash Comparison
        const resultBox = document.getElementById('reconcile-result-box');
        const diffIndicator = document.getElementById('recon-diff-indicator');
        const finalBanner = document.getElementById('reconcile-final-banner');
        const finalStatus = document.getElementById('reconcile-final-status');

        if (this.actualCash === null || isNaN(this.actualCash)) {
            if (diffIndicator) diffIndicator.textContent = 'الفرق: في انتظار الإدخال';
            if (resultBox) {
                resultBox.className = 'rounded-xl p-4 border transition-all duration-200 bg-slate-50 border-slate-200';
                resultBox.innerHTML = `
                    <div class="flex items-center gap-2.5 text-slate-600 text-xs">
                        <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        <span>أدخل المبلغ الفعلي الموجود في الدرج لمطابقته فوراً وكشف الفروقات وأسبابها.</span>
                    </div>
                `;
            }
            if (finalBanner && finalStatus) {
                finalBanner.className = 'rounded-xl p-2.5 text-xs font-bold transition flex items-center justify-between bg-slate-100 text-slate-700';
                finalStatus.textContent = 'في انتظار إدخال الكاش';
            }
            return;
        }

        const actual = Number(this.actualCash) || 0;
        const diff = actual - expectedDrawer; // positive: surplus, negative: shortage
        const totalReconciled = actual + sumExpenses + cashOnRegister + sumWrongSales;
        const reconciledDiff = totalReconciled - expectedDrawer;

        if (diffIndicator) {
            if (Math.abs(diff) < 0.01) {
                diffIndicator.innerHTML = '<span class="text-emerald-600">مطابق تماماً (0.00 ج.م)</span>';
            } else if (diff > 0) {
                diffIndicator.innerHTML = `<span class="text-blue-600">فائض: +${fmt(diff)} ج.م</span>`;
            } else {
                diffIndicator.innerHTML = `<span class="text-rose-600">عجز: -${fmt(Math.abs(diff))} ج.م</span>`;
            }
        }

        // Exact User-Requested Arabic Messages and Shortage Smart Hints
        if (resultBox) {
            if (Math.abs(diff) < 0.01) {
                // Exact Match
                resultBox.className = 'rounded-xl p-4 border transition-all duration-200 bg-emerald-50/90 border-emerald-300 text-emerald-950';
                resultBox.innerHTML = `
                    <div class="flex items-start gap-3">
                        <div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                        </div>
                        <div>
                            <h5 class="text-sm font-black text-emerald-900 mb-1">الفلوس تمام ومطابقة بالمليم! ✓</h5>
                            <p class="text-xs text-emerald-800 leading-relaxed">
                                نقدية الدرج الفعلية (${fmt(actual)} ج.م) مطابقة تماماً لمبيعات كاش الدرج المحسوبة من فواتير السيستم (${fmt(expectedDrawer)} ج.م). لا يوجد أي عجز أو زيادة في الوردية.
                            </p>
                        </div>
                    </div>
                `;
            } else if (diff > 0.01) {
                // Surplus (زيادة)
                resultBox.className = 'rounded-xl p-4 border transition-all duration-200 bg-blue-50/90 border-blue-300 text-blue-950';
                resultBox.innerHTML = `
                    <div class="flex items-start gap-3">
                        <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                        </div>
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                <h5 class="text-sm font-black text-blue-900">تنبيه: يوجد زيادة في نقدية الدرج بمبلغ (+${fmt(diff)} ج.م)</h5>
                                <span class="text-[10px] bg-blue-200 text-blue-900 font-bold px-2 py-0.5 rounded-full">فائض كاش</span>
                            </div>
                            <p class="text-xs text-blue-900/90 font-bold mb-2">الأسباب المحتملة لهذه الزيادة:</p>
                            <ul class="text-xs text-blue-950 space-y-1.5 list-disc list-inside bg-white/80 p-2.5 rounded-lg border border-blue-200">
                                <li><strong>ممكن تكون بيعت حاجة كاش ومتسجلتش على السيستم.</strong></li>
                                <li><strong>أو حد مديك فلوس حجز أو عربون مسبق (أمانات في الدرج).</strong></li>
                                <li><strong>أو خطأ غير مقصود في إرجاع باقي الحساب لأحد الزبائن.</strong></li>
                            </ul>
                        </div>
                    </div>
                `;
            } else {
                // Shortage (عجز / قليلة) with Smart Hints requested by user
                resultBox.className = 'rounded-xl p-3.5 border transition-all duration-200 bg-amber-50/90 border-amber-300 text-amber-950 space-y-2.5';
                resultBox.innerHTML = `
                    <div class="flex items-start gap-2.5">
                        <div class="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                        </div>
                        <div>
                            <div class="flex items-center gap-2 mb-0.5 flex-wrap">
                                <h5 class="text-xs sm:text-sm font-black text-amber-950">تنبيه: الفلوس قليلة وفيها نقص بمبلغ (-${fmt(Math.abs(diff))} ج.م)</h5>
                                <span class="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">عجز في كاش الدرج</span>
                            </div>
                            <p class="text-[11px] text-amber-900 font-medium">راجع الاحتمالات الذكية التالية لمعرفة وتفادي سبب النقص:</p>
                        </div>
                    </div>

                    <!-- Hint 1: بص على الكاش وقولي في كام -->
                    <div class="bg-white/95 border border-amber-200 rounded-xl p-2.5 shadow-xs">
                        <div class="flex items-start gap-2">
                            <span class="text-sm">💡</span>
                            <div class="flex-1">
                                <div class="flex items-center justify-between mb-1">
                                    <span class="text-xs font-black text-slate-800">1. بص على الكاش وقولي فيه كام؟</span>
                                    ${cashOnRegister > 0 ? `<span class="text-emerald-700 bg-emerald-50 border border-emerald-200 text-[10px] px-2 py-0.5 rounded-md font-mono font-bold">+${fmt(cashOnRegister)} ج.م مسجلة</span>` : ''}
                                </div>
                                <p class="text-[11px] text-slate-600 mb-2 leading-relaxed">
                                    ممكن يكون في فلوس لسه على ماكينة الكاش أو في فواتير معلقة أو بدرج ثاني ما اتحسبتش. اكتب المبلغ لتسويته:
                                </p>
                                <div class="flex items-center gap-2">
                                    <div class="relative w-32">
                                        <input id="input-cash-on-register" type="number" step="0.5" min="0" placeholder="المبلغ ع الكاش" value="${cashOnRegister > 0 ? cashOnRegister : ''}"
                                            class="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 rounded-lg px-2.5 py-1 text-xs font-bold font-mono outline-none">
                                        <span class="absolute left-2 top-1 text-[10px] text-slate-400">ج.م</span>
                                    </div>
                                    <button type="button" id="btn-save-cash-on-register" class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0">
                                        <span>حفظ كاش الكاشير</span>
                                    </button>
                                    ${cashOnRegister > 0 ? `
                                        <button type="button" id="btn-clear-cash-on-register" class="text-slate-400 hover:text-rose-600 text-xs px-1" title="مسح">✕</button>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Hint 2: أو إن في منتج اتسجل غلط ومتبعش -->
                    <div class="bg-white/95 border border-amber-200 rounded-xl p-2.5 shadow-xs">
                        <div class="flex items-start gap-2">
                            <span class="text-sm">⚠️</span>
                            <div class="flex-1">
                                <div class="flex items-center justify-between mb-1">
                                    <span class="text-xs font-black text-slate-800">2. أو إن في منتج اتسجل غلط على السيستم وماتبعش أصلاً!</span>
                                    ${sumWrongSales > 0 ? `<span class="text-rose-700 bg-rose-50 border border-rose-200 text-[10px] px-2 py-0.5 rounded-md font-mono font-bold">${fmt(sumWrongSales)} ج.م (${this.voidWrongSales.length} صنف)</span>` : ''}
                                </div>
                                <p class="text-[11px] text-slate-600 mb-2 leading-relaxed">
                                    ممكن يكون الكاشير ضرب صنف أو فاتورة بالخطأ على السيستم وماتسلمتش للزبون ولا دخلت فلوسها الدرج:
                                </p>
                                <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5">
                                    <div class="relative w-full sm:w-24">
                                        <input id="input-wrong-item-amount" type="number" step="0.5" min="0" placeholder="المبلغ"
                                            class="w-full bg-slate-50 border border-slate-300 focus:border-rose-600 rounded-lg px-2 py-1 text-xs font-bold font-mono outline-none">
                                        <span class="absolute left-1.5 top-1 text-[10px] text-slate-400">ج.م</span>
                                    </div>
                                    <input id="input-wrong-item-name" type="text" placeholder="اسم الصنف أو رقم الفاتورة المسجلة بالخطأ"
                                        class="flex-1 bg-slate-50 border border-slate-300 focus:border-rose-600 rounded-lg px-2.5 py-1 text-xs outline-none">
                                    <button type="button" id="btn-add-wrong-sale" class="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 shrink-0">
                                        <span>+ تسجيل كخطأ</span>
                                    </button>
                                </div>
                                ${this.voidWrongSales && this.voidWrongSales.length > 0 ? `
                                    <div class="mt-2 pt-2 border-t border-slate-100 space-y-1">
                                        ${this.voidWrongSales.map(item => `
                                            <div class="flex items-center justify-between py-1 px-2 bg-slate-50 rounded text-xs">
                                                <div class="flex items-center gap-2">
                                                    <span class="font-bold text-rose-700 font-mono">${fmt(item.amount)} ج.م</span>
                                                    <span class="text-slate-700">${item.note || 'صنف مسجل بالخطأ'}</span>
                                                    <span class="text-[10px] text-slate-400 font-mono">${item.time || ''}</span>
                                                </div>
                                                <button type="button" class="btn-delete-wrong-sale text-slate-400 hover:text-rose-600 p-0.5" data-id="${item.id}" title="حذف">✕</button>
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>

                    <!-- Hint 3: قولي صرفت إيه؟ -->
                    <div class="bg-white/95 border border-amber-200 rounded-xl p-2.5 shadow-xs">
                        <div class="flex items-start gap-2">
                            <span class="text-sm">🧾</span>
                            <div class="flex-1">
                                <h6 class="text-xs font-black text-slate-800 mb-0.5">3. قولي صرفت إيه؟</h6>
                                <p class="text-[11px] text-slate-600 leading-relaxed">
                                    سجل كل ما خرج من الدرج (بوفيه، عمالة، سلف، نثريات) في قائمة المصروفات على اليسار لتسوية العجز تلقائياً.
                                </p>
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        // Final Settlement Status
        if (finalBanner && finalStatus) {
            if (Math.abs(reconciledDiff) < 0.01) {
                finalBanner.className = 'rounded-xl p-2.5 text-xs font-bold transition flex items-center justify-between bg-emerald-100 text-emerald-900 border border-emerald-300';
                let breakdown = [`كاش درج: ${fmt(actual)}`];
                if (cashOnRegister > 0) breakdown.push(`ع الكاش: ${fmt(cashOnRegister)}`);
                if (sumExpenses > 0) breakdown.push(`مصروفات: ${fmt(sumExpenses)}`);
                if (sumWrongSales > 0) breakdown.push(`أخطاء تسجيل: ${fmt(sumWrongSales)}`);
                finalStatus.textContent = `تمت التسوية بنجاح 100%! (${breakdown.join(' + ')} = سيستم ${fmt(expectedDrawer)}) ✓`;
            } else if (reconciledDiff < -0.01) {
                finalBanner.className = 'rounded-xl p-2.5 text-xs font-bold transition flex items-center justify-between bg-rose-50 text-rose-800 border border-rose-300';
                finalStatus.textContent = `عجز متبقي: نقص ${fmt(Math.abs(reconciledDiff))} ج.م بعد احتساب الكاش والمصروفات والأصناف الخطأ!`;
            } else {
                finalBanner.className = 'rounded-xl p-2.5 text-xs font-bold transition flex items-center justify-between bg-blue-50 text-blue-900 border border-blue-300';
                finalStatus.textContent = `يوجد فائض: +${fmt(reconciledDiff)} ج.م بعد احتساب كافة التسويات!`;
            }
        }
    }

    renderDailyAnalysis() {
        if (!this.currentViewData) return;
        const kpis = this.currentViewData.kpis;
        const hourly = this.currentViewData.hourlyData || [];
        const items = this.currentViewData.itemsAggregated || [];
        const fmt = (num) => (Number(num) || 0).toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        const dates = this.currentViewData.dates || {};
        const isRange = this.lastFetchedDateMode === 'range' || (dates.allDates && dates.allDates.length > 2) || dates.isMultiDay;
        const daysCount = (dates.allDates && dates.allDates.length > 0) ? dates.allDates.length : 1;

        const sectionTitle = document.getElementById('analysis-section-title');
        const sectionBadge = document.getElementById('analysis-section-badge');
        if (sectionTitle) {
            sectionTitle.textContent = isRange
                ? `التحليل التنفيذي الذكي لأداء الفترة (${daysCount} يوم)`
                : `التحليل التنفيذي الذكي لأداء اليوم والوردية`;
        }
        if (sectionBadge) {
            sectionBadge.textContent = isRange ? `مؤشرات فترة مجمعة` : `تحليل ذكي ومؤشرات أداء`;
        }

        // 1. Peak Sales Hour
        let peakHour = null;
        let maxSales = -1;
        hourly.forEach(h => {
            if (h.sales > maxSales) {
                maxSales = h.sales;
                peakHour = h;
            }
        });

        const peakEl = document.getElementById('analysis-peak-hour');
        const peakDetailsEl = document.getElementById('analysis-peak-hour-details');
        if (peakEl && peakDetailsEl) {
            if (peakHour && peakHour.sales > 0) {
                const hourNum = parseInt(peakHour.hour, 10);
                const nextHour = (hourNum + 1) % 24;
                const fmtHour = (h) => {
                    const period = h >= 12 ? 'م' : 'ص';
                    const h12 = h % 12 === 0 ? 12 : h % 12;
                    return `${String(h12).padStart(2, '0')}:00 ${period}`;
                };
                peakEl.textContent = `${fmtHour(hourNum)} - ${fmtHour(nextHour)}`;
                peakDetailsEl.innerHTML = `مبيعات: <strong>${fmt(peakHour.sales)} ج.م</strong> (${peakHour.count} فاتورة)`;
            } else {
                peakEl.textContent = 'غير متوفر';
                peakDetailsEl.textContent = 'لا توجد بيانات ساعات كافية';
            }
        }

        // 2. Star Item (الأعلى إيراداً)
        const starEl = document.getElementById('analysis-star-item');
        const starDetailsEl = document.getElementById('analysis-star-item-details');
        if (starEl && starDetailsEl) {
            if (items.length > 0) {
                const sortedBySales = [...items].sort((a, b) => b.totalSales - a.totalSales);
                const star = sortedBySales[0];
                starEl.textContent = star.name;
                starEl.title = star.name;
                starDetailsEl.innerHTML = `إيراد: <strong>${fmt(star.totalSales)} ج.م</strong> (${star.totalQty} قطعة | ربح: ${fmt(star.totalProfit)} ج.م)`;
            } else {
                starEl.textContent = 'لا توجد أصناف';
                starDetailsEl.textContent = 'لا توجد مبيعات أصناف في هذا العرض';
            }
        }

        // 3. Basket Dynamics
        const basketEl = document.getElementById('analysis-basket-size');
        const basketDetailsEl = document.getElementById('analysis-basket-details');
        if (basketEl && basketDetailsEl) {
            const count = kpis.invoiceCount || 0;
            const avgItems = count > 0 ? (kpis.totalQty / count).toFixed(1) : '0.0';
            basketEl.textContent = `${avgItems} ق / فاتورة`;
            basketDetailsEl.innerHTML = `متوسط الفاتورة: <strong>${fmt(kpis.avgBasket)} ج.م</strong> (إجمالي ${kpis.totalQty} قطعة)`;
        }

        // 4. Payment Ratio
        const ratioEl = document.getElementById('analysis-payment-ratio');
        const ratioDetailsEl = document.getElementById('analysis-payment-details');
        if (ratioEl && ratioDetailsEl) {
            const total = kpis.netSales || 0;
            const cashPct = total > 0 ? ((kpis.drawerSales / total) * 100).toFixed(0) : '0';
            const bankPct = total > 0 ? ((kpis.bankSales / total) * 100).toFixed(0) : '0';
            ratioEl.textContent = `${cashPct}% كاش / ${bankPct}% بنك`;
            ratioDetailsEl.innerHTML = `كاش درج: <strong>${fmt(kpis.drawerSales)} ج.م</strong> | بنكي: <strong>${fmt(kpis.bankSales)} ج.م</strong>`;
        }

        // 5. Executive Summary Narrative
        const narrativeEl = document.getElementById('analysis-executive-narrative');
        if (narrativeEl) {
            if (kpis.invoiceCount === 0) {
                narrativeEl.textContent = 'لا توجد أي فواتير مسجلة في هذا العرض.';
            } else {
                const topItem = items.length > 0 ? [...items].sort((a, b) => b.totalSales - a.totalSales)[0] : null;
                const marginQuality = kpis.profitMargin >= 30 ? 'ممتاز وقوي' : (kpis.profitMargin >= 20 ? 'جيد ومستقر' : 'منخفض نسبياً ويتطلب مراجعة التكاليف');
                
                if (isRange) {
                    const avgDaily = Math.round(kpis.netSales / daysCount);
                    narrativeEl.innerHTML = `
                        سجلت الفترة المجمعة صافي مبيعات إجمالي قدره <strong>${fmt(kpis.netSales)} ج.م</strong> عبر <strong>${daysCount}</strong> يوم عمل بمتوسط مبيعات يومية <strong>${fmt(avgDaily)} ج.م/يوم</strong> من خلال <strong>${kpis.invoiceCount}</strong> فاتورة بإجمالي <strong>${kpis.totalQty}</strong> قطعة مباعة. 
                        بلغ صافي الربح المحقق <strong>${fmt(kpis.netProfit)} ج.م</strong> بهامش ربح <strong>${kpis.profitMargin}%</strong> (${marginQuality}).
                        ${topItem ? `تصدر صنف <span class="font-bold text-blue-700">"${topItem.name}"</span> قائمة المبيعات بمساهمة قدرها <strong>${topItem.salesShare}%</strong> من إجمالي مبيعات الفترة.` : ''}
                        بلغت مبيعات كاش الدرج <strong>${fmt(kpis.drawerSales)} ج.م</strong> ومبيعات البنك <strong>${fmt(kpis.bankSales)} ج.م</strong>، وبلغ نصيب فلوس الخير المخصصة <strong>${fmt(kpis.charityAmount)} ج.م</strong> بواقع 5 جنيه لكل قطعة مباعة.
                    `;
                } else {
                    narrativeEl.innerHTML = `
                        سجلت الوردية صافي مبيعات قدره <strong>${fmt(kpis.netSales)} ج.م</strong> من خلال <strong>${kpis.invoiceCount}</strong> فاتورة بإجمالي <strong>${kpis.totalQty}</strong> قطعة مباعة. 
                        بلغ صافي الربح المحقق <strong>${fmt(kpis.netProfit)} ج.م</strong> بهامش ربح <strong>${kpis.profitMargin}%</strong> (${marginQuality}).
                        ${topItem ? `تصدر صنف <span class="font-bold text-blue-700">"${topItem.name}"</span> قائمة المبيعات بمساهمة قدرها <strong>${topItem.salesShare}%</strong> من إجمالي دخل الشيفت.` : ''}
                        بلغت مبيعات كاش الدرج <strong>${fmt(kpis.drawerSales)} ج.م</strong>، وبلغ نصيب فلوس الخير المخصصة <strong>${fmt(kpis.charityAmount)} ج.م</strong> محسوبة بواقع 5 جنيه لكل قطعة مباعة.
                    `;
                }
            }
        }
    }

    renderCharts() {
        if (!this.currentViewData) return;
        const topTitle = document.getElementById('chart-top-items-title');
        if (topTitle) {
            const isRange = this.lastFetchedDateMode === 'range' || (this.currentViewData?.dates?.allDates && this.currentViewData.dates.allDates.length > 2) || this.currentViewData?.dates?.isMultiDay;
            topTitle.textContent = isRange ? 'أعلى 10 أصناف أداءً في الفترة' : 'أعلى 10 أصناف أداءً في الشيفت';
        }
        this.charts.renderHourly('chart-hourly', this.currentViewData.hourlyData);
        this.charts.renderTopItems('chart-top-items', this.currentViewData.itemsAggregated, this.topItemsMetric);
        this.charts.renderPaymentBreakdown('chart-payment-breakdown', this.currentViewData.kpis);
    }

    renderAnomalies() {
        const anom = this.currentViewData.anomalies;

        this.setElText('badge-anom-prices', anom.priceDiscrepancies.length);
        this.setElText('badge-anom-duplicates', anom.duplicateItemsInInvoice.length);
        this.setElText('badge-anom-lowmargin', anom.lowMarginItems.length);
        this.setElText('badge-anom-prevshift', anom.previousShiftInvoices.length);

        // 1. Price Discrepancies Container
        const pricesContainer = document.getElementById('container-anom-prices');
        if (pricesContainer) {
            if (anom.priceDiscrepancies.length === 0) {
                pricesContainer.innerHTML = '<p class="text-emerald-600 text-xs py-3 text-center font-bold">✓ لا توجد أي فروق أسعار بدون خصم.</p>';
            } else {
                pricesContainer.innerHTML = anom.priceDiscrepancies.map(p => `
                    <div class="border border-amber-200 bg-amber-50 rounded-xl p-2.5 text-xs">
                        <div class="flex items-center justify-between mb-1">
                            <span class="font-bold text-slate-800">${p.name} <code class="text-[10px] bg-amber-100 px-1 py-0.5 rounded">${p.code}</code></span>
                            <span class="text-rose-700 font-bold text-[11px]">فارق ضائع: ${p.lostVariance.toFixed(2)}</span>
                        </div>
                        <div class="text-slate-600 mb-1 text-[11px]">
                            الأسعار المسجلة: <strong>${p.distinctPrices.map(pr => pr.toFixed(2)).join(' | ')}</strong>
                        </div>
                        <div class="max-h-20 overflow-y-auto space-y-1 bg-white p-1.5 rounded border border-amber-100">
                            ${p.occurrences.map(o => `
                                <div class="flex justify-between text-[10px] text-slate-500">
                                    <span>${o.invoiceNo} (${o.time})</span>
                                    <span>السعر: <strong>${o.unitPrice.toFixed(2)}</strong></span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('');
            }
        }

        // 2. Duplicate Items
        const dupesContainer = document.getElementById('container-anom-duplicates');
        if (dupesContainer) {
            if (anom.duplicateItemsInInvoice.length === 0) {
                dupesContainer.innerHTML = '<p class="text-emerald-600 text-xs py-3 text-center font-bold">✓ لا يوجد تكرار لنفس الصنف داخل نفس الفاتورة.</p>';
            } else {
                dupesContainer.innerHTML = anom.duplicateItemsInInvoice.map(d => `
                    <div class="border border-indigo-200 bg-indigo-50 rounded-xl p-2.5 text-xs">
                        <div class="flex justify-between items-center mb-1">
                            <span class="font-bold text-slate-800">فاتورة: ${d.invoiceNo}</span>
                            <span class="text-indigo-700 font-bold text-[11px]">${d.rowCount} أسطر لنفس الصنف</span>
                        </div>
                        <div class="text-slate-600 text-[11px]">
                            ${d.itemName} | إجمالي الكمية: <strong>${d.totalQty}</strong> (${d.time})
                        </div>
                    </div>
                `).join('');
            }
        }

        // 3. Low Margin Items
        const lowMarginContainer = document.getElementById('container-anom-lowmargin');
        if (lowMarginContainer) {
            if (anom.lowMarginItems.length === 0) {
                lowMarginContainer.innerHTML = '<p class="text-emerald-600 text-xs py-3 text-center font-bold">✓ جميع الأصناف تحقق هامش ربح أعلى من 20%.</p>';
            } else {
                lowMarginContainer.innerHTML = anom.lowMarginItems.map(m => `
                    <div class="border border-rose-200 bg-rose-50 rounded-xl p-2.5 text-xs">
                        <div class="flex justify-between items-center mb-1">
                            <span class="font-bold text-slate-800">${m.name}</span>
                            <span class="text-rose-700 font-bold text-[11px]">الهامش: ${m.overallMargin}%</span>
                        </div>
                        <div class="flex justify-between text-[11px] text-slate-600 mt-1 bg-white p-1 rounded">
                            <span>المبيعات: <strong>${m.totalSales.toFixed(2)}</strong></span>
                            <span>الربح: <strong class="text-rose-600">${m.totalProfit.toFixed(2)}</strong></span>
                        </div>
                    </div>
                `).join('');
            }
        }

        // 4. Excluded Dawn Invoices
        const prevShiftContainer = document.getElementById('container-anom-prevshift');
        if (prevShiftContainer) {
            if (anom.previousShiftInvoices.length === 0) {
                prevShiftContainer.innerHTML = '<p class="text-slate-400 text-xs py-3 text-center">لا توجد فواتير مسجلة في فجر اليوم الأول قبل ساعة انتهاء الوردية.</p>';
            } else {
                const totalExcludedSales = anom.previousShiftInvoices.reduce((a, c) => a + c.totalNet, 0);
                prevShiftContainer.innerHTML = `
                    <div class="text-[11px] text-slate-600 mb-2">
                        تم رصد <strong>${anom.previousShiftInvoices.length}</strong> فاتورة بقيمة إجمالية <strong>${totalExcludedSales.toFixed(2)}</strong> تتبع سهرة الأمس:
                    </div>
                    <div class="max-h-40 overflow-y-auto space-y-1">
                        ${anom.previousShiftInvoices.map(s => `
                            <div class="border border-slate-200 p-1.5 rounded-lg text-xs flex justify-between items-center bg-white">
                                <div>
                                    <span class="font-bold text-slate-800">${s.invoiceNo}</span>
                                    <span class="text-slate-400 text-[10px] mr-1">(${s.time})</span>
                                </div>
                                <span class="text-blue-600 font-bold">${s.totalNet.toFixed(2)}</span>
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

        if (this.itemsSearch) {
            items = items.filter(i => 
                i.name.toLowerCase().includes(this.itemsSearch) ||
                i.code.toLowerCase().includes(this.itemsSearch)
            );
        }

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
            tbody.innerHTML = '<tr><td colspan="11" class="text-center py-6 text-slate-400">لا توجد أصناف مطابقة لبحثك</td></tr>';
            return;
        }

        tbody.innerHTML = pageItems.map(item => `
            <tr class="hover:bg-slate-50 transition border-b border-slate-100 text-xs">
                <td class="px-3 py-2 font-mono text-slate-500">${item.code}</td>
                <td class="px-3 py-2 font-medium text-slate-900">${item.name}</td>
                <td class="px-3 py-2 text-center font-bold">${item.orderCount}</td>
                <td class="px-3 py-2 text-center font-bold">${item.totalQty}</td>
                <td class="px-3 py-2 text-center font-bold text-emerald-700 bg-emerald-50/50">${(item.charityAmount || (item.totalQty * 5)).toFixed(2)}</td>
                <td class="px-3 py-2 text-left font-bold text-blue-600">${item.totalSales.toFixed(2)}</td>
                <td class="px-3 py-2 text-left text-slate-600">${item.totalCost.toFixed(2)}</td>
                <td class="px-3 py-2 text-left font-bold text-emerald-600">${item.totalProfit.toFixed(2)}</td>
                <td class="px-3 py-2 text-center font-bold ${item.profitMargin < 20 ? 'text-rose-600' : 'text-slate-700'}">
                    ${item.profitMargin.toFixed(1)}%
                </td>
                <td class="px-3 py-2 text-center text-slate-500">${item.salesShare.toFixed(1)}%</td>
                <td class="px-3 py-2 text-center text-slate-500">${item.profitShare.toFixed(1)}%</td>
            </tr>
        `).join('');

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
        const mobileContainer = document.getElementById('container-invoices-mobile');
        if (!this.currentViewData) return;

        let rows = [...this.currentViewData.filteredItems];

        if (this.invoicesSearch) {
            rows = rows.filter(r => 
                r.invoiceNo.toLowerCase().includes(this.invoicesSearch) ||
                r.itemName.toLowerCase().includes(this.invoicesSearch) ||
                r.itemCode.toLowerCase().includes(this.invoicesSearch)
            );
        }

        if (this.invoicesPaymentFilter !== 'all') {
            rows = rows.filter(r => r.payment === this.invoicesPaymentFilter);
        }

        if (this.invoicesMovementFilter === 'returns') {
            rows = rows.filter(r => r.isReturn);
        } else if (this.invoicesMovementFilter === 'sales') {
            rows = rows.filter(r => !r.isReturn);
        }

        const totalRows = rows.length;
        const totalPages = Math.ceil(totalRows / this.invoicesPerPage) || 1;
        this.invoicesPage = Math.min(this.invoicesPage, totalPages);

        const startIdx = (this.invoicesPage - 1) * this.invoicesPerPage;
        const pageRows = rows.slice(startIdx, startIdx + this.invoicesPerPage);

        this.setElText('invoices-count-display', `${totalRows} سطر فاتورة`);
        this.setElText('invoices-page-info', `الصفحة ${this.invoicesPage} من ${totalPages}`);

        // 1. Desktop Table
        if (tbody) {
            if (pageRows.length === 0) {
                tbody.innerHTML = '<tr><td colspan="13" class="text-center py-6 text-slate-400">لا توجد سطور فواتير مطابقة لبحثك</td></tr>';
            } else {
                tbody.innerHTML = pageRows.map(row => {
                    const isRet = row.isReturn;
                    return `
                    <tr class="${isRet ? 'bg-rose-50/70 hover:bg-rose-100/70 text-rose-950 font-medium' : 'hover:bg-slate-50 text-slate-800'} transition border-b border-slate-100 text-xs">
                        <td class="px-2 py-2 text-center text-slate-400 font-mono">${row.seq}</td>
                        <td class="px-2.5 py-2 text-slate-500">${row.date}</td>
                        <td class="px-2.5 py-2 font-mono font-semibold text-slate-700">${row.time}</td>
                        <td class="px-2.5 py-2 font-mono font-bold ${isRet ? 'text-rose-700' : 'text-blue-700'}">${row.invoiceNo}</td>
                        <td class="px-2.5 py-2">
                            ${isRet ? '<span class="bg-rose-200 text-rose-900 font-bold px-2 py-0.5 rounded-full text-[10px]">مرتجع</span>' : '<span class="text-slate-500">' + row.movement + '</span>'}
                        </td>
                        <td class="px-2.5 py-2 font-medium ${isRet ? 'text-rose-950 font-bold' : 'text-slate-900'}">${row.itemName}</td>
                        <td class="px-2 py-2 text-center font-bold ${isRet ? 'text-rose-600 font-mono' : ''}">${isRet ? '-' : ''}${row.quantity}</td>
                        <td class="px-2 py-2 text-center text-slate-500">${row.unit}</td>
                        <td class="px-2 py-2 text-left">${row.unitPrice.toFixed(2)}</td>
                        <td class="px-2 py-2 text-center text-slate-500">${row.rawDiscount || '0.00%'}</td>
                        <td class="px-2 py-2 text-left font-bold ${isRet ? 'text-rose-600 font-mono' : 'text-blue-600'}">${isRet ? '-' : ''}${row.total.toFixed(2)}</td>
                        <td class="px-2 py-2 text-left font-bold ${isRet ? 'text-rose-600 font-mono' : 'text-emerald-600'}">${isRet ? '-' : ''}${row.profit.toFixed(2)}</td>
                        <td class="px-2 py-2 text-center">
                            <span class="px-1.5 py-0.5 rounded text-[10px] font-bold ${row.payment === 'البنك' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'}">
                                ${row.payment}
                            </span>
                        </td>
                    </tr>
                    `;
                }).join('');
            }
        }

        // 2. Mobile Responsive Cards
        if (mobileContainer) {
            if (pageRows.length === 0) {
                mobileContainer.innerHTML = '<p class="text-center py-6 text-slate-400 text-xs">لا توجد سطور مطابقة</p>';
            } else {
                mobileContainer.innerHTML = pageRows.map(row => {
                    const isRet = row.isReturn;
                    return `
                    <div class="${isRet ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'} border rounded-xl p-3 text-xs space-y-1.5 shadow-2xs">
                        <div class="flex items-center justify-between">
                            <span class="font-mono font-black ${isRet ? 'text-rose-700' : 'text-blue-700'} text-sm">${row.invoiceNo} ${isRet ? '<span class="bg-rose-200 text-rose-900 text-[10px] px-1.5 py-0.5 rounded font-bold">مرتجع</span>' : ''}</span>
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${row.payment === 'البنك' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'}">${row.payment}</span>
                        </div>
                        <div class="font-bold text-slate-900 text-xs">${row.itemName}</div>
                        <div class="flex items-center justify-between text-slate-500 text-[11px]">
                            <span>${row.date} • <strong class="text-slate-700">${row.time}</strong></span>
                            <span>الكمية: <strong class="${isRet ? 'text-rose-600 font-bold' : 'text-slate-800'}">${isRet ? '-' : ''}${row.quantity} ${row.unit}</strong></span>
                        </div>
                        <div class="flex items-center justify-between pt-1 border-t border-slate-200">
                            <span class="text-slate-600">السعر: ${row.unitPrice.toFixed(2)}</span>
                            <span class="font-bold ${isRet ? 'text-rose-600' : 'text-blue-700'}">${isRet ? '-' : ''}${row.total.toFixed(2)} ج.م</span>
                        </div>
                    </div>
                    `;
                }).join('');
            }
        }

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

    updateNetworkStatus(statusObj) {
        const loginText = document.getElementById('login-progress-text');
        const reportText = document.getElementById('fetch-report-progress-text');
        if (loginText) loginText.textContent = statusObj.message;
        if (reportText) reportText.textContent = statusObj.message;
    }

    handleCorsBlock(info) {
        this.showToast('تنبيه أمان المتصفح (CORS): تمنع المتصفحات الطلب المباشر من نطاق خارجي. استخدم السيرفر المحلي (server.ps1).', 'error');
    }

    applySettingsToUI() {
        const cutoffSelect = document.getElementById('cutoff-hour-select');
        const settingCutoff = document.getElementById('setting-cutoff-hour');
        if (cutoffSelect) cutoffSelect.value = String(this.cutoffHour);
        if (settingCutoff) settingCutoff.value = String(this.cutoffHour);

        const proxyInput = document.getElementById('setting-cors-proxy');
        if (proxyInput) proxyInput.value = this.settings.corsProxy || '';
    }

    async loadStoreInventoryFromCache() {
        try {
            const cachedHtml = localStorage.getItem('kabaka_store_inventory_html');
            if (cachedHtml) {
                this.rawInventoryHtml = cachedHtml;
                this.inventoryData = InventoryParser.parse(cachedHtml);
                if (this.currentViewData) this.renderInventoryReorder();
                this.renderPurchasePlanning();
                return;
            }
            // Fetch local test_medica.html as baseline
            const resp = await fetch('./test_medica.html');
            if (resp.ok) {
                const html = await resp.text();
                this.rawInventoryHtml = html;
                this.inventoryData = InventoryParser.parse(html);
                localStorage.setItem('kabaka_store_inventory_html', html);
                if (this.currentViewData) this.renderInventoryReorder();
                this.renderPurchasePlanning();
            }
        } catch (e) {
            console.warn('Could not load cached inventory:', e);
        }
    }

    async loadStoreInventory() {
        const fetchBtn = document.getElementById('btn-fetch-inventory');
        const fetchIcon = document.getElementById('icon-fetch-inventory');
        if (fetchBtn) fetchBtn.disabled = true;
        if (fetchIcon) fetchIcon.classList.add('animate-spin');

        try {
            this.showToast('جاري الاتصال بـ medica_report2.php وجلب مخزون المحل...', 'info');
            const html = await this.network.fetchStoreInventory({
                store_id: '752',
                group_id: 'all',
                importer_id: 'all',
                state_id: '1'
            });

            this.rawInventoryHtml = html;
            this.inventoryData = InventoryParser.parse(html);
            localStorage.setItem('kabaka_store_inventory_html', html);

            const badge = document.getElementById('inventory-status-badge');
            if (badge) {
                badge.className = 'text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full';
                badge.textContent = 'مخزون محدث ومباشر ✓';
            }

            this.renderInventoryReorder();
            this.renderPurchasePlanning();
            this.showToast(`تم تحديث مخزون المحل بنجاح (${this.inventoryData.items.length} صنف)!`, 'success');
        } catch (err) {
            console.error('Inventory fetch error:', err);
            this.showToast('تعذر جلب مخزون المحل: ' + (err.message || 'خطأ غير معروف'), 'error');
        } finally {
            if (fetchBtn) fetchBtn.disabled = false;
            if (fetchIcon) fetchIcon.classList.remove('animate-spin');
        }
    }

    renderInventoryReorder() {
        if (!this.inventoryData) {
            this.loadStoreInventoryFromCache();
            return;
        }

        const salesAgg = this.currentViewData ? this.currentViewData.itemsAggregated : [];
        const analysis = InventoryDemandAnalyzer.analyze(this.inventoryData.items, salesAgg);

        const fmt = (num) => (Number(num) || 0).toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        // Update Summary Cards
        this.setElText('reorder-urgent-count', analysis.urgentItems.length);
        this.setElText('reorder-shortage-limit-count', analysis.shortageLimitItems.length);
        this.setElText('reorder-suggested-units', analysis.totalSuggestedUnits.toLocaleString('ar-EG'));
        this.setElText('inventory-total-items-count', this.inventoryData.meta.count || analysis.items.length);
        
        const totalValEl = document.getElementById('inventory-total-value-display');
        if (totalValEl) {
            totalValEl.textContent = `القيمة: ${fmt(this.inventoryData.meta.totalSalesValue)} ج.م`;
        }

        // Update Advice Text
        const adviceTextEl = document.getElementById('reorder-advice-text');
        if (adviceTextEl) {
            if (analysis.urgentItems.length > 0) {
                adviceTextEl.innerHTML = `
                    تم رصد <strong class="text-rose-700 underline font-black text-sm">${analysis.urgentItems.length}</strong> منتج ناقص بالمحل وعليه سحب ومبيعات حالية!
                    يوصى فوراً بطلب وتوريد إجمالي <strong class="text-blue-700 font-black text-sm">${analysis.totalSuggestedUnits}</strong> قطعة بتكلفة شراء تقديرية <strong class="text-emerald-700 font-black text-sm">${fmt(analysis.totalEstimatedRestockCost)} ج.م</strong> لتفادي نفاد البضاعة وضياع الزبائن غداً.
                `;
            } else if (analysis.shortageLimitItems.length > 0) {
                adviceTextEl.innerHTML = `
                    لا توجد أصناف نفدت اليوم، ولكن يوجد <strong class="text-amber-800 font-bold">${analysis.shortageLimitItems.length}</strong> صنف بالمحل وصل رصيده إلى حد النواقص المحدد بالسيستم، ينصح بمراجعتها.
                `;
            } else {
                adviceTextEl.textContent = 'أرصدة الأصناف المباعة كافية وتغطي حركة السحب الحالية بأمان تام ✓';
            }
        }

        // Filter items
        let rows = analysis.items;
        if (this.reorderFilter === 'urgent') {
            rows = rows.filter(i => i.urgency === 'CRITICAL' || (i.urgency === 'HIGH' && i.soldQty > 0));
        } else if (this.reorderFilter === 'shortage_limit') {
            rows = rows.filter(i => i.reorderLimit > 0 && i.stock <= i.reorderLimit);
        }

        // Search filter
        if (this.reorderSearch) {
            const q = this.reorderSearch;
            rows = rows.filter(i => 
                (i.name && i.name.toLowerCase().includes(q)) ||
                (i.code && i.code.toLowerCase().includes(q)) ||
                (i.group && i.group.toLowerCase().includes(q))
            );
        }

        // Sort: Most urgent first, then highest sold, then lowest stock
        rows.sort((a, b) => {
            const urgencyWeight = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, NORMAL: 1 };
            const uA = urgencyWeight[a.urgency] || 1;
            const uB = urgencyWeight[b.urgency] || 1;
            if (uB !== uA) return uB - uA;
            if (b.soldQty !== a.soldQty) return b.soldQty - a.soldQty;
            return a.stock - b.stock;
        });

        const tbody = document.getElementById('tbody-reorder');
        const countInfo = document.getElementById('reorder-count-info');
        if (countInfo) countInfo.textContent = `عرض ${rows.length} صنف`;

        if (!tbody) return;

        if (rows.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="10" class="text-center py-8 text-slate-400">
                        <div class="flex flex-col items-center justify-center gap-2">
                            <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <span class="font-bold text-slate-700">لا توجد نواقص مطابقة لمعايير الفلتر الحالية</span>
                            <span class="text-[11px] text-slate-400">أرصدة الأصناف كافية ومستقرة</span>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = rows.map(item => {
            let stockBadge = 'bg-emerald-100 text-emerald-800';
            if (item.stock <= 0) stockBadge = 'bg-rose-600 text-white font-black animate-pulse';
            else if (item.stock === 1) stockBadge = 'bg-rose-100 text-rose-800 font-bold border border-rose-300';
            else if (item.stock <= 3) stockBadge = 'bg-amber-100 text-amber-800 font-bold';

            const hasSales = item.soldQty > 0;
            const linkHref = item.medId ? `https://siindbad.com/sys/app/medicas.php?med_id=${item.medId}` : '#';

            return `
                <tr class="hover:bg-slate-50 transition border-b border-slate-100 ${item.urgency === 'CRITICAL' ? 'bg-rose-50/40' : ''}">
                    <td class="px-3 py-2.5 font-mono font-bold text-slate-600">${item.code || '-'}</td>
                    <td class="px-3 py-2.5 font-bold text-slate-900">
                        ${item.medId ? `<a href="${linkHref}" target="_blank" class="text-blue-700 hover:underline">${item.name}</a>` : item.name}
                    </td>
                    <td class="px-3 py-2.5 text-slate-600">${item.group || '-'}</td>
                    <td class="px-3 py-2.5 text-center">
                        <span class="inline-block px-2 py-0.5 rounded-full font-mono font-bold text-xs ${stockBadge}">
                            ${item.stock} ${item.unit || 'ق'}
                        </span>
                    </td>
                    <td class="px-3 py-2.5 text-center font-mono text-slate-500">${item.reorderLimit}</td>
                    <td class="px-3 py-2.5 text-center">
                        ${hasSales ? `
                            <span class="font-black text-rose-700 bg-rose-100/90 px-2 py-0.5 rounded-md font-mono">
                                ${item.soldQty} ق مباعة
                            </span>
                        ` : `<span class="text-slate-400">0</span>`}
                    </td>
                    <td class="px-3 py-2.5 text-center">
                        <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] ${item.urgencyBadge}">
                            ${item.urgencyLabel}
                        </span>
                    </td>
                    <td class="px-3 py-2.5 text-center bg-rose-50/50">
                        ${item.suggestedQty > 0 ? `
                            <span class="font-black text-rose-700 font-mono text-sm">
                                +${item.suggestedQty} قطعة
                            </span>
                        ` : `<span class="text-emerald-700 font-bold text-xs">✓ كافي</span>`}
                    </td>
                    <td class="px-3 py-2.5 text-left font-mono font-medium text-slate-700">${fmt(item.price)}</td>
                    <td class="px-3 py-2.5 text-left font-mono font-bold ${item.suggestedQty > 0 ? 'text-amber-800' : 'text-slate-400'}">
                        ${item.suggestedQty > 0 ? fmt(item.estimatedCost) + ' ج.م' : '-'}
                    </td>
                </tr>
            `;
        }).join('');
    }

    exportReorderExcel() {
        if (!this.inventoryData) {
            this.showToast('لا توجد بيانات مخزون للتصدير', 'error');
            return;
        }
        const salesAgg = this.currentViewData ? this.currentViewData.itemsAggregated : [];
        const analysis = InventoryDemandAnalyzer.analyze(this.inventoryData.items, salesAgg);
        const exportItems = analysis.items.filter(i => i.suggestedQty > 0 || i.soldQty > 0);
        if (exportItems.length === 0) {
            this.showToast('لا توجد مقترحات شراء حالياً لتصديرها', 'info');
            return;
        }
        ExportManager.exportReorderToCSV(exportItems, `كشف_طلبية_شراء_نواقص_KABAKA_${new Date().toISOString().slice(0, 10)}.csv`);
        this.showToast('تم تصدير كشف طلبية الشراء والنواقص بنجاح!', 'success');
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
        toast.className = 'fixed bottom-5 left-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold transition-all transform duration-300';

        if (type === 'success') {
            toast.classList.add('bg-emerald-600', 'text-white');
        } else if (type === 'error') {
            toast.classList.add('bg-rose-600', 'text-white');
        } else {
            toast.classList.add('bg-slate-900', 'text-white');
        }

        toast.classList.remove('translate-y-20', 'opacity-0', 'hidden');

        setTimeout(() => {
            toast.classList.add('translate-y-20', 'opacity-0');
            setTimeout(() => toast.classList.add('hidden'), 300);
        }, 4000);
    }

    renderPurchasePlanning() {
        const safeNum = PurchasePlanningEngine.safeNum;
        let baseDateStr = '';
        if (this.currentViewData && this.currentViewData.meta && this.currentViewData.meta.endDate) {
            baseDateStr = this.currentViewData.meta.endDate;
        } else if (this.parsedData && this.parsedData.meta && this.parsedData.meta.endDate) {
            baseDateStr = this.parsedData.meta.endDate;
        }
        
        const cycleRange = PurchasePlanningEngine.getThursdayCycleRange(baseDateStr);

        const cycleDatesEl = document.getElementById('plan-cycle-dates');
        const cycleDaysBadge = document.getElementById('plan-cycle-days-badge');
        if (cycleDatesEl) cycleDatesEl.textContent = `من الخميس ${cycleRange.startDateStr} إلى ${cycleRange.endDateStr}`;
        if (cycleDaysBadge) cycleDaysBadge.textContent = `${cycleRange.cycleDays} أيام عمل`;

        let salesItems = [];
        if (this.cycleReportData && this.cycleReportData.items && this.cycleReportData.items.length > 0) {
            salesItems = this.cycleReportData.items;
        } else if (this.currentViewData && this.currentViewData.itemsAggregated) {
            salesItems = this.currentViewData.itemsAggregated;
        } else if (this.parsedData && this.parsedData.items) {
            salesItems = this.parsedData.items;
        }

        let inventoryItems = [];
        if (this.inventoryData && this.inventoryData.items) {
            inventoryItems = this.inventoryData.items;
        } else {
            this.loadStoreInventoryFromCache();
        }

        // Total store capital input (رأس مال المحل الكلي - الافتراضي 168 ألف)
        const totalCapInput = document.getElementById('input-store-total-capital');
        const totalStoreCapital = totalCapInput ? (parseFloat(totalCapInput.value) || 168000) : 168000;

        const plan = PurchasePlanningEngine.generatePlan({
            salesItems,
            inventoryItems,
            cycleDays: cycleRange.cycleDays,
            totalStoreCapital,
            availableCash: null
        });
        this.planningPlan = plan;

        const fmt = (num) => (safeNum(num, 0)).toLocaleString('ar-EG', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

        // 1. Working Capital & Live Inventory Equation
        const cap = plan.capital;
        this.setElText('eq-total-capital', fmt(cap.totalCapital));
        this.setElText('eq-stock-cost', fmt(cap.totalStockCost));
        this.setElText('eq-stock-ninja-split', `منها ${fmt(cap.ninjaStockCost)} ج ننجا (${cap.ninjaStockUnits} ترنج) + ${fmt(cap.restStockCost)} ج لباقي شغل المحل`);
        this.setElText('eq-available-cash', fmt(cap.autoAvailableCash));
        this.setElText('eq-cash-split', `${fmt(cap.ninjaRemainingCeiling)} ج باقي الـ 20 ألف + ${fmt(cap.restCashAvailable)} ج لباقي الشغل`);

        // Ninja Box (سقف 20 ألف)
        this.setElText('ninja-box-stock', `${cap.ninjaStockUnits} ترنج`);
        this.setElText('ninja-box-stock-cost', `${fmt(cap.ninjaStockCost)} ج`);
        this.setElText('ninja-box-remaining', `${fmt(cap.ninjaRemainingCeiling)} ج.م`);
        this.setElText('ninja-box-decision', `${cap.ninjaSeries} سيريهات`);
        this.setElText('ninja-box-decision-cost', `${cap.ninjaUnits} ترنج = ${fmt(cap.ninjaPurchaseCost)} ج`);
        const ninjaExpl = document.getElementById('ninja-box-explanation');
        if (ninjaExpl) {
            ninjaExpl.innerHTML = `السِري 4 قطع (L إلى 3XL) بسعر جملة 550 ج = 2,200 ج للسري. تشتري <strong>${cap.ninjaSeries} سيريهات كاملة</strong> بـ <strong>${fmt(cap.ninjaPurchaseCost)} ج</strong> من أصل ${fmt(cap.ninjaRemainingCeiling)} ج، ويتبقى فائض <strong>${fmt(cap.ninjaBuffer)} ج</strong> كاش محمي بالدرج.`;
        }

        // Rest of Store Box (سقف 148 ألف)
        this.setElText('rest-box-stock', `${fmt(cap.restStockCost)} ج`);
        this.setElText('rest-box-cash', `${fmt(cap.restCashAvailable)} ج.م`);
        this.setElText('rest-box-series', `${plan.recommendation.restSeries} سيريهات كاملة`);
        this.setElText('rest-box-series-cost', `${fmt(plan.recommendation.restCost)} ج.م`);
        const restExpl = document.getElementById('rest-box-explanation');
        if (restExpl) {
            restExpl.innerHTML = `المتاح لباقي بضاعة المحل <strong>${fmt(cap.restCashAvailable)} ج.م</strong> موزعة بالكامل على السيريهات المقفولة للأصناف الأكثر سحباً وبيعاً خلال الأسبوع، مع تخصيص 100% من الجينز ليوم الأربعاء.`;
        }

        // 2. Executive Decision
        const v = plan.recommendation.verdict;
        const vTitle = document.getElementById('plan-verdict-title');
        const vBadge = document.getElementById('plan-verdict-badge');
        const wedSeriesEl = document.getElementById('plan-wed-series');
        const wedUnitsEl = document.getElementById('plan-wed-units');
        const thuSeriesEl = document.getElementById('plan-thu-series');
        const thuUnitsEl = document.getElementById('plan-thu-units');
        const logicListEl = document.getElementById('plan-verdict-logic-list');

        if (vTitle) vTitle.textContent = v.title;
        if (vBadge) {
            vBadge.textContent = v.badge;
            vBadge.className = 'text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold px-2.5 py-0.5 rounded-full';
        }
        if (wedSeriesEl) wedSeriesEl.textContent = fmt(plan.recommendation.wednesdaySeries);
        if (wedUnitsEl) wedUnitsEl.textContent = fmt(plan.recommendation.wednesdayUnits);
        if (thuSeriesEl) thuSeriesEl.textContent = fmt(plan.recommendation.thursdaySeries);
        if (thuUnitsEl) thuUnitsEl.textContent = fmt(plan.recommendation.thursdayUnits);

        if (logicListEl) {
            logicListEl.innerHTML = v.logic.map(l => `
                <div class="flex items-start gap-2">
                    <span class="text-amber-400 font-bold text-sm leading-none mt-0.5">✓</span>
                    <span>${l}</span>
                </div>
            `).join('');
        }

        this.setElText('plan-budget-wed', `${fmt(plan.recommendation.wednesdayCost)} ج.م`);
        this.setElText('plan-budget-thu', `${fmt(plan.recommendation.thursdayCost)} ج.م`);
        this.setElText('plan-expected-revenue', `~ ${fmt(plan.recommendation.expectedRevenue)} ج.م`);
        this.setElText('plan-expected-profit', `~ ${fmt(plan.recommendation.expectedProfit)} ج.م`);

        // 3. Master Categories Procurement Table
        const tableBody = document.getElementById('plan-categories-table-body');
        const totalSeriesBadge = document.getElementById('plan-total-series-badge');
        if (totalSeriesBadge) {
            totalSeriesBadge.textContent = `${fmt(plan.recommendation.totalSeries)} سِري (${fmt(plan.recommendation.totalUnits)} قطعة جملة)`;
        }

        if (tableBody) {
            tableBody.innerHTML = plan.categories.map(c => `
                <tr class="${c.isDedicatedNinja ? 'bg-amber-50/70 hover:bg-amber-100/60 border-b-2 border-amber-300' : 'hover:bg-slate-50 border-b border-slate-100'} transition">
                    <td class="p-3 font-bold text-slate-900 flex items-center gap-2">
                        <span class="text-xl">${c.icon}</span>
                        <div>
                            <span class="block ${c.isDedicatedNinja ? 'font-black text-amber-950 text-sm' : 'font-bold'}">${c.name}</span>
                            <span class="text-[10px] ${c.isDedicatedNinja ? 'text-amber-800 font-bold' : 'text-slate-500'} block">
                                ${c.isDedicatedNinja ? `بالمحل: ${fmt(c.stockUnits)} ترنج (${fmt(c.stockCost)} ج) | متبقي للتزويد: ${fmt(c.remainingNinjaBudget)} ج | جملة: ${fmt(c.unitCost)} ج` : `${c.modelsCited ? 'موديلات: ' + c.modelsCited + ' | ' : ''}تكلفة: ${fmt(c.unitCost)} ج.م | بيع: ${fmt(c.avgPrice)} ج.م`}
                            </span>
                        </div>
                    </td>
                    <td class="p-3 text-center">
                        <span class="inline-block ${c.isDedicatedNinja ? 'bg-amber-200 text-amber-950 font-black' : 'bg-slate-100 text-slate-800 font-bold'} text-[11px] px-2 py-0.5 rounded">${c.packLabel}</span>
                    </td>
                    <td class="p-3 text-center font-mono font-bold text-blue-800">${safeNum(c.dailyRate).toFixed(1)} ق/يوم</td>
                    <td class="p-3 text-center font-mono font-bold text-slate-700">${fmt(c.stockUnits)} قطعة</td>
                    <td class="p-3 text-center font-mono ${safeNum(c.daysOfSupply) <= 3.5 ? 'text-rose-700 font-black' : 'text-slate-600'}">${safeNum(c.daysOfSupply).toFixed(1)} يوم</td>
                    <td class="p-3 text-center ${c.isDedicatedNinja ? 'bg-amber-100' : 'bg-indigo-50/70'}">
                        <span class="text-base font-black font-mono ${c.isDedicatedNinja ? 'text-amber-950' : 'text-indigo-950'}">${safeNum(c.recommendedSeries)}</span>
                        <span class="text-[10px] ${c.isDedicatedNinja ? 'text-amber-800 font-black' : 'text-indigo-700 font-bold'} block">سِري كامل</span>
                    </td>
                    <td class="p-3 text-center font-mono font-black text-slate-900">${fmt(c.totalUnits)} ق</td>
                    <td class="p-3 text-left font-mono font-black ${c.isDedicatedNinja ? 'text-amber-950' : 'text-slate-900'}">
                        ${fmt(c.categoryCost)} ج.م
                        ${c.isDedicatedNinja && c.ninjaBuffer > 0 ? `<span class="block text-[9px] text-emerald-700 font-bold">فائض أمان: ${fmt(c.ninjaBuffer)} ج</span>` : ''}
                    </td>
                    <td class="p-3 text-center text-[11px]">
                        ${c.key === 'JEANS' ? '<span class="bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded font-black">الأربعاء (فرشة كاملة)</span>' : 
                          c.isDedicatedNinja ? `<span class="text-amber-950 font-mono font-bold bg-amber-200/80 px-2 py-0.5 rounded">${c.wednesdaySeries} الأربعاء + ${c.thursdaySeries} الخميس</span>` :
                          `<span class="text-slate-700 font-mono">${c.wednesdaySeries} الأربعاء + ${c.thursdaySeries} الخميس</span>`}
                    </td>
                    <td class="p-3 text-center">
                        <span class="text-[10px] px-2 py-0.5 rounded-full ${c.priorityBadgeClass}">${c.priorityLabel}</span>
                    </td>
                </tr>
            `).join('');
        }

        // 4. Detailed Sold Items Restock Table (بيان الأصناف التي بيعت فعلياً وسيريهاتها المقترحة)
        const itemsTableBody = document.getElementById('plan-items-sold-table-body');
        const itemsCountBadge = document.getElementById('plan-items-sold-count-badge');
        if (itemsCountBadge) {
            itemsCountBadge.textContent = `${plan.topSoldItems ? plan.topSoldItems.length : 0} صنف تم بيعها`;
        }
        if (itemsTableBody) {
            if (!plan.topSoldItems || plan.topSoldItems.length === 0) {
                itemsTableBody.innerHTML = '<tr><td colspan="9" class="p-4 text-center text-slate-400">لا توجد مبيعات مسجلة في هذه الفترة</td></tr>';
            } else {
                itemsTableBody.innerHTML = plan.topSoldItems.map(item => `
                    <tr class="hover:bg-slate-50 transition">
                        <td class="p-2.5 font-bold text-slate-900">
                            <div>${item.name}</div>
                            <span class="text-[10px] text-slate-400 font-normal">${item.group}</span>
                        </td>
                        <td class="p-2.5 text-center font-mono text-slate-500">${item.code}</td>
                        <td class="p-2.5 text-center font-bold text-blue-700 font-mono">${fmt(item.soldQty)} قطعة</td>
                        <td class="p-2.5 text-center font-mono text-slate-700">${fmt(item.unitCost)} ج.م</td>
                        <td class="p-2.5 text-center font-bold text-slate-600">${item.packSize} قطع (${item.sizesLabel})</td>
                        <td class="p-2.5 text-center bg-indigo-50 font-black font-mono text-indigo-950 text-sm">
                            ${item.suggestedSeries} سِري
                        </td>
                        <td class="p-2.5 text-center font-bold text-slate-800 font-mono">${fmt(item.suggestedUnits)} ق</td>
                        <td class="p-2.5 text-left font-bold text-emerald-800 font-mono">${fmt(item.suggestedCost)} ج.م</td>
                        <td class="p-2.5 text-center text-[11px] font-bold text-slate-700">${item.dropDay}</td>
                    </tr>
                `).join('');
            }
        }

        // 5. Specialized Jeans Drop Section
        const jeans = plan.jeans;
        this.setElText('jeans-target-summary', `${jeans.category.wednesdaySeries} سِري (${jeans.category.wednesdayUnits} قطعة)`);

        const fitsContainer = document.getElementById('plan-fits-container');
        if (fitsContainer) {
            fitsContainer.innerHTML = jeans.fitsDistribution.map(f => `
                <div class="bg-white rounded-xl p-3 border border-indigo-200/60 shadow-xs space-y-1.5">
                    <div class="flex items-center justify-between flex-wrap gap-2">
                        <div class="flex items-center gap-2">
                            <span class="font-bold text-slate-900 text-xs">${f.name}</span>
                            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${f.badgeClass}">${f.badge}</span>
                        </div>
                        <div class="flex items-baseline gap-1.5 font-mono">
                            <span class="text-sm font-black text-indigo-950">${f.series} سِري (${f.units} قطعة)</span>
                            <span class="text-xs text-slate-500 font-bold">(${f.pct}%)</span>
                        </div>
                    </div>
                    <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div class="bg-indigo-600 h-2 rounded-full transition-all duration-500" style="width: ${f.pct}%"></div>
                    </div>
                    <p class="text-[11px] text-slate-500">${f.reason}</p>
                </div>
            `).join('');
        }

        const sizeCurveContainer = document.getElementById('plan-size-curve-container');
        if (sizeCurveContainer) {
            sizeCurveContainer.innerHTML = `
                <div class="grid grid-cols-5 gap-1.5 text-center mb-1">
                    ${jeans.sizeCurve.map(s => `
                        <div class="bg-white/10 border border-white/20 rounded-lg p-2 ${s.sharePct >= 25 ? 'bg-amber-400/20 border-amber-300' : ''}">
                            <span class="block text-xs font-black text-white font-mono">مقاس ${s.size}</span>
                            <span class="block text-sm font-black ${s.sharePct >= 25 ? 'text-amber-300' : 'text-slate-200'} font-mono">${s.sharePct}%</span>
                            <span class="block text-[9px] text-slate-300 mt-1 leading-tight">${s.note}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // 6. Stagnant Stock
        const stagnantContainer = document.getElementById('plan-stagnant-table-container');
        const stagnantBadge = document.getElementById('plan-stagnant-badge');
        
        const stagnantList = (this.inventoryData && this.inventoryData.items ? this.inventoryData.items : [])
            .filter(inv => {
                const stock = safeNum(inv.stock, 0);
                return stock > 0 && (!salesItems.some(s => (s.code && s.code === inv.code) || (s.name && s.name.trim() === inv.name.trim())));
            })
            .slice(0, 10);

        if (stagnantBadge) stagnantBadge.textContent = `${stagnantList.reduce((sum, i) => sum + safeNum(i.stock, 0), 0)} قطعة راكدة مقترحة للتسييل`;

        if (stagnantContainer) {
            if (stagnantList.length === 0) {
                stagnantContainer.innerHTML = '<p class="text-xs text-slate-400 py-3 text-center">لا توجد أصناف راكدة ملحوظة، دوران المخزون ممتاز بالمحل ✓</p>';
            } else {
                stagnantContainer.innerHTML = `
                    <table class="w-full min-w-[650px] text-right text-xs border border-slate-200 rounded-xl overflow-hidden">
                        <thead class="bg-slate-100 text-slate-700 font-bold">
                            <tr>
                                <th class="p-2">الصنف</th>
                                <th class="p-2 text-center">الكود</th>
                                <th class="p-2 text-center">الرصيد بالمحل</th>
                                <th class="p-2 text-left">سعر البيع</th>
                                <th class="p-2 text-left">قيمة البضاعة</th>
                                <th class="p-2 text-center">التوصية المقترحة</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 bg-white">
                            ${stagnantList.map(item => `
                                <tr class="hover:bg-slate-50">
                                    <td class="p-2 font-bold text-slate-800">${item.name}</td>
                                    <td class="p-2 text-center font-mono text-slate-500">${item.code || '-'}</td>
                                    <td class="p-2 text-center font-bold text-rose-700 font-mono">${fmt(item.stock)} قطعة</td>
                                    <td class="p-2 text-left font-mono">${fmt(item.price)} ج.م</td>
                                    <td class="p-2 text-left font-mono font-bold text-slate-800">${fmt(item.total || (safeNum(item.stock) * safeNum(item.price)))} ج.م</td>
                                    <td class="p-2 text-center">
                                        <span class="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">خصم لتسييل السيولة قبل الأربعاء</span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }
        }
    }

    handleSimBudgetChange(val) {
        const budget = parseFloat(val) || 35000;
        if (!this.planningPlan || !this.planningPlan.categories) return;

        const simulated = PurchasePlanningEngine.solveKnapsackSimulation(budget, this.planningPlan.categories);
        const grid = document.getElementById('sim-categories-output-grid');
        const fmt = (num) => (Number(num) || 0).toLocaleString('ar-EG');

        if (grid) {
            grid.innerHTML = simulated.map(c => `
                <div class="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs text-center space-y-1">
                    <span class="text-xl block">${c.icon}</span>
                    <span class="block text-[11px] font-bold text-slate-800 truncate" title="${c.name}">${c.shortName}</span>
                    <div class="flex items-baseline justify-center gap-1 font-mono">
                        <span class="text-lg font-black text-indigo-900">${c.simSeries}</span>
                        <span class="text-[10px] text-slate-500 font-bold">سِري</span>
                    </div>
                    <span class="block text-[10px] text-slate-400 font-mono">(${c.simUnits} قطعة)</span>
                    <span class="block text-[11px] font-bold text-amber-700 font-mono pt-1 border-t border-slate-100">~${fmt(c.simCost)} ج.م</span>
                </div>
            `).join('');
        }
    }

    handleSimCustomUnitsChange(val) {
        // Maintained for backward compatibility
    }

    async fetchThursdayCycleFromSindbad() {
        const fetchBtn = document.getElementById('btn-fetch-cycle-sindbad');
        const icon = document.getElementById('icon-fetch-cycle');
        if (fetchBtn) fetchBtn.disabled = true;
        if (icon) icon.classList.add('animate-spin');

        let baseDateStr = '';
        if (this.currentViewData && this.currentViewData.meta && this.currentViewData.meta.endDate) {
            baseDateStr = this.currentViewData.meta.endDate;
        } else if (this.parsedData && this.parsedData.meta && this.parsedData.meta.endDate) {
            baseDateStr = this.parsedData.meta.endDate;
        }
        const range = PurchasePlanningEngine.getThursdayCycleRange(baseDateStr);

        this.showToast(`جاري الاتصال بسندباد وسحب مبيعات الدورة (${range.startDateStr} إلى ${range.endDateStr})...`, 'info');

        const params = {
            doc_id: 'all',
            salesman_id: 'all',
            store_id: '752',
            group_id: 'all',
            med_id: 'all',
            state_id: 'all',
            tax_id: 'all',
            d1: range.d1,
            m1: range.m1,
            y1: range.y1,
            d2: range.d2,
            m2: range.m2,
            y2: range.y2
        };

        try {
            const html = await this.network.fetchReportHTML(params);
            this.cycleReportData = SindbadParser.parse(html);
            this.renderPurchasePlanning();
            this.showToast(`تم جلب مبيعات الدورة بنجاح (${range.cycleDays} أيام) وتحديث قرارات الفرشة ✓`, 'success');
        } catch (e) {
            console.warn('Failed to fetch cycle from Sindbad:', e);
            if (e.isSessionExpired || (e.message && (e.message.includes('جلسة') || e.message.includes('الكوكي')))) {
                this.handleSessionExpired('انتهت صلاحية جلسة سندباد أثناء سحب مبيعات الدورة. تم تحويلك لتسجيل الدخول لتجديد الكوكي.');
                return;
            }
            this.showToast('تعذر سحب الفترة من سندباد (' + (e.message || 'شبكة') + ')، تم احتساب القرارات على أرقام التقرير الحالي ومخزون المحل', 'warning');
            this.renderPurchasePlanning();
        } finally {
            if (fetchBtn) fetchBtn.disabled = false;
            if (icon) icon.classList.remove('animate-spin');
        }
    }

    setElText(id, val) {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    setInputValue(id, val) {
        const el = document.getElementById(id);
        if (el) el.value = val;
    }
}

// Bootstrap
window.addEventListener('DOMContentLoaded', () => {
    window.sindbadApp = new App();
});

