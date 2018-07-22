function main() {
  var $select = $('#source'),
    $variable = $('.variable'),
    $time = $('#time'),
    $txt = $('.txt').eq(0),
    $dmy = $('.dmy').eq(0),
    source = $select.val();

  function renewData() {
    // get all weather dtat by ajax get method
    $.ajax({
        url: "../php/index.php",
        data: {
          source: source,
          sid: Math.random()
        },
        dataType: "json"
      })
      .done(function(data) {
        //renew display
        $time.text(data.RealTime);
        $variable.eq(0).text(data.temperature);
        $variable.eq(1).text(data.humidity);
        $variable.eq(2).text(data.pressure);
        $variable.eq(3).text(data.quality);
      });
  };

  $($select.on('change', function() {
    source = $select.val();
    renewData();
  }));

  (function cyclicRenew() {
    //immediately execute renewData() and execute it every 10000ms
    renewData();
    setTimeout(cyclicRenew, 10000);
  })();

  (function renewTime() {
    //format and renew time display every 1000ms
    var today = new Date(),
      h = today.getHours(),
      m = today.getMinutes(),
      s = today.getSeconds(),
      Y = today.getYear() + 1900,
      M = today.getMonth(),
      D = today.getDay(),
      date = today.getDate(),
      dayarray = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"),
      montharray = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December")
    checkTime = function(i) {
      if (i < 10) {
        i = "0" + i
      }; // add zero in front of numbers < 10
      return i;
    };

    m = checkTime(m);
    s = checkTime(s);
    date = checkTime(date);
    $txt.text(h + ":" + m + ":" + s);
    $dmy.text("" + dayarray[D] + ", " + montharray[M] + " " + date + ", " + Y + "")
    setTimeout(renewTime, 1000);
  })();
}

main();
