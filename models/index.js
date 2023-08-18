var mongoose = require('mongoose');

var mongoDB = process.env.DATABASE;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log('Successfully connected to the database');
});
mongoose.Promise = global.Promise;
var mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'MongoDB connection error:'));

const db = {};

var model = require("./User_m");
db["user"] = model;
var model = require("./ca_m");
db["ca"] = model;
var model = require("./pa_m");
db["pa"] = model;
var model = require("./ins_m");
db["ins"] = model;
var model = require("./merch_m");
db["merch"] = model;
var model = require("./order_m");
db["order"] = model;

module.exports = db;
