var express = require('express');

var scheduleController = require('./api/schedule');
var gradeController = require('./api/grade');

var router = express.Router();

router.post('/schedule', scheduleController.fetch);
router.get('/schedule', scheduleController.show);

router.post('/grade', gradeController.fetch);


module.exports = router;
