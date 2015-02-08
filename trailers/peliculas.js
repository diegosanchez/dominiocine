    var mongojs = require('mongojs');
    var db = mongojs('cinema25', ['films']);       
	   
	  db.films.save({
            name: "matrix reloaded"
       });
	  	  db.films.save({
            name: "alien"
       });
	  	  db.films.save({
            name: "predator"
       });
	  	  db.films.save({
            name: "robocop"
       });
	  