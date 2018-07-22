<?php
$servername = "raspberydbinstance.cocmbbw37bwd.eu-west-2.rds.amazonaws.com";
$username = "raspberry";
$password = "zky19951101";
$dbname="Weather";
$port=3297;

$conn = mysqli_connect($servername, $username, $password, $dbname, $port);

// 检测连接
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$sql = "SELECT * FROM data WHERE time>=DATE_SUB(NOW(),INTERVAL 1 DAY) AND source='".$_GET["source"]."' ORDER BY time ASC";
$result = mysqli_query($conn, $sql);



function is_dst($timestamp,$source)
{
    $timezone = date('e'); //获取当前使用的时区
    if($source=='1'||$source=='2')
      date_default_timezone_set('Europe/London');
    $dst = date('I',$timestamp);
    date_default_timezone_set($timezone);
    return $dst;
}

$lable=array();
$temperature=array();
$humidity=array();
$pressure=array();
$quality=array();

while($row = mysqli_fetch_assoc($result)){
  $timestamp = strtotime($row["time"]);
  if(is_dst($timestamp,$row["source"]))
  {
    $timestamp=strtotime("+1 hour",$timestamp);
  }
  $realTime=date("H:i:s",$timestamp);

  $Tlable=array("label"=>$realTime);
  $Ttemperature=array("value"=>(string)round($row["temperature"],2));
  $Thumidity=array("value"=>(string)round($row["humidity"],1));
  $Tpressure=array("value"=>(string)round($row["pressure"],0));
  $Tquality=array("value"=>(string)round($row["quality"],0));

  array_push($lable,$Tlable);
  array_push($temperature,$Ttemperature);
  array_push($humidity,$Thumidity);
  array_push($pressure,$Tpressure);
  array_push($quality,$Tquality);
}

$data=array("lable"=>$lable,"temperature"=>$temperature,"humidity"=>$humidity,"pressure"=>$pressure,"quality"=>$quality);
$json=json_encode($data);

echo $json;

mysqli_close($conn);

?>
