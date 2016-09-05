/* ------------------------------------------------------------------------------
* passport.js
*
* place where strategies for passport are defined
*
* Nick Luparev nikita.luparev@gmail.com
------------------------------------------------------------------------------- */

'use strict';

var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../models/user.js');

var run             = require('../utils/utils.js').run;
var findById        = require('../utils/utils.js').findById;
var findOne         = require('../utils/utils.js').findOne;

module.exports = function(passport) {

  //------------------------ BEGIN SESSION SETTINGS ---------------------
  // passport session setup
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // user to deserialize the user 
  passport.deserializeUser((id, done) => {
    run(function* () {
      var user = yield findById(id);
      done(null, user);
    });
  });
  //------------------------ END SESSION SETTINGS ---------------------

  //------------------------ BEGIN LOCAL LOGIN ---------------------
  passport.use('local-login', new LocalStrategy({

    usernameField   : 'email',
    passwordField   : 'password',
    passReqToCallback : true    // allows us to pass back the entire request to the callback

  }, (req, email, password, done) => { // callback with email and password from our form

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to loing already axists
    run(function* () {
      var user = yield findOne(email);
      if (!user) 
        return done(null, false, req.flash('loginMessage', 'No user found.'));

      if ( !user.isPasswordValid(password) )
        return done(null, false, req.flash('loginMessage', 'Wrong email or password.'));

      // all is well, return successful user
      return done(null, user);
    });
  }));

  //------------------------ END LOCAL LOGIN  ---------------------

  //------------------------ BEGIN LOCAL SIGNUP ---------------------
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'
  passport.use('local-signup', new LocalStrategy({

    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback

  }, function(req, email, password, done) {

    function signupUser () {
      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists

      run(function* () {
        var user = yield findOne(email);

        // check to see if there is already a user with that email
        if (user) 
          return done(null, false, req.flash('signupMessage', 'That email is already taken.')); 

        var newUser = new User();

        newUser.email     = email;
        newUser.password  = newUser.generateHash(password);

        newUser.save(function(err) {
          if (err) throw err;
          return done(null, newUser, req.flash('infoMessage', 'Welcome to application'));
        });

      });
    }

    process.nextTick(signupUser);
    
  }));
  //------------------------ END LOCAL SIGNUP  --------------------- 
  
};