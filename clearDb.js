const mongoose = require("mongoose");


const DB = process.env.DATABASE;


const paModel = require("./models/pa_m");
const userModel = require("./models/User_m");
const instiModel = require("./models/ins_m");
const caModel = require("./models/ca_m");
const cartModel = require("./models/cart_m");

const deleteAllUsers = async () => {
	await userModel.remove(
		{},
		{
			justOne: false,
		}
	);
};

const deleteAllCa = async () => {
	await caModel.remove(
		{},
		{
			justOne: false,
		}
	);
};

const deleteAllPa = async () => {
	await paModel.remove(
		{},
		{
			justOne: false,
		}
	);
};
const deleteAllCarts = async () => {
	await cartModel.remove(
		{},
		{
			justOne: false,
		}
	);
};
const deleteAllInsti = async () => {
	await instiModel.remove(
		{},
		{
			justOne: false,
		}
	);
};
async function fun(){
	console.log('in fun');
	const x = await caModel.findById("61e096b62e433f40052c4744");
	console.log(x);	
}
mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Successfully connected to database");
		// fun();
				
		deleteAllUsers();
		deleteAllCa();
		deleteAllPa();
		deleteAllInsti();
		deleteAllCarts();
	})
	.catch((err) => {
		console.log("There was some error connecting to the database");
		console.log(err);
	});