var config = require('config');
var Client = require('./client');

var Events = require('events').EventEmitter;
var emitter = new Events();


module.exports = function(db, _options) { 
  var options = _options || { verbose: true, frequency: 1000 * 60 * 1 /* one hour */ }
  
  var _verbose = function() {
    return ( 'verbose' in options) ? options['verbose'] : false;
  };

  var _frequency = function() {
    return ( 'frequency' in options) ? options['frequency'] : 1000 * 60 * 1 /* on hour */ ;
  };

  var $populate = function( actor) {
    var c = new Client({
      google_key: config.get('linkedin.google_key'),
      searche_key: config.get('linkedin.searche_key') 
    });

    c.query( actor.fullName, function( queryResult ) {

      db.actors.update( 
        { fullName: actor.fullName },   // record to update 
        { $set:                         // actions
          { linkedInProfile: 
            queryResult.link 
          }
        },
        {},                             // options
        function (err, result) {
          if ( err ) {
            console.error( "Update operation failed when updating", actor.fullName,
              "actor or actress - ", __filename);
          }
        });

    });
  };

  /***
   * $retrieve a single actor without linkedInProfile
   *
   * @param cb: Callback whose param is actor else null object
   */
  var $retrieve = function(cb) {
    db.actors
      .find( {linkedInProfile: { $exists: false} }, {fullName:1 } )
      .limit(1, function (err, actors) {

        if (err) {
          console.error( "Error accessing actors collection - ", __filename);
          return;
        }

        if ( actors.length !== 0 ) {
          if ( _verbose() ) {
            console.log( "Retrieving information for", actors[0].fullName );
          }
          cb( actors[0] );
        }
        else {
          console.log( "Not actors or actress to populate...");
          cb( null );
        }

        return ;
    });
  }

  var $process = function() {
    // Start process
    $retrieve( function(actor) {
      if ( actor === null ) {                   // There is not actors to populate
        // var n = _frequency() / 60 / 1000 );
        var n = 10000;
        console.log( "Next task scheduled for next %s hour", n );
        setInterval( $process, n);
      } else {                                  // There are actors to populate
        $populate( actor );
        setInterval( $process, 0 );
      }

    });
  }

  var $run = function() {
    console.log(
        "Retrieving actors' information from " +
        "LinkedIn - frequency: %s mseg - verbose: %s ...",
        _frequency(), _verbose() );

    $process();

  }

  $run();


};


