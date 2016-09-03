/* ------------------------------------------------------------------------------
* routes.js
*
* defines routes for application
*
* Nick Luparev nikita.luparev@gmail.com
------------------------------------------------------------------------------- */

//------------------------ BEGIN MIDDLEWARE  ---------------------
function isLoggedIn(req, res, next) {
  if ( req.isAuthenticated() ) return next();

  req.flash('loginMessage', 'Login please.');
  res.redirect('/');
}
//------------------------ END MIDDLEWARE  ---------------------

module.exports = function(app, passport) {

  app.get('/', (req, res) => {
    res.render('index', { message : req.flash('loginMessage') });
  });

  //------------------------ BEGIN SUBMIT SECTION ---------------------
  app.get('/submit', isLoggedIn, (req, res) => {
    res.render('submit');
  });

  app.post('/submit', (req, res) => {

  });
  //------------------------ END SUBMIT SECTION ---------------------

  //------------------------ BEGIN LOGIN SECTION  ---------------------
  
  app.get('/login', (req, res) => {
    res.render('login');
  });

  //------------------------ END LOGIN SECTION  ---------------------

  //------------------------ BEGIN SIGNUP SECTION ---------------------
  app.get('/signup', (req, res) => {
    res.render('signup');
  });

  //------------------------ END SIGNUP SECTION ---------------------


};