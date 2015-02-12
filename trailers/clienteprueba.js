var mongojs = require('mongojs');
var db = mongojs('cinema71', ['films']);
var trailer = require("./index.js")(db);
var fs = require("fs");








trailer.search(function(err,peliculas) {
                                        console.log("Ejecutando");
									    var buffer="";
										for (var index=0;index<peliculas.length;index++)
                                        {
										         console.log(peliculas[index].trailers.length);
												 var trailers=peliculas[index].trailers;
												 for(var trailer=0;trailer<trailers.length;trailer++)
												 {
												    var url=trailers[trailer].link[0].href;
													var idvideo=trailers[trailer].media$group.yt$videoid.$t;
													buffer+="\n"+"Pelicula: " + peliculas[index].title +" "+url+" "+idvideo+"\n";
											        
												 }
												 
										}
			                            fs.writeFileSync("links.txt",buffer);
										console.log("Termino la ejecucion del background");
									    console.log("La lista de peliculas es", peliculas.length);
                                         
                                          										

                 
});