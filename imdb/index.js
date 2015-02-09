var jsdom = require("jsdom");

var Events = require('events').EventEmitter;
var Emitter = new Events();

module.exports = function(mongodb){

    var movies = [];
    var cursor = 0;

  var doRequest  = function(cb){
      console.log('buscando peliculas nuevas...');
         jsdom.env(
          "http://www.imdb.com/showtimes/location?ref_=inth_ov_sh_sm",
          ["http://code.jquery.com/jquery.js"],
          function (errors, window) {
                movies  = [];
              var titles = window.$(".lister-item img.loadlate");
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
            console.log("todo termino ", movies.length);
            return false;
        }else{
            var $return=  movies[cursor++];
            console.log("lanzando evento ", $return);
            Emitter.emit("next", $return);
            return $return;
        }
    };

    Emitter.on("next", function(movie){
        console.log("evento lanzado: ", movie);

        var query = {
            title: movie.title
        };
        mongodb.films.find(query, {}, function(err, docs){
            if(err){
                console.log("Error query:", query);
                $next();
            } else{
                if(docs.length==0){
                    mongodb.films.save(movie, function(){
                        console.log("guardando pelicula nueva: ", movie.title);
                        $next();
                    });
                }else{
                    console.log("Pelicula existente: ", movie.title);
                    $next();
                }//end else
            }//end else
        });
    });


    var getLastMovies = function(){
        console.log("Lanzado proceso IMDB");
        doRequest(function(movies){
            console.log("peliculas bajadas");
            cursor = 0;
            $next();
        });
    };


    getLastMovies();
    setInterval(getLastMovies, 10*(60*1000));

};