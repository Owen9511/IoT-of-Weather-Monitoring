<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<style type="text/css">
body,table{
        font-size:13px;
}
table{
        table-layout:fixed;
        empty-cells:show;
        border-collapse: collapse;
        margin:0 auto;
  border:1px solid #cad9ea;
}
th{
  height:22px;
  font-size:13px;
  font-weight:bold;
  background-color:#CCCCCC;
  text-align:center;
}
td{
  height:20px;
}
.tableTitle{font-size:14px; font-weight:bold;}

    .text {
        display: none;
    }
    .on{
        color:#333;
    }
    .off{
        color:#eee;
    }
    .circle {
        position: absolute;
        display: inline-block;
    }

    .radio ~label {
        background-color: grey;
    }

    .radio ~label .circle {
        left: 0;
        transition: all 0.3s;
        --webkit-transition: all 0.3s;
    }

    .radio ~label .on {
        display: none;
    }

    .radio ~ label .off {
        display: inline-block;
    }

    .radio:checked ~ label {
        background: lime;
    }

    .radio:checked ~label .circle {
        left: 50px;
    }
    .radio:checked ~label .on {
        display: inline-block;
        position: relative;
        right: 30px;
    }

    .radio:checked ~ label .off {
        display: none;
    }
    .radio{
      display: none;
    }
    label {
      cursor: pointer;
        display: inline-block;
        position: relative;
        height: 30px;
        width: 80px;
        border-top-left-radius: 15px 50%;
        border-bottom-left-radius: 15px 50%;
        border-top-right-radius: 15px 50%;
        border-bottom-right-radius: 15px 50%;
        box-shadow: 0 0 2px black;
    }

    label .circle {
        display: inline-block;
        height: 26px;
        width: 26px;
        border-radius: 50%;
        border: 2px solid #333;
        background-color: #eee;
    }

    label .text {
        text-indent: 30px;
        line-height: 28px;
        font-size: 18px;
        font-family: sans-serif;
        text-shadow: 0 0 2px #ddd;
    }
    .mask {
            position: absolute; top: 0px; filter: alpha(opacity=60); background-color: #777;
            z-index: 1002; left: 0px;
            opacity:0.5; -moz-opacity:0.5;
            text-align: center;
            font-size: 40px;
            display: none;
        }
</style>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>
<title>Devices Control</title>
</head>

<body>
<div style="margin:0 auto;width:880px; border:1px #006600 solid; font-size:12px; line-height:30px;">
  <div style="width:100%; font-size:26px; font-weight:bold; text-align:center;">
  Devices Current Status</br>
  <font style="font-size:14px; font-weight:normal;"><?php echo date("Y-m-d h:i:s"); ?></font>
  </div>

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

  $sql = "SELECT * FROM devices ORDER BY id";
  $result = mysqli_query($conn, $sql);
  ?>


  <table width="100%" border="1" style="text-align:center;">
    <thead>
      <th width="70">Id</th>
      <th width="480">Address</th>
      <th width="70">Status</th>
      <th width="100">Interval Time</th>
      <th>
      </th>
    </thead>

    <?php
    while($row = mysqli_fetch_assoc($result))
    {
    ?>
    <tr id="tr<?php echo $row["id"] ?>">
      <td><?php echo $row["id"] ?></td>
      <td><?php echo $row["address"] ?></td>
      <td><?php
      if($row["status"] ==0){
        echo "OFF";
      }
      else{
        echo "ON";
      }
      ?></td>
      <td><input type="text" name="inter" id="intervalTime<?php echo $row["id"] ?>"  size="5"
        <?php
          if($row["status"] ==1)
          {echo "disabled";}
        ?>
         value="<?php echo $row["intervalTime"] ?>"/></td>
      <td>
        <div class="container">
          <input type="checkbox" class="radio" id="radio<?php echo $row["id"] ?>"
          <?php
          if($row["status"] ==1){
            echo "checked";
          }
           ?>
          name="switch">
          <label for="radio<?php echo $row["id"] ?>">
              <span class="circle"></span>
              <span class="text on">ON</span>
              <span class="text off">OFF</span>
          </label>
        </div>
      </td>
    </tr>
    <?php
    }
    mysqli_close($conn);
    ?>
  </table>
</div>
<div id="mask" class="mask">Waiting.....</div>


<script>

function showMask(){
        $("#mask").css("height",$(document).height());
        $("#mask").css("width",$(document).width());
        $("#mask").css("lineHeight",$(document).height()+"px");
        $("#mask").show();
    }
    //隐藏遮罩层
    function hideMask(){

        $("#mask").hide();
    }

function renewStatus(id){

  /*$conn = mysqli_connect($servername, $username, $password, $dbname, $port);
  if (!$conn) {
      die("Connection failed: " . mysqli_connect_error());
  }

  $sql = "SELECT * FROM devices WHERE id="+id;
  $result = mysqli_query($conn, $sql);
  $row=mysqli_fetch_assoc($result)
  $("#tr"+id).children("td:nth-child(1)").html($row['status']);
  $("#tr"+id).children("td:nth-child(1)").html($row['status']);
  mysqli_close($conn);*/
  window.location.replace("http://localhost/admin.php")
}

function change(id,status,intervalTime){
    $.ajax({
    type: "POST",
    url: " https://ib3ie9az4a.execute-api.eu-west-2.amazonaws.com/beta/admin/controldevicesstatus",
    dataType:'json',
    data: JSON.stringify({"id": id,"status": status,"intervalTime": intervalTime}),
    success: function(data){
      if(data.result=="success")
        {
          alert("Successfully change the device status!\nAttempted times:"+data.attempTimes);
        }
      else
      {
        alert("Failed change the device status!\nAttempted times:"+data.attempTimes);
        if($(".radio").prop('checked')==true){
          $(".radio").prop('checked',false);
        }
        else{
          $(".radio").prop('checked',true);
        }
      }
      renewStatus(id);
       hideMask();
    },
    error: function(){
    alert("Unexpected Erro Occured");
    if($(".radio").prop('checked')==true){
      $(".radio").prop('checked',false);
    }
    else{
      $(".radio").prop('checked',true);
    }
    //renewStatus(id);
     hideMask();
    }
});
}


    function OncheckBox(){
    if (this.checked == true) {
      showMask();
       change(this.id.substring(5),true,parseInt($("#intervalTime"+this.id.substring(5)).val()));
       //alert($("#intervalTime"+this.id.substring(5)).val());
    }
    else
    {
      showMask();
      change(this.id.substring(5),false,300);
    }
  }
  var radios=document.getElementsByClassName("radio");
  for(var i=0;i<radios.length;i++)
    {
      radios[i].addEventListener("change", OncheckBox);
    }
</script>
</body>

</html>
