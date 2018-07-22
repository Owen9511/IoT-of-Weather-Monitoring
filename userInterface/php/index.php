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

$sql = "SELECT * FROM data WHERE source = ".$_GET["source"]." ORDER BY time DESC LIMIT 1";
$result = mysqli_query($conn, $sql);

$row = mysqli_fetch_assoc($result);

function is_dst($timestamp,$source)
{
    $timezone = date('e'); //获取当前使用的时区
    if($source=='1'||$source=='2')
      date_default_timezone_set('Europe/London');
    $dst = date('I',$timestamp);
    date_default_timezone_set($timezone);
    return $dst;
}

$timestamp = strtotime($row["time"]);
if(is_dst($timestamp,$row["source"]))
{
  $timestamp=strtotime("+1 hour",$timestamp);
}

$RealTime=date("H:i:s",$timestamp);
$year=date('Y',$timestamp);
$month=date('F',$timestamp);
$date=date('d',$timestamp);
$hour=date('H',$timestamp);
$minute=date('i',$timestamp);
$second=date('s',$timestamp);
$day=date('l',$timestamp);

$data=array("RealTime"=>$RealTime,"year"=>$year,"month"=>$month,"date"=>$date,"hour"=>$hour,"minute"=>$minute,"second"=>$second,"day"=>$day,"source"=>$row["source"],"temperature"=>round($row["temperature"],1),"humidity"=>round($row["humidity"],1),
  "pressure"=>round($row["pressure"]),"quality"=>round($row["quality"]));
$json=json_encode($data);

echo $json;

mysqli_close($conn);

?>
