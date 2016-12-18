// BASE SETUP
// =============================================================================


// call the packages we need
var express    = require('express');        // call express
var multer     = require('multer');
var busboy     = require('connect-busboy');
var cors       = require('cors');
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/autoz');

app.use(cors());
app.options('*', cors());

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 9001;        // set our port

var routers = {
    api: express.Router(),
    upload: express.Router()
}

// ROUTES FOR OUR API
// =============================================================================
//var router = express.Router();              // get an instance of the express Router

routers.api.use(function(req, res, next) {
    // do logging
    console.log('API Request Received');
    next(); // make sure we go to the next routes and don't stop here
});

routers.upload.use(function(req, res, next) {
    // do logging
    console.log('Upload Request Received');
    //console.log(req);
    next(); // make sure we go to the next routes and don't stop here
}, busboy());

//routers.upload.use(multer({dest:'./uploads/'}).single('filefras'));

//Now we pass our router objects to their respective route module
//Each route module accepts a router as a prameter and builds
//the routes for the router that was passed in.
var routes = {
    make: require('./app/routes/make')(routers.api),
    car:  require('./app/routes/car')(routers.api),
    media:  require('./app/routes/media')(routers.upload)
}

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use(express.static('public'));
app.use('/api', routers.api);
app.use('/upload', routers.upload);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);