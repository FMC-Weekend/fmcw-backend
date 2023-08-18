var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

var PASchema = new Schema({
	userID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
	},
	ref_code: {
		type: String,
	},
	norefcode: {
		type: Number,
		default: 0,
	},
	redeem: {
		type: String,
	},
	pass: {
		type: String,
	},
	add: {
		type: String,
	},
	paid: {
		type: String,
	},
	amount: {
		type: Number,
	},
	receipt: {
		type: String,
	},
	payment_id: {
		type: String,
	},
	payment_request_id: {
		type: String,
	},
});

PASchema.pre(/^find/, async function (next) {
	this.populate({
		path: "userID",
	});
	next();
});
const paModel = mongoose.model("pa", PASchema);
module.exports = paModel;