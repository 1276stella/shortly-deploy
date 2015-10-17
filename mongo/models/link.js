var mongoose = require('mongoose');

var linkSchema = mongoose.Schema({
  url: {type: String, required: true},
  base_url: {type: String, required: true},
  code: type: String,
  title: type: String,
  visit: type: String
});

var Link = mongoose.model('Link', linkSchema);
module.exports = Link;