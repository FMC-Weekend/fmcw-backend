var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

var inSchema = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
});

inSchema.pre(/^find/, async function (next) {
	this.populate({
		path: "userID",
	});
	next();
});

const insModel = mongoose.model("ins", inSchema);
module.exports = insModel;