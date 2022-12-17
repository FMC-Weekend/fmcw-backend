const mongoose = require('mongoose');
const adminUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});
const adminUserModel = mongoose.model('Admins', adminUserSchema); //Admins :collection name
module.exports = adminUserModel;