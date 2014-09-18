var express = require('express');
var router = express.Router();
var results = [];
var currentlySitting = false;
var sittingTime = 0;


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET all entries */
router.get('/isSitting', function(req, res) {
  res.render('isSitting', { sittingTime: sittingTime, isSitting: currentlySitting });
});

/* GET all entries */
router.get('/sittings', function(req, res) {
  res.render('sittings', { results: results });
});

/* add an entry */
router.post('/sit', function(req, res) {
  var pressure  = req.body.pressure;
  var time      = new Date();
  var isSitting = req.body.isSitting;
  var entry = {"pressure":pressure, "time":time, "isSitting":isSitting};
  results.push(entry);
  if (isSitting == "false") {
    currentlySitting = false;
  }
  else {
    currentlySitting = true;
  }
  sittingTime++;
  res.render('addSit', { entry: entry });
});


module.exports = router;
