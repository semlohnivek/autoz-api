var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MediaSchema   = new Schema({
  _id: String,
  type: String,
  name: String    
});

module.exports = mongoose.model('Media', MediaSchema);