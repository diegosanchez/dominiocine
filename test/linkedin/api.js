var LinkedInClient = require('../../linkedin/index').linkedin.Client;


describe('Client', function(){
	before( function  () {
		// Dummy env variables
		process.env.LINKEDIN_CONSUMER_KEY = '1234567890abcd';
		process.env.LINKEDIN_CONSUMER_SECRET = '1234567890abcd';
		process.env.LINKEDIN_USER_TOKEN = '12345678-90ab-cdef-ghij-klopqrstuwxy';
		process.env.LINKEDIN_USER_SECRET = '12345678-90ab-cdef-ghij-klopqrstuwxy';
	});

	describe('#people()', function(){
		it('should response a person which has specified id', function (done) {
			var client = new LinkedInClient({
				consumer_key: process.env.LINKEDIN_CONSUMER_KEY,
				consumer_secret: process.env.LINKEDIN_CONSUMER_SECRET,
				user_token: process.env.LINKEDIN_USER_TOKEN,
				user_secret: process.env.LINKEDIN_USER_SECRET
			});

			client.people( { id: 'm6TTOZq568'}, function (err, data, res) {
				data.should.have.property('firstName', 'Diego');
				data.should.have.property('lastName', 'S.');
				data.should.have.property('id', 'm6TTOZq568');
				done();
			});

		});
	});
});



