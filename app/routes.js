/* ------------------------------------------------------------------------------
* routes.js
*
* defines routes for application
*
* Nick Luparev nikita.luparev@gmail.com
------------------------------------------------------------------------------- */
'use strict';

var User                = require('./models/user.js');
var Item                = require('./models/item.js');
var run                 = require('./utils/utils.js').run;
var findOneById         = require('./utils/utils.js').findOneById
var retrieveAllStories  = require('./utils/utils.js').retrieveAllStories;

//------------------------ BEGIN MIDDLEWARE  ---------------------
var isLoggedIn              = require('./utils/middleware.js').isLoggedIn;
var alreadyLoggedIn         = require('./utils/middleware.js').alreadyLoggedIn;
var determineRequestedUser  = require('./utils/middleware.js').determineRequestedUser;
//------------------------ END MIDDLEWARE  ---------------------

module.exports = function(app, passport) {

  // middleware
  function specifyUser (req, res, next) {
    app.locals.user = req.user;
    next();
  }

  function retrieveStories (req, res, next) {
    run(function* () {
      var items = yield retrieveAllStories();
      app.locals.items = items;
      next();
    });
  }

  app.get('/', specifyUser, retrieveStories, (req, res) => {
    res.render('index', { 
      message : req.flash('infoMessage')
    });
  });

  //------------------------ BEGIN SUBMIT SECTION ---------------------
  app.get('/submit', isLoggedIn, specifyUser, (req, res) => {
    res.render('submit', { user : req.user });
  });

  app.post('/submit', isLoggedIn, specifyUser, (req, res) => {
    var item          = new Item();
    item.title        = req.body.title;
    item.url          = req.body.url;
    item.description  = req.body.description;

    item.save((err) => {
      if (err) throw err;
      res.redirect('/');
    });
  });
  //------------------------ END SUBMIT SECTION ---------------------

  //------------------------ BEGIN LOGIN SECTION  ---------------------
  app.get('/login', alreadyLoggedIn, (req, res) => {
    res.render('login');
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/',        // redirect to the secure profile section
    failureRedirect : '/login',   // redirect back to the signup page if there is an error
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
  app.get('/profile/:id', isLoggedIn, determineRequestedUser, (req, res) => { 
    res.render('profile', { user : req.session.currentUser });
  });
  //------------------------ END PROFILE SECTION ---------------------

  //------------------------ BEGIN SETTINGS SECTION ---------------------
  function isCurrentUser (req, res, next) {
    var requestedUser = req.session.currentUser;
    if (requestedUser.id !== req.user.id) {
      res.redirect('/');
      return;
    }

    next();
  }

  app.get('/settings/:id', isLoggedIn, determineRequestedUser, isCurrentUser, specifyUser, (req, res) => {
    res.render('settings');
  });

  app.post('/settings/:id', isLoggedIn, determineRequestedUser, isCurrentUser, (req, res) => {
    var newName   = req.body.name;
    var newEmail  = req.body.email;

    run(function* () {
      var user = yield findOneById(req.params.id);

      user.name   = newName;
      user.email  = newEmail;
      user.save((err) => {
        if (err) throw err;
        res.redirect('/profile/' + req.user.id);
      });
    });
  });
  //------------------------ END SETTINGS SECTION ---------------------

  //------------------------ BEGIN LOGOUT SECTION ---------------------

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.use(function (req, res) {
    res.sendStatus(404);
  });

  //------------------------ END LOGOUT SECTION ---------------------

};