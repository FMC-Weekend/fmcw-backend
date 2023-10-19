var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const cartModel = require('./cart_m');
const registeredEventsModel = require('./registered_events_m');

var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

var UserSchema = new Schema({
	email: {
		type: String,
		trim: true,
		unique: true,
		required: "Email address is required",
		validate: [validateEmail, "Please fill a valid email address"],
	},
	name: {
		type: String,
		required: true,
		maxLength: 100,
	},
	role: {
		type: Number,
		enum: {
			values: [-1, 0, 1, 2],
			message: "A user can have only 4 roles : -1 for unassigned user, 0 for institute student, 1 for other participants, 2 for campus ambassadors",
		},
	},
	number: {
		type: Number,
	},
	yearOfStudy: {
		type: Number,
	},
	instaHandle: {
		type: String,
	},
	college: {
		type: String,
	},
	userCart: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'cart'
	},
	userRegisteredEvents: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'registered_events'
	}
});

UserSchema.pre(/^find/, async function(next) {
	this.populate({
		path: 'userCart userRegisteredEvents'
	})
	next();
})

const userModel = mongoose.model("user", UserSchema);
module.exports = userModel;
