const mongoose = require('mongoose');
const sh = require('./../index.js');	

var schema = new (mongoose.Schema)({
	username:{
		type:"string"
	},
	password:{
		type:"string"
	},
	confirmpassword:{
		type:"string"
	}
});

module.exports = mongoose.model('savehashedTest',schema);