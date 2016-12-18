

module.exports = function(router) {

    var Make = require('../models/make');
    
    
    router.route('/makes')

        // get all the makes (accessed at GET http://localhost:8080/api/makes)
        .get(function(req, res) {
            Make.find(function(err, makes) {
                if (err)
                    res.send(err);

                res.json(makes);
            });
        })

        //Create a new Make entry
        .post(function(req, res){
            var make = new Make();
            make._id = req.body._id;
            make.displayName = req.body.displayName;
            make.slogan = req.body.slogan;
            make.models = req.body.models;

            console.log(make);

            //save the new make and check for errors
            make.save(function(err){
                if (err) { 
                    res.send(err);
                }
                else {
                   res.json({ message: 'Make created!' });
                }
            });
        })
    ;

    router.route('/makes/:id') 

        // get all the makes (accessed at GET http://localhost:8080/api/makes)
        .get(function(req, res) {
            Make.findById(req.params.id, function(err, make){
               if (err) res.send(err);

                res.json(make);
            });
        })

        // update the make with this id (accessed at PUT http://localhost:8080/api/makes/:bear_id)
        .put(function(req, res) {
        
            // use our bear model to find the amke we want
            Make.findById(req.params.id, function(err, make) {

                if (err) res.send(err);

                if (req.body.slogan) make.slogan = req.body.slogan;  // update the makes info
                if (req.body.displayName) make.displayName = req.body.displayName;
                if (req.body.models) make.models = req.body.models;

                console.log(make);
                console.log(req.body);

                // save the bear
                make.save(function(err) {
                    if (err) res.send(err);

                    res.json(make);
                });

            });
        })

        .delete(function(req, res){
            Make.remove({
                _id: req.params.id
            }, function(err, make) {
                if (err) res.send(err);

                res.json({ message: 'Successfully deleted' });
            });
        })
    ;    
    
}



