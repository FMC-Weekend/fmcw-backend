var randomstring = require("randomstring");

const CryptoJS = require("crypto-js");
const paModel = require("../models/pa_m");
const userModel = require("../models/User_m");
const instiModel = require("../models/ins_m");
const caModel = require("../models/ca_m");
const { request } = require("https");
const { getGoogleUserInfo } = require('../middleware/goath');
const mongoose = require("mongoose");

exports.getAllUsers = async (req, res) => {
	try {
		const data = await userModel.find({});
		return res.json({
			status: 200,
			data,
		});

	}
	catch(error) {
		res.json({
			status: 'Fail',
			error
		})
	}
};

exports.deleteAllUsers = async (req, res) => {
	try {
		await userModel.remove(
			{},
			{
				justOne: false,
			}
		);
		return res.json({
			status: 204,
			message: "All users deleted",
		});

	}
	catch(error) {
		res.json({
			status: 'Fail',
			error
		})
	}
};

exports.deleteAllCa = async (req, res) => {
	try {

		await caModel.remove(
			{},
			{
				justOne: false,
			}
		);
		return res.json({
			status: 204,
			message: "Campus ambassador records deleted",
		});
	}
	catch(error) {
		res.json({
			status: 'Fail',
			error
		})
	}
};

exports.deleteAllPa = async (req, res) => {
	try {

		await paModel.remove(
			{},
			{
				justOne: false,
			}
		);
		return res.json({
			status: 204,
			message: "PA records deleted",
		});
	}
	catch(error) {
		res.json({
			status: 'Fail',
			error
		})
	}
};

exports.getAllCa = async (req, res) => {
	try {
		const data = await caModel.find({});
		return res.json({
			status: 200,
			message: "Success",
			data,
		});

	}
	catch(error) {
		res.json({
			status: 'Fail',
			error
		})
	}
};

exports.getAllPa = async (req, res) => {
	try {
		const data = await paModel.find({});
		return res.json({
			status: 200,
			message: "Success",
			data,
		});

	}
	catch(error) {
		res.json({
			status: 'Fail',
			error
		})
	}
};

exports.getAllInsti = async (req, res) => {
	try {
		
		const data = await instiModel.find({});
		return res.json({
			status: 200,
			message: "Success",
			data,
		});
	}
	catch(error) {
		res.json({
			status: 'Fail',
			error
		})
	}
};

exports.updateUserDetails = async (req, res) => {
	try {
		let type = req.body.userType;
		let completeSuccess = false;
		const emailPostfix = req.body.email.substr(req.body.email.length - 11);
		if(emailPostfix === "itbhu.ac.in") type = 0;
		
		let updatedUser = await userModel.findOne({email: req.body.email});
		if (type == 0) {
			console.log('insti user')
			// const encryptedHash = CryptoJS.AES.encrypt(req.body.email, process.env.CRYPTO_SECRET_MESSAGE).toString();
			completeSuccess = true;
			// return res.json({
			// 	user: updatedUser,
			//     message: 'success',
			// 	encryptedHash,
			// });
		} else if (type == 1) {
			redeem = req.body.redeem;
			console.log({redeem});
			let isValid = 0;
			if (redeem && redeem.substring(0, 2) === "CA") {
				console.log("ca");
				const ca = await caModel.findOne({ref_code: redeem});
				console.log(ca);
				if (!ca) {
					return res.json({
						message: "Invalid referral code",
					});
				} else isValid = 1;
			} else if (redeem && redeem.substring(0, 2) === "PA") {
				console.log("pa");
				const pa = await paModel.findOne({ref_code: redeem});
				console.log(pa);
				if (!pa) {
					return res.json({
						message: "Invalid referral code",
					});
				} else isValid = 1;
			}
			else if(redeem){
				return res.json({
					message: "Invalid referral code",
				});
				
			}
			
			const ref_code =
				"PA" +
				randomstring.generate({
					length: 8,
					charset: "alphanumeric",
					readable: true,
					capitalization: "uppercase",
				});

			var newPA = {
				userID: updatedUser._id,
				ref_code,
			};

			if (isValid) newPA["redeem"] = redeem;
			paModel.create(newPA).then((result) => {
				completeSuccess = true;
			});
		} else if (type == 2) {
			const ref_code =
				"CA" +
				randomstring.generate({
					length: 8,
					charset: "alphanumeric",
					readable: true,
					capitalization: "uppercase",
				});
			var newCA = {
				userID: updatedUser._id,
				ref_code,
			};
			caModel.create(newCA).then((result) => {
				completeSuccess = true;
			});
		} else {
			return res.json({
				message: "Unable to detect you, please login again",
			});
		}

		updatedUser = await userModel.updateOne(
			{email: req.body.email},
			{
				college: req.body.college,
				yearOfStudy: req.body.year,
				instaHandle: req.body.instaHandle,
				number: parseInt(req.body.number),
				role: type,
			}
		);

		if(completeSuccess){
			return res.json({
				user: updatedUser,
				message: "success",
			});
		}
	}
	catch(error) {
		res.json({
			status: 'Fail',
			error
		})
	}
	
};

exports.getUserDetails = async (req, res) => {
	try {
		const token = req.get('token');

		const email = await getGoogleUserInfo(token);
	
		if(!email){
			return res.json({
				message: "user not found, please sign in again",
			});
		}
		
		let user = {};
		await userModel.findOne({ email: email })
		.then(async function (foundItem) {
			if (foundItem) {
				user = foundItem;
				if(user.role === 1){
					await paModel.findOne({
						userID: mongoose.Types.ObjectId(user._id),
					}).then(async (ref_found) =>{
						user = ref_found;
					})
				}
				else if(user.role === 2){
					await caModel
						.findOne({
							userID: mongoose.Types.ObjectId(user._id),
						})
						.then(async (ref_found) => {
							user = ref_found;
						});
				}

				res.json({
					message: "success",
					user,
				});
			} else {
				return res.json({
					message: "user not found, please sign in again",
				});
			}

		})
		.catch((err) => {
			console.log(err);
			return res.json({message: "server side error"});
		});
	}
	catch(error) {
		res.json({
			status: 'Fail',
			error
		})
	}

}