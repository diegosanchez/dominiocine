var mongojs = require('mongojs');
var db = mongojs('cinema32', ['films']);
var trailer = require("./index.js")(db);
var fs = require("fs");



console.log(trailer.search);
trailer.search(function(peliculas) {
                                        console.log(peliculas[0].trailers); 
										/*for (var index=0;index<peliculas.length;index++)
                                        {
										         console.log(peliculas[index].trailers);
										}*/
                                         
                                          										

                 
});