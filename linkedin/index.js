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

Client.prototype.buildQuery = function(options) {
	var opts = options || {} ;
	var defaultFormat = opts.format || 'json';

  var self = this;
  var builder = {
    id: function() {
	    return util.format( self.api_url() + '/v1/people/id=%s?format=%s', opts.id,
          defaultFormat);
    },
    url: function() {
	    return util.format( self.api_url() + '/v1/people/url=%s?format=%s', 
          encodeURIComponent(opts.url), defaultFormat);

    }
  };

  // Looks for a builder for the options provided
  for( var k in options) {
    if ( k in builder )
      return builder[k]();
  };

  throw Error('Invalid query');
}

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
	var query = this.buildQuery(options);

	this.oauth.get(query, this.user_token, this.user_secret, 
		function ( e, data, res ) {
			if (e) {
				throw e; 
			}

			cb( e, JSON.parse(data) );
	}); 
};
