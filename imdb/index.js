var jsdom = require("jsdom");


module.exports = function(mongodb){

  var movies  = [];

  var doRequest  = function(){
      console.log('buscando peliculas nuevas...');
      jsdom.env(
          "http://www.imdb.com/showtimes/location?ref_=inth_ov_sh_sm",
          ["http://code.jquery.com/jquery.js"],
          function (errors, window) {
              movies = [];
              var titles = window.$(".lister-item img.loadlate");
              for(var t in titles){

                  if(typeof titles[t].alt !="undefined" && typeof titles[t].src!="undefined"){
                      movies.push({
                          title:titles[t].alt
                          ,img: titles[t].src
                      });
                  }//end if
              }//end for



          }
      );


      var getLastMovies = function(){

          doRequest(function(movies){

          });
     };



  };

};