var mongoose = require('mongoose');
var PgSchema = mongoose.Schema({
	pgname: {
		type: String
	},
	loc1: {
		type: String
	},
	rent: {
		type: Number
	},
	max : {
		type: Number
	},
	wifi: {
		type: String
	},
	nearby: {
		type: String
	},
	furniture: {
		type: String
	},
	gender: {
		type: String
	},
	owner: {
		type: String
	},
	contact: {
		type: Number
	}
});

var Pg = module.exports = mongoose.model('Pg', PgSchema);

module.exports.addPG = function(newPG,callback){
	newPG.save(callback);
}

module.exports.returnPG = function(callback){
	Pg.find(callback);
}

module.exports.getPgByName = function(pgname,callback){
	var query = {pgname:pgname};
	Pg.findOne(query,callback);
}