const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registeredEventsSchema = new Schema({
    forUser: String,
    registeredEvents: []
})

const registeredEventsModel = mongoose.model('registered_events', registeredEventsSchema);
module.exports = registeredEventsModel;