var app = require("express")();
var mongojs = require("mongojs");
var db = mongojs('dominocine', ['twitter','films']);


var Twitter = require('twitter');
var args = require( "argsparser" ).parse();
 
var client = new Twitter({
  consumer_key: 'uzxEhMcd78wlY6jG8f2A',
  consumer_secret: 'L1M6cbjXQB69218oJbEi1E2SuD53sIsaGmuO0n2jXk',
  access_token_key: '762504943-2julQvMq2z22JHWBGGi4EZlOeVnbldq5O1ABlK3e',
  access_token_secret: 'AFsqwg0a3g9ZXY3vZL5NmhPdLuAdoQt6wWjuk5bAg'
});


var getMovies = function(cb){
					var peliculas =[];
					db.films.find({},{title:-1,_id:0}).sort( { date: -1 }).limit( 5 ,function(err,docs){
						for(var x in docs){
						 peliculas.push(docs[x].title.split("(")[0]);
						}
						cb(peliculas.join());
					} );
					
}(function(a){stream(a);});

var stream =  function(peliculas){
						console.log("peliculas a streamear. ",peliculas);
						client.stream('statuses/filter', {track: peliculas}, function(stream) {
						  stream.on('data', function(tweet) {
								tweet.pelicula = identificar(peliculas, tweet);
								console.log('@' + tweet.user.screen_name + ': ' + tweet.text);
								if(tweet.pelicula)
									db.twitter.save(tweet, function(err, docs){
										console.log('Tweet  ' , tweet.id , ' saved. Movie:',tweet.pelicula);
									});
						  });
						 
						  stream.on('error', function(error) {
							console.log('Hubo un error vieja!');
							throw error;
						  });
						});
				}		
var identificar =  function(peliculas, tweet){
						var t = tweet.text.toLowerCase();
						var p = peliculas.toLowerCase().split(",");
						for(var x in p){
							var mov = p[x].trim();
							if(t.indexOf(mov) > -1)
								return mov;
							else if(t.indexOf(mov.split(" ").join("")) > -1)
									return mov;
						}
						return null;
					};

var inter = function(){getMovies((function(a){stream(a);}))}					
					
setInterval(inter, 10000);					