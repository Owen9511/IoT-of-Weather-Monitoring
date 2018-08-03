var TempChartID="TemperatureRealTimeChart",
    HumidityChartID="HumidityRealTimeChart",
    PressureChartID="PressureRealTimeChart",
    QualityChartID="QualityRealTimeChart";

var source=getUrlParam('source');
var dataAll=null;
var previousJson=null;
var url="../php/charttest.php";
var initialurl="../php/chartInitial.php";
var xmlHttp;


function getUrlParam(name) {
   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
   var r = window.location.search.substr(1).match(reg);
   if (r != null)
    return unescape(r[2]);
  return null;
  }


function updateAllData() {
  $.ajax({
    url : url,
    data : {
      source : source,
      sid : Math.random()
    },
    dataType : "json",
  })
  .done(function (data){
    if(previousJson!=data){
      dataAll=data;
      previousJson=data;
    }
  })
}

(function initialData() {
  $.ajax({
    url : initialurl,
    data : {
      source : source,
      sid : Math.random()
    },
    dataType : "json",
    async : false
  })
  .done(function (data){
      dataAll=data;
      previousJson=data;
      chart();
  })
})();




updateAllData();
setInterval(function () {updateAllData();}, 2500);


function chart(){

  var Ilabel='[{"category":'+JSON.stringify(dataAll.lable)+'}]';
  var Itemperature='[{"data":'+JSON.stringify(dataAll.temperature)+'}]';
  var Ihumidity='[{"data":'+JSON.stringify(dataAll.humidity)+'}]';
  var Ipressure='[{"data":'+JSON.stringify(dataAll.pressure)+'}]';
  var Iquality='[{"data":'+JSON.stringify(dataAll.quality)+'}]';

var temperatureDataSource='{\
    "chart": {\
      "captionFontSize": "20",\
      "outCnvBaseFontSize": "11",\
      "caption": "Temperature",\
      "labelStep": "'+Math.floor(dataAll.resultNum/15)+'",\
      "canvasBgAlpha": "0",\
      "bgImage":"../images/1.jpg",\
      "bgImageAlpha": "50",\
      "bgImageDisplayMode": "stretch",\
      "numberSuffix": "°C",\
      "refreshinterval": "1",\
      "setAdaptiveYMin":"1",\
      "numdisplaysets": "'+dataAll.resultNum+'",\
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
              var previousTime=dataAll.realTime;
               function updateData() {
                 if(previousTime==dataAll.realTime||dataAll==null){
                   return;
                 }
                 // Get reference to the chart using its ID
                 var chartRef = FusionCharts(TempChartID);
                 strData = "&label=" + dataAll.realTime + "&value=" + dataAll.temperature;
                 // Feed it to chart.
                 chartRef.feedData(strData);
                 previousTime=dataAll.realTime;
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
      "numdisplaysets": "'+dataAll.resultNum+'",\
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
                var previousTime=dataAll.realTime;
               function updateData() {
                 if(previousTime==dataAll.realTime||dataAll==null){
                   return;
                 }
                 var chartRef = FusionCharts(HumidityChartID);
                 strData = "&label=" + dataAll.realTime + "&value=" + dataAll.humidity;
                 // Feed it to chart.
                 chartRef.feedData(strData);
                 previousTime=dataAll.realTime;
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
      "numdisplaysets": "'+dataAll.resultNum+'",\
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
             var previousTime=dataAll.realTime;
            function updateData() {
              if(previousTime==dataAll.realTime||dataAll==null){
                return;
              }
                 // Get reference to the chart using its ID
                 var chartRef = FusionCharts(PressureChartID);
                 strData = "&label=" + dataAll.realTime + "&value=" + dataAll.pressure;
                 // Feed it to chart.
                 chartRef.feedData(strData);
                 previousTime=dataAll.realTime;
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
      "labelStep": "20",\
      "canvasBgAlpha": "0",\
      "bgImage":"../images/2.jpg",\
      "bgImageAlpha": "40",\
      "bgImageDisplayMode": "stretch",\
      "paletteColors": "#0075c2",\
      "refreshinterval": "1",\
      "setAdaptiveYMin":"1",\
      "numdisplaysets": "'+dataAll.resultNum+'",\
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
             var previousTime=dataAll.realTime;
            function updateData() {
              if(previousTime==dataAll.realTime||dataAll==null){
                return;
              }
                 // Get reference to the chart using its ID
                 var chartRef = FusionCharts(QualityChartID);
                 strData = "&label=" + dataAll.realTime + "&value=" + dataAll.quality;
                 // Feed it to chart.
                 chartRef.feedData(strData);
                 previousTime=dataAll.realTime;
               }

               var myVar = setInterval(function () {
                   updateData();
               }, 1000);
           }
       }
    })
    .render();
});
}
