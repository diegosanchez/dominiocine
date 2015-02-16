var config = require('config');
var request = require('request');
var util = require('util');

var url = "https://www.googleapis.com/customsearch/v1";
var key = config.get('linkedin.google_key');
var cx = config.get('linkedin.searche_key');
var q = "jammie fox actor";

var uri = util.format("%s?key=%s&cx=%s&q=%s", 
    url, key, cx, encodeURIComponent(q) );

console.log("Requesting: ", uri );

request( uri,
function(err, income, body) {
  var response = JSON.parse(body);
  console.log(response.items[0]);
});
