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

app.get("/", function(req, res, next){

    res.render("index", {
		layout:"layout"
        ,userData: req.session.userData || {}
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



var port = args["-port"] || 1234;
console.log("arrancando en port ", port	);
app.listen(port);






