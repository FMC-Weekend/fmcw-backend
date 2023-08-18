const {OAuth2Client} = require("google-auth-library");

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

var queryString = require("query-string");
var axios = require("axios");
var exports = (module.exports = {});

exports.getGoogleUserInfo = async function (access_token) {
	if (!access_token) return null;

	const ticket = await client
		.verifyIdToken({
			idToken: access_token,
			audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
		})
		.catch((err) => {
			return null;
		});
    
	var message;
	if (!ticket) {
		return null;
	}
	const payload = ticket.getPayload();
	// console.log(payload); // { id, email, given_name, family_name }
	var email = payload.email;
	return email;
};
