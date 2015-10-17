var mongoose = require('mongoose');
var crypto = require('crypto');

var linkSchema = mongoose.Schema({
  url: {type: String, required: true},
  base_url: {type: String, required: true},
  code: {type: String},
  title: {type: String},
  visits: {type: Number, default: 0}
});

linkSchema.pre('save', function(next){
  var link = this;
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  next(); // next should be to save it to database
});
var Link = mongoose.model('Link', linkSchema);
module.exports = Link;