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

/* GET all entries */
router.get('/reset', function(req, res) {
  currentlySitting = false;
  sittingTime = 0;
  res.render('isSitting', { sittingTime: sittingTime, isSitting: currentlySitting });
});

/* add an entry */
router.post('/sit', function(req, res) {
  var pressure  = req.body.pressure;
  var time      = new Date();
  var isSitting = req.body.isSitting;
  var entry = {"pressure":pressure, "time":time, "isSitting":isSitting};
  //results.push(entry);
  if (isSitting == "False") {
    currentlySitting = false;
  }
  else {
    currentlySitting = true;
    sittingTime++;
  }
  res.render('addSit', { entry: entry });
});


/* GET all entries */
router.post('/git', function(req, res) {
  var sys = require('sys')
  var exec = require('child_process').exec;
  function puts(error, stdout, stderr) {
    console.log(stdout);
  }
  exec("/home/ubuntu/pull.sh", puts);
  res.render('index', { title: 'Thanks' });
});


module.exports = router;
