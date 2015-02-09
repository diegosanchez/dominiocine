var config = require('config');
var express = require("express");
var app = express();
var mongojs = require("mongojs");
var db = mongojs('dominocine', ['films','twitter','movies','people']);
var bodyParser = require('body-parser')
var exphbs  = require('express-handlebars');
var args = require( "argsparser" ).parse();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('hbs', exphbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', 'hbs');


app.use(express.static(__dirname + '/public'));

var imdb = require("./imdb/index")();

app.get("/", function(req, res, next){
    res.render("index", {
		layout:"layout"
	});
});

var port = args["-port"] || 1234;
console.log("arrancando en port ", port	);
app.listen(port);






