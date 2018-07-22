var TempChartID="TemperatureRealTimeChart",
    HumidityChartID="HumidityRealTimeChart",
    PressureChartID="PressureRealTimeChart",
    QualityChartID="QualityRealTimeChart";

var data=null;
var previousJson=null;
var url="../php/charttest.php";
var initialurl="../php/chartInitial.php";
var xmlHttp;
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
      if(previousJson!=json){
        data = JSON.parse(json);
        previousJson=json;
      }
    }
  }
};


function updateAllData() {
  xmlHttp =GetXmlHttpObject();
  if (xmlHttp==null)
  {
    alert ("Browser does not support HTTP Request");
    return;
  }
  xmlHttp.onreadystatechange=StateChange;
  xmlHttp.open("GET",url+"?sid="+Math.random(),true);
  xmlHttp.send(null);
}

function initialData() {
  xmlHttp =GetXmlHttpObject();
  if (xmlHttp==null)
  {
    alert ("Browser does not support HTTP Request");
    return;
  }
  xmlHttp.onreadystatechange=StateChange;
  xmlHttp.open("GET",initialurl+"?sid="+Math.random(),false);
  xmlHttp.send(null);
}

initialData();
updateAllData();
var Ilabel='[{"category":'+JSON.stringify(data.lable)+'}]';
var Itemperature='[{"data":'+JSON.stringify(data.temperature)+'}]';
var Ihumidity='[{"data":'+JSON.stringify(data.humidity)+'}]';
var Ipressure='[{"data":'+JSON.stringify(data.pressure)+'}]';
var Iquality='[{"data":'+JSON.stringify(data.quality)+'}]';


setInterval(function () {updateAllData();}, 2500);



var temperatureDataSource='{\
    "chart": {\
      "captionFontSize": "20",\
      "outCnvBaseFontSize": "11",\
      "caption": "Temperature",\
      "labelStep": "36",\
      "canvasBgAlpha": "0",\
      "bgImage":"../images/1.jpg",\
      "bgImageAlpha": "50",\
      "bgImageDisplayMode": "stretch",\
      "numberSuffix": "°C",\
      "refreshinterval": "1",\
      "setAdaptiveYMin":"1",\
      "numdisplaysets": "288",\
      "drawAnchors": "0",\
      "labeldisplay": "rotate",\
      "slantLabel": "1",\
      "showValues": "0",\
      "showRealTimeValue": "0",\
      "theme": "zune"\
    },\
    "categories":'+Ilabel+',\
    "dataset":'+Itemperature+'\
}';
FusionCharts.ready(function () {
    var tempChart = new FusionCharts({
        id: TempChartID,
        type: 'realtimeline',
        renderAt: 'tempchart-container',
        width: '100%',
        height: '100%',
        dataFormat: 'json',
        dataSource: temperatureDataSource,
       "events": {
          "initialized": function (e) {
              var previousTime=data.realTime;
               function updateData() {
                 if(previousTime==data.realTime||data==null){
                   return;
                 }
                 // Get reference to the chart using its ID
                 var chartRef = FusionCharts(TempChartID);
                 strData = "&label=" + data.realTime + "&value=" + data.temperature;
                 // Feed it to chart.
                 chartRef.feedData(strData);
                 previousTime=data.realTime;
               }

               var myVar = setInterval(function () {
                   updateData();
               }, 1000);
           }
       }
    })
    .render();
});


var humidityDataSource='{\
    "chart": {\
      "captionFontSize": "20",\
      "outCnvBaseFontSize": "11",\
      "caption": "Humidity",\
      "labelStep": "36",\
      "canvasBgAlpha": "0",\
      "bgImage":"../images/4.jpg",\
      "bgImageAlpha": "40",\
      "bgImageDisplayMode": "stretch",\
      "numberSuffix": "%",\
      "refreshinterval": "1",\
      "setAdaptiveYMin":"1",\
      "numdisplaysets": "288",\
      "drawAnchors": "0",\
      "labeldisplay": "rotate",\
      "slantLabel": "1",\
      "showValues": "0",\
      "showRealTimeValue": "0",\
      "theme": "zune"\
    },\
    "categories":'+Ilabel+',\
    "dataset":'+Ihumidity+'\
}';
FusionCharts.ready(function () {
    var humidityChart = new FusionCharts({
        id: HumidityChartID,
        type: 'realtimeline',
        renderAt: 'humiditychart-container',
        width: '100%',
        height: '100%',
        dataFormat: 'json',
        dataSource: humidityDataSource,
       "events": {
           "initialized": function (e) {
                var previousTime=data.realTime;
               function updateData() {
                 if(previousTime==data.realTime||data==null){
                   return;
                 }
                 var chartRef = FusionCharts(HumidityChartID);
                 strData = "&label=" + data.realTime + "&value=" + data.humidity;
                 // Feed it to chart.
                 chartRef.feedData(strData);
                 previousTime=data.realTime;
               }

               var myVar = setInterval(function () {
                   updateData();
               }, 1000);
           }
       }
    })
    .render();
});


var pressureDataSource='{\
    "chart": {\
      "captionFontSize": "20",\
      "outCnvBaseFontSize": "11",\
      "caption": "Pressure",\
      "labelStep": "36",\
      "canvasBgAlpha": "0",\
      "bgImage":"../images/3.jpg",\
      "bgImageAlpha": "50",\
      "bgImageDisplayMode": "stretch",\
      "numberSuffix": "hPa",\
      "formatNumberScale": "0",\
      "refreshinterval": "1",\
      "setAdaptiveYMin":"1",\
      "numdisplaysets": "288",\
      "drawAnchors": "0",\
      "labeldisplay": "rotate",\
      "slantLabel": "1",\
      "showValues": "0",\
      "showRealTimeValue": "0",\
      "theme": "zune"\
    },\
    "categories":'+Ilabel+',\
    "dataset":'+Ipressure+'\
}';
FusionCharts.ready(function () {
    var pressureChart = new FusionCharts({
        id: PressureChartID,
        type: 'realtimeline',
        renderAt: 'pressurechart-container',
        width: '100%',
        height: '100%',
        dataFormat: 'json',
        dataSource: pressureDataSource,
       "events": {
           "initialized": function (e) {
             var previousTime=data.realTime;
            function updateData() {
              if(previousTime==data.realTime||data==null){
                return;
              }
                 // Get reference to the chart using its ID
                 var chartRef = FusionCharts(PressureChartID);
                 strData = "&label=" + data.realTime + "&value=" + data.pressure;
                 // Feed it to chart.
                 chartRef.feedData(strData);
                 previousTime=data.realTime;
               }

               var myVar = setInterval(function () {
                   updateData();
               }, 1000);
           }
       }
    })
    .render();
});


var qualityDataSource='{\
    "chart": {\
      "captionFontSize": "20",\
      "outCnvBaseFontSize": "11",\
      "caption": "Air Quality",\
      "labelStep": "36",\
      "canvasBgAlpha": "0",\
      "bgImage":"../images/2.jpg",\
      "bgImageAlpha": "40",\
      "bgImageDisplayMode": "stretch",\
      "paletteColors": "#0075c2",\
      "refreshinterval": "1",\
      "setAdaptiveYMin":"1",\
      "numdisplaysets": "288",\
      "drawAnchors": "0",\
      "labeldisplay": "rotate",\
      "slantLabel": "1",\
      "showValues": "0",\
      "showRealTimeValue": "0",\
      "theme": "zune"\
    },\
    "categories":'+Ilabel+',\
    "dataset":'+Iquality+'\
}';
FusionCharts.ready(function () {
    var qualityChart = new FusionCharts({
        id: QualityChartID,
        type: 'realtimeline',
        renderAt: 'qualitychart-container',
        width: '100%',
        height: '100%',
        dataFormat: 'json',
        dataSource: qualityDataSource,
       "events": {
           "initialized": function (e) {
             var previousTime=data.realTime;
            function updateData() {
              if(previousTime==data.realTime||data==null){
                return;
              }
                 // Get reference to the chart using its ID
                 var chartRef = FusionCharts(QualityChartID);
                 strData = "&label=" + data.realTime + "&value=" + data.quality;
                 // Feed it to chart.
                 chartRef.feedData(strData);
                 previousTime=data.realTime;
               }

               var myVar = setInterval(function () {
                   updateData();
               }, 1000);
           }
       }
    })
    .render();
});
