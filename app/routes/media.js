

module.exports = function(router) {

    var Car = require('../models/car');
    
    var path = require('path'),
        os   = require('os'),
        fs   = require('fs');
    
    function photoFile(stockId, filename) {
        this.staticRoot = 'public';
        this.photosRoot = 'photos';        
        this.stockId = stockId;
        this.fileName = filename;
        
        this.dirPath  = function() { return this.staticRoot + "/" + this.photosRoot + "/" + this.stockId; }
        this.fullPath = function() { return this.staticRoot + "/" + this.photosRoot + "/" + this.stockId + "/" + this.fileName; }
        this.urlPath  = function() { return this.photosRoot + "/" + this.stockId + "/" + this.fileName}
        
    }
    
    var validMimeTypes = {
        "image/png": "png",
        "image/jpeg": "jpg"
    }

    router.route('/photos')

        // get all the makes (accessed at GET http://localhost:8080/api/makes)
//        .get(function(req, res) {
//            Car.find({}, function(err, cars) {
//                if (err)  res.send(err);
//
//                res.json(cars);
//            });
//        })

        //Create a new Car entry
        .post(function(req, res){
        
            var keys = {};
            var message = "File Uploaded";
        
            req.busboy.on('field', function(key, value, keyTruncated, valueTruncated) {
               keys[key] = value;
            });    
        
            req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
                
                //Check if the file type being uploaded is valid
                if (!validMimeTypes[mimetype]) {
                    message = "Invalid Mime Type";
                    return;
                }
                
                //Get the current date/time in miliseconds.  Used as part of the file name
                var timeInMs = new Date().getTime();
                
                var fname = timeInMs + "." + validMimeTypes[mimetype];
                
                var photo = new photoFile(keys['stockId'], fname);   
                
                console.info("PHOTO", photo);
                
                //Make a directory for this file (based on stock ID)
                //If an error is thrown indicating the Dir already exists
                //we ignore it, otherwise we throw an error
                try {
                    fs.mkdirSync(photo.dirPath());
                }
                catch(err) {
                    if (err.code.toLowerCase().indexOf('exist') < 0) { return err; }
                }
                
                //Save the file
                file.pipe(fs.createWriteStream(photo.fullPath()));
                
                //add the file to the list of files for the car
                console.info("STOCK ID: ", +keys['stockId']);
                Car.find({stockId: photo.stockId}, function(err, car){
                    car = car[0] || {};                    
                    console.info("CAR: ", car);
                    car.photos.push(photo.urlPath());
                    car.save();
                });
            });
        
            req.busboy.on('finish', function() {
              res.writeHead(200, { 'Connection': 'close' });
              res.end(message);
            });        
        
           req.pipe(req.busboy);

        })
    ;
    

    
}



