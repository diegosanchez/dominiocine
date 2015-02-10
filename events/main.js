var mongo = require("mongojs");
var db = mongo('mydb', ["events"]);
var socket = require("./socketio");

module.exports = function(){
		this.event = function(name,admin, users){
			console.log("asignando un evento");
			var obj= {
					"title": name,
					"date" : new Date(),
					"admin": admin,
					"invitate" : users
			}
			guardardatos(obj);
			
		}

		function guardardatos(obj){
				console.log("Asignando los datos a la base de datos");
				db.events.save(obj, function(err){
					socketio(obj);
				});
		}

		function socketio(obj){
				var controlador = new socket(obj.title, obj.admin, obj.invitate);
		}

}