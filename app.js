var config = require('config');
var express = require("express");
var app = express();
var mongojs = require("mongojs");
var db = mongojs('dominocine', ['films','twitter','movies','people','users']);
var bodyParser = require('body-parser')
var exphbs  = require('express-handlebars');
var args = require( "argsparser" ).parse();
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var fs = require("fs");
var http = require('http').Server(app);
var io = require('socket.io')(http);




var __droot__ = process.cwd() ;

app.use(session({
    store: new RedisStore({}),
    resave: false,
    saveUninitialized: true,
    secret: 'secreKey for secre Kat'
}));

var moduleUser = require("./users/index");
moduleUser = new moduleUser(db);



app.use(cookieParser());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('hbs', exphbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', 'hbs');


app.use(express.static(__dirname + '/public'));

var imdb = require("./imdb/index")(db);
var images = require("./images/index")(db);

app.get("/", function(req, res, next){
	
		res.render("index", {
			layout:"layout"
	    });
	
});


app.post("/rest/:module", function(req, res, next){

    switch(req.params.module){
        case 'login':
            moduleUser.login(req.body, function(err, docs){

                if(err){
                    res.json({error:err});
                }else{
                    if(docs.length===0){
                        res.json({error:"Bad user or password"});
                    }else{
                        req.session.userData = docs[0];
                        res.json({error: null, data:docs[0]});
                    }//end else
                }//end else err
            })
            break;
    }
});


app.get("/pages/:name", function(req, res, next){
    var name  = req.params.name || "";

    var file  = __droot__+"/views/parts/"+name+".hbs";
    console.log("file require: ", file);

    if(fs.existsSync(file)){
        res.render("parts/"+name, {layout: false});
    }else{
        res.render("parts/404.hbs", { layout: false});
    }//end else

});


app.get("/home", function(req, res, next){
	imdb.getLastMovies(function(err, docs){
			for(var x=0; x<docs.length; x++){
				var film = docs[x];
				if(typeof film.images!=="undefined"){
					film.portada = film.images[2].unescapedUrl;
				}
				
				if(typeof film.books!=="undefined"){
					film.book = film.books[1];
				}
				
				
			}//end for 
			
			res.render("parts/home", {
				layout: false
				,movies: docs
			});
	});//end getLastMovies
});


app.get("/movie/:id", function(req, res, next){
	imdb.getMovieById(req.params.id, function(err, movie){
				movie = movie[0];
				
				
			res.render("movie", {
				layout: false
				,movie: movie
				,trailers : movie.trailers || []
				,images: movie.images || []
				,books : movie.books || []
				,subtitles : movie.subtitles || []
				,tweets : movie.tweets || []
				,wikis : movie.wikis || []
			});
	});//end getLastMovies
});



var port = args["-port"] || 1234;

http.listen(port, function(){
  console.log('listening on *:', port);
});


io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  
  
   socket.on('chat message', function(msg){
		console.log('message: ' + msg);
		io.emit('chat message', msg);
  });
  
  
});
console.log("arrancando en port ", port	);







