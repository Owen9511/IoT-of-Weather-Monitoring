function main() {
  var $select = $('#source'),
    $variable = $('.variable'),
    $time = $('#time'),
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
}

main();
