    var mongojs = require('mongojs');
    var db = mongojs('cinema71', ['films']);       
	   
	   
	  db.films.remove({},{multi:true}); 
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
	     db.films.save({
            title: "terminator"
       });
	      db.films.save({
            title: "kill bill"
       });
	        db.films.save({
            title: "avengers"
       });
	        db.films.save({
            title: "rocky"
       });
	   console.log("Termine");
	  
	  