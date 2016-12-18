var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CarSchema   = new Schema({
    stockId: Number,
    //make: String,
    _make: { type: Schema.Types.ObjectId, ref: 'Make' },
    model: String,
    price: Number,
    mileage: Number,
    year: Number,
    vin: String,
    transmission: String,
    description: String,
    photos: [String]
});

module.exports = mongoose.model('Car', CarSchema);