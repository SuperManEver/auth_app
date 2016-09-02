/* ------------------------------------------------------------------------------
* routes.js
*
* defines routes for application
*
* Nick Luparev nikita.luparev@gmail.com
------------------------------------------------------------------------------- */

module.exports = function(app, passport) {

  app.get('/', (req, res) => {
    res.render('index');
  });

};