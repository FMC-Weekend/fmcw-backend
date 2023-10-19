const randomstring = require("randomstring");
const { OAuth2Client } = require("google-auth-library");
const CryptoJS = require('crypto-js');
const userModel = require('../models/User_m');
const instiModel = require('../models/ins_m');
const slckInteraction = require("../controllers/slack.controller.js")
const CartModel = require("../models/cart_m");
const registeredEventsModel = require("../models/registered_events_m");
const {contactUs} = require("../controllers/notification.controller")
var sess;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

exports.loginFunc = (req, res) => {
  try {
    const ip=req.ip;

    console.log('in login');
    let token = req.body.token;
    var user = {};
    async function verify() {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      }).catch((err) => {
        console.log(err);
        return res.json({ message: 'invalid token' })
      });
      const payload = ticket.getPayload();
      slckInteraction.slackInteraction("#login-info", `New user logged in with email ` + payload.email);
      user.email = payload.email;
      user.name = payload.name;
      // contactUs(ip,user.email,user.name)
      user.newUser = false;
      user.role = -1;
      await userModel.findOne({
        email: payload.email
      }).then(async function (foundItem) {
        if (!foundItem) {
          user.newUser = true;
          await userModel.create(user)
            .then(async function (newUser) {
              user.userID = newUser._id;
              const newCart = await CartModel.create({
                forUser: newUser._id,
                cartItems: []
              });
              const newRegisteredEvents = await registeredEventsModel.create({
                forUser: newUser._id,
                registeredEvents: []
              });
              newUser.userCart = newCart._id;
              newUser.userRegisteredEvents = newRegisteredEvents._id;
              await newUser.save();
              console.log('Added new user');
            }).catch(function (error) {
              console.log(error);
            });
        }
        else if (!foundItem.number) {
          user.newUser = true;
          user.role = foundItem.role;
        }
        else user.role = foundItem.role;
      })
    }

    if (token) {
      verify()
        .then(async () => {
          var emcheck = user.email.substr(user.email.length - 11);
          if (emcheck === "itbhu.ac.in") {
            var inst = {};
            inst.userID = user.userID;
            instiModel.create(inst).then((result) => {
              userModel.updateOne({ email: user.email }, {
                role: 0
              })
                .then((result) => {
                  const encryptedHash = CryptoJS.AES.encrypt(user.email, process.env.CRYPTO_SECRET_MESSAGE).toString();
                  return res.json({
                    "message": "insti",
                    encryptedHash,
                    userType: 0,
                    user
                  });
                }).catch((error) => {
                  console.log(error);
                });
            }).catch((error) => {
              console.log(error);
            });
          }
          if (user.role === 0) {
            const encryptedHash = CryptoJS.AES.encrypt(user.email, process.env.CRYPTO_SECRET_MESSAGE).toString();
            return res.json({
              "message": "insti",
              userType: 0,
              encryptedHash,
              user
            })
          }
          else if (user.role === 2) return res.json({
            "message": "ca",
            userType: 2,
            user
          });
          else if (user.role === 1) {
            return res.json({
              userType: 1,
              user
            })
          }
          else return res.json({
            "message": "New user log in",
            user
          })
        })
        .catch(console.error);
    }
    else {
      return res.json({
        "message": "token required"
      })
    }
  }
  catch (error) {
    res.json({
      status: 'Fail',
      error
    })
  }
}

exports.logoutFunc = (req, res) => {
  return res.json({ "message": "logged out" });
}

exports.verifyToken = (req, res) => {
  try {

    const token = req.body.token;

    async function verify(access_token) {
      const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
      const client = new OAuth2Client(CLIENT_ID);
      const ticket = await client
        .verifyIdToken({
          idToken: access_token,
          audience: CLIENT_ID,
        })
        .catch((err) => {
          return res.json({ message: "invalid token" });
        });
      // console.log({ticket})
      if (!ticket) {
        return res.json({ message: "invalid token" });
      }

      let user = {};
      const payload = ticket.getPayload();
      isNewUser = true;

      await userModel
        .findOne({
          email: payload.email,
        })
        .then(async function (foundItem) {
          if (foundItem) {
            user = foundItem;
            if (foundItem.number) isNewUser = false;
          }
          else {
            return res.json({
              message: "user not found, please sign in again",
            });
          }

          return res.json({
            message: "success",
            user,
            isNewUser
          });
        })
        .catch((err) => {
          return res.json({ message: "server side error" });
        });

    };

    if (token) {
      verify(token)
    }
    else {
      return res.json({
        message: "token required",
      });
    }
  }
  catch (error) {
    res.json({
      status: 'Fail',
      error
    })
  }
}