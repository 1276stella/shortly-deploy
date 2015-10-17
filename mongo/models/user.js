var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var userSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true}
});

userSchema.methods.hashPassword = function() {
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.get('password'), null, null).bind(this)
      .then(function(hash) {
        this.set('password', hash);
    });  
};

var User = mongoose.model('User', userSchema);
module.exports = User;