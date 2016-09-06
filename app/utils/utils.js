/* ------------------------------------------------------------------------------
* utils.js
*
* contains utility functions for application
*
* Nick Luparev nikita.luparev@gmail.com
------------------------------------------------------------------------------- */
var fs    = require('fs');
var User  = require('../models/user.js');
var Item  = require('../models/item.js');

var utils = {};

utils.readFile = function (filepath) {
  return function(callback) {  // fn( next(err, data) )
    fs.readFile(filepath, 'utf-8', callback);
  }
};

utils.findById = function (id) {
  return function(cb) {
    User.findById(id, cb);
  };
};

utils.findOne = function(email) {
  return function(cb) {
    User.findOne({ email : email }, cb);
  };
};

utils.findOneById = function(id) {
  return function(cb) {
    User.findById(id, cb);
  };
};

utils.retrieveAllStories = function() {
  return function(cb) {
    Item.find({}, cb)
  }
};

utils.run = function (genFun) {
  var gen = genFun(); // create generator object

  // define iterator function
  // this is what be passed as 'callback' function
  function next (err, data) {
    var currentGenState;

    if (err)  return gen.throw(err);
    else      currentGenState = gen.next(data);  // ????

    if (!currentGenState.done) currentGenState.value(next); // -> (cb) => { fs.readFile(path, 'utf-8', cb); }
  }

  next();
};

module.exports = utils;
