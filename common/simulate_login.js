var request = require('superagent');
var tesseract = require('tesseract_native');


function login(username, password, callback) {
  var loginUrl = 'http://cityjw.dlut.edu.cn:7001/ACTIONLOGON.APPPROCESS?mode=4'
  var validateImgUrl = 'http://cityjw.dlut.edu.cn:7001/ACTIONVALIDATERANDOMPICTURE.APPPROCESS'

  var Cookies;

  //initial session here
  request.get(loginUrl)
    .end(function(err, res) {
      if (err) {
        return err;
      }
      Cookies = res.headers['set-cookie'].pop().split(';')[0];
      //request validation image
      var req = request.get(validateImgUrl);
      req.set('Cookie', Cookies);
      req.end(function(err1, res1) {
        if (err1) {
          return err1;
        }
        var myOcr = new tesseract.OcrEio();
        myOcr.ocr(res1.body, function(err2, result) {
          if (err2) {
            return err2;
          } else {
            //simulate login
            var req2 = request.post(loginUrl).type('form');
            req2.set('Cookie', Cookies)
            var params = {
              'WebUserNO': username.toString(),
              'Password': password.toString(),
              'Agnomen': result.trim(),
              'submit.x': '0',
              'submit.y': '0'
            };
            req2.send(params)
              .end(function(err3, res3) {
                if (err3) {
                  return err3;
                }
                if (res3.text.indexOf('Logout') != -1) {
                  return callback(null, Cookies);
                } else {
                  return callback('wrong');
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
