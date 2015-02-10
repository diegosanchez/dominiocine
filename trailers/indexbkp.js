module.exports = function() {

    var events = require("events");
    var eventEmitter = events.EventEmitter;
    var ee = new eventEmitter();
    var mongojs = require('mongojs');
    var db = mongojs('cinema25', ['films']);

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


    this.search = function(callback) {

        ee.on("addtrailer", function(films) {

            var item = next(films);
            if (item !== false) {
                _getTrailers(item.name, function(links) {
                    item.trailers = links;
                    ee.emit("addtrailer", films);

                });

            } else {
                callback(films); //Llamo a la funcion principal cuando termina toda la asignacion de trailers. 

            }
        });


        db.films.find({}, {}, function(err, films) {
            if (!err) {

                ee.emit("addtrailer", films);




            }

        });


    }


}