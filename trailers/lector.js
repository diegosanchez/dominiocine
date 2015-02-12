var mongojs = require('mongojs');
var db = mongojs('cinema71', ['films']);

  console.log("Soy el lector");
  db.films.find({}, {}, function(err, films) {
            if (!err) {            
                           for (var index=0;index<films.length;index++)
						   {
						       console.log(films[index].title);
						       console.log("La coleccion de trailers es", films[index].trailers);
							   console.log("El flag es ",films[index].trailer);
						        
						   
						   }
		   console.log(err);



            }

        });