var extend = require('extend');
var request = require('superagent');
var agent = require('../common/simulate_login');
var tools = require('../common/tools');
var gradeParser = require('../common/parse_grade');
var config = require('../config');


var fetch = function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var term = req.body.term;
  if (!term) {
    term = config.current_term;
  }
  agent.login(username, password, function(_err, Cookies) {
    if (_err) {
      console.log(_err);
      res.json({
        'status': 'error'
      });
    } else {
      var _req = request.post('http://cityjw.dlut.edu.cn:7001/ACTIONQUERYSTUDENTSCORE.APPPROCESS')
        .type('form')
        .send({
          'YearTermNO': term
        });
      _req.set('Cookie', Cookies);
      _req.parse(tools.encodingparser).end(function(_err2, _res) {
        if (_err2) {
          console.log(_err2);
          res.json({
            'status': 'error'
          });
        }
        var html = _res.text;
        var grade = gradeParser.parse(html);
        res.json(extend({
          'status': 'ok'
        }, {
          'grade': grade
        }));
      });
    }
  });
};

exports.fetch = fetch;
