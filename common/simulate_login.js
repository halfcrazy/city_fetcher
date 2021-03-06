var request = require('superagent');
var cheerio = require('cheerio');
var tesseract = require('tesseract_native');
var EventProxy = require('eventproxy');
var UserProxy = require('../proxy').User;
var ScheduleProxy = require('../proxy').Schedule;
var GradeProxy = require('../proxy').Grade;
var tools = require('./tools');


function login(username, password, callback) {
  var loginUrl = 'http://cityjw.dlut.edu.cn:7001/ACTIONLOGON.APPPROCESS?mode=4';
  var validateImgUrl = 'http://cityjw.dlut.edu.cn:7001/ACTIONVALIDATERANDOMPICTURE.APPPROCESS';

  var Cookies;

  //initial session here
  request.get(loginUrl)
    .end(function(err, res) {
      if (err) {
        return callback(err);
      }
      Cookies = res.headers['set-cookie'].pop().split(';')[0];
      //request validation image
      var req = request.get(validateImgUrl);
      req.set('Cookie', Cookies);
      req.end(function(err1, res1) {
        if (err1) {
          return callback(err1);
        }
        var myOcr = new tesseract.OcrEio();
        myOcr.ocr(Buffer(res1.body), function(err2, result) {
          if (err2) {
            return callback(err2);
          } else {
            //simulate login
            var req2 = request.post(loginUrl).type('form');
            req2.set('Cookie', Cookies);
            var params = {
              'WebUserNO': username.toString(),
              'Password': password.toString(),
              'Agnomen': result.trim(),
              'submit.x': '0',
              'submit.y': '0'
            };
            req2.send(params)
              .parse(tools.encodingparser)
              .end(function(err3, res3) {
                if (err3) {
                  return callback(err3);
                }
                if (res3.text.indexOf('Logout') != -1) {
                  var $ = cheerio.load(res3.text);
                  var name = $('td[align=left]').text();
                  // if user not in mongodb then insert the user into db
                  UserProxy.getUserByUsername(username, function(err4, user){
                    if(err4){console.log(err4);}
                    if(!user){
                      UserProxy.newAndSave(name, username, password, function(err5, savedUser){
                        if(err5){
                          return callback(err5);
                        } else {
                          var ep = EventProxy.create('schedule', 'grade', function(err6, err7){
                            if(err6){
                              return callback(err6);
                            }
                            if(err7){
                              return callback(err7);
                            }
                          });
                          ScheduleProxy.newAndSave(savedUser, function(_err){
                            if(_err){
                              ep.emit('schedule', _err);
                            }
                          });
                          GradeProxy.newAndSave(savedUser, function(_err){
                            if(_err){
                              ep.emit('grade', _err);
                            }
                          });
                        }
                      });
                    }
                  });
                  return callback(null, name, Cookies);
                } else {
                  return callback(new Error('wrong'));
                }
              });
          }
        });
      });
    });
}


module.exports = {
  'login': login
};
