var util = require('util');
var OAuth = require('oauth');

exports.linkedin = function() { };

exports.linkedin.Client = Client;

// Linkedin Client
function Client(options) {
	var mandatoryKeys = [ 
		'consumer_key', 
		'consumer_secret', 
		'user_token',
		'user_secret'];

	var self = this;
	mandatoryKeys.forEach( function (key) {
		if ( options[key] === undefined) {
			throw Error( key + ' is missing');
		}
		self[key] = options[key];
	});

	this.oauth = new OAuth.OAuth(
  		this.request_token_url(), this.request_access_token_url(),
  		this.consumer_key, this.consumer_secret,
  		'1.0A', null, 'HMAC-SHA1' );


}

Client.prototype.api_url = function() {
	return 'https://api.linkedin.com';
};

Client.prototype.request_token_url = function() {
	return this.api_url() + '/uas/oauth/requestToken';
};

Client.prototype.request_access_token_url = function() {
	return this.api_url() + '/uas/oauth/accessToken';
};

/****
* It returns a persone depending on the query you've posted
*
* @options:
*	- format: Response format: xml or json
*   - query:  It could be: id, url, current (just one per time)
* 
* @callback: It's a function which recieves three params. The params are:
*	- error
*  	- data: The data retrieved
*
* @examples:
*	- Querying person by id
*		client.people( { id: ''}, function( err, data) {
*			// Do something
* 		})
*/
Client.prototype.people = function(options, cb) {
	var _opts = options || {} ;
	var _format = _opts.format || 'json';

	var query = util.format( this.api_url() + '/v1/people/id=%s?format=%s', 
		_opts.id, _format);

	this.oauth.get(query, this.user_token, this.user_secret, 
		function ( e, data, res ) {
			if (e) {
				throw e; 
			}

			cb( e, data);
	}); 
};