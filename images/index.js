var http = require("http");

var Events = require('events').EventEmitter;
var Emitter = new Events();

module.exports = function(mongodb){

    var movies = [];
    var cursor = 0;
	var _this = this;
	this.mongodb = mongodb;
	
  
  
	var getImages  = function(movie, cb){
		var body = "";
		var url = "http://ajax.googleapis.com/ajax/services/search/images?v=1.0&q="+movie;
		console.log(url);
		http.get(url, function(res){
			res.on('data', function(data){
				  body +=data;
			});
			res.on('end', function(){
			   var json = JSON.parse(body);
			   cb(json.responseData.results);
			});
		});
	};

 

   

    Emitter.on("next", function(movie){
		
		getImages(movie.title, function(images){
			
				var query = {
					title: movie.title
				};
				
				var $set = {
					$set:{
						images: images
						,image: true
					}
				};
		
			mongodb.films.update(query, $set,{multi:true}, function(err, docs){
				console.log("updates> ", docs);
				$next();
			});
		});
          
    });

	 var $next=function(){
        if(cursor===movies.length){
            return false;
        }else{
            var $return=  movies[cursor++];
            Emitter.emit("next", $return);
            return $return;
        }
    };
	

    var getGoogleImages = function(){
        console.log("Lanzado proceso IMDB");
		movies = [];
		cursor = 0 ;
        mongodb.films.find({image: false},{title:1}, function(err, docs){
			if(err){ console.log("Mongo Error> ", err)}
			else{
				movies = docs;
				$next();
			}//end else
		});
    };


    getGoogleImages();
    setInterval(getGoogleImages, 5*(60*1000));

	
};