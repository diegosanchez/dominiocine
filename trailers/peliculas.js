    var mongojs = require('mongojs');
    var db = mongojs('cinema26', ['films']);       
	   
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
	  