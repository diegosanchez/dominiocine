var trailer = require("./index");
var fs = require("fs");
var mongojs = require('mongojs');
var db = mongojs('cinema26', ['films']);
var instance = new trailer();

instance.search(function(peliculas) {
                                          console.log("Procesando");



                 
});