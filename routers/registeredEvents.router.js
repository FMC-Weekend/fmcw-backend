const router = require('express').Router();
const {addRegisteredEvents,clearRegisteredEvents,getRegisteredEvents,verifyUserPurchase}=require('../controllers/registeredEvents.controller');
router.route('/events').post(getRegisteredEvents).delete(clearRegisteredEvents);
router.route('/events/add').post(addRegisteredEvents);
router.route('/events/verify').post(verifyUserPurchase);
module.exports = router;