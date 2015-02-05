var app = require("express")();
var mongojs = require("mongojs");
var db = mongojs('dominocine', ['films','twitter','movies','people']);
var bodyParser = require('body-parser')
var exphbs  = require('express-handlebars');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('hbs', exphbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', 'hbs');


app.get("/", function(req, res, next){
    res.render("index");
});

app.listen(3000);