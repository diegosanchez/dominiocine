    var mongojs = require('mongojs');
    var db = mongojs('cinema71', ['films']);       
	   
	   
	  db.films.remove({},{multi:true}); 
	  db.films.save({
            title: "matrix reloaded",actualizado:false
       });
	  	  db.films.save({
            title: "alien",actualizado:false
       });
	  	  db.films.save({
            title: "predator",actualizado:false
       });
	  	  db.films.save({
            title: "robocop",actualizado:false
       });
	     db.films.save({
            title: "terminator",actualizado:false
       });
	      db.films.save({
            title: "kill bill",actualizado:false
       });
	        db.films.save({
            title: "avengers",actualizado:false
       });
	        db.films.save({
            title: "rocky",actualizado:false
       });
	   console.log("Termine");
	  
	  