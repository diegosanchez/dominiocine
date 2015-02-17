var config = require('config');
var Client = require('./client');

var Events = require('events').EventEmitter;
var emitter = new Events();

function hour2msec(value) {
  return 1000 * 60 * 60 * value;
};

function msec2hour(value) {
  return value / 1000 / 60 / 60;
};

module.exports = function(db, _options) { 
  var options = _options || { verbose: true, frequency: hour2msec(1) }
  
  var _verbose = function() {
    return ( 'verbose' in options) ? options['verbose'] : false;
  };

  var _frequency = function() {
    return ( 'frequency' in options) ? options['frequency'] : hour2msec(1) ;
  };

  var _log = function() {
    if ( _verbose() ) {
      console.log.apply(this, arguments);
    }
  }

  /***
   * it populates actor's record with linkedin profile url
   *
   * @param actor:  Actor to be populated
   * @param done:   Callback invoked once either the record was populated or error 
   *                happened
   *
   */

  var $populate = function( actor, done) {
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
            done( err, null, null);
          };

          done( null, result, actor );
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

          if ( actors.length === 0 ) {
            _log( "Not actors or actress to populate...");
            cb( null );
            return;
          }


          _log( "Retrieving information for", actors[0].fullName );

          cb( actors[0] );

          return ;
    });
  }

  var $process = function() {

    // Start process
    $retrieve( function(actor) {
      if ( actor === null ) {                   // There is not actors to populate
        var interval = msec2hour( _frequency() );
        _log( "Next task scheduled for next %s", interval, 
          "hour" + ((interval > 1) ? "s" : "") );
        setTimeout( $process, _frequency() );
        return;
      } 

      $populate( actor, function( err, result, actor) {
        _log( 'Actor', actor.fullName, 'updated' );
        setTimeout( $process, 0);
      });
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


