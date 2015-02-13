var jsdom = require("jsdom");

var Events = require('events').EventEmitter;
var Emitter = new Events();

module.exports = function(mongodb){

    var movies = [];
    var cursor = 0;
	var _this = this;
	this.mongodb = mongodb;
	
  var clean = function(title){
    var $re = title.replace(" Poster","");
	return $re;
  };
  
  
  
  var doRequest  = function(cb){
      console.log('buscando peliculas nuevas...');
	  //"http://www.imdb.com/showtimes/location",
         jsdom.env("http://akas.imdb.com/movies-in-theaters/",
          ["http://code.jquery.com/jquery.js"],
		  {
		  headers:{
				"Accept-Language":"en" 
			}
		  },
          function (errors, window) {
                movies  = [];
              var titles = window.$("img.poster");
			  
              for(var t in titles){
					
                  if(typeof titles[t].alt !="undefined" && typeof titles[t].src!="undefined"){
				  
                      movies.push({
                          title:titles[t].alt
                          ,img: titles[t].src
                      });
                  }//end if
				  
              }//end for
              cb();
          }//end cb
      );

  };//end doRequest

    var $next=function(){
        if(cursor===movies.length){
            return false;
        }else{
            var $return=  movies[cursor++];
            Emitter.emit("next", $return);
            return $return;
        }
    };

    Emitter.on("next", function(movie){
        var query = {
            title: clean(movie.title)
        };
        mongodb.films.find(query, {}, function(err, docs){
            if(err){
                console.log("Error query:", query);
                $next();
            } else{
                if(docs.length==0){
					movie.title = clean(movie.title)
					movie.date = new Date();
					movie.book = false;
					movie.trailer = false;
					movie.wiki = false;
					movie.linkedin = false;
					movie.subtitle = false;
					movie.twitter = false;
					movie.image = false;
					
                    mongodb.films.save(movie, function(){
                        $next();
                    });
                }else{
                    $next();
                }//end else
            }//end else
        });
    });


    var getLastMoviesFromIMDB = function(){
        console.log("Lanzado proceso IMDB");

        doRequest(function(){
            cursor = 0;
            $next();
        });
    };


    getLastMoviesFromIMDB();
    setInterval(getLastMoviesFromIMDB, 2*(60*1000));

	return new function(){
		this.getLastMovies = function(cb){
			var query = {
			};
			
			_this.mongodb.films.find(query, {}).sort({date:1}, function(err, docs){
				cb(err, docs);
			});//end find and sort
		};
		
		this.getMovieById = function(id, cb){
			_this.mongodb.films.find({_id: _this.mongodb.ObjectId(id)}, {}).sort({date:1}, function(err, docs){
				cb(err, docs);
			});//end find and sort
		};
	};
};