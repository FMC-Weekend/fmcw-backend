const router = require('express').Router();
const {addRegisteredEvents,clearRegisteredEvents,getRegisteredEvents}=require('../controllers/registeredEvents.controller');
router.route('/events').post(getRegisteredEvents).delete(clearRegisteredEvents);
router.route('/events/add').post(addRegisteredEvents);
module.exports = router;