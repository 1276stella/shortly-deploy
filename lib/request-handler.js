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
  console.log('links', links);
  Links.remove({}).find().exec(function(err, links) {
    res.send(200, links.models); // see what links are
  })
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }
  Link.find({url: uri}).exec(function(err, links){
    if(err) {
      console.log(err);
    }
    if(links.length === 0) {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var link = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });

        link.save(function(err) {
          // Links.add(newLink);
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

  User.find({ username: username })
    .exec(function(err, user) {
      console.log('user', user);
      console.log('this', this);
      if (!user.length) {
        res.redirect('/login');
      } else {
        // var newUser = new User({
        //   username: username,
        //   password: password
        // }); 
        user[0].comparePassword(password, function(err, match) {
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

  User.find({ username: username })
    .exec(function(err, user) {
      if (!user.length) {
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

  Link.find({ code: req.params[0] }).exec(function(err,link) {
    if (!link.length) {
      res.redirect('/');
    } else {
      link.visits = link.visits + 1;
      link.save(function(err) {
        return res.redirect(link.url);
      });
    }
  });

};
