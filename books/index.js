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

		var body = "";
		var link = "https://www.googleapis.com/books/v1/volumes?q="+movieName+"&langRestrict="+lang+"&fields=items(id,selfLink,volumeInfo)";

		https.get(link, function(res){
			if(res.statusCode==200){
				res.on('data', function(data){ body +=data; });
				res.on('end', function(){
					var json = JSON.parse(body);
					console.log(link);
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
		var movies;
	
		console.log("Actualizando libros en DB");
		
		var $next=function(){
			if(cursor===movies.length){
				return false;
			}else{
				var $return=  movies[cursor++];
				return $return;
			}
		};//end $next
		
		var updateInfoBookDB = function(movieTitle){
			_this.getBooks(movieTitle, "en", function(books){
				if(books != undefined)
					db.films.update({title:movieTitle},{$set: { books:books, book:true }}, {multi:true}, function(err, docs){
						if(err){
							console.log("Pelicula: "+movieTitle+" >> Books >> Error al hacer update en la base");
						}else{
							console.log("Pelicula: "+movieTitle+" >> Books >> Libros cargados", docs);
						}
					});
				else 
					db.films.update({title:movieTitle},{$set: { books:[], book:true }}, {multi:true}, function(err, docs){
						if(!err)
							console.log("Pelicula: "+movieTitle+" >> Books >> No se encontraron libros relacionados", docs);
					});
				var nextBook = $next();
				if(nextBook != false)
					updateInfoBookDB(nextBook.title);
			});//end getBook
		};//end updateInfoBookDB
		
		db.films.find({book:false},{book:1, title:1},{limit:10},function(err, docs){
            if(err){
                console.log("Error busqueda en db libros");
            } else{
                if(docs.length==0){
					console.log("Sin peliculas para buscar libros.. ");
                }else{
					//console.log(docs.length);
					movies = docs;
					updateInfoBookDB(movies[0].title);
                }//end else
            }//end else
        });//end db.films.find
		
	}//end actualizarDBLibros
}//end module.exports	

