module.exports = function(db) {

    var events = require("events");
    var eventEmitter = events.EventEmitter;
    var ee = new eventEmitter();
	var callback=null;	
   
    
    var _getresults = function(url, cb) {
        var http = require("http");
        var buffer = "";
        http.get(url, function(res) {
            if (res.statusCode == 200) {
                res.on("data", function(data) {
                    buffer += data;
                });
                res.on("end", function() {
                    var resultset = JSON.parse(buffer);
                    cb(resultset);
                });
            }
        });
    }
    var _getcontents = function(resultset, cb) {
        var _links = function() {
            var links = [];
            items = resultset.feed.entry;
            for (var iresult = 0; iresult < items.length; iresult++) {

                links.push(items[iresult]);
            }
            return links;
        }
        cb(resultset.feed.entry ? _links() : []);
    };

    var _getTrailers = function(moviename, cb) {
        var url = "http://gdata.youtube.com/feeds/api/videos?q=" + moviename + "-trailer&start-index=1&max-results=10&v=2&alt=json&hd";

        _getresults(url, function(resultset) {
            _getcontents(resultset, function(links) {


                cb(links);
            });
        });
    }
    var cursor = 0;
    var next = function(films) {
        return cursor == films.length ? false : films[cursor++];

    }
	
	var saveMovie=function(film, cb)
	{
	    var nombre= film.title;
		
		var trailerspelicula=film.trailers;
		 db.films.update({
                    title: nombre
                }, {
                    $set: {
                        trailers: trailerspelicula,trailer:true
                    }
                },
                function(err, updated) {
                    if (err || !updated) {
                        console.log("Ocurrio un error");
                    } else {                        
                        cb();
                    }
                });
			    
		
	}		



         ee.on("addtrailer", function(films) {

            var item = next(films);
            if (item !== false) {
			      console.log("La pelicula es", item.title);
                _getTrailers(item.title, function(links) {
                    item.trailers = links;
					saveMovie(item, function() {
					                                 ee.emit("addtrailer", films);
					
					                            });
                  
                     
                });

            } else {
                 
			   console.log("Termino de actualizar");			 
			   if (callback)
			   {  
			      callback();  
			   
			   }
			
			   
			   
            }
        });
		

    var actualizarInfo=function()
	 {
	 
	    db.films.find({"trailer":false}, {}).limit(3,function(err, films) {     
            if (!err) {

                ee.emit("addtrailer", films);
            }

        });
     }
   
   	var procesa=function()
	{
	   console.log("Actualizo la informacion");
	   cursor=0;	
	   actualizarInfo();
	  
	}
	
	var run=function()
	{
	  procesa();
      setInterval(procesa, 10000); 
	}
	
	
	return new function(){
		this.search = function(cb){		
		 
	           callback=function()
               {
			        
                    var viewRecords=function(){
                                					
			             
						 var query={trailer:true};
						 db.films.find(query, {}, function(err, films){
						                                                                                       console.log(films.length);
		                                                                                                       cb(err,films);});
					   };
					   
					viewRecords();
			   }
               run();   
	 	  	  
		}
	}
}