var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var User = require('../mongo/models/user');
var Link = require('../mongo/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.remove({}).find().exec(function(err, links) {
    console.log('links', links);
    res.send(200, links); // see what links are
  })
};

exports.saveLink = function(req, res) {
  console.log('I am a saveLink post');
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }
  Link.findOne({url: uri}).exec(function(err, link){
    if(err) {
      console.log(err);
    }
    if(link) {
      res.send(200, link);
    } else{
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var newLink = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });

        newLink.save(function(err) {
          // Links.add(link);
          if(err) {
            console.log(err);
          }
          res.send(200);
        });
      });      
    }    
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username })
    .exec(function(err, user) {
      if (!user) {
        res.redirect('/login');
      } else { 
        user.comparePassword(password, function(err, match) {
          if(err) {
            console.log(err);
          }
          if (match) {
            util.createSession(req, res, user);
          } else {
            res.redirect('/login');
          }
        })
      }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username })
    .exec(function(err, user) {
      if (!user) {
        var newUser = new User({
          username: username,
          password: password
        });
        newUser.save(function(err) {
            util.createSession(req, res, newUser); // do we have access to newUser?
            // Users.add(newUser);
          });
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    })
};

exports.navToLink = function(req, res) {
  // Link.findOneAndUpdate({ code: req.params[0] }, { visits: link.visits + 1 }, function(err,link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     return res.redirect(link.url);
  //   }
  // });

  Link.findOne({ code: req.params[0] }).exec(function(err,link) {
    if (!link) {
      res.redirect('/');
    } else {
      link.visits = link.visits + 1;
      link.save(function(err) {
        return res.redirect(link.url);
      });
    }
  });

};
