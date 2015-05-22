var extend = require('extend');
var request = require('superagent');
var agent = require('../common/simulate_login');
var tools = require('../common/tools');
var scheduleParser = require('../common/parse_schedule');


var fetch = function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  agent.login(username, password, function(_err, Cookies) {
    if (_err) {
      console.log(_err);
      res.json({
        'status': 'error'
      });
    } else {
      var _req = request.get('http://cityjw.dlut.edu.cn:7001/ACTIONQUERYSTUDENTSCHEDULEBYSELF.APPPROCESS');
      _req.set('Cookie', Cookies);
      _req.parse(tools.encodingparser).end(function(_err2, _res) {
        if (_err2) {
          return _err2;
        }
        var html = _res.text;
        html = html.replace(/<br/g, '|<br');
        var schedule = scheduleParser.parse(html);
        res.json(extend({
          'status': 'ok'
        }, {
          'schedule': schedule
        }));
      });
    }
  });
};

exports.fetch = fetch;
