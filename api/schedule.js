var _ = require('lodash');
var request = require('superagent');
var fetchSchedule = require('../common/fetch_schedule').fetchSchedule;
var ScheduleProxy = require('../proxy').Schedule;
var UserProxy = require('../proxy').User;
var config = require('../config');


var fetch = function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var term = req.body.term;
  if (!term) {
    term = config.current_term;
  }
  // first query from db to save time.
  ScheduleProxy.getScheduleByUsername(username, term, function(err, schedule){
    // user does not exist or other errors
    if(err){
      console.log(err);
      return;
    }
    if(schedule){
      UserProxy.getUserByUsername(username, function(user){
        res.json(_.extend({
          'status': 'ok'
        }, {
          'name': user.name
        }, {
          'schedule': schedule.schedule
        }, {
          'term': term
        }));
      });
    }
  });
  // does not exist in db, fetch from network
  fetchSchedule(username, password, term, function(err, name, schedule){
    if(err){
      switch(err){
        case 'login failed':
          res.json({
            'status': 'login failed'
          });
        break;
        case 'error':
          res.json({
            'status': 'login failed'
          });
        break;
      }
    } else {
      res.json(_.extend({
        'status': 'ok'
      }, {
        'name': name
      }, {
        'schedule': schedule
      }, {
        'term': term
      }));
    }
  });
};

exports.fetch = fetch;
