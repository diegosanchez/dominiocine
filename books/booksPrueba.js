

var mongojs = require('mongojs');
var db = mongojs('dominocine', ['films']);
var booksClass = require("./index"); 
var booksCtrl = new booksClass(db); 
