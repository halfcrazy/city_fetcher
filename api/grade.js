var _ = require('lodash');
var request = require('superagent');
var fetchGrade = require('../common/fetch_grade').fetchGrade;
var GradeProxy = require('../proxy').Grade;
var UserProxy = require('../proxy').User;
var config = require('../config');


var fetch = function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var term = parseInt(req.body.term);
  if (!term) {
    term = config.current_term;
  }
  // first query from db to save time.
  GradeProxy.getGradeByUsername(username, term, function(err, grade){
    // user does not exist or other errors
    if(err){
      switch(err.message){
        case 'The schedule does not exist.':break;
        default: next(err);
      }
    }
    if(grade){
      UserProxy.getUserByUsername(username, function(err, user){
        res.json(_.extend({
          'status': 'ok'
        }, {
          'name': user.name
        }, {
          'grade': JSON.parse(grade.grade)
        }, {
          'term': term
        }));
      });
    } else {
      // does not exist in db, fetch from network
      fetchGrade(username, password, term, function(err, name, grade1){
        if(err){
          switch(err.message){
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
          grade1 = JSON.parse(grade1);
          res.json(_.extend({
            'status': 'ok'
          }, {
            'name': name
          }, {
            'grade': grade1
          }, {
            'term': term
          }));
        }
      });
    }
  });
};

exports.fetch = fetch;
