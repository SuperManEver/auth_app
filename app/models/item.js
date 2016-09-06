/* ------------------------------------------------------------------------------
* item.js
*
* defines model for item
*
* Nick Luparev nikita.luparev@gmail.com
------------------------------------------------------------------------------- */

var mongoose = require('mongoose');

var itemSchema = mongoose.Schema({
  title : { type : String, required : true },
  url   : { type : String, required : true },
  description : { type : String, require : true }
});

module.exports = mongoose.model('Item', itemSchema);