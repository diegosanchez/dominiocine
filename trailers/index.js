var http = require("http");

var Events = require('events').EventEmitter;
var Emitter = new Events();

module.exports = function(mongodb){

    var movies = [];
    var cursor = 0;
	var _this = this;
	this.mongodb = mongodb;
	
  
  
    var getresults= function(url, cb) {
        var http = require("http");
        var buffer = "";
        http.get(url, function(res) {
            if (res.statusCode == 200) {
                res.on("data", function(data) {
                    buffer += data;
                });
                res.on("end", function() {
                    var resultset = JSON.parse(buffer);
                    cb(resultset);
                });
            }
        });
    }
	
	  var getcontents = function(resultset, cb) {
        var _links = function() {
            var links = [];
            items = resultset.feed.entry;
            for (var iresult = 0; iresult < items.length; iresult++) {

                links.push(items[iresult]);
            }
            return links;
        }
        cb(resultset.feed.entry ? _links() : []);
    };
	
	    var getmovies = function(moviename, cb) {
        var url = "http://gdata.youtube.com/feeds/api/videos?q=" + moviename + "-trailer&start-index=1&max-results=10&v=2&alt=json&hd";

        getresults(url, function(resultset) {
            getcontents(resultset, function(links) {


            cb(links);
            });
        });
    }
 

   

    Emitter.on("next", function(movie){
		
		getmovies(movie.title, function(films){
			
			    console.log("El titulo es", movie.title);
				var query = {
					title: movie.title
				};
				
				var $set = {
					$set:{
						 trailers: films
						,trailer: true
					}
				};
		
			    mongodb.films.update(query, $set,{multi:true}, function(err, films){
				console.log("updates> ", films);
				$next();
			});
		});
          
    });

	 var $next=function(){
        if(cursor===movies.length){
            return false;
        }else{
            var $return=  movies[cursor++];
            Emitter.emit("next", $return);
            return $return;
        }
    };
	
	

    var getTrailers = function(){
       
		movies = [];
		cursor = 0 ;
		console.log("Procesando");
        mongodb.films.find({trailer: false}).limit(10,function(err, films){
			if(err){ console.log("Mongo Error> ", err)}
			else{			  
				movies = films;				
				$next();
			}//end else
		});
    };


    getTrailers();
    setInterval(getTrailers, 30000);
}