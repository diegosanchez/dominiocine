var request = require('request');
var util = require('util');

module.exports = function(db) { 

  // Process
  console.log("Running linkedin...");
  db.actors.find( {}, {fullName:1 }, function (err, document) {
    if (err) {
      console.log( "Error happened in:", __filename);
      return;
    }

    document.forEach( function(actor) {
      console.log( "Actor:", actor, __filename);
    });
    
  });

};


// Linkedin Client
function Client(options) {
	var mandatoryKeys = [ 
		'google_key', 
		'searche_key'];

	var self = this;
	mandatoryKeys.forEach( function (key) {
		if ( options[key] === undefined) {
			throw Error( key + ' is missing');
		}
		self[key] = options[key];

	});

  this.api_url = "https://www.googleapis.com/customsearch/v1";
}

Client.prototype.api_url = function() {
	return this.api_url;
};

/****
* It returns query results retrieved by google search once LinkedIn was inquired
*
* @param    what: what you are looking for?
* @param    cb:   Callback. Callback function receives two params: err, result 
*
*/
Client.prototype.query = function(what, cb) {
  var url = util.format("%s?key=%s&cx=%s&q=%s", 
    this.api_url, this.google_key, this.searche_key, encodeURIComponent(q) );

  request( uri, function(err, income, body) {
    var response = JSON.parse(body);
    console.log(response.items[0]);
  });

};
