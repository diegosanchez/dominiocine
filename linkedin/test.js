var config = require('config');
var LinkedInClient = require('./index').linkedin.Client;

var client = new LinkedInClient( {
	consumer_key: config.get('linkedin.consumer_key'),
	consumer_secret: config.get('linkedin.consumer_secret'),
	user_token: config.get('linkedin.user_token'),
	user_secret: config.get('linkedin.user_secret')
});

console.log('Running linkedin client tests');
client.people( { id: 'm6TTOZq568'}, function (err, data, res) {
	console.log(data);
});


/*
var OAuth = require('oauth');

var consumer_key = "" || process.env.LINKEDIN_CONSUMER_KEY;
var consumer_secret = "" || process.env.LINKEDIN_CONSUMER_SECRET;

var user_token = "" || process.env.LINKEDIN_USER_TOKEN;
var user_secret = "" || process.env.LINKEDIN_USER_SECRET;


 
var api_url = 'https://api.linkedin.com';
var request_token_url = api_url + '/uas/oauth/requestToken';
var request_access_token_url = api_url + '/uas/oauth/accessToken';


console.log( 'consumer key:' ,consumer_key );
console.log( 'consumer secret:', consumer_secret );

console.log( 'user_token:', user_token );
console.log( 'user_secret:', user_secret );

var oauth = new OAuth.OAuth(
  request_token_url, request_access_token_url,
  consumer_key, consumer_secret,
  '1.0A', null, 'HMAC-SHA1' );


// Example: https://api.linkedin.com/v1/people/~?format=json

var query = "https://api.linkedin.com/v1/people";

// profile 
// query += "/url=";
// query += encodeURIComponent('http://ar.linkedin.com/in/abogadaelianacaria/en');
// query += '?format=json';

// id 
query += "/id=";
query += 'm6TTOZq568';
query += '?format=json';

// People connections 
// query += "/id=";
// query += '6nAaMlzNin';  // Eli
// query += '/connections';

// query += '?format=json';
console.log('query:', query);

oauth.get(query, user_token, user_secret, function ( e, data, res ) {
  if (e) {
      console.error('Error', e);        
      return;
  }

  console.log('response data:', data);
});    

*/
