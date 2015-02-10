var booksClass = require("./index"); 
var booksCtrl = new booksClass(); 
/*
booksCtrl.getBooks("El secreto de sus ojos","es", function(books){
	console.log("Libros: ", books);
});
*/

booksCtrl.actualizarDBLibros();