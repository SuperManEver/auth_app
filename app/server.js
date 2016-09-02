/* ------------------------------------------------------------------------------
* server.js
*
* main file that wires everything
*
* Nick Luparev nikita.luparev@gmail.com
------------------------------------------------------------------------------- */

var express       = require('express');
var app           = express();
var port          = process.env.PORT || 3000;
var mongoose      = require('mongoose');
var passport      = require('passport');
var flash         = require('connect-flash');

var morgan        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var session       = require('express-session');

var configDB      = require('./config/database.js');

//------------------------ BEGIN CONFIGURATION ---------------------
mongoose.connect(configDB.url);

require('./config/passport')(passport); // pass passport for configuration

// serving static assets
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/../node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/../node_modules/jquery/dist'));

// set up our express application
app.use(morgan('dev'));   // log every request to the console
app.use(cookieParser());  // read cookies (needed for auth)
app.use(bodyParser());    // get information from html forms

//------------------------ BEGIN VIEW SETTINGS ---------------------
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
//------------------------ END VIEW SETTINGS ---------------------

// required for passport 
app.use(session({ secret : "nikitabestdeveloperieverseen" }));
app.use(passport.initialize());
app.use(passport.session());    // persistent login sessions
app.use(flash());               // use connect-flash for flash messages stored in session
//------------------------ END CONFIGURATION ---------------------

//------------------------ BEGIN ROUTES  ---------------------

// load our routes and pass in our app and fully configured passport
require('./routes.js')(app, passport);

//------------------------ END ROUTES  ---------------------

//------------------------ BEGIN LAUNCH ---------------------
app.listen(port);
console.log('Server started on port: ' + port);
//------------------------ END LAUNCH ---------------------