var config = require('config');
var LinkedInClient = require('../../linkedin/index').linkedin.Client;


describe('Client', function(){
  var client = new LinkedInClient( {
    consumer_key: config.get('linkedin.consumer_key'),
    consumer_secret: config.get('linkedin.consumer_secret'),
    user_token: config.get('linkedin.user_token'),
    user_secret: config.get('linkedin.user_secret')
  });

	describe('#people()', function(){
		it('should response a person which has specified id', function (done) {
			client.people( { id: 'm6TTOZq568'}, function (err, data, res) {
				data.should.have.property('firstName', 'Diego');
				data.should.have.property('lastName', 'S.');
				data.should.have.property('id', 'm6TTOZq568');
				done();
			});
		});

		it('should response a person through his/her public profile', function (done) {
			client.people( { url: 'https://ar.linkedin.com/in/abogadaelianacaria'}, function (err, data, res) {
        data.should.have.property('firstName', 'Eliana');
        data.should.have.property('headline', 'Analista SSr. de Legales en Telecom Argentina');
        data.should.have.property('id', '6nAaMlzNin');
        data.should.have.property('lastName', 'Caria');
				done();
			});
		});
	});
});



