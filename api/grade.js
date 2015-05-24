var extend = require('extend');
var request = require('superagent');
var fetchGrade = require('../common/fetch_grade').fetchGrade;
var config = require('../config');


var fetch = function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var term = req.body.term;
  if (!term) {
    term = config.current_term;
  }
  fetchGrade(username, password, term, function(err, grade){
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
        'grade': grade
      }, {
        'term': term
      }));
    }
  });
};

exports.fetch = fetch;
