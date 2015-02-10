    var mongojs = require('mongojs');
    var db = mongojs('cinema32', ['films']);       
	   
	  db.films.save({
            title: "matrix reloaded"
       });
	  	  db.films.save({
            title: "alien"
       });
	  	  db.films.save({
            title: "predator"
       });
	  	  db.films.save({
            title: "robocop"
       });
	  