/* ------------------------------------------------------------------------------
* middleware.js
*
* middleware handlers 
*
* Nick Luparev nikita.luparev@gmail.com
------------------------------------------------------------------------------- */

'use strict';

var run           = require('./utils').run;
var findOneById   = require('./utils').findOneById;

var middleware = {};

middleware.isLoggedIn = function (req, res, next) {
  if ( req.isAuthenticated() ) return next();

  req.flash('infoMessage', 'Login please.');
  res.redirect('/');
};

middleware.alreadyLoggedIn = function (req, res, next) {
  if (req.session.user)  res.redirect('/')
  else return next();
};

middleware.determineRequestedUser = function (req, res, next) {  
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
};

module.exports = middleware;


