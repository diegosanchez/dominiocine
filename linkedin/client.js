var request = require('request');
var util = require('util');

module.exports = Client;

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
    this.api_url, this.google_key, this.searche_key, encodeURIComponent(what) );

  request( url, function(err, income, body) {

    if ( err ) {
      throw Error( "Unable to retrieve information from '" + this.api_url + "'" );
    }

    var response = JSON.parse(body);

    // Daily quote exceeded
    if ( 'error' in response ) {
      console.error( 'Error %s - %s', response.error.code, response.error.message);
      cb( response.error.code, response.error.errors );
      return;
    }

    // Not results
    if ( response.items.length === 0) {
      cb( null, {} );
      return;
    }

    // Not profile page
    if ( ! ('link' in response.items[0] /* first result */ ) ){
      cb( null, {} );
      return;
    }

    cb(response.items[0]);
  });

};

