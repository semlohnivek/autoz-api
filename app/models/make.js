var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MakeSchema   = new Schema({
  shortName: String,
  displayName: String,
  slogan: String,
  logoUrl: String,    
  models: [String]    
});

module.exports = mongoose.model('Make', MakeSchema);