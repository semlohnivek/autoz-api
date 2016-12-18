

module.exports = function(router) {

    var Car = require('../models/car'); 
    var Make = require('../models/make');
    
    var makeIds = {};
    
    Make.find(function(err, _makes){
        _makes.map(function(make){
           makeIds[make.displayName] = make._id;
        });
    });
    
    
    router.route('/cars')

        // get all the makes (accessed at GET http://localhost:8080/api/makes)
        .get(function(req, res) {
            Car.find({}, function(err, cars) {
                if (err)  res.send(err);

                res.json(cars);
            });
        })

        //Create a new Car entry
        .post(function(req, res){
        
            console.log(req.body);
        
            var car = new Car();
        
            //Pick a random 6 digit number for the stock ID
            car.stockId = Math.floor(Math.random() * (900000)) + 100000;
        
            //car.make = req.body.make.displayName;
            car._make = req.body.make._id;
            car.model = req.body.model;
            car.price = req.body.price;
            car.mileage = req.body.mileage;
            car.year = req.body.year;
            car.vin = req.body.vin;
            car.transmission = req.body.transmission ? req.body.transmission : "auto";

            console.log(car);

            //save the new make and check for errors
            car.save(function(err){
                if (err) res.send({ error: err });
                else {
                   res.json(car);
                }
            });
        })
    ;
    
    router.route('/cars/search')

        // get all the makes (accessed at GET http://localhost:8080/api/makes)kev
        .get(function(req, res) {
        
            console.log(req.query.params); 
        
            console.info("MAKES", makeIds['mercedes']);
        
            var searchObject = JSON.parse(req.query.params);
        
            if (searchObject.make) {
                searchObject._make = makeIds[searchObject.make];
                delete searchObject.make;
            }
        
            console.info("Search Object", searchObject);
        
            //Handle year logic
            if (searchObject.minYear || searchObject.maxYear) {
                
                searchObject.year = {};
                
                if (searchObject.minYear) searchObject.year.$gte = searchObject.minYear;
                if (searchObject.maxYear) searchObject.year.$lte = searchObject.maxYear;
                
                delete searchObject.minYear;
                delete searchObject.maxYear;
            }
        
            //handle price logic
            if (searchObject.minPrice || searchObject.maxPrice) {
                
                searchObject.price = {};
                
                if (searchObject.minPrice) searchObject.price.$gte = searchObject.minPrice;
                if (searchObject.maxPrice) searchObject.price.$lte = searchObject.maxPrice;
                
                delete searchObject.minPrice;
                delete searchObject.maxPrice;
            }
        
            //handle mileage logic
            if (searchObject.minMiles || searchObject.maxMiles) {
                
                searchObject.mileage = {};
                
                if (searchObject.minMiles) searchObject.mileage.$gte = searchObject.minMiles;
                if (searchObject.maxMiles) searchObject.mileage.$lte = searchObject.maxMiles;
                
                delete searchObject.minMiles;
                delete searchObject.maxMiles;
            }
        
            console.log(searchObject);
                
            Car.find(searchObject).populate('_make', 'displayName logoUrl -_id').exec(function(err, cars){

               if (err) res.send(err);

                res.json(cars);
            });
        })
    ;     

    router.route('/cars/:id')

        // get a car by its stock ID number
        .get(function(req, res) {
            Car.findOne({stockId: req.params.id}).populate('_make', '-_id').exec(function(err, car){
                //console.log(req.params);
                console.log(car);
               if (err) res.send(err);
                
                res.json(car);
            });
        })

        // update the make with this id (accessed at PUT http://localhost:8080/api/makes/:bear_id)
        .put(function(req, res) {

            // use our bear model to find the amke we want
            Car.findById(req.params.id, function(err, car) {

                if (err) res.send(err);

                if (req.body.make) car.make = req.body.make;  // update the car info
                if (req.body.model) car.model = req.body.model;
                if (req.body.year) car.year = req.body.year;

//                console.log(make);
//                console.log(req.body);

                // save the bear
                car.save(function(err) {
                    if (err) res.send(err);

                    res.json(car);
                });

            });
        })

        .delete(function(req, res){
            Car.remove({
                _id: req.params.id
            }, function(err, car) {
                if (err) res.send(err);

                res.json({ message: 'Successfully deleted' });
            });
        })
    ;    
    
}



