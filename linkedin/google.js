var request = require('request');
var util = require('util');

var url = "https://www.googleapis.com/customsearch/v1";
var key = "***************************************";
var cx = "*********************:+++++++++++";
var q = "cameron diaz";

var uri = util.format("%s?key=%s&cx=%s&q=%s", 
    url, key, cx, encodeURIComponent(q) );

request( uri,
function(err, income, body) {
  var response = JSON.parse(body);
  console.log(response.items[0].link);
});
