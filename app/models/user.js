/* ------------------------------------------------------------------------------
* users.js
*
* defines user model
*
* Nick Luparev nikita.luparev@gmail.com
------------------------------------------------------------------------------- */
var mongoose  = require('mongoose');
var bcrypt    = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  name      :  { type : String, default : '' },
  email     :  { type : String, required : true },
  password  :  { type : String, required : true }
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.isPasswordValid = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);