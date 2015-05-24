var extend = require('extend');
var request = require('superagent');
var fetchSchedule = require('../common/fetch_schedule').fetchSchedule;
var config = require('../config');


var fetch = function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var term = req.body.term;
  if (!term) {
    term = config.current_term;
  }
  fetchSchedule(username, password, term, function(err, schedule){
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
      res.json(extend({
        'status': 'ok'
      }, {
        'schedule': schedule
      }, {
        'term': term
      }));
    }
  });
};

exports.fetch = fetch;
