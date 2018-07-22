var xmlHttp;
var data;
var url="../php/index.php"


var select = $('#source');
var source=select.val();



function GetXmlHttpObject()
{
xmlHttp=null;
try
 {
 // Firefox, Opera 8.0+, Safari
 xmlHttp=new XMLHttpRequest();
 }
catch (e)
 {
 //Internet Explorer
 try
  {
  xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
  }
 catch (e)
  {
  xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
 }
return xmlHttp;
}

function StateChange(){
if (xmlHttp.readyState==4)
  {// 4 = "loaded"
  if (xmlHttp.status==200)
    {
      // 200 = OK
      var json = xmlHttp.responseText;
        data = JSON.parse(json);
    }
  }
};


function updateAllData(status) {
  xmlHttp =GetXmlHttpObject();
  if (xmlHttp==null)
  {
    alert ("Browser does not support HTTP Request");
    return;
  }
  xmlHttp.onreadystatechange=StateChange;
  if(status=="init"){
    xmlHttp.open("GET",url+"?source="+source+"&sid="+Math.random(),false);
  }
  else{
    xmlHttp.open("GET",url+"?source="+source+"&sid="+Math.random(),true);
  }

  xmlHttp.send(null);
}

var interval;
function start(){
  updateAllData("init");

  document.getElementById("time").innerHTML=data.RealTime;
  var varible=document.getElementsByClassName("variable");
  varible[0].innerHTML=data.temperature;
  varible[1].innerHTML=data.humidity;
  varible[2].innerHTML=data.pressure;
  varible[3].innerHTML=data.quality;



  interval=setInterval(function () {updateAllData("update");
    document.getElementById("time").innerHTML=data.RealTime;
  var varible=document.getElementsByClassName("variable");
  varible[0].innerHTML=data.temperature;
  varible[1].innerHTML=data.humidity;
  varible[2].innerHTML=data.pressure;
  varible[3].innerHTML=data.quality;
}, 10000);
}
start();


function sourceChange(){
  source=select.val();
  clearInterval(interval);
  start();
}

$(select.on('change',sourceChange));
