var mongoose = require('mongoose');
// var path = require('path');
mongoose.connect('mongodb://localhost/shortly'); // connect to the database
var db = mongoose.connection; // set up the connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  var                                             
})





