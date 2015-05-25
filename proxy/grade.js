var models = require('../models');
var Grade = models.Grade;
var User = require('./user');


exports.getGradeByUsername = function (username, term, callback) {
  Grade.findOne({username: username}, function(err, grade){
    if (err) {
      return callback(err);
    }
    if (!grade) {
      return callback(new Error('The grade does not exist.'));
    }
    grade.grades.findOne({term: term}, callback);
  });
};

exports.UpdateGradeByUsername = function(username, grade, term, callback){
  Grade.findOne({username: username}, function(err, grade){
    if (err) {
      return callback(err);
    }
    if (!grade) {
      return callback(new Error('The grade does not exist.'));
    }
    grade.grades.findOne({term: term}, function(err1, grade1){
      if (err1) {
        return callback(err1);
      }
      if (!grade1) {
        grade.grades.push({grade:grade, term: term});
        grade.save(callback);
      } else {
        return callback();
      }
    });
  });
};

exports.newAndSave = function (user, callback) {
  var grade = new Grade();
  grade.user = user._id;
  grade.save(callback);
};