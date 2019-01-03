var mongoose = require('mongoose');
var PgSchema = mongoose.Schema({
	name: {
		type: String
	},
	location: {
		type: String
	},
	max: {
		type: Number
	},
	bathroom: {
		type: Number
	},
	bedroom: {
		type: Number
	}
});

var Pg = module.exports = mongoose.model('Pg', PgSchema);
module.exports.printdata = function(req,res){
	Pg.find({})
	.then(function(doc){
		res.render('dashboard',{ items:doc});
	});
}
/*module.exports.getPgByLocation = function(location,callback){
	var query = { location : location};
	Pg.find(query,callback);
}*/