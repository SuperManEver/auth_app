/* ------------------------------------------------------------------------------
* routes.js
*
* defines routes for application
*
* Nick Luparev nikita.luparev@gmail.com
------------------------------------------------------------------------------- */
'use strict';

var User          = require('./models/user.js');
var run           = require('./utils/utils.js').run;
var findOneById   = require('./utils/utils.js').findOneById

//------------------------ BEGIN MIDDLEWARE  ---------------------
function isLoggedIn(req, res, next) {
  if ( req.isAuthenticated() ) return next();

  req.flash('infoMessage', 'Login please.');
  res.redirect('/');
}

function alreadyLoggedIn(req, res, next) {
  if (req.session.user)  res.redirect('/')
  else return next();
}
//------------------------ END MIDDLEWARE  ---------------------

module.exports = function(app, passport) {

  app.get('/', (req, res) => {
    res.render('index', { 
      message : req.flash('infoMessage'),
      user    : req.user
     });
  });

  //------------------------ BEGIN SUBMIT SECTION ---------------------
  app.get('/submit', isLoggedIn, (req, res) => {
    res.render('submit', { user : req.user });
  });

  app.post('/submit', (req, res) => {

  });
  //------------------------ END SUBMIT SECTION ---------------------

  //------------------------ BEGIN LOGIN SECTION  ---------------------
  
  app.get('/login', alreadyLoggedIn, (req, res) => {
    res.render('login');
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/',        // redirect to the secure profile section
    failureRedirect : '/login',  // redirect back to the signup page if there is an error
    failureFlash    : true        // allow flash messages
  }));

  //------------------------ END LOGIN SECTION  ---------------------

  //------------------------ BEGIN SIGNUP SECTION ---------------------
  app.get('/signup', (req, res) => {
    res.render('signup', { message : req.flash('signupMessage') });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/',        // redirect to the secure profile section
    failureRedirect : '/signup',  // redirect back to the signup page if there is an error
    failureFlash    : true        // allow flash messages
  }));

  //------------------------ END SIGNUP SECTION ---------------------

  //------------------------ BEGIN PROFILE SECTION ---------------------
  function determineCurrentUser (req, res, next) {  
    run(function* () {
      var userId  = req.params.id;
      // console.log(userId);

      var user    = yield findOneById(userId);

      // console.log(user);

      if (!user) {
        res.sendStatus(404);
        return;
      }

      req.session.currentUser = user;
      next();
    });
  }

  app.get('/profile/:id', isLoggedIn, determineCurrentUser, (req, res) => { 
    res.render('profile', { user : req.session.currentUser });
  });
  //------------------------ END PROFILE SECTION ---------------------

  //------------------------ BEGIN LOGOUT SECTION ---------------------

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  //------------------------ END LOGOUT SECTION ---------------------

};