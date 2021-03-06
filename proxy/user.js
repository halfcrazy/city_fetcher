var models = require('../models');
var User = models.User;


exports.getUserByUsername = function (username, callback) {
  User.findOne({'username': username}, callback);
};

exports.getUsersByName = function (name, callback) {
  User.find({'name': name}, callback);
};

exports.newAndSave = function (name, username, password, callback) {
  var user = new User();
  user.name = name;
  user.username = username;
  user.password = password;
  user.save(function(err){
    if(err){
      return callback(err);
    } else {
      return callback(null, user._id);
    }
  });
};