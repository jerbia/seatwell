var express = require('express');
var app = express();
var debug = require('debug')('smart_ventil');

var server  = require('http').Server(app);
var io      = require('socket.io')(server);

//var router = express.Router();
var results = [];
var currentlySitting = false;
var sittingTime = 0;
var totalAgitation = 0;

var path = require('path');
var cors = require('cors');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var routes = require('./routes/index');

var bodyParser = require('body-parser')

// parse application/json
app.use(bodyParser.json())

var mySocket;

// cors
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

//  app.use('/', routes);

io.on('connection', function(socket){
//  socket.emit('an event', {some: 'data'});

    mySocket = socket;
    console.log("socket created");
   // when the client emits 'new message', this listens and executes
    socket.on('new message', function (data) {
        // we tell the client to execute 'new message'
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        });
    });


    socket.on("disconnect", function () {
        mySocket = undefined;
    })
});



//// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//    var err = new Error('Not Found');
//    err.status = 404;
//    next(err);
//});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//var router = express.Router();
var results = [];
var currentlySitting = false;
var sittingTime = 0;
var totalAgitation = 0;


/* GET home page. */
app.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

/* GET all entries */
app.get('/isSitting', function(req, res) {
    res.render('isSitting', { sittingTime: sittingTime, isSitting: currentlySitting, agitation:totalAgitation });
});

/* GET all entries */
app.get('/sittings', function(req, res) {
    res.render('sittings', { results: results });
});

/* GET all entries */
app.get('/reset', function(req, res) {
    currentlySitting = false;
    sittingTime = 0;
    totalAgitation = 0;
    res.render('isSitting', { sittingTime: sittingTime, isSitting: currentlySitting });
});

/* add an entry */
app.post('/sit', function(req, res) {
    var pressure  = req.body.pressure;
    var time      = new Date();
    var isSitting = req.body.isSitting;
    var agitation = req.body.agitation;

    //results.push(entry);
    if (isSitting == "False") {
        totalAgitation   = 0;
        if (currentlySitting == true) {
            currentlySitting = false;
            if (mySocket != undefined) {
                mySocket.emit('pause', {"isSitting":isSitting});
            }
        }
    }
    else {
        totalAgitation = agitation;
        sittingTime++;
        if (currentlySitting == false) {
            currentlySitting = true;
            if (mySocket != undefined) {
                mySocket.emit('start', {"sittingTime":sittingTime, "isSitting":isSitting});
            }
        }
    }

    var entry = {"pressure":pressure, "sittingTime":sittingTime, "isSitting":isSitting, "agitation":agitation };

    res.render('addSit', { entry: entry });

});


/* GET all entries */
app.post('/git', function(req, res) {
    var sys = require('sys')
    var exec = require('child_process').exec;
    function puts(error, stdout, stderr) {
        console.log(stdout);
    }
    exec("/home/ubuntu/pull.sh", puts);
    res.render('index', { title: 'Thanks' });
});


app.set('port', 3000);

server.listen(3000, function() {
    debug('Express server listening on port ' + server.address().port);
});

//var io = require('socket.io').listen(server);

module.exports = app;
