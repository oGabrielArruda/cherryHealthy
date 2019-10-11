const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: {
		type: String,
		required: true
	},

	email: {
		type: String,
		required: true
	},

	password: {
		type: String,
		required: true
	},

	cpf: {
		type: String,
		required: true;
	}

	telephone: {
		type: String,
		required: true;
	}

	weight: {
		type: String;
		required: true;
	}

	height: {
		type: String;
		required: true;
	}
	
	isAdmin: {
		type: Boolean,
		required: true,
		default: false
	}
});

mongoose.model('User', UserSchema);