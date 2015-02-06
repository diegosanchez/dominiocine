var app = require("express")();
var mongojs = require("mongojs");
var db = mongojs('dominocine', ['twitter']);

var Twitter = require('twitter');
var args = require( "argsparser" ).parse();
 
var client = new Twitter({
  consumer_key: 'uzxEhMcd78wlY6jG8f2A',
  consumer_secret: 'L1M6cbjXQB69218oJbEi1E2SuD53sIsaGmuO0n2jXk',
  access_token_key: '762504943-2julQvMq2z22JHWBGGi4EZlOeVnbldq5O1ABlK3e',
  access_token_secret: 'AFsqwg0a3g9ZXY3vZL5NmhPdLuAdoQt6wWjuk5bAg'
});

client.stream('statuses/filter', {track: args["-track"]}, function(stream) {
  stream.on('data', function(tweet) {    
		console.log('@' + tweet.user.screen_name + ': ' + tweet.text);
		db.twitter.save(tweet, function(err, docs){
			console.log('Tweet  ' + tweet.id + ' saved.');
    });
  });
 
  stream.on('error', function(error) {
	console.log('Hubo un error vieja!');
    throw error;
  });
});