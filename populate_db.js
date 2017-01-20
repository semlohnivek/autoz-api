var Car = require('./app/models/car'); 
var Make = require('./app/models/make');
var Media = require('./app/models/media');

var path = require('path'),
    os   = require('os'),
    fs   = require('fs');


var mongoose   = require('mongoose');   
mongoose.connect('mongodb://localhost/autoz');  


const NUM_CARS = 50;
var carCount = 0;

function photoInfo(stockId, make) {
    this.staticRoot = 'public';
    this.photosRoot = 'photos';        
    this.stockId = stockId;
    this.make = make;
    
    this.sourceDir = 'img/' + make;
    
    this.dirPath  = function() { return this.staticRoot + "/" + this.photosRoot + "/" + this.stockId; }
    this.fullPath = function(filename) { return this.staticRoot + "/" + this.photosRoot + "/" + this.stockId + "/" + filename; }
    this.urlPath  = function(filename) { return this.photosRoot + "/" + this.stockId + "/" + filename}

}

var years = [new Date().getFullYear()];  
for (var x = 0; x < 75; x++) {
  years.push(years[years.length - 1] - 1);
}  


(function() {
    Make.find(function(err, makes) {
        buildCars(makes);
    });      
})();


function buildCars(makes) {
    //console.log(makes);
    

        
    //Randomly select a make by geting a random integer based on the
    //length of the 'makes' array
    var makeIndex = Math.floor(Math.random() * (makes.length));
    var make = makes[makeIndex];
    console.info("MAKE", make);

    //Randomly select a model within the make   
    var modelIndex = Math.floor(Math.random() * (make.models.length));
    var model = make.models[modelIndex];  
    console.info("MODEL", model);    

    //Create a new blank Car object
    var car = new Car();

    car.stockId = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

    car._make = make._id;
    car.model = model;

    car.year = Math.floor(Math.random() * (years[0] - 2005 + 1)) + 2000;
    car.mileage = Math.floor(Math.random() * (250000 - 30000 + 1)) + 30000;
    car.price = Math.floor(Math.random() * (100000)) + 5000;
    car.vin = (Math.floor(Math.random() * (900000 - 200000 + 1)) + 200000) + "FKE234MQ32N";

    car.description = "This " + car.year + " " + make.displayName + " " + car.model + " is truly one of a kind.  With only " + car.mileage + " miles, there's still plenty of life left in this baby.  Was a non-smoking vehicle that was cared for meticulously throughout its life.  It has bucket seats, backup cam, A/C, heater, steering wheel, gas pedal, windshield, and much more.  Come take a look!";


    //Add photos
    
    var photos = new photoInfo(car.stockId, make.shortName);
    
    //Make a directory for this file (based on stock ID)
    //If an error is thrown indicating the Dir already exists
    //we ignore it, otherwise we throw an error
    try {
        fs.mkdirSync(photos.dirPath());
    }
    catch(err) {
        if (err.code.toLowerCase().indexOf('exist') < 0) { return err; }
    }  
    
    var sourcePhotos = fs.readdirSync(photos.sourceDir);
    
    console.info("SOURCE PHOTOS", sourcePhotos);
    
    //Create a random number which will represent the number
    //of photos to assign to this car's record
    var photoCount = Math.floor(Math.random() * (15)) + 5;

    for (var p = 0; p < photoCount; p++){
        
        var photoIndex = Math.floor(Math.random() * (sourcePhotos.length));
        
        var srcFileName = sourcePhotos.splice(photoIndex, 1)[0];
        
        var destFilename = p + car.stockId + ".jpg";
        
        fs.linkSync(photos.sourceDir + "/" + srcFileName, photos.fullPath(destFilename));
        
        car.photos.push(photos.urlPath(destFilename));
        
        console.info(p + " : ", srcFileName);        
    }    
    
    
    
    console.info("CAR PRE-SAVE", car);

    //save the new make and check for errors
    car.save(function(err){
        if (err) {
            console.info("ERROR SAVING CAR", err);
        }
        else {
            console.log("CAR SAVED");
            if (carCount === (NUM_CARS - 1)) {
               cleanUp();
            }
            else {
               carCount++;
               buildCars(makes);
            }
        }
    });          
        
}

function cleanUp() {
    console.log("CLOSING MONGOOSE CONNECTION");
    mongoose.disconnect();
}
    
//    
//    
//}


//Get all the makes and build an array of their Ids


/*



*/