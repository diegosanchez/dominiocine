var https = require('https');
var Events = require('events').EventEmitter;
var Emitter = new Events();

module.exports = function(mongodb){

	var cursor;
	var movies;
	var _this = this;
	this.mongodb = mongodb;
	
	var getBooks = function(movieTitle, lang, cb){

		var body = "";
		var link = "https://www.googleapis.com/books/v1/volumes?q="+movieTitle+"&langRestrict="+lang+"&fields=items(id,selfLink,volumeInfo)";

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

	Emitter.on("next", function(movie){
	
		getBooks(movie.title, "en", function(books){
			if(books != undefined)
				mongodb.films.update({title:movie.title},{$set: { books:books, book:true }}, {multi:true}, function(err, docs){
					if(err){
						console.log("Pelicula: "+movie.title+" >> Books >> Error al hacer update en la base");
					}else{
						console.log("Pelicula: "+movie.title+" >> Books >> Libros cargados", docs);
					}
				});
			else 
				mongodb.films.update({title:movie.title},{$set: { books:[], book:true }}, {multi:true}, function(err, docs){
					if(!err)
						console.log("Pelicula: "+movie.title+" >> Books >> No se encontraron libros relacionados", docs);
				});
			$next();
		});//end getBook
          
    });
	
	
	var $next = function(){
		if(cursor===movies.length){
			return false;
		}else{
			var $return = movies[cursor++];
            Emitter.emit("next", $return);
			return $return;
		}
	};//end $next
	
	var actualizarDBLibros = function(){
		cursor = 0;
	
		console.log("Actualizando libros en DB");
		
		mongodb.films.find({book:false},{book:1, title:1},{limit:10}, function(err, docs){
            if(err){
                console.log("Error busqueda en db libros");
            } else{
                if(docs.length==0){
					console.log("Sin peliculas para buscar libros.. ");
                }else{
					//console.log(docs.length);
					movies = docs;
					$next();
                }//end else
            }//end else
        });//end mongodb.films.find
		
	}//end actualizarDBLibros
	
	actualizarDBLibros();
    setInterval(actualizarDBLibros, 15*(60*1000));
	
}//end module.exports	

