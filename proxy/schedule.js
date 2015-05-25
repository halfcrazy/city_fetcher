var models = require('../models');
var Schedule = models.Schedule;
var User = require('./user');


exports.getScheduleByUsername = function (username, term, callback) {
  Schedule.findOne({username: username}, function(err, schedule){
    if (err) {
      return callback(err);
    }
    if (!schedule) {
      return callback(new Error('The schedule does not exist.'));
    }
    schedule.schedules.findOne({term: term}, callback);
  });
};

exports.UpdateScheduleByUsername = function(username, schedule, term, callback){
  Schedule.findOne({username: username}, function(err, schedule){
    if (err) {
      return callback(err);
    }
    if (!schedule) {
      return callback(new Error('The schedule does not exist.'));
    }
    schedule.schedules.findOne({term: term}, function(err1, schedule1){
      if (err1) {
        return callback(err1);
      }
      if (!schedule1) {
        schedule.schedules.push({schedule:schedule, term: term});
        schedule.save(callback);
      } else {
        return callback();
      }
    });
  });
};

exports.newAndSave = function (user, callback) {
  var schedule = new Schedule();
  schedule.user = user._id;
  schedule.save(callback);
};