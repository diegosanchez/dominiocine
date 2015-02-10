/*
	Crear un modulo que busque por cada pelicula el o los libros relacionados.
	La busqueda sera en google books.
	Actualizar cada item de la collection films con una propiedad llamada books que será igual a un
	array que contendrá en cada posicion un json con la información de cada libro.
	Marcar cada película procesada con la propiedad booked = true.
*/
var https = require('https');
var Events = require('events').EventEmitter;
var Emitter = new Events();
var mongojs = require('mongojs');
var db = mongojs('dominocine', ['films']);

module.exports = function(){

	var _this = this;
	
	this.getBooks = function(movieName, lang, cb){
		console.log('Buscando películas relacionadas..');
		var body = "";
		var link = "https://www.googleapis.com/books/v1/volumes?q="+movieName+"&langRestrict="+lang+"&fields=items(id,selfLink,volumeInfo)";

		https.get(link, function(res){
			if(res.statusCode==200){
				res.on('data', function(data){ body +=data; });
				res.on('end', function(){
					var json = JSON.parse(body);
					cb(json.items);
				});
			}//end all is ok
			else{
				console.log("Ha ocurrido un error! ", res.statusCode);
			}
		});//end http.get
	}//end getBooks	
	
	this.actualizarDBLibros = function(){
	
		var cursor = 0;
		var movies = [];
	
		console.log("Actualizando libros en DB");
		
		db.films.find({},{book:1, title:1},function(err, docs){
            if(err){
                console.log("Error busqueda de libros");
            } else{
                if(docs.length==0){
					console.log("Sin peliculas");
                }else{
					console.log(docs);
					
                }//end else
            }//end else
        });
	}
	
	
	
}	

